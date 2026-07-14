"use client";

import type { ShowcasePanelProps } from "./types";

function Line({ className = "" }: { className?: string }) {
  return <div className={`h-2 rounded-full bg-background-700/60 ${className}`} />;
}

function Header() {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-background-700/40 px-4 py-4">
      <Line className="w-24" />
      <Line className="w-10 opacity-60" />
    </div>
  );
}

function Frame({ height, children }: ShowcasePanelProps & { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col overflow-hidden" style={{ height }}>
      <Header />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}

const stats = (tiles: number) =>
  function Stats({ height }: ShowcasePanelProps) {
    return (
      <Frame height={height}>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-3">
          {Array.from({ length: tiles }, (_, i) => (
            <div key={i} className="flex flex-col justify-center gap-2.5 rounded-sm bg-background-800/50 p-4">
              <Line className="w-14 opacity-60" />
              <Line className="h-3 w-20" />
            </div>
          ))}
        </div>
      </Frame>
    );
  };

const chart = (bars: number[]) =>
  function Chart({ height }: ShowcasePanelProps) {
    return (
      <Frame height={height}>
        <div className="flex min-h-0 flex-1 items-end gap-2 p-4">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="min-w-0 flex-1 rounded-sm bg-background-800/70"
              style={{ height: `${bar}%` }}
            />
          ))}
        </div>
      </Frame>
    );
  };

const rows = (count: number) =>
  function Rows({ height }: ShowcasePanelProps) {
    return (
      <Frame height={height}>
        <div className="flex min-h-0 flex-1 flex-col justify-start overflow-hidden">
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-background-700/40 px-4 py-3 last:border-b-0"
            >
              <div className="h-9 w-9 shrink-0 rounded-sm bg-background-800/70" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Line className="w-2/5" />
                <Line className="h-1.5 w-1/4 opacity-60" />
              </div>
              <Line className="w-8 opacity-60" />
            </div>
          ))}
        </div>
      </Frame>
    );
  };

const meters = (values: number[]) =>
  function Meters({ height }: ShowcasePanelProps) {
    return (
      <Frame height={height}>
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 p-4">
          {values.map((value, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Line className="w-16 opacity-60" />
                <Line className="w-6 opacity-60" />
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background-800/50">
                <div className="h-full rounded-full bg-background-700/80" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Frame>
    );
  };

const tiles = (count: number) =>
  function Tiles({ height }: ShowcasePanelProps) {
    return (
      <Frame height={height}>
        <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-2 overflow-hidden p-3">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-square w-full rounded-sm bg-background-800/70" />
              <Line className="w-3/4 opacity-60" />
            </div>
          ))}
        </div>
      </Frame>
    );
  };

function Player({ height }: ShowcasePanelProps) {
  return (
    <Frame height={height}>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 p-4">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 shrink-0 rounded-sm bg-background-800/70" />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <Line className="w-1/2" />
            <Line className="h-1.5 w-1/3 opacity-60" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Line className="w-6 opacity-60" />
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-background-800/50">
            <div className="h-full w-2/5 rounded-full bg-background-700/80" />
          </div>
          <Line className="w-6 opacity-60" />
        </div>
      </div>
    </Frame>
  );
}

export const dashboard = {
  Stats: stats(4),
  Chart: chart([35, 55, 40, 70, 50, 85, 60, 75, 45, 90]),
  Rows: rows(6),
  Meters: meters([72, 45, 88]),
  Summary: stats(2),
  Events: rows(4),
};

export const sales = {
  Stats: stats(4),
  Pipeline: meters([90, 65, 40, 25]),
  Leads: rows(6),
  Chart: chart([25, 40, 35, 60, 55, 45, 70, 65, 80, 75]),
  Targets: meters([58, 82]),
  Accounts: rows(4),
};

export const entertainment = {
  Library: tiles(9),
  Player,
  Queue: rows(6),
  Featured: tiles(6),
  Charts: meters([95, 80, 60, 45]),
  History: rows(4),
};
