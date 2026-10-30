"use client";

import { useId, useReducer, useMemo, type ReactNode } from "react";
import { Group, Divider, Select, Menu, Panel } from "ui-lab-components";
import { Button } from "ui-lab-components/button";
import { Path } from "ui-lab-components/path";
import { FaList, FaGrip, FaMagnifyingGlass, FaTrash } from "@/shared/icons/fa6";
import {
  Folder,
  FolderOpen,
  HardDrive,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileImage,
  FileVideo,
  FileArchive,
  FileCode,
  File as FileIcon,
  PanelLeft,
  Download,
  PenLine,
  Copy,
  FolderPlus,
} from "lucide-react";
import type { ShowcasePanelProps } from "../types";

interface FileEntry {
  name: string;
  type: string;
  bytes: number;
  size: string;
  modified: string;
  age: number;
  folder: string;
  starred?: boolean;
}

const FILES: FileEntry[] = [
  { name: "hero-banner.png", type: "PNG", bytes: 2.4e6, size: "2.4 MB", modified: "2h ago", age: 2, folder: "", starred: true },
  { name: "brand-assets.zip", type: "ZIP", bytes: 18.7e6, size: "18.7 MB", modified: "Yesterday", age: 24, folder: "" },
  { name: "logo-mark.svg", type: "SVG", bytes: 84e3, size: "84 KB", modified: "3d ago", age: 72, folder: "branding", starred: true },
  { name: "color-palette.png", type: "PNG", bytes: 1.1e6, size: "1.1 MB", modified: "3d ago", age: 73, folder: "branding" },
  { name: "product-video.mp4", type: "MP4", bytes: 84.2e6, size: "84.2 MB", modified: "3d ago", age: 74, folder: "marketing" },
  { name: "landing-hero.jpg", type: "JPG", bytes: 3.8e6, size: "3.8 MB", modified: "5d ago", age: 120, folder: "marketing", starred: true },
  { name: "design-system.fig", type: "FIG", bytes: 5.1e6, size: "5.1 MB", modified: "1w ago", age: 168, folder: "marketing/social" },
  { name: "story-01.jpg", type: "JPG", bytes: 1.9e6, size: "1.9 MB", modified: "1w ago", age: 170, folder: "marketing/social" },
];

const FOLDERS = ["branding", "marketing", "marketing/social"];
const ROOT_LABEL = "Media";

// Panel.Sidebar mirrors its live (animating) width onto the content box while
// opening, so unconstrained content reflows/squishes for the duration of the
// transition. Locking the tree to the sidebar's target size decouples it from
// that animation — the sidebar's overflow-hidden clips it during the slide
// instead of the tree itself narrowing.
const SIDEBAR_WIDTH = 196;

type Location = { kind: "folder"; path: string } | { kind: "recent" } | { kind: "starred" };

interface BrowserState {
  view: "list" | "grid";
  sort: string | number | null;
  search: string;
  selected: string | null;
  history: Location[];
  index: number;
}

type BrowserAction =
  | { type: "SET_VIEW"; payload: "list" | "grid" }
  | { type: "SET_SORT"; payload: string | number | null }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SELECT"; payload: string | null }
  | { type: "NAVIGATE"; payload: Location }
  | { type: "BACK" }
  | { type: "FORWARD" };

const sameLocation = (a: Location, b: Location) =>
  a.kind === b.kind && (a.kind !== "folder" || a.path === (b as typeof a).path);

function browserReducer(state: BrowserState, action: BrowserAction): BrowserState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload, selected: null };
    case "SELECT":
      return { ...state, selected: action.payload };
    case "NAVIGATE": {
      if (sameLocation(state.history[state.index], action.payload)) return state;
      const history = [...state.history.slice(0, state.index + 1), action.payload];
      return { ...state, history, index: history.length - 1, selected: null, search: "" };
    }
    case "BACK":
      return state.index > 0 ? { ...state, index: state.index - 1, selected: null } : state;
    case "FORWARD":
      return state.index < state.history.length - 1
        ? { ...state, index: state.index + 1, selected: null }
        : state;
    default:
      return state;
  }
}

const TYPE_STYLE: Record<string, { icon: typeof FileIcon; tint: string }> = {
  PNG: { icon: FileImage, tint: "text-accent-400" },
  JPG: { icon: FileImage, tint: "text-accent-400" },
  SVG: { icon: FileCode, tint: "text-warning-400" },
  MP4: { icon: FileVideo, tint: "text-danger-400" },
  ZIP: { icon: FileArchive, tint: "text-foreground-300" },
  FIG: { icon: FileIcon, tint: "text-success-400" },
};

