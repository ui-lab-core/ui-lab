"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const TRIGGER_W = 200;
const TRIGGER_H = 44;
const X = CX - TRIGGER_W / 2;
const Y = CY - TRIGGER_H / 2;
const ITEM_H = 36;
const ITEM_GAP = 4;
const PAD = 6;
const LIST_H = ITEM_H * 3 + ITEM_GAP * 2 + PAD * 2;
const LIST_Y = Y + TRIGGER_H + 8;
const OPEN_SHIFT = -((TRIGGER_H + 8 + LIST_H) / 2 - TRIGGER_H / 2);
const CHEVRON_X = X + TRIGGER_W - 20;
const OPTION_Y = LIST_Y + PAD + ITEM_H + ITEM_GAP + ITEM_H / 2 + OPEN_SHIFT;

type Phase = "idle" | "hover_trigger" | "open" | "hover_option" | "selecting" | "selected";
const TIMELINE: Timeline<Phase> = {
  hover_trigger: 0,
  open: 600,
  hover_option: 1400,
  selecting: 2200,
  selected: 2500,
};

const OPEN_PHASES: Phase[] = ["open", "hover_option", "selecting"];

const cursorFrames = {
  idle: { target: { x: 280, y: 250 }, opacity: 0 },
  hover_trigger: { target: { x: X + TRIGGER_W - 30, y: CY } },
  open: { target: { x: X + TRIGGER_W - 30, y: CY + OPEN_SHIFT }, scale: 0.9 },
  hover_option: { target: { x: CX, y: OPTION_Y } },
  selecting: { target: { x: CX, y: OPTION_Y }, scale: 0.9 },
  selected: { target: { x: 350, y: 300 }, opacity: 0 },
} satisfies Record<Phase, CursorFrame>;

export function SelectAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const open = OPEN_PHASES.includes(phase);
  const selected = phase === "selected";
  const hovering = phase === "hover_option" || phase === "selecting";

  return (
    <PreviewFrame ref={ref}>
      <g style={{ transform: `translateY(${open ? OPEN_SHIFT : 0}px)`, transition: motion.spring }}>
        <Box x={X} y={Y} w={TRIGGER_W} h={TRIGGER_H} stroke={tone(open, "border")} />
        <Bar x={X + 16} y={Y + 16} w={selected ? 100 : 80} h={12} className={tone(selected)} />
        <path
          d={`M ${CHEVRON_X - 4} ${Y + 20} l 4 4 l 4 -4`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={tone(open)}
          style={{ transform: `rotate(${open ? 180 : 0}deg)`, transformOrigin: `${CHEVRON_X}px ${Y + 22}px` }}
        />
        <g style={{ opacity: open ? 1 : 0, transform: `translateY(${open ? 0 : -10}px)` }}>
          <Box x={X} y={LIST_Y} w={TRIGGER_W} h={LIST_H} />
          {[0, 1, 2].map((i) => {
            const itemY = LIST_Y + PAD + i * (ITEM_H + ITEM_GAP);
            const on = hovering && i === 1;
            return (
              <g key={i}>
                <Bar x={X + PAD} y={itemY} w={TRIGGER_W - PAD * 2} h={ITEM_H} rx={6} className={role.tint} style={{ opacity: on ? 1 : 0 }} />
                <Bar x={X + PAD + 12} y={itemY + 13} w={80 + i * 20} h={10} className={tone(on)} />
              </g>
            );
          })}
        </g>
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
