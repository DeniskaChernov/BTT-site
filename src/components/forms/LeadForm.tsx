"use client";

import type { LeadKind } from "@/lib/leads-api";
import { BTT_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
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
  const reduceMotion = useReducedMotion();
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

  const isSending = state === "sending";

  return (
    <form
      ref={formRef}
      className={cn("relative", className)}
      onSubmit={onSubmit}
      aria-busy={isSending}
    >
      <fieldset
        disabled={isSending}
        className="contents"
        aria-disabled={isSending}
      >
        {children}
      </fieldset>

      <div className="mt-1 min-h-[1.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {isSending ? (
            <motion.p
              key="sending"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: [...BTT_EASE] }}
              className="flex items-center gap-2 text-sm text-stone-400"
              role="status"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              {t("sending")}
            </motion.p>
          ) : errMsg ? (
            <motion.p
              key="err"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [...BTT_EASE] }}
              className="flex items-start gap-2 text-sm text-red-300"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {errMsg}
            </motion.p>
          ) : state === "ok" ? (
            <motion.p
              key="ok"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 28 }
              }
              className="flex items-center gap-2 text-sm font-medium text-emerald-300"
              role="status"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              {t("sent")}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
