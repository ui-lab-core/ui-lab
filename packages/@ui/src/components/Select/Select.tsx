"use client";

import * as React from "react";
import type { Key } from "@react-types/shared";

import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";

import { useControlledState } from "@/hooks/useControlledState";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { type SlotStyle, createStylePropsResolver } from "@/lib/styles";
import { cn } from "@/lib/utils";

import styles from "./Select.module.css";
import {
  clearSelectRegistry,
  closeOtherSelects,
  registerSelectCloseCallback,
  unregisterSelectCloseCallback,
} from "./Select.registry";
import {
  focusAdjacentTabStop,
  handleListKeyDown,
  type ItemData,
  useListNavigation,
} from "./Select.shared";

/** Registered option data used by Select.Value render functions and data-driven navigation. */
export type SelectItemData = ItemData;

/** Selects whether the trigger opens from a press or pointer hover. */
export type SelectTriggerMode = "click" | "hover";

/** Selects one item or independently toggles multiple items. */
export type SelectMode = "single" | "multiple";

/** Controlled state accepted by the Select root. */
export interface SelectState {
  /** Selected key in single mode, or selected keys in multiple mode. */
  value?: Key | Key[];

  /** Whether the option panel is open. */
  open?: boolean;
}

/** Named style overrides for the Select root. */
export interface SelectStyleSlots {
  /** Styles the root wrapper and is inherited as inline style by the floating content overlay. */
  root?: SlotStyle;
}

export type SelectStylesProp = SelectStyleSlots;

type ContentPlacement = "top" | "bottom";
type TriggerType = "button" | "input";
type RestoreFocusTarget = "auto" | "trigger" | "row";

interface ItemExtras {
  onSelect?: () => void;
  isSubmenuTrigger?: boolean;
}

export interface SelectContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contentPlacement: ContentPlacement;
  setContentPlacement: React.Dispatch<React.SetStateAction<ContentPlacement>>;
  triggerType: TriggerType;
  mode: SelectMode;
  selectedKey: Key | null;
  selectedKeys?: Set<Key>;
  selectedTextValue: string;
  onSelect: (key: Key) => void;
  onToggle?: (key: Key) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  wrapperRef: React.MutableRefObject<HTMLElement | null>;
  contentRef: React.MutableRefObject<HTMLElement | null>;
  triggerProps: any;
  isFocused: boolean;
  isFocusVisible: boolean;
  isPressed: boolean;
  isHovered: boolean;
  isDisabled: boolean;
  items: SelectItemData[];
  registerItem: (
    key: Key,
    textValue: string,
    isDisabled?: boolean,
    onSelect?: () => void,
    isSubmenuTrigger?: boolean,
  ) => void;
  unregisterItem: (key: Key) => void;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: SelectItemData[];
  visibleKeys: Set<Key>;
  focusedKey: Key | null;
  setFocusedKey: React.Dispatch<React.SetStateAction<Key | null>>;
  navigateToNextItem: () => void;
  navigateToPrevItem: () => void;
  selectFocusedItem: () => void;
  isFocusedItemSubmenu: () => boolean;
  maxItems: number;
  triggerMode: SelectTriggerMode;
  handleHoverIntent: (isHovering: boolean) => void;
  mouseMoveDetectedRef: React.MutableRefObject<boolean>;
  triggerMouseDownRef: React.MutableRefObject<boolean>;
  keyboardScrollIntentRef: React.MutableRefObject<boolean>;
  markKeyboardNavigation: () => void;
  moveFocusFromTrigger: (direction: 1 | -1) => boolean;
  filter?: (item: any) => boolean;
  contentId: string;
  hasExternalValue: boolean;
  restoreFocus: (target?: RestoreFocusTarget) => void;
  rootStyle?: React.CSSProperties;
}

export const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error("Select component must be used within Select root");
  }

  return context;
}

