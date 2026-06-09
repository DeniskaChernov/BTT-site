"use client";

import type { CartLine } from "@/contexts/CartContext";
import { getProductBySlug } from "@/data/products";
import { getBulkMilestone } from "@/lib/cart/bulk-progress";
import { useTranslations } from "next-intl";

type Props = { line: CartLine };

export function CartBulkHint({ line }: Props) {
  const t = useTranslations("cart");
  const product = getProductBySlug(line.slug);
  if (!product) return null;

  const milestone = getBulkMilestone(product, line.qtyKg);
  if (!milestone) return null;

  return (
    <p className="mt-2 text-xs text-stone-200/80">
      {t("bulk_progress", {
        qty: line.qtyKg,
        next: milestone.nextQty,
        pct: Math.round(milestone.progress * 100),
      })}
    </p>
  );
}
