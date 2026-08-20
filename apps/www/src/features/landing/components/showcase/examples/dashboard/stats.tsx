"use client";

import { Badge } from "ui-lab-components";
import { Users, Package, ShoppingBag, MessageSquare } from "lucide-react";
import type { ShowcasePanelProps } from "../types";

interface Metric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: React.ReactNode;
}

const METRICS: Metric[] = [
  {
    id: "customers",
    label: "Customers",
    value: "14,592",
    delta: "+5.3%",
    trend: "up",
    icon: <Users size={16} />,
  },
  {
    id: "units",
    label: "Units sold",
    value: "385",
    delta: "-2.1%",
    trend: "down",
    icon: <Package size={16} />,
  },
  {
    id: "orders",
    label: "Orders",
    value: "1,394",
    delta: "0.0%",
    trend: "flat",
    icon: <ShoppingBag size={16} />,
  },
  {
    id: "tickets",
    label: "Support tickets",
    value: "708",
    delta: "+12.8%",
    trend: "up",
    icon: <MessageSquare size={16} />,
  },
];

const TREND_VARIANT: Record<Metric["trend"], "success" | "danger" | "ghost"> = {
  up: "success",
  down: "danger",
  flat: "ghost",
};

export function StatCards({ height }: ShowcasePanelProps) {
  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-sm bg-background-200"
      style={{ height }}
    >
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-3">
        {METRICS.map((metric) => (
          <div
            key={metric.id}
            className="flex flex-col justify-between gap-3 rounded-sm border border-background-700 bg-background-800/40 p-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-background-700/60 text-foreground-300">
              {metric.icon}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-foreground-400">{metric.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-foreground-100">{metric.value}</span>
                <Badge variant={TREND_VARIANT[metric.trend]}>{metric.delta}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
