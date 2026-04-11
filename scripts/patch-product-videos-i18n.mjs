import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const patches = {
  "messages/en.json": {
    videos_soon_title: "Video coming soon",
    videos_soon_body:
      "We're filming profile overviews, thickness comparisons, and install notes. For now, use the photo gallery and articles.",
  },
  "messages/uz.json": {
    videos_soon_title: "Video tez orada",
    videos_soon_body:
      "Profillar sharhi, qalinlik taqqoslash va o'rnatish bo'yicha materiallar suratga olinmoqda. Hozircha galereya va maqolalarga qarang.",
  },
};

for (const [rel, extra] of Object.entries(patches)) {
  const p = path.join(root, rel);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  if (j.product?.videos_soon_title) continue;
  j.product = { ...j.product, ...extra };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
  console.log("patched", rel);
}
