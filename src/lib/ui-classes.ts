import { cn } from "@/lib/utils";

export const bttFieldClass =
  "rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 outline-none backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 ease-btt focus:border-white/30 focus:ring-2 focus:ring-white/15 disabled:cursor-not-allowed disabled:opacity-60";

export const bttSelectFieldClass = cn(bttFieldClass, "bg-white/[0.04]");

export const bttFieldCompactClass =
  "w-full max-w-[8.5rem] rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 outline-none backdrop-blur-md transition-[border-color,box-shadow] duration-300 ease-btt focus:border-white/30 focus:ring-2 focus:ring-white/15 sm:w-32 sm:py-2";

/** Основная CTA — стеклянная пилюля в стиле Apple */
export const bttPrimaryButtonClass =
  "rounded-full border border-white/25 bg-white/[0.12] px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition-[transform,box-shadow,background-color,border-color] duration-300 ease-btt hover:border-white/35 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none min-h-11 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.14),0_8px_28px_rgba(0,0,0,0.35)]";

export const bttSecondaryAmberButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-white/18 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-stone-100 backdrop-blur-xl transition-[color,background-color,border-color,transform] duration-300 ease-btt hover:border-white/28 hover:bg-white/[0.1] motion-reduce:transition-none min-h-11";

export const bttSecondaryNeutralButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-200 backdrop-blur-lg transition-[color,background-color,border-color,transform] duration-300 ease-btt hover:border-white/25 hover:bg-white/[0.08] motion-reduce:transition-none min-h-11";

export const bttPillButtonInactiveClass =
  "rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-stone-300 backdrop-blur-md transition-[color,background-color,border-color] duration-300 ease-btt hover:border-white/22 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 min-h-11";

export const bttPillButtonActiveClass =
  "rounded-full border border-white/28 bg-white/[0.14] px-4 py-2.5 text-sm text-white shadow-md backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-11 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.12)]";

export const bttFieldStepperInputClass =
  "w-16 min-h-11 border-x border-white/10 bg-transparent px-2 py-2 text-center text-sm text-stone-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-inset focus:ring-white/15";

export const bttMobileCommerceBarClass =
  "fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#050506]/75 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl lg:hidden";

export const bttMobilePageBottomClass =
  "pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-14";

export const bttTapReduceClass = "motion-reduce:active:scale-100";

export const bttFooterLinkClass = cn(
  "group btt-focus inline-flex w-fit items-center gap-1 rounded-md py-0.5 text-stone-400 outline-none transition duration-200",
  "hover:translate-x-0.5 hover:text-stone-100 motion-reduce:hover:translate-x-0 motion-reduce:transition-none",
);

export const bttQuizOptionClass = cn(
  "rounded-btt border border-white/15 bg-white/[0.04] text-left text-sm font-semibold backdrop-blur-md transition duration-200",
  "hover:border-white/25 hover:bg-white/[0.07] active:scale-[0.99] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]",
);

export const bttQuizChipClass = cn(
  "rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm backdrop-blur-md transition duration-200",
  "hover:border-white/25 hover:bg-white/[0.07] active:scale-[0.98] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
);
