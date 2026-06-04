"use client";

import { BTT_DURATION, BTT_EASE } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.92, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: BTT_DURATION.base * 0.78, ease: [...BTT_EASE] }}
    >
      {children}
    </motion.div>
  );
}
