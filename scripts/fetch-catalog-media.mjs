/**
 * Однократно подтягивает фото в public/media (Unsplash — свободная лицензия, ссылка в ATTRIBUTION.txt).
 * Запуск: node scripts/fetch-catalog-media.mjs
 *
 * Внимание: боевые картинки — PNG из Bententrade (`npm run media:import`).
 * Этот скрипт кладёт *.jpg; `product-media` / `site-media` ожидают *.png — не смешивайте без правки расширений.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outCatalog = path.join(root, "public", "media", "catalog");
const outSite = path.join(root, "public", "media", "site");

/** w/h для квадрата каталога; hero — широкий */
const Q = "auto=format&fit=crop&w=1200&h=1200&q=82";

const UNSPLASH = {
  _heroPanel: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&h=1080&q=82`,
  _catRattan: `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?${Q}`,
  _catPlanter: `https://images.unsplash.com/photo-1485955900006-10f4d324d411?${Q}`,
  _catTwist: `https://images.unsplash.com/photo-1464226184884-fa280b87c399?${Q}`,
  _catNew: `https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?${Q}`,

  "btt-hr5nat": `https://images.unsplash.com/photo-1556228720-195a672e8a03?${Q}`,
  "btt-fl6blk": `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?${Q}`,
  "btt-rd4brn": `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?${Q}`,
  "btt-ov7wht": `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?${Q}`,
  "btt-hr5gry": `https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?${Q}`,
  "btt-kshbskm": `https://images.unsplash.com/photo-1631679706909-1844bbd07221?${Q}`,
  "btt-kshlnl": `https://images.unsplash.com/photo-1556911220-e15b29be8c8f?${Q}`,
  "btt-fl8nat": `https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?${Q}`,
  "btt-rd3blk": `https://images.unsplash.com/photo-1600566752355-35792bedcfea?${Q}`,
  "btt-hr6wht": `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?${Q}`,
  "btt-kshbwls": `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?${Q}`,
  "btt-ov6nat": `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?${Q}`,
  "btt-fl5gry": `https://images.unsplash.com/photo-1600607687644-c7171b42498f?${Q}`,
  "btt-rd4wht": `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?${Q}`,
  "btt-kshtwxl": `https://images.unsplash.com/photo-1464226184884-fa280b87c399?${Q}`,
  "btt-hr7brn": `https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?${Q}`,
  "btt-fl5wht": `https://images.unsplash.com/photo-1600566752355-35792bedcfea?${Q}`,
  "btt-rd6nat": `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?${Q}`,
  "btt-kshset": `https://images.unsplash.com/photo-1485955900006-10f4d324d411?${Q}`,
  "btt-ov5blk": `https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?${Q}`,
};

async function download(url, destPath) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  console.log("ok", path.relative(root, destPath), buf.length);
}

async function main() {
  fs.mkdirSync(outCatalog, { recursive: true });
  fs.mkdirSync(outSite, { recursive: true });

  await download(UNSPLASH._heroPanel, path.join(outSite, "hero-panel.jpg"));

  await download(UNSPLASH._catRattan, path.join(outSite, "btt-cat-rattan.jpg"));
  await download(UNSPLASH._catPlanter, path.join(outSite, "btt-cat-planter.jpg"));
  await download(UNSPLASH._catTwist, path.join(outSite, "btt-cat-twist.jpg"));
  await download(UNSPLASH._catNew, path.join(outSite, "btt-cat-new.jpg"));

  for (const [seed, url] of Object.entries(UNSPLASH)) {
    if (seed.startsWith("_")) continue;
    await download(url, path.join(outCatalog, `${seed}.jpg`));
  }

  const attrib = path.join(root, "public", "media", "ATTRIBUTION.txt");
  fs.writeFileSync(
    attrib,
    [
      "Фото в media/catalog и media/site загружены с Unsplash (бесплатная лицензия Unsplash).",
      "Замените файлы своими снимками с теми же именами: catalog/<imageSeed>.jpg",
      "Либо добавьте product.gallery в src/data/products.ts.",
      "",
      "https://unsplash.com/license",
      "",
    ].join("\n"),
    "utf8",
  );
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
