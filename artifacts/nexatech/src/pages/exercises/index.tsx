import { useState } from "react";
import { useGetExercises, useGetWeeks, useSubmitExercise, getGetProgressQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Code2, Trophy, Lightbulb, CheckCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

const DIFF_COLOR: Record<string, string> = {
  easy: "text-green-500 border-green-500/30 bg-green-500/10",
  medium: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
  hard: "text-red-500 border-red-500/30 bg-red-500/10",
};
const DIFF_LABEL: Record<string, string> = { easy: "Facile", medium: "Moyen", hard: "Difficile" };

function ExerciseCard({ exercise }: { exercise: any }) {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const queryClient = useQueryClient();
  const submit = useSubmitExercise();

  const handleSubmit = () => {
    if (!selected) return;
    submit.mutate(
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

  return (
    <Card className="border-border/60 h-full flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={`text-xs ${DIFF_COLOR[exercise.difficulty]}`}>
            {DIFF_LABEL[exercise.difficulty]}
          </Badge>
          <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/10">
            <Trophy className="h-3 w-3 mr-1" />{exercise.points} pts
          </Badge>
        </div>

        <p className="font-medium mb-4 flex-1">{exercise.question}</p>

        {!submitted ? (
          <div className="space-y-3">
            {exercise.type === "multiple_choice" && exercise.options?.map((opt: string) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${selected === opt ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-border/80"}`}
              >
                {opt}
              </button>
            ))}

            {exercise.type === "true_false" && (
              <div className="flex gap-2">
                {["Vrai", "Faux"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${selected === opt ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-border/80"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {(exercise.type === "fill_blank" || exercise.type === "code_completion") && (
              <Input
                placeholder="Votre réponse..."
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className={exercise.type === "code_completion" ? "font-mono" : ""}
              />
            )}

            {exercise.hint && (
              <button onClick={() => setShowHint(!showHint)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <Lightbulb className="h-3 w-3" />
                {showHint ? "Masquer" : "Indice"}
              </button>
            )}
            {showHint && exercise.hint && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-600 dark:text-yellow-400">
                {exercise.hint}
              </div>
            )}

            <Button onClick={handleSubmit} disabled={!selected || submit.isPending} size="sm" className="w-full">
              {submit.isPending ? "..." : "Soumettre"}
            </Button>
          </div>
        ) : result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={`p-3 rounded-lg border text-sm ${result.correct ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <div className="flex items-center gap-2 mb-1">
                {result.correct
                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                  : <span className="text-red-500 font-bold">✕</span>
                }
                <span className={`font-semibold text-sm ${result.correct ? "text-green-500" : "text-red-500"}`}>
                  {result.correct ? `+${result.pointsEarned} pts` : "Incorrect"}
                </span>
              </div>
              {!result.correct && <p className="text-xs"><b>Réponse :</b> {result.correctAnswer}</p>}
              {result.explanation && <p className="text-xs text-muted-foreground mt-1">{result.explanation}</p>}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Exercises() {
  const [weekFilter, setWeekFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");

  const params: Record<string, string | number> = {};
  if (weekFilter !== "all") params.weekId = Number(weekFilter);
  if (diffFilter !== "all") params.difficulty = diffFilter;

  const { data: exercises, isLoading } = useGetExercises(
    Object.keys(params).length > 0 ? params : undefined,
  );
  const { data: weeks } = useGetWeeks();

  return (
    <div className="container px-4 md:px-8 py-8 mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Exercices</h1>
          <p className="text-muted-foreground mt-2">Pratiquez et renforcez vos compétences</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={weekFilter} onValueChange={setWeekFilter}>
            <SelectTrigger className="w-48" data-testid="select-week-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Toutes les semaines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les semaines</SelectItem>
              {weeks?.map((w) => (
                <SelectItem key={w.id} value={String(w.id)}>Semaine {w.weekNumber}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={diffFilter} onValueChange={setDiffFilter}>
            <SelectTrigger className="w-40" data-testid="select-difficulty-filter">
              <SelectValue placeholder="Difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="easy">Facile</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="hard">Difficile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : exercises && exercises.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise, i) => (
              <motion.div key={exercise.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ExerciseCard exercise={exercise} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Code2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Aucun exercice trouvé avec ces filtres.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
