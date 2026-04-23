"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import type { Product } from "@/types/product";
import { motion, useReducedMotion } from "framer-motion";
import {
  Armchair,
  CheckCircle2,
  Flower2,
  Gauge,
  Leaf,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ElementType } from "react";

type Props = { product: Product };

/** Общая обёртка с заголовком-тикером */
function SalesBlock({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [...BTT_EASE] }}
      className="mt-8 rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-inner shadow-black/10 md:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
        {kicker}
      </p>
      <div className="mt-4">{children}</div>
    </motion.section>
  );
}

export function ProductSalesBlocks({ product }: Props) {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const isPlanter = product.category === "planter";

  const fitItems: { label: string; Icon: ElementType }[] = isPlanter
    ? [
        { label: s("fit_planter"), Icon: Flower2 },
        { label: s("fit_decor"), Icon: Sparkles },
      ]
    : [
        { label: s("fit_furniture"), Icon: Armchair },
        { label: s("fit_planter"), Icon: Flower2 },
        { label: s("fit_decor"), Icon: Sparkles },
      ];

  const gains: { label: string; Icon: ElementType }[] = [
    { label: s("gain_shape"), Icon: Gauge },
    { label: s("gain_uv"), Icon: Sun },
    { label: s("gain_weave"), Icon: Wrench },
    { label: s("gain_batch"), Icon: Palette },
  ];

  const practical = [
    { title: s("practical_1_title"), body: s("practical_1_body"), Icon: ShieldCheck },
    { title: s("practical_2_title"), body: s("practical_2_body"), Icon: CheckCircle2 },
    { title: s("practical_3_title"), body: s("practical_3_body"), Icon: Leaf },
  ];

  const whenToChoose = isPlanter
    ? s("when_planter")
    : product.application === "outdoor"
      ? s("when_material_outdoor")
      : product.application === "indoor"
        ? s("when_material_indoor")
        : s("when_material_both");

  return (
    <div>
      <SalesBlock kicker={s("fit_kicker")}>
        <ul className="flex flex-wrap gap-2">
          {fitItems.map(({ label, Icon }, i) => (
            <motion.li
              key={label}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: reduceMotion ? 0 : 0.3,
                delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.05),
                ease: [...BTT_EASE],
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-stone-200 transition-colors duration-200 hover:border-amber-500/35 hover:bg-white/[0.07]"
            >
              <Icon className="h-3.5 w-3.5 text-amber-300" aria-hidden />
              {label}
            </motion.li>
          ))}
        </ul>
      </SalesBlock>

      <SalesBlock kicker={s("gains_kicker")}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {gains.map(({ label, Icon }, i) => (
            <motion.li
              key={label}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
                delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.05),
                ease: [...BTT_EASE],
              }}
              className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 text-sm text-stone-200 transition-colors duration-200 hover:border-amber-500/30 hover:bg-black/30"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/30 to-orange-950/40 text-amber-300 ring-1 ring-white/[0.06] transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {label}
            </motion.li>
          ))}
        </ul>
      </SalesBlock>

      <SalesBlock kicker={s("practical_kicker")}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {practical.map(({ title, body, Icon }, i) => (
            <motion.li
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.06),
                ease: [...BTT_EASE],
              }}
              className="rounded-2xl border border-white/[0.06] bg-black/20 p-4"
            >
              <Icon className="h-5 w-5 text-amber-300" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-stone-100">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-400">{body}</p>
            </motion.li>
          ))}
        </ul>
      </SalesBlock>

      <SalesBlock kicker={s("when_kicker")}>
        <p className="text-sm leading-relaxed text-stone-300 md:text-base">
          {whenToChoose}
        </p>
      </SalesBlock>
    </div>
  );
}
