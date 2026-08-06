"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CommandContext, type CommandItem, type CommandStylesProp, resolveCommandBaseStyles, useCommandEngine } from "./Command.shared";

export interface CommandRootProps {
  className?: string;
  styles?: CommandStylesProp;
  items?: CommandItem[];
  filter?: (command: CommandItem, query: string) => boolean;
  /** Notify a parent that owns visibility (e.g. a Popover) that an item was selected. No-op unless `closeOnSelect` is set. */
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  children?: React.ReactNode;
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
  ({ className, styles: commandStyles, items = EMPTY_COMMAND_ITEMS, filter, onOpenChange, closeOnSelect = false, children }, ref) => {
    const surfaceRef = React.useRef<HTMLDivElement>(null);
    const pointerRef = React.useRef(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const scrollableRef = React.useRef<HTMLDivElement>(null);
    const resolved = resolveCommandBaseStyles(commandStyles);
    const engine = useCommandEngine({ items, filter });
    const { focusedKey, setFocusedKey, filteredItems, groupedItems, registerItem, unregisterItem, actionRef, moveFocus, runFocusedAction, searchValue, setSearchValue } = engine;
    React.useImperativeHandle(ref, () => surfaceRef.current as HTMLDivElement);
    const close = React.useCallback(() => { if (closeOnSelect) onOpenChange?.(false); }, [closeOnSelect, onOpenChange]);
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); moveFocus(event.key === "ArrowDown" ? "down" : "up"); }
      if (event.key === "Enter") { event.preventDefault(); const action = runFocusedAction(); if (action) { action(); close(); } }
    };
    return (
      <div
        ref={surfaceRef}
        onKeyDown={handleKeyDown}
        onPointerDownCapture={() => { pointerRef.current = true; window.setTimeout(() => { pointerRef.current = false; }, 0); }}
        className={cn("command", className, resolved.root)}
      >
        <CommandContext.Provider value={{ isOpen: false, close, focusedKey, setFocusedKey, registerItem, unregisterItem, actionRef, surfaceRef, pointerRef, searchInputRef, scrollableRef, dismissOnBlur: false, searchValue, setSearchValue, filteredItems, groupedItems }}>
          {children}
        </CommandContext.Provider>
      </div>
    );
  },
);

CommandRoot.displayName = "Command.Root";
