"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type CardKey = "card_rattan" | "card_planter" | "card_twisted" | "card_fourth";

const HERO_STATS = [
  { valueKey: "hero_stat_bulk_value", labelKey: "hero_stat_bulk_label" },
  { valueKey: "hero_stat_moq_value", labelKey: "hero_stat_moq_label" },
  { valueKey: "hero_stat_stock_value", labelKey: "hero_stat_stock_label" },
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
            className="grid grid-cols-1 gap-4 lg:grid-cols-12"
            {...fadeUp(reduceMotion)}
          >
            <motion.div
              className="relative min-h-[400px] overflow-hidden rounded-[2rem] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:col-span-8 lg:min-h-[460px]"
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
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_30%,rgba(245,158,11,0.12),transparent_55%)]"
                aria-hidden
              />

              <span className="btt-glass-pill absolute left-5 top-5 z-10 sm:left-6 sm:top-6">
                {s("hero_image_tag")}
              </span>

              <div className="btt-glass-strong absolute bottom-5 left-5 right-5 z-10 max-w-xl p-5 sm:bottom-6 sm:left-6 sm:p-6 md:right-auto">
                <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/90 sm:text-[11px]">
                  {s("hero_kicker")}
                </p>
                <h1 className="relative z-10 mt-3 text-balance text-2xl font-bold leading-[1.12] tracking-tight sm:text-3xl lg:text-4xl">
                  <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                    {s("hero_title_accent")}
                  </span>{" "}
                  <span className="text-white">{s("hero_title_rest")}</span>
                </h1>
                <div className="relative z-10 mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/catalog?stock=in_stock"
                    onClick={() =>
                      trackBttEvent(BTT_EVENTS.HeroCtaClick, { cta: "stock" })
                    }
                    className="btt-focus inline-flex"
                  >
                    <span
                      className={cn(
                        bttPrimaryButtonClass,
                        "group inline-flex w-full items-center justify-center gap-2 px-6 py-3 sm:w-auto",
                      )}
                    >
                      {s("hero_cta_stock")}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                    </span>
                  </Link>
                  <Link
                    href="/catalog"
                    onClick={() =>
                      trackBttEvent(BTT_EVENTS.HeroCtaClick, { cta: "pick" })
                    }
                    className="btt-focus inline-flex"
                  >
                    <span className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-black/25 px-6 py-3 text-sm font-semibold text-stone-100 backdrop-blur-sm transition hover:border-white/35 hover:bg-black/40 sm:w-auto">
                      {s("hero_cta_pick")}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative min-h-[200px] overflow-hidden rounded-[2rem] border border-white/[0.08] lg:col-span-4 lg:min-h-[220px]"
              {...fadeUp(reduceMotion, 0.1)}
            >
              <Link
                href="/catalog"
                onClick={() =>
                  trackBttEvent(BTT_EVENTS.HeroCtaClick, { cta: "pick" })
                }
                className="group btt-focus relative block h-full min-h-[200px]"
              >
                <Image
                  src="/media/catalog/rattan-hero.webp"
                  alt=""
                  fill
                  className="object-cover object-center transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0 bg-black/45 transition group-hover:bg-black/35 motion-reduce:transition-none"
                  aria-hidden
                />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <span className="btt-glass-orbit h-[5.5rem] w-[5.5rem] transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-24 sm:w-24">
                    <ArrowUpRight className="h-5 w-5 text-amber-200" aria-hidden />
                    <span className="max-w-[4.5rem] leading-tight">
                      {s("hero_tile_go")}
                    </span>
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div
              className="btt-glass-strong grid grid-cols-3 gap-3 rounded-[2rem] p-4 sm:p-5 lg:col-span-4"
              {...fadeUp(reduceMotion, 0.14)}
            >
              {HERO_STATS.map(({ valueKey, labelKey }) => (
                <div key={valueKey} className="relative z-10 text-center">
                  <p className="text-lg font-bold tabular-nums text-amber-300 sm:text-xl">
                    {s(valueKey)}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-xs">
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
