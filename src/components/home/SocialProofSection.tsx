"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

export function SocialProofSection() {
  const t = useTranslations("home");

  const blocks = [
    {
      quote:
        "«Партия ровная, цвет совпал с образцом. Заказали повтор без вопросов.»",
      meta: "— мастерская, Ташкент",
      title: t("reviews"),
    },
    {
      quote:
        "HoReCa: кашпо L для террасы — отгрузка за 48 часов, документы приложены.",
      meta: "— кейс B2B",
      title: t("cases"),
    },
  ];

  return (
    <section className="btt-container pb-20 pt-4 md:pb-28">
      <div className="grid gap-6 md:grid-cols-2">
        {blocks.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.07] to-transparent p-8 shadow-xl backdrop-blur-2xl"
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
        ))}
      </div>
    </section>
  );
}
