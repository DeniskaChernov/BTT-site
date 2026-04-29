"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { BTT_SPRING_SNAPPY } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type SlideTabItem = {
  id: string;
  href: string;
  label: string;
  /** Число на вкладке (например, позиций в корзине). Показывается только если > 0. */
  badge?: number;
  /** Полное имя ссылки для aria-label (например, с числом для экранных дикторов). */
  linkAriaLabel?: string;
  /** Ссылки под пунктом (например, разделы каталога) — показ при наведении. */
  dropdown?: { href: string; label: string }[];
};

type SlideTabsProps = {
  items: SlideTabItem[];
  activeId: string | undefined;
  className?: string;
};

type CursorPosition = { left: number; width: number; opacity: number };

export function SlideTabs({ items, activeId, className }: SlideTabsProps) {
  /** −1: ни один пункт не выбран (страницы вне меню — account, checkout, opt…) */
  const selectedIndex = useMemo(() => {
    const i = items.findIndex((item) => item.id === activeId);
    return i >= 0 ? i : -1;
  }, [items, activeId]);

  const [position, setPosition] = useState<CursorPosition>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  const syncToIndex = useCallback(
    (index: number) => {
      if (index < 0) {
        setPosition({ left: 0, width: 0, opacity: 0 });
        return;
      }
      const el = tabsRef.current[index];
      if (!el) return;
      const { width } = el.getBoundingClientRect();
      setPosition({
        left: el.offsetLeft,
        width,
        opacity: 1,
      });
    },
    [],
  );

  useEffect(() => {
    syncToIndex(selectedIndex);
  }, [selectedIndex, items, syncToIndex]);

  useEffect(() => {
    const onResize = () => syncToIndex(selectedIndex);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selectedIndex, syncToIndex]);

  return (
    <ul
      onMouseLeave={() => {
        syncToIndex(selectedIndex);
      }}
      className={cn(
        "relative mx-auto flex w-max min-w-0 max-w-full flex-nowrap items-stretch overflow-visible rounded-full border border-white/[0.12] bg-white/[0.06] p-1 shadow-none backdrop-blur-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.1)]",
        className,
      )}
    >
      {items.map((item, i) => (
        <SlideTab
          key={item.id}
          ref={(el) => {
            tabsRef.current[i] = el;
          }}
          href={item.href}
          isActive={item.id === activeId}
          setPosition={setPosition}
          badge={item.badge}
          linkAriaLabel={item.linkAriaLabel}
          dropdown={item.dropdown}
        >
          {item.label}
        </SlideTab>
      ))}
      <SlideCursor position={position} />
    </ul>
  );
}

type SlideTabProps = {
  children: React.ReactNode;
  href: string;
  isActive: boolean;
  setPosition: React.Dispatch<React.SetStateAction<CursorPosition>>;
  badge?: number;
  linkAriaLabel?: string;
  dropdown?: { href: string; label: string }[];
};

const SlideTab = forwardRef<HTMLLIElement, SlideTabProps>(
  (
    { children, href, isActive, setPosition, badge, linkAriaLabel, dropdown },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const showBadge = typeof badge === "number" && badge > 0;
    const hasDropdown = Array.isArray(dropdown) && dropdown.length > 0;
    return (
      <li
        ref={ref}
        className={cn("relative z-10 shrink-0", hasDropdown && "z-[45]")}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          const { width } = el.getBoundingClientRect();
          setPosition({
            left: el.offsetLeft,
            width,
            opacity: 1,
          });
        }}
      >
        <div className={cn("relative", hasDropdown && "group")}>
          <Link
            href={href}
            aria-label={linkAriaLabel}
            aria-current={isActive ? "page" : undefined}
            aria-haspopup={hasDropdown ? "menu" : undefined}
            className={cn(
              "relative block cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs font-medium uppercase tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605] motion-reduce:transition-none md:px-5 md:py-3 md:text-base",
              showBadge && "pr-6 md:pr-8",
              isActive
                ? "text-stone-50"
                : "text-stone-400 hover:text-stone-100",
            )}
          >
            {children}
            {showBadge ? (
              <motion.span
                key={badge}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { scale: 0.75, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  reduceMotion ? { duration: 0 } : BTT_SPRING_SNAPPY
                }
                className="pointer-events-none absolute -right-0.5 top-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-gradient-to-b from-amber-500 to-orange-600 px-1 text-[0.625rem] font-bold leading-none text-white shadow-md shadow-amber-950/50 ring-1 ring-white/25 md:right-0.5 md:top-2 md:h-5 md:min-w-5 md:text-[0.65rem]"
              >
                {badge > 9 ? "9+" : badge}
              </motion.span>
            ) : null}
          </Link>
          {hasDropdown ? (
            <div
              role="menu"
              className={cn(
                "pointer-events-none absolute left-0 top-full z-[60] min-w-[12.5rem] max-w-[min(100vw-2rem,18rem)] pt-2",
                "opacity-0 invisible translate-y-0.5",
                "transition-[opacity,transform,visibility] duration-150 motion-reduce:transition-none",
                "group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                "group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
              )}
            >
              <div className="rounded-2xl border border-white/[0.12] bg-gradient-to-b from-stone-900/98 to-stone-950/98 py-1.5 shadow-2xl shadow-black/60 ring-1 ring-white/[0.06] backdrop-blur-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                {dropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="btt-focus block px-4 py-2.5 text-left text-sm font-medium normal-case tracking-normal text-stone-200 outline-none transition-colors hover:bg-white/[0.06] hover:text-amber-100 motion-reduce:transition-none"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </li>
    );
  },
);

SlideTab.displayName = "SlideTab";

function SlideCursor({ position }: { position: CursorPosition }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.li
      aria-hidden
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity,
      }}
      transition={
        reduceMotion ? { duration: 0 } : BTT_SPRING_SNAPPY
      }
      className="pointer-events-none absolute top-1 bottom-1 z-0 rounded-full bg-gradient-to-b from-amber-500/25 via-white/[0.12] to-orange-950/30 shadow-[0_0_24px_rgba(245,158,11,0.12)] ring-1 ring-white/10"
    />
  );
}
