"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import { products } from "@/data/products";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function CartUpsell() {
  const { lines } = useCart();
  const { profile, ready } = useIntent();
  const t = useTranslations("cart");

  const picks = useMemo(() => {
    if (!ready || lines.length === 0) return [];
    const exclude = new Set(lines.map((l) => l.sku));
    const pool = products.filter(
      (p) =>
        (p.category === "material" || p.category === "planter") &&
        !exclude.has(p.sku),
    );
    return rankProductsSimple(pool, {
      profile,
      purpose: "cart_upsell",
      limit: 3,
    });
  }, [lines, profile, ready]);

  if (picks.length === 0) return null;

  return (
    <section className="mt-12 border-t border-white/[0.06] pt-10">
      <h2 className="text-lg font-semibold text-stone-100">{t("upsell_title")}</h2>
      <p className="mt-1 text-sm text-stone-500">{t("upsell_lead")}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p) => (
          <div key={p.sku} className="h-full min-h-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
