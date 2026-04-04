"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

const easeOut = [0.4, 0, 0.2, 1] as const;

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

/** Только лёгкая смена прозрачности — scale 2 из оригинала размазывал свечение на соседние пункты */
const glowVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      opacity: { duration: 0.35, ease: easeOut },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

export interface MenuBarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  gradient: string;
  /** Tailwind-классы цвета иконки (например text-amber-400) */
  iconColor: string;
}

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface MenuBarProps {
  items: MenuBarItem[];
  className?: string;
  /** Режим внутри GlowNavPill: без второй обводки и лишнего padding */
  embedded?: boolean;
}

/**
 * Пункты меню: 3D-flip по hover + аккуратное свечение только внутри ячейки (без глобального «мазка»).
 */
export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, embedded = false }, ref) => {
    const pathname = usePathname();

    return (
      <motion.nav
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
            "relative z-10 flex items-center gap-1 sm:gap-2",
            embedded && "min-w-0 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
          role="list"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathMatches(pathname, item.href);

            return (
              <motion.li key={item.href} className="relative isolate shrink-0">
                <Link
                  href={item.href}
                  className="block min-w-0 overflow-hidden rounded-xl"
                  aria-current={isActive ? "page" : undefined}
                >
                  <motion.div
                    className="group relative block overflow-hidden rounded-xl"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-0"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{
                        background: item.gradient,
                        borderRadius: "12px",
                      }}
                    />
                    <motion.div
                      className={cn(
                        "relative z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 transition-colors sm:px-4",
                        isActive
                          ? "text-stone-50"
                          : "text-stone-500 group-hover:text-stone-100"
                      )}
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center bottom",
                      }}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          item.iconColor,
                          isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                        )}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium sm:text-sm">{item.label}</span>
                    </motion.div>
                    <motion.div
                      className={cn(
                        "absolute inset-0 z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 sm:px-4",
                        isActive
                          ? "text-stone-50"
                          : "text-stone-500 group-hover:text-stone-100"
                      )}
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center top",
                        rotateX: 90,
                      }}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          item.iconColor,
                          isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                        )}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium sm:text-sm">{item.label}</span>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    );
  }
);

MenuBar.displayName = "MenuBar";
