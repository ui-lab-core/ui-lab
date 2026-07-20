"use client";

import { useState, type ReactNode } from "react";
import {
  Badge,
  Banner,
  Button,
  Checkbox,
  Date as Calendar,
  Divider,
  Expand,
  Group,
  Input,
  Menu,
  Progress,
  Radio,
  Select,
  Slider,
  Switch,
  Tabs,
  TextArea,
  Tooltip,
} from "ui-lab-components";
import {
  ChevronDown,
  Copy,
  FilePen,
  Link2,
  Search,
  Share2,
  Trash2,
} from "lucide-react";
import type { ShowcasePanelProps } from "./types";

interface CellProps extends ShowcasePanelProps {
  children: ReactNode;
}

function Cell({ height, children }: CellProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden" style={{ height }}>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-5">
        {children}
      </div>
    </div>
  );
}

export function Buttons({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="primary">Save changes</Button>
        <Button size="sm">Duplicate</Button>
        <Button size="sm" variant="secondary">Preview</Button>
        <Button size="sm" variant="ghost">Discard</Button>
      </div>
    </Cell>
  );
}

export function Inputs({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <div className="w-full max-w-64">
        <Input placeholder="Search docs…" icon={<Search size={15} />} hint="⌘K" />
      </div>
    </Cell>
  );
}

export function Checkboxes({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <div className="flex flex-col gap-3">
        <Checkbox checked label="Autosave drafts" />
        <Checkbox label="Weekly summary" />
        <Checkbox indeterminate label="Sync integrations" />
      </div>
    </Cell>
  );
}

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];

export function Selects({ height }: ShowcasePanelProps) {
  const [framework, setFramework] = useState<string | number | null>("react");
  const selected = frameworks.find((f) => f.value === framework);

  return (
    <Cell height={height}>
      <Select selectedKey={framework} onSelectionChange={setFramework} className="w-44">
        <Select.Trigger>{selected?.label ?? "Framework"}</Select.Trigger>
        <Select.Content>
          <Select.List>
            {frameworks.map(({ value, label }) => (
              <Select.Item key={value} value={value} textValue={label}>
                {label}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select>
    </Cell>
  );
}

export function Radios({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Radio.Group value="comfortable" label="Density">
        <Radio.Item value="compact" label="Compact" />
        <Radio.Item value="comfortable" label="Comfortable" />
        <Radio.Item value="spacious" label="Spacious" />
      </Radio.Group>
    </Cell>
  );
}

export function Sliders({ height }: ShowcasePanelProps) {
  const [value, setValue] = useState(40);

  return (
    <Cell height={height}>
      <div className="w-full max-w-48 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-300">Opacity</span>
          <span className="text-foreground-500">{value}%</span>
        </div>
        <Slider
          value={value}
          onValueChange={([v]) => setValue(v)}
          aria-label="Opacity"
          style={{ "--inline-size": "12rem" } as React.CSSProperties}
        />
      </div>
    </Cell>
  );
}

export function Dates({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Calendar />
    </Cell>
  );
}

export function Badges({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge>Draft</Badge>
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="ghost">Archived</Badge>
        <Badge pill count={12} />
      </div>
    </Cell>
  );
}

export function TabList({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Tabs default="overview" className="w-auto">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    </Cell>
  );
}

const toggles = [
  { id: "notifications", label: "Notifications", initiallyOn: true },
  { id: "previews", label: "Link previews", initiallyOn: false },
  { id: "sounds", label: "Sounds", initiallyOn: true },
];

export function Switches({ height }: ShowcasePanelProps) {
  const [enabled, setEnabled] = useState(
    () => new Set(toggles.filter((t) => t.initiallyOn).map((t) => t.id))
  );

  function toggle(id: string, on: boolean) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <Cell height={height}>
      <div className="flex w-full max-w-56 flex-col gap-3">
        {toggles.map(({ id, label }) => (
          <div key={id} className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground-300">{label}</span>
            <Switch
              state={{ checked: enabled.has(id) }}
              onChange={(on) => toggle(id, on)}
              aria-label={label}
            />
          </div>
        ))}
      </div>
    </Cell>
  );
}

export function ProgressBar({ height }: ShowcasePanelProps) {
  const [value, setValue] = useState(64);

  return (
    <Cell height={height}>
      <div className="w-full max-w-56 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-300">Storage used</span>
          <span className="text-foreground-500">{value} GB</span>
        </div>
        <Progress
          show-controls
          value={value}
          onValueChange={setValue}
          styles={{ root: "w-full" }}
        />
      </div>
    </Cell>
  );
}

export function Banners({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Banner variant="info" className="w-full">
        <Banner.Title>Scheduled maintenance</Banner.Title>
        <Banner.Body>Systems go read-only Sunday at 02:00 UTC.</Banner.Body>
      </Banner>
    </Cell>
  );
}

export function TextAreas({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <div className="w-full">
        <TextArea
          placeholder="Leave a comment…"
          rows={3}
          showCharacterCount
          maxCharacters={280}
        />
      </div>
    </Cell>
  );
}

export function Menus({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Menu type="pop-over">
        <Menu.Trigger>
          <Button size="sm" variant="ghost" icon={{ right: <ChevronDown size={14} /> }}>
            Actions
          </Button>
        </Menu.Trigger>
        <Menu.Content side="bottom" align="center" offset={6}>
          <Menu.Item>
            <FilePen size={14} className="mr-2 opacity-60" />
            Rename
          </Menu.Item>
          <Menu.Item>
            <Copy size={14} className="mr-2 opacity-60" />
            Duplicate
          </Menu.Item>
          <Menu.Item>
            <Share2 size={14} className="mr-2 opacity-60" />
            Share
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item>
            <Trash2 size={14} className="mr-2 opacity-60" />
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </Cell>
  );
}

export function Expands({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Expand title="Advanced options" className="w-full">
        <p className="text-sm text-foreground-400">
          Configure caching, redirects, and edge functions for this deployment.
        </p>
      </Expand>
    </Cell>
  );
}

export function Groups({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Group variant="default" orientation="horizontal" spacing="xs">
        <Group.Button size="sm">Day</Group.Button>
        <Divider orientation="vertical" />
        <Group.Button size="sm">Week</Group.Button>
        <Divider orientation="vertical" />
        <Group.Button size="sm">Month</Group.Button>
      </Group>
    </Cell>
  );
}

export function Tooltips({ height }: ShowcasePanelProps) {
  return (
    <Cell height={height}>
      <Tooltip content="Copy link" hint="⌘C">
        <Button size="sm" variant="ghost" icon={{ left: <Link2 size={14} /> }}>
          Share
        </Button>
      </Tooltip>
    </Cell>
  );
}
