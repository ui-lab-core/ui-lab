"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, delay, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const TRIGGER = 48;
const TRIGGER_X = CX - TRIGGER / 2;
const TRIGGER_Y = 150;
const TIP_W = 160;
const TIP_H = 36;
const TIP_X = CX - TIP_W / 2;
const TIP_Y = TRIGGER_Y - 16 - TIP_H;
const MID_Y = TRIGGER_Y + TRIGGER / 2;

type Phase = "idle" | "hovering" | "shown";
const TIMELINE: Timeline<Phase> = { hovering: 0, shown: 600 };

const cursorFrames = {
  idle: { target: { x: 228, y: 226 }, opacity: 0 },
  hovering: { target: { x: CX + 8, y: MID_Y + 8 } },
  shown: { target: { x: CX + 8, y: MID_Y + 8 } },
} satisfies Record<Phase, CursorFrame>;

export function TooltipAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const shown = phase === "shown";

  return (
    <PreviewFrame ref={ref}>
      <g style={{ opacity: shown ? 1 : 0, transform: `translateY(${shown ? 0 : 8}px)`, ...delay(shown ? 250 : 0) }}>
        <Box x={TIP_X} y={TIP_Y} w={TIP_W} h={TIP_H} rx={6} />
        <path d={`M ${CX - 8} ${TIP_Y + TIP_H - 1} l 8 7 l 8 -7 Z`} className={role.surface} fill="currentColor" />
        <path
          d={`M ${CX - 8} ${TIP_Y + TIP_H} l 8 7 l 8 -7`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          className={role.border}
        />
        <Bar x={TIP_X + 14} y={TIP_Y + 14} w={80} />
        <g style={{ opacity: shown ? 1 : 0, ...delay(shown ? 450 : 0) }}>
          <Box x={TIP_X + TIP_W - 54} y={TIP_Y + 9} w={40} h={18} rx={4} fill={role.tint} stroke={role.active} />
          <Bar x={TIP_X + TIP_W - 46} y={TIP_Y + 15} w={24} h={6} className={role.active} />
        </g>
      </g>
      <Box x={TRIGGER_X} y={TRIGGER_Y} w={TRIGGER} h={TRIGGER} rx={6} stroke={tone(on, "border")} />
      <g className={tone(on)}>
        <path
          d={`M ${CX - 5} ${MID_Y - 5} a 5 5 0 1 1 5 5 v 3`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={MID_Y + 9} r={1.5} fill="currentColor" />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
