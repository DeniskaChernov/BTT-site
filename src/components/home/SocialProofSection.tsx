"use client";

import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export function SocialProofSection() {
  const t = useTranslations("home");
  const locale = useLocale() as "ru" | "en" | "uz";
  const reduceMotion = useReducedMotion();

  const blocks = useMemo(() => {
    const extraByLocale: Record<
      "ru" | "en" | "uz",
      { quote: string; meta: string; title: string }[]
    > = {
      ru: [
        {
          title: "Отзывы",
          quote: "«Берем уже четвертую партию, цвет между поставками стабильный, брака минимум.»",
          meta: "Цех мебели, Самарканд",
        },
        {
          title: "Кейсы",
          quote: "Кафе: комплект из 26 кашпо закрыли за 3 дня, отгрузили с маркировкой по точкам.",
          meta: "HoReCa, Ташкент",
        },
        {
          title: "Отзывы",
          quote: "«Менеджер быстро помог с подбором толщины под кресла, перерасхода почти нет.»",
          meta: "Мастерская, Бухара",
        },
        {
          title: "Кейсы",
          quote: "Для маркетплейса собрали тестовую серию, после чего масштабировали до регулярных поставок.",
          meta: "Проект B2B",
        },
      ],
      en: [
        {
          title: "Reviews",
          quote: "“Fourth batch already: color stays consistent and defect rate remains low.”",
          meta: "Furniture workshop, Samarkand",
        },
        {
          title: "Cases",
          quote: "Cafe chain: 26 planters delivered in 3 days with per-location labels.",
          meta: "HoReCa, Tashkent",
        },
        {
          title: "Reviews",
          quote: "“Manager helped us pick the right gauge for chairs, waste is minimal.”",
          meta: "Workshop, Bukhara",
        },
        {
          title: "Cases",
          quote: "We launched a test batch for marketplace and scaled to regular supply.",
          meta: "B2B project",
        },
      ],
      uz: [
        {
          title: "Fikrlar",
          quote: "«To‘rtinchi partiyani olyapmiz: rang barqaror, brak juda kam.»",
          meta: "Mebel sexi, Samarqand",
        },
        {
          title: "Keyslar",
          quote: "Kafe tarmog‘i: 26 ta kashpo 3 kunda jo‘natildi, nuqtalar bo‘yicha markirovka bilan.",
          meta: "HoReCa, Toshkent",
        },
        {
          title: "Fikrlar",
          quote: "«Menejer stullar uchun mos profilni tez tanlab berdi, chiqit deyarli yo‘q.»",
          meta: "Ustaxona, Buxoro",
        },
        {
          title: "Keyslar",
          quote: "Marketplace uchun test partiyadan boshlab, muntazam yetkazib berishga o‘tdik.",
          meta: "B2B loyiha",
        },
      ],
    };

    return [
      {
        quote: t("proof_1_quote"),
        meta: t("proof_1_meta"),
        title: t("reviews"),
      },
      {
        quote: t("proof_2_quote"),
        meta: t("proof_2_meta"),
        title: t("cases"),
      },
      ...extraByLocale[locale],
    ];
  }, [locale, t]);
  const [active, setActive] = useState(0);
  const prev = () => setActive((i) => (i - 1 + blocks.length) % blocks.length);
  const next = () => setActive((i) => (i + 1) % blocks.length);

  const chips = [
    { key: "ship", label: t("trust_ship") },
    { key: "batch", label: t("trust_batch") },
    { key: "clients", label: t("trust_clients") },
  ];

  return (
    <section className="btt-container pb-12 pt-6 md:pb-16 md:pt-8">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: [...BTT_EASE] }}
        className="mx-auto mb-8 max-w-2xl text-center md:mb-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
          {t("proof_section_kicker")}
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl">
          {t("proof_section_title")}
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-400 md:text-base">
          {t("proof_section_lead")}
        </p>
      </motion.div>
      <div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10 md:gap-3">
        {chips.map(({ key, label }, i) => (
          <motion.span
            key={key}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.35,
              delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.05),
              ease: [...BTT_EASE],
            }}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -2,
                    transition: { duration: 0.2, ease: [...BTT_EASE] },
                  }
            }
            className="rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-medium text-stone-400 backdrop-blur-sm md:text-sm motion-reduce:hover:translate-y-0"
          >
            {label}
          </motion.span>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[0, 1].map((slot) => {
          const i = (active + slot) % blocks.length;
          const b = blocks[i]!;
          return (
          <motion.div
            key={`${b.title}-${i}`}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.1),
              duration: reduceMotion ? 0 : 0.5,
              ease: [...BTT_EASE],
            }}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -3,
                    transition: { duration: 0.25, ease: [...BTT_EASE] },
                  }
            }
            className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.07] to-transparent p-8 shadow-xl backdrop-blur-2xl motion-reduce:hover:translate-y-0"
          >
            <Quote className="absolute right-6 top-6 h-16 w-16 text-amber-500/10 transition group-hover:text-amber-500/20" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {b.title}
            </h2>
            <p className="relative mt-4 text-base leading-relaxed text-stone-300">
              {b.quote}
            </p>
            <p className="relative mt-4 text-xs text-stone-500">{b.meta}</p>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 transition group-hover:opacity-100" />
          </motion.div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous review"
          onClick={prev}
          className="rounded-full border border-white/15 bg-white/[0.03] p-2 text-stone-300 transition hover:border-amber-500/40 hover:text-amber-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="min-w-24 text-center text-xs text-stone-500">
          {active + 1} / {blocks.length}
        </p>
        <button
          type="button"
          aria-label="Next review"
          onClick={next}
          className="rounded-full border border-white/15 bg-white/[0.03] p-2 text-stone-300 transition hover:border-amber-500/40 hover:text-amber-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
