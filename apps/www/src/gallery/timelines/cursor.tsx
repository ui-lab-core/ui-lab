"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { curve } from "./tokens";

type CursorPoint = {
  x: number;
  y: number;
};

export type CursorFrame = {
  target: CursorPoint;
  opacity?: number;
  rotate?: number;
  scale?: number;
  motion?: CursorMotion;
};

const { spring: SPRING, ease: EASE, drag: DRAG } = curve;

const CURSOR_PATH =
  "M0 0 V16.4 Q0 17.3 0.7 16.7 L4.4 13.2 L6.9 18.9 Q7.2 19.5 7.8 19.3 L9.5 18.6 Q10.1 18.3 9.8 17.7 L7.3 12.1 H11.9 Q12.8 12.1 12.1 11.4 Z";
const CURSOR_CLASS = "fill-foreground-100 stroke-background-950";
const CURSOR_STROKE_WIDTH = 1.5;
const CURSOR_SHADOW = "drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.35))";
const CURSOR_ORIGIN = "4px 8px";
const CURSOR_SCALE = 1.25;

const CURSOR_MOTIONS = {
  default: {
    move: `transform 0.5s ${SPRING}, opacity 0.25s ease-out`,
    shape: `transform 0.5s ${SPRING}`,
  },
  delayed: {
    move: `transform 0.5s ${SPRING} 0.1s, opacity 0.3s ease`,
    shape: "transform 0.12s ease-in-out",
  },
  glide: {
    move: `transform 0.8s ${EASE}, opacity 0.3s ease`,
    shape: `transform 0.8s ${EASE}`,
  },
  drag: {
    move: `transform 1.3s ${DRAG}, opacity 0.25s ease-out`,
    shape: `transform 0.5s ${SPRING}`,
  },
  drift: {
    move: `transform 1s ${EASE}, opacity 0.5s ease`,
    shape: `transform 1s ${EASE}`,
  },
} satisfies Record<string, { move: string; shape: string }>;

export type CursorMotion = keyof typeof CURSOR_MOTIONS;

type CursorContextValue = {
  groupStyle: CSSProperties;
  pathStyle: CSSProperties;
};

const CursorContext = createContext<CursorContextValue | null>(null);

function buildShapeTransform({ rotate, scale }: CursorFrame) {
  const transforms: string[] = [];

  if (rotate) {
    transforms.push(`rotate(${rotate}deg)`);
  }

  if (scale !== undefined && scale !== 1) {
    transforms.push(`scale(${scale})`);
  }

  return transforms.length > 0 ? transforms.join(" ") : undefined;
}

export function CursorProvider<T extends string>({
  phase,
  frames,
  motion = "default",
  hotspot = { x: 0, y: 0 },
  children,
}: {
  phase: T;
  frames: Record<T, CursorFrame>;
  motion?: CursorMotion;
  hotspot?: CursorPoint;
  children: ReactNode;
}) {
  const frame = frames[phase];
  const transitions = CURSOR_MOTIONS[frame.motion ?? motion];

  const groupStyle: CSSProperties = {
    transform: `translate(${frame.target.x - hotspot.x}px, ${frame.target.y - hotspot.y}px)`,
    opacity: frame.opacity ?? 1,
    transition: transitions.move,
    pointerEvents: "none",
  };

  const pathStyle: CSSProperties = {
    transform: buildShapeTransform(frame),
    transformOrigin: CURSOR_ORIGIN,
    transition: transitions.shape,
  };

  return (
    <CursorContext.Provider value={{ groupStyle, pathStyle }}>{children}</CursorContext.Provider>
  );
}

export function Cursor() {
  const context = useContext(CursorContext);

  if (!context) {
    throw new Error("Cursor must be used within a CursorProvider.");
  }

  return (
    <g aria-hidden="true" style={context.groupStyle}>
      <g transform={`scale(${CURSOR_SCALE})`} style={{ filter: CURSOR_SHADOW }}>
        <path
          d={CURSOR_PATH}
          className={CURSOR_CLASS}
          strokeWidth={CURSOR_STROKE_WIDTH / CURSOR_SCALE}
          strokeLinejoin="round"
          paintOrder="stroke"
          style={context.pathStyle}
        />
      </g>
    </g>
  );
}
