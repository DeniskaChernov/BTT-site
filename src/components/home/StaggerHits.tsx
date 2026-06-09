"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/types/product";
import { BTT_EASE, BTT_STAGGER } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

type Props = { products: Product[] };

export function StaggerHits({ products }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduceMotion ? 0 : BTT_STAGGER.step,
            delayChildren: reduceMotion ? 0 : BTT_STAGGER.delayChildren,
          },
        },
      }}
      className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {products.map((p, index) => (
        <motion.div
          key={p.sku}
          className="h-full min-h-0"
          variants={{
            hidden: {
              opacity: reduceMotion ? 1 : 0,
              y: reduceMotion ? 0 : 12,
            },
            show: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: reduceMotion ? 0 : BTT_STAGGER.itemDuration,
            ease: BTT_EASE,
          }}
        >
          <ProductCard product={p} priority={index < 3} />
        </motion.div>
      ))}
    </motion.div>
  );
}
