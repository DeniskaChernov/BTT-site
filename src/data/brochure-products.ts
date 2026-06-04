import type { Product } from "@/types/product";

type BrochureSourceCard = {
  section: "semi_tube" | "twisted";
  article: string;
  image: string;
  variant?: "light" | "standard";
};

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
  { section: "semi_tube", article: "2708", image: "/media/catalog/brochure-cards/semi-2708-light.png", variant: "light" },
  { section: "semi_tube", article: "2809", image: "/media/catalog/brochure-cards/semi-2809.png" },
  { section: "semi_tube", article: "2708", image: "/media/catalog/brochure-cards/semi-2708.png", variant: "standard" },
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
  { section: "twisted", article: "0808K", image: "/media/catalog/brochure-cards/twisted-0808k.png" },
  { section: "twisted", article: "2310K", image: "/media/catalog/brochure-cards/twisted-2310k.png" },
  { section: "twisted", article: "1710K", image: "/media/catalog/brochure-cards/twisted-1710k.png" },
  { section: "twisted", article: "1770K", image: "/media/catalog/brochure-cards/twisted-1770k.png" },
  { section: "twisted", article: "0099K", image: "/media/catalog/brochure-cards/twisted-0099k.png" },
  { section: "twisted", article: "3333K", image: "/media/catalog/brochure-cards/twisted-3333k.png" },
];

