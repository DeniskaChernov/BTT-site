"use client";

import type { CategoryTab, Product } from "@/types/product";
import { products } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type FilterState = {
  tab: CategoryTab;
  application: "all" | "outdoor" | "indoor" | "both";
  thickness: "all" | string;
  color: "all" | string;
  shape: "all" | string;
  hardness: "all" | string;
  stock: "all" | "in_stock" | "on_order";
};

type CatalogClientProps = {
  /** Из URL `?tab=` (ссылки с главной) */
  initialTab?: CategoryTab;
  /** Из URL `?shape=` */
  initialShape?: "all" | Product["shape"];
};

export function CatalogClient({
  initialTab = "material",
  initialShape = "all",
}: CatalogClientProps) {
  const t = useTranslations("catalog");
  const [f, setF] = useState<FilterState>(() => ({
    tab: initialTab,
    application: "all",
    thickness: "all",
    color: "all",
    shape: initialShape,
    hardness: "all",
    stock: "all",
  }));

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (f.tab === "material" && p.category !== "material") return false;
      if (f.tab === "planter" && p.category !== "planter") return false;
      if (f.tab === "new" && p.category !== "new") return false;
      if (f.application !== "all" && p.application !== f.application) return false;
      if (f.thickness !== "all" && String(p.thicknessMm) !== f.thickness)
        return false;
      if (f.color !== "all" && p.colorKey !== f.color) return false;
      if (f.shape !== "all" && p.shape !== f.shape) return false;
      if (f.hardness !== "all" && p.hardness !== f.hardness) return false;
      if (f.stock !== "all" && p.stock !== f.stock) return false;
      return true;
    });
  }, [f]);

  const tabs: { id: CategoryTab; label: string }[] = [
    { id: "material", label: t("tabs_material") },
    { id: "planter", label: t("tabs_planter") },
    { id: "new", label: t("tabs_new") },
  ];

  const chip = (
    key: keyof FilterState,
    value: string,
    label: string,
    active: boolean,
  ) => (
    <button
      key={`${String(key)}-${value}`}
      type="button"
      onClick={() => setF((s) => ({ ...s, [key]: value } as FilterState))}
      className={clsx(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition duration-200 will-change-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]",
        active
          ? "border-amber-400/60 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400/30"
          : "border-white/10 bg-white/[0.04] text-stone-300 hover:border-amber-500/35 hover:bg-white/[0.07] active:scale-95",
        active && "scale-[1.02]",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="btt-glass space-y-6 rounded-3xl p-5 shadow-inner shadow-black/20 lg:sticky lg:top-28 lg:self-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
            {t("filters")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tabs.map((tab) => chip("tab", tab.id, tab.label, f.tab === tab.id))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("filter_use")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("application", "all", t("all"), f.application === "all")}
            {chip("application", "outdoor", t("use_outdoor"), f.application === "outdoor")}
            {chip("application", "indoor", t("use_indoor"), f.application === "indoor")}
            {chip("application", "both", t("use_both"), f.application === "both")}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("filter_thickness")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("thickness", "all", t("all"), f.thickness === "all")}
            {["3", "4", "5", "6", "7", "8", "0"].map((mm) =>
              chip("thickness", mm, `${mm} mm`, f.thickness === mm)
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("filter_color")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("color", "all", t("all"), f.color === "all")}
            {(
              [
                "natural",
                "black",
                "white",
                "brown",
                "grey",
              ] as const
            ).map((c) =>
              chip(
                "color",
                c,
                t(`color_${c}` as "color_natural"),
                f.color === c
              )
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("filter_shape")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("shape", "all", t("all"), f.shape === "all")}
            {chip("shape", "round", t("shape_round"), f.shape === "round")}
            {chip("shape", "flat", t("shape_flat"), f.shape === "flat")}
            {chip("shape", "oval", t("shape_oval"), f.shape === "oval")}
            {chip("shape", "half_round", t("shape_half"), f.shape === "half_round")}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("filter_hardness")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("hardness", "all", t("all"), f.hardness === "all")}
            {chip("hardness", "soft", t("hard_soft"), f.hardness === "soft")}
            {chip("hardness", "medium", t("hard_med"), f.hardness === "medium")}
            {chip("hardness", "rigid", t("hard_rigid"), f.hardness === "rigid")}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("filter_stock")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("stock", "all", t("all"), f.stock === "all")}
            {chip("stock", "in_stock", t("stock_in"), f.stock === "in_stock")}
            {chip("stock", "on_order", t("stock_order"), f.stock === "on_order")}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setF({
              tab: "material",
              application: "all",
              thickness: "all",
              color: "all",
              shape: "all",
              hardness: "all",
              stock: "all",
            })
          }
          className="text-sm font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300"
        >
          {t("reset")}
        </button>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <p className="text-sm text-stone-400">
            {t("results_count", { count: filtered.length })}
          </p>
        </div>
        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-stone-500"
          >
            {t("empty")}
          </motion.p>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((p: Product) => (
              <motion.div
                key={p.sku}
                className="h-full min-h-0"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
