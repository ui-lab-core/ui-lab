import { CX, CY, PreviewFrame, STROKE } from "./preview-frame";
import { role } from "./tokens";

const R = 48;

export function MaskAnimation() {
  return (
    <PreviewFrame>
      <path d={`M ${CX} ${CY - R} a ${R} ${R} 0 0 0 0 ${R * 2} Z`} className={role.surface} fill="currentColor" />
      <path d={`M ${CX} ${CY - R} a ${R} ${R} 0 0 1 0 ${R * 2} Z`} className={role.border} fill="currentColor" />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} className={role.border} />
      <path
        d={`M ${CX} ${CY - R - 28} v ${R * 2 + 56}`}
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeDasharray="6 6"
        className={role.muted}
      />
    </PreviewFrame>
  );
}
