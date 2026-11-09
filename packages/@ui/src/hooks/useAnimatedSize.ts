import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion, readMotion } from "@/lib/motion";

export type AnimatedDimension = "width" | "height";

export interface UseAnimatedSizeOptions {
  dimensions?: AnimatedDimension | readonly AnimatedDimension[];
  duration?: number;
  easing?: string;
  trigger?: unknown;
  disabled?: boolean;
}

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Animates an element from its previous rendered size to its new natural size.
 * The element remains in normal layout, so animating height keeps its top edge
 * anchored and moves only the content below it.
 */
export function useAnimatedSize<T extends HTMLElement = HTMLDivElement>({
  dimensions = ["width", "height"],
  duration,
  easing,
  trigger,
  disabled = false,
}: UseAnimatedSizeOptions = {}) {
  const elementRef = useRef<T | null>(null);
  const previousSizeRef = useRef<ElementSize | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const originalStylesRef = useRef<{ overflow: string; willChange: string } | null>(null);
  const dimensionList: readonly AnimatedDimension[] =
    typeof dimensions === "string" ? [dimensions] : dimensions;
  const dimensionKey = [...dimensionList].sort().join(",");

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const runningAnimation = animationRef.current;
    const renderedSize = runningAnimation
      ? {
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        }
      : previousSizeRef.current;

    runningAnimation?.cancel();
    animationRef.current = null;

    const naturalRect = element.getBoundingClientRect();
    const naturalSize = { width: naturalRect.width, height: naturalRect.height };
    previousSizeRef.current = naturalSize;

    const reduceMotion = prefersReducedMotion();
    const motion = readMotion(element, "layout");
    const resolvedDuration = duration ?? motion.duration;
    if (!renderedSize || disabled || reduceMotion || resolvedDuration <= 0) return;

    const changedDimensions = dimensionList.filter(
      (dimension) => Math.abs(renderedSize[dimension] - naturalSize[dimension]) >= 0.5,
    );
    if (changedDimensions.length === 0) return;

    const from: Keyframe = {};
    const to: Keyframe = {};
    for (const dimension of changedDimensions) {
      from[dimension] = `${renderedSize[dimension]}px`;
      to[dimension] = `${naturalSize[dimension]}px`;
    }

    if (!originalStylesRef.current) {
      originalStylesRef.current = {
        overflow: element.style.overflow,
        willChange: element.style.willChange,
      };
    }
    element.style.overflow = "hidden";
    element.style.willChange = changedDimensions.join(", ");

    const animation = element.animate([from, to], { duration: resolvedDuration, easing: easing ?? motion.easing });
    animationRef.current = animation;

    const restoreStyles = () => {
      if (animationRef.current !== animation) return;
      const originalStyles = originalStylesRef.current;
      if (originalStyles) {
        element.style.overflow = originalStyles.overflow;
        element.style.willChange = originalStyles.willChange;
      }
      originalStylesRef.current = null;
      animationRef.current = null;
    };

    animation.onfinish = restoreStyles;
    animation.oncancel = restoreStyles;
  }, [disabled, dimensionKey, duration, easing, trigger]);

  useLayoutEffect(
    () => () => {
      animationRef.current?.cancel();
      animationRef.current = null;
    },
    [],
  );

  return elementRef;
}
