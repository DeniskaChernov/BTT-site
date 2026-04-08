"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function ArticlesTeaser() {
  const t = useTranslations("home");

  return (
    <section className="relative border-y border-white/[0.06] py-12 md:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
      <div className="btt-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl md:flex-row md:items-center md:p-8 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)]"
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
          <Link
            href="/articles"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15"
          >
            {t("articles_cta")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
