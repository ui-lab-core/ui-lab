"use client";

import { Badge } from "ui-lab-components";
import type { ShowcasePanelProps } from "../types";

const SERVICES = [
  { name: "API", uptime: "99.99%", incident: false },
  { name: "Dashboard", uptime: "99.97%", incident: false },
  { name: "Webhooks", uptime: "99.82%", incident: true },
];

// 30 days of status, oldest first. 1 = degraded.
const DAYS = Array.from({ length: 30 }, (_, index) => (index === 11 || index === 24 ? 1 : 0));

export function UptimeStatusPanel({ height }: ShowcasePanelProps) {
  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden p-4" style={{ height }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-foreground-100">System status</div>
          <div className="text-sm text-foreground-400">Last 30 days</div>
        </div>
        <Badge variant="success">Operational</Badge>
      </div>

      <div className="flex gap-0.5">
        {DAYS.map((degraded, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key -- static, ordered day series
            key={index}
            className={`h-8 flex-1 rounded-[2px] ${degraded ? "bg-warning-500" : "bg-success-500"}`}
          />
        ))}
      </div>

      <div className="flex flex-col divide-y divide-background-700">
        {SERVICES.map((service) => (
          <div key={service.name} className="flex items-center justify-between py-2 text-sm">
            <span className="text-foreground-100">{service.name}</span>
            <span className="flex items-center gap-2 text-foreground-400">
              {service.incident && <span className="text-warning-500">Degraded</span>}
              <span className="font-mono">{service.uptime}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
