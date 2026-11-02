"use client";

import * as React from "react";
import { mergeProps, useFocusRing, usePress } from "react-aria";
import { useHover, useInteractionModality } from "@react-aria/interactions";
import { cn, type Style } from "@/lib/cn";
import { asElementProps } from "@/lib/react-aria";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import css from "./Tabs.module.css";

/**
 * Alternate visual treatment for the tab list and its selection indicator.
 * The default treatment draws a filled indicator behind the selected tab,
 * while `"underline"` draws a thin bar along the list's edge.
 *
 * @example "underline"
 */
export type TabsVariant = "underline";

/**
 * Layout direction of the tab list, published as `aria-orientation` and
 * `data-orientation` and used to place the selection indicator.
 *
 * @example "vertical"
 */
export type TabsOrientation = "horizontal" | "vertical";

/** Style overrides for the Tabs root and the tab list it owns. */
export interface TabsStyleSlots {
  /** Styles the root element that wraps the tab list and its panels. */
  root?: Style;
  /** Styles the `Tabs.List` element rendered inside this root. */
  list?: Style;
}

/** Style overrides accepted by Tabs. */
export type TabsStylesProp = StylesProp<TabsStyleSlots>;

/** Style overrides for the two elements that render the selection indicator. */
export interface TabsListIndicatorStyleSlots {
  /** Styles the measured indicator that tracks the selected tab after layout. */
  root?: Style;
  /** Styles the placeholder indicator rendered during server rendering and before the first measurement. */
  fallback?: Style;
}

/** Style overrides for the Tabs.List root and the parts it owns. */
export interface TabsListStyleSlots {
  /** Styles the element with `role="tablist"`. */
  root?: Style;
  /** Shared indicator styles, or separate styles for the measured and fallback indicators. */
  indicator?: Style | TabsListIndicatorStyleSlots;
  /** Styles every `Tabs.Trigger` rendered inside this list. */
  trigger?: Style;
}

/** Style overrides accepted by Tabs.List. */
export type TabsListStylesProp = StylesProp<TabsListStyleSlots>;

/** Icon content rendered on either side of a tab label. */
export interface TabsTriggerIconSlots {
  /** Content rendered before the tab label. */
  left?: React.ReactNode;
  /** Content rendered after the tab label. */
  right?: React.ReactNode;
}

/** Side-specific styles used when the trigger's icon slot is configured as an object. */
export interface TabsTriggerIconStyleSlots {
  /** Styles the leading icon wrapper. */
  left?: Style;
  /** Styles the trailing icon wrapper. */
  right?: Style;
}

/** Style overrides for the Tabs.Trigger root and its icon slots. */
export interface TabsTriggerStyleSlots {
  /** Styles the tab button element. */
  root?: Style;
  /** Shared icon styles, or separate leading and trailing icon styles. */
  icon?: Style | TabsTriggerIconStyleSlots;
}

/** Style overrides accepted by Tabs.Trigger. */
export type TabsTriggerStylesProp = StylesProp<TabsTriggerStyleSlots>;

/** Style overrides for the Tabs.Content root. */
export interface TabsContentStyleSlots {
  /** Styles the element with `role="tabpanel"`. */
  root?: Style;
}

/** Style overrides accepted by Tabs.Content. */
export type TabsContentStylesProp = StylesProp<TabsContentStyleSlots>;

interface IndicatorPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface TabsContextValue {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  variant?: TabsVariant;
  orientation: TabsOrientation;
  listStyle: string;
  indicatorReady: boolean;
  setIndicatorReady: (ready: boolean) => void;
  skipIndicatorAnimation: boolean;
  setSkipIndicatorAnimation: (skip: boolean) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);
const TABS_UNDERLINE_THICKNESS = 2;
const TABS_UNDERLINE_OFFSET = 2;
const TABS_UNDERLINE_GUTTER = TABS_UNDERLINE_THICKNESS + TABS_UNDERLINE_OFFSET;

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within a Tabs root");
  }
  return context;
}

