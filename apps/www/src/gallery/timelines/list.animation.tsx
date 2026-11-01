"use client";

import { Bar, Box, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const ROW_X = 70;
const ROW_W = 260;
const ROW_H = 56;
const START_Y = 50;
const STEP = ROW_H + 20;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Row({ y, active = false, visible = true }: { y: number; active?: boolean; visible?: boolean }) {
  return (
    <g style={{ transform: `translateY(${y}px)`, opacity: visible ? 1 : 0 }}>
      <Ring x={ROW_X} y={0} w={ROW_W} h={ROW_H} show={active} />
      <Box x={ROW_X} y={0} w={ROW_W} h={ROW_H} stroke={role.active} style={{ opacity: active ? 1 : 0 }} />
      <Bar x={78} y={8} w={40} h={40} className={tone(active, "border")} />
      <Bar x={134} y={16} w={active ? 144 : 108} className={tone(active)} />
      <Bar x={134} y={30} w={active ? 96 : 72} h={6} />
    </g>
  );
}

export function ListAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const shift = on ? -STEP : 0;

  return (
    <PreviewFrame ref={ref}>
      <Row y={START_Y + shift} visible={!on} />
      <Row y={START_Y + STEP + shift} />
      <Row y={START_Y + STEP * 2 + shift} active={on} />
      <Row y={START_Y + STEP * 3 + shift} visible={on} />
    </PreviewFrame>
  );
}
