"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { CreditCard, Headset, RotateCcw, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const ICONS = [CreditCard, Shield, RotateCcw, Headset] as const;

type LiProps = {
  children: ReactNode;
  Icon: (typeof ICONS)[number];
  i: number;
};

function TrustItem({ children, Icon, i }: LiProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-2%" }}
      transition={{
        duration: reduceMotion ? 0 : 0.3,
        delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.04),
        ease: [...BTT_EASE],
      }}
      className="flex min-w-0 items-start gap-2.5 text-stone-300 md:flex-col md:items-center md:text-center"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/5 text-amber-300"
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-xs leading-relaxed md:pt-0">{children}</span>
    </motion.li>
  );
}

/**
 * Нижняя полоса доверия на PDP: оплата, партия, обмен, связь.
 */
export function PdpTrustBar() {
  const t = useTranslations("product");
  const items = [t("pdp_trust_pay"), t("pdp_trust_batch"), t("pdp_trust_return"), t("pdp_trust_support")];

  return (
    <section
      className="mt-12 border-y border-white/[0.08] bg-white/[0.02] py-4 md:py-5"
      aria-label={t("pdp_trust_aria")}
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((line, i) => (
          <TrustItem
            key={line}
            Icon={ICONS[i]!}
            i={i}
          >
            {line}
          </TrustItem>
        ))}
      </ul>
    </section>
  );
}
