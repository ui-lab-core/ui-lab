"use client";

import * as React from "react";
import { useMenuContext, RadioGroupContext } from "./Menu";
import type {
  MenuGroupProps,
  MenuRadioGroupProps,
  MenuLabelProps,
  MenuSeparatorProps,
  MenuShortcutProps,
} from "./menu.types";
import type { Key } from "@react-types/shared";
import css from "./Menu.module.css";
import { cn } from "@/lib/cn";
import {
  resolveMenuGroupStyles,
  resolveMenuRadioGroupStyles,
  resolveMenuLabelStyles,
  resolveMenuSeparatorStyles,
  resolveMenuShortcutStyles,
} from "./menu.styles";

/** Logical grouping container for related menu items */
const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ children, className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveMenuGroupStyles(stylesProp);
    return (
      <div
        {...domProps}
        ref={ref}
        role="group"
        className={cn(css.group, className, resolved.root)}
        data-slot="root"
      >
        {children}
      </div>
    );
  },
);
MenuGroup.displayName = "Menu.Group";

/** Group of mutually exclusive radio items sharing a single selected value */
const MenuRadioGroup = React.forwardRef<HTMLDivElement, MenuRadioGroupProps>(
  ({ children, value, onValueChange, className, styles: stylesProp, ...domProps }, ref) => {
    const groupName = React.useId();
    const { setRadioGroupValue, getRadioGroupValue } = useMenuContext();
    const resolved = resolveMenuRadioGroupStyles(stylesProp);

    const currentValue = value !== undefined ? value : getRadioGroupValue(groupName);

    const handleValueChange = React.useCallback(
      (newValue: Key) => {
        setRadioGroupValue(groupName, newValue);
        onValueChange?.(String(newValue));
      },
      [groupName, setRadioGroupValue, onValueChange],
    );

    const contextValue = React.useMemo(
      () => ({ name: groupName, value: currentValue, onValueChange: handleValueChange }),
      [groupName, currentValue, handleValueChange],
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          {...domProps}
          ref={ref}
          role="group"
          className={cn("radio-group", css.group, className, resolved.root)}
          data-slot="root"
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
MenuRadioGroup.displayName = "Menu.RadioGroup";

/** Non-interactive label for a section of menu items */
const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ children, inset, className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveMenuLabelStyles(stylesProp);
    return (
      <div
        {...domProps}
        ref={ref}
        className={cn("label", css.label, className, resolved.root)}
        data-slot="root"
        data-inset={inset ? "true" : undefined}
      >
        {children}
      </div>
    );
  },
);
MenuLabel.displayName = "Menu.Label";

/** Horizontal rule that visually divides sections of the menu */
const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveMenuSeparatorStyles(stylesProp);
    return (
      <div
        {...domProps}
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn("separator", css.separator, className, resolved.root)}
        data-slot="root"
      />
    );
  },
);
MenuSeparator.displayName = "Menu.Separator";

/** Keyboard shortcut hint aligned to the end of a menu item */
const MenuShortcut = React.forwardRef<HTMLSpanElement, MenuShortcutProps>(
  ({ className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveMenuShortcutStyles(stylesProp);
    return (
      <span
        {...domProps}
        ref={ref}
        className={cn("shortcut", css.shortcut, className, resolved.root)}
        data-slot="root"
      />
    );
  },
);
MenuShortcut.displayName = "Menu.Shortcut";

export { MenuGroup, MenuRadioGroup, MenuLabel, MenuSeparator, MenuShortcut };
