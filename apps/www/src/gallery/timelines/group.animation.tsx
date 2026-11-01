"use client";

import { Bar, CX, PreviewFrame, Ring, RADIUS, STROKE, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const Y = 130;
const ITEM_W = 100;
const ITEM_H = 40;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

const segment = (x: number, l: number, r: number) =>
  `M ${x + l} ${Y} H ${x + ITEM_W - r} Q ${x + ITEM_W} ${Y} ${x + ITEM_W} ${Y + r} V ${Y + ITEM_H - r} Q ${x + ITEM_W} ${Y + ITEM_H} ${x + ITEM_W - r} ${Y + ITEM_H} H ${x + l} Q ${x} ${Y + ITEM_H} ${x} ${Y + ITEM_H - l} V ${Y + l} Q ${x} ${Y} ${x + l} ${Y} Z`;

function Segment({ x, l, r, stroke }: { x: number; l: number; r: number; stroke: string }) {
  const d = segment(x, l, r);
  return (
    <>
      <path d={d} className={role.surface} fill="currentColor" />
      <path d={d} className={stroke} fill="none" stroke="currentColor" strokeWidth={STROKE} />
    </>
  );
}

export function GroupAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const gap = on ? 0 : 12;
  const total = ITEM_W * 3 + gap * 2;
  const [left, middle, right] = [0, 1, 2].map((i) => CX - total / 2 + i * (ITEM_W + gap));
  const inner = on ? 0 : RADIUS;

  return (
    <PreviewFrame ref={ref}>
      <Ring x={left} y={Y} w={total} h={ITEM_H} show={on} />
      <Segment x={left} l={RADIUS} r={inner} stroke={tone(on, "border")} />
      <Segment x={middle} l={inner} r={inner} stroke={role.border} />
      <Segment x={right} l={inner} r={RADIUS} stroke={tone(on, "border")} />
      <Bar x={left + 20} y={Y + 16} w={60} className={tone(on)} />
      <Bar x={middle + 15} y={Y + 16} w={70} />
      <Bar x={middle + 15} y={Y + 12} w={2} h={16} rx={1} className={tone(on)} />
      <Bar x={right + 15} y={Y + 16} w={45} className={tone(on)} />
      <path
        d={`M ${right + ITEM_W - 25} ${Y + 16} l 5 5 l 5 -5`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={tone(on)}
      />
    </PreviewFrame>
  );
}
