import { Bar, Box, PreviewFrame } from "./preview-frame";
import { role } from "./tokens";

const X = 76;
const Y = 72;
const FRAME_W = 248;
const FRAME_H = 156;
const PAD = 14;
const CONTROLS_H = 34;
const MEDIA_W = FRAME_W - PAD * 2;
const MEDIA_H = FRAME_H - CONTROLS_H - PAD - 8;
const CONTROLS_Y = Y + FRAME_H - CONTROLS_H;
const RAIL_X = X + 54;
const RAIL_Y = CONTROLS_Y + 17;
const RAIL_W = FRAME_W - 84;
const PLAY_X = X + PAD + MEDIA_W / 2;
const PLAY_Y = Y + PAD + MEDIA_H / 2;

export function VideoAnimation() {
  return (
    <PreviewFrame>
      <Box x={X} y={Y} w={FRAME_W} h={FRAME_H} />
      <Box x={X + PAD} y={Y + PAD} w={MEDIA_W} h={MEDIA_H} rx={6} />
      <path d={`M ${PLAY_X - 10} ${PLAY_Y - 15} v 30 l 26 -15 Z`} className={role.active} fill="currentColor" />
      <Bar x={X} y={CONTROLS_Y} w={FRAME_W} h={1} rx={0} className={role.border} />
      <circle cx={X + 24} cy={RAIL_Y} r={5} className={role.active} fill="currentColor" />
      <Bar x={RAIL_X} y={RAIL_Y - 3} w={RAIL_W} h={6} className={role.border} />
      <Bar x={RAIL_X} y={RAIL_Y - 3} w={RAIL_W * 0.42} h={6} className={role.active} />
      {[0, 1, 2].map((dot) => (
        <circle key={dot} cx={X + FRAME_W - 42 + dot * 11} cy={RAIL_Y} r={3} className={role.muted} fill="currentColor" />
      ))}
    </PreviewFrame>
  );
}
