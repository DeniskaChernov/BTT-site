"use client";

import { useTranslations } from "next-intl";

type Props = { embedded?: boolean };

export function CatalogPriceGuide({ embedded = false }: Props) {
  const t = useTranslations("catalog");
  const rows = [
    { label: "price_guide_label_rattan", value: "price_guide_value_rattan" },
    { label: "price_guide_label_twisted", value: "price_guide_value_twisted" },
    { label: "price_guide_label_p5", value: "price_guide_value_p5" },
    { label: "price_guide_label_p5_handle", value: "price_guide_value_p5_handle" },
    { label: "price_guide_label_p10", value: "price_guide_value_p10" },
    { label: "price_guide_label_p16", value: "price_guide_value_p16" },
  ] as const;

  const inner = (
    <>
      {!embedded ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-300/90">{t("price_guide_kicker")}</p>
          <h2 className="mt-2 text-lg font-semibold text-stone-100 md:text-xl">{t("price_guide_title")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-400">{t("price_guide_lead")}</p>
        </>
      ) : null}
      <ul className={embedded ? "grid gap-2 sm:grid-cols-2" : "mt-4 grid gap-2 sm:grid-cols-2"}>
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
          >
            <span className="text-sm text-stone-400">{t(row.label)}</span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-stone-100">{t(row.value)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-stone-500">{t("price_guide_note")}</p>
    </>
  );

  if (embedded) return inner;
  return <div className="rounded-2xl border border-white/[0.08] bg-stone-950/40 p-5 md:p-6">{inner}</div>;
}
