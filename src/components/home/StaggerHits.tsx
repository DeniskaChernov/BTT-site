"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";

type Props = { products: Product[] };

export function StaggerHits({ products }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
      }}
      className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {products.map((p) => (
        <motion.div
          key={p.sku}
          className="h-full min-h-0"
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
