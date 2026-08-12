"use client";

import React, { useId } from "react";
import { cn, type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Frame.module.css";

interface FrameStyleSlots {
  root?: StyleValue;
}

type FrameStylesProp = StylesProp<FrameStyleSlots>;

const resolveFrameBaseStyles = createStylesResolver(['root'] as const);

type FrameSide = "top" | "bottom" | "left" | "right";
type FrameShapeMode = "indent" | "extend";
type FrameStrokeAlign = "center" | "inside" | "outside";

/**
 * Where the shape sits on each side and the rotation that carries a
 * top-authored path onto that edge. Rotation is clockwise, so afterwards the
 * shape's local +y always points into the frame and local -y always points out
 * of it, whichever side was picked. Every side is therefore the same problem.
 */
const SIDE_PLACEMENT: Record<FrameSide, { x: string; y: string; rotate: number }> = {
  top: { x: "50%", y: "0", rotate: 0 },
  bottom: { x: "50%", y: "100%", rotate: 180 },
  left: { x: "0", y: "50%", rotate: -90 },
  right: { x: "100%", y: "50%", rotate: 90 },
};

/**
 * How far the border line sits inside the frame bounds, as a length. The border
 * rect insets by it and the shape slides onto it, so the stroke and the shape
 * welded to it cannot drift apart when the alignment or the stroke width
 * changes.
 */
const STROKE_ALIGN_OFFSET: Record<FrameStrokeAlign, string> = {
  center: "0px",
  inside: "calc(var(--frame-stroke-width) / 2)",
  outside: "calc(var(--frame-stroke-width) / -2)",
};

/**
 * Masks are sized in user space instead of the default object bounding box: a
 * shape extends a fixed number of pixels, so a bounding-box region would clip
 * its tip on a small frame.
 */
const MASK_REGION = {
  maskUnits: "userSpaceOnUse",
  x: "-100%",
  y: "-100%",
  width: "300%",
  height: "300%",
} as const;

/**
 * Pixels the closed shape region laps over the frame body. The two are unioned
 * (or differenced) in a mask, so meeting exactly on the body's edge would leave
 * an antialiasing hairline along the shape's mouth.
 */
const SEAM_OVERLAP = 1;

/**
 * Places shape geometry on the chosen edge: centred on that side, rotated onto
 * it, slid onto the border line, and — when mirrored — flipped so the same
 * authored curve bulges into the frame instead of out of it.
 */
function ShapeLayer({
  side,
  pathWidth,
  mirror,
  children,
}: {
  side: FrameSide;
  pathWidth: number;
  mirror: boolean;
  children: React.ReactNode;
}) {
  const { x, y, rotate } = SIDE_PLACEMENT[side];

  return (
    <svg x={x} y={y} overflow="visible">
      <g transform={`rotate(${rotate})`}>
        <g style={{ transform: "translateY(var(--frame-stroke-offset, 0px))" }}>
          <g transform={`translate(${-pathWidth / 2}, 0)${mirror ? " scale(1, -1)" : ""}`}>
            {children}
          </g>
        </g>
      </g>
    </svg>
  );
}

export interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * SVG path data for the shape carried by the frame border. Author it along
   * the top edge, running left to right from `0 0` to `pathWidth 0`, with the
   * curve bulging *outwards* (negative y). Frame rotates it onto `side` and
   * mirrors it for `shapeMode="indent"`, so one path works on every edge in
   * either mode.
   */
  path?: string;
  /** Width of the path shape in pixels — the distance between its two endpoints */
  pathWidth?: number;
  /** Which side of the frame the path shape appears on */
  side?: FrameSide;
  /**
   * Whether the path shape is cut into the frame or protrudes from it. Either
   * way the frame clips its content to the resulting outline, so anything that
   * should sit in a cutout — an avatar in a notch, say — belongs alongside the
   * Frame rather than inside it.
   */
  shapeMode?: FrameShapeMode;
  /** Controls the line style of the frame border and notch stroke */
  pathStroke?: "solid" | "dashed" | "dotted";
  /** Which edges of the frame render a border stroke. A single edge keeps its corner arcs. */
  edges?: "all" | "top" | "bottom" | "left" | "right";
  /** Where the border stroke sits relative to the frame bounds, like Figma's stroke position */
  strokeAlign?: FrameStrokeAlign;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: FrameStylesProp;
}

