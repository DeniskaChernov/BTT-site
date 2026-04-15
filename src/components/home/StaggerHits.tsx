"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/types/product";
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
            staggerChildren: reduceMotion ? 0 : 0.06,
            delayChildren: reduceMotion ? 0 : 0.05,
          },
        },
      }}
      className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {products.map((p) => (
        <motion.div
          key={p.sku}
          className="h-full min-h-0"
          variants={{
            hidden: {
              opacity: reduceMotion ? 1 : 0,
              y: reduceMotion ? 0 : 16,
            },
            show: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
