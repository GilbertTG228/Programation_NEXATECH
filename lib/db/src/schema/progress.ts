import { pgTable, serial, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { lessonsTable } from "./courses";
import { exercisesTable } from "./courses";

export const lessonProgressTable = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  completed: boolean("completed").notNull().default(false),
  score: integer("score").notNull().default(0),
  timeSpentMinutes: integer("time_spent_minutes").notNull().default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  unique().on(t.userId, t.lessonId),
]);

export const exerciseSubmissionsTable = pgTable("exercise_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercisesTable.id),
  answer: integer("answer").notNull().default(0),
  correct: boolean("correct").notNull().default(false),
  pointsEarned: integer("points_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgressTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgressTable.$inferSelect;

export const insertExerciseSubmissionSchema = createInsertSchema(exerciseSubmissionsTable).omit({ id: true, createdAt: true });
export type InsertExerciseSubmission = z.infer<typeof insertExerciseSubmissionSchema>;
export type ExerciseSubmission = typeof exerciseSubmissionsTable.$inferSelect;
