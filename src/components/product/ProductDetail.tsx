"use client";

import { Link } from "@/i18n/navigation";
import type { Locale, Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { formatUzs, getPricePerKgForQty, UZS_PER_USD } from "@/lib/pricing";
import {
  bttFieldCompactClass,
  bttPrimaryButtonClass,
  bttTapReduceClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { CollectivePdpPanel } from "@/components/collective/CollectivePdpPanel";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PdpExamplesAndPromises } from "@/components/product/PdpExamplesAndPromises";
import { PdpTrustBar } from "@/components/product/PdpTrustBar";
import { PdpWholesaleTeaser } from "@/components/product/PdpWholesaleTeaser";
import { ProductHelpPanel } from "@/components/product/ProductHelpPanel";
import { ProductSpecsAndColors } from "@/components/product/ProductSpecsAndColors";
import { ProductValueGrid } from "@/components/product/ProductValueGrid";
import { trackEvent } from "@/lib/analytics";
import { productGalleryImages, productMainImage } from "@/lib/product-media";
import { telegramBotStartUrl, telegramChannelUrl, telegramPaymentChatUrl } from "@/lib/telegram";
import { useRouter } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, HelpCircle, Package, ShoppingBag, Users } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = { product: Product; related: Product[] };

export function ProductDetail({ product, related }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const c = useTranslations("common");
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(
    product.stock === "on_order" && product.category === "material" ? 100 : 1.5,
  );
  const [meters, setMeters] = useState(10);
  const [activeImg, setActiveImg] = useState(0);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isOnOrderMaterial = product.stock === "on_order" && product.category === "material";
  const belowPreorderMin = isOnOrderMaterial && qty < 100;
  const collectiveBotUrl = product.collective
    ? telegramBotStartUrl(product.collective.botStartParam)
    : null;
  const collectiveChannelUrl = telegramChannelUrl();

  const normalizeQty = (value: number) => {
    const minQty = isOnOrderMaterial ? 100 : 0.5;
    if (!Number.isFinite(value)) return minQty;
    return Math.max(minQty, Math.round(value * 2) / 2);
  };

  const normalizeMeters = (value: number) => {
    if (!Number.isFinite(value)) return 1;
    return Math.max(1, value);
  };

  useEffect(() => {
    trackEvent("view_pdp", {
      sku: product.sku,
      slug: product.slug,
      value: product.priceUz.t12,
      currency: "UZS",
    });
  }, [product.sku, product.slug, product.priceUz.t12]);

  const images = useMemo(() => productGalleryImages(product), [product]);

  useEffect(() => {
    setActiveImg((i) => Math.min(i, Math.max(0, images.length - 1)));
  }, [images.length]);

  const ppk = useMemo(() => getPricePerKgForQty(product, qty), [product, qty]);
  const lineTotal = Math.round(ppk * qty);
  const kgEst = useMemo(() => Math.max(0.1, meters * 0.12), [meters]);

  const onAdd = () => {
    add(product, product.names[locale], qty);
    trackEvent("add_to_cart", {
      sku: product.sku,
      value: lineTotal,
      currency: "UZS",
    });
  };

  const oneClick = () => {
    add(product, product.names[locale], qty);
    trackEvent("start_checkout", { from: "one_click_pdp", sku: product.sku });
    router.push("/checkout?one_click=1");
  };

  const scrollThumbs = (dir: -1 | 1) => {
    const el = thumbStripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 140, behavior: "smooth" });
  };

  return (
    <div className="btt-container py-10 pb-28 lg:pb-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-stone-900/50 shadow-2xl">
            <span
              className={cn(
                "absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-lg backdrop-blur-sm",
                product.stock === "in_stock"
                  ? "border-emerald-400/50 bg-emerald-900/60 text-emerald-100"
                  : "border-amber-400/50 bg-amber-950/70 text-amber-100",
              )}
            >
              <Package className="h-3 w-3" aria-hidden />
              {product.stock === "in_stock" ? c("in_stock") : c("on_order")}
            </span>
            <Image
              src={images[activeImg]!}
              alt={product.names[locale]}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          {images.length > 1 ? (
            <div className="mt-3 flex items-center gap-1">
              {images.length > 4 ? (
                <button
                  type="button"
                  aria-label={t("gallery_prev")}
                  onClick={() => scrollThumbs(-1)}
                  className="btt-focus hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-stone-300 transition hover:border-amber-500/35 sm:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : null}
              <div
                ref={thumbStripRef}
                className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:gap-2.5"
              >
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    aria-label={t("gallery_pick", { number: i + 1 })}
                    aria-current={activeImg === i ? true : undefined}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition duration-200 sm:h-20 sm:w-20",
                      activeImg === i
                        ? "border-amber-400 opacity-100 shadow-lg shadow-amber-900/30 ring-2 ring-amber-500/35"
                        : "border-transparent opacity-70 hover:opacity-100 hover:ring-1 hover:ring-white/20",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
              {images.length > 4 ? (
                <button
                  type="button"
                  aria-label={t("gallery_next")}
                  onClick={() => scrollThumbs(1)}
                  className="btt-focus hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-stone-300 transition hover:border-amber-500/35 sm:flex"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-stone-200">{t("videos")}</h2>
            <div className="mt-2 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-6 text-center sm:px-5 sm:py-7">
              <p className="text-sm font-medium text-stone-300">{t("videos_soon_title")}</p>
              <p className="mx-auto mt-1.5 max-w-md text-xs text-stone-500 sm:text-sm">
                {t("videos_soon_body")}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
            {t("sku")}: {product.sku}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-stone-50 sm:text-3xl md:text-4xl">
            {product.names[locale]}
          </h1>
          <p className="mt-2 text-pretty text-sm font-medium text-amber-200/95 md:text-base">
            {t("pdp_lead")}
          </p>
          <p className="mt-3 text-pretty text-sm text-stone-400 md:text-[15px]">
            {product.short[locale]}
          </p>

          <div className="mt-4">
            <MicroTrustStrip variant="compact" />
          </div>

          {product.lowStock ? (
            <p className="mt-3 text-sm font-medium text-amber-400">{c("low_stock")}</p>
          ) : null}

          <ul className="mt-5 max-w-prose space-y-1.5 text-sm text-stone-300">
            {product.bullets[locale].slice(0, 5).map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-amber-500/90">✓</span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-white/[0.1] bg-stone-900/30 p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-stone-500">{c("per_kg")}</p>
                <p className="text-2xl font-bold tabular-nums text-amber-300 md:text-3xl">
                  {formatUzs(ppk)}
                </p>
                <p className="text-xs text-stone-500">
                  {c("total_to_pay")}: {formatUzs(lineTotal)} · {t("qty")}: {qty} kg
                </p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-stone-500">
              {t("usd_note", { rate: UZS_PER_USD.toLocaleString() })}
            </p>
            <p className="text-sm font-semibold text-stone-200">{t("ladder_title")}</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-center">
                <p className="text-[10px] text-stone-500">{t("ladder_12")}</p>
                <p className="mt-0.5 text-xs font-bold tabular-nums text-stone-100">
                  {formatUzs(product.priceUz.t12)}
                </p>
              </div>
              <div className="relative rounded-xl border-2 border-amber-500/55 bg-gradient-to-b from-amber-950/40 to-stone-950/80 p-2 text-center">
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                  {t("ladder_anchor_badge")}
                </span>
                <p className="text-[10px] text-stone-400">{t("ladder_5")}</p>
                <p className="mt-0.5 text-xs font-bold tabular-nums text-amber-200">
                  {formatUzs(product.priceUz.t5)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-center">
                <p className="text-[10px] text-stone-500">{t("ladder_10")}</p>
                <p className="mt-0.5 text-xs font-bold tabular-nums text-stone-100">
                  {formatUzs(product.priceUz.t10)}
                </p>
              </div>
            </div>
          </div>

          {product.collective ? (
            <CollectivePdpPanel
              product={product}
              collective={product.collective}
              locale={locale}
            />
          ) : null}

          <div className="mt-5 flex flex-wrap items-end gap-4">
            <label className="grid gap-1 text-sm">
              <span>{t("qty")}</span>
              <input
                type="number"
                min={isOnOrderMaterial ? 100 : 0.5}
                step={0.5}
                value={qty}
                onChange={(e) => {
                  if (e.target.value === "") return;
                  setQty(normalizeQty(Number(e.target.value)));
                }}
                className={bttFieldCompactClass}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <motion.button
              type="button"
              onClick={oneClick}
              disabled={belowPreorderMin}
              className={cn(
                bttPrimaryButtonClass,
                "btt-focus order-1 inline-flex flex-1 items-center justify-center gap-2 sm:order-none sm:min-w-[9rem] sm:flex-none",
                belowPreorderMin && "pointer-events-none opacity-60",
              )}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              {isOnOrderMaterial ? t("preorder_cta") : t("pdp_buy_now")}
            </motion.button>
            <motion.button
              type="button"
              onClick={onAdd}
              disabled={belowPreorderMin}
              className={cn(
                "btt-focus order-2 inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-500/45 bg-transparent px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/10 sm:order-none sm:min-w-[9rem] sm:flex-none",
                bttTapReduceClass,
                belowPreorderMin && "pointer-events-none opacity-60",
              )}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              {c("add_cart")}
            </motion.button>
            <Link
              href="/#quiz"
              className={cn(
                "btt-focus order-3 inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-stone-200 transition hover:border-amber-500/40 hover:bg-white/[0.05] sm:order-none sm:min-w-[10rem] sm:flex-none",
                bttTapReduceClass,
              )}
            >
              <HelpCircle className="h-4 w-4 text-amber-300/90" aria-hidden />
              {c("pick_2m")}
            </Link>
          </div>

          {isOnOrderMaterial ? (
            <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-100">
              <p>{t("preorder_min_note")}</p>
              {belowPreorderMin ? (
                <p className="mt-2 text-xs text-amber-200/90">{t("preorder_min_error")}</p>
              ) : null}
              <p className="mt-3 text-xs text-amber-200/90">{t("preorder_collective_hint")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {collectiveBotUrl ? (
                  <a
                    href={collectiveBotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btt-focus inline-flex items-center gap-1 rounded-full border border-amber-300/40 px-3 py-1.5 text-xs font-medium text-amber-100 outline-none hover:bg-amber-500/10"
                  >
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {t("preorder_collective_bot")}
                  </a>
                ) : null}
                {collectiveChannelUrl ? (
                  <a
                    href={collectiveChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btt-focus inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1.5 text-xs font-medium text-stone-200 outline-none hover:bg-white/[0.08]"
                  >
                    {t("preorder_collective_channel")}
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ProductValueGrid product={product} />

      <ProductSpecsAndColors product={product} />

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <ProductHelpPanel
          className="mt-0 h-full"
          telegramUrl={telegramPaymentChatUrl()}
          sku={product.sku}
        />
        <PdpWholesaleTeaser />
      </div>

      <PdpExamplesAndPromises />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <details className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent open:border-amber-500/30">
          <summary className="btt-focus cursor-pointer list-none rounded-2xl px-5 py-4 text-sm font-semibold text-stone-100 outline-none transition marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              {t("material_title")}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-amber-500/75 motion-safe:transition-transform group-open:rotate-180 motion-reduce:group-open:rotate-0"
                aria-hidden
              />
            </span>
          </summary>
          <div className="border-t border-white/[0.06] px-5 pb-5 pt-0">
            <p className="pt-4 text-sm leading-relaxed text-stone-400">{t("material_intro")}</p>
            <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-stone-400 marker:text-amber-500/60">
              <li>{t("material_b1")}</li>
              <li>{t("material_b2")}</li>
              <li>{t("material_b3")}</li>
            </ul>
          </div>
        </details>

        <div className="btt-glass rounded-2xl p-5">
          <h2 className="font-semibold text-stone-100">{t("calc")}</h2>
          <p className="mt-1 text-sm text-stone-500">{t("calc_hint")}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="grid gap-1 text-sm">
              {t("meters")}
              <input
                type="number"
                min={1}
                value={meters}
                onChange={(e) => {
                  if (e.target.value === "") return;
                  setMeters(normalizeMeters(Number(e.target.value)));
                }}
                className={bttFieldCompactClass}
              />
            </label>
            <div>
              <p className="text-xs text-stone-500">{t("kg_est")}</p>
              <p className="text-lg font-semibold text-stone-100">{kgEst.toFixed(1)} kg</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold text-stone-100">{t("reviews")}</h2>
          <p className="mt-2 text-sm text-stone-400">{t("review_sample")}</p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-100">{t("delivery")}</h2>
          <p className="mt-2 text-sm text-stone-400">{t("delivery_text")}</p>
        </div>
      </div>

      <PdpTrustBar />

      <div className="mt-16">
        <h2 className="text-xl font-bold text-stone-100">{t("cross")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <div key={p.sku} className="h-full min-h-0">
              <Link
                href={`/product/${p.slug}`}
                className="group btt-focus flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm outline-none transition duration-300 hover:-translate-y-1 hover:border-amber-500/35 hover:shadow-xl hover:shadow-amber-950/20 motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-sm"
              >
                <div className="relative aspect-square shrink-0 overflow-hidden">
                  <Image
                    src={productMainImage(p)}
                    alt={p.names[locale]}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none" />
                </div>
                <div className="flex min-h-0 flex-1 flex-col p-3">
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-stone-200 transition group-hover:text-amber-100/95 motion-reduce:transition-none">
                    {p.names[locale]}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#070605]/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden">
        <div className="btt-container flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-stone-500">{c("per_kg")}</p>
            <p className="text-lg font-bold tabular-nums text-amber-400">{formatUzs(ppk)}</p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            disabled={belowPreorderMin}
            className={cn(
              bttPrimaryButtonClass,
              "btt-focus inline-flex items-center gap-2 px-5 active:scale-[0.98]",
              bttTapReduceClass,
              belowPreorderMin && "pointer-events-none opacity-60",
            )}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {c("add_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
