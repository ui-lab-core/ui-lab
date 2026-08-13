"use client";

import { Fragment, useState } from "react";
import { Badge, Button, Card, Chart, Divider, Flex, Group, List } from "ui-lab-components";
import { Facebook, Instagram, Store, TrendingDown, TrendingUp } from "lucide-react";

const ranges = ["1D", "1W", "1M", "3M", "1Y"];

const salesData = [
  { day: 0, value: 62 },
  { day: 1, value: 34 },
  { day: 2, value: 33 },
  { day: 3, value: 95 },
  { day: 4, value: 92 },
  { day: 5, value: 38 },
  { day: 6, value: 70 },
  { day: 7, value: 30 },
  { day: 8, value: 55 },
  { day: 9, value: 27 },
  { day: 10, value: 65 },
  { day: 11, value: 45 },
  { day: 12, value: 47 },
  { day: 13, value: 88 },
  { day: 14, value: 40 },
  { day: 15, value: 90 },
  { day: 16, value: 28 },
  { day: 17, value: 75 },
  { day: 18, value: 30 },
  { day: 19, value: 92 },
  { day: 20, value: 55 },
];

const channels = [
  {
    id: "store",
    label: "Online Store",
    icon: Store,
    value: "$52.12",
    change: "+4.5%",
    trend: "up" as const,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    value: "$38.45",
    change: "-2.8%",
    trend: "down" as const,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    value: "$37.75",
    change: "+3.2%",
    trend: "up" as const,
  },
];

export function PreviewCanvas() {
  const [range, setRange] = useState("1W");

  return (
    <div className="w-full p-4">
      <Card className="w-full bg-transparent">
        <Card.Header >
          <Flex justify-between align-center>
            <span className="text-sm text-foreground-400">Total Sales</span>
            <Button size="sm" variant="secondary">
              Report
            </Button>
          </Flex>
          <Flex align-center gap="sm" className="mt-2">
            <span className="text-3xl font-semibold text-foreground-100">$128.32</span>
            <Badge className="border-none bg-success-500/20 text-success-500">+2%</Badge>
          </Flex>
        </Card.Header>

        <Card.Body className="space-y-4 py-4">
          <Group aria-label="Sales range" value={range} onChange={setRange} className="w-full">
            {ranges.map((label, index) => (
              <Fragment key={label}>
                {index > 0 && <Divider />}
                <Group.Button value={label} className="flex-1">
                  {label}
                </Group.Button>
              </Fragment>
            ))}
          </Group>

          <Chart data={salesData} x="day" domain={[0, 100]} className="h-40 border border-background-700 rounded-sm" aria-label="Total sales this week">
            <Chart.Reference y={55} />
            <Chart.Reference x={7} />
            <Chart.Reference x={14} />
            <Chart.Line y="value" label="Sales" color="var(--color-accent-300)" />
            <Chart.Tooltip />
          </Chart>

          <List aria-label="Sales by channel" spacing="sm">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const TrendIcon = channel.trend === "up" ? TrendingUp : TrendingDown;
              return (
                <List.Item key={channel.id}>
                  <List.Media>
                    <Icon size={18} className="text-foreground-300" />
                  </List.Media>
                  <Flex justify-between align-center className="min-w-0 flex-1">
                    <List.Title>{channel.label}</List.Title>
                    <Flex align-center gap="lg">
                      <span className="tabular-nums text-foreground-200">{channel.value}</span>
                      <Flex
                        align-center
                        gap="xs"
                        className={channel.trend === "up" ? "text-success-500" : "text-danger-500"}
                      >
                        <TrendIcon size={14} />
                        <span className="text-sm">{channel.change}</span>
                      </Flex>
                    </Flex>
                  </Flex>
                </List.Item>
              );
            })}
          </List>
        </Card.Body>
      </Card>
    </div>
  );
}
