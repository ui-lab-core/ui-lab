"use client";

import * as React from "react";
import { Check, Circle } from "lucide-react";
import { useMenuContext, useMenuSubmenuContext, useRadioGroupContext } from "./Menu";
import type {
  MenuItemProps,
  MenuCheckboxItemProps,
  MenuRadioItemProps,
} from "./menu.types";
import css from "./Menu.module.css";
import { cn } from "@/lib/utils";
import {
  resolveMenuItemStyles,
  resolveMenuCheckboxItemStyles,
  resolveMenuRadioItemStyles,
} from "./menu.styles";
import { List } from "../List";

/** A clickable action item that closes the menu on selection */
const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      children,
      id,
      disabled = false,
      onSelect,
      textValue,
      inset,
      className,
      styles: stylesProp,
      onMouseEnter,
      onClick,
      ...domProps
    },
    ref,
  ) => {
    const parentContext = useMenuContext();
    const submenuContext = useMenuSubmenuContext();
    const isInSubmenu = submenuContext?.isOpen ?? false;
    const ctx = isInSubmenu && submenuContext ? submenuContext : parentContext;
    const { registerItem, unregisterItem, setFocusedKey, focusedKey } = ctx;
    const mouseMoveRef =
      isInSubmenu && submenuContext
        ? submenuContext.mouseMoveDetectedRef
        : parentContext.mouseMoveDetectedRef;
    const { selectionMode, selectedKeys, toggleSelection } = parentContext;

    const autoId = React.useId();
    const key = id ?? autoId;
    const finalTextValue = textValue ?? "";
    const close = parentContext.close;
    const isHighlighted = focusedKey === key;
    const isSelectable = selectionMode !== "none";
    const isSelected = isSelectable && selectedKeys.has(key);

    const handleSelectRef = React.useRef<() => void>(null);
    handleSelectRef.current = () => {
      if (disabled) return;
      if (isSelectable) toggleSelection(key);
      onSelect?.();
      // Multiple selection keeps the panel open so several items can be toggled in one pass.
      if (selectionMode !== "multiple") close();
    };

    React.useEffect(() => {
      registerItem(key, finalTextValue, disabled, () => handleSelectRef.current?.());
      return () => unregisterItem(key);
    }, [key, finalTextValue, disabled, registerItem, unregisterItem]);

    const resolved = resolveMenuItemStyles(stylesProp);
    const role =
      selectionMode === "single"
        ? "menuitemradio"
        : selectionMode === "multiple"
          ? "menuitemcheckbox"
          : "menuitem";

    return (
      <List.Item
        {...domProps}
        ref={ref}
        focusable={false}
        value={String(key)}
        role={role}
        tabIndex={-1}
        aria-checked={isSelectable ? isSelected : undefined}
        aria-disabled={disabled || undefined}
        className={cn(css.item, className, resolved.root)}
        data-highlighted={isHighlighted ? "true" : "false"}
        data-focused={isHighlighted ? "true" : "false"}
        data-disabled={disabled ? "true" : undefined}
        data-inset={inset ? "true" : undefined}
        data-selected={isSelected ? "true" : undefined}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          if (!disabled) {
            setFocusedKey(key);
            mouseMoveRef.current = true;
          }
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) handleSelectRef.current?.();
        }}
      >
        {isSelectable && (
          <span
            className={cn("indicator", css.indicator, resolved.indicator)}
            data-slot="indicator"
            aria-hidden="true"
          >
            {isSelected &&
              (selectionMode === "single" ? (
                <Circle className={css["indicator-dot"]} />
              ) : (
                <Check className={css["indicator-check"]} />
              ))}
          </span>
        )}
        {children}
      </List.Item>
    );
  },
);
MenuItem.displayName = "Menu.Item";

