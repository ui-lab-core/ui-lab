"use client";

import { Progress, Badge, Button, Divider } from "ui-lab-components";
import { Gauge, ArrowUpRight } from "lucide-react";

const RESOURCES = [
  { id: "bandwidth", label: "Bandwidth", used: 84, limit: 100, unit: "GB", variant: "warning" },
  { id: "builds", label: "Build minutes", used: 1240, limit: 6000, unit: "min", variant: undefined },
  { id: "storage", label: "Storage", used: 2.1, limit: 10, unit: "GB", variant: undefined },
  { id: "functions", label: "Function invocations", used: 412, limit: 1000, unit: "k", variant: undefined },
];

export function UsagePanel() {
  return (
    <div className="h-fit w-full bg-background-900 border border-background-700 rounded-sm overflow-hidden">
      <div className="px-4 pt-3.5 pb-3 border-b border-background-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gauge size={18} className="text-foreground-300" />
          <div>
            <div className="text-sm font-semibold text-foreground-100">Usage</div>
            <div className="text-sm text-foreground-400 mt-0.5">Resets in 12 days.</div>
          </div>
        </div>
        <Badge>Pro plan</Badge>
      </div>

      {RESOURCES.map((r, i) => {
        const percent = Math.round((r.used / r.limit) * 100);
        return (
          <div key={r.id}>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground-100">{r.label}</span>
                <span className="text-xs text-foreground-400">
                  {r.used.toLocaleString()} / {r.limit.toLocaleString()} {r.unit}
                </span>
              </div>
              <Progress value={percent} variant={r.variant} aria-label={`${r.label} usage`} />
            </div>
            {i < RESOURCES.length - 1 && <Divider spacing="none" size="sm" />}
          </div>
        );
      })}

      <div className="px-4 py-3 border-t border-background-700 flex items-center justify-between">
        <span className="text-sm text-foreground-400">Bandwidth is nearing its limit.</span>
        <Button size="sm" variant="ghost" icon={{ right: <ArrowUpRight size={13} /> }}>
          Increase limits
        </Button>
      </div>
    </div>
  );
}
