"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function CollectiveSalesTeaser() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const items = [s("collective_item_1"), s("collective_item_2"), s("collective_item_3")];

  return (
    <section
      className="relative py-14 md:py-20"
      aria-labelledby="home-collective-sales-title"
    >
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [...BTT_EASE] }}
          className="relative overflow-hidden rounded-[1.75rem] border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-stone-950/90 to-orange-950/30 p-6 shadow-[0_20px_60px_-24px_rgba(245,158,11,0.35)] md:p-10"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="max-w-2xl">
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/35 bg-amber-500/10 text-amber-300 shadow-lg shadow-amber-900/20">
                  <Users className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/90">
                    {s("collective_kicker")}
                  </p>
                  <h2
                    id="home-collective-sales-title"
                    className="mt-2 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl"
                  >
                    {s("collective_title")}
                  </h2>
                </div>
              </div>

              <ul className="mt-5 grid gap-2 text-sm text-stone-300 md:text-base">
                {items.map((text, i) => (
                  <motion.li
                    key={text}
                    initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-6%" }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.3,
                      delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.06),
                      ease: [...BTT_EASE],
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    {text}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex shrink-0">
              <Link
                href="/wholesale"
                className="btt-focus inline-block rounded-full"
              >
                <motion.span
                  className={cn(
                    bttPrimaryButtonClass,
                    "group inline-flex items-center gap-2 px-7 py-3.5",
                  )}
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  {s("collective_cta")}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
