"use client";

import { Droplets, Leaf, Shield, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Sun, Shield, Leaf, Droplets] as const;

export function MaterialTrustStrip() {
  const t = useTranslations("home");

  const keys = ["strip_material", "strip_uv", "strip_outdoor", "strip_care"] as const;

  return (
    <section
      className="relative py-8 md:py-12"
      aria-labelledby="home-material-strip-title"
    >
      <div className="btt-container">
        <div className="btt-glass btt-section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="btt-section-kicker">
              {t("strip_kicker")}
            </p>
            <h2
              id="home-material-strip-title"
              className="mt-3 text-xl font-bold tracking-tight text-stone-50 md:text-2xl"
            >
              {t("strip_title")}
            </h2>
            <p className="sr-only">{t("strip_sub")}</p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = ICONS[i]!;
            return (
              <li
                key={key}
                className="group btt-bento-card flex h-full min-h-0 gap-3 p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-950/40 text-amber-300 ring-1 ring-white/[0.06] transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
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
