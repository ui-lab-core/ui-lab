"use client";

import * as React from "react";
import { mergeProps } from "@react-aria/utils";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Input, type InputProps } from "../Input";
import { ChevronDown } from "lucide-react";
import css from "./Select.module.css";
import { useSelectContext } from "./Select";
import { GroupContext } from "../Group/Group.Context";
import groupCss from "../Group/Group.module.css";
import { handleListKeyDown } from "./Select.shared";
import { infer } from "@/lib/infer";

/**
 * Visual treatment applied to the Select surface by its trigger.
 * @typeDoc SelectTriggerVariant
 */
export type SelectTriggerVariant = "ghost" | (string & {});

/**
 * Icon content rendered at either edge of the trigger.
 * @typeDoc SelectTriggerIconSlots
 */
export interface SelectTriggerIconSlots {
  /** Content rendered before the trigger value, in the icon.left slot. */
  prefix?: React.ReactNode;

  /** Content replacing the default chevron, in the icon.right slot. */
  chevron?: React.ReactNode;
}

/**
 * Styles for the individual trigger icon parts.
 * @typeDoc SelectTriggerIconStyles
 */
export interface SelectTriggerIconStyles {
  /** Styles the prefix icon wrapper rendered before the trigger value. */
  left?: Style;

  /** Styles the chevron wrapper rendered inside the icon section. */
  right?: Style;

  /** Styles the section that holds the trailing chevron. */
  section?: Style;
}

/**
 * Named style slots for the Select.Trigger anatomy.
 * @typeDoc SelectTriggerStyleSlots
 */
export interface SelectTriggerStyleSlots {
  /** Styles the trigger button. */
  root?: Style;

  /** Styles the trigger value section. */
  value?: Style;

  /** Styles every icon part, or individually styles icon.left, icon.right, and icon.section. */
  icon?: Style | SelectTriggerIconStyles;
}

/**
 * Class-based style overrides for Select.Trigger's root and named anatomy slots.
 * @typeDoc SelectTriggerStylesProp
 */
export type SelectTriggerStylesProp = StylesProp<SelectTriggerStyleSlots>;

export interface SelectTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type"> {
  /**
   * Adds classes to the trigger button before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Replaces the default chevron rendered in the icon.right slot. Passing null removes the whole
   * icon section. icon.chevron takes precedence over this prop.
   * @category Content
   */
  chevron?: React.ReactNode;

  /**
   * Supplies the prefix icon and an optional chevron replacement.
   * @category Content
   * @typeDoc SelectTriggerIconSlots
   */
  icon?: SelectTriggerIconSlots;

  /**
   * Publishes a visual treatment on the Select root as both a global class and data-variant, so
   * themes can restyle the whole surface. "ghost" removes the default Select background.
   * @category Core
   * @typeDoc SelectTriggerVariant
   */
  variant?: SelectTriggerVariant;

  /**
   * Styles trigger anatomy: root, value, icon.left, icon.right, and icon.section.
   * @category Styling
   * @typeDoc SelectTriggerStyleSlots
   */
  styles?: SelectTriggerStylesProp;
}

const resolveSelectTriggerStyles = createStylesResolver([
  "root",
  "value",
  "icon.left",
  "icon.right",
  "icon.section",
] as const);

/** Button that opens and closes the Select dropdown */
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, chevron, icon, variant, styles: stylesProp, ...domProps }, ref) => {
    const groupContext = React.useContext(GroupContext);
    const {
      triggerProps,
      triggerRef,
      mode,
      selectedKeys,
      hasExternalValue,
      isOpen,
      isPressed,
      isHovered,
      isFocused,
      isFocusVisible,
      isDisabled,
    } = useSelectContext();
    const setTriggerRef = React.useCallback(
      (element: HTMLButtonElement | null) => {
        triggerRef.current = element;
      },
      [triggerRef],
    );
    const mergedRef = useMergeRefs<HTMLButtonElement>(setTriggerRef, ref);
    const isSplitTrigger = hasExternalValue && children === undefined && mode === "single";

    const resolvedChevron =
      icon?.chevron !== undefined ? (
        icon.chevron
      ) : chevron !== undefined ? (
        chevron
      ) : (
        <ChevronDown size={14} />
      );
    const resolved = resolveSelectTriggerStyles(stylesProp);
    const mergedTriggerProps = mergeProps(domProps, triggerProps);
    const content = infer("text", children) ? (
      <span className={css.text}>{children}</span>
    ) : (
      children
    );

    return (
      <button
        ref={mergedRef}
        className={cn(
          "select",
          "trigger",
          css.trigger,
          isSplitTrigger && css["trigger-compact"],
          groupContext ? (groupCss as Record<string, string>).trigger : undefined,
          className,
          resolved.root,
        )}
        type="button"
        data-slot="root"
        data-open={isOpen ? "true" : "false"}
        data-pressed={isPressed ? "true" : "false"}
        data-hovered={isHovered ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        data-disabled={isDisabled ? "true" : undefined}
        {...mergedTriggerProps}
      >
        <div className={cn(css["value-section"], resolved.value)} data-slot="value">
          {icon?.prefix && (
            <span className={cn(css["icon-prefix"], resolved["icon.left"])} data-slot="icon.left">
              {icon.prefix}
            </span>
          )}
          {mode === "multiple" && children === undefined ? (
            <span className={cn("placeholder", css.placeholder)}>
              {selectedKeys && selectedKeys.size > 0
                ? `${selectedKeys.size} selected`
                : "Select items..."}
            </span>
          ) : (
            content
          )}
        </div>
        {resolvedChevron !== null && (
          <div
            className={cn(css["icon-section"], resolved["icon.section"])}
            data-slot="icon.section"
            aria-hidden="true"
          >
            <div className={cn(css.icon, resolved["icon.right"])} data-slot="icon.right">
              {resolvedChevron}
            </div>
          </div>
        )}
      </button>
    );
  },
);
SelectTrigger.displayName = "Select.Trigger";

