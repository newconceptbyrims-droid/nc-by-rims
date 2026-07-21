import type { Variants } from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export function fadeUp(delay = 0, distance = 24): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: EASE_OUT },
    },
  };
}

export function fadeIn(delay = 0): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, delay, ease: EASE_OUT } },
  };
}

export function scaleIn(delay = 0): Variants {
  return {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, delay, ease: EASE_OUT },
    },
  };
}

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const viewportOnce = { once: true, margin: "-10% 0px -10% 0px" } as const;