function getTabsIndicatorClassName(indicator: string, variant?: TabsVariant) {
  return cn(
    "indicator",
    css.indicator,
    variant === "underline" && css["indicator-underline"],
    indicator,
  );
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alternate visual treatment applied to the list and its selection indicator. When omitted, the indicator is drawn as a filled surface behind the selected tab.
   * @category Core
   */
  variant?: TabsVariant;
  /** Direction the tab list is laid out in. The value is published as `aria-orientation` on the list and decides which edge the indicator is drawn on.
   * @category Core
   * @default "horizontal"
   */
  orientation?: TabsOrientation;
  /** Value of the tab selected on first render while Tabs is uncontrolled. Ignored once `value` is supplied.
   * @category Core
   * @default ""
   */
  default?: string;
  /** Value of the selected tab. Supplying it makes Tabs controlled, so selection only changes when the consumer passes a new value.
   * @category Core
   */
  value?: string;
  /** Called with the value of the tab a press or keyboard navigation selected. It is not called for a disabled tab.
   * @category Events
   */
  onValueChange?: (value: string) => void;
  /** Class or style overrides for the root element and the tab list it owns.
   * @category Styling
   * @typeDoc TabsStyleSlots
   */
  styles?: TabsStylesProp;
}

const resolveTabsBaseStyles = createStylesResolver(["root", "list"] as const);

