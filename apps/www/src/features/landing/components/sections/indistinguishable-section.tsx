"use client";

/**
 * Design note — 01, the consistency claim.
 *
 * Claim: the same screen, built by an agent with and without the system, is the
 * difference between a lookalike and the product. A skeptic believes it by watching
 * one screen become the other, so the section is a demonstration, not a diagram.
 * Rejected the first idea (two screens side by side): halving the frame crops both
 * to their sidebars, and a fair comparison you cannot read proves nothing.
 * The visual idea is one large plate carrying a single screen, driven by a timeline
 * that plays the argument beside it — the progress rail is the only motion on the
 * page, and it is the mechanism, not decoration. The eye lands on the plate, the
 * rail tells it what changed, the pill lets it go back and check.
 * Cut: the Before/After toolbar above the frame — the control belongs on the plate.
 *
 * The plate is pinned while its scroll region passes: the story needs a beat to
 * read, and a section that scrolls off with the page never gives it one. Scroll
 * distance is the scrubber, not a click target — the rail is a readout, not a
 * player.
 */

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Tabs } from "ui-lab-components/tabs";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";
import { Section } from "./section";
import { Button } from "ui-lab-components";

// The explicit `loading` is load-bearing, not cosmetic: it is what makes
// next/dynamic wrap each import in its own Suspense boundary (see
// `hasSuspenseBoundary` in next's loadable.js, and the same note in
// showcase/index.tsx). Without it these bare imports suspend up to the route
// boundary they share with <Showcase>, so mounting them cold — the instant
// `isNear` flips as this section scrolls in — tears the showcase off screen and
// bounces its selected view back through the default. A null fallback is
// enough: <Layer> already owns the crossfade, and the plate sits on its own
// background until a screen fades in.
const ShowcaseBefore = dynamic(
  () => import("../showcase-before").then((module) => module.ShowcaseBefore),
  { loading: () => null },
);
const ShowcaseAfter = dynamic(
  () => import("../showcase-after").then((module) => module.ShowcaseAfter),
  { loading: () => null },
);

/** Scroll distance given to each step while the plate is pinned. */
const VH_PER_STEP = 100;
/** Keep a visible starting nub before the reader enters the pinned sequence. */
const PILL_MIN_FILL = 0.05;
/**
 * The pin only runs where the layout it needs already exists: the two-column grid
 * starts at lg, the sticky box has to hold the 38rem plate under the header
 * without clipping (overflow isn't cropped, and mobile viewport height is
 * unstable mid-scroll besides), and a reader who asked for less motion gets the
 * plain stacked section. Every clause here is mirrored by the
 * lg:motion-safe:[@media(min-height:720px)] class chain in the markup — CSS owns
 * the layout so it is right at first paint; this string only gates listeners.
 */
const PIN_MEDIA =
  "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";

type Step = { title: string; desc: string; clean: boolean };

const steps: Step[] = [
  {
    title: "The agent improvises.",
    desc: "Nothing to reach for, so it invents: new radii, a new palette, a new idea of a card on every screen.",
    clean: false,
  },
  {
    title: "It asks the system instead.",
    desc: "UI Lab answers with the component that owns the pattern, and the tokens behind it.",
    clean: true,
  },
  {
    title: "It ships as the product.",
    desc: "Same primitives, same scale, same rules as the screens your team wrote by hand.",
    clean: true,
  },
];

const firstSlop = steps.findIndex((step) => !step.clean);
const firstClean = steps.findIndex((step) => step.clean);

/**
 * The shot is oversized on purpose: the screen runs past the plate's right edge so
 * the frame reads as a crop of a real app rather than a diagram of one.
 */
function Layer({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden transition-opacity duration-200 motion-reduce:transition-none ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-[263%] w-[263%] origin-top-left scale-[0.60] md:h-[161%] md:w-[161%] md:scale-[0.91]">
        {children}
      </div>
    </div>
  );
}

