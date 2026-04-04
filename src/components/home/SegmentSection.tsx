"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function SegmentSection() {
  const t = useTranslations("segments");

  const cards = [
    {
      title: t("novice"),
      desc: t("novice_desc"),
      href: "/catalog?segment=novice",
      tone: "from-emerald-50 to-white",
    },
    {
      title: t("master"),
      desc: t("master_desc"),
      href: "/catalog?segment=master",
      tone: "from-amber-50 to-white",
    },
    {
      title: t("wholesale"),
      desc: t("wholesale_desc"),
      href: "/wholesale",
      tone: "from-slate-50 to-white",
    },
  ];

  return (
    <section className="btt-container py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-btt-muted">{t("sub")}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Link
              href={c.href}
              className={`block h-full rounded-btt border border-btt-border bg-gradient-to-br ${c.tone} p-6 shadow-btt-sm transition hover:-translate-y-0.5 hover:shadow-btt`}
            >
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-btt-muted">{c.desc}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-btt-primary">
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
