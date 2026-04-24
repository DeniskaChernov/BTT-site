"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EASE, bttStaggerDelay } from "@/lib/motion";
import type { Locale, Product } from "@/types/product";
import { formatProfileGauge } from "@/lib/profile-size";
import { isPricedPerKg } from "@/lib/pricing";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

type Props = { product: Product };

const PALETTE = [
  "natural",
  "black",
  "white",
  "brown",
  "grey",
] as const;

const SWATCH: Record<string, string> = {
  natural: "from-amber-100/90 to-amber-600/50",
  black: "from-stone-800 to-stone-950",
  white: "from-stone-100 to-stone-300",
  brown: "from-amber-900/90 to-amber-950/80",
  grey: "from-stone-400/90 to-stone-600/90",
};

export function ProductSpecsAndColors({ product }: Props) {
  const locale = useLocale() as Locale;
  const c = useTranslations("catalog");
  const p = useTranslations("product");
  const reduceMotion = useReducedMotion();
  const gauge = formatProfileGauge(
    product,
    locale === "uz" ? "uz" : locale === "en" ? "en" : "ru",
  );

  const shapeKey =
    product.shape === "round"
      ? "shape_round"
      : product.shape === "flat"
        ? "shape_flat"
        : product.shape === "oval"
          ? "shape_oval"
          : "shape_half";
  const hardKey =
    product.hardness === "soft"
      ? "hard_soft"
      : product.hardness === "medium"
        ? "hard_med"
        : "hard_rigid";

  const showGauge = product.thicknessMm > 0;
  const showHardness = isPricedPerKg(product);
  const materialLabel =
    product.category === "planter" ||
    (product.category === "new" && product.thicknessMm <= 0)
      ? p("pdp_spec_material_planter")
      : p("pdp_spec_material_rattan");

  const rows: { k: string; v: string; mono?: boolean }[] = [
    { k: p("pdp_spec_shape"), v: c(shapeKey as "shape_round") },
    ...(showGauge ? [{ k: p("pdp_spec_gauge"), v: gauge }] : []),
    { k: p("pdp_spec_color"), v: c(`color_${product.colorKey}` as "color_natural") },
    { k: p("pdp_spec_material"), v: materialLabel },
    ...(showHardness ? [{ k: p("pdp_spec_hardness"), v: c(hardKey as "hard_soft") }] : []),
    {
      k: p("pdp_spec_stock"),
      v:
        product.stock === "in_stock"
          ? c("stock_in")
          : c("stock_order"),
    },
    { k: p("pdp_spec_sku"), v: product.sku, mono: true },
  ];

  return (
    <section
      className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start"
      aria-labelledby="pdp-specs-title"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: [...BTT_EASE] }}
        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
      >
        <h2
          id="pdp-specs-title"
          className="border-b border-white/[0.06] px-4 py-3 text-sm font-semibold text-stone-100"
        >
          {p("pdp_spec_title")}
        </h2>
        <dl className="divide-y divide-white/[0.05]">
          {rows.map(({ k, v, mono }) => (
            <div
              key={k}
              className="grid grid-cols-[1fr_1.2fr] gap-3 px-4 py-3 text-sm"
            >
              <dt className="text-stone-500">{k}</dt>
              <dd
                className={
                  mono
                    ? "font-mono text-sm font-medium text-stone-200"
                    : "font-medium text-stone-200"
                }
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{
          duration: reduceMotion ? 0 : 0.4,
          delay: bttStaggerDelay(1, 0.05),
          ease: [...BTT_EASE],
        }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
      >
        <h2 className="text-sm font-semibold text-stone-100">
          {p("pdp_colors_title")}
        </h2>
        <p className="mt-1 text-xs text-stone-500">{p("pdp_colors_hint")}</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {PALETTE.map((key) => {
            const active = key === product.colorKey;
            const tab =
              product.category === "planter"
                ? "planter"
                : product.category === "new"
                  ? "new"
                  : "material";
            return (
              <li key={key}>
                <Link
                  href={`/catalog?tab=${tab}&color=${key}`}
                  className="group btt-focus flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`relative h-10 w-10 overflow-hidden rounded-full border-2 bg-gradient-to-br p-0.5 shadow-md transition ${
                      active
                        ? "border-amber-500 ring-2 ring-amber-500/30"
                        : "border-white/10 hover:border-amber-500/40"
                    }`}
                    title={c(`color_${key}` as "color_natural")}
                  >
                    <span
                      className={`block h-full w-full rounded-full bg-gradient-to-br ${
                        SWATCH[key] ?? "from-stone-500 to-stone-700"
                      }`}
                    />
                  </span>
                  <span
                    className={`max-w-[4.5rem] text-center text-[10px] font-medium leading-tight ${
                      active ? "text-amber-200" : "text-stone-500"
                    }`}
                  >
                    {c(`color_${key}` as "color_natural")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </section>
  );
}
