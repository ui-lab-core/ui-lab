"use client";

import React, { useState } from 'react'
import { Button, Divider, Select, Searchable, Flex, Menu } from 'ui-lab-components'
import { FaSpinner, FaCheck, FaEllipsisVertical, FaHashtag, FaLock } from "react-icons/fa6";

type Channel = { value: string; label: string; description: string; private?: boolean };

const channels: Channel[] = [
  { value: "general", label: "general", description: "General team discussion" },
  { value: "announcements", label: "announcements", description: "Important team updates", private: true },
  { value: "design", label: "design", description: "Design work and feedback" },
  { value: "engineering", label: "engineering", description: "Engineering discussions" },
  { value: "marketing", label: "marketing", description: "Marketing campaigns" },
  { value: "product", label: "product", description: "Product roadmap and planning" },
  { value: "random", label: "random", description: "Off-topic conversations" },
  { value: "releases", label: "releases", description: "Release announcements", private: true },
];

type PublishAction = "publish" | "draft" | "schedule";

const publishActions: Record<PublishAction, { label: string; variant: "ghost" | "default" | "outline" }> = {
  publish: { label: "Publish Now", variant: "ghost" },
  draft: { label: "Save as Draft", variant: "ghost" },
  schedule: { label: "Schedule for Later", variant: "outline" },
};

export const metadata = {
  title: 'Split Action Button',
  description: 'A primary action button joined with a Select dropdown that changes what the button does — useful for publish workflows with multiple delivery options.'
};

export default function Example() {
  const [action, setAction] = useState<PublishAction>("publish");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [channel, setChannel] = useState<string | number | null>("general");
  const selectedChannel = channels.find((c) => c.value === channel);
  const cfg = publishActions[action];

  const handleExecute = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    }, 1500);
  };

  const leftIcon = status === "loading" ? <FaSpinner className="animate-spin" /> : status === "done" ? <FaCheck /> : undefined;
  const label = status === "loading" ? "Saving..." : status === "done" ? "Done!" : cfg.label;

  return (
    <Flex gap="xs" className="w-110" align="center">
      <Select
        selectedKey={channel}
        valueLabel={selectedChannel ? `#${selectedChannel.label}` : undefined}
        onSelectionChange={setChannel}
        className="flex h-10"
        isDisabled={status !== "idle"}
      >
        <Searchable.Input className="w-50" icon={<FaHashtag />} placeholder="Select channel..." />
        <Select.Content>
          <Select.List>
            {channels.map((c) => (
              <Select.Item
                key={c.value}
                value={c.value}
                textValue={c.label}
                icon={c.private ? <FaLock className="h-3 w-3" /> : <FaHashtag className="h-3 w-3" />}
                description={c.description}
              >
                {c.label}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select>
      <Select className="flex h-10" selectedKey={action} onSelectionChange={(key) => setAction(key as PublishAction)} isDisabled={status !== "idle"}>
        <Button
          onPress={handleExecute}
          variant="ghost"
          size="sm"
          className="w-full"
          isDisabled={status !== "idle"}
          icon={leftIcon}
        >
          {label}
        </Button>
        <Divider orientation="vertical" spacing="none" />
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="publish" textValue="Publish Now">Publish Now</Select.Item>
          <Select.Item value="draft" textValue="Save as Draft">Save as Draft</Select.Item>
          <Select.Item value="schedule" textValue="Schedule for Later">Schedule for Later</Select.Item>
        </Select.Content>
      </Select>
      <Menu type="pop-over">
        <Menu.Trigger>
          <Button size="icon" variant="outline" icon={<FaEllipsisVertical />} />
        </Menu.Trigger>
        <Menu.Content offset={8} side="bottom" align="end">
          <Menu.Item>Preview</Menu.Item>
          <Menu.Item>View History</Menu.Item>
          <Menu.Item>Discard Changes</Menu.Item>
        </Menu.Content>
      </Menu>
    </Flex>
  );
}
