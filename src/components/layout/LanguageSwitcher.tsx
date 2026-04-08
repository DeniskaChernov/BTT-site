"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
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

  return (
    <div
      className="flex items-center rounded-full border border-white/[0.12] bg-white/[0.06] p-0.5 shadow-none backdrop-blur-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.1)]"
      role="group"
      aria-label={t("locale_switch")}
    >
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={cn(
            "rounded-full px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition md:px-2.5 md:text-xs",
            locale === loc
              ? "bg-white/[0.14] text-stone-100"
              : "text-stone-500 hover:text-stone-200",
          )}
        >
          {LABELS[loc] ?? loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
