"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Box, CX, CY, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const PICKER_W = 200;
const PICKER_H = 185;
const X = CX - PICKER_W / 2;
const Y = CY - PICKER_H / 2;
const CANVAS_H = 120;
const SLIDER_H = 12;
const SLIDER_W = PICKER_W - 24;
const HUE_Y = Y + CANVAS_H + 16;
const ALPHA_Y = HUE_Y + SLIDER_H + 12;
const HUE_STOPS = ["#f00", "#ff0", "#0f0", "#0ff", "#00f", "#f0f", "#f00"];

type Phase = "idle" | "hover" | "hue" | "canvas";
const TIMELINE: Timeline<Phase> = { hover: 0, hue: 600, canvas: 1600 };

const SWATCH: Record<Phase, string> = {
  idle: "hsl(210, 30%, 45%)",
  hover: "hsl(210, 30%, 45%)",
  hue: "hsl(270, 80%, 50%)",
  canvas: "hsl(270, 60%, 70%)",
};
const HUE_X: Record<Phase, number> = { idle: 0.6, hover: 0.6, hue: 0.8, canvas: 0.8 };
const KNOB: Record<Phase, { x: number; y: number }> = {
  idle: { x: 0.8, y: 0.5 },
  hover: { x: 0.8, y: 0.5 },
  hue: { x: 0.8, y: 0.5 },
  canvas: { x: 0.6, y: 0.3 },
};

const cursorFrames = {
  idle: { target: { x: CX + 60, y: CY + 60 }, opacity: 0 },
  hover: { target: { x: X + 12 + SLIDER_W * HUE_X.hover, y: HUE_Y + SLIDER_H / 2 } },
  hue: { target: { x: X + 12 + SLIDER_W * HUE_X.hue, y: HUE_Y + SLIDER_H / 2 }, scale: 0.9 },
  canvas: { target: { x: X + PICKER_W * KNOB.canvas.x, y: Y + CANVAS_H * KNOB.canvas.y }, scale: 0.9 },
} satisfies Record<Phase, CursorFrame>;

function Knob({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle cx={cx} cy={cy} r={SLIDER_H / 2 + 2} className={role.text} fill="currentColor" style={{ transition: motion.slow }} />
  );
}

export function ColorAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const swatch = SWATCH[phase];

  return (
    <PreviewFrame ref={ref}>
      <defs>
        <linearGradient id="color-hue">
          {HUE_STOPS.map((color, i) => (
            <stop key={i} offset={i / (HUE_STOPS.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <g style={{ filter: on ? "grayscale(0%)" : "grayscale(100%)" }}>
        <Box x={X} y={Y} w={PICKER_W} h={PICKER_H} stroke={tone(on, "border")} />
        <rect x={X + 4} y={Y + 4} width={PICKER_W - 8} height={CANVAS_H} rx={6} fill={swatch} />
        <circle
          cx={X + PICKER_W * KNOB[phase].x}
          cy={Y + CANVAS_H * KNOB[phase].y}
          r={6}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={role.text}
          style={{ transition: motion.slow }}
        />
        <rect x={X + 12} y={HUE_Y} width={SLIDER_W} height={SLIDER_H} rx={SLIDER_H / 2} fill="url(#color-hue)" />
        <Knob cx={X + 12 + SLIDER_W * HUE_X[phase]} cy={HUE_Y + SLIDER_H / 2} />
        <rect x={X + 12} y={ALPHA_Y} width={SLIDER_W} height={SLIDER_H} rx={SLIDER_H / 2} fill={swatch} />
        <Knob cx={X + 12 + SLIDER_W * 0.8} cy={ALPHA_Y + SLIDER_H / 2} />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames} motion="drift">
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
