"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { FocusScope } from "@react-aria/focus";
import { useOverlay } from "react-aria";
import { useFloating } from "../../floating/react/useFloating";
import { useFloatAnimation } from "../../floating/react/useFloatAnimation";
import { flip } from "../../floating/core/middleware/flip";
import { shift } from "../../floating/core/middleware/shift";
import { offset } from "../../floating/core/middleware/offset";
import type { Middleware } from "../../floating/core/types";
import { autoUpdate } from "../../floating/dom/autoUpdate";
import { cn } from "@/lib/cn";
import { type SlotStyle, createStylePropsResolver } from "@/lib/styles";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import css from "./Select.module.css";
import { useSelectContext } from "./Select";
import { GroupContext } from "../Group/group.context";
import { Scroll } from "../Scroll";
import { Input } from "../Input";
import { List } from "../List";
import { handleItemKeyDown, scrollItemIntoView, useItemPointerModality } from "./Select.shared";
import { useScrollLock } from "../../hooks/useScrollLock";
import type { CompletionController } from "@/hooks/useCompletion";

/**
 * Styles for the search anatomy rendered inside searchable content.
 * @typeDoc SelectContentSearchStyles
 */
export interface SelectContentSearchStyles {
  /** Styles the wrapper around the panel search input. */
  wrapper?: SlotStyle;

  /** Styles the panel search input surface. */
  input?: SlotStyle;
}

/**
 * Styles for the option-list anatomy rendered inside the panel.
 * @typeDoc SelectContentListStyles
 */
export interface SelectContentListStyles {
  /** Styles the element that groups the rendered options. */
  root?: SlotStyle;

  /** Styles the padding wrapper around the option list. */
  padding?: SlotStyle;
}

/**
 * Named style slots for the Select.Content anatomy.
 * @typeDoc SelectContentStyleSlots
 */
export interface SelectContentStyleSlots {
  /** Styles the listbox panel. */
  root?: SlotStyle;

  /** Styles the positioned floating overlay. */
  overlay?: SlotStyle;

  /** Styles the search.wrapper and search.input anatomy. */
  search?: SelectContentSearchStyles;

  /** Styles the live empty-results message. */
  empty?: SlotStyle;

  /** Styles the list.root and list.padding anatomy. */
  list?: SelectContentListStyles;
}

/**
 * Style overrides for Select.Content's root and named anatomy slots.
 * @typeDoc SelectContentStylesProp
 */
export type SelectContentStylesProp = SelectContentStyleSlots;

/** Side relationship between the option panel and its trigger. */
export type SelectContentPosition = "overlay" | "top" | "bottom";

/** Cross-axis alignment of the option panel relative to its trigger. */
export type SelectContentAlign = "start" | "center" | "end";

export interface SelectContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "align"> {
  /**
   * Adds classes to the portalled listbox panel before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Renders an auto-focused search input inside the panel and shows emptyContent when no
   * registered item matches the query.
   * @category Content
   * @default false
   */
  searchable?: boolean;

  /**
   * Sets the built-in search input placeholder when searchable is enabled.
   * @category Content
   * @default "Search items..."
   */
  searchPlaceholder?: string;

  /**
   * Runs after the built-in search input changes, with the current query. Filtering still happens
   * inside Select; this callback only observes it.
   * @category Events
   */
  onSearch?: (value: string) => void;

  /**
   * Replaces the polite empty-results message announced by searchable content.
   * @category Content
   * @default "No results found."
   */
  emptyContent?: React.ReactNode;

  /**
   * Positions the panel over the trigger with the active option vertically matched to the trigger
   * text, or against the trigger's top or bottom edge.
   * @category Layout
   * @default "overlay"
   */
  position?: SelectContentPosition;

  /**
   * Aligns a top- or bottom-positioned panel against the trigger along its horizontal axis.
   * Overlay panels instead align the selected item's text directly with the trigger text.
   * @category Layout
   * @default "start"
   */
  align?: SelectContentAlign;

  /**
   * Styles panel anatomy: root, overlay, search.wrapper, search.input, empty, list.root, and
   * list.padding.
   * @category Styling
   * @typeDoc SelectContentStyleSlots
   */
  styles?: SelectContentStylesProp;

