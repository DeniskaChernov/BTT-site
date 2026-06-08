"use client";

import { BTT_EASE, BTT_STAGGER, bttRevealTransition, bttStaggerDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function AnimatedReveal({
  children,
  className,
  delay = 0,
  y = 14,
}: AnimatedRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={bttRevealTransition(reduceMotion, delay)}
    >
      {children}
    </motion.div>
  );
}

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
};

export function SectionReveal({ children, className }: SectionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-56px" }}
      transition={bttRevealTransition(reduceMotion)}
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
  step?: number;
  y?: number;
  as?: "ul" | "div";
};

export function StaggerList<T>({
  items,
  getKey,
  children,
  className,
  step = BTT_STAGGER.step,
  y = 12,
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
            duration: reduceMotion ? 0 : BTT_STAGGER.itemDuration,
            delay: reduceMotion ? 0 : bttStaggerDelay(i, step),
            ease: BTT_EASE,
          }}
        >
          {children(item, i)}
        </Item>
      ))}
    </Tag>
  );
}
