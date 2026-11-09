"use client";

import { Icon } from "ui-lab-components/icon";

import type React from "react";
import Link from "next/link";
import { Button } from "ui-lab-components/button";
import { Card } from "ui-lab-components/card";
import { Carousel } from "../carousel";
import {
  elementPreviews,
  patternPreviews,
  sectionPreviews,
} from "@ui-lab-core/library/gallery-previews";
import { getPreviewComponent as getStarterPreview } from "@/features/starters";
import { Section } from "./section";

/**
 * How each plate is drawn. `bare` floats the preview alone on the plate; `card`
 * dresses every preview as a miniature Workshop card with only its media well.
 */
type PlateVariant = "bare" | "card";

type Kind = {
  preview?: React.ReactNode;
  title: string;
  href: string;
  desc: string;
  /** Icon id shown beside the title. */
  icon?: string;
  /** Leading phrase of `desc`, set in the strong foreground. */
  lead?: string;
  /** Content below the description, such as a "Works with" strip. */
  aside?: React.ReactNode;
  /** Where the plane sits in the well. Sized so every kind's plates come out alike. */
  plane?: string;
  /** The grid the plates sit on: its columns, rows and gap. */
  grid?: string;
  /** Plate placements, front to back. */
  plates?: string[];
  plateClass?: string;
  /** How the preview is sized and scaled inside its plate. `bare` and `card` plates only. */
  previewClass?: string;
  /** The plate treatment for this domain. Defaults to `bare`. */
  plateVariant?: PlateVariant;
  previews?: React.ComponentType<object>[];
};

