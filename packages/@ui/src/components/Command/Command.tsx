"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { filterDOMProps } from "@react-aria/utils";
import { cn } from "@/lib/utils";
import { useControlledState } from "@/hooks/useControlledState";
import { usePresence } from "@/hooks/usePresence";
import { useScrollLock } from "../../hooks/useScrollLock";
import { Card } from "../Card";
import styles from "./Command.module.css";
import { CommandContext, type CommandItem, type CommandStylesProp, resolveCommandBaseStyles, useCommandEngine } from "./Command.shared";

const transitionDuration = 180;
const EMPTY_COMMAND_ITEMS: CommandItem[] = [];

export interface CommandProps {
  state?: CommandState;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  embedded?: boolean;
  className?: string;
  styles?: CommandStylesProp;
  items?: CommandItem[];
  filter?: (command: CommandItem, query: string) => boolean;
  children?: React.ReactNode;
}

export interface CommandState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setTrigger: (element: HTMLElement | null) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

export interface UseCommandStateProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; }

export function useCommandState({ open: controlledOpen, defaultOpen, onOpenChange }: UseCommandStateProps = {}): CommandState {
  const [isOpen, setInternalOpen] = useControlledState(controlledOpen, defaultOpen, false);
  const setOpen = React.useCallback((next: boolean) => { setInternalOpen(next); onOpenChange?.(next); }, [onOpenChange, setInternalOpen]);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const setTrigger = React.useCallback((element: HTMLElement | null) => { triggerRef.current = element; }, []);
  return React.useMemo(() => ({ isOpen, setOpen, open: () => setOpen(true), close: () => setOpen(false), toggle: () => setOpen(!isOpen), setTrigger, triggerRef }), [isOpen, setOpen, setTrigger]);
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ open, defaultOpen, state, onOpenChange, embedded = false, className, styles: commandStyles, items = EMPTY_COMMAND_ITEMS, filter, children }, ref) => {
    const [mounted, setMounted] = React.useState(false);
    const localState = useCommandState({ open, defaultOpen, onOpenChange });
    const commandState = state ?? localState;
    const overlayState = useOverlayTriggerState({ isOpen: commandState.isOpen, onOpenChange: commandState.setOpen });
    const modalRef = React.useRef<HTMLDivElement>(null);
    const paletteRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const scrollableRef = React.useRef<HTMLDivElement>(null);
    const pointerRef = React.useRef(false);
    const resolved = resolveCommandBaseStyles(commandStyles);
    useScrollLock(!embedded && overlayState.isOpen, scrollableRef.current);
    const engine = useCommandEngine({ items, filter });
    const { focusedKey, setFocusedKey, filteredItems, groupedItems, registerItem, unregisterItem, actionRef, moveFocus, runFocusedAction, searchValue, setSearchValue } = engine;
    React.useImperativeHandle(ref, () => paletteRef.current as HTMLDivElement);
    React.useEffect(() => { setMounted(true); }, []);
    const { present, state: presenceState, finishExit } = usePresence(mounted && overlayState.isOpen, transitionDuration);
    const wasOpenRef = React.useRef(false);
    React.useEffect(() => { if (overlayState.isOpen) { wasOpenRef.current = true; return; } if (wasOpenRef.current && !present) { commandState.triggerRef.current?.focus({ preventScroll: true }); wasOpenRef.current = false; } }, [commandState, overlayState.isOpen, present]);
    React.useEffect(() => { if (!overlayState.isOpen) scrollableRef.current = null; if (!overlayState.isOpen && !present) setSearchValue(""); }, [overlayState.isOpen, present, setSearchValue]);
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (!overlayState.isOpen) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); moveFocus(event.key === "ArrowDown" ? "down" : "up"); }
      if (event.key === "Enter") { event.preventDefault(); const action = runFocusedAction(); if (action) { action(); overlayState.close(); } }
      if (event.key === "Escape" && !embedded) { event.preventDefault(); overlayState.close(); }
    };
    const handleOverlayClick = React.useCallback((event: React.MouseEvent) => { if (event.target === event.currentTarget) overlayState.close(); }, [overlayState]);
    const { dialogProps } = useDialog({ "aria-label": "Command palette" }, modalRef);
    if (!embedded && (!mounted || !present)) return null;
    const content = <Card {...(!embedded ? filterDOMProps(dialogProps) : {})} ref={modalRef} onKeyDown={handleKeyDown} onPointerDownCapture={() => { pointerRef.current = true; window.setTimeout(() => { pointerRef.current = false; }, 0); }} className={cn(embedded && "command", "content", styles.content, embedded && styles.embedded, className, resolved.root)} role={embedded ? undefined : "dialog"} aria-modal={embedded ? undefined : "true"}><CommandContext.Provider value={{ isOpen: overlayState.isOpen, close: overlayState.close, focusedKey, setFocusedKey, registerItem, unregisterItem, actionRef, surfaceRef: modalRef, pointerRef, searchInputRef, scrollableRef, dismissOnBlur: embedded, searchValue, setSearchValue, filteredItems, groupedItems }}>{children}</CommandContext.Provider></Card>;
    if (embedded) return content;
    return createPortal(<FocusScope contain restoreFocus><div className={cn("command", styles.overlay, resolved.overlay)} onClick={handleOverlayClick} data-state={presenceState} onTransitionEnd={(event) => { if (event.target === event.currentTarget && event.propertyName === "opacity") finishExit(); }}>{content}</div></FocusScope>, document.body);
  },
);

Command.displayName = "Command";