export function IndistinguishableSection() {
  // pinRef is the tall scroll region the pin plays against; contentRef is the
  // sticky box actually holding the plate and step list — its height is what
  // "spends" the pin's scroll distance, so progress is read from both
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // pin geometry, measured off the scroll path. `top` is the region's absolute
  // document offset, `scrollable` the distance the plate stays pinned for —
  // both change only when layout changes, so we cache them and let scroll ticks
  // do pure arithmetic instead of reading the DOM every frame
  const geometryRef = useRef({ top: 0, scrollable: 0 });
  // one pill exactly one phase tall, positioned and filled independently of
  // the full-height background rail
  const pillRef = useRef<HTMLSpanElement>(null);
  const isNear = useNearViewport(pinRef, { once: false });
  const [active, setActive] = useState(0);
  // the only thing this decides is whether the scroll listeners run — it moves
  // no DOM and swaps no subtree, so it is safe for it to resolve after mount.
  // The layout itself is a media query, present and correct at first paint
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(PIN_MEDIA);
    const sync = () => setPinned(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Position and fill are direct projections of progress through the active
  // phase. Clip instead of scale so the pill's rounded ends remain crisp.
  const applyPill = useCallback((position: number, fill: number) => {
    const node = pillRef.current;
    if (!node) return;
    node.style.transform = `translateY(${position * 100}%)`;
    const hidden = (1 - Math.max(PILL_MIN_FILL, fill)) * 100;
    node.style.clipPath = `inset(0 0 ${hidden}% 0 round 999px)`;
  }, []);

  // the one place layout is read: caches the region's absolute top and the
  // pinned scroll distance. Runs off the scroll path — at setup, on resize, and
  // when a ResizeObserver reports the region or its sticky content changed
  // height — so a rect read never lands inside a scroll frame
  const measure = useCallback(() => {
    const outer = pinRef.current;
    const content = contentRef.current;
    if (!outer || !content) return;
    const outerRect = outer.getBoundingClientRect();
    geometryRef.current = {
      top: outerRect.top + window.scrollY,
      scrollable: outerRect.height - content.getBoundingClientRect().height,
    };
  }, []);

  // reads how far the page has scrolled through the pinned region — 0 the
  // moment the plate sticks, 1 the moment it's about to release — so the
  // timeline is a direct readout of scroll position, never a guess at dwell time
  const computeProgress = useCallback(() => {
    // pure math against cached geometry: no getBoundingClientRect here, so a
    // scroll tick can't force a synchronous relayout of the oversized plate
    const { top, scrollable } = geometryRef.current;
    const progress =
      scrollable > 0 ? Math.min(1, Math.max(0, (window.scrollY - top) / scrollable)) : 0;
    const scaled = progress * steps.length;
    const nextActive = Math.min(steps.length - 1, Math.floor(scaled));
    const phaseProgress = Math.min(1, Math.max(0, scaled - nextActive));

    // set imperatively so scroll ticks never wait on a React render — the
    // one thing that would jank a scroll-linked animation
    applyPill(nextActive, phaseProgress);
    setActive((current) => (current === nextActive ? current : nextActive));
  }, [applyPill]);

  useEffect(() => {
    if (!isNear || !pinned) return;
    measure();
    computeProgress();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        computeProgress();
        ticking = false;
      });
    };
    // resizes remeasure first, then reproject the pill onto the new geometry
    const onResize = () => {
      measure();
      computeProgress();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // fonts loading, dynamic panels resolving, header collapsing — anything that
    // shifts the region's height invalidates the cache without a resize event
    const observer = new ResizeObserver(onResize);
    if (pinRef.current) observer.observe(pinRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [isNear, pinned, computeProgress, measure]);

  // off the pin (reduced motion, or below lg where the pin doesn't run) the
  // pill rests at the end of whichever step is active
  useEffect(() => {
    if (pinned) return;
    applyPill(active, 1);
  }, [pinned, active, applyPill]);

  // moves the page's scroll position to the step, rather than faking one —
  // the pin region stays the single source of truth for what's active
  const goToStep = useCallback(
    (index: number) => {
      // a click is off the scroll path, so a fresh read here is free — measure,
      // then aim the page at the step's midpoint through the pinned region
      measure();
      const { top, scrollable } = geometryRef.current;
      if (!pinned || scrollable <= 0) {
        setActive(index);
        return;
      }
      const progress = (index + 0.5) / steps.length;
      window.scrollTo({ top: top + progress * scrollable, behavior: "smooth" });
    },
    [pinned, measure],
  );

  const clean = steps[active].clean;

  const plate = (
    <div className="grid-paper relative min-h-[30dvh] max-h-[40rem] overflow-hidden rounded-sm border border-background-700 sm:h-[28rem] lg:h-[38rem]">
      {isNear ? (
        <>
          <Layer show={!clean}>
            <ShowcaseBefore />
          </Layer>
          <Layer show={clean}>
            <ShowcaseAfter />
          </Layer>
        </>
      ) : null}

      <div className="absolute bottom-5 left-5 z-10 w-fit rounded-full border border-background-700 bg-background-900 px-1">
        <Tabs
          value={clean ? "after" : "before"}
          onValueChange={(value) => goToStep(value === "before" ? firstSlop : firstClean)}
        >
          <Tabs.List aria-label="Screen state" styles={{ indicator: "rounded-full" }}>
            <Tabs.Trigger value="before" className="px-3 text-sm">
              Before
            </Tabs.Trigger>
            <Tabs.Trigger value="after" className="px-3 text-sm">
              After
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  );

  const argument = (
    <div className="flex flex-col justify-between gap-12">
      <div>
        <h2 className="max-w-[25ch] font-medium text-foreground-200 text-2xl">
          Give your agents the tools they need to <span>build great interfaces</span>.
        </h2>
      </div>
      <div className="grid grid-cols-[1px_minmax(0,1fr)] gap-x-5">
        <div aria-hidden className="relative h-full">
          <svg
            className="block h-full w-px text-background-700"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
          >
            <line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="currentColor"
              strokeDasharray="8 4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span
            ref={pillRef}
            className="absolute left-1/2 top-0 w-1 -translate-x-1/2 bg-foreground-200"
            style={{
              height: `calc(100% / ${steps.length})`,
              clipPath: `inset(0 0 ${(1 - PILL_MIN_FILL) * 100}% 0 round 999px)`,
              transform: "translateY(0%)",
            }}
          />
        </div>

        <ol className="flex flex-col">
          {steps.map((step, index) => {
            const current = index === active;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  aria-current={current ? "step" : undefined}
                  className="group flex w-full flex-col gap-1.5 py-3.5 text-left"
                >
                  <span
                    className={`text-md font-medium transition-colors duration-200 motion-reduce:transition-none ${
                      current
                        ? "text-foreground-50"
                        : "text-foreground-400 group-hover:text-foreground-200"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`text-sm leading-relaxed transition-colors duration-200 motion-reduce:transition-none ${
                      current ? "text-foreground-300" : "text-foreground-400/70"
                    }`}
                  >
                    {step.desc}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="max-w-[42ch] text-md leading-relaxed text-foreground-400">
        Left alone, an agent invents a visual language every time it renders a screen. UI Lab hands
        it the one your team already designs with, so what ships is the product — not a lookalike.
      </p>
    </div>
  );

  return (
    <Section ground="1000" rhythm="none">
      {/* one tree, always mounted: the tall scroll region and the sticky box are
          media queries, so the pinned layout is whatever the viewport already
          says it is — nothing swaps, nothing remounts, nothing resizes after
          hydration */}
      <div
        ref={pinRef}
        className="relative mt-12 lg:motion-safe:[@media(min-height:720px)]:h-(--pin-height)"
        style={{ "--pin-height": `${steps.length * VH_PER_STEP}vh` } as CSSProperties}
      >
        <div
          ref={contentRef}
          className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16 lg:motion-safe:[@media(min-height:720px)]:sticky lg:motion-safe:[@media(min-height:720px)]:top-(--header-height) lg:motion-safe:[@media(min-height:720px)]:h-[calc(100vh-var(--header-height))] lg:motion-safe:[@media(min-height:720px)]:items-center"
        >
          {plate}
          {argument}
        </div>
      </div>
    </Section>
  );
}
