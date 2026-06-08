"use client";

import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { readUtmFromSearch, trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { appendOrder } from "@/lib/order-history";
import { saveOrderAccessToken } from "@/lib/order-access-client";
import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";
import { readLocalProfile } from "@/lib/local-profile";
import { BTT_EASE } from "@/lib/motion";
import {
  bttFieldClass,
  bttMobileCommerceBarClass,
  bttPillButtonActiveClass,
  bttPillButtonInactiveClass,
  bttPrimaryButtonClass,
  bttTapReduceClass,
} from "@/lib/ui-classes";
import { cartHasInvalidPreorder } from "@/lib/cart-preorder";
import { cn } from "@/lib/utils";
import { PageBackNav } from "@/components/layout/PageBackNav";
import { Link } from "@/i18n/navigation";
import { appendTelegramPrefillText, telegramPaymentChatUrl } from "@/lib/telegram";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export function CheckoutForm() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const c = useTranslations("common");
  const nav = useTranslations("nav");
  const { lines, subtotalUz, lineTotalUz, clear } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ship, setShip] = useState<"courier" | "pickup">("courier");
  const [done, setDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  /** false — заказ ушёл только в localStorage (сеть или сервер без БД) */
  const [savedToServer, setSavedToServer] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const { phone: savedPhone, email, address: savedAddress } = readLocalProfile();
    setPhone((p) => p || savedPhone);
    setAddress((a) => a || savedAddress);
    if (email?.includes("@")) {
      const local = email.split("@")[0]?.trim();
      if (local) setName((n) => n || local);
    }
  }, []);

  const utm = useMemo(
    () => readUtmFromSearch(searchParams.toString()),
    [searchParams],
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
    if (cartHasInvalidPreorder(lines)) {
      setErr(t("error_min_preorder"));
      return;
    }
    setSubmitting(true);
    setCreatedOrderId(null);
    try {
      trackEvent("start_checkout", {
        lines: lines.map((l) => l.sku),
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
        pay: "invoice" as const,
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
          credentials: "include",
          body: JSON.stringify(orderBody),
        });
        if (res.ok) {
          const saved = (await res.json().catch(() => null)) as {
            id?: string;
            createdAt?: string;
            historyAccessToken?: string;
          } | null;
          if (saved?.id) {
            setCreatedOrderId(saved.id);
          }
          if (saved?.id && saved?.createdAt) {
            appendOrder(orderBody, { id: saved.id, createdAt: saved.createdAt });
          } else {
            appendOrder(orderBody);
          }
          if (saved?.historyAccessToken) {
            saveOrderAccessToken(orderBody.phone, saved.historyAccessToken);
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
        <div className="mb-8 text-left">
          <PageBackNav fallbackHref="/cart" className="mb-0" />
        </div>
        <p className="text-stone-400">{tc("empty")}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="btt-container max-w-lg py-16">
        <PageBackNav fallbackHref="/catalog" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.5, ease: BTT_EASE }
          }
          className="btt-glass-strong rounded-3xl p-8 text-center"
        >
          <p className="text-lg font-semibold text-emerald-400">{t("success_title")}</p>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">{t("success_lead")}</p>
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
          <p className="mt-4 text-sm leading-relaxed text-stone-400">{t("success_telegram_lead")}</p>
          {telegramPayUrl ? (
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
          ) : (
            <p className="mt-4 text-sm text-stone-500">
              {t("telegram_config_hint")}{" "}
              <Link
                href="/contacts"
                className="btt-focus rounded-sm font-medium text-amber-400 underline-offset-4 outline-none hover:underline"
              >
                {nav("contacts")}
              </Link>
            </p>
          )}
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="btt-container pb-28 py-8 md:py-10 lg:pb-10">
      <PageBackNav fallbackHref="/cart" />
      <div className="mt-2 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
        <form
          id="checkout-form"
          onSubmit={onPay}
          className="btt-glass space-y-6 rounded-3xl p-5 sm:p-6 md:p-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-stone-50 md:text-3xl">{t("title")}</h1>
            <p className="mt-1 text-sm text-stone-400">{t("guest")}</p>
            <p className="mt-1 text-xs text-stone-500">{t("login_hint")}</p>
            {err ? (
              <p
                className="mt-4 rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
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
                placeholder={t("phone_placeholder")}
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

          <p className="text-xs text-stone-500">{t("delivery_note")}</p>

          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className={cn(
              bttPrimaryButtonClass,
              "btt-focus hidden w-full justify-center px-8 py-3.5 active:scale-[0.99] lg:inline-flex",
              bttTapReduceClass,
              submitting && "pointer-events-none opacity-70",
            )}
          >
            {submitting ? c("loading") : t("place_order")}
          </button>
        </form>

        <aside className="btt-glass-strong order-first h-fit rounded-3xl p-5 sm:p-6 lg:order-none">
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
          <p className="mt-1 text-xs text-stone-500">{t("summary_note")}</p>
        </aside>
      </div>

      <div className={bttMobileCommerceBarClass}>
        <div className="btt-container flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-stone-500">{t("summary")}</p>
            <p className="truncate text-lg font-bold tabular-nums text-amber-400">
              {formatUzs(subtotalUz)}
            </p>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            aria-busy={submitting}
            className={cn(
              bttPrimaryButtonClass,
              "btt-focus shrink-0 px-5 active:scale-[0.99]",
              bttTapReduceClass,
              submitting && "pointer-events-none opacity-70",
            )}
          >
            {submitting ? c("loading") : t("place_order")}
          </button>
        </div>
      </div>
    </div>
  );
}