/** A menu item with a checkmark indicator for toggling a boolean state */
const MenuCheckboxItem = React.forwardRef<HTMLDivElement, MenuCheckboxItemProps>(
  (
    {
      children,
      id,
      checked = false,
      onCheckedChange,
      disabled = false,
      onSelect,
      textValue,
      className,
      styles: stylesProp,
      onMouseEnter,
      onClick,
      ...domProps
    },
    ref,
  ) => {
    const parentContext = useMenuContext();
    const submenuContext = useMenuSubmenuContext();
    const isInSubmenu = submenuContext?.isOpen ?? false;
    const ctx = isInSubmenu && submenuContext ? submenuContext : parentContext;
    const { registerItem, unregisterItem, setFocusedKey, focusedKey } = ctx;
    const mouseMoveRef =
      isInSubmenu && submenuContext
        ? submenuContext.mouseMoveDetectedRef
        : parentContext.mouseMoveDetectedRef;

    const autoId = React.useId();
    const key = id ?? autoId;
    const finalTextValue = textValue ?? "";
    const close = parentContext.close;
    const isHighlighted = focusedKey === key;

    const handleSelectRef = React.useRef<() => void>(null);
    handleSelectRef.current = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
      onSelect?.();
      close();
    };

    React.useEffect(() => {
      registerItem(key, finalTextValue, disabled, () => handleSelectRef.current?.());
      return () => unregisterItem(key);
    }, [key, finalTextValue, disabled, registerItem, unregisterItem]);

    const resolved = resolveMenuCheckboxItemStyles(stylesProp);

    return (
      <List.Item
        {...domProps}
        ref={ref}
        focusable={false}
        value={String(key)}
        role="menuitemcheckbox"
        tabIndex={-1}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        className={cn("checkbox-item", css.item, className, resolved.root)}
        data-highlighted={isHighlighted ? "true" : "false"}
        data-focused={isHighlighted ? "true" : "false"}
        data-disabled={disabled ? "true" : undefined}
        data-state={checked ? "checked" : "unchecked"}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          if (!disabled) {
            setFocusedKey(key);
            mouseMoveRef.current = true;
          }
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) handleSelectRef.current?.();
        }}
      >
        <span
          className={cn("indicator", css.indicator, resolved.indicator)}
          data-slot="indicator"
          aria-hidden="true"
        >
          {checked && <Check className={css["indicator-check"]} />}
        </span>
        {children}
      </List.Item>
    );
  },
);
MenuCheckboxItem.displayName = "Menu.CheckboxItem";

/** A mutually exclusive option within a Menu.RadioGroup */
const MenuRadioItem = React.forwardRef<HTMLDivElement, MenuRadioItemProps>(
  (
    {
      children,
      id,
      value,
      disabled = false,
      onSelect,
      textValue,
      className,
      styles: stylesProp,
      onMouseEnter,
      onClick,
      ...domProps
    },
    ref,
  ) => {
    const parentContext = useMenuContext();
    const submenuContext = useMenuSubmenuContext();
    const isInSubmenu = submenuContext?.isOpen ?? false;
    const ctx = isInSubmenu && submenuContext ? submenuContext : parentContext;
    const { registerItem, unregisterItem, setFocusedKey, focusedKey } = ctx;
    const mouseMoveRef =
      isInSubmenu && submenuContext
        ? submenuContext.mouseMoveDetectedRef
        : parentContext.mouseMoveDetectedRef;
    const radioGroupContext = useRadioGroupContext();

    const isSelected = radioGroupContext?.value === value;
    const autoId = React.useId();
    const key = id ?? autoId;
    const finalTextValue = textValue ?? "";
    const close = parentContext.close;
    const isHighlighted = focusedKey === key;

    const handleSelectRef = React.useRef<() => void>(null);
    handleSelectRef.current = () => {
      if (disabled) return;
      radioGroupContext?.onValueChange(value);
      onSelect?.();
      close();
    };

    React.useEffect(() => {
      registerItem(key, finalTextValue, disabled, () => handleSelectRef.current?.());
      return () => unregisterItem(key);
    }, [key, finalTextValue, disabled, registerItem, unregisterItem]);

    const resolved = resolveMenuRadioItemStyles(stylesProp);

    return (
      <List.Item
        {...domProps}
        ref={ref}
        focusable={false}
        value={String(key)}
        role="menuitemradio"
        tabIndex={-1}
        aria-checked={isSelected}
        aria-disabled={disabled || undefined}
        className={cn("radio-item", css.item, className, resolved.root)}
        data-highlighted={isHighlighted ? "true" : "false"}
        data-focused={isHighlighted ? "true" : "false"}
        data-disabled={disabled ? "true" : undefined}
        data-state={isSelected ? "checked" : "unchecked"}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          if (!disabled) {
            setFocusedKey(key);
            mouseMoveRef.current = true;
          }
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) handleSelectRef.current?.();
        }}
      >
        <span
          className={cn("indicator", css.indicator, resolved.indicator)}
          data-slot="indicator"
          aria-hidden="true"
        >
          {isSelected && <Circle className={css["indicator-dot"]} />}
        </span>
        {children}
      </List.Item>
    );
  },
);
MenuRadioItem.displayName = "Menu.RadioItem";

export { MenuItem, MenuCheckboxItem, MenuRadioItem };
