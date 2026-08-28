"use client";

import * as React from "react";

import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import { useToggleState, type ToggleState } from "react-stately";
import { ChevronDown } from "lucide-react";

import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { Divider, type DividerProps } from "@/components/Divider";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import css from "./Expand.module.css";

/**
 * Direction the content panel reveals from relative to the trigger.
 * @typeDoc ExpandDirection
 */
export type ExpandDirection = "below" | "above" | "left" | "right";

/**
 * Controls whether Expand supplies its own corner radius or sits flush inside a bordered container.
 * @typeDoc ExpandLayout
 */
export type ExpandLayout = "standalone" | "contained";

/**
 * Class-based styling targets for the Expand icon, addressed by collapsed/expanded state.
 * @typeDoc ExpandIconStyleSlots
 */
export interface ExpandIconStyleSlots {
  /** Styles the icon while the panel is collapsed. */
  collapsed?: Style;
  /** Styles the icon while the panel is expanded. */
  expanded?: Style;
}

/**
 * Class-based styling targets for the Expand content panel and its padded inner region.
 * @typeDoc ExpandContentStyleSlots
 */
export interface ExpandContentStyleSlots {
  /** Styles the collapsing outer content panel. */
  root?: Style;
  /** Styles the padded region wrapping the panel's children. */
  inner?: Style;
}

/**
 * Named style overrides for the Expand root and stable compound anatomy.
 * @typeDoc ExpandStyleSlots
 */
export interface ExpandStyleSlots {
  /** Styles the root expand container. */
  root?: Style;
  /** Styles the trigger button. */
  trigger?: Style;
  /** Shared or state-specific styles for the disclosure icon. */
  icon?: Style | ExpandIconStyleSlots;
  /** Styles the trigger's title/label text. */
  title?: Style;
  /** Shared or keyed styles for the content panel and its inner region. */
  content?: Style | ExpandContentStyleSlots;
  /** Styles the divider rendered between the trigger and content. */
  divider?: Style;
}

/**
 * Style overrides accepted by Expand.
 * @typeDoc ExpandStylesProp
 */
export type ExpandStylesProp = StylesProp<ExpandStyleSlots>;

/**
 * Controlled expanded state supplied to Expand.
 * @typeDoc ExpandState
 */
export interface ExpandState {
  /** Controlled expanded value. */
  expanded?: boolean;
}

const resolveExpandBaseStyles = createStylesResolver([
  "root",
  "trigger",
  "icon",
  "iconCollapsed",
  "iconExpanded",
  "title",
  "content",
  "contentInner",
  "divider",
] as const);

function resolveExpandStyles(stylesProp: ExpandStylesProp | undefined) {
  if (!stylesProp) {
    return resolveExpandBaseStyles(stylesProp);
  }

  const { root, trigger, icon, title, content, divider } = stylesProp;

  let iconClassName: Style | undefined;
  let iconCollapsed: Style | undefined;
  let iconExpanded: Style | undefined;

  if (icon) {
    if (typeof icon === "string" || Array.isArray(icon)) {
      iconClassName = icon;
      iconCollapsed = icon;
      iconExpanded = icon;
    } else {
      iconCollapsed = icon.collapsed;
      iconExpanded = icon.expanded;
    }
  }

  let contentClassName: Style | undefined;
  let contentInner: Style | undefined;

  if (content) {
    if (typeof content === "string" || Array.isArray(content)) {
      contentClassName = content;
      contentInner = content;
    } else {
      contentClassName = content.root;
      contentInner = content.inner;
    }
  }

  return resolveExpandBaseStyles({
    root,
    trigger,
    icon: iconClassName,
    iconCollapsed,
    iconExpanded,
    title,
    content: contentClassName,
    contentInner,
    divider,
  });
}

interface ExpandContextValue {
  state: ToggleState;
  isDisabled: boolean;
  resolvedStyles: ReturnType<typeof resolveExpandStyles>;
}

const ExpandContext = React.createContext<ExpandContextValue | null>(null);

function useExpandContext() {
  const context = React.useContext(ExpandContext);
  if (!context) {
    throw new Error("Expand compound components must be used within Expand");
  }

  return context;
}

export interface ExpandIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Custom icon element rendered inside the icon wrapper. Defaults to a chevron.
   * @category Content
   */
  children?: React.ReactNode;
  /**
   * Tailwind color utility applied to the icon wrapper (e.g. "bg-background-500").
   * @category Styling
   */
  color?: string;
}

