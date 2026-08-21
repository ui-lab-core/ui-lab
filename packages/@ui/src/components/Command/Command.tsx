"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { filterDOMProps } from "@react-aria/utils";
import { cn } from "@/lib/utils";
import { useControlledState } from "@/hooks/useControlledState";
import { useAnimatedSize } from "@/hooks/useAnimatedSize";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { usePresence } from "@/hooks/usePresence";
import { useScrollLock } from "../../hooks/useScrollLock";
import { Card } from "../Card";
import css from "./Command.module.css";
import {
  CommandContext,
  type CommandItem,
  type CommandStylesProp,
  resolveCommandStyles,
  useCommandEngine,
} from "./Command.shared";

const transitionDuration = 180;
const EMPTY_COMMAND_ITEMS: CommandItem[] = [];

/** Props for the floating or embedded command palette surface. */
export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** External state controller. When provided, it takes precedence over open, defaultOpen, and onOpenChange.
   * @category Core
   * @typeDoc CommandState
   */
  state?: CommandState;
  /** Controls whether the command palette is open when local state is used.
   * @category Core
   */
  open?: boolean;
  /** Initial open state for an uncontrolled command palette.
   * @category Core
   * @default false
   */
  defaultOpen?: boolean;
  /** Called with the next open state when local state opens or closes the palette.
   * @category Events
   */
  onOpenChange?: (open: boolean) => void;
  /** Renders the palette inline without a portal, backdrop, focus scope, or dialog semantics.
   * @category Core
   * @default false
   */
  embedded?: boolean;
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
  /** Compound command content, typically Command.Input, Command.List, and item or group parts.
   * @category Content
   */
  children?: React.ReactNode;
}

