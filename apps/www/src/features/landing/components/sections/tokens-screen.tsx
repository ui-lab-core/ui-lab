"use client";

import { Fragment, type ReactNode } from "react";
import { Ellipsis, GitPullRequest, Rocket, ShieldCheck, TriangleAlert } from "lucide-react";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Card } from "ui-lab-components/card";
import { Chart } from "ui-lab-components/chart";
import { List } from "ui-lab-components/list";
import { Scroll } from "ui-lab-components/scroll";
import { Table } from "ui-lab-components/table";
import type { Column } from "ui-lab-components/table";
import { Tabs } from "ui-lab-components/tabs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toSeries(values: number[]) {
  return MONTHS.map((month, index) => ({ month, value: values[index] }));
}

const REVENUE = toSeries([2000, 2600, 3000, 4500, 4200, 3800, 4400, 5500, 6200, 5800, 7000, 9600]);
const EARNINGS = toSeries([3800, 6200, 8000, 5500, 2800, 2000, 4600, 5200, 4000, 6800, 9600, 7400]);

/**
 * The dashboard's revenue panel, held at the same shape as the showcase example.
 * The plot area carries its own height so the chart measures the same box no
 * matter how the frame around it is scaled.
 */
function ChartPanel({
  label,
  total,
  delta,
  periodLabel,
  children,
}: {
  label: string;
  total: string;
  delta: string;
  periodLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-sm border border-background-700 bg-background-900">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-background-700 px-3.5 py-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground-400">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-foreground-100">{total}</span>
            <Badge variant="success">{delta}</Badge>
          </div>
        </div>
        <Tabs default="weekly">
          <Tabs.List aria-label={periodLabel}>
            <Tabs.Trigger value="weekly">Weekly</Tabs.Trigger>
            <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
            <Tabs.Trigger value="yearly">Yearly</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>

      <div className="h-[104px] p-2.5">{children}</div>
    </div>
  );
}

type Delivery = "shipped" | "confirmed" | "waiting" | "failed";

type Order = {
  id: string;
  customer: string;
  initials: string;
  delivery: Delivery;
  amount: string;
};

const DELIVERY: Record<Delivery, { label: string; variant: string; dot: string }> = {
  shipped: { label: "Shipped", variant: "success", dot: "bg-success-500" },
  confirmed: { label: "Confirmed", variant: "default", dot: "bg-accent-500" },
  waiting: { label: "Waiting", variant: "warning", dot: "bg-warning-500" },
  failed: { label: "Failed", variant: "danger", dot: "bg-danger-500" },
};

const ORDERS: Order[] = [
  {
    id: "AC-4192",
    customer: "John Clarkson",
    initials: "JC",
    delivery: "shipped",
    amount: "$3,412",
  },
  { id: "AC-4188", customer: "Aspen Lubin", initials: "AL", delivery: "waiting", amount: "$1,899" },
  {
    id: "AC-4181",
    customer: "Michael Ekstrom",
    initials: "ME",
    delivery: "shipped",
    amount: "$2,752",
  },
  {
    id: "AC-4176",
    customer: "Kianna Vaccaro",
    initials: "KV",
    delivery: "confirmed",
    amount: "$145",
  },
  { id: "AC-4170", customer: "Livia Saris", initials: "LS", delivery: "failed", amount: "$708" },
  {
    id: "AC-4166",
    customer: "Jaydon Aminoff",
    initials: "JA",
    delivery: "waiting",
    amount: "$224",
  },
  { id: "AC-4159", customer: "Maria Lubin", initials: "ML", delivery: "shipped", amount: "$2,959" },
  { id: "AC-4150", customer: "Ann Press", initials: "AP", delivery: "confirmed", amount: "$2,646" },
];

const columns: Column<Order>[] = [
  {
    key: "id",
    header: "Order",
    width: 118,
    cell: ({ value }) => <span className="font-mono text-xs text-foreground-400">{value}</span>,
  },
  {
    key: "customer",
    header: "Customer",
    minWidth: 190,
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background-700 text-xs font-semibold text-foreground-200">
          {row.initials}
        </span>
        <span className="truncate text-sm text-foreground-100">{row.customer}</span>
      </div>
    ),
  },
  {
    key: "delivery",
    header: "Delivery",
    minWidth: 150,
    cell: ({ row }) => {
      const delivery = DELIVERY[row.delivery];
      return (
        <Badge variant={delivery.variant}>
          <span className={`h-2 w-2 rounded-full ${delivery.dot}`} />
          <span>{delivery.label}</span>
        </Badge>
      );
    },
  },
  {
    key: "amount",
    header: "Amount",
    minWidth: 120,
    cell: ({ value }) => <span className="font-mono text-sm text-foreground-200">{value}</span>,
  },
];