function EntryIcon({ entry, size }: { entry: Entry; size: number }) {
  if (entry.kind === "folder") {
    return <Folder size={size} className="shrink-0 fill-accent-500/20 text-accent-400" />;
  }
  const { icon: Icon, tint } = TYPE_STYLE[entry.file.type] ?? {
    icon: FileIcon,
    tint: "text-foreground-400",
  };
  return <Icon size={size} strokeWidth={1.5} className={`shrink-0 ${tint}`} />;
}

type Entry =
  | { kind: "folder"; id: string; name: string; path: string; count: number }
  | { kind: "file"; id: string; name: string; file: FileEntry };

function EntryMenu({ entry }: { entry: Entry }) {
  return (
    <Menu.Content side="bottom" align="start" offset={4}>
      {entry.kind === "file" ? (
        <>
          <Menu.Item>
            <Download size={14} className="mr-2 opacity-60" />
            Download
          </Menu.Item>
          <Menu.Item>
            <Copy size={14} className="mr-2 opacity-60" />
            Duplicate
          </Menu.Item>
        </>
      ) : (
        <Menu.Item>
          <FolderPlus size={14} className="mr-2 opacity-60" />
          New subfolder
        </Menu.Item>
      )}
      <Menu.Item>
        <PenLine size={14} className="mr-2 opacity-60" />
        Rename
      </Menu.Item>
      <Menu.Separator />
      <Menu.Item className="text-danger-400">
        <FaTrash size={12} className="mr-2 opacity-60" />
        Move to trash
      </Menu.Item>
    </Menu.Content>
  );
}

