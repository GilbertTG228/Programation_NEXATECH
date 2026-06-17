import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const translations = {
  fr: {
    // Navbar
    dashboard: "Tableau de bord",
    courses: "Cours",
    exercises: "Exercices",
    leaderboard: "Classement",
    profile: "Profil",
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
    curriculum: "Programme",
    // Home
    homeHero: "Apprenez à coder en 5 semaines",
    homeSubtitle: "Formation pratique en Python & HTML/CSS pour débutants. Sans background informatique requis.",
    startNow: "Commencer maintenant",
    learnMore: "En savoir plus",
    weekCurriculum: "Programme en 5 semaines",
    features: "Pourquoi NexaTech ?",
    f1Title: "Cours structurés",
    f1Desc: "5 semaines de contenu progressif, du débutant au développeur.",
    f2Title: "Exercices pratiques",
    f2Desc: "Plus de 32 exercices pour consolider vos apprentissages.",
    f3Title: "Suivi de progression",
    f3Desc: "Tableau de bord personnel pour voir votre avancement.",
    f4Title: "Classement",
    f4Desc: "Gagnez des points et comparez-vous aux autres apprenants.",
    ctaTitle: "Prêt à commencer ?",
    ctaDesc: "Rejoignez des centaines d'apprenants au Togo.",
    ctaBtn: "S'inscrire gratuitement",
    // Auth
    registerTitle: "Créer un compte",
    registerSubtitle: "Rejoignez NexaTech gratuitement",
    nomLabel: "Nom",
    prenomLabel: "Prénom",
    phoneLabel: "Numéro de téléphone",
    phonePlaceholder: "+228 XX XX XX XX",
    nomPlaceholder: "Ex: BAWA",
    prenomPlaceholder: "Ex: Kofi",
    registerBtn: "S'inscrire",
    haveAccount: "Vous avez déjà un compte ?",
    loginTitle: "Se connecter",
    loginSubtitle: "Accédez à votre espace d'apprentissage",
    loginBtn: "Se connecter",
    noAccount: "Vous n'avez pas de compte ?",
    // Dashboard
    welcome: "Bon retour",
    yourProgress: "Votre progression",
    totalScore: "Score total",
    lessonsCompleted: "Leçons terminées",
    exercisesDone: "Exercices réussis",
    currentWeek: "Semaine en cours",
    weeklyProgress: "Progression hebdomadaire",
    recentLeaderboard: "Classement",
    // Courses
    coursesTitle: "Programme de formation",
    week: "Semaine",
    lessons: "leçons",
    start: "Commencer",
    continue: "Continuer",
    locked: "Verrouillé",
    completed: "Terminé",
    // Exercises
    exercisesTitle: "Exercices pratiques",
    filterByWeek: "Filtrer par semaine",
    filterByDifficulty: "Difficulté",
    allWeeks: "Toutes les semaines",
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    submitAnswer: "Valider",
    correctAnswer: "Bonne réponse !",
    wrongAnswer: "Mauvaise réponse",
    showHint: "Voir l'indice",
    // Leaderboard
    leaderboardTitle: "Classement des apprenants",
    rank: "Rang",
    name: "Nom",
    score: "Score",
    lessonsNum: "Leçons",
    // Profile
    profileTitle: "Mon profil",
    memberSince: "Membre depuis",
    timeSpent: "Temps passé",
    // Common
    loading: "Chargement...",
    error: "Erreur",
    back: "Retour",
    next: "Suivant",
    markComplete: "Marquer comme terminé",
    points: "points",
    of: "sur",
    // Admin
    adminTitle: "Administration NexaTech",
    adminPassword: "Mot de passe administrateur",
    adminLogin: "Se connecter",
    adminLogout: "Déconnexion admin",
    adminLearners: "Apprenants inscrits",
    adminStats: "Statistiques générales",
    totalUsers: "Total apprenants",
    activeUsers: "Actifs (7j)",
    totalLessonsCompleted: "Leçons terminées",
    totalExercises: "Exercices soumis",
    timeOnSite: "Temps sur le site",
    inscribedOn: "Inscrit le",
    hours: "h",
    minutes: "min",
  },
  en: {
    // Navbar
    dashboard: "Dashboard",
    courses: "Courses",
    exercises: "Exercises",
    leaderboard: "Leaderboard",
    profile: "Profile",
    login: "Sign In",
    register: "Sign Up",
    logout: "Sign Out",
    curriculum: "Curriculum",
    // Home
    homeHero: "Learn to Code in 5 Weeks",
    homeSubtitle: "Practical Python & HTML/CSS training for beginners. No IT background required.",
    startNow: "Get Started",
    learnMore: "Learn More",
    weekCurriculum: "5-Week Curriculum",
    features: "Why NexaTech?",
    f1Title: "Structured Courses",
    f1Desc: "5 weeks of progressive content, from beginner to developer.",
    f2Title: "Practical Exercises",
    f2Desc: "Over 32 exercises to consolidate your learning.",
    f3Title: "Progress Tracking",
    f3Desc: "Personal dashboard to see your advancement.",
    f4Title: "Leaderboard",
    f4Desc: "Earn points and compare yourself with other learners.",
    ctaTitle: "Ready to Start?",
    ctaDesc: "Join hundreds of learners in Togo.",
    ctaBtn: "Sign Up for Free",
    // Auth
    registerTitle: "Create an Account",
    registerSubtitle: "Join NexaTech for free",
    nomLabel: "Last Name",
    prenomLabel: "First Name",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+228 XX XX XX XX",
    nomPlaceholder: "Ex: BAWA",
    prenomPlaceholder: "Ex: Kofi",
    registerBtn: "Sign Up",
    haveAccount: "Already have an account?",
    loginTitle: "Sign In",
    loginSubtitle: "Access your learning space",
    loginBtn: "Sign In",
    noAccount: "Don't have an account?",
    // Dashboard
    welcome: "Welcome back",
    yourProgress: "Your Progress",
    totalScore: "Total Score",
    lessonsCompleted: "Lessons Completed",
    exercisesDone: "Exercises Passed",
    currentWeek: "Current Week",
    weeklyProgress: "Weekly Progress",
    recentLeaderboard: "Leaderboard",
    // Courses
    coursesTitle: "Training Program",
    week: "Week",
    lessons: "lessons",
    start: "Start",
    continue: "Continue",
    locked: "Locked",
    completed: "Completed",
    // Exercises
    exercisesTitle: "Practice Exercises",
    filterByWeek: "Filter by Week",
    filterByDifficulty: "Difficulty",
    allWeeks: "All Weeks",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    submitAnswer: "Submit",
    correctAnswer: "Correct!",
    wrongAnswer: "Wrong Answer",
    showHint: "Show Hint",
    // Leaderboard
    leaderboardTitle: "Learner Rankings",
    rank: "Rank",
    name: "Name",
    score: "Score",
    lessonsNum: "Lessons",
    // Profile
    profileTitle: "My Profile",
    memberSince: "Member Since",
    timeSpent: "Time Spent",
    // Common
    loading: "Loading...",
    error: "Error",
    back: "Back",
    next: "Next",
    markComplete: "Mark as Complete",
    points: "points",
    of: "of",
    // Admin
    adminTitle: "NexaTech Administration",
    adminPassword: "Admin Password",
    adminLogin: "Sign In",
    adminLogout: "Admin Logout",
    adminLearners: "Registered Learners",
    adminStats: "General Statistics",
    totalUsers: "Total Learners",
    activeUsers: "Active (7d)",
    totalLessonsCompleted: "Lessons Completed",
    totalExercises: "Exercises Submitted",
    timeOnSite: "Time on Site",
    inscribedOn: "Joined on",
    hours: "h",
    minutes: "min",
  },
} satisfies Record<Lang, Record<string, string>>;

export type TranslationKey = keyof typeof translations.fr;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("nexatech-lang") as Lang) ?? "fr";
  });

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("nexatech-lang", l);
  }

  function t(key: TranslationKey): string {
    return translations[lang][key] ?? translations.fr[key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
