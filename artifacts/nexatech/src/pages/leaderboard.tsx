import { useGetLeaderboard } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
  };

  return (
    <div className="container px-4 md:px-8 py-8 mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-yellow-500/10 mb-4">
            <Trophy className="h-7 w-7 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Classement</h1>
          <p className="text-muted-foreground mt-2">Les meilleurs apprenants de NexaTech</p>
        </div>

        <Card className="border-border/60">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {leaderboard?.map((entry, i) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 px-6 py-4 ${i < 3 ? "bg-primary/5" : ""}`}
                  >
                    <div className="w-6 flex items-center justify-center shrink-0">
                      {rankIcon(entry.rank)}
                    </div>

                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {(entry.firstName?.[0] ?? "?").toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{entry.firstName} {entry.lastName}</p>
                      <p className="text-sm text-muted-foreground">{entry.lessonsCompleted} leçons terminées</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg text-primary">{entry.totalScore}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </motion.div>
                ))}
                {(!leaderboard || leaderboard.length === 0) && (
                  <div className="py-16 text-center text-muted-foreground">
                    <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Aucun apprenant pour l'instant. Soyez le premier !</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
