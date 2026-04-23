"use client";

import {
  INSTAGRAM_HIGHLIGHTS,
  type InstagramHighlightCategory,
} from "@/data/instagram-highlights";
import { Link } from "@/i18n/navigation";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type Tab = "all" | InstagramHighlightCategory;

export function InstagramHighlightsSection() {
  const t = useTranslations("home");
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<Tab>("all");

  const cards = useMemo(
    () =>
      tab === "all"
        ? INSTAGRAM_HIGHLIGHTS
        : INSTAGRAM_HIGHLIGHTS.filter((x) => x.category === tab),
    [tab],
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: t("insta_tab_all") },
    { id: "project", label: t("insta_tab_projects") },
    { id: "material", label: t("insta_tab_material") },
    { id: "process", label: t("insta_tab_process") },
  ];

  return (
    <section className="relative py-14 md:py-20">
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [...BTT_EASE] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
            {t("insta_kicker")}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl">
            {t("insta_title")}
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-400 md:text-base">
            {t("insta_lead")}
          </p>
        </motion.div>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {tabs.map((x) => {
            const active = tab === x.id;
            return (
              <button
                key={x.id}
                type="button"
                onClick={() => setTab(x.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605] md:text-sm",
                  active
                    ? "border-amber-400/60 bg-amber-500/15 text-amber-100"
                    : "border-white/12 bg-white/[0.04] text-stone-300 hover:border-amber-500/30 hover:bg-white/[0.06]",
                )}
              >
                {x.label}
              </button>
            );
          })}
        </div>

        <motion.ul
          layout={!reduceMotion}
          className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {cards.map((card, i) => (
              <motion.li
                key={card.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.05),
                  ease: [...BTT_EASE],
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, transition: { duration: 0.2, ease: [...BTT_EASE] } }
                }
                className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-xl backdrop-blur-xl motion-reduce:hover:translate-y-0"
              >
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btt-focus block h-full"
                  aria-label={`${t(card.titleKey)} — Instagram`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
                    <Image
                      src={card.image}
                      alt={t(card.titleKey)}
                      fill
                      loading="lazy"
                      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-stone-100 backdrop-blur-sm">
                      <Camera className="h-3.5 w-3.5" />
                      @bententrade
                    </span>
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="text-sm font-semibold text-stone-100 md:text-base">
                      {t(card.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-400">
                      {t(card.descKey)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                      {t("insta_cta_profile")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.instagram.com/bententrade/"
            target="_blank"
            rel="noopener noreferrer"
            className="btt-focus inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15 motion-reduce:transition-none"
          >
            <Camera className="h-4 w-4" />
            {t("insta_cta_profile")}
          </a>
          <Link
            href="/catalog"
            className="btt-focus inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-white/25 motion-reduce:transition-none"
          >
            {t("insta_cta_catalog")}
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-stone-500">
          {t("insta_profile_note")}
        </p>
      </div>
    </section>
  );
}
