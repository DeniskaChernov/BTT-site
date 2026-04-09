"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
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
        "relative mx-auto flex w-max min-w-0 max-w-full flex-nowrap items-stretch overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.06] p-1 shadow-none backdrop-blur-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.1)]",
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
};

const SlideTab = forwardRef<HTMLLIElement, SlideTabProps>(
  ({ children, href, isActive, setPosition }, ref) => {
    return (
      <li
        ref={ref}
        className="relative z-10 shrink-0"
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
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          className="block cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-stone-400 transition-colors hover:text-stone-100 md:px-5 md:py-3 md:text-base"
        >
          {children}
        </Link>
      </li>
    );
  },
);

SlideTab.displayName = "SlideTab";

function SlideCursor({ position }: { position: CursorPosition }) {
  return (
    <motion.li
      aria-hidden
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="pointer-events-none absolute top-1 bottom-1 z-0 rounded-full bg-white/[0.14]"
    />
  );
}
