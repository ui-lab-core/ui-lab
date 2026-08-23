"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { resolveGapStep } from "@/lib/gap";
import { Divider as FoldDivider } from "@/components/Divider";
import css from "./List.module.css";
import { ListContext, useListContext } from "./list.context";
import {
  ListProps,
  ListHeaderProps,
  ListRef,
  ListActionGroupProps,
  ListDividerProps,
  ListFooterProps,
} from "./list.types";
import { scrollItemIntoView } from "@/utils/list-navigation";
import { resolveListItemStyles, resolveListStyles } from "./list.styles";

function resolveListGap(gap: NonNullable<ListProps["gap"]>) {
  return `calc(var(--spacing, 0.25rem) * ${resolveGapStep(gap)})`;
}

// Ref container for keyboard navigation
const Container = React.forwardRef<ListRef, ListProps>(
  (
    {
      variant = "default",
      orientation = "vertical",
      gap,
      spacing = "default",
      onNavigate,
      highlighted,
      children,
      className,
      styles: stylesProp,
      style,
      ...props
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [focusedItem, setFocusedItemState] = React.useState<HTMLElement | null>(null);
    const [isFocusMode, setIsFocusMode] = React.useState(false);
    const shouldScrollFocusedItemRef = React.useRef(false);
    const mergedRootRef = useMergeRefs<HTMLDivElement>(
      rootRef,
      ref as React.ForwardedRef<HTMLDivElement>,
    );
    const { item: itemStylesProp, ...baseStylesProp } = stylesProp ?? {};
    const resolvedStyles = {
      ...resolveListStyles(baseStylesProp),
      item: resolveListItemStyles(itemStylesProp),
    };

    const getFocusableItems = React.useCallback(() => {
      if (!rootRef.current) return [];

      return Array.from(rootRef.current.querySelectorAll<HTMLElement>('[role="option"]')).filter(
        (item) =>
          item.isConnected &&
          item.tabIndex >= 0 &&
          item.getAttribute("aria-hidden") !== "true" &&
          item.getAttribute("aria-disabled") !== "true" &&
          item.getAttribute("data-disabled") !== "true",
      );
    }, []);

    const getFocusedIndex = React.useCallback(() => {
      if (!focusedItem || !isFocusMode) return null;
      const itemIndex = getFocusableItems().indexOf(focusedItem);
      return itemIndex >= 0 ? itemIndex : null;
    }, [focusedItem, getFocusableItems, isFocusMode]);

    const setFocusedItem = React.useCallback(
      (item: HTMLElement | null, options: { enterFocusMode?: boolean; scroll?: boolean } = {}) => {
        if (!item) {
          shouldScrollFocusedItemRef.current = false;
          setFocusedItemState(null);
          setIsFocusMode(false);
          return;
        }

        if (options.scroll) {
          shouldScrollFocusedItemRef.current = true;
        }

        setFocusedItemState(item);
        setIsFocusMode(options.enterFocusMode ?? true);
      },
      [],
    );

    const focusItemAtIndex = React.useCallback(
      (index: number, scroll = true) => {
        const itemsInOrder = getFocusableItems();
        const target = itemsInOrder[index];
        if (!target) return false;

        // focus() synchronously blurs the previous item, whose handler clears the
        // scroll flag via setFocusedItem(null) — arm it only after that dispatch.
        target.focus({ preventScroll: true });
        shouldScrollFocusedItemRef.current = scroll;
        return true;
      },
      [getFocusableItems],
    );

    const focusAdjacentItem = React.useCallback(
      (currentItem: HTMLElement | null, direction: 1 | -1, scroll = true, wrap = true) => {
        const itemsInOrder = getFocusableItems();
        if (itemsInOrder.length === 0) return false;

        const currentIndex = currentItem ? itemsInOrder.indexOf(currentItem) : -1;
        const nextIndex =
          currentIndex === -1
            ? direction === 1
              ? 0
              : itemsInOrder.length - 1
            : wrap
              ? (currentIndex + direction + itemsInOrder.length) % itemsInOrder.length
              : Math.min(Math.max(currentIndex + direction, 0), itemsInOrder.length - 1);

        if (currentIndex !== -1 && nextIndex === currentIndex) {
          return false;
        }

        return focusItemAtIndex(nextIndex, scroll);
      },
      [focusItemAtIndex, getFocusableItems],
    );

    const focusBoundaryItem = React.useCallback(
      (position: "first" | "last", scroll = true) => {
        const itemsInOrder = getFocusableItems();
        if (itemsInOrder.length === 0) return false;

        return focusItemAtIndex(position === "first" ? 0 : itemsInOrder.length - 1, scroll);
      },
      [focusItemAtIndex, getFocusableItems],
    );

    // The semantic listbox element also exposes the documented navigation methods.
    React.useImperativeHandle(
      ref,
      () =>
        Object.assign(rootRef.current!, {
        focusNext: () => {
          focusAdjacentItem(focusedItem, 1);
          onNavigate?.down?.();
        },
        focusPrev: () => {
          focusAdjacentItem(focusedItem, -1);
          onNavigate?.up?.();
        },
        focusFirst: () => {
          focusBoundaryItem("first");
          onNavigate?.down?.();
        },
        focusLast: () => {
          focusBoundaryItem("last");
          onNavigate?.up?.();
        },
        selectHighlighted: () => {
          onNavigate?.enter?.();
        },
        clearHighlight: () => {
          setFocusedItem(null, { enterFocusMode: false });
        },
        getHighlightedIndex: () => getFocusedIndex(),
        }),
      [
        focusAdjacentItem,
        focusBoundaryItem,
        focusedItem,
        getFocusedIndex,
        onNavigate,
        setFocusedItem,
      ],
    );

    React.useEffect(() => {
      if (!isFocusMode || !focusedItem || !shouldScrollFocusedItemRef.current) return;
      shouldScrollFocusedItemRef.current = false;
      scrollItemIntoView(focusedItem);
    }, [focusedItem, isFocusMode]);

    React.useEffect(() => {
      if (highlighted == null || !rootRef.current) return;
      const item = rootRef.current.querySelector<HTMLElement>('[data-highlighted="true"]');
      // Externally-driven highlights (e.g. Command palette filtering) change on
      // every keystroke while results reflow; a smooth scroll would chase the
      // moving target and read as layout jank. Jump instantly instead.
      if (item) scrollItemIntoView(item, "instant");
    }, [highlighted]);

    React.useEffect(() => {
      if (!focusedItem) return;
      if (focusedItem.isConnected) return;
      setFocusedItem(null, { enterFocusMode: false });
    }, [focusedItem, setFocusedItem]);

    const contextValue = React.useMemo(
      () => ({
        focusedItem,
        isFocusMode,
        orientation,
        rootRef,
        styles: resolvedStyles,
        setFocusedItem,
        focusAdjacentItem,
        focusBoundaryItem,
      }),
      [
        focusAdjacentItem,
        focusBoundaryItem,
        focusedItem,
        isFocusMode,
        orientation,
        resolvedStyles,
        setFocusedItem,
      ],
    );

    return (
      <ListContext.Provider value={contextValue}>
        <div
          ref={mergedRootRef}
          role="listbox"
          className={cn("list", css.root, className, resolvedStyles.root)}
          style={
            {
              ...style,
              ...(gap ? { gap: resolveListGap(gap) } : null),
            } as React.CSSProperties
          }
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
          data-variant={variant}
          data-slot="root"
          data-orientation={orientation}
          data-gap={gap}
          data-spacing={spacing}
          data-focus-mode={isFocusMode ? "row" : undefined}
          data-keyboard-mode={isFocusMode ? "true" : undefined}
        >
          {children}
        </div>
      </ListContext.Provider>
    );
  },
);
Container.displayName = "List";

/** Semantic heading region for list content */
const Header = React.forwardRef<HTMLElement, ListHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { styles: listStyles } = useListContext();

    return (
      <header
        ref={ref}
        {...props}
        className={cn(css.header, listStyles.header, className)}
        data-slot="header"
      >
        {children}
      </header>
    );
  },
);
Header.displayName = "List.Header";

