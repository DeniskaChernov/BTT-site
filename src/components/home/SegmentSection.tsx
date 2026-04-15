"use client";

import { Link } from "@/i18n/navigation";
import { TiltCard } from "@/components/ui/TiltCard";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles, Wrench, Warehouse } from "lucide-react";
import { useTranslations } from "next-intl";

export function SegmentSection() {
  const t = useTranslations("segments");
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      title: t("novice"),
      desc: t("novice_desc"),
      href: "/catalog?tab=new",
      icon: Sparkles,
      accent: "from-amber-500/20 to-transparent",
    },
    {
      title: t("master"),
      desc: t("master_desc"),
      href: "/catalog?tab=material",
      icon: Wrench,
      accent: "from-orange-600/15 to-transparent",
    },
    {
      title: t("wholesale"),
      desc: t("wholesale_desc"),
      href: "/wholesale",
      icon: Warehouse,
      accent: "from-stone-600/30 to-transparent",
    },
  ];

  return (
    <section className="relative py-16 md:py-24">
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
            {t("kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-stone-400 md:text-lg">
            {t("sub")}
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
                  className={`group btt-focus relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br ${c.accent} p-8 shadow-xl backdrop-blur-xl outline-none transition hover:border-amber-500/35 motion-reduce:transition-none`}
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl transition group-hover:bg-amber-500/20 motion-reduce:transition-none" />
                  <c.icon className="relative h-8 w-8 text-amber-400" strokeWidth={1.5} />
                  <h3 className="relative mt-6 text-xl font-semibold text-stone-50">
                    {c.title}
                  </h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-stone-400">
                    {c.desc}
                  </p>
                  <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-amber-400 transition group-hover:gap-2 motion-reduce:transition-none motion-reduce:group-hover:gap-1">
                    {t("cta")}
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
