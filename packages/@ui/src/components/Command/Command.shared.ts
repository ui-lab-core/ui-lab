import * as React from "react";

import type { Key } from "react-aria";
import { type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useControlledState } from "@/hooks/useControlledState";

export interface CommandStyleSlots {
  root?: StyleValue;
  overlay?: StyleValue;
  input?: StyleValue;
  list?: StyleValue;
  item?: StyleValue;
  itemContent?: StyleValue;
  footer?: StyleValue;
}

export type CommandStylesProp = StylesProp<CommandStyleSlots>;

export const resolveCommandBaseStyles = createStylesResolver([
  "root",
  "overlay",
  "input",
  "list",
  "item",
  "itemContent",
  "footer",
] as const);

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  keywords?: string[];
  action: () => void | Promise<void>;
  hint?: string;
}

export interface CommandGroupedItems {
  category: string | undefined;
  items: CommandItem[];
}

interface CommandContextValue {
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

export function useCommandContext() {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error("Command sub-components must be used within Command");
  return context;
}

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
