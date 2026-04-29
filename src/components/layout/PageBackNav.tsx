"use client";

import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";

type Props = {
  fallbackHref: string;
  className?: string;
};

/** Единая полоса «Назад» для подстраниц (см. `BackButton`). */
export function PageBackNav({ fallbackHref, className }: Props) {
  return (
    <nav className={cn("mb-6", className)} aria-label="Back">
      <BackButton fallbackHref={fallbackHref} />
    </nav>
  );
}
