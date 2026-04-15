"use client";

import { BTT_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedRevealProps = {
  children: ReactNode;
  className?: string;
  /** Задержка появления (сек), для стаггера колонок */
  delay?: number;
  /** Сдвиг по оси Y при входе */
  y?: number;
};

/**
 * Плавное появление при скролле (once). Уважает prefers-reduced-motion.
 */
export function AnimatedReveal({
  children,
  className,
  delay = 0,
  y = 18,
}: AnimatedRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : delay,
        ease: [...BTT_EASE],
      }}
    >
      {children}
    </motion.div>
  );
}

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
};

/** Обёртка секции с мягким fade-in при первом попадании в viewport */
export function SectionReveal({ children, className }: SectionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        ease: [...BTT_EASE],
      }}
    >
      {children}
    </motion.div>
  );
}
