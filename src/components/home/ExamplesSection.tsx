"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import { SITE_MEDIA } from "@/lib/site-media";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function ExamplesSection() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  const items = [
    {
      title: s("example_furniture_title"),
      desc: s("example_furniture_desc"),
      seed: "btt-cat-rattan",
      href: "/catalog?tab=material",
    },
    {
      title: s("example_planters_title"),
      desc: s("example_planters_desc"),
      seed: "btt-cat-planter",
      href: "/catalog?tab=planter",
    },
    {
      title: s("example_chairs_title"),
      desc: s("example_chairs_desc"),
      seed: "btt-cat-twist",
      href: "/catalog?tab=material&shape=round",
    },
    {
      title: s("example_decor_title"),
      desc: s("example_decor_desc"),
      seed: "btt-cat-new",
      href: "/catalog?tab=new",
    },
  ];

  return (
    <section className="relative py-16 md:py-20" aria-labelledby="home-examples-title">
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [...BTT_EASE] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
            {s("examples_kicker")}
          </p>
          <h2
            id="home-examples-title"
            className="mt-3 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl"
          >
            {s("examples_title")}
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-stone-400 md:text-lg">
            {s("examples_sub")}
          </p>
        </motion.div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.li
              key={it.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : bttStaggerDelay(i, 0.06),
                ease: [...BTT_EASE],
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -4, transition: { duration: 0.25, ease: [...BTT_EASE] } }
              }
              className="min-w-0"
            >
              <Link
                href={it.href}
                className="group btt-focus block h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-xl backdrop-blur-xl transition-colors duration-300 hover:border-amber-500/35 motion-reduce:transition-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
                  <Image
                    src={SITE_MEDIA.categoryCard(it.seed)}
                    alt={it.title}
                    fill
                    loading="lazy"
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-base font-semibold text-stone-100 md:text-lg">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">{it.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 transition-all duration-200 group-hover:gap-2 motion-reduce:group-hover:gap-1.5">
                    {s("segment_master_cta")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
