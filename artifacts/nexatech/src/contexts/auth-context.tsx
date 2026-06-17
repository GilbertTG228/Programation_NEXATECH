import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";

export interface AuthUser {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  totalScore: number;
  currentStreak: number;
  timeSpentSeconds: number;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (telephone: string) => Promise<void>;
  register: (nom: string, prenom: string, telephone: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts?.headers },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erreur ${res.status}`);
  }
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchMe() {
    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      return;
    }
    heartbeatRef.current = setInterval(async () => {
      try {
        await apiFetch("/api/auth/heartbeat", { method: "POST", body: JSON.stringify({ seconds: 60 }) });
      } catch {}
    }, 60_000);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [user?.id]);

  async function login(telephone: string) {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ telephone }),
    });
    setUser(data);
  }

  async function register(nom: string, prenom: string, telephone: string) {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ nom, prenom, telephone }),
    });
    setUser(data);
  }

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