export interface SelectProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls the selection and/or open state. Its supplied values take precedence over the corresponding standalone controlled props.
   * @category Core
   * @typeDoc SelectState */
  state?: SelectState;

  /** Controls the selected key in single mode or selected keys in multiple mode. In single mode it takes precedence over selectedKey.
   * @category Core */
  value?: Key | Key[];

  /** Controls whether the option panel is open.
   * @category Core */
  open?: boolean;

  /** Chooses whether selecting an item replaces one key or toggles it in a set.
   * @category Core
   * @default "single"
   * @typeDoc SelectMode */
  mode?: SelectMode;

  /** Supplies external item data for navigation and filtering; JSX Select.Item children still provide rendered options.
   * @category Content */
  items?: Array<T>;

  /** Controls the selected key when mode is single and value/state.value do not supply one.
   * @category Core */
  selectedKey?: Key | null;

  /** Sets the initial selected key for uncontrolled single-select usage.
   * @category Core
   * @default null */
  defaultSelectedKey?: Key | null;

  /** Controls selected keys in multiple mode when value/state.value do not supply an array.
   * @category Core */
  selectedKeys?: Key[];

  /** Sets the initial selected keys for uncontrolled multiple-select usage.
   * @category Core
   * @default [] */
  defaultSelectedKeys?: Key[];

  /** Provides fallback trigger text when the selected item has not registered or no item is selected.
   * @category Content */
  defaultValue?: string;

  /** Provides selected trigger text before items register, avoiding an SSR/SSG placeholder flash. Pair it with selectedKey or defaultSelectedKey.
   * @category Content */
  label?: string;

  /** Runs after a selection changes with a key in single mode or the complete key array in multiple mode.
   * @category Events */
  onSelectionChange?: (value: any) => void;

  /** Prevents opening, selection, hover opening, and trigger focus interaction.
   * @category Core
   * @default false */
  disabled?: boolean;

  /** Focuses the registered trigger after mount.
   * @category Accessibility
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus */
  autoFocus?: boolean;

  /** Limits visible option rows before the floating panel becomes scrollable.
   * @category Content
   * @default 6 */
  maxItems?: number;

  /** Adds classes to the root wrapper.
   * @category Styling */
  className?: string;

  /** Chooses press or hover opening. Hover mode closes shortly after the pointer leaves both trigger and panel.
   * @category Core
   * @default "click"
   * @typeDoc SelectTriggerMode */
  trigger?: SelectTriggerMode;

  /** Filters registered or external items for searchable Select content. It receives item data with label mapped from textValue.
   * @category Content */
  filter?: (item: T) => boolean;

  /** Styles the named Select anatomy. className remains the conventional root class API.
   * @category Styling
   * @typeDoc SelectStyleSlots */
  styles?: SelectStylesProp;
}

const TRIGGER_NAMES = ["Select.Trigger", "Select.SearchableTrigger"];
const CONTENT_NAMES = ["Select.Content", "Select.SearchableContent"];

const resolveSelectStyles = createStylePropsResolver(["root"] as const);

function getChildDisplayName(child: React.ReactNode) {
  if (!React.isValidElement(child)) return undefined;
  return (child.type as { displayName?: string })?.displayName;
}

function isNamedChild(child: React.ReactNode, names: string[]) {
  const displayName = getChildDisplayName(child);
  return displayName !== undefined && names.includes(displayName);
}

