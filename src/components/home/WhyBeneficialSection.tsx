"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Gauge, Layers, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Gauge, Layers, CheckCircle2, Sparkles] as const;

export function WhyBeneficialSection() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const items = [
    { title: s("benefits_1_title"), body: s("benefits_1_body") },
    { title: s("benefits_2_title"), body: s("benefits_2_body") },
    { title: s("benefits_3_title"), body: s("benefits_3_body") },
    { title: s("benefits_4_title"), body: s("benefits_4_body") },
  ];

  return (
    <section
      className="relative py-16 md:py-20"
      aria-labelledby="home-benefits-title"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            ease: [...BTT_EASE],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
            {s("benefits_kicker")}
          </p>
          <h2
            id="home-benefits-title"
            className="mt-3 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl"
          >
            {s("benefits_title")}
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-stone-400 md:text-lg">
            {s("benefits_sub")}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 auto-rows-fr gap-4 md:mt-12 md:grid-cols-2">
          {items.map((it, i) => {
            const Icon = ICONS[i]!;
            return (
              <motion.article
                key={it.title}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.07),
                  ease: [...BTT_EASE],
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.25, ease: [...BTT_EASE] } }
                }
                className="group relative flex h-full gap-4 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 hover:border-amber-500/35 motion-reduce:hover:translate-y-0 md:p-7"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600/30 to-orange-950/40 text-amber-300 ring-1 ring-white/[0.06] transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-stone-50 md:text-xl">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400 md:text-base">
                    {it.body}
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
