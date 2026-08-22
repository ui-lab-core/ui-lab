"use client";

import * as React from "react";
import { type Key } from "@react-types/shared";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import styles from "./Select.module.css";
import { useSelectContext, type SelectItemData } from "./Select";
import { List } from "../List";

export interface SelectGroupStyleSlots {
  /** Styles the group wrapper. */
  root?: Style;
  /** Styles the optional visible title. */
  title?: Style;
}

export type SelectGroupStylesProp = StylesProp<SelectGroupStyleSlots>;

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  key?: string;
  /** Renders a visible title above the grouped options.
   * @category Content */
  title?: string;
  /** Adds classes to the group wrapper.
   * @category Styling */
  className?: string;
  /** Styles group anatomy: root and title.
   * @category Styling
   * @typeDoc SelectGroupStyleSlots */
  styles?: SelectGroupStylesProp;
}

const resolveSelectGroupBaseStyles = createStylesResolver(["root", "title"] as const);

function resolveSelectGroupStyles(styles: SelectGroupStylesProp | undefined) {
  if (!styles) return resolveSelectGroupBaseStyles(styles);
  const { root, title } = styles;
  return resolveSelectGroupBaseStyles({ root, title });
}

/** Named grouping of related items with an optional visible title label */
const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ children, title, className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveSelectGroupStyles(stylesProp);
    return (
      <div ref={ref} className={cn(className, resolved.root)} data-slot="root" {...domProps}>
        {title && (
          <div className={cn("px-2 py-1 text-sm font-medium text-foreground-400", resolved.title)}>
            {title}
          </div>
        )}
        {children}
      </div>
    );
  },
);
SelectGroup.displayName = "Select.Group";

export interface SelectValueStyleSlots {
  /** Styles the value wrapper. */
  root?: Style;
  /** Styles the value icon wrapper. */
  icon?: Style;
  /** Styles the rendered value text. */
  text?: Style;
}

export type SelectValueStylesProp = StylesProp<SelectValueStyleSlots>;

export interface SelectValueProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Text rendered when no selected item or fallback root label is available.
   * @category Content
   * @default "Select an option" */
  placeholder?: string;
  /** Adds classes to the value wrapper.
   * @category Styling */
  className?: string;
  /** Renders icon content before the selected value text.
   * @category Content */
  icon?: React.ReactNode;
  /** Renders static value content or receives the selected registered item; it takes precedence over the default text.
   * @category Content */
  children?: ((selectedItem: SelectItemData | null) => React.ReactNode) | React.ReactNode;
  /** Styles value anatomy: root, icon, and text.
   * @category Styling
   * @typeDoc SelectValueStyleSlots */
  styles?: SelectValueStylesProp;
}

const resolveSelectValueBaseStyles = createStylesResolver(["root", "icon", "text"] as const);

function resolveSelectValueStyles(styles: SelectValueStylesProp | undefined) {
  if (!styles) return resolveSelectValueBaseStyles(styles);
  const { root, icon, text } = styles;
  return resolveSelectValueBaseStyles({ root, icon, text });
}

/** Renders the selected item's label inside the trigger */
const SelectValue = React.forwardRef<HTMLDivElement, SelectValueProps>(
  (
    {
      placeholder = "Select an option",
      className,
      icon,
      children,
      styles: stylesProp,
      ...domProps
    },
    ref,
  ) => {
    const { selectedTextValue, selectedKey, items, hasExternalValue, isDisabled } =
      useSelectContext();

    const selectedItem = items.find((item) => item.key === selectedKey);
    const resolved = resolveSelectValueStyles(stylesProp);

    const renderText = () => {
      if (typeof children === "function") {
        return (children as (item: SelectItemData | null) => React.ReactNode)(selectedItem || null);
      }
      if (children !== null && children !== undefined) {
        return children;
      }
      return selectedItem?.textValue || selectedTextValue || placeholder;
    };

    return (
      <div
        ref={ref}
        className={cn("value", styles.value, className, resolved.root)}
        data-slot="root"
        data-external={hasExternalValue ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        {...domProps}
      >
        {icon && <span className={cn(styles["value-icon"], resolved.icon)} data-slot="icon">{icon}</span>}
        <span className={cn(styles["value-text"], resolved.text)} data-slot="text">{renderText()}</span>
      </div>
    );
  },
);
SelectValue.displayName = "Select.Value";

export interface SelectItemStyleSlots {
  /** Styles the option element. */
  root?: Style;
  /** Styles the optional leading icon. */
  icon?: Style;
  /** Styles the wrapper used when a description is present. */
  content?: Style;
  /** Styles the primary option text. */
  text?: Style;
  /** Styles secondary descriptive content. */
  description?: Style;
}

export type SelectItemStylesProp = StylesProp<SelectItemStyleSlots>;

export interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  /** Stable option key used for selection, keyboard focus, and registered item lookup.
   * @category Core */
  value: Key;
  /** Supplies searchable and selected text when children cannot be converted to a useful string.
   * @category Accessibility */
  textValue?: string;
  /** Prevents pointer selection and keyboard focus for this option.
   * @category Core
   * @default false */
  disabled?: boolean;
  /** Adds classes to the option element.
   * @category Styling */
  className?: string;
  /** Renders icon content before the item label.
   * @category Content */
  icon?: React.ReactNode;
  /** Renders secondary content below the item label and enables the item.content anatomy slot.
   * @category Content */
  description?: React.ReactNode;
  /** Styles item anatomy: root, icon, content, text, and description.
   * @category Styling
   * @typeDoc SelectItemStyleSlots */
  styles?: SelectItemStylesProp;
}

