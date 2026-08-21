"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Card } from "ui-lab-components/card";
import { Scroll } from "ui-lab-components/scroll";
import { Skeleton } from "ui-lab-components/skeleton";
import { elementPreviews } from "@/gallery/element-previews";
import { patternPreviews } from "@/gallery/pattern-previews";
import { sectionPreviews } from "@/gallery/section-previews";
import { getPreviewComponent as getStarterPreview } from "@/features/starters";
import { Section } from "./section";

/**
 * How each plate is drawn. `bare` floats the preview alone on the plate; `card`
 * dresses every preview as a miniature Workshop card — an inset media well over a
 * `Card.Body` whose title and description are stood in for by Skeletons.
 */
type PlateVariant = "bare" | "card";

type Kind = {
  title: string;
  href: string;
  desc: string;
  /** Where the plane sits in the well. Sized so every kind's plates come out alike. */
  plane: string;
  /** The plane the plates sit on: columns and rows of the drawn arrangement. */
  grid: string;
  /** Plate placements, listed front to back — the first one is nearest the viewer. */
  plates: string[];
  plateClass?: string;
  /** How the preview is sized and scaled inside its plate. */
  previewClass?: string;
  /** The plate treatment for this domain. Defaults to `bare`. */
  plateVariant?: PlateVariant;
  previews: React.ComponentType<object>[];
};

const kinds: Kind[] = [
  {
    title: "Patterns",
    href: "/workshop/patterns",
    desc: "Small compositions that recur everywhere — stat tiles, empty states, media objects.",
    plane: "left-[6%] right-[-2%] top-[2%] h-[94%]",
    grid: "grid-cols-4 grid-rows-3",
    /** Rendered at a fixed width and scaled down, so the preview keeps its own proportions. */
    previewClass: "w-[200px] [&>*]:scale-[0.42]",
    plateVariant: "card",
    plates: [
      "col-start-1 row-start-1 translate-y-4",
      "col-start-2 row-start-1",
      "col-start-3 row-start-1",
      "col-start-4 row-start-1 translate-y-4",
      "col-start-1 row-start-2 translate-y-4",
      "col-start-2 row-start-2",
      "col-start-3 row-start-2",
      "col-start-4 row-start-2 translate-y-4",
      "col-start-1 row-start-3 translate-y-4",
      "col-start-2 row-start-3",
      "col-start-3 row-start-3",
      "col-start-4 row-start-3 translate-y-4",
    ],
    previews: [
      patternPreviews["media-object"],
      patternPreviews["stat-block"],
      patternPreviews["search-input"],
      patternPreviews["toggle-setting-row"],
      patternPreviews["progress-metric"],
      patternPreviews["button-group-pattern"],
      patternPreviews["split-row"],
      patternPreviews["labeled-field"],
      patternPreviews["select-row"],
      patternPreviews["badge-row"],
      patternPreviews["data-table-row"],
      patternPreviews["icon-action-bar"],
    ],
  },
  {
    title: "Elements",
    href: "/workshop/elements",
    desc: "Larger assemblies: data tables, command palettes, settings panels, wired and accessible.",
    plane: "left-[8%] right-[-4%] top-[11%] h-[88%]",
    grid: "grid-cols-6 grid-rows-2",
    plates: [
      "col-start-2 col-span-2 row-start-1",
      "col-start-4 col-span-2 row-start-1",
      "col-start-1 col-span-2 row-start-2",
      "col-start-3 col-span-2 row-start-2",
      "col-start-5 col-span-2 row-start-2",
    ],
    previews: [
      elementPreviews.header,
      elementPreviews.page,
      elementPreviews.sidebar,
      elementPreviews.carousel,
      elementPreviews.timeline,
    ],
  },
  {
    title: "Sections",
    href: "/workshop/sections",
    desc: "Whole page sections, composed and ready to drop into a route.",
    plane: "left-[22%] right-[10%] top-[11%] h-[88%]",
    grid: "grid-cols-2 grid-rows-3",
    plates: [
      "col-start-1 row-start-1",
      "col-start-2 row-start-1",
      "col-start-1 row-start-2",
      "col-start-2 row-start-2",
      "col-start-1 row-start-3",
      "col-start-2 row-start-3",
    ],
    previews: [
      sectionPreviews.hero,
      sectionPreviews["hero-with-stats"],
      sectionPreviews.cta,
      sectionPreviews.features,
      sectionPreviews.pricing,
      sectionPreviews.testimonials,
    ],
  },
  {
    title: "Starters",
    href: "/workshop/starters",
    desc: "Project shells already wired to the system, with routing and layout in place.",
    plane: "left-[16%] right-[4%] top-[11%] h-[88%]",
    grid: "grid-cols-1 grid-rows-2",
    plates: ["col-start-1 row-start-1", "col-start-1 row-start-2"],
    previews: [getStarterPreview("nextjs-basic")!, getStarterPreview("vite-react")!],
  },
];

