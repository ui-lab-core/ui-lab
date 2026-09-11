"use client";

import { useState } from "react";
import { Badge } from "ui-lab-components/badge";
import { Chart } from "ui-lab-components/chart";
import { Divider } from "ui-lab-components/divider";
import { Flex } from "ui-lab-components/flex";
import { Grid } from "ui-lab-components/grid";
import { Tooltip } from "ui-lab-components/tooltip";
import { Surface, Note, Stat, Choice } from "./shared";

const revenue = [
  { month: "Apr", current: 12600, previous: 10200 },
  { month: "May", current: 18200, previous: 12800 },
  { month: "Jun", current: 15800, previous: 14100 },
  { month: "Jul", current: 23400, previous: 16200 },
  { month: "Aug", current: 21700, previous: 18000 },
  { month: "Sep", current: 28450, previous: 21300 },
];

export default function Revenue() {
  const [range, setRange] = useState("6 months");
  return (
    <Surface
      title="Revenue"
      action={
        <Choice
          label="Revenue period"
          value={range}
          options={["3 months", "6 months"]}
          onChange={setRange}
        />
      }
    >
      <Stat
        value="$28,450"
        badge={<Badge variant="success">+33.6%</Badge>}
        caption="vs. previous September"
      />
      <Chart
        data={range === "3 months" ? revenue.slice(-3) : revenue}
        x="month"
        className="h-56 w-full"
        aria-label="Monthly revenue compared with last year"
      >
        <Chart.Grid axis="y" />
        <Chart.Axis axis="x" />
        <Chart.Axis axis="y" format={(value) => `$${Number(value) / 1000}k`} />
        <Chart.Line y="previous" label="Last year" color="var(--color-foreground-400)" />
        <Chart.Area y="current" label="This year" color="var(--color-accent-400)" />
        <Chart.Cursor />
        <Chart.Tooltip />
        <Chart.Legend />
      </Chart>
      <Divider spacing="none" />
      <Grid columns="auto-fit" gap="md">
        {[
          ["Orders", "1,284"],
          ["Conversion", "3.62%"],
          ["Average order", "$22.16"],
        ].map(([label, value]) => (
          <Flex key={label} direction="column" gap="xs" className="min-w-0">
            <Note>{label}</Note>
            <strong className="text-3xl">{value}</strong>
          </Flex>
        ))}
      </Grid>
    </Surface>
  );
}

