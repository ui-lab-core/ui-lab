"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { FocusScope } from "@react-aria/focus";
import { mergeProps, useOverlay } from "react-aria";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { useFloating } from "../../floating/react/useFloating";
import { useFloatAnimation } from "../../floating/react/useFloatAnimation";
import { autoUpdate } from "../../floating/dom/autoUpdate";
import * as positioning from "../../floating/submenu-positioning";
import { cn } from "@/lib/cn";
import css from "./Menu.module.css";
import { useMenuContext, useMenuPortalContainer } from "./Menu";
import type { MenuTriggerProps, MenuContentProps } from "./menu.types";
import { resolveMenuTriggerStyles, resolveMenuContentStyles } from "./menu.styles";
import {
  handleItemKeyDown,
  useItemPointerModality,
  useItemScrollIntoView,
} from "../../lib/item-navigation";
import { useMergeRefs } from "../../hooks/useMergeRefs";
import { List } from "../List";
import { Button } from "../Button";
import { useScrollLock } from "../../hooks/useScrollLock";

/** Element that opens the menu on right-click or, for pop-over menus, on click and Enter/Space */
const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
  ({ children, disabled = false, className, styles: stylesProp, as, ...props }, ref) => {
    const {
      isOpen,
      setIsOpen,
      type,
      clickPositionRef,
      triggerRef: contextTriggerRef,
    } = useMenuContext();
    const resolved = resolveMenuTriggerStyles(stylesProp);
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();

    const handleContextMenu = React.useCallback(
      (e: React.MouseEvent) => {
        if (disabled || type !== "context-menu") return;
        e.preventDefault();
        clickPositionRef.current = { x: e.clientX, y: e.clientY };
        setIsOpen(true);
      },
      [disabled, type, setIsOpen, clickPositionRef],
    );

    const handleClick = React.useCallback(() => {
      if (disabled || type !== "pop-over") return;
      clickPositionRef.current = { x: 0, y: 0 };
      setIsOpen((prev) => !prev);
    }, [disabled, type, setIsOpen, clickPositionRef]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || type !== "pop-over" || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        clickPositionRef.current = { x: 0, y: 0 };
        setIsOpen((prev) => !prev);
      },
      [disabled, type, setIsOpen, clickPositionRef],
    );

    const setTriggerRef = React.useCallback(
      (element: HTMLElement | null) => {
        contextTriggerRef.current = element;
      },
      [contextTriggerRef],
    );

    const triggerProps = {
      onContextMenu: handleContextMenu,
      onClickCapture: handleClick,
      className: cn("menu", "trigger", css.trigger, className, resolved.root),
      "data-slot": "root",
      "data-open": isOpen ? "true" : "false",
      "data-type": type,
      "data-disabled": disabled ? "true" : undefined,
    };

    const childArray = React.Children.toArray(children);
    const child = childArray.length === 1 ? childArray[0] : null;
    const childElement =
      React.isValidElement(child) && child.type !== React.Fragment
        ? (child as React.ReactElement<any>)
        : null;
    const isInteractiveChild =
      !!childElement &&
      (childElement.type === Button || childElement.type === "button" || childElement.type === "a");
    const renderAs =
      as ?? (isInteractiveChild ? "child" : type === "pop-over" ? "button" : "span");

    const mergedRef = useMergeRefs<HTMLElement>(setTriggerRef, ref);
    const childRef = useMergeRefs<HTMLElement>(mergedRef, childElement?.props.ref);

    // The panel keeps a highlighted trigger while it is open. Button accepts data-hovered as the
    // documented forced-visual-state input, so it is only forced while open and otherwise left to
    // Button's own hover tracking.
    const surfaceStateProps = {
      "data-hovered": isOpen || isHovered ? "true" : "false",
      "data-focused": isFocused ? "true" : "false",
      "data-focus-visible": isFocusVisible ? "true" : "false",
    };

    if (renderAs === "child") {
      if (!childElement) {
        throw new Error(
          'Menu.Trigger with as="child" expects exactly one non-Fragment React element child.',
        );
      }
      return React.cloneElement(childElement, {
        ...mergeProps(
          triggerProps,
          surfaceStateProps,
          hoverProps,
          focusProps,
          { onKeyDown: handleKeyDown },
          props as any,
          childElement.props,
        ),
        className: cn(childElement.props.className, triggerProps.className),
        ref: childRef,
      } as any);
    }

    if (renderAs === "span") {
      const {
        variant: _variant,
        size: _size,
        icon: _icon,
        hint: _hint,
        href: _href,
        target: _target,
        rel: _rel,
        onPress: _onPress,
        ...domProps
      } = props as Record<string, unknown>;
      const interactiveProps =
        type === "pop-over" ? { role: "button", tabIndex: disabled ? undefined : 0 } : {};
      return (
        <span
          {...mergeProps(
            triggerProps,
            surfaceStateProps,
            hoverProps,
            focusProps,
            { onKeyDown: handleKeyDown },
            domProps as any,
          )}
          {...interactiveProps}
          aria-haspopup="menu"
          aria-expanded={type === "pop-over" ? isOpen : undefined}
          aria-disabled={disabled || undefined}
          ref={mergedRef as React.Ref<HTMLSpanElement>}
        >
          {children}
        </span>
      );
    }

    return (
      <Button
        {...mergeProps(triggerProps, props as any)}
        data-hovered={isOpen ? "true" : undefined}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={disabled}
        ref={mergedRef as React.Ref<HTMLButtonElement>}
      >
        {children}
      </Button>
    );
  },
);
MenuTrigger.displayName = "Menu.Trigger";

