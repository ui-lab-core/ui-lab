"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const ROW_X = 70;
const ROW_W = 260;
const ROW_H = 48;
const TRACK_W = 44;
const TRACK_H = 24;
const TRACK_X = ROW_X + ROW_W - TRACK_W - 8;
const TRACK_Y = (ROW_H - TRACK_H) / 2;
const THUMB_R = 9;
const START_Y = 102;
const STEP = ROW_H + 16;
const ACTIVE_Y = START_Y + STEP + ROW_H / 2;

type Phase = "idle" | "hover" | "toggled";
const TIMELINE: Timeline<Phase> = { hover: 0, toggled: 600 };

const cursorFrames = {
  idle: { target: { x: 330, y: 240 }, opacity: 0 },
  hover: { target: { x: TRACK_X + TRACK_W / 2 - 6, y: ACTIVE_Y - 6 } },
  toggled: { target: { x: TRACK_X + TRACK_W / 2 - 2, y: ACTIVE_Y - 2 }, scale: 0.88 },
} satisfies Record<Phase, CursorFrame>;

export function SwitchAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const shift = on ? -STEP : 0;

  const rows = [
    { y: START_Y, labelW: 80, checked: true, active: false, visible: !on },
    { y: START_Y + STEP, labelW: 100, checked: false, active: false, visible: true },
    { y: START_Y + STEP * 2, labelW: 65, checked: phase === "toggled", active: on, visible: on },
  ];

  return (
    <PreviewFrame ref={ref}>
      {rows.map((row, i) => (
        <g
          key={i}
          style={{ transform: `translateY(${row.y + shift}px)`, opacity: row.visible ? 1 : 0 }}
        >
          <Ring x={ROW_X} y={0} w={ROW_W} h={ROW_H} show={row.active} />
          <Box
            x={ROW_X}
            y={0}
            w={ROW_W}
            h={ROW_H}
            stroke={role.active}
            style={{ opacity: row.active ? 1 : 0 }}
          />
          <Bar x={ROW_X + 12} y={ROW_H / 2 - 4} w={row.labelW} className={tone(row.active)} />
          <Bar
            x={TRACK_X}
            y={TRACK_Y}
            w={TRACK_W}
            h={TRACK_H}
            rx={TRACK_H / 2}
            className={tone(row.checked, "border")}
          />
          <circle
            cx={row.checked ? TRACK_X + TRACK_W - 3 - THUMB_R : TRACK_X + 3 + THUMB_R}
            cy={ROW_H / 2}
            r={THUMB_R}
            className={role.text}
            fill="currentColor"
            style={{ transition: motion.spring }}
          />
        </g>
      ))}

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
