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

import css from "./Select.module.css";
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

/**
 * Registered option data supplied to Select.Value render functions and used for data-driven
 * navigation, filtering, and selected-text resolution.
 * @typeDoc SelectItemData
 */
export type SelectItemData = ItemData;

/**
 * Chooses whether the trigger opens from a press or from pointer hover.
 * @typeDoc SelectTriggerMode
 */
export type SelectTriggerMode = "click" | "hover";

/**
 * Chooses whether selecting an option replaces one key or toggles it in a set.
 * @typeDoc SelectMode
 */
export type SelectMode = "single" | "multiple";

/**
 * Controlled selection and open state accepted by the Select root. Values supplied here take
 * precedence over the equivalent standalone controlled props.
 * @typeDoc SelectState
 */
export interface SelectState {
  /** Selected key in single mode, or the selected keys in multiple mode. */
  value?: Key | Key[];

  /** Whether the option panel is open. */
  open?: boolean;
}

/**
 * Named style slot for the Select root.
 * @typeDoc SelectStyleSlots
 */
export interface SelectStyleSlots {
  /**
   * Styles the root wrapper. Its inline style is also copied onto the portalled content overlay so
   * variable overrides reach the floating panel; its class is not.
   */
  root?: SlotStyle;
}

/**
 * Style override for the Select root, accepting classes, inline CSS properties, or both.
 * @typeDoc SelectStylesProp
 */
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
  triggerSearchPlaceholder?: string;
  triggerContent?: React.ReactNode;
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
  triggerPressOriginRef: React.MutableRefObject<{ x: number; y: number } | null>;
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
  /**
   * Supplies controlled selection and open state in one object. Its values take precedence over the
   * matching standalone controlled props.
   * @category Core
   * @typeDoc SelectState
   */
  state?: SelectState;

  /**
   * Controls the selected key in single mode or the selected keys in multiple mode. It takes
   * precedence over selectedKey and selectedKeys, and state.value takes precedence over it.
   * @category Core
   */
  value?: Key | Key[];

  /**
   * Controls whether the option panel is open. state.open takes precedence over it.
   * @category Core
   */
  open?: boolean;

  /**
   * Chooses whether selecting an option replaces one key or toggles it in a set. Multiple mode
   * renders a checkbox in each option and marks the panel aria-multiselectable.
   * @category Core
   * @default "single"
   * @typeDoc SelectMode
   */
  mode?: SelectMode;

  /**
   * Supplies external item data for keyboard navigation and filtering. Select.Item children still
   * render the visible options.
   * @category Items
   */
  items?: Array<T>;

  /**
   * Controls the selected key in single mode when neither value nor state.value supplies one.
   * @category Core
   */
  selectedKey?: Key | null;

  /**
   * Sets the initial selected key for uncontrolled single-select usage.
   * @category Core
   * @default null
   */
  defaultSelectedKey?: Key | null;

  /**
   * Controls the selected keys in multiple mode when neither value nor state.value supplies an
   * array.
   * @category Core
   */
  selectedKeys?: Key[];

  /**
   * Sets the initial selected keys for uncontrolled multiple-select usage.
   * @category Core
   * @default []
   */
  defaultSelectedKeys?: Key[];

  /**
   * Provides fallback trigger text when the selected option has not registered yet and no option is
   * selected.
   * @category Content
   */
  defaultValue?: string;

  /**
   * Provides the selected trigger text before options register, which avoids a server-rendered
   * placeholder flash. Pair it with selectedKey or defaultSelectedKey.
   * @category Content
   */
  label?: string;

  /**
   * Runs after a selection changes, receiving the selected key in single mode or the complete key
   * array in multiple mode. It does not run while the Select is disabled.
   * @category Events
   */
  onSelectionChange?: (value: any) => void;

  /**
   * Prevents opening, selection, hover opening, and trigger press interaction, and publishes
   * data-disabled on the root and trigger.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled
   */
  disabled?: boolean;

  /**
   * Focuses the registered trigger after mount.
   * @category Accessibility
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus
   */
  autoFocus?: boolean;

  /**
   * Limits how many option rows are visible before the floating panel becomes scrollable.
   * @category Items
   * @default 6
   */
  maxItems?: number;

  /**
   * Adds classes to the root wrapper before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Chooses press or hover opening. Hover mode opens on pointer entry and closes shortly after the
   * pointer leaves both the trigger and the panel.
   * @category Core
   * @default "click"
   * @typeDoc SelectTriggerMode
   */
  trigger?: SelectTriggerMode;

  /**
   * Filters registered or external items for searchable content. Each item is passed with label
   * mapped from its textValue.
   * @category Items
   */
  filter?: (item: T) => boolean;

  /**
   * Styles the Select root slot. className remains the conventional root class API.
   * @category Styling
   * @typeDoc SelectStyleSlots
   */
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
      style,
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
    const hasInitializedOpenFocusRef = React.useRef(false);

    const mouseMoveDetectedRef = React.useRef(true);
    const triggerMouseDownRef = React.useRef(false);
    const triggerPressOriginRef = React.useRef<{ x: number; y: number } | null>(null);
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

    const controlledSingleKey =
      controlledSingleStateValue !== undefined
        ? controlledSingleStateValue
        : controlledSingleValue;

    const [selectedKey, setSelectedKey] = useControlledState(
      controlledSingleKey,
      defaultSelectedKey,
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
        triggerPressOriginRef.current = { x: event.clientX, y: event.clientY };
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
        triggerPressOriginRef.current = null;
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
      if (!isOpen) {
        hasInitializedOpenFocusRef.current = false;
        nav.setFocusedKey(null);
        return;
      }

      // Keep the current keyboard focus when it is still visible and enabled.
      if (nav.focusedKey !== null && nav.visibleKeys.has(nav.focusedKey)) {
        const focusedItem = nav.filteredItems.find((item) => item.key === nav.focusedKey);

        if (focusedItem && !focusedItem.isDisabled) {
          hasInitializedOpenFocusRef.current = true;
          return;
        }
      }

      // Once the opening highlight has been established, an intentionally cleared
      // pointer highlight should stay cleared until the user moves over an item again.
      if (hasInitializedOpenFocusRef.current && nav.focusedKey === null) return;

      const initialFocusKey =
        mode === "multiple" && selectedKeys.size > 0
          ? selectedKeys.values().next().value
          : selectedKey;

      if (initialFocusKey != null && nav.visibleKeys.has(initialFocusKey)) {
        const selectedItem = nav.filteredItems.find((item) => item.key === initialFocusKey);

        if (selectedItem && !selectedItem.isDisabled) {
          hasInitializedOpenFocusRef.current = true;
          nav.setFocusedKey(initialFocusKey);
          return;
        }
      }

      const firstEnabledKey = nav.enabledFilteredItems[0]?.key ?? null;
      if (firstEnabledKey !== null) {
        hasInitializedOpenFocusRef.current = true;
      }
      nav.setFocusedKey(firstEnabledKey);
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
    const triggerSearchPlaceholder =
      triggerType === "input" && React.isValidElement<{ placeholder?: string }>(trigger)
        ? trigger.props.placeholder
        : undefined;
    const triggerContent =
      triggerType === "button" && React.isValidElement<{ children?: React.ReactNode }>(trigger)
        ? trigger.props.children
        : undefined;

    // Select.Trigger's visual treatment is a whole-surface decision: the root paints the
    // background and border, so the variant has to reach the root class and attribute.
    const triggerVariant =
      getChildDisplayName(trigger) === "Select.Trigger" &&
      React.isValidElement<{ variant?: string }>(trigger)
        ? trigger.props.variant
        : undefined;

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
      triggerSearchPlaceholder,
      triggerContent,
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
      triggerPressOriginRef,
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
            triggerVariant,
            css.select,
            hasExternalValue && css["select-split"],
            className,
            resolvedStyles.root.className,
          )}
          style={{ ...rootStyle, ...style }}
          data-slot="root"
          data-mode={mode}
          data-variant={triggerVariant}
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