/**
 * Styles for the individual searchable trigger icon parts.
 * @typeDoc SearchableTriggerIconStyles
 */
export interface SearchableTriggerIconStyles {
  /** Styles the chevron wrapper. */
  right?: Style;

  /** Styles the section that holds the chevron. */
  section?: Style;
}

/**
 * Named style slots for the Select.SearchableTrigger anatomy.
 * @typeDoc SearchableTriggerStyleSlots
 */
export interface SearchableTriggerStyleSlots {
  /** Styles the searchable trigger wrapper. */
  root?: Style;

  /** Styles the section that holds the search input. */
  value?: Style;

  /** Styles the search input surface. */
  input?: Style;

  /** Styles every icon part, or individually styles icon.right and icon.section. */
  icon?: Style | SearchableTriggerIconStyles;
}

/**
 * Class-based style overrides for Select.SearchableTrigger's root and named anatomy slots.
 * @typeDoc SearchableTriggerStylesProp
 */
export type SearchableTriggerStylesProp = StylesProp<SearchableTriggerStyleSlots>;

export interface SearchableTriggerProps extends Omit<InputProps, "value" | "onChange" | "styles"> {
  /**
   * Styles searchable trigger anatomy: root, value, input, icon.right, and icon.section.
   * @category Styling
   * @typeDoc SearchableTriggerStyleSlots
   */
  styles?: SearchableTriggerStylesProp;
}

const resolveSearchableTriggerStyles = createStylesResolver([
  "root",
  "value",
  "input",
  "icon.right",
  "icon.section",
] as const);

/** Combobox-style input that opens the dropdown on focus and filters items as you type */
const SearchableTrigger = React.forwardRef<HTMLInputElement, SearchableTriggerProps>(
  ({ className, placeholder = "Search...", styles: stylesProp, ...props }, ref) => {
    const {
      searchValue,
      setSearchValue,
      isDisabled,
      setIsOpen,
      isOpen,
      contentPlacement,
      contentId,
      triggerRef,
      selectedTextValue,
      navigateToNextItem,
      navigateToPrevItem,
      selectFocusedItem,
      filteredItems,
      setFocusedKey,
      restoreFocus,
      markKeyboardNavigation,
    } = useSelectContext();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isSearchActive, setIsSearchActive] = React.useState(false);
    const setTriggerRef = React.useCallback(
      (element: HTMLInputElement | null) => {
        triggerRef.current = element;
      },
      [triggerRef],
    );
    const mergedRef = useMergeRefs<HTMLInputElement>(inputRef, setTriggerRef, ref);

    React.useEffect(() => {
      if (!isOpen) {
        setIsSearchActive(false);
      }
    }, [isOpen]);

    const displayValue = isOpen && isSearchActive ? searchValue : selectedTextValue || "";
    const resolved = resolveSearchableTriggerStyles(stylesProp);

    const focusInput = React.useCallback(
      (selectValue = false) => {
        const input = inputRef.current;
        if (!input) return;

        input.focus({ preventScroll: true });
        if (selectValue && selectedTextValue && !searchValue) {
          input.select();
        }
      },
      [searchValue, selectedTextValue],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        (e.ctrlKey && (e.key === "Home" || e.key === "End"))
      ) {
        markKeyboardNavigation();
      }
      handleListKeyDown(e, {
        navigateNext: navigateToNextItem,
        navigatePrev: navigateToPrevItem,
        confirm: selectFocusedItem,
        close: () => {
          setIsOpen(false);
          setSearchValue("");
          setIsSearchActive(false);
          restoreFocus();
        },
        filteredItems,
        setFocusedKey,
        requireCtrlForHomeEnd: true,
      });
    };

    const handleClick = () => {
      focusInput(true);
      if (!isOpen) {
        setIsOpen(true);
      }
    };

    return (
      <div
        className={cn(
          "search-trigger",
          css.trigger,
          css["search-trigger"],
          className,
          resolved.root,
        )}
        data-slot="root"
        data-open={isOpen ? "true" : "false"}
        data-disabled={isDisabled ? "true" : undefined}
        data-placement={contentPlacement}
        onMouseDown={(e) => {
          if (e.target !== inputRef.current) {
            e.preventDefault();
            focusInput(true);
            if (!isOpen) {
              setIsOpen(true);
            }
          }
        }}
      >
        <div
          className={cn(css["value-section"], css["search-value-section"], resolved.value)}
          data-slot="value"
        >
          <Input
            ref={mergedRef}
            type="text"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? contentId : undefined}
            aria-autocomplete="list"
            value={displayValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsSearchActive(true);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onFocus={() => {
              if (!isOpen) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={isDisabled}
            variant="ghost"
            className={cn("input", css["input"], resolved.input)}
            {...props}
          />
        </div>
        <div
          className={cn(css["search-icon-section"], resolved["icon.section"])}
          data-slot="icon.section"
          aria-hidden="true"
        >
          <div className={cn(css.icon, resolved["icon.right"])} data-slot="icon.right">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    );
  },
);
SearchableTrigger.displayName = "Select.SearchableTrigger";

export { SelectTrigger, SearchableTrigger };
