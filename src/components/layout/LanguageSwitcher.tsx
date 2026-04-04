"use client";

import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import clsx from "clsx";
import { useParams } from "next/navigation";

const labels: Record<string, string> = { ru: "RU", uz: "UZ", en: "EN" };

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const current = (params?.locale as string) || routing.defaultLocale;

  return (
    <div
      className="inline-flex rounded-full border border-btt-border bg-btt-surface p-0.5 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => {
            trackEvent("lang_switch", { locale: loc });
            router.replace(pathname, { locale: loc });
          }}
          className={clsx(
            "rounded-full px-2.5 py-1 transition-colors",
            current === loc
              ? "bg-btt-primary text-white shadow-sm"
              : "text-btt-muted hover:text-foreground"
          )}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