  /**
   * Turns the panel into a completion menu for a text field managed by useCompletion. The panel
   * anchors to the completion origin, filters by the typed query, and takes keyboard input from
   * the field without moving focus. Control visibility with Select's state.open.
   * @category Core
   * @typeDoc CompletionController
   */
  completion?: CompletionController;
}

const resolveSelectContentStyles = createStylePropsResolver([
  "root",
  "overlay",
  "search.wrapper",
  "search.input",
  "empty",
  "list.root",
  "list.padding",
] as const);

function getTextOrigin(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  if (element instanceof HTMLInputElement) {
    const style = getComputedStyle(element);
    return {
      x:
        rect.left +
        (Number.parseFloat(style.borderLeftWidth) || 0) +
        (Number.parseFloat(style.paddingLeft) || 0),
      y:
        rect.top +
        (Number.parseFloat(style.borderTopWidth) || 0) +
        (Number.parseFloat(style.paddingTop) || 0),
    };
  }

  // Flex alignment can place two identical line boxes on opposite sides of a
  // device-pixel boundary even when their element rectangles appear aligned.
  // Measure the rendered text itself so the overlay matches the visible glyph
  // origin rather than the surrounding span's box.
  const nodeFilter = element.ownerDocument.defaultView?.NodeFilter;
  if (nodeFilter) {
    const walker = element.ownerDocument.createTreeWalker(element, nodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();

    while (textNode && !textNode.textContent?.trim()) {
      textNode = walker.nextNode();
    }

    if (textNode) {
      const range = element.ownerDocument.createRange();
      range.selectNodeContents(textNode);
      const textRect = range.getBoundingClientRect();

      if (textRect.width || textRect.height) {
        return { x: textRect.left, y: textRect.top };
      }
    }
  }

  return { x: rect.left, y: rect.top };
}

function getContentOrigin(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    x:
      rect.left +
      (Number.parseFloat(style.borderLeftWidth) || 0) +
      (Number.parseFloat(style.paddingLeft) || 0),
    y:
      rect.top +
      (Number.parseFloat(style.borderTopWidth) || 0) +
      (Number.parseFloat(style.paddingTop) || 0),
  };
}

const alignOverlayTarget = (
  target: "item" | "search" | "search-value" | "search-multiple",
): Middleware => ({
  name: "selectAlignOverlayTarget",
  async fn(state) {
    const { elements, middlewareData } = state;
    if (middlewareData.selectAlignOverlayTarget?.fallback) return {};
    const reference = elements.reference as HTMLElement;
    const floating = elements.floating as HTMLElement;
    const triggerText = reference.querySelector<HTMLElement>("[data-select-trigger-text]");
    const triggerValue = reference.querySelector<HTMLElement>("[data-select-trigger-value]");
    const selectedItem =
      target === "item"
        ? (floating.querySelector<HTMLElement>('[role="option"][aria-selected="true"]') ??
          floating.querySelector<HTMLElement>('[role="option"]:not([aria-hidden="true"])'))
        : null;
    const overlayText =
      target === "search" || target === "search-value"
        ? floating.querySelector<HTMLElement>("[data-select-content-search-input]")
        : selectedItem?.querySelector<HTMLElement>("[data-select-item-text]");

    let coordinates: { x: number; y: number };
    if (target === "search-multiple") {
      const searchSlot = floating.querySelector<HTMLElement>("[data-select-content-search-anchor]");
      if (!triggerValue || !searchSlot) return {};

      const triggerRect = triggerValue.getBoundingClientRect();
      const searchSlotRect = searchSlot.getBoundingClientRect();
      const floatingRect = floating.getBoundingClientRect();
      coordinates = {
        x: triggerRect.left - (searchSlotRect.left - floatingRect.left),
        y: triggerRect.top - (searchSlotRect.top - floatingRect.top),
      };
    } else {
      if ((!triggerText && !triggerValue) || !overlayText) return {};

      const triggerOrigin =
        target === "search-value" && triggerValue
          ? getContentOrigin(triggerValue)
          : triggerText
            ? getTextOrigin(triggerText)
            : null;
      if (!triggerOrigin) {
        return { data: { fallback: true }, reset: { placement: state.initialPlacement } };
      }
      const overlayOrigin = getTextOrigin(overlayText);
      const floatingRect = floating.getBoundingClientRect();
      coordinates = {
        x: triggerOrigin.x - (overlayOrigin.x - floatingRect.left),
        y: triggerOrigin.y - (overlayOrigin.y - floatingRect.top),
      };
    }

    // Text alignment can move the panel left of the trigger. Include that
    // displacement in its minimum width so the opposite edge stays covered.
    const referenceRect = reference.getBoundingClientRect();
    const minWidth = referenceRect.width + Math.max(0, referenceRect.left - coordinates.x);
    floating.style.minWidth = `${Math.min(minWidth, Number.parseFloat(floating.style.maxWidth) || Infinity)}px`;
    const dimensions = await state.platform.getDimensions(floating);
    if (
      dimensions.width !== state.rects.floating.width ||
      dimensions.height !== state.rects.floating.height
    ) {
      return { ...coordinates, reset: { rects: true } };
    }

    const overflow = await state.platform.detectOverflow(
      { ...state, ...coordinates },
      { boundary: [], rootBoundary: "viewport", padding: 0 },
    );
    if (Object.values(overflow).some((value) => value > 0)) {
      return { data: { fallback: true }, reset: { placement: state.initialPlacement } };
    }
    return coordinates;
  },
});

