"use client";

import type { ReactNode } from "react";

/**
 * Форма заголовка — SVG path из Figma Union (ручная вёрстка).
 * @see https://www.figma.com/design/7hYYEnb63F6jUUFwg76QR7?node-id=6-34
 */
export const HERO_HEADLINE_VIEWBOX = { width: 378, height: 300 } as const;

export const HERO_HEADLINE_SHAPE_PATH =
  "M378 275C378 288.807 366.807 300 353 300H25C11.1929 300 0 288.807 0 275V173C0 159.193 11.1929 148 25 148H128C141.807 148 153 136.557 153 122.75C153 108.943 164.193 97.5 178 97.5H301C314.807 97.5 326 86.3071 326 72.5V68C326 54.1929 314.807 43 301 43H105C93.1259 43 83.5 33.3741 83.5 21.5C83.5 9.62588 93.1259 0 105 0H353C366.807 0 378 11.1929 378 25V275Z";

type HeroHeadlinePanelProps = {
  children: ReactNode;
};

export function HeroHeadlinePanel({ children }: HeroHeadlinePanelProps) {
  const { width, height } = HERO_HEADLINE_VIEWBOX;

  return (
    <div className="absolute left-0 top-0 z-10 w-[56%] max-w-[20rem] sm:max-w-[23rem] lg:max-w-[26rem]">
      <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full"
          preserveAspectRatio="xMinYMin meet"
          aria-hidden
        >
          <path d={HERO_HEADLINE_SHAPE_PATH} fill="#f7f5f2" />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-start pl-[5.3%] pr-[8%] pt-[3.7%]">
          {children}
        </div>
      </div>
    </div>
  );
}
