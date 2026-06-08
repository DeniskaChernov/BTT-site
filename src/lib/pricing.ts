import { getProductBySlug } from "@/data/products";
import type { Product } from "@/types/product";

const MIN_QTY_KG = 5;
const QTY_STEP_KG = 5;
export const MIN_PREORDER_QTY_KG = 100;
const TWISTED_RETAIL_UZS_PER_KG = 39_600;
const TWISTED_200PLUS_UZS_PER_KG = 34_600;
const TWISTED_400PLUS_UZS_PER_KG = 32_100;
const RATTAN_RETAIL_UZS_PER_KG = 36_000;
const RATTAN_200PLUS_UZS_PER_KG = 31_000;
const RATTAN_500PLUS_UZS_PER_KG = 28_500;

/** Нить и материалы с калибром — цена за кг; кашпо и аксессуары — цена за штуку (tiers те же пороги: 1–2 / 3–9 / 10+). */
export function isPricedPerKg(product: Product): boolean {
  return (
    product.category === "material" ||
    (product.category === "new" && product.thicknessMm > 0)
  );
}

export function isTwistedRattan(product: Product): boolean {
  return product.sku.includes("-TW-");
}

function isColorTierRattan(product: Product): boolean {
  return isPricedPerKg(product) && !isTwistedRattan(product);
}

function profileKey(product: Product): string {
  return `${product.shape}:${product.thicknessMm}:${product.profileWidthMm ?? 0}`;
}

/** Единая ступенька цены: для нити — сум/кг, для изделия — сум/шт. */
export function getPricePerKgForQty(product: Product, qty: number): number {
  if (isPricedPerKg(product) && isTwistedRattan(product)) {
    if (qty >= 400) return TWISTED_400PLUS_UZS_PER_KG;
    if (qty >= 200) return TWISTED_200PLUS_UZS_PER_KG;
    return TWISTED_RETAIL_UZS_PER_KG;
  }
  if (isPricedPerKg(product)) {
    if (qty >= 500) return RATTAN_500PLUS_UZS_PER_KG;
    if (qty >= 200) return RATTAN_200PLUS_UZS_PER_KG;
    return RATTAN_RETAIL_UZS_PER_KG;
  }
  if (qty >= 10) return product.priceUz.t10;
  if (qty >= 3) return product.priceUz.t5;
  return product.priceUz.t12;
}

export function lineItemTotalUz(product: Product, qty: number): number {
  const u = getPricePerKgForQty(product, qty);
  return Math.round(u * qty);
}

export type CartPricingLine = { sku: string; slug: string; qtyKg: number };

/** Пересчёт корзины с градацией по одному цвету (разные профили суммируются). */
export function computeCartPricing(lines: CartPricingLine[]): {
  lineTotals: Map<string, number>;
  subtotalUz: number;
} {
  const resolved = lines
    .map((line) => {
      const product = getProductBySlug(line.slug);
      return product ? { ...line, product } : null;
    })
    .filter((x): x is CartPricingLine & { product: Product } => x !== null);

  const profileColors = new Map<string, Set<string>>();
  for (const { product } of resolved) {
    if (!isColorTierRattan(product)) continue;
    const pk = profileKey(product);
    if (!profileColors.has(pk)) profileColors.set(pk, new Set());
    profileColors.get(pk)!.add(product.colorKey);
  }

  const tierDisabledProfiles = new Set<string>();
  for (const [pk, colors] of profileColors) {
    if (colors.size > 1) tierDisabledProfiles.add(pk);
  }

  const colorQty = new Map<string, number>();
  for (const { product, qtyKg } of resolved) {
    if (!isColorTierRattan(product)) continue;
    if (tierDisabledProfiles.has(profileKey(product))) continue;
    colorQty.set(product.colorKey, (colorQty.get(product.colorKey) ?? 0) + qtyKg);
  }

  const lineTotals = new Map<string, number>();
  let subtotalUz = 0;

  for (const { sku, qtyKg, product } of resolved) {
    let unitPrice: number;
    if (isColorTierRattan(product)) {
      if (tierDisabledProfiles.has(profileKey(product))) {
        unitPrice = RATTAN_RETAIL_UZS_PER_KG;
      } else {
        const totalColorQty = colorQty.get(product.colorKey) ?? qtyKg;
        unitPrice = getPricePerKgForQty(product, totalColorQty);
      }
    } else {
      unitPrice = getPricePerKgForQty(product, qtyKg);
    }
    const total = Math.round(unitPrice * qtyKg);
    lineTotals.set(sku, total);
    subtotalUz += total;
  }

  return { lineTotals, subtotalUz };
}

export function getQtyRules(product: Product): { min: number; step: number } {
  if (isPricedPerKg(product)) {
    if (product.category === "material" && product.stock === "on_order") {
      return { min: MIN_PREORDER_QTY_KG, step: QTY_STEP_KG };
    }
    return { min: MIN_QTY_KG, step: QTY_STEP_KG };
  }
  return { min: 1, step: 1 };
}

export function normalizeLineQty(product: Product, qty: number): number | null {
  if (isPricedPerKg(product)) {
    const { min, step } = getQtyRules(product);
    const normalized = Math.round(qty / step) * step;
    if (!Number.isFinite(normalized) || normalized < min) return null;
    return normalized;
  }
  const n = Math.round(qty);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

/** Ориентир для экспорта / иностранных партнёров (в карточке товара) */
export const UZS_PER_USD = 12_500;

/** Все цены на сайте — в сумах (UZS) */
export function formatUzs(amount: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
