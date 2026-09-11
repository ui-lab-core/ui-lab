"use client";

import { Badge } from "ui-lab-components/badge";
import { Chart } from "ui-lab-components/chart";
import { Flex } from "ui-lab-components/flex";
import { Tooltip } from "ui-lab-components/tooltip";
import { Surface, Note, Stat } from "./shared";

export default function Traffic() {
  const data = [
    { day: "M", visitors: 120 },
    { day: "T", visitors: 210 },
    { day: "W", visitors: 170 },
    { day: "Th", visitors: 290 },
    { day: "F", visitors: 240 },
    { day: "Sa", visitors: 180 },
    { day: "Su", visitors: 320 },
  ];
  return (
    <Surface title="Weekly visitors">
      <Stat value="1,530" badge={<Badge variant="success">+18.2%</Badge>} />
      <Flex direction="column" gap="sm" className="min-w-0">
        <Chart data={data} x="day" className="h-32 w-full" aria-label="Daily visitor totals">
          <Chart.Bar y="visitors" label="Visitors" color="var(--color-accent-400)" />
          <Chart.Axis axis="x" />
          <Chart.Tooltip />
        </Chart>
        <Note>Most visitors arrive on Sunday.</Note>
      </Flex>
    </Surface>
  );
}

