"use client";

import { Fragment } from "react";
import { List, Badge, Button } from "ui-lab-components";
import { GitBranch, GitCommitHorizontal, RotateCcw } from "lucide-react";

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
  { id: "dpl_4", commit: "c02e876", message: "Ship pricing page copy updates", branch: "main", status: "ready", time: "3h ago", duration: "41s" },
];

const STATUS: Record<Status, { label: string; variant: string; dot: string }> = {
  ready: { label: "Ready", variant: "success", dot: "bg-success-500" },
  building: { label: "Building", variant: "warning", dot: "bg-warning-500 animate-pulse" },
  error: { label: "Failed", variant: "danger", dot: "bg-danger-500" },
};

export function DeploymentList() {
  return (
    <div className="h-fit w-full bg-background-900 border border-background-700 rounded-sm overflow-hidden">
      <div className="px-4 pt-3.5 pb-3 border-b border-background-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground-100">Deployments</span>
          <span className="text-sm text-foreground-400">acme/web</span>
        </div>
        <Badge>Production</Badge>
      </div>

      <List items={DEPLOYMENTS} spacing="default" className="max-w-none">
        {DEPLOYMENTS.map((d, i) => {
          const status = STATUS[d.status];
          return (
            <Fragment key={d.id}>
              <List.Item value={d.id} className="px-4 py-3">
                <List.Media>
                  <div className="w-8 h-8 rounded-sm bg-background-800 flex items-center justify-center shrink-0">
                    <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                  </div>
                </List.Media>
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
                  <Badge variant={status.variant}>{status.label}</Badge>
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
