"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Активная ячейка: мягкий вертикальный градиент + inset-обводка, без широкого radial «ореола» */
const navActiveCell = cn(
  "bg-gradient-to-b from-amber-500/[0.13] to-stone-950/50",
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),inset_0_0_0_1px_rgba(251,191,36,0.26)]"
);

export interface GlowNavPillProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowNavDivider() {
  return (
    <span
      className="mx-0.5 h-5 w-px shrink-0 self-center bg-white/[0.12] sm:mx-1 sm:h-7"
      aria-hidden
    />
  );
}

export function GlowNavBrand() {
  const pathname = usePathname();
  const active = pathname === "/" || pathname === "";

  return (
    <Link
      href="/"
      className="group relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-xl px-1.5 py-1 sm:gap-2 sm:px-2.5 sm:py-2"
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden rounded-xl transition-opacity duration-300",
          active ? navActiveCell : "bg-white/[0.06] opacity-0 transition-opacity group-hover:opacity-100"
        )}
        aria-hidden
      />
      <span className="relative flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/10 ring-offset-0 sm:h-8 sm:w-8 sm:text-xs">
          BT
        </span>
        <span
          className={cn(
            "max-w-[5.5rem] truncate text-xs font-semibold tracking-tight sm:max-w-[10rem] sm:text-sm",
            active ? "text-stone-50" : "text-stone-500 group-hover:text-stone-300"
          )}
        >
          Bententrade
        </span>
      </span>
    </Link>
  );
}

export function GlowNavPill({ children, className }: GlowNavPillProps) {
  return (
    <div
      className={cn(
        "inline-flex w-max max-w-full min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-white/[0.12] bg-[#0a0908]/82 px-1.5 py-1 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_12px_48px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0908]/68",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        "sm:gap-1 sm:px-2.5 sm:py-1.5",
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
}

export function GlowNavItem({
  href,
  icon: Icon,
  label,
  active: activeProp,
  className,
  badge,
}: GlowNavItemProps) {
  const pathname = usePathname();
  const active = activeProp ?? pathMatches(pathname, href);

  return (
    <Link
      href={href}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-xl outline-none transition-colors",
        className
      )}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300",
          active ? navActiveCell : "bg-white/[0.06] opacity-0 transition-opacity group-hover:opacity-100"
        )}
        aria-hidden
      />
      <span
        className={cn(
          "relative flex items-center gap-2 whitespace-nowrap rounded-xl px-2.5 py-2 sm:px-3",
          active ? "text-stone-50" : "text-stone-500 group-hover:text-stone-300"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]",
            "stroke-[1.5]",
            active ? "text-amber-400" : "text-stone-500 group-hover:text-stone-400"
          )}
          aria-hidden
        />
        <span className="text-xs font-medium tracking-tight sm:text-sm">{label}</span>
        {badge !== undefined && badge > 0 ? (
          <span className="ml-0.5 inline-flex min-w-[1rem] justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-1 text-[10px] font-semibold text-white sm:text-xs">
            {badge}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
