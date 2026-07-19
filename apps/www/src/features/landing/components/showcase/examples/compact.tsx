"use client";

import { Button, Divider, Group } from "ui-lab-components";
import { ArrowUp, FilePlus2, Sparkles } from "lucide-react";
import type { ShowcasePanelProps } from "./types";

export function QuickActions({ height }: ShowcasePanelProps) {
  return (
    <div
      className="flex w-full flex-col overflow-hidden"
      style={{ height }}
    >
      <div className="border-b border-background-700 p-2">
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
