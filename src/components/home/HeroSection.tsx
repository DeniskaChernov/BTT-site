"use client";

import { Link } from "@/i18n/navigation";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Sun, Trees } from "lucide-react";
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
    <section className="relative overflow-hidden">
      <div className="btt-mesh btt-grid-bg absolute inset-0 opacity-90" aria-hidden />
      <div
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-amber-600/15 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-orange-950/50 blur-[90px]"
        aria-hidden
      />

      <div className="relative btt-container py-12 md:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Текст + CTA — асимметричная колонка */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200/90">
                Bententrade · 2026
              </p>
              <h1 className="mt-6 text-3xl font-bold leading-[1.12] tracking-tight text-stone-50 md:text-4xl lg:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-400">
                {t("subtitle")}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/catalog">
                  <motion.span
                    className={cn(
                      bttPrimaryButtonClass,
                      "group inline-flex w-full items-center justify-center gap-2 px-8 py-3.5 shadow-orange-900/40 sm:w-auto"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("cta_buy")}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </motion.span>
                </Link>
                <Link href="/#quiz">
                  <motion.span
                    className="btt-glass-cta inline-flex w-full items-center justify-center sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("cta_pick")}
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Визуал — стекло + изображение */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-amber-950/30" />
                <div className="absolute inset-0 btt-shimmer opacity-40" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="btt-glass max-w-lg rounded-2xl p-5">
                    <p className="text-sm font-semibold text-stone-100">
                      {h("trust_ship")}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-400">
                      {h("trust_batch")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Плавающие иконки доверия */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {items.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="btt-glass flex items-center gap-3 p-4 transition hover:border-amber-500/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 text-amber-400 ring-1 ring-amber-500/20">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-sm font-medium leading-snug text-stone-200">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