const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      variant,
      orientation = "horizontal",
      default: defaultValue,
      value: controlledValue,
      onValueChange,
      className,
      styles: stylesProp,
      children,
      ...rest
    },
    ref,
  ) => {
    const { root, list: listStyle } = resolveTabsBaseStyles(stylesProp);

    const [selectedValue, setInternalValue] = useControlledState(
      controlledValue,
      undefined,
      defaultValue || "",
    );

    const setSelectedValue = React.useCallback(
      (newValue: string) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [onValueChange, setInternalValue],
    );

    const [indicatorReady, setIndicatorReady] = React.useState(false);
    const [skipIndicatorAnimation, setSkipIndicatorAnimation] = React.useState(false);

    const context = React.useMemo<TabsContextValue>(
      () => ({
        selectedValue,
        setSelectedValue,
        variant,
        orientation,
        listStyle,
        indicatorReady,
        setIndicatorReady,
        skipIndicatorAnimation,
        setSkipIndicatorAnimation,
      }),
      [
        selectedValue,
        setSelectedValue,
        variant,
        orientation,
        listStyle,
        indicatorReady,
        skipIndicatorAnimation,
      ],
    );

    return (
      <TabsContext.Provider value={context}>
        <div
          {...rest}
          ref={ref}
          className={cn("tabs", css.tabs, className, root)}
          data-slot="root"
          data-orientation={orientation}
          data-variant={variant}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
TabsRoot.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Class or style overrides for the tab list and the parts it owns.
   * @category Styling
   * @typeDoc TabsListStyleSlots
   */
  styles?: TabsListStylesProp;
}

const resolveTabsListBaseStyles = createStylesResolver([
  "root",
  "indicator.root",
  "indicator.fallback",
  "trigger",
] as const);

interface TabsListContextValue {
  triggerStyle: string;
}

const TabsListContext = React.createContext<TabsListContextValue | null>(null);

/** Container for the row of tab triggers and the selection indicator. */
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, styles: stylesProp, ...rest }, ref) => {
    const {
      selectedValue,
      variant,
      orientation,
      listStyle,
      indicatorReady,
      setIndicatorReady,
      skipIndicatorAnimation,
    } = useTabsContext();
    const resolved = resolveTabsListBaseStyles(stylesProp);
    const triggerStyle = resolved.trigger;
    const listRef = React.useRef<HTMLDivElement>(null);
    const selectedValueRef = React.useRef(selectedValue);
    selectedValueRef.current = selectedValue;
    const [indicatorPosition, setIndicatorPosition] = React.useState<IndicatorPosition>({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });

    const indicatorClassName = React.useMemo(
      () => getTabsIndicatorClassName(resolved["indicator.root"], variant),
      [resolved, variant],
    );
    const fallbackIndicatorClassName = React.useMemo(
      () => getTabsIndicatorClassName(resolved["indicator.fallback"], variant),
      [resolved, variant],
    );
    const measureTrigger = React.useCallback((element: HTMLElement | null) => {
      if (!element) return null;

      // offsetLeft/Top are relative to the list (its nearest positioned
      // ancestor) and, unlike getBoundingClientRect, are unaffected by any
      // CSS transform scale applied to an ancestor. Mixing the two spaces
      // would double-apply the scale once the indicator's own inline
      // left/top/width styles get transformed again by that ancestor.
      return {
        left: element.offsetLeft,
        top: element.offsetTop,
        width: element.offsetWidth,
        height: element.offsetHeight,
      };
    }, []);

    const updateIndicator = React.useCallback(
      (value: string) => {
        if (!listRef.current) return false;

        const trigger = listRef.current.querySelector(
          `[data-tabs-value="${value}"]`,
        ) as HTMLElement | null;

        if (trigger) {
          const position = measureTrigger(trigger);
          if (position) {
            const hasMeasurement = position.width > 0 && position.height > 0;
            setIndicatorPosition(position);
            return hasMeasurement;
          }
        }

        setIndicatorPosition({
          left: 0,
          top: 0,
          width: 0,
          height: 0,
        });
        return false;
      },
      [measureTrigger],
    );

    React.useLayoutEffect(() => {
      setIndicatorReady(updateIndicator(selectedValue));
    }, [children, selectedValue, updateIndicator, setIndicatorReady]);

    React.useEffect(() => {
      if (!listRef.current) return;

      let frame: number | undefined;
      const resizeObserver = new ResizeObserver(() => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          setIndicatorReady(updateIndicator(selectedValueRef.current));
        });
      });

      resizeObserver.observe(listRef.current);
      listRef.current.querySelectorAll<HTMLElement>("[data-tabs-value]").forEach((trigger) => {
        resizeObserver.observe(trigger);
      });
      return () => {
        resizeObserver.disconnect();
        if (frame !== undefined) cancelAnimationFrame(frame);
      };
    }, [children, updateIndicator, setIndicatorReady]);

    React.useEffect(() => {
      const handleWindowResize = () => {
        requestAnimationFrame(() => {
          setIndicatorReady(updateIndicator(selectedValueRef.current));
        });
      };

      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }, [selectedValue, updateIndicator, setIndicatorReady]);

    const getIndicatorStyle = React.useMemo<React.CSSProperties>(() => {
      const baseStyle: React.CSSProperties = {
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        margin: 0,
        opacity: indicatorPosition.width === 0 && indicatorPosition.height === 0 ? 0 : 1,
      };

      if (indicatorPosition.width === 0 && indicatorPosition.height === 0) {
        return baseStyle;
      }

      if (orientation === "vertical") {
        if (variant === "underline") {
          return {
            ...baseStyle,
            transform: `translate3d(${indicatorPosition.left - TABS_UNDERLINE_GUTTER}px, ${indicatorPosition.top}px, 0)`,
            width: TABS_UNDERLINE_THICKNESS,
            height: indicatorPosition.height,
          };
        }
      }

      if (variant === "underline") {
        return {
          ...baseStyle,
          transform: `translate3d(${indicatorPosition.left}px, ${indicatorPosition.top + indicatorPosition.height + TABS_UNDERLINE_OFFSET}px, 0)`,
          width: indicatorPosition.width,
          height: TABS_UNDERLINE_THICKNESS,
        };
      }

      return {
        ...baseStyle,
        transform: `translate3d(${indicatorPosition.left}px, ${indicatorPosition.top}px, 0)`,
        width: indicatorPosition.width,
        height: indicatorPosition.height,
      };
    }, [indicatorPosition, variant, orientation]);

    const mergedRef = useMergeRefs(listRef, ref);
    const listContext = React.useMemo(() => ({ triggerStyle }), [triggerStyle]);

    return (
      <TabsListContext.Provider value={listContext}>
        <div
          {...rest}
          ref={mergedRef}
          role="tablist"
          aria-orientation={orientation}
          className={cn("list", css.list, listStyle, className, resolved.root)}
          data-slot="list"
          data-orientation={orientation}
          data-variant={variant}
        >
          {React.Children.map(children, (child, index) => (
            <React.Fragment key={React.isValidElement(child) ? child.key : index}>
              {child}
              {!indicatorReady && (
                <span
                  aria-hidden="true"
                  className={cn("indicator-fallback-frame", css["indicator-fallback-frame"])}
                  data-indicator-fallback="true"
                  style={{
                    gridColumn: `${orientation === "horizontal" ? index + 1 : 1} / span 1`,
                    gridRow: `${orientation === "vertical" ? index + 1 : 1} / span 1`,
                  }}
                >
                  <span
                    className={cn(
                      fallbackIndicatorClassName,
                      "indicator-fallback",
                      css["indicator-fallback"],
                    )}
                    data-slot="indicator.fallback"
                    style={{
                      zIndex: 0,
                      ...(orientation === "vertical"
                        ? variant === "underline"
                          ? {
                              top: 0,
                              bottom: 0,
                              left: 0,
                              width: TABS_UNDERLINE_THICKNESS,
                              margin: 0,
                            }
                          : { inset: 0, margin: 0 }
                        : variant === "underline"
                          ? {
                              left: 0,
                              right: 0,
                              top: `calc(100% + ${TABS_UNDERLINE_OFFSET}px)`,
                              height: TABS_UNDERLINE_THICKNESS,
                              margin: 0,
                            }
                          : { inset: 0, margin: 0 }),
                    }}
                  />
                </span>
              )}
            </React.Fragment>
          ))}
          {indicatorPosition.width > 0 && (
            <div
              aria-hidden="true"
              className={indicatorClassName}
              data-slot="indicator.root"
              data-animate={skipIndicatorAnimation ? "false" : "true"}
              style={getIndicatorStyle}
            />
          )}
        </div>
      </TabsListContext.Provider>
    );
  },
);
TabsList.displayName = "Tabs.List";

