"use client";

import { Bar, Box, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const X = 105;
const INPUT_W = 190;
const INPUT_H = 40;
const INPUT_Y = 128;
const LABEL_Y = 112;
const LABEL_W = 62;
const HELPER_Y = 176;
const ASTERISK_X = X + LABEL_W + 8;

type Phase = "idle" | "required" | "error";
const TIMELINE: Timeline<Phase> = { required: 0, error: 700 };

export function LabelAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase !== "idle";
  const error = phase === "error";

  return (
    <PreviewFrame ref={ref}>
      <Bar x={X} y={LABEL_Y} w={LABEL_W} className={tone(error)} />
      <circle
        cx={ASTERISK_X}
        cy={LABEL_Y + 4}
        r={3.5}
        className={role.active}
        fill="currentColor"
        style={{ transform: `scale(${on ? 1 : 0})`, transformOrigin: `${ASTERISK_X}px ${LABEL_Y + 4}px` }}
      />
      <Box x={X} y={INPUT_Y} w={INPUT_W} h={INPUT_H} fill={error ? role.tint : role.surface} stroke={tone(error, "border")} />
      <Bar x={X + 12} y={INPUT_Y + 16} w={70} />
      <Bar x={X + 90} y={INPUT_Y + 12} w={2} h={16} rx={1} className={tone(error)} style={{ opacity: on ? 1 : 0 }} />
      <Bar
        x={X}
        y={HELPER_Y}
        w={108}
        h={6}
        className={role.active}
        style={{ opacity: error ? 1 : 0, transform: `translateY(${error ? 0 : -6}px)` }}
      />
    </PreviewFrame>
  );
}
