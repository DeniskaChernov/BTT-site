"use client";

import { AdminInsightsStub } from "@/components/account/AdminInsightsStub";
import { OrderHistory } from "@/components/account/OrderHistory";
import { PageBackNav } from "@/components/layout/PageBackNav";
import { trackEvent } from "@/lib/analytics";
import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { readLocalProfile, writeLocalProfile } from "@/lib/local-profile";
import { formatPhoneInput, normalizePhone } from "@/lib/phone";
import { bttFieldClass, bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
};

export function AccountForm() {
  const t = useTranslations("account");
  const n = useTranslations("nav");
  const tc = useTranslations("cart");
  const c = useTranslations("common");
  const { lines, subtotalUz, lineTotalUz } = useCart();

  const [session, setSession] = useState<SessionUser | null | undefined>(
    undefined,
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [profileFlash, setProfileFlash] = useState(false);

  useEffect(() => {
    let cancel = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d: { user: SessionUser | null }) => {
        if (cancel) return;
        if (d.user) {
          setSession(d.user);
          setEmail(d.user.email);
          setName(d.user.name ?? "");
          setPhone(d.user.phone ?? "");
          writeLocalProfile({
            email: d.user.email,
            phone: d.user.phone ?? "",
            address: readLocalProfile().address,
          });
        } else {
          setSession(null);
          const p = readLocalProfile();
          setEmail(p.email);
          setPhone(p.phone);
          setAddress(p.address);
          setName("");
        }
      })
      .catch(() => {
        if (cancel) return;
        setSession(null);
        const p = readLocalProfile();
        setEmail(p.email);
        setPhone(p.phone);
        setAddress(p.address);
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!savedFlash && !profileFlash) return;
    const timer = window.setTimeout(() => {
      setSavedFlash(false);
      setProfileFlash(false);
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [savedFlash, profileFlash]);

  const saveLocal = () => {
    const emailTrim = email.trim();
    const phoneNorm = normalizePhone(phone);
    writeLocalProfile({
      email: emailTrim,
      phone: phoneNorm,
      address: address.trim(),
    });
    setEmail(emailTrim);
    setPhone(phoneNorm);
    trackEvent("profile_save", {
      hasEmail: !!emailTrim,
      hasPhone: !!phoneNorm,
    });
    setSavedFlash(true);
  };

  const saveProfileServer = async () => {
    setAuthError(null);
    setProfileSubmitting(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          phone: phone.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        user?: SessionUser;
        error?: string;
      };
      if (!res.ok || !data.user) {
        setAuthError(
          typeof data.error === "string" ? data.error : t("auth_error"),
        );
        return;
      }
      setSession(data.user);
      setName(data.user.name ?? "");
      setPhone(data.user.phone ?? "");
      writeLocalProfile({
        email: data.user.email,
        phone: data.user.phone ?? "",
        address: address.trim(),
      });
      setProfileFlash(true);
      trackEvent("profile_server_save", {});
    } finally {
      setProfileSubmitting(false);
    }
  };

  const login = async () => {
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: loginPassword,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        user?: SessionUser;
        error?: string;
      };
      if (!res.ok || !data.user) {
        setAuthError(
          typeof data.error === "string" ? data.error : t("auth_error"),
        );
        return;
      }
      setSession(data.user);
      setName(data.user.name ?? "");
      setPhone(data.user.phone ?? "");
      setEmail(data.user.email);
      writeLocalProfile({
        email: data.user.email,
        phone: data.user.phone ?? "",
        address: readLocalProfile().address,
      });
      setLoginPassword("");
      trackEvent("auth_login", {});
    } finally {
      setAuthSubmitting(false);
    }
  };

  const register = async () => {
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: regPassword,
          name: regName.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        user?: SessionUser;
        error?: string;
      };
      if (!res.ok || !data.user) {
        setAuthError(
          typeof data.error === "string" ? data.error : t("auth_error"),
        );
        return;
      }
      setSession(data.user);
      setName(data.user.name ?? "");
      setPhone(data.user.phone ?? "");
      setEmail(data.user.email);
      setRegName("");
      setRegPassword("");
      writeLocalProfile({
        email: data.user.email,
        phone: data.user.phone ?? "",
        address: address.trim(),
      });
      trackEvent("auth_register", {});
    } finally {
      setAuthSubmitting(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setSession(null);
    setLoginPassword("");
    setRegPassword("");
    const p = readLocalProfile();
    setEmail(p.email);
    setPhone(p.phone);
    setAddress(p.address);
    setName("");
    trackEvent("auth_logout", {});
  };

  return (
    <div className="btt-container py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div>
          <PageBackNav fallbackHref="/" />
          <h1 className="text-3xl font-bold text-stone-50 md:text-4xl">{t("title")}</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-400">{t("sub")}</p>

          {session === undefined ? (
            <p className="mt-8 text-sm text-stone-500">{t("session_loading")}</p>
          ) : session ? (
            <form
              className="btt-glass mt-8 grid gap-4 rounded-3xl p-6 md:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                void saveProfileServer();
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                {t("signed_in_as")}
              </p>
              <p className="text-sm text-stone-200">{session.email}</p>
              <label className="grid gap-1 text-sm text-stone-300">
                {t("name_label")}
                <input
                  className={bttFieldClass}
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="grid gap-1 text-sm text-stone-300">
                {c("phone")}
                <input
                  className={bttFieldClass}
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>
              <button
                type="submit"
                disabled={profileSubmitting}
                className={cn(bttPrimaryButtonClass, "btt-focus")}
              >
                {profileSubmitting ? c("loading") : t("save_server")}
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                className="btt-focus rounded-2xl border border-white/15 px-4 py-3 text-sm text-stone-300 transition hover:border-white/18 hover:bg-white/[0.04]"
              >
                {t("sign_out")}
              </button>
            </form>
          ) : (
            <div className="mt-8 grid gap-6">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError(null);
                  }}
                  className={cn(
                    "btt-focus rounded-full border px-4 py-2 text-sm font-medium transition",
                    authTab === "login"
                      ? "border-white/22 bg-white/[0.05] text-stone-100"
                      : "border-white/15 text-stone-400 hover:border-white/25",
                  )}
                >
                  {t("login")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError(null);
                  }}
                  className={cn(
                    "btt-focus rounded-full border px-4 py-2 text-sm font-medium transition",
                    authTab === "register"
                      ? "border-white/22 bg-white/[0.05] text-stone-100"
                      : "border-white/15 text-stone-400 hover:border-white/25",
                  )}
                >
                  {t("register")}
                </button>
              </div>

              {authError ? (
                <p className="text-sm text-red-400" role="alert">
                  {authError}
                </p>
              ) : null}

              {authTab === "login" ? (
                <form
                  className="btt-glass grid gap-4 rounded-3xl p-6 md:p-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void login();
                  }}
                >
                  <label className="grid gap-1 text-sm text-stone-300">
                    {t("email_label")}
                    <input
                      className={bttFieldClass}
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-stone-300">
                    {t("password_label")}
                    <input
                      className={bttFieldClass}
                      type="password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className={cn(bttPrimaryButtonClass, "btt-focus")}
                  >
                    {authSubmitting ? c("loading") : t("login")}
                  </button>
                </form>
              ) : (
                <form
                  className="btt-glass grid gap-4 rounded-3xl p-6 md:p-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void register();
                  }}
                >
                  <label className="grid gap-1 text-sm text-stone-300">
                    {t("email_label")}
                    <input
                      className={bttFieldClass}
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-stone-300">
                    {t("password_label")}
                    <input
                      className={bttFieldClass}
                      type="password"
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </label>
                  <p className="text-xs text-stone-500">{t("password_hint")}</p>
                  <label className="grid gap-1 text-sm text-stone-300">
                    {t("name_label")}
                    <input
                      className={bttFieldClass}
                      name="name"
                      autoComplete="name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-stone-300">
                    {c("phone")}
                    <input
                      className={bttFieldClass}
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className={cn(bttPrimaryButtonClass, "btt-focus")}
                  >
                    {authSubmitting ? c("loading") : t("create_account")}
                  </button>
                </form>
              )}

              <form
                className="btt-glass grid gap-4 rounded-3xl p-6 md:p-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveLocal();
                }}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  {t("local_only_title")}
                </p>
                <p className="text-sm text-stone-500">{t("local_only_sub")}</p>
                <label className="grid gap-1 text-sm text-stone-300">
                  {t("email_label")}
                  <input
                    className={bttFieldClass}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-sm text-stone-300">
                  {c("phone")}
                  <input
                    className={bttFieldClass}
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder={t("ph_phone")}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </label>
                <label className="grid gap-1 text-sm text-stone-300">
                  {t("address_label")}
                  <input
                    className={bttFieldClass}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                  />
                </label>
                <button
                  type="submit"
                  className={cn(bttPrimaryButtonClass, "btt-focus")}
                >
                  {t("save_local")}
                </button>
              </form>
            </div>
          )}

          {savedFlash && (
            <p
              className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
              role="status"
            >
              {t("save_done")}
            </p>
          )}
          {profileFlash && (
            <p
              className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
              role="status"
            >
              {t("save_server_done")}
            </p>
          )}
          {session === null ? (
            <p className="mt-4 text-xs text-stone-500">{t("phone_saved")}</p>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="btt-glass-strong rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              {t("snapshot_title")}
            </p>
            {lines.length === 0 ? (
              <p className="mt-3 text-sm text-stone-400">{t("snapshot_empty")}</p>
            ) : (
              <>
                <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
                  {lines.map((l) => (
                    <li
                      key={l.sku}
                      className="flex justify-between gap-3 border-b border-white/[0.06] pb-2 last:border-0"
                    >
                      <span className="min-w-0 truncate text-stone-300">{l.name}</span>
                      <span className="shrink-0 tabular-nums text-stone-200/95">
                        {formatUzs(lineTotalUz(l))}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex justify-between text-sm text-stone-400">
                  <span>{tc("subtotal")}</span>
                  <span className="font-semibold tabular-nums text-stone-100">
                    {formatUzs(subtotalUz)}
                  </span>
                </p>
              </>
            )}
            <Link
              href="/cart"
              className={cn(
                bttPrimaryButtonClass,
                "btt-focus mt-4 flex w-full justify-center py-2.5 text-sm",
                lines.length === 0 && "opacity-90",
              )}
            >
              {t("snapshot_open")}
            </Link>
          </div>

          <div className="btt-glass rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              {t("shortcuts")}
            </p>
            <nav className="mt-4 grid gap-2 text-sm" aria-label={t("shortcuts")}>
              <Link
                href="/catalog"
                className="btt-focus rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-stone-200 transition hover:border-white/18 hover:bg-white/[0.06] motion-reduce:transition-none"
              >
                {n("catalog")}
              </Link>
              <Link
                href="/cart"
                className="btt-focus rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-stone-200 transition hover:border-white/18 hover:bg-white/[0.06] motion-reduce:transition-none"
              >
                {n("cart")}
              </Link>
              <Link
                href="/checkout"
                className="btt-focus rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-stone-200 transition hover:border-white/18 hover:bg-white/[0.06] motion-reduce:transition-none"
              >
                {tc("to_checkout")}
              </Link>
            </nav>
          </div>
        </aside>
      </div>

      <AdminInsightsStub />
      <OrderHistory profilePhone={phone} />
    </div>
  );
}
