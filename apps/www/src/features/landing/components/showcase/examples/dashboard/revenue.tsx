"use client";

import { useState } from "react";
import { Badge, Chart, Tabs } from "ui-lab-components";
import type { ShowcasePanelProps } from "../types";

type Period = "weekly" | "monthly" | "yearly";

interface Point {
  month: string;
  value: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toSeries(values: number[]): Point[] {
  return MONTHS.map((month, i) => ({ month, value: values[i] }));
}

const DATA: Record<Period, { total: string; delta: string; points: Point[] }> = {
  weekly: {
    total: "$18,240",
    delta: "+9.4%",
    points: toSeries([2000, 2600, 3000, 4500, 4200, 3800, 4400, 5500, 6200, 5800, 7000, 9600]),
  },
  monthly: {
    total: "$74,905",
    delta: "+6.1%",
    points: toSeries([3000, 3400, 4000, 3800, 4800, 5500, 5200, 6000, 6600, 7200, 7800, 8800]),
  },
  yearly: {
    total: "$921,430",
    delta: "+18.7%",
    points: toSeries([1200, 2200, 2800, 3600, 4000, 5200, 5800, 5500, 6800, 7400, 8400, 9900]),
  },
};

export function RevenueChart({ height }: ShowcasePanelProps) {
  const [period, setPeriod] = useState<Period>("weekly");
  const series = DATA[period];

  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-sm bg-background-200"
      style={{ height }}
    >
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-background-700 px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground-400">Revenue</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground-100">{series.total}</span>
            <Badge variant="success">{series.delta}</Badge>
          </div>
        </div>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <Tabs.List aria-label="Revenue period">
            <Tabs.Trigger value="weekly">Weekly</Tabs.Trigger>
            <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
            <Tabs.Trigger value="yearly">Yearly</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>

      <div className="min-h-0 flex-1 p-3">
        <Chart
          data={series.points}
          x="month"
          aria-label="Monthly revenue"
          className="h-full w-full"
        >
          <Chart.Grid />
          <Chart.Axis axis="x" />
          <Chart.Area y="value" label="Revenue" color="var(--color-accent-500)" />
          <Chart.Cursor />
        </Chart>
      </div>
    </div>
  );
}
