"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EASE } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

export function ArticlesTeaser() {
  const t = useTranslations("home");
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative py-12 md:py-16">
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            ease: [...BTT_EASE],
          }}
          whileHover={
            reduceMotion
              ? undefined
              : {
                  y: -2,
                  transition: { duration: 0.25, ease: [...BTT_EASE] },
                }
          }
          className="flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-white/[0.08] border-l-amber-500/35 bg-gradient-to-r from-white/[0.04] to-white/[0.02] p-6 backdrop-blur-xl md:flex-row md:items-center md:p-8 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)] motion-reduce:hover:translate-y-0"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
              {t("articles_kicker")}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl">
              {t("articles_title")}
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-400 md:text-base">
              {t("articles_lead")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/articles/rattan-thickness-furniture"
              className="group btt-focus inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-400/45 hover:bg-emerald-500/15 motion-reduce:transition-none"
            >
              {t("articles_featured")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </Link>
            <Link
              href="/articles"
              className="group btt-focus inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15 motion-reduce:transition-none"
            >
              {t("articles_cta")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
