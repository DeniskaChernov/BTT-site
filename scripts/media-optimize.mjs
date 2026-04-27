import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGETS = [
  path.join(ROOT, "public", "media", "site"),
  path.join(ROOT, "public", "media", "catalog"),
];

const QUALITY_WEBP = Number(process.env.MEDIA_WEBP_QUALITY || 82);
const QUALITY_AVIF = Number(process.env.MEDIA_AVIF_QUALITY || 52);

async function listFiles(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFiles(full)));
      continue;
    }
    if (!/\.(png|jpe?g)$/i.test(e.name)) continue;
    out.push(full);
  }
  return out;
}

async function run() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("sharp is required for media optimization. Run `npm i -D sharp`.");
    process.exit(1);
  }

  const files = (await Promise.all(TARGETS.map((dir) => listFiles(dir)))).flat();
  let converted = 0;
  for (const src of files) {
    const base = src.replace(/\.(png|jpe?g)$/i, "");
    const webp = `${base}.webp`;
    const avif = `${base}.avif`;
    try {
      await sharp(src).webp({ quality: QUALITY_WEBP }).toFile(webp);
      await sharp(src).avif({ quality: QUALITY_AVIF }).toFile(avif);
      converted += 1;
      console.log(`optimized: ${path.relative(ROOT, src)}`);
    } catch (error) {
      console.warn(`skip: ${path.relative(ROOT, src)} (${String(error)})`);
    }
  }
  console.log(`done. converted ${converted} source files`);
}

run();
