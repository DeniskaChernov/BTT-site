"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { SITE_MEDIA } from "@/lib/site-media";
import { useTranslations } from "next-intl";
import { useRef } from "react";

type CardKey = "card_rattan" | "card_planter" | "card_twisted" | "card_fourth";

const HERO_CATEGORIES: {
  href: string;
  messageKey: CardKey;
  imageSrc: string;
}[] = [
  { href: "/catalog/rattan", messageKey: "card_rattan", imageSrc: "/media/catalog/btt-hr5nat.png" },
  { href: "/catalog/planters", messageKey: "card_planter", imageSrc: "/media/catalog/btt-kshbskm.png" },
  {
    href: "/catalog/twisted-rattan",
    messageKey: "card_twisted",
    imageSrc: "/media/catalog/brochure-cards/twisted-1770k-hero.png",
  },
  { href: "/catalog/furniture", messageKey: "card_fourth", imageSrc: "/media/catalog/btt-kshset.png" },
];

export function CommerceHero() {
  const t = useTranslations("commerceHero");
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start start", "end start"],
  });
  // Лёгкий parallax: двигаем фоновое изображение вверх и чуть масштабируем.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section className="relative overflow-hidden">
      <div className="btt-mesh btt-grid-bg absolute inset-0 opacity-[0.85]" aria-hidden />
      <div
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-amber-600/12 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-orange-950/40 blur-[90px]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div ref={parallaxRef} className="pt-10 pb-8 md:pt-12 md:pb-10">
          <motion.div
            className="relative flex min-h-[420px] w-full flex-col justify-center overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#1a1a1a] shadow-[0_24px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.04] md:min-h-[480px] lg:min-h-[520px]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: [...BTT_EASE],
            }}
          >
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute inset-0"
                style={
                  reduceMotion
                    ? undefined
                    : { y: bgY, scale: bgScale, willChange: "transform" }
                }
              >
                <Image
                  src={SITE_MEDIA.heroPanel}
                  alt=""
                  fill
                  priority
                  className="object-cover object-center saturate-[0.85]"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </motion.div>
              {/* Базовый scrim: чуть тяжелее снизу, чтобы CTA «дышали», а текст вверху лежал на глубокой области. */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/88"
                aria-hidden
              />
              {/* Боковая виньетка на холодную сторону, чтобы вытянуть фокус к центру и приглушить тёплые края. */}
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_55%,transparent_35%,rgba(0,0,0,0.55)_100%)]"
                aria-hidden
              />
              {/* Лёгкая amber-подсветка внизу под CTA — совпадает с зоной тёплого света на новом фоне. */}
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_95%,rgba(180,83,9,0.28),transparent_55%)]"
                aria-hidden
              />
            </div>

            <div className="relative z-10 flex flex-col items-center px-6 py-14 text-center sm:px-10 sm:py-16 md:px-14">
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : 0.05,
                  ease: [...BTT_EASE],
                }}
                className="inline-flex items-center rounded-full border border-white/15 bg-black/45 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-100/95 backdrop-blur-md sm:text-[11px]"
              >
                {s("hero_kicker")}
              </motion.p>

              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : 0.12,
                  ease: [...BTT_EASE],
                }}
                className="mt-8 max-w-4xl text-balance text-3xl font-bold leading-[1.15] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-5xl lg:text-[3.25rem]"
              >
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                  {s("hero_title_accent")}
                </span>
                <br />
                <span className="text-white">{s("hero_title_rest")}</span>
              </motion.h1>

              <div className="mt-12 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
                <Link
                  href="/catalog"
                  onClick={() =>
                    trackBttEvent(BTT_EVENTS.HeroCtaClick, { cta: "stock" })
                  }
                  className="btt-focus inline-block rounded-full sm:inline-flex sm:justify-center"
                >
                  <motion.span
                    className={cn(
                      bttPrimaryButtonClass,
                      "group inline-flex w-full items-center justify-center gap-2 px-8 py-3.5 shadow-black/30 sm:w-auto",
                    )}
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  >
                    {s("hero_cta_stock")}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                  </motion.span>
                </Link>
                <Link
                  href="/#quiz"
                  onClick={() =>
                    trackBttEvent(BTT_EVENTS.HeroCtaClick, { cta: "pick" })
                  }
                  className="btt-focus inline-block rounded-full sm:inline-flex sm:justify-center"
                >
                  <motion.span
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-black/35 px-8 py-3.5 text-sm font-semibold text-neutral-100 backdrop-blur-sm transition hover:border-white/30 hover:bg-black/45 motion-reduce:transition-none sm:w-auto"
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  >
                    {s("hero_cta_pick")}
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 pb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:pb-16">
          {HERO_CATEGORIES.map((cat, index) => {
            const title = t(cat.messageKey);
            const src = cat.imageSrc;

            return (
              <motion.div
                key={cat.messageKey}
                className="flex h-full min-h-0"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : bttStaggerDelay(index, 0.06) + 0.06,
                  ease: [...BTT_EASE],
                }}
              >
                <Link
                  href={cat.href}
                  className="group btt-focus relative flex min-h-[300px] w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-[#1d1d1d] to-[#171717] p-5 pb-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.03] outline-none transition hover:-translate-y-0.5 hover:border-amber-500/35 motion-reduce:transition-none sm:min-h-[320px]"
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40"
                    aria-hidden
                  />
                  <h2 className="relative z-10 text-center text-lg font-bold leading-tight tracking-tight text-white md:text-xl">
                    {title}
                  </h2>

                  <div className="relative mt-4 min-h-0 flex-1">
                    <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-[#121212]">
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        sizes="(max-width: 640px) 80vw, 220px"
                      />
                    </div>
                  </div>

                  <span
                    className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#121212] text-neutral-100 shadow-lg transition group-hover:border-amber-500/40 group-hover:text-amber-200 motion-reduce:transition-none"
                    aria-hidden
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
