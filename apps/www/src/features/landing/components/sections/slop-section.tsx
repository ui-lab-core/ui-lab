"use client";

/**
 * Design note — 03, the slop claim.
 *
 * Claim: slop is not a vibe, it is a finite list, and UI Lab holds it. A skeptic
 * believes that by seeing the list — named domains, named tells, each one already
 * paired with the convention that replaces it. Rejected the first idea (a flat
 * six-row good/bad table): it reads as an opinion, not a catalogue, because
 * nothing around the rows says how much more there is.
 * The visual idea is the catalogue plate: a narrow fixed-height slab where domain
 * rows are the spine and entries live inside them. Fixed height is the argument —
 * the list genuinely runs past the frame, and the rows scroll under a header that
 * stays put, so the overflow is real rather than a drawn gradient. The copy column carries the weight at 55/45 and
 * pins its four domain cards to the bottom, so legend and plate share a baseline.
 * Cards and group rows drive one open state: the legend is a control, not decor.
 * Spectral hairline is the plate's top edge, used once. The CTA pill straddles the
 * plate's bottom border, breaking the one hairline it crosses.
 * Cut: the per-row verdict icons. The two column headers declare that vocabulary
 * once, and repeating it forty times was noise standing in for hierarchy.
 */

import { Fragment, useState, type ComponentType } from "react";
import { Check, CornerDownRight, LayoutGrid, Palette, Type, UserRound, X } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Expand } from "ui-lab-components/expand";
import { Table } from "ui-lab-components/table";
import type { Column } from "ui-lab-components/table";
import { Lattice, Section, SectionHeading } from "./section";

type Entry = {
  /** Stable across both halves of the row, so the pair reads as one record. */
  id: string;
  anti: string;
  antiNote: string;
  fix: string;
  fixNote: string;
};

type Domain = {
  id: string;
  name: string;
  Icon: ComponentType<{ className?: string }>;
  /** Runs after the domain name in the group row, behind a slash. */
  scope: string;
  /** The legend card's line. Never repeats the scope. */
  blurb: string;
  count: number;
  entries: Entry[];
};

