import { cn } from "@/lib/utils";

/** Поля форм на тёмных BTT-страницах: стекло, фокус-кольцо, disabled */
export const bttFieldClass =
  "rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-btt focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export const bttSelectFieldClass = cn(bttFieldClass, "bg-stone-950/40");

export const bttFieldCompactClass =
  "w-full max-w-[8.5rem] rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 outline-none transition-[border-color,box-shadow] duration-300 ease-btt focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 sm:w-32 sm:py-2";

/** База мягкой стеклянной CTA с тёплым янтарным оттенком (не яркий градиент) */
export const bttWarmGlassSurfaceClass =
  "border border-amber-400/35 bg-gradient-to-b from-amber-500/20 via-amber-600/15 to-amber-700/10 text-amber-50 shadow-lg backdrop-blur-xl transition-[transform,box-shadow,background-color,border-color,filter] duration-300 ease-btt hover:border-amber-400/50 hover:from-amber-500/30 hover:via-amber-600/20 hover:to-amber-700/10 hover:shadow-amber-950/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [box-shadow:inset_0_1px_0_0_rgba(251,191,36,0.14),0_8px_28px_rgba(0,0,0,0.35)]";

/** Основная CTA-кнопка — мягкое стекло */
export const bttPrimaryButtonClass = cn(
  bttWarmGlassSurfaceClass,
  "rounded-full px-6 py-3 text-sm font-semibold min-h-11",
);

/** Активный чип / фильтр каталога */
export const bttWarmGlassChipActiveClass =
  "border-amber-400/45 bg-gradient-to-b from-amber-500/25 via-amber-600/15 to-amber-700/10 text-amber-50 shadow-md shadow-amber-950/30 ring-1 ring-amber-400/25 backdrop-blur-xl";

/** Маленький бейдж (корзина в меню и т.п.) */
export const bttWarmGlassBadgeClass =
  "border border-amber-400/40 bg-gradient-to-b from-amber-500/40 to-amber-600/22 text-amber-50 shadow-sm shadow-amber-950/35 backdrop-blur-md";

/** Вторичные CTA-пилюли для hero/page intro блоков */
export const bttSecondaryAmberButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur-xl transition-[color,background-color,border-color,transform] duration-300 ease-btt hover:border-amber-400/45 hover:bg-amber-500/16 motion-reduce:transition-none min-h-11";

export const bttSecondaryNeutralButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-200 transition-[color,background-color,border-color,transform] duration-300 ease-btt hover:border-white/25 motion-reduce:transition-none min-h-11";

export const bttPillButtonInactiveClass =
  "rounded-full border border-white/15 px-4 py-2.5 text-sm text-stone-300 transition-[color,background-color,border-color] duration-300 ease-btt hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 min-h-11";

export const bttPillButtonActiveClass = cn(
  bttWarmGlassSurfaceClass,
  "rounded-full px-4 py-2.5 text-sm font-semibold min-h-11 shadow-md",
);

export const bttFieldStepperInputClass =
  "w-16 min-h-11 border-x border-white/10 bg-transparent px-2 py-2 text-center text-sm text-stone-100 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-inset focus:ring-amber-500/20";

export const bttMobileCommerceBarClass =
  "btt-glass-nav fixed bottom-0 left-0 right-0 z-40 border-b-0 border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] lg:hidden";

export const bttMobilePageBottomClass =
  "pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-14";

export const bttTapReduceClass = "motion-reduce:active:scale-100";

export const bttFooterLinkClass = cn(
  "group btt-focus inline-flex w-fit items-center gap-1 rounded-md py-0.5 text-stone-400 outline-none transition duration-200",
  "hover:translate-x-0.5 hover:text-amber-400 motion-reduce:hover:translate-x-0 motion-reduce:transition-none",
);

export const bttQuizOptionClass = cn(
  "rounded-btt border border-white/15 bg-stone-950/50 text-left text-sm font-semibold transition duration-200",
  "hover:border-amber-500/45 hover:bg-white/[0.04] active:scale-[0.99] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]",
);

export const bttQuizChipClass = cn(
  "rounded-full border border-white/15 px-4 py-2 text-sm transition duration-200",
  "hover:border-amber-500/45 hover:bg-white/[0.04] active:scale-[0.98] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
);
