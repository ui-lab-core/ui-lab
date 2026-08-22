"use client";

import * as React from "react";
import { mergeProps } from "@react-aria/utils";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Input, type InputProps } from "../Input";
import { ChevronDown } from "lucide-react";
import styles from "./Select.module.css";
import { useSelectContext } from "./Select";
import { GroupContext } from "../Group/Group.Context";
import groupStyles from "../Group/Group.module.css";
import { handleListKeyDown } from "./Select.shared";
import { infer } from "@/lib/infer";

const SelectTriggerContext = React.createContext<boolean>(false);

/** Side-specific trigger icon styles. */
interface SelectTriggerIconStyles {
  left?: Style;
  right?: Style;
}

export interface SelectTriggerStyleSlots {
  /** Styles the trigger button. */
  root?: Style;
  /** Styles the trigger value section. */
  value?: Style;
  /** Styles both icon wrappers, or individual left and right icon wrappers. */
  icon?: Style | SelectTriggerIconStyles; // Compound slot
  /** Styles the chevron section. */
  iconSection?: Style;
}

export type SelectTriggerStylesProp = StylesProp<SelectTriggerStyleSlots>;

export interface SelectTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "type"
> {
  /** Adds classes to the trigger button.
   * @category Styling */
  className?: string;
  /** Replaces the default ChevronDown icon in the right trigger section.
   * @category Content */
  chevron?: React.ReactNode;
  /** Supplies a prefix icon and/or takes precedence over chevron with a custom right icon.
   * @category Content */
  icon?: { prefix?: React.ReactNode; chevron?: React.ReactNode };
  /** Applies the ghost trigger treatment, which removes the default button background.
   * @category Styling */
  variant?: "ghost";
  /** Styles trigger anatomy: root, value, icon.left, icon.right, and iconSection.
   * @category Styling
   * @typeDoc SelectTriggerStyleSlots */
  styles?: SelectTriggerStylesProp;
}

/** Button that opens and closes the Select dropdown */
const resolveSelectTriggerBaseStyles = createStylesResolver([
  "root",
  "value",
  "icon.left",
  "icon.right",
  "iconSection",
] as const);

function resolveSelectTriggerStyles(styles: SelectTriggerStylesProp | undefined) {
  if (!styles) return resolveSelectTriggerBaseStyles(styles);

  const { root, value, icon, iconSection } = styles;
  let iconLeft: Style | undefined;
  let iconRight: Style | undefined;

  if (icon) {
    if (typeof icon === "string" || Array.isArray(icon)) {
      iconLeft = icon;
      iconRight = icon;
    } else {
      iconLeft = icon.left;
      iconRight = icon.right;
    }
  }

  return resolveSelectTriggerBaseStyles({
    root,
    value,
    "icon.left": iconLeft,
    "icon.right": iconRight,
    iconSection,
  });
}

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
      <span className={styles.text}>{children}</span>
    ) : (
      children
    );

    return (
      <SelectTriggerContext.Provider value={true}>
        <button
          ref={mergedRef}
          role="button"
          className={cn(
            "select",
            "trigger",
            styles.trigger,
            isSplitTrigger && styles["trigger-compact"],
            groupContext ? (groupStyles as Record<string, string>).trigger : undefined,
            className,
            resolved.root,
          )}
          type="button"
          data-variant={variant}
          data-open={isOpen ? "true" : "false"}
          data-pressed={isPressed ? "true" : "false"}
          data-hovered={isHovered ? "true" : "false"}
          data-focused={isFocused ? "true" : "false"}
          data-focus-visible={isFocusVisible ? "true" : "false"}
          data-disabled={isDisabled ? "true" : undefined}
          {...mergedTriggerProps}
        >
          <div className={cn(styles["value-section"], resolved.value)} data-slot="value">
            {icon?.prefix && (
              <span className={cn(styles["icon-prefix"], resolved["icon.left"])} data-slot="icon.left">{icon.prefix}</span>
            )}
            {mode === "multiple" && children === undefined ? (
              <span className={cn("placeholder", styles.placeholder)}>
                {selectedKeys && selectedKeys.size > 0
                  ? `${selectedKeys.size} selected`
                  : "Select items..."}
              </span>
            ) : (
              content
            )}
          </div>
          {resolvedChevron !== null && (
            <div className={cn(styles["icon-section"], resolved.iconSection)} data-slot="iconSection">
              <div className={cn(styles.icon, resolved["icon.right"])} data-slot="icon.right">{resolvedChevron}</div>
            </div>
          )}
        </button>
      </SelectTriggerContext.Provider>
    );
  },
);
SelectTrigger.displayName = "Select.Trigger";

export interface SearchableTriggerStyleSlots {
  root?: Style;
  valueSection?: Style;
  input?: Style;
  iconSection?: Style;
  icon?: Style;
}

export type SearchableTriggerStylesProp = StylesProp<SearchableTriggerStyleSlots>;

export interface SearchableTriggerProps extends Omit<InputProps, "value" | "onChange" | "styles"> {
  /** Styles searchable trigger anatomy: root, valueSection, input, iconSection, and icon.
   * @category Styling
   * @typeDoc SearchableTriggerStyleSlots */
  styles?: SearchableTriggerStylesProp;
}

const resolveSearchableTriggerBaseStyles = createStylesResolver([
  "root",
  "valueSection",
  "input",
  "iconSection",
  "icon",
] as const);

function resolveSearchableTriggerStyles(styles: SearchableTriggerStylesProp | undefined) {
  if (!styles) return resolveSearchableTriggerBaseStyles(styles);
  const { root, valueSection, input, iconSection, icon } = styles;
  return resolveSearchableTriggerBaseStyles({ root, valueSection, input, iconSection, icon });
}

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
          styles.trigger,
          styles["search-trigger"],
          className,
          resolved.root,
        )}
        data-slot="trigger"
        data-open={isOpen ? "true" : undefined}
        data-disabled={isDisabled || undefined}
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
          className={cn(
            styles["value-section"],
            styles["search-value-section"],
            resolved.valueSection,
          )}
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
            className={cn("input", styles["input"], resolved.input)}
            {...props}
          />
        </div>
        <div className={cn(styles["search-icon-section"], resolved.iconSection)}>
          <div className={cn(styles.icon, resolved.icon)}>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    );
  },
);
SearchableTrigger.displayName = "Select.SearchableTrigger";

export { SelectTrigger, SearchableTrigger };
