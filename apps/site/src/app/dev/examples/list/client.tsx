"use client";

import { useState } from "react";
import { List, Badge, Select, Expand } from "ui-lab-components";
import type { ListActionDef } from "ui-lab-components";
import {
  FaBell,
  FaGear,
  FaGlobe,
  FaMoon,
  FaPen,
  FaTrash,
  FaInbox,
  FaFile,
  FaPaperPlane,
  FaBox,
  FaCode,
  FaPalette,
  FaServer,
  FaLayerGroup,
  FaBolt,
  FaDatabase,
  FaChevronRight,
} from "react-icons/fa6";

import { DevExampleLayout, type DevExample } from "../dev-example-layout";

// ─── 1. Basic ───────────────────────────────────────────────────────────────

const basicItems = [
  { label: "Inbox", count: 12, icon: <FaInbox className="h-3.5 w-3.5" /> },
  { label: "Drafts", count: 3, icon: <FaFile className="h-3.5 w-3.5" /> },
  { label: "Sent", count: 0, icon: <FaPaperPlane className="h-3.5 w-3.5" /> },
  { label: "Archive", count: 0, icon: <FaBox className="h-3.5 w-3.5" /> },
  { label: "Trash", count: 1, icon: <FaTrash className="h-3.5 w-3.5" /> },
];

function BasicPreview() {
  const [selected, setSelected] = useState("Inbox");

  const actions: ListActionDef[] = [
    { icon: <FaPen className="h-3 w-3" />, title: "Rename" },
    { icon: <FaTrash className="h-3 w-3" />, title: "Delete" },
  ];

  return (
    <List items={basicItems}>
      {basicItems.map((item) => (
        <List.Item
          key={item.label}
          value={item.label}
          interactive
          actions={actions}
          selected={selected === item.label}
          onClick={() => setSelected(item.label)}
        >
          <div className="h-7 w-7 rounded-md bg-background-600 flex items-center justify-center text-foreground-400 flex-shrink-0">
            {item.icon}
          </div>
          <span className="text-sm text-foreground-100 flex-1">{item.label}</span>
          {item.count > 0 && (
            <Badge size="sm" className="ml-auto">{item.count}</Badge>
          )}
        </List.Item>
      ))}
    </List>
  );
}

// ─── 2. With Media & Description ────────────────────────────────────────────

const people = [
  {
    name: "Olivia Chen",
    role: "Engineering Lead",
    icon: <FaCode className="h-3.5 w-3.5" />,
    color: "bg-blue-500/15 text-blue-400",
  },
  {
    name: "Marcus Webb",
    role: "Product Designer",
    icon: <FaPalette className="h-3.5 w-3.5" />,
    color: "bg-purple-500/15 text-purple-400",
  },
  {
    name: "Priya Sharma",
    role: "Backend Engineer",
    icon: <FaServer className="h-3.5 w-3.5" />,
    color: "bg-emerald-500/15 text-emerald-400",
  },
];

