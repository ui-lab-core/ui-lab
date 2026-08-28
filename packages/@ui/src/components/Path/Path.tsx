"use client";

import * as React from "react";
import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import css from "./Path.module.css";

/** Style overrides for the path item root. */
export interface PathItemStyleSlots {
  /** Styles applied to the rendered anchor, button, or span element. */
  root?: Style;
}

export type PathItemStylesProp = StylesProp<PathItemStyleSlots>;

/** Style overrides for the path root and named component parts. */
export interface PathStyleSlots {
  /** Styles applied to the root nav element. */
  root?: Style;
  /** Styles applied to the ordered list element. */
  list?: Style;
  /** Styles applied to each separator rendered between items. */
  separator?: Style;
}

export type PathStylesProp = StylesProp<PathStyleSlots>;

function focusPathSibling(
  currentTarget: HTMLElement,
  direction: "next" | "previous" | "first" | "last",
) {
  const listElement = currentTarget.closest('[data-path-list="true"]');
  if (!listElement) {
    return;
  }

  const focusableItems = Array.from(
    listElement.querySelectorAll(
      '[data-path-item-focus-surface="true"]:not([data-disabled="true"])',
    ),
  ) as HTMLElement[];

  if (!focusableItems.length) {
    return;
  }

  const currentIndex = focusableItems.indexOf(currentTarget);
  if (currentIndex === -1) {
    return;
  }

  let nextIndex = currentIndex;

  if (direction === "next") {
    nextIndex = (currentIndex + 1) % focusableItems.length;
  } else if (direction === "previous") {
    nextIndex = currentIndex === 0 ? focusableItems.length - 1 : currentIndex - 1;
  } else if (direction === "first") {
    nextIndex = 0;
  } else if (direction === "last") {
    nextIndex = focusableItems.length - 1;
  }

  focusableItems[nextIndex]?.focus();
}

const resolvePathStyles = createStylesResolver(["root", "list", "separator"] as const);
const resolvePathItemStyles = createStylesResolver(["root"] as const);

export interface PathItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onClick" | "className" | "children"> {
  /**
   * Content rendered inside the path item.
   * @category Core
   */
  children: React.ReactNode;
  /**
   * URL this path item navigates to. Renders the item as an anchor when the item is interactive; has no effect when disabled or current.
   * @category Link behavior
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href
   */
  href?: string;
  /**
   * Called when the item is activated by press, click, or keyboard selection. Takes precedence over native anchor navigation when href is also set.
   * @category Events
   */
  onPress?: () => void;
  /**
   * Marks this item as the current page. Path sets this automatically on the last child; setting it manually forces an item to render as non-interactive with `aria-current="page"`.
   * @category Core
   * @default false
   */
  isCurrent?: boolean;
  /**
   * Disables interaction. Disabled items render as a non-interactive span and are excluded from arrow-key navigation.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional CSS class names applied to the rendered anchor, button, or span element.
   * @category Styling
   */
  className?: string;
  /**
   * Keyed styles for the root and named component parts. Use className for conventional root classes.
   * @category Styling
   * @typeDoc PathItemStyleSlots
   */
  styles?: PathItemStylesProp;
}

export interface PathProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "children"> {
  /**
   * Path.Item elements rendered inside the ordered list.
   * @category Core
   */
  children: React.ReactNode;
  /**
   * Additional CSS class names applied to the root nav element.
   * @category Styling
   */
  className?: string;
  /**
   * Custom separator rendered between path items. Omit to rely on the default spacing with no visible divider.
   * @category Content
   */
  separator?: React.ReactNode;
  /**
   * Keyed styles for the root and named component parts. Use className for conventional root classes.
   * @category Styling
   * @typeDoc PathStyleSlots
   */
  styles?: PathStylesProp;
}

