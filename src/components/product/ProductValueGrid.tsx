"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import type { Product } from "@/types/product";
import { motion, useReducedMotion } from "framer-motion";
import {
  Armchair,
  CheckCircle2,
  Droplets,
  Flower2,
  Gauge,
  HelpCircle,
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

type ColProps = {
  kicker: string;
  children: React.ReactNode;
  delay: number;
};

function ValueCol({ kicker, children, delay }: ColProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{ duration: reduceMotion ? 0 : 0.4, delay, ease: [...BTT_EASE] }}
      className="flex min-h-0 flex-col rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-4 shadow-inner shadow-black/20 md:p-5"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/85">
        {kicker}
      </p>
      <div className="mt-3 min-h-0 text-sm text-stone-300">{children}</div>
    </motion.div>
  );
}

export function ProductValueGrid({ product }: Props) {
  const s = useTranslations("sales");
  const p = useTranslations("product");
  const reduceMotion = useReducedMotion();
  const isPlanter =
    product.category === "planter" ||
    (product.category === "new" && product.thicknessMm <= 0);

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

  const practical: { t: string; Icon: typeof ShieldCheck }[] = [
    { t: s("practical_1_title"), Icon: ShieldCheck },
    { t: s("practical_2_title"), Icon: CheckCircle2 },
    { t: s("practical_3_title"), Icon: Leaf },
  ];

  const whenToChoose = isPlanter ? s("when_planter") : s("when_material_both");

  const matAdv: { t: string; Icon: typeof Droplets }[] = isPlanter
    ? [
        { t: p("mat_planter_adv_1"), Icon: Droplets },
        { t: p("mat_planter_adv_2"), Icon: Sun },
        { t: p("mat_planter_adv_3"), Icon: ShieldCheck },
      ]
    : [
        { t: p("mat_adv_1"), Icon: Droplets },
        { t: p("mat_adv_2"), Icon: Sun },
        { t: p("mat_adv_3"), Icon: ShieldCheck },
      ];

  const baseDelay = reduceMotion ? 0 : 0;

  return (
    <section
      className="mt-10"
      aria-labelledby="pdp-value-grid-title"
    >
      <h2
        id="pdp-value-grid-title"
        className="sr-only"
      >
        {p("pdp_value_section_title")}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <ValueCol
          kicker={p("pdp_value_tasks")}
          delay={bttStaggerDelay(0, 0.04) + baseDelay}
        >
          <ul className="space-y-2.5">
            {fitItems.map(({ label, Icon }) => (
              <li key={label} className="flex gap-2.5 text-left">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90" aria-hidden />
                <span className="leading-snug text-stone-200">{label}</span>
              </li>
            ))}
          </ul>
        </ValueCol>

        <ValueCol
          kicker={p("pdp_value_gains")}
          delay={bttStaggerDelay(1, 0.04) + baseDelay}
        >
          <ul className="space-y-2">
            {gains.map(({ label, Icon }) => (
              <li key={label} className="flex items-start gap-2.5 text-left">
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/80" aria-hidden />
                <span className="leading-snug">{label}</span>
              </li>
            ))}
          </ul>
        </ValueCol>

        <ValueCol
          kicker={p("pdp_value_convenience")}
          delay={bttStaggerDelay(2, 0.04) + baseDelay}
        >
          <ul className="space-y-2.5">
            {practical.map(({ t: line, Icon }) => (
              <li key={line} className="flex gap-2.5 text-left">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90" aria-hidden />
                <span className="leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </ValueCol>

        <ValueCol
          kicker={p("pdp_value_when")}
          delay={bttStaggerDelay(3, 0.04) + baseDelay}
        >
          <p className="flex gap-2.5 text-pretty text-left leading-relaxed text-stone-200">
            <HelpCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90"
              aria-hidden
            />
            {whenToChoose}
          </p>
        </ValueCol>

        <ValueCol
          kicker={p("pdp_value_material")}
          delay={bttStaggerDelay(4, 0.04) + baseDelay}
        >
          <ul className="space-y-2.5">
            {matAdv.map(({ t: line, Icon }) => (
              <li key={line} className="flex gap-2.5 text-left">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90" aria-hidden />
                <span className="leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </ValueCol>
      </div>
    </section>
  );
}
