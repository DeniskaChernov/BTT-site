"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useIntent } from "@/contexts/IntentContext";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import type { Locale, Product } from "@/types/product";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

type Props = { product: Product; compact?: boolean };

export function ProductRelatedSection({ product, compact = false }: Props) {
  const locale = useLocale() as Locale;
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

  if (compact) {
    return (
      <div className="mt-16">
        <h2 className="text-xl font-bold text-stone-100">{t("cross")}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {related.map((p) => (
            <li key={p.sku}>
              <Link
                href={`/product/${p.slug}`}
                className="btt-focus flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm transition hover:border-white/18"
              >
                <span className="font-medium text-stone-100">{p.names[locale]}</span>
                <span className="shrink-0 text-xs text-stone-500">{p.sku}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

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
