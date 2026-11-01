"use client";

import { Bar, Box, delay, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const ROW_X = 70;
const ROW_W = 260;
const ROW_H = 56;
const START_Y = 50;
const STEP = ROW_H + 20;
const EXPAND_H = 60;
const CHEVRON_X = 305;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Row({ active = false, expanded = false }: { active?: boolean; expanded?: boolean }) {
  return (
    <>
      <Bar x={78} y={8} w={40} h={40} className={tone(active, "border")} />
      <Bar x={134} y={16} w={active ? 144 : 108} className={tone(active)} />
      <Bar x={134} y={30} w={active ? 96 : 72} h={6} />
      <polyline
        points={`${CHEVRON_X - 5},25 ${CHEVRON_X},31 ${CHEVRON_X + 5},25`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={tone(active)}
        style={{
          transform: `rotate(${expanded ? 180 : 0}deg)`,
          transformOrigin: `${CHEVRON_X}px 28px`,
        }}
      />
    </>
  );
}

export function ExpandAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const activeY = on ? START_Y : START_Y + STEP;
  const lag = delay(on ? 200 : 0);

  return (
    <PreviewFrame ref={ref}>
      <defs>
        <clipPath id="expand-clip">
          <rect x={0} y={ROW_H} width={400} style={{ height: on ? EXPAND_H : 0, ...lag }} />
        </clipPath>
      </defs>
      <g style={{ transform: `translateY(${on ? START_Y - STEP : START_Y}px)`, opacity: on ? 0 : 1 }}>
        <Row />
      </g>
      <g style={{ transform: `translateY(${activeY}px)` }}>
        <Ring x={ROW_X} y={0} w={ROW_W} h={on ? ROW_H + EXPAND_H : ROW_H} show={on} />
        <Box x={ROW_X} y={0} w={ROW_W} h={ROW_H} stroke={role.active} style={{ opacity: on ? 1 : 0 }} />
        <Row active={on} expanded={on} />
        <g clipPath="url(#expand-clip)" style={{ opacity: on ? 1 : 0, ...lag }}>
          <Bar x={80} y={71} w={180} h={6} />
          <Bar x={80} y={85} w={150} h={6} />
          <Bar x={80} y={99} w={120} h={6} />
        </g>
      </g>
      <g
        style={{
          transform: `translateY(${on ? activeY + ROW_H + EXPAND_H + 20 : START_Y + STEP * 2}px)`,
          opacity: on ? 1 : 0,
        }}
      >
        <Row />
      </g>
    </PreviewFrame>
  );
}
