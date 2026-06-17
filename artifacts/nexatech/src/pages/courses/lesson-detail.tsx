import { Link, useParams, useLocation } from "wouter";
import { useGetLesson, useMarkLessonComplete, useSubmitExercise, useGetProgress, getGetProgressQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Clock, ChevronRight, Lightbulb, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

interface ExerciseWidgetProps {
  exercise: {
    id: number;
    question: string;
    type: string;
    difficulty: string;
    points: number;
    options?: string[] | null;
    hint?: string | null;
    explanation?: string | null;
  };
}

function ExerciseWidget({ exercise }: ExerciseWidgetProps) {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; pointsEarned: number; explanation: string; correctAnswer: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const queryClient = useQueryClient();
  const submitExercise = useSubmitExercise();

  const handleSubmit = () => {
    if (!selected) return;
    submitExercise.mutate(
      { exerciseId: exercise.id, data: { answer: selected } },
      {
        onSuccess: (data) => {
          setResult(data);
          setSubmitted(true);
          queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey() });
        },
      }
    );
  };

  const diffColor = exercise.difficulty === "easy" ? "text-green-500 border-green-500/30 bg-green-500/10"
    : exercise.difficulty === "medium" ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
    : "text-red-500 border-red-500/30 bg-red-500/10";
  const diffLabel = exercise.difficulty === "easy" ? "Facile" : exercise.difficulty === "medium" ? "Moyen" : "Difficile";

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={`text-xs ${diffColor}`}>{diffLabel}</Badge>
          <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/10">
            <Trophy className="h-3 w-3 mr-1" />{exercise.points} pts
          </Badge>
        </div>

        <p className="font-medium mb-4">{exercise.question}</p>

        {!submitted && (
          <>
            {exercise.type === "multiple_choice" && exercise.options && (
              <div className="space-y-2 mb-4">
                {exercise.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    data-testid={`option-${opt}`}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                      selected === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-border/80 hover:bg-muted/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {exercise.type === "true_false" && (
              <div className="flex gap-3 mb-4">
                {["Vrai", "Faux"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    data-testid={`option-${opt}`}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      selected === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {(exercise.type === "fill_blank" || exercise.type === "code_completion") && (
              <Input
                data-testid="exercise-answer-input"
                placeholder={exercise.type === "code_completion" ? "Écrivez votre code ici..." : "Votre réponse..."}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className={`mb-4 ${exercise.type === "code_completion" ? "font-mono" : ""}`}
              />
            )}

            {exercise.hint && (
              <div className="mb-4">
                <button onClick={() => setShowHint(!showHint)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  <Lightbulb className="h-3 w-3" />
                  {showHint ? "Masquer l'indice" : "Voir un indice"}
                </button>
                {showHint && (
                  <div className="mt-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-600 dark:text-yellow-400">
                    {exercise.hint}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!selected || submitExercise.isPending}
              data-testid="button-submit-exercise"
              className="w-full"
            >
              {submitExercise.isPending ? "Vérification..." : "Soumettre la réponse"}
            </Button>
          </>
        )}

        {submitted && result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`p-4 rounded-lg border ${result.correct ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.correct
                  ? <CheckCircle className="h-5 w-5 text-green-500" />
                  : <span className="h-5 w-5 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-xs font-bold">✕</span>
                }
                <span className={`font-semibold ${result.correct ? "text-green-500" : "text-red-500"}`}>
                  {result.correct ? `Correct ! +${result.pointsEarned} points` : "Incorrect"}
                </span>
              </div>
              {!result.correct && (
                <p className="text-sm mb-1"><span className="font-medium">Bonne réponse :</span> {result.correctAnswer}</p>
              )}
              {result.explanation && (
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LessonDetail() {
  const params = useParams<{ weekId: string; lessonId: string }>();
  const weekId = Number(params.weekId);
  const lessonId = Number(params.lessonId);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useGetLesson(lessonId, { query: { enabled: !!lessonId, queryKey: ["getLesson", lessonId] as any } });
  const { data: progress } = useGetProgress();
  const markComplete = useMarkLessonComplete();

  const isCompleted = progress?.some((p) => p.lessonId === lessonId && p.completed) ?? false;

  const handleMarkComplete = () => {
    markComplete.mutate(
      { lessonId, data: { completed: true, timeSpentMinutes: lesson?.durationMinutes ?? 5 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey() });
        },
      }
    );
  };

  return (
    <div className="container px-4 md:px-8 py-8 mx-auto max-w-4xl">
      <Link href={`/courses/week/${weekId}`}>
        <Button variant="ghost" size="sm" className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la semaine
        </Button>
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : lesson ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Leçon {lesson.order}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {lesson.durationMinutes} min
              </div>
              {isCompleted && (
                <Badge className="text-xs bg-green-500/20 text-green-500 border-green-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />Terminé
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>

          {/* Video */}
          {lesson.videoUrl && (
            <div className="mb-6 rounded-xl overflow-hidden border border-border/60">
              <video src={lesson.videoUrl} controls className="w-full" />
            </div>
          )}

          {/* Key Points */}
          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
            <Card className="border-border/60 mb-6 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Points clés</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          {lesson.content && (
            <div className="mb-8 prose prose-sm dark:prose-invert max-w-none">
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                    {lesson.content}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mark Complete */}
          {!isCompleted && (
            <div className="mb-8">
              <Button
                onClick={handleMarkComplete}
                disabled={markComplete.isPending}
                data-testid="button-mark-complete"
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {markComplete.isPending ? "Enregistrement..." : "Marquer comme terminé"}
              </Button>
            </div>
          )}

          {/* Exercises */}
          {lesson.exercises && lesson.exercises.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Exercices ({lesson.exercises.length})</h2>
              <div className="space-y-4">
                {lesson.exercises.map((exercise, i) => (
                  <motion.div key={exercise.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <ExerciseWidget exercise={exercise} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">Leçon introuvable</div>
      )}
    </div>
  );
}
