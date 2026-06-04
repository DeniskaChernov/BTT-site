import { getProductBySlug } from "@/data/products";
import {
  getPricePerKgForQty,
  isPricedPerKg,
  isTwistedRattan,
  lineItemTotalUz,
} from "@/lib/pricing";
import type { CartLine } from "@/contexts/CartContext";
import type { IntentProfile } from "@/lib/intent/types";

export type QuoteEstimate = {
  subtotalUz: number;
  potentialSaveUz: number;
  materialKg: number;
  lineCount: number;
  suggestQuote: boolean;
};

function tierSaveAtNextMilestone(product: ReturnType<typeof getProductBySlug>, qty: number): number {
  if (!product || !isPricedPerKg(product) || product.category !== "material") return 0;
  const perNow = getPricePerKgForQty(product, qty);
  const nextQty = isTwistedRattan(product)
    ? qty < 200
      ? 200
      : qty < 400
        ? 400
        : null
    : qty < 200
      ? 200
      : qty < 500
        ? 500
        : null;
  if (!nextQty) return 0;
  const perNext = getPricePerKgForQty(product, nextQty);
  if (perNext >= perNow) return 0;
  return Math.round((perNow - perNext) * qty);
}

export function estimateCartQuote(
  lines: CartLine[],
  profile: IntentProfile,
): QuoteEstimate {
  let subtotalUz = 0;
  let potentialSaveUz = 0;
  let materialKg = 0;

  for (const line of lines) {
    const p = getProductBySlug(line.slug);
    if (!p) continue;
    subtotalUz += lineItemTotalUz(p, line.qtyKg);
    potentialSaveUz += tierSaveAtNextMilestone(p, line.qtyKg);
    if (isPricedPerKg(p) && p.category === "material") {
      materialKg += line.qtyKg;
    }
  }

  const suggestQuote =
    profile.journey === "production" ||
    profile.volumeIntent === "bulk" ||
    materialKg >= 50 ||
    lines.length >= 4;

  return {
    subtotalUz,
    potentialSaveUz,
    materialKg,
    lineCount: lines.length,
    suggestQuote,
  };
}
