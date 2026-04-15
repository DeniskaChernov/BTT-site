/**
 * Общие параметры motion для единообразных easing и длительностей по сайту.
 * Используйте вместе с `useReducedMotion()` — при reduced motion длительность обнуляйте в компонентах.
 */
export const BTT_EASE = [0.22, 1, 0.36, 1] as const;

export const BTT_SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
};

export const BTT_SPRING_SOFT = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
};

/** Стандартная задержка стаггера для сеток карточек */
export const bttStaggerDelay = (index: number, step = 0.06) => index * step;
