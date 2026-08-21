"use client";

import React from "react";

/**
 * Abstract mini-previews for elements, one per element id. Same skeleton
 * language as `pattern-previews.tsx`: no copy, no accent colors, no real
 * controls — just the shape of the thing, so a card reads at a glance and every
 * gallery on the site looks like one system.
 */

const previewRows = [0, 1] as const;

function Preview({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`flex w-full flex-col justify-center gap-3 p-4 ${className}`}>{children}</div>
  );
}

function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-[10px] border-[2px] border-background-500/20 bg-background-950 ${className}`}
    >
      {children}
    </div>
  );
}

function Lines({ short = false }: { short?: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div className={`h-2 rounded-full bg-background-500/50 ${short ? "w-1/2" : "w-2/3"}`} />
      <div className="h-1.5 w-4/5 rounded-full bg-background-500/30" />
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

export const elementPreviews: Record<string, React.ComponentType<object>> = {
  // Top bar: mark on the left, nav in the middle, actions on the right.
  header: () => (
    <Preview>
      <Card className="flex h-12 items-center gap-3 px-3">
        <div className="size-6 shrink-0 rounded-[7px] bg-background-500/40" />
        <div className="flex gap-3">
          {[0, 1, 2].map((link) => (
            <div
              key={link}
              className={`h-2 rounded-full ${link === 0 ? "w-10 bg-background-500/50" : "w-8 bg-background-500/25"}`}
            />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-6 w-12 rounded-[8px] bg-background-500/15" />
          <div className="size-6 rounded-full bg-background-500/30" />
        </div>
      </Card>
    </Preview>
  ),

  // Whole-page scaffold: bar, title, body well, footer.
  page: () => (
    <Preview>
      <Card className="flex h-7 items-center gap-2 px-2.5">
        <div className="size-3 rounded-[4px] bg-background-500/40" />
        <div className="ml-auto flex gap-1.5">
          {previewRows.map((link) => (
            <div key={link} className="h-1.5 w-6 rounded-full bg-background-500/25" />
          ))}
        </div>
      </Card>
      <div className="flex flex-col gap-2 px-0.5">
        <div className="h-2.5 w-1/2 rounded-full bg-background-500/50" />
        <div className="h-1.5 w-3/4 rounded-full bg-background-500/25" />
      </div>
      <Card className="h-14 w-full" />
      <Card className="flex h-6 items-center gap-2 px-2.5">
        <div className="h-1.5 w-10 rounded-full bg-background-500/20" />
        <div className="ml-auto h-1.5 w-6 rounded-full bg-background-500/20" />
      </Card>
    </Preview>
  ),

  // Vertical nav rail: brand block, then grouped rows with one active.
  sidebar: () => (
    <Preview>
      <Card className="flex flex-col gap-3 p-3">
        <div className="flex items-center gap-2">
          <div className="size-5 shrink-0 rounded-[6px] bg-background-500/40" />
          <div className="h-2 w-1/2 rounded-full bg-background-500/40" />
        </div>
        {previewRows.map((group) => (
          <div key={group} className="flex flex-col gap-1.5">
            <div className="h-1.5 w-1/3 rounded-full bg-background-500/20" />
            {previewRows.map((row) => (
              <div
                key={row}
                className={`h-6 rounded-[7px] ${group === 0 && row === 0 ? "bg-background-600" : "bg-background-500/10"}`}
              />
            ))}
          </div>
        ))}
      </Card>
    </Preview>
  ),

  // Outline rail: entries indent by heading level, the current one marked.
  toc: () => (
    <Preview>
      <div className="flex flex-col gap-2.5 border-l-[2px] border-background-500/15 pl-3">
        <div className="-ml-3 h-1.5 w-1/3 rounded-full bg-background-500/20" />
        {[
          { width: "w-3/4", indent: 0, active: false },
          { width: "w-1/2", indent: 12, active: false },
          { width: "w-2/3", indent: 12, active: true },
          { width: "w-4/5", indent: 0, active: false },
          { width: "w-1/2", indent: 12, active: false },
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
    </Preview>
  ),

  // Pager: previous and next cards, arrows pointing outward.
  nextarticle: () => (
    <Preview>
      {previewRows.map((n) => (
        <Card key={n} className="flex h-14 items-center gap-3 px-3">
          {n === 0 && <Chevron direction="left" />}
          <div className={`flex min-w-0 flex-1 flex-col gap-2 ${n === 1 ? "items-end" : ""}`}>
            <div className="h-1.5 w-10 rounded-full bg-background-500/25" />
            <div
              className={`h-2.5 rounded-full bg-background-500/50 ${n === 0 ? "w-2/3" : "w-3/5"}`}
            />
          </div>
          {n === 1 && <Chevron />}
        </Card>
      ))}
    </Preview>
  ),

  // Copy action: a button with a duplicated-sheet glyph beside its label.
  copypage: () => (
    <Preview className="items-center">
      <div className="flex h-9 items-center gap-2 rounded-[10px] bg-background-600 px-3">
        <div className="relative size-4 shrink-0">
          <div className="absolute inset-y-0 left-0 w-3 rounded-[3px] border-[2px] border-background-950/50" />
          <div className="absolute inset-y-0.5 right-0 w-3 rounded-[3px] border-[2px] border-background-950 bg-background-600" />
        </div>
        <div className="h-2 w-10 rounded-full bg-background-950/60" />
      </div>
      <div className="h-1.5 w-24 rounded-full bg-background-500/20" />
    </Preview>
  ),

  // Slide track: the current slide between two peeks, arrows and dots.
  carousel: () => (
    <Preview>
      <div className="flex items-center gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-500/15">
          <Chevron direction="left" />
        </div>
        <div className="h-16 w-4 shrink-0 rounded-[8px] bg-background-500/10" />
        <Card className="h-16 flex-1" />
        <div className="h-16 w-4 shrink-0 rounded-[8px] bg-background-500/10" />
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-500/15">
          <Chevron />
        </div>
      </div>
      <div className="flex justify-center gap-1.5">
        {[0, 1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`h-1.5 rounded-full ${dot === 1 ? "w-4 bg-background-600" : "w-1.5 bg-background-500/25"}`}
          />
        ))}
      </div>
    </Preview>
  ),

  // Events on a rail: markers on a spine, text and meta beside each.
  timeline: () => (
    <Preview>
      <div className="relative flex flex-col gap-3 pl-5">
        <div className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded-full bg-background-500/15" />
        {[0, 1, 2].map((event) => (
          <div key={event} className="relative flex items-center gap-3">
            <div
              className={`absolute -left-5 size-3 rounded-full border-[2px] ${event === 0 ? "border-background-600 bg-background-600" : "border-background-500/30 bg-background-950"}`}
            />
            <Lines short={event === 1} />
            <div className="h-1.5 w-8 shrink-0 rounded-full bg-background-500/20" />
          </div>
        ))}
      </div>
    </Preview>
  ),

  // Score: a run of marks, partly filled, over a caption.
  rating: () => (
    <Preview className="items-center">
      <div className="flex gap-2">
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
    </Preview>
  ),

  // Nested disclosure: rows indent by depth, open ones point down.
  treeview: () => (
    <Preview>
      <Card className="flex flex-col gap-2.5 p-3">
        {[
          { depth: 0, open: true, width: "w-2/3" },
          { depth: 1, open: true, width: "w-1/2" },
          { depth: 2, open: false, width: "w-2/5" },
          { depth: 2, open: false, width: "w-1/2" },
          { depth: 1, open: false, width: "w-3/5" },
        ].map((row, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
            style={{ paddingLeft: row.depth * 14 }}
          >
            <Chevron direction={row.open ? "down" : "right"} />
            <div className="size-3 shrink-0 rounded-[3px] bg-background-500/25" />
            <div className={`h-2 rounded-full bg-background-500/40 ${row.width}`} />
          </div>
        ))}
      </Card>
    </Preview>
  ),

  // Composer: suggestion chips above a field with attachments and send.
  aichatinput: () => (
    <Preview>
      <div className="flex gap-2">
        {[16, 22, 18].map((width) => (
          <div
            key={width}
            className="h-6 rounded-full border-[2px] border-background-500/20"
            style={{ width: width * 4 }}
          />
        ))}
      </div>
      <Card className="flex h-14 flex-col justify-between p-2.5">
        <div className="h-2 w-1/2 rounded-full bg-background-500/30" />
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-full bg-background-500/15" />
          <div className="size-5 rounded-full bg-background-500/15" />
          <div className="ml-auto size-7 rounded-full bg-background-600" />
        </div>
      </Card>
    </Preview>
  ),

  // Reasoning steps: numbered markers on a rail, the last one expanded.
  chainofthought: () => (
    <Preview>
      <div className="relative flex flex-col gap-3 pl-7">
        <div className="absolute bottom-3 left-[9px] top-3 w-[2px] rounded-full bg-background-500/15" />
        {[0, 1, 2].map((step) => (
          <div key={step} className="relative flex flex-col gap-1.5">
            <div
              className={`absolute -left-7 size-5 rounded-full ${step === 2 ? "bg-background-600" : "bg-background-500/20"}`}
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
    </Preview>
  ),

  // Thread: alternating bubbles with an avatar, over a composer.
  chat: () => (
    <Preview>
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="size-5 shrink-0 rounded-full bg-background-500/25" />
          <div className="h-8 w-3/5 rounded-[10px] rounded-bl-[3px] bg-background-500/15" />
        </div>
        <div className="ml-auto h-7 w-1/2 rounded-[10px] rounded-br-[3px] bg-background-600" />
        <div className="flex items-end gap-2">
          <div className="size-5 shrink-0 rounded-full bg-background-500/25" />
          <div className="h-6 w-2/5 rounded-[10px] rounded-bl-[3px] bg-background-500/15" />
        </div>
      </div>
      <Card className="flex h-9 items-center gap-2 px-2.5">
        <div className="h-2 w-1/3 rounded-full bg-background-500/25" />
        <div className="ml-auto size-6 rounded-full bg-background-500/30" />
      </Card>
    </Preview>
  ),

  // Composition: a shell holding a rail and a content well of its own.
  teststructure: () => (
    <Preview>
      <Card className="flex flex-col gap-2 p-2">
        <div className="h-5 w-full rounded-[6px] bg-background-500/15" />
        <div className="flex gap-2">
          <Card className="flex w-1/3 shrink-0 flex-col gap-1.5 p-2">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className={`h-1.5 rounded-full ${row === 0 ? "w-full bg-background-600" : "w-3/4 bg-background-500/25"}`}
              />
            ))}
          </Card>
          <Card className="flex flex-1 flex-col gap-2 p-2">
            <div className="h-2 w-1/2 rounded-full bg-background-500/40" />
            <div className="flex flex-1 gap-1.5">
              <div className="h-8 flex-1 rounded-[6px] bg-background-500/15" />
              <div className="h-8 flex-1 rounded-[6px] bg-background-500/10" />
            </div>
          </Card>
        </div>
      </Card>
    </Preview>
  ),
};
