import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { I18nProvider } from "@/contexts/i18n-context";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import WeekDetail from "@/pages/courses/week-detail";
import LessonDetail from "@/pages/courses/lesson-detail";
import Exercises from "@/pages/exercises";
import Leaderboard from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-[100dvh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" /></div>;
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-[100dvh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" /></div>;
  if (user) return <Redirect to="/dashboard" />;
  return <Home />;
}

function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomeRoute} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/courses" component={() => <ProtectedRoute component={Courses} />} />
        <Route path="/courses/week/:weekId" component={() => <ProtectedRoute component={WeekDetail} />} />
        <Route path="/courses/week/:weekId/lesson/:lessonId" component={() => <ProtectedRoute component={LessonDetail} />} />
        <Route path="/exercises" component={() => <ProtectedRoute component={Exercises} />} />
        <Route path="/leaderboard" component={() => <ProtectedRoute component={Leaderboard} />} />
        <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
