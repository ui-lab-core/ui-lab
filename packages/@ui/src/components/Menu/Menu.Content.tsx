import * as React from "react"
import { createPortal } from "react-dom"
import { mergeProps } from "react-aria"
import { useFloating } from "../../hooks/useFloat/react/useFloating"
import { useFloatAnimation } from "../../hooks/useFloat/react/useFloatAnimation"
import { autoUpdate } from "../../hooks/useFloat/dom/autoUpdate"
import * as positioning from "../../utils/submenu-positioning"
import { cn } from "@/lib/utils"
import { createStylesResolver } from "@/lib/styles"
import css from "./Menu.module.css"
import { useMenuContext } from "./Menu"
import type { MenuTriggerProps, MenuContentProps } from "./menu.types"
import {
  handleListKeyDown,
  useListPointerModality,
  useListScrollIntoView,
} from "../../utils/list-navigation"
import { useMergeRefs as useMergedRef } from "../../hooks/useMergeRefs"
import { List } from "../List"
import { Button } from "../Button"
import { useScrollLock } from "../../hooks/useScrollLock"

const resolveMenuTriggerBaseStyles = createStylesResolver(['root'] as const);
const resolveMenuContentBaseStyles = createStylesResolver(['root', 'list'] as const);

function resolveMenuTriggerStyles(styles: MenuTriggerProps["styles"]) {
  if (!styles) return resolveMenuTriggerBaseStyles(styles)
  const { root } = styles
  return resolveMenuTriggerBaseStyles({ root })
}

function resolveMenuContentStyles(styles: MenuContentProps["styles"]) {
  if (!styles) return resolveMenuContentBaseStyles(styles)
  const { root, list } = styles
  return resolveMenuContentBaseStyles({ root, list })
}

/** Wrapper element that opens the context menu on right-click */
const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
  ({ children, disabled = false, className, styles, as, ...props }, ref) => {
    const { isOpen, setIsOpen, type, clickPositionRef, triggerRef: contextTriggerRef } = useMenuContext()
    const resolved = resolveMenuTriggerStyles(styles)
    const [isHovered, setIsHovered] = React.useState(false)

    const handleContextMenu = React.useCallback((e: React.MouseEvent) => {
      if (disabled || type !== "context-menu") return
      e.preventDefault()
      clickPositionRef.current = { x: e.clientX, y: e.clientY }
      setIsOpen(true)
    }, [disabled, type, setIsOpen, clickPositionRef])

    const handleClick = React.useCallback((e: React.MouseEvent) => {
      if (disabled || type !== "pop-over") return
      clickPositionRef.current = { x: 0, y: 0 }
      setIsOpen(prev => !prev)
    }, [disabled, type, setIsOpen, clickPositionRef])

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
      if (disabled || type !== "pop-over" || (e.key !== "Enter" && e.key !== " ")) return
      e.preventDefault()
      clickPositionRef.current = { x: 0, y: 0 }
      setIsOpen(prev => !prev)
    }, [disabled, type, setIsOpen, clickPositionRef])

    const positionerRef = contextTriggerRef

    const triggerProps = {
      onContextMenu: handleContextMenu,
      onClickCapture: handleClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      className: cn('trigger', css.trigger, className, resolved.root),
      'data-open': isOpen ? "true" : "false",
      'data-state': isOpen ? "open" : "closed",
      'data-hovered': isOpen || isHovered ? "true" : "false",
      'data-type': type,
      'data-disabled': disabled ? "true" : undefined,
    }

    const childArray = React.Children.toArray(children)
    const child = childArray.length === 1 ? childArray[0] : null
    const childElement = React.isValidElement(child) && child.type !== React.Fragment
      ? child as React.ReactElement<any>
      : null
    const isLegacyInteractiveChild = !!childElement && (
      childElement.type === Button ||
      childElement.type === "button" ||
      childElement.type === "a"
    )
    const renderAs = as ?? (
      isLegacyInteractiveChild
        ? "child"
        : type === "pop-over" ? "button" : "span"
    )
    const childRef = useMergedRef<HTMLElement>(ref, childElement?.props.ref)
    let trigger: React.ReactElement

    if (renderAs === "child") {
      if (!childElement) {
        throw new Error('Menu.Trigger with as="child" expects exactly one non-Fragment React element child.')
      }
      trigger = React.cloneElement(childElement, {
        ...mergeProps(triggerProps, props as any, childElement.props),
        className: cn(childElement.props.className, triggerProps.className),
        ref: childRef,
      } as any)
    } else if (renderAs === "span") {
      const spanProps = type === "pop-over" ? { role: "button", tabIndex: disabled ? undefined : 0 } : {}
      trigger = (
        <span
          {...mergeProps(triggerProps, { onKeyDown: handleKeyDown }, props as any)}
          {...spanProps}
          ref={ref as React.Ref<HTMLSpanElement>}
        >
          {children}
        </span>
      )
    } else {
      trigger = (
        <Button
          {...mergeProps(triggerProps, props as any)}
          disabled={disabled}
          ref={ref as React.Ref<HTMLButtonElement>}
        >
          {children}
        </Button>
      )
    }

    return (
      <div ref={positionerRef as React.Ref<HTMLDivElement>} className={cn('menu', css['trigger-root'])}>
        {trigger}
      </div>
    )
  }
)
MenuTrigger.displayName = "MenuTrigger"

