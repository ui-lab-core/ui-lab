import { Bar, PreviewFrame } from "./preview-frame";
import { role, tone } from "./tokens";

const LINE_X = 140;
const EVENTS = [
  { y: 95, title: 80, sub: 60 },
  { y: 150, title: 100, sub: 70 },
  { y: 205, title: 60, sub: 45 },
];

export function TimelineAnimation() {
  return (
    <PreviewFrame>
      <Bar x={LINE_X - 1} y={75} w={2} h={150} rx={0} className={role.border} />
      {EVENTS.map(({ y, title, sub }, i) => {
        const on = i === 1;
        return (
          <g key={y}>
            <circle cx={LINE_X} cy={y} r={5} className={tone(on, "border")} fill="currentColor" />
            <Bar x={LINE_X + 5} y={y} w={9} h={1} rx={0} className={role.border} />
            <Bar x={LINE_X + 18} y={y - 8} w={title} h={5} className={tone(on)} />
            <Bar x={LINE_X + 18} y={y + 1} w={sub} h={3} />
          </g>
        );
      })}
    </PreviewFrame>
  );
}