const kinds: Kind[] = [
  {
    title: "Patterns",
    href: "/workshop/patterns",
    desc: "Small compositions that recur everywhere — stat tiles, empty states, media objects.",
    plane: "left-[6%] right-[-2%] top-[2%] h-[94%]",
    grid: "grid-cols-4 grid-rows-3 gap-2",
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
    plane: "left-[6%] right-[-2%] top-[2%] h-[94%]",
    grid: "grid-cols-3 grid-rows-2 gap-2",
    previewClass: "w-[280px] [&>*]:scale-[0.4]",
    plateVariant: "card",
    plates: [
      "col-start-1 row-start-1 translate-y-4",
      "col-start-2 row-start-1",
      "col-start-3 row-start-1 translate-y-4",
      "col-start-1 row-start-2 translate-y-4",
      "col-start-2 row-start-2",
      "col-start-3 row-start-2 translate-y-4",
    ],
    previews: Object.values(elementPreviews).slice(0, 6),
  },
  {
    title: "Sections",
    href: "/workshop/sections",
    desc: "Whole page sections, composed and ready to drop into a route.",
    plane: "left-[22%] right-[10%] top-[11%] h-[88%]",
    grid: "grid-cols-2 grid-rows-3 gap-2",
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
    grid: "grid-cols-1 grid-rows-2 gap-2",
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
  plateVariant = "bare",
  previews,
}: Pick<
  Kind,
  | "plane"
  | "grid"
  | "plates"
  | "plateClass"
  | "previewClass"
  | "plateVariant"
  | "previews"
>) {
  return (
    <div className="relative h-96 overflow-hidden bg-background-1000 md:h-104">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ maskImage: wellFade, WebkitMaskImage: wellFade }}
      >
        <div className={`absolute ${plane}`}>
          <div className={`absolute inset-0 grid origin-bottom-left ${grid ?? ""}`}>
            {(plates ?? []).map((placement, index) => {
              const zIndex = (plates?.length ?? 0) - index;

              const Preview = previews?.[index];
              if (!Preview) return null;

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
                    className={`flex min-h-0 flex-col rounded-sm border-background-700 bg-background-1000 ${placement}`}
                    style={{ zIndex }}
                  >
                    <div className="relative min-h-0 flex-1 overflow-hidden">{preview}</div>
                  </Card>
                );
              }

              return (
                <div
                  key={placement}
                  className={`min-h-0 overflow-hidden rounded-sm border border-background-700 ${plateClass ?? ""} ${placement}`}
                  style={{ zIndex }}
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

export function WorkshopCarousel({
  className = "",
  items,
  label = "Workshop categories",
  showIndicator = false,
  controlsClassName,
  itemClassName,
  railClassName,
}: {
  className?: string;
  controlsClassName?: string;
  itemClassName?: string;
  railClassName?: string;
  items?: Kind[];
  label?: string;
  showIndicator?: boolean;
}) {
  return (
    <Carousel
      className={className}
      label={label}
      showIndicator={showIndicator}
      controlsClassName={controlsClassName}
      itemClassName={itemClassName ?? "w-[min(34rem,calc(100vw-3rem))] md:w-[35rem]"}
      railClassName={railClassName}
      gapClassName="gap-3"
    >
      {(items ?? kinds).map(
        ({
          title,
          preview,
          href,
          desc,
          icon,
          lead,
          aside,
          plane,
          grid,
          plates,
          plateClass,
          previewClass,
          plateVariant,
          previews,
        }) => (
        <Link
          key={href}
          href={href}
          className={`group relative flex h-full w-full flex-col overflow-hidden ${items ? "rounded-xl" : ""} rounded-md border border-background-700 transition-colors duration-200 hover:border-background-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200 motion-reduce:transition-none`}
        >
          <div
            aria-hidden
            inert
            className="pointer-events-none select-none overflow-hidden"
          >
            {preview ?? (
              <PreviewPlates
                plane={plane}
                grid={grid}
                plates={plates}
                plateClass={plateClass}
                previewClass={previewClass}
                plateVariant={plateVariant}
                previews={previews}
              />
            )}
          </div>
          {icon ? (
            <div className="absolute inset-x-4 bottom-4 flex translate-y-[calc(100%+1rem)] flex-col gap-2 rounded-lg border border-background-700 bg-background-950 px-6 py-5 opacity-0 transition-[translate,opacity] duration-150 ease-[cubic-bezier(0.4,0,1,1)] group-hover:translate-y-0 group-hover:opacity-100 group-hover:duration-300 group-hover:ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:duration-300 group-focus-visible:ease-[cubic-bezier(0.22,1,0.36,1)] in-data-held:translate-y-0 in-data-held:opacity-100 in-data-held:duration-300 in-data-held:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
              <h3 className="flex items-center gap-2.5 text-md font-semibold text-foreground-100">
                <Icon id={icon} size={21} className="text-foreground-300" />
                {title}
              </h3>
              <p className="max-w-[58ch] text-sm text-foreground-400">
                {lead && <span className="text-foreground-100">{lead}</span>}
                {desc}
              </p>
              {aside && <div className="mt-2">{aside}</div>}
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-2 border-t border-background-700 bg-background-1000 px-6 py-5">
              <h3 className="text-md font-semibold text-foreground-100">{title}</h3>
              <p className="max-w-[58ch] text-md leading-6 text-foreground-400">{desc}</p>
            </div>
          )}
        </Link>
        ),
      )}
    </Carousel>
  );
}

export function WorkshopSection() {
  return (
    <Section ground="1000" rhythm="small">
      <div className="grid pt-14 pl-12 items-center gap-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
        <h2 className="max-w-[25ch] type-section text-foreground-100">
          A catalog to browse, not a blank page to invent from.
        </h2>

        <div className="order-3 w-full lg:order-2">
          <p className="max-w-[44ch] type-lead text-foreground-300">
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

      <WorkshopCarousel className="mt-16" />
    </Section>
  );
}

/** The Workshop kinds as single-entry gallery slides, each preview linking to its kind. */
export const workshopGalleryItems = kinds.map(({ title, href, desc, ...plates }) => ({
  title,
  caption: desc,
  fill: true,
  preview: (
    <Link href={href} aria-label={title} className="block size-full" draggable={false}>
      <div aria-hidden inert className="pointer-events-none size-full select-none [&>div]:h-full">
        <PreviewPlates {...plates} />
      </div>
    </Link>
  ),
}));