function MediaDescPreview() {
  return (
    <List items={people}>
      {people.map((p) => (
        <List.Item key={p.name} value={p.name} interactive>
          <List.Media>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${p.color}`}>
              {p.icon}
            </div>
          </List.Media>
          <div className="flex flex-col min-w-0">
            <List.Title>{p.name}</List.Title>
            <List.Desc>{p.role}</List.Desc>
          </div>
        </List.Item>
      ))}
    </List>
  );
}

// ─── 3. Checkbox ────────────────────────────────────────────────────────────

const initialTasks = [
  { id: "t1", label: "Set up CI pipeline", done: true },
  { id: "t2", label: "Write integration tests", done: true },
  { id: "t3", label: "Review pull request #87", done: false },
  { id: "t4", label: "Update documentation", done: false },
];

function CheckboxPreview() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const done = tasks.filter((t) => t.done).length;

  return (
    <List items={tasks}>
      <List.Header>
        <span>Tasks</span>
        <span className="text-sm tabular-nums">{done}/{tasks.length}</span>
      </List.Header>
      {tasks.map((t) => (
        <List.Item key={t.id} value={t.id} interactive onClick={() => toggle(t.id)}>
          <List.CheckboxIndicator checked={t.done} />
          <span className={`text-sm ${t.done ? "line-through text-foreground-500" : "text-foreground-100"}`}>
            {t.label}
          </span>
        </List.Item>
      ))}
    </List>
  );
}

// ─── 4. Switch ──────────────────────────────────────────────────────────────

function SwitchPreview() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  const settings = [
    {
      label: "Dark mode",
      desc: "Use dark theme across the app",
      icon: <FaMoon className="h-3.5 w-3.5" />,
      color: "bg-purple-500/15 text-purple-400",
      value: darkMode,
      onChange: setDarkMode,
    },
    {
      label: "Notifications",
      desc: "Receive push notifications",
      icon: <FaBell className="h-3.5 w-3.5" />,
      color: "bg-amber-500/15 text-amber-400",
      value: notifications,
      onChange: setNotifications,
    },
    {
      label: "Public profile",
      desc: "Allow others to see your profile",
      icon: <FaGlobe className="h-3.5 w-3.5" />,
      color: "bg-blue-500/15 text-blue-400",
      value: publicProfile,
      onChange: setPublicProfile,
    },
  ];

  return (
    <List items={settings}>
      {settings.map((s) => (
        <List.Item key={s.label} value={s.label} interactive>
          <List.Media>
            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${s.color}`}>
              {s.icon}
            </div>
          </List.Media>
          <div className="flex flex-col min-w-0">
            <List.Title>{s.label}</List.Title>
            <List.Desc>{s.desc}</List.Desc>
          </div>
          <List.Switch isSelected={s.value} onChange={s.onChange} />
        </List.Item>
      ))}
    </List>
  );
}

// ─── 5. Select ──────────────────────────────────────────────────────────────

