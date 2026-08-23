"use client";

import React from "react";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useListContext, ListItemContext } from "./list.context";
import { ListItemProps } from "./list.types";
import css from "./List.module.css";
import { focusAdjacentTabStop } from "@/utils/list-navigation";
import { getListItemSlot } from "./list.item-layout";
import { Actions } from "./List.Actions";
import { resolveListItemStyles } from "./list.styles";

type ListItemDOMProps = React.HTMLAttributes<HTMLDivElement> & {
  "data-disabled"?: boolean | "true" | "false";
  "data-focused"?: string;
  "data-focus-visible"?: string;
  "data-highlighted"?: string;
};

const NESTED_INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="switch"]',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const PRIMARY_ACTION_SELECTOR = '[data-list-primary-action="true"]';
const ACTIONS_SELECTOR = "[data-actions]";
const ACTIVATABLE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="radio"]',
  '[role="switch"]',
].join(", ");

function isDisabledElement(element: HTMLElement) {
  if (element.matches(":disabled")) return true;

  return (
    element.getAttribute("aria-disabled") === "true" ||
    element.getAttribute("data-disabled") === "true"
  );
}

function isEditableElement(element: HTMLElement) {
  if (element instanceof HTMLTextAreaElement || element.isContentEditable) {
    return true;
  }

  if (element instanceof HTMLInputElement) {
    const type = (element.type || "text").toLowerCase();
    if (type === "checkbox" || type === "radio") {
      return false;
    }

    return true;
  }

  const role = element.getAttribute("role");
  return role === "textbox" || role === "searchbox" || role === "spinbutton";
}

function isEligibleActivatableElement(element: HTMLElement) {
  if (isDisabledElement(element) || isEditableElement(element)) {
    return false;
  }

  if (element instanceof HTMLInputElement) {
    if (element.readOnly) return false;

    const type = (element.type || "text").toLowerCase();
    return type === "checkbox" || type === "radio" || element.getAttribute("role") === "combobox";
  }

  if (
    element instanceof HTMLButtonElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLAnchorElement
  ) {
    return true;
  }

  const role = element.getAttribute("role");
  return (
    role === "button" ||
    role === "checkbox" ||
    role === "combobox" ||
    role === "radio" ||
    role === "switch"
  );
}

function getEligibleActivatableDescendants(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(ACTIVATABLE_SELECTOR)).filter(
    (element) => !element.closest(ACTIONS_SELECTOR) && isEligibleActivatableElement(element),
  );
}

function resolveExplicitPrimaryTarget(element: HTMLElement) {
  if (isDisabledElement(element) || isEditableElement(element)) {
    return null;
  }

  const descendants = getEligibleActivatableDescendants(element);
  if (descendants.length === 1) {
    return descendants[0]!;
  }

  if (descendants.length > 1) {
    return null;
  }

  return element;
}

