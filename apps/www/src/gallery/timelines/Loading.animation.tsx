import { CX, CY, PreviewFrame } from "./preview-frame";
import { role } from "./tokens";

const R = 36;
const STROKE_W = 10;
const SWEEP = 252;
const END = ((-90 + SWEEP) * Math.PI) / 180;

export function LoadingAnimation() {
  return (
    <PreviewFrame>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE_W} className={role.border} />
      <path
        d={`M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX + R * Math.cos(END)} ${CY + R * Math.sin(END)}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE_W}
        strokeLinecap="round"
        className={role.active}
      />
    </PreviewFrame>
  );
}
