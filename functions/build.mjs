import { readFileSync } from "node:fs";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, "package.json"), "utf8"));

const distDir = resolve(import.meta.dirname, ".build");
await rm(distDir, { recursive: true, force: true });

await esbuild({
  entryPoints: [resolve(import.meta.dirname, "index.js")],
  bundle: true,
  platform: "node",
  format: "esm",
  outdir: distDir,
  outExtension: { ".js": ".mjs" },
  logLevel: "info",
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    "pg-native",
    "sharp",
    "@swc/*",
  ],
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);`,
  },
});
