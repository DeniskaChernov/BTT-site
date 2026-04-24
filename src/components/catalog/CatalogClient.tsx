"use client";

import type { CategoryTab, Product } from "@/types/product";
import { products } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { getPricePerKgForQty, isPricedPerKg } from "@/lib/pricing";
import { BTT_EASE, BTT_SPRING_SNAPPY } from "@/lib/motion";
import {
  bttFieldClass,
  bttSelectFieldClass,
  bttTapReduceClass,
} from "@/lib/ui-classes";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

type FilterState = {
  tab: CategoryTab;
  thickness: "all" | string;
  color: "all" | string;
  shape: "all" | string;
  hardness: "all" | string;
  stock: "all" | "in_stock" | "on_order";
  source: "all" | "pdf";
};

type SortMode = "popular" | "price_asc" | "price_desc" | "name_asc";

const CATALOG_COLORS = [
  "all",
  "natural",
  "black",
  "white",
  "brown",
  "grey",
] as const;
type CatalogColor = (typeof CATALOG_COLORS)[number];

type CatalogClientProps = {
  /** Из URL `?tab=` (ссылки с главной) */
  initialTab?: CategoryTab;
  /** Из URL `?shape=` */
  initialShape?: "all" | Product["shape"];
  /** Из URL `?color=` */
  initialColor?: string;
};

function CatalogSkeletonGrid({ label }: { label: string }) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy
      aria-label={label}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex h-full min-h-[22rem] flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02]"
        >
          <div className="aspect-square animate-pulse bg-stone-800/80" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="h-4 w-[75%] animate-pulse rounded bg-stone-800/80" />
            <div className="h-4 w-full animate-pulse rounded bg-stone-800/60" />
            <div className="mt-auto h-9 w-28 animate-pulse rounded-full bg-stone-800/70" />
            <div className="h-10 w-full animate-pulse rounded-full bg-amber-950/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

function parseInitialColor(v: string | undefined): CatalogColor {
  if (v && (CATALOG_COLORS as readonly string[]).includes(v)) {
    return v as CatalogColor;
  }
  return "all";
}

