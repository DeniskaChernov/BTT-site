"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { Armchair, ArrowUpRight, Flower2, Shuffle } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Продающая навигация над каталогом: три пресета под задачу (мебель / кашпо / универсальный).
 * Ведут на готовые связки фильтров, не ломая текущую `CatalogClient` логику.
 */
export function CatalogUseCasesNav() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const items = [
    {
      title: s("catalog_use_furniture"),
      desc: s("catalog_use_furniture_desc"),
      href: "/catalog?tab=material",
      icon: Armchair,
    },
    {
      title: s("catalog_use_planter"),
      desc: s("catalog_use_planter_desc"),
      href: "/catalog?tab=planter",
      icon: Flower2,
    },
    {
      title: s("catalog_use_universal"),
      desc: s("catalog_use_universal_desc"),
      href: "/catalog?tab=material&shape=half_round",
      icon: Shuffle,
    },
  ];

  return (
    <section aria-labelledby="catalog-use-cases-title" className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <p
          id="catalog-use-cases-title"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80"
        >
          {s("catalog_use_kicker")}
        </p>
      </div>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {items.map((it, i) => (
          <motion.li
            key={it.title}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6%" }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.06),
              ease: [...BTT_EASE],
            }}
            whileHover={
              reduceMotion
                ? undefined
                : { y: -3, transition: { duration: 0.2, ease: [...BTT_EASE] } }
            }
            className="min-w-0"
          >
            <Link
              href={it.href}
              className="group btt-focus relative flex h-full items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-inner shadow-black/10 transition-colors duration-200 hover:border-amber-500/35 hover:bg-white/[0.06] motion-reduce:transition-none md:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-950/40 text-amber-300 ring-1 ring-white/[0.06] transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                <it.icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-stone-100 md:text-base">
                  {it.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone-400 md:text-sm">
                  {it.desc}
                </p>
              </div>
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 text-stone-500 transition-colors duration-200 group-hover:text-amber-300"
                aria-hidden
              />
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
