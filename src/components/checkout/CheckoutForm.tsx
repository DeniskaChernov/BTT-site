"use client";

import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { readUtmFromSearch, trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { appendOrder } from "@/lib/order-history";
import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";
import { readLocalProfile } from "@/lib/local-profile";
import {
  bttFieldClass,
  bttPillButtonActiveClass,
  bttPillButtonInactiveClass,
  bttPrimaryButtonClass,
  bttTapReduceClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { appendTelegramPrefillText, telegramPaymentChatUrl } from "@/lib/telegram";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Pay = "telegram" | "uzcard" | "humo" | "payme" | "click" | "invoice" | "cod";

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const c = useTranslations("common");
  const nav = useTranslations("nav");
  const { lines, subtotalUz, lineTotalUz, clear } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oneClick = searchParams.get("one_click") === "1";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ship, setShip] = useState<"courier" | "pickup">("courier");
  const [pay, setPay] = useState<Pay>("telegram");
  const [done, setDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  /** false — заказ ушёл только в localStorage (сеть или сервер без БД) */
  const [savedToServer, setSavedToServer] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const telegramPayUrl = useMemo(() => telegramPaymentChatUrl(), []);

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (submitting) return;
    if (lines.length === 0) return;
    if (!name.trim()) {
      setErr(t("error_name"));
      return;
    }
    if (!phone.trim()) {
      setErr(t("error_phone"));
      return;
    }
    if (!isMeaningfulPhone(normalizePhone(phone))) {
      setErr(t("error_phone_format"));
      return;
    }
    if (ship === "courier" && !address.trim()) {
      setErr(t("error_address"));
      return;
    }
    setSubmitting(true);
    setCreatedOrderId(null);
    try {
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

      const orderBody = {
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
        phone: normalizePhone(phone),
        address: ship === "courier" ? address.trim() : "",
      };

      let serverOk = true;
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderBody),
        });
        if (res.ok) {
          const saved = (await res.json().catch(() => null)) as {
            id?: string;
            createdAt?: string;
          } | null;
          if (saved?.id) {
            setCreatedOrderId(saved.id);
          }
          if (saved?.id && saved?.createdAt) {
            appendOrder(orderBody, { id: saved.id, createdAt: saved.createdAt });
          } else {
            appendOrder(orderBody);
          }
          serverOk = true;
        } else if (res.status === 429) {
          setErr(t("error_rate_limit"));
          return;
        } else if (res.status === 400) {
          const payload = (await res.json().catch(() => null)) as { error?: string } | null;
          if (payload?.error === "Minimum preorder quantity is 100 kg") {
            setErr(t("error_min_preorder"));
            return;
          }
          setErr(t("error_validation"));
          return;
        } else if (res.status >= 400 && res.status < 500) {
          setErr(t("error_validation"));
          return;
        } else {
          appendOrder(orderBody);
          serverOk = false;
        }
      } catch {
        appendOrder(orderBody);
        serverOk = false;
      }

      clear();
      setSavedToServer(serverOk);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
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
          {createdOrderId ? (
            <p className="mt-3 text-sm font-medium text-stone-300">
              {t("success_order_ref", { id: createdOrderId })}
            </p>
          ) : null}
          {!savedToServer && (
            <p className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {t("success_local_only")}
            </p>
          )}
          {pay === "telegram" ? (
            <p className="mt-4 text-sm leading-relaxed text-stone-400">{t("success_telegram_lead")}</p>
          ) : null}
          {pay === "telegram" && telegramPayUrl ? (
            <a
              href={
                createdOrderId
                  ? appendTelegramPrefillText(
                      telegramPayUrl,
                      t("telegram_chat_prefill", { id: createdOrderId }),
                    )
                  : telegramPayUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                bttPrimaryButtonClass,
                "btt-focus mt-6 inline-flex items-center justify-center active:scale-[0.99]",
                bttTapReduceClass,
              )}
            >
              {t("open_telegram")}
            </a>
          ) : pay === "telegram" && !telegramPayUrl ? (
            <p className="mt-4 text-sm text-stone-500">
              {t("telegram_config_hint")}{" "}
              <Link
                href="/contacts"
                className="btt-focus rounded-sm font-medium text-amber-400 underline-offset-4 outline-none hover:underline"
              >
                {nav("contacts")}
              </Link>
            </p>
          ) : null}
          <p className="mt-4 text-xs text-stone-500">{t("payment_interim_note")}</p>
          <button
            type="button"
            onClick={() => router.push("/catalog")}
            className={cn(
              bttPrimaryButtonClass,
              "btt-focus mt-6 inline-flex items-center justify-center border border-white/15 bg-white/[0.06] active:scale-[0.99]",
              bttTapReduceClass,
            )}
          >
            {t("cta_catalog")}
          </button>
          <p className="mt-6">
            <Link
              href="/account"
              className="btt-focus rounded-sm text-sm font-medium text-amber-400/95 underline-offset-4 outline-none transition hover:text-amber-300 hover:underline motion-reduce:transition-none"
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
          {err ? (
            <p className="mt-4 rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
              {err}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-stone-300">
            {c("name")}
            <input
              required
              value={name}
              onChange={(e) => {
                setErr(null);
                setName(e.target.value);
              }}
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
              onChange={(e) => {
                setErr(null);
                setPhone(e.target.value);
              }}
              autoComplete="tel"
              className={bttFieldClass}
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm text-stone-300">
          {c("address")}
          <input
            value={address}
            onChange={(e) => {
              setErr(null);
              setAddress(e.target.value);
            }}
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
              onClick={() => {
                setErr(null);
                setShip("courier");
              }}
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
              onClick={() => {
                setErr(null);
                setShip("pickup");
              }}
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
          <p className="mt-1 text-xs text-stone-500">{t("pay_methods_note")}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["pay_telegram", "telegram"],
                ["pay_invoice", "invoice"],
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
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className={cn(
            bttPrimaryButtonClass,
            "btt-focus px-8 py-3.5 active:scale-[0.99]",
            bttTapReduceClass,
            submitting && "pointer-events-none opacity-70",
          )}
        >
          {submitting ? c("loading") : t("place_order")}
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
