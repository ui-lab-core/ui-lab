"use client";

import React, { useId } from "react";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Frame.module.css";

interface FrameStyleSlots {
  root?: Style;
}

type FrameStylesProp = StylesProp<FrameStyleSlots>;

const resolveFrameBaseStyles = createStylesResolver(["root"] as const);

type FrameSide = "top" | "bottom" | "left" | "right";
type FrameShapeMode = "indent" | "extend";
type FrameStrokeAlign = "center" | "inside" | "outside";
type FrameShapeAlign = "start" | "center" | "end";

/**
 * Where the shape sits on each side and the rotation that carries a
 * top-authored path onto that edge. Rotation is clockwise, so afterwards the
 * shape's local +y always points into the frame and local -y always points out
 * of it, whichever side was picked. Every side is therefore the same problem.
 *
 * `axis` names the frame coordinate the shape slides along and `cross` pins the
 * other one to the edge. `reverse` marks the sides whose rotation leaves the
 * shape's local +x running against that axis, so `shapeAlign` keeps meaning the
 * start and end of the authored path rather than left and right of the screen.
 */
const SIDE_PLACEMENT: Record<
  FrameSide,
  { rotate: number; axis: "x" | "y"; cross: string; reverse: boolean }
> = {
  top: { rotate: 0, axis: "x", cross: "0", reverse: false },
  bottom: { rotate: 180, axis: "x", cross: "100%", reverse: true },
  left: { rotate: -90, axis: "y", cross: "0", reverse: true },
  right: { rotate: 90, axis: "y", cross: "100%", reverse: false },
};

/** Point on the edge the shape is pinned to, and which of its ends lands there. */
const ALIGN_ANCHOR: Record<FrameShapeAlign, string> = { start: "0%", center: "50%", end: "100%" };
const ALIGN_SHIFT: Record<FrameShapeAlign, number> = { start: 0, center: 0.5, end: 1 };
const ALIGN_FLIP: Record<FrameShapeAlign, FrameShapeAlign> = {
  start: "end",
  center: "center",
  end: "start",
};

/**
 * Slide *along* the edge that keeps a corner-anchored shape welded to the
 * border line, the way `--frame-stroke-offset` keeps it welded across the edge.
 * A centred shape never meets a corner, so it needs none.
 */
