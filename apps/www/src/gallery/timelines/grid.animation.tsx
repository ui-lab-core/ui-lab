"use client";

import { Bar, Box, delay, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

type Cell = { x: number; y: number; w: number; h: number };

const CELLS: { idle: Cell; hover: Cell; lag: number }[] = [
  { idle: { x: 60, y: 60, w: 180, h: 80 }, hover: { x: 60, y: 60, w: 80, h: 180 }, lag: 0 },
  { idle: { x: 260, y: 60, w: 80, h: 180 }, hover: { x: 160, y: 60, w: 180, h: 80 }, lag: 50 },
  { idle: { x: 60, y: 160, w: 80, h: 80 }, hover: { x: 160, y: 160, w: 80, h: 80 }, lag: 0 },
  { idle: { x: 160, y: 160, w: 80, h: 80 }, hover: { x: 260, y: 160, w: 80, h: 80 }, lag: 0 },
];

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

export function GridAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      {CELLS.map((cell, i) => {
        const { x, y, w, h } = cell[phase];
        const wide = w > h;
        const active = i === 1 && on;
        return (
          <g key={i} style={delay(cell.lag)}>
            {i === 1 && <Ring x={x} y={y} w={w} h={h} show={on} />}
            <Box x={x} y={y} w={w} h={h} stroke={tone(active, "border")} />
            {i < 2 && (
              <g style={{ opacity: wide ? 1 : 0 }}>
                <Bar x={x + 20} y={y + 20} w={wide ? 140 : 40} className={tone(active)} />
                <Bar x={x + 20} y={y + 40} w={wide ? 80 : 20} className={tone(active)} />
              </g>
            )}
          </g>
        );
      })}
    </PreviewFrame>
  );
}
