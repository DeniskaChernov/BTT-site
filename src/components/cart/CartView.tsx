"use client";

import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { useTranslations } from "next-intl";

export function CartView() {
  const { lines, subtotalUz, lineTotalUz, updateQty, remove } = useCart();
  const t = useTranslations("cart");
  const n = useTranslations("nav");

  if (lines.length === 0) {
    return (
      <div className="btt-container py-24 text-center">
        <p className="text-lg text-stone-400">{t("empty")}</p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {n("catalog")}
        </Link>
      </div>
    );
  }

  return (
    <div className="btt-container py-10 md:py-14">
      <h1 className="text-3xl font-bold text-stone-50 md:text-4xl">{t("title")}</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-4">
          {lines.map((l) => (
            <li
              key={l.sku}
              className="btt-glass grid grid-cols-1 gap-4 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center"
            >
              <div>
                <Link
                  href={`/product/${l.slug}`}
                  className="font-semibold text-stone-100 hover:text-amber-400"
                >
                  {l.name}
                </Link>
                <p className="text-xs text-stone-500">{l.sku}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-stone-400">
                  kg
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={l.qtyKg}
                    onChange={(e) =>
                      updateQty(l.sku, Number(e.target.value))
                    }
                    className="ml-2 w-20 rounded-xl border border-white/15 bg-white/[0.05] px-2 py-1.5 text-stone-100"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(l.sku)}
                  className="rounded-full px-2 text-lg text-stone-500 hover:bg-white/[0.06]"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
              <p className="text-lg font-semibold tabular-nums text-amber-400 sm:text-right">
                {formatUzs(lineTotalUz(l))}
              </p>
            </li>
          ))}
        </ul>
        <aside className="btt-glass-strong h-fit rounded-3xl p-6">
          <p className="text-sm font-medium text-stone-400">{t("subtotal")}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-stone-50">
            {formatUzs(subtotalUz)}
          </p>
          <Link
            href="/checkout"
            className="mt-8 flex w-full justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg"
          >
            {t("to_checkout")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
