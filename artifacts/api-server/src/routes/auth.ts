import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

declare module "express-session" {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
  }
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { nom, prenom, telephone } = req.body as { nom: string; prenom: string; telephone: string };

  if (!nom?.trim() || !prenom?.trim() || !telephone?.trim()) {
    res.status(400).json({ error: "Nom, prénom et numéro de téléphone sont requis." });
    return;
  }

  const phoneClean = telephone.replace(/\s+/g, "");

  const existing = await db.query.usersTable.findFirst({
    where: eq(usersTable.telephone, phoneClean),
  });

  if (existing) {
    res.status(409).json({ error: "Ce numéro de téléphone est déjà utilisé." });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    nom: nom.trim(),
    prenom: prenom.trim(),
    telephone: phoneClean,
    totalScore: 0,
    currentStreak: 0,
    timeSpentSeconds: 0,
  }).returning();

  req.session.userId = user.id;

  res.status(201).json({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    totalScore: user.totalScore,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { telephone } = req.body as { telephone: string };

  if (!telephone?.trim()) {
    res.status(400).json({ error: "Numéro de téléphone requis." });
    return;
  }

  const phoneClean = telephone.replace(/\s+/g, "");

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.telephone, phoneClean),
  });

  if (!user) {
    res.status(404).json({ error: "Aucun compte trouvé avec ce numéro. Veuillez vous inscrire." });
    return;
  }

  req.session.userId = user.id;

  await db.update(usersTable)
    .set({ lastActivityAt: new Date() })
    .where(eq(usersTable.id, user.id));

  res.json({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    totalScore: user.totalScore,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ error: "Non connecté" });
    return;
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!user) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Session invalide" });
    return;
  }

  res.json({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    totalScore: user.totalScore,
    currentStreak: user.currentStreak,
    timeSpentSeconds: user.timeSpentSeconds,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /api/auth/heartbeat — track time spent on site
router.post("/heartbeat", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ error: "Non connecté" });
    return;
  }

  const { seconds } = req.body as { seconds?: number };
  const add = Math.min(seconds ?? 60, 120); // max 2 min per heartbeat

  await db.update(usersTable)
    .set({
      timeSpentSeconds: sql`${usersTable.timeSpentSeconds} + ${add}`,
      lastActivityAt: new Date(),
    })
    .where(eq(usersTable.id, userId));

  res.json({ ok: true });
});

// POST /api/auth/admin/login
router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    res.status(500).json({ error: "ADMIN_PASSWORD non configuré sur le serveur" });
    return;
  }

  if (password !== adminPassword) {
    res.status(401).json({ error: "Mot de passe incorrect" });
    return;
  }

  req.session.isAdmin = true;
  res.json({ ok: true });
});

// POST /api/auth/admin/logout
router.post("/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  res.json({ ok: true });
});

export default router;
