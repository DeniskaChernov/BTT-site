"use client";

import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney } from "@/lib/pricing";
import { useLocale, useTranslations } from "next-intl";

export function CartView() {
  const { lines, subtotalUz, updateQty, remove } = useCart();
  const { currency } = useCurrency();
  const locale = useLocale();
  const t = useTranslations("cart");
  const n = useTranslations("nav");

  if (lines.length === 0) {
    return (
      <div className="btt-container py-20 text-center">
        <p className="text-lg text-btt-muted">{t("empty")}</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex rounded-full bg-btt-primary px-6 py-3 text-sm font-semibold text-white"
        >
          {n("catalog")}
        </Link>
      </div>
    );
  }

  return (
    <div className="btt-container py-10">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {lines.map((l) => (
            <li
              key={l.sku}
              className="btt-card flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div>
                <Link
                  href={`/product/${l.slug}`}
                  className="font-semibold hover:underline"
                >
                  {l.name}
                </Link>
                <p className="text-xs text-btt-muted">{l.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">
                  kg
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={l.qtyKg}
                    onChange={(e) =>
                      updateQty(l.sku, Number(e.target.value))
                    }
                    className="ml-2 w-20 rounded-btt border border-btt-border px-2 py-1"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(l.sku)}
                  className="text-sm text-btt-muted underline"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
        <aside className="btt-card h-fit p-6">
          <p className="text-sm font-medium">{t("subtotal")}</p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(subtotalUz, currency, locale)}
          </p>
          <Link
            href="/checkout"
            className="mt-6 flex w-full justify-center rounded-full bg-btt-primary py-3 text-sm font-semibold text-white"
          >
            {t("to_checkout")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
