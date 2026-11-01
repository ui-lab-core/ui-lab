"use client";

import { Bar, Box, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const X = 86;
const Y = 72;
const CHART_W = 228;
const CHART_H = 150;
const PLOT_X = X + 28;
const PLOT_Y = Y + 30;
const PLOT_W = CHART_W - 48;
const BASELINE = PLOT_Y + CHART_H - 54;
const BAR_W = 16;
const BAR_HEIGHTS = [42, 68, 54, 86, 62, 76];
const LINE_HEIGHTS = [38, 58, 50, 78, 66, 84];
const barX = (i: number) => PLOT_X + 18 + i * (BAR_W + 12);
const POINTS = LINE_HEIGHTS.map((h, i) => `${barX(i) + BAR_W / 2},${BASELINE - h}`).join(" ");

type Phase = "idle" | "bars" | "line" | "done";
const TIMELINE: Timeline<Phase> = { bars: 0, line: 520, done: 1350 };

export function ChartAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const line = phase === "line" || phase === "done";
  const done = phase === "done";

  return (
    <PreviewFrame ref={ref}>
      <Box x={X} y={Y} w={CHART_W} h={CHART_H} />
      <Bar x={X + 18} y={Y + 16} w={66} h={6} className={tone(on)} />
      <Bar x={X + CHART_W - 68} y={Y + 16} w={18} h={6} />
      <Bar x={X + CHART_W - 42} y={Y + 16} w={20} h={6} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${PLOT_X} ${PLOT_Y + i * 32} h ${PLOT_W}`}
          stroke="currentColor"
          strokeDasharray="4 6"
          className={role.border}
        />
      ))}
      <path
        d={`M ${PLOT_X} ${PLOT_Y} V ${BASELINE} h ${PLOT_W}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className={role.border}
      />
      {BAR_HEIGHTS.map((h, i) => (
        <Bar
          key={h}
          x={barX(i)}
          y={on ? BASELINE - h : BASELINE}
          w={BAR_W}
          h={on ? h : 0}
          rx={4}
          className={tone(on && i === 3)}
          style={{ transitionDelay: `${i * 55}ms` }}
        />
      ))}
      <polyline
        points={POINTS}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        className={tone(line)}
        style={{ strokeDashoffset: line ? 0 : 1, transition: motion.slow }}
      />
      {LINE_HEIGHTS.map((h, i) => (
        <circle
          key={i}
          cx={barX(i) + BAR_W / 2}
          cy={BASELINE - h}
          r={3}
          className={role.active}
          fill="currentColor"
          style={{ opacity: done ? 1 : 0, transitionDelay: `${i * 45}ms` }}
        />
      ))}
    </PreviewFrame>
  );
}