/** Row of action buttons aligned to the right of a list item */
const ActionGroup = React.forwardRef<HTMLDivElement, ListActionGroupProps>(
  ({ justify = "start", children, className, ...props }, ref) => {
    const { styles: listStyles } = useListContext();

    return (
      <div
        ref={ref}
        {...props}
        className={cn(css["action-group"], listStyles.actionGroup, className)}
        data-slot="actionGroup"
        data-justify={justify}
      >
        {children}
      </div>
    );
  },
);
ActionGroup.displayName = "List.ActionGroup";

/** Horizontal separator between list sections */
const Divider = React.forwardRef<HTMLDivElement, ListDividerProps>(({ className, ...props }, ref) => {
  const { styles: listStyles } = useListContext();

  return (
    <FoldDivider
      ref={ref}
      {...props}
      className={cn(css.divider, listStyles.divider, className)}
      data-slot="divider"
    />
  );
});
Divider.displayName = "List.Divider";

/** Semantic footer region for list content */
const Footer = React.forwardRef<HTMLElement, ListFooterProps>(
  ({ children, className, ...props }, ref) => {
    const { styles: listStyles } = useListContext();

    return (
      <footer
        ref={ref}
        {...props}
        className={cn(css.footer, listStyles.footer, className)}
        data-slot="footer"
      >
        {children}
      </footer>
    );
  },
);
Footer.displayName = "List.Footer";

export { Container, Header, ActionGroup, Divider, Footer };
