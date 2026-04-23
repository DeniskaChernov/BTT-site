"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
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

type StaggerListProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  children: (item: T, index: number) => ReactNode;
  className?: string;
  /** Шаг задержки между элементами, сек */
  step?: number;
  /** Сдвиг по оси Y при входе */
  y?: number;
  /** Тег-обёртка списка */
  as?: "ul" | "div";
};

/**
 * Сеточный контейнер со stagger-появлением элементов. Держит единый easing/duration
 * и уважает prefers-reduced-motion.
 */
export function StaggerList<T>({
  items,
  getKey,
  children,
  className,
  step = 0.06,
  y = 14,
  as = "ul",
}: StaggerListProps<T>) {
  const reduceMotion = useReducedMotion();
  const Tag = as === "ul" ? motion.ul : motion.div;
  const Item = as === "ul" ? motion.li : motion.div;

  return (
    <Tag className={cn(className)}>
      {items.map((item, i) => (
        <Item
          key={getKey(item, i)}
          initial={reduceMotion ? false : { opacity: 0, y }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{
            duration: reduceMotion ? 0 : 0.42,
            delay: reduceMotion ? 0 : bttStaggerDelay(i, step),
            ease: [...BTT_EASE],
          }}
        >
          {children(item, i)}
        </Item>
      ))}
    </Tag>
  );
}
