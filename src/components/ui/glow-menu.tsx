"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

export type GlowMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** CSS background for item glow (e.g. radial gradient) */
  gradient: string;
  /** Tailwind classes for icon color */
  iconClassName: string;
};

const easeOut = [0.4, 0, 0.2, 1] as const;

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: easeOut },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const navGlowVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface GlowMenuBarProps {
  items: GlowMenuItem[];
  className?: string;
}

export const GlowMenuBar = React.forwardRef<HTMLElement, GlowMenuBarProps>(
  ({ className, items }, ref) => {
    const pathname = usePathname();

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-stone-950/90 to-stone-950/50 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl",
          className
        )}
        initial="initial"
        whileHover="hover"
      >
        <motion.div
          className="pointer-events-none absolute -inset-2 z-0 rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 50% 0%, rgba(251,191,36,0.22) 0%, rgba(234,88,12,0.12) 35%, rgba(120,53,15,0.08) 60%, transparent 75%)",
          }}
          variants={navGlowVariants}
        />
        <ul
          className="relative z-10 flex max-w-[100vw] items-center gap-1 overflow-x-auto pb-0.5 sm:gap-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent"
          role="list"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathMatches(pathname, item.href);

            return (
              <motion.li key={item.href} className="relative shrink-0">
                <Link
                  href={item.href}
                  className="block w-full min-w-0"
                  aria-current={isActive ? "page" : undefined}
                >
                  <motion.div
                    className="group relative block overflow-visible rounded-xl"
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
                        opacity: isActive ? 1 : 0,
                        borderRadius: "16px",
                      }}
                    />
                    <motion.div
                      className={cn(
                        "relative z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 transition-colors sm:px-4",
                        isActive
                          ? "text-stone-50"
                          : "text-stone-400 group-hover:text-stone-100"
                      )}
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center bottom",
                      }}
                    >
                      <span className={cn("transition-colors duration-300", item.iconClassName)}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-semibold sm:text-sm">
                        {item.label}
                      </span>
                    </motion.div>
                    <motion.div
                      className={cn(
                        "absolute inset-0 z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 sm:px-4",
                        isActive
                          ? "text-stone-50"
                          : "text-stone-400 group-hover:text-stone-100"
                      )}
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center top",
                        rotateX: 90,
                      }}
                    >
                      <span className={cn("transition-colors duration-300", item.iconClassName)}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-semibold sm:text-sm">
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

GlowMenuBar.displayName = "GlowMenuBar";