const Frame = React.forwardRef<HTMLDivElement, FrameProps>(
  ({ children, className, styles, style, path, pathWidth = 0, side = "top", shapeMode = "indent", pathStroke = "solid", edges = "all", strokeAlign = "center", ...props }, ref) => {
    const maskId = useId();
    const shapeMaskId = `shape-${maskId}`;
    const borderMaskId = `border-${maskId}`;

    const indent = shapeMode === "indent";

    const strokeDashProps: { strokeDasharray?: string; strokeLinecap?: React.SVGAttributes<SVGElement>["strokeLinecap"] } =
      pathStroke === "dashed"
        ? { strokeDasharray: "8 4" }
        : pathStroke === "dotted"
          ? { strokeDasharray: "2 4", strokeLinecap: "round" }
          : {};

    // The authored curve is open; closing it back along its baseline turns it
    // into a fillable region. The closing edge runs a hair past the baseline so
    // the region overlaps the frame body it is unioned with (extend) or
    // overshoots the edge it is subtracted from (indent).
    const shapeRegion = path
      ? `${path} L ${pathWidth} ${SEAM_OVERLAP} L 0 ${SEAM_OVERLAP} Z`
      : undefined;

    // The straight border is cut away across the shape's mouth so the shape's
    // own outline can carry the border through it. The gap is inset by half a
    // stroke at each end and spans a full stroke either side of the border
    // line, so it clears the stroke at any width and leaves the border's cut
    // ends tucked under the outline's end caps.
    const connectionGapStyle = {
      x: "calc(var(--frame-stroke-width) / 2)",
      y: "calc(var(--frame-stroke-width) * -1)",
      width: `calc(${pathWidth}px - var(--frame-stroke-width))`,
      height: "calc(var(--frame-stroke-width) * 2)",
    } as React.CSSProperties;

    // Region masked out of the border stroke when only one edge is kept.
    // Starts past the corner radius so the kept edge retains its corner arcs.
    const edgeMaskStyle: React.CSSProperties | null =
      edges === "all"
        ? null
        : {
            top: { x: "-10%", y: "var(--frame-radius)", width: "120%", height: "120%" },
            bottom: { x: "-10%", y: "-10%", width: "120%", height: "calc(110% - var(--frame-radius))" },
            left: { x: "var(--frame-radius)", y: "-10%", width: "120%", height: "120%" },
            right: { x: "-10%", y: "-10%", width: "calc(110% - var(--frame-radius))", height: "120%" },
          }[edges];

    // Extra unrounded shape region covering the half opposite the kept edge,
    // so corner rounding only applies to the kept edge without painting
    // outside the frame bounds.
    const edgeShapeProps: React.SVGProps<SVGRectElement> | null =
      edges === "all"
        ? null
        : {
            top: { x: "0", y: "50%", width: "100%", height: "50%" },
            bottom: { x: "0", y: "0", width: "100%", height: "50%" },
            left: { x: "50%", y: "0", width: "50%", height: "100%" },
            right: { x: "0", y: "0", width: "50%", height: "100%" },
          }[edges];

    const resolved = resolveFrameBaseStyles(styles);

    return (
      <div
        ref={ref}
        className={cn("relative w-full group isolate", css.root, className, resolved.root)}
        style={{
          "--frame-stroke-offset": STROKE_ALIGN_OFFSET[strokeAlign],
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The frame's silhouette: its body with the shape subtracted
                (indent) or added (extend). Masks the fill and the content
                alike, so background and children share one outline. */}
            <mask id={shapeMaskId} {...MASK_REGION}>
              <rect width="100%" height="100%" fill="white" className={css.shape} />
              {edgeShapeProps && <rect fill="white" {...edgeShapeProps} />}
              {shapeRegion && (
                <ShapeLayer side={side} pathWidth={pathWidth} mirror={indent}>
                  <path d={shapeRegion} fill={indent ? "black" : "white"} />
                </ShapeLayer>
              )}
            </mask>

            {/* The border, minus the mouth of the shape — which the shape's own
                outline strokes instead. */}
            <mask id={borderMaskId} {...MASK_REGION}>
              <rect x="-100%" y="-100%" width="300%" height="300%" fill="white" />
              {edgeMaskStyle && <rect fill="black" style={edgeMaskStyle} />}
              {path && (
                <ShapeLayer side={side} pathWidth={pathWidth} mirror={false}>
                  <rect fill="black" style={connectionGapStyle} />
                </ShapeLayer>
              )}
            </mask>
          </defs>

          {/* Background fill layer */}
          <rect
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            fill="var(--fill, transparent)"
            mask={`url(#${shapeMaskId})`}
          />

          {/* Border stroke layer. Inset by the stroke offset so `strokeAlign`
              moves the border line and the shape welded to it together. */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="var(--stroke-color, var(--background-700))"
            mask={`url(#${borderMaskId})`}
            className={cn(css.shape, css.stroke)}
            style={{
              x: "var(--frame-stroke-offset)",
              y: "var(--frame-stroke-offset)",
              width: "calc(100% - var(--frame-stroke-offset) * 2)",
              height: "calc(100% - var(--frame-stroke-offset) * 2)",
            } as React.CSSProperties}
            {...strokeDashProps}
          />

          {/* The shape's outline, continuing the border across the gap */}
          {path && (
            <ShapeLayer side={side} pathWidth={pathWidth} mirror={indent}>
              <path
                d={path}
                fill="none"
                stroke="var(--stroke-color, var(--background-700))"
                className={css.stroke}
                {...strokeDashProps}
              />
            </ShapeLayer>
          )}
        </svg>

        {/* Content is clipped to the same silhouette as the fill, so children
            cannot paint across a cutout or spill past a protrusion. The mask
            sits here rather than on the root so it never eats into the border
            stroke straddling that outline, or the root's own drop shadow. */}
        <div
          className="relative z-10 h-full"
          style={{
            maskImage: path ? `url(#${shapeMaskId})` : undefined,
            WebkitMaskImage: path ? `url(#${shapeMaskId})` : undefined,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

Frame.displayName = "Frame";

export { Frame };
