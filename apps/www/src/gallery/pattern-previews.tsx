"use client";

import React from "react";

const previewRows = [0, 1] as const;

function Preview({ children }: React.PropsWithChildren) {
  return (
    <div className="flex w-full flex-col justify-center gap-3 p-4">
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
  "media-object": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <div className="size-8 shrink-0 rounded-[8px] bg-background-500/20" />
          <Lines short={n === 1} />
        </div>
      ))}
    </Preview>
  ),

  "split-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center justify-between gap-4 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <Lines short={n === 0} />
          <div className="h-5 w-12 shrink-0 rounded-md bg-background-500/20" />
        </div>
      ))}
    </Preview>
  ),

  "stat-block": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <div className="h-8 w-12 shrink-0 rounded-md bg-background-500/20" />
          <div className={`h-2 rounded-full bg-background-500/50 ${n === 0 ? "w-20" : "w-14"}`} />
          {n === 0 && <div className="h-2 w-8 rounded-full bg-accent-500/50" />}
        </div>
      ))}
    </Preview>
  ),

  "labeled-field": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <div className={`h-2 shrink-0 rounded-full bg-background-500/50 ${n === 0 ? "w-14" : "w-10"}`} />
          <div className="h-8 flex-1 rounded-[8px] border-[2px] border-background-500/20 bg-background-950" />
        </div>
      ))}
    </Preview>
  ),

  "search-input": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-2 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-3">
          <div className="size-3 shrink-0 rounded-full border-[2px] border-background-500/50" />
          <div className={`h-2 rounded-full bg-background-500/50 ${n === 0 ? "w-2/3" : "w-1/2"}`} />
          {n === 1 && <div className="ml-auto h-5 w-8 rounded-md bg-background-500/20" />}
        </div>
      ))}
    </Preview>
  ),

  "toggle-setting-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center justify-between gap-4 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <Lines short={n === 1} />
          <div className={`h-5 w-8 shrink-0 rounded-full ${n === 0 ? "bg-accent-500/60" : "bg-background-500/30"}`}>
            <div className={`m-0.5 size-4 rounded-full bg-background-950 ${n === 0 ? "ml-3.5" : ""}`} />
          </div>
        </div>
      ))}
    </Preview>
  ),

  "select-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center justify-between gap-4 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <Lines short={n === 0} />
          <div className="flex h-8 w-20 shrink-0 items-center justify-end rounded-[8px] border-[2px] border-background-500/20 bg-background-950 px-2">
            <div className="size-1.5 -translate-y-0.5 rotate-45 border-b-2 border-r-2 border-background-500/50" />
          </div>
        </div>
      ))}
    </Preview>
  ),

  "badge-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-2 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          {[12, 16, 10].map((width, index) => (
            <div
              key={width}
              className={`h-5 rounded-full ${n === 0 && index === 0 ? "bg-accent-500/40" : "bg-background-500/30"}`}
              style={{ width: width * 4 }}
            />
          ))}
        </div>
      ))}
    </Preview>
  ),

  "progress-metric": () => (
    <Preview>
      {[68, 42].map((percent, n) => (
        <div key={percent} className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <div className={`h-2 shrink-0 rounded-full bg-background-500/50 ${n === 0 ? "w-16" : "w-12"}`} />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-500/20">
            <div className="h-full rounded-full bg-accent-500/60" style={{ width: `${percent}%` }} />
          </div>
          <div className="h-2 w-8 rounded-full bg-background-500/30" />
        </div>
      ))}
    </Preview>
  ),

  "data-table-row": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-4 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <div className={`h-2 rounded-full bg-background-500/50 ${n === 0 ? "w-1/3" : "w-1/4"}`} />
          <div className="h-2 w-14 rounded-full bg-background-500/30" />
          <div className="ml-auto h-5 w-12 rounded-md bg-background-500/20" />
        </div>
      ))}
    </Preview>
  ),

  "button-group-pattern": () => (
    <Preview>
      {previewRows.map((row) => (
        <div key={row} className="flex h-12 items-center rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          {[0, 1, 2].map((button) => (
            <div
              key={button}
              className={`flex h-8 w-10 items-center justify-center border-[2px] border-background-500/20 bg-background-950 ${button > 0 ? "-ml-[2px]" : ""} ${button === 0 ? "rounded-l-[8px]" : ""} ${button === 2 ? "rounded-r-[8px]" : ""}`}
            >
              <div className={`rounded bg-background-500/50 ${row === 0 ? "h-2 w-5" : "size-2"}`} />
            </div>
          ))}
        </div>
      ))}
    </Preview>
  ),

  "icon-action-bar": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <div className={`h-2 rounded-full bg-background-500/50 ${n === 0 ? "w-1/2" : "w-1/3"}`} />
          <div className="ml-auto flex gap-1.5">
            {[0, 1].map((action) => (
              <div key={action} className="flex size-8 items-center justify-center rounded-[10px] bg-background-500/20">
                <div className="size-2 rounded-sm bg-background-500/50" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Preview>
  ),

  "tab-content-header": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
          <Lines short={n === 1} />
          <div className="h-8 w-16 shrink-0 rounded-[10px] bg-background-500/20" />
        </div>
      ))}
    </Preview>
  ),

  "inline-alert": () => (
    <Preview>
      {previewRows.map((n) => (
        <div key={n} className="flex h-12 items-center gap-2.5 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-3">
          <div className={`size-3 shrink-0 rounded-full ${n === 0 ? "bg-accent-500/60" : "bg-background-500/40"}`} />
          <div className={`h-2 rounded-full bg-background-500/50 ${n === 0 ? "w-2/3" : "w-1/2"}`} />
        </div>
      ))}
    </Preview>
  ),

  "empty-state-pattern": () => (
    <Preview>
      <div className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2">
        <div className="size-8 shrink-0 rounded-full bg-background-500/20" />
        <Lines />
      </div>
      <div className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2 pl-[52px]">
        <div className="h-7 w-16 rounded-[8px] bg-background-500/20" />
        <div className="h-2 w-14 rounded-full bg-background-500/30" />
      </div>
    </Preview>
  ),
};
