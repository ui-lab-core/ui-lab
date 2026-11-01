"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const TRACK_W = 220;
const TRACK_H = 10;
const X = CX - TRACK_W / 2;
const Y = CY - TRACK_H / 2;
const THUMB_R = 9;
const TIP_W = 36;
const TIP_H = 22;
const TIP_BOTTOM = CY - THUMB_R - 6;

type Phase = "idle" | "hover" | "drag";
const TIMELINE: Timeline<Phase> = { hover: 0, drag: 500 };

const POSITION: Record<Phase, number> = { idle: 0.25, hover: 0.25, drag: 0.72 };

const cursorFrames = {
  idle: { target: { x: CX + 70, y: CY + 60 }, opacity: 0 },
  hover: { target: { x: X + POSITION.hover * TRACK_W, y: CY } },
  drag: { target: { x: X + POSITION.drag * TRACK_W, y: CY }, scale: 0.9 },
} satisfies Record<Phase, CursorFrame>;

export function SliderAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const value = POSITION[phase] * TRACK_W;

  return (
    <PreviewFrame ref={ref}>
      <Bar x={X} y={Y} w={TRACK_W} h={TRACK_H} rx={5} className={role.border} />
      <Bar x={X} y={Y} w={value} h={TRACK_H} rx={5} className={tone(on)} style={{ transition: motion.slow }} />
      <Bar x={X} y={CY + 14} w={18} h={5} />
      <Bar x={X + TRACK_W - 18} y={CY + 14} w={18} h={5} />
      <g style={{ transform: `translateX(${X + value}px)`, transition: motion.slow }}>
        <g style={{ opacity: on ? 1 : 0 }}>
          <Box x={-TIP_W / 2} y={TIP_BOTTOM - TIP_H} w={TIP_W} h={TIP_H} rx={5} stroke={role.active} />
          <Bar x={-10} y={TIP_BOTTOM - TIP_H + 8} w={20} h={6} className={role.active} />
        </g>
        <circle cx={0} cy={CY} r={THUMB_R} className={role.text} fill="currentColor" />
        <circle cx={0} cy={CY} r={THUMB_R} className={tone(on)} fill="none" stroke="currentColor" strokeWidth={2} />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames} motion="glide">
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
