"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/utils";

/** Smallest width the preview can be dragged to, roughly a compact phone. */
const MIN_PREVIEW_WIDTH = 240;

type PreviewLayout = "center" | "start";

/**
 * Wraps a preview so its width can be dragged in to test narrow/mobile layouts.
 * A vertical handle fades in on hover at the right edge of the (centered) preview
 * box; dragging it resizes the box symmetrically. Double-click resets to full
 * width. Default (`width === null`) stays fully responsive.
 *
 * This is the single, app-wide resize design. Do not reintroduce
 * device-preset toggles (mobile/tablet/desktop) alongside it.
 */
export function ResizablePreview({
  children,
  layout = "center",
}: {
  children: ReactNode;
  layout?: PreviewLayout;
}) {
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
    <div className="group/resize relative h-full min-h-0">
      <div
        ref={boxRef}
        className={cn("relative mx-auto h-full min-h-0 min-w-60 max-w-full")}
        style={width === null ? undefined : { width }}
      >
        <div
          className={cn(
            "grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] overflow-auto",
            layout === "start" ? "items-start" : "items-center",
          )}
        >
          <div className="min-w-0 text-center [&>*]:mx-auto [&>*]:text-start">{children}</div>
        </div>
        {dragging && width !== null ? (
          <span className="pointer-events-none absolute right-2 top-2 z-10 rounded font-mono px-1.5 py-0.5 text-xs font-medium text-foreground-400">
            {width}px
          </span>
        ) : null}
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
      </div>
    </div>
  );
}
