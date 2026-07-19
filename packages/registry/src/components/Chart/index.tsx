import React from 'react';
import { Chart } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const data = [
  { month: 'Jan', revenue: 42 },
  { month: 'Feb', revenue: 58 },
  { month: 'Mar', revenue: 51 },
  { month: 'Apr', revenue: 76 },
  { month: 'May', revenue: 68 },
  { month: 'Jun', revenue: 89 },
];

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

export const chartDetail: ComponentDetail = {
  id: "chart",
  name: "Chart",
  description: "A composable data visualization component for lines, areas, bars, points, and annotations.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>Chart turns structured rows into accessible line, area, bar, and point visualizations with shared axes and scales.</p>
      <p>Compose series with grids, references, legends, and tooltips to compare trends or highlight thresholds while preserving keyboard navigation.</p>
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
  ],
};
