"use client";

import { useCart } from "@/contexts/CartContext";
import { suggestCartOptimizations } from "@/lib/cart/cart-optimizer";
import { formatUzs } from "@/lib/pricing";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function CartOptimizerHint() {
  const { lines, updateQty } = useCart();
  const t = useTranslations("cart");
  const hints = useMemo(() => suggestCartOptimizations(lines), [lines]);

  if (hints.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
      <p className="text-sm font-semibold text-stone-100">{t("optimizer_title")}</p>
      <p className="mt-1 text-xs text-stone-500">{t("optimizer_lead")}</p>
      <ul className="mt-3 space-y-2">
        {hints.map((h) => (
          <li
            key={h.sku}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2 text-xs"
          >
            <span className="text-stone-300">
              {h.name}: {t("optimizer_suggest", { qty: h.suggestQty, save: formatUzs(h.saveUz) })}
            </span>
            <button
              type="button"
              onClick={() => updateQty(h.sku, h.suggestQty)}
              className="rounded-full border border-amber-500/40 px-3 py-1 font-semibold text-amber-200 transition hover:bg-amber-500/10"
            >
              {t("optimizer_apply")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
