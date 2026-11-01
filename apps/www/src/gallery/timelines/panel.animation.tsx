"use client";

import { Bar, Box, delay, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

const X = 60;
const Y = 60;
const TOTAL_W = 280;
const TOTAL_H = 180;
const GAP = 20;
const BOTTOM_GAP = 8;
const BOTTOM_H = 44;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

export function PanelAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const sideW = on ? 80 : 32;
  const contentX = X + sideW + GAP;
  const contentW = TOTAL_W - sideW - GAP;
  const mainH = on ? TOTAL_H - BOTTOM_H - BOTTOM_GAP : TOTAL_H;

  return (
    <PreviewFrame ref={ref}>
      <Ring x={X} y={Y} w={sideW} h={TOTAL_H} show={on} />
      <Box x={X} y={Y} w={sideW} h={TOTAL_H} stroke={tone(on, "border")} />
      <Bar x={X + sideW / 2 - 4} y={80} w={8} h={8} style={{ opacity: on ? 0 : 1 }} />
      {[0, 1, 2, 3].map((i) => (
        <Bar
          key={i}
          x={75}
          y={80 + i * 24}
          w={50}
          className={tone(on)}
          style={{ opacity: on ? 1 : 0, ...delay(on ? 400 + i * 60 : 0) }}
        />
      ))}
      <Box x={contentX} y={Y} w={contentW} h={mainH} />
      <g style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 15}px)`, ...delay(on ? 150 : 0) }}>
        <Box x={contentX} y={Y + mainH + BOTTOM_GAP} w={contentW} h={BOTTOM_H} />
        <Bar x={contentX + 15} y={Y + mainH + BOTTOM_GAP + 18} w={40} />
      </g>
    </PreviewFrame>
  );
}
