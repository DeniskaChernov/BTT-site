"use client";

import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

const labels: Record<string, string> = { ru: "RU", uz: "UZ", en: "EN" };

type Props = {
  /** Внутри единого pill-навбара — без отдельной рамки */
  variant?: "default" | "navbar";
};

export function LanguageSwitcher({ variant = "default" }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const current = (params?.locale as string) || routing.defaultLocale;

  const isNavbar = variant === "navbar";

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center rounded-full p-0.5",
        isNavbar
          ? "gap-0 border-0 bg-white/[0.04]"
          : "border border-white/15 bg-white/[0.05] backdrop-blur-md"
      )}
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
          className={cn(
            "rounded-full font-semibold transition-all",
            isNavbar
              ? "px-2 py-1.5 text-[10px] sm:px-2.5 sm:py-2 sm:text-xs"
              : "px-3 py-1.5 text-xs",
            current === loc
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm"
              : isNavbar
                ? "text-stone-500 hover:text-stone-300"
                : "text-stone-400 hover:text-stone-200"
          )}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
