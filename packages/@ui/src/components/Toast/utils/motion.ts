import { readMotion } from "@/lib/motion";

const keywords: Record<string, string> = {
  ease: "0.25, 0.1, 0.25, 1",
  "ease-in": "0.42, 0, 1, 1",
  "ease-out": "0, 0, 0.58, 1",
  "ease-in-out": "0.42, 0, 0.58, 1",
};
const curves = new Map<string, (progress: number) => number>();
const linear = (progress: number) => progress;

function easing(value: string) {
  if (value === "linear") return linear;
  const curve = keywords[value] || value.match(/^cubic-bezier\(([^)]+)\)$/)?.[1] || "0, 0, 0.2, 1";
  const cached = curves.get(curve);
  if (cached) return cached;
  const [x1, y1, x2, y2] = curve.split(",").map(Number);
  if (![x1, y1, x2, y2].every(Number.isFinite) || x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
    return linear;
  }
  const sample = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  const ease = (progress: number) => {
    if (progress <= 0 || progress >= 1) return progress;
    let low = 0;
    let high = 1;
    // Invert the curve's x coordinate; y is the resulting eased progress.
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      if (sample(mid, x1, x2) < progress) low = mid;
      else high = mid;
    }
    return sample((low + high) / 2, y1, y2);
  };
  curves.set(curve, ease);
  return ease;
}

/** Keep the existing CSS motion tokens and reduced-motion behavior. */
export function toastMotion(element: Element | null, role: "layout" | "exit") {
  const { duration, easing: value } = readMotion(element, role);
  return { duration, ease: easing(value) };
}
