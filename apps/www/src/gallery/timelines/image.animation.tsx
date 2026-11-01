import { Bar, Box, PreviewFrame } from "./preview-frame";
import { role } from "./tokens";

const X = 78;
const Y = 62;
const FRAME_W = 244;
const FRAME_H = 176;
const HEADER_H = 30;
const IMG_X = X + 18;
const IMG_Y = Y + HEADER_H + 16;
const IMG_W = FRAME_W - 36;
const IMG_H = FRAME_H - HEADER_H - 34;
const GROUND = IMG_Y + IMG_H - 18;

export function ImageAnimation() {
  return (
    <PreviewFrame>
      <Box x={X} y={Y} w={FRAME_W} h={FRAME_H} />
      <Bar x={X} y={Y + HEADER_H} w={FRAME_W} h={1} rx={0} className={role.border} />
      {[0, 1, 2].map((dot) => (
        <circle key={dot} cx={X + 18 + dot * 12} cy={Y + 15} r={3} className={dot === 0 ? role.active : role.muted} fill="currentColor" />
      ))}
      <Bar x={X + FRAME_W - 72} y={Y + 12} w={42} h={6} />
      <Box x={IMG_X} y={IMG_Y} w={IMG_W} h={IMG_H} rx={6} />
      <circle cx={IMG_X + IMG_W - 42} cy={IMG_Y + 34} r={13} className={role.active} fill="currentColor" />
      <g className={role.muted} fill="currentColor">
        <path d={`M ${IMG_X + 16} ${GROUND} L ${IMG_X + 70} ${IMG_Y + 62} L ${IMG_X + 116} ${GROUND} Z`} />
        <path d={`M ${IMG_X + 92} ${GROUND} L ${IMG_X + 142} ${IMG_Y + 76} L ${IMG_X + IMG_W - 16} ${GROUND} Z`} />
      </g>
      <Bar x={IMG_X + 14} y={GROUND - 2} w={IMG_W - 28} h={4} className={role.border} />
    </PreviewFrame>
  );
}