function slugifyArticle(article: string) {
  return article.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function parseBrochureGauge(article: string, isTwisted: boolean): {
  profileWidthMm?: number;
  thicknessMm: number;
} {
  const digits = article.replace(/[^0-9]/g, "");
  if (digits.length >= 4) {
    const w = Number.parseInt(digits.slice(0, 2), 10);
    const t = Number.parseInt(digits.slice(2, 4), 10);
    if (Number.isFinite(w) && Number.isFinite(t) && w > 0 && t > 0) {
      if (isTwisted) return { thicknessMm: t >= 10 ? t : w };
      return { profileWidthMm: w, thicknessMm: t };
    }
  }
  return { thicknessMm: 5 };
}

function variantLabel(locale: "ru" | "uz" | "en", variant: BrochureSourceCard["variant"]): string {
  if (variant === "light") {
    return locale === "ru" ? "светлый тон" : locale === "uz" ? "och rang" : "light tone";
  }
  if (variant === "standard") {
    return locale === "ru" ? "натуральный тон" : locale === "uz" ? "tabiiy rang" : "natural tone";
  }
  return "";
}

function gaugeLabel(
  locale: "ru" | "uz" | "en",
  gauge: ReturnType<typeof parseBrochureGauge>,
  isTwisted: boolean,
): string {
  const unit = locale === "ru" ? "мм" : "mm";
  if (isTwisted) return `Ø${gauge.thicknessMm} ${unit}`;
  if (gauge.profileWidthMm) return `${gauge.profileWidthMm}×${gauge.thicknessMm} ${unit}`;
  return `${gauge.thicknessMm} ${unit}`;
}

function buildBrochureCopy(
  card: BrochureSourceCard,
  gauge: ReturnType<typeof parseBrochureGauge>,
): Pick<Product, "names" | "short" | "bullets"> {
  const isTwisted = card.section === "twisted";
  const variantRu = variantLabel("ru", card.variant);
  const variantUz = variantLabel("uz", card.variant);
  const variantEn = variantLabel("en", card.variant);
  const sizeRu = gaugeLabel("ru", gauge, isTwisted);
  const sizeUz = gaugeLabel("uz", gauge, isTwisted);
  const sizeEn = gaugeLabel("en", gauge, isTwisted);

  if (isTwisted) {
    return {
      names: {
        ru: `Кручёный ротанг ${sizeRu} · арт. ${card.article}`,
        uz: `Burama rattan ${sizeUz} · art. ${card.article}`,
        en: `Twisted rattan ${sizeEn} · art. ${card.article}`,
      },
      short: {
        ru: `Кручёный профиль ${sizeRu} для плетения мебели и декора. UV-стабилизация, отгрузка от 5 кг. Артикул ${card.article}.`,
        uz: `Mebel va dekor uchun burama profil ${sizeUz}. UV barqaror, 5 kg dan jo‘natma. Artikel ${card.article}.`,
        en: `Twisted profile ${sizeEn} for furniture and decor weaving. UV-stabilized, shipped from 5 kg. Article ${card.article}.`,
      },
      bullets: {
        ru: [`Профиль ${sizeRu}`, "Кручёная фактура", "Улица и интерьер", "От 5 кг", `Арт. ${card.article}`],
        uz: [`Profil ${sizeUz}`, "Burama faktura", "Kocha va uy", "5 kg dan", `Art. ${card.article}`],
        en: [`Profile ${sizeEn}`, "Twisted texture", "Outdoor & indoor", "From 5 kg", `Art. ${card.article}`],
      },
    };
  }

  const nameSuffixRu = variantRu ? `, ${variantRu}` : "";
  const nameSuffixEn = variantEn ? `, ${variantEn}` : "";

  return {
    names: {
      ru: `Полутрубка ${sizeRu}${nameSuffixRu} · арт. ${card.article}`,
      uz: `Yarim trubka ${sizeUz}${variantUz ? `, ${variantUz}` : ""} · art. ${card.article}`,
      en: `Semi-tube ${sizeEn}${nameSuffixEn ? `, ${variantEn}` : ""} · art. ${card.article}`,
    },
    short: {
      ru: `G-профиль ${sizeRu}${variantRu ? `, ${variantRu}` : ""} — для каркасов мебели и кашпо. Жёсткий профиль, стабильная партия цвета. Арт. ${card.article}.`,
      uz: `G-profil ${sizeUz}${variantUz ? `, ${variantUz}` : ""} — mebel karkasi va kashpo uchun. Art. ${card.article}.`,
      en: `G-profile ${sizeEn}${variantEn ? `, ${variantEn}` : ""} — for furniture frames and planters. Art. ${card.article}.`,
    },
    bullets: {
      ru: [`Сечение ${sizeRu}`, variantRu ? `Оттенок: ${variantRu}` : "Натуральный", "Каркасы и кашпо", "От 5 кг", `Арт. ${card.article}`],
      uz: [`Kesim ${sizeUz}`, variantUz ? `Rang: ${variantUz}` : "Tabiiy", "Karkas va kashpo", "5 kg dan", `Art. ${card.article}`],
      en: [`Section ${sizeEn}`, variantEn ? `Tone: ${variantEn}` : "Natural", "Frames & planters", "From 5 kg", `Art. ${card.article}`],
    },
  };
}

export const BROCHURE_PRODUCTS: Product[] = BROCHURE_SOURCE_CARDS.map((card, index) => {
  const isTwisted = card.section === "twisted";
  const articleSafe = slugifyArticle(card.article);
  const variantSlug =
    card.variant === "light" ? "-light" : card.variant === "standard" ? "" : "";
  const skuCore = isTwisted ? `RTN-TW-${card.article}` : `RTN-ST-${card.article}`;
  const sku = !isTwisted && card.variant === "light" ? `${skuCore}-LT` : skuCore;
  const slug = `${isTwisted ? "rattan-twisted" : "rattan-semi-tube"}-${articleSafe}${variantSlug}`;
  const gauge = parseBrochureGauge(card.article, isTwisted);
  const copy = buildBrochureCopy(card, gauge);

  return {
    id: String(1000 + index),
    slug,
    sku,
    category: "material",
    ...copy,
    application: "both",
    hardness: isTwisted ? "medium" : "rigid",
    thicknessMm: gauge.thicknessMm,
    profileWidthMm: gauge.profileWidthMm,
    colorKey: "natural",
    shape: isTwisted ? "round" : "half_round",
    stock: "in_stock",
    priceUz: { t12: 36_000, t5: 31_000, t10: 8_500 },
    imageSeed: `brochure-${isTwisted ? "twisted" : "semi"}-${articleSafe}${variantSlug}`,
    gallery: [card.image],
    isBrochure: true,
  };
});
