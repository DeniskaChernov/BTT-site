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
          ? "gap-0.5 border-0 bg-white/[0.05]"
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
            const search =
              typeof window !== "undefined" ? window.location.search : "";
            const hash =
              typeof window !== "undefined" ? window.location.hash : "";
            const href = search ? `${pathname}${search}` : pathname;
            router.replace(`${href}${hash}`, { locale: loc });
          }}
          className={cn(
            "rounded-full font-semibold transition-all outline-none",
            isNavbar
              ? "min-w-[2rem] px-2.5 py-1.5 text-[10px] sm:min-w-[2.25rem] sm:px-3 sm:py-2 sm:text-xs"
              : "px-3 py-1.5 text-xs",
            current === loc
              ? "bg-gradient-to-b from-amber-500 to-orange-600 text-white shadow-sm ring-1 ring-amber-400/35"
              : isNavbar
                ? "text-stone-500 hover:bg-white/[0.06] hover:text-stone-200"
                : "text-stone-400 hover:text-stone-200",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
          )}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
