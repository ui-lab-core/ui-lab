"use client";

import { Bar, Box, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { tone } from "./tokens";

const X = 60;
const START_Y = 60;
const TILE = 80;
const GAP = 20;
const STEP = TILE + GAP;
const WIDE = TILE * 2 + GAP;

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function Tile({ x, wide = false, active }: { x: number; wide?: boolean; active: boolean }) {
  const w = wide ? WIDE : TILE;
  return (
    <g>
      <Box x={x} y={0} w={w} h={TILE} rx={6} stroke={tone(active, "border")} />
      {wide ? (
        <>
          <Bar x={x + 4} y={4} w={82} h={TILE - 8} rx={4} className={tone(active, "border")} />
          <Bar x={x + 100} y={16} w={w - 126} className={tone(active)} />
          <Bar x={x + 100} y={30} w={w - 150} h={4} />
        </>
      ) : (
        <>
          <Bar x={x + 4} y={4} w={TILE - 8} h={TILE - 43} rx={4} className={tone(active, "border")} />
          <Bar x={x + 5} y={TILE - 27} w={34} h={6} className={tone(active)} />
          <Bar x={x + 5} y={TILE - 16} w={48} h={4} />
        </>
      )}
    </g>
  );
}

function Row({ y, featured = false, active = false, visible = true }: { y: number; featured?: boolean; active?: boolean; visible?: boolean }) {
  return (
    <g style={{ transform: `translateY(${y}px)`, opacity: visible ? 1 : 0 }}>
      {featured ? (
        <>
          <Tile x={X} wide active={active} />
          <Tile x={X + WIDE + GAP} active={active} />
        </>
      ) : (
        [0, 1, 2].map((i) => <Tile key={i} x={X + i * STEP} active={active} />)
      )}
    </g>
  );
}

export function GalleryAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const on = phase === "hover";
  const shift = on ? -STEP : 0;

  return (
    <PreviewFrame ref={ref}>
      <Row y={START_Y + shift} featured visible={!on} />
      <Row y={START_Y + STEP + shift} active={on} />
      <Row y={START_Y + STEP * 2 + shift} visible={on} />
      <Ring x={X} y={START_Y + STEP + shift} w={WIDE + GAP + TILE} h={TILE} show={on} />
    </PreviewFrame>
  );
}
