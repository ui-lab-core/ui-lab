"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = {
  title: string;
  caption: string;
  preview: ReactNode;
  /** Let the preview fill the whole slide instead of sitting in a centered frame. */
  fill?: boolean;
};

export function ContentGallery({ items, label }: { items: GalleryItem[]; label: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const viewport = rail.current;
    if (!viewport) return;

    let pointer: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let dragging = false;
    let suppressClick = false;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (
        event.target instanceof Element &&
        event.target.closest("input, textarea, select, [contenteditable=true], [role=slider]")
      )
        return;
      pointer = event.pointerId;
      startX = lastX = event.clientX;
      startScroll = viewport.scrollLeft;
      lastTime = event.timeStamp;
      velocity = 0;
      dragging = suppressClick = false;
    };

    const onMove = (event: PointerEvent) => {
      if (pointer !== event.pointerId) return;
      if (!dragging) {
        if (Math.abs(event.clientX - startX) < 5) return;
        dragging = suppressClick = true;
        viewport.setPointerCapture(event.pointerId);
        viewport.style.scrollSnapType = "none";
        viewport.style.userSelect = "none";
        viewport.style.cursor = "grabbing";
      }
      event.preventDefault();
      const elapsed = event.timeStamp - lastTime;
      if (elapsed > 0) velocity = (lastX - event.clientX) / elapsed;
      viewport.scrollLeft = startScroll + startX - event.clientX;
      lastX = event.clientX;
      lastTime = event.timeStamp;
    };

    const finish = (event: PointerEvent) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      if (viewport.hasPointerCapture(event.pointerId))
        viewport.releasePointerCapture(event.pointerId);
      if (!dragging) return;
      dragging = false;
      viewport.style.userSelect = "";
      viewport.style.cursor = "";
      const momentum = event.timeStamp - lastTime < 100 ? velocity * 220 : 0;
      const next = Math.max(
        0,
        Math.min(
          items.length - 1,
          Math.round((viewport.scrollLeft + momentum) / viewport.clientWidth),
        ),
      );
      const target = next * viewport.clientWidth;
      if (Math.abs(target - viewport.scrollLeft) < 1) {
        viewport.style.scrollSnapType = "";
      } else {
        viewport.scrollTo({
          left: target,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }
    };

    const onScrollEnd = () => {
      if (!dragging) viewport.style.scrollSnapType = "";
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    };
    const onDragStart = (event: DragEvent) => {
      if (pointer !== null) event.preventDefault();
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("lostpointercapture", finish);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    viewport.addEventListener("scrollend", onScrollEnd);
    viewport.addEventListener("click", onClick, true);
    viewport.addEventListener("dragstart", onDragStart);
    return () => {
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("lostpointercapture", finish);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      viewport.removeEventListener("scrollend", onScrollEnd);
      viewport.removeEventListener("click", onClick, true);
      viewport.removeEventListener("dragstart", onDragStart);
      viewport.style.scrollSnapType = "";
      viewport.style.userSelect = "";
      viewport.style.cursor = "";
    };
  }, [items.length]);

  function move(direction: -1 | 1) {
    const viewport = rail.current;
    if (!viewport) return;
    const next = Math.max(0, Math.min(items.length - 1, index + direction));
    if (next === index) return;
    viewport.scrollTo({
      left: next * viewport.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <figure aria-label={label} aria-roledescription="carousel" className="mt-8 min-w-0 w-full">
      <div className="overflow-hidden rounded-lg border border-background-700">
        <div
          ref={rail}
          tabIndex={0}
          aria-label={`${label} slides`}
          className="flex w-full cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground-200"
          onScroll={(event) => {
            const viewport = event.currentTarget;
            setIndex(
              Math.max(
                0,
                Math.min(items.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)),
              ),
            );
          }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          {items.map((item, position) => (
            <div
              key={item.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${position + 1} of ${items.length}: ${item.title}`}
              aria-hidden={position !== index}
              inert={position !== index}
              className={`flex h-[32rem] min-w-0 basis-full shrink-0 grow-0 snap-start overflow-hidden ${item.fill ? "" : "items-center justify-center p-3 sm:p-8"}`}
            >
              {item.fill ? (
                <div className="size-full">{item.preview}</div>
              ) : (
                <div className="w-full max-w-[26rem] overflow-hidden rounded-md border border-background-700 bg-background-1000 shadow-sm">
                  {item.preview}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex gap-2">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                aria-label={`${direction === -1 ? "Previous" : "Next"} ${label} item`}
                aria-disabled={direction === -1 ? index === 0 : index === items.length - 1}
                onClick={() => move(direction)}
                className="grid size-10 place-items-center rounded-sm border border-background-700 text-foreground-300 transition-colors hover:bg-background-800 aria-disabled:cursor-default aria-disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200"
              >
                {direction === -1 ? (
                  <ChevronLeft size={15} aria-hidden />
                ) : (
                  <ChevronRight size={15} aria-hidden />
                )}
              </button>
            ))}
          </div>
          <span
            className="text-md tabular-nums text-foreground-300"
            aria-live="polite"
            aria-atomic="true"
          >
            {index + 1}/{items.length}
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-md text-foreground-400">
        <span className="text-foreground-200">{items[index].title}.</span> {items[index].caption}
      </figcaption>
    </figure>
  );
}
