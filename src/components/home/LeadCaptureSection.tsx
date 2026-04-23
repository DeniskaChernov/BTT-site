"use client";

import { LeadForm } from "@/components/forms/LeadForm";
import { BTT_EASE } from "@/lib/motion";
import { bttFieldClass, bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

/**
 * Лендинг-форма захвата заявки с главной: имя + телефон.
 * Использует существующий LeadForm (kind: wholesale) + плавные микроанимации.
 */
export function LeadCaptureSection() {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();
  const nameId = useId();
  const phoneId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <section
      id="lead-capture"
      className="relative py-16 md:py-20"
      aria-labelledby="home-lead-title"
    >
      <div className="btt-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [...BTT_EASE] }}
          className="relative overflow-hidden rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-stone-950/80 to-orange-950/30 p-6 shadow-[0_24px_60px_-20px_rgba(245,158,11,0.3)] md:p-10"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-orange-900/20 blur-3xl"
            aria-hidden
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-start lg:gap-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/90">
                {s("lead_kicker")}
              </p>
              <h2
                id="home-lead-title"
                className="mt-3 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl lg:text-4xl"
              >
                {s("lead_title")}
              </h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-300 md:text-base">
                {s("lead_sub")}
              </p>
              <p className="mt-5 flex items-center gap-2 text-xs text-amber-200/80 md:text-sm">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                {s("lead_privacy")}
              </p>
            </div>

            <LeadForm
              kind="wholesale"
              className="grid gap-3 rounded-3xl border border-white/[0.08] bg-black/40 p-5 backdrop-blur-xl md:p-6"
            >
              <input type="hidden" name="lead_source" value="home_lead_capture" />
              <label htmlFor={nameId} className="grid gap-1.5 text-sm text-stone-200">
                <span>{s("lead_name_placeholder")}</span>
                <input
                  id={nameId}
                  name="wholesale_name"
                  type="text"
                  autoComplete="name"
                  placeholder={s("lead_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(bttFieldClass, "w-full")}
                  required
                  minLength={2}
                />
              </label>
              <label htmlFor={phoneId} className="grid gap-1.5 text-sm text-stone-200">
                <span>{s("lead_phone_placeholder")}</span>
                <input
                  id={phoneId}
                  name="wholesale_phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={s("lead_phone_placeholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(bttFieldClass, "w-full tabular-nums")}
                  required
                  inputMode="tel"
                  pattern="[0-9+\-()\s]{7,}"
                />
              </label>
              <input
                type="hidden"
                name="wholesale_details"
                value={`Заявка с главной${name ? ` — ${name.trim()}` : ""}`}
              />
              <motion.button
                type="submit"
                className={cn(
                  bttPrimaryButtonClass,
                  "btt-focus mt-1 inline-flex items-center justify-center gap-2",
                )}
                whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                {s("lead_submit")}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </LeadForm>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
