"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useSyncedHash } from "@/hooks/use-synced-hash";
import { itemIsActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

/** Вертикальная подсветка «сзади», как на референсе */
const ACTIVE_BACKLIT =
  "linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.06) 18%, rgba(251,191,36,0.22) 48%, rgba(234,88,12,0.14) 72%, transparent 100%)";

export interface MenuBarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface MenuBarProps {
  items: MenuBarItem[];
  className?: string;
  embedded?: boolean;
}

export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, embedded = false }, ref) => {
    const pathname = usePathname();
    const hash = useSyncedHash();

    return (
      <nav
        ref={ref}
        className={cn(
          "relative",
          embedded
            ? "min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
            : "overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-stone-950/85 to-stone-900/50 p-2 shadow-lg backdrop-blur-lg",
          className
        )}
      >
        <ul
          className={cn(
            "flex items-center gap-0.5 sm:gap-1",
            embedded && "min-w-0 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
          role="list"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = itemIsActive(pathname, item.href, hash);

            return (
              <li key={item.href} className="relative flex shrink-0">
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex min-h-[2.75rem] items-center overflow-hidden rounded-xl px-3 py-2 outline-none transition-colors sm:min-h-[3rem] sm:px-3.5",
                    "focus-visible:ring-2 focus-visible:ring-amber-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300",
                      isActive
                        ? "opacity-100"
                        : "bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100"
                    )}
                    style={
                      isActive
                        ? {
                            backgroundImage: ACTIVE_BACKLIT,
                            boxShadow:
                              "inset 0 1px 0 0 rgba(255,255,255,0.06), inset 0 -1px 0 0 rgba(0,0,0,0.2)",
                          }
                        : undefined
                    }
                    aria-hidden
                  />

                  <span className="relative z-10 flex items-center gap-2">
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5",
                        "stroke-[1.5] transition-colors duration-200",
                        isActive
                          ? "text-white"
                          : "text-amber-700/45 group-hover:text-amber-600/70"
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "whitespace-nowrap text-xs font-medium tracking-tight sm:text-sm",
                        isActive
                          ? "text-white"
                          : "text-stone-500 group-hover:text-stone-300"
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
);

MenuBar.displayName = "MenuBar";
