"use client";

import { useId, useReducer, useMemo } from "react";
import { Group, Divider, Select, Checkbox, Menu, Panel } from "ui-lab-components";
import { FaList, FaGrip, FaMagnifyingGlass, FaTrash, FaEllipsis } from "@/shared/icons/fa6";
import {
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Image as ImageIcon,
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
  size: string;
  modified: string;
  folder: string;
}

const FILES: FileEntry[] = [
  { name: "hero-banner.png", type: "PNG", size: "2.4 MB", modified: "2h ago", folder: "" },
  { name: "brand-assets.zip", type: "ZIP", size: "18.7 MB", modified: "Yesterday", folder: "" },
  { name: "logo-mark.svg", type: "SVG", size: "84 KB", modified: "3d ago", folder: "branding" },
  {
    name: "color-palette.png",
    type: "PNG",
    size: "1.1 MB",
    modified: "3d ago",
    folder: "branding",
  },
  {
    name: "product-video.mp4",
    type: "MP4",
    size: "84.2 MB",
    modified: "3d ago",
    folder: "marketing",
  },
  {
    name: "landing-hero.jpg",
    type: "JPG",
    size: "3.8 MB",
    modified: "5d ago",
    folder: "marketing",
  },
  {
    name: "design-system.fig",
    type: "FIG",
    size: "5.1 MB",
    modified: "1w ago",
    folder: "marketing/social",
  },
];

const FOLDERS = ["branding", "marketing", "marketing/social"];

// Panel.Sidebar mirrors its live (animating) width onto the content box while
// opening, so unconstrained content reflows/squishes for the duration of the
// transition. Locking the tree to the sidebar's target size decouples it from
// that animation — the sidebar's overflow-hidden clips it during the slide
// instead of the tree itself narrowing.
const SIDEBAR_WIDTH = 208;

interface BrowserState {
  view: "list" | "grid";
  sort: string | number | null;
  search: string;
  selected: Set<string>;
  activeFolder: string;
}

type BrowserAction =
  | { type: "SET_VIEW"; payload: "list" | "grid" }
  | { type: "SET_SORT"; payload: string | number | null }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SELECTED"; payload: Set<string> }
  | { type: "SET_FOLDER"; payload: string };

function browserReducer(state: BrowserState, action: BrowserAction): BrowserState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SELECTED":
      return { ...state, selected: action.payload };
    case "SET_FOLDER":
      return { ...state, activeFolder: action.payload, selected: new Set() };
    default:
      return state;
  }
}