export interface TabsTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  /** Identifier shared with the `Tabs.Content` panel this tab activates. It also seeds the trigger and panel element ids used by `aria-controls` and `aria-labelledby`.
   * @category Core
   */
  value: string;
  /** Native button type. It defaults to `"button"` so a tab inside a form never submits it.
   * @category Advanced
   * @default "button"
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#type
   */
  type?: "button" | "submit" | "reset";
  /** Disables the tab. A disabled tab cannot be pressed, is skipped by arrow-key navigation, and is removed from the tab order.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#disabled
   */
  disabled?: boolean;
  /** Icon content rendered beside the label. A single node renders before the label; an object places content on either side.
   * @category Content
   * @typeDoc TabsTriggerIconSlots
   */
  icon?: React.ReactNode | TabsTriggerIconSlots;
  /** Class or style overrides for the tab button and its icon slots.
   * @category Styling
   * @typeDoc TabsTriggerStyleSlots
   */
  styles?: TabsTriggerStylesProp;
  /** Forces the visual hover state. Set by Menu.Trigger to keep the tab highlighted while its menu is open. This is an advanced visual-state escape hatch.
   * @category Advanced
   */
  "data-hovered"?: "true" | "false";
}

const resolveTabsTriggerBaseStyles = createStylesResolver([
  "root",
  "icon.left",
  "icon.right",
] as const);

function isTabsTriggerIconSlots(icon: TabsTriggerProps["icon"]): icon is TabsTriggerIconSlots {
  return (
    typeof icon === "object" &&
    icon !== null &&
    !React.isValidElement(icon) &&
    ("left" in icon || "right" in icon)
  );
}

function resolveTabsTriggerIcon(icon: TabsTriggerProps["icon"]): TabsTriggerIconSlots | undefined {
  if (!icon) return undefined;
  if (isTabsTriggerIconSlots(icon)) return icon;
  return { left: icon };
}