/** Floating panel that renders the list of selectable options */
const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      children,
      className,
      searchable = false,
      searchPlaceholder,
      onSearch,
      emptyContent = "No results found.",
      position = "bottom",
      align = "start",
      styles: stylesProp,
      completion,
      ...domProps
    },
    ref,
  ) => {
    const {
      isOpen,
      setIsOpen,
      setContentPlacement,
      triggerType,
      triggerSearchPlaceholder,
      triggerContent,
      mode,
      selectedKeys,
      onToggle,
      wrapperRef,
      contentRef,
      triggerRef,
      maxItems,
      triggerMode,
      searchValue,
      setSearchValue,
      filteredItems,
      navigateToNextItem,
      navigateToPrevItem,
      selectFocusedItem,
      setFocusedKey,
      focusedKey,
      mouseMoveDetectedRef,
      keyboardScrollIntentRef,
      markKeyboardNavigation,
      moveFocusFromTrigger,
      contentId,
      restoreFocus,
      rootStyle,
    } = useSelectContext();
    const groupContext = React.useContext(GroupContext);
    const [mounted, setMounted] = React.useState(false);
    const [contentElement, setContentElement] = React.useState<HTMLDivElement | null>(null);
    const floatingRootRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const focusFrameRef = React.useRef<number | null>(null);
    const justOpenedRef = React.useRef(false);
    const hasContentSearch = searchable || triggerType === "input";
    const resolvedSearchPlaceholder =
      searchPlaceholder ?? triggerSearchPlaceholder ?? "Search items...";
    const shouldMirrorTriggerValue =
      position === "overlay" &&
      hasContentSearch &&
      mode === "multiple" &&
      !!selectedKeys?.size &&
      triggerContent !== undefined;

    // Inside a Group the panel sizes and aligns to this segment, but clears the
    // Group's own padding and border so it sits below the whole control.
    const getOffset = () => {
      const group = groupContext?.groupRef?.current;
      const segment = wrapperRef.current;
      if (!group || !segment) return 4;
      const groupRect = group.getBoundingClientRect();
      const segmentRect = segment.getBoundingClientRect();
      return Math.max(groupRect.bottom - segmentRect.bottom, segmentRect.top - groupRect.top) + 6;
    };
    const getAnchor = () => wrapperRef.current;

    const side = position === "top" ? "top" : "bottom";
    const requestedPlacement = align === "center" ? side : (`${side}-${align}` as const);
    const { refs, floatingStyles, x, y, placement, update, isPositioned, middlewareData } =
      useFloating({
        placement: requestedPlacement,
        // Keep the panel anchored to viewport-fixed/sticky triggers without scroll lag.
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        // The panel stays portalled and hidden while closed, so tracking has to
        // be gated on the open state rather than on the mount.
        open: isOpen,
        middleware: [
          ...(position === "overlay"
            ? [
                alignOverlayTarget(
                  shouldMirrorTriggerValue
                    ? "search-multiple"
                    : hasContentSearch
                      ? triggerType === "input"
                        ? "search"
                        : "search-value"
                      : "item",
                ),
              ]
            : []),
          ...[
            offset(getOffset),
            flip({
              padding: 8,
              fallbackPlacements: [
                align === "center"
                  ? side === "top"
                    ? "bottom"
                    : "top"
                  : `${side === "top" ? "bottom" : "top"}-${align}`,
              ],
            }),
            shift({ padding: 8 }),
          ].map((middleware): Middleware => ({
            ...middleware,
            fn: (state) =>
              position !== "overlay" || state.middlewareData.selectAlignOverlayTarget?.fallback
                ? middleware.fn(state)
                : {},
          })),
          {
            name: "selectViewportSize",
            async fn(state) {
              if (!isOpen) return {};

              const overflow = await state.platform.detectOverflow(state, {
                boundary: [],
                rootBoundary: "viewport",
                padding:
                  position === "overlay" && !state.middlewareData.selectAlignOverlayTarget?.fallback
                    ? 0
                    : 8,
              });
              const floating = state.elements.floating as HTMLElement;
              const panel = floating.firstElementChild as HTMLElement | null;
              const { width, height } = state.rects.floating;
              const viewportMaxWidth = Math.max(0, width - overflow.left - overflow.right);
              const configuredMaxWidth = Number.parseFloat(floating.style.maxWidth);
              floating.style.maxWidth = `${Math.min(
                Number.isFinite(configuredMaxWidth) ? configuredMaxWidth : viewportMaxWidth,
                viewportMaxWidth,
              )}px`;
              // A viewport narrower than the trigger must take precedence over min-width.
              floating.style.minWidth = `${Math.min(Number.parseFloat(floating.style.minWidth) || state.rects.reference.width, Number.parseFloat(floating.style.maxWidth))}px`;
              if (panel) {
                panel.style.maxHeight = `${Math.max(0, height - overflow[state.placement.startsWith("top") ? "top" : "bottom"])}px`;
                panel.style.overflowY = "auto";
              }
              const dimensions = await state.platform.getDimensions(floating);
              return dimensions.width !== width || dimensions.height !== height
                ? { reset: { rects: true } }
                : {};
            },
          },
        ],
      });

    React.useLayoutEffect(() => {
      const anchor = getAnchor();
      if (contentElement && isOpen && anchor) {
        const floating = floatingRootRef.current;
        if (!floating) return;
        const referenceWidth = completion ? 0 : anchor.getBoundingClientRect().width;

        const rootFontSize =
          Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        // Reasonable cap so a long option can't stretch the panel across the
        // screen; the trigger's own width still wins if it's already wider.
        const reasonableMaxWidth = rootFontSize * 20;

        // Let the browser size the panel to its own content. Option rows are
        // intrinsically wider than the trigger — every single-mode row reserves
        // the selected-state indicator the trigger never renders — so a measured
        // trigger-relative width truncates them. max-content fits the widest row
        // (indicator included); minWidth floors it at the trigger, maxWidth caps
        // the growth, and selectViewportSize still clamps both to the viewport.
        floating.style.width = "max-content";
        floating.style.minWidth = `${referenceWidth}px`;
        floating.style.maxWidth = `${Math.max(referenceWidth, reasonableMaxWidth)}px`;
        contentElement.style.width = "100%";
        contentElement.style.minWidth = "";
        update();
      }
    }, [completion, contentElement, isOpen, update, wrapperRef]);

    React.useLayoutEffect(() => {
      const floating = floatingRootRef.current;
      const triggerText = wrapperRef.current?.querySelector<HTMLElement>(
        "[data-select-trigger-text]",
      );
      if (position !== "overlay" || !isOpen || !floating || !triggerText) return;

      const typography = getComputedStyle(triggerText);
      floating.style.setProperty("--select-overlay-font-family", typography.fontFamily);
      floating.style.setProperty("--select-overlay-font-size", typography.fontSize);
      floating.style.setProperty("--select-overlay-font-weight", typography.fontWeight);
      floating.style.setProperty("--select-overlay-letter-spacing", typography.letterSpacing);
      floating.style.setProperty("--select-overlay-line-height", typography.lineHeight);
      update();

      return () => {
        floating.style.removeProperty("--select-overlay-font-family");
        floating.style.removeProperty("--select-overlay-font-size");
        floating.style.removeProperty("--select-overlay-font-weight");
        floating.style.removeProperty("--select-overlay-letter-spacing");
        floating.style.removeProperty("--select-overlay-line-height");
      };
    }, [contentElement, isOpen, position, update, wrapperRef]);

    React.useLayoutEffect(() => {
      const reference = completion?.anchor ?? getAnchor();
      if (reference) {
        refs.setReference(reference);
      }
    }, [refs, completion?.anchor, wrapperRef.current]);

    const completionQuery = completion?.query;
    React.useEffect(() => {
      if (completionQuery === undefined) return;
      setSearchValue(completionQuery);
    }, [completionQuery, setSearchValue]);

    React.useEffect(() => {
      if (!completion || !isOpen) return;
      setFocusedKey(filteredItems.find((item) => !item.isDisabled)?.key ?? null);
    }, [completion?.query, filteredItems.length, isOpen]);

    React.useEffect(() => {
      if (!completion) return;
      return completion.register({
        move: (direction) => {
          markKeyboardNavigation();
          if (direction === 1) navigateToNextItem();
          else navigateToPrevItem();
        },
        confirm: () => {
          if (focusedKey === null) return false;
          selectFocusedItem();
          return true;
        },
      });
    }, [
      completion?.register,
      focusedKey,
      markKeyboardNavigation,
      navigateToNextItem,
      navigateToPrevItem,
      selectFocusedItem,
    ]);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      setContentPlacement(placement.startsWith("top") ? "top" : "bottom");
    }, [placement, setContentPlacement]);

    React.useEffect(() => {
      if (isOpen && hasContentSearch && inputRef.current) {
        focusFrameRef.current = requestAnimationFrame(() => {
          inputRef.current?.focus({ preventScroll: true });
        });
      }
      return () => {
        if (focusFrameRef.current !== null) {
          cancelAnimationFrame(focusFrameRef.current);
          focusFrameRef.current = null;
        }
      };
    }, [hasContentSearch, isOpen]);

    React.useEffect(() => {
      const shouldKeepTriggerFocus =
        triggerType === "input" || triggerRef.current?.tagName === "INPUT";

      if (completion) return;

      if (isOpen && !hasContentSearch && shouldKeepTriggerFocus) {
        focusFrameRef.current = requestAnimationFrame(() => {
          triggerRef.current?.focus({ preventScroll: true });
        });
      }

      if (isOpen && !hasContentSearch && contentElement && !shouldKeepTriggerFocus) {
        focusFrameRef.current = requestAnimationFrame(() => {
          contentElement?.focus({ preventScroll: true });
        });
      }
      return () => {
        if (focusFrameRef.current !== null) {
          cancelAnimationFrame(focusFrameRef.current);
          focusFrameRef.current = null;
        }
      };
    }, [completion, isOpen, hasContentSearch, contentElement, triggerRef, triggerType]);

    useItemPointerModality({
      isOpen,
      mouseMoveDetectedRef,
    });

    useScrollLock(isOpen && !completion, contentElement);

    React.useEffect(() => {
      if (isOpen) {
        justOpenedRef.current = true;
      }
    }, [isOpen]);

    React.useEffect(() => {
      if (!isOpen || focusedKey === null || !contentElement) return;

      const activeItem = contentElement.querySelector(
        '[role="option"][data-focused="true"], [role="option"][data-highlighted="true"]',
      ) as HTMLElement | null;
      if (!activeItem) return;

      if (justOpenedRef.current) {
        justOpenedRef.current = false;
        scrollItemIntoView(activeItem, "instant");
        update();
        keyboardScrollIntentRef.current = false;
        return;
      }

      if (!keyboardScrollIntentRef.current || mouseMoveDetectedRef.current) return;

      scrollItemIntoView(activeItem);
      keyboardScrollIntentRef.current = false;
    }, [contentElement, focusedKey, isOpen, keyboardScrollIntentRef, mouseMoveDetectedRef, update]);

    const setSharedContentRef = React.useCallback(
      (element: HTMLDivElement | null) => {
        contentRef.current = element;
      },
      [contentRef],
    );
    const mergedContentRef = useMergeRefs<HTMLDivElement>(
      setContentElement,
      setSharedContentRef,
      ref,
    );
    const mergedFloatingRef = React.useCallback(
      (el: HTMLDivElement | null) => {
        floatingRootRef.current = el;
        refs.setFloating(el);
      },
      [refs],
    );

    const closeContent = React.useCallback(() => {
      setIsOpen(false);
      setSearchValue("");
      restoreFocus();
    }, [restoreFocus, setIsOpen, setSearchValue]);

    // Join React Aria's overlay stack so an enclosing overlay (Modal, Popover)
    // sees this listbox as topmost and leaves Escape to it. Select still owns its
    // Escape and outside-press handling, so only stack membership is used here.
    useOverlay({ isOpen, onClose: closeContent, isKeyboardDismissDisabled: true }, contentRef);

    const handleTabNavigation = React.useCallback(
      (e: React.KeyboardEvent) => {
        e.preventDefault();
        const direction = e.shiftKey ? -1 : 1;
        setIsOpen(false);
        setSearchValue("");
        requestAnimationFrame(() => {
          moveFocusFromTrigger(direction as 1 | -1);
        });
      },
      [moveFocusFromTrigger, setIsOpen, setSearchValue],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Tab") {
          handleTabNavigation(e);
          return;
        }

        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
          markKeyboardNavigation();
        }

        const handled = handleItemKeyDown(e, {
          navigateNext: navigateToNextItem,
          navigatePrev: navigateToPrevItem,
          confirm: selectFocusedItem,
          close: closeContent,
          filteredItems,
          setFocusedKey,
        });
        if (!handled) {
          keyboardScrollIntentRef.current = false;
        }
      },
      [
        closeContent,
        filteredItems,
        handleTabNavigation,
        keyboardScrollIntentRef,
        markKeyboardNavigation,
        navigateToNextItem,
        navigateToPrevItem,
        selectFocusedItem,
        setFocusedKey,
      ],
    );

    const handleInputKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
          handleTabNavigation(e);
          return;
        }

        if (
          e.key === "Backspace" &&
          !e.nativeEvent.isComposing &&
          searchValue.length === 0 &&
          mode === "multiple" &&
          selectedKeys?.size
        ) {
          const lastSelectedKey = Array.from(selectedKeys).at(-1);
          if (lastSelectedKey !== undefined) {
            e.preventDefault();
            onToggle?.(lastSelectedKey);
            return;
          }
        }

        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
          markKeyboardNavigation();
        }

        const handled = handleItemKeyDown(e, {
          navigateNext: navigateToNextItem,
          navigatePrev: navigateToPrevItem,
          confirm: selectFocusedItem,
          close: closeContent,
          filteredItems,
          setFocusedKey,
        });
        if (!handled) {
          keyboardScrollIntentRef.current = false;
        }
      },
      [
        closeContent,
        filteredItems,
        handleTabNavigation,
        keyboardScrollIntentRef,
        markKeyboardNavigation,
        mode,
        navigateToNextItem,
        navigateToPrevItem,
        onToggle,
        searchValue,
        selectedKeys,
        selectFocusedItem,
        setFocusedKey,
      ],
    );

    React.useEffect(() => {
      if (!isOpen || triggerMode === "hover") return;

      const handlePointerDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isClickInside =
          wrapperRef.current?.contains(target) ||
          floatingRootRef.current?.contains(target) ||
          Array.from(document.querySelectorAll("[data-select-submenu-content]")).some((el) =>
            el.contains(target),
          );

        if (!isClickInside) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handlePointerDown);
      return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [isOpen, triggerMode, wrapperRef, setIsOpen]);

    const showContent = isOpen && isPositioned;

    const { animationStyles } = useFloatAnimation({
      element: contentElement,
      open: isOpen,
      isPositioned,
      placement,
      skipExitAnimation: true,
    });
    const isOverlayAlignmentValid =
      position === "overlay" && !middlewareData.selectAlignOverlayTarget?.fallback;
    const resolvedAnimationStyles = isOverlayAlignmentValid
      ? ({ opacity: 1, transform: "none", transition: "none", pointerEvents: "auto" } as const)
      : animationStyles;

    if (!mounted) return null;

    const resolved = resolveSelectContentStyles(stylesProp);
    const shouldConstrainListHeight = filteredItems.length > maxItems;
    const scrollMaxHeight = shouldConstrainListHeight
      ? `calc(${maxItems} * 36px + 8px)`
      : undefined;
    const hasResults = filteredItems.length > 0;
    const shouldShowEmptyState = (hasContentSearch || !!completion) && !hasResults;

    const listContent = (
      <div
        className={cn(css["list-padding"], resolved["list.padding"].className)}
        style={{
          display: shouldShowEmptyState ? "none" : undefined,
          ...resolved["list.padding"].style,
        }}
        data-slot="list.padding"
        aria-hidden={shouldShowEmptyState || undefined}
        onMouseLeave={() => setFocusedKey(null)}
      >
        {/* The panel is already the listbox; the inner collection must not nest a second one. */}
        <List
          role="presentation"
          layout="spaced"
          gap="xs"
          className={resolved["list.root"].className}
          style={resolved["list.root"].style}
        >
          {children}
        </List>
      </div>
    );

    const bodyContent = (
      <React.Fragment key="body">
        {shouldConstrainListHeight ? (
          <Scroll
            className="viewport"
            max-height={scrollMaxHeight}
            direction="vertical"
            fade-y={!hasContentSearch}
            inline
            hide={false}
          >
            {listContent}
          </Scroll>
        ) : (
          listContent
        )}
      </React.Fragment>
    );

    const searchContent = hasContentSearch ? (
      <div
        key="search"
        className={cn(
          "search-content-input",
          css["search-wrapper"],
          css["search-content-input"],
          resolved["search.wrapper"].className,
        )}
        style={resolved["search.wrapper"].style}
        data-slot="search.wrapper"
        data-mode={mode}
        data-trigger-type={triggerType}
        data-mirror-value={shouldMirrorTriggerValue ? "true" : undefined}
        data-select-content-search-anchor
      >
        {shouldMirrorTriggerValue && (
          <div className={css["search-mirrored-value"]}>{triggerContent}</div>
        )}
        <Input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            onSearch?.(e.target.value);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={resolvedSearchPlaceholder}
          variant="ghost"
          className={cn("search-input", resolved["search.input"].className)}
          style={resolved["search.input"].style}
          data-select-content-search-input
        />
      </div>
    ) : null;

    const emptyStateContent = shouldShowEmptyState ? (
      <div
        key="empty-state"
        className={cn("empty-state", css["empty-state"], resolved.empty.className)}
        style={resolved.empty.style}
        data-slot="empty"
        role="status"
        aria-live="polite"
      >
        {emptyContent}
      </div>
    ) : null;

    const panelContent = placement.startsWith("top")
      ? [bodyContent, emptyStateContent, searchContent]
      : [searchContent, emptyStateContent, bodyContent];

    return createPortal(
      <FocusScope>
        <div
          ref={mergedFloatingRef}
          className={cn("select", css["content-root"], resolved.overlay.className)}
          data-slot="overlay"
          data-mode={mode}
          data-position={position}
          data-align={align}
          style={{
            ...rootStyle,
            ...resolved.overlay.style,
            ...floatingStyles,
            ...(position === "overlay"
              ? { left: x ?? 0, top: y ?? 0, transform: "none" }
              : undefined),
            zIndex: 50000,
            visibility: showContent ? "visible" : "hidden",
            display: isOpen ? "block" : "none",
          }}
        >
          <div
            ref={mergedContentRef}
            id={contentId}
            role="listbox"
            aria-multiselectable={mode === "multiple" ? true : undefined}
            className={cn("content", css.content, className, resolved.root.className)}
            data-slot="root"
            data-state={showContent ? "open" : "closed"}
            data-placement={placement.split("-")[0]}
            data-position={position}
            data-align={align}
            tabIndex={-1}
            {...domProps}
            onKeyDown={(event) => {
              domProps.onKeyDown?.(event);
              if (!event.defaultPrevented) handleKeyDown(event);
            }}
            style={{
              ...resolved.root.style,
              ...domProps.style,
              ...resolvedAnimationStyles,
            }}
          >
            {panelContent}
          </div>
        </div>
      </FocusScope>,
      document.body,
    );
  },
);
SelectContent.displayName = "Select.Content";

export type SearchableContentProps = Omit<SelectContentProps, "searchable">;

/** Dropdown panel with a built-in search input for filtering the option list */
const SearchableContent = React.forwardRef<HTMLDivElement, SearchableContentProps>((props, ref) => (
  <SelectContent {...props} searchable ref={ref} />
));
SearchableContent.displayName = "Select.SearchableContent";

export { SelectContent, SearchableContent };
