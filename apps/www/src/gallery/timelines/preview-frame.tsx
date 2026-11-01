"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type SVGProps,
} from "react";
import { motion, role } from "./tokens";

export const W = 400;
export const H = 300;
export const CX = W / 2;
export const CY = H / 2;
export const RADIUS = 10;
export const STROKE = 2;

export type Timeline<P extends string> = Record<Exclude<P, "idle">, number>;

export function useTimeline<P extends string>(timeline: Timeline<P>) {
  const ref = useRef<SVGSVGElement>(null);
  const [phase, setPhase] = useState<P>("idle" as P);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = el.closest(".group") ?? el;
    let timers: number[] = [];
    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
    const enter = () => {
      clear();
      timers = Object.entries(timeline as Record<string, number>).map(([next, at]) =>
        window.setTimeout(() => setPhase(next as P), at),
      );
    };
    const leave = () => {
      clear();
      setPhase("idle" as P);
    };
    target.addEventListener("mouseenter", enter);
    target.addEventListener("mouseleave", leave);
    return () => {
      clear();
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
    };
  }, [timeline]);

  return { ref, phase };
}

export const delay = (ms: number) => ({ "--preview-delay": `${ms}ms` }) as CSSProperties;

export function PreviewFrame({ ref, children }: { ref?: Ref<SVGSVGElement>; children: ReactNode }) {
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="h-auto w-50 shrink-0 [&_*]:[transition:var(--preview-motion)_var(--preview-delay,0ms)]"
      style={{ "--preview-motion": motion.ease } as CSSProperties}
    >
      {children}
    </svg>
  );
}

type RectProps = Omit<SVGProps<SVGRectElement>, "x" | "y" | "width" | "height"> & {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function Box({
  x,
  y,
  w,
  h,
  rx = RADIUS,
  fill = role.surface,
  stroke = role.border,
  style,
}: RectProps & { fill?: string; stroke?: string }) {
  return (
    <g style={style}>
      <rect x={x} y={y} width={w} height={h} rx={rx} className={fill} fill="currentColor" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        className={stroke}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
      />
    </g>
  );
}

export function Bar({
  x,
  y,
  w,
  h = 8,
  rx = Math.min(4, h / 2),
  className = role.muted,
  ...rest
}: Omit<RectProps, "h"> & { h?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={Math.max(0, w)}
      height={h}
      rx={rx}
      className={className}
      fill="currentColor"
      {...rest}
    />
  );
}

export function Ring({ x, y, w, h, rx = RADIUS, show }: RectProps & { show: boolean }) {
  return (
    <rect
      x={x - 10}
      y={y - 10}
      width={w + 20}
      height={h + 20}
      rx={Number(rx) + 5}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeDasharray="4 4"
      className={role.active}
      style={{ opacity: show ? 1 : 0 }}
    />
  );
}
