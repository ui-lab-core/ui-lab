"use client";

import { Bar, CX, CY, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const TRACK_W = 200;
const TRACK_H = 10;
const X = CX - TRACK_W / 2;
const Y = CY - TRACK_H / 2;
const LABEL_Y = Y - 20;
const CHECK_X = X + TRACK_W + 18;

type Phase = "idle" | "filling" | "done";
const TIMELINE: Timeline<Phase> = { filling: 0, done: 1050 };

const PROGRESS: Record<Phase, number> = { idle: 0.28, filling: 0.66, done: 1 };

export function ProgressAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const done = phase === "done";

  return (
    <PreviewFrame ref={ref}>
      <Bar x={X} y={LABEL_Y} w={72} h={7} />
      <Bar x={X + TRACK_W - 28} y={LABEL_Y} w={28} h={7} className={tone(done)} style={{ opacity: on ? 1 : 0 }} />
      <Bar x={X} y={Y} w={TRACK_W} h={TRACK_H} rx={5} className={role.border} />
      <Bar
        x={X}
        y={Y}
        w={TRACK_W * PROGRESS[phase]}
        h={TRACK_H}
        rx={5}
        className={tone(on)}
        style={{ transition: motion.slow }}
      />
      <g className={role.active} style={{ opacity: done ? 1 : 0, transitionDelay: done ? "150ms" : "0ms" }}>
        <circle cx={CHECK_X} cy={CY} r={10} className={role.tint} fill="currentColor" />
        <path
          d={`M ${CHECK_X - 5} ${CY + 0.5} l 4 4 l 7 -8.5`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </PreviewFrame>
  );
}
