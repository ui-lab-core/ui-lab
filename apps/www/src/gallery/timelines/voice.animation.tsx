import { Bar, CY, PreviewFrame } from "./preview-frame";
import { tone } from "./tokens";

const HEIGHTS = [32, 56, 92, 64, 124, 84, 108, 48, 24, 40];
const PEAK = Math.max(...HEIGHTS);

export function VoiceAnimation() {
  return (
    <PreviewFrame>
      {HEIGHTS.map((h, i) => (
        <Bar key={i} x={124 + i * 16} y={CY - h / 2} w={8} h={h} rx={4} className={tone(h === PEAK)} />
      ))}
    </PreviewFrame>
  );
}
