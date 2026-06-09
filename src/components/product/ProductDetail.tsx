"use client";

import { Link } from "@/i18n/navigation";
import type { Locale, Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import {
  formatUzs,
  getPricePerKgForQty,
  isPricedPerKg,
  isTwistedRattan,
  lineItemTotalUz,
} from "@/lib/pricing";
import {
  bttFieldCompactClass,
  bttMobileCommerceBarClass,
  bttMobilePageBottomClass,
  bttPrimaryButtonClass,
  bttTapReduceClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { CollectivePdpPanel } from "@/components/collective/CollectivePdpPanel";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PdpExamplesAndPromises } from "@/components/product/PdpExamplesAndPromises";
import { PdpTrustBar } from "@/components/product/PdpTrustBar";
import { PdpCompareButton } from "@/components/product/PdpCompareButton";
import { ProductPriceStory } from "@/components/product/ProductPriceStory";
import { ProductRelatedSection } from "@/components/product/ProductRelatedSection";
import { YieldCalculator } from "@/components/product/YieldCalculator";
import { PdpWholesaleTeaser } from "@/components/product/PdpWholesaleTeaser";
import { ProductHelpPanel } from "@/components/product/ProductHelpPanel";
import { ProductSpecsAndColors } from "@/components/product/ProductSpecsAndColors";
import { ProductValueGrid } from "@/components/product/ProductValueGrid";
import { BackButton } from "@/components/ui/BackButton";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { productGalleryImages } from "@/lib/product-media";
import { MIN_PREORDER_QTY_KG } from "@/lib/pricing";
import { telegramBotStartUrl, telegramChannelUrl, telegramPaymentChatUrl } from "@/lib/telegram";
import { useRouter } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, HelpCircle, Package, ShoppingBag, Users } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = { product: Product };

