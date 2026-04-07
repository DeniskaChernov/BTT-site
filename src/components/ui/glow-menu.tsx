"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { pathMatches } from "@/lib/nav-active";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const BRAND_HALO =
  "linear-gradient(180deg, rgba(251,191,36,0.08) 0%, transparent 45%, rgba(234,88,12,0.04) 100%)";

export interface GlowNavPillProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowNavDivider() {
  return (
    <span
      className="mx-0.5 w-px shrink-0 self-stretch bg-gradient-to-b from-transparent via-white/[0.14] to-transparent sm:mx-1"
      aria-hidden
    />
  );
}

export function GlowNavBrand() {
  const pathname = usePathname();
  const active = pathMatches(pathname, "/");

  return (
    <div className="relative shrink-0 rounded-xl p-[1px] shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]">
      <div
        className="pointer-events-none absolute inset-0 rounded-[11px] opacity-90"
        style={{ background: BRAND_HALO }}
        aria-hidden
      />
      <Link
        href="/"
        className={cn(
          "group relative flex shrink-0 items-center gap-2 rounded-[11px] px-2 py-1.5 outline-none sm:gap-2 sm:px-2.5 sm:py-2",
          "transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]",
          active ? "bg-black/20" : "bg-transparent hover:bg-white/[0.04]"
        )}
        aria-current={active ? "page" : undefined}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-700 text-[10px] font-bold text-white shadow-md shadow-orange-900/30 ring-1 ring-white/20 sm:h-8 sm:w-8 sm:text-xs">
          BT
        </span>
        <span
          className={cn(
            "max-w-[5.5rem] truncate text-xs font-semibold tracking-tight sm:max-w-[10rem] sm:text-sm",
            active ? "text-white" : "text-stone-500 group-hover:text-stone-200"
          )}
        >
          Bententrade
        </span>
      </Link>
    </div>
  );
}

export function GlowNavPill({ children, className }: GlowNavPillProps) {
  return (
    <div
      className={cn(
        "inline-flex min-h-[3.25rem] max-w-full min-w-0 items-center gap-0 overflow-x-auto overflow-y-visible rounded-full border border-white/[0.09] bg-[#141414]/98 px-1.5 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:min-h-[3.5rem] sm:gap-0.5 sm:px-2 sm:py-1.5",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface GlowNavItemProps {
  href: string;
  icon: LucideIcon;
  label: React.ReactNode;
  active?: boolean;
  className?: string;
  badge?: number;
  /** «Корзина» — лёгкий янтарный акцент иконки, как в референсе */
  iconTone?: "neutral" | "cart";
}

export function GlowNavItem({
  href,
  icon: Icon,
  label,
  active: activeProp,
  className,
  badge,
  iconTone = "neutral",
}: GlowNavItemProps) {
  const pathname = usePathname();
  const active = activeProp ?? pathMatches(pathname, href);

  const iconInactive =
    iconTone === "cart"
      ? "text-amber-500/85 group-hover:text-amber-400"
      : "text-stone-500 group-hover:text-stone-300";

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[2.75rem] shrink-0 items-center overflow-hidden rounded-xl px-2.5 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] sm:min-h-[3rem] sm:px-3",
        className
      )}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300",
          active ? "opacity-100" : "bg-white/[0.05] opacity-0 group-hover:opacity-100"
        )}
        style={
          active
            ? {
                backgroundImage:
                  "linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.06) 20%, rgba(251,191,36,0.18) 50%, rgba(234,88,12,0.1) 75%, transparent 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.05), inset 0 -1px 0 0 rgba(0,0,0,0.15)",
              }
            : undefined
        }
        aria-hidden
      />
      <span className="relative flex items-center gap-2 whitespace-nowrap">
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]",
            "stroke-[1.5] transition-colors",
            active ? "text-white" : iconInactive
          )}
          aria-hidden
        />
        <span
          className={cn(
            "text-xs font-medium tracking-tight sm:text-sm",
            active ? "text-white" : "text-stone-500 group-hover:text-stone-300"
          )}
        >
          {label}
        </span>
        {badge !== undefined && badge > 0 ? (
          <span className="ml-0.5 inline-flex min-w-[1rem] justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-1 text-[10px] font-semibold text-white sm:text-xs">
            {badge}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
