"use client";

import { useState } from "react";
import { Switch, Select, Divider } from "ui-lab-components";
import { Bell, AtSign, GitPullRequest, Rocket, ShieldAlert } from "lucide-react";

const CHANNELS = [
  { id: "mentions", label: "Mentions", desc: "When someone @mentions you", icon: <AtSign size={16} />, initiallyOn: true },
  { id: "reviews", label: "Review requests", desc: "When a review is assigned to you", icon: <GitPullRequest size={16} />, initiallyOn: true },
  { id: "deploys", label: "Deployments", desc: "Build and deploy results", icon: <Rocket size={16} />, initiallyOn: false },
  { id: "security", label: "Security alerts", desc: "Vulnerabilities and unusual sign-ins", icon: <ShieldAlert size={16} />, initiallyOn: true },
];

export function NotificationSettings() {
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
    <div className="h-fit w-full bg-background-900 border border-background-700 rounded-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-3 border-b border-background-700">
        <Bell size={18} className="text-foreground-300" />
        <div>
          <div className="text-sm font-semibold text-foreground-100">Notifications</div>
          <div className="text-sm text-foreground-400 mt-0.5">Choose what reaches you.</div>
        </div>
      </div>

      {CHANNELS.map((channel, i) => (
        <div key={channel.id}>
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-sm bg-background-800 text-foreground-300 flex items-center justify-center shrink-0">
                {channel.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm text-foreground-100">{channel.label}</div>
                <div className="text-sm text-foreground-400 truncate">{channel.desc}</div>
              </div>
            </div>
            <Switch
              size="sm"
              state={{ checked: enabled.has(channel.id) }}
              onChange={(on) => toggle(channel.id, on)}
              aria-label={channel.label}
            />
          </div>
          {i < CHANNELS.length - 1 && <Divider spacing="none" size="sm" />}
        </div>
      ))}

      <div className="px-4 py-3 border-t border-background-700 flex items-center justify-between">
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
