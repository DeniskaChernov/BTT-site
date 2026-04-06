"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

export interface MenuBarKineticItem {
  icon: LucideIcon;
  label: string;
  href: string;
  /** Заливка активной плашки (Tailwind: `from-sky-400 to-blue-600`) */
  surface: string;
  /**
   * Мягкое внешнее свечение вокруг активного пункта (полный CSS radial-gradient),
   * как в `menu-bar-demo.tsx`.
   */
  glow: string;
  iconColor: string;
}

export interface MenuBarKineticProps {
  items: MenuBarKineticItem[];
  className?: string;
  /** Подпись активного пункта (совпадает с `label` одного из items) */
  activeItem?: string;
  /** Внутри GlowNavPill — без второй рамки и фона */
  embedded?: boolean;
  onItemClick?: (label: string) => void;
}

const easeStandard = [0.4, 0, 0.2, 1] as const;

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      opacity: { duration: 0.45, ease: easeStandard },
    },
  },
};

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: easeStandard,
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

const NAV_AMBIENT_DARK =
  "bg-[radial-gradient(ellipse_100%_120%_at_50%_40%,rgba(251,191,36,0.12)_0%,rgba(120,53,15,0.08)_35%,rgba(67,20,7,0.05)_55%,transparent_72%)]";

/** Готовые radial для шапки — те же коэффициенты, что в демо, с чуть сильнее центром под тёмный фон */
export const kineticNavGlowPresets = {
  skyBlue:
    "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.38) 0%, rgba(37,99,235,0.14) 38%, rgba(29,78,216,0.04) 58%, transparent 72%)",
  violet:
    "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.34) 0%, rgba(124,58,237,0.13) 38%, rgba(91,33,182,0.04) 58%, transparent 72%)",
  orange:
    "radial-gradient(circle at 50% 50%, rgba(251,146,60,0.36) 0%, rgba(234,88,12,0.14) 38%, rgba(194,65,12,0.05) 58%, transparent 72%)",
  cyan:
    "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.32) 0%, rgba(20,184,166,0.12) 38%, rgba(13,148,136,0.04) 58%, transparent 72%)",
} as const;

export const MenuBarKinetic = React.forwardRef<
  HTMLElement,
  MenuBarKineticProps
>(({ className, items, activeItem, embedded = false, onItemClick }, ref) => {
    return (
      <motion.nav
        ref={ref}
        className={cn(
          "relative",
          embedded
            ? "overflow-visible border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
            : "overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-background/80 to-background/40 p-2 shadow-lg backdrop-blur-lg",
          className
        )}
        initial="initial"
        whileHover="hover"
      >
        {!embedded ? (
          <motion.div
            className={cn(
              "pointer-events-none absolute -inset-2 z-0 rounded-3xl",
              NAV_AMBIENT_DARK
            )}
            variants={navGlowVariants}
          />
        ) : null}
        <ul
          className={cn(
            "relative z-10 flex items-center gap-2",
            embedded && "py-1"
          )}
          role="list"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <motion.li key={item.href + item.label} className="relative flex items-center">
                {/* Внешний bloom — не режем: родитель nav в embedded с overflow-visible */}
                <span
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-1/2 z-0 block -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out",
                    "h-[calc(100%+1.25rem)] min-h-[2.75rem] w-[calc(100%+0.5rem)] min-w-[4.5rem] rounded-[1.35rem]",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    background: item.glow,
                    filter: "blur(14px)",
                  }}
                  aria-hidden
                />
                <Link
                  href={item.href}
                  className="relative z-10 block w-full"
                  onClick={() => onItemClick?.(item.label)}
                >
                  <motion.div
                    className="group relative block overflow-hidden rounded-xl"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className={cn(
                        "pointer-events-none absolute inset-0 z-0 rounded-xl bg-gradient-to-br",
                        item.surface
                      )}
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={
                        isActive
                          ? {
                              boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.18)",
                            }
                          : undefined
                      }
                    />
                    <motion.div
                      className={cn(
                        "relative z-10 flex items-center gap-2 rounded-xl bg-transparent px-4 py-2 transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
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
                          isActive
                            ? item.iconColor
                            : cn("opacity-50", item.iconColor, "group-hover:opacity-100")
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.label}</span>
                    </motion.div>
                    <motion.div
                      className={cn(
                        "absolute inset-0 z-10 flex items-center gap-2 rounded-xl bg-transparent px-4 py-2 transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
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
                          isActive
                            ? item.iconColor
                            : cn("opacity-50", item.iconColor, "group-hover:opacity-100")
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.label}</span>
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

MenuBarKinetic.displayName = "MenuBarKinetic";
