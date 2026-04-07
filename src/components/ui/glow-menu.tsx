"use client";

/**
 * Glow Menu (spoonyvu / 21st.dev) — кинетическое меню с ореолом и подсветкой активного пункта.
 * Адаптировано: next-intl Link, режим embedded для шапки.
 */

import type { MenuBarProps } from "@/components/ui/menu-bar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
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
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

export const SpoonyGlowMenu = React.forwardRef<HTMLDivElement, MenuBarProps>(
  (
    { className, items, activeItem, embedded = false, onItemClick, ...props },
    ref
  ) => {
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
        {...props}
      >
        {!embedded ? (
          <motion.div
            className="pointer-events-none absolute -inset-2 z-0 rounded-3xl"
            style={{
              background: isDarkTheme
                ? "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(96,165,250,0.12) 0%, rgba(192,132,252,0.08) 45%, transparent 70%)"
                : "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(96,165,250,0.08) 0%, rgba(192,132,252,0.06) 45%, transparent 70%)",
            }}
            variants={navGlowVariants}
          />
        ) : null}
        <ul
          className={cn(
            "relative z-10 flex min-w-0 items-center gap-2",
            embedded &&
              "overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
          role="list"
        >
          {items.map((item) => {
            const Icon = item.icon as LucideIcon;
            const isActive = item.label === activeItem;

            return (
              <motion.li
                key={item.href + item.label}
                className="relative shrink-0"
              >
                <Link
                  href={item.href}
                  className="block w-full min-w-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] rounded-xl"
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    if (item.href === "#") e.preventDefault();
                    onItemClick?.(item.label);
                  }}
                >
                  <motion.div
                    className="group relative isolate block overflow-visible rounded-xl"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-0 rounded-xl"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{
                        background: item.gradient,
                        opacity: isActive ? 1 : 0,
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
                        <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium tracking-tight sm:text-sm">
                        {item.label}
                      </span>
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
                        <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium tracking-tight sm:text-sm">
                        {item.label}
                      </span>
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

SpoonyGlowMenu.displayName = "SpoonyGlowMenu";

/** Алиас для импорта, как в реестре 21st.dev */
export { SpoonyGlowMenu as GlowMenu };
