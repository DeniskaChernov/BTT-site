import type { Product } from "@/types/product";

/** Цена за кг в зависимости от объёма по позиции (якорь 1–2 / 5 / 10+ кг) */
export function getPricePerKgForQty(product: Product, qtyKg: number): number {
  if (qtyKg >= 10) return product.priceUz.t10;
  if (qtyKg >= 3) return product.priceUz.t5;
  return product.priceUz.t12;
}

export const UZS_PER_USD = 12_500;

export function formatMoney(
  amountUz: number,
  currency: "UZS" | "USD",
  locale: string
): string {
  if (currency === "USD") {
    const usd = amountUz / UZS_PER_USD;
    return new Intl.NumberFormat(locale === "uz" ? "uz-UZ" : locale === "en" ? "en-US" : "ru-RU", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(usd);
  }
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountUz);
}
