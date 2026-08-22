import * as React from "react";

import type { Key } from "react-aria";
import { type Style } from "@/lib/utils";
import { createStylesResolver } from "@/lib/styles";
import { useControlledState } from "@/hooks/useControlledState";

/** Styles for the stable elements rendered by each command item. */
export interface CommandItemStyles {
  /** Styles applied to the item option element. */
  root?: Style;
  /** Styles applied to the wrapper containing the icon and item label. */
  content?: Style;
  /** Styles applied to the item icon container. */
  icon?: Style;
  hint?: Style;
}

type CommandRootStyles = {
  root?: Style;
};

type CommandListStyles = CommandRootStyles & {
  empty?: Style;
};

type CommandGroupsStyles = CommandRootStyles & {
  group?: Style;
};

/** Style overrides for the command surface and its named compound parts. */
export interface CommandStyleSlots {
  /** Styles applied to the command surface. */
  root?: CommandRootStyles;
  /** Styles applied to the modal backdrop in floating mode. */
  overlay?: CommandRootStyles;
  /** Styles applied to the search input wrapper. */
  search?: CommandRootStyles;
  /** Styles applied to the search input root. */
  input?: CommandRootStyles;
  /** Styles applied to the framed list container. */
  inner?: CommandRootStyles;
  /** Styles applied to the scrollable command list. */
  list?: CommandListStyles;
  /** Styles applied to the empty-state message. */
  empty?: CommandRootStyles;
  /** Shared item styles or separate styles for the item anatomy. */
  item?: CommandItemStyles;
  /** Styles applied to category headers. */
  category?: CommandRootStyles;
  /** Styles applied to the command footer. */
  footer?: CommandRootStyles;
  /** Styles applied to the container rendered by Command.Groups. */
  groups?: CommandGroupsStyles;
}

/** Keyed styles for the command surface and its stable compound parts. */
export type CommandStylesProp = CommandStyleSlots;

const resolveCommandBaseStyles = createStylesResolver([
  "root.root",
  "overlay.root",
  "search.root",
  "input.root",
  "inner.root",
  "list.root",
  "empty.root",
  "item.root",
  "item.content",
  "item.icon",
  "item.hint",
  "category.root",
  "footer.root",
  "groups.root",
  "groups.group",
] as const);

export function resolveCommandStyles(styles: CommandStylesProp | undefined) {
  if (!styles) return resolveCommandBaseStyles(styles);
  return resolveCommandBaseStyles({
    "root.root": styles.root?.root,
    "overlay.root": styles.overlay?.root,
    "search.root": styles.search?.root,
    "input.root": styles.input?.root,
    "inner.root": styles.inner?.root,
    "list.root": styles.list?.root,
    "empty.root": styles.empty?.root,
    "item.root": styles.item?.root,
    "item.content": styles.item?.content,
    "item.icon": styles.item?.icon,
    "item.hint": styles.item?.hint,
    "category.root": styles.category?.root,
    "footer.root": styles.footer?.root,
    "groups.root": styles.groups?.root,
    "groups.group": styles.groups?.group,
  });
}

type ResolvedCommandStyles = ReturnType<typeof resolveCommandStyles>;

/** Declarative command data consumed by filtering and Command.Groups. */
export interface CommandItem {
  /** Stable identifier used for rendering, focus tracking, and action lookup. */
  id: string;
  /** Primary searchable label for the command. */
  label: string;
  /** Supplemental description available to custom item renderers. */
  description?: string;
  /** Optional group name used by Command.Groups. */
  category?: string;
  /** Keyboard shortcut text available to custom item renderers. */
  shortcut?: string;
  /** Icon content available to custom item renderers. */
  icon?: React.ReactNode;
  /** Additional terms considered when ranking a search query. */
  keywords?: string[];
  /** Action invoked when this command is selected. */
  action: () => void | Promise<void>;
  /** Compact hint text passed to the Command.Groups item renderer. */
  hint?: string;
}

/** A category and its filtered commands as supplied to Command.Groups. */
export interface CommandGroupedItems {
  /** Category name, or undefined for uncategorized commands. */
  category: string | undefined;
  /** Filtered commands belonging to the category. */
  items: CommandItem[];
}

interface CommandContextValue {
  styles: ResolvedCommandStyles;
  isOpen: boolean;
  close: () => void;
  focusedKey: Key | null;
  setFocusedKey: React.Dispatch<React.SetStateAction<Key | null>>;
  registerItem: (key: Key, textValue: string) => void;
  unregisterItem: (key: Key) => void;
  actionRef: React.MutableRefObject<Map<Key, () => void | Promise<void>>>;
  surfaceRef: React.MutableRefObject<HTMLDivElement | null>;
  pointerRef: React.MutableRefObject<boolean>;
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  scrollableRef: React.MutableRefObject<HTMLDivElement | null>;
  dismissOnBlur: boolean;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: CommandItem[];
  groupedItems: CommandGroupedItems[];
}

export const CommandContext = React.createContext<CommandContextValue | undefined>(undefined);

