"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { Building2, Camera, CalendarDays, Users2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function TrustCountersSection() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const counters = [
    {
      value: s("trust_companies_value"),
      label: s("trust_companies_label"),
      Icon: Building2,
    },
    {
      value: s("trust_buyers_value"),
      label: s("trust_buyers_label"),
      Icon: Users2,
    },
    {
      value: s("trust_years_value"),
      label: s("trust_years_label"),
      Icon: CalendarDays,
    },
  ];

  return (
    <section className="relative py-8 md:py-12" aria-labelledby="home-trust-title">
      <div className="btt-container">
        <div className="rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl md:p-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [...BTT_EASE] }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400/80">
              {s("trust_kicker")}
            </p>
            <h2
              id="home-trust-title"
              className="mt-3 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl"
            >
              {s("trust_title")}
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-400 md:text-base">
              {s("trust_sub")}
            </p>
          </motion.div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {counters.map(({ value, label, Icon }, i) => (
              <motion.li
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.08),
                  ease: [...BTT_EASE],
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, transition: { duration: 0.22, ease: [...BTT_EASE] } }
                }
                className="group flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-black/25 p-5 shadow-inner shadow-black/20 transition-colors duration-200 hover:border-white/18 hover:bg-black/35 motion-reduce:hover:translate-y-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.07] to-black/25 text-stone-100 ring-1 ring-white/[0.07] transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-2xl font-bold tabular-nums text-stone-50 md:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-stone-400 md:text-sm">{label}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-stone-500 md:text-sm">
            <Camera className="h-4 w-4 text-stone-300/70" aria-hidden />
            {s("trust_photos")}
          </p>
        </div>
      </div>
    </section>
  );
}
