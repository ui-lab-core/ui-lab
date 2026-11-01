import { Bar, Box, CX, CY, PreviewFrame } from "./preview-frame";
import { role } from "./tokens";

const TOOLBAR_W = 210;
const TOOLBAR_H = 36;
const X = CX - TOOLBAR_W / 2;
const BTN_W = TOOLBAR_W / 5;
const btn = (i: number) => X + i * BTN_W + BTN_W / 2;

export function ToolbarAnimation() {
  return (
    <PreviewFrame>
      <Box x={X} y={CY - TOOLBAR_H / 2} w={TOOLBAR_W} h={TOOLBAR_H} />
      <Bar x={X + 3 * BTN_W} y={CY - 11} w={1} h={22} rx={0} className={role.border} />
      <Bar x={btn(0) - 7} y={CY - 5} w={14} h={4} className={role.active} />
      <Bar x={btn(0) - 7} y={CY + 3} w={14} h={4} className={role.active} />
      {[-3, -5, -7].map((dx, i) => (
        <Bar key={dx} x={btn(1) + dx} y={CY - 6 + i * 5} w={10} h={3} />
      ))}
      {[16, 12, 16].map((w, i) => (
        <Bar key={i} x={btn(2) - 8} y={CY - 6 + i * 5} w={w} h={3} />
      ))}
      {[
        [-8, -7],
        [2, -7],
        [-8, 1],
        [2, 1],
      ].map(([dx, dy]) => (
        <Bar key={`${dx}${dy}`} x={btn(3) + dx} y={CY + dy} w={6} h={6} rx={1} />
      ))}
      <g className={role.muted} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={btn(4) - 2} cy={CY} r={6} />
        <path d={`M ${btn(4) + 4} ${CY} h 5 m -3 -3 l 3 3 l -3 3`} />
      </g>
    </PreviewFrame>
  );
}
