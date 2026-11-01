"use client";

import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const X = 80;
const Y = 118;
const BAR_W = 240;
const TAB_H = 36;
const TAB_W = BAR_W / 3;
const TARGET_X = X + TAB_W * 1.5;
const TARGET_Y = Y + TAB_H / 2;

type Phase = "idle" | "hovering" | "clicking" | "active";
const TIMELINE: Timeline<Phase> = { hovering: 0, clicking: 500, active: 700 };

const cursorFrames = {
  idle: { target: { x: X + BAR_W + 50, y: Y + TAB_H + 40 }, opacity: 0 },
  hovering: { target: { x: TARGET_X, y: TARGET_Y } },
  clicking: { target: { x: TARGET_X, y: TARGET_Y }, scale: 0.82 },
  active: { target: { x: TARGET_X, y: TARGET_Y } },
} satisfies Record<Phase, CursorFrame>;

export function TabsAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const active = phase === "active";
  const selected = active ? 1 : 0;

  return (
    <PreviewFrame ref={ref}>
      <Bar x={X} y={Y + TAB_H} w={BAR_W} h={1} rx={0} className={role.border} />
      {[0, 1, 2].map((i) => (
        <Bar key={i} x={X + TAB_W * i + 12} y={Y + 13} w={56} className={tone(i === selected)} />
      ))}
      <Bar
        x={X}
        y={Y + TAB_H - 2}
        w={TAB_W}
        h={2}
        rx={1}
        className={role.active}
        style={{ transform: `translateX(${selected * TAB_W}px)` }}
      />
      <Ring x={X + TAB_W + 2} y={Y + 4} w={TAB_W - 4} h={TAB_H - 4} rx={4} show={active} />
      <Bar x={X} y={Y + TAB_H + 20} w={active ? 110 : 160} h={6} />
      <Bar x={X} y={Y + TAB_H + 36} w={active ? 80 : 100} h={6} />

      <CursorProvider phase={phase} frames={cursorFrames} motion="delayed" hotspot={{ x: 5, y: 4 }}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
