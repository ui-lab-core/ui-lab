"use client";

import { Chart } from "ui-lab-components";
import type { ShowcasePanelProps } from "../types";

const PAGE_ANALYTICS = [
  { date: "Aug 25", views: 820 },
  { date: "Aug 26", views: 940 },
  { date: "Aug 27", views: 880 },
  { date: "Aug 28", views: 1120 },
  { date: "Aug 29", views: 1040 },
  { date: "Aug 30", views: 1280 },
  { date: "Aug 31", views: 1160 },
  { date: "Sep 1", views: 1420 },
  { date: "Sep 2", views: 1340 },
  { date: "Sep 3", views: 1580 },
  { date: "Sep 4", views: 1460 },
  { date: "Sep 5", views: 1720 },
];

const totalViews = PAGE_ANALYTICS.reduce((total, day) => total + day.views, 0);

export function BuildDurationChart({ height }: ShowcasePanelProps) {
  return (
    <section
      aria-label="Page analytics"
      className="flex w-full flex-col overflow-hidden pt-4 pb-4"
      style={{ height }}
    >
      <div className="px-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-foreground-200">Page analytics</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl tracking-tight text-foreground-100">
              {totalViews.toLocaleString("en-US")}
            </span>
            <span className="text-sm text-foreground-400">page views</span>
          </div>
        </div>
        <div className="text-right text-sm text-foreground-400">
          <span className="inline-flex items-center gap-1.5 text-foreground-200">All pages</span>
          <p className="mt-1">Aug 25 – Sep 5</p>
        </div>
      </div>
      <Chart
        data={PAGE_ANALYTICS}
        x="date"
        domain={[0, 2000]}
        aria-label="Daily page views from August 25 to September 5"
        className="mt-4 min-h-0 flex-1"
        style={{ height: "auto" }}
      >
        <Chart.Grid />
        <Chart.Axis axis="x" ticks={4} />
        <Chart.Axis
          axis="y"
          ticks={3}
          format={(value) => (value >= 1000 ? `${value / 1000}k` : String(value))}
        />
        <Chart.Area y="views" label="Page views" color="var(--foreground-400)" curve="smooth" />
        <Chart.Tooltip>
          {(row) => (
            <>
              <span className="text-foreground-400">{row.date}</span>
              <span className="font-mono text-foreground-100">
                {row.views.toLocaleString("en-US")} views
              </span>
            </>
          )}
        </Chart.Tooltip>
      </Chart>
    </section>
  );
}
