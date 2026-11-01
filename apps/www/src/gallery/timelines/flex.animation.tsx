"use client";

import { Bar, Box, delay, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

const Y = 60;
const BLOCK_H = 180;

const BLOCKS = [
  { idle: { x: 60, w: 80 }, hover: { x: 60, w: 160 }, delay: { idle: 0, hover: 100 } },
  { idle: { x: 160, w: 80 }, hover: { x: 240, w: 40 }, delay: { idle: 50, hover: 50 } },
  { idle: { x: 260, w: 80 }, hover: { x: 300, w: 40 }, delay: { idle: 100, hover: 0 } },
];

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

export function FlexAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      {BLOCKS.map((block, i) => {
        const { x, w } = block[phase];
        const lead = i === 0;
        return (
          <g key={i} style={delay(block.delay[phase])}>
            {lead && <Ring x={x} y={Y} w={w} h={BLOCK_H} show={on} />}
            <Box x={x} y={Y} w={w} h={BLOCK_H} stroke={tone(lead && on, "border")} />
            <g style={{ opacity: lead ? 1 : 0 }}>
              <Bar x={x + 12} y={Y + 20} w={on ? 100 : 36} className={tone(on)} />
              <Bar x={x + 12} y={Y + 36} w={on ? 60 : 20} className={tone(on)} />
            </g>
          </g>
        );
      })}
    </PreviewFrame>
  );
}
