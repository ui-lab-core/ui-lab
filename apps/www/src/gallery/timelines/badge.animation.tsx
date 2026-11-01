"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

const BADGE_W = 120;
const BADGE_H = 38;
const X = CX - BADGE_W / 2;
const Y = CY - BADGE_H / 2;
const RX = 6;
const ICON = 12;
const DISMISS = 10;
const DISMISS_X = X + BADGE_W - 12 - DISMISS;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

const cursorFrames = {
  idle: { target: { x: 250, y: 220 }, opacity: 0 },
  hover: { target: { x: CX + 20, y: CY + 20 } },
} satisfies Record<Phase, CursorFrame>;

export function BadgeAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      <Ring x={X} y={Y} w={BADGE_W} h={BADGE_H} rx={RX} show={on} />
      <Box x={X} y={Y} w={BADGE_W} h={BADGE_H} rx={RX} stroke={tone(on, "border")} />
      <circle cx={X + 12 + ICON / 2} cy={CY} r={ICON / 2} className={tone(on)} fill="currentColor" />
      <Bar x={X + 12 + ICON + 8} y={CY - 4} w={40} className={tone(on)} />
      <path
        d={`M ${DISMISS_X} ${CY - DISMISS / 2} l ${DISMISS} ${DISMISS} m 0 ${-DISMISS} l ${-DISMISS} ${DISMISS}`}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className={tone(on)}
      />

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
