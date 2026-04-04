import type { Product } from "@/types/product";

/** Цена за кг в зависимости от объёма по позиции (якорь 1–2 / 5 / 10+ кг) */
export function getPricePerKgForQty(product: Product, qtyKg: number): number {
  if (qtyKg >= 10) return product.priceUz.t10;
  if (qtyKg >= 3) return product.priceUz.t5;
  return product.priceUz.t12;
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
