import { cpSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";

function findRoot(dir) {
  if (existsSync(resolve(dir, "pnpm-workspace.yaml"))) return dir;
  const parent = dirname(dir);
  if (parent === dir) throw new Error("Could not find project root");
  return findRoot(parent);
}

const root = findRoot(process.cwd());

// 1. Build the frontend
const build = spawnSync("pnpm", ["--filter", "@workspace/nexatech", "run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

if (build.status !== 0) {
  process.exit(build.status);
}

// 2. Create .vercel/output/static/
const staticDir = resolve(root, ".vercel", "output", "static");
mkdirSync(staticDir, { recursive: true });

// 3. Copy dist/ content to .vercel/output/static/
cpSync(resolve(root, "dist"), staticDir, { recursive: true });

// 4. Create config.json for Build Output API v3
writeFileSync(
  resolve(root, ".vercel", "output", "config.json"),
  JSON.stringify({
    version: 3,
    routes: [
      { src: "^/api/(.*)", dest: "/api/$1" },
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index.html" },
    ],
  }),
);
