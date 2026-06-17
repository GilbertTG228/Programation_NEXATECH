# NexaTech — guide du monorepo

## Workspaces (pnpm)

| chemin | package | description |
|---|---|---|
| `lib/db` | `@workspace/db` | Schéma Drizzle ORM, client base de données |
| `lib/api-spec` | `@workspace/api-spec` | Spécification OpenAPI + config orval |
| `lib/api-zod` | `@workspace/api-zod` | Schémas Zod générés depuis OpenAPI |
| `lib/api-client-react` | `@workspace/api-client-react` | Hooks React Query générés depuis OpenAPI |
| `artifacts/api-server` | `@workspace/api-server` | App Express, bundle esbuild |
| `artifacts/nexatech` | `@workspace/nexatech` | Frontend Vite + React + shadcn/ui |
| `scripts/` | `@workspace/scripts` | Scripts ad-hoc (exécutés via `tsx`) |

`lib/integrations/` listé dans la config workspace mais n'existe pas encore.

## Commandes de développement

- `pnpm install` — **doit utiliser pnpm** (`npm`/`yarn` rejetés par preinstall hook)
- `pnpm typecheck:libs` — `tsc --build` (project references pour libs)
- `pnpm typecheck` — `typecheck:libs` + vérifications noEmit sur artifacts/scripts
- `pnpm build` — typecheck → construction de tous les workspaces (`pnpm -r --if-present run build`)
- `pnpm -r --if-present run build` — construit chaque membre du workspace

## Commandes par package

| package | commande | notes |
|---|---|---|
| `lib/db` | `pnpm --filter @workspace/db run push` | Drizzle push (migration) |
| `lib/db` | `pnpm --filter @workspace/db run push-force` | Drizzle push --force |
| `lib/api-spec` | `pnpm --filter @workspace/api-spec run codegen` | orval → régénère `api-zod` + `api-client-react`, puis `typecheck:libs` |
| `artifacts/api-server` | `pnpm --filter @workspace/api-server run dev` | build → démarrage |
| `artifacts/nexatech` | `pnpm --filter @workspace/nexatech run dev` | Serveur Vite |

## Génération de code

- Modifier `lib/api-spec/openapi.yaml`, puis lancer `pnpm --filter @workspace/api-spec run codegen`
- Génère `lib/api-zod/src/generated/` et `lib/api-client-react/src/generated/`
- Le transformateur orval force `info.title = "Api"` — changer le titre casse les imports
- La sortie utilise un mutateur fetch personnalisé dans `lib/api-client-react/src/custom-fetch.ts`

## Pipeline de build

1. Project references TypeScript (`tsc --build`) pour les libs via `tsconfig.json`
2. `api-server` bundle avec **esbuild** (`build.mjs`), sortie dans `dist/index.mjs`
3. `nexatech` construit avec **Vite**, sortie dans `dist/public/`

## Variables d'environnement requises

- `DATABASE_URL` (Postgres) — db push, runtime api-server
- `PORT` — api-server et nexatech
- `BASE_PATH` — nexatech (base path Vite)
- `SESSION_SECRET` — api-server (express-session, fallback `nexatech-secret-fallback`)

## Authentification

- Utilise **Clerk** comme fournisseur d'auth (référencé dans plusieurs routes, contextes)
- Stockage des sessions : PostgreSQL (`connect-pg-simple`, table `user_sessions`)

## Conventions frontend

- Routage : `wouter` (pas react-router)
- Styles : Tailwind CSS v4 + `tw-animate-css`
- Composants UI : shadcn/ui (style New York), `components.json` à la racine de nexatech
- Alias de composants : `@/components`, `@/lib/utils`, `@/hooks`, `@/components/ui`
- Mode sombre : `next-themes` (stratégie class, dark par défaut)
- Client HTTP : TanStack React Query + wrapper fetch personnalisé
- Icônes : `lucide-react`

## Style / format

- Prettier listé comme devDep racine, mais **aucun fichier de config trouvé** — valeurs par défaut
- Aucune config ESLint présente

## Tests

Aucun framework de test ni fichier de test trouvé dans le workspace.

## Note de sécurité

`pnpm-workspace.yaml` impose `minimumReleaseAge: 1440` (protection contre les attaques supply-chain de 1 jour). Ne pas désactiver. Ajouter temporairement à `minimumReleaseAgeExclude` uniquement pour des packages de confiance en cas d'urgence.
