"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * Симметричное свечение: эллипс строго по центру блока (50% 50%), ширина ~110% —
 * равномерно покрывает и иконку, и текст без «съезда» влево.
 */
const ACTIVE_GLOW =
  "radial-gradient(ellipse 115% 100% at 50% 50%, rgba(251,191,36,0.26) 0%, rgba(234,88,12,0.12) 48%, rgba(67,20,7,0.05) 65%, transparent 76%)";

export type GlowMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Цвет иконки в активном состоянии (Tailwind) */
  activeIconClass: string;
};

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface GlowNavPillProps {
  children: React.ReactNode;
  className?: string;
}

/** Вертикальный разделитель внутри pill */
export function GlowNavDivider() {
  return (
    <span
      className="mx-0.5 h-5 w-px shrink-0 self-center bg-white/[0.12] sm:mx-1 sm:h-7"
      aria-hidden
    />
  );
}

/** Логотип + название в том же стиле, что и пункты меню */
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
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl transition-opacity duration-300"
        style={{
          background: ACTIVE_GLOW,
          opacity: active ? 1 : 0,
        }}
        aria-hidden
      />
      <span className="relative flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-[10px] font-bold text-white ring-1 ring-amber-400/25 sm:h-8 sm:w-8 sm:text-xs">
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

/** Один общий «плавающий» контейнер навбара */
export function GlowNavPill({ children, className }: GlowNavPillProps) {
  return (
    <div
      className={cn(
        "inline-flex w-max max-w-full min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-white/[0.1] bg-[#0a0908]/80 px-1.5 py-1 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0908]/65",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        "sm:gap-1 sm:px-2 sm:py-1.5",
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
  /** Явная подсветка (если не передать — считается по pathname) */
  active?: boolean;
  className?: string;
  /** Бейдж (например число в корзине) */
  badge?: number;
}

/**
 * Пункт навбара: outline-иконка, приглушённый текст; активный — белый текст, цветная иконка, radial glow.
 */
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
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          background: ACTIVE_GLOW,
          opacity: active ? 1 : 0,
        }}
        aria-hidden
      />
      <span
        className={cn(
          "relative flex items-center gap-2 whitespace-nowrap rounded-xl px-2.5 py-2 sm:px-3",
          active
            ? "text-stone-50"
            : "text-stone-500 group-hover:text-stone-300"
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

/** Пункт меню с индивидуальным цветом активной иконки (разделы каталога и т.д.) */
export function GlowMenuLink({ item }: { item: GlowMenuItem }) {
  const pathname = usePathname();
  const active = pathMatches(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group relative shrink-0 overflow-hidden rounded-xl outline-none"
      aria-current={active ? "page" : undefined}
    >
      <span
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl transition-opacity duration-300"
        style={{
          background: ACTIVE_GLOW,
          opacity: active ? 1 : 0,
        }}
        aria-hidden
      />
      <span
        className={cn(
          "relative flex items-center gap-2 whitespace-nowrap px-2.5 py-2 sm:px-3",
          active ? "text-stone-50" : "text-stone-500 group-hover:text-stone-300"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]",
            "stroke-[1.5]",
            active ? item.activeIconClass : "text-stone-500 group-hover:text-stone-400"
          )}
          aria-hidden
        />
        <span className="text-xs font-medium tracking-tight sm:text-sm">{item.label}</span>
      </span>
    </Link>
  );
}
