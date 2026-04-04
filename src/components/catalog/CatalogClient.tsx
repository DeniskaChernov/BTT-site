"use client";

import type { CategoryTab, Product } from "@/types/product";
import { products } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import clsx from "clsx";
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
}


export function CatalogClient() {
  const t = useTranslations("catalog");
  const [f, setF] = useState<FilterState>({
    tab: "material",
    application: "all",
    thickness: "all",
    color: "all",
    shape: "all",
    hardness: "all",
    stock: "all",
  });

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
    active: boolean
  ) => (
    <button
      key={`${String(key)}-${value}`}
      type="button"
      onClick={() =>
        setF((s) => ({ ...s, [key]: value } as FilterState))
      }
      className={clsx(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-btt-primary bg-btt-primary text-white"
          : "border-btt-border bg-btt-surface hover:border-btt-primary/40"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-btt-muted">
            {t("filters")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tabs.map((tab) => chip("tab", tab.id, tab.label, f.tab === tab.id))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">{t("filter_use")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("application", "all", t("all"), f.application === "all")}
            {chip("application", "outdoor", t("use_outdoor"), f.application === "outdoor")}
            {chip("application", "indoor", t("use_indoor"), f.application === "indoor")}
            {chip("application", "both", t("use_both"), f.application === "both")}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">{t("filter_thickness")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("thickness", "all", t("all"), f.thickness === "all")}
            {["3", "4", "5", "6", "7", "8", "0"].map((mm) =>
              chip("thickness", mm, `${mm} mm`, f.thickness === mm)
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">{t("filter_color")}</p>
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
          <p className="text-sm font-medium">{t("filter_shape")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("shape", "all", t("all"), f.shape === "all")}
            {chip("shape", "round", t("shape_round"), f.shape === "round")}
            {chip("shape", "flat", t("shape_flat"), f.shape === "flat")}
            {chip("shape", "oval", t("shape_oval"), f.shape === "oval")}
            {chip("shape", "half_round", t("shape_half"), f.shape === "half_round")}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">{t("filter_hardness")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chip("hardness", "all", t("all"), f.hardness === "all")}
            {chip("hardness", "soft", t("hard_soft"), f.hardness === "soft")}
            {chip("hardness", "medium", t("hard_med"), f.hardness === "medium")}
            {chip("hardness", "rigid", t("hard_rigid"), f.hardness === "rigid")}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">{t("filter_stock")}</p>
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
          className="text-sm font-semibold text-btt-primary underline"
        >
          {t("reset")}
        </button>
      </aside>

      <div>
        {filtered.length === 0 ? (
          <p className="text-sm text-btt-muted">{t("empty")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p: Product) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
