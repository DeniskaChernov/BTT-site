"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Sun, Droplets, Trees } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");
  const h = useTranslations("home");

  const items = [
    { icon: Sun, label: t("trust_sun") },
    { icon: Droplets, label: t("trust_water") },
    { icon: Trees, label: t("trust_outdoor") },
  ];

  return (
    <section className="relative overflow-hidden border-b border-btt-border bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(15,61,46,0.12),transparent),radial-gradient(900px_500px_at_90%_10%,rgba(196,92,38,0.12),transparent)]">
      <div className="btt-container grid gap-12 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-btt-muted">
            Bententrade
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-btt-primary md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-btt-muted">{t("subtitle")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full bg-btt-primary px-6 py-3 text-sm font-semibold text-white shadow-btt transition hover:bg-[var(--btt-primary-hover)]"
            >
              {t("cta_buy")}
            </Link>
            <Link
              href="/#quiz"
              className="inline-flex items-center justify-center rounded-full border border-btt-border bg-btt-surface px-6 py-3 text-sm font-semibold shadow-btt-sm transition hover:border-btt-primary/30"
            >
              {t("cta_pick")}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-4 text-sm text-btt-muted">
            <li className="rounded-full border border-btt-border bg-white/70 px-3 py-1">
              {t("micro_total")}
            </li>
            <li className="rounded-full border border-btt-border bg-white/70 px-3 py-1">
              {t("micro_guest")}
            </li>
            <li className="rounded-full border border-btt-border bg-white/70 px-3 py-1">
              {h("trust_payments")}
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative"
        >
          <div className="btt-card relative aspect-[4/3] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-btt border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md">
              <p className="text-sm font-medium">{h("trust_ship")}</p>
              <p className="mt-1 text-xs text-white/80">{h("trust_batch")}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {items.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="btt-card flex items-center gap-3 p-4 transition hover:shadow-btt"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-btt-primary/10 text-btt-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm font-medium leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