const Select = React.forwardRef<HTMLDivElement, SelectProps<any>>(
  (
    {
      mode = "single",
      state: controlledState,
      value,
      open,
      items: propItems = [],
      selectedKey: controlledSelectedKey,
      defaultSelectedKey,
      selectedKeys: controlledSelectedKeys,
      defaultSelectedKeys = [],
      defaultValue,
      label,
      onSelectionChange,
      disabled: isDisabled = false,
      autoFocus = false,
      maxItems = 6,
      children,
      className,
      trigger: triggerMode = "click",
      filter,
      styles: stylesProp,
      ...domProps
    },
    ref,
  ) => {
    // Refs

    const scopeRef = React.useRef<HTMLDivElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLElement>(null);
    const contentRef = React.useRef<HTMLElement>(null);

    const itemExtrasRef = React.useRef<Map<Key, ItemExtras>>(new Map());
    const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const mouseMoveDetectedRef = React.useRef(true);
    const triggerMouseDownRef = React.useRef(false);
    const openedOnMouseDownRef = React.useRef(false);
    const keyboardScrollIntentRef = React.useRef(false);

    // IDs

    const contentId = React.useId();
    const selectId = React.useId();

    // Open state

    const [isOpen, setIsOpen] = useControlledState(controlledState?.open, open, false);
    const [contentPlacement, setContentPlacement] = React.useState<ContentPlacement>("bottom");

    // Selection state

    const controlledSingleStateValue =
      mode === "single" && !Array.isArray(controlledState?.value)
        ? (controlledState?.value as Key | null | undefined)
        : undefined;

    const controlledSingleValue = !Array.isArray(value)
      ? (value ?? controlledSelectedKey)
      : undefined;

    const [selectedKey, setSelectedKey] = useControlledState(
      controlledSingleStateValue,
      controlledSingleValue,
      defaultSelectedKey ?? null,
    );

    const controlledMultipleValues =
      mode !== "multiple"
        ? undefined
        : Array.isArray(controlledState?.value)
          ? controlledState.value
          : Array.isArray(value)
            ? value
            : controlledSelectedKeys;

    const controlledMultipleKeys = React.useMemo(
      () =>
        controlledMultipleValues === undefined ? undefined : new Set(controlledMultipleValues),
      [controlledMultipleValues],
    );

    const [selectedKeys, setSelectedKeys] = useControlledState(
      controlledMultipleKeys,
      undefined,
      new Set(defaultSelectedKeys),
    );

    const [selectedTextValue, setSelectedTextValue] = React.useState(label ?? defaultValue ?? "");

    // Navigation

    const nav = useListNavigation({
      isOpen,
      externalItems: propItems.length ? propItems : undefined,
      filter: filter ? (item: any) => filter({ ...item, label: item.textValue } as any) : undefined,
    });

    const registerItem = React.useCallback(
      (
        key: Key,
        textValue: string,
        itemDisabled?: boolean,
        onSelect?: () => void,
        isSubmenuTrigger?: boolean,
      ) => {
        nav.registerItem(key, textValue, itemDisabled);
        itemExtrasRef.current.set(key, { onSelect, isSubmenuTrigger });
      },
      [nav.registerItem],
    );

    const unregisterItem = React.useCallback(
      (key: Key) => {
        nav.unregisterItem(key);
        itemExtrasRef.current.delete(key);
      },
      [nav.unregisterItem],
    );

    const isFocusedItemSubmenu = React.useCallback(() => {
      if (nav.focusedKey === null) return false;

      return itemExtrasRef.current.get(nav.focusedKey)?.isSubmenuTrigger ?? false;
    }, [nav.focusedKey]);

    const markKeyboardNavigation = React.useCallback(() => {
      mouseMoveDetectedRef.current = false;
      keyboardScrollIntentRef.current = true;
    }, []);

    // Focus

    const moveFocusFromTrigger = React.useCallback((direction: 1 | -1) => {
      if (!triggerRef.current) return false;

      return focusAdjacentTabStop(triggerRef.current, direction, wrapperRef.current);
    }, []);

    const restoreFocus = React.useCallback((target: RestoreFocusTarget = "auto") => {
      const triggerElement = triggerRef.current;
      if (!triggerElement) return;

      const ownerRow = triggerElement.closest<HTMLElement>('[data-list-focus-owner="true"]');

      const focusTarget =
        target === "row"
          ? ownerRow
          : target === "trigger"
            ? triggerElement
            : (ownerRow ?? triggerElement);

      focusTarget?.focus({ preventScroll: true });
    }, []);

    // Selection

    const onSelect = React.useCallback(
      (key: Key) => {
        const item = nav.items.find((item) => item.key === key);

        if (item) {
          setSelectedTextValue(item.textValue);
        }

        setSelectedKey(key);
        onSelectionChange?.(key);

        setIsOpen(false);
        nav.setSearchValue("");
        restoreFocus();
      },
      [nav.items, nav.setSearchValue, onSelectionChange, restoreFocus, setIsOpen, setSelectedKey],
    );

    const onToggle = React.useCallback(
      (key: Key) => {
        const nextKeys = new Set(selectedKeys);

        if (nextKeys.has(key)) {
          nextKeys.delete(key);
        } else {
          nextKeys.add(key);
        }

        setSelectedKeys(nextKeys);
        onSelectionChange?.(Array.from(nextKeys));
      },
      [onSelectionChange, selectedKeys, setSelectedKeys],
    );

    const selectFocusedItem = React.useCallback(() => {
      if (nav.focusedKey === null) return;

      const item = nav.enabledFilteredItems.find((item) => item.key === nav.focusedKey);

      if (!item || item.isDisabled) return;

      const extras = itemExtrasRef.current.get(nav.focusedKey);

      if (extras?.onSelect) {
        extras.onSelect();
      } else if (mode === "multiple") {
        onToggle(nav.focusedKey);
      } else {
        onSelect(nav.focusedKey);
      }
    }, [mode, nav.enabledFilteredItems, nav.focusedKey, onSelect, onToggle]);

    // Hover behavior

    const handleHoverIntent = React.useCallback(
      (isHovering: boolean) => {
        if (triggerMode !== "hover" || isDisabled) return;

        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }

        if (isHovering) {
          setIsOpen(true);
          return;
        }

        hoverTimeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 100);
      },
      [isDisabled, setIsOpen, triggerMode],
    );

    // React Aria state

    const { buttonProps, isPressed } = useButton(
      {
        isDisabled,
        onPress: (event) => {
          if (isDisabled || event.pointerType === "keyboard") return;

          // A closed Select opens on mouse down. Do not immediately undo that
          // state change when React Aria completes the same press on mouse up.
          if (openedOnMouseDownRef.current) {
            openedOnMouseDownRef.current = false;
            return;
          }

          setIsOpen((current) => !current);
        },
      },
      triggerRef,
    );

    const { focusProps, isFocused, isFocusVisible } = useFocusRing();

    const { hoverProps, isHovered } = useHover({
      isDisabled,
      onHoverStart: () => handleHoverIntent(true),
      onHoverEnd: () => handleHoverIntent(false),
    });

    // Trigger interaction

    const handleTriggerMouseDown = React.useCallback(
      (event: React.MouseEvent) => {
        if (isDisabled || event.button !== 0) return;

        triggerMouseDownRef.current = true;
        openedOnMouseDownRef.current = !isOpen;

        if (!isOpen) {
          setIsOpen(true);
        }
      },
      [isDisabled, isOpen, setIsOpen],
    );

    const handleTriggerKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (!isOpen) {
          const shouldOpen =
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter" ||
            (event.key === " " && !isDisabled);

          if (shouldOpen) {
            event.preventDefault();
            setIsOpen(true);
          }

          return;
        }

        if (event.key === "Tab") {
          event.preventDefault();

          setIsOpen(false);
          nav.setSearchValue("");
          moveFocusFromTrigger(event.shiftKey ? -1 : 1);

          return;
        }

        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "Home" ||
          event.key === "End"
        ) {
          markKeyboardNavigation();
        }

        handleListKeyDown(event, {
          navigateNext: nav.navigateToNextItem,
          navigatePrev: nav.navigateToPrevItem,
          confirm: selectFocusedItem,
          close: () => {
            setIsOpen(false);
            nav.setSearchValue("");
            restoreFocus();
          },
          filteredItems: nav.filteredItems,
          setFocusedKey: nav.setFocusedKey,
        });
      },
      [
        isDisabled,
        isOpen,
        markKeyboardNavigation,
        moveFocusFromTrigger,
        nav.filteredItems,
        nav.navigateToNextItem,
        nav.navigateToPrevItem,
        nav.setFocusedKey,
        nav.setSearchValue,
        restoreFocus,
        selectFocusedItem,
        setIsOpen,
      ],
    );

    const triggerProps = mergeProps(buttonProps, focusProps, hoverProps, {
      "aria-haspopup": "listbox" as const,
      "aria-expanded": isOpen,
      "aria-controls": isOpen ? contentId : undefined,
      "aria-disabled": isDisabled || undefined,
      onMouseDown: handleTriggerMouseDown,
      onKeyDown: handleTriggerKeyDown,
    });

    // Lifecycle

    React.useEffect(() => {
      registerSelectCloseCallback(selectId, (shouldClose) => {
        if (shouldClose) setIsOpen(false);
      });

      return () => {
        unregisterSelectCloseCallback(selectId);
        clearSelectRegistry(selectId);
      };
    }, [selectId, setIsOpen]);

    React.useEffect(() => {
      if (isOpen) {
        closeOtherSelects(selectId);
      }
    }, [isOpen, selectId]);

    React.useEffect(() => {
      if (!isOpen || triggerMode !== "hover" || isDisabled) return;

      const handleMouseMove = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const isOverSelect =
          wrapperRef.current?.contains(target) || contentRef.current?.contains(target);

        handleHoverIntent(Boolean(isOverSelect));
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, [handleHoverIntent, isDisabled, isOpen, triggerMode]);

    React.useEffect(
      () => () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      },
      [],
    );

    React.useEffect(() => {
      const handleMouseUp = () => {
        triggerMouseDownRef.current = false;
      };

      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, []);

    React.useEffect(() => {
      if (autoFocus) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    }, [autoFocus]);

    React.useEffect(() => {
      if (!isOpen) return;

      // Keep the current keyboard focus when it is still visible and enabled.
      if (nav.focusedKey !== null && nav.visibleKeys.has(nav.focusedKey)) {
        const focusedItem = nav.filteredItems.find((item) => item.key === nav.focusedKey);

        if (focusedItem && !focusedItem.isDisabled) {
          return;
        }
      }

      const initialFocusKey =
        mode === "multiple" && selectedKeys.size > 0
          ? selectedKeys.values().next().value
          : selectedKey;

      if (initialFocusKey != null && nav.visibleKeys.has(initialFocusKey)) {
        const selectedItem = nav.filteredItems.find((item) => item.key === initialFocusKey);

        if (selectedItem && !selectedItem.isDisabled) {
          nav.setFocusedKey(initialFocusKey);
          return;
        }
      }

      nav.setFocusedKey(nav.enabledFilteredItems[0]?.key ?? null);
    }, [
      isOpen,
      mode,
      nav.enabledFilteredItems,
      nav.filteredItems,
      nav.focusedKey,
      nav.setFocusedKey,
      nav.visibleKeys,
      selectedKey,
      selectedKeys,
    ]);

    React.useEffect(() => {
      if (mode !== "single") return;

      if (selectedKey === null) {
        setSelectedTextValue("");
        return;
      }

      const selectedItem = nav.items.find((item) => item.key === selectedKey);

      if (selectedItem) {
        setSelectedTextValue(selectedItem.textValue);
      } else if (label !== undefined) {
        setSelectedTextValue(label);
      } else if (defaultValue !== undefined && defaultValue !== null) {
        setSelectedTextValue(defaultValue);
      }
    }, [defaultValue, label, mode, nav.items, selectedKey]);

    // Children

    const childrenArray = React.Children.toArray(children);

    const trigger = childrenArray.find((child) => isNamedChild(child, TRIGGER_NAMES));

    const contentItems = childrenArray.filter((child) => isNamedChild(child, CONTENT_NAMES));

    const otherContent = childrenArray.filter(
      (child) => !isNamedChild(child, TRIGGER_NAMES) && !isNamedChild(child, CONTENT_NAMES),
    );

    const hasExternalValue = otherContent.some(
      (child) => getChildDisplayName(child) === "Select.Value",
    );

    const triggerType: TriggerType =
      getChildDisplayName(trigger) === "Select.SearchableTrigger" ? "input" : "button";

    // Styling and focus indicator

    const resolvedStyles = resolveSelectStyles(stylesProp);
    const rootStyle = resolvedStyles.root.style;

    const mergedRootRef = useMergeRefs<HTMLDivElement>(scopeRef, wrapperRef, ref);

    const { indicatorProps } = useFocus({
      scopeRef,
      containerRef: wrapperRef,
      surfaceSelector: '[data-select-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
      dependencies: [mode],
    });

    // Context

    const contextValue: SelectContextValue = {
      isOpen,
      setIsOpen,
      contentPlacement,
      setContentPlacement,
      triggerType,
      mode,

      selectedKey,
      selectedKeys: mode === "multiple" ? selectedKeys : undefined,
      selectedTextValue,
      onSelect,
      onToggle: mode === "multiple" ? onToggle : undefined,

      triggerRef,
      wrapperRef,
      contentRef,
      triggerProps,

      isFocused,
      isFocusVisible,
      isPressed,
      isHovered,
      isDisabled,

      items: nav.items,
      registerItem,
      unregisterItem,

      searchValue: nav.searchValue,
      setSearchValue: nav.setSearchValue,
      filteredItems: nav.filteredItems,
      visibleKeys: nav.visibleKeys,
      focusedKey: nav.focusedKey,
      setFocusedKey: nav.setFocusedKey,
      navigateToNextItem: nav.navigateToNextItem,
      navigateToPrevItem: nav.navigateToPrevItem,
      selectFocusedItem,
      isFocusedItemSubmenu,

      maxItems,
      triggerMode,
      handleHoverIntent,

      mouseMoveDetectedRef,
      triggerMouseDownRef,
      keyboardScrollIntentRef,
      markKeyboardNavigation,

      moveFocusFromTrigger,
      restoreFocus,

      filter,
      contentId,
      hasExternalValue,
      rootStyle,
    };

    return (
      <SelectContext.Provider value={contextValue}>
        <div
          ref={mergedRootRef}
          className={cn(
            "select",
            styles.select,
            hasExternalValue && styles["select-split"],
            className,
            resolvedStyles.root.className,
          )}
          style={rootStyle}
          data-slot="root"
          data-mode={mode}
          data-disabled={isDisabled ? "true" : undefined}
          data-select-focus-surface="true"
          data-focused={isFocused ? "true" : "false"}
          data-focus-visible={isFocusVisible ? "true" : "false"}
          {...domProps}
        >
          <div {...indicatorProps} data-focus-indicator="local" />

          {otherContent}
          {trigger}
          {contentItems}
        </div>
      </SelectContext.Provider>
    );
  },
);

Select.displayName = "Select";

export { Select, useSelectContext };
