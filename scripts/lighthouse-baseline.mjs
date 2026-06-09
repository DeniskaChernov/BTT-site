#!/usr/bin/env node
/**
 * Lighthouse baseline. Требует: npm run build && npm run start
 * Usage: node scripts/lighthouse-baseline.mjs [baseUrl]
 */
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outDir = join(process.cwd(), ".lighthouse");
mkdirSync(outDir, { recursive: true });

const paths = [
  "/ru",
  "/ru/catalog",
  "/ru/product/rattan-hal-round-natural-5",
  "/ru/checkout",
];

for (const path of paths) {
  const slug = path.replace(/\//g, "_").replace(/^_/, "") || "root";
  const url = `${base}${path}`;
  const out = join(outDir, `${slug}-mobile.json`);
  console.log(`→ ${url}`);
  const r = spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance,accessibility",
      "--screenEmulation.mobile=true",
      "--output=json",
      `--output-path=${out}`,
      "--quiet",
    ],
    { stdio: "inherit", shell: true },
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log(`Done. Reports in ${outDir}/`);
