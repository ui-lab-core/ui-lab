import * as React from "react";

import { cn } from "@/lib/utils";
import css from "./Skeleton.module.css";

export type SkeletonDimension = React.CSSProperties["width"];
export type SkeletonTextSize = "body" | "heading" | "display";

export const SKELETON_TEXT_GEOMETRY = {
  body: { rowHeight: 12, gap: 6 },
  heading: { rowHeight: 20, gap: 8 },
  display: { rowHeight: 32, gap: 10 },
} as const satisfies Record<SkeletonTextSize, { rowHeight: number; gap: number }>;

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the placeholder. Numeric values are pixels. */
  w?: SkeletonDimension;
  /** Height of the placeholder. Numeric values are pixels. */
  h?: React.CSSProperties["height"];
}

type SkeletonTextRowMode =
  | { lines?: number; h?: never }
  | { lines?: never; h?: number };

export type SkeletonTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> &
  SkeletonTextRowMode & {
    /** Semantic row geometry. Body text defaults to three rows; heading and display default to one. */
    size?: SkeletonTextSize;
    /** Width available to each full row. Numeric values are pixels. */
    w?: SkeletonDimension;
    /** Width of the final row when more than one row is rendered. */
    lastLineWidth?: SkeletonDimension;
    /** Multiplies row thickness and gap without changing width. Invalid values fall back to 1. */
    scale?: number;
  };

export interface SkeletonImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Width of the media placeholder. Numeric values are pixels. */
  w?: SkeletonDimension;
  /** Explicit height. When present, it takes precedence over ratio. */
  h?: React.CSSProperties["height"];
  /** CSS aspect ratio used when no explicit height is supplied. */
  ratio?: React.CSSProperties["aspectRatio"];
}

function normalizeScale(scale: number | undefined): number {
  return typeof scale === "number" && Number.isFinite(scale) && scale > 0
    ? scale
    : 1;
}

function normalizeLines(lines: number): number {
  if (!Number.isFinite(lines)) return 1;
  return Math.max(1, Math.floor(lines));
}

export function getSkeletonTextRowCount(
  height: number,
  size: SkeletonTextSize = "body",
  scale = 1,
): number {
  const resolvedScale = normalizeScale(scale);
  const geometry = SKELETON_TEXT_GEOMETRY[size];
  const rowHeight = geometry.rowHeight * resolvedScale;
  const gap = geometry.gap * resolvedScale;
  const finiteHeight = Number.isFinite(height) ? Math.max(0, height) : 0;

  return Math.max(1, Math.floor((finiteHeight + gap) / (rowHeight + gap)));
}

function dimensionStyle(
  style: React.CSSProperties | undefined,
  w: SkeletonDimension | undefined,
  h: React.CSSProperties["height"] | undefined,
): React.CSSProperties {
  return {
    ...(w !== undefined ? { width: w } : null),
    ...(h !== undefined ? { height: h } : null),
    ...style,
  };
}

const SkeletonRoot = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      style,
      w,
      h,
      "aria-hidden": ariaHidden = true,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn("skeleton", css.shape, css.rectangle, className)}
      style={dimensionStyle(style, w, h)}
      aria-hidden={ariaHidden}
      {...props}
    />
  ),
);
SkeletonRoot.displayName = "Skeleton";

/** Repeated decorative rows for body, heading, or display text placeholders. */
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      className,
      style,
      size = "body",
      lines,
      h,
      w,
      lastLineWidth,
      scale,
      "aria-hidden": ariaHidden = true,
      ...props
    },
    ref,
  ) => {
    const resolvedScale = normalizeScale(scale);
    const heightMode = lines === undefined && typeof h === "number";
    const rowCount =
      lines !== undefined
        ? normalizeLines(lines)
        : heightMode
          ? getSkeletonTextRowCount(h, size, resolvedScale)
          : size === "body"
            ? 3
            : 1;
    const geometry = SKELETON_TEXT_GEOMETRY[size];
    const geometryStyle = heightMode
      ? ({
          "--row-height": `${geometry.rowHeight}px`,
          "--gap": `${geometry.gap}px`,
        } as React.CSSProperties)
      : undefined;
    const wrapperStyle = {
      ...(w !== undefined ? { width: w } : null),
      ...(heightMode ? { height: h } : null),
      ...style,
      "--scale": resolvedScale,
      ...geometryStyle,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn("skeleton-text", css.text, className)}
        data-size={size}
        data-height-derived={heightMode ? "true" : undefined}
        style={wrapperStyle}
        aria-hidden={ariaHidden}
        {...props}
      >
        {Array.from({ length: rowCount }, (_, index) => {
          const isShortFinalRow = rowCount > 1 && index === rowCount - 1;
          return (
            <span
              key={index}
              className={cn(
                "skeleton",
                "skeleton-text-row",
                css.shape,
                css.row,
                isShortFinalRow && css.lastRow,
              )}
              style={
                isShortFinalRow && lastLineWidth !== undefined
                  ? { width: lastLineWidth }
                  : undefined
              }
            />
          );
        })}
      </div>
    );
  },
);
SkeletonText.displayName = "Skeleton.Text";

/** Decorative media placeholder with an explicit size or aspect ratio. */
const SkeletonImage = React.forwardRef<HTMLDivElement, SkeletonImageProps>(
  (
    {
      className,
      style,
      w,
      h,
      ratio,
      "aria-hidden": ariaHidden = true,
      ...props
    },
    ref,
  ) => {
    const imageStyle = {
      ...(w !== undefined ? { width: w } : null),
      ...(h !== undefined
        ? { height: h, aspectRatio: "auto" }
        : ratio !== undefined
          ? { aspectRatio: ratio }
          : null),
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn("skeleton", "skeleton-image", css.shape, css.image, className)}
        style={imageStyle}
        aria-hidden={ariaHidden}
        {...props}
      />
    );
  },
);
SkeletonImage.displayName = "Skeleton.Image";

const Skeleton = Object.assign(SkeletonRoot, {
  Text: SkeletonText,
  Image: SkeletonImage,
});

export { Skeleton, SkeletonText, SkeletonImage };
