"use client";

import { Link } from "@/i18n/navigation";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { SITE_MEDIA } from "@/lib/site-media";
import { useTranslations } from "next-intl";

type CardKey = "card_rattan" | "card_planter" | "card_twisted" | "card_fourth";

const HERO_CATEGORIES: {
  href: string;
  messageKey: CardKey;
  imageSeed: string;
}[] = [
  { href: "/catalog?tab=material", messageKey: "card_rattan", imageSeed: "btt-cat-rattan" },
  { href: "/catalog?tab=planter", messageKey: "card_planter", imageSeed: "btt-cat-planter" },
  {
    href: "/catalog?tab=material&shape=round",
    messageKey: "card_twisted",
    imageSeed: "btt-cat-twist",
  },
  { href: "/catalog?tab=new", messageKey: "card_fourth", imageSeed: "btt-cat-new" },
];

export function CommerceHero() {
  const t = useTranslations("commerceHero");
  const th = useTranslations("hero");

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
        {/* Один max-width для героя и карточек — без «съезда» влево/вправо */}
        <div className="pt-10 pb-6 md:pt-12 md:pb-8">
          <motion.div
            className="relative flex min-h-[380px] w-full flex-col justify-center overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#1a1a1a] shadow-[0_24px_80px_rgba(0,0,0,0.5)] md:min-h-[440px] lg:min-h-[460px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={SITE_MEDIA.heroPanel}
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/58 to-black/80"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,rgba(180,83,9,0.15),transparent_50%)]"
                aria-hidden
              />
            </div>

            <div className="relative z-10 flex flex-col items-center px-6 py-14 text-center sm:px-10 sm:py-16 md:px-14">
              <p className="inline-flex items-center rounded-full border border-white/15 bg-black/45 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-100/95 backdrop-blur-md sm:text-[11px]">
                {t("kicker")}
              </p>
              <h1 className="mt-8 max-w-3xl text-balance text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-[3.25rem]">
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  {t("headline_accent")}
                </span>
                <br />
                <span className="text-white">{t("headline_rest")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-neutral-300 md:text-base">
                {t("lead")}
              </p>

              <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
                <Link href="/catalog" className="sm:inline-flex sm:justify-center">
                  <motion.span
                    className={cn(
                      bttPrimaryButtonClass,
                      "group inline-flex w-full items-center justify-center gap-2 px-8 py-3.5 shadow-black/30 sm:w-auto"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {th("cta_buy")}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </motion.span>
                </Link>
                <Link href="/#quiz" className="sm:inline-flex sm:justify-center">
                  <motion.span
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-black/35 px-8 py-3.5 text-sm font-semibold text-neutral-100 backdrop-blur-sm transition hover:border-white/30 hover:bg-black/45 sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {th("cta_pick")}
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Карточки: одна сетка, равная высота, референс #1a1a1a */}
        <div className="grid grid-cols-1 gap-5 pb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:pb-16">
          {HERO_CATEGORIES.map((cat, index) => {
            const title = t(cat.messageKey);
            const src = SITE_MEDIA.categoryCard(cat.imageSeed);

            return (
              <motion.div
                key={cat.messageKey}
                className="flex h-full min-h-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.06 + index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={cat.href}
                  className="group relative flex min-h-[300px] w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#1a1a1a] p-5 pb-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition hover:border-white/12 sm:min-h-[320px]"
                >
                  <h2 className="relative z-10 text-center text-lg font-bold leading-tight tracking-tight text-white md:text-xl">
                    {title}
                  </h2>

                  <div className="relative mt-4 min-h-0 flex-1">
                    <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-[#121212]">
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 80vw, 220px"
                      />
                    </div>
                  </div>

                  <span
                    className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#121212] text-neutral-100 shadow-lg transition group-hover:border-amber-500/40 group-hover:text-amber-200"
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
