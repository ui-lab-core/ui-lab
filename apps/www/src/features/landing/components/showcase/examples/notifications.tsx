"use client";

import { useState } from "react";
import { Switch, Select, Divider } from "ui-lab-components";
import { Bell, AtSign, GitPullRequest, Rocket } from "lucide-react";
import type { ShowcasePanelProps } from "./types";

const CHANNELS = [
  { id: "mentions", label: "Mentions", desc: "When someone @mentions you", icon: <AtSign size={19} />, initiallyOn: true },
  { id: "reviews", label: "Review requests", desc: "When a review is assigned to you", icon: <GitPullRequest size={19} />, initiallyOn: true },
  { id: "deploys", label: "Deployments", desc: "Build and deploy results", icon: <Rocket size={19} />, initiallyOn: false },
];

export function NotificationSettings({ height }: ShowcasePanelProps) {
  const [enabled, setEnabled] = useState(
    () => new Set(CHANNELS.filter((c) => c.initiallyOn).map((c) => c.id))
  );
  const [digest, setDigest] = useState<string | number | null>("daily");

  function toggle(id: string, on: boolean) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <div
      className="flex w-full flex-col overflow-hidden"
      style={{ height }}
    >
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-3 border-b border-background-700">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background-800 text-foreground-300">
          <Bell size={19} />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground-100">Notifications</div>
          <div className="text-sm text-foreground-400 mt-0.5">Choose what reaches you.</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {CHANNELS.map((channel, i) => (
          <div key={channel.id}>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background-800">
                  {channel.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-foreground-100">{channel.label}</div>
                  <div className="text-sm text-foreground-400 truncate">{channel.desc}</div>
                </div>
              </div>
              <Switch
                state={{ checked: enabled.has(channel.id) }}
                onChange={(on) => toggle(channel.id, on)}
                aria-label={channel.label}
              />
            </div>
            {i < CHANNELS.length - 1 && <Divider spacing="none" size="sm" />}
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-background-700/40 px-4 py-3">
        <div>
          <div className="text-sm text-foreground-100">Email digest</div>
          <div className="text-sm text-foreground-400">Summary of unread activity</div>
        </div>
        <Select selectedKey={digest} onSelectionChange={setDigest} className="w-28 flex-none">
          <Select.Trigger variant="ghost">
            {digest === "off" ? "Off" : digest === "daily" ? "Daily" : "Weekly"}
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="off" textValue="Off">Off</Select.Item>
              <Select.Item value="daily" textValue="Daily">Daily</Select.Item>
              <Select.Item value="weekly" textValue="Weekly">Weekly</Select.Item>
            </Select.List>
          </Select.Content>
        </Select>
      </div>
    </div>
  );
}
