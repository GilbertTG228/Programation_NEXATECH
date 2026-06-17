import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  lessonProgressTable,
  lessonsTable,
  weeksTable,
  exerciseSubmissionsTable,
} from "@workspace/db";
import { eq, and, count, desc } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Non connecté" });
    return;
  }
  next();
}

// GET /api/progress
router.get("/progress", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const progress = await db
    .select()
    .from(lessonProgressTable)
    .where(eq(lessonProgressTable.userId, userId));

  res.json(
    progress.map((p) => ({
      lessonId: p.lessonId,
      userId: p.userId,
      completed: p.completed,
      score: p.score,
      completedAt: p.completedAt?.toISOString() ?? null,
      timeSpentMinutes: p.timeSpentMinutes,
    })),
  );
});

// GET /api/progress/week/:weekId
router.get("/progress/week/:weekId", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const weekId = Number(req.params.weekId);
  if (Number.isNaN(weekId)) {
    res.status(400).json({ error: "weekId invalide" });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.weekId, weekId));

  const lessonIds = lessons.map((l) => l.id);
  const progress = await db
    .select()
    .from(lessonProgressTable)
    .where(eq(lessonProgressTable.userId, userId));

  const weekProgress = progress.filter((p) => lessonIds.includes(p.lessonId));
  const completedCount = weekProgress.filter((p) => p.completed).length;
  const totalScore = weekProgress.reduce((sum, p) => sum + p.score, 0);
  const isCompleted = completedCount === lessons.length && lessons.length > 0;

  res.json({
    weekId,
    lessonsCompleted: completedCount,
    totalLessons: lessons.length,
    totalScore,
    isCompleted,
    lessonProgress: weekProgress.map((p) => ({
      lessonId: p.lessonId,
      userId: p.userId,
      completed: p.completed,
      score: p.score,
      completedAt: p.completedAt?.toISOString() ?? null,
      timeSpentMinutes: p.timeSpentMinutes,
    })),
  });
});

// PUT /api/progress/lesson/:lessonId
router.put("/progress/lesson/:lessonId", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const lessonId = Number(req.params.lessonId);
  if (Number.isNaN(lessonId)) {
    res.status(400).json({ error: "lessonId invalide" });
    return;
  }

  const { completed, timeSpentMinutes } = req.body as { completed: boolean; timeSpentMinutes?: number };

  const existing = await db.query.lessonProgressTable.findFirst({
    where: and(
      eq(lessonProgressTable.userId, userId),
      eq(lessonProgressTable.lessonId, lessonId),
    ),
  });

  let result;
  if (existing) {
    const [updated] = await db
      .update(lessonProgressTable)
      .set({
        completed,
        timeSpentMinutes: timeSpentMinutes ?? existing.timeSpentMinutes,
        completedAt: completed ? new Date() : existing.completedAt,
        updatedAt: new Date(),
      })
      .where(eq(lessonProgressTable.id, existing.id))
      .returning();
    result = updated;
  } else {
    const [created] = await db
      .insert(lessonProgressTable)
      .values({
        userId,
        lessonId,
        completed,
        score: 0,
        timeSpentMinutes: timeSpentMinutes ?? 0,
        completedAt: completed ? new Date() : null,
      })
      .returning();
    result = created;
  }

  res.json({
    lessonId: result.lessonId,
    userId: result.userId,
    completed: result.completed,
    score: result.score,
    completedAt: result.completedAt?.toISOString() ?? null,
    timeSpentMinutes: result.timeSpentMinutes,
  });
});

// GET /api/leaderboard
router.get("/leaderboard", async (req, res) => {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.totalScore))
    .limit(20);

  const leaderboard = await Promise.all(
    users.map(async (user, idx) => {
      const lessonsCompleted = await db
        .select({ count: count() })
        .from(lessonProgressTable)
        .where(and(eq(lessonProgressTable.userId, user.id), eq(lessonProgressTable.completed, true)));

      return {
        rank: idx + 1,
        userId: user.id,
        nom: user.nom,
        prenom: user.prenom,
        totalScore: user.totalScore ?? 0,
        lessonsCompleted: Number(lessonsCompleted[0]?.count ?? 0),
      };
    }),
  );

  res.json(leaderboard);
});

export default router;
