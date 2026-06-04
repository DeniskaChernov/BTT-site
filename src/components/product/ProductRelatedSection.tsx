"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useIntent } from "@/contexts/IntentContext";
import { products } from "@/data/products";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import type { Product } from "@/types/product";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type Props = { product: Product };

export function ProductRelatedSection({ product }: Props) {
  const { profile, ready } = useIntent();
  const t = useTranslations("product");

  const related = useMemo(() => {
    const pool = products.filter((p) => p.sku !== product.sku);
    if (!ready) {
      return pool.filter((p) => p.category === product.category).slice(0, 4);
    }
    return rankProductsSimple(pool, {
      profile,
      purpose: "pdp_cross_sell",
      currentSlug: product.slug,
      excludeSkus: [product.sku],
      limit: 4,
    });
  }, [product, profile, ready]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold text-stone-100">{t("cross")}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((p) => (
          <div key={p.sku} className="h-full min-h-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
