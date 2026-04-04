"use client";

import { trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const KEY = "btt-profile-phone";

export function AccountForm() {
  const t = useTranslations("account");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setPhone(s);
    } catch {
      /* ignore */
    }
  }, []);

  const save = () => {
    try {
      localStorage.setItem(KEY, phone);
      trackEvent("profile_save", { phone });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="btt-container max-w-md py-14">
      <h1 className="text-3xl font-bold text-stone-50">{t("title")}</h1>
      <p className="mt-2 text-sm text-stone-400">{t("sub")}</p>
      <form
        className="btt-glass mt-8 grid gap-4 rounded-3xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="grid gap-1 text-sm text-stone-300">
          {t("login")} / {t("register")}
          <input
            className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-stone-100"
            placeholder="email@..."
            type="email"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-300">
          {t("save")}
          <input
            className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-stone-100"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998..."
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {t("save")}
        </button>
      </form>
      <p className="mt-4 text-xs text-stone-500">{t("phone_saved")}</p>
    </div>
  );
}