/** Floating panel that contains the menu items, positioned relative to the click location */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, className, onEscapeKeyDown, side = "bottom", align = "start", offset = 0, styles }, ref) => {
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
    } = useMenuContext()
    useScrollLock(isOpen)
    const [mounted, setMounted] = React.useState(false)
    const [floatingElement, setFloatingElement] = React.useState<HTMLDivElement | null>(null)

    const { refs, floatingStyles, x, y, placement } = useFloating({
      placement: type === "context-menu" ? "bottom-start" : `${side}${align === "center" ? "" : `-${align}`}` as any,
      strategy: "absolute",
      whileElementsMounted: autoUpdate,
      middleware: positioning.getMiddleware({ mainAxis: offset, crossAxis: offset }),
    })

    const isPositioned = x !== null && y !== null

    React.useLayoutEffect(() => {
      if (!isOpen) return
      const pos = clickPositionRef.current
      if (pos.x === 0 && pos.y === 0 && triggerRef.current) {
        refs.setReference(triggerRef.current)
      } else {
        refs.setReference({
          getBoundingClientRect: () => ({
            x: pos.x, y: pos.y, width: 0, height: 0,
            top: pos.y, left: pos.x, bottom: pos.y, right: pos.x,
          }),
        })
      }
    }, [isOpen, refs, clickPositionRef, triggerRef])

    React.useEffect(() => {
      setMounted(true)
    }, [])

    React.useEffect(() => {
      if (isOpen && floatingElement) {
        requestAnimationFrame(() => {
          floatingElement?.focus({ preventScroll: true })
        })
      }
    }, [isOpen, floatingElement])

    useListPointerModality({
      isOpen,
      mouseMoveDetectedRef,
    })

    useListScrollIntoView({
      activeKey: focusedKey,
      container: floatingElement,
      isOpen,
      mouseMoveDetectedRef,
      itemSelector: '[data-focused="true"], [data-highlighted="true"]',
    })

    const mergedRef = useMergedRef<HTMLDivElement>(setFloatingElement, ref)

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (isFocusedItemSubmenu()) {
          e.preventDefault()
          selectFocusedItem()
          return
        }
      }

      if (e.key === "Escape") {
        e.preventDefault()
        close()
        onEscapeKeyDown?.(e.nativeEvent)
        return
      }

      handleListKeyDown(e, {
        navigateNext: navigateToNextItem,
        navigatePrev: navigateToPrevItem,
        confirm: selectFocusedItem,
        close,
        filteredItems: items,
        setFocusedKey,
      })
    }, [navigateToNextItem, navigateToPrevItem, selectFocusedItem, close, items, setFocusedKey, isFocusedItemSubmenu, onEscapeKeyDown])

    const { animationStyles } = useFloatAnimation({
      open: isOpen,
      isPositioned,
      placement,
      skipExitAnimation: true,
    })

    const showContent = isOpen && isPositioned
    const resolved = resolveMenuContentStyles(styles);

    if (!mounted) return null

    return createPortal(
      <>
        {showContent && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 49999 }}
            onClick={close}
          />
        )}
        {isOpen && (
          <div
            ref={refs.setFloating}
            className={cn('menu', css['content-root'])}
            style={{
              ...floatingStyles,
              zIndex: 50000,
              visibility: isPositioned ? "visible" : "hidden",
            }}
          >
            <div
              ref={mergedRef}
              role="menu"
              tabIndex={-1}
              className={cn('content', css.content, className, resolved.root)}
              data-state={showContent ? "open" : "closed"}
              data-placement={placement.split("-")[0]}
              onKeyDown={handleKeyDown}
              style={{ outline: "none", ...animationStyles }}
            >
              <div className={cn("viewport", resolved.list)} style={{ padding: "0.25rem" }}>
                <List items={items} gap="xs">
                  {children}
                </List>
              </div>
            </div>
          </div>
        )}
      </>,
      document.body
    )
  }
)
MenuContent.displayName = "MenuContent"

export { MenuTrigger, MenuContent }
