"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Command } from "ui-lab-components/command";
import { Input } from "ui-lab-components/input";
import { Switch } from "ui-lab-components/switch";
import { Button } from "ui-lab-components/button";
import {
  Search,
  Folder,
  Settings,
  Users,
  GitBranch,
  GitPullRequest,
  Star,
  Tag,
  CircleDot,
  BookOpen,
  FileCode2,
  MapPin,
  UserPlus,
  CheckCircle2,
  CalendarDays,
  Box,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";
import { Carousel } from "./carousel";
import { resolveStyle, styles } from "./sections/token-styles";
import { MemberRolePanel } from "./showcase/examples/showcase/team-members";
import { ContentGallery } from "./content-gallery";

function WorkspaceSettings() {
  const [name, setName] = useState("Studio North");
  const [notifications, setNotifications] = useState(true);
  const [summaries, setSummaries] = useState(false);

  return (
    <div className="bg-background-950 p-5 text-md text-foreground-300 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-md bg-accent-500/15 text-accent-500">
          <Settings size={18} aria-hidden />
        </span>
        <div>
          <p className="text-foreground-100">Workspace settings</p>
          <p className="text-foreground-400">Manage your workspace name and email preferences.</p>
        </div>
      </div>
      <label className="block">
        <span className="mb-2 block text-foreground-200">Workspace name</span>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <div className="mt-6 divide-y divide-background-700">
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="text-foreground-200">Email notifications</p>
            <p className="text-foreground-400">Receive updates about activity in your workspace.</p>
          </div>
          <Switch
            aria-label="Email notifications"
            selected={notifications}
            onChange={setNotifications}
          />
        </div>
        <div className="flex items-center justify-between gap-4 pt-4">
          <div>
            <p className="text-foreground-200">Weekly summary</p>
            <p className="text-foreground-400">Get a weekly email with a recap of team activity.</p>
          </div>
          <Switch aria-label="Weekly summary" selected={summaries} onChange={setSummaries} />
        </div>
      </div>
    </div>
  );
}

const commands = [
  { id: "projects", label: "Find a project", icon: <Folder size={16} />, action: () => {} },
  { id: "team", label: "Manage your team", icon: <Users size={16} />, action: () => {} },
  { id: "settings", label: "Workspace settings", icon: <Settings size={16} />, action: () => {} },
];

function CommandPreview() {
  return (
    <div className="flex min-h-76 items-center bg-background-950 p-4 sm:p-6">
      <Command.Root
        items={commands}
        className="w-full overflow-hidden rounded-md border border-background-700 bg-background-1000 shadow-lg"
      >
        <Command.Input
          aria-label="Search workspace"
          placeholder="Search projects, team, or settings…"
          icon={<Search size={16} />}
        />
        <Command.List>
          <Command.Groups
            renderItem={(item) => (
              <Command.Item
                value={item.id}
                textValue={item.label}
                icon={item.icon}
                action={item.action}
              >
                <Command.Label>{item.label}</Command.Label>
              </Command.Item>
            )}
          />
        </Command.List>
        <Command.Footer
          actions={{
            left: [{ label: "Navigate", hint: ["↑", "↓"] }],
            right: [{ label: "Select", hint: "↵" }],
          }}
        />
      </Command.Root>
    </div>
  );
}

const resolvedThemes = styles.map((preset) => ({ ...preset, ...resolveStyle(preset) }));

function PreviewAvatar({ person, size = "size-6" }: { person: string; size?: string }) {
  return (
    <img
      src={`https://github.com/${person}.png?size=80`}
      alt=""
      loading="lazy"
      draggable={false}
      className={`${size} shrink-0 rounded-full object-cover ring-2 ring-background-900`}
    />
  );
}

function PreviewReviewers() {
  return (
    <div className="flex -space-x-2">
      {["sindresorhus", "shuding", "leerob", "rauchg"].map((person) => (
        <PreviewAvatar key={person} person={person} />
      ))}
    </div>
  );
}

function PreviewCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-xl bg-background-900 text-sm leading-relaxed text-foreground-300 ${className}`}
    >
      {children}
    </div>
  );
}

function ThemeElementGrid({ toolbar }: { toolbar: ReactNode }) {
  const [following, setFollowing] = useState(false);
  const columns = [
    <div key="code" className="flex flex-col gap-4">
      <PreviewCard>
        <div className="p-4">
          <div className="flex items-center gap-2.5">
            <PreviewAvatar person="shuding" />
            <div className="min-w-0">
              <p className="font-medium leading-snug text-foreground-100">
                auth: add refresh token rotation
              </p>
              <p className="text-xs text-foreground-400">Marcus Webb · committed 2 hours ago</p>
            </div>
          </div>
          <p className="mt-3 text-foreground-400">
            Rotate refresh tokens on every use and revoke the previous token. Adds coverage for
            replay and concurrent-refresh scenarios.
          </p>
        </div>
        <div className="space-y-1 border-y border-background-700 px-4 py-3 font-mono text-xs">
          {[
            { file: "src/auth/token-service.ts", added: "+88", removed: "−2" },
            { file: "src/auth/session-store.ts", added: "+14", removed: "−6" },
            { file: "tests/auth.test.ts", added: "+120", removed: "" },
          ].map((file, index) => (
            <div key={file.file} className="flex items-center gap-2">
              <FileCode2
                size={13}
                className={index === 2 ? "text-success-500" : "text-warning-500"}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate">{file.file}</span>
              <span className="text-success-500">{file.added}</span>
              <span className="text-danger-500">{file.removed}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-4 py-2 font-mono text-xs text-foreground-400">
          <span>
            3 files <span className="ml-1 text-success-500">+222</span>{" "}
            <span className="text-danger-500">−8</span>
          </span>
          <span>9f3a2c1</span>
        </div>
      </PreviewCard>
      <PreviewCard className="p-4">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-warning-500" aria-hidden />
          <span className="font-mono font-semibold text-foreground-100">v2.3.0</span>
          <span className="rounded-full bg-success-500/10 px-2 py-0.5 text-xs text-success-500">
            Latest
          </span>
        </div>
        <p className="mt-2 font-medium text-foreground-100">Edge API — Token Service</p>
        <p className="mt-3 text-foreground-400">
          Refresh-token rotation, sliding-window rate limits, and a documented /v2 OpenAPI surface.
        </p>
        <div className="mt-3 flex justify-between border-t border-background-700 pt-3 text-xs text-foreground-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} aria-hidden /> released 2 days ago
          </span>
          <span className="flex items-center gap-1.5">
            <Box size={13} aria-hidden /> 6 assets
          </span>
        </div>
      </PreviewCard>
      <PreviewCard className="p-4">
        <p className="flex items-center gap-2 font-mono text-foreground-100">
          <GitBranch size={15} aria-hidden /> feature/auth-refactor
        </p>
        <p className="mt-3 text-xs">
          <span className="text-success-500">12 ahead</span> ·{" "}
          <span className="text-danger-500">3 behind</span>
          <span className="text-foreground-400"> main</span>
        </p>
        <div
          className="mt-1.5 flex h-1.5 overflow-hidden rounded-full"
          aria-label="12 commits ahead, 3 behind"
        >
          <span className="w-4/5 bg-success-500" />
          <span className="w-1/5 bg-danger-500" />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-background-700 pt-3 text-xs text-foreground-400">
          <span>Updated by marcus-webb</span>
          <span className="flex items-center gap-1 rounded-full border border-background-700 px-1.5">
            <LockKeyhole size={11} className="text-success-500" aria-hidden /> Protected
          </span>
        </div>
      </PreviewCard>
    </div>,
    <div key="people" className="flex flex-col gap-4">
      <PreviewCard className="p-4">
        <PreviewAvatar person="sindresorhus" size="size-10" />
        <p className="mt-3 text-base font-medium text-foreground-100">Priya Sharma</p>
        <p className="text-xs text-foreground-400">priya-sharma</p>
        <p className="mt-3">
          Staff engineer working on edge infra &amp; auth. Maintainer of acme/edge-api.
        </p>
        <div className="mt-3 flex gap-3 text-xs text-foreground-400">
          <span className="flex items-center gap-1">
            <MapPin size={14} aria-hidden /> Berlin, DE
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} aria-hidden />
            <span className="text-foreground-100">1.2k</span> followers
          </span>
        </div>
        <Button
          variant="primary"
          onClick={() => setFollowing(!following)}
          aria-pressed={following}
          className="mt-4 w-full"
        >
          <UserPlus size={14} aria-hidden />
          {following ? "Following" : "Follow"}
        </Button>
      </PreviewCard>
      <PreviewCard className="p-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-foreground-400" aria-hidden />
          <span className="font-medium text-foreground-100">edge-api</span>
          <span className="rounded-full border border-background-700 px-1.5 text-xs">Public</span>
        </div>
        <p className="mt-3 text-foreground-400">
          Low-latency edge API gateway with token rotation, rate limiting, and OpenTelemetry
          tracing.
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-foreground-400">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-info-500" /> TypeScript
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-warning-500 text-warning-500" aria-hidden />
            <span className="font-medium text-foreground-100">12.4k</span>
          </span>
          <span className="flex items-center gap-1">
            <GitBranch size={13} aria-hidden /> 847
          </span>
        </div>
      </PreviewCard>
      <PreviewCard className="p-4">
        <div className="flex items-start gap-2">
          <CircleDot size={16} className="mt-0.5 shrink-0 text-success-500" aria-hidden />
          <div>
            <p className="font-medium leading-snug text-foreground-100">
              Refresh tokens not revoked on concurrent use
            </p>
            <p className="text-xs text-foreground-400">
              acme/edge-api #482 · opened 3 days ago by dev-patel
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5 text-xs">
          {[
            { label: "bug", color: "danger" },
            { label: "security", color: "accent" },
            { label: "priority", color: "warning" },
          ].map(({ label, color }) => (
            <span
              key={label}
              className="flex items-center gap-1 rounded-full border px-1.5 leading-snug"
              style={{
                color: `var(--${color}-500)`,
                borderColor: `color-mix(in oklch, var(--${color}-500) 25%, transparent)`,
                backgroundColor: `color-mix(in oklch, var(--${color}-500) 10%, transparent)`,
              }}
            >
              <span className="size-1 rounded-full bg-current" />
              {label}
            </span>
          ))}
        </div>
      </PreviewCard>
    </div>,
    <div key="work" className="flex flex-col gap-4">
      <PreviewCard className="p-4">
        <div className="flex items-start gap-2">
          <GitPullRequest size={16} className="mt-0.5 shrink-0 text-accent-500" aria-hidden />
          <div>
            <p className="font-medium leading-snug text-foreground-100">
              Refactor authentication to a token service
            </p>
            <p className="text-xs text-foreground-400">#479 · merged 2 hours ago</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-background-800 px-1.5 py-0.5">feature/auth-refactor</span>
          <ArrowRight size={12} className="text-foreground-400" aria-hidden />
          <span className="rounded bg-background-800 px-1.5 py-0.5">main</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-background-700 pt-3">
          <span className="flex items-center gap-1.5 text-xs text-success-500">
            <CheckCircle2 size={15} className="fill-success-500 text-background-900" aria-hidden />
            12 checks passed
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-400">Reviewers</span>
            <PreviewReviewers />
          </div>
        </div>
      </PreviewCard>
      <PreviewCard className="p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-background-1000">
            <Users size={17} className="text-foreground-100" aria-hidden />
          </span>
          <div>
            <p className="font-medium leading-snug text-foreground-100">Platform</p>
            <p className="text-xs text-foreground-400">@acme/platform</p>
          </div>
        </div>
        <p className="mt-3 text-foreground-400">
          Owns the edge gateway, auth, and developer tooling.
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-background-700 pt-3">
          <div className="flex items-center gap-1">
            <PreviewReviewers />
            <span className="text-xs text-foreground-400">+3</span>
          </div>
          <span className="text-xs text-foreground-400">12 repositories</span>
        </div>
      </PreviewCard>
      <PreviewCard className="p-4">
        <p className="flex items-center gap-2 font-medium text-foreground-100">
          <GitBranch size={15} className="text-foreground-400" aria-hidden /> Q2 Hardening
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div
            role="progressbar"
            aria-label="Q2 Hardening"
            aria-valuenow={68}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1 flex-1 overflow-hidden rounded-full bg-background-700"
          >
            <div className="h-full w-[68%] bg-accent-500" />
          </div>
          <span className="text-xs text-foreground-400">68%</span>
        </div>
        <div className="mt-3 flex justify-between text-xs text-foreground-400">
          <span>
            <span className="text-foreground-100">17</span> open ·{" "}
            <span className="text-foreground-100">36</span> closed
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} aria-hidden />
            Due Jun 30
          </span>
        </div>
      </PreviewCard>
    </div>,
  ];

  return <Carousel label="Design system examples" toolbar={toolbar} gapClassName="gap-4 pt-3">{columns}</Carousel>;
}

export function ThemePreview() {
  const [selected, setSelected] = useState("ui-lab");
  const theme = resolvedThemes.find((preset) => preset.key === selected)!;
  const colors = theme.families.flatMap((family) => family.groups);

  return (
    <figure className="mt-8">
      <div
        style={{ ...theme.vars, colorScheme: theme.mode } as CSSProperties}
        className="relative left-1/2 w-[min(66rem,calc(100vw-2.5rem))] -translate-x-1/2 rounded-2xl bg-background-950 p-4 text-md text-foreground-300 sm:p-6"
      >
        <ThemeElementGrid
          toolbar={
            <div
              role="radiogroup"
              aria-label="Design system"
              className="flex gap-2 overflow-x-auto text-sm"
            >
              {resolvedThemes.map((preset) => {
                const active = preset.key === selected;
                const dots = preset.families
                  .flatMap((family) => family.groups)
                  .slice(0, 3)
                  .map((group) => group.rows[Math.floor(group.rows.length / 2)]);
                return (
                  <button
                    key={preset.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelected(preset.key)}
                    className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border py-1 pl-1.5 pr-3 transition-colors ${
                      active
                        ? "border-background-600 bg-background-800 text-foreground-100"
                        : "border-background-700 text-foreground-400 hover:text-foreground-200"
                    }`}
                  >
                    <span className="flex -space-x-1">
                      {dots.map((color) => (
                        <span
                          key={color.name}
                          className="size-3.5 rounded-full ring-2 ring-background-950"
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </span>
                    {preset.label}
                  </button>
                );
              })}
            </div>
          }
        />
        <ul
          aria-label="Design system color previews"
          className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-background-700 pt-4 text-xs text-foreground-400 lg:grid-cols-4"
        >
          {colors.map((row) => (
            <li key={row.role} className="flex items-center justify-between gap-4">
              <span className="capitalize">{row.role}</span>
              <span className="flex w-24 overflow-hidden rounded-sm">
                {row.rows.map((color) => (
                  <span
                    key={color.name}
                    role="img"
                    aria-label={`${color.name}: ${color.value}`}
                    title={`${color.name}: ${color.value}`}
                    className="h-2.5 flex-1"
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export function AgentResultPreview() {
  return (
    <ContentGallery
      label="Composed interface examples"
      items={[
        {
          title: "“/lab Build a team settings panel”",
          caption:
            "An example team panel composed from tabs, inputs, selects, and a list. Try changing a member’s role to explore the controls; this is an illustrative composition, not a live agent response.",
          preview: <MemberRolePanel height="21rem" />,
        },
        {
          title: "“/lab Add workspace preferences”",
          caption:
            "An example preferences form using an input, switches, and semantic color tokens. Edit the workspace name or toggle email preferences to try the component interactions.",
          preview: <WorkspaceSettings />,
        },
        {
          title: "“/lab Make a searchable command menu”",
          caption:
            "An example built with Command.Input, Command.List, and Command.Item. Search the available actions and navigate the results with your keyboard; the example actions do not open other screens.",
          preview: <CommandPreview />,
        },
      ]}
    />
  );
}
