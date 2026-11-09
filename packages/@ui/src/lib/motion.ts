/** Runtime readers for the CSS motion API. Durations returned here are milliseconds. */
type MotionRole = "hover" | "press" | "toggle" | "focus" | "layout" | "enter" | "exit";

const roles = {
  hover: { duration: "normal", easing: "out" },
  press: { duration: "fast", easing: "out" },
  toggle: { duration: "moderate", easing: "out" },
  focus: { duration: "normal", easing: "out" },
  layout: { duration: "slow", easing: "out-quint" },
  enter: { duration: "moderate", easing: "out" },
  exit: { duration: "normal", easing: "in" },
} as const;

const durations = { fast: 100, normal: 150, moderate: 200, slow: 300 };
const easings = {
  out: "cubic-bezier(0, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
};

export function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

function milliseconds(value: string, fallback: number) {
  const match = value.trim().match(/^(-?(?:\d*\.)?\d+)(ms|s)$/);
  return match ? Math.max(0, Number(match[1]) * (match[2] === "s" ? 1000 : 1)) : fallback;
}

export function readMotion(element: Element | null, role: MotionRole) {
  const preset = roles[role];
  const style = element?.ownerDocument.defaultView?.getComputedStyle(element);
  const token = (name: string) => style?.getPropertyValue(name).trim() || "";
  const duration = milliseconds(
    token(`--${role}-duration`),
    milliseconds(token(`--duration-${preset.duration}`), durations[preset.duration]),
  );
  return {
    duration: prefersReducedMotion() ? 0 : duration,
    easing: token(`--${role}-easing`) || token(`--ease-${preset.easing}`) || easings[preset.easing],
  };
}

/** Read actual CSS timings so custom durations cannot truncate an exit. */
export function transitionDuration(element: Element | null, fallback: number) {
  if (prefersReducedMotion()) return 0;
  const style = element?.ownerDocument.defaultView?.getComputedStyle(element);
  if (!style?.transitionDuration) return fallback;
  const durations = style.transitionDuration.split(",").map((value) => milliseconds(value, 0));
  const delays = style.transitionDelay.split(",").map((value) => milliseconds(value, 0));
  return Math.max(0, ...durations.map((duration, index) => duration + (delays[index % delays.length] || 0)));
}
