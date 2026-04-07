"use client";

import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { bttFieldStepperInputClass, bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
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
          className={cn(bttPrimaryButtonClass, "mt-8 inline-flex px-8")}
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
                  {t("qty_kg")}
                  <div className="ml-2 inline-flex items-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.05]">
                    <button
                      type="button"
                      onClick={() => updateQty(l.sku, l.qtyKg - 0.5)}
                      aria-label={t("decrease_qty")}
                      className="px-2 py-1.5 text-stone-300 transition hover:bg-white/[0.08] hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={l.qtyKg}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") return;
                        const v = Number(raw);
                        if (!Number.isFinite(v)) return;
                        updateQty(l.sku, v);
                      }}
                      className={bttFieldStepperInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => updateQty(l.sku, l.qtyKg + 0.5)}
                      aria-label={t("increase_qty")}
                      className="px-2 py-1.5 text-stone-300 transition hover:bg-white/[0.08] hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                    >
                      +
                    </button>
                  </div>
                </label>
                <button
                  type="button"
                  onClick={() => remove(l.sku)}
                  className="rounded-full px-2 text-lg text-stone-500 hover:bg-white/[0.06]"
                  aria-label={t("remove_line")}
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
            className={cn(
              bttPrimaryButtonClass,
              "mt-8 flex w-full justify-center py-3.5"
            )}
          >
            {t("to_checkout")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