const domains: Domain[] = [
  {
    id: "color",
    name: "Color",
    Icon: Palette,
    scope: "contrast, state, semantic role",
    blurb: "Hues resolve to roles, never to hex.",
    count: 18,
    entries: [
      {
        id: "color-gradient",
        anti: "Gradient fills on every surface",
        antiNote: "Nothing on the screen reads as a plane.",
        fix: "One flat surface token",
        fixNote: "Depth is a border and an elevation step.",
      },
      {
        id: "color-hex",
        anti: "A new hex per component",
        antiNote: "Six greys no theme can move together.",
        fix: "Semantic tokens, one scale",
        fixNote: "Surface, border, and text share a ramp.",
      },
      {
        id: "color-glow",
        anti: "Neon glow to signal focus",
        antiNote: "Fails contrast, fails the light theme.",
        fix: "A focus ring on the token",
        fixNote: "One width, one offset, inherited.",
      },
      {
        id: "color-only",
        anti: "Color as the only status",
        antiNote: "Unreadable to a quarter of your users.",
        fix: "Color, icon, and label",
        fixNote: "Survives print, dimming, and a reader.",
      },
    ],
  },
  {
    id: "typography",
    name: "Typography",
    Icon: Type,
    scope: "hierarchy, measure, rhythm",
    blurb: "Two weights; size carries the hierarchy.",
    count: 12,
    entries: [
      {
        id: "type-weights",
        anti: "Five weights on one screen",
        antiNote: "Emphasis spent everywhere is emphasis lost.",
        fix: "Two weights, one size ramp",
        fixNote: "Rank is a step on the scale, not a weight.",
      },
      {
        id: "type-measure",
        anti: "Centered body paragraphs",
        antiNote: "A ragged left edge slows every line.",
        fix: "Left aligned, measured",
        fixNote: "Body copy capped near 65 characters.",
      },
      {
        id: "type-tracking",
        anti: "Tracking loosened for effect",
        antiNote: "Wide-set headings read slower, not better.",
        fix: "Tracking tied to size",
        fixNote: "Tighter as type grows, normal at body size.",
      },
      {
        id: "type-emoji",
        anti: "Emoji standing in for icons",
        antiNote: "Vendor glyphs at the wrong size and palette.",
        fix: "One icon set, one size",
        fixNote: "Aligned to the cap height beside it.",
      },
    ],
  },
  {
    id: "layout",
    name: "Layout",
    Icon: LayoutGrid,
    scope: "density, elevation, alignment",
    blurb: "One focal block; everything else recedes.",
    count: 16,
    entries: [
      {
        id: "layout-weight",
        anti: "Every card weighted equally",
        antiNote: "A grid with no entry point for the eye.",
        fix: "One focal block",
        fixNote: "One element takes scale; the rest support it.",
      },
      {
        id: "layout-glass",
        anti: "Glass panels over gradients",
        antiNote: "Legible in exactly one screenshot.",
        fix: "Opaque surfaces, one step",
        fixNote: "Elevation is a token, resolved per theme.",
      },
      {
        id: "layout-padding",
        anti: "Padding invented per component",
        antiNote: "13px here, 18px there, aligned nowhere.",
        fix: "The spacing scale only",
        fixNote: "Insets from the ramp, so hairlines line up.",
      },
      {
        id: "layout-radius",
        anti: "Mixed radii in one container",
        antiNote: "Pill buttons inside sharp cards.",
        fix: "A single radius ramp",
        fixNote: "Corners nest: outer radius minus the inset.",
      },
    ],
  },
  {
    id: "usability",
    name: "Usability",
    Icon: UserRound,
    scope: "affordance, feedback, reach",
    blurb: "Every control labelled, reachable, reversible.",
    count: 16,
    entries: [
      {
        id: "use-icononly",
        anti: "Icon-only controls, unlabelled",
        antiNote: "Glyphs only their author can tell apart.",
        fix: "A label, or an accessible name",
        fixNote: "Visible text wherever there is room for it.",
      },
      {
        id: "use-toast",
        anti: "A toast as the only error",
        antiNote: "It expires; the broken field does not.",
        fix: "Error stated at the field",
        fixNote: "The message lives beside its input, and stays.",
      },
      {
        id: "use-hover",
        anti: "Affordances that need hover",
        antiNote: "They do not exist for keyboard or touch.",
        fix: "Focus and pointer parity",
        fixNote: "Reachable by tab, in the order you read.",
      },
      {
        id: "use-disabled",
        anti: "Disabled with no reason given",
        antiNote: "A dimmed button that never says why.",
        fix: "Explain the block",
        fixNote: "Name the unmet condition, keep it focusable.",
      },
    ],
  },
];

const entries = domains.flatMap((domain) => domain.entries);
const total = domains.reduce((sum, domain) => sum + domain.count, 0);

/** Only the header row is generated from these — the body is composed by hand. */
const columns: Column<Entry>[] = [
  {
    key: "anti",
    width: "50%",
    header: (
      <span className="flex items-center text-base gap-2 text-foreground-400">
        <X className="size-3.5 shrink-0 text-danger-500" />
        Anti-pattern
      </span>
    ),
  },
  {
    key: "fix",
    width: "50%",
    header: (
      <span className="flex items-center text-base gap-2 text-foreground-200">
        <Check className="size-3.5 shrink-0 text-success-600" />
        Corrected
      </span>
    ),
  },
];