const PathItem = React.forwardRef<HTMLElement, PathItemProps>(
  (
    {
      href,
      onPress,
      children,
      isCurrent = false,
      disabled = false,
      className,
      styles,
      ...rest
    },
    ref,
  ) => {
    const itemRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs(ref, itemRef);
    const isInteractive = !isCurrent && !disabled && Boolean(href || onPress);
    const [isPressed, setIsPressed] = React.useState(false);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled: !isInteractive });
    const resolved = resolvePathItemStyles(styles);

    const handleMouseDown = React.useCallback(() => {
      if (isInteractive) {
        setIsPressed(true);
      }
    }, [isInteractive]);

    const handleMouseUp = React.useCallback(() => {
      setIsPressed(false);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setIsPressed(false);
    }, []);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          focusPathSibling(event.currentTarget, "next");
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          focusPathSibling(event.currentTarget, "previous");
          return;
        }

        if (event.key === "Home") {
          event.preventDefault();
          focusPathSibling(event.currentTarget, "first");
          return;
        }

        if (event.key === "End") {
          event.preventDefault();
          focusPathSibling(event.currentTarget, "last");
          return;
        }

        if (!isInteractive) {
          return;
        }

        if (event.key === " " || event.key === "Enter") {
          setIsPressed(true);
        }
      },
      [isInteractive],
    );

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === " " || event.key === "Enter") {
        setIsPressed(false);
      }
    }, []);

    const mergedInteractionProps = mergeProps(rest, focusProps, hoverProps, {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
    }) as unknown as Record<string, unknown>;

    const {
      onChange: _onChange,
      onChangeCapture: _onChangeCapture,
      ...interactionProps
    } = mergedInteractionProps;

    const stateProps = {
      "data-selected": isCurrent ? "true" : undefined,
      "data-disabled": disabled ? "true" : undefined,
      "data-focused": isFocused ? "true" : undefined,
      "data-focus-visible": isFocusVisible ? "true" : undefined,
      "data-hovered": isHovered ? "true" : undefined,
      "data-pressed": isPressed ? "true" : undefined,
      "data-path-item-focus-surface": "true" as const,
      "aria-current": isCurrent ? ("page" as const) : undefined,
    };

    const surfaceClassName = cn("link", css.link, className, resolved.root);
    const focusableTabIndex = disabled ? -1 : isCurrent ? 0 : undefined;

    return (
      <li className={cn("item", css.item)}>
        {isInteractive && href ? (
          <a
            ref={mergedRef as React.Ref<HTMLAnchorElement>}
            {...(interactionProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            href={href}
            className={surfaceClassName}
            tabIndex={focusableTabIndex}
            {...stateProps}
            onClick={(event) => {
              if (onPress) {
                event.preventDefault();
                onPress();
              }
            }}
          >
            {children}
          </a>
        ) : isInteractive ? (
          <button
            ref={mergedRef as React.Ref<HTMLButtonElement>}
            {...(interactionProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            type="button"
            className={surfaceClassName}
            tabIndex={focusableTabIndex}
            onClick={onPress}
            {...stateProps}
          >
            {children}
          </button>
        ) : (
          <span
            ref={mergedRef as React.Ref<HTMLSpanElement>}
            {...(interactionProps as React.HTMLAttributes<HTMLSpanElement>)}
            className={surfaceClassName}
            tabIndex={focusableTabIndex}
            {...stateProps}
          >
            {children}
          </span>
        )}
      </li>
    );
  },
);

PathItem.displayName = "Path.Item";

export interface PathComponent extends React.ForwardRefExoticComponent<
  PathProps & React.RefAttributes<HTMLElement>
> {
  Item: typeof PathItem;
}

const Path = Object.assign(
  React.forwardRef<HTMLElement, PathProps>(
    (
      { children, className, separator, styles, "aria-label": ariaLabel = "Path", ...rest },
      ref,
    ) => {
      const scopeRef = React.useRef<HTMLDivElement>(null);
      const navRef = React.useRef<HTMLElement>(null);
      const mergedRef = useMergeRefs(ref, navRef);
      const childArray = React.Children.toArray(children);
      const childCount = childArray.length;
      const resolved = resolvePathStyles(styles);
      const { scopeProps, indicatorProps } = useFocus({
        scopeRef,
        containerRef: navRef,
        surfaceSelector: '[data-path-item-focus-surface="true"]',
        radiusSource: "surface",
        dependencies: [childCount, Boolean(separator)],
      });

      return (
        <div ref={scopeRef} className={cn("path-scope", scopeProps.className)}>
          <div {...indicatorProps} data-focus-indicator="local" />
          <nav
            ref={mergedRef}
            {...rest}
            className={cn("path", css.path, className, resolved.root)}
            aria-label={ariaLabel}
          >
            <ol
              className={cn("list", css.list, resolved.list)}
              data-path-list="true"
              data-separator={separator ? "custom" : undefined}
            >
              {React.Children.map(childArray, (child, index) => {
                const isLastChild = index === childCount - 1;

                if (React.isValidElement(child)) {
                  const element = React.cloneElement(child as React.ReactElement<PathItemProps>, {
                    isCurrent: isLastChild,
                  });

                  if (separator && !isLastChild) {
                    return (
                      <React.Fragment key={child.key ?? index}>
                        {element}
                        <li
                          className={cn("separator", css.separator, resolved.separator)}
                          role="presentation"
                          aria-hidden="true"
                        >
                          {separator}
                        </li>
                      </React.Fragment>
                    );
                  }

                  return element;
                }

                return child;
              })}
            </ol>
          </nav>
        </div>
      );
    },
  ),
  {
    Item: PathItem,
  },
) as PathComponent;

Path.displayName = "Path";

export { Path, PathItem };