/**
 * Level with the card, not with the plane: skewing the fade tipped it visibly. The
 * upper half stays fully lit; the lower half recedes into the well without hiding rows.
 */
const wellFade =
  "linear-gradient(180deg, #000 0%, #000 58%, rgb(0 0 0 / 0.42) 82%, transparent 100%)";

/** Past this many pixels a mouse press becomes a drag rather than a card click. */
const DRAG_THRESHOLD = 5;
/**
 * Momentum time constant. The release velocity (scroll px/ms) is projected this
 * many ms forward to choose the card a flick coasts to — tuned so a gentle flick
 * carries one card and a hard flick two.
 */
const MOMENTUM_TAU = 220;
/** Card media: representative Workshop previews, arranged as cards receding into the well. */
function PreviewPlates({
  plane,
  grid,
  plates,
  plateClass,
  previewClass,
  plateVariant = "bare",
  previews,
}: Pick<
  Kind,
  "plane" | "grid" | "plates" | "plateClass" | "previewClass" | "plateVariant" | "previews"
>) {
  return (
    <div className="relative h-96 overflow-hidden bg-background-1000 md:h-104">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ maskImage: wellFade, WebkitMaskImage: wellFade }}
      >
        <div className={`absolute ${plane}`}>
          <div className={`absolute inset-0 grid origin-bottom-left gap-2 ${grid}`}>
            {plates.map((placement, index) => {
              const Preview = previews[index];

              const preview = (
                <div className="relative size-full overflow-hidden">
                  <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${previewClass ?? "size-full [&>*]:size-full [&>*]:scale-[0.75]"}`}
                  >
                    <Preview />
                  </div>
                </div>
              );

              if (plateVariant === "card") {
                return (
                  <Card
                    key={placement}
                    className={`flex min-h-0 flex-col rounded-sm border-background-700 bg-background-1000 shadow-lg ${placement}`}
                    style={{ zIndex: plates.length - index }}
                  >
                    <div className="relative min-h-0 flex-1 overflow-hidden">{preview}</div>
                    <Card.Body className="flex bg-background-950 shrink-0 flex-col gap-1 border-t border-background-700 !px-2.5 !py-1.5">
                      <Skeleton h={4} w="40%" color="background-600" className="rounded-full" />
                      <Skeleton.Text
                        size="body"
                        color="background-700"
                        lines={2}
                        scale={0.4}
                        lastLineWidth="55%"
                      />
                    </Card.Body>
                  </Card>
                );
              }

              return (
                <div
                  key={placement}
                  className={`min-h-0 overflow-hidden rounded-sm border border-background-700 bg-background-950 shadow-lg ${plateClass ?? ""} ${placement}`}
                  style={{ zIndex: plates.length - index }}
                >
                  {preview}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkshopSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  /**
   * The scroll position we last committed to. Rapid clicks must step from here,
   * not from live `scrollLeft`, which lags behind an in-flight smooth animation
   * and would otherwise make every click before the animation settles resolve to
   * the same target. `null` means "no pending move" — fall back to real scroll.
   */
  const committedRef = useRef<number | null>(null);

  /**
   * Navigate by real geometry rather than a tracked index. Each card's landing
   * spot is its offset clamped to the rail's max scroll, so the trailing cards
   * that can't reach the left edge collapse onto one shared position — stepping
   * past duplicates is what keeps next/previous from ever stalling at the ends.
   */
  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const current = Math.min(committedRef.current ?? rail.scrollLeft, maxScrollLeft);
    const EPSILON = 1;

    const targets = cardRefs.current
      .map((card) => (card ? Math.min(card.offsetLeft, maxScrollLeft) : null))
      .filter((target): target is number => target !== null);

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
      const targets = cardRefs.current
        .map((card) => (card ? Math.min(card.offsetLeft, maxScrollLeft) : null))
        .filter((target): target is number => target !== null);
      const target = targets.reduce(
        (best, candidate) =>
          Math.abs(candidate - projected) < Math.abs(best - projected) ? candidate : best,
        targets[0] ?? 0,
      );

      committedRef.current = target;
      if (Math.abs(target - rail.scrollLeft) < 1) {
        rail.style.scrollSnapType = ""; // already parked; re-arm snap now
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
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <Section ground="1000" rhythm="small">
      <div className="grid pt-14 pl-12 items-center gap-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
        <h2 className="max-w-[22ch] text-3xl font-medium leading-tight tracking-normal text-foreground-100 sm:text-4xl">
          A catalog to browse, not a blank page to invent from.
        </h2>

        <div className="order-3 w-full lg:order-2">
          <p className="max-w-[44ch] text-xl leading-tight tracking-normal text-foreground-300">
            Workshop gives you proven UI building blocks, so you can move from an idea to a polished
            interface with less guesswork and more momentum.
          </p>
        </div>

        <div className="order-2 lg:order-3 lg:col-start-1">
          <Button className="rounded-full" variant="secondary" href="/workshop/patterns">
            Explore Workshop
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-3 mr-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous workshop category"
            className="grid size-10 place-items-center rounded-sm border border-background-700 text-foreground-300 transition-colors hover:bg-background-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200"
          >
            <ChevronLeft aria-hidden size={15} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next workshop category"
            className="grid size-10 place-items-center rounded-sm border border-background-700 text-foreground-300 transition-colors hover:bg-background-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200"
          >
            <ChevronRight aria-hidden size={15} />
          </button>
        </div>

        <Scroll
          viewportRef={railRef}
          direction="horizontal"
          fade-x
          fadeDistance={48}
          fadeSize={6}
          aria-label="Workshop categories"
          styles={{
            content:
              "flex cursor-grab snap-x snap-mandatory gap-3 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            track: "hidden",
          }}
        >
          {kinds.map(
            (
              {
                title,
                href,
                desc,
                plane,
                grid,
                plates,
                plateClass,
                previewClass,
                plateVariant,
                previews,
              },
              index,
            ) => (
              <Link
                key={href}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                href={href}
                className="group flex w-[min(34rem,calc(100vw-3rem))] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-background-700 transition-colors duration-200 hover:border-background-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200 md:w-[35rem] motion-reduce:transition-none"
              >
                <div aria-hidden className="pointer-events-none select-none overflow-hidden">
                  <PreviewPlates
                    plane={plane}
                    grid={grid}
                    plates={plates}
                    plateClass={plateClass}
                    previewClass={previewClass}
                    plateVariant={plateVariant}
                    previews={previews}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 border-t border-background-700 bg-background-1000 px-6 py-5">
                  <h3 className="text-lg font-semibold text-foreground-100">{title}</h3>
                  <p className="max-w-[58ch] text-md leading-6 text-foreground-400">{desc}</p>
                </div>
              </Link>
            ),
          )}
        </Scroll>
      </div>
    </Section>
  );
}