export function SlopSection() {
  const [open, setOpen] = useState<string[]>(["color"]);

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  return (
    <Section ground="1000" rhythm="small">
      <div className="overflow-hidden border border-background-700 rounded-sm">
        <div className="grid items-stretch lg:grid-cols-[minmax(0,47fr)_minmax(0,53fr)]">
          {/* the plate: fixed height, so the list visibly runs past its own frame */}
          <div className="flex flex-col justify-between gap-10">
            <div className="pr-6 pt-16">
              <SectionHeading
                size="small"
                title="Slop, named and filed, from every domain of interface design to the tells a model reaches for without a pattern to follow."
              />
            </div>

            {/* the legend is the control: a card and its group row share one open state */}
            <div className="flex flex-col gap-3">
              <p className="ml-auto mr-2 text-xs text-background-500">
                Four domains, {total} entries
              </p>
              <Lattice className="m-3 border grid-cols-1 sm:grid-cols-2">
                {domains.map(({ id, name, Icon, blurb, count }) => {
                  const active = open.includes(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(id)}
                      className={`relative flex flex-col py-6 px-4 text-left ${
                        active ? "bg-background-950" : "bg-background-1000 hover:bg-background-950"
                      }`}
                    >
                      <span className="flex items-center">
                        <span
                          className={`text-base font-medium ${active ? "text-foreground-100" : "text-foreground-300"}`}
                        >
                          {name}
                        </span>
                      </span>
                      <span className="text-md leading-relaxed text-foreground-400">{blurb}</span>
                      <span className="absolute top-3 right-5 font-mono text-sm font-black text-foreground-400">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </Lattice>
            </div>
          </div>
          <div className="relative self-start overflow-hidden">
            <div className="border-l  border-background-700 bg-background-1000">
              <div className="h-170">
                <Table
                  data={entries}
                  columns={columns}
                  aria-label="Anti-pattern catalogue"
                  scroll="rows"
                  className="h-full"
                  styles={{
                    container: "rounded-none border-0",
                    table: "font-medium font-sans bg-background-1000 ",
                    header: "bg-background-950",
                  }}
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className="border-r border-background-800 px-4 py-3">
                        {columns[0].header}
                      </Table.HeaderCell>
                      <Table.HeaderCell className="px-4 py-3">{columns[1].header}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body className="border-b border-background-700">
                    {domains.map((domain) => {
                      const expanded = open.includes(domain.id);

                      return (
                        <Fragment key={domain.id}>
                          <Table.Row>
                            <Table.Cell colSpan={2} className="bg-background-1000 p-0">
                              <Expand
                                layout="contained"
                                state={{ expanded }}
                                onExpandedChange={() => toggle(domain.id)}
                                styles={{
                                  trigger: "bg-background-1000 hover:bg-background-950",
                                }}
                              >
                                <Expand.Trigger className="group flex w-full items-center gap-2.5 px-4 py-3.5">
                                  <span className="text-sm font-medium text-foreground-100">
                                    {domain.name}
                                  </span>
                                  <span className="text-background-600">/</span>
                                  <span className="truncate text-xs text-foreground-400">
                                    {domain.scope}
                                  </span>
                                  <Expand.Icon
                                    className="ml-auto px-0 py-0"
                                    color="text-foreground-400"
                                  />
                                </Expand.Trigger>
                              </Expand>
                            </Table.Cell>
                          </Table.Row>

                          {expanded
                            ? domain.entries.map((entry) => (
                                <Table.Row key={entry.id} className="group">
                                  <Table.Cell className="border-r bg-background-1000 border-background-800 items-start px-4 py-3 group-hover:bg-background-900">
                                    <span className="flex flex-col gap-1">
                                      <span className="text-sm leading-snug text-foreground-300">
                                        {entry.anti}
                                      </span>
                                      <span className="text-xs leading-relaxed text-foreground-400">
                                        {entry.antiNote}
                                      </span>
                                    </span>
                                  </Table.Cell>
                                  <Table.Cell className="items-start bg-background-1000 px-4 py-3 group-hover:bg-background-900 motion-reduce:transition-none">
                                    <span className="flex flex-col gap-1">
                                      <span className="text-sm leading-snug text-foreground-100">
                                        {entry.fix}
                                      </span>
                                      <span className="text-xs leading-relaxed text-foreground-400">
                                        {entry.fixNote}
                                      </span>
                                    </span>
                                  </Table.Cell>
                                </Table.Row>
                              ))
                            : null}
                        </Fragment>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>

              {/* the pill lands over this bar, so its copy stays left of centre */}
              <div className="border-t flex items-center border-background-800 px-4 py-3">
                <span className="text-xs text-background-500">
                  {total} entries · {domains.length} domains · versioned with the system
                </span>
                <Button icon={{ right: <CornerDownRight /> }} size="sm" className="w-44 ml-auto">
                  See All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
