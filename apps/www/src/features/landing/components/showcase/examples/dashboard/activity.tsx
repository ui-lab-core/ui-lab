"use client";

import { useMemo, useState } from "react";
import { Badge, GridChart, Tabs } from "ui-lab-components";
import type { ShowcasePanelProps } from "../types";

type Period = "weekly" | "monthly" | "yearly";

interface Cell {
  week: number;
  day: number;
  value: number;
}

const WEEKS = 24;
const DAYS = 7;

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTH_LABELS = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];

const STATS = [
  { label: "Lifetime tokens", value: "9B" },
  { label: "Peak tokens", value: "562.7M" },
  { label: "Longest task", value: "12h 54m" },
  { label: "Top streak", value: "62 days" },
];

const SEED: Record<Period, number> = { weekly: 17, monthly: 41, yearly: 73 };

function buildCells(seed: number): Cell[] {
  const cells: Cell[] = [];
  for (let week = 0; week < WEEKS; week++) {
    for (let day = 0; day < DAYS; day++) {
      const i = week * DAYS + day;
      const noise = (Math.sin((i + 1) * seed * 0.137) + 1) / 2;
      cells.push({ week, day, value: Math.round(noise * 12) });
    }
  }
  return cells;
}

export function ActivityHeatmap({ height }: ShowcasePanelProps) {
  const [period, setPeriod] = useState<Period>("weekly");
  const cells = useMemo(() => buildCells(SEED[period]), [period]);

  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-sm bg-background-200"
      style={{ height }}
    >
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-background-700 px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground-400">Contributions this year</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground-100">7,462</span>
            <Badge variant="success">+14.8%</Badge>
          </div>
        </div>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <Tabs.List aria-label="Activity period">
            <Tabs.Trigger value="weekly">Weekly</Tabs.Trigger>
            <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
            <Tabs.Trigger value="yearly">Yearly</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 p-3 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-sm border border-background-700 bg-background-800/40 p-3"
          >
            <span className="text-base font-semibold text-foreground-100">{stat.value}</span>
            <span className="text-sm text-foreground-500">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 items-stretch px-3 pb-3">
        <GridChart
          data={cells}
          x="week"
          y="day"
          value="value"
          rows={[0, 1, 2, 3, 4, 5, 6]}
          levels={5}
          gap={3}
          radius={2}
          minCellSize={10}
          height="calc(100% - 6px)"
          legendGap={8}
          legendOffset={18}
          color="var(--color-accent-500)"
          emptyColor="var(--color-background-700)"
          formatY={(day) => DAY_LABELS[Number(day)]}
          formatX={(week) => (Number(week) % 4 === 0 ? MONTH_LABELS[Number(week) / 4] : "")}
          formatValue={(value) => `${value} contributions`}
          aria-label="Contribution activity"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
