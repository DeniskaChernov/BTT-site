"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export interface MenuBarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  /** CSS `background` активной плашки (linear-gradient / radial-gradient) */
  gradient: string;
  iconColor: string;
}

export interface MenuBarProps {
  items: MenuBarItem[];
  activeItem?: string;
  /** Внутри GlowNavPill — без второй рамки и фона */
  embedded?: boolean;
  onItemClick?: (label: string) => void;
  className?: string;
}

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const easeStandard = [0.4, 0, 0.2, 1] as const;

/**
 * Фон активной плашки: только opacity, без scale — иначе `scale: 2` из ТЗ
 * размазывает градиент на соседние пункты и логотип.
 */
const pillBgVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: easeStandard },
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

/** Готовые градиенты плашек для шапки */
export const menuBarGradientPresets = {
  home: "linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",
  shop: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
  collections: "linear-gradient(90deg, #f97316 0%, #fb7185 100%)",
  blog: "linear-gradient(135deg, #22d3ee 0%, #0d9488 100%)",
} as const;

/** Мягкий ореол только для отдельного блока меню (не внутри GlowNavPill) */
function NavAmbientGlow({ isDark }: { isDark: boolean }) {
  const bg = isDark
    ? "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(96,165,250,0.12) 0%, rgba(192,132,252,0.08) 45%, transparent 70%)"
    : "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(96,165,250,0.08) 0%, rgba(192,132,252,0.06) 45%, transparent 70%)";

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
      style={{ background: bg }}
      variants={navGlowVariants}
    />
  );
}

export const MenuBar = React.forwardRef<HTMLElement, MenuBarProps>(
  ({ className, items, activeItem, embedded = false, onItemClick }, ref) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const isDarkTheme = !mounted || resolvedTheme !== "light";

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "relative",
          embedded
            ? "min-w-0 flex-1 overflow-hidden border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
            : "overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-background/80 to-background/40 p-2 shadow-lg backdrop-blur-lg",
          className
        )}
        initial="initial"
        whileHover={embedded ? undefined : "hover"}
      >
        {!embedded ? <NavAmbientGlow isDark={isDarkTheme} /> : null}
        <ul
          className={cn(
            "relative z-10 flex min-w-0 items-center gap-1 sm:gap-2",
            embedded && "overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
          role="list"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            if (embedded) {
              return (
                <li key={item.href + item.label} className="relative shrink-0">
                  <Link
                    href={item.href}
                    className="group block min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => {
                      if (item.href === "#") e.preventDefault();
                      onItemClick?.(item.label);
                    }}
                  >
                    <span
                      className={cn(
                        "relative flex items-center gap-2 rounded-xl px-3 py-2 transition-colors sm:px-3.5",
                        isActive
                          ? "text-white"
                          : "text-stone-500 hover:bg-white/[0.06] hover:text-stone-200"
                      )}
                      style={
                        isActive
                          ? {
                              backgroundImage: item.gradient,
                              boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,0.14), 0 0 18px rgba(255,255,255,0.06)",
                            }
                          : undefined
                      }
                    >
                      <span
                        className={cn(
                          "transition-colors duration-200",
                          isActive
                            ? item.iconColor
                            : cn(
                                "opacity-70",
                                item.iconColor,
                                "group-hover:opacity-100"
                              )
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium tracking-tight sm:text-sm">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <motion.li
                key={item.href + item.label}
                className="relative shrink-0"
              >
                <Link
                  href={item.href}
                  className="block w-full min-w-0"
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    if (item.href === "#") e.preventDefault();
                    onItemClick?.(item.label);
                  }}
                >
                  <motion.div
                    className="group relative isolate block overflow-hidden rounded-xl"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-0 rounded-xl"
                      variants={pillBgVariants}
                      initial="hidden"
                      animate={isActive ? "visible" : "hidden"}
                      style={{
                        background: item.gradient,
                        boxShadow: isActive
                          ? "inset 0 1px 0 rgba(255,255,255,0.15)"
                          : undefined,
                      }}
                    />
                    <motion.div
                      className={cn(
                        "relative z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 transition-colors sm:px-4",
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
                            : cn(
                                "opacity-50",
                                item.iconColor,
                                "group-hover:opacity-100"
                              )
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      </span>
                      <span className="whitespace-nowrap">{item.label}</span>
                    </motion.div>
                    <motion.div
                      className={cn(
                        "absolute inset-0 z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 transition-colors sm:px-4",
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
                            : cn(
                                "opacity-50",
                                item.iconColor,
                                "group-hover:opacity-100"
                              )
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      </span>
                      <span className="whitespace-nowrap">{item.label}</span>
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
