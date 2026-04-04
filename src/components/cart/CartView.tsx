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
              className="btt-card grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
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
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-btt-muted">
                  kg
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={l.qtyKg}
                    onChange={(e) =>
                      updateQty(l.sku, Number(e.target.value))
                    }
                    className="ml-2 w-20 rounded-btt border border-btt-border px-2 py-1 text-foreground"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(l.sku)}
                  className="rounded-full px-2 text-lg text-btt-muted hover:bg-black/5"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
              <p className="text-lg font-semibold tabular-nums text-btt-primary sm:text-right">
                {formatUzs(lineTotalUz(l))}
              </p>
            </li>
          ))}
        </ul>
        <aside className="btt-card h-fit p-6">
          <p className="text-sm font-medium">{t("subtotal")}</p>
          <p className="mt-2 text-2xl font-bold">
            {formatUzs(subtotalUz)}
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
