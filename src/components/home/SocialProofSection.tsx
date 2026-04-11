"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

export function SocialProofSection() {
  const t = useTranslations("home");

  const blocks = [
    {
      quote: t("proof_1_quote"),
      meta: t("proof_1_meta"),
      title: t("reviews"),
    },
    {
      quote: t("proof_2_quote"),
      meta: t("proof_2_meta"),
      title: t("cases"),
    },
  ];

  const chips = [
    { key: "pay", label: t("trust_payments") },
    { key: "ship", label: t("trust_ship") },
    { key: "batch", label: t("trust_batch") },
  ];

  return (
    <section className="btt-container pb-20 pt-6 md:pb-28 md:pt-8">
      <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
          {t("proof_section_kicker")}
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl">
          {t("proof_section_title")}
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-400 md:text-base">
          {t("proof_section_lead")}
        </p>
      </div>
      <div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10 md:gap-3">
        {chips.map(({ key, label }) => (
          <span
            key={key}
            className="rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-medium text-stone-400 backdrop-blur-sm md:text-sm"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {blocks.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.07] to-transparent p-8 shadow-xl backdrop-blur-2xl"
          >
            <Quote className="absolute right-6 top-6 h-16 w-16 text-amber-500/10 transition group-hover:text-amber-500/20" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {b.title}
            </h2>
            <p className="relative mt-4 text-base leading-relaxed text-stone-300">
              {b.quote}
            </p>
            <p className="relative mt-4 text-xs text-stone-500">{b.meta}</p>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 transition group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
