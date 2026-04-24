"use client";

import { Link } from "@/i18n/navigation";
import { TiltCard } from "@/components/ui/TiltCard";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, HeartHandshake, Wrench, Warehouse } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BttEventPayloads } from "@/lib/analytics";

type Segment = BttEventPayloads[typeof BTT_EVENTS.SegmentCardClick]["segment"];

export function SegmentSection() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const cards: {
    id: Segment;
    title: string;
    desc: string;
    cta: string;
    href: string;
    icon: typeof Wrench;
    accent: string;
  }[] = [
    {
      id: "master",
      title: s("segment_master_title"),
      desc: s("segment_master_desc"),
      cta: s("segment_master_cta"),
      href: "/catalog?tab=material",
      icon: Wrench,
      accent: "from-amber-500/20 to-transparent",
    },
    {
      id: "production",
      title: s("segment_prod_title"),
      desc: s("segment_prod_desc"),
      cta: s("segment_prod_cta"),
      href: "/wholesale",
      icon: Warehouse,
      accent: "from-orange-600/15 to-transparent",
    },
    {
      id: "pick",
      title: s("segment_pick_title"),
      desc: s("segment_pick_desc"),
      cta: s("segment_pick_cta"),
      href: "/#quiz",
      icon: HeartHandshake,
      accent: "from-stone-600/30 to-transparent",
    },
  ];

  return (
    <section className="relative py-10 md:py-14">
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            ease: [...BTT_EASE],
          }}
          className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80">
            {s("segment_kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
            {s("segment_title")}
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-stone-400 md:text-lg">
            {s("segment_sub")}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 auto-rows-fr gap-4 md:mt-12 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.08),
                duration: reduceMotion ? 0 : 0.45,
                ease: [...BTT_EASE],
              }}
              className="min-w-0"
            >
              <TiltCard className="h-full">
                <Link
                  href={c.href}
                  onClick={() =>
                    trackBttEvent(BTT_EVENTS.SegmentCardClick, {
                      segment: c.id,
                    })
                  }
                  className={`group btt-focus relative flex h-full min-h-[210px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br ${c.accent} p-8 shadow-xl ring-1 ring-white/[0.03] backdrop-blur-xl outline-none transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/35 motion-reduce:transition-none`}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-50"
                    aria-hidden
                  />
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl transition duration-500 group-hover:bg-amber-500/25 motion-reduce:transition-none" />
                  <c.icon
                    className="relative h-8 w-8 text-amber-400 transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100"
                    strokeWidth={1.5}
                  />
                  <h3 className="relative mt-6 text-xl font-semibold text-stone-50">
                    {c.title}
                  </h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-stone-400">
                    {c.desc}
                  </p>
                  <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-amber-400 transition-all duration-200 group-hover:gap-2 motion-reduce:transition-none motion-reduce:group-hover:gap-1">
                    {c.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
