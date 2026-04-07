"use client";

import { trackEvent } from "@/lib/analytics";
import { readLocalProfile, writeLocalProfile } from "@/lib/local-profile";
import { bttFieldClass, bttPrimaryButtonClass } from "@/lib/ui-classes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AccountForm() {
  const t = useTranslations("account");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const p = readLocalProfile();
    setEmail(p.email);
    setPhone(p.phone);
  }, []);

  const save = () => {
    writeLocalProfile({ email, phone });
    trackEvent("profile_save", {
      hasEmail: !!email.trim(),
      hasPhone: !!phone.trim(),
    });
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
            className={bttFieldClass}
            placeholder="email@..."
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-300">
          {t("save")}
          <input
            className={bttFieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998..."
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
        <button
          type="submit"
          className={bttPrimaryButtonClass}
        >
          {t("save")}
        </button>
      </form>
      <p className="mt-4 text-xs text-stone-500">{t("phone_saved")}</p>
    </div>
  );
}
