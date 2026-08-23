"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useFloating } from "../../hooks/useFloat/react/useFloating";
import { useFloatAnimation } from "../../hooks/useFloat/react/useFloatAnimation";
import { flip } from "../../hooks/useFloat/core/middleware/flip";
import { offset } from "../../hooks/useFloat/core/middleware/offset";
import { autoUpdate } from "../../hooks/useFloat/dom/autoUpdate";
import { cn } from "@/lib/utils";
import { type SlotStyle, createStylePropsResolver } from "@/lib/styles";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import css from "./Select.module.css";
import { useSelectContext } from "./Select";
import { GroupContext } from "../Group/Group.Context";
import { Scroll } from "../Scroll";
import { Input } from "../Input";
import { List } from "../List";
import { handleListKeyDown, scrollItemIntoView, useListPointerModality } from "./Select.shared";
import { useScrollLock } from "../../hooks/useScrollLock";

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

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * Styles panel anatomy: root, overlay, search.wrapper, search.input, empty, list.root, and
   * list.padding.
   * @category Styling
   * @typeDoc SelectContentStyleSlots
   */
  styles?: SelectContentStylesProp;
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

/** Floating panel that renders the list of selectable options */
const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      children,
      className,
      searchable = false,
      searchPlaceholder = "Search items...",
      onSearch,
      emptyContent = "No results found.",
      styles: stylesProp,
      ...domProps
    },
    ref,
  ) => {
    const {
      isOpen,
      setIsOpen,
      setContentPlacement,
      triggerType,
      mode,
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

    const offsetValue = groupContext?.isInGroup ? 4 : 2;

    const { refs, floatingStyles, x, y, placement } = useFloating({
      placement: "bottom-start",
      // Keep the panel anchored to viewport-fixed/sticky triggers without scroll lag.
      strategy: "fixed",
      whileElementsMounted: autoUpdate,
      // The panel stays portalled and hidden while closed, so tracking has to
      // be gated on the open state rather than on the mount.
      open: isOpen,
      middleware: [
        offset({
          mainAxis: offsetValue,
          crossAxis: groupContext?.isInGroup ? -1 : 0,
        }),
        flip({
          fallbackPlacements: ["top-start"],
        }),
      ],
    });

    React.useLayoutEffect(() => {
      if (contentElement && isOpen && wrapperRef.current) {
        const referenceWidth = wrapperRef.current.offsetWidth;
        const contentWidth = contentElement.scrollWidth;
        const width = Math.max(referenceWidth, contentWidth);
        contentElement.style.width = `${width}px`;
        contentElement.style.minWidth = `${referenceWidth}px`;
      }
    }, [contentElement, isOpen, wrapperRef]);

    const isPositioned = x !== null && y !== null;

    React.useLayoutEffect(() => {
      if (wrapperRef.current) {
        refs.setReference(wrapperRef.current);
      }
    }, [refs, wrapperRef.current]);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      setContentPlacement(placement.startsWith("top") ? "top" : "bottom");
    }, [placement, setContentPlacement]);

    React.useEffect(() => {
      if (isOpen && searchable && inputRef.current) {
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
    }, [isOpen, searchable]);

    React.useEffect(() => {
      const shouldKeepTriggerFocus =
        triggerType === "input" || triggerRef.current?.tagName === "INPUT";

      if (isOpen && !searchable && shouldKeepTriggerFocus) {
        focusFrameRef.current = requestAnimationFrame(() => {
          triggerRef.current?.focus({ preventScroll: true });
        });
      }

      if (isOpen && !searchable && contentElement && !shouldKeepTriggerFocus) {
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
    }, [isOpen, searchable, contentElement, triggerRef, triggerType]);

    useListPointerModality({
      isOpen,
      mouseMoveDetectedRef,
    });

    useScrollLock(isOpen, contentElement);

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
        keyboardScrollIntentRef.current = false;
        return;
      }

      if (!keyboardScrollIntentRef.current || mouseMoveDetectedRef.current) return;

      scrollItemIntoView(activeItem);
      keyboardScrollIntentRef.current = false;
    }, [contentElement, focusedKey, isOpen, keyboardScrollIntentRef, mouseMoveDetectedRef]);

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

        const handled = handleListKeyDown(e, {
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

        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
          markKeyboardNavigation();
        }

        const handled = handleListKeyDown(e, {
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
      open: isOpen,
      isPositioned,
      placement,
      skipExitAnimation: true,
    });

    if (!mounted) return null;

    const resolved = resolveSelectContentStyles(stylesProp);
    const shouldConstrainListHeight = filteredItems.length > maxItems;
    const scrollMaxHeight = shouldConstrainListHeight
      ? `calc(${maxItems} * 36px + 8px)`
      : undefined;
    const hasResults = filteredItems.length > 0;
    const shouldShowEmptyState = searchable && !hasResults;
    const shouldHideEmptySearchTriggerContent = triggerType === "input" && !hasResults;

    const listContent = (
      <div
        className={cn(css["list-padding"], resolved["list.padding"].className)}
        style={{
          display: shouldShowEmptyState ? "none" : undefined,
          ...resolved["list.padding"].style,
        }}
        data-slot="list.padding"
        aria-hidden={shouldShowEmptyState || undefined}
      >
        {/* The panel is already the listbox; the inner collection must not nest a second one. */}
        <List
          role="presentation"
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
            maxHeight={scrollMaxHeight}
            direction="vertical"
            fade-y={!searchable}
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

    const searchContent = searchable ? (
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
      >
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
          placeholder={searchPlaceholder}
          variant="ghost"
          className={cn("search-input", resolved["search.input"].className)}
          style={resolved["search.input"].style}
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
      <>
        <div
          ref={mergedFloatingRef}
          className={cn("select", css["content-root"], resolved.overlay.className)}
          data-slot="overlay"
          style={{
            ...rootStyle,
            ...resolved.overlay.style,
            ...floatingStyles,
            zIndex: 50000,
            visibility: showContent ? "visible" : "hidden",
            display: isOpen && !shouldHideEmptySearchTriggerContent ? "block" : "none",
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
            tabIndex={-1}
            {...domProps}
            onKeyDown={(event) => {
              domProps.onKeyDown?.(event);
              if (!event.defaultPrevented) handleKeyDown(event);
            }}
            style={{
              ...resolved.root.style,
              ...domProps.style,
              ...animationStyles,
            }}
          >
            {panelContent}
          </div>
        </div>
      </>,
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
