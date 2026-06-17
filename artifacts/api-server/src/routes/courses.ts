import { Router } from "express";
import { db } from "@workspace/db";
import { weeksTable, lessonsTable, exercisesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

// GET /api/weeks
router.get("/weeks", async (req, res) => {
  const weeks = await db
    .select()
    .from(weeksTable)
    .orderBy(asc(weeksTable.weekNumber));

  const result = await Promise.all(
    weeks.map(async (week) => {
      const lessons = await db
        .select({ id: lessonsTable.id })
        .from(lessonsTable)
        .where(eq(lessonsTable.weekId, week.id));
      return {
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        objectives: week.objectives,
        totalLessons: lessons.length,
        imageUrl: week.imageUrl,
      };
    }),
  );

  res.json(result);
});

// GET /api/weeks/:weekId
router.get("/weeks/:weekId", async (req, res) => {
  const weekId = Number(req.params.weekId);
  if (Number.isNaN(weekId)) {
    res.status(400).json({ error: "Invalid weekId" });
    return;
  }

  const week = await db.query.weeksTable.findFirst({
    where: eq(weeksTable.id, weekId),
  });

  if (!week) {
    res.status(404).json({ error: "Week not found" });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.weekId, weekId))
    .orderBy(asc(lessonsTable.order));

  res.json({
    id: week.id,
    weekNumber: week.weekNumber,
    title: week.title,
    description: week.description,
    objectives: week.objectives,
    imageUrl: week.imageUrl,
    lessons: lessons.map((l) => ({
      id: l.id,
      weekId: l.weekId,
      order: l.order,
      title: l.title,
      description: l.description,
      durationMinutes: l.durationMinutes,
      type: l.type,
      videoUrl: l.videoUrl,
      imageUrl: l.imageUrl,
    })),
  });
});

// GET /api/lessons/:lessonId
router.get("/lessons/:lessonId", async (req, res) => {
  const lessonId = Number(req.params.lessonId);
  if (Number.isNaN(lessonId)) {
    res.status(400).json({ error: "Invalid lessonId" });
    return;
  }

  const lesson = await db.query.lessonsTable.findFirst({
    where: eq(lessonsTable.id, lessonId),
  });

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.lessonId, lessonId))
    .orderBy(asc(exercisesTable.order));

  res.json({
    id: lesson.id,
    weekId: lesson.weekId,
    order: lesson.order,
    title: lesson.title,
    description: lesson.description,
    durationMinutes: lesson.durationMinutes,
    type: lesson.type,
    videoUrl: lesson.videoUrl,
    imageUrl: lesson.imageUrl,
    content: lesson.content,
    keyPoints: lesson.keyPoints,
    exercises: exercises.map((e) => ({
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
  });
});

export default router;
