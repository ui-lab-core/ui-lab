"use client";

import * as React from "react";
import type { Key } from "react-aria";
import { useListNavigation } from "../../utils/list-navigation";
import type {
  MenuContextValue,
  MenuSubmenuContextValue,
  RadioGroupContextValue,
  MenuProps,
  MenuPortalProps,
  MenuItemExtras,
} from "./menu.types";
import { useControlledState } from "@/hooks/useControlledState";

const EMPTY_KEYS: Set<Key> = new Set();

const MenuContext = React.createContext<MenuContextValue | null>(null);

export function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error("Menu component must be used within Menu root");
  }
  return context;
}

export const MenuSubmenuContext = React.createContext<MenuSubmenuContextValue | null>(null);

export function useMenuSubmenuContext() {
  return React.useContext(MenuSubmenuContext);
}

export const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext() {
  return React.useContext(RadioGroupContext);
}

const MenuPortalContext = React.createContext<HTMLElement | null>(null);

/** Returns the container every panel below this provider portals into, or null on the server. */
export function useMenuPortalContainer(): HTMLElement | null {
  const container = React.useContext(MenuPortalContext);
  if (container) return container;
  return typeof document === "undefined" ? null : document.body;
}

/** Redirects the portalled Menu panels below it into a specific container element */
const MenuPortal = ({ children, container }: MenuPortalProps) => {
  return <MenuPortalContext.Provider value={container ?? null}>{children}</MenuPortalContext.Provider>;
};
MenuPortal.displayName = "Menu.Portal";

const Menu = ({
  children,
  type = "context-menu",
  selectionMode = "none",
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  onOpenChange,
  open,
  defaultOpen,
}: MenuProps) => {
  const [isOpen, setOpenState] = useControlledState(open, defaultOpen, false);
  const [selectedKeys, setSelectedKeys] = useControlledState(
    controlledSelectedKeys,
    defaultSelectedKeys,
    EMPTY_KEYS,
  );
  const [radioGroups, setRadioGroups] = React.useState<Map<string, Key | null>>(new Map());

  const nav = useListNavigation({ isOpen });
  const itemExtrasRef = React.useRef<Map<Key, MenuItemExtras>>(new Map());
  const mouseMoveDetectedRef = React.useRef(true);
  const clickPositionRef = React.useRef({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const isOpenRef = React.useRef(isOpen);
  isOpenRef.current = isOpen;

  const setIsOpen = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (value) => {
      const next = typeof value === "function" ? value(isOpenRef.current) : value;
      if (next === isOpenRef.current) return;
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange, setOpenState],
  );

  const registerItem = React.useCallback(
    (
      key: Key,
      textValue: string,
      isDisabled?: boolean,
      onSelect?: () => void,
      isSubmenuTrigger?: boolean,
    ) => {
      nav.registerItem(key, textValue, isDisabled);
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

  const handleSelectionChange = React.useCallback(
    (keys: Set<Key>) => {
      setSelectedKeys(keys);
      onSelectionChange?.(keys);
    },
    [onSelectionChange, setSelectedKeys],
  );

  const toggleSelection = React.useCallback(
    (key: Key) => {
      if (selectionMode === "none") return;
      const newKeys = new Set(selectedKeys);
      if (selectionMode === "single") {
        newKeys.clear();
        newKeys.add(key);
      } else if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      handleSelectionChange(newKeys);
    },
    [selectedKeys, selectionMode, handleSelectionChange],
  );

  const close = React.useCallback(() => {
    setIsOpen(false);
    nav.setFocusedKey(null);
  }, [setIsOpen, nav.setFocusedKey]);

  const selectFocusedItem = React.useCallback(() => {
    if (nav.focusedKey === null) return;
    const item = nav.items.find((i) => i.key === nav.focusedKey);
    if (item?.isDisabled) return;
    const extras = itemExtrasRef.current.get(nav.focusedKey);
    extras?.onSelect?.();
  }, [nav.focusedKey, nav.items]);

  const isFocusedItemSubmenu = React.useCallback(() => {
    if (nav.focusedKey === null) return false;
    const extras = itemExtrasRef.current.get(nav.focusedKey);
    return extras?.isSubmenuTrigger ?? false;
  }, [nav.focusedKey]);

  const setRadioGroupValue = React.useCallback((groupName: string, value: Key | null) => {
    setRadioGroups((prev) => {
      const next = new Map(prev);
      next.set(groupName, value);
      return next;
    });
  }, []);

  const getRadioGroupValue = React.useCallback(
    (groupName: string) => {
      return radioGroups.get(groupName) ?? null;
    },
    [radioGroups],
  );

  const contextValue = React.useMemo(
    () =>
      ({
        isOpen,
        setIsOpen,
        type,
        close,
        selectionMode,
        selectedKeys,
        toggleSelection,
        items: nav.items,
        registerItem,
        unregisterItem,
        focusedKey: nav.focusedKey,
        setFocusedKey: nav.setFocusedKey,
        navigateToNextItem: nav.navigateToNextItem,
        navigateToPrevItem: nav.navigateToPrevItem,
        selectFocusedItem,
        isFocusedItemSubmenu,
        radioGroups,
        setRadioGroupValue,
        getRadioGroupValue,
        triggerRef,
        mouseMoveDetectedRef,
        clickPositionRef,
      }) satisfies MenuContextValue,
    [
      isOpen,
      setIsOpen,
      type,
      close,
      selectionMode,
      selectedKeys,
      handleSelectionChange,
      toggleSelection,
      nav.items,
      registerItem,
      unregisterItem,
      nav.focusedKey,
      nav.setFocusedKey,
      nav.navigateToNextItem,
      nav.navigateToPrevItem,
      selectFocusedItem,
      isFocusedItemSubmenu,
      radioGroups,
      setRadioGroupValue,
      getRadioGroupValue,
    ],
  );

  return <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>;
};
Menu.displayName = "Menu";

export { Menu, MenuPortal };
