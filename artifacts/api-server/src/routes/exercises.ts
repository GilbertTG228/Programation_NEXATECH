import { Router } from "express";
import { db } from "@workspace/db";
import {
  exercisesTable,
  exerciseSubmissionsTable,
  usersTable,
} from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Non connecté" });
    return;
  }
  next();
}

// GET /api/exercises
router.get("/exercises", async (req, res) => {
  const { lessonId, weekId, difficulty } = req.query as {
    lessonId?: string;
    weekId?: string;
    difficulty?: string;
  };

  let query = db.select().from(exercisesTable);
  const conditions = [];

  if (lessonId) conditions.push(eq(exercisesTable.lessonId, Number(lessonId)));
  if (weekId) conditions.push(eq(exercisesTable.weekId, Number(weekId)));
  if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
    conditions.push(eq(exercisesTable.difficulty, difficulty as "easy" | "medium" | "hard"));
  }

  const exercises = await (conditions.length > 0
    ? query.where(and(...conditions)).orderBy(asc(exercisesTable.order))
    : query.orderBy(asc(exercisesTable.order)));

  res.json(
    exercises.map((e) => ({
      id: e.id,
      lessonId: e.lessonId,
      weekId: e.weekId,
      order: e.order,
      question: e.question,
      type: e.type,
      difficulty: e.difficulty,
      points: e.points,
      options: e.options,
      hint: e.hint,
      explanation: e.explanation,
    })),
  );
});

// GET /api/exercises/:exerciseId
router.get("/exercises/:exerciseId", async (req, res) => {
  const exerciseId = Number(req.params.exerciseId);
  if (Number.isNaN(exerciseId)) {
    res.status(400).json({ error: "exerciseId invalide" });
    return;
  }

  const exercise = await db.query.exercisesTable.findFirst({
    where: eq(exercisesTable.id, exerciseId),
  });

  if (!exercise) {
    res.status(404).json({ error: "Exercice introuvable" });
    return;
  }

  res.json({
    id: exercise.id,
    lessonId: exercise.lessonId,
    weekId: exercise.weekId,
    order: exercise.order,
    question: exercise.question,
    type: exercise.type,
    difficulty: exercise.difficulty,
    points: exercise.points,
    options: exercise.options,
    hint: exercise.hint,
    explanation: exercise.explanation,
  });
});

// POST /api/exercises/:exerciseId/submit
router.post("/exercises/:exerciseId/submit", requireAuth, async (req, res) => {
  const exerciseId = Number(req.params.exerciseId);
  const userId = req.session.userId!;

  if (Number.isNaN(exerciseId)) {
    res.status(400).json({ error: "exerciseId invalide" });
    return;
  }

  const exercise = await db.query.exercisesTable.findFirst({
    where: eq(exercisesTable.id, exerciseId),
  });

  if (!exercise) {
    res.status(404).json({ error: "Exercice introuvable" });
    return;
  }

  const { answer } = req.body as { answer: string };
  const correct = answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
  const pointsEarned = correct ? exercise.points : 0;

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }

  await db.insert(exerciseSubmissionsTable).values({
    userId,
    exerciseId,
    answer: correct ? 1 : 0,
    correct,
    pointsEarned,
  });

  if (correct) {
    await db.update(usersTable)
      .set({ totalScore: (user.totalScore ?? 0) + pointsEarned, lastActivityAt: new Date() })
      .where(eq(usersTable.id, userId));
  }

  res.json({
    correct,
    pointsEarned,
    explanation: exercise.explanation ?? "Bonne réponse !",
    correctAnswer: exercise.correctAnswer,
  });
});

export default router;
