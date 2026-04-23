"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { Gauge, Palette, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Три ключевые обещания материала сразу после hero-экрана.
 * Разгружает hero (оставляет только заголовок + CTA) и показывает суть одной строкой из крупных карточек.
 */
export function HeroPromisesStrip() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const items = [
    {
      title: s("gain_shape"),
      desc: s("promise_shape_desc"),
      Icon: Gauge,
    },
    {
      title: s("gain_uv"),
      desc: s("promise_uv_desc"),
      Icon: Sun,
    },
    {
      title: s("gain_batch"),
      desc: s("promise_batch_desc"),
      Icon: Palette,
    },
  ];

  return (
    <section
      className="relative -mt-6 pb-10 md:-mt-10 md:pb-16"
      aria-labelledby="home-promises-title"
    >
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [...BTT_EASE] }}
          className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl md:p-8"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-amber-500/10 blur-3xl"
            aria-hidden
          />

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
              {s("promises_kicker")}
            </p>
            <h2
              id="home-promises-title"
              className="mt-3 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl"
            >
              {s("promises_title")}
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-400 md:text-base">
              {s("promises_sub")}
            </p>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {items.map(({ title, desc, Icon }, i) => (
              <motion.li
                key={title}
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
                className="group relative flex h-full flex-col gap-3 rounded-2xl border border-white/[0.07] bg-black/25 p-5 shadow-inner shadow-black/20 transition-colors duration-200 hover:border-amber-500/35 hover:bg-black/35 motion-reduce:hover:translate-y-0 md:p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600/30 to-orange-950/40 text-amber-300 ring-1 ring-white/[0.06] transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-lg font-semibold text-stone-50 md:text-xl">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">
                    {desc}
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
