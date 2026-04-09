"use client";

import { Droplets, Leaf, Shield, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Sun, Shield, Leaf, Droplets] as const;

export function MaterialTrustStrip() {
  const t = useTranslations("home");

  const keys = ["strip_pe", "strip_uv", "strip_outdoor", "strip_care"] as const;

  return (
    <section
      className="relative border-y border-white/[0.06] bg-gradient-to-b from-black/20 to-transparent"
      aria-label={t("strip_aria")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="btt-container py-8 md:py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/75">
          {t("strip_kicker")}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = ICONS[i]!;
            return (
              <li
                key={key}
                className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-sm transition hover:border-amber-500/25"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600/25 to-orange-900/30 text-amber-400/95">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm leading-snug text-stone-300">{t(key)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
