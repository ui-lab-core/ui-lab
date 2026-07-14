"use client";

import { useState } from "react";
import { Button, Checkbox, Divider, Group } from "ui-lab-components";
import { ArrowUp, FilePlus2, Sparkles } from "lucide-react";
import type { ShowcasePanelProps } from "./types";

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
      <div className="border-b border-background-700/40 p-2">
        <Group className="h-10" spacing="sm">
          <Group.Input
            placeholder="What do you want to make?"
            icon={<Sparkles size={15} />}
            className="min-w-0 flex-1"
          />
          <Divider orientation="vertical" />
          <Group.Button aria-label="Create" icon={<ArrowUp size={14} />} />
        </Group>
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
    <div className="px-2 h-full flex items-center"
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
