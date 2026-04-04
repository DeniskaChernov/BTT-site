"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

export interface MenuBarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  /** Tailwind-классы цвета иконки (например text-amber-400) */
  iconColor: string;
}

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  if (href === "/catalog") {
    return (
      pathname === "/catalog" ||
      pathname.startsWith("/catalog/") ||
      pathname.startsWith("/product/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useHash() {
  const [hash, setHash] = React.useState("");
  React.useEffect(() => {
    const sync = () => setHash(typeof window !== "undefined" ? window.location.hash : "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

function itemIsActive(pathname: string, href: string, hash: string) {
  if (href.includes("#")) {
    const [pathPart, frag] = href.split("#");
    const base = pathPart === "" || pathPart === "/" ? "/" : pathPart;
    if (!pathMatches(pathname, base)) return false;
    return hash === `#${frag}`;
  }
  if (href === "/") {
    if (!pathMatches(pathname, "/")) return false;
    if (hash === "#hits") return false;
    return true;
  }
  return pathMatches(pathname, href);
}

export interface MenuBarProps {
  items: MenuBarItem[];
  className?: string;
  embedded?: boolean;
}

/**
 * Пункты меню без «мазка»: активное состояние — inset-кольцо + лёгкий фон,
 * без больших radial и без 3D-flip (они давали артефакты со свечением).
 */
export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, embedded = false }, ref) => {
    const pathname = usePathname();
    const hash = useHash();

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
            "relative z-10 flex items-center gap-0.5 sm:gap-1",
            embedded && "min-w-0 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
          role="list"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = itemIsActive(pathname, item.href, hash);

            return (
              <li key={item.href} className="relative isolate shrink-0 [contain:layout]">
                <Link
                  href={item.href}
                  className="group block min-w-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/50"
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "relative flex items-center gap-2 overflow-hidden rounded-xl px-2.5 py-2 transition-colors duration-200 sm:px-3.5 sm:py-2.5",
                      isActive
                        ? "text-stone-50"
                        : "text-stone-500 group-hover:text-stone-200"
                    )}
                  >
                    {/* Подсветка строго внутри rounded-xl, без больших radial */}
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-0 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-b from-amber-500/[0.14] to-orange-950/[0.22] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_0_0_1px_rgba(251,191,36,0.22),0_0_16px_rgba(234,88,12,0.1)]"
                          : "bg-transparent shadow-none group-hover:bg-white/[0.06]"
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "relative z-[1] transition-colors duration-200",
                        item.iconColor,
                        isActive ? "opacity-100" : "opacity-45 hover:opacity-100"
                      )}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="relative z-[1] whitespace-nowrap text-xs font-medium sm:text-sm">
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