/** Returns the shared state for compound parts within Command or Command.Root. */
export function useCommandContext() {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error("Command sub-components must be used within Command");
  return context;
}

/**
 * Scores a command label or keyword against a query using exact, prefix, word,
 * and substring matching. Returns zero when no supported match is found.
 */
export function scoreCommandRelevance(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t === q) return 1000;
  if (t.startsWith(q)) return 900;
  if (t.split(/\s+/).some((word) => word === q)) return 800;
  if (t.includes(q)) return 710 - Math.min(t.indexOf(q), 10);
  return 0;
}

function scoreItemRelevance(command: CommandItem, query: string) {
  return {
    label: scoreCommandRelevance(command.label, query),
    keyword: Math.max(
      0,
      ...(command.keywords?.map((keyword) => scoreCommandRelevance(keyword, query)) ?? []),
    ),
  };
}

const EMPTY_COMMAND_ITEMS: CommandItem[] = [];

interface UseCommandEngineOptions {
  items?: CommandItem[];
  filter?: (command: CommandItem, query: string) => boolean;
}

interface CommandEngine {
  itemsRef: React.MutableRefObject<Map<Key, string>>;
  actionRef: React.MutableRefObject<Map<Key, () => void | Promise<void>>>;
  focusedKey: Key | null;
  setFocusedKey: React.Dispatch<React.SetStateAction<Key | null>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: CommandItem[];
  groupedItems: CommandGroupedItems[];
  orderedKeys: Key[];
  registerItem: (key: Key, textValue: string) => void;
  unregisterItem: (key: Key) => void;
  moveFocus: (direction: "up" | "down") => void;
  runFocusedAction: () => (() => void | Promise<void>) | undefined;
}

/**
 * Shared registry/filter/keyboard-nav behavior behind both the floating Command
 * and the headless Command.Root primitive, so "how items are searched and
 * navigated" stays defined once regardless of what chrome sits around it.
 */
export function useCommandEngine({
  items = EMPTY_COMMAND_ITEMS,
  filter,
}: UseCommandEngineOptions): CommandEngine {
  const itemsRef = React.useRef<Map<Key, string>>(new Map());
  const actionRef = React.useRef<Map<Key, () => void | Promise<void>>>(new Map());
  const [focusedKey, setFocusedKey] = React.useState<Key | null>(null);
  const [itemCount, setItemCount] = React.useState(0);
  const [searchValue, setSearchValue] = useControlledState(undefined, undefined, "");

  const filteredItems = React.useMemo(() => {
    const matches = items.filter((command) => !filter || filter(command, searchValue));
    if (!searchValue.trim()) return matches;
    return matches
      .map((command, index) => ({
        command,
        index,
        score: scoreItemRelevance(command, searchValue),
      }))
      .sort(
        (a, b) =>
          b.score.label - a.score.label || b.score.keyword - a.score.keyword || a.index - b.index,
      )
      .map(({ command }) => command);
  }, [filter, items, searchValue]);

  const groupedItems = React.useMemo<CommandGroupedItems[]>(() => {
    const groups = new Map<string | undefined, CommandItem[]>();
    filteredItems.forEach((command) => {
      if (!groups.has(command.category)) groups.set(command.category, []);
      groups.get(command.category)!.push(command);
    });
    return Array.from(groups.entries()).map(([category, grouped]) => ({
      category,
      items: grouped,
    }));
  }, [filteredItems]);

  const orderedKeys = React.useMemo<Key[]>(
    () =>
      filteredItems.length > 0
        ? filteredItems.map((command) => command.id)
        : Array.from(itemsRef.current.keys()),
    [filteredItems, itemCount],
  );

  React.useEffect(() => {
    setFocusedKey(searchValue ? (orderedKeys[0] ?? null) : null);
  }, [orderedKeys, searchValue]);

  const registerItem = React.useCallback((key: Key, textValue: string) => {
    itemsRef.current.set(key, textValue);
    setItemCount((count) => count + 1);
  }, []);
  const unregisterItem = React.useCallback((key: Key) => {
    itemsRef.current.delete(key);
    setItemCount((count) => count + 1);
  }, []);

  const moveFocus = React.useCallback(
    (direction: "up" | "down") => {
      if (!orderedKeys.length) return;
      const index = focusedKey === null ? -1 : orderedKeys.indexOf(focusedKey);
      setFocusedKey(
        direction === "down"
          ? orderedKeys[(index + 1) % orderedKeys.length]
          : orderedKeys[index <= 0 ? orderedKeys.length - 1 : index - 1],
      );
    },
    [focusedKey, orderedKeys],
  );

  const runFocusedAction = React.useCallback(
    () => (focusedKey === null ? undefined : actionRef.current.get(focusedKey)),
    [focusedKey],
  );

  return {
    itemsRef,
    actionRef,
    focusedKey,
    setFocusedKey,
    searchValue,
    setSearchValue,
    filteredItems,
    groupedItems,
    orderedKeys,
    registerItem,
    unregisterItem,
    moveFocus,
    runFocusedAction,
  };
}
