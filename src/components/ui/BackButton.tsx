"use client";

import { useRouter } from "@/i18n/navigation";
import { bttTapReduceClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

type Props = {
  /** Куда вести, если открыли карточку «в холостую» (прямой URL, пустой стек). */
  fallbackHref: string;
  className?: string;
};

/**
 * «Назад» в рамках сайта: `router.back()` при ненулевом стеке, иначе `fallbackHref`
 * (типично — каталог с выбранной вкладкой).
 */
export function BackButton({ fallbackHref, className }: Props) {
  const t = useTranslations("common");
  const router = useRouter();

  const onBack = useCallback(() => {
    if (typeof window === "undefined") {
      router.push(fallbackHref);
      return;
    }
    const sameOriginReferrer =
      document.referrer && document.referrer.startsWith(window.location.origin);
    if (window.history.length > 1 && sameOriginReferrer) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }, [router, fallbackHref]);

  return (
    <button
      type="button"
      onClick={onBack}
      className={cn(
        "btt-focus group inline-flex items-center gap-1.5 rounded-lg py-1.5 text-left text-sm font-medium text-stone-400 transition-colors duration-200 hover:text-amber-200",
        bttTapReduceClass,
        className,
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-300 transition group-hover:border-amber-500/30 group-hover:bg-white/[0.08] group-hover:text-amber-200">
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </span>
      <span>{t("back")}</span>
    </button>
  );
}