function SidebarItem({
  icon,
  label,
  count,
  depth = 0,
  active,
  onSelect,
}: {
  icon: ReactNode;
  label: string;
  count?: number;
  depth?: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${
        active ? "bg-background-700 text-foreground-100" : "text-foreground-400"
      }`}
      style={{ paddingLeft: 8 + depth * 14 }}
      icon={icon}
      onPress={onSelect}
    >
      <span className="flex-1 truncate text-left">{label}</span>
      {count !== undefined && <span className="text-xs text-foreground-500">{count}</span>}
    </Button>
  );
}

function Sidebar({
  location,
  counts,
  onNavigate,
}: {
  location: Location;
  counts: Map<string, number>;
  onNavigate: (location: Location) => void;
}) {
  const isFolder = (path: string) => location.kind === "folder" && location.path === path;

  return (
    <nav
      aria-label="Locations"
      className="flex h-full min-h-0 shrink-0 flex-col gap-4 overflow-y-auto bg-background-300/40 p-2"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="space-y-0.5">
        <p className="px-2 pb-1 text-xs font-medium text-foreground-500">Favorites</p>
        <SidebarItem
          icon={<Clock size={15} />}
          label="Recents"
          active={location.kind === "recent"}
          onSelect={() => onNavigate({ kind: "recent" })}
        />
        <SidebarItem
          icon={<Star size={15} />}
          label="Starred"
          count={FILES.filter((f) => f.starred).length}
          active={location.kind === "starred"}
          onSelect={() => onNavigate({ kind: "starred" })}
        />
      </div>
      <div className="space-y-0.5">
        <p className="px-2 pb-1 text-xs font-medium text-foreground-500">Locations</p>
        <SidebarItem
          icon={<HardDrive size={15} />}
          label={ROOT_LABEL}
          count={FILES.length}
          active={isFolder("")}
          onSelect={() => onNavigate({ kind: "folder", path: "" })}
        />
        {FOLDERS.map((path) => (
          <SidebarItem
            key={path}
            icon={isFolder(path) ? <FolderOpen size={15} /> : <Folder size={15} />}
            label={path.split("/").at(-1)!}
            count={counts.get(path) ?? 0}
            depth={path.split("/").length}
            active={isFolder(path)}
            onSelect={() => onNavigate({ kind: "folder", path })}
          />
        ))}
      </div>
    </nav>
  );
}

export function FileBrowser({ height }: ShowcasePanelProps) {
  const sidebarId = useId();
  const [state, dispatch] = useReducer(browserReducer, {
    view: "grid",
    sort: "name",
    search: "",
    selected: null,
    history: [{ kind: "folder", path: "" }],
    index: 0,
  });
  const location = state.history[state.index];
  const navigate = (payload: Location) => dispatch({ type: "NAVIGATE", payload });

  const folderCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const file of FILES) {
      const parts = file.folder ? file.folder.split("/") : [];
      for (let i = 1; i <= parts.length; i++) {
        const path = parts.slice(0, i).join("/");
        counts.set(path, (counts.get(path) ?? 0) + 1);
      }
    }
    return counts;
  }, []);

  const entries = useMemo<Entry[]>(() => {
    const query = state.search.toLowerCase();
    let folders: Entry[] = [];
    let files: FileEntry[];

    if (location.kind === "recent") {
      files = FILES.filter((f) => f.age < 100);
    } else if (location.kind === "starred") {
      files = FILES.filter((f) => f.starred);
    } else if (query) {
      const base = location.path;
      files = FILES.filter((f) => !base || f.folder === base || f.folder.startsWith(`${base}/`));
    } else {
      const base = location.path;
      folders = FOLDERS.filter((p) => {
        const parent = p.split("/").slice(0, -1).join("/");
        return parent === base;
      }).map((p) => ({
        kind: "folder",
        id: `folder:${p}`,
        name: p.split("/").at(-1)!,
        path: p,
        count: folderCounts.get(p) ?? 0,
      }));
      files = FILES.filter((f) => f.folder === base);
    }

    const sorted = files
      .filter((f) => f.name.toLowerCase().includes(query))
      .sort((a, b) => {
        if (state.sort === "size") return b.bytes - a.bytes;
        if (state.sort === "newest") return a.age - b.age;
        if (state.sort === "oldest") return b.age - a.age;
        return a.name.localeCompare(b.name);
      });

    return [
      ...folders.filter((f) => f.name.toLowerCase().includes(query)),
      ...sorted.map((file) => ({ kind: "file" as const, id: file.name, name: file.name, file })),
    ];
  }, [location, state.search, state.sort, folderCounts]);

  const segments =
    location.kind === "folder"
      ? [ROOT_LABEL, ...(location.path ? location.path.split("/") : [])]
      : [location.kind === "recent" ? "Recents" : "Starred"];

  const open = (entry: Entry) => {
    if (entry.kind === "folder") navigate({ kind: "folder", path: entry.path });
  };

  const selectedEntry = entries.find((e) => e.id === state.selected);
  const parentPath =
    location.kind === "folder" && location.path
      ? location.path.split("/").slice(0, -1).join("/")
      : null;

  return (
    <Panel
      orientation="horizontal"
      spacing="none"
      className="w-full overflow-hidden rounded-sm bg-background-200 text-sm"
      style={{ height }}
    >
      <Panel.Sidebar
        id={sidebarId}
        size={SIDEBAR_WIDTH}
        collapsedSize={0}
        defaultOpen={false}
        strategy="inset"
        className="border-r border-background-700"
      >
        <Sidebar location={location} counts={folderCounts} onNavigate={navigate} />
      </Panel.Sidebar>

      <div className="flex min-w-0 flex-col overflow-hidden">
        <div className="flex flex-col gap-1.5 border-b border-background-700 p-2">
        <div className="flex items-center gap-1.5">
          <Panel.Toggle aria-controls={sidebarId}>
            <Button variant="ghost" aria-label="Toggle sidebar" icon={<PanelLeft size={15} />} />
          </Panel.Toggle>
          <Group spacing="none">
            <Group.Button
              aria-label="Back"
              disabled={state.index === 0}
              onClick={() => dispatch({ type: "BACK" })}
            >
              <ChevronLeft size={15} />
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button
              aria-label="Forward"
              disabled={state.index === state.history.length - 1}
              onClick={() => dispatch({ type: "FORWARD" })}
            >
              <ChevronRight size={15} />
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button
              aria-label="Enclosing folder"
              disabled={parentPath === null}
              onClick={() => parentPath !== null && navigate({ kind: "folder", path: parentPath })}
            >
              <ChevronUp size={15} />
            </Group.Button>
          </Group>

          <Path
            aria-label="Current location"
            separator={<ChevronRight size={12} className="text-foreground-500" />}
            className="min-w-0 flex-1 overflow-x-auto px-1 whitespace-nowrap"
          >
            {segments.map((label, i) => (
              <Path.Item
                key={`${label}-${i}`}
                onPress={
                  location.kind === "folder"
                    ? () =>
                        navigate({
                          kind: "folder",
                          path: segments.slice(1, i + 1).join("/"),
                        })
                    : undefined
                }
              >
                {label}
              </Path.Item>
            ))}
          </Path>
        </div>

          <Group spacing="none" className="w-full">
            <Group.Input
              placeholder={`Search ${segments.at(-1)}`}
              value={state.search}
              className="min-w-0 flex-1"
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              icon={<FaMagnifyingGlass size={12} className="text-foreground-500" />}
            />
            <Divider orientation="vertical" />
            <Group.Select
              selectedKey={state.sort}
              onSelectionChange={(v) => dispatch({ type: "SET_SORT", payload: v })}
              className="w-auto shrink-0"
            >
              <Select.Trigger>
                <Select.Value placeholder="Sort" />
              </Select.Trigger>
              <Select.Content>
                <Select.List>
                  <Select.Item value="name" textValue="Name">
                    Name
                  </Select.Item>
                  <Select.Item value="newest" textValue="Newest">
                    Newest
                  </Select.Item>
                  <Select.Item value="oldest" textValue="Oldest">
                    Oldest
                  </Select.Item>
                  <Select.Item value="size" textValue="Size">
                    Size
                  </Select.Item>
                </Select.List>
              </Select.Content>
            </Group.Select>
            <Divider orientation="vertical" />
            <Group.Button
              active={state.view === "grid"}
              onClick={() => dispatch({ type: "SET_VIEW", payload: "grid" })}
              aria-label="Icon view"
            >
              <FaGrip size={13} />
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button
              active={state.view === "list"}
              onClick={() => dispatch({ type: "SET_VIEW", payload: "list" })}
              aria-label="List view"
            >
              <FaList size={13} />
            </Group.Button>
          </Group>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && dispatch({ type: "SELECT", payload: null })}
        >
          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-foreground-500">
              <FolderOpen size={28} strokeWidth={1.25} />
              <p>{state.search ? `No results for “${state.search}”` : "This folder is empty"}</p>
            </div>
          ) : state.view === "list" ? (
            <div role="grid" aria-label="Files">
              {entries.map((entry, i) => {
                const selected = state.selected === entry.id;
                return (
                  <Menu key={entry.id} type="context-menu">
                    <Menu.Trigger as="child">
                      <div
                        role="row"
                        aria-selected={selected}
                        tabIndex={0}
                        onClick={() => dispatch({ type: "SELECT", payload: entry.id })}
                        onDoubleClick={() => open(entry)}
                        onKeyDown={(e) => e.key === "Enter" && open(entry)}
                        className={`flex cursor-default items-center gap-3 px-3 py-2 outline-none ${
                          selected
                            ? "bg-accent-500/20 text-foreground-100"
                            : i % 2
                              ? "bg-background-300/40 text-foreground-300"
                              : "text-foreground-300"
                        } focus-visible:ring-1 focus-visible:ring-accent-500 focus-visible:ring-inset`}
                      >
                        <EntryIcon entry={entry} size={22} />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate">{entry.name}</span>
                          <span className="truncate text-xs text-foreground-500">
                            {entry.kind === "file"
                              ? `${entry.file.size} · ${entry.file.modified}`
                              : `${entry.count} items`}
                          </span>
                        </span>
                        {entry.kind === "folder" && (
                          <ChevronRight size={14} className="shrink-0 text-foreground-500" />
                        )}
                      </div>
                    </Menu.Trigger>
                    <EntryMenu entry={entry} />
                  </Menu>
                );
              })}
            </div>
          ) : (
            <div
              role="grid"
              aria-label="Files"
              className="grid grid-cols-[repeat(auto-fill,minmax(5.25rem,1fr))] gap-1 p-2"
            >
              {entries.map((entry) => {
                const selected = state.selected === entry.id;
                return (
                  <Menu key={entry.id} type="context-menu">
                    <Menu.Trigger as="child">
                      <div
                        role="gridcell"
                        aria-selected={selected}
                        tabIndex={0}
                        onClick={() => dispatch({ type: "SELECT", payload: entry.id })}
                        onDoubleClick={() => open(entry)}
                        onKeyDown={(e) => e.key === "Enter" && open(entry)}
                        className="group flex cursor-default flex-col items-center gap-1.5 rounded-sm p-2 outline-none focus-visible:ring-1 focus-visible:ring-accent-500"
                      >
                        <div
                          className={`flex size-14 items-center justify-center rounded-sm transition-colors ${
                            selected ? "bg-background-600" : "group-hover:bg-background-400"
                          }`}
                        >
                          <EntryIcon entry={entry} size={entry.kind === "folder" ? 40 : 34} />
                        </div>
                        <span
                          className={`line-clamp-2 max-w-full rounded-sm px-1.5 text-center text-xs [overflow-wrap:anywhere] ${
                            selected ? "bg-accent-500 text-white" : "text-foreground-300"
                          }`}
                        >
                          {entry.name}
                        </span>
                      </div>
                    </Menu.Trigger>
                    <EntryMenu entry={entry} />
                  </Menu>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-background-700 px-3 py-1.5 text-xs text-foreground-500">
          <span className="min-w-0 truncate">
            {selectedEntry
              ? `“${selectedEntry.name}” selected`
              : `${entries.length} item${entries.length !== 1 ? "s" : ""}`}
          </span>
          <span className="truncate">
            {selectedEntry?.kind === "file"
              ? `${selectedEntry.file.type} · ${selectedEntry.file.size} · ${selectedEntry.file.modified}`
              : "12.4 GB available"}
          </span>
        </div>
      </div>
    </Panel>
  );
}
