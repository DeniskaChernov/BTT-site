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
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-sm text-btt-muted">{t("sub")}</p>
      <form
        className="mt-8 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="grid gap-1 text-sm">
          {t("login")} / {t("register")}
          <input
            className="rounded-btt border px-3 py-2"
            placeholder="email@..."
            type="email"
          />
        </label>
        <label className="grid gap-1 text-sm">
          {t("save")}
          <input
            className="rounded-btt border px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998..."
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-btt-primary px-6 py-3 text-sm font-semibold text-white"
        >
          {t("save")}
        </button>
      </form>
      <p className="mt-4 text-xs text-btt-muted">{t("phone_saved")}</p>
    </div>
  );
}
