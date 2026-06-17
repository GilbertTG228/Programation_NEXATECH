import { Link } from "wouter";
import { useGetWeeks, useGetProgress } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Lock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/contexts/i18n-context";

const WEEK_GRADIENTS = [
  "from-teal-500 to-cyan-500",
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-500",
  "from-orange-500 to-amber-500",
  "from-rose-500 to-pink-500",
];

const WEEK_BG = [
  "bg-teal-500/10 border-teal-500/20",
  "bg-blue-500/10 border-blue-500/20",
  "bg-violet-500/10 border-violet-500/20",
  "bg-orange-500/10 border-orange-500/20",
  "bg-rose-500/10 border-rose-500/20",
];

export default function Courses() {
  const { t } = useI18n();
  const { data: weeks, isLoading } = useGetWeeks();
  const { data: progress } = useGetProgress();

  const getLessonProgress = (_weekId: number, totalLessons: number) => {
    if (!progress) return { completed: 0, pct: 0 };
    const completedCount = progress.filter(p => p.completed).length;
    return { completed: completedCount, pct: totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0 };
  };

  const isWeekUnlocked = (idx: number) => {
    if (idx === 0) return true;
    if (!progress) return false;
    const completedCount = progress.filter(p => p.completed).length;
    return completedCount >= idx * 2;
  };

  return (
    <div className="container px-4 md:px-8 py-8 mx-auto max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">{t("coursesTitle")}</h1>
          <p className="text-muted-foreground mt-2">5 semaines pour passer de zéro à développeur. Apprenez à votre rythme.</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
          ) : (
            weeks?.map((week, i) => {
              const unlocked = isWeekUnlocked(i);
              const { pct } = getLessonProgress(week.id, week.totalLessons);
              return (
                <motion.div key={week.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  {unlocked ? (
                    <Link href={`/courses/week/${week.id}`}>
                      <Card className={`border ${WEEK_BG[i]} hover:border-primary/40 transition-all duration-200 cursor-pointer group`}>
                        <CardContent className="p-5 flex items-center gap-5">
                          <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${WEEK_GRADIENTS[i]} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
                            S{week.weekNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">{week.title}</h2>
                              {pct === 100 && <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">{t("completed")}</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{week.description}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <Progress value={pct} className="h-1.5" />
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{week.totalLessons} {t("lessons")}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="border border-border/40 opacity-60 cursor-not-allowed">
                      <CardContent className="p-5 flex items-center gap-5">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${WEEK_GRADIENTS[i]} opacity-40 flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                          S{week.weekNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-semibold">{week.title}</h2>
                            <Badge variant="outline" className="text-xs"><Lock className="h-3 w-3 mr-1" />{t("locked")}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{week.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
