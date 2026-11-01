"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

const BUTTON_W = 100;
const BUTTON_H = 40;
const SQUARE = 40;
const GAP = 20;
const SHIFT = SQUARE + GAP;
const Y = CY - BUTTON_H / 2;
const RX = 6;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

export function ButtonAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const x = CX - BUTTON_W / 2 - (on ? SHIFT : 0);

  const cursorFrames = {
    idle: { target: { x: 240, y: 200 }, opacity: 0, rotate: 15 },
    hover: { target: { x: x + BUTTON_W / 2 - 8, y: Y + 8 }, rotate: -15 },
  } satisfies Record<Phase, CursorFrame>;

  return (
    <PreviewFrame ref={ref}>
      <Ring x={x} y={Y} w={BUTTON_W} h={BUTTON_H} rx={RX} show={on} />
      <Box x={x} y={Y} w={BUTTON_W} h={BUTTON_H} rx={RX} stroke={tone(on, "border")} />
      <Bar x={x + 12} y={Y + 14} w={12} h={12} className={tone(on)} />
      <Bar x={x + 30} y={Y + 16} w={58} className={tone(on)} />

      {[0, 1].map((i) => {
        const sx = x + BUTTON_W + GAP + i * (SQUARE + GAP);
        return (
          <g key={i} style={{ opacity: on ? 1 : 0 }}>
            <Box x={sx} y={Y} w={SQUARE} h={SQUARE} rx={4} />
            <Bar x={sx + 14} y={Y + 14} w={12} h={12} />
          </g>
        );
      })}

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
