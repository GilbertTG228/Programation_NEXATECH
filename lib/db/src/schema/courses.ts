import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const weeksTable = pgTable("weeks", {
  id: serial("id").primaryKey(),
  weekNumber: integer("week_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  objectives: json("objectives").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  weekId: integer("week_id").notNull().references(() => weeksTable.id),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull().default(""),
  keyPoints: json("key_points").$type<string[]>().notNull().default([]),
  durationMinutes: integer("duration_minutes").notNull().default(15),
  type: text("type", { enum: ["video", "reading", "exercise", "quiz"] }).notNull().default("reading"),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  weekId: integer("week_id").notNull().references(() => weeksTable.id),
  order: integer("order").notNull(),
  question: text("question").notNull(),
  type: text("type", { enum: ["multiple_choice", "true_false", "fill_blank", "code_completion"] }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull().default("easy"),
  points: integer("points").notNull().default(10),
  options: json("options").$type<string[]>(),
  correctAnswer: text("correct_answer").notNull(),
  hint: text("hint"),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWeekSchema = createInsertSchema(weeksTable).omit({ id: true, createdAt: true });
export type InsertWeek = z.infer<typeof insertWeekSchema>;
export type Week = typeof weeksTable.$inferSelect;

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true, createdAt: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true, createdAt: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
