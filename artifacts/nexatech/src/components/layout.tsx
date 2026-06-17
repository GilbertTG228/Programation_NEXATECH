import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { useI18n, type Lang } from "@/contexts/i18n-context";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Globe } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 font-semibold text-xs px-2 h-8 border border-border/60">
          <Globe className="h-3.5 w-3.5" />
          {lang.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-28">
        <DropdownMenuItem onClick={() => setLang("fr")} className={lang === "fr" ? "text-primary font-semibold" : ""}>
          🇫🇷 Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("en")} className={lang === "en" ? "text-primary font-semibold" : ""}>
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  async function handleLogout() {
    await logout();
    setLocation("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Language bar at the very top */}
      <div className="w-full bg-primary/5 border-b border-border/30 px-4 md:px-8 py-1 flex justify-end items-center gap-2">
        <LangToggle />
      </div>
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <img src={`${basePath}/logo.png`} alt="NexaTech Logo" className="h-8 w-8 object-contain" />
          <span className="hidden font-bold sm:inline-block tracking-tight text-lg text-primary">
            NEXATECH
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4 text-sm font-medium">
            {user ? (
              <>
                <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:block">{t("dashboard")}</Link>
                <Link href="/courses" className="transition-colors hover:text-foreground/80 text-foreground/60">{t("courses")}</Link>
                <Link href="/exercises" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:block">{t("exercises")}</Link>
                <Link href="/leaderboard" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block">{t("leaderboard")}</Link>
              </>
            ) : (
              <>
                <Link href="/courses" className="transition-colors hover:text-foreground/80 text-foreground/60">{t("curriculum")}</Link>
                <Link href="/login" className="transition-colors hover:text-foreground/80 text-foreground/60">{t("login")}</Link>
              </>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-9 px-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-xs">
                      {user.prenom.charAt(0).toUpperCase()}{user.nom.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm max-w-20 truncate">{user.prenom}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" /> {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" /> {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row px-4 md:px-8">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 NexaTech — La Technologie en Mouvement 🇹🇬
        </p>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
