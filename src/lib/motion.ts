/**
 * Общие параметры motion для единообразных easing и длительностей по сайту.
 * Используйте вместе с `useReducedMotion()` — при reduced motion длительность обнуляйте в компонентах.
 */
/** Cubic-bezier для framer-motion и CSS (совместим с типом Easing) */
export const BTT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const BTT_DURATION = {
  fast: 0.22,
  base: 0.45,
  slow: 0.65,
} as const;

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

/** Мягкая пружина для курсора навигации и мелких UI-элементов */
export const BTT_SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

/** Панели и drawer'ы — плавное открытие без «дёрганья» */
export const BTT_SPRING_DRAWER = {
  type: "spring" as const,
  stiffness: 320,
  damping: 34,
  mass: 0.85,
};

/** Стандартная задержка стаггера для сеток карточек */
export const bttStaggerDelay = (index: number, step = 0.05) => index * step;

export const BTT_STAGGER = {
  step: 0.05,
  delayChildren: 0.04,
  itemDuration: 0.48,
} as const;

export function bttCollapseTransition(reduceMotion?: boolean | null) {
  return reduceMotion ? { duration: 0 } : { duration: 0.28, ease: BTT_EASE };
}

export function bttPageTransition(reduceMotion?: boolean | null) {
  return reduceMotion
    ? { duration: 0 }
    : { duration: BTT_DURATION.base * 0.85, ease: BTT_EASE };
}

export function bttOverlayFade(reduceMotion?: boolean | null) {
  return reduceMotion ? { duration: 0 } : { duration: 0.32, ease: BTT_EASE };
}

export function bttDrawerSpring(reduceMotion?: boolean | null) {
  return reduceMotion
    ? { duration: 0.22, ease: "easeInOut" as const }
    : BTT_SPRING_DRAWER;
}

export function bttRevealTransition(
  reduceMotion?: boolean | null,
  delay = 0,
) {
  return reduceMotion
    ? { duration: 0 }
    : { duration: BTT_DURATION.base, delay, ease: BTT_EASE };
}