const resolveSelectItemBaseStyles = createStylesResolver([
  "root",
  "icon",
  "content",
  "text",
  "description",
] as const);

function resolveSelectItemStyles(styles: SelectItemStylesProp | undefined) {
  if (!styles) return resolveSelectItemBaseStyles(styles);
  const { root, icon, content, text, description } = styles;
  return resolveSelectItemBaseStyles({ root, icon, content, text, description });
}

/** A single selectable option in the dropdown list */
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  (
    {
      children,
      value,
      textValue,
      disabled: isDisabled = false,
      className,
      icon,
      description,
      styles: stylesProp,
      ...domProps
    },
    ref,
  ) => {
    const {
      mode,
      onSelect,
      onToggle,
      selectedKey,
      selectedKeys,
      registerItem,
      unregisterItem,
      focusedKey,
      setFocusedKey,
      mouseMoveDetectedRef,
      triggerMouseDownRef,
      visibleKeys,
    } = useSelectContext();
    const finalTextValue = textValue || String(children);
    const hasDescription = !!description;
    const isHighlighted = focusedKey === value;
    const isSelected = mode === "multiple" ? selectedKeys?.has(value) : selectedKey === value;
    const [isRegistered, setIsRegistered] = React.useState(false);
    // Items hide themselves instead of unmounting so they stay registered in useListNavigation.
    // Unmounting via .filter() caused unregisterItem → items lost → backspace couldn't restore them.
    const isVisible = !isRegistered || visibleKeys.has(value);

    React.useEffect(() => {
      registerItem(value, finalTextValue, isDisabled);
      setIsRegistered(true);
      return () => unregisterItem(value);
    }, [value, finalTextValue, isDisabled, registerItem, unregisterItem]);

    const handleClick = () => {
      if (!isDisabled) {
        if (mode === "multiple") {
          onToggle?.(value);
        } else {
          onSelect(value);
        }
      }
    };

    const resolved = resolveSelectItemStyles(stylesProp);

    return (
      <List.Item
        ref={ref}
        {...domProps}
        focusable={false}
        tabIndex={-1}
        value={String(value)}
        role="option"
        aria-selected={isSelected}
        className={cn(
          "item",
          styles.item,
          hasDescription && styles["item-with-description"],
          className,
          resolved.root,
        )}
        onClick={(event) => {
          domProps.onClick?.(event);
          if (!event.defaultPrevented) handleClick();
        }}
        onMouseUp={(event) => {
          domProps.onMouseUp?.(event);
          if (event.defaultPrevented) return;
          // Native Select behavior: a press that starts on the trigger may be
          // dragged into the open list and committed by releasing over an item.
          if (!triggerMouseDownRef.current) return;
          triggerMouseDownRef.current = false;
          handleClick();
        }}
        onMouseEnter={(event) => {
          domProps.onMouseEnter?.(event);
          if (event.defaultPrevented) return;
          if (isDisabled) return;
          mouseMoveDetectedRef.current = true;
          setFocusedKey(value);
        }}
        data-disabled={isDisabled || undefined}
        data-selected={isSelected ? "true" : "false"}
        data-slot="item"
        aria-disabled={isDisabled || undefined}
        data-highlighted={isHighlighted ? "true" : "false"}
        data-focused={isHighlighted ? "true" : "false"}
        style={!isVisible ? { display: "none" } : undefined}
        aria-hidden={!isVisible || undefined}
      >
        {mode === "multiple" && (
          <List.Checkbox
            checked={isSelected}
            tabIndex={-1}
            aria-label={`${isSelected ? "Deselect" : "Select"} ${finalTextValue}`}
            onChange={handleClick}
          />
        )}
        {icon && (
          <span
            className={cn(
              styles["item-icon"],
              hasDescription && styles["item-icon-with-description"],
              resolved.icon,
            )}
          >
            {icon}
          </span>
        )}
        {hasDescription ? (
          <div className={cn(styles["item-content"], resolved.content)} data-slot="content">
            <span className={cn(styles["item-text"], resolved.text)}>{children}</span>
            <span className={cn(styles["item-description"], resolved.description)}>
              {description}
            </span>
          </div>
        ) : (
          <span className={cn(styles["item-text"], resolved.text)}>{children}</span>
        )}
      </List.Item>
    );
  },
);
SelectItem.displayName = "Select.Item";

export interface SelectListStyleSlots {
  /** Styles the list wrapper. */
  root?: Style;
}

export type SelectListStylesProp = StylesProp<SelectListStyleSlots>;

export interface SelectListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds classes to the list wrapper.
   * @category Styling */
  className?: string;
  /** Reserved list-level filter callback. Filtering is currently controlled by the Select root.
   * @category Advanced */
  filter?: (item: any) => boolean;
  /** Styles the list root.
   * @category Styling
   * @typeDoc SelectListStyleSlots */
  styles?: SelectListStylesProp;
}

const resolveSelectListBaseStyles = createStylesResolver(["root"] as const);

function resolveSelectListStyles(styles: SelectListStylesProp | undefined) {
  if (!styles) return resolveSelectListBaseStyles(styles);
  const { root } = styles;
  return resolveSelectListBaseStyles({ root });
}

/** Wrapper for a collection of SelectItem components */
const SelectList = React.forwardRef<HTMLDivElement, SelectListProps>(
  ({ children, className, filter, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveSelectListStyles(stylesProp);
    return (
      <div ref={ref} className={cn("list", styles.list, className, resolved.root)} data-slot="root" {...domProps}>
        {children}
      </div>
    );
  },
);
SelectList.displayName = "Select.List";

export { SelectGroup, SelectValue, SelectItem, SelectList };
