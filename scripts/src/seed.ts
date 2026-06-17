import { db, weeksTable, lessonsTable, exercisesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const weeks = [
  {
    weekNumber: 1,
    title: "Introduction à la Programmation",
    description: "Découvrez les bases de la programmation avec JavaScript. Apprenez les concepts fondamentaux qui vous serviront tout au long de votre parcours.",
    objectives: ["Comprendre ce qu'est un algorithme", "Maîtriser les variables et types de données", "Utiliser les conditions", "Créer des boucles simples"],
    imageUrl: null,
  },
  {
    weekNumber: 2,
    title: "Fonctions et Tableaux",
    description: "Approfondissez vos connaissances avec les fonctions réutilisables et la manipulation de tableaux.",
    objectives: ["Déclarer et appeler des fonctions", "Comprendre la portée des variables", "Manipuler les tableaux", "Utiliser les méthodes de base"],
    imageUrl: null,
  },
  {
    weekNumber: 3,
    title: "Programmation Orientée Objet",
    description: "Plongez dans le paradigme orienté objet : classes, objets, héritage et encapsulation.",
    objectives: ["Créer des classes et des objets", "Comprendre l'héritage", "Utiliser l'encapsulation", "Appliquer le polymorphisme"],
    imageUrl: null,
  },
  {
    weekNumber: 4,
    title: "Projet Final — Application Todo",
    description: "Mettez en pratique tout ce que vous avez appris en construisant une application Todo complète.",
    objectives: ["Planifier un projet", "Structurer le code", "Implémenter les fonctionnalités CRUD", "Tester et débugger"],
    imageUrl: null,
  },
];

const lessonsByWeek: Record<number, { title: string; description: string; content: string; type: "video" | "reading" | "exercise" | "quiz"; durationMinutes: number; order: number }[]> = {
  1: [
    {
      order: 1, title: "Qu'est-ce qu'un algorithme ?", description: "Comprendre la logique algorithmique",
      content: "# Qu'est-ce qu'un algorithme ?\n\nUn algorithme est une séquence d'instructions qui résout un problème. Comme une recette de cuisine, il décrit étape par étape comment passer des ingrédients (données) au plat final (résultat).\n\n## Exemple simple\n\nPour faire un café :\n1. Prendre une tasse\n2. Mettre du café dans la tasse\n3. Ajouter de l'eau chaude\n4. Remuer\n\nC'est un algorithme !\n\n## En programmation\n\n```javascript\n// Algorithme : calculer la moyenne\nfunction moyenne(a, b) {\n  return (a + b) / 2;\n}\n```",
      type: "reading", durationMinutes: 10,
    },
    {
      order: 2, title: "Variables et Types de Données", description: "Stockez et manipulez des données",
      content: "# Variables et Types de Données\n\nLes variables sont des conteneurs qui stockent des valeurs. En JavaScript, on déclare une variable avec `let` ou `const`.\n\n## Types principaux\n\n- **Nombre** : `let age = 25;`\n- **Chaîne** : `let nom = \"Alice\";`\n- **Booléen** : `let actif = true;`\n- **Tableau** : `let liste = [1, 2, 3];`\n- **Objet** : `let personne = { nom: \"Alice\", age: 25 };`\n\n## Exercice\n\nCréez une variable `prenom` contenant votre prénom et une variable `annee` contenant l'année en cours.",
      type: "video", durationMinutes: 15,
    },
    {
      order: 3, title: "Les Conditions (if/else)", description: "Prenez des décisions dans votre code",
      content: "# Les Conditions\n\nLes conditions permettent d'exécuter du code uniquement si une condition est vraie.\n\n```javascript\nlet age = 18;\n\nif (age >= 18) {\n  console.log(\"Vous êtes majeur\");\n} else {\n  console.log(\"Vous êtes mineur\");\n}\n```\n\n## Opérateurs de comparaison\n\n- `===` égalité stricte\n- `!==` inégalité stricte\n- `>` plus grand que\n- `<` plus petit que\n- `>=` plus grand ou égal\n- `<=` plus petit ou égal",
      type: "reading", durationMinutes: 12,
    },
    {
      order: 4, title: "Les Boucles (for/while)", description: "Répétez des actions efficacement",
      content: "# Les Boucles\n\nLes boucles permettent de répéter un bloc de code plusieurs fois.\n\n## Boucle for\n\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(\"Tour numéro \" + i);\n}\n```\n\n## Boucle while\n\n```javascript\nlet compteur = 0;\nwhile (compteur < 5) {\n  console.log(compteur);\n  compteur++;\n}\n```",
      type: "video", durationMinutes: 15,
    },
    {
      order: 5, title: "Quiz : Fondamentaux", description: "Testez vos connaissances de base",
      content: "# Quiz\n\nRépondez aux questions pour valider votre compréhension des concepts de base.",
      type: "quiz", durationMinutes: 10,
    },
  ],
  2: [
    {
      order: 1, title: "Déclarer et Appeler des Fonctions", description: "Créez des blocs de code réutilisables",
      content: "# Les Fonctions\n\nUne fonction est un bloc de code nommé qui peut être réutilisé.\n\n```javascript\nfunction direBonjour(prenom) {\n  return \"Bonjour \" + prenom + \" !\";\n}\n\nconsole.log(direBonjour(\"Alice\")); // \"Bonjour Alice !\"\n```\n\n## Fonctions fléchées\n\n```javascript\nconst carre = (x) => x * x;\n```",
      type: "video", durationMinutes: 15,
    },
    {
      order: 2, title: "Portée des Variables (scope)", description: "Comprenez où vos variables existent",
      content: "# La Portée des Variables\n\nLa portée (scope) détermine où une variable est accessible dans le code.\n\n- **Globale** : accessible partout\n- **Locale** : accessible seulement dans la fonction/bloc où elle est déclarée\n\n```javascript\nlet globale = \"je suis partout\";\n\nfunction test() {\n  let locale = \"je suis locale\";\n  console.log(globale); // OK\n}\n\nconsole.log(locale); // Erreur !\n```",
      type: "reading", durationMinutes: 10,
    },
    {
      order: 3, title: "Manipulation de Tableaux", description: "Stockez et gérez des listes de données",
      content: "# Les Tableaux\n\nUn tableau est une liste ordonnée d'éléments.\n\n```javascript\nlet fruits = [\"pomme\", \"banane\", \"orange\"];\nconsole.log(fruits[0]); // \"pomme\"\nconsole.log(fruits.length); // 3\n\nfruits.push(\"kiwi\"); // ajouter à la fin\nfruits.pop(); // enlever le dernier\n```\n\n## Méthodes utiles\n- `map()` : transformer chaque élément\n- `filter()` : filtrer les éléments\n- `find()` : trouver un élément",
      type: "reading", durationMinutes: 12,
    },
    {
      order: 4, title: "Exercice : Fonctions et Tableaux", description: "Mettez en pratique fonctions et tableaux",
      content: "# Exercice\n\nÉcrivez une fonction `doublerTableau` qui prend un tableau de nombres et retourne un nouveau tableau avec chaque valeur doublée.",
      type: "exercise", durationMinutes: 20,
    },
  ],
  3: [
    {
      order: 1, title: "Classes et Objets", description: "Créez vos propres types d'objets",
      content: "# Les Classes\n\nUne classe est un modèle pour créer des objets.\n\n```javascript\nclass Personne {\n  constructor(nom, age) {\n    this.nom = nom;\n    this.age = age;\n  }\n\n  saluer() {\n    console.log(\"Bonjour, je suis \" + this.nom);\n  }\n}\n\nconst alice = new Personne(\"Alice\", 25);\nalice.saluer();\n```",
      type: "video", durationMinutes: 20,
    },
    {
      order: 2, title: "L'Héritage", description: "Réutilisez du code entre classes",
      content: "# L'Héritage\n\nL'héritage permet à une classe d'hériter des propriétés et méthodes d'une autre classe.\n\n```javascript\nclass Animal {\n  constructor(nom) {\n    this.nom = nom;\n  }\n  parler() {\n    console.log(this.nom + \" fait un bruit\");\n  }\n}\n\nclass Chien extends Animal {\n  parler() {\n    console.log(this.nom + \" aboie !\");\n  }\n}\n```",
      type: "reading", durationMinutes: 15,
    },
    {
      order: 3, title: "Encapsulation et Propriétés Privées", description: "Protégez vos données",
      content: "# L'Encapsulation\n\nL'encapsulation cache les détails internes d'un objet et expose seulement ce qui est nécessaire.\n\n```javascript\nclass CompteBancaire {\n  #solde = 0; // propriété privée\n\n  deposer(montant) {\n    this.#solde += montant;\n  }\n\n  getSolde() {\n    return this.#solde;\n  }\n}\n```",
      type: "reading", durationMinutes: 12,
    },
    {
      order: 4, title: "Quiz : POO", description: "Testez vos connaissances en POO",
      content: "# Quiz Programmation Orientée Objet\n\nValidez votre compréhension des classes, héritage et encapsulation.",
      type: "quiz", durationMinutes: 10,
    },
  ],
  4: [
    {
      order: 1, title: "Planification du Projet", description: "Organisez votre travail avant de coder",
      content: "# Planification\n\nAvant de coder, il est essentiel de planifier :\n\n1. **Analyse des besoins** — que doit faire l'application ?\n2. **Maquettage** — à quoi ressemblera l'interface ?\n3. **Architecture** — comment organiser le code ?\n4. **Découpage** — quelles sont les tâches ?",
      type: "reading", durationMinutes: 10,
    },
    {
      order: 2, title: "Structure du Code", description: "Organisez votre code proprement",
      content: "# Structure\n\nUne bonne organisation du code est cruciale pour la maintenabilité.\n\n```\nprojet/\n  index.html\n  style.css\n  script.js\n```\n\nSéparez les responsabilités :\n- **HTML** : structure\n- **CSS** : présentation\n- **JS** : logique",
      type: "video", durationMinutes: 15,
    },
    {
      order: 3, title: "Implémentation CRUD", description: "Créez les fonctionnalités de base",
      content: "# CRUD\n\nCRUD = Create, Read, Update, Delete\n\nPour une application Todo :\n\n```javascript\nlet taches = [];\n\nfunction ajouterTache(titre) {\n  taches.push({ id: Date.now(), titre, fait: false });\n}\n\nfunction supprimerTache(id) {\n  taches = taches.filter(t => t.id !== id);\n}\n\nfunction basculerTache(id) {\n  const tache = taches.find(t => t.id === id);\n  if (tache) tache.fait = !tache.fait;\n}\n```",
      type: "exercise", durationMinutes: 25,
    },
    {
      order: 4, title: "Tests et Débogage", description: "Assurez la qualité de votre code",
      content: "# Tests et Débogage\n\n## Types de tests\n- Tests manuels\n- Tests console.log\n- Tests unitaires\n\n## Outils de débogage\n- Console du navigateur (F12)\n- Points d'arrêt (breakpoints)\n- debugger;",
      type: "reading", durationMinutes: 10,
    },
    {
      order: 5, title: "Soutenance du Projet", description: "Présentez votre travail",
      content: "# Soutenance\n\nPréparez une démonstration de votre application Todo :\n1. Montrez les fonctionnalités\n2. Expliquez votre code\n3. Discutez des difficultés rencontrées\n4. Proposez des améliorations futures",
      type: "video", durationMinutes: 15,
    },
  ],
};

const exercisesByLesson: Record<number, { order: number; question: string; type: "multiple_choice" | "true_false" | "fill_blank" | "code_completion"; difficulty: "easy" | "medium" | "hard"; points: number; options: string[] | null; correctAnswer: string; hint: string | null; explanation: string | null }[]> = {
  1: [
    {
      order: 1, question: "Qu'est-ce qu'un algorithme ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["Un langage de programmation", "Une séquence d'instructions pour résoudre un problème", "Un type de variable", "Un logiciel"],
      correctAnswer: "Une séquence d'instructions pour résoudre un problème",
      hint: "Pensez à une recette de cuisine",
      explanation: "Un algorithme est une série d'étapes qui résout un problème, comme une recette.",
    },
    {
      order: 2, question: "Quel mot-clé utilise-t-on pour déclarer une variable en JavaScript ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["var", "let", "const", "Toutes ces réponses"],
      correctAnswer: "Toutes ces réponses",
      hint: "Il y a plusieurs façons",
      explanation: "On peut utiliser `var`, `let` ou `const` pour déclarer des variables en JavaScript.",
    },
    {
      order: 3, question: "Une variable déclarée avec `const` peut être réaffectée.", type: "true_false", difficulty: "easy", points: 5,
      options: ["Vrai", "Faux"],
      correctAnswer: "Faux",
      hint: "const est pour les constantes",
      explanation: "`const` ne permet pas la réaffectation. Utilisez `let` pour une variable modifiable.",
    },
    {
      order: 4, question: "Complétez : `if (age ___ 18) { console.log('majeur'); }`", type: "fill_blank", difficulty: "easy", points: 10,
      options: null,
      correctAnswer: ">= >=",
      hint: "Opérateur de comparaison pour 'plus grand ou égal'",
      explanation: "L'opérateur `>=` signifie 'plus grand ou égal à'.",
    },
    {
      order: 5, question: "Combien de fois la boucle `for (let i = 0; i < 3; i++)` s'exécute-t-elle ?", type: "multiple_choice", difficulty: "medium", points: 10,
      options: ["2", "3", "4", "Infinite"],
      correctAnswer: "3",
      hint: "Regardez la condition d'arrêt",
      explanation: "La boucle s'exécute pour i=0, i=1, i=2 (3 fois). Quand i=3, la condition i < 3 est fausse.",
    },
  ],
  2: [
    {
      order: 1, question: "Quel mot-clé utilise-t-on pour retourner une valeur depuis une fonction ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["send", "return", "output", "yield"],
      correctAnswer: "return",
      hint: "Mot anglais pour 'retourner'",
      explanation: "Le mot-clé `return` renvoie une valeur depuis une fonction.",
    },
    {
      order: 2, question: "Une variable déclarée dans une fonction est accessible partout dans le code.", type: "true_false", difficulty: "medium", points: 10,
      options: ["Vrai", "Faux"],
      correctAnswer: "Faux",
      hint: "Pensez à la portée (scope)",
      explanation: "Une variable déclarée dans une fonction a une portée locale et n'est pas accessible en dehors.",
    },
    {
      order: 3, question: "Quelle méthode ajoute un élément à la fin d'un tableau ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: "push()",
      hint: "Poussez à la fin",
      explanation: "`push()` ajoute un ou plusieurs éléments à la fin d'un tableau.",
    },
    {
      order: 4, question: "Écrivez une fonction qui prend deux nombres et retourne leur somme.", type: "code_completion", difficulty: "medium", points: 15,
      options: null,
      correctAnswer: "function somme(a,b){return a+b}",
      hint: "Utilisez function ou une fonction fléchée",
      explanation: "Une fonction qui retourne `a + b` fera l'affaire.",
    },
  ],
  3: [
    {
      order: 1, question: "Quel mot-clé utilise-t-on pour créer une classe en JavaScript ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["class", "object", "template", "struct"],
      correctAnswer: "class",
      hint: "Mot anglais pour 'classe'",
      explanation: "Le mot-clé `class` a été introduit dans ES6 pour créer des classes.",
    },
    {
      order: 2, question: "Le constructeur d'une classe s'appelle toujours `constructor`.", type: "true_false", difficulty: "easy", points: 5,
      options: ["Vrai", "Faux"],
      correctAnswer: "Vrai",
      hint: "C'est le nom réservé",
      explanation: "La méthode `constructor` est appelée automatiquement lors de la création d'un nouvel objet.",
    },
    {
      order: 3, question: "Quel mot-clé permet à une classe d'hériter d'une autre ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["inherit", "extends", "implements", "super"],
      correctAnswer: "extends",
      hint: "Mot anglais pour 'étend'",
      explanation: "Le mot-clé `extends` permet l'héritage entre classes.",
    },
    {
      order: 4, question: "Comment déclare-t-on une propriété privée dans une classe ?", type: "multiple_choice", difficulty: "medium", points: 10,
      options: ["private solde", "#solde", "_solde", "_solde_"],
      correctAnswer: "#solde",
      hint: "Avec un symbole spécifique",
      explanation: "Le caractère `#` devant le nom rend la propriété privée en JavaScript.",
    },
  ],
  4: [
    {
      order: 1, question: "Que signifie CRUD ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["Create, Read, Update, Delete", "Copy, Run, Update, Debug", "Code, Review, Update, Deploy", "Create, Run, Use, Delete"],
      correctAnswer: "Create, Read, Update, Delete",
      hint: "Les 4 opérations de base",
      explanation: "CRUD est l'acronyme des quatre opérations fondamentales pour la persistance des données.",
    },
    {
      order: 2, question: "Quel outil peut-on utiliser pour déboguer du JavaScript dans le navigateur ?", type: "multiple_choice", difficulty: "easy", points: 5,
      options: ["La console (F12)", "Visual Studio Code", "Node.js", "Git"],
      correctAnswer: "La console (F12)",
      hint: "Touche de fonction",
      explanation: "La console du navigateur (F12) permet de déboguer facilement le code JavaScript.",
    },
    {
      order: 3, question: "Quelle méthode de tableau permet de supprimer un élément selon une condition ?", type: "multiple_choice", difficulty: "medium", points: 10,
      options: ["splice()", "filter()", "remove()", "delete()"],
      correctAnswer: "filter()",
      hint: "Crée un nouveau tableau filtré",
      explanation: "`filter()` crée un nouveau tableau avec les éléments qui passent le test, ce qui permet d'exclure certains éléments.",
    },
    {
      order: 4, question: "Implémentez une fonction qui prend un tableau de nombres et retourne la somme.", type: "code_completion", difficulty: "hard", points: 20,
      options: null,
      correctAnswer: "function somme(t){return t.reduce((a,b)=>a+b,0)}",
      hint: "Utilisez reduce ou une boucle",
      explanation: "`reduce` accumule chaque valeur pour calculer la somme totale.",
    },
  ],
};

async function seed() {
  console.log("🌱 Vérification des données existantes...");

  const existingWeeks = await db.select().from(weeksTable);
  if (existingWeeks.length > 0) {
    console.log(`✅ ${existingWeeks.length} semaine(s) déjà présente(s). Seed ignoré.`);
    return;
  }

  console.log("📚 Création des semaines...");
  for (const week of weeks) {
    const [createdWeek] = await db.insert(weeksTable).values(week).returning();
    console.log(`  ✅ Semaine ${createdWeek.weekNumber}: ${createdWeek.title}`);

    const lessons = lessonsByWeek[createdWeek.weekNumber] ?? [];
    for (const lesson of lessons) {
      const [createdLesson] = await db.insert(lessonsTable).values({
        ...lesson,
        weekId: createdWeek.id,
      }).returning();
      console.log(`    📖 Leçon ${createdLesson.order}: ${createdLesson.title}`);

      const exercises = exercisesByLesson[createdLesson.order] ?? [];
      for (const exercise of exercises) {
        await db.insert(exercisesTable).values({
          ...exercise,
          lessonId: createdLesson.id,
          weekId: createdWeek.id,
        }).returning();
      }
      console.log(`      ✏️  ${exercises.length} exercice(s)`);
    }
  }

  console.log("\n✅ Seed terminé avec succès !");
}

seed().catch((err) => {
  console.error("❌ Erreur seed :", err);
  process.exit(1);
});
