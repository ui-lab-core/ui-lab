import { Bar, Box, CX, PreviewFrame, W } from "./preview-frame";
import { role, tone } from "./tokens";

const CARD_W = 120;
const CARD_H = 110;
const GAP = 12;
const Y = 80;
const VIEW_X = 44;
const VIEW_W = W - VIEW_X * 2;
const DOTS_Y = Y + CARD_H + 24;

function Card({ x, active = false }: { x: number; active?: boolean }) {
  return (
    <>
      <Box x={x} y={Y} w={CARD_W} h={CARD_H} rx={8} stroke={tone(active, "border")} />
      <Bar x={x + 8} y={Y + 8} w={CARD_W - 16} h={52} rx={5} className={tone(active, "border")} />
      <Bar x={x + 8} y={Y + 70} w={74} h={8} className={tone(active)} />
      <Bar x={x + 8} y={Y + 84} w={52} h={6} />
    </>
  );
}

function Chevron({ x, dir }: { x: number; dir: 1 | -1 }) {
  return (
    <path
      d={`M ${x + 5 * dir} ${Y + CARD_H / 2 - 10} l ${-10 * dir} 10 l ${10 * dir} 10`}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={role.muted}
    />
  );
}

export function CarouselAnimation() {
  return (
    <PreviewFrame>
      <defs>
        <linearGradient id="carousel-fade">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.25" stopColor="white" />
          <stop offset="0.75" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="carousel-mask">
          <rect x={VIEW_X} y={0} width={VIEW_W} height={300} fill="url(#carousel-fade)" />
        </mask>
      </defs>
      <Chevron x={24} dir={1} />
      <g mask="url(#carousel-mask)">
        <Card x={CX - CARD_W * 1.5 - GAP} />
        <Card x={CX - CARD_W / 2} active />
        <Card x={CX + CARD_W / 2 + GAP} />
      </g>
      <Chevron x={W - 24} dir={-1} />
      {[-1, 0, 1].map((d) => (
        <circle key={d} cx={CX + d * 14} cy={DOTS_Y} r={d === 0 ? 4 : 3} className={tone(d === 0)} fill="currentColor" />
      ))}
    </PreviewFrame>
  );
}
