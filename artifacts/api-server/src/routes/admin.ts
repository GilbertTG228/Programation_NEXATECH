import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, lessonProgressTable, exerciseSubmissionsTable } from "@workspace/db";
import { eq, count, desc, gt } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

const router = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.isAdmin) {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }
  next();
}

// GET /api/admin/learners
router.get("/learners", requireAdmin, async (req, res) => {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));

  const result = await Promise.all(
    users.map(async (user) => {
      const lessonsCompleted = await db
        .select({ count: count() })
        .from(lessonProgressTable)
        .where(eq(lessonProgressTable.userId, user.id));

      const exercisesCompleted = await db
        .select({ count: count() })
        .from(exerciseSubmissionsTable)
        .where(eq(exerciseSubmissionsTable.userId, user.id));

      const hours = Math.floor((user.timeSpentSeconds ?? 0) / 3600);
      const minutes = Math.floor(((user.timeSpentSeconds ?? 0) % 3600) / 60);

      return {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        totalScore: user.totalScore ?? 0,
        lessonsCompleted: Number(lessonsCompleted[0]?.count ?? 0),
        exercisesCompleted: Number(exercisesCompleted[0]?.count ?? 0),
        timeSpentFormatted: `${hours}h ${minutes}m`,
        timeSpentSeconds: user.timeSpentSeconds ?? 0,
        lastActivityAt: user.lastActivityAt?.toISOString() ?? null,
        inscritLe: user.createdAt.toISOString(),
      };
    }),
  );

  res.json(result);
});

// GET /api/admin/stats
router.get("/stats", requireAdmin, async (req, res) => {
  const totalUsers = await db.select({ count: count() }).from(usersTable);
  const totalLessonsCompleted = await db.select({ count: count() }).from(lessonProgressTable).where(eq(lessonProgressTable.completed, true));
  const totalExercises = await db.select({ count: count() }).from(exerciseSubmissionsTable);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeUsers = await db.select({ count: count() }).from(usersTable).where(gt(usersTable.lastActivityAt, sevenDaysAgo));

  res.json({
    totalUsers: Number(totalUsers[0]?.count ?? 0),
    totalLessonsCompleted: Number(totalLessonsCompleted[0]?.count ?? 0),
    totalExercisesSubmitted: Number(totalExercises[0]?.count ?? 0),
    activeUsersLast7Days: Number(activeUsers[0]?.count ?? 0),
  });
});

export default router;
