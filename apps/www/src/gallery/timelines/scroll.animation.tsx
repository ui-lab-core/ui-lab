"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const X = 85;
const Y = 52;
const VIEW_W = 230;
const VIEW_H = 196;
const TEXT_X = X + 18;
const TRACK_X = X + VIEW_W - 13;
const THUMB_W = 5;
const THUMB_H = 60;
const THUMB_TOP = Y + 12;
const THUMB_BOTTOM = Y + VIEW_H - 12 - THUMB_H;
const SCROLL = 112;
const SECTIONS = [
  [70, 175, 138, 155],
  [60, 160, 120],
  [69, 160, 120, 140],
  [75, 175, 125],
  [55, 165, 110],
];

const LINES = SECTIONS.flatMap(([title, ...lines], s) => {
  const top = Y + 16 + s * 66;
  return [
    { y: top, w: title, h: 6 },
    ...lines.map((w, i) => ({ y: top + 15 + i * 10, w, h: 5 })),
    { y: top + 56, w: 185, h: 1 },
  ];
});

type Phase = "idle" | "hovering" | "dragging";
const TIMELINE: Timeline<Phase> = { hovering: 0, dragging: 500 };

const cursorFrames = {
  idle: { target: { x: 340, y: 250 }, opacity: 0 },
  hovering: { target: { x: TRACK_X, y: THUMB_TOP + THUMB_H / 2 } },
  dragging: { target: { x: TRACK_X, y: THUMB_BOTTOM + THUMB_H / 2 }, motion: "drag" },
} satisfies Record<Phase, CursorFrame>;

export function ScrollAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const dragging = phase === "dragging";
  const travel = dragging ? { transition: motion.drag } : undefined;

  return (
    <PreviewFrame ref={ref}>
      <defs>
        <clipPath id="scroll-clip">
          <rect x={X} y={Y} width={VIEW_W - 20} height={VIEW_H} />
        </clipPath>
      </defs>
      <Box x={X} y={Y} w={VIEW_W} h={VIEW_H} rx={6} />
      <g clipPath="url(#scroll-clip)">
        <g style={{ transform: `translateY(${dragging ? -SCROLL : 0}px)`, ...travel }}>
          {LINES.map((line, i) => (
            <Bar
              key={i}
              x={TEXT_X}
              y={line.y}
              w={line.w}
              h={line.h}
              rx={line.h === 1 ? 0 : undefined}
              className={line.h === 1 ? role.border : role.muted}
            />
          ))}
        </g>
      </g>
      <Bar
        x={TRACK_X}
        y={THUMB_TOP}
        w={THUMB_W}
        h={THUMB_H}
        rx={2.5}
        className={tone(on)}
        style={{ opacity: on ? 1 : 0, transform: `translateY(${dragging ? THUMB_BOTTOM - THUMB_TOP : 0}px)`, ...travel }}
      />

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
