"use client";

import { useState } from "react";
import { Badge, Button, Checkbox, Divider, Progress } from "ui-lab-components";
import { Activity, CheckCircle2, Clock3, FilePlus2, GitPullRequest, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import type { ShowcasePanelProps } from "./types";

const events = [
  { id: "evt_build", label: "Preview build passed", meta: "main · 42s", icon: <CheckCircle2 size={19} className="text-success-500" /> },
  { id: "evt_review", label: "Morgan requested review", meta: "Billing settings", icon: <GitPullRequest size={19} className="text-foreground-300" /> },
  { id: "evt_upload", label: "Assets synced", meta: "8 files · CDN", icon: <UploadCloud size={19} className="text-foreground-300" /> },
];

const tasks = [
  { id: "copy", label: "Approve homepage copy", done: true },
  { id: "qa", label: "QA pricing toggle", done: false },
  { id: "handoff", label: "Send launch handoff", done: false },
];

export function QuickActions({ height }: ShowcasePanelProps) {
  return (
    <div
      className="flex w-full flex-col overflow-hidden"
      style={{ height }}
    >
      <div className="flex items-center justify-between border-b border-background-700/40 px-4 py-3">
        <span className="text-sm font-semibold text-foreground-100">Quick actions</span>
        <Badge>4 ready</Badge>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-3">
        <Button variant="outline" className="h-full justify-start" icon={{ left: <Sparkles size={17} /> }}>
          Generate brief
        </Button>
        <Button variant="outline" className="h-full justify-start" icon={{ left: <FilePlus2 size={17} /> }}>
          New doc
        </Button>
      </div>
    </div>
  );
}

export function TaskQueue({ height }: ShowcasePanelProps) {
  const [checked, setChecked] = useState(() => new Set(tasks.filter((task) => task.done).map((task) => task.id)));

  function toggle(id: string, done: boolean) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (done) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <div className="px-2"
      style={{ height }}
    >
      <div
        className="flex w-full flex-col overflow-hidden rounded-sm border border-background-700"
      >
        <div className="flex items-center justify-between border-b border-background-700 px-4 py-3">
          <span className="text-sm font-semibold text-foreground-100">Today</span>
          <span className="text-sm text-foreground-400">{checked.size}/{tasks.length}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {tasks.map((task, index) => {
            const done = checked.has(task.id);
            return (
              <div key={task.id}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-background-800">
                  <Checkbox state={{ checked: done }} onChange={(event) => toggle(task.id, event.target.checked)} />
                  <span className={`truncate text-sm ${done ? "text-foreground-400 line-through" : "text-foreground-100"}`}>
                    {task.label}
                  </span>
                </label>
                {index < tasks.length - 1 && <Divider spacing="none" size="sm" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

