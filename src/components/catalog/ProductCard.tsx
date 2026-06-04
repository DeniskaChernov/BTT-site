"use client";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types/product";
import type { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { formatProfileGauge } from "@/lib/profile-size";
import { productMainImage } from "@/lib/product-media";
import {
  formatUzs,
  getPricePerKgForQty,
  getQtyRules,
  isPricedPerKg,
  isTwistedRattan,
  lineItemTotalUz,
} from "@/lib/pricing";
import { telegramBotStartUrl, telegramChannelUrl } from "@/lib/telegram";
import { BTT_EVENTS, trackBttEvent, trackEvent } from "@/lib/analytics";
import { bttPrimaryButtonClass, bttTapReduceClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  ChevronDown,
  HeartHandshake,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  product: Product;
};

function benefitKeyFor(product: Product): "furniture" | "planter" | "universal" | "decor" {
  if (product.category === "planter") return "planter";
  if (product.thicknessMm !== 0 && product.thicknessMm <= 4) return "decor";
  if (product.hardness === "rigid" && product.thicknessMm >= 6) return "furniture";
  return "universal";
}

function tierRows(product: Product, perKg: boolean, isTwisted: boolean, c: ReturnType<typeof useTranslations<"catalog">>) {
  if (perKg && isTwisted) {
    return [
      [5, getPricePerKgForQty(product, 5), c("w5")],
      [200, getPricePerKgForQty(product, 200), c("preorder_200")],
      [400, getPricePerKgForQty(product, 400), c("preorder_400")],
    ] as const;
  }
  if (perKg) {
    return [
      [5, getPricePerKgForQty(product, 5), c("w5")],
      [200, getPricePerKgForQty(product, 200), c("preorder_200")],
      [500, getPricePerKgForQty(product, 500), c("preorder_500")],
    ] as const;
  }
  return [
    [1, getPricePerKgForQty(product, 1), c("w12_piece")],
    [3, getPricePerKgForQty(product, 3), c("w5_piece")],
    [10, getPricePerKgForQty(product, 10), c("w10_piece")],
  ] as const;
}

export function ProductCard({ product }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const col = useTranslations("collective");
  const tc = useTranslations("cart");
  const c = useTranslations("catalog");
  const s = useTranslations("sales");
  const { add } = useCart();
  const [toast, setToast] = useState(false);
  const isOnOrderMaterial = product.stock === "on_order" && product.category === "material";
  const perKg = isPricedPerKg(product);
  const isTwisted = isTwistedRattan(product);
  const qtyRules = getQtyRules(product);
  const [quickQty, setQuickQty] = useState<number>(perKg ? qtyRules.min : 1);
  const toastTimerRef = useRef<number | null>(null);

  const name = product.names[locale];
  const ppk = getPricePerKgForQty(product, quickQty);
  const img = productMainImage(product);
  const collectiveBotUrl = product.collective
    ? telegramBotStartUrl(product.collective.botStartParam)
    : null;
  const collectiveChannelUrl = telegramChannelUrl();
  const benefitKey = benefitKeyFor(product);
  const benefitLabel = s(`card_benefit_${benefitKey}` as "card_benefit_furniture");
  const gauge = formatProfileGauge(product, locale);
  const tiers = tierRows(product, perKg, isTwisted, c);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product, name, quickQty);
    trackEvent("add_to_cart", {
      sku: product.sku,
      value: lineItemTotalUz(product, quickQty),
      currency: "UZS",
      qtyKg: quickQty,
    });
    setToast(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(false), 1800);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02] shadow-xl ring-1 ring-white/[0.03] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 ease-out hover:border-amber-500/30 hover:shadow-amber-950/10">
      <div
        className="pointer-events-none absolute inset-x-5 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        aria-hidden
      />
      <Link
        href={`/product/${product.slug}`}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]"
      >
        <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-stone-950 sm:aspect-square">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-between opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-stone-100 backdrop-blur-md">
              {t("learn_more")}
              <ArrowRight className="h-3.5 w-3.5 text-amber-400" aria-hidden />
            </span>
          </div>
          <span
            className={cn(
              "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-lg backdrop-blur-sm",
              product.stock === "in_stock"
                ? "border-emerald-400/50 bg-emerald-900/60 text-emerald-100"
                : "border-amber-400/50 bg-amber-950/70 text-amber-100",
            )}
          >
            <Package className="h-3 w-3" aria-hidden />
            {product.stock === "in_stock" ? c("stock_in") : c("stock_order")}
          </span>
          {product.isBrochure ? (
            <span className="absolute right-3 top-3 rounded-full border border-sky-400/40 bg-sky-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-100 shadow-lg backdrop-blur-sm">
              {c("badge_profile_line")}
            </span>
          ) : null}
          {product.collective && !product.isBrochure ? (
            <span className="absolute right-3 top-12 rounded-full border border-amber-400/50 bg-amber-950/90 px-2.5 py-1 text-xs font-semibold text-amber-200 shadow-lg backdrop-blur-sm">
              {col("card_badge")}
            </span>
          ) : null}
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400/90">
            {benefitLabel}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-stone-100 transition-colors duration-200 group-hover:text-amber-100/95">
            {name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-950/30 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-amber-200/95">
              {gauge}
            </span>
            <span className="text-[11px] font-medium text-stone-500">{product.sku}</span>
            {perKg ? (
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold text-stone-400">
                {c("card_moq", { min: String(qtyRules.min) })}
              </span>
            ) : null}
          </div>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {product.bullets[locale].slice(0, 2).map((b) => (
              <li
                key={b}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-stone-400"
              >
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-3">
            <p className="text-lg font-bold tabular-nums text-amber-400">
              {c("card_price_from", {
                price: formatUzs(ppk),
                unit: perKg ? t("per_kg") : t("per_piece"),
                moq: perKg
                  ? c("card_moq_short", { min: String(qtyRules.min) })
                  : c("card_moq_pcs"),
              })}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {perKg
                ? t("card_hint_line_kg", {
                    total: formatUzs(lineItemTotalUz(product, quickQty)),
                    qty: String(quickQty),
                  })
                : t("card_hint_line_pcs", {
                    total: formatUzs(lineItemTotalUz(product, quickQty)),
                    qty: String(quickQty),
                  })}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-auto px-4 pb-4 sm:px-5 sm:pb-5">
        <details className="group/tier mb-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] open:bg-white/[0.04]">
          <summary className="btt-focus flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-stone-300 [&::-webkit-details-marker]:hidden">
            <span>{c("card_tier_details")}</span>
            <ChevronDown className="h-4 w-4 text-stone-500 transition group-open/tier:rotate-180" aria-hidden />
          </summary>
          <div className="space-y-2 border-t border-white/[0.06] px-3 py-2">
            {tiers.map(([qty, price, label]) => (
              <button
                key={qty}
                type="button"
                onClick={() => setQuickQty(qty)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition",
                  quickQty === qty
                    ? "border-amber-400/50 bg-amber-500/10 text-amber-100"
                    : "border-white/10 text-stone-400 hover:border-amber-500/30",
                )}
              >
                <span>{label}</span>
                <span className="font-semibold tabular-nums text-stone-100">
                  {formatUzs(price)}
                  {perKg ? ` / ${t("per_kg")}` : ` / ${t("per_piece")}`}
                </span>
              </button>
            ))}
          </div>
        </details>

        {isOnOrderMaterial ? (
          <p className="mb-3 text-xs leading-relaxed text-stone-500">{c("preorder_min_note")}</p>
        ) : null}
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            bttPrimaryButtonClass,
            "btt-focus flex w-full items-center justify-center gap-2",
            bttTapReduceClass,
          )}
        >
          <ShoppingBag className="h-4 w-4 opacity-90" aria-hidden />
          {isOnOrderMaterial ? c("preorder_cta") : t("add_cart")}
        </button>
        <Link
          href="/#quiz"
          onClick={() =>
            trackBttEvent(BTT_EVENTS.CardPickClick, {
              sku: product.sku,
              slug: product.slug,
            })
          }
          className="btt-focus mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.02] px-4 py-2 text-xs font-semibold text-stone-200 transition-colors duration-200 hover:border-amber-500/35 hover:bg-white/[0.06] hover:text-amber-100 motion-reduce:transition-none"
        >
          <HeartHandshake className="h-3.5 w-3.5 text-amber-300" aria-hidden />
          {s("card_cta_pick")}
        </Link>
        {isOnOrderMaterial ? (
          <div className="mt-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-100/95">
            <p>{c("preorder_collective_hint")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {collectiveBotUrl ? (
                <a
                  href={collectiveBotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btt-focus inline-flex items-center gap-1 rounded-full border border-amber-400/40 px-2.5 py-1 outline-none hover:bg-amber-500/10"
                >
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  {c("preorder_collective_bot")}
                </a>
              ) : null}
              {collectiveChannelUrl ? (
                <a
                  href={collectiveChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btt-focus inline-flex items-center gap-1 rounded-full border border-white/25 px-2.5 py-1 text-stone-200 outline-none hover:bg-white/[0.08]"
                >
                  {c("preorder_collective_channel")}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
        {toast ? (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-emerald-400">
            <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
            {tc("added_flash")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
