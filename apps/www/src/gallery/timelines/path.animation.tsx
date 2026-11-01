"use client";

import { Bar, Box, CX, CY, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const ITEM_H = 26;
const Y = CY - ITEM_H / 2;
const CHEVRON_W = 8;
const GAP = 14;
const SEGMENT = GAP * 2 + CHEVRON_W;
const ITEM_W = [68, 80, 72];
const TWO_W = ITEM_W[0] + SEGMENT + ITEM_W[1];
const START_X = CX - (TWO_W + SEGMENT + ITEM_W[2]) / 2;
const SHIFT = CX - TWO_W / 2 - START_X;
const ITEM_X = [START_X, START_X + ITEM_W[0] + SEGMENT, START_X + TWO_W + SEGMENT];

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Crumb({ i, active = false }: { i: number; active?: boolean }) {
  return (
    <>
      <Box x={ITEM_X[i]} y={Y} w={ITEM_W[i]} h={ITEM_H} rx={4} fill={active ? role.tint : role.surface} stroke={tone(active, "border")} />
      <Bar x={ITEM_X[i] + 8} y={CY - 3} w={ITEM_W[i] - 16} h={6} className={tone(active)} />
    </>
  );
}

function Chevron({ x, active = false }: { x: number; active?: boolean }) {
  return (
    <path
      d={`M ${x} ${CY - 5} l 5 5 l -5 5`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={tone(active)}
    />
  );
}

export function PathAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      <g style={{ transform: `translateX(${on ? 0 : SHIFT}px)`, transition: motion.spring }}>
        <Crumb i={0} />
        <Chevron x={ITEM_X[1] - GAP - CHEVRON_W / 2} />
        <Crumb i={1} />
      </g>
      <g style={{ transform: `translateX(${on ? 0 : 20}px)`, opacity: on ? 1 : 0, transition: motion.spring }}>
        <Chevron x={ITEM_X[2] - GAP - CHEVRON_W / 2} active />
        <Ring x={ITEM_X[2]} y={Y} w={ITEM_W[2]} h={ITEM_H} rx={4} show />
        <Crumb i={2} active />
      </g>
    </PreviewFrame>
  );
}
