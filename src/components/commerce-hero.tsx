"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type CardKey = "card_rattan" | "card_planter" | "card_twisted" | "card_fourth";

const HERO_STATS = [
  { valueKey: "hero_stat_bulk_value", labelKey: "hero_stat_bulk_label", plus: true },
  { valueKey: "hero_stat_moq_value", labelKey: "hero_stat_moq_label", plus: true },
  { valueKey: "hero_stat_stock_value", labelKey: "hero_stat_stock_label", plus: false },
] as const;

const HERO_CATEGORIES: {
  href: string;
  messageKey: CardKey;
  badgeKey?: "card_fourth_badge";
  segment: "master" | "production" | "pick";
  imageSrc: string;
  imageFit?: "cover" | "contain";
  blendScreen?: boolean;
  imageScaleClass?: string;
  imageInsetClass?: string;
}[] = [
  {
    href: "/catalog/rattan",
    messageKey: "card_rattan",
    segment: "production",
    imageSrc: "/media/catalog/rattan-hero.webp",
    imageFit: "contain",
    imageInsetClass: "inset-3 sm:inset-4",
  },
  {
    href: "/catalog/planters",
    messageKey: "card_planter",
    segment: "pick",
    imageSrc: "/media/catalog/btt-kshbskm.webp",
  },
  {
    href: "/catalog/twisted-rattan",
    messageKey: "card_twisted",
    segment: "production",
    imageSrc: "/media/catalog/twisted-rattan-hero.webp",
    imageFit: "contain",
    imageInsetClass: "inset-3 sm:inset-4",
    blendScreen: true,
  },
  {
    href: "/catalog/furniture",
    messageKey: "card_fourth",
    badgeKey: "card_fourth_badge",
    segment: "master",
    imageSrc: "/media/catalog/furniture-chair-hero.webp",
    blendScreen: true,
  },
];

const fadeUp = (reduceMotion: boolean | null, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 } as const,
        animate: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.5, delay, ease: BTT_EASE },
      };

export function CommerceHero() {
  const t = useTranslations("commerceHero");
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

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
        <div className="pt-10 pb-8 md:pt-12 md:pb-10">
          <motion.div
            className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-6 lg:gap-5"
            {...fadeUp(reduceMotion)}
          >
            <motion.div
              className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:min-h-[480px] lg:col-span-8 lg:row-span-6 lg:min-h-0 lg:rounded-[3rem]"
              {...fadeUp(reduceMotion, 0.05)}
            >
              <Image
                src="/media/catalog/furniture-chair-hero.webp"
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"
                aria-hidden
              />

              <div className="absolute left-4 top-4 z-10 max-w-[min(100%,20rem)] rounded-[1.75rem] p-5 sm:left-6 sm:top-6 sm:max-w-xs sm:p-6 btt-hero-headline-panel">
                <span className="btt-hero-inline-pill">{s("hero_badge_pill")}</span>
                <h1 className="mt-4 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                  {s("hero_headline_line1")}
                  <br />
                  {s("hero_headline_line2")}
                </h1>
              </div>

              <div className="absolute bottom-5 right-4 z-10 text-right sm:bottom-6 sm:right-6">
                <span className="btt-hero-corner-pill">{s("hero_corner_tag")}</span>
                <p className="mt-3 text-sm font-medium text-white/90 sm:text-base">
                  {s("hero_corner_line1")}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-sm">
                  {s("hero_corner_line2")}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative min-h-[280px] overflow-hidden rounded-[2.5rem] border border-white/[0.08] sm:min-h-[320px] lg:col-span-4 lg:row-span-4 lg:min-h-0 lg:rounded-[3rem]"
              {...fadeUp(reduceMotion, 0.1)}
            >
              <Link
                href="/catalog"
                onClick={() =>
                  trackBttEvent(BTT_EVENTS.HeroCtaClick, { cta: "pick" })
                }
                className="group btt-focus relative block h-full min-h-[280px] sm:min-h-[320px]"
              >
                <Image
                  src="/media/catalog/rattan-hero.webp"
                  alt=""
                  fill
                  className="object-cover object-center transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0 bg-black/20 transition group-hover:bg-black/15 motion-reduce:transition-none"
                  aria-hidden
                />

                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <span className="btt-glass-orbit h-[7.5rem] w-[7.5rem] transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-32 sm:w-32">
                    <ArrowUpRight className="h-4 w-4 text-amber-200" aria-hidden />
                    <span className="max-w-[5.5rem] leading-tight">{s("hero_tile_go")}</span>
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div
              className="grid min-h-[7.5rem] grid-cols-3 overflow-hidden rounded-[2.5rem] lg:col-span-4 lg:row-span-2 lg:rounded-[3rem] btt-hero-stats-panel"
              {...fadeUp(reduceMotion, 0.14)}
            >
              {HERO_STATS.map(({ valueKey, labelKey, plus }) => (
                <div
                  key={valueKey}
                  className="flex flex-col items-center justify-center gap-1 border-r border-white/[0.06] px-3 py-5 text-center last:border-r-0 sm:px-4"
                >
                  <p className="text-xl font-bold tabular-nums text-white sm:text-2xl lg:text-[1.65rem]">
                    {s(valueKey)}
                    {plus ? <span className="text-amber-400">+</span> : null}
                  </p>
                  <p className="text-[10px] leading-snug text-stone-400 sm:text-xs">
                    {s(labelKey)}
                  </p>
                </div>
              ))}
            </motion.div>
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
                  ease: BTT_EASE,
                }}
              >
                <Link
                  href={cat.href}
                  onClick={() =>
                    trackBttEvent(BTT_EVENTS.SegmentCardClick, {
                      segment: cat.segment,
                    })
                  }
                  className="group btt-focus btt-glass relative flex min-h-[300px] w-full flex-col overflow-hidden rounded-[1.75rem] p-5 pb-6 outline-none transition hover:-translate-y-0.5 hover:border-amber-500/30 motion-reduce:transition-none sm:min-h-[320px]"
                >
                  <h2 className="relative z-10 text-center text-lg font-bold leading-tight tracking-tight text-white md:text-xl">
                    {title}
                  </h2>
                  {cat.badgeKey ? (
                    <p className="relative z-10 mt-1 text-center text-xs font-medium text-amber-300/90">
                      {t(cat.badgeKey)}
                    </p>
                  ) : null}

                  <div className="relative mt-4 min-h-0 flex-1">
                    <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20">
                      <div
                        className={cn(
                          "absolute overflow-hidden rounded-xl",
                          cat.imageInsetClass ?? "inset-0",
                        )}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className={cn(
                            cat.imageFit === "contain" ? "object-contain" : "object-cover",
                            cat.blendScreen && "mix-blend-screen",
                            cat.imageScaleClass,
                            cat.imageScaleClass
                              ? "transition duration-500 motion-reduce:transition-none"
                              : "transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                          )}
                          sizes="(max-width: 640px) 80vw, 220px"
                        />
                      </div>
                      <div className="btt-glass-overlay pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none">
                        <span className="btt-glass-pill normal-case tracking-normal">
                          {s("hero_cta_pick")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className="btt-glass-orbit absolute bottom-4 right-4 z-10 h-10 w-10 rounded-full p-0 transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
