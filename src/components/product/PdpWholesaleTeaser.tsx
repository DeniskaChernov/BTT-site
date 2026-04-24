"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EASE } from "@/lib/motion";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function PdpWholesaleTeaser() {
  const p = useTranslations("product");
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: [...BTT_EASE] }}
      className="flex h-full flex-col justify-center rounded-2xl border border-white/[0.1] bg-white/[0.02] p-5 md:p-6"
    >
      <h2 className="text-base font-semibold text-stone-100">
        {p("pdp_wholesale_title")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-400">
        {p("pdp_wholesale_body")}
      </p>
      <Link
        href="/wholesale"
        className={cn(
          bttPrimaryButtonClass,
          "btt-focus mt-5 inline-flex w-fit items-center justify-center gap-2 px-5 py-2.5 text-sm",
        )}
      >
        <Users className="h-4 w-4" aria-hidden />
        {p("pdp_wholesale_cta")}
      </Link>
    </motion.div>
  );
}
