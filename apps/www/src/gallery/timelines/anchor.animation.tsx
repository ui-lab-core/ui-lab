"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, delay, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const BLOCK_W = 296;
const X = CX - BLOCK_W / 2;
const LINE_Y = CY - 10;
const LINK_X = X + 64;
const LINK_W = 76;
const CARD_H = 32;
const CARD_Y = LINE_Y - 20 - CARD_H;

type Phase = "idle" | "hovering" | "open";
const TIMELINE: Timeline<Phase> = { hovering: 0, open: 500 };

const cursorFrames = {
  idle: { target: { x: 265, y: 215 }, opacity: 0 },
  hovering: { target: { x: LINK_X + LINK_W / 2, y: LINE_Y + 6 } },
  open: { target: { x: LINK_X + LINK_W / 2, y: LINE_Y + 6 } },
} satisfies Record<Phase, CursorFrame>;

export function AnchorAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const open = phase === "open";

  return (
    <PreviewFrame ref={ref}>
      <Ring x={X} y={LINE_Y} w={BLOCK_W} h={34} rx={6} show={on} />
      <g
        style={{
          opacity: open ? 1 : 0,
          transform: `translateY(${open ? 0 : 8}px)`,
          ...delay(open ? 80 : 0),
        }}
      >
        <Box x={X} y={CARD_Y} w={BLOCK_W} h={CARD_H} rx={6} />
        <circle cx={X + 16} cy={CARD_Y + CARD_H / 2} r={6} className={role.active} fill="currentColor" />
        <Bar x={X + 30} y={CARD_Y + 12} w={BLOCK_W - 46} className={role.active} />
      </g>
      <Bar x={X} y={LINE_Y} w={56} h={10} />
      <Bar x={LINK_X} y={LINE_Y} w={LINK_W} h={10} className={tone(on)} />
      <Bar x={LINK_X} y={LINE_Y + 15} w={LINK_W} h={2} className={tone(on)} />
      <Bar x={LINK_X + LINK_W + 8} y={LINE_Y} w={96} h={10} />
      <Bar x={X} y={LINE_Y + 24} w={176} h={10} />

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
