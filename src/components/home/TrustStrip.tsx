"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function TrustStrip() {
  const t = useTranslations("hero");
  const h = useTranslations("home");

  const items = [
    t("micro_total"),
    t("micro_guest"),
    h("trust_payments"),
    h("trust_ship"),
  ];

  return (
    <div className="relative border-y border-white/[0.06] bg-black/20 py-4 backdrop-blur-md">
      <div className="btt-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          {items.map((label, i) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="inline-flex items-center rounded-full border border-amber-500/20 bg-white/[0.04] px-4 py-2 text-xs font-medium text-stone-300 shadow-sm backdrop-blur-xl md:text-sm"
            >
              <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
