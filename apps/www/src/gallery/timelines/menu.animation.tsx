"use client";

import type { CSSProperties } from "react";
import { Cursor, CursorProvider, type CursorFrame } from "./cursor";
import { Bar, Box, CX, CY, PreviewFrame, useTimeline, type Timeline } from "./preview-frame";
import { motion, role, tone } from "./tokens";

const PAD = 5;
const LABEL_H = 18;
const ITEM_H = 24;
const SEP_H = 8;
const DOC_W = 92;
const MENU_W = 128;
const SUB_W = 96;
const DOC_GAP = 10;
const MENU_GAP = 4;
const MENU_X = DOC_W + DOC_GAP;
const SUB_X = MENU_X + MENU_W + MENU_GAP;

type Item = { w: number; hot?: true; chevron?: true } | "sep";

const DOC_ITEMS: Item[] = [{ w: 34 }, { w: 28 }, "sep", { w: 28, hot: true, chevron: true }, { w: 22 }];
const MENU_ITEMS: Item[] = [{ w: 48 }, { w: 40 }, "sep", { w: 36, hot: true, chevron: true }];
const SUB_ITEMS: Item[] = [{ w: 44, hot: true }, { w: 36 }];

const listHeight = (items: Item[], label: boolean) =>
  PAD * 2 + (label ? LABEL_H : 0) + items.reduce((h, item) => h + (item === "sep" ? SEP_H : ITEM_H), 0);

const DOC_H = listHeight(DOC_ITEMS, true);
const MENU_H = listHeight(MENU_ITEMS, true);
const DOC_Y = CY - DOC_H / 2;
const MENU_Y = CY - MENU_H / 2;
const DOC_SUB_Y = DOC_Y + PAD + LABEL_H + ITEM_H * 2 + SEP_H;
const MENU_SUB_Y = MENU_Y + PAD + LABEL_H + ITEM_H * 2 + SEP_H;
const SUB_Y = MENU_SUB_Y - 2;

type Phase =
  | "idle"
  | "hover_doc"
  | "right_click"
  | "open"
  | "hover_sub"
  | "sub_open"
  | "selecting"
  | "selected";

const TIMELINE: Timeline<Phase> = {
  hover_doc: 0,
  right_click: 500,
  open: 800,
  hover_sub: 1600,
  sub_open: 2200,
  selecting: 3000,
  selected: 4600,
};

const MENU_PHASES: Phase[] = ["open", "hover_sub", "sub_open", "selecting"];
const SUB_PHASES: Phase[] = ["sub_open", "selecting"];

const offsetFor = (phase: Phase) => {
  const w = SUB_PHASES.includes(phase)
    ? SUB_X + SUB_W
    : MENU_PHASES.includes(phase)
      ? MENU_X + MENU_W
      : DOC_W;
  return CX - w / 2;
};

const at = (phase: Phase, x: number, y: number, scale?: number): CursorFrame => ({
  target: { x: offsetFor(phase) + x, y: y + ITEM_H / 2 },
  scale,
});

const cursorFrames = {
  idle: { target: { x: 300, y: 250 }, opacity: 0 },
  hover_doc: at("hover_doc", DOC_W / 2, DOC_SUB_Y),
  right_click: at("right_click", DOC_W / 2, DOC_SUB_Y, 0.85),
  open: at("open", DOC_W / 2, DOC_SUB_Y),
  hover_sub: at("hover_sub", MENU_X + MENU_W / 2, MENU_SUB_Y),
  sub_open: at("sub_open", MENU_X + MENU_W / 2, MENU_SUB_Y),
  selecting: at("selecting", SUB_X + SUB_W / 2, SUB_Y + PAD, 0.9),
  selected: { target: { x: 350, y: 300 }, opacity: 0 },
} satisfies Record<Phase, CursorFrame>;

function List({
  x,
  y,
  w,
  items,
  label,
  active,
  highlight,
  style,
}: {
  x: number;
  y: number;
  w: number;
  items: Item[];
  label?: number;
  active?: boolean;
  highlight: boolean;
  style?: CSSProperties;
}) {
  let itemY = y + PAD + (label ? LABEL_H : 0);
  const rows = items.map((item, i) => {
    const rowY = itemY;
    if (item === "sep") {
      itemY += SEP_H;
      return <Bar key={i} x={x + PAD} y={rowY + SEP_H / 2} w={w - PAD * 2} h={1} className={role.border} />;
    }
    itemY += ITEM_H;
    const on = highlight && !!item.hot;
    return (
      <g key={i}>
        <Bar x={x + PAD} y={rowY} w={w - PAD * 2} h={ITEM_H} className={role.tint} style={{ opacity: on ? 1 : 0 }} />
        <Bar x={x + PAD + 8} y={rowY + 8} w={item.w} h={7} className={tone(on)} />
        {item.chevron && (
          <path
            d={`M ${x + w - PAD - 14} ${rowY + 8} l 5 4 l -5 4`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={tone(on)}
          />
        )}
      </g>
    );
  });

  return (
    <g style={style}>
      <Box x={x} y={y} w={w} h={itemY + PAD - y} stroke={tone(!!active, "border")} />
      {label && <Bar x={x + PAD + 8} y={y + PAD + 6} w={label} h={6} />}
      {rows}
    </g>
  );
}

export function MenuAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const menuOpen = MENU_PHASES.includes(phase);
  const subOpen = SUB_PHASES.includes(phase);
  const hoveringSub = ["hover_sub", "sub_open", "selecting"].includes(phase);

  return (
    <PreviewFrame ref={ref}>
      <g style={{ transform: `translateX(${offsetFor(phase)}px)`, transition: motion.spring }}>
        <List
          x={0}
          y={DOC_Y}
          w={DOC_W}
          items={DOC_ITEMS}
          label={28}
          active={!["idle", "selected"].includes(phase)}
          highlight={phase !== "idle" && phase !== "selected"}
        />
        <List
          x={MENU_X}
          y={MENU_Y}
          w={MENU_W}
          items={MENU_ITEMS}
          label={34}
          highlight={hoveringSub}
          style={{ opacity: menuOpen ? 1 : 0, transform: `translateY(${menuOpen ? 0 : -6}px)` }}
        />
        <List
          x={SUB_X}
          y={SUB_Y}
          w={SUB_W}
          items={SUB_ITEMS}
          highlight={phase === "selecting"}
          style={{ opacity: subOpen ? 1 : 0, transform: `translateX(${subOpen ? 0 : -8}px)` }}
        />
      </g>

      <CursorProvider phase={phase} frames={cursorFrames}>
        <Cursor />
      </CursorProvider>
    </PreviewFrame>
  );
}
