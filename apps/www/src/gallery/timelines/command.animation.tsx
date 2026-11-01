"use client";

import { Bar, Box, CX, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const PALETTE_W = 224;
const HEADER_H = 44;
const ITEM_H = 48;
const LIST_PAD = 8;
const LIST_H = LIST_PAD + ITEM_H * 3;
const FOOTER_H = 34;
const TOTAL_H = HEADER_H + LIST_H + FOOTER_H;
const X = CX - PALETTE_W / 2;
const Y = 150 - TOTAL_H / 2;
const LIST_Y = Y + HEADER_H;
const FOOTER_Y = LIST_Y + LIST_H;
const SEARCH_Y = Y + HEADER_H / 2;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Item({ y, active }: { y: number; active: boolean }) {
  return (
    <g>
      <Box x={X + 6} y={y + 2} w={PALETTE_W - 12} h={ITEM_H - 6} rx={7} fill={role.tint} stroke={role.active} style={{ opacity: active ? 1 : 0 }} />
      <Bar x={X + 18} y={y + 13} w={20} h={20} className={tone(active)} />
      <Bar x={X + 46} y={y + 16} w={active ? 115 : 85} h={6} className={tone(active)} />
      <Bar x={X + 46} y={y + 26} w={active ? 77 : 57} h={4} />
    </g>
  );
}

export function CommandAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      <defs>
        <clipPath id="command-list">
          <rect x={X} y={LIST_Y} width={PALETTE_W} height={LIST_H} />
        </clipPath>
      </defs>
      <Ring x={X} y={Y} w={PALETTE_W} h={TOTAL_H} show={on} />
      <Box x={X} y={Y} w={PALETTE_W} h={TOTAL_H} stroke={tone(on, "border")} />

      <g className={tone(on)}>
        <circle cx={X + 21} cy={SEARCH_Y} r={7} fill="none" stroke="currentColor" strokeWidth={2} />
        <path d={`M ${X + 25} ${SEARCH_Y + 4} l 5 5`} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </g>
      <Bar x={X + 42} y={SEARCH_Y - 4} w={on ? 70 : 90} className={tone(on)} />
      <Bar
        x={on ? X + 116 : X + 42}
        y={SEARCH_Y - 8}
        w={2}
        h={16}
        rx={1}
        className={role.active}
        style={{ opacity: on ? 1 : 0 }}
      />
      <Bar x={X} y={LIST_Y} w={PALETTE_W} h={1} className={tone(on, "border")} />

      <g clipPath="url(#command-list)">
        <g style={{ transform: `translateY(${LIST_Y + LIST_PAD - (on ? ITEM_H : 0)}px)` }}>
          {[0, 1, 2, 3].map((i) => (
            <Item key={i} y={i * ITEM_H} active={on && i === 1} />
          ))}
        </g>
      </g>

      <Bar x={X} y={FOOTER_Y} w={PALETTE_W} h={1} className={role.border} />
      <Bar x={X + 12} y={FOOTER_Y + 14} w={40} h={6} />
      <Bar x={X + 56} y={FOOTER_Y + 14} w={48} h={6} />
      <Box x={X + PALETTE_W - 42} y={FOOTER_Y + 9} w={28} h={16} rx={4} />
      <Bar x={X + PALETTE_W - 35} y={FOOTER_Y + 15} w={14} h={4} />
    </PreviewFrame>
  );
}
