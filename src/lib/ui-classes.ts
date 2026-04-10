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
  "rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-amber-500 hover:to-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50";

/** Вторичная «пилюля» (переключатели доставки и т.п.) */
export const bttPillButtonInactiveClass =
  "rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300 transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40";

export const bttPillButtonActiveClass =
  "rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 text-sm text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50";

/** Внутренний input в степпере количества (корзина) */
export const bttFieldStepperInputClass =
  "w-16 border-x border-white/10 bg-transparent px-2 py-1.5 text-center text-sm text-stone-100 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-inset focus:ring-amber-500/20";

/** Крупные опции квиза (карточки выбора) */
export const bttQuizOptionClass = cn(
  "rounded-btt border border-white/15 bg-stone-950/50 text-left text-sm font-semibold transition duration-200",
  "hover:border-amber-500/45 hover:bg-white/[0.04] active:scale-[0.99]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]",
);

/** Пилюля времени / мелких шагов квиза */
export const bttQuizChipClass = cn(
  "rounded-full border border-white/15 px-4 py-2 text-sm transition duration-200",
  "hover:border-amber-500/45 hover:bg-white/[0.04] active:scale-[0.98]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
);
