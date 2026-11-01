"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, delay, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const POP_W = 240;
const POP_H = 100;
const POP_X = CX - POP_W / 2;
const POP_Y = 74;
const TRIGGER_W = 140;
const TRIGGER_H = 44;
const TRIGGER_X = CX - TRIGGER_W / 2;
const TRIGGER_Y = POP_Y + POP_H + 8;
const CLOSED_SHIFT = 128 - TRIGGER_Y;
const CHEVRON_X = TRIGGER_X + TRIGGER_W - 30;
const TAIL_Y = POP_Y + POP_H;

type Phase = "idle" | "hovering" | "open";
const TIMELINE: Timeline<Phase> = { hovering: 0, open: 500 };

const cursorFrames = {
  idle: { target: { x: 222, y: 186 }, opacity: 0 },
  hovering: { target: { x: CX - 2, y: TRIGGER_Y + CLOSED_SHIFT + TRIGGER_H / 2 } },
  open: { target: { x: CX - 2, y: TRIGGER_Y + TRIGGER_H / 2 } },
} satisfies Record<Phase, CursorFrame>;

export function PopoverAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const open = phase === "open";
  const reveal = (ms: number) => ({ opacity: open ? 1 : 0, ...delay(open ? ms : 0) });

  return (
    <PreviewFrame ref={ref}>
      <g style={{ transform: `translateY(${open ? 0 : CLOSED_SHIFT}px)` }}>
        <g style={{ ...reveal(100), transform: `translateY(${open ? 0 : 6}px)` }}>
          <Box x={POP_X} y={POP_Y} w={POP_W} h={POP_H} rx={8} />
          <path d={`M ${CX - 9} ${TAIL_Y - 1} l 9 7 l 9 -7 Z`} className={role.surface} fill="currentColor" />
          <path
            d={`M ${CX - 9} ${TAIL_Y} l 9 7 l 9 -7`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            className={role.border}
          />
          <Bar x={POP_X + 14} y={POP_Y + 14} w={80} />
          <Box x={POP_X + POP_W - 30} y={POP_Y + 10} w={16} h={16} rx={4} />
          <Bar x={POP_X + 14} y={POP_Y + 36} w={POP_W - 28} h={1} rx={0} className={role.border} />
          <Bar x={POP_X + 14} y={POP_Y + 48} w={190} style={reveal(220)} />
          <Bar x={POP_X + 14} y={POP_Y + 62} w={150} style={reveal(300)} />
          <g style={reveal(360)}>
            <Box x={POP_X + POP_W - 80} y={POP_Y + 74} w={66} h={18} rx={4} fill={role.tint} stroke={role.active} />
            <Bar x={POP_X + POP_W - 69} y={POP_Y + 79} w={44} className={role.active} />
          </g>
        </g>
        <Box x={TRIGGER_X} y={TRIGGER_Y} w={TRIGGER_W} h={TRIGGER_H} rx={6} stroke={tone(on, "border")} />
        <Bar x={TRIGGER_X + 20} y={TRIGGER_Y + 18} w={70} className={tone(on)} />
        <path
          d={open ? `M ${CHEVRON_X} ${TRIGGER_Y + 25} l 6 -6 l 6 6` : `M ${CHEVRON_X} ${TRIGGER_Y + 19} l 6 6 l 6 -6`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={tone(on)}
        />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
