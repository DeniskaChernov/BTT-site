import type { Product } from "@/types/product";

type BrochureSourceCard = {
  section: "semi_tube" | "twisted";
  article: string;
  image: string;
};

/** Source rows for brochure-derived rattan SKU/gallery — images from bententrade PDF catalog extraction. */
const BROCHURE_SOURCE_CARDS: BrochureSourceCard[] = [
  { section: "semi_tube", article: "1708", image: "/media/catalog/brochure-cards/semi-1708.png" },
  { section: "semi_tube", article: "0609", image: "/media/catalog/brochure-cards/semi-0609.png" },
  { section: "semi_tube", article: "0510", image: "/media/catalog/brochure-cards/semi-0510.png" },
  { section: "semi_tube", article: "1704", image: "/media/catalog/brochure-cards/semi-1704.png" },
  { section: "semi_tube", article: "1706", image: "/media/catalog/brochure-cards/semi-1706.png" },
  { section: "semi_tube", article: "1710", image: "/media/catalog/brochure-cards/semi-1710.png" },
  { section: "semi_tube", article: "2305", image: "/media/catalog/brochure-cards/semi-2305.png" },
  { section: "semi_tube", article: "5830", image: "/media/catalog/brochure-cards/semi-5830.png" },
  { section: "semi_tube", article: "2310", image: "/media/catalog/brochure-cards/semi-2310.png" },
  { section: "semi_tube", article: "2708", image: "/media/catalog/brochure-cards/semi-2708-light.png" },
  { section: "semi_tube", article: "2809", image: "/media/catalog/brochure-cards/semi-2809.png" },
  { section: "semi_tube", article: "2708", image: "/media/catalog/brochure-cards/semi-2708.png" },
  { section: "semi_tube", article: "0310", image: "/media/catalog/brochure-cards/semi-0310.png" },
  { section: "semi_tube", article: "3034", image: "/media/catalog/brochure-cards/semi-3034.png" },
  { section: "semi_tube", article: "3045", image: "/media/catalog/brochure-cards/semi-3045.png" },
  { section: "semi_tube", article: "0630", image: "/media/catalog/brochure-cards/semi-0630.png" },
  { section: "semi_tube", article: "2332", image: "/media/catalog/brochure-cards/semi-2332.png" },
  { section: "semi_tube", article: "2333", image: "/media/catalog/brochure-cards/semi-2333.png" },
  { section: "semi_tube", article: "0330", image: "/media/catalog/brochure-cards/semi-0330.png" },
  { section: "semi_tube", article: "2030", image: "/media/catalog/brochure-cards/semi-2030.png" },
  { section: "semi_tube", article: "2910", image: "/media/catalog/brochure-cards/semi-2910.png" },
  { section: "semi_tube", article: "6630", image: "/media/catalog/brochure-cards/semi-6630.png" },
  { section: "twisted", article: "0038K", image: "/media/catalog/brochure-cards/twisted-0038k.png" },
  { section: "twisted", article: "0080K", image: "/media/catalog/brochure-cards/twisted-0080k.png" },
  { section: "twisted", article: "2310K", image: "/media/catalog/brochure-cards/twisted-2310k.png" },
  { section: "twisted", article: "1710K", image: "/media/catalog/brochure-cards/twisted-1710k.png" },
  { section: "twisted", article: "1770K", image: "/media/catalog/brochure-cards/twisted-1770k.png" },
  { section: "twisted", article: "0099K", image: "/media/catalog/brochure-cards/twisted-0099k.png" },
  { section: "twisted", article: "3333K", image: "/media/catalog/brochure-cards/twisted-3333k.png" },
];

function slugifyArticle(article: string) {
  return article.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const BROCHURE_PRODUCTS: Product[] = (() => {
  const articleSeen: Record<string, number> = {};
  let nextId = 1000;

  return BROCHURE_SOURCE_CARDS.map((card) => {
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
