"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CARD_IMAGES: Record<string, string> = {
  catalog:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85",
  wholesale:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=85",
  export:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=85",
  about:
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=85",
};

type NavKey = "catalog" | "wholesale" | "export" | "about";

const CARD_ORDER: { href: string; key: NavKey }[] = [
  { href: "/catalog", key: "catalog" },
  { href: "/wholesale", key: "wholesale" },
  { href: "/export", key: "export" },
  { href: "/about", key: "about" },
];

export function CommerceHero() {
  const t = useTranslations("commerceHero");
  const tn = useTranslations("nav");
  const th = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <div className="btt-mesh btt-grid-bg absolute inset-0 opacity-90" aria-hidden />
      <div
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-amber-600/15 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-orange-950/50 blur-[90px]"
        aria-hidden
      />

      <div className="relative btt-container py-12 md:py-16 lg:py-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200/90">
            {t("kicker")}
          </p>
          <h1 className="mt-6 text-3xl font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              {t("headline_accent")}
            </span>
            <br />
            <span className="text-stone-50">{t("headline_rest")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-400 md:text-lg">
            {t("lead")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/catalog">
              <motion.span
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {th("cta_buy")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </motion.span>
            </Link>
            <Link href="/#quiz">
              <motion.span
                className="btt-glass-cta inline-flex w-full items-center justify-center sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {th("cta_pick")}
              </motion.span>
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {CARD_ORDER.map(({ href, key }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.12 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={href}
                className="group relative block overflow-hidden rounded-3xl border border-white/[0.08] bg-stone-900/40 p-4 shadow-[var(--btt-shadow-sm)] backdrop-blur-sm transition hover:border-amber-500/25 sm:min-h-[280px] sm:p-6"
              >
                <h2 className="relative z-10 text-center text-xl font-bold text-amber-400/95 transition group-hover:text-amber-300 sm:text-2xl md:text-3xl">
                  {tn(key)}
                </h2>
                <div className="pointer-events-none relative mt-4 flex min-h-[160px] items-center justify-center sm:min-h-[180px]">
                  <Image
                    src={CARD_IMAGES[key]}
                    alt={tn(key)}
                    width={320}
                    height={240}
                    className="h-auto max-h-[200px] w-full max-w-[200px] object-contain opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 640px) 90vw, 25vw"
                  />
                </div>
                <div className="absolute bottom-3 right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-stone-950/80 text-stone-200 shadow-lg backdrop-blur-sm transition group-hover:border-amber-500/40 group-hover:bg-gradient-to-br group-hover:from-amber-600 group-hover:to-orange-600 group-hover:text-white">
                  <ArrowUpRight className="h-5 w-5" aria-hidden />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
