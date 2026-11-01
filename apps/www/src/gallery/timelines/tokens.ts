export const role = {
  surface: "text-background-900",
  border: "text-background-700",
  muted: "text-background-600",
  active: "text-accent-500",
  tint: "text-accent-500/15",
  text: "text-foreground-200",
} as const;

export type Role = keyof typeof role;

export const tone = (on: boolean, off: Role = "muted") => (on ? role.active : role[off]);

export const curve = {
  ease: "cubic-bezier(0.25, 0, 0.25, 1)",
  spring: "cubic-bezier(0.2, 1, 0.4, 1)",
  drag: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const;

export const motion = {
  ease: `all 0.4s ${curve.ease}`,
  spring: `all 0.5s ${curve.spring}`,
  slow: `all 1s ${curve.ease}`,
  long: `all 2s ${curve.ease}`,
  drag: `all 1.3s ${curve.drag}`,
  linear: "all 0.5s linear",
} as const;
