"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, delay, H, PreviewFrame, useTimeline, W, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const CARD_W = 200;
const CARD_H = 126;
const CARD_X = (W - CARD_W) / 2;
const CARD_Y = (H - CARD_H) / 2 - 4;
const CARD_HEADER = 36;
const CARD_FOOTER = 34;
const AVATAR_Y = CARD_Y + CARD_HEADER / 2;
const BTN_W = 66;
const BTN_H = 18;
const BTN_X = CARD_X + CARD_W - BTN_W - 9;
const BTN_Y = CARD_Y + CARD_H - CARD_FOOTER + (CARD_FOOTER - BTN_H) / 2;

const MODAL_W = 252;
const MODAL_H = 172;
const MODAL_X = (W - MODAL_W) / 2;
const MODAL_Y = (H - MODAL_H) / 2 - 20;
const MODAL_HEADER = 30;
const MODAL_FOOTER_Y = MODAL_Y + MODAL_H - 36;

type Phase = "idle" | "hovering" | "open";
const TIMELINE: Timeline<Phase> = { hovering: 0, open: 500 };

const cursorFrames = {
  idle: { target: { x: BTN_X + BTN_W + 44, y: BTN_Y + BTN_H + 32 }, opacity: 0 },
  hovering: { target: { x: BTN_X + BTN_W / 2, y: BTN_Y + BTN_H / 2 } },
  open: { target: { x: MODAL_X + MODAL_W - 16, y: MODAL_Y + MODAL_HEADER / 2 } },
} satisfies Record<Phase, CursorFrame>;

export function ModalAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const open = phase === "open";
  const reveal = (ms: number) => ({ opacity: open ? 1 : 0, ...delay(open ? ms : 0) });

  return (
    <PreviewFrame ref={ref}>
      <Box x={CARD_X} y={CARD_Y} w={CARD_W} h={CARD_H} rx={5} />
      <Bar x={CARD_X} y={CARD_Y + CARD_HEADER} w={CARD_W} h={1} rx={0} className={role.border} />
      <Bar x={CARD_X} y={CARD_Y + CARD_H - CARD_FOOTER} w={CARD_W} h={1} rx={0} className={role.border} />
      <circle cx={CARD_X + 22} cy={AVATAR_Y} r={10} className={role.border} fill="currentColor" />
      <Bar x={CARD_X + 41} y={AVATAR_Y - 7} w={76} h={7} />
      <Bar x={CARD_X + 41} y={AVATAR_Y + 3} w={50} h={5} />
      <Bar x={CARD_X + 14} y={CARD_Y + CARD_HEADER + 14} w={152} h={6} />
      <Bar x={CARD_X + 14} y={CARD_Y + CARD_HEADER + 28} w={128} h={5} />
      <Bar x={CARD_X + 14} y={CARD_Y + CARD_HEADER + 40} w={96} h={5} />
      <Box x={CARD_X + 9} y={BTN_Y} w={44} h={BTN_H} rx={4} />
      <Box x={CARD_X + 60} y={BTN_Y} w={44} h={BTN_H} rx={4} />
      <Box x={BTN_X} y={BTN_Y} w={BTN_W} h={BTN_H} rx={4} stroke={tone(on, "border")} />
      <Bar x={BTN_X + 13} y={BTN_Y + 6} w={40} h={6} className={tone(on)} />

      <rect width={W} height={H} className={role.surface} fill="currentColor" style={{ opacity: open ? 0.8 : 0 }} />
      <g style={reveal(50)}>
        <Box x={MODAL_X} y={MODAL_Y} w={MODAL_W} h={MODAL_H} rx={5} />
        <Bar x={MODAL_X} y={MODAL_Y + MODAL_HEADER} w={MODAL_W} h={1} rx={0} className={role.border} />
        <Bar x={MODAL_X} y={MODAL_FOOTER_Y} w={MODAL_W} h={1} rx={0} className={role.border} />
        <Bar x={MODAL_X + 12} y={MODAL_Y + 11} w={66} h={8} className={role.text} style={reveal(180)} />
        <path
          d={`M ${MODAL_X + MODAL_W - 21} ${MODAL_Y + 10} l 10 10 m 0 -10 l -10 10`}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className={role.muted}
          style={reveal(200)}
        />
        <Bar x={MODAL_X + 12} y={MODAL_Y + MODAL_HEADER + 16} w={162} h={8} style={reveal(260)} />
        <Bar x={MODAL_X + 12} y={MODAL_Y + MODAL_HEADER + 30} w={196} h={6} style={reveal(310)} />
        <Bar x={MODAL_X + 12} y={MODAL_Y + MODAL_HEADER + 42} w={134} h={6} style={reveal(350)} />
        <g style={reveal(400)}>
          <Box x={MODAL_X + MODAL_W - 134} y={MODAL_FOOTER_Y + 10} w={56} h={16} rx={4} />
          <Bar x={MODAL_X + MODAL_W - 124} y={MODAL_FOOTER_Y + 15} w={36} h={6} />
        </g>
        <g style={reveal(440)}>
          <Box x={MODAL_X + MODAL_W - 66} y={MODAL_FOOTER_Y + 10} w={54} h={16} rx={4} fill={role.tint} stroke={role.active} />
          <Bar x={MODAL_X + MODAL_W - 55} y={MODAL_FOOTER_Y + 15} w={32} h={6} className={role.active} />
        </g>
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
