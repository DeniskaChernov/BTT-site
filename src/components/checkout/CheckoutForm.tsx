"use client";

import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { readUtmFromSearch } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Pay = "uzcard" | "humo" | "payme" | "click" | "invoice" | "cod";

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const c = useTranslations("common");
  const { lines, subtotalUz, clear } = useCart();
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
        <p className="text-stone-400">{tc("empty")}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="btt-container max-w-lg py-16">
        <div className="btt-glass-strong rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-emerald-400">{t("success")}</p>
          <p className="mt-2 text-sm text-stone-400">
            Sandbox: редиректы Payme/Click здесь подключаются к боевым ключам.
          </p>
          <button
            type="button"
            onClick={() => router.push("/catalog")}
            className="mt-6 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            {c("learn_more")}
          </button>
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
              className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-stone-100"
            />
          </label>
          <label className="grid gap-1 text-sm text-stone-300">
            {c("phone")}
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-stone-100"
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm text-stone-300">
          {c("address")}
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-stone-100"
          />
        </label>

        <div>
          <p className="text-sm font-medium text-stone-200">{t("shipping")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShip("courier")}
              className={`rounded-full px-4 py-2 text-sm transition ${
                ship === "courier"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                  : "border border-white/15 text-stone-300 hover:bg-white/[0.05]"
              }`}
            >
              {t("ship_courier")}
            </button>
            <button
              type="button"
              onClick={() => setShip("pickup")}
              className={`rounded-full px-4 py-2 text-sm transition ${
                ship === "pickup"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                  : "border border-white/15 text-stone-300 hover:bg-white/[0.05]"
              }`}
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
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm text-stone-300 ${
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
          {err && <p className="mt-2 text-sm text-red-600">{t("error_pay")}</p>}
        </div>

        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg"
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
              <span className="shrink-0 text-stone-500">{l.qtyKg} kg</span>
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
