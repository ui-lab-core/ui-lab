import { Bar, PreviewFrame } from "./preview-frame";
import { role } from "./tokens";

const X = 84;
const Y = 110;
const MEDIA = 80;
const TEXT_X = X + MEDIA + 20;

export function SkeletonAnimation() {
  return (
    <PreviewFrame>
      <g className="animate-pulse">
        <Bar x={X} y={Y} w={MEDIA} h={MEDIA} rx={8} className={role.border} />
        <Bar x={TEXT_X} y={Y + 12} w={100} h={14} rx={4} className={role.border} />
        <Bar x={TEXT_X} y={Y + 40} w={132} h={10} className={role.border} />
        <Bar x={TEXT_X} y={Y + 58} w={92} h={10} className={role.border} />
      </g>
    </PreviewFrame>
  );
}
