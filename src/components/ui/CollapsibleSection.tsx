"use client";

import { BTT_EASE, bttCollapseTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

type Props = {
  title: string;
  lead?: string;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
  className?: string;
};

export function CollapsibleSection({
  title,
  lead,
  defaultOpen = false,
  badge,
  children,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();
  const panelId = useId();

  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02]",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="btt-focus flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] md:px-6 md:py-5"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-stone-100 md:text-base">{title}</span>
            {badge ? (
              <span className="rounded-full border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">
                {badge}
              </span>
            ) : null}
          </span>
          {lead ? <span className="mt-1 block text-sm text-stone-500">{lead}</span> : null}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 text-amber-400/80 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{
              ...bttCollapseTransition(reduceMotion),
              ease: reduceMotion ? "easeInOut" : ([...BTT_EASE] as [number, number, number, number]),
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-5 pb-5 pt-4 md:px-6 md:pb-6">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
