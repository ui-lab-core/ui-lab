"use client";

import React from "react";

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

export const patternPreviews: Record<string, React.ComponentType<object>> = {
  // Single, prominent object: avatar, stacked text, trailing chevron.
  "media-object": () => (
    <Preview>
      <Card className="flex h-16 items-center gap-3 px-3">
        <div className="size-11 shrink-0 rounded-[8px] bg-background-500/20" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-2.5 w-2/3 rounded-full bg-background-500/50" />
          <div className="h-2 w-1/2 rounded-full bg-background-500/30" />
          <div className="h-1.5 w-3/4 rounded-full bg-background-500/20" />
        </div>
        <div className="size-1.5 shrink-0 -translate-y-px rotate-45 border-b-2 border-r-2 border-background-500/40" />
      </Card>
    </Preview>
  ),

  // Two-row list: label left, value right.
  "split-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <Card key={n} className="flex h-12 items-center justify-between gap-4 px-3">
          <Lines short={n === 0} />
          <div className="h-5 w-12 shrink-0 rounded-md bg-background-500/20" />
        </Card>
      ))}
    </Preview>
  ),

  // Three columns of stats: small caption over a large value.
  "stat-block": () => (
    <Preview>
      <div className="grid grid-cols-3 gap-3">
        {[10, 14, 12].map((valueWidth, n) => (
          <Card key={valueWidth} className="flex flex-col gap-3 p-3">
            <div className="h-1.5 w-2/3 rounded-full bg-background-500/30" />
            <div className="flex items-end gap-1.5">
              <div
                className="h-4 rounded-[4px] bg-background-500/50"
                style={{ width: valueWidth * 4 }}
              />
              {n === 0 && <div className="mb-0.5 size-1.5 rounded-full bg-background-600" />}
            </div>
          </Card>
        ))}
      </div>
    </Preview>
  ),

  // Stacked form: label on top of each field, no outer card.
  "labeled-field": () => (
    <Preview>
      {[16, 24].map((labelWidth) => (
        <div key={labelWidth} className="flex flex-col gap-2">
          <div
            className="h-2 rounded-full bg-background-500/50"
            style={{ width: labelWidth * 4 }}
          />
          <Card className="h-9 w-full" />
        </div>
      ))}
    </Preview>
  ),

  // Single search bar.
  "search-input": () => (
    <Preview>
      <Card className="flex h-11 items-center gap-2.5 px-3">
        <div className="size-3.5 shrink-0 rounded-full border-[2px] border-background-500/50" />
        <div className="h-2 w-1/2 rounded-full bg-background-500/40" />
        <div className="ml-auto size-6 shrink-0 rounded-md bg-background-500/20" />
      </Card>
    </Preview>
  ),

  // Two-row settings list with toggles.
  "toggle-setting-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <Card key={n} className="flex h-12 items-center justify-between gap-4 px-3">
          <Lines short={n === 1} />
          <div
            className={`h-5 w-8 shrink-0 rounded-full ${n === 0 ? "bg-background-600" : "bg-background-500/30"}`}
          >
            <div
              className={`m-0.5 size-4 rounded-full bg-background-950 ${n === 0 ? "ml-3.5" : ""}`}
            />
          </div>
        </Card>
      ))}
    </Preview>
  ),

  // Two-row list: label left, select control right.
  "select-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <Card key={n} className="flex h-12 items-center justify-between gap-4 px-3">
          <Lines short={n === 0} />
          <Card className="flex h-8 w-20 shrink-0 items-center justify-end px-2">
            <div className="size-1.5 -translate-y-0.5 rotate-45 border-b-2 border-r-2 border-background-500/50" />
          </Card>
        </Card>
      ))}
    </Preview>
  ),

  // Free-flowing wrap of badges, no card.
  "badge-row": () => (
    <Preview>
      <div className="flex flex-wrap gap-2">
        {[14, 20, 12, 16, 10, 18].map((width, index) => (
          <div
            key={width}
            className={`h-6 rounded-full ${index === 0 ? "bg-background-500/60" : "bg-background-500/25"}`}
            style={{ width: width * 4 }}
          />
        ))}
      </div>
    </Preview>
  ),

  // Two stacked metrics with progress bars, no card.
  "progress-metric": () => (
    <Preview>
      {[68, 42].map((percent) => (
        <div key={percent} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="h-2 w-20 rounded-full bg-background-500/50" />
            <div className="h-2 w-8 rounded-full bg-background-500/30" />
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background-500/20">
            <div
              className="h-full rounded-full bg-background-600"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ))}
    </Preview>
  ),

  // Table: a header row over body rows, all inside one card.
  "data-table-row": () => (
    <Preview>
      <Card className="flex flex-col divide-y-[2px] divide-background-500/10 overflow-hidden p-0">
        <div className="flex items-center gap-4 bg-background-500/5 px-3 py-2.5">
          <div className="h-1.5 w-1/4 rounded-full bg-background-500/40" />
          <div className="h-1.5 w-12 rounded-full bg-background-500/40" />
          <div className="ml-auto h-1.5 w-10 rounded-full bg-background-500/40" />
        </div>
        {[0, 1, 2].map((n) => (
          <div key={n} className="flex items-center gap-4 px-3 py-2.5">
            <div className={`h-2 rounded-full bg-background-500/50 ${n === 1 ? "w-1/4" : "w-1/3"}`} />
            <div className="h-2 w-14 rounded-full bg-background-500/30" />
            <div className="ml-auto h-5 w-10 rounded-md bg-background-500/20" />
          </div>
        ))}
      </Card>
    </Preview>
  ),

  // Single segmented button group, centered.
  "button-group-pattern": () => (
    <Preview>
      <div className="flex justify-center">
        <div className="flex">
          {[0, 1, 2, 3].map((button) => (
            <div
              key={button}
              className={`flex h-9 w-12 items-center justify-center border-[2px] border-background-500/20 ${button > 0 ? "-ml-[2px]" : ""} ${button === 0 ? "rounded-l-[10px]" : ""} ${button === 3 ? "rounded-r-[10px]" : ""} ${button === 1 ? "bg-background-500/15" : "bg-background-950"}`}
            >
              <div className="h-2 w-5 rounded bg-background-500/50" />
            </div>
          ))}
        </div>
      </div>
    </Preview>
  ),

  // Single bar with a cluster of icon actions.
  "icon-action-bar": () => (
    <Preview>
      <Card className="flex h-12 items-center gap-3 px-3">
        <div className="h-2 w-1/3 rounded-full bg-background-500/50" />
        <div className="ml-auto flex gap-2">
          {[0, 1, 2].map((action) => (
            <div
              key={action}
              className="flex size-8 items-center justify-center rounded-[8px] bg-background-500/15"
            >
              <div className="size-3 rounded-sm bg-background-500/50" />
            </div>
          ))}
        </div>
      </Card>
    </Preview>
  ),

  // Tabs above a content block.
  "tab-content-header": () => (
    <Preview>
      <div className="flex gap-2">
        {[0, 1, 2].map((tab) => (
          <div
            key={tab}
            className={`h-7 rounded-[8px] ${tab === 0 ? "w-16 bg-background-500/40" : "w-14 bg-background-500/15"}`}
          />
        ))}
      </div>
      <Card className="flex h-14 flex-col justify-center gap-2 px-3">
        <div className="h-2 w-2/3 rounded-full bg-background-500/50" />
        <div className="h-1.5 w-4/5 rounded-full bg-background-500/30" />
      </Card>
    </Preview>
  ),

  // Single tinted alert.
  "inline-alert": () => (
    <Preview>
      <Card className="flex items-start gap-3 border-background-600/40 bg-background-600/10 p-3">
        <div className="mt-0.5 size-4 shrink-0 rounded-full bg-background-600" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-2 w-1/2 rounded-full bg-background-500/50" />
          <div className="h-1.5 w-4/5 rounded-full bg-background-500/30" />
        </div>
      </Card>
    </Preview>
  ),

  // Centered empty state, no card.
  "empty-state-pattern": () => (
    <Preview className="items-center text-center">
      <div className="size-12 rounded-full bg-background-500/15" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-2.5 w-32 rounded-full bg-background-500/50" />
        <div className="h-2 w-40 rounded-full bg-background-500/30" />
      </div>
      <div className="mt-1 h-8 w-24 rounded-[10px] bg-background-600" />
    </Preview>
  ),
};