function SelectPreview() {
  const [timezone, setTimezone] = useState<string | number | null>("utc");
  const [language, setLanguage] = useState<string | number | null>("en");
  const [theme, setTheme] = useState<string | number | null>("system");

  const rows = [
    {
      label: "Timezone",
      value: timezone,
      onChange: setTimezone,
      options: [
        { value: "utc", label: "UTC" },
        { value: "est", label: "EST" },
        { value: "pst", label: "PST" },
        { value: "cet", label: "CET" },
      ],
    },
    {
      label: "Language",
      value: language,
      onChange: setLanguage,
      options: [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
      ],
    },
    {
      label: "Theme",
      value: theme,
      onChange: setTheme,
      options: [
        { value: "system", label: "System" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ],
    },
  ];

  return (
    <List items={rows}>
      <List.Header>
        <span>Preferences</span>
        <FaGear className="h-4 w-4" />
      </List.Header>
      {rows.map((r) => (
        <List.Item key={r.label} value={r.label}>
          <span className="text-sm text-foreground-100">{r.label}</span>
          <List.Select selectedKey={r.value} onSelectionChange={r.onChange}>
            <Select.Trigger>
              <Select.Value placeholder="Select..." />
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                {r.options.map((o) => (
                  <Select.Item key={o.value} value={o.value} textValue={o.label}>
                    {o.label}
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Content>
          </List.Select>
        </List.Item>
      ))}
    </List>
  );
}

// ─── 6. Input ───────────────────────────────────────────────────────────────

function InputPreview() {
  const [displayName, setDisplayName] = useState("Olivia Chen");
  const [email, setEmail] = useState("olivia@example.com");
  const [apiKey, setApiKey] = useState("sk-****");

  const fields = [
    { label: "Display name", value: displayName, onChange: setDisplayName },
    { label: "Email", value: email, onChange: setEmail },
    { label: "API key", value: apiKey, onChange: setApiKey },
  ];

  return (
    <List items={fields}>
      <List.Header>
        <span>Profile</span>
      </List.Header>
      {fields.map((f) => (
        <List.Item key={f.label} value={f.label}>
          <span className="text-sm text-foreground-400 min-w-24">{f.label}</span>
          <List.Input value={f.value} onChange={(e) => f.onChange(e.target.value)} variant="ghost" />
        </List.Item>
      ))}
    </List>
  );
}

// ─── 7. Expand ──────────────────────────────────────────────────────────────

const groups = [
  {
    id: "design",
    label: "Design System",
    desc: "Tokens, components, and guidelines",
    icon: <FaPalette className="h-3.5 w-3.5" />,
    color: "bg-purple-500/15 text-purple-400",
    items: ["Typography", "Color tokens", "Spacing scale", "Icon library"],
  },
  {
    id: "infra",
    label: "Infrastructure",
    desc: "Hosting, storage, and networking",
    icon: <FaDatabase className="h-3.5 w-3.5" />,
    color: "bg-blue-500/15 text-blue-400",
    items: ["CDN config", "Database", "Edge functions"],
  },
  {
    id: "platform",
    label: "Platform",
    desc: "Core product services",
    icon: <FaBolt className="h-3.5 w-3.5" />,
    color: "bg-amber-500/15 text-amber-400",
    items: ["Auth", "Billing", "Analytics", "Notifications"],
  },
];

function ExpandPreview() {
  const [expanded, setExpanded] = useState<string | null>("design");

  const toggle = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  return (
    <List items={groups}>
      <List.Header>
        <span>Workspace</span>
        <FaLayerGroup className="h-4 w-4" />
      </List.Header>
      {groups.map((g) => (
        <div key={g.id}>
          <List.Item value={g.id} interactive onClick={() => toggle(g.id)}>
            <List.Media>
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${g.color}`}>
                {g.icon}
              </div>
            </List.Media>
            <div className="flex flex-col min-w-0 flex-1">
              <List.Title>{g.label}</List.Title>
              <List.Desc>{g.desc}</List.Desc>
            </div>
            <FaChevronRight
              className="h-3 w-3 text-foreground-500 transition-transform duration-200 flex-shrink-0"
              style={{ transform: expanded === g.id ? "rotate(90deg)" : "rotate(0deg)" }}
            />
          </List.Item>
          <Expand isExpanded={expanded === g.id}>
            <Expand.Content>
              <div className="pb-1">
                {g.items.map((item) => (
                  <List.Item key={item} value={item} interactive>
                    <div className="w-7 flex-shrink-0" />
                    <span className="text-sm text-foreground-300">{item}</span>
                  </List.Item>
                ))}
              </div>
            </Expand.Content>
          </Expand>
        </div>
      ))}
    </List>
  );
}

// ─── Examples Array ─────────────────────────────────────────────────────────

const examples: DevExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Minimal interactive list items with icons and action buttons.",
    preview: <BasicPreview />,
  },
  {
    id: "media-desc",
    title: "Media & Description",
    description: "Items with colored icon avatars and secondary description text.",
    preview: <MediaDescPreview />,
  },
  {
    id: "checkbox",
    title: "Checkbox",
    description: "Clickable items with checkbox indicators for multi-select.",
    preview: <CheckboxPreview />,
  },
  {
    id: "switch",
    title: "Switch",
    description: "Items with toggle switches and colored icon badges.",
    preview: <SwitchPreview />,
  },
  {
    id: "select",
    title: "Select",
    description: "Items with inline select dropdowns for choosing from options.",
    preview: <SelectPreview />,
  },
  {
    id: "input",
    title: "Input",
    description: "Items with inline text inputs for editable fields.",
    preview: <InputPreview />,
  },
  {
    id: "expand",
    title: "Expand",
    description: "List items as custom expand triggers with animated content reveal.",
    preview: <ExpandPreview />,
  },
];

export default function ListExamplesPage() {
  return (
    <DevExampleLayout
      title="List Examples"
      description="Primitive examples showcasing each List sub-component and variant."
      examples={examples}
      backHref="/dev/examples"
      backLabel="Examples"
    />
  );
}
