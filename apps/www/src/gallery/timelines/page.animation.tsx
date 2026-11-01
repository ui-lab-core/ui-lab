"use client";

import { Bar, Box, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const X = 138;
const Y = 64;
const SHEET_W = 124;
const SHEET_H = 172;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Sheet({ active }: { active: boolean }) {
  return (
    <>
      <Box x={X} y={Y} w={SHEET_W} h={SHEET_H} stroke={tone(active, "border")} />
      <Bar x={X + 14} y={Y + 16} w={36} h={7} className={tone(active)} />
      <Bar x={X + 14} y={Y + 46} w={98} h={12} className={tone(active)} />
      <Bar x={X + 14} y={Y + 66} w={68} h={5} />
      <Box x={X + 14} y={Y + 86} w={98} h={66} rx={6} fill={active ? role.tint : role.surface} stroke={tone(active, "border")} />
    </>
  );
}

export function PageAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      {[-1, 0, 1].map((rel) => {
        const front = rel === 0;
        const lift = front ? (on ? -18 : -10) : on ? 2 : 0;
        return (
          <g
            key={rel}
            style={{
              transform: `translate(${rel * (on ? 34 : 16)}px, ${lift}px) rotate(${rel * (on ? 8 : 4)}deg)`,
              transformOrigin: "200px 320px",
              transition: motion.spring,
            }}
          >
            <Sheet active={front && on} />
          </g>
        );
      })}
    </PreviewFrame>
  );
}
