import { Bar, Box, CX, PreviewFrame } from "./preview-frame";
import { role } from "./tokens";

const BLOCK_W = 300;
const HEADER_H = 40;
const X = CX - BLOCK_W / 2;
const Y = 70;
const LINE_H = 22;
const LINES: { indent: number; tokens: { w: number; accent?: true }[] }[] = [
  { indent: 0, tokens: [{ w: 44, accent: true }, { w: 56 }, { w: 32 }] },
  { indent: 24, tokens: [{ w: 28 }, { w: 64, accent: true }] },
  { indent: 24, tokens: [{ w: 36 }, { w: 48 }] },
  { indent: 0, tokens: [{ w: 16 }] },
];
const BLOCK_H = HEADER_H + 20 + LINES.length * LINE_H;

export function CodeAnimation() {
  return (
    <PreviewFrame>
      <Box x={X} y={Y} w={BLOCK_W} h={BLOCK_H} rx={6} />
      <Bar x={X} y={Y + HEADER_H} w={BLOCK_W} h={1} rx={0} className={role.border} />
      <Bar x={X + 16} y={Y + 16} w={80} />
      <Bar x={X + BLOCK_W - 56} y={Y + 16} w={40} />
      {LINES.map(({ indent, tokens }, row) => {
        let x = X + 16 + indent;
        return tokens.map(({ w, accent }, i) => {
          const tokenX = x;
          x += w + 12;
          return (
            <Bar
              key={`${row}-${i}`}
              x={tokenX}
              y={Y + HEADER_H + 18 + row * LINE_H}
              w={w}
              h={10}
              className={accent ? role.active : role.muted}
            />
          );
        });
      })}
    </PreviewFrame>
  );
}
