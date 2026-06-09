"use client";

import { useCart } from "@/contexts/CartContext";
import { estimateCartQuote } from "@/lib/cart/quote-estimator";
import { formatUzs } from "@/lib/pricing";
import { Link } from "@/i18n/navigation";
import { bttSecondaryAmberButtonClass } from "@/lib/ui-classes";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function QuoteEstimatorPanel() {
  const { lines, subtotalUz } = useCart();
  const t = useTranslations("cart");

  const estimate = useMemo(() => estimateCartQuote(lines), [lines]);

  if (lines.length === 0 || !estimate.suggestQuote) return null;

  return (
    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
      <p className="text-sm font-semibold text-stone-100">{t("quote_est_title")}</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-500">{t("quote_est_lead")}</p>
      <p className="mt-3 text-sm tabular-nums text-stone-300">
        {t("subtotal")}: <span className="font-semibold text-amber-300">{formatUzs(subtotalUz)}</span>
      </p>
      <Link
        href="/wholesale#lead"
        className={`${bttSecondaryAmberButtonClass} btt-focus mt-4 inline-flex text-xs`}
      >
        {t("quote_est_cta")}
      </Link>
    </div>
  );
}