const ExpandIcon = React.forwardRef<HTMLSpanElement, ExpandIconProps>(
  ({ children, className, color, ...props }, ref) => {
    const { state, resolvedStyles } = useExpandContext();

    return (
      <span
        ref={ref}
        className={cn(
          "icon",
          css.icon,
          color,
          className,
          resolvedStyles.icon,
          state.isSelected ? resolvedStyles.iconExpanded : resolvedStyles.iconCollapsed,
        )}
        data-selected={state.isSelected ? "true" : undefined}
        data-expanded={state.isSelected ? "true" : undefined}
        aria-hidden="true"
        {...props}
      >
        {children ?? <ChevronDown size={16} />}
      </span>
    );
  },
);
ExpandIcon.displayName = "Expand.Icon";

export interface ExpandTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /**
   * Label or content rendered inside the trigger. Ignored when title is supplied.
   * @category Content
   */
  children?: React.ReactNode;
  /**
   * Title content rendered in the trigger's text slot, followed by the disclosure icon.
   * @category Content
   */
  title?: React.ReactNode;
}

const ExpandTrigger = React.forwardRef<HTMLButtonElement, ExpandTriggerProps>(
  ({ children, className, title, ...props }, ref) => {
    const { state, isDisabled, resolvedStyles } = useExpandContext();
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergeRefs(triggerRef, ref);

    const { buttonProps, isPressed } = useButton(
      {
        isDisabled,
        onPress: () => state.toggle(),
      },
      triggerRef,
    );
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled });

    const hasElementChildren = React.Children.toArray(children).some((child) =>
      React.isValidElement(child),
    );
    const shouldRenderCompositeLabel = title !== undefined || !hasElementChildren;

    return (
      <button
        ref={mergedRef}
        {...mergeProps(buttonProps, focusProps, hoverProps, props)}
        className={cn("trigger", css.trigger, className, resolvedStyles.trigger)}
        type="button"
        aria-expanded={state.isSelected}
        data-selected={state.isSelected ? "true" : undefined}
        data-expanded={state.isSelected ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        data-focused={isFocused ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-pressed={isPressed ? "true" : undefined}
        data-hovered={isHovered ? "true" : undefined}
        data-expand-focus-surface="true"
      >
        {shouldRenderCompositeLabel ? (
          <>
            <span className={cn("title", css.title, resolvedStyles.title)}>
              {title ?? children}
            </span>
            <ExpandIcon />
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
ExpandTrigger.displayName = "Expand.Trigger";

export interface ExpandContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content shown when the expand is open.
   * @category Content
   */
  children: React.ReactNode;
  /**
   * Direction the content reveals from relative to the trigger.
   * @category Core
   * @default "below"
   * @typeDoc ExpandDirection
   */
  from?: ExpandDirection;
}

const ExpandContent = React.forwardRef<HTMLDivElement, ExpandContentProps>(
  ({ children, className, from, ...props }, ref) => {
    const { state, resolvedStyles } = useExpandContext();

    return (
      <div
        ref={ref}
        className={cn("content", css.content, className, resolvedStyles.content)}
        data-selected={state.isSelected ? "true" : undefined}
        data-expanded={state.isSelected ? "true" : undefined}
        data-from={from && from !== "below" ? from : undefined}
        aria-hidden={!state.isSelected}
        {...props}
      >
        <div className={cn("content-inner", css["content-inner"], resolvedStyles.contentInner)}>
          {children}
        </div>
      </div>
    );
  },
);
ExpandContent.displayName = "Expand.Content";

const ExpandDivider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, spacing = "none", styles: dividerStyles, ...props }, ref) => {
    const { resolvedStyles } = useExpandContext();

    return (
      <Divider
        ref={ref}
        spacing={spacing}
        styles={dividerStyles}
        className={cn("divider", css.divider, className, resolvedStyles.divider)}
        {...props}
      />
    );
  },
);
ExpandDivider.displayName = "Expand.Divider";

function isExpandDivider(child: React.ReactNode): child is React.ReactElement<DividerProps> {
  return React.isValidElement(child) && child.type === ExpandDivider;
}

function isExpandContent(child: React.ReactNode): child is React.ReactElement<ExpandContentProps> {
  return React.isValidElement(child) && child.type === ExpandContent;
}

function prependContentChildren(
  content: React.ReactElement<ExpandContentProps>,
  prefix: React.ReactNode,
) {
  return React.cloneElement(
    content,
    undefined,
    <>
      {prefix}
      {content.props.children}
    </>,
  );
}

function moveDividersIntoContent(childrenArray: React.ReactNode[]) {
  const normalizedChildren: React.ReactNode[] = [];

  for (let index = 0; index < childrenArray.length; index += 1) {
    const child = childrenArray[index];
    const nextChild = childrenArray[index + 1];

    if (isExpandDivider(child) && isExpandContent(nextChild)) {
      normalizedChildren.push(prependContentChildren(nextChild, child));
      index += 1;
      continue;
    }

    normalizedChildren.push(child);
  }

  return normalizedChildren;
}

export interface ExpandProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "onChange"
> {
  /**
   * Header content rendered in preset mode, wrapping children in a generated trigger and content panel.
   * @category Content
   */
  title?: React.ReactNode;
  /**
   * Controls whether the trigger supplies its own corner radius or sits flush inside a bordered container.
   * @category Core
   * @default "standalone"
   * @typeDoc ExpandLayout
   */
  layout?: ExpandLayout;
  /**
   * Initial expanded state for uncontrolled usage. For controlled usage, pass `state={{ expanded }}`.
   * @category Core
   * @default false
   */
  expanded?: boolean;
  /**
   * Controlled expanded state. Takes precedence over expanded and defaultExpanded.
   * @category Core
   * @typeDoc ExpandState
   */
  state?: ExpandState;
  /**
   * @deprecated Use `expanded`.
   * @category Core
   */
  isExpanded?: boolean;
  /**
   * @deprecated Use `expanded`.
   * @category Core
   */
  defaultExpanded?: boolean;
  /**
   * Called when the trigger toggles the expanded state.
   * @category Events
   */
  onExpandedChange?: (isExpanded: boolean) => void;
  /**
   * Alias for onExpandedChange.
   * @category Events
   */
  onChange?: (isExpanded: boolean) => void;
  /**
   * Disables the trigger and applies disabled styling.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /**
   * Compound sub-components (Expand.Trigger, Expand.Content, Expand.Divider) or content nodes normalized into the content panel.
   * @category Content
   */
  children?: React.ReactNode;
  /**
   * Keyed styles for the root and named component parts. Use className for conventional root classes.
   * @category Styling
   * @typeDoc ExpandStylesProp
   */
  styles?: ExpandStylesProp;
}

const ExpandRoot = React.forwardRef<HTMLDivElement, ExpandProps>(
  (
    {
      className,
      title,
      layout = "standalone",
      expanded,
      state: controlledState,
      isExpanded: legacyExpanded,
      defaultExpanded = false,
      onExpandedChange,
      onChange,
      disabled = false,
      children,
      styles: stylesProp,
      ...props
    },
    ref,
  ) => {
    const [isExpanded, setExpanded] = useControlledState(
      controlledState?.expanded,
      expanded ?? legacyExpanded,
      defaultExpanded,
    );
    const state = useToggleState({
      isSelected: isExpanded,
      onChange: (next) => {
        setExpanded(next);
        (onExpandedChange ?? onChange)?.(next);
      },
    });

    const resolvedStyles = resolveExpandStyles(stylesProp);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const scopeRef = React.useRef<HTMLDivElement>(null);
    const mergedRootRef = useMergeRefs(rootRef, ref);
    const childrenArray = React.Children.toArray(children);

    const { scopeProps, indicatorProps } = useFocus({
      scopeRef,
      containerRef: rootRef,
      surfaceSelector: '[data-expand-focus-surface="true"]',
      radiusSource: "surface",
      mode: "ring",
      dependencies: [state.isSelected],
    });

    const contextValue = React.useMemo<ExpandContextValue>(
      () => ({
        state,
        isDisabled: disabled,
        resolvedStyles,
      }),
      [state, disabled, resolvedStyles],
    );

    return (
      <ExpandContext.Provider value={contextValue}>
        <div ref={scopeRef} className={cn("expand-scope", scopeProps.className, css.scope)}>
          <div {...indicatorProps} data-focus-indicator="local" />
          <div
            ref={mergedRootRef}
            className={cn("expand", css.expand, className, resolvedStyles.root)}
            data-selected={state.isSelected ? "true" : undefined}
            data-expanded={state.isSelected ? "true" : undefined}
            data-disabled={disabled ? "true" : undefined}
            data-layout={layout}
            {...props}
          >
            {title !== undefined ? (
              <>
                <ExpandTrigger>{title}</ExpandTrigger>
                <ExpandContent>
                  {childrenArray.find(isExpandDivider) ?? <ExpandDivider />}
                  {childrenArray.filter((child) => !isExpandDivider(child))}
                </ExpandContent>
              </>
            ) : (
              moveDividersIntoContent(childrenArray)
            )}
          </div>
        </div>
      </ExpandContext.Provider>
    );
  },
);
ExpandRoot.displayName = "Expand";

const Expand = Object.assign(ExpandRoot, {
  Trigger: ExpandTrigger,
  Content: ExpandContent,
  Divider: ExpandDivider,
  Icon: ExpandIcon,
});

Expand.displayName = "Expand";

export { Expand, ExpandTrigger, ExpandContent, ExpandDivider, ExpandIcon };
