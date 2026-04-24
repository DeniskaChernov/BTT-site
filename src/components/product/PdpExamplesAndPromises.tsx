"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { SITE_MEDIA } from "@/lib/site-media";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Banknote, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const EXAMPLES = [
  { seed: "btt-cat-rattan", href: "/catalog?tab=material" as const, id: "1" as const },
  { seed: "btt-cat-planter", href: "/catalog?tab=planter" as const, id: "2" as const },
  { seed: "btt-cat-twist", href: "/catalog?tab=material&shape=round" as const, id: "3" as const },
  { seed: "btt-cat-new", href: "/catalog?tab=new" as const, id: "4" as const },
] as const;

const PROMISE_ICONS = [BadgeCheck, Banknote, Truck, Sparkles] as const;

export function PdpExamplesAndPromises() {
  const p = useTranslations("product");
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const lines = [s("benefits_1_title"), s("benefits_2_title"), s("benefits_3_title"), s("benefits_4_title")];

  return (
    <section
      className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch"
      aria-labelledby="pdp-examples-title"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
        <h2
          id="pdp-examples-title"
          className="text-base font-semibold text-stone-100"
        >
          {p("pdp_examples_title")}
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">
          {EXAMPLES.map((ex) => (
            <li key={ex.id}>
              <Link
                href={ex.href}
                className="btt-focus group block overflow-hidden rounded-xl border border-white/[0.08] transition hover:border-amber-500/35"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={SITE_MEDIA.categoryCard(ex.seed)}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 45vw, 180px"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition group-hover:opacity-100"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/#examples"
          className="btt-focus mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
        >
          {p("pdp_examples_more")}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div
        className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-stone-950/60 p-5 md:p-6"
        aria-labelledby="pdp-promises-title"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500/90">
          {p("pdp_promises_kicker")}
        </p>
        <h2 id="pdp-promises-title" className="mt-1 text-base font-semibold text-stone-100">
          {p("pdp_promises_title")}
        </h2>
        <ul className="mt-5 space-y-4">
          {lines.map((line, i) => {
            const Icon = PROMISE_ICONS[i]!;
            return (
              <motion.li
                key={line}
                initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-2%" }}
                transition={{
                  duration: reduceMotion ? 0 : 0.3,
                  delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.05),
                  ease: [...BTT_EASE],
                }}
                className="flex gap-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-black/20 text-amber-300"
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium leading-snug text-stone-200">
                  {line}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
