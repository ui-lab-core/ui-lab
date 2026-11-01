"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { motion, tone } from "./tokens";

const COLS = 7;
const DAYS = 31;
const CELL = 24;
const CELL_GAP = 4;
const GRID_W = COLS * CELL + (COLS - 1) * CELL_GAP;
const CAL_W = 220;
const CAL_H = 196;
const X = CX - CAL_W / 2;
const Y = CY - CAL_H / 2;
const PAD_X = (CAL_W - GRID_W) / 2;
const PAD_Y = 11;
const CHEVRON_X = X + PAD_X + GRID_W - 8;
const CHEVRON_Y = Y + PAD_Y + 9;

type Phase = "idle" | "hovering" | "clicking" | "sliding";
const TIMELINE: Timeline<Phase> = { hovering: 0, clicking: 480, sliding: 720 };

const cursorFrames = {
  idle: { target: { x: X + CAL_W + 40, y: Y + CAL_H + 20 }, opacity: 0 },
  hovering: { target: { x: CHEVRON_X, y: CHEVRON_Y } },
  clicking: { target: { x: CHEVRON_X, y: CHEVRON_Y }, scale: 0.82 },
  sliding: { target: { x: CHEVRON_X, y: CHEVRON_Y } },
} satisfies Record<Phase, CursorFrame>;

function Month({ x, active, day }: { x: number; active: boolean; day?: number }) {
  return (
    <g style={{ transform: `translateX(${x}px)` }}>
      <Bar x={0} y={5} w={82} h={11} className={tone(active)} />
      {[
        { points: `${GRID_W - 36},5 ${GRID_W - 40},10 ${GRID_W - 36},15`, on: false },
        { points: `${GRID_W - 10},5 ${GRID_W - 6},10 ${GRID_W - 10},15`, on: active },
      ].map(({ points, on }) => (
        <polyline
          key={points}
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={tone(on)}
        />
      ))}
      {Array.from({ length: DAYS }, (_, i) => (
        <Bar
          key={i}
          x={(i % COLS) * (CELL + CELL_GAP)}
          y={34 + Math.floor(i / COLS) * (CELL + CELL_GAP)}
          w={CELL}
          h={CELL}
          rx={4}
          className={tone(active && i === day, "border")}
        />
      ))}
    </g>
  );
}

export function DateAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const sliding = phase === "sliding";

  return (
    <PreviewFrame ref={ref}>
      <defs>
        <clipPath id="date-clip">
          <rect x={X} y={Y} width={CAL_W} height={CAL_H} rx={10} />
        </clipPath>
      </defs>
      <Ring x={X} y={Y} w={CAL_W} h={CAL_H} show={on} />
      <Box x={X} y={Y} w={CAL_W} h={CAL_H} stroke={tone(on, "border")} />
      <g clipPath="url(#date-clip)">
        <g
          style={{
            transform: `translate(${X + PAD_X - (sliding ? CAL_W : 0)}px, ${Y + PAD_Y}px)`,
            transition: motion.spring,
          }}
        >
          <Month x={0} active={on && !sliding} day={10} />
          <Month x={CAL_W} active={sliding} day={15} />
        </g>
      </g>

      <CursorProvider phase={phase} frames={cursorFrames} motion="delayed" hotspot={{ x: 5, y: 4 }}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
