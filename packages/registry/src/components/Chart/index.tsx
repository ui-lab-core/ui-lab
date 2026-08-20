import React from "react";
import { Chart } from "ui-lab-components";
import { ComponentDetail } from "@/types";

const data = [
  { month: "Jan", revenue: 42 },
  { month: "Feb", revenue: 58 },
  { month: "Mar", revenue: 51 },
  { month: "Apr", revenue: 76 },
  { month: "May", revenue: 68 },
  { month: "Jun", revenue: 89 },
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const activity = months.flatMap((month, monthIndex) =>
  weekdays.map((day, dayIndex) => ({
    month,
    day,
    contributions: (monthIndex * 7 + dayIndex * 11) % 18,
  })),
);

const chartBasicCode = `import { Chart } from "ui-lab-components";

const data = [
  { month: "Jan", revenue: 42 },
  { month: "Feb", revenue: 58 },
  { month: "Mar", revenue: 51 },
  { month: "Apr", revenue: 76 },
  { month: "May", revenue: 68 },
  { month: "Jun", revenue: 89 },
];

export function Example() {
  return (
    <Chart data={data} x="month" aria-label="Monthly revenue">
      <Chart.Grid />
      <Chart.Axis axis="x" />
      <Chart.Axis axis="y" />
      <Chart.Line y="revenue" label="Revenue" />
      <Chart.Tooltip />
    </Chart>
  );
}`;

const chartGridCode = `import { GridChart } from "ui-lab-components";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const activity = months.flatMap((month, monthIndex) =>
  weekdays.map((day, dayIndex) => ({
    month,
    day,
    contributions: (monthIndex * 7 + dayIndex * 11) % 18,
  })),
);

export function Example() {
  return (
    <GridChart
      data={activity}
      x="month"
      y="day"
      value="contributions"
      columns={months}
      rows={weekdays}
      levels={5}
      aria-label="Contributions by month and weekday"
    />
  );
}`;

export const chartDetail: ComponentDetail = {
  id: "chart",
  name: "Chart",
  description:
    "Composable line, area, bar, point, and grid data visualizations.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        Chart turns structured rows into accessible line, area, bar, point, and grid visualizations.
      </p>
      <p>
        Compose series with grids, references, legends, and tooltips to compare trends or highlight
        thresholds while preserving keyboard navigation.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: "default",
      name: "Default",
      description: "A line chart with axes, grid lines, and an interactive tooltip.",
      code: chartBasicCode,
      preview: (
        <Chart data={data} x="month" aria-label="Monthly revenue">
          <Chart.Grid />
          <Chart.Axis axis="x" />
          <Chart.Axis axis="y" />
          <Chart.Line y="revenue" label="Revenue" />
          <Chart.Tooltip />
        </Chart>
      ),
    },
    {
      id: "grid",
      name: "Grid",
      description: "A stepped-color grid for heatmaps, contribution charts, and categorical matrices.",
      code: chartGridCode,
      preview: (
        <Chart.GridChart
          data={activity}
          x="month"
          y="day"
          value="contributions"
          columns={months}
          rows={weekdays}
          levels={5}
          aria-label="Contributions by month and weekday"
        />
      ),
    },
  ],
};