/** Imperative open state and trigger registration shared by Command and Command.Trigger. */
export interface CommandState {
  /** Whether the command palette is currently open. */
  isOpen: boolean;
  /** Sets the command palette to an explicit open state. */
  setOpen: (open: boolean) => void;
  /** Opens the command palette. */
  open: () => void;
  /** Closes the command palette. */
  close: () => void;
  /** Toggles the current open state. */
  toggle: () => void;
  /** Registers the trigger element that receives focus after the floating palette closes. */
  setTrigger: (element: HTMLElement | null) => void;
  /** Mutable reference to the registered trigger element. */
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

/** Options for creating controlled or uncontrolled command palette state. */
export interface UseCommandStateProps {
  /** Controlled open state.
   * @category Core
   */
  open?: boolean;
  /** Initial open state when uncontrolled.
   * @category Core
   * @default false
   */
  defaultOpen?: boolean;
  /** Called whenever the state controller receives a new open state.
   * @category Events
   */
  onOpenChange?: (open: boolean) => void;
}

/** Creates a command palette state controller for Command and Command.Trigger. */
export function useCommandState({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
}: UseCommandStateProps = {}): CommandState {
  const [isOpen, setInternalOpen] = useControlledState(controlledOpen, defaultOpen, false);
  const setOpen = React.useCallback(
    (next: boolean) => {
      setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, setInternalOpen],
  );
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const setTrigger = React.useCallback((element: HTMLElement | null) => {
    triggerRef.current = element;
  }, []);
  return React.useMemo(
    () => ({
      isOpen,
      setOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen(!isOpen),
      setTrigger,
      triggerRef,
    }),
    [isOpen, setOpen, setTrigger],
  );
}

/**
 * Floating command palette with dialog semantics, keyboard navigation, search
 * state, focus containment, and optional inline embedded rendering.
 * @see https://react-spectrum.adobe.com/react-aria/useDialog.html
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */
export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      open,
      defaultOpen,
      state,
      onOpenChange,
      embedded = false,
      className,
      styles: commandStyles,
      items = EMPTY_COMMAND_ITEMS,
      filter,
      children,
      ...props
    },
    ref,
  ) => {
    const [mounted, setMounted] = React.useState(false);
    const localState = useCommandState({ open, defaultOpen, onOpenChange });
    const commandState = state ?? localState;
    const overlayState = useOverlayTriggerState({
      isOpen: commandState.isOpen,
      onOpenChange: commandState.setOpen,
    });
    const modalRef = React.useRef<HTMLDivElement>(null);
    const paletteRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const scrollableRef = React.useRef<HTMLDivElement>(null);
    const pointerRef = React.useRef(false);
    const resolved = resolveCommandStyles(commandStyles);
    useScrollLock(!embedded && overlayState.isOpen, scrollableRef.current);
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
    const animatedHeightRef = useAnimatedSize<HTMLDivElement>({
      dimensions: "height",
      duration: 280,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      trigger: `${searchValue}\u0000${filteredItems.map((item) => item.id).join("\u0000")}`,
    });
    const surfaceRef = useMergeRefs(modalRef, animatedHeightRef);
    React.useImperativeHandle(ref, () => paletteRef.current as HTMLDivElement);
    React.useEffect(() => {
      setMounted(true);
    }, []);
    const {
      present,
      state: presenceState,
      finishExit,
    } = usePresence(mounted && overlayState.isOpen, transitionDuration);
    const wasOpenRef = React.useRef(false);
    React.useEffect(() => {
      if (overlayState.isOpen) {
        wasOpenRef.current = true;
        return;
      }
      if (wasOpenRef.current && !present) {
        commandState.triggerRef.current?.focus({ preventScroll: true });
        wasOpenRef.current = false;
      }
    }, [commandState, overlayState.isOpen, present]);
    React.useEffect(() => {
      if (!overlayState.isOpen && !present) setSearchValue("");
    }, [overlayState.isOpen, present, setSearchValue]);
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (!overlayState.isOpen) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveFocus(event.key === "ArrowDown" ? "down" : "up");
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const action = runFocusedAction();
        if (action) {
          action();
          overlayState.close();
        }
      }
      if (event.key === "Escape" && !embedded) {
        event.preventDefault();
        overlayState.close();
      }
    };
    const handleOverlayClick = React.useCallback(
      (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) overlayState.close();
      },
      [overlayState],
    );
    const { dialogProps } = useDialog({ "aria-label": "Command palette" }, modalRef);
    if (!embedded && (!mounted || !present)) return null;
    const content = (
      <Card
        {...(!embedded ? filterDOMProps(dialogProps) : {})}
        ref={surfaceRef}
        {...props}
        onKeyDown={handleKeyDown}
        onPointerDownCapture={() => {
          pointerRef.current = true;
          window.setTimeout(() => {
            pointerRef.current = false;
          }, 0);
        }}
        className={cn(
          "command",
          "content",
          css.root,
          css.content,
          embedded && css.embedded,
          className,
          resolved["root.root"],
        )}
        data-slot="root"
        role={embedded ? undefined : "dialog"}
        aria-modal={embedded ? undefined : "true"}
      >
        <CommandContext.Provider
          value={{
            styles: resolved,
            isOpen: overlayState.isOpen,
            close: overlayState.close,
            focusedKey,
            setFocusedKey,
            registerItem,
            unregisterItem,
            actionRef,
            surfaceRef: modalRef,
            pointerRef,
            searchInputRef,
            scrollableRef,
            dismissOnBlur: embedded,
            searchValue,
            setSearchValue,
            filteredItems,
            groupedItems,
          }}
        >
          {children}
        </CommandContext.Provider>
      </Card>
    );
    if (embedded) return content;
    return createPortal(
      <FocusScope contain restoreFocus>
        <div
          className={cn("command", css.overlay, resolved["overlay.root"])}
          onClick={handleOverlayClick}
          data-slot="overlay"
          data-state={presenceState}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === "opacity")
              finishExit();
          }}
        >
          {content}
        </div>
      </FocusScope>,
      document.body,
    );
  },
);

Command.displayName = "Command";
