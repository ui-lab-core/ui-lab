"use client";

import { useRef } from "react";
import type React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Scroll } from "ui-lab-components/scroll";
import { elementPreviews } from "@/gallery/element-previews";
import { patternPreviews } from "@/gallery/pattern-previews";
import { sectionPreviews } from "@/gallery/section-previews";
import { getPreviewComponent as getStarterPreview } from "@/features/starters";
import { Section } from "./section";

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
    previewClass: "w-[200px] [&>*]:scale-[0.6]",
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
/** Card media: representative Workshop previews, arranged as cards receding into the well. */
function PreviewPlates({
  plane,
  grid,
  plates,
  plateClass,
  previewClass,
  previews,
}: Pick<Kind, "plane" | "grid" | "plates" | "plateClass" | "previewClass" | "previews">) {
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

              return (
                <div
                  key={placement}
                  className={`min-h-0 overflow-hidden rounded-sm border border-background-700 bg-background-950 shadow-lg ${plateClass ?? ""} ${placement}`}
                  style={{ zIndex: plates.length - index }}
                >
                  <div className="relative size-full overflow-hidden">
                    <div
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${previewClass ?? "size-full [&>*]:size-full [&>*]:scale-[0.75]"}`}
                    >
                      <Preview />
                    </div>
                  </div>
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
  const activeIndexRef = useRef(0);

  const getScrollTarget = (index: number) => {
    const rail = railRef.current;
    const card = cardRefs.current[index];
    if (!rail || !card) return 0;

    return Math.min(card.offsetLeft, rail.scrollWidth - rail.clientWidth);
  };

  const getClosestIndex = () => {
    const rail = railRef.current;
    if (!rail) return activeIndexRef.current;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    if (rail.scrollLeft >= maxScrollLeft - 1) return kinds.length - 1;
    if (rail.scrollLeft <= 1) return 0;

    return cardRefs.current.reduce((closest, card, index) => {
      if (!card) return closest;
      const closestOffset = cardRefs.current[closest]?.offsetLeft ?? 0;
      return Math.abs(card.offsetLeft - rail.scrollLeft) < Math.abs(closestOffset - rail.scrollLeft)
        ? index
        : closest;
    }, 0);
  };

  const move = (direction: -1 | 1) => {
    const currentIndex = getClosestIndex();
    const nextIndex = (currentIndex + direction + kinds.length) % kinds.length;
    activeIndexRef.current = nextIndex;
    railRef.current?.scrollTo({ left: getScrollTarget(nextIndex), behavior: "smooth" });
  };

  return (
    <Section ground="1000" rhythm="small">
      <div className="grid pt-14 pl-8 items-center gap-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
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
              "flex snap-x snap-mandatory gap-3 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            track: "hidden",
          }}
        >
          {kinds.map(
            (
              { title, href, desc, plane, grid, plates, plateClass, previewClass, previews },
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
