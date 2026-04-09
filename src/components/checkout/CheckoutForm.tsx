"use client";

import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { readUtmFromSearch, trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { appendOrder } from "@/lib/order-history";
import { readLocalProfile } from "@/lib/local-profile";
import {
  bttFieldClass,
  bttPillButtonActiveClass,
  bttPillButtonInactiveClass,
  bttPrimaryButtonClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Pay = "uzcard" | "humo" | "payme" | "click" | "invoice" | "cod";

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const c = useTranslations("common");
  const { lines, subtotalUz, lineTotalUz, clear } = useCart();
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

  useEffect(() => {
    const { phone: savedPhone, email } = readLocalProfile();
    setPhone((p) => p || savedPhone);
    if (email?.includes("@")) {
      const local = email.split("@")[0]?.trim();
      if (local) setName((n) => n || local);
    }
  }, []);

  const utm = useMemo(
    () => readUtmFromSearch(searchParams.toString()),
    [searchParams]
  );

  const onPay = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!phone.trim()) {
      setErr(t("error_phone"));
      return;
    }
    if (ship === "courier" && !address.trim()) {
      setErr(t("error_address"));
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

    appendOrder({
      totalUz: subtotalUz,
      lines: lines.map((l) => ({
        sku: l.sku,
        slug: l.slug,
        name: l.name,
        qtyKg: l.qtyKg,
        lineTotalUz: lineTotalUz(l),
      })),
      pay,
      ship,
      customerName: name.trim(),
      phone: phone.trim(),
      address: ship === "courier" ? address.trim() : "",
    });

    clear();
    setDone(true);
  };

  if (lines.length === 0 && !done) {
    return (
      <div className="btt-container py-16 text-center">
        <p className="text-stone-400">{tc("empty")}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="btt-container max-w-lg py-16">
        <div className="btt-glass-strong rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-emerald-400">{t("success")}</p>
          <p className="mt-2 text-sm text-stone-400">{t("sandbox_note")}</p>
          <button
            type="button"
            onClick={() => router.push("/catalog")}
            className={cn(bttPrimaryButtonClass, "mt-6")}
          >
            {t("cta_catalog")}
          </button>
          <p className="mt-6">
            <Link
              href="/account"
              className="text-sm font-medium text-amber-400/95 underline-offset-4 hover:text-amber-300 hover:underline"
            >
              {t("view_orders")}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="btt-container grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
      <form onSubmit={onPay} className="btt-glass space-y-6 rounded-3xl p-6 md:p-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-50 md:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-stone-400">{t("guest")}</p>
          <p className="mt-1 text-xs text-stone-500">{t("login_hint")}</p>
          {oneClick && (
            <p className="mt-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              {t("one_click_title")}: {t("one_click_hint")}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-stone-300">
            {c("name")}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={bttFieldClass}
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-300">
            {c("phone")}
            <input
              required
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className={bttFieldClass}
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm text-stone-300">
          {c("address")}
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
            disabled={ship === "pickup"}
            placeholder={ship === "pickup" ? t("pickup_no_address") : undefined}
            className={bttFieldClass}
          />
        </label>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("shipping")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShip("courier")}
              className={
                ship === "courier"
                  ? bttPillButtonActiveClass
                  : bttPillButtonInactiveClass
              }
            >
              {t("ship_courier")}
            </button>
            <button
              type="button"
              onClick={() => setShip("pickup")}
              className={
                ship === "pickup"
                  ? bttPillButtonActiveClass
                  : bttPillButtonInactiveClass
              }
            >
              {t("ship_pickup")}
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("pay_method")}</p>
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
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm text-stone-300 transition focus-within:ring-2 focus-within:ring-amber-500/30 ${
                  pay === id
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-white/10 hover:border-white/20"
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
          <p className="mt-2 text-xs text-stone-500">{t("delivery_note")}</p>
          {err ? (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {err}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className={cn(bttPrimaryButtonClass, "px-8 py-3.5")}
        >
          {t("place_order")}
        </button>
      </form>

      <aside className="btt-glass-strong h-fit rounded-3xl p-6">
        <p className="text-sm font-semibold text-stone-300">{t("summary")}</p>
        <ul className="mt-4 space-y-3 text-sm text-stone-400">
          {lines.map((l) => (
            <li key={l.sku} className="flex justify-between gap-2">
              <span className="line-clamp-2 text-stone-200">{l.name}</span>
              <span className="shrink-0 text-stone-500">
                {l.qtyKg} {tc("qty_kg")}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-2xl font-bold tabular-nums text-amber-400">
          {formatUzs(subtotalUz)}
        </p>
        <p className="mt-1 text-xs text-stone-500">{c("total_to_pay")}</p>
      </aside>
    </div>
  );
}
