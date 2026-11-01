import { Bar, Box, CX, CY, PreviewFrame } from "./preview-frame";
import { role } from "./tokens";

const ALERT_W = 300;
const ALERT_H = 72;
const X = CX - ALERT_W / 2;
const Y = CY - ALERT_H / 2;
const ICON_X = X + 22;
const ICON_Y = Y + 22;
const BTN_W = 52;
const BTN_H = 18;
const BTN_Y = Y + ALERT_H - BTN_H - 10;
const PRIMARY_X = X + ALERT_W - 12 - BTN_W;
const SECONDARY_X = PRIMARY_X - 8 - BTN_W;

export function AlertAnimation() {
  return (
    <PreviewFrame>
      <Box x={X} y={Y} w={ALERT_W} h={ALERT_H} />
      <g className={role.active}>
        <circle cx={ICON_X} cy={ICON_Y} r={9} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx={ICON_X} cy={ICON_Y + 4} r={1.5} fill="currentColor" />
        <path d={`M ${ICON_X} ${ICON_Y - 4} v 5`} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </g>
      <Bar x={X + 38} y={Y + 13} w={90} h={6} className={role.active} />
      <Bar x={X + 38} y={Y + 26} w={150} h={4} />
      <Bar x={X + 38} y={Y + 34} w={110} h={4} />
      <Box x={SECONDARY_X} y={BTN_Y} w={BTN_W} h={BTN_H} rx={5} />
      <Bar x={SECONDARY_X + 10} y={BTN_Y + 7} w={32} h={4} />
      <Box x={PRIMARY_X} y={BTN_Y} w={BTN_W} h={BTN_H} rx={5} fill={role.tint} stroke={role.active} />
      <Bar x={PRIMARY_X + 10} y={BTN_Y + 7} w={32} h={4} className={role.active} />
    </PreviewFrame>
  );
}
