"use client";

import { useState } from "react";
import { Bar, Box, CX, CY, PreviewFrame, Ring, useTimeline, type Timeline } from "./preview-frame";
import { motion, tone } from "./tokens";

const CARD_X = 130;
const CARD_Y = 69;
const CARD_W = 140;
const CARD_H = 162;

const POSITIONS: Record<number, { transform: string; opacity: number }> = {
  [-2]: { transform: "translate(134px, 86px) rotate(60deg) scale(0.88)", opacity: 0 },
  [-1]: { transform: "translate(67px, 43px) rotate(30deg) scale(0.84)", opacity: 0 },
  0: { transform: "translate(0px, 0px) rotate(0deg) scale(0.8)", opacity: 1 },
  1: { transform: "translate(-22px, 14px) rotate(-15deg) scale(0.76)", opacity: 1 },
  2: { transform: "translate(-45px, 33px) rotate(-25deg) scale(0.72)", opacity: 0.7 },
  3: { transform: "translate(-67px, 54px) rotate(-35deg) scale(0.68)", opacity: 0 },
  4: { transform: "translate(-89px, 75px) rotate(-45deg) scale(0.64)", opacity: 0 },
};

type Phase = "idle" | "hover";
const TIMELINE: Timeline<Phase> = { hover: 0 };

function CardBody({ active }: { active: boolean }) {
  return (
    <>
      <Ring x={CARD_X} y={CARD_Y} w={CARD_W} h={CARD_H} show={active} />
      <Box x={CARD_X} y={CARD_Y} w={CARD_W} h={CARD_H} stroke={tone(active, "border")} />
      <Bar x={CARD_X + 7} y={CARD_Y + 7} w={126} h={63} rx={8} className={tone(active, "border")} />
      <Bar x={CARD_X + 11} y={CARD_Y + 81} w={active ? 98 : 77} className={tone(active)} />
      <Bar x={CARD_X + 11} y={CARD_Y + 95} w={active ? 77 : 63} h={7} className={tone(active)} />
    </>
  );
}

export function CardAnimation() {
  const { ref, phase } = useTimeline<Phase>(TIMELINE);
  const [step, setStep] = useState(0);

  if ((step % 2 === 1) !== (phase === "hover")) setStep(step + 1);

  return (
    <PreviewFrame ref={ref}>
      {Array.from({ length: 7 }, (_, i) => step + 4 - i).map((index) => {
        const offset = index - step;
        return (
          <g
            key={index}
            style={{
              ...POSITIONS[Math.max(-2, offset)],
              transformOrigin: `${CX}px ${CY}px`,
              transition: motion.spring,
            }}
          >
            <CardBody active={offset <= 0 && index % 2 === 1} />
          </g>
        );
      })}
    </PreviewFrame>
  );
}