/** A single interactive row in the list */
const Item = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      value,
      children,
      className,
      focusable = true,
      interactive,
      selected,
      styles: stylesProp,
      actions,
      tabIndex: tabIndexProp,
      onMouseEnter,
      ...props
    },
    ref,
  ) => {
    const {
      focusedItem,
      isFocusMode,
      orientation,
      rootRef,
      styles: listStyles,
      setFocusedItem,
      focusAdjacentItem,
      focusBoundaryItem,
    } = useListContext();
    const itemRef = React.useRef<HTMLDivElement>(null);
    const mergedItemRef = useMergeRefs(itemRef, ref);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const isHighlighted = isFocusMode && focusedItem === itemRef.current;

    const resolvedStyles = resolveListItemStyles(stylesProp);
    const domProps = props as ListItemDOMProps;
    const {
      onBlur: onBlurProp,
      onClick: onClickProp,
      onFocus: onFocusProp,
      onKeyDown: onKeyDownProp,
      ...restDomProps
    } = domProps;
    const dataFocused = domProps["data-focused"];
    const dataFocusVisible = domProps["data-focus-visible"];
    const dataHighlighted = domProps["data-highlighted"];
    const isDisabled =
      domProps["aria-disabled"] === true ||
      domProps["aria-disabled"] === "true" ||
      domProps["data-disabled"] === true ||
      domProps["data-disabled"] === "true";
    const tabIndex = tabIndexProp ?? (focusable ? (isDisabled ? -1 : 0) : undefined);
    const hasRowClickAction = typeof onClickProp === "function";
    const itemChildren = React.Children.toArray(children);
    const childSlots = itemChildren.map(getListItemSlot);
    const hasActionsChild = itemChildren.some(
      (child) => React.isValidElement(child) && child.type === Actions,
    );
    const shouldAppendActions = Boolean(actions?.length) && !hasActionsChild;
    const lastLeadingIndex = childSlots.lastIndexOf("leading");
    const firstTrailingIndex = childSlots.indexOf("trailing");
    const hasStructuralSlots =
      lastLeadingIndex >= 0 || firstTrailingIndex >= 0 || shouldAppendActions;
    const leadingCount = lastLeadingIndex + 1;
    const trailingStart = firstTrailingIndex >= 0 ? firstTrailingIndex : itemChildren.length;
    const contentCount = Math.max(0, trailingStart - leadingCount);
    const trailingCount = itemChildren.length - trailingStart + (shouldAppendActions ? 1 : 0);
    const hasTrailing = trailingCount > 0;
    const hasLeading = leadingCount > 0;
    const hasContent = contentCount > 0;
    const layoutColumns = hasStructuralSlots
      ? [
          hasLeading ? `repeat(${leadingCount}, auto)` : "",
          !hasContent && hasTrailing ? "minmax(0, 1fr)" : "",
          hasContent ? `repeat(${contentCount}, minmax(0, 1fr))` : "",
          hasTrailing ? `repeat(${trailingCount}, auto)` : "",
        ]
          .filter(Boolean)
          .join(" ")
      : undefined;
    const isFocusWithinRow = React.useCallback(
      (element: EventTarget | null) =>
        element instanceof Node && itemRef.current?.contains(element),
      [],
    );
    const getPrimaryActionTarget = React.useCallback(() => {
      const item = itemRef.current;
      if (!item || isDisabled) return null;

      if (hasRowClickAction) {
        return item;
      }

      const explicitTargets = Array.from(
        item.querySelectorAll<HTMLElement>(PRIMARY_ACTION_SELECTOR),
      )
        .filter((element) => !element.closest(ACTIONS_SELECTOR))
        .map(resolveExplicitPrimaryTarget)
        .filter((element): element is HTMLElement => element !== null);

      if (explicitTargets.length === 1) {
        return explicitTargets[0];
      }

      if (explicitTargets.length > 1) {
        return null;
      }

      const fallbackTargets = getEligibleActivatableDescendants(item);
      return fallbackTargets.length === 1 ? fallbackTargets[0]! : null;
    }, [hasRowClickAction, isDisabled]);
    const itemProps = mergeProps(restDomProps, focusProps, {
      onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
        onFocusProp?.(event);
        if (event.defaultPrevented) return;
        if (!focusable || isDisabled) return;
        const isRowReceivingFocus = event.target === event.currentTarget;
        if (!isRowReceivingFocus && isFocusWithinRow(event.relatedTarget)) return;
        setFocusedItem(event.currentTarget, { enterFocusMode: true });
      },
      onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
        onBlurProp?.(event);
        if (event.defaultPrevented) return;
        if (!focusable || isDisabled) return;
        if (isFocusWithinRow(event.relatedTarget)) return;
        if (focusedItem === event.currentTarget) {
          setFocusedItem(null, { enterFocusMode: false });
        }
      },
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target instanceof Node && !event.currentTarget.contains(event.target)) return;

        const interactiveTarget = (event.target as HTMLElement).closest(
          NESTED_INTERACTIVE_SELECTOR,
        );
        if (interactiveTarget && interactiveTarget !== itemRef.current) return;

        if (isDisabled) return;
        onClickProp?.(event);
        if (event.defaultPrevented) return;

        if (!focusable || isDisabled || !itemRef.current) return;
        itemRef.current.focus({ preventScroll: true });
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDownProp?.(event);
        if (event.defaultPrevented) return;
        if (event.currentTarget !== event.target || isDisabled) return;

        switch (event.key) {
          case "ArrowDown":
            if (orientation !== "vertical") return;
            event.preventDefault();
            focusAdjacentItem(event.currentTarget, 1);
            return;
          case "ArrowUp":
            if (orientation !== "vertical") return;
            event.preventDefault();
            focusAdjacentItem(event.currentTarget, -1);
            return;
          case "ArrowRight":
            if (orientation !== "horizontal") return;
            event.preventDefault();
            focusAdjacentItem(event.currentTarget, 1);
            return;
          case "ArrowLeft":
            if (orientation !== "horizontal") return;
            event.preventDefault();
            focusAdjacentItem(event.currentTarget, -1);
            return;
          case "Home":
            event.preventDefault();
            focusBoundaryItem("first");
            return;
          case "End":
            event.preventDefault();
            focusBoundaryItem("last");
            return;
          case "Enter":
          case " ": {
            const activationTarget = getPrimaryActionTarget();
            if (!activationTarget) {
              if (event.key === " ") {
                event.preventDefault();
              }
              return;
            }

            event.preventDefault();
            activationTarget.click();
            return;
          }
          case "Tab": {
            const direction = event.shiftKey ? -1 : 1;
            const movedToRow = focusAdjacentItem(
              event.currentTarget,
              direction as 1 | -1,
              true,
              false,
            );
            if (movedToRow) {
              event.preventDefault();
              return;
            }

            const movedOutsideList = focusAdjacentTabStop(
              event.currentTarget,
              direction as 1 | -1,
              rootRef.current,
            );
            if (movedOutsideList) {
              event.preventDefault();
            }
            return;
          }
          default:
            return;
        }
      },
      onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseEnter?.(event);
      },
    });

    const itemContextValue = React.useMemo(
      () => ({ actions, styles: resolvedStyles }),
      [actions, resolvedStyles],
    );

    return (
      <ListItemContext.Provider value={itemContextValue}>
        <div
          ref={mergedItemRef}
          {...itemProps}
          role="option"
          aria-selected={selected ? "true" : "false"}
          tabIndex={tabIndex}
          className={cn(
            "item",
            css.item,
            listStyles.item.root,
            className,
            resolvedStyles.root,
          )}
          data-slot="item"
          data-list-focus-owner="true"
          data-focused={dataFocused ?? (isFocused ? "true" : "false")}
          data-focus-visible={dataFocusVisible ?? (isFocusVisible ? "true" : "false")}
          data-highlighted={dataHighlighted ?? (isHighlighted ? "true" : "false")}
          data-value={value}
          data-interactive={interactive ? "true" : undefined}
          data-selected={selected ? "true" : undefined}
          data-list-layout={hasStructuralSlots ? "columns" : undefined}
          style={{
            ...itemProps.style,
            gridTemplateColumns: layoutColumns,
          }}
        >
          {children}
          {shouldAppendActions && <Actions />}
        </div>
      </ListItemContext.Provider>
    );
  },
);
Item.displayName = "List.Item";

export { Item };
