import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  lessonProgressTable,
  exerciseSubmissionsTable,
  weeksTable,
  lessonsTable,
} from "@workspace/db";
import { eq, and, count, sum, desc } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Non connecté" });
    return;
  }
  next();
}

// GET /api/users/me
router.get("/me", requireAuth, async (req, res) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, req.session.userId!),
  });
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }
  res.json({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    totalScore: user.totalScore,
    currentStreak: user.currentStreak,
    createdAt: user.createdAt.toISOString(),
  });
});

// GET /api/users/me/stats
router.get("/me/stats", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }

  const lessonsCompleted = await db
    .select({ count: count() })
    .from(lessonProgressTable)
    .where(and(eq(lessonProgressTable.userId, userId), eq(lessonProgressTable.completed, true)));

  const exercisesCompleted = await db
    .select({ count: count() })
    .from(exerciseSubmissionsTable)
    .where(and(eq(exerciseSubmissionsTable.userId, userId), eq(exerciseSubmissionsTable.correct, true)));

  const totalLessons = await db.select({ count: count() }).from(lessonsTable);

  const weeks = await db.select().from(weeksTable).orderBy(weeksTable.weekNumber);
  const weeklyProgress = await Promise.all(
    weeks.map(async (week) => {
      const weekLessons = await db
        .select()
        .from(lessonsTable)
        .where(eq(lessonsTable.weekId, week.id));

      const completedInWeek = weekLessons.length > 0
        ? await db
            .select({ count: count() })
            .from(lessonProgressTable)
            .where(
              and(
                eq(lessonProgressTable.userId, userId),
                eq(lessonProgressTable.completed, true),
              ),
            )
        : [{ count: 0 }];

      const completedCount = Number(lessonsCompleted[0]?.count ?? 0);
      const isUnlocked = week.weekNumber === 1 || completedCount > 0;
      return {
        weekId: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        lessonsCompleted: Number(completedInWeek[0]?.count ?? 0),
        totalLessons: weekLessons.length,
        isUnlocked,
      };
    }),
  );

  const completedCount = Number(lessonsCompleted[0]?.count ?? 0);
  const currentWeek = Math.min(Math.floor(completedCount / 4) + 1, 5);

  res.json({
    totalScore: user.totalScore ?? 0,
    lessonsCompleted: completedCount,
    exercisesCompleted: Number(exercisesCompleted[0]?.count ?? 0),
    currentWeek,
    currentStreak: user.currentStreak ?? 0,
    totalLessons: Number(totalLessons[0]?.count ?? 0),
    totalExercises: 32,
    weeklyProgress,
  });
});

export default router;
