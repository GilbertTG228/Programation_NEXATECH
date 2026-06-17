import { Link, useParams } from "wouter";
import { useGetWeek, useGetProgress, getGetProgressQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Play, CheckCircle, Clock, FileText, Code2, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  video: Play,
  reading: FileText,
  exercise: Code2,
  quiz: HelpCircle,
};

const TYPE_LABELS: Record<string, string> = {
  video: "Vidéo",
  reading: "Lecture",
  exercise: "Exercice",
  quiz: "Quiz",
};

export default function WeekDetail() {
  const params = useParams<{ weekId: string }>();
  const weekId = Number(params.weekId);
  const { data: week, isLoading } = useGetWeek(weekId, { query: { enabled: !!weekId, queryKey: ["getWeek", weekId] as any } });
  const { data: progress } = useGetProgress();

  const isLessonCompleted = (lessonId: number) =>
    progress?.some((p) => p.lessonId === lessonId && p.completed) ?? false;

  return (
    <div className="container px-4 md:px-8 py-8 mx-auto max-w-4xl">
      <Link href="/courses">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Button>
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : week ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-8">
            <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">Semaine {week.weekNumber}</Badge>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{week.title}</h1>
            <p className="text-muted-foreground text-lg">{week.description}</p>
          </div>

          {/* Objectives */}
          {week.objectives && week.objectives.length > 0 && (
            <Card className="border-border/60 mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Objectifs de la semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {week.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Lessons */}
          <h2 className="text-xl font-semibold mb-4">Leçons ({week.lessons?.length ?? 0})</h2>
          <div className="space-y-3">
            {week.lessons?.map((lesson, i) => {
              const Icon = TYPE_ICONS[lesson.type] ?? FileText;
              const completed = isLessonCompleted(lesson.id);
              return (
                <motion.div key={lesson.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`/courses/week/${weekId}/lesson/${lesson.id}`}>
                    <Card className="border-border/60 hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${completed ? "bg-green-500/20" : "bg-primary/10"}`}>
                          {completed
                            ? <CheckCircle className="h-5 w-5 text-green-500" />
                            : <Icon className="h-5 w-5 text-primary" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Leçon {lesson.order}</span>
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{TYPE_LABELS[lesson.type] ?? lesson.type}</Badge>
                          </div>
                          <p className="font-medium group-hover:text-primary transition-colors truncate">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          {lesson.durationMinutes} min
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">Semaine introuvable</div>
      )}
    </div>
  );
}
