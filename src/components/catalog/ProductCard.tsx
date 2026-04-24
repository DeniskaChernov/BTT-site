"use client";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types/product";
import type { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { productMainImage } from "@/lib/product-media";
import { formatUzs, getPricePerKgForQty } from "@/lib/pricing";
import { telegramBotStartUrl, telegramChannelUrl } from "@/lib/telegram";
import { BTT_EVENTS, trackBttEvent, trackEvent } from "@/lib/analytics";
import { bttPrimaryButtonClass, bttTapReduceClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
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

/** Подзаголовок-выгода: кашпо / тонкие нити (декор) / крупные жёсткие (мебель) / в остальных случаях — универсальный профиль. */
function benefitKeyFor(product: Product): "furniture" | "planter" | "universal" | "decor" {
  if (product.category === "planter") return "planter";
  if (product.thicknessMm !== 0 && product.thicknessMm <= 4) return "decor";
  if (product.hardness === "rigid" && product.thicknessMm >= 6) return "furniture";
  return "universal";
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
  const [quickQty, setQuickQty] = useState<number>(isOnOrderMaterial ? 100 : 1.5);
  const toastTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const name = product.names[locale];
  const ppk = getPricePerKgForQty(product, quickQty);
  const img = productMainImage(product);
  const collectiveBotUrl = product.collective
    ? telegramBotStartUrl(product.collective.botStartParam)
    : null;
  const collectiveChannelUrl = telegramChannelUrl();
  const benefitKey = benefitKeyFor(product);
  const benefitLabel = s(`card_benefit_${benefitKey}` as "card_benefit_furniture");

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product, name, quickQty);
    trackEvent("add_to_cart", {
      sku: product.sku,
      value: Math.round(ppk * quickQty),
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
    <motion.article
      layout={!reduceMotion}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-xl backdrop-blur-xl transition-all duration-300 ease-out hover:border-amber-500/30 hover:shadow-[0_24px_64px_-12px_rgba(245,158,11,0.18)]"
      whileHover={reduceMotion ? undefined : { y: -5 }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]"
      >
        <div className="relative aspect-square shrink-0 overflow-hidden bg-stone-950">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition duration-300 group-hover:opacity-90" />
          <div className="absolute bottom-4 left-4 right-4 flex translate-y-3 items-center justify-between opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-stone-100 shadow-lg backdrop-blur-md">
              {t("learn_more")}
              <ArrowRight className="h-3.5 w-3.5 text-amber-400" aria-hidden />
            </span>
          </div>
          {/* Бейдж наличия */}
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
          {product.collective && (
            <span className="absolute right-3 top-3 rounded-full border border-amber-400/50 bg-amber-950/90 px-2.5 py-1 text-xs font-semibold text-amber-200 shadow-lg backdrop-blur-sm">
              {col("card_badge")}
            </span>
          )}
          {product.lowStock && (
            <span className="absolute left-3 bottom-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-white/20">
              {t("low_stock")}
            </span>
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400/90">
            {benefitLabel}
          </p>
          <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-stone-100 transition-colors duration-200 group-hover:text-amber-100/95">
            {name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[2.625rem] text-sm leading-relaxed text-stone-500">
            {product.short[locale]}
          </p>

          {/* Характеристики (буллеты) — не удаляем существующие параметры */}
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {product.bullets[locale].slice(0, 3).map((b) => (
              <li
                key={b}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-stone-400"
              >
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tabular-nums text-amber-400">
                {formatUzs(ppk)}
              </span>
              <span className="text-xs text-stone-500">{t("per_kg")}</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {`≈ ${formatUzs(Math.round(ppk * quickQty))} / ${quickQty} kg`}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-auto px-5 pb-5">
        <div className="mb-3 flex gap-2">
          {(
            isOnOrderMaterial
              ? ([
                  [100, c("preorder_100")],
                  [250, c("preorder_250")],
                  [500, c("preorder_500")],
                ] as const)
              : ([
                  [1.5, c("w12")],
                  [5, c("w5")],
                  [10, c("w10")],
                ] as const)
          ).map(([kg, label]) => (
            <button
              key={kg}
              type="button"
              onClick={() => setQuickQty(kg)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
                quickQty === kg
                  ? "border-amber-400/70 bg-amber-500/15 text-amber-200 shadow-inner shadow-amber-900/30"
                  : "border-white/15 text-stone-400 hover:border-amber-500/45 hover:text-stone-200",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {isOnOrderMaterial ? (
          <p className="mb-3 text-xs leading-relaxed text-stone-500">
            {c("preorder_min_note")}
          </p>
        ) : null}
        <motion.button
          type="button"
          onClick={onAdd}
          whileHover={reduceMotion ? undefined : { scale: 1.01 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className={cn(
            bttPrimaryButtonClass,
            "btt-focus flex w-full items-center justify-center gap-2",
            bttTapReduceClass,
          )}
        >
          <ShoppingBag className="h-4 w-4 opacity-90" aria-hidden />
          {isOnOrderMaterial ? c("preorder_cta") : t("add_cart")}
        </motion.button>
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
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.92 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 480, damping: 26 },
              }}
              exit={
                reduceMotion
                  ? { opacity: 0, transition: { duration: 0.12 } }
                  : {
                      opacity: 0,
                      y: -6,
                      scale: 0.96,
                      transition: { duration: 0.18 },
                    }
              }
              className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-emerald-400"
            >
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              {tc("added_flash")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
