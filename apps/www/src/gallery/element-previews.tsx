"use client";

import React from "react";
import { Clock, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { Mask } from "ui-lab-components";

/**
 * Abstract mini-previews for elements, one per element id. Same skeleton
 * language as `pattern-previews.tsx`: no copy, no accent colors, no real
 * controls — just the shape of the thing, so a card reads at a glance and every
 * gallery on the site looks like one system.
 *
 * Every preview declares which of two frames it is drawn in — a `wide` band or
 * a `tall` column — and is authored to fill that frame, with whichever block
 * carries the element's weight taking the slack. Two shapes rather than a dozen
 * loose heights is what lets a grid give each preview a cell of its own
 * proportion and still inset every one of them by the same amount.
 */

export type ElementPreviewShape = "wide" | "tall";

/**
 * The two frames, and the room each leaves its contents. The proportions are
 * the ones the Workshop bento lays its cells out on, so a preview dropped into
 * a matching cell fills it rather than letterboxing inside it.
 */
const FRAME: Record<ElementPreviewShape, string> = {
  wide: "h-[140px] w-[244px] gap-2",
  tall: "h-[200px] w-[158px] gap-2",
};

type PreviewEntry = {
  shape: ElementPreviewShape;
  /** Extra layout for the frame itself — `items-center` for centered compositions. */
  frameClass?: string;
  render: () => React.ReactNode;
};

const previewRows = [0, 1] as const;

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`min-h-0 rounded-[8px] border-[2px] border-background-500/20 bg-background-950 ${className}`}
    >
      {children}
    </div>
  );
}

function Lines({ short = false }: { short?: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className={`h-1.5 rounded-full bg-background-500/50 ${short ? "w-1/2" : "w-2/3"}`} />
      <div className="h-1 w-4/5 rounded-full bg-background-500/30" />
    </div>
  );
}

function Chevron({ direction = "right" }: { direction?: "left" | "right" | "down" }) {
  const rotation = {
    right: "rotate-[-45deg]",
    left: "rotate-[135deg]",
    down: "rotate-45",
  } as const;

  return (
    <div
      className={`size-1.5 shrink-0 border-b-2 border-r-2 border-background-500/40 ${rotation[direction]}`}
    />
  );
}

