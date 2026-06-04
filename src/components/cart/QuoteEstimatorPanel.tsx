"use client";

import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import { estimateCartQuote } from "@/lib/cart/quote-estimator";
import { formatUzs } from "@/lib/pricing";
import { Link } from "@/i18n/navigation";
import { bttSecondaryAmberButtonClass } from "@/lib/ui-classes";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function QuoteEstimatorPanel() {
  const { lines, subtotalUz } = useCart();
  const { profile } = useIntent();
  const t = useTranslations("cart");

  const estimate = useMemo(
    () => estimateCartQuote(lines, profile),
    [lines, profile],
  );

  if (lines.length === 0 || !estimate.suggestQuote) return null;

  return (
    <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-950/20 p-4">
      <p className="text-sm font-semibold text-amber-100">{t("quote_est_title")}</p>
      <p className="mt-1 text-xs text-stone-400">{t("quote_est_lead")}</p>
      <dl className="mt-3 grid gap-2 text-xs text-stone-300">
        <div className="flex justify-between gap-4">
          <dt>{t("subtotal")}</dt>
          <dd className="tabular-nums font-semibold text-stone-100">
            {formatUzs(subtotalUz)}
          </dd>
        </div>
        {estimate.materialKg > 0 ? (
          <div className="flex justify-between gap-4">
            <dt>{t("quote_est_material_kg")}</dt>
            <dd className="tabular-nums">{estimate.materialKg} kg</dd>
          </div>
        ) : null}
        {estimate.potentialSaveUz > 0 ? (
          <div className="flex justify-between gap-4 text-amber-200/90">
            <dt>{t("quote_est_tier_hint")}</dt>
            <dd className="tabular-nums">−{formatUzs(estimate.potentialSaveUz)}</dd>
          </div>
        ) : null}
      </dl>
      <Link href="/wholesale#lead" className={`${bttSecondaryAmberButtonClass} btt-focus mt-4 inline-flex text-xs`}>
        {t("quote_est_cta")}
      </Link>
    </div>
  );
}
