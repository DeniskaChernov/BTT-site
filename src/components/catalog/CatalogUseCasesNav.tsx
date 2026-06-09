"use client";

import { Link } from "@/i18n/navigation";
import {
  BTT_EVENTS,
  trackBttEvent,
  type BttEventPayloads,
} from "@/lib/analytics";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { Armchair, ArrowUpRight, Flower2, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

type DivisionPreset =
  BttEventPayloads[typeof BTT_EVENTS.CatalogUsecaseClick]["preset"];

type Props = { embedded?: boolean };

/** Три раздела каталога: общее / кашпо / мебель. */
export function CatalogUseCasesNav({ embedded = false }: Props) {
  const t = useTranslations("catalog");
  const reduceMotion = useReducedMotion();

  const items: {
    id: DivisionPreset;
    title: string;
    desc: string;
    href: string;
    icon: typeof Layers;
  }[] = [
    {
      id: "furniture",
      title: t("division_general"),
      desc: t("division_general_desc"),
      href: "/catalog?tab=material",
      icon: Layers,
    },
    {
      id: "planter",
      title: t("division_planter"),
      desc: t("division_planter_desc"),
      href: "/catalog?tab=planter",
      icon: Flower2,
    },
    {
      id: "universal",
      title: t("division_furniture"),
      desc: t("division_furniture_desc"),
      href: "/catalog/furniture",
      icon: Armchair,
    },
  ];

  const grid = (
    <ul className={embedded ? "grid gap-3 sm:grid-cols-3" : "mt-3 grid gap-3 sm:grid-cols-3"}>
      {items.map((it, i) => (
        <motion.li
          key={it.href}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{
            duration: reduceMotion ? 0 : 0.4,
            delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.06),
            ease: [...BTT_EASE],
          }}
          whileHover={
            reduceMotion
              ? undefined
              : { y: -3, transition: { duration: 0.2, ease: [...BTT_EASE] } }
          }
          className="min-w-0"
        >
          <Link
            href={it.href}
            onClick={() =>
              trackBttEvent(BTT_EVENTS.CatalogUsecaseClick, {
                preset: it.id,
              })
            }
            className="btt-focus group flex h-full min-h-[5.5rem] flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-stone-100">
              <it.icon className="h-4 w-4 shrink-0 text-stone-200/90" aria-hidden />
              {it.title}
              <ArrowUpRight
                className="ml-auto h-3.5 w-3.5 text-stone-600 transition group-hover:text-stone-200/80 motion-reduce:transition-none"
                aria-hidden
              />
            </span>
            <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500 group-hover:text-stone-400">
              {it.desc}
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );

  if (embedded) return grid;

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400/80">
        {t("divisions_title")}
      </p>
      {grid}
    </section>
  );
}
