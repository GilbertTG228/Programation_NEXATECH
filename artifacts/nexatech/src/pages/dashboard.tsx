import { Link } from "wouter";
import { useGetMyStats, useGetLeaderboard } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Trophy, BookOpen, CheckCircle, Flame, ArrowRight, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/contexts/i18n-context";

const WEEK_COLORS = [
  "from-teal-500 to-cyan-500",
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-500",
  "from-orange-500 to-amber-500",
  "from-rose-500 to-pink-500",
];

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { data: stats, isLoading: statsLoading } = useGetMyStats();
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard();

  return (
    <div className="container px-4 md:px-8 py-8 mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("welcome")}, <span className="text-primary">{user?.prenom}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Continuez votre progression et atteignez vos objectifs !</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t("totalScore"), value: statsLoading ? null : stats?.totalScore ?? 0, icon: Trophy, color: "text-yellow-500" },
            { label: t("lessonsCompleted"), value: statsLoading ? null : stats?.lessonsCompleted ?? 0, icon: BookOpen, color: "text-blue-500" },
            { label: t("exercisesDone"), value: statsLoading ? null : stats?.exercisesCompleted ?? 0, icon: CheckCircle, color: "text-green-500" },
            { label: t("currentWeek"), value: statsLoading ? null : `S${stats?.currentWeek ?? 1}`, icon: Flame, color: "text-orange-500" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {stat.value === null ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Weekly Progress */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">{t("weeklyProgress")}</h2>
            <div className="space-y-3">
              {statsLoading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
              ) : (
                stats?.weeklyProgress?.map((week, i) => {
                  const pct = week.totalLessons > 0 ? Math.round((week.lessonsCompleted / week.totalLessons) * 100) : 0;
                  return (
                    <motion.div key={week.weekId} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <Link href={week.isUnlocked ? `/courses/week/${week.weekId}` : "#"}>
                        <Card className={`border-border/60 transition-all duration-200 ${week.isUnlocked ? "hover:border-primary/50 cursor-pointer" : "opacity-60 cursor-not-allowed"}`}>
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${WEEK_COLORS[i]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                              S{week.weekNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm truncate">{week.title}</span>
                                {!week.isUnlocked && <Lock className="h-3 w-3 text-muted-foreground shrink-0 ml-2" />}
                                {week.isUnlocked && <span className="text-xs text-muted-foreground">{pct}%</span>}
                              </div>
                              <Progress value={pct} className="h-1.5" />
                              <p className="text-xs text-muted-foreground mt-1">{week.lessonsCompleted}/{week.totalLessons} {t("lessons")}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t("recentLeaderboard")}</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/leaderboard">{t("leaderboard")} <ArrowRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </div>
            <Card className="border-border/60">
              <CardContent className="p-4 space-y-3">
                {lbLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)
                ) : (
                  leaderboard?.slice(0, 5).map((entry, i) => (
                    <div key={entry.userId} className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-5 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {entry.rank}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {((entry as any).prenom?.[0] ?? "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{(entry as any).prenom} {(entry as any).nom}</p>
                        <p className="text-xs text-muted-foreground">{entry.totalScore} pts</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="mt-4">
              <Button className="w-full" asChild>
                <Link href="/courses">
                  {t("continue")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
