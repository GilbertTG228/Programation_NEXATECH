import { useGetMyStats, useGetProgress } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/contexts/i18n-context";
import { motion } from "framer-motion";
import { Trophy, BookOpen, CheckCircle, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

export default function Profile() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { data: stats, isLoading: statsLoading } = useGetMyStats();
  const { data: progress, isLoading: progressLoading } = useGetProgress();

  const totalTimeMin = progress?.reduce((acc, p) => acc + (p.timeSpentMinutes ?? 0), 0) ?? 0;

  return (
    <div className="container px-4 md:px-8 py-8 mx-auto max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Profile Header */}
        <Card className="border-border/60 mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/30 to-emerald-500/30" />
          <CardContent className="px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4 mb-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-2xl font-bold text-white border-4 border-background">
                {(user?.prenom?.[0] ?? "U").toUpperCase()}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold">
                  {user?.prenom} {user?.nom}
                </h1>
                <p className="text-muted-foreground text-sm">{user?.telephone}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {stats && stats.lessonsCompleted > 0 && (
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                  {stats.lessonsCompleted} {t("lessonsCompleted")}
                </Badge>
              )}
              {stats && stats.currentStreak > 0 && (
                <Badge variant="outline" className="text-orange-500 border-orange-500/30 bg-orange-500/10">
                  🔥 {stats.currentStreak} jours de suite
                </Badge>
              )}
              {user && (
                <Badge variant="outline" className="text-muted-foreground">
                  {t("memberSince")} {new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </Badge>
              )}
              {user && user.timeSpentSeconds > 0 && (
                <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/10">
                  <Clock className="h-3 w-3 mr-1" /> {formatTime(user.timeSpentSeconds)} sur la plateforme
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: t("totalScore"), value: statsLoading ? null : stats?.totalScore ?? 0, icon: Trophy, color: "text-yellow-500" },
            { label: t("lessonsCompleted"), value: statsLoading ? null : stats?.lessonsCompleted ?? 0, icon: BookOpen, color: "text-blue-500" },
            { label: t("exercisesDone"), value: statsLoading ? null : stats?.exercisesCompleted ?? 0, icon: CheckCircle, color: "text-green-500" },
            { label: t("timeSpent"), value: progressLoading ? null : `${totalTimeMin} min`, icon: Calendar, color: "text-purple-500" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                {stat.value === null ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Progress */}
        {!statsLoading && stats?.weeklyProgress && (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">{t("weeklyProgress")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.weeklyProgress.map((week) => {
                const pct = week.totalLessons > 0 ? Math.round((week.lessonsCompleted / week.totalLessons) * 100) : 0;
                return (
                  <div key={week.weekId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Semaine {week.weekNumber} — {week.title}</span>
                      <span className="text-sm text-muted-foreground">{week.lessonsCompleted}/{week.totalLessons}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
