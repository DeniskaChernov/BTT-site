"use client";

import { Droplets, Leaf, Shield, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Sun, Shield, Leaf, Droplets] as const;

export function MaterialTrustStrip() {
  const t = useTranslations("home");

  const keys = ["strip_material", "strip_uv", "strip_outdoor", "strip_care"] as const;

  return (
    <section
      className="relative py-12 md:py-16"
      aria-labelledby="home-material-strip-title"
    >
      <div className="btt-container">
        <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.02] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] md:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
              {t("strip_kicker")}
            </p>
            <h2
              id="home-material-strip-title"
              className="mt-3 text-xl font-bold tracking-tight text-stone-50 md:text-2xl"
            >
              {t("strip_title")}
            </h2>
            <p className="mt-2 text-sm text-stone-500 md:text-base">{t("strip_sub")}</p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = ICONS[i]!;
            return (
              <li
                key={key}
                className="flex h-full min-h-0 gap-3 rounded-2xl border border-white/[0.06] bg-black/20 p-4 transition hover:border-amber-500/30 hover:bg-black/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-950/40 text-amber-300">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm leading-snug text-stone-300">{t(key)}</span>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </section>
  );
}
