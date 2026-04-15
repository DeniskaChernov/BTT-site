import { cn } from "@/lib/utils";

/** Поля форм на тёмных BTT-страницах: стекло, фокус-кольцо, disabled */
export const bttFieldClass =
  "rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export const bttSelectFieldClass = cn(bttFieldClass, "bg-stone-950/40");

/** Компактные числовые поля (кол-во кг, метры на PDP) */
export const bttFieldCompactClass =
  "w-32 rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-stone-100 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20";

/** Основная CTA-кнопка (градиент) */
export const bttPrimaryButtonClass =
  "rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-[transform,box-shadow,filter] duration-200 ease-out hover:from-amber-500 hover:to-orange-500 hover:shadow-orange-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

/** Вторичные CTA-пилюли для hero/page intro блоков */
export const bttSecondaryAmberButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15 motion-reduce:transition-none";

export const bttSecondaryNeutralButtonClass =
  "btt-focus inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-white/25 motion-reduce:transition-none";

/** Вторичная «пилюля» (переключатели доставки и т.п.) */
export const bttPillButtonInactiveClass =
  "rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300 transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40";

export const bttPillButtonActiveClass =
  "rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 text-sm text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50";

/** Внутренний input в степпере количества (корзина) */
export const bttFieldStepperInputClass =
  "w-16 border-x border-white/10 bg-transparent px-2 py-1.5 text-center text-sm text-stone-100 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-inset focus:ring-amber-500/20";

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