export function ProductDetail({ product }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const c = useTranslations("common");
  const { add } = useCart();
  const { trackViewSku } = useIntent();
  const router = useRouter();
  const isOnOrderMaterial = product.stock === "on_order" && product.category === "material";
  const perKg = isPricedPerKg(product);
  const isTwisted = isTwistedRattan(product);
  const [qty, setQty] = useState(perKg ? 5 : 1);

  const [activeImg, setActiveImg] = useState(0);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  /** Совпадает с правилом MIN_PREORDER на сервере для материала под заказ */
  const belowPreorderMin =
    isOnOrderMaterial && qty < MIN_PREORDER_QTY_KG;
  const collectiveBotUrl = product.collective
    ? telegramBotStartUrl(product.collective.botStartParam)
    : null;
  const collectiveChannelUrl = telegramChannelUrl();

  const normalizeQty = (value: number) => {
    if (perKg) {
      if (!Number.isFinite(value)) return 5;
      return Math.max(5, Math.round(value / 5) * 5);
    }
    if (!Number.isFinite(value)) return 1;
    return Math.max(1, Math.round(value));
  };

  useEffect(() => {
    trackViewSku(product.sku);
    trackBttEvent(BTT_EVENTS.ViewPdp, {
      sku: product.sku,
      slug: product.slug,
      value: product.priceUz.t12,
      currency: "UZS",
    });
  }, [product.sku, product.slug, product.priceUz.t12, trackViewSku]);

  const images = useMemo(() => productGalleryImages(product), [product]);

  useEffect(() => {
    setActiveImg((i) => Math.min(i, Math.max(0, images.length - 1)));
  }, [images.length]);

  const ppk = useMemo(() => getPricePerKgForQty(product, qty), [product, qty]);
  const lineTotal = lineItemTotalUz(product, qty);
  const usdNote = t("usd_note");

  const onAdd = () => {
    add(product, product.names[locale], qty);
    trackBttEvent(BTT_EVENTS.CartAdd, {
      sku: product.sku,
      slug: product.slug,
      qtyKg: qty,
      source: "pdp",
      value: lineTotal,
      currency: "UZS",
    });
  };

  const orderNow = () => {
    add(product, product.names[locale], qty);
    trackBttEvent(BTT_EVENTS.StartCheckout, {
      from: "pdp_order_now",
      sku: product.sku,
    });
    router.push("/checkout");
  };

  const scrollThumbs = (dir: -1 | 1) => {
    const el = thumbStripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 140, behavior: "smooth" });
  };

  const catalogFallback = `/catalog?tab=${product.category}`;

  return (
    <div className={cn("btt-container py-10", bttMobilePageBottomClass)}>
      <div className="mb-6">
        <BackButton fallbackHref={catalogFallback} />
      </div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-stone-900/50 shadow-2xl ring-1 ring-white/[0.04]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
              aria-hidden
            />
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
          {!product.isBrochure ? (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-stone-200">{t("videos")}</h2>
              <div className="mt-2 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-6 text-center sm:px-5 sm:py-7">
                <p className="text-sm font-medium text-stone-300">{t("videos_soon_title")}</p>
                <p className="mx-auto mt-1.5 max-w-md text-xs text-stone-500 sm:text-sm">
                  {t("videos_soon_body")}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Link
                    href="/articles"
                    className="btt-focus inline-flex min-h-11 items-center rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15 sm:text-sm"
                  >
                    {t("videos_soon_cta_articles")}
                  </Link>
                  <Link
                    href="/catalog"
                    className="btt-focus inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-stone-200 transition hover:border-white/25 sm:text-sm"
                  >
                    {t("videos_soon_cta_catalog")}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] md:p-6">
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

          <div className="mt-6 rounded-2xl border border-white/[0.12] bg-gradient-to-b from-stone-900/60 to-stone-950/60 p-4 ring-1 ring-white/[0.03] sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-stone-500">
                  {perKg ? c("per_kg") : c("per_piece")}
                </p>
                <p className="text-2xl font-bold tabular-nums text-amber-300 md:text-3xl">
                  {formatUzs(ppk)}
                </p>
                <p className="text-xs text-stone-500">
                  {c("total_to_pay")}: {formatUzs(lineTotal)} ·{" "}
                  {perKg ? (
                    <>
                      {t("qty")}: {qty} kg
                    </>
                  ) : (
                    <>
                      {t("qty_piece")}: {qty}
                    </>
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-stone-200">
              {perKg ? t("ladder_title") : t("ladder_title_piece")}
            </p>
            {usdNote ? <p className="mt-2 text-[11px] text-stone-500">{usdNote}</p> : null}
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-center">
                <p className="text-[10px] text-stone-500">
                  {perKg
                    ? t("ladder_5")
                    : t("ladder_12_piece")}
                </p>
                <p className="mt-0.5 text-xs font-bold tabular-nums text-stone-100">
                  {formatUzs(getPricePerKgForQty(product, perKg ? 5 : 1))}
                </p>
              </div>
              <div className="relative rounded-xl border-2 border-amber-500/55 bg-gradient-to-b from-amber-950/40 to-stone-950/80 p-2 text-center shadow-[0_8px_24px_rgba(245,158,11,0.1)]">
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                  {t("ladder_anchor_badge")}
                </span>
                <p className="text-[10px] text-stone-400">
                  {perKg
                    ? t("ladder_200")
                    : t("ladder_5_piece")}
                </p>
                <p className="mt-0.5 text-xs font-bold tabular-nums text-amber-200">
                  {formatUzs(getPricePerKgForQty(product, perKg ? 200 : 3))}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-center">
                <p className="text-[10px] text-stone-500">
                  {perKg
                    ? isTwisted
                      ? t("ladder_400")
                      : t("ladder_500")
                    : t("ladder_10_piece")}
                </p>
                <p className="mt-0.5 text-xs font-bold tabular-nums text-stone-100">
                  {formatUzs(getPricePerKgForQty(product, perKg ? (isTwisted ? 400 : 500) : 10))}
                </p>
              </div>
            </div>
            <ProductPriceStory product={product} qty={qty} />
            <PdpCompareButton sku={product.sku} />
          </div>

          {product.collective ? (
            <CollectivePdpPanel
              product={product}
              collective={product.collective}
              locale={locale}
            />
          ) : null}

          <div className="mt-5 flex flex-wrap items-end gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 sm:p-4">
            <label className="grid gap-1 text-sm">
              <span>{perKg ? t("qty") : t("qty_piece")}</span>
              <input
                type="number"
                min={perKg ? (isOnOrderMaterial ? MIN_PREORDER_QTY_KG : 5) : 1}
                step={perKg ? 5 : 1}
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
              onClick={orderNow}
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
              {t("pdp_order_now")}
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
              href="/catalog"
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

        {perKg ? (
          <YieldCalculator product={product} />
        ) : (
          <div className="btt-glass rounded-2xl p-5">
            <p className="text-sm leading-relaxed text-stone-400">{t("calc_planter_hint")}</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {!product.isBrochure ? (
          <div>
            <h2 className="text-base font-semibold text-stone-100">{t("reviews")}</h2>
            <p className="mt-1 text-xs text-stone-500">{t("review_sample_label")}</p>
            <p className="mt-2 text-sm text-stone-400">{t("review_sample")}</p>
          </div>
        ) : null}
        <div className={product.isBrochure ? "md:col-span-2" : undefined}>
          <h2 className="text-base font-semibold text-stone-100">{t("delivery")}</h2>
          <p className="mt-2 text-sm text-stone-400">{t("delivery_text")}</p>
        </div>
      </div>

      <PdpTrustBar />

      <ProductRelatedSection product={product} compact />

      <div className={bttMobileCommerceBarClass}>
        <div className="btt-container flex items-center justify-between gap-3">
          <div className="min-w-0 shrink">
            <p className="text-xs text-stone-500">
              {perKg ? c("per_kg") : c("per_piece")}
            </p>
            <p className="truncate text-lg font-bold tabular-nums text-amber-400">
              {formatUzs(ppk)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={orderNow}
              disabled={belowPreorderMin}
              className={cn(
                bttPrimaryButtonClass,
                "btt-focus inline-flex items-center gap-1.5 px-4 text-xs sm:px-5 sm:text-sm",
                bttTapReduceClass,
                belowPreorderMin && "pointer-events-none opacity-60",
              )}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              {t("pdp_order_now")}
            </button>
            <button
              type="button"
              onClick={onAdd}
              disabled={belowPreorderMin}
              className={cn(
                "btt-focus inline-flex min-h-11 items-center justify-center rounded-full border border-amber-500/45 bg-transparent px-4 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/10 sm:px-5 sm:text-sm",
                bttTapReduceClass,
                belowPreorderMin && "pointer-events-none opacity-60",
              )}
            >
              {c("add_cart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
