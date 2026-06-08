"use client";

import { bttPageTransition } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.97, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={bttPageTransition(reduceMotion)}
    >
      {children}
    </motion.div>
  );
}
