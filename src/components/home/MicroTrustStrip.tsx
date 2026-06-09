"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, Package, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement, ReactNode } from "react";

type Variant = "home" | "compact";

const ICONS = [Package, Truck, HeartHandshake, ShieldCheck] as const;

type MicroTrustStripProps = {
  className?: string;
  variant?: Variant;
};

/**
 * Переиспользуемая полоса микро-доверия: В наличии · Быстрая отгрузка ·
 * Помощь в подборе · Стабильное качество. Используем на главной и ключевых маршрутах.
 */
export function MicroTrustStrip({ className, variant = "home" }: MicroTrustStripProps) {
  const t = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const items: { key: string; label: string; Icon: (typeof ICONS)[number] }[] = [
    { key: "stock", label: t("micro_stock"), Icon: ICONS[0] },
    { key: "ship", label: t("micro_ship"), Icon: ICONS[1] },
    { key: "help", label: t("micro_help"), Icon: ICONS[2] },
    { key: "quality", label: t("micro_quality"), Icon: ICONS[3] },
  ];

  const compact = variant === "compact";

  const Wrapper: (props: { children: ReactNode }) => ReactElement = ({ children }) =>
    compact ? (
      <ul className={cn("flex flex-wrap gap-2", className)}>{children}</ul>
    ) : (
      <ul
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3",
          className,
        )}
      >
        {children}
      </ul>
    );

  return (
    <Wrapper>
      {items.map(({ key, label, Icon }, i) => (
        <motion.li
          key={key}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{
            duration: reduceMotion ? 0 : 0.35,
            delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.05),
            ease: [...BTT_EASE],
          }}
          whileHover={
            reduceMotion ? undefined : { y: -2, transition: { duration: 0.2, ease: [...BTT_EASE] } }
          }
          className={cn(
            "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-stone-300 backdrop-blur-sm transition-colors duration-200 hover:border-amber-500/30 hover:bg-white/[0.06] motion-reduce:hover:translate-y-0",
            compact ? "justify-start" : "justify-center sm:px-4 sm:py-2 sm:text-sm",
          )}
        >
          <Icon
            className="h-3.5 w-3.5 text-amber-300 transition-transform duration-200 group-hover:scale-110 motion-reduce:group-hover:scale-100 sm:h-4 sm:w-4"
            aria-hidden
          />
          <span className="leading-snug">{label}</span>
        </motion.li>
      ))}
    </Wrapper>
  );
}
