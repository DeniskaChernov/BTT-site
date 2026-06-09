import { cn } from "@/lib/utils";

/** Поля форм на тёмных BTT-страницах: стекло, фокус-кольцо, disabled */
export const bttFieldClass =
  "rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-btt focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export const bttSelectFieldClass = cn(bttFieldClass, "bg-stone-950/40");

/** Компактные числовые поля (кол-во кг, метры на PDP) */
export const bttFieldCompactClass =
  "w-full max-w-[8.5rem] rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 outline-none transition-[border-color,box-shadow] duration-300 ease-btt focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 sm:w-32 sm:py-2";

/** Основная CTA-кнопка (градиент) */
export const bttPrimaryButtonClass =
  "rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-[transform,box-shadow,filter,background] duration-300 ease-btt hover:from-amber-500 hover:to-orange-500 hover:shadow-orange-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none min-h-11";

/** Вторичные CTA-пилюли для hero/page intro блоков */
export const bttSecondaryAmberButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition-[color,background-color,border-color,transform] duration-300 ease-btt hover:border-amber-400/50 hover:bg-amber-500/15 motion-reduce:transition-none min-h-11";

export const bttSecondaryNeutralButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-200 transition-[color,background-color,border-color,transform] duration-300 ease-btt hover:border-white/25 motion-reduce:transition-none min-h-11";

/** Вторичная «пилюля» (переключатели доставки и т.п.) */
export const bttPillButtonInactiveClass =
  "rounded-full border border-white/15 px-4 py-2.5 text-sm text-stone-300 transition-[color,background-color,border-color] duration-300 ease-btt hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 min-h-11";

export const bttPillButtonActiveClass =
  "rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2.5 text-sm text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 min-h-11";

/** Внутренний input в степпере количества (корзина) */
export const bttFieldStepperInputClass =
  "w-16 min-h-11 border-x border-white/10 bg-transparent px-2 py-2 text-center text-sm text-stone-100 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-inset focus:ring-amber-500/20";

/** Sticky commerce bar внизу экрана на mobile */
export const bttMobileCommerceBarClass =
  "fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#070605]/92 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden";

/** Отступ снизу под fixed commerce bar (cart, checkout, PDP). */
export const bttMobilePageBottomClass =
  "pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-14";

/** Дополняйте к `active:scale-*` на кнопках — при reduced motion без сжатия */
export const bttTapReduceClass = "motion-reduce:active:scale-100";

/** Ссылки в футере и второстепенная навигация */
export const bttFooterLinkClass = cn(
  "group btt-focus inline-flex w-fit items-center gap-1 rounded-md py-0.5 text-stone-400 outline-none transition duration-200",
  "hover:translate-x-0.5 hover:text-amber-400 motion-reduce:hover:translate-x-0 motion-reduce:transition-none",
);

/** Крупные опции квиза (карточки выбора) */
export const bttQuizOptionClass = cn(
  "rounded-btt border border-white/15 bg-stone-950/50 text-left text-sm font-semibold transition duration-200",
  "hover:border-amber-500/45 hover:bg-white/[0.04] active:scale-[0.99] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]",
);

/** Пилюля времени / мелких шагов квиза */
export const bttQuizChipClass = cn(
  "rounded-full border border-white/15 px-4 py-2 text-sm transition duration-200",
  "hover:border-amber-500/45 hover:bg-white/[0.04] active:scale-[0.98] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
);
