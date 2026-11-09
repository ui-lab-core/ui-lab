/** Standard motion curves shared with the component CSS API. */
export const EASING_FUNCTIONS = {
  easeOut: {
    name: "Ease Out",
    bezier: "cubic-bezier(0, 0, 0.2, 1)",
    cssVar: "var(--ease-out)",
    description: "Responsive deceleration for controls and entering surfaces.",
  },
  easeIn: {
    name: "Ease In",
    bezier: "cubic-bezier(0.4, 0, 1, 1)",
    cssVar: "var(--ease-in)",
    description: "Acceleration for surfaces leaving the interface.",
  },
  easeInOut: {
    name: "Ease In Out",
    bezier: "cubic-bezier(0.4, 0, 0.2, 1)",
    cssVar: "var(--ease-in-out)",
    description: "Smooth acceleration and deceleration for repeating state changes.",
  },
  easeOutQuint: {
    name: "Ease Out Quint",
    bezier: "cubic-bezier(0.22, 1, 0.36, 1)",
    cssVar: "var(--ease-out-quint)",
    description: "Quick response with a gradual settle for layout changes.",
  },
} as const;

export type EasingKey = keyof typeof EASING_FUNCTIONS;
export const EASING_KEYS = Object.keys(EASING_FUNCTIONS) as EasingKey[];
