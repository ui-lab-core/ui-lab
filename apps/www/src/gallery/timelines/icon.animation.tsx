import { Icon } from "ui-lab-components/icon";
import { Box, CX, CY, PreviewFrame } from "./preview-frame";
import { role, tone } from "./tokens";

const ICONS = ["folder", "bell", "search", "agent", "code", "music"];
const TILE = 72;
const GAP = 24;
const ICON = 36;
const X = CX - (TILE * 3 + GAP * 2) / 2;
const Y = CY - (TILE * 2 + GAP) / 2;

export function IconAnimation() {
  return (
    <PreviewFrame>
      {ICONS.map((id, i) => {
        const x = X + (i % 3) * (TILE + GAP);
        const y = Y + Math.floor(i / 3) * (TILE + GAP);
        const on = i === 1;
        return (
          <g key={id}>
            <Box x={x} y={y} w={TILE} h={TILE} rx={12} fill={on ? role.tint : role.surface} stroke={tone(on, "border")} />
            <foreignObject x={x + (TILE - ICON) / 2} y={y + (TILE - ICON) / 2} width={ICON} height={ICON}>
              <Icon id={id} size={ICON} className={tone(on)} />
            </foreignObject>
          </g>
        );
      })}
    </PreviewFrame>
  );
}