function FolderRow({
  path,
  count,
  active,
  onSelect,
}: {
  path: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  const depth = path.split("/").length;
  const label = path.split("/").at(-1);

  return (
    <div
      className={`group/folder flex rounded-sm transition-colors ${
        active
          ? "bg-background-800 text-foreground-100"
          : "text-foreground-400 hover:bg-background-800 hover:text-foreground-100"
      }`}
      style={{ paddingLeft: `${10 + (depth - 1) * 14}px` }}
    >
      <button
        className="flex min-w-0 flex-1 items-center gap-2 p-1.5 pr-2 text-left text-sm"
        onClick={onSelect}
      >
        {active ? (
          <FolderOpen size={16} className="shrink-0" />
        ) : (
          <Folder size={16} className="shrink-0" />
        )}
        <span className="flex-1 truncate font-medium">{label}</span>
        <span className="text-sm text-foreground-500">{count}</span>
      </button>
      <Menu type="pop-over">
        <Menu.Trigger as="child">
          <button
            className="px-2 text-foreground-500 opacity-0 transition hover:text-foreground-100 focus:opacity-100 group-hover/folder:opacity-100"
            aria-label={`Manage ${path}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </Menu.Trigger>
        <Menu.Content side="bottom" align="end" offset={6}>
          <Menu.Item>
            <FolderPlus size={14} className="mr-2 opacity-60" />
            New subfolder
          </Menu.Item>
          <Menu.Item>
            <PenLine size={14} className="mr-2 opacity-60" />
            Rename
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item className="text-danger-400">
            <FaTrash size={12} className="mr-2 opacity-60" />
            Delete folder
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  );
}

function FolderTree({
  folders,
  counts,
  totalCount,
  active,
  onSelect,
}: {
  folders: string[];
  counts: Map<string, number>;
  totalCount: number;
  active: string;
  onSelect: (folder: string) => void;
}) {
  return (
    <nav
      aria-label="File folders"
      className="flex h-full min-h-0 shrink-0 flex-col"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="border-b border-background-700 p-2">
        <button className="flex w-full items-center gap-2 rounded-sm border border-background-700 px-2.5 py-1.5 text-sm text-foreground-300 transition hover:border-background-600 hover:text-foreground-100">
          <Plus size={14} />
          New folder
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <div
            className={`flex rounded-sm transition-colors ${
              active === ""
                ? "bg-background-800 text-foreground-100"
                : "text-foreground-400 hover:bg-background-800 hover:text-foreground-100"
            }`}
          >
            <button
              className="flex min-w-0 flex-1 items-center gap-2 p-1.5 text-left text-sm"
              onClick={() => onSelect("")}
            >
              <ImageIcon size={16} className="shrink-0" />
              <span className="flex-1 truncate font-medium">All files</span>
              <span className="text-sm text-foreground-500">{totalCount}</span>
            </button>
          </div>
          {folders.map((path) => (
            <FolderRow
              key={path}
              path={path}
              count={counts.get(path) ?? 0}
              active={active === path}
              onSelect={() => onSelect(path)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

export function FileBrowser({ height }: ShowcasePanelProps) {
  const sidebarId = useId();
  const [state, dispatch] = useReducer(browserReducer, {
    view: "list",
    sort: "newest",
    search: "",
    selected: new Set<string>(),
    activeFolder: "",
  });

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

  const filteredFiles = useMemo(() => {
    const query = state.search.toLowerCase();
    return FILES.filter((file) => {
      const inFolder =
        state.activeFolder === "" ||
        file.folder === state.activeFolder ||
        file.folder.startsWith(`${state.activeFolder}/`);
      const matchesQuery =
        file.name.toLowerCase().includes(query) || file.type.toLowerCase().includes(query);
      return inFolder && matchesQuery;
    });
  }, [state.search, state.activeFolder]);

  const selectedCount = state.selected.size;
  const isAllSelected = filteredFiles.length > 0 && selectedCount === filteredFiles.length;
  const isSomeSelected = selectedCount > 0 && selectedCount < filteredFiles.length;

  const toggleSelect = (fileName: string) => {
    const next = new Set(state.selected);
    if (next.has(fileName)) next.delete(fileName);
    else next.add(fileName);
    dispatch({ type: "SET_SELECTED", payload: next });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      dispatch({ type: "SET_SELECTED", payload: new Set() });
    } else {
      dispatch({ type: "SET_SELECTED", payload: new Set(filteredFiles.map((f) => f.name)) });
    }
  };

  const clearSelection = () => {
    dispatch({ type: "SET_SELECTED", payload: new Set() });
  };

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
        defaultOpen
        className="border-r border-background-700"
      >
        <FolderTree
          folders={FOLDERS}
          counts={folderCounts}
          totalCount={FILES.length}
          active={state.activeFolder}
          onSelect={(folder) => dispatch({ type: "SET_FOLDER", payload: folder })}
        />
      </Panel.Sidebar>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-background-700 flex items-center gap-2 p-2">
          <Panel.Toggle aria-controls={sidebarId}>
            <button
              className="flex size-7 shrink-0 items-center justify-center rounded-sm text-foreground-400 transition hover:bg-background-700 hover:text-foreground-100"
              aria-label="Toggle folders"
            >
              <PanelLeft size={15} />
            </button>
          </Panel.Toggle>
          <Group spacing="none" className="justify-between w-full">
            <Group.Input
              placeholder="Search files..."
              value={state.search}
              className="w-full! flex-1"
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              icon={<FaMagnifyingGlass size={12} className="text-foreground-500" />}
            />
            <Divider orientation="vertical" />
            <Group.Select
              selectedKey={state.sort}
              onSelectionChange={(v) => dispatch({ type: "SET_SORT", payload: v })}
              className="w-28"
            >
              <Select.Trigger>
                <Select.Value placeholder="Sort" />
              </Select.Trigger>
              <Select.Content>
                <Select.List>
                  <Select.Item value="newest" textValue="Newest">
                    Newest
                  </Select.Item>
                  <Select.Item value="oldest" textValue="Oldest">
                    Oldest
                  </Select.Item>
                  <Select.Item value="name" textValue="Name">
                    Name
                  </Select.Item>
                  <Select.Item value="size" textValue="Size">
                    Size
                  </Select.Item>
                </Select.List>
              </Select.Content>
            </Group.Select>
            <Divider orientation="vertical" />
            <Group.Button
              active={state.view === "list"}
              onClick={() => dispatch({ type: "SET_VIEW", payload: "list" })}
              aria-label="List view"
            >
              <FaList size={13} />
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button
              active={state.view === "grid"}
              onClick={() => dispatch({ type: "SET_VIEW", payload: "grid" })}
              aria-label="Grid view"
            >
              <FaGrip size={13} />
            </Group.Button>
          </Group>
        </div>

        {selectedCount > 0 && (
          <div className="px-3 py-2 border-b border-background-700 bg-background-300 flex items-center justify-between">
            <span className="text-foreground-300">
              {selectedCount} file{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <Group spacing="none">
              <Group.Button onClick={() => {}} aria-label="Delete selected">
                <FaTrash size={12} />
              </Group.Button>
              <Group.Button onClick={clearSelection} aria-label="Clear selection">
                ✕
              </Group.Button>
            </Group>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-sm text-foreground-500 mb-2">○</div>
                <span className="text-foreground-500">
                  {state.search ? "No files match your search" : "No files found"}
                </span>
              </div>
            </div>
          ) : state.view === "list" ? (
            <div>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-background-300 border-b border-background-700">
                <Checkbox
                  state={{ checked: isAllSelected, indeterminate: isSomeSelected }}
                  onChange={toggleSelectAll}
                />
                <span className="text-foreground-500 flex-1">File</span>
                <span className="text-foreground-500 shrink-0">Size</span>
                <span className="text-foreground-500 shrink-0 w-16 text-right">Modified</span>
              </div>
              {filteredFiles.map((file, i) => (
                <div key={file.name} className="group">
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-background-300 transition-colors">
                    <Checkbox
                      state={{ checked: state.selected.has(file.name) }}
                      onChange={() => toggleSelect(file.name)}
                    />
                    <span className="text-foreground-100 flex-1 truncate font-medium">
                      {file.name}
                    </span>
                    <span className="text-foreground-500 shrink-0">{file.size}</span>
                    <span className="text-foreground-500 shrink-0 w-16 text-right">
                      {file.modified}
                    </span>
                    <Menu type="pop-over">
                      <Menu.Trigger as="child">
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-foreground-500 hover:text-foreground-100"
                          aria-label={`Actions for ${file.name}`}
                        >
                          <FaEllipsis size={12} />
                        </button>
                      </Menu.Trigger>
                      <Menu.Content side="bottom" align="end" offset={6}>
                        <Menu.Item>
                          <Download size={14} className="mr-2 opacity-60" />
                          Download
                        </Menu.Item>
                        <Menu.Item>
                          <PenLine size={14} className="mr-2 opacity-60" />
                          Rename
                        </Menu.Item>
                        <Menu.Item>
                          <Copy size={14} className="mr-2 opacity-60" />
                          Duplicate
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item className="text-danger-400">
                          <FaTrash size={12} className="mr-2 opacity-60" />
                          Delete
                        </Menu.Item>
                      </Menu.Content>
                    </Menu>
                  </div>
                  {i < filteredFiles.length - 1 && <Divider spacing="none" size="sm" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 p-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.name}
                  className="group relative bg-background-300 rounded-sm p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:bg-background-400 transition-colors"
                >
                  <div className="absolute top-1.5 left-1.5">
                    <Checkbox
                      state={{ checked: state.selected.has(file.name) }}
                      onChange={() => toggleSelect(file.name)}
                    />
                  </div>
                  <span className="text-foreground-300 truncate w-full text-center font-medium">
                    {file.name.split(".")[0]}
                  </span>
                  <span className="text-foreground-500">{file.size}</span>
                  <Menu type="pop-over">
                    <Menu.Trigger as="child">
                      <button
                        className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-foreground-500 hover:text-foreground-100"
                        aria-label={`Actions for ${file.name}`}
                      >
                        <FaEllipsis size={11} />
                      </button>
                    </Menu.Trigger>
                    <Menu.Content side="bottom" align="end" offset={6}>
                      <Menu.Item>
                        <Download size={14} className="mr-2 opacity-60" />
                        Download
                      </Menu.Item>
                      <Menu.Item>
                        <PenLine size={14} className="mr-2 opacity-60" />
                        Rename
                      </Menu.Item>
                      <Menu.Item>
                        <Copy size={14} className="mr-2 opacity-60" />
                        Duplicate
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item className="text-danger-400">
                        <FaTrash size={12} className="mr-2 opacity-60" />
                        Delete
                      </Menu.Item>
                    </Menu.Content>
                  </Menu>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
