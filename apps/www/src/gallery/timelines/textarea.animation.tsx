"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const X = 80;
const Y = 82;
const AREA_W = 240;
const AREA_H = 108;
const TEXT_X = X + 16;
const LINES = [160, 130, 90];
const COUNTER_W = 60;

type Phase = "idle" | "hovering" | "focused" | "line1" | "line2" | "line3" | "completed";
const TIMELINE: Timeline<Phase> = {
  hovering: 0,
  focused: 600,
  line1: 1100,
  line2: 1600,
  line3: 2100,
  completed: 2600,
};

const ORDER: Phase[] = ["idle", "hovering", "focused", "line1", "line2", "line3", "completed"];

const cursorFrames = {
  idle: { target: { x: 280, y: 240 }, opacity: 0 },
  hovering: { target: { x: CX, y: Y + AREA_H / 2 } },
  focused: { target: { x: CX, y: Y + AREA_H / 2 }, scale: 0.85 },
  line1: { target: { x: 310, y: 240 }, opacity: 0 },
  line2: { target: { x: 310, y: 240 }, opacity: 0 },
  line3: { target: { x: 310, y: 240 }, opacity: 0 },
  completed: { target: { x: 310, y: 240 }, opacity: 0 },
} satisfies Record<Phase, CursorFrame>;

export function TextareaAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const step = ORDER.indexOf(phase);
  const focused = step >= ORDER.indexOf("focused");
  const typed = Math.max(0, Math.min(3, step - ORDER.indexOf("focused")));
  const done = phase === "completed";
  const typing = { transition: motion.linear };
  const line = Math.max(0, typed - 1);

  return (
    <PreviewFrame ref={ref}>
      <Bar x={X} y={Y - 18} w={72} h={7} />
      <Box x={X} y={Y} w={AREA_W} h={AREA_H} stroke={tone(focused, "border")} />
      <g style={{ opacity: typed ? 0 : 1 }}>
        <Bar x={TEXT_X} y={Y + 16} w={100} h={7} />
        <Bar x={TEXT_X} y={Y + 30} w={68} h={5} />
      </g>
      {LINES.map((w, i) => (
        <Bar key={i} x={TEXT_X} y={Y + 16 + i * 16} w={i < typed ? w : 0} h={7} className={role.active} style={typing} />
      ))}
      <Bar
        x={TEXT_X + (typed ? LINES[line] + 2 : 0)}
        y={Y + 12 + line * 16}
        w={2}
        h={14}
        rx={1}
        className={role.active}
        style={{ ...typing, opacity: focused && !done ? 1 : 0 }}
      />
      <path
        d={`M ${X + AREA_W - 10} ${Y + AREA_H - 2} l 8 -8 m -14 8 l 14 -14`}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className={tone(focused)}
      />
      <g style={{ opacity: focused ? 1 : 0 }}>
        <Bar x={X + AREA_W - COUNTER_W} y={Y + AREA_H + 10} w={COUNTER_W} h={5} className={role.border} />
        <Bar
          x={X + AREA_W - COUNTER_W}
          y={Y + AREA_H + 10}
          w={(typed / 3) * COUNTER_W * (47 / 200)}
          h={5}
          className={role.active}
          style={typing}
        />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
