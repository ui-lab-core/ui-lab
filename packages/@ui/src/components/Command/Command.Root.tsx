"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import css from "./Command.module.css";
import {
  CommandContext,
  type CommandItem,
  type CommandStylesProp,
  resolveCommandStyles,
  useCommandEngine,
} from "./Command.shared";

/** Props for the always-mounted, headless Command root. */
export interface CommandRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Keyed styles for the command surface and its named compound parts.
   * @category Styling
   * @typeDoc CommandStyleSlots
   */
  styles?: CommandStylesProp;
  /** Declarative commands used for filtering, grouping, focus order, and Command.Groups rendering.
   * @category Items
   * @default []
   * @typeDoc CommandItem
   */
  items?: CommandItem[];
  /** Includes or excludes each declarative command before query relevance ranking.
   * @category Items
   */
  filter?: (command: CommandItem, query: string) => boolean;
  /** Notifies a parent-owned overlay with false after selection when closeOnSelect is enabled.
   * @category Events
   */
  onOpenChange?: (open: boolean) => void;
  /** Requests that the parent-owned overlay close after a command action is selected.
   * @category Core
   * @default false
   */
  closeOnSelect?: boolean;
}

const EMPTY_COMMAND_ITEMS: CommandItem[] = [];

/**
 * Headless Command primitive with no dialog, portal, or Card chrome — it never
 * unmounts itself and isn't gated on any open/close state, so it drops into a
 * sidebar, panel, or list exactly like any other block of content. Compose it
 * with Command.Input / Command.List / Command.Groups / Command.Item as usual;
 * use the floating `Command` instead when you want the Cmd+K style overlay.
 */
export const CommandRoot = React.forwardRef<HTMLDivElement, CommandRootProps>(
  (
    {
      className,
      styles: commandStyles,
      items = EMPTY_COMMAND_ITEMS,
      filter,
      onOpenChange,
      closeOnSelect = false,
      children,
      onKeyDown,
      onPointerDownCapture,
      ...props
    },
    ref,
  ) => {
    const surfaceRef = React.useRef<HTMLDivElement>(null);
    const pointerRef = React.useRef(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const scrollableRef = React.useRef<HTMLDivElement>(null);
    const resolved = resolveCommandStyles(commandStyles);
    const engine = useCommandEngine({ items, filter });
    const {
      focusedKey,
      setFocusedKey,
      filteredItems,
      groupedItems,
      registerItem,
      unregisterItem,
      actionRef,
      moveFocus,
      runFocusedAction,
      searchValue,
      setSearchValue,
    } = engine;
    const mergedRef = useMergeRefs(surfaceRef, ref);
    const close = React.useCallback(() => {
      if (closeOnSelect) onOpenChange?.(false);
    }, [closeOnSelect, onOpenChange]);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveFocus(event.key === "ArrowDown" ? "down" : "up");
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const action = runFocusedAction();
        if (action) {
          action();
          close();
        }
      }
    };
    return (
      <div
        ref={mergedRef}
        {...props}
        onKeyDown={handleKeyDown}
        onPointerDownCapture={(event) => {
          onPointerDownCapture?.(event);
          if (event.defaultPrevented) return;
          pointerRef.current = true;
          window.setTimeout(() => {
            pointerRef.current = false;
          }, 0);
        }}
        className={cn("command", css.root, className, resolved["root.root"])}
        data-slot="root"
      >
        <CommandContext.Provider
          value={{
            styles: resolved,
            isOpen: false,
            close,
            focusedKey,
            setFocusedKey,
            registerItem,
            unregisterItem,
            actionRef,
            surfaceRef,
            pointerRef,
            searchInputRef,
            scrollableRef,
            dismissOnBlur: false,
            searchValue,
            setSearchValue,
            filteredItems,
            groupedItems,
          }}
        >
          {children}
        </CommandContext.Provider>
      </div>
    );
  },
);

CommandRoot.displayName = "Command.Root";
