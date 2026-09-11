"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Command } from "ui-lab-components/command";
import { Divider } from "ui-lab-components/divider";
import { Flex } from "ui-lab-components/flex";
import { Input } from "ui-lab-components/input";
import { Label } from "ui-lab-components/label";
import { List } from "ui-lab-components/list";
import { Surface, Note } from "./shared";

const projectDestinations = [
  {
    name: "Overview",
    description: "Sprint 12 · 3 milestones remaining",
    content: "The workspace migration is on track. SSO is enabled; billing permissions are next.",
  },
  {
    name: "Issues",
    description: "8 open · 2 assigned to you",
    content: "Next up: review API rate limits and resolve the failed webhook retries.",
  },
  {
    name: "Documents",
    description: "Briefs, decisions, and release notes",
    content: "Latest document: Enterprise onboarding runbook. Updated by Sam Rivera this morning.",
  },
];

export default function ProjectLauncher() {
  const [destination, setDestination] = useState(projectDestinations[0]);
  const [notice, setNotice] = useState("Search, then use arrow keys and Enter.");
  const [drafts, setDrafts] = useState(0);
  const items = [
    ...projectDestinations.map((page) => ({
      id: page.name,
      label: page.name,
      description: page.description,
      category: "Go to",
      action: () => {
        setDestination(page);
        setNotice(`Opened ${page.name} in this preview.`);
      },
    })),
    {
      id: "draft",
      label: "Create issue draft",
      description: "Add a local draft to this project",
      category: "Demo actions",
      action: () => {
        setDrafts((count) => count + 1);
        setNotice("Issue draft created locally.");
      },
    },
    {
      id: "sync",
      label: "Refresh project",
      description: "Simulate a workspace sync",
      category: "Demo actions",
      action: () => setNotice("Demo sync complete. Everything is up to date."),
    },
  ];
  return (
    <Surface title="Atlas / Workspace command center">
      <Command.Root items={items}>
        <Command.Input
          aria-label="Search project pages and actions"
          placeholder="Where would you like to go?"
        />
        <Command.List maxHeight="260px" emptyMessage="No matching pages or actions.">
          <Command.Groups
            renderCategory={(category) => <Command.Category>{category}</Command.Category>}
            renderItem={(item) => (
              <Command.Item
                key={item.id}
                value={item.id}
                textValue={item.label}
                action={item.action}
              >
                <Command.Label>{item.label}</Command.Label>
                <Command.Description>{item.description}</Command.Description>
              </Command.Item>
            )}
          />
        </Command.List>
      </Command.Root>
      <Divider spacing="none" />
      <Flex direction="column" gap="sm" className="min-w-0" aria-label="Project destination">
        <strong>{destination.name}</strong>
        <p>{destination.content}</p>
        {drafts > 0 && <Note>{`${drafts} local issue ${drafts === 1 ? "draft" : "drafts"}`}</Note>}
      </Flex>
      <Note small role="status">
        {notice}
      </Note>
    </Surface>
  );
}

