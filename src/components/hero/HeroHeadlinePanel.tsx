import type { ReactNode } from "react";

/**
 * Органическая L-форма заголовка (interlock с фото) — как в CAIRIS.
 * Координаты viewBox 0 0 400 240, масштабируются через preserveAspectRatio="none".
 */
const HEADLINE_SHAPE_PATH =
  "M0,0 H244 V56 C244,70 228,74 220,80 C214,86 248,88 270,90 H352 C388,90 402,108 384,126 C356,154 250,168 0,142 V0 Z";

type HeroHeadlinePanelProps = {
  children: ReactNode;
};

export function HeroHeadlinePanel({ children }: HeroHeadlinePanelProps) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-10 w-[min(92%,22rem)] sm:w-[min(88%,26rem)] lg:w-[min(85%,30rem)]">
      <div className="relative w-full" style={{ aspectRatio: "400 / 240" }}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={HEADLINE_SHAPE_PATH} fill="#f7f5f2" />
        </svg>
        <div className="pointer-events-auto relative flex h-full flex-col justify-start px-[9%] pb-[14%] pt-[9%] sm:px-[10%] sm:pt-[10%]">
          {children}
        </div>
      </div>
    </div>
  );
}
