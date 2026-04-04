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
      className="inline-flex rounded-full border border-white/15 bg-white/[0.05] p-0.5 text-xs font-semibold backdrop-blur-md"
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
            "rounded-full px-3 py-1.5 transition-all",
            current === loc
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
              : "text-stone-400 hover:text-stone-200"
          )}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
