import type { Product } from "@/types/product";

/**
 * Габариты для карточки/PDP: при заданных двух габаритах — W×T; для круга — ØD; иначе одна цифра, мм.
 */
export function formatProfileGauge(product: Product, locale: "ru" | "en" | "uz"): string {
  const t = product.thicknessMm;
  if (!Number.isFinite(t) || t <= 0) return "—";
  const w = product.profileWidthMm;
  const unit = locale === "ru" ? "мм" : "mm";
  if (w && Number.isFinite(w) && w > 0 && w !== t) {
    return `${w}×${t} ${unit}`;
  }
  if (product.shape === "round") {
    return `Ø${t} ${unit}`;
  }
  return `${t} ${unit}`;
}
