"use client";

import { getPublishedArticles } from "@/data/articles";
import { Link } from "@/i18n/navigation";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { SITE_MEDIA } from "@/lib/site-media";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function ArticlesCardGrid() {
  const t = useTranslations("articles");
  const reduceMotion = useReducedMotion();
  const published = getPublishedArticles();
  const articleCoverBySlug: Record<string, string> = {
    "rattan-thickness-furniture": SITE_MEDIA.categoryCard("btt-cat-rattan"),
    "planters-outdoor-uv-drainage": SITE_MEDIA.categoryCard("btt-cat-planter"),
    "wholesale-horeca-timelines": SITE_MEDIA.heroPanel,
  };

  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {published.map((a, i) => (
        <motion.li
          key={a.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.06),
            ease: [...BTT_EASE],
          }}
          whileHover={
            reduceMotion
              ? undefined
              : { y: -4, transition: { duration: 0.22, ease: [...BTT_EASE] } }
          }
          className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-shadow duration-300 hover:border-amber-500/25 hover:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.45)] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)] motion-reduce:hover:translate-y-0"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
            <Image
              src={articleCoverBySlug[a.slug] ?? SITE_MEDIA.heroPanel}
              alt={t(a.cardTitleKey)}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
              className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          </div>
          <div className="flex h-full min-h-0 flex-col p-6">
          <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/95">
            {t("badge_live")}
          </span>
          <h2 className="mt-4 line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug text-stone-100">
            {t(a.cardTitleKey)}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
            {t(a.cardDescKey)}
          </p>
          <Link
            href={`/articles/${a.slug}`}
            className="btt-focus mt-auto inline-flex items-center gap-1.5 rounded-sm pt-6 text-sm font-semibold text-amber-400 transition hover:gap-2 hover:text-amber-300 motion-reduce:transition-none motion-reduce:hover:gap-1.5"
          >
            {t("read_article")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
