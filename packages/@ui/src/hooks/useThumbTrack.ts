"use client";

import * as React from "react";

type Orientation = "horizontal" | "vertical";

// CSS resolves themed lengths (including calc/rem) against the same box used
// for rendering. The travel element lets pointer input use those exact bounds.
const inset = "min(50%, max(var(--thumb-half-size, 0px), var(--thumb-inset, 0px)))";
const travelInset =
  "min(50%, calc(max(var(--thumb-half-size, 0px), var(--thumb-inset, 0px)) + var(--travel-inset, 0px)))";

export function getThumbPosition(
  percent: number,
  edge: "start" | "center" | "end" = "center",
): string {
  const progress = Math.min(Math.max(percent, 0), 100);
  const center = `calc(${progress}% + ${1 - progress / 50} * ${inset})`;
  if (edge === "start") {
    return `max(0%, calc(${center} - var(--thumb-half-size, 0px)))`;
  }
  if (edge === "end") {
    return `min(100%, calc(${center} + var(--thumb-half-size, 0px)))`;
  }
  return center;
}

export function getThumbTrackPercent(
  clientX: number,
  clientY: number,
  travel: HTMLElement,
  orientation: Orientation = "horizontal",
): number {
  const rect = travel.getBoundingClientRect();
  const length = orientation === "vertical" ? rect.height : rect.width;
  if (length <= 0) return 0;
  const offset = orientation === "vertical" ? rect.bottom - clientY : clientX - rect.left;
  return Math.min(Math.max(offset / length, 0), 1);
}

export function useThumbTrack(orientation: Orientation = "horizontal") {
  const travelRef = React.useRef<HTMLDivElement>(null);
  const [thumb, setThumbRef] = React.useState<HTMLDivElement | null>(null);
  const [halfSize, setHalfSize] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!thumb) {
      setHalfSize(0);
      return;
    }

    const measure = () => {
      const style = getComputedStyle(thumb);
      const size = Number.parseFloat(orientation === "vertical" ? style.height : style.width);
      setHalfSize(Number.isFinite(size) ? size / 2 : 0);
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(thumb, { box: "border-box" });
    return () => observer.disconnect();
  }, [thumb, orientation]);

  const trackStyle = { "--thumb-half-size": `${halfSize}px` } as React.CSSProperties;
  const travelProps = {
    ref: travelRef,
    "aria-hidden": true as const,
    style: {
      position: "absolute",
      pointerEvents: "none",
      visibility: "hidden",
      top: orientation === "vertical" ? travelInset : 0,
      bottom: orientation === "vertical" ? travelInset : 0,
      left: orientation === "horizontal" ? travelInset : 0,
      right: orientation === "horizontal" ? travelInset : 0,
    } as React.CSSProperties,
  };

  return { travelRef, setThumbRef, trackStyle, travelProps, halfSize };
}
