"use client";

import type { LeadKind } from "@/lib/leads-api";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useRef, useState } from "react";

type Props = {
  kind: LeadKind;
  className?: string;
  children: React.ReactNode;
};

export function LeadForm({ kind, className, children }: Props) {
  const locale = useLocale();
  const t = useTranslations("leads");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setErrMsg(null);
    const fd = new FormData(e.currentTarget);
    const fields: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") fields[k] = v;
    });
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, locale, fields }),
      });
      if (res.status === 429) {
        setErrMsg(t("rate_limited"));
        setState("err");
        return;
      }
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setErrMsg(t("error"));
        setState("err");
        return;
      }
      setState("ok");
      formRef.current?.reset();
    } catch {
      setErrMsg(t("error"));
      setState("err");
    }
  }

  return (
    <form
      ref={formRef}
      className={cn(className)}
      onSubmit={onSubmit}
      aria-busy={state === "sending"}
    >
      {children}
      {state === "sending" ? (
        <p className="text-sm text-stone-500">{t("sending")}</p>
      ) : null}
      {errMsg ? (
        <p className="text-sm text-red-400" role="alert">
          {errMsg}
        </p>
      ) : null}
      {state === "ok" ? (
        <p className="text-sm font-medium text-emerald-400">{t("sent")}</p>
      ) : null}
    </form>
  );
}
