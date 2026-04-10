"use client";

import type { CollectiveCampaign, Locale, PriceLadderTier, Product } from "@/types/product";
import { trackEvent } from "@/lib/analytics";
import { formatUzs } from "@/lib/pricing";
import { telegramBotStartUrl } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock, Send, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type Props = {
  product: Product;
  collective: CollectiveCampaign;
  locale: Locale;
};

function tierPrice(product: Product, tier: PriceLadderTier) {
  return product.priceUz[tier];
}

function useDeadlineCountdown(deadlineAt: string) {
  const end = useMemo(() => new Date(deadlineAt).getTime(), [deadlineAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 30_000);
    tick();
    return () => window.clearInterval(id);
  }, [end]);

  const left = end - now;
  if (!Number.isFinite(end) || left <= 0) {
    return { ended: true as const, days: 0, hours: 0, minutes: 0 };
  }
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  return { ended: false as const, days, hours, minutes };
}

export function CollectivePdpPanel({ product, collective, locale }: Props) {
  const t = useTranslations("collective");
  const c = useTranslations("common");
  const retailTier = collective.retailPriceTier ?? "t12";
  const colTier = collective.collectivePriceTier ?? "t10";
  const retail = tierPrice(product, retailTier);
  const collectivePrice = tierPrice(product, colTier);
  const progressPct = Math.min(
    100,
    Math.round((collective.currentKg / Math.max(1, collective.targetKg)) * 100),
  );
  const remainingKg = Math.max(0, collective.targetKg - collective.currentKg);
  const countdown = useDeadlineCountdown(collective.deadlineAt);
  const botUrl = telegramBotStartUrl(collective.botStartParam);

  const onCta = () => {
    trackEvent("collective_join_click", {
      sku: product.sku,
      slug: product.slug,
      param: collective.botStartParam,
    });
  };

  return (
    <div
      className="mt-8 overflow-hidden rounded-3xl border border-amber-500/35 bg-gradient-to-br from-amber-950/50 via-stone-950/90 to-orange-950/40 p-5 shadow-[0_0_40px_rgba(245,158,11,0.12)]"
      role="region"
      aria-labelledby="collective-pdp-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
            {t("pdp_kicker")}
          </p>
          <h2 id="collective-pdp-title" className="mt-1 text-lg font-bold text-stone-50">
            {t("pdp_title")}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-stone-400">{t("pdp_sub")}</p>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          {t("badge_active")}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs text-stone-500">{t("retail_label")}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-stone-300 line-through decoration-stone-500">
            {formatUzs(retail)}
          </p>
          <p className="mt-3 text-xs text-stone-500">{t("collective_label")}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-300">
            {formatUzs(collectivePrice)}
          </p>
          <p className="mt-1 text-xs text-stone-500">{c("per_kg")}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-200">
            <TrendingUp className="h-4 w-4 text-amber-400" aria-hidden />
            {t("progress_label")}
          </div>
          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-800"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("progress_aria", { pct: progressPct })}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-stone-400">
            {t("progress_stats", {
              current: collective.currentKg,
              target: collective.targetKg,
              pct: progressPct,
            })}
          </p>
          <p className="mt-1 text-xs text-amber-200/90">
            {t("remaining_kg", { kg: remainingKg.toLocaleString(locale) })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-300">
        <Clock className="h-4 w-4 shrink-0 text-amber-400/90" aria-hidden />
        {countdown.ended ? (
          <span>{t("deadline_ended")}</span>
        ) : (
          <span>
            {t("deadline_remaining", {
              days: countdown.days,
              hours: countdown.hours,
              minutes: countdown.minutes,
            })}
          </span>
        )}
      </div>

      {collective.depositPct != null ? (
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          {t("deposit_hint", { pct: collective.depositPct })}
        </p>
      ) : null}

      <div className="mt-5">
        {botUrl ? (
          <motion.a
            href={botUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCta}
            className="btt-focus inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="h-4 w-4" aria-hidden />
            {t("join_bot")}
          </motion.a>
        ) : (
          <p className="text-sm text-amber-200/80">{t("bot_env_hint")}</p>
        )}
      </div>
      <p className={cn("mt-3 text-xs text-stone-600", botUrl && "md:max-w-xl")}>
        {t("pdp_disclaimer")}
      </p>
    </div>
  );
}
