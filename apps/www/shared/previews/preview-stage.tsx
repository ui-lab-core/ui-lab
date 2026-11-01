"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { PreviewFrame } from "@ui-lab-core/library/preview-frame";
import { cn } from "../lib/cn";

/** Smallest width the preview can be dragged to, roughly a compact phone. */
const MIN_PREVIEW_WIDTH = 240;

/**
 * Hosts with a definite height (fixed-height cards, the workspace and inbox
 * panes, sidebar thumbnails) spread this onto the element that bounds the
 * stage. Ratio stages then shrink to fit it, and height floors never exceed
 * it. Without it, a ratio stage is capped to most of the viewport height.
 */
export const previewHostStyle = {
  containerType: "size",
  "--preview-frame-max-height": "calc(100cqh - 2rem)",
  "--preview-frame-fit-height": "100cqh",
} as CSSProperties;

/** The tallest a shaped preview box gets, so a tall ratio never outgrows the viewport. */
const SHAPE_MAX_HEIGHT = "80svh";

/**
 * Sizes the visible preview box (the bordered card) from the entry's
 * `aspectRatio` instead of a fixed height. `host` goes on the box that holds
 * the stage: it takes its height from the ratio, up to most of the viewport.
 *
 * By default the card spans its host's width, so it lines up with whatever it
 * is attached to (the code block under it on the site); once the height cap
 * is reached, the stage inside keeps the shape. With `fit`, `card` narrows the
 * card to the shape itself, for cards that stand alone. `aside` is the width
 * of anything beside the shaped area, like the controls.
 */
export function previewShapeStyle(
  aspectRatio: NonNullable<PreviewFrame["aspectRatio"]>,
  { fit = false, aside }: { fit?: boolean; aside?: string } = {},
): { host: CSSProperties; card?: CSSProperties } {
  return {
    host: { aspectRatio, maxHeight: SHAPE_MAX_HEIGHT },
    card: fit
      ? {
          width: `min(100%, calc(${SHAPE_MAX_HEIGHT} * ${aspectRatio}${aside ? ` + ${aside}` : ""}))`,
          marginInline: "auto",
        }
      : undefined,
  };
}

/**
 * The one container every host renders a live preview into, so an entry looks
 * the same on the site, the Workshop examples, and the workspace. It reads the
 * entry's resolved `PreviewFrame` (from `resolvePreviewFrame`):
 *
 * - `maxWidth` caps the stage, centered horizontally.
 * - `aspectRatio` keeps the stage's shape, fitted inside the host.
 * - `minHeight` is the stage's height floor, never taller than the host.
 * - `inset` pads the stage.
 * - `layout` centers the example (`center`), stacks it from the top (`start`),
 *   or stretches it across the stage, centered vertically (`stretch`).
 * - `fill` stretches the example to the stage.
 * - `resizable` shows a handle that drags the width in from the right edge;
 *   double-click resets it.
 *
 * The stage fills its host and centers the example inside it.
 */
export function PreviewStage({
  frame,
  children,
  className,
}: {
  frame: PreviewFrame;
  children: ReactNode;
  className?: string;
}) {
  const { layout, maxWidth, aspectRatio, minHeight, inset, fill, resizable } = frame;
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, width: 0 });

  useEffect(() => {
    if (!dragging) return;
    const parent = boxRef.current?.parentElement;
    const move = (event: globalThis.PointerEvent) => {
      const max = parent?.clientWidth ?? Number.POSITIVE_INFINITY;
      const delta = event.clientX - start.current.x;
      // The box grows from both sides, so the right handle moves the edge at
      // half the width change while the preview remains centered.
      const next = start.current.width + delta * 2;
      setWidth(Math.round(Math.max(MIN_PREVIEW_WIDTH, Math.min(next, max))));
    };
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [dragging]);

  const startDrag = (event: ReactPointerEvent) => {
    event.preventDefault();
    const measured = Math.round(boxRef.current?.getBoundingClientRect().width ?? 0);
    start.current = { x: event.clientX, width: measured };
    setWidth(measured);
    setDragging(true);
  };

  return (
    <div
      className={cn("group/resize relative flex h-full min-h-0 w-full min-w-0 flex-col", className)}
      style={{
        minHeight:
          minHeight && !aspectRatio
            ? `min(${minHeight}px, var(--preview-frame-fit-height, ${minHeight}px))`
            : undefined,
      }}
    >
      <div
        ref={boxRef}
        className={cn(
          "relative mx-auto flex min-w-[min(100%,15rem)] max-w-full flex-col",
          aspectRatio ? "my-auto shrink-0" : "w-full flex-1",
        )}
        style={{
          maxWidth,
          ...(aspectRatio
            ? {
                aspectRatio,
                // Fit the shape inside the host's height as well as its width.
                width: `min(100%, calc(var(--preview-frame-max-height, 80svh) * ${aspectRatio}))`,
              }
            : {}),
          ...(width === null ? {} : { width }),
        }}
      >
        <div
          data-preview-frame
          className={cn(
            "flex min-w-0 flex-1 text-start",
            aspectRatio && "min-h-0 overflow-auto",
            layout === "start"
              ? "flex-col"
              : layout === "stretch"
                ? "flex-col justify-center-safe"
                : fill
                ? "flex-col items-stretch"
                : "items-center-safe justify-center-safe",
          )}
          style={{ padding: inset || undefined }}
        >
          {children}
        </div>
        {resizable && dragging && width !== null ? (
          <span className="pointer-events-none absolute right-2 top-2 z-10 rounded font-mono px-1.5 py-0.5 text-xs font-medium text-foreground-400">
            {width}px
          </span>
        ) : null}
        {resizable ? (
          <button
            type="button"
            onPointerDown={startDrag}
            onDoubleClick={() => setWidth(null)}
            title="Drag to resize · double-click to reset"
            aria-label="Resize preview width"
            className={cn(
              "group/handle absolute inset-y-0 right-0 z-10 flex w-4 cursor-ew-resize touch-none items-center justify-center opacity-0 transition-opacity group-hover/resize:opacity-100",
              dragging && "opacity-100!",
            )}
          >
            <span
              className={cn(
                "h-10 w-1 rounded-full bg-background-600 transition-colors group-hover/handle:bg-background-500/80",
                dragging && "bg-background-500! group-hover/handle:bg-background-500!",
              )}
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
