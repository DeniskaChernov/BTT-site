"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const t = useTranslations("common");

  return (
    <div className="inline-flex rounded-full border border-btt-border bg-btt-surface p-0.5 text-xs font-semibold">
      {(["UZS", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          className={clsx(
            "rounded-full px-2 py-1 transition-colors",
            currency === c
              ? "bg-btt-accent text-white"
              : "text-btt-muted hover:text-foreground"
          )}
        >
          {c === "UZS" ? t("currency_uzs") : t("currency_usd")}
        </button>
      ))}
    </div>
  );
}
