import { getTranslations } from "next-intl/server";

export async function CatalogPriceGuide() {
  const t = await getTranslations("catalog");
  const rows = [
    { label: "price_guide_label_rattan", value: "price_guide_value_rattan" },
    { label: "price_guide_label_twisted", value: "price_guide_value_twisted" },
    { label: "price_guide_label_p5", value: "price_guide_value_p5" },
    { label: "price_guide_label_p5_handle", value: "price_guide_value_p5_handle" },
    { label: "price_guide_label_p10", value: "price_guide_value_p10" },
    { label: "price_guide_label_p16", value: "price_guide_value_p16" },
  ] as const;
  const planterSizes = [
    {
      title: "size_planter_puffy_10_title",
      lines: [
        "size_line_outer_d",
        "size_line_inner_d",
        "size_line_height",
      ] as const,
      values: ["33 см", "22.5 см", "24 см"] as const,
    },
    {
      title: "size_planter_puffy_16_title",
      lines: [
        "size_line_outer_d",
        "size_line_inner_d",
        "size_line_height",
      ] as const,
      values: ["36 см", "26 см", "28 см"] as const,
    },
    {
      title: "size_planter_classic_10_title",
      lines: [
        "size_line_outer_d",
        "size_line_inner_d",
        "size_line_height",
      ] as const,
      values: ["31 см", "23 см", "24 см"] as const,
    },
    {
      title: "size_planter_classic_16_title",
      lines: [
        "size_line_outer_d",
        "size_line_inner_d",
        "size_line_height",
      ] as const,
      values: ["35 см", "27.5 см", "28.5 см"] as const,
    },
  ] as const;
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-stone-950/40 p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
        {t("price_guide_kicker")}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-stone-100 md:text-xl">
        {t("price_guide_title")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-stone-400">{t("price_guide_lead")}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
          >
            <span className="text-sm text-stone-400">{t(row.label)}</span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-stone-100">
              {t(row.value)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-stone-100">{t("size_guide_title")}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {planterSizes.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/[0.06] bg-stone-950/40 p-3"
            >
              <p className="text-sm font-semibold text-amber-200">{t(item.title)}</p>
              <ul className="mt-2 space-y-1.5 text-xs text-stone-300">
                {item.lines.map((line, idx) => (
                  <li key={`${item.title}-${line}`} className="flex items-center justify-between gap-3">
                    <span className="text-stone-500">{t(line)}</span>
                    <span className="font-medium text-stone-200">{item.values[idx]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-stone-500">{t("price_guide_note")}</p>
    </div>
  );
}
