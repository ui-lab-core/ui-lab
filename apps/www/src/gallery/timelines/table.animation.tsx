"use client";

import { Bar, Box, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { role, tone } from "./tokens";

const COLUMNS = [
  { x: 0, header: 50, cells: [62, 78, 54, 70] },
  { x: 110, header: 38, cells: [38, 32, 46, 34] },
  { x: 192, header: 56, cells: [72, 62, 80, 56] },
];
const X = 53;
const Y = 52;
const TABLE_W = 293;
const ROW_H = 27;
const HEADER_H = 29;
const TOOLBAR_H = 32;
const VISIBLE_ROWS = 3;
const HEAD_Y = Y + TOOLBAR_H;
const BODY_Y = HEAD_Y + HEADER_H;
const TABLE_H = TOOLBAR_H + HEADER_H + ROW_H * VISIBLE_ROWS + 18;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Row({ index, active }: { index: number; active: boolean }) {
  const y = BODY_Y + ROW_H * index;
  return (
    <g>
      <Bar x={X + 5} y={y + 1} w={TABLE_W - 10} h={ROW_H - 2} rx={4} className={role.tint} style={{ opacity: active ? 1 : 0 }} />
      {COLUMNS.map((column) => (
        <Bar key={column.x} x={X + column.x + 14} y={y + 11} w={column.cells[index]} h={5} className={tone(active)} />
      ))}
      <circle cx={X + TABLE_W - 18} cy={y + ROW_H / 2} r={3} className={tone(active)} fill="currentColor" />
    </g>
  );
}

export function TableAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";

  return (
    <PreviewFrame ref={ref}>
      <defs>
        <clipPath id="table-body">
          <rect x={X} y={BODY_Y} width={TABLE_W} height={ROW_H * VISIBLE_ROWS} />
        </clipPath>
      </defs>
      <Ring x={X} y={Y} w={TABLE_W} h={TABLE_H} show={on} />
      <Box x={X} y={Y} w={TABLE_W} h={TABLE_H} stroke={tone(on, "border")} />
      <Bar x={X + 16} y={Y + 11} w={on ? 88 : 115} h={9} className={tone(on)} />
      <Bar x={X + TABLE_W - 72} y={Y + 9} w={29} h={13} className={tone(on, "border")} />
      <Bar x={X + TABLE_W - 32} y={Y + 9} w={16} h={13} className={role.border} />
      <Bar x={X} y={HEAD_Y} w={TABLE_W} h={HEADER_H} rx={0} className={on ? role.tint : role.border} />
      {COLUMNS.map((column, i) => (
        <g key={column.x}>
          {i > 0 && <Bar x={X + column.x} y={HEAD_Y} w={1} h={HEADER_H + ROW_H * VISIBLE_ROWS} rx={0} className={role.border} />}
          <Bar x={X + column.x + 14} y={HEAD_Y + 12} w={column.header} h={5} className={tone(on && i === 2)} />
        </g>
      ))}
      <g clipPath="url(#table-body)">
        <g style={{ transform: `translateY(${on ? -ROW_H : 0}px)` }}>
          {[0, 1, 2, 3].map((i) => (
            <Row key={i} index={i} active={on && i === 2} />
          ))}
        </g>
      </g>
      {[1, 2].map((i) => (
        <Bar key={i} x={X} y={BODY_Y + ROW_H * i} w={TABLE_W} h={1} rx={0} className={role.border} />
      ))}
    </PreviewFrame>
  );
}
