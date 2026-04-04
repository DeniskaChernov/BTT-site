"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

/** Фон только под текстом героя; снаружи — общий фон страницы */
const HERO_PANEL_IMAGE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=85";

type CardKey = "card_rattan" | "card_planter" | "card_twisted" | "card_fourth";

const HERO_CATEGORIES: {
  href: string;
  messageKey: CardKey;
  image: string;
}[] = [
  {
    href: "/catalog?tab=material",
    messageKey: "card_rattan",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
  },
  {
    href: "/catalog?tab=planter",
    messageKey: "card_planter",
    image:
      "https://images.unsplash.com/photo-1416879695882-3373aadc0dd4?w=800&q=85",
  },
  {
    href: "/catalog?tab=material&shape=round",
    messageKey: "card_twisted",
    image:
      "https://images.unsplash.com/photo-1595428774227-1215327c3b49?w=800&q=85",
  },
  {
    href: "/catalog?tab=new",
    messageKey: "card_fourth",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea3?w=800&q=85",
  },
];

export function CommerceHero() {
  const t = useTranslations("commerceHero");
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
          className="relative mx-auto min-h-[300px] max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/[0.12] shadow-[0_32px_100px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.04] md:min-h-[380px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0">
            <Image
              src={HERO_PANEL_IMAGE}
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1024px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/78"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(120,53,15,0.28),transparent_55%)]"
              aria-hidden
            />
          </div>

          <div className="relative z-10 flex flex-col items-center px-5 py-12 text-center md:px-12 md:py-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/95 backdrop-blur-sm">
              {t("kicker")}
            </p>
            <h1 className="mt-6 max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight text-stone-50 md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                {t("headline_accent")}
              </span>
              <br />
              <span className="text-white drop-shadow-md">{t("headline_rest")}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-200/95 md:text-lg">
              {t("lead")}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/catalog">
                <motion.span
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/40 sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {th("cta_buy")}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </motion.span>
              </Link>
              <Link href="/#quiz">
                <motion.span
                  className="inline-flex w-full items-center justify-center rounded-full border border-amber-400/35 bg-black/30 px-8 py-3.5 text-sm font-semibold text-stone-50 shadow-lg backdrop-blur-md transition hover:border-amber-400/55 hover:bg-black/40 sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {th("cta_pick")}
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {HERO_CATEGORIES.map((cat, index) => {
            const title = t(cat.messageKey);

            return (
              <motion.div
                key={cat.messageKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.12 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={cat.href}
                  className="group relative block overflow-hidden rounded-3xl border border-white/[0.08] bg-[#141414]/90 p-4 shadow-[var(--btt-shadow-sm)] backdrop-blur-sm transition hover:border-white/18 sm:min-h-[280px] sm:p-6"
                >
                  <h2 className="relative z-10 text-center text-xl font-bold leading-snug text-white transition group-hover:text-stone-50 sm:text-2xl md:text-[1.65rem]">
                    {title}
                  </h2>
                  <div className="pointer-events-none relative mt-4 flex min-h-[160px] items-center justify-center sm:min-h-[180px]">
                    <Image
                      src={cat.image}
                      alt=""
                      width={320}
                      height={240}
                      className="h-auto max-h-[200px] w-full max-w-[200px] rounded-lg object-cover opacity-95 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                      sizes="(max-width: 640px) 90vw, 25vw"
                    />
                  </div>
                  <div className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-md border border-white/12 bg-black/70 text-stone-100 shadow-lg backdrop-blur-sm transition group-hover:border-amber-500/40 group-hover:bg-zinc-900 group-hover:text-amber-200">
                    <ArrowUpRight className="h-5 w-5" aria-hidden />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