const previews: Record<string, PreviewEntry> = {
  // Top bar: mark on the left, nav in the middle, actions on the right. The page
  // it sits over is kept as a ghost, so the band still fills its frame.
  header: {
    shape: "wide",
    render: () => (
      <>
        <Card className="flex h-9 shrink-0 items-center gap-2.5 px-2.5">
          <div className="size-5 shrink-0 rounded-[6px] bg-background-500/40" />
          <div className="flex gap-2">
            {[0, 1, 2].map((link) => (
              <div
                key={link}
                className={`h-1.5 rounded-full ${link === 0 ? "w-8 bg-background-500/50" : "w-6 bg-background-500/25"}`}
              />
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-5 w-9 rounded-[7px] bg-background-500/15" />
            <div className="size-5 rounded-full bg-background-500/30" />
          </div>
        </Card>
        <div className="flex-1 rounded-[6px] bg-background-500/5" />
      </>
    ),
  },

  // Section nav: a breadcrumb trail over a tab bar, one tab underlined, above
  // the content it switches. The content well takes the slack.
  nav: {
    shape: "wide",
    render: () => (
      <>
        <div className="flex shrink-0 items-center gap-1.5">
          <div className="h-1.5 w-7 rounded-full bg-background-500/25" />
          <Chevron />
          <div className="h-1.5 w-9 rounded-full bg-background-500/25" />
          <Chevron />
          <div className="h-1.5 w-12 rounded-full bg-background-500/45" />
        </div>
        <div className="flex shrink-0 items-stretch gap-3 border-b-[2px] border-background-500/15">
          {[0, 1, 2, 3].map((tab) => (
            <div key={tab} className="flex flex-col gap-1.5">
              <div
                className={`h-1.5 rounded-full ${tab === 0 ? "w-8 bg-background-500/50" : "w-7 bg-background-500/25"}`}
              />
              <div
                className={`-mb-[2px] h-[2px] w-full rounded-full ${tab === 0 ? "bg-background-600" : "bg-transparent"}`}
              />
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-[6px] bg-background-500/5" />
      </>
    ),
  },

  // Site foot: a brand column beside link columns, over a legal bar. The
  // columns take the slack.
  footer: {
    shape: "wide",
    render: () => (
      <>
        <div className="flex max-h-20 min-h-0 flex-1 gap-3">
          <div className="flex w-1/3 shrink-0 flex-col justify-between py-0.5">
            <div className="size-5 rounded-[6px] bg-background-500/40" />
            <div className="h-1.5 w-4/5 rounded-full bg-background-500/20" />
          </div>
          {[0, 1, 2].map((column) => (
            <div
              key={column}
              className="flex max-h-10 min-w-0 flex-1 flex-col justify-between py-0.5"
            >
              <div className="h-1.5 w-full rounded-full bg-background-500/40" />
              <div className="h-1.5 w-3/4 rounded-full bg-background-500/20" />
              <div className="h-1.5 w-4/5 rounded-full bg-background-500/20" />
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center border-t-[2px] border-background-500/10 pt-1.5">
          <div className="h-1.5 w-14 rounded-full bg-background-500/20" />
          <div className="ml-auto flex gap-1.5">
            {[0, 1, 2].map((social) => (
              <div key={social} className="size-3 rounded-full bg-background-500/20" />
            ))}
          </div>
        </div>
      </>
    ),
  },

  // Pager: previous and next cards side by side, arrows pointing outward.
  nextarticle: {
    shape: "wide",
    render: () => (
      <div className="flex min-h-0 items-center flex-1 gap-2">
        {previewRows.map((n) => (
          <Card key={n} className="flex flex-1 h-10 items-center gap-2 px-2.5">
            {n === 0 && <Chevron direction="left" />}
            <div className={`flex min-w-0 flex-1 flex-col gap-1.5 ${n === 1 ? "items-end" : ""}`}>
              <div className="h-1.5 w-7 rounded-full bg-background-500/25" />
              <div
                className={`h-2 rounded-full bg-background-500/50 ${n === 0 ? "w-2/3" : "w-3/5"}`}
              />
            </div>
            {n === 1 && <Chevron />}
          </Card>
        ))}
      </div>
    ),
  },

  // Copy action: a button with a duplicated-sheet glyph beside its label.
  copypage: {
    shape: "wide",
    render: () => (
      <>
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="h-2 w-20 rounded-full bg-background-500/45" />
            <div className="h-1.5 w-14 rounded-full bg-background-500/20" />
          </div>
          <div className="flex w-18 h-7 shrink-0 items-center gap-1.5 rounded-[8px] border border-background-700 bg-background-800 px-2.5">
            <Copy className="size-3 shrink-0 text-foreground-400" strokeWidth={2.5} />
            <div className="h-1.5 w-10 rounded-full bg-background-600" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-1.5">
          <div className="h-1.5 w-full rounded-full bg-background-500/15" />
          <div className="h-1.5 w-4/5 rounded-full bg-background-500/15" />
          <div className="h-1.5 w-3/5 rounded-full bg-background-500/15" />
        </div>
      </>
    ),
  },

  feedback: {
    shape: "wide",
    frameClass: "items-center",
    render: () => (
      <Card className="flex flex-1 flex-col items-center justify-center gap-2.5 p-2">
        <div className="h-2 w-28 rounded-full bg-background-500/45" />
        <div className="flex gap-1.5">
          <div className="flex size-6 items-center justify-center rounded-[6px] bg-background-600 text-background-950">
            <ThumbsUp className="size-3" strokeWidth={2.5} />
          </div>
          <div className="flex size-6 items-center justify-center rounded-[6px] border-[2px] border-background-500/20 text-background-500/35">
            <ThumbsDown className="size-3" strokeWidth={2.5} />
          </div>
        </div>
      </Card>
    ),
  },

  sitesearch: {
    shape: "wide",
    render: () => (
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-7 items-center gap-2 border-b-[2px] border-background-500/10 px-2">
          <div className="size-3 rounded-full border-[2px] border-background-500/40" />
          <div className="h-2 w-24 rounded-full bg-background-500/30" />
        </div>
        <div className="flex flex-1 flex-col justify-around px-2">
          {previewRows.map((row) => (
            <div
              key={row}
              className={`h-2 rounded-full ${row === 0 ? "w-3/4 bg-background-600" : "w-1/2 bg-background-500/20"}`}
            />
          ))}
        </div>
      </Card>
    ),
  },

  article: {
    shape: "tall",
    render: () => (
      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <div className="h-2 w-10 shrink-0 rounded-full bg-background-600" />
        <div className="h-4 w-4/5 shrink-0 rounded-full bg-background-500/50" />
        <div className="flex h-2 shrink-0 items-center gap-1.5 text-background-500/40">
          <Clock className="size-2 shrink-0" strokeWidth={2.5} />
          <div className="h-1.5 w-16 rounded-full bg-background-500/20" />
        </div>
        <div className="my-0.5 shrink-0 border-t-[2px] border-background-500/10" />
        <Mask className="min-h-0 flex-1">
          <Mask.Fade direction="bottom" fixed />
          <div className="space-y-0.5">
            {[
              "w-full bg-background-500/30",
              "w-full bg-background-500/25",
              "w-4/5 bg-background-500/25",
              "w-full bg-background-500/20",
              "w-2/3 bg-background-500/20",
              "w-3/5 bg-background-500/15",
            ].map((line) => (
              <div key={line} className={`h-2 rounded-full ${line}`} />
            ))}
          </div>
        </Mask>
      </div>
    ),
  },

  // Code sample: a labelled strip with a copy square, over a gutter of line
  // ticks and indented lines. The lines take the slack.
  "code-block": {
    shape: "wide",
    render: () => (
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-5 shrink-0 items-center gap-2 border-b-[2px] border-background-500/10 px-2">
          <div className="h-1.5 w-8 rounded-full bg-background-500/40" />
          <div className="ml-auto size-3 rounded-[3px] bg-background-500/25" />
        </div>
        <div className="flex min-h-0 flex-1 gap-2 px-2 py-1.5">
          <div className="flex shrink-0 flex-col justify-between">
            {[0, 1, 2, 3].map((tick) => (
              <div key={tick} className="h-1.5 w-1 rounded-full bg-background-500/20" />
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            {[
              "w-3/5 bg-background-500/40",
              "ml-3 w-2/5 bg-background-500/30",
              "ml-3 w-1/2 bg-background-500/25",
              "w-1/3 bg-background-500/30",
            ].map((line) => (
              <div key={line} className={`h-1.5 rounded-full ${line}`} />
            ))}
          </div>
        </div>
      </Card>
    ),
  },

  // Aside: a tinted card with a marker dot beside its lines.
  callout: {
    shape: "wide",
    render: () => (
      <Card className="flex flex-1 items-start gap-2.5 border-background-600/40 bg-background-600/10 p-2.5">
        <div className="size-4 shrink-0 rounded-full bg-background-600" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="h-2 w-1/2 rounded-full bg-background-500/50" />
          <div className="h-1.5 w-4/5 rounded-full bg-background-500/30" />
          <div className="h-1.5 w-2/3 rounded-full bg-background-500/25" />
        </div>
      </Card>
    ),
  },

  // Docs shell: a nav rail, the article, and an outline rail under a thin bar.
  // The three-column row takes the slack.
  "doc-layout": {
    shape: "tall",
    render: () => (
      <>
        <Card className="flex h-5 shrink-0 items-center gap-1.5 px-2">
          <div className="size-2 rounded-[3px] bg-background-500/40" />
          <div className="ml-auto h-1.5 w-6 rounded-full bg-background-500/20" />
        </Card>
        <div className="flex min-h-0 flex-1 gap-1.5">
          <div className="flex w-1/4 shrink-0 flex-col justify-between py-0.5">
            {[
              "w-full bg-background-600",
              "w-3/4 bg-background-500/20",
              "w-4/5 bg-background-500/20",
              "w-2/3 bg-background-500/20",
              "w-3/4 bg-background-500/15",
            ].map((row) => (
              <div key={row} className={`h-1.5 rounded-full ${row}`} />
            ))}
          </div>
          <Card className="flex flex-1 flex-col gap-1.5 p-1.5">
            <div className="h-2 w-3/4 shrink-0 rounded-full bg-background-500/50" />
            <div className="h-1.5 w-full shrink-0 rounded-full bg-background-500/25" />
            <div className="min-h-0 flex-1 rounded-[4px] bg-background-500/10" />
            <div className="h-1.5 w-2/3 shrink-0 rounded-full bg-background-500/25" />
          </Card>
          <div className="flex w-1/6 shrink-0 flex-col justify-between py-0.5">
            {[0, 1, 2, 3].map((tick) => (
              <div key={tick} className="h-1 w-full rounded-full bg-background-500/15" />
            ))}
          </div>
        </div>
      </>
    ),
  },

  // Folded text: a paragraph fading out toward a small toggle beneath it.
  "inline-fold": {
    shape: "tall",
    render: () => (
      <>
        <div className="flex min-h-0 flex-1 flex-col justify-between">
          {[
            "w-full bg-background-500/50",
            "w-5/6 bg-background-500/40",
            "w-full bg-background-500/30",
            "w-3/4 bg-background-500/30",
            "w-full bg-background-500/25",
            "w-3/4 bg-background-500/25",
            "w-5/6 bg-background-500/20",
            "w-full bg-background-500/15",
            "w-2/3 bg-background-500/15",
            "w-2/3 bg-background-500/10",
            "w-4/5 bg-background-500/5",
          ].map((line) => (
            <div key={line} className={`h-1.5 rounded-full ${line}`} />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-full border-[2px] border-background-500/20 px-2 py-1">
          <div className="h-1.5 w-8 rounded-full bg-background-500/30" />
          <Chevron direction="down" />
        </div>
      </>
    ),
  },

  // Slide track: the current slide between two peeks, arrows and dots. The
  // arrows and peeks are chrome, so the slide itself keeps the width.
  carousel: {
    shape: "wide",
    render: () => (
      <>
        <div className="flex min-h-0 flex-1 items-center gap-1.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background-500/15">
            <Chevron direction="left" />
          </div>
          <div className="h-3/4 w-2.5 shrink-0 rounded-[6px] bg-background-500/10" />
          <Card className="h-full flex-1" />
          <div className="h-3/4 w-2.5 shrink-0 rounded-[6px] bg-background-500/10" />
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background-500/15">
            <Chevron />
          </div>
        </div>
        <div className="flex shrink-0 justify-center gap-1.5">
          {[0, 1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`h-1.5 rounded-full ${dot === 1 ? "w-4 bg-background-600" : "w-1.5 bg-background-500/25"}`}
            />
          ))}
        </div>
      </>
    ),
  },

  // Comparison: one frame split by a divider with a handle on it.
  beforeafter: {
    shape: "wide",
    render: () => (
      <Card className="relative flex flex-1 overflow-hidden">
        <div className="w-[55%] bg-background-500/25" />
        <div className="flex-1 bg-background-500/10" />
        <div className="absolute inset-y-0 left-[55%] w-[2px] -translate-x-1/2 bg-background-500/40" />
        <div className="absolute left-[55%] top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background-600" />
      </Card>
    ),
  },

  // Score: a run of marks, partly filled, over a caption.
  rating: {
    shape: "wide",
    frameClass: "items-center",
    render: () => (
      <>
        <div className="flex gap-2.5">
          {[0, 1, 2, 3, 4].map((mark) => (
            <div
              key={mark}
              className={`size-5 rotate-45 rounded-[3px] ${mark < 4 ? "bg-background-600" : "bg-background-500/20"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-8 rounded-full bg-background-500/50" />
          <div className="h-1.5 w-14 rounded-full bg-background-500/25" />
        </div>
      </>
    ),
  },

  // Composer: suggestion chips above a field with attachments and send.
  aichatinput: {
    shape: "wide",
    render: () => (
      <>
        <div className="flex shrink-0 gap-1.5">
          {[13, 18, 15].map((width) => (
            <div
              key={width}
              className="h-4 rounded-full border-[2px] border-background-500/20"
              style={{ width: width * 4 }}
            />
          ))}
        </div>
        <Card className="flex flex-1 flex-col justify-between p-1.5">
          <div className="h-2 w-1/2 rounded-full bg-background-500/30" />
          <div className="flex items-center gap-1.5">
            <div className="size-4 rounded-full bg-background-500/15" />
            <div className="size-4 rounded-full bg-background-500/15" />
            <div className="ml-auto size-5 rounded-full bg-background-600" />
          </div>
        </Card>
      </>
    ),
  },

  // Composer with suggestions: full-width prompts stacked over the field, the
  // stack taking the slack.
  "aichatinput-with-suggestions": {
    shape: "tall",
    render: () => (
      <>
        <div className="flex min-h-0 flex-1 flex-col justify-between">
          {[0, 1, 2, 3].map((suggestion) => (
            <Card key={suggestion} className="flex h-7 shrink-0 items-center gap-2 px-2">
              <div
                className={`h-1.5 flex-1 rounded-full ${suggestion === 0 ? "bg-background-500/40" : "bg-background-500/25"}`}
              />
              <Chevron />
            </Card>
          ))}
        </div>
        <Card className="flex h-10 shrink-0 flex-col justify-between p-1.5">
          <div className="h-2 w-1/2 rounded-full bg-background-500/30" />
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-background-500/15" />
            <div className="ml-auto size-4 rounded-full bg-background-600" />
          </div>
        </Card>
      </>
    ),
  },

  // App shell: a rail beside a topbar and content well, held in one frame.
  shell: {
    shape: "wide",
    render: () => (
      <Card className="flex flex-1 flex-col gap-1.5 p-1.5">
        <div className="h-3.5 w-full shrink-0 rounded-[4px] bg-background-500/15" />
        <div className="flex min-h-0 flex-1 gap-1.5">
          <Card className="flex w-1/4 shrink-0 flex-col justify-center gap-1.5 p-1.5">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className={`h-1.5 rounded-full ${row === 0 ? "w-full bg-background-600" : "w-3/4 bg-background-500/25"}`}
              />
            ))}
          </Card>
          <Card className="flex flex-1 flex-col gap-1.5 p-1.5">
            <div className="h-2 w-1/2 shrink-0 rounded-full bg-background-500/40" />
            <div className="flex min-h-0 flex-1 gap-1.5">
              <div className="flex-1 rounded-[4px] bg-background-500/15" />
              <div className="flex-1 rounded-[4px] bg-background-500/10" />
            </div>
          </Card>
        </div>
      </Card>
    ),
  },

  // Whole-page scaffold: bar, title, body well, footer. The well takes the slack.
  page: {
    shape: "tall",
    render: () => (
      <>
        <Card className="flex h-6 shrink-0 items-center gap-2 px-2">
          <div className="size-2.5 rounded-[3px] bg-background-500/40" />
          <div className="ml-auto flex gap-1.5">
            {previewRows.map((link) => (
              <div key={link} className="h-1.5 w-5 rounded-full bg-background-500/25" />
            ))}
          </div>
        </Card>
        <div className="flex shrink-0 flex-col gap-1.5 px-0.5">
          <div className="h-2.5 w-1/2 rounded-full bg-background-500/50" />
          <div className="h-1.5 w-3/4 rounded-full bg-background-500/25" />
        </div>
        <Card className="flex-1" />
        <Card className="flex h-5 shrink-0 items-center gap-2 px-2">
          <div className="h-1.5 w-8 rounded-full bg-background-500/20" />
          <div className="ml-auto h-1.5 w-5 rounded-full bg-background-500/20" />
        </Card>
      </>
    ),
  },

  // Vertical nav rail: brand block over grouped rows, one of them current.
  sidebar: {
    shape: "tall",
    render: () => (
      <Card className="flex flex-1 flex-col gap-2 p-2.5">
        <div className="flex shrink-0 items-center gap-2">
          <div className="size-4 shrink-0 rounded-[5px] bg-background-500/40" />
          <div className="h-2 w-1/2 rounded-full bg-background-500/40" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-1.5">
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className={`flex-1 rounded-[5px] ${row === 0 ? "bg-background-600" : "bg-background-500/10"}`}
            />
          ))}
        </div>
      </Card>
    ),
  },

  // Outline rail: entries indent by heading level, the current one marked.
  toc: {
    shape: "tall",
    render: () => (
      <div className="flex min-h-0 flex-1 flex-col justify-between border-l-[2px] border-background-500/15 pl-3">
        <div className="-ml-3 h-1.5 w-1/3 rounded-full bg-background-500/20" />
        {[
          { width: "w-3/4", indent: 0, active: false },
          { width: "w-1/2", indent: 10, active: false },
          { width: "w-2/3", indent: 10, active: true },
          { width: "w-4/5", indent: 0, active: false },
          { width: "w-1/2", indent: 10, active: false },
          { width: "w-3/5", indent: 0, active: false },
        ].map((entry, index) => (
          <div
            key={index}
            className="relative flex items-center"
            style={{ paddingLeft: entry.indent }}
          >
            {entry.active && (
              <div className="absolute -left-[14px] h-3 w-[2px] rounded-full bg-background-600" />
            )}
            <div
              className={`h-2 rounded-full ${entry.width} ${entry.active ? "bg-background-500/60" : "bg-background-500/25"}`}
            />
          </div>
        ))}
      </div>
    ),
  },

  // Nested disclosure: rows indent by depth, open ones point down.
  treeview: {
    shape: "tall",
    render: () => (
      <Card className="bg-transparent border-transparent flex flex-1 flex-col gap-1 p-2.5">
        {[
          { depth: 0, open: true, width: "w-2/3" },
          { depth: 1, open: true, width: "w-1/2" },
          { depth: 2, open: false, width: "w-2/5" },
          { depth: 2, open: false, width: "w-1/2" },
          { depth: 1, open: false, width: "w-3/5" },
        ].map((row, index) => (
          <div
            key={index}
            className="flex flex-1 items-center gap-1.5"
            style={{ paddingLeft: row.depth * 10 }}
          >
            <Chevron direction={row.open ? "down" : "right"} />
            <div className="size-3 shrink-0 rounded-[3px] bg-background-500/25" />
            <div className={`h-2 rounded-full bg-background-500/40 ${row.width}`} />
          </div>
        ))}
      </Card>
    ),
  },

  // Stacked sections: collapsed headers with one open onto its body, and the
  // open one taking the slack.
  accordion: {
    shape: "tall",
    render: () => (
      <>
        {[false, true, false].map((open, index) => (
          <Card
            key={index}
            className={`flex flex-col overflow-hidden ${open ? "flex-1" : "h-7 shrink-0"}`}
          >
            <div className="flex h-7 shrink-0 items-center gap-2 px-2">
              <div
                className={`h-2 flex-1 rounded-full ${open ? "bg-background-500/50" : "bg-background-500/30"}`}
              />
              <Chevron direction={open ? "down" : "right"} />
            </div>
            {open && (
              <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-2 pb-2">
                <div className="h-1.5 w-3/4 shrink-0 rounded-full bg-background-500/20" />
                <div className="min-h-0 flex-1 rounded-[4px] bg-background-500/10" />
              </div>
            )}
          </Card>
        ))}
      </>
    ),
  },

  // Events on a rail: markers on a spine, text and meta beside each.
  timeline: {
    shape: "tall",
    render: () => (
      <div className="relative flex min-h-0 flex-1 flex-col justify-between pl-5">
        <div className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded-full bg-background-500/15" />
        {[0, 1, 2, 3].map((event) => (
          <div key={event} className="relative flex items-center gap-2.5">
            <div
              className={`absolute -left-5 size-3 rounded-full border-[2px] ${event === 0 ? "border-background-600 bg-background-600" : "border-background-500/30 bg-background-950"}`}
            />
            <Lines short={event === 1} />
          </div>
        ))}
      </div>
    ),
  },

  // Reasoning steps: markers on a rail, the last one expanded.
  chainofthought: {
    shape: "tall",
    render: () => (
      <div className="relative flex min-h-0 flex-1 flex-col justify-between pl-6">
        <div className="absolute bottom-2.5 left-[7px] top-2.5 w-[2px] rounded-full bg-background-500/15" />
        {[0, 1, 2].map((step) => (
          <div key={step} className="relative flex flex-col gap-1.5">
            <div
              className={`absolute -left-6 size-4 rounded-full ${step === 2 ? "bg-background-600" : "bg-background-500/20"}`}
            />
            <div
              className={`h-2 rounded-full bg-background-500/50 ${step === 1 ? "w-1/2" : "w-2/3"}`}
            />
            {step === 2 && (
              <Card className="flex flex-col gap-1.5 p-2">
                <div className="h-1.5 w-4/5 rounded-full bg-background-500/25" />
                <div className="h-1.5 w-3/5 rounded-full bg-background-500/25" />
              </Card>
            )}
          </div>
        ))}
      </div>
    ),
  },

  // Steps beside their detail: a marker rail on the left, the expanded card
  // filling the rest of the band.
  "chainofthought-with-details": {
    shape: "wide",
    render: () => (
      <div className="flex min-h-0 flex-1 gap-2.5">
        <div className="relative flex w-9 shrink-0 flex-col justify-between py-0.5">
          <div className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded-full bg-background-500/15" />
          {[0, 1, 2].map((step) => (
            <div key={step} className="relative flex items-center gap-1.5">
              <div
                className={`size-3 shrink-0 rounded-full ${step === 2 ? "bg-background-600" : "bg-background-500/20"}`}
              />
              <div className="h-1.5 flex-1 rounded-full bg-background-500/25" />
            </div>
          ))}
        </div>
        <Card className="flex min-w-0 flex-1 flex-col justify-between p-2">
          <div className="h-2 w-1/2 rounded-full bg-background-500/40" />
          <div className="h-1.5 w-full rounded-full bg-background-500/25" />
          <div className="h-1.5 w-4/5 rounded-full bg-background-500/25" />
          <div className="h-1.5 w-3/5 rounded-full bg-background-500/20" />
        </Card>
      </div>
    ),
  },

  // Thread: alternating bubbles with an avatar, over a composer.
  chat: {
    shape: "tall",
    render: () => (
      <>
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5">
          <div className="flex items-end gap-1.5">
            <div className="size-4 shrink-0 rounded-full bg-background-500/25" />
            <div className="h-7 w-3/5 rounded-[8px] rounded-bl-[3px] bg-background-500/15" />
          </div>
          <div className="ml-auto h-6 w-1/2 rounded-[8px] rounded-br-[3px] bg-background-600" />
          <div className="flex items-end gap-1.5">
            <div className="size-4 shrink-0 rounded-full bg-background-500/25" />
            <div className="h-6 w-2/5 rounded-[8px] rounded-bl-[3px] bg-background-500/15" />
          </div>
        </div>
        <Card className="flex h-8 shrink-0 items-center gap-2 px-2">
          <div className="h-2 w-1/3 rounded-full bg-background-500/25" />
          <div className="ml-auto size-5 rounded-full bg-background-500/30" />
        </Card>
      </>
    ),
  },

  // Message with actions: an avatar and its bubble over a row of action
  // squares. The bubble takes the slack.
  "chat-with-actions": {
    shape: "wide",
    render: () => (
      <>
        <div className="flex min-h-0 flex-1 gap-2">
          <div className="size-5 shrink-0 self-start rounded-full bg-background-500/25" />
          <Card className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 rounded-bl-[3px] px-2.5">
            <div className="h-2 w-3/4 rounded-full bg-background-500/40" />
            <div className="h-1.5 w-1/2 rounded-full bg-background-500/25" />
          </Card>
        </div>
        <div className="flex shrink-0 gap-1.5 pl-7">
          {[0, 1, 2, 3].map((action) => (
            <div
              key={action}
              className={`size-5 rounded-[6px] ${action === 0 ? "bg-background-600" : "bg-background-500/15"}`}
            />
          ))}
        </div>
      </>
    ),
  },

  toolcalls: {
    shape: "wide",
    render: () => (
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-8 items-center gap-2 border-b-[2px] border-background-500/10 px-2">
          <div className="size-5 rounded-[6px] bg-background-600" />
          <div className="h-2 w-20 rounded-full bg-background-500/40" />
          <div className="ml-auto size-3 rounded-full bg-background-500/30" />
        </div>
        <div className="flex flex-1 items-center gap-2 px-2">
          <div className="h-2 w-1/3 rounded-full bg-background-500/20" />
          <div className="h-5 flex-1 rounded-[5px] bg-background-500/10" />
        </div>
      </Card>
    ),
  },

  history: {
    shape: "tall",
    render: () => (
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="h-3 w-1/2 rounded-full bg-background-500/50" />
        {[0, 1, 2].map((row) => (
          <Card
            key={row}
            className={`flex flex-1 items-center gap-2 px-2 ${row === 0 ? "border-background-600/60" : ""}`}
          >
            <div className="size-4 rounded-full bg-background-500/20" />
            <Lines short={row === 2} />
            <Chevron />
          </Card>
        ))}
      </div>
    ),
  },

  sessions: {
    shape: "wide",
    render: () => (
      <div className="flex min-h-0 flex-1 gap-2">
        {[0, 1, 2].map((session) => (
          <Card
            key={session}
            className={`flex flex-1 flex-col justify-between p-2 ${session === 0 ? "border-background-600/60" : ""}`}
          >
            <div
              className={`size-2 rounded-full ${session === 0 ? "bg-background-600" : "bg-background-500/25"}`}
            />
            <div className="h-2 w-full rounded-full bg-background-500/35" />
            <div className="h-1.5 w-2/3 rounded-full bg-background-500/20" />
          </Card>
        ))}
      </div>
    ),
  },
};

/** Which frame each element is drawn in, for grids that size a cell to its content. */
export const elementPreviewShapes: Record<string, ElementPreviewShape> = Object.fromEntries(
  Object.entries(previews).map(([id, entry]) => [id, entry.shape]),
);

/**
 * `max-h-full` is the one concession to the outside: where a preview is dropped
 * into a well shorter than its frame it compresses rather than overflowing, and
 * because every frame gives its slack to one flexible block, it does so evenly.
 */
export const elementPreviews: Record<string, React.ComponentType<object>> = Object.fromEntries(
  Object.entries(previews).map(([id, entry]) => [
    id,
    () => (
      <div
        className={`flex max-h-full max-w-full min-h-0 flex-col justify-center overflow-hidden ${FRAME[entry.shape]} ${entry.frameClass ?? ""}`}
      >
        {entry.render()}
      </div>
    ),
  ]),
);