type Event = {
  id: string;
  Icon: typeof Rocket;
  title: string;
  detail: string;
};

const EVENTS: Event[] = [
  {
    id: "deploy",
    Icon: Rocket,
    title: "Deployed revenue-dashboard",
    detail: "Build 9f2c1ab promoted to production in 38s. Rollback stays available for 24 hours.",
  },
  {
    id: "latency",
    Icon: TriangleAlert,
    title: "Checkout latency above budget",
    detail: "p95 crossed 400ms for six minutes on eu-west, then recovered after auto-scaling.",
  },
  {
    id: "tokens",
    Icon: GitPullRequest,
    title: "Merged: token audit for Table",
    detail: "Sophie Chen replaced twelve one-off values with semantic tokens across nine files.",
  },
  {
    id: "sso",
    Icon: ShieldCheck,
    title: "SSO enforced for acme.com",
    detail: "All 148 members now sign in through Okta. Two service accounts were exempted.",
  },
];

/**
 * The screen inside the product frame: a revenue dashboard beside an activity
 * panel. Rendered at a fixed canvas width and scaled by the frame, so the
 * density stays the designed density at every breakpoint.
 */
export function TokensScreen() {
  return (
    <div className="grid h-full w-full grid-cols-[minmax(0,1.77fr)_minmax(0,1fr)] gap-2 p-2">
      <div className="flex min-h-0 min-w-0 flex-col pt-6">
        <div className="grid grid-cols-1 gap-4">
          <ChartPanel label="Revenue" total="$18,240" delta="+9.4%" periodLabel="Revenue period">
            <Chart data={REVENUE} x="month" aria-label="Monthly revenue" className="h-full w-full">
              <Chart.Grid />
              <Chart.Axis axis="x" />
              <Chart.Area y="value" label="Revenue" color="var(--color-accent-500)" />
            </Chart>
          </ChartPanel>
          <ChartPanel
            label="Earned so far"
            total="$7,462"
            delta="+14.8%"
            periodLabel="Earnings period"
          >
            <Chart
              data={EARNINGS}
              x="month"
              aria-label="Monthly earnings"
              className="h-full w-full"
            >
              <Chart.Grid />
              <Chart.Axis axis="x" />
              <Chart.Bar y="value" label="Earned" color="var(--color-accent-500)" />
            </Chart>
          </ChartPanel>
        </div>

        <div className="mt-6">
          <Table
            data={ORDERS}
            columns={columns}
            aria-label="Recent orders"
            scroll="rows"
            className="h-[220px]"
          />
        </div>
      </div>

      <Card className="flex min-h-0 flex-col bg-background-900">
        <Card.Header className="flex flex-col gap-2.5 px-3.5 pb-0 pt-2.5">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Activity options"
              className="h-8 w-8 p-0 text-foreground-400"
            >
              <Ellipsis size={16} />
            </Button>
          </div>
          <Tabs default="activity" variant="underline">
            <Tabs.List aria-label="Workspace feed">
              <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
              <Tabs.Trigger value="alerts">
                Alerts <Badge variant="ghost">2</Badge>
              </Tabs.Trigger>
              <Tabs.Trigger value="audit">Audit</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </Card.Header>

        <Card.Body className="min-h-0 flex-1 p-0">
          <List items={EVENTS} spacing="default" className="max-w-none">
            {EVENTS.map((event, index) => (
              <Fragment key={event.id}>
                <List.Item value={event.id} interactive={false} className="items-start px-3.5 py-3">
                  <List.Media>
                    <event.Icon size={15} className="mt-0.5 text-foreground-400" />
                  </List.Media>
                  <div className="flex min-w-0 flex-col gap-2">
                    <List.Title className="text-sm">{event.title}</List.Title>
                    <List.Desc className="text-sm leading-relaxed">{event.detail}</List.Desc>
                  </div>
                </List.Item>
                {index < EVENTS.length - 1 && <List.Divider spacing="none" />}
              </Fragment>
            ))}
          </List>
        </Card.Body>
      </Card>
    </div>
  );
}
