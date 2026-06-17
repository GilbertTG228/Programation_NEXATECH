import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/i18n-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, Users, Clock, BookOpen, LogOut, AlertCircle, Loader2, TrendingUp, Trophy } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Learner {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  totalScore: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  timeSpentFormatted: string;
  timeSpentSeconds: number;
  lastActivityAt: string | null;
  inscritLe: string;
}

interface Stats {
  totalUsers: number;
  totalLessonsCompleted: number;
  totalExercisesSubmitted: number;
  activeUsersLast7Days: number;
}

async function adminFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erreur ${res.status}`);
  }
  return res.json();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminPage() {
  const { t } = useI18n();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await adminFetch("/api/auth/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      setIsAdmin(true);
      loadData();
    } catch (err: any) {
      setLoginError(err.message ?? "Erreur");
    } finally {
      setLoginLoading(false);
    }
  }

  async function loadData() {
    setDataLoading(true);
    try {
      const [learnersData, statsData] = await Promise.all([
        adminFetch("/api/admin/learners"),
        adminFetch("/api/admin/stats"),
      ]);
      setLearners(learnersData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  }

  async function handleLogout() {
    await adminFetch("/api/auth/admin/logout", { method: "POST" });
    setIsAdmin(false);
    setLearners([]);
    setStats(null);
    setPassword("");
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t("adminTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Espace réservé à l'administration</p>
          </div>
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">{t("adminPassword")}</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                    autoFocus
                  />
                </div>
                {loginError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                  {t("adminLogin")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("adminTitle")}</h1>
          <p className="mt-1 text-muted-foreground">Vue d'ensemble de la plateforme</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          {t("adminLogout")}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2.5"><Users className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("totalUsers")}</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-2.5"><TrendingUp className="h-5 w-5 text-green-500" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("activeUsers")}</p>
                  <p className="text-2xl font-bold">{stats.activeUsersLast7Days}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-500/10 p-2.5"><BookOpen className="h-5 w-5 text-blue-500" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("totalLessonsCompleted")}</p>
                  <p className="text-2xl font-bold">{stats.totalLessonsCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-500/10 p-2.5"><Trophy className="h-5 w-5 text-yellow-500" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("totalExercises")}</p>
                  <p className="text-2xl font-bold">{stats.totalExercisesSubmitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Learners Table */}
      <Card className="border-border/60">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("adminLearners")}
            {!dataLoading && <Badge variant="secondary">{learners.length}</Badge>}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadData} disabled={dataLoading}>
            {dataLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "↻ Actualiser"}
          </Button>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : learners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Aucun apprenant inscrit pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{t("nomLabel")} / {t("prenomLabel")}</TableHead>
                    <TableHead>{t("phoneLabel")}</TableHead>
                    <TableHead className="text-center">{t("lessonsCompleted")}</TableHead>
                    <TableHead className="text-center">{t("score")}</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {t("timeOnSite")}
                      </div>
                    </TableHead>
                    <TableHead>{t("inscribedOn")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {learners.map((l, idx) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs flex-shrink-0">
                            {l.prenom.charAt(0)}{l.nom.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{l.prenom} {l.nom}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{l.telephone}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">{l.lessonsCompleted}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-primary">{l.totalScore}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">{l.timeSpentFormatted}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(l.inscritLe)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