/** A tab button that selects its associated content panel. */
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (
    {
      value,
      disabled = false,
      icon,
      className,
      styles: stylesProp,
      children,
      type = "button",
      "data-hovered": forcedHovered,
      ...rest
    },
    ref,
  ) => {
    const { selectedValue, setSelectedValue, indicatorReady, setSkipIndicatorAnimation } =
      useTabsContext();
    const tabsListContext = React.useContext(TabsListContext);
    const resolved = resolveTabsTriggerBaseStyles(stylesProp);
    const resolvedIcon = resolveTabsTriggerIcon(icon);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const isSelected = value === selectedValue;

    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { targetProps } = useFocus({ mode: "target" });
    const interactionModality = useInteractionModality();
    const showFocusVisible = isFocused && interactionModality !== "pointer" && isFocusVisible;

    const handlePress = React.useCallback(() => {
      if (!disabled) {
        setSkipIndicatorAnimation(false);
        setSelectedValue(value);
      }
    }, [disabled, value, setSelectedValue, setSkipIndicatorAnimation]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;

        const listElement = buttonRef.current?.parentElement;
        if (!listElement) return;

        // Disabled triggers are not focusable, so navigation skips them.
        const triggers = Array.from(
          listElement.querySelectorAll("[data-tabs-value]:not([disabled])"),
        ) as HTMLButtonElement[];
        const currentIndex = triggers.findIndex(
          (el) => el.getAttribute("data-tabs-value") === value,
        );
        if (currentIndex === -1 || triggers.length === 0) return;

        let nextValue: string | null = null;
        let isArrowNavigation = false;

        if (e.key === "Tab") {
          const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
          const nextTrigger = triggers[nextIndex];

          if (nextTrigger) {
            e.preventDefault();
            nextTrigger.focus();
          }
          return;
        }

        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          isArrowNavigation = true;
          const nextIndex = (currentIndex + 1) % triggers.length;
          nextValue = triggers[nextIndex].getAttribute("data-tabs-value");
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          isArrowNavigation = true;
          const prevIndex = currentIndex === 0 ? triggers.length - 1 : currentIndex - 1;
          nextValue = triggers[prevIndex].getAttribute("data-tabs-value");
        } else if (e.key === "Home") {
          e.preventDefault();
          nextValue = triggers[0].getAttribute("data-tabs-value");
        } else if (e.key === "End") {
          e.preventDefault();
          nextValue = triggers[triggers.length - 1].getAttribute("data-tabs-value");
        }

        if (nextValue) {
          setSkipIndicatorAnimation(isArrowNavigation);
          setSelectedValue(nextValue);
          setTimeout(() => {
            const nextTrigger = listElement.querySelector(
              `[data-tabs-value="${nextValue}"]`,
            ) as HTMLButtonElement | null;
            nextTrigger?.focus();
            setSkipIndicatorAnimation(false);
          }, 0);
        }
      },
      [value, disabled, setSelectedValue, setSkipIndicatorAnimation],
    );

    const mergedRef = useMergeRefs(buttonRef, ref);
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
    const { pressProps, isPressed } = usePress({
      isDisabled: disabled,
      onPressStart: handlePress,
    });
    const triggerProps = mergeProps(
      rest,
      asElementProps<"button">(focusProps),
      hoverProps,
      pressProps,
      { onKeyDown: handleKeyDown },
    );

    return (
      <button
        {...triggerProps}
        {...targetProps}
        ref={mergedRef}
        type={type}
        id={`${value}-trigger`}
        role="tab"
        aria-selected={isSelected}
        aria-controls={`${value}-content`}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        data-tabs-value={value}
        className={cn(
          "trigger",
          "item",
          css.trigger,
          tabsListContext?.triggerStyle,
          className,
          resolved.root,
        )}
        data-slot="trigger"
        data-selected={isSelected ? "true" : "false"}
        data-disabled={disabled ? "true" : undefined}
        data-hovered={
          !disabled && (forcedHovered === "true" || (forcedHovered !== "false" && isHovered))
            ? "true"
            : "false"
        }
        data-pressed={isPressed ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={showFocusVisible ? "true" : "false"}
        data-indicator-ready={isSelected && indicatorReady ? "true" : undefined}
        data-indicator-fallback={isSelected && !indicatorReady ? "true" : undefined}
      >
        {resolvedIcon?.left && (
          <span className={cn("icon", css.icon, resolved["icon.left"])} data-slot="icon.left">
            {resolvedIcon.left}
          </span>
        )}
        {children}
        {resolvedIcon?.right && (
          <span className={cn("icon", css.icon, resolved["icon.right"])} data-slot="icon.right">
            {resolvedIcon.right}
          </span>
        )}
      </button>
    );
  },
);
TabsTrigger.displayName = "Tabs.Trigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Identifier shared with the `Tabs.Trigger` that selects this panel.
   * @category Core
   */
  value: string;
  /** Class or style overrides for the panel element.
   * @category Styling
   * @typeDoc TabsContentStyleSlots
   */
  styles?: TabsContentStylesProp;
}

const resolveTabsContentBaseStyles = createStylesResolver(["root"] as const);

/** Content panel shown while its matching tab is selected. */
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, styles: stylesProp, ...rest }, ref) => {
    const { selectedValue, orientation } = useTabsContext();
    const { root } = resolveTabsContentBaseStyles(stylesProp);
    const isVisible = value === selectedValue;

    return (
      <div
        {...rest}
        ref={ref}
        role="tabpanel"
        aria-labelledby={`${value}-trigger`}
        id={`${value}-content`}
        className={cn("content", css.content, className, root)}
        data-slot="content"
        data-orientation={orientation}
        hidden={!isVisible}
      >
        {isVisible && children}
      </div>
    );
  },
);
TabsContent.displayName = "Tabs.Content";

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
