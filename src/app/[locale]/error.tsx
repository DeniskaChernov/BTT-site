"use client";

import { bttTapReduceClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error("[locale error]", error);
  }, [error]);

  return (
    <div className="btt-container flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-xl font-semibold text-stone-200">{t("title")}</h1>
      <p className="mt-3 max-w-md text-sm text-stone-500">{t("body")}</p>
      <button
        type="button"
        onClick={() => reset()}
        className={cn(
          "btt-focus mt-8 rounded-full border border-amber-500/40 bg-amber-500/15 px-6 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/25 active:scale-[0.98]",
          bttTapReduceClass,
        )}
      >
        {t("retry")}
      </button>
    </div>
  );
}
