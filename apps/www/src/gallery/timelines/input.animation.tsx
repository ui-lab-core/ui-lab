"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const INPUT_W = 220;
const INPUT_H = 48;
const X = CX - INPUT_W / 2;
const Y = CY - INPUT_H / 2;
const TEXT_X = X + 16;
const TEXT_W = 120;

type Phase = "idle" | "hovering" | "focused" | "typing" | "completed";
const TIMELINE: Timeline<Phase> = { hovering: 0, focused: 600, typing: 1100, completed: 1700 };

const cursorFrames = {
  idle: { target: { x: 260, y: 220 }, opacity: 0 },
  hovering: { target: { x: CX, y: CY } },
  focused: { target: { x: CX, y: CY }, scale: 0.85 },
  typing: { target: { x: CX + 80, y: CY + 60 }, opacity: 0 },
  completed: { target: { x: CX + 80, y: CY + 60 }, opacity: 0 },
} satisfies Record<Phase, CursorFrame>;

export function InputAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const focused = phase === "focused" || phase === "typing" || phase === "completed";
  const typed = phase === "typing" || phase === "completed";
  const done = phase === "completed";
  const typing = { transition: motion.linear };

  return (
    <PreviewFrame ref={ref}>
      <Box x={X} y={Y} w={INPUT_W} h={INPUT_H} stroke={tone(focused, "border")} />
      <Bar x={TEXT_X} y={CY - 4} w={typed ? 64 : 80} style={{ opacity: typed ? 0 : 1 }} />
      <Bar x={TEXT_X} y={CY - 4} w={typed ? TEXT_W : 0} className={role.active} style={typing} />
      <Bar
        x={TEXT_X + (typed ? TEXT_W + 2 : 0)}
        y={Y + 12}
        w={2}
        h={24}
        rx={1}
        className={role.active}
        style={{ ...typing, opacity: focused && !done ? 1 : 0 }}
      />
      <g className={role.active} style={{ opacity: done ? 1 : 0 }}>
        <circle cx={X + INPUT_W - 22} cy={CY} r={10} className={role.tint} fill="currentColor" />
        <path
          d={`M ${X + INPUT_W - 26} ${CY} l 3 3 l 5 -6`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