/** Floating panel that contains the menu items, positioned at the click point or the trigger */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  (
    {
      children,
      className,
      onEscapeKeyDown,
      side = "bottom",
      align = "start",
      offset = 6,
      styles: stylesProp,
      ...domProps
    },
    ref,
  ) => {
    const {
      isOpen,
      type,
      close,
      items,
      focusedKey,
      setFocusedKey,
      navigateToNextItem,
      navigateToPrevItem,
      selectFocusedItem,
      isFocusedItemSubmenu,
      mouseMoveDetectedRef,
      clickPositionRef,
      triggerRef,
    } = useMenuContext();
    const portalContainer = useMenuPortalContainer();
    useScrollLock(isOpen);
    const [mounted, setMounted] = React.useState(false);
    const [floatingElement, setFloatingElement] = React.useState<HTMLDivElement | null>(null);

    const { refs, floatingStyles, x, y, placement } = useFloating({
      placement:
        type === "context-menu"
          ? "bottom-start"
          : (`${side}${align === "center" ? "" : `-${align}`}` as any),
      strategy: "absolute",
      whileElementsMounted: autoUpdate,
      // The floating wrapper stays mounted while closed; only its children are
      // conditional. Gate tracking on the open state.
      open: isOpen,
      // The panel's own entrance transition (opacity/scale) can trip autoUpdate's
      // layout-shift and resize-observer tracking mid-animation, nudging the
      // panel by a pixel or two as it settles. Compute position once per open
      // and leave it there instead of resolving it continuously from the trigger.
      pin: true,
      middleware: positioning.getMiddleware({ mainAxis: offset, crossAxis: 0 }),
    });

    const isPositioned = x !== null && y !== null;

    React.useLayoutEffect(() => {
      if (!isOpen) return;
      const pos = clickPositionRef.current;
      if (pos.x === 0 && pos.y === 0 && triggerRef.current) {
        refs.setReference(triggerRef.current);
      } else {
        refs.setReference({
          getBoundingClientRect: () => ({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            top: pos.y,
            left: pos.x,
            bottom: pos.y,
            right: pos.x,
          }),
        });
      }
    }, [isOpen, refs, clickPositionRef, triggerRef]);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (isOpen && floatingElement) {
        requestAnimationFrame(() => {
          floatingElement?.focus({ preventScroll: true });
        });
      }
    }, [isOpen, floatingElement]);

    useItemPointerModality({
      isOpen,
      mouseMoveDetectedRef,
    });

    useItemScrollIntoView({
      activeKey: focusedKey,
      container: floatingElement,
      isOpen,
      mouseMoveDetectedRef,
      itemSelector: '[data-focused="true"], [data-highlighted="true"]',
    });

    const overlayRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergeRefs<HTMLDivElement>(setFloatingElement, overlayRef, ref);

    // Join React Aria's overlay stack so an enclosing overlay (Modal, Popover)
    // sees this menu as topmost and leaves Escape to it. Menu owns Escape; outside
    // presses dismiss here rather than through a full-screen backdrop, so the trigger
    // keeps its own hover, cursor, and pointer events while the menu is open.
    useOverlay(
      {
        isOpen,
        onClose: close,
        isDismissable: true,
        isKeyboardDismissDisabled: true,
        shouldCloseOnInteractOutside: (element) =>
          !triggerRef.current?.contains(element) && !element.closest(".menu[data-slot=\"overlay\"]"),
      },
      overlayRef,
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight") {
          if (isFocusedItemSubmenu()) {
            e.preventDefault();
            selectFocusedItem();
            return;
          }
        }

        if (e.key === "Escape") {
          e.preventDefault();
          close();
          onEscapeKeyDown?.(e.nativeEvent);
          return;
        }

        handleItemKeyDown(e, {
          navigateNext: navigateToNextItem,
          navigatePrev: navigateToPrevItem,
          confirm: selectFocusedItem,
          close,
          filteredItems: items,
          setFocusedKey,
        });
      },
      [
        navigateToNextItem,
        navigateToPrevItem,
        selectFocusedItem,
        close,
        items,
        setFocusedKey,
        isFocusedItemSubmenu,
        onEscapeKeyDown,
      ],
    );

    const { animationStyles } = useFloatAnimation({
      element: floatingElement,
      open: isOpen,
      isPositioned,
      placement,
      skipExitAnimation: true,
    });

    const showContent = isOpen && isPositioned;
    const resolved = resolveMenuContentStyles(stylesProp);

    if (!mounted || !portalContainer) return null;

    // Mounting the scope only while open lets restoreFocus return focus to the
    // element that opened the menu, so closing inside a Modal stays contained.
    return createPortal(
      isOpen ? (
      <FocusScope restoreFocus>
          <div
            ref={refs.setFloating}
            className={cn("menu", css.overlay, resolved.overlay)}
            data-slot="overlay"
            style={{
              ...floatingStyles,
              zIndex: 50000,
              visibility: isPositioned ? "visible" : "hidden",
            }}
          >
            <div
              role="menu"
              tabIndex={-1}
              {...domProps}
              ref={mergedRef}
              className={cn("content", css.panel, className, resolved.root)}
              data-slot="root"
              data-state={showContent ? "open" : "closed"}
              data-placement={placement.split("-")[0]}
              onKeyDown={(event) => {
                domProps.onKeyDown?.(event);
                if (!event.defaultPrevented) handleKeyDown(event);
              }}
              style={{ ...domProps.style, ...animationStyles }}
            >
              <div
                className={cn("viewport", css.viewport, resolved["list.padding"])}
                data-slot="list.padding"
              >
                {/* The panel is already the menu; the inner collection must not nest a listbox. */}
                <List role="presentation" gap="xs" className={resolved["list.root"]}>
                  {children}
                </List>
              </div>
            </div>
          </div>
      </FocusScope>
      ) : null,
      portalContainer,
    );
  },
);
MenuContent.displayName = "Menu.Content";

export { MenuTrigger, MenuContent };
