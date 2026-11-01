"use client";

import { Bar, Box, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const X = 45;
const Y = 119;
const BANNER_W = 310;
const BANNER_H = 62;
const ICON_X = 68;
const ICON_Y = 133;
const CONTENT_X = ICON_X + 19;
const DISMISS_X = X + BANNER_W - 22;
const DISMISS_Y = Y + 7;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

export function BannerAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      <Ring x={X} y={Y} w={BANNER_W} h={BANNER_H} show={on} />
      <Box x={X} y={Y} w={BANNER_W} h={BANNER_H} stroke={tone(on, "border")} />
      <circle cx={ICON_X} cy={ICON_Y} r={9} className={on ? role.tint : role.border} fill="currentColor" />
      <g className={tone(on)}>
        <circle cx={ICON_X} cy={ICON_Y - 2.5} r={1.4} fill="currentColor" />
        <path d={`M ${ICON_X} ${ICON_Y + 2} v 2`} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      </g>
      <Bar x={CONTENT_X} y={Y + 12} w={on ? 110 : 80} className={tone(on)} />
      <Bar x={CONTENT_X} y={Y + 28} w={on ? 168 : 124} h={6} />
      <Bar x={CONTENT_X} y={Y + 40} w={on ? 118 : 86} h={6} />
      <g style={{ opacity: on ? 1 : 0 }}>
        <Bar x={DISMISS_X} y={DISMISS_Y} w={14} h={14} rx={3} className={role.border} />
        <path
          d={`M ${DISMISS_X + 4} ${DISMISS_Y + 4} l 6 6 m 0 -6 l -6 6`}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className={role.muted}
        />
      </g>
    </PreviewFrame>
  );
}
