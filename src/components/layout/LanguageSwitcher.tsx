"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { BTT_SPRING_SOFT } from "@/lib/motion";
import { bttTapReduceClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

const LABELS: Record<string, string> = {
  ru: "RU",
  uz: "UZ",
  en: "EN",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const reduceMotion = useReducedMotion();

  return (
    <LayoutGroup id="site-locale">
      <div
        className="flex items-center rounded-full border border-white/[0.12] bg-white/[0.06] p-0.5 shadow-none backdrop-blur-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.1)]"
        role="group"
        aria-label={t("locale_switch")}
      >
        {routing.locales.map((loc) => {
          const active = locale === loc;
          return (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              className={cn(
                "btt-focus relative rounded-full px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605] motion-reduce:transition-none md:px-2.5 md:text-xs",
                active
                  ? "text-stone-50"
                  : cn(
                      "text-stone-500 hover:bg-white/[0.06] hover:text-stone-200 active:scale-95",
                      bttTapReduceClass,
                    ),
              )}
            >
              {active ? (
                <motion.span
                  layoutId="btt-locale-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/25 to-white/[0.08] shadow-sm ring-1 ring-amber-500/25"
                  transition={
                    reduceMotion ? { duration: 0 } : BTT_SPRING_SOFT
                  }
                />
              ) : null}
              <span className="relative z-10 block px-0.5">
                {LABELS[loc] ?? loc.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
