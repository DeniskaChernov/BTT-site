"use client";

import { Link } from "@/i18n/navigation";
import type { Locale, Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { formatUzs, getPricePerKgForQty, UZS_PER_USD } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type Props = { product: Product; related: Product[] };

export function ProductDetail({ product, related }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const c = useTranslations("common");
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1.5);
  const [meters, setMeters] = useState(10);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    trackEvent("view_pdp", {
      sku: product.sku,
      slug: product.slug,
      value: product.priceUz.t12,
      currency: "UZS",
    });
  }, [product.sku, product.slug, product.priceUz.t12]);

  const ppk = useMemo(() => getPricePerKgForQty(product, qty), [product, qty]);
  const lineTotal = Math.round(ppk * qty);
  const kgEst = useMemo(() => Math.max(0.1, meters * 0.12), [meters]);

  const images = [0, 1, 2, 3, 4, 5].map(
    (i) =>
      `https://picsum.photos/seed/${product.imageSeed}${i}/1200/1200`
  );

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

  return (
    <div className="btt-container py-10 pb-28 lg:pb-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-stone-900/50 shadow-2xl">
            <Image
              src={images[activeImg]!}
              alt={product.names[locale]}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                  activeImg === i ? "border-amber-500 ring-2 ring-amber-500/30" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-stone-100">{t("videos")}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  "video_in_hands",
                  "video_choose",
                  "video_process",
                  "video_outdoor",
                ] as const
              ).map((k) => (
                <div
                  key={k}
                  className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-sm text-stone-500 backdrop-blur-sm"
                >
                  {t(k)} — demo
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
            {t("sku")}: {product.sku}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
            {product.names[locale]}
          </h1>
          <p className="mt-3 text-stone-400">{product.short[locale]}</p>

          {product.lowStock && (
            <p className="mt-3 text-sm font-medium text-amber-400">
              {c("low_stock")}
            </p>
          )}

          <ul className="mt-6 space-y-2">
            {product.bullets[locale].map((b) => (
              <li key={b} className="flex gap-2 text-sm text-stone-300">
                <span className="text-emerald-400">✓</span>
                {b}
              </li>
            ))}
          </ul>

          <div className="btt-glass mt-8 rounded-3xl p-5">
            <p className="text-sm font-semibold text-stone-200">{t("ladder_title")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
                <p className="text-xs text-stone-500">{t("ladder_12")}</p>
                <p className="mt-1 font-bold tabular-nums text-stone-100">
                  {formatUzs(product.priceUz.t12)}
                </p>
              </div>
              <div className="relative rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-950/40 to-stone-950/80 p-3 text-center shadow-lg shadow-amber-900/20">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-md">
                  {t("ladder_anchor_badge")}
                </span>
                <p className="text-xs text-stone-400">{t("ladder_5")}</p>
                <p className="mt-1 font-bold tabular-nums text-amber-200">
                  {formatUzs(product.priceUz.t5)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
                <p className="text-xs text-stone-500">{t("ladder_10")}</p>
                <p className="mt-1 font-bold tabular-nums text-stone-100">
                  {formatUzs(product.priceUz.t10)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-stone-500">
              {t("usd_note", { rate: UZS_PER_USD.toLocaleString() })}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <label className="grid gap-1 text-sm">
              <span>{t("qty")}</span>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-32 rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-2 text-stone-100"
              />
            </label>
            <div>
              <p className="text-xs text-stone-500">{c("per_kg")}</p>
              <p className="text-2xl font-bold tabular-nums text-amber-400">
                {formatUzs(ppk)}
              </p>
              <p className="text-sm text-stone-500">
                {c("total_to_pay")}: {formatUzs(lineTotal)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={onAdd}
              className="rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              {c("add_cart")}
            </motion.button>
            <button
              type="button"
              onClick={oneClick}
              className="btt-glass-cta rounded-full px-6 py-3 text-sm font-semibold"
            >
              {c("one_click")}
            </button>
            <Link
              href="/#quiz"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-stone-200 transition hover:border-amber-500/40"
            >
              {c("pick_2m")}
            </Link>
          </div>

          <div className="btt-glass mt-10 rounded-3xl p-5">
            <h2 className="font-semibold text-stone-100">{t("calc")}</h2>
            <p className="mt-1 text-sm text-stone-500">{t("calc_hint")}</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <label className="grid gap-1 text-sm">
                {t("meters")}
                <input
                  type="number"
                  min={1}
                  value={meters}
                  onChange={(e) => setMeters(Number(e.target.value))}
                  className="w-32 rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-2 text-stone-100"
                />
              </label>
              <div>
                <p className="text-xs text-stone-500">{t("kg_est")}</p>
                <p className="text-lg font-semibold text-stone-100">{kgEst.toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-semibold text-stone-100">{t("reviews")}</h2>
            <p className="mt-2 text-sm text-stone-400">{t("review_sample")}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-stone-100">{t("delivery")}</h2>
            <p className="mt-2 text-sm text-stone-400">{t("delivery_text")}</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold text-stone-100">{t("cross")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <Link
              key={p.sku}
              href={`/product/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-amber-500/30 hover:shadow-xl"
            >
              <div className="relative aspect-square">
                <Image
                  src={`https://picsum.photos/seed/${p.imageSeed}/400/400`}
                  alt={p.names[locale]}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 text-sm font-medium text-stone-200">{p.names[locale]}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#070605]/85 p-4 backdrop-blur-xl lg:hidden">
        <div className="btt-container flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-stone-500">{c("per_kg")}</p>
            <p className="text-lg font-bold tabular-nums text-amber-400">{formatUzs(ppk)}</p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg"
          >
            {c("add_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
