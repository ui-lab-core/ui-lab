"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Scroll } from "ui-lab-components/scroll";

/** Past this many pixels a mouse press becomes a drag rather than a card click. */
const DRAG_THRESHOLD = 5;
/**
 * Momentum time constant. The release velocity (scroll px/ms) is projected this
 * many ms forward to choose the card a flick coasts to — tuned so a gentle flick
 * carries one card and a hard flick two.
 */
const MOMENTUM_TAU = 220;

/** Match native snapping: edge cards align outward, interior cards center. */
function getCarouselTargets(rail: HTMLDivElement, cards: Array<HTMLElement | null>) {
  const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
  return cards.flatMap((card, index) => {
    if (!card) return [];
    if (index === 0) return [0];
    if (index === cards.length - 1) return [max];
    return [
      Math.max(0, Math.min(card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2, max)),
    ];
  });
}

/**
 * Compact horizontal carousel: arrow controls, optional position indicator,
 * native snapping, and mouse drag with momentum. Each child is one snap item.
 */
export function Carousel({
  children,
  className = "",
  label,
  toolbar,
  showIndicator = false,
  controlsClassName = "mr-4",
  itemClassName = "w-[min(24rem,calc(100vw-3rem))]",
  railClassName = "",
  gapClassName = "gap-6 pt-3 sm:gap-10",
}: {
  children: ReactNode[];
  label: string;
  /** Rendered at the start of the controls row, opposite the arrows. */
  toolbar?: ReactNode;
  className?: string;
  controlsClassName?: string;
  itemClassName?: string;
  railClassName?: string;
  gapClassName?: string;
  showIndicator?: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [indicator, setIndicator] = useState({ count: 1, active: 0 });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !showIndicator) return;

    const update = () => {
      const stops = [...new Set(getCarouselTargets(rail, cardRefs.current))];
      const active = stops.reduce(
        (best, stop, index) =>
          Math.abs(stop - rail.scrollLeft) < Math.abs(stops[best] - rail.scrollLeft) ? index : best,
        0,
      );
      setIndicator((previous) =>
        previous.count === stops.length && previous.active === active
          ? previous
          : { count: stops.length, active },
      );
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => {
      rail.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [showIndicator, children]);
  /**
   * The scroll position we last committed to. Rapid clicks must step from here,
   * not from live `scrollLeft`, which lags behind an in-flight smooth animation
   * and would otherwise make every click before the animation settles resolve to
   * the same target. `null` means "no pending move" — fall back to real scroll.
   */
  const committedRef = useRef<number | null>(null);

  /**
   * Navigate by real geometry rather than a tracked index. Each card's landing
   * spot matches its native snap alignment, clamped to the rail's scroll range.
   * Stepping past duplicate targets keeps navigation from stalling at the ends.
   */
  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const current = Math.min(committedRef.current ?? rail.scrollLeft, maxScrollLeft);
    const EPSILON = 1;

    const targets = getCarouselTargets(rail, cardRefs.current);

    const next =
      direction === 1
        ? (targets.find((target) => target > current + EPSILON) ?? 0)
        : (targets.reduceRight<number | null>(
            (found, target) => (found === null && target < current - EPSILON ? target : found),
            null,
          ) ?? maxScrollLeft);

    committedRef.current = next;
    rail.scrollTo({ left: next, behavior: "smooth" });
  };

  // Drop the committed target once the rail settles or the user scrolls it
  // themselves, so the next move steps from wherever it actually landed.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reset = () => {
      committedRef.current = null;
    };

    rail.addEventListener("scrollend", reset);
    rail.addEventListener("pointerdown", reset);
    rail.addEventListener("wheel", reset, { passive: true });

    return () => {
      rail.removeEventListener("scrollend", reset);
      rail.removeEventListener("pointerdown", reset);
      rail.removeEventListener("wheel", reset);
    };
  }, []);

  /**
   * Click-and-drag navigation. All per-frame work is a direct `scrollLeft` write
   * (no React state, so no re-renders — the browser composites the scroll), with
   * snap disabled while dragging so nothing fights the pointer and re-armed on the
   * settle. Touch and pen keep native scrolling, which already has real momentum
   * and snapping; only mouse — which can't drag-scroll on its own — is taken over.
   */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let latestX = 0; // most recent pointer X; applied by the rAF loop
    let frameScroll = 0; // scrollLeft at the previous frame, for velocity
    let frameTime = 0;
    let velocity = 0; // scroll px per ms, signed with scrollLeft
    let frame: number | null = null;
    let dragging = false; // threshold crossed; scrollLeft is being driven
    let moved = false; // a real drag happened; swallow the trailing click
    // The card grabbed to start the drag. Pointer capture moves hover off it, so it
    // is marked held to keep its panel open until the rail settles on the next one.
    let held: HTMLElement | null = null;

    const release = () => {
      held?.removeAttribute("data-held");
      held = null;
    };

    // Apply the latest pointer position once per display frame. Driving the write
    // from rAF (compositor-paced) instead of from pointermove ties the motion to
    // the monitor's refresh rate rather than the ~60Hz pointer-event cadence, so
    // it stays fluid on 120/144Hz+ panels.
    const step = (now: number) => {
      if (!dragging) {
        frame = null;
        return;
      }
      rail.scrollLeft = startScroll - (latestX - startX);
      const scroll = rail.scrollLeft; // read back the clamped value
      const dt = now - frameTime;
      if (dt > 0) velocity = (scroll - frameScroll) / dt;
      frameScroll = scroll;
      frameTime = now;
      frame = requestAnimationFrame(step);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      latestX = event.clientX;
      startScroll = rail.scrollLeft;
      velocity = 0;
      dragging = false;
      moved = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) return;

      if (!dragging) {
        if (Math.abs(event.clientX - startX) < DRAG_THRESHOLD) return;
        dragging = true;
        moved = true;
        held = cardRefs.current.find((card) => card?.contains(event.target as Node)) ?? null;
        held?.setAttribute("data-held", "");
        rail.setPointerCapture(pointerId);
        rail.style.scrollSnapType = "none";
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
        frameScroll = rail.scrollLeft;
        frameTime = event.timeStamp;
        frame = requestAnimationFrame(step);
      }

      latestX = event.clientX; // the rAF loop reads this each frame
    };

    const onPointerUp = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      if (rail.hasPointerCapture(pointerId)) rail.releasePointerCapture(pointerId);
      const wasDragging = dragging;
      pointerId = null;
      dragging = false;
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      if (!wasDragging) return; // a plain click — leave the link alone

      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      // Project the flick forward and land on the nearest card offset (the same
      // snap targets the arrow buttons use), then animate a single smooth settle.
      const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const projected = Math.max(
        0,
        Math.min(maxScrollLeft, rail.scrollLeft + velocity * MOMENTUM_TAU),
      );
      const targets = getCarouselTargets(rail, cardRefs.current);
      const target = targets.reduce(
        (best, candidate) =>
          Math.abs(candidate - projected) < Math.abs(best - projected) ? candidate : best,
        targets[0] ?? 0,
      );

      committedRef.current = target;
      if (Math.abs(target - rail.scrollLeft) < 1) {
        rail.style.scrollSnapType = ""; // already parked; re-arm snap now
        release();
      } else {
        rail.scrollTo({ left: target, behavior: "smooth" }); // scrollend re-arms snap
      }
    };

    // Snap stays off through the smooth settle; restore it once the rail parks.
    // `scrollend` also fires when the pointer merely pauses mid-drag, so ignore
    // it while dragging — re-arming snap then would jump the content to a card
    // under the still-held cursor.
    const onScrollEnd = () => {
      if (dragging) return;
      rail.style.scrollSnapType = "";
      release();
    };

    // Kill the browser's native link/image drag while a mouse gesture is live.
    const onDragStart = (event: Event) => {
      if (pointerId !== null) event.preventDefault();
    };

    // After a drag, swallow the click the pointer sequence would fire on the card.
    const onClick = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };

    rail.addEventListener("pointerdown", onPointerDown);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerup", onPointerUp);
    rail.addEventListener("pointercancel", onPointerUp);
    rail.addEventListener("dragstart", onDragStart);
    rail.addEventListener("scrollend", onScrollEnd);
    rail.addEventListener("click", onClick, true);

    return () => {
      rail.removeEventListener("pointerdown", onPointerDown);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerup", onPointerUp);
      rail.removeEventListener("pointercancel", onPointerUp);
      rail.removeEventListener("dragstart", onDragStart);
      rail.removeEventListener("scrollend", onScrollEnd);
      rail.removeEventListener("click", onClick, true);
      if (frame !== null) cancelAnimationFrame(frame);
      release();
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div className={className}>
      <div className={`mb-3 ${controlsClassName} flex items-center justify-end gap-2`}>
        {toolbar && <div className="mr-auto min-w-0">{toolbar}</div>}
        {showIndicator && (
          <div
            role="img"
            aria-label={`Carousel position ${indicator.active + 1} of ${indicator.count}`}
            className="ml-6 mr-auto flex items-center gap-1.5"
          >
            {Array.from({ length: indicator.count }, (_, index) => (
              <span
                key={index}
                className={`h-1 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                  index === indicator.active ? "w-8 bg-foreground-300" : "w-2 bg-background-700"
                }`}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label={`Previous ${label} item`}
          className="grid size-10 place-items-center rounded-sm border border-background-700 text-foreground-300 transition-colors hover:bg-background-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200"
        >
          <ChevronLeft aria-hidden size={15} />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label={`Next ${label} item`}
          className="grid size-10 place-items-center rounded-sm border border-background-700 text-foreground-300 transition-colors hover:bg-background-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200"
        >
          <ChevronRight aria-hidden size={15} />
        </button>
      </div>

      <Scroll
        viewport-ref={railRef}
        direction="horizontal"
        fade-x
        fade-distance={8}
        fade-size={12}
        aria-label={label}
        styles={{
          content: `flex cursor-grab snap-x snap-mandatory ${gapClassName} pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${railClassName}`,
          track: "hidden",
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className={`${itemClassName} shrink-0 snap-center first:snap-start last:snap-end`}
          >
            {child}
          </div>
        ))}
      </Scroll>
    </div>
  );
}
