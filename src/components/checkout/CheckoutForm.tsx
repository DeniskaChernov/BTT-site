"use client";

import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { readUtmFromSearch } from "@/lib/analytics";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Pay = "uzcard" | "humo" | "payme" | "click" | "invoice" | "cod";

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const c = useTranslations("common");
  const { lines, subtotalUz, clear } = useCart();
  const { currency } = useCurrency();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oneClick = searchParams.get("one_click") === "1";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ship, setShip] = useState<"courier" | "pickup">("courier");
  const [pay, setPay] = useState<Pay>("payme");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const utm = useMemo(
    () => readUtmFromSearch(`?${searchParams.toString()}`),
    [searchParams]
  );

  const onPay = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!phone.trim()) {
      setErr("Phone required");
      return;
    }
    trackEvent("start_checkout", {
      lines: lines.map((l) => l.sku),
      pay,
      ship,
    });

    const payload = {
      event: "purchase",
      value: subtotalUz,
      currency: "UZS",
      sku: lines.map((l) => l.sku),
      utm,
    };
    trackEvent("purchase", payload);

    clear();
    setDone(true);
  };

  if (lines.length === 0 && !done) {
    return (
      <div className="btt-container py-16 text-center">
        <p className="text-btt-muted">{tc("empty")}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="btt-container max-w-lg py-16">
        <div className="btt-card p-8 text-center">
          <p className="text-lg font-semibold text-btt-success">{t("success")}</p>
          <p className="mt-2 text-sm text-btt-muted">
            Sandbox: редиректы Payme/Click здесь подключаются к боевым ключам.
          </p>
          <button
            type="button"
            onClick={() => router.push("/catalog")}
            className="mt-6 rounded-full bg-btt-primary px-6 py-3 text-sm font-semibold text-white"
          >
            {c("learn_more")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="btt-container grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={onPay} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-sm text-btt-muted">{t("guest")}</p>
          <p className="mt-1 text-xs text-btt-muted">{t("login_hint")}</p>
          {oneClick && (
            <p className="mt-2 rounded-btt border border-btt-accent/30 bg-btt-accent/5 px-3 py-2 text-sm">
              {t("one_click_title")}: {t("one_click_hint")}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {c("name")}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-btt border border-btt-border px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            {c("phone")}
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-btt border border-btt-border px-3 py-2"
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {c("address")}
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-btt border border-btt-border px-3 py-2"
          />
        </label>

        <div>
          <p className="text-sm font-medium">{t("shipping")}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setShip("courier")}
              className={`rounded-full px-4 py-2 text-sm ${
                ship === "courier"
                  ? "bg-btt-primary text-white"
                  : "border border-btt-border"
              }`}
            >
              {t("ship_courier")}
            </button>
            <button
              type="button"
              onClick={() => setShip("pickup")}
              className={`rounded-full px-4 py-2 text-sm ${
                ship === "pickup"
                  ? "bg-btt-primary text-white"
                  : "border border-btt-border"
              }`}
            >
              {t("ship_pickup")}
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">{t("pay_method")}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["pay_uzcard", "uzcard"],
                ["pay_humo", "humo"],
                ["pay_payme", "payme"],
                ["pay_click", "click"],
                ["pay_invoice", "invoice"],
                ["pay_cod", "cod"],
              ] as const
            ).map(([key, id]) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-2 rounded-btt border px-3 py-2 text-sm ${
                  pay === id ? "border-btt-primary bg-btt-primary/5" : "border-btt-border"
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={pay === id}
                  onChange={() => setPay(id)}
                />
                {t(key)}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-btt-muted">{t("delivery_note")}</p>
          {err && <p className="mt-2 text-sm text-red-600">{t("error_pay")}</p>}
        </div>

        <button
          type="submit"
          className="rounded-full bg-btt-accent px-8 py-3 text-sm font-semibold text-white shadow-btt-sm"
        >
          {t("place_order")}
        </button>
      </form>

      <aside className="btt-card h-fit p-6">
        <p className="text-sm font-semibold">{t("summary")}</p>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((l) => (
            <li key={l.sku} className="flex justify-between gap-2">
              <span className="line-clamp-2">{l.name}</span>
              <span>{l.qtyKg} kg</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-lg font-bold">
          {formatMoney(subtotalUz, currency, locale)}
        </p>
        <p className="mt-1 text-xs text-btt-muted">{c("total_to_pay")}</p>
      </aside>
    </div>
  );
}
