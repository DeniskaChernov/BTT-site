"use client";

import type { ReactNode } from "react";
import {
  HERO_HEADLINE_CONTENT,
  HERO_HEADLINE_SHAPE_PATH,
  HERO_HEADLINE_VIEWBOX,
} from "@/components/hero/hero-headline-shape";

type HeroHeadlinePanelProps = {
  children: ReactNode;
};

/**
 * Белая interlock-форма поверх фото hero — масштабируется вместе с карточкой.
 * SVG на весь блок; path в viewBox 1000×700 без preserveAspectRatio="none".
 */
export function HeroHeadlinePanel({ children }: HeroHeadlinePanelProps) {
  const { width, height } = HERO_HEADLINE_VIEWBOX;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 z-0 h-full w-full"
        preserveAspectRatio="xMinYMin meet"
        aria-hidden
      >
        <path d={HERO_HEADLINE_SHAPE_PATH} fill="#f7f5f2" />
      </svg>
      <div
        className="pointer-events-auto absolute z-10"
        style={{
          left: HERO_HEADLINE_CONTENT.left,
          top: HERO_HEADLINE_CONTENT.top,
          maxWidth: HERO_HEADLINE_CONTENT.maxWidth,
        }}
      >
        {children}
      </div>
    </div>
  );
}
