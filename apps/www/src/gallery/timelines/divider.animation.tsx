"use client";

import { Bar, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

const BASE_Y = 130;
const STEP = 80;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function TextBlock({ y, visible = true }: { y: number; visible?: boolean }) {
  return (
    <g style={{ transform: `translateY(${y}px)`, opacity: visible ? 1 : 0 }}>
      <Bar x={80} y={-12} w={140} />
      <Bar x={80} y={4} w={100} />
    </g>
  );
}

function Divider({ y, active, visible = true }: { y: number; active: boolean; visible?: boolean }) {
  const [x1, x2] = active ? [60, 340] : [80, 320];
  return (
    <g className={tone(active, "border")} style={{ transform: `translateY(${y}px)`, opacity: visible ? 1 : 0 }}>
      <line
        x1={x1}
        x2={x2}
        y1={0}
        y2={0}
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray={active ? "6 4" : "400 0"}
      />
      {[x1, x2].map((cx, i) => (
        <circle key={i} cx={cx} cy={0} r={active ? 3.5 : 1.5} fill="currentColor" />
      ))}
    </g>
  );
}

export function DividerAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const y1 = BASE_Y - (on ? STEP : 0);
  const y2 = y1 + STEP;

  return (
    <PreviewFrame ref={ref}>
      <TextBlock y={y1 - STEP / 2} visible={!on} />
      <Divider y={y1} active={false} visible={!on} />
      <TextBlock y={y1 + STEP / 2} />
      <Divider y={y2} active={on} />
      <TextBlock y={y2 + STEP / 2} visible={on} />
      <g style={{ transform: `translateY(${y2}px)` }}>
        <Ring x={55} y={-4} w={290} h={8} rx={4} show={on} />
      </g>
    </PreviewFrame>
  );
}
