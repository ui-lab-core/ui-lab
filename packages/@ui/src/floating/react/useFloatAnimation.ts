import * as React from "react";
import { prefersReducedMotion, readMotion } from "@/lib/motion";

const PLACEMENT_TRANSFORM_MAP: Record<string, string> = {
  top: "translateY(4px) scale(0.95)",
  bottom: "translateY(-4px) scale(0.95)",
  left: "translateX(4px) scale(0.95)",
  right: "translateX(-4px) scale(0.95)",
};

function getInitialTransform(placement: string): string {
  const side = placement.split("-")[0];
  return PLACEMENT_TRANSFORM_MAP[side] ?? "scale(0.95)";
}

interface UseFloatAnimationOptions {
  open: boolean;
  element?: HTMLElement | null;
  isPositioned: boolean;
  placement: string;
  /** Skips the exit transition entirely, unmounting the panel the instant `open` goes false. */
  skipExitAnimation?: boolean;
}

interface UseFloatAnimationReturn {
  isAnimating: boolean;
  isExiting: boolean;
  animationStyles: React.CSSProperties;
}

export function useFloatAnimation({
  open,
  element = null,
  isPositioned,
  placement,
  skipExitAnimation = false,
}: UseFloatAnimationOptions): UseFloatAnimationReturn {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const prevOpenRef = React.useRef(open);

  // Mirrors `open` into `isExiting` synchronously during render rather than in an effect.
  // Effects run after commit, so on the first render where `open` goes false, `isExiting`
  // would still read stale-false for that one commit — unmounting the floating node before
  // it ever paints an exiting frame, then remounting a fresh element once the effect catches
  // up. That discards the frame the CSS transition needs to animate from, so it never plays.
  if (prevOpenRef.current !== open) {
    prevOpenRef.current = open;
    if (!open && !skipExitAnimation) setIsExiting(true);
  }

  React.useEffect(() => {
    if (!(open && isPositioned)) return;

    // Two-step enter, mirroring the exit path below. Setting isAnimating(true)
    // directly can be coalesced into the same frame as the first content paint
    // (e.g. when a parent re-renders from focus events), so the initial
    // opacity-0 state is never painted and the entrance transition is skipped.
    // Deferring via rAF guarantees a painted opacity-0 frame first.
    setIsExiting(false);
    setIsAnimating(false);
    const rafId = requestAnimationFrame(() => setIsAnimating(true));
    return () => cancelAnimationFrame(rafId);
  }, [open, isPositioned]);

  React.useEffect(() => {
    if (open) return;
    const rafId = requestAnimationFrame(() => setIsAnimating(false));
    const timer = setTimeout(() => setIsExiting(false), readMotion(element, "exit").duration);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [element, open]);

  const animationStyles = React.useMemo(
    (): React.CSSProperties => ({
      transitionDuration: open
        ? "var(--enter-duration, var(--duration-moderate, 200ms))"
        : "var(--exit-duration, var(--duration-normal, 150ms))",
      transitionTimingFunction: open
        ? "var(--enter-easing, var(--ease-out, cubic-bezier(0, 0, 0.2, 1)))"
        : "var(--exit-easing, var(--ease-in, cubic-bezier(0.4, 0, 1, 1)))",
      opacity: isAnimating ? 1 : 0,
      transform: prefersReducedMotion() ? "none" : isAnimating ? "scale(1)" : getInitialTransform(placement),
      // Interactivity follows the open state, not the animation state. Otherwise
      // the deferred entrance (see above) would leave the menu pointer-events:none
      // for a frame, and a fast click could be swallowed. During exit `open` is
      // already false, so the fading panel stays inert.
      pointerEvents: open ? "auto" : "none",
    }),
    [isAnimating, open, placement],
  );

  return { isAnimating, isExiting, animationStyles };
}
