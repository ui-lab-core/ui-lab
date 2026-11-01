import { Box, CX, CY, PreviewFrame } from "./preview-frame";

const FRAME_W = 240;
const FRAME_H = 80;

export function FrameAnimation() {
  return (
    <PreviewFrame>
      <Box x={CX - FRAME_W / 2} y={CY - FRAME_H / 2} w={FRAME_W} h={FRAME_H} rx={12} />
    </PreviewFrame>
  );
}
