"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const ROW_X = 70;
const ROW_W = 260;
const ROW_H = 56;
const START_Y = 50;
const STEP = ROW_H + 20;
const BOX = 20;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

type Mark = "checked" | "mixed" | "none";

function Row({ y, mark, active, visible = true }: { y: number; mark: Mark; active: boolean; visible?: boolean }) {
  const filled = active && mark === "checked";
  return (
    <g style={{ transform: `translateY(${y}px)`, opacity: visible ? 1 : 0 }}>
      <Ring x={ROW_X} y={0} w={ROW_W} h={ROW_H} show={active} />
      <Box x={ROW_X} y={0} w={ROW_W} h={ROW_H} stroke={role.active} style={{ opacity: active ? 1 : 0 }} />
      <Box
        x={ROW_X + 10}
        y={18}
        w={BOX}
        h={BOX}
        rx={4}
        fill={filled ? role.active : role.surface}
        stroke={tone(active)}
      />
      <g className={filled ? role.surface : role.muted}>
        <path
          d={`M ${ROW_X + 16} 28 l 3 3 l 6 -6`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: mark === "checked" ? 1 : 0 }}
        />
        <path
          d={`M ${ROW_X + 15} 28 h 10`}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          style={{ opacity: mark === "mixed" ? 1 : 0 }}
        />
      </g>
      <Bar x={ROW_X + 46} y={22} w={active ? 120 : 90} className={tone(active)} />
      <Bar x={ROW_X + 46} y={34} w={active ? 80 : 60} h={4} />
    </g>
  );
}

export function CheckboxAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const shift = on ? -STEP : 0;
  const activeY = START_Y + STEP * 2 + shift;

  const cursorFrames = {
    idle: { target: { x: 240, y: 220 }, opacity: 0, rotate: 15 },
    hover: { target: { x: 90, y: activeY + 28 }, rotate: -15 },
  } satisfies Record<Phase, CursorFrame>;

  return (
    <PreviewFrame ref={ref}>
      <Row y={START_Y + shift} mark="checked" active={false} visible={!on} />
      <Row y={START_Y + STEP + shift} mark="mixed" active={false} />
      <Row y={activeY} mark={on ? "checked" : "none"} active={on} />
      <Row y={START_Y + STEP * 3 + shift} mark="none" active={false} visible={on} />

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
