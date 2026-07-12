"use client";

import { Fragment } from "react";
import { List, Badge, Button } from "ui-lab-components";
import { GitBranch, GitCommitHorizontal, RotateCcw } from "lucide-react";
import type { ShowcasePanelProps } from "./types";

type Status = "ready" | "building" | "error";

interface Deployment {
  id: string;
  commit: string;
  message: string;
  branch: string;
  status: Status;
  time: string;
  duration: string;
}

const DEPLOYMENTS: Deployment[] = [
  { id: "dpl_1", commit: "9f2c1ab", message: "Fix hydration mismatch in theme script", branch: "main", status: "ready", time: "2m ago", duration: "38s" },
  { id: "dpl_2", commit: "e41d90c", message: "Add masonry layout to showcase grid", branch: "feat/showcase", status: "building", time: "5m ago", duration: "…" },
  { id: "dpl_3", commit: "b7a3f21", message: "Upgrade tailwind to v4.1", branch: "chore/deps", status: "error", time: "1h ago", duration: "12s" },
];

const STATUS: Record<Status, { label: string; variant: string; dot: string }> = {
  ready: { label: "Ready", variant: "success", dot: "bg-success-500" },
  building: { label: "Building", variant: "warning", dot: "bg-warning-500 animate-pulse" },
  error: { label: "Failed", variant: "danger", dot: "bg-danger-500" },
};

export function DeploymentList({ height }: ShowcasePanelProps) {
  return (
    <div
      className="flex w-full flex-col overflow-hidden"
      style={{ height }}
    >
      <div className="px-4 pt-3.5 pb-3 border-b border-background-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground-100">Deployments</span>
          <span className="text-sm text-foreground-400">acme/web</span>
        </div>
        <Badge>Production</Badge>
      </div>

      <List items={DEPLOYMENTS} spacing="default" className="min-h-0 flex-1 overflow-y-auto max-w-none">
        {DEPLOYMENTS.map((d, i) => {
          const status = STATUS[d.status];
          return (
            <Fragment key={d.id}>
              <List.Item value={d.id} className="px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground-100 truncate">{d.message}</div>
                  <div className="flex items-center gap-2 text-xs text-foreground-400 mt-0.5">
                    <span className="flex items-center gap-1"><GitBranch size={11} />{d.branch}</span>
                    <span className="flex items-center gap-1 font-mono"><GitCommitHorizontal size={11} />{d.commit}</span>
                    <span>{d.time} · {d.duration}</span>
                  </div>
                </div>
                {d.status === "error" ? (
                  <Button size="sm" variant="ghost" icon={{ left: <RotateCcw size={12} /> }}>
                    Retry
                  </Button>
                ) : (
                  <Badge variant="ghost">
                    <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
                    <span>{status.label}</span>
                  </Badge>
                )}
              </List.Item>
              {i < DEPLOYMENTS.length - 1 && <List.Divider spacing="none" />}
            </Fragment>
          );
        })}
      </List>
    </div>
  );
}
