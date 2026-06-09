"use client";

import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { matchCollectiveCampaigns } from "@/lib/cart/collective-matcher";
import { telegramBotStartUrl } from "@/lib/telegram";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function CartCollectiveHint() {
  const { lines } = useCart();
  const t = useTranslations("cart");

  const matches = useMemo(
    () =>
      matchCollectiveCampaigns(
        lines.map((l) => ({ slug: l.slug, qtyKg: l.qtyKg })),
        products,
      ),
    [lines],
  );

  if (matches.length === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-emerald-500/25 bg-emerald-950/30 p-4 text-sm text-stone-300">
      <p className="font-semibold text-emerald-200/95">{t("collective_match_title")}</p>
      <ul className="mt-2 space-y-2">
        {matches.map((m) => (
          <li key={m.sku}>
            {m.name} — {t("collective_match_qty", { qty: String(m.qtyInCart) })}{" "}
            <a
              href={telegramBotStartUrl(m.botStartParam) ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-200 hover:text-stone-100"
            >
              {t("collective_match_cta")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
