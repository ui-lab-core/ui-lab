"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, delay, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

const TOAST_W = 256;
const TOAST_H = 50;
const X = CX - TOAST_W / 2;
const Y = 130;
const STEP = TOAST_H + 12;
const SHIFT = 57;
const ORIGIN = `${CX}px ${Y + TOAST_H / 2}px`;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

const cursorFrames = {
  idle: { target: { x: X + TOAST_W + 32, y: Y + TOAST_H + 32 }, opacity: 0 },
  hover: { target: { x: X + TOAST_W - 28, y: Y + TOAST_H - 18 + SHIFT } },
} satisfies Record<Phase, CursorFrame>;

function Toast({ active }: { active: boolean }) {
  const mid = Y + TOAST_H / 2;
  return (
    <>
      <Box x={X} y={Y} w={TOAST_W} h={TOAST_H} rx={6} />
      <Bar x={X + 12} y={mid - 8} w={16} h={16} className={tone(active)} />
      <Bar x={X + 36} y={mid - 7} w={92} h={7} className={tone(active)} />
      <Bar x={X + 36} y={mid + 3} w={60} h={5} />
      <path
        d={`M ${X + TOAST_W - 18} ${Y + 12} l 6 6 m 0 -6 l -6 6`}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className={tone(active)}
      />
    </>
  );
}

export function ToastAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      <g style={{ transform: `translateY(${on ? SHIFT : 0}px)` }}>
        <Ring x={X} y={Y} w={TOAST_W} h={TOAST_H} rx={6} show={on} />
        {[2, 1].map((depth) => (
          <g
            key={depth}
            style={{
              transformOrigin: ORIGIN,
              transform: on ? `translateY(${-STEP * depth}px)` : `translateY(${-5 * depth}px) scaleX(${1 - 0.09 * depth})`,
              opacity: on ? 1 : 1 - 0.24 * depth,
              ...delay(40 * depth),
            }}
          >
            <Toast active={on} />
          </g>
        ))}
        <Toast active />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
