import { BROCHURE_RATTAN_CARDS } from "@/data/brochure-rattan";
import type { Product } from "@/types/product";

function slugifyArticle(article: string) {
  return article.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const BROCHURE_PRODUCTS: Product[] = (() => {
  const articleSeen: Record<string, number> = {};
  let nextId = 1000;

  return BROCHURE_RATTAN_CARDS.map((card) => {
    const key = `${card.section}:${card.article}`;
    articleSeen[key] = (articleSeen[key] ?? 0) + 1;
    const duplicateIndex = articleSeen[key];
    const suffix = duplicateIndex > 1 ? `-${duplicateIndex}` : "";

    const isTwisted = card.section === "twisted";
    const articleSafe = slugifyArticle(card.article);
    const skuCore = isTwisted ? `RTN-TW-${card.article}` : `RTN-ST-${card.article}`;
    const sku = `${skuCore}${duplicateIndex > 1 ? `-${duplicateIndex}` : ""}`;
    const slug = `${isTwisted ? "rattan-twisted" : "rattan-semi-tube"}-${articleSafe}${suffix}`;

    return {
      id: String(nextId++),
      slug,
      sku,
      category: "material",
      names: {
        ru: `${isTwisted ? "Крученый ротанг" : "Ротанг полутрубка"} · арт. ${card.article}`,
        uz: `${isTwisted ? "Burama rattan" : "Yarim trubka rattan"} · art. ${card.article}`,
        en: `${isTwisted ? "Twisted rattan" : "Semi-tube rattan"} · art. ${card.article}`,
      },
      short: {
        ru: `${isTwisted ? "Крученый профиль" : "Профиль полутрубка"} из PDF-каталога Bententrade. Артикул: ${card.article}.`,
        uz: `${isTwisted ? "Burama profil" : "Yarim trubka profil"} Bententrade PDF katalogidan. Artikel: ${card.article}.`,
        en: `${isTwisted ? "Twisted profile" : "Semi-tube profile"} from the Bententrade PDF catalog. Article: ${card.article}.`,
      },
      bullets: {
        ru: [
          `Арт. ${card.article}`,
          isTwisted ? "Крученый профиль" : "Полутрубка",
          "Цена за кг",
          "Шаг 5 кг",
          "Фото из PDF",
        ],
        uz: [
          `Art. ${card.article}`,
          isTwisted ? "Burama profil" : "Yarim trubka",
          "kg narxi",
          "5 kg qadam",
          "PDF foto",
        ],
        en: [
          `Art. ${card.article}`,
          isTwisted ? "Twisted profile" : "Semi-tube",
          "Per-kg pricing",
          "5 kg step",
          "Photo from PDF",
        ],
      },
      application: "both",
      hardness: isTwisted ? "medium" : "rigid",
      thicknessMm: 5,
      colorKey: "natural",
      shape: isTwisted ? "round" : "half_round",
      stock: "in_stock",
      priceUz: { t12: 39_600, t5: 34_600, t10: 32_100 },
      imageSeed: `brochure-${isTwisted ? "twisted" : "semi"}-${articleSafe}${suffix}`,
      gallery: [card.image],
      isBrochure: true,
    };
  });
})();