const ALIGN_INSET: Record<FrameShapeAlign, string> = {
  start: "var(--frame-stroke-offset, 0px)",
  center: "0px",
  end: "calc(var(--frame-stroke-offset, 0px) * -1)",
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
 * an antialiasing hairline along the shape's mouth. It has to clear half a
 * border stroke as well, because `strokeAlign` can sit the body's edge that far
 * from the border line the shape is welded to; 1px covers every stroke width
 * the theme scale offers.
 */
const SEAM_OVERLAP = 1;

/**
 * How far past each of its endpoints the shape's outline runs, in border stroke
 * widths, supplied by a marker so it follows the path's tangent instead of a
 * cap's fixed square. The border is cut back a whole stroke there (see `.cut`),
 * so the first stroke of this reaches the cut and the remaining half laps over
 * it. The overlap costs nothing: both are painted into one mask and coloured
 * once, so ink laid twice is still ink laid once.
 */
const CAP_OVERRUN = 1.5;

/**
 * Places shape geometry on the chosen edge: anchored along that side, rotated
 * onto it, slid onto the border line, and — when mirrored — flipped so the same
 * authored curve bulges into the frame instead of out of it.
 */
function ShapeLayer({
  side,
  align,
  shapeOffset,
  pathWidth,
  mirror,
  children,
}: {
  side: FrameSide;
  align: FrameShapeAlign;
  shapeOffset?: number;
  pathWidth: number;
  mirror: boolean;
  children: React.ReactNode;
}) {
  const { rotate, axis, cross, reverse } = SIDE_PLACEMENT[side];
  const resolvedAlign = shapeOffset === undefined ? align : "center";
  const anchor =
    shapeOffset === undefined
      ? ALIGN_ANCHOR[reverse ? ALIGN_FLIP[resolvedAlign] : resolvedAlign]
      : shapeOffset;

  return (
    <svg x={axis === "x" ? anchor : cross} y={axis === "x" ? cross : anchor} overflow="visible">
      <g transform={`rotate(${rotate})`}>
        <g
          style={{
            transform: `translate(${ALIGN_INSET[resolvedAlign]}, var(--frame-stroke-offset, 0px))`,
          }}
        >
          <g
            transform={`translate(${-pathWidth * ALIGN_SHIFT[resolvedAlign]}, 0)${mirror ? " scale(1, -1)" : ""}`}
          >
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
   * the top edge, starting at `0 0` and running left to right, with the curve
   * bulging *outwards* (negative y). Frame rotates it onto `side` and mirrors it
   * for `shapeMode="indent"`, so one path works on every edge in either mode.
   *
   * It usually returns to the edge at `pathWidth 0`, but it does not have to: a
   * path anchored to a corner can leave off deep into the adjoining edge, and
   * Frame closes the region back along the outside of the border either way.
   */
  path?: string;
  /** Width of the path shape in pixels — how far along the edge it reaches from its start */
  pathWidth?: number;
  /** Which side of the frame the path shape appears on */
  side?: FrameSide;
  /**
   * Where the path shape sits along that side. `start` and `end` pin it to a
   * corner, so a shape can swallow the corner and hand the frame a new one.
   */
  shapeAlign?: FrameShapeAlign;
  /**
   * Center coordinate of the path shape along its edge, measured from that
   * edge's logical start. Overrides `shapeAlign` when provided.
   */
  shapeOffset?: number;
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
  (
    {
      children,
      className,
      styles,
      style,
      path,
      pathWidth = 0,
      side = "top",
      shapeAlign = "center",
      shapeOffset,
      shapeMode = "indent",
      pathStroke = "solid",
      edges = "all",
      strokeAlign = "center",
      ...props
    },
    ref,
  ) => {
    const maskId = useId();
    const shapeMaskId = `shape-${maskId}`;
    const borderMaskId = `border-${maskId}`;
    const inkMaskId = `ink-${maskId}`;
    const capStartId = `cap-start-${maskId}`;
    const capEndId = `cap-end-${maskId}`;

    const indent = shapeMode === "indent";

    const strokeDashProps: {
      strokeDasharray?: string;
      strokeLinecap?: React.SVGAttributes<SVGElement>["strokeLinecap"];
    } =
      pathStroke === "dashed"
        ? { strokeDasharray: "8 4" }
        : pathStroke === "dotted"
          ? { strokeDasharray: "2 4", strokeLinecap: "round" }
          : {};

    // The authored curve is open; closing it back along its baseline turns it
    // into a fillable region. The closing edge runs a hair past the baseline so
    // the region overlaps the frame body it is unioned with (extend) or
    // overshoots the edge it is subtracted from (indent). It closes at
    // `pathWidth` rather than wherever the curve stopped, so a shape that ends
    // partway down an adjoining edge still closes along the edge it started on.
    const shapeRegion = path
      ? `${path} L ${pathWidth} ${SEAM_OVERLAP} L 0 ${SEAM_OVERLAP} Z`
      : undefined;

    // Region masked out of the border stroke when only one edge is kept.
    // Starts past the corner radius so the kept edge retains its corner arcs.
    const edgeMaskStyle: React.CSSProperties | null =
      edges === "all"
        ? null
        : {
            top: { x: "-10%", y: "var(--frame-radius)", width: "120%", height: "120%" },
            bottom: {
              x: "-10%",
              y: "-10%",
              width: "120%",
              height: "calc(110% - var(--frame-radius))",
            },
            left: { x: "var(--frame-radius)", y: "-10%", width: "120%", height: "120%" },
            right: {
              x: "-10%",
              y: "-10%",
              width: "calc(110% - var(--frame-radius))",
              height: "120%",
            },
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
        style={
          {
            "--frame-stroke-offset": STROKE_ALIGN_OFFSET[strokeAlign],
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Fill layer. Below the children, because it is their background. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            {/* The frame's silhouette: its body with the shape subtracted
                (indent) or added (extend). Masks the fill and the content
                alike, so background and children share one outline. */}
            <mask id={shapeMaskId} {...MASK_REGION}>
              <rect width="100%" height="100%" fill="white" className={css.shape} />
              {edgeShapeProps && <rect fill="white" {...edgeShapeProps} />}
              {shapeRegion && (
                <ShapeLayer
                  side={side}
                  align={shapeAlign}
                  shapeOffset={shapeOffset}
                  pathWidth={pathWidth}
                  mirror={indent}
                >
                  <path d={shapeRegion} fill={indent ? "black" : "white"} />
                </ShapeLayer>
              )}
            </mask>
          </defs>

          <rect
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            fill="var(--fill, transparent)"
            mask={`url(#${shapeMaskId})`}
          />
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

        {/* Outline layer, above the children. The border straddles the
            silhouette's edge, so anything painted after it eats its inner half:
            an opaque child left a centred stroke reading 1px and a transparent
            one left it reading 2px, from the same stroke. Painting it last
            makes every `strokeAlign` behave the same whatever the children do. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            {/* Runs the outline past its endpoints along the path's own
                tangent, so a shape that leaves the edge on a curve is carried
                into the border it meets rather than stopping square across it.
                `markerUnits="strokeWidth"` scales the overrun with the border,
                and `overflow="visible"` is what lets it reach outside the
                marker's nominal 1x1 viewport. */}
            <marker
              id={capStartId}
              markerUnits="strokeWidth"
              orient="auto"
              refX="0"
              refY="0"
              markerWidth="1"
              markerHeight="1"
              overflow="visible"
            >
              <rect x={-CAP_OVERRUN} y={-0.5} width={CAP_OVERRUN} height={1} fill="white" />
            </marker>
            <marker
              id={capEndId}
              markerUnits="strokeWidth"
              orient="auto"
              refX="0"
              refY="0"
              markerWidth="1"
              markerHeight="1"
              overflow="visible"
            >
              <rect x={0} y={-0.5} width={CAP_OVERRUN} height={1} fill="white" />
            </marker>

            {/* The border, minus everything the shape's region replaces — which
                the shape's own outline strokes instead. Cutting by the region
                rather than by a strip across the mouth is what lets a shape
                take a corner with it: whatever the region swallows, it also
                owns the border for. */}
            <mask id={borderMaskId} {...MASK_REGION}>
              <rect x="-100%" y="-100%" width="300%" height="300%" fill="white" />
              {edgeMaskStyle && <rect fill="black" style={edgeMaskStyle} />}
              {shapeRegion && (
                <ShapeLayer
                  side={side}
                  align={shapeAlign}
                  shapeOffset={shapeOffset}
                  pathWidth={pathWidth}
                  mirror={indent}
                >
                  <path
                    d={shapeRegion}
                    fill="black"
                    stroke="black"
                    strokeLinejoin="round"
                    className={css.cut}
                  />
                </ShapeLayer>
              )}
            </mask>

            {/* Where the outline is, as coverage rather than as colour. The
                border and the shape are two paths meeting end to end, and a
                translucent stroke laid twice over the same pixel composites
                brighter than one laid once — so they abut at a knot however
                well they are aligned. Collecting both into a mask and colouring
                it once removes the arithmetic that made the knot, and with it
                the need for the two to meet on an exact line. */}
            <mask id={inkMaskId} {...MASK_REGION}>
              {/* Inset by the stroke offset so `strokeAlign` moves the border
                  line and the shape welded to it together. */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="none"
                stroke="white"
                mask={`url(#${borderMaskId})`}
                className={cn(css.shape, css.stroke)}
                style={
                  {
                    x: "var(--frame-stroke-offset)",
                    y: "var(--frame-stroke-offset)",
                    width: "calc(100% - var(--frame-stroke-offset) * 2)",
                    height: "calc(100% - var(--frame-stroke-offset) * 2)",
                  } as React.CSSProperties
                }
                {...strokeDashProps}
              />
              {path && (
                <ShapeLayer
                  side={side}
                  align={shapeAlign}
                  shapeOffset={shapeOffset}
                  pathWidth={pathWidth}
                  mirror={indent}
                >
                  <path
                    d={path}
                    fill="none"
                    stroke="white"
                    className={css.stroke}
                    markerStart={`url(#${capStartId})`}
                    markerEnd={`url(#${capEndId})`}
                    {...strokeDashProps}
                  />
                </ShapeLayer>
              )}
            </mask>
          </defs>

          <rect
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            fill="var(--stroke-color, var(--background-700))"
            mask={`url(#${inkMaskId})`}
          />
        </svg>
      </div>
    );
  },
);

Frame.displayName = "Frame";

export { Frame };
