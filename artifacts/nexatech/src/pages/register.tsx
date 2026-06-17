import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useI18n } from "@/contexts/i18n-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, User, AlertCircle, Loader2, CheckCircle } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.nom.trim() || !form.prenom.trim() || !form.telephone.trim()) {
      setError("Tous les champs sont requis.");
      return;
    }
    setLoading(true);
    try {
      await register(form.nom.trim(), form.prenom.trim(), form.telephone.trim());
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src={`${basePath}/logo.png`} alt="NexaTech" className="mx-auto h-12 w-12 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-primary">NEXATECH</h1>
        </div>
        <Card className="border-border/60 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">{t("registerTitle")}</CardTitle>
            <CardDescription>{t("registerSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prenom">{t("prenomLabel")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="prenom"
                      name="prenom"
                      placeholder={t("prenomPlaceholder")}
                      value={form.prenom}
                      onChange={handleChange}
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">{t("nomLabel")}</Label>
                  <Input
                    id="nom"
                    name="nom"
                    placeholder={t("nomPlaceholder")}
                    value={form.nom}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">{t("phoneLabel")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    placeholder={t("phonePlaceholder")}
                    value={form.telephone}
                    onChange={handleChange}
                    className="pl-10"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-primary/5 border border-primary/20 rounded-md p-3 space-y-1.5">
                {["Accès aux 5 semaines de cours", "32 exercices pratiques", "Suivi de progression"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inscription...</> : t("registerBtn")}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {t("haveAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {t("login")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
