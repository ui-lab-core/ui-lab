"use client";

import { useState } from "react";
import {
  FilePlus,
  LayoutDashboard,
  Moon,
  Search,
  Settings,
  Share2,
  UserPlus,
} from "lucide-react";
import { Command } from "ui-lab-components/command";
import { Surface, Note } from "./shared";

export default function CommandPalette() {
  const [notice, setNotice] = useState("Search, then use arrow keys and Enter.");

  const run = (message: string) => () => setNotice(message);

  const items = [
    {
      id: "dashboard",
      label: "Go to dashboard",
      description: "Overview of activity and metrics",
      category: "Navigate",
      icon: <LayoutDashboard size={16} />,
      shortcut: "G D",
      action: run("Opened the dashboard."),
    },
    {
      id: "settings",
      label: "Open settings",
      description: "Workspace and account preferences",
      category: "Navigate",
      icon: <Settings size={16} />,
      shortcut: "G S",
      action: run("Opened settings."),
    },
    {
      id: "new-doc",
      label: "New document",
      description: "Start from a blank page",
      category: "Create",
      icon: <FilePlus size={16} />,
      shortcut: "⌘ N",
      action: run("Created a new document."),
    },
    {
      id: "invite",
      label: "Invite teammate",
      description: "Send a workspace invitation",
      category: "Create",
      icon: <UserPlus size={16} />,
      action: run("Invite sent to your teammate."),
    },
    {
      id: "share",
      label: "Share this page",
      description: "Copy a link with view access",
      category: "Actions",
      icon: <Share2 size={16} />,
      shortcut: "⌘ ⇧ S",
      action: run("Share link copied to clipboard."),
    },
    {
      id: "theme",
      label: "Toggle dark mode",
      description: "Switch the workspace appearance",
      category: "Actions",
      icon: <Moon size={16} />,
      action: run("Toggled dark mode."),
    },
  ];

  return (
    <Surface title="Command palette">
      <Command embedded open items={items}>
        <Command.Input
          aria-label="Search commands"
          placeholder="Type a command or search…"
          icon={<Search size={16} />}
        />
        <Command.List max-height="280px" empty-message="No matching commands.">
          <Command.Groups
            renderCategory={(category) => <Command.Category>{category}</Command.Category>}
            renderItem={(item) => (
              <Command.Item
                key={item.id}
                value={item.id}
                textValue={item.label}
                action={item.action}
                icon={item.icon}
                hint={item.shortcut}
              >
                <Command.Label>{item.label}</Command.Label>
                <Command.Description>{item.description}</Command.Description>
              </Command.Item>
            )}
          />
        </Command.List>
        <Command.Footer
          actions={{
            left: [
              { label: "Navigate", hint: "↑↓" },
              { label: "Select", hint: "↵" },
            ],
            right: [{ label: "Dismiss", hint: "Esc" }],
          }}
        />
      </Command>
      <Note small role="status">
        {notice}
      </Note>
    </Surface>
  );
}
