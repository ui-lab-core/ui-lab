"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const ROW_X = 70;
const ROW_W = 260;
const ROW_H = 56;
const START_Y = 94;
const STEP = ROW_H + 20;
const DOT_X = ROW_X + 20;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Row({ y, selected, active = false, visible = true }: { y: number; selected: boolean; active?: boolean; visible?: boolean }) {
  return (
    <g style={{ transform: `translateY(${y}px)`, opacity: visible ? 1 : 0 }}>
      <Ring x={ROW_X} y={0} w={ROW_W} h={ROW_H} show={active} />
      <Box x={ROW_X} y={0} w={ROW_W} h={ROW_H} stroke={role.active} style={{ opacity: active ? 1 : 0 }} />
      <circle cx={DOT_X} cy={28} r={10} className={role.surface} fill="currentColor" />
      <circle cx={DOT_X} cy={28} r={10} className={tone(active)} fill="none" stroke="currentColor" strokeWidth={2} />
      <circle
        cx={DOT_X}
        cy={28}
        r={5}
        className={tone(active)}
        fill="currentColor"
        style={{
          opacity: selected ? 1 : 0,
          transform: `scale(${selected ? 1 : 0.2})`,
          transformOrigin: `${DOT_X}px 28px`,
          transition: motion.spring,
        }}
      />
      <Bar x={ROW_X + 46} y={22} w={active ? 120 : 90} className={tone(active)} />
      <Bar x={ROW_X + 46} y={34} w={active ? 80 : 60} h={4} />
    </g>
  );
}

export function RadioAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const shift = on ? -STEP : 0;
  const activeY = START_Y + STEP * 2 + shift;

  const cursorFrames = {
    idle: { target: { x: 240, y: 240 }, opacity: 0, rotate: 15 },
    hover: { target: { x: 90, y: activeY + 28 }, rotate: -15 },
  } satisfies Record<Phase, CursorFrame>;

  return (
    <PreviewFrame ref={ref}>
      <Row y={START_Y + shift} selected visible={!on} />
      <Row y={START_Y + STEP + shift} selected={false} />
      <Row y={activeY} selected={on} active={on} visible={on} />

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