export function CatalogClient({
  initialTab = "material",
  initialShape = "all",
  initialColor,
}: CatalogClientProps) {
  const t = useTranslations("catalog");
  const color0 = parseInitialColor(initialColor);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [sortMode, setSortMode] = useState<SortMode>("popular");
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [f, setF] = useState<FilterState>(() => ({
    tab: initialTab,
    thickness: "all",
    color: color0,
    shape: initialShape,
    hardness: "all",
    stock: "all",
    source: "all",
  }));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFiltersOpen]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileFiltersOpen]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      if (f.tab === "material" && p.category !== "material") return false;
      if (f.tab === "planter" && p.category !== "planter") return false;
      if (f.tab === "new" && p.category !== "new") return false;
      if (f.thickness !== "all" && String(p.thicknessMm) !== f.thickness)
        return false;
      if (f.color !== "all" && p.colorKey !== f.color) return false;
      if (f.shape !== "all" && p.shape !== f.shape) return false;
      if (f.hardness !== "all" && p.hardness !== f.hardness) return false;
      if (f.stock !== "all" && p.stock !== f.stock) return false;
      if (f.source === "pdf" && !p.isBrochure) return false;
      if (q) {
        const bag = [
          p.sku,
          p.slug,
          p.names.ru,
          p.names.en,
          p.names.uz,
          p.short.ru,
          p.short.en,
          p.short.uz,
        ]
          .join(" ")
          .toLowerCase();
        if (!bag.includes(q)) return false;
      }
      return true;
    });

    const refQty = (p: Product) => (isPricedPerKg(p) ? 5 : 1);
    if (sortMode === "price_asc") {
      return [...list].sort(
        (a, b) => getPricePerKgForQty(a, refQty(a)) - getPricePerKgForQty(b, refQty(b)),
      );
    }
    if (sortMode === "price_desc") {
      return [...list].sort(
        (a, b) => getPricePerKgForQty(b, refQty(b)) - getPricePerKgForQty(a, refQty(a)),
      );
    }
    if (sortMode === "name_asc") {
      return [...list].sort((a, b) => a.names.ru.localeCompare(b.names.ru));
    }
    return list;
  }, [f, deferredQuery, sortMode]);

  const activeFilters = useMemo(() => {
    const chips: { key: keyof FilterState; value: string; label: string }[] = [];
    if (f.thickness !== "all") {
      chips.push({ key: "thickness", value: f.thickness, label: `${f.thickness} mm` });
    }
    if (f.color !== "all") {
      chips.push({
        key: "color",
        value: f.color,
        label: t(`color_${f.color}` as "color_natural"),
      });
    }
    if (f.shape !== "all") {
      chips.push({
        key: "shape",
        value: f.shape,
        label:
          f.shape === "round"
            ? t("shape_round")
            : f.shape === "flat"
              ? t("shape_flat")
              : f.shape === "oval"
                ? t("shape_oval")
                : t("shape_half"),
      });
    }
    if (f.hardness !== "all") {
      chips.push({
        key: "hardness",
        value: f.hardness,
        label:
          f.hardness === "soft"
            ? t("hard_soft")
            : f.hardness === "medium"
              ? t("hard_med")
              : t("hard_rigid"),
      });
    }
    if (f.stock !== "all") {
      chips.push({
        key: "stock",
        value: f.stock,
        label: f.stock === "in_stock" ? t("stock_in") : t("stock_order"),
      });
    }
    if (f.source !== "all") {
      chips.push({
        key: "source",
        value: f.source,
        label: t("filter_source_pdf"),
      });
    }
    return chips;
  }, [f, t]);

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
      onClick={() =>
        startTransition(() => {
          trackBttEvent(BTT_EVENTS.CatalogFilterApply, {
            key: String(key),
            value,
          });
          setF((s) => ({ ...s, [key]: value } as FilterState));
        })
      }
      className={clsx(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition duration-200 will-change-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]",
        active
          ? "border-amber-400/60 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400/30"
          : clsx(
              "border-white/10 bg-white/[0.04] text-stone-300 hover:border-amber-500/35 hover:bg-white/[0.07] active:scale-95",
              bttTapReduceClass,
            ),
        active && "scale-[1.02]",
      )}
    >
      {label}
    </button>
  );

  const resetFilters = (source: "sidebar" | "active_chips" = "sidebar") => {
    startTransition(() => {
      trackBttEvent(BTT_EVENTS.CatalogFilterReset, { source });
      setF({
        tab: f.tab,
        thickness: "all",
        color: "all",
        shape: "all",
        hardness: "all",
        stock: "all",
        source: "all",
      });
    });
    setQuery("");
  };

  const filtersContent = (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
          {t("filters")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tabs.map((tab) => chip("tab", tab.id, tab.label, f.tab === tab.id))}
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
        <p className="text-sm font-medium text-stone-200">{t("filter_source")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {chip("source", "all", t("all"), f.source === "all")}
          {chip("source", "pdf", t("filter_source_pdf"), f.source === "pdf")}
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
        onClick={() => resetFilters("sidebar")}
        className="text-sm font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300"
      >
        {t("reset")}
      </button>
    </>
  );

  const showGridSkeleton = isPending && !mobileFiltersOpen;
  const searchLagging = query.trim() !== deferredQuery.trim();

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
      <motion.aside
        initial={reduceMotion ? false : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.35,
          ease: [...BTT_EASE],
        }}
        className="btt-glass hidden space-y-6 rounded-3xl p-5 shadow-inner shadow-black/20 lg:sticky lg:top-28 lg:block lg:self-start"
      >
        {filtersContent}
      </motion.aside>

      <div className="min-w-0 pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <div className="mb-4 grid gap-3 border-b border-white/[0.06] pb-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className={clsx(bttFieldClass, "w-full pl-9")}
            />
          </label>
          <label className="grid gap-1 text-xs text-stone-500">
            {t("sort_label")}
            <select
              value={sortMode}
              onChange={(e) => {
                const mode = e.target.value as SortMode;
                trackBttEvent(BTT_EVENTS.CatalogSortChange, { mode });
                startTransition(() => setSortMode(mode));
              }}
              className={clsx(bttSelectFieldClass, "min-w-[190px] py-2")}
            >
              <option value="popular">{t("sort_popular")}</option>
              <option value="price_asc">{t("sort_price_asc")}</option>
              <option value="price_desc">{t("sort_price_desc")}</option>
              <option value="name_asc">{t("sort_name_asc")}</option>
            </select>
          </label>
          <p
            className={clsx(
              "text-sm md:text-right",
              searchLagging ? "text-stone-500" : "text-stone-400",
            )}
          >
            {t("results_count", { count: filtered.length })}
          </p>
        </div>

        <AnimatePresence>
          {(activeFilters.length > 0 || query.trim()) && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{
              duration: reduceMotion ? 0 : 0.22,
              ease: [...BTT_EASE],
            }}
            className="mb-4 flex flex-wrap items-center gap-2"
          >
              <span className="text-xs text-stone-500">{t("active_filters")}</span>
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 transition hover:bg-amber-500/20"
                >
                  {`"${query.trim()}" ×`}
                </button>
              ) : null}
              {activeFilters.map((x) => (
                <button
                  key={`${x.key}-${x.value}`}
                  type="button"
                  onClick={() =>
                    startTransition(() => {
                      setF((s) => ({ ...s, [x.key]: "all" } as FilterState));
                    })
                  }
                  className="rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 transition hover:bg-amber-500/20"
                >
                  {x.label} ×
                </button>
              ))}
              <button
                type="button"
                onClick={() => resetFilters("active_chips")}
                className="text-xs font-medium text-stone-400 underline-offset-4 hover:text-stone-200 hover:underline"
              >
                {t("reset")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {showGridSkeleton ? (
          <CatalogSkeletonGrid label={t("loading_grid")} />
        ) : filtered.length === 0 ? (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.28,
              ease: [...BTT_EASE],
            }}
            className="text-sm text-stone-500"
          >
            {t("empty")}
          </motion.p>
        ) : (
          <motion.div
            layout={!reduceMotion}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduceMotion ? 0 : 0.05 },
              },
            }}
            className={clsx(
              "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
              searchLagging && "opacity-60 transition-opacity duration-200",
            )}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p: Product) => (
                <motion.div
                  key={p.sku}
                  layout={!reduceMotion}
                  className="h-full min-h-0"
                  variants={{
                    hidden: {
                      opacity: reduceMotion ? 1 : 0,
                      y: reduceMotion ? 0 : 12,
                    },
                    show: { opacity: 1, y: 0 },
                  }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -8, transition: { duration: 0.2 } }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    ease: [...BTT_EASE],
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <button
        type="button"
        className={clsx(
          "btt-focus fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_36px_-6px_rgba(245,158,11,0.38),0_6px_20px_rgba(0,0,0,0.45)] ring-1 ring-white/20 transition active:scale-[0.97] lg:hidden",
          bttTapReduceClass,
        )}
        onClick={() => setMobileFiltersOpen(true)}
      >
        <Filter className="h-4 w-4 opacity-95" aria-hidden />
        {t("filters")}
      </button>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <>
            <motion.button
              key="catalog-filter-backdrop"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
              aria-label={t("filters_close")}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[3px] lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="catalog-filter-sheet"
              role="dialog"
              aria-modal
              aria-labelledby="catalog-filters-sheet-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={
                reduceMotion
                  ? { duration: 0.2, ease: "easeInOut" }
                  : BTT_SPRING_SNAPPY
              }
              className="fixed inset-x-0 bottom-0 z-[51] max-h-[88vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0c0a09] px-5 pt-4 pb-[max(2rem,calc(1rem+env(safe-area-inset-bottom,0px)))] shadow-[0_-24px_64px_rgba(0,0,0,0.55)] lg:hidden"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
              <div className="mb-4 flex items-center justify-between gap-3">
                <p
                  id="catalog-filters-sheet-title"
                  className="text-sm font-semibold text-stone-100"
                >
                  {t("filters")}
                </p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="btt-focus rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-stone-200 transition hover:border-amber-500/40 hover:text-amber-100"
                >
                  {t("filters_close")}
                </button>
              </div>
              <div className="btt-glass space-y-6 rounded-2xl p-4">{filtersContent}</div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="btt-focus mt-5 w-full rounded-full border border-amber-500/45 bg-gradient-to-r from-amber-600 to-orange-600 py-3 text-sm font-semibold text-white shadow-md shadow-amber-950/40"
              >
                {t("filters_done")}
              </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
