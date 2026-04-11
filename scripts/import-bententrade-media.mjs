/**
 * Копирует фото из сборки Bententrade (build/assets/*.png) в public/media.
 * Имена хэшей — из импортов figma:asset в исходниках CatalogPage / Trend2025 / Gallery.
 *
 * Запуск: node scripts/import-bententrade-media.mjs [путь_к_build]
 * По умолчанию: %USERPROFILE%/Desktop/Bententrade Websitee/build/assets
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const defaultAssets = path.join(
  process.env.USERPROFILE || "",
  "Desktop",
  "Bententrade Websitee",
  "build",
  "assets",
);

const srcDir = path.resolve(process.argv[2] || defaultAssets);
const outCatalog = path.join(root, "public", "media", "catalog");
const outSite = path.join(root, "public", "media", "site");

/** imageSeed → имя файла в build/assets (только хэш-префикс достаточен для поиска) */
const CATALOG = {
  "btt-hr5nat": "4935765782b02872c39cba831afac4bbbce963a0",
  "btt-fl6blk": "f17fb0aea8be133d85d1ee2034c446e7b7cb7825",
  "btt-rd4brn": "177f1c7cd3459b0703ab2446345b951405612976",
  "btt-ov7wht": "eb870a79ea96a752b4661fca27c38a9e37139df9",
  "btt-hr5gry": "1d08d05a3da1322da08256c31cbbf11eeccea4a9",
  "btt-kshbskm": "aaa3f6c434f81fb8787b230c4e80ff40a3ff1805",
  "btt-kshlnl": "734c7fe27be9c768b54eb373aeac20283920d105",
  "btt-fl8nat": "c68a06636b80ab92df7afcd6fd298f4a16d5a241",
  "btt-rd3blk": "ef423c69ddac97a18befa6f16beabc634c309e09",
  "btt-hr6wht": "db2a62875e77da60e8554a91076168a4e7227223",
  "btt-kshbwls": "dec339423c65660420decd542cca4f740c2299fb",
  "btt-ov6nat": "efdbb313e67c9a0f8732fe579446757fb7a204c3",
  "btt-fl5gry": "c1b3a16137e1769f526c741e5ca9497aa721ae6d",
  "btt-rd4wht": "079b54909d5ddebe540fb63575239bb603b00f6b",
  "btt-kshtwxl": "7b97b4d791cb0828b7e0ffd655bfc0d9afdf172d",
  "btt-hr7brn": "fbf8283c67ac97c1347b3472c1517ee1ae106119",
  "btt-fl5wht": "d17b9362fc21ad53ca996a3b990bb483b7ab28d5",
  "btt-rd6nat": "aa6eddd7d37a9c9221523b2cbc73643ebacbcd2c",
  "btt-kshset": "ee3cad7c86c64ba4f0451d2507d30fd34b6ad147",
  "btt-ov5blk": "77acd21929ba49dbfb8d60d9c2295c649be7e90c",
};

const SITE = {
  "hero-panel": "4a325745d14bda219a7c6548cbb5b9e9b8c0bd41",
  "btt-cat-rattan": "a9aee619de7250b8cf34489811e56a2ad526e961",
  "btt-cat-planter": "6d9496c1540d1c8b9f1aaa416fd88b8490415176",
  "btt-cat-twist": "4935765782b02872c39cba831afac4bbbce963a0",
  "btt-cat-new": "5f133ac607b25721754cfe9f973bbe34b26e36ed",
};

function findByHash(dir, hashPrefix) {
  const names = fs.readdirSync(dir);
  const hit = names.find((n) => n.startsWith(hashPrefix) && n.endsWith(".png"));
  if (!hit) throw new Error(`Нет PNG с префиксом ${hashPrefix} в ${dir}`);
  return path.join(dir, hit);
}

function main() {
  if (!fs.existsSync(srcDir)) {
    console.error("Папка не найдена:", srcDir);
    process.exit(1);
  }

  fs.mkdirSync(outCatalog, { recursive: true });
  fs.mkdirSync(outSite, { recursive: true });

  for (const [seed, hash] of Object.entries(CATALOG)) {
    const from = findByHash(srcDir, hash);
    const to = path.join(outCatalog, `${seed}.png`);
    fs.copyFileSync(from, to);
    console.log("catalog", seed, "←", path.basename(from));
  }

  for (const [name, hash] of Object.entries(SITE)) {
    const from = findByHash(srcDir, hash);
    const to = path.join(outSite, `${name}.png`);
    fs.copyFileSync(from, to);
    console.log("site", name, "←", path.basename(from));
  }

  const attrib = path.join(root, "public", "media", "ATTRIBUTION.txt");
  fs.writeFileSync(
    attrib,
    [
      "Фото каталога и блока героя скопированы из сборки Bententrade (исходные PNG из Figma).",
      "Повторная заливка: node scripts/import-bententrade-media.mjs",
      "",
    ].join("\n"),
    "utf8",
  );

  console.log("done");
}

main();
