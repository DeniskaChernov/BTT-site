"use client";

import { useIntent } from "@/contexts/IntentContext";
import { useTranslations } from "next-intl";

export function AdminInsightsStub() {
  const t = useTranslations("account");
  const { profile, ready } = useIntent();

  if (!ready || profile.confidence < 0.15) return null;

  return (
    <aside className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-stone-400">
      <p className="font-semibold text-stone-200">{t("insights_title")}</p>
      <p className="mt-2">{t("insights_lead")}</p>
      <ul className="mt-3 space-y-1 tabular-nums">
        <li>{t("insights_views", { count: profile.viewedSkus.length })}</li>
        <li>{t("insights_reads", { count: profile.readArticles.length })}</li>
        <li>{t("insights_cart", { count: profile.cartSkus.length })}</li>
      </ul>
    </aside>
  );
}
