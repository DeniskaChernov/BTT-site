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

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: easeStandard },
      scale: { duration: 0.5, type: "spring" as const, stiffness: 300, damping: 25 },
    },
  },
};

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
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

function NavAmbientGlow({ isDark }: { isDark: boolean }) {
  const bg = isDark
    ? "radial-gradient(ellipse 120% 100% at 50% 45%, transparent 0%, rgba(96,165,250,0.32) 28%, rgba(192,132,252,0.26) 52%, rgba(248,113,113,0.22) 78%, transparent 100%)"
    : "radial-gradient(ellipse 120% 100% at 50% 45%, transparent 0%, rgba(96,165,250,0.2) 28%, rgba(192,132,252,0.18) 52%, rgba(248,113,113,0.16) 78%, transparent 100%)";

  return (
    <motion.div
      className="pointer-events-none absolute -inset-2 z-0 rounded-3xl"
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
            ? "overflow-visible border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
            : "overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-background/80 to-background/40 p-2 shadow-lg backdrop-blur-lg",
          className
        )}
        initial="initial"
        whileHover="hover"
      >
        <NavAmbientGlow isDark={isDarkTheme} />
        <ul className="relative z-10 flex items-center gap-2" role="list">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <motion.li key={item.href + item.label} className="relative">
                <Link
                  href={item.href}
                  className="block w-full"
                  onClick={() => onItemClick?.(item.label)}
                >
                  <motion.div
                    className="group relative block overflow-visible rounded-xl"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{
                        background: item.gradient,
                        borderRadius: "16px",
                      }}
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
                            : cn(
                                "opacity-50",
                                item.iconColor,
                                "group-hover:opacity-100"
                              )
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
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
                            : cn(
                                "opacity-50",
                                item.iconColor,
                                "group-hover:opacity-100"
                              )
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
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

MenuBar.displayName = "MenuBar";
