"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, delay, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const BTN_H = 48;
const Y = CY - BTN_H / 2;
const TRASH_W = 130;
const TRASH_X = CX - TRASH_W / 2;
const CANCEL_W = 110;
const CONFIRM_W = 148;
const GAP = 20;
const CANCEL_X = CX - (CANCEL_W + CONFIRM_W + GAP) / 2;
const CONFIRM_X = CANCEL_X + CANCEL_W + GAP;

type Phase = "idle" | "hovering" | "clicking_trash" | "confirming";
const TIMELINE: Timeline<Phase> = { hovering: 0, clicking_trash: 500, confirming: 800 };

const cursorFrames = {
  idle: { target: { x: 250, y: 220 }, opacity: 0 },
  hovering: { target: { x: CX, y: CY } },
  clicking_trash: { target: { x: CX, y: CY }, scale: 0.85 },
  confirming: { target: { x: CONFIRM_X + CONFIRM_W / 2, y: CY } },
} satisfies Record<Phase, CursorFrame>;

export function ConfirmAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const confirming = phase === "confirming";
  const trashOn = phase === "hovering" || phase === "clicking_trash";

  return (
    <PreviewFrame ref={ref}>
      <defs>
        <clipPath id="confirm-clip">
          <rect x={CONFIRM_X} y={Y} width={CONFIRM_W} height={BTN_H} rx={10} />
        </clipPath>
      </defs>
      <g
        style={{
          opacity: confirming ? 0 : 1,
          transform: `translateY(${confirming ? -40 : phase === "idle" ? 0 : 2}px)`,
        }}
      >
        <Box x={TRASH_X} y={Y} w={TRASH_W} h={BTN_H} stroke={tone(trashOn, "border")} />
        <Bar x={TRASH_X + 12} y={Y + 18} w={12} h={12} className={tone(trashOn)} />
        <Bar x={TRASH_X + 30} y={Y + 20} w={58} className={tone(trashOn)} />
      </g>
      <g
        style={{
          opacity: confirming ? 1 : 0,
          transform: `translateY(${confirming ? 2 : 20}px)`,
          ...delay(confirming ? 300 : 0),
        }}
      >
        <Box x={CANCEL_X} y={Y} w={CANCEL_W} h={BTN_H} />
        <Bar x={CANCEL_X + (CANCEL_W - 40) / 2} y={Y + 20} w={40} />
        <Ring x={CONFIRM_X} y={Y} w={CONFIRM_W} h={BTN_H} show />
        <Box x={CONFIRM_X} y={Y} w={CONFIRM_W} h={BTN_H} stroke={role.active} />
        <rect
          x={CONFIRM_X}
          y={Y}
          width={confirming ? CONFIRM_W : 0}
          height={BTN_H}
          clipPath="url(#confirm-clip)"
          className={role.tint}
          fill="currentColor"
          style={confirming ? { transition: motion.long, transitionDelay: "800ms" } : { transition: "none" }}
        />
        <Bar x={CONFIRM_X + (CONFIRM_W - 46) / 2} y={Y + 20} w={46} className={role.active} />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
