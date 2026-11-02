"use client";

import * as React from "react";
import { type Key } from "@react-types/shared";
import { Check } from "lucide-react";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Select.module.css";
import { useSelectContext, type SelectItemData } from "./Select";
import { List } from "../List";

/**
 * Named style slots for the Select.Group anatomy.
 * @typeDoc SelectGroupStyleSlots
 */
export interface SelectGroupStyleSlots {
  /** Styles the group wrapper. */
  root?: Style;

  /** Styles the optional visible title above the grouped options. */
  title?: Style;
}

/**
 * Class-based style overrides for Select.Group's root and named anatomy slots.
 * @typeDoc SelectGroupStylesProp
 */
export type SelectGroupStylesProp = StylesProp<SelectGroupStyleSlots>;

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Renders a visible title above the grouped options.
   * @category Content
   */
  title?: string;

  /**
   * Adds classes to the group wrapper before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Styles group anatomy: root and title.
   * @category Styling
   * @typeDoc SelectGroupStyleSlots
   */
  styles?: SelectGroupStylesProp;
}

const resolveSelectGroupStyles = createStylesResolver(["root", "title"] as const);

/** Named grouping of related items with an optional visible title label */
const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ children, title, className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveSelectGroupStyles(stylesProp);
    return (
      <div ref={ref} className={cn(className, resolved.root)} data-slot="root" {...domProps}>
        {title && (
          <div className={cn(css["option-group-title"], resolved.title)} data-slot="title">
            {title}
          </div>
        )}
        {children}
      </div>
    );
  },
);
SelectGroup.displayName = "Select.Group";

/**
 * Named style slots for the Select.Value anatomy.
 * @typeDoc SelectValueStyleSlots
 */
export interface SelectValueStyleSlots {
  /** Styles the value wrapper. */
  root?: Style;

  /** Styles the icon wrapper rendered before the value text. */
  icon?: Style;

  /** Styles the rendered value text. */
  text?: Style;
}

/**
 * Class-based style overrides for Select.Value's root and named anatomy slots.
 * @typeDoc SelectValueStylesProp
 */
export type SelectValueStylesProp = StylesProp<SelectValueStyleSlots>;

/**
 * Renders the value content, optionally from the currently selected registered item.
 * @typeDoc SelectValueChildren
 */
export type SelectValueChildren =
  | ((selectedItem: SelectItemData | null) => React.ReactNode)
  | React.ReactNode;

export interface SelectValueProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Text rendered when neither a selected item nor a root label supplies value text.
   * @category Content
   * @default "Select an option"
   */
  placeholder?: string;

  /**
   * Adds classes to the value wrapper before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Renders icon content before the value text.
   * @category Content
   */
  icon?: React.ReactNode;

  /**
   * Renders static value content, or receives the selected registered item and returns content.
   * Either form takes precedence over the default selected text.
   * @category Content
   * @typeDoc SelectValueChildren
   */
  children?: SelectValueChildren;

  /**
   * Styles value anatomy: root, icon, and text.
   * @category Styling
   * @typeDoc SelectValueStyleSlots
   */
  styles?: SelectValueStylesProp;
}

const resolveSelectValueStyles = createStylesResolver(["root", "icon", "text"] as const);

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
        className={cn("value", css.value, className, resolved.root)}
        data-slot="root"
        data-external={hasExternalValue ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        {...domProps}
      >
        {icon && (
          <span className={cn(css["value-icon"], resolved.icon)} data-slot="icon">
            {icon}
          </span>
        )}
        <span
          className={cn(css["value-text"], resolved.text)}
          data-slot="text"
          data-select-trigger-text
        >
          {renderText()}
        </span>
      </div>
    );
  },
);
SelectValue.displayName = "Select.Value";

/**
 * Named style slots for the Select.Item anatomy.
 * @typeDoc SelectItemStyleSlots
 */
export interface SelectItemStyleSlots {
  /** Styles the option row. */
  root?: Style;

  /** Styles the leading icon wrapper. */
  icon?: Style;

  /** Styles the wrapper that stacks the label above a description. */
  content?: Style;

  /** Styles the primary option text. */
  text?: Style;

  /** Styles the secondary description text. */
  description?: Style;

  /** Styles the trailing checkmark shown for the selected option. */
  indicator?: Style;
}

/**
 * Class-based style overrides for Select.Item's root and named anatomy slots.
 * @typeDoc SelectItemStylesProp
 */
export type SelectItemStylesProp = StylesProp<SelectItemStyleSlots>;

export interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  /**
   * Stable option key used for selection, keyboard focus, and registered item lookup.
   * @category Core
   */
  value: Key;

  /**
   * Supplies searchable and selected text when children cannot be converted to a useful string.
   * @category Accessibility
   */
  textValue?: string;

  /**
   * Prevents pointer selection and keyboard focus for this option.
   * @category Core
   * @default false
   */
  disabled?: boolean;

  /**
   * Adds classes to the option row before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Renders icon content before the option label.
   * @category Content
   */
  icon?: React.ReactNode;

  /**
   * Renders secondary content below the option label and adds the content anatomy wrapper.
   * @category Content
   */
  description?: React.ReactNode;

  /**
   * Styles item anatomy: root, icon, content, text, description, and indicator.
   * @category Styling
   * @typeDoc SelectItemStyleSlots
   */
  styles?: SelectItemStylesProp;
}

const resolveSelectItemStyles = createStylesResolver([
  "root",
  "icon",
  "content",
  "text",
  "description",
  "indicator",
] as const);

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
      triggerPressOriginRef,
      visibleKeys,
    } = useSelectContext();
    const finalTextValue = textValue || String(children);
    const hasDescription = !!description;
    const isHighlighted = focusedKey === value;
    const isSelected = mode === "multiple" ? !!selectedKeys?.has(value) : selectedKey === value;
    // Items hide themselves instead of unmounting so they stay registered in useItemNavigation.
    // Unmounting via .filter() caused unregisterItem → items lost → backspace couldn't restore them.
    const isVisible = visibleKeys.has(value);

    // useLayoutEffect (not useEffect) so registration lands before paint — otherwise the first
    // frame renders with no items registered yet, and visibleKeys can't reflect the active filter.
    React.useLayoutEffect(() => {
      registerItem(value, finalTextValue, isDisabled);
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
        selected={isSelected}
        className={cn(
          "item",
          css.item,
          mode === "multiple" && css["item-multiple"],
          hasDescription && css["item-with-description"],
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
          const pressOrigin = triggerPressOriginRef.current;
          triggerPressOriginRef.current = null;
          if (
            pressOrigin &&
            Math.hypot(event.clientX - pressOrigin.x, event.clientY - pressOrigin.y) < 4
          ) {
            return;
          }
          handleClick();
        }}
        onMouseEnter={(event) => {
          domProps.onMouseEnter?.(event);
          if (event.defaultPrevented) return;
          if (isDisabled) return;
          mouseMoveDetectedRef.current = true;
          setFocusedKey(value);
        }}
        data-disabled={isDisabled ? "true" : undefined}
        aria-disabled={isDisabled || undefined}
        data-highlighted={isHighlighted ? "true" : "false"}
        data-focused={isHighlighted ? "true" : "false"}
        style={!isVisible ? { display: "none" } : undefined}
        aria-hidden={!isVisible || undefined}
      >
        {mode === "multiple" && (
          <List.Checkbox
            checked={isSelected}
            placement="start"
            tabIndex={-1}
            aria-label={`${isSelected ? "Deselect" : "Select"} ${finalTextValue}`}
            onChange={handleClick}
          />
        )}
        {icon && (
          <span
            className={cn(
              css["item-icon"],
              hasDescription && css["item-icon-with-description"],
              resolved.icon,
            )}
            data-slot="icon"
          >
            {icon}
          </span>
        )}
        {hasDescription ? (
          <div className={cn(css["item-content"], resolved.content)} data-slot="content">
            <span
              className={cn(css["item-text"], resolved.text)}
              data-slot="text"
              data-select-item-text
            >
              {children}
            </span>
            <span
              className={cn(css["item-description"], resolved.description)}
              data-slot="description"
            >
              {description}
            </span>
          </div>
        ) : (
          <span
            className={cn(css["item-text"], resolved.text)}
            data-slot="text"
            data-select-item-text
          >
            {children}
          </span>
        )}
        {mode === "single" && (
          <span
            className={cn(css["item-indicator"], resolved.indicator)}
            data-slot="indicator"
            aria-hidden="true"
          >
            {isSelected && <Check />}
          </span>
        )}
      </List.Item>
    );
  },
);
SelectItem.displayName = "Select.Item";

/**
 * Named style slots for the Select.List anatomy.
 * @typeDoc SelectListStyleSlots
 */
export interface SelectListStyleSlots {
  /** Styles the list wrapper. */
  root?: Style;
}

/**
 * Class-based style override for Select.List's root slot.
 * @typeDoc SelectListStylesProp
 */
export type SelectListStylesProp = StylesProp<SelectListStyleSlots>;

export interface SelectListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Adds classes to the list wrapper before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Styles the list root.
   * @category Styling
   * @typeDoc SelectListStyleSlots
   */
  styles?: SelectListStylesProp;
}

const resolveSelectListStyles = createStylesResolver(["root"] as const);

/** Wrapper for a collection of SelectItem components */
const SelectList = React.forwardRef<HTMLDivElement, SelectListProps>(
  ({ children, className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveSelectListStyles(stylesProp);
    return (
      <div
        ref={ref}
        className={cn("list", css.list, className, resolved.root)}
        data-slot="root"
        {...domProps}
      >
        {children}
      </div>
    );
  },
);
SelectList.displayName = "Select.List";

export { SelectGroup, SelectValue, SelectItem, SelectList };
