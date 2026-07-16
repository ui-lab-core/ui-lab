import * as React from "react"
import { Key } from "@react-types/shared";

import { mergeProps, } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus"
import { useButton } from "@react-aria/button";

import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import styles from "./Select.module.css"
import { useListNavigation, handleListKeyDown, focusAdjacentTabStop, type ItemData } from "./Select.shared"
import { registerSelectCloseCallback, unregisterSelectCloseCallback, closeOtherSelects, clearSelectRegistry } from "./Select.registry"

export type SelectItemData = ItemData

export type SelectTriggerMode = "click" | "hover"
export type SelectMode = "single" | "multiple"
export interface SelectState { value?: Key | Key[]; open?: boolean }

export interface SelectStyleSlots {
  root?: StyleValue;
}

export type SelectStylesProp = StylesProp<SelectStyleSlots>;

export interface SelectContextValue {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  contentPlacement: "top" | "bottom"
  setContentPlacement: React.Dispatch<React.SetStateAction<"top" | "bottom">>
  triggerType: "button" | "input"
  mode: SelectMode
  selectedKey: Key | null
  selectedKeys?: Set<Key>
  selectedTextValue: string
  onSelect: (key: Key) => void
  onToggle?: (key: Key) => void
  triggerRef: React.MutableRefObject<HTMLElement | null>
  wrapperRef: React.MutableRefObject<HTMLElement | null>
  contentRef: React.MutableRefObject<HTMLElement | null>
  triggerProps: any
  isFocused: boolean
  isFocusVisible: boolean
  isPressed: boolean
  isHovered: boolean
  isDisabled: boolean
  items: SelectItemData[]
  registerItem: (key: Key, textValue: string, isDisabled?: boolean, onSelect?: () => void, isSubmenuTrigger?: boolean) => void
  unregisterItem: (key: Key) => void
  searchValue: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
  filteredItems: SelectItemData[]
  visibleKeys: Set<Key>
  focusedKey: Key | null
  setFocusedKey: React.Dispatch<React.SetStateAction<Key | null>>
  navigateToNextItem: () => void
  navigateToPrevItem: () => void
  selectFocusedItem: () => void
  isFocusedItemSubmenu: () => boolean
  maxItems: number
  triggerMode: SelectTriggerMode
  handleHoverIntent: (isHovering: boolean) => void
  mouseMoveDetectedRef: React.MutableRefObject<boolean>
  triggerMouseDownRef: React.MutableRefObject<boolean>
  keyboardScrollIntentRef: React.MutableRefObject<boolean>
  markKeyboardNavigation: () => void
  moveFocusFromTrigger: (direction: 1 | -1) => boolean
  filter?: (item: any) => boolean
  contentId: string
  hasExternalValue: boolean
  restoreFocus: (target?: "auto" | "trigger" | "row") => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

export function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select component must be used within Select root")
  }
  return context
}

export interface SelectProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled state. `value` is a key (single) or key array (multiple). */
  state?: SelectState
  /** Initial selected value. */
  value?: Key | Key[]
  /** Initial open state. */
  open?: boolean
  /** Selection mode: "single" for one item, "multiple" for multi-item selection */
  mode?: SelectMode
  /** External items array — used when items are provided as data rather than JSX */
  items?: Array<T>
  /** Controlled selected key for single-select mode */
  selectedKey?: Key | null
  /** Default selected key for uncontrolled single-select */
  defaultSelectedKey?: Key | null
  /** Controlled selected keys for multi-select mode */
  selectedKeys?: Key[]
  /** Default selected keys for uncontrolled multi-select */
  defaultSelectedKeys?: Key[]
  /** Default display text shown in the trigger when nothing is selected */
  defaultValue?: string
  /** Display text for the currently selected value — used for SSR/SSG to avoid
   * flash of placeholder before items register. Provide alongside selectedKey or
   * defaultSelectedKey so the correct label renders on the first pass. */
  label?: string
  /** Called when selection changes; receives a single key (single) or key array (multiple) */
  onSelectionChange?: (value: any) => void
  /** Disables the entire select and prevents interaction */
  isDisabled?: boolean
  /** Focuses the trigger automatically on mount */
  autoFocus?: boolean
  /** Maximum number of items visible before the dropdown scrolls */
  maxItems?: number
  /** Additional CSS class for the root wrapper */
  className?: string
  /** How the dropdown opens: "click" (default) or "hover" */
  trigger?: SelectTriggerMode
  /** Custom filter predicate applied to the items array */
  filter?: (item: T) => boolean
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: SelectStylesProp;
}

const resolveSelectBaseStyles = createStylesResolver(['root'] as const);

function resolveSelectStyles(styles: SelectStylesProp | undefined) {
  if (!styles) return resolveSelectBaseStyles(styles)
  const { root } = styles
  return resolveSelectBaseStyles({ root })
}

const Select = React.forwardRef<HTMLDivElement, SelectProps<any>>(
  (
    {
      mode = "single",
      state: controlledState,
      value,
      open,
      items: propItems = [],
      selectedKey: controlledSelectedKey,
      defaultSelectedKey,
      selectedKeys: controlledSelectedKeys,
      defaultSelectedKeys = [],
      defaultValue,
      label,
      onSelectionChange,
      isDisabled = false,
      autoFocus = false,
      maxItems = 6,
      children,
      className,
      trigger: triggerMode = "click",
      filter,
      styles: stylesProp,
      ...domProps
    },
    ref
  ) => {
    const triggerRef = React.useRef<HTMLElement>(null)
    const scopeRef = React.useRef<HTMLDivElement>(null)
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const contentRef = React.useRef<HTMLElement>(null)
    const mouseMoveDetectedRef = React.useRef(true)
    const triggerMouseDownRef = React.useRef(false)
    const openedOnMouseDownRef = React.useRef(false)
    const itemExtrasRef = React.useRef<Map<Key, { onSelect?: () => void; isSubmenuTrigger?: boolean }>>(new Map())
    const [isOpen, setIsOpen] = useControlledState(controlledState?.open, open, false)
    const [contentPlacement, setContentPlacement] = React.useState<"top" | "bottom">("bottom")
    const contentId = React.useId()
    const selectId = React.useId()
    const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const keyboardScrollIntentRef = React.useRef(false)

    const handleHoverIntent = React.useCallback((isHovering: boolean) => {
      if (triggerMode !== "hover" || isDisabled) return
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }

      if (isHovering) {
        setIsOpen(true)
      } else {
        hoverTimeoutRef.current = setTimeout(() => {
          setIsOpen(false)
        }, 100)
      }
    }, [triggerMode, isDisabled])

    React.useEffect(() => {
      if (!isOpen || triggerMode !== "hover" || isDisabled) return

      const handleMouseMove = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const isOver = wrapperRef.current?.contains(target) ||
          contentRef.current?.contains(target)

        if (!isOver) {
          handleHoverIntent(false)
        } else {
          handleHoverIntent(true)
        }
      }

      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [isOpen, triggerMode, isDisabled, handleHoverIntent])

    React.useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])

    React.useEffect(() => {
      registerSelectCloseCallback(selectId, (shouldClose) => {
        if (shouldClose) {
          setIsOpen(false)
        }
      })
      return () => {
        unregisterSelectCloseCallback(selectId)
        clearSelectRegistry(selectId)
      }
    }, [selectId])

    React.useEffect(() => {
      if (isOpen) {
        closeOtherSelects(selectId)
      }
    }, [isOpen, selectId])

    const [uncontrolledSelectedKey, setUncontrolledSelectedKey] = useControlledState(
      mode === "single" && !Array.isArray(controlledState?.value) ? controlledState?.value as Key | null | undefined : undefined,
      !Array.isArray(value) ? value ?? controlledSelectedKey : undefined,
      defaultSelectedKey ?? null,
    )
    const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useControlledState(
      mode === "multiple" ? new Set((controlledState?.value as Key[] | undefined) ?? []) : undefined,
      Array.isArray(value) ? new Set(value) : controlledSelectedKeys ? new Set(controlledSelectedKeys) : undefined,
      new Set(defaultSelectedKeys),
    )
    const [selectedTextValue, setSelectedTextValue] = React.useState(label ?? defaultValue ?? "")
    const selectedKey = uncontrolledSelectedKey
    const selectedKeys = uncontrolledSelectedKeys

    const nav = useListNavigation({
      isOpen,
      externalItems: propItems.length > 0 ? propItems : undefined,
      filter: filter ? (item: any) => filter({ ...item, label: item.textValue } as any) : undefined
    })

    const registerItem = React.useCallback((key: Key, textValue: string, isDisabled?: boolean, onSelect?: () => void, isSubmenuTrigger?: boolean) => {
      nav.registerItem(key, textValue, isDisabled)
      itemExtrasRef.current.set(key, { onSelect, isSubmenuTrigger })
    }, [nav.registerItem])

    const unregisterItem = React.useCallback((key: Key) => {
      nav.unregisterItem(key)
      itemExtrasRef.current.delete(key)
    }, [nav.unregisterItem])

    const isFocusedItemSubmenu = React.useCallback(() => {
      if (nav.focusedKey === null) return false
      return itemExtrasRef.current.get(nav.focusedKey)?.isSubmenuTrigger ?? false
    }, [nav.focusedKey])

    const markKeyboardNavigation = React.useCallback(() => {
      mouseMoveDetectedRef.current = false
      keyboardScrollIntentRef.current = true
    }, [])

    const moveFocusFromTrigger = React.useCallback((direction: 1 | -1) => {
      const triggerElement = triggerRef.current
      if (!triggerElement) return false
      return focusAdjacentTabStop(triggerElement, direction, wrapperRef.current)
    }, [])

    const restoreFocus = React.useCallback((target: "auto" | "trigger" | "row" = "auto") => {
      const triggerElement = triggerRef.current
      if (!triggerElement) return

      const ownerRow = triggerElement.closest<HTMLElement>('[data-list-focus-owner="true"]')
      const focusTarget = target === "row"
        ? ownerRow
        : target === "trigger"
          ? triggerElement
          : ownerRow ?? triggerElement

      focusTarget?.focus({ preventScroll: true })
    }, [])

    const onSelect = React.useCallback((key: Key) => {
      const item = nav.items.find(i => i.key === key)
      if (item) {
        setSelectedTextValue(item.textValue)
      }
      setUncontrolledSelectedKey(key)
      onSelectionChange?.(key)
      setIsOpen(false)
      nav.setSearchValue("")
      restoreFocus()
    }, [onSelectionChange, nav.items, restoreFocus, setUncontrolledSelectedKey])

    const onToggle = React.useCallback((key: Key) => {
      const newKeys = new Set(selectedKeys)
      if (newKeys.has(key)) {
        newKeys.delete(key)
      } else {
        newKeys.add(key)
      }
      setUncontrolledSelectedKeys(newKeys)
      onSelectionChange?.(Array.from(newKeys))
    }, [selectedKeys, onSelectionChange, setUncontrolledSelectedKeys])

    const selectFocusedItem = React.useCallback(() => {
      if (nav.focusedKey !== null) {
        const item = nav.enabledFilteredItems.find(item => item.key === nav.focusedKey)
        if (item && !item.isDisabled) {
          const extras = itemExtrasRef.current.get(nav.focusedKey)
          if (extras?.onSelect) {
            extras.onSelect()
          } else if (mode === "multiple") {
            onToggle(nav.focusedKey)
          } else {
            onSelect(nav.focusedKey)
          }
        }
      }
    }, [nav.focusedKey, nav.enabledFilteredItems, onSelect, onToggle, mode])

    React.useEffect(() => {
      if (isOpen) {
        // Only initialize focusedKey if it's not already valid
        if (nav.focusedKey !== null && nav.visibleKeys.has(nav.focusedKey)) {
          const item = nav.filteredItems.find(item => item.key === nav.focusedKey)
          if (item && !item.isDisabled) {
            return  // Keep current keyboard focus, don't reset it
          }
        }

        const focusKey = mode === "multiple" && selectedKeys.size > 0
          ? Array.from(selectedKeys)[0]
          : selectedKey

        if (focusKey !== null && nav.visibleKeys.has(focusKey)) {
          const item = nav.filteredItems.find(item => item.key === focusKey)
          if (item && !item.isDisabled) {
            nav.setFocusedKey(focusKey)
            return
          }
        }
        if (nav.enabledFilteredItems.length > 0) {
          nav.setFocusedKey(nav.enabledFilteredItems[0].key)
        } else {
          nav.setFocusedKey(null)
        }
      }
    }, [isOpen, selectedKey, selectedKeys, nav.visibleKeys, nav.enabledFilteredItems, nav.filteredItems, mode, nav.focusedKey])

    const { buttonProps, isPressed } = useButton({
      isDisabled,
      onPress: (e) => {
        if (isDisabled) return
        // Keyboard interactions are handled by onKeyDown to prevent conflicts
        if (e.pointerType !== 'keyboard') {
          // A closed Select opens on mouse down. Do not immediately undo that
          // state change when React Aria completes the same press on mouse up.
          if (openedOnMouseDownRef.current) {
            openedOnMouseDownRef.current = false
            return
          }
          setIsOpen(prev => !prev)
        }
      },
    }, triggerRef)
    const { focusProps, isFocused, isFocusVisible } = useFocusRing()
    const { hoverProps, isHovered } = useHover({
      isDisabled,
      onHoverStart: () => handleHoverIntent(true),
      onHoverEnd: () => handleHoverIntent(false),
    })

    const triggerProps = mergeProps(buttonProps, focusProps, hoverProps, {
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? contentId : undefined,
      'aria-disabled': isDisabled || undefined,
      onMouseDown: (e: React.MouseEvent) => {
        if (isDisabled || e.button !== 0) return

        triggerMouseDownRef.current = true
        openedOnMouseDownRef.current = !isOpen
        if (!isOpen) {
          setIsOpen(true)
        }
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (!isOpen) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || (e.key === ' ' && !isDisabled)) {
            e.preventDefault()
            setIsOpen(true)
          }
          return
        }

        if (e.key === 'Tab') {
          e.preventDefault()
          const direction = e.shiftKey ? -1 : 1
          setIsOpen(false)
          nav.setSearchValue("")
          moveFocusFromTrigger(direction as 1 | -1)
          return
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
          markKeyboardNavigation()
        }

        handleListKeyDown(e, {
          navigateNext: nav.navigateToNextItem,
          navigatePrev: nav.navigateToPrevItem,
          confirm: selectFocusedItem,
          close: () => {
            setIsOpen(false)
            nav.setSearchValue("")
            restoreFocus()
          },
          filteredItems: nav.filteredItems,
          setFocusedKey: nav.setFocusedKey,
        })
      },
    })

    React.useEffect(() => {
      const handleMouseUp = () => {
        triggerMouseDownRef.current = false
      }

      window.addEventListener('mouseup', handleMouseUp)
      return () => window.removeEventListener('mouseup', handleMouseUp)
    }, [])

    React.useEffect(() => {
      if (autoFocus && triggerRef.current) {
        triggerRef.current.focus({ preventScroll: true })
      }
    }, [autoFocus])

    React.useEffect(() => {
      if (mode === "single") {
        if (selectedKey === null) {
          setSelectedTextValue("")
        } else {
          const selectedItem = nav.items.find(item => item.key === selectedKey)
          if (selectedItem) {
            setSelectedTextValue(selectedItem.textValue)
          } else if (label !== undefined) {
            setSelectedTextValue(label)
          } else if (defaultValue !== undefined && defaultValue !== null) {
            setSelectedTextValue(defaultValue)
          }
        }
      }
    }, [selectedKey, nav.items, mode, defaultValue, label])

    const childrenArray = React.Children.toArray(children)
    const trigger = childrenArray.find(child => React.isValidElement(child) && (
      (child.type as any)?.displayName === 'SelectTrigger' ||
      (child.type as any)?.displayName === 'SearchableTrigger'
    ))
    const contentItems = childrenArray.filter(child => React.isValidElement(child) && ((child.type as any)?.displayName === 'SelectContent' || (child.type as any)?.displayName === 'SearchableContent'))
    const otherContent = childrenArray.filter(child => !React.isValidElement(child) || (
      (child.type as any)?.displayName !== 'SelectTrigger' &&
      (child.type as any)?.displayName !== 'SearchableTrigger' &&
      (child.type as any)?.displayName !== 'SelectContent' &&
      (child.type as any)?.displayName !== 'SearchableContent'
    ))
    const hasExternalValue = otherContent.some(child => (
      React.isValidElement(child) && (child.type as any)?.displayName === 'SelectValue'
    ))
    const triggerType = React.isValidElement(trigger) && (trigger.type as any)?.displayName === 'SearchableTrigger'
      ? 'input'
      : 'button'

    const resolvedStyles = resolveSelectStyles(stylesProp);
    const mergedRootRef = useMergeRefs<HTMLDivElement>(scopeRef, wrapperRef, ref)
    const { indicatorProps } = useFocus({
      scopeRef,
      containerRef: wrapperRef,
      surfaceSelector: '[data-select-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
      dependencies: [mode],
    });

    return (
      <SelectContext.Provider
        value={{
          isOpen,
          setIsOpen,
          contentPlacement,
          setContentPlacement,
          triggerType,
          mode,
          selectedKey,
          selectedKeys: mode === "multiple" ? selectedKeys : undefined,
          selectedTextValue,
          onSelect,
          onToggle: mode === "multiple" ? onToggle : undefined,
          triggerRef,
          wrapperRef,
          contentRef,
          triggerProps,
          isFocused,
          isFocusVisible,
          isPressed,
          isHovered,
          isDisabled,
          items: nav.items,
          registerItem,
          unregisterItem,
          searchValue: nav.searchValue,
          setSearchValue: nav.setSearchValue,
          filteredItems: nav.filteredItems,
          visibleKeys: nav.visibleKeys,
          focusedKey: nav.focusedKey,
          setFocusedKey: nav.setFocusedKey,
          navigateToNextItem: nav.navigateToNextItem,
          navigateToPrevItem: nav.navigateToPrevItem,
          selectFocusedItem,
          isFocusedItemSubmenu,
          maxItems,
          triggerMode,
          handleHoverIntent,
          mouseMoveDetectedRef,
          triggerMouseDownRef,
          keyboardScrollIntentRef,
          markKeyboardNavigation,
          moveFocusFromTrigger,
          filter,
          contentId,
          hasExternalValue,
          restoreFocus,
        }}
      >
        <div
          ref={mergedRootRef}
          className={cn('select', styles.select, className, resolvedStyles.root)}
          data-mode={mode}
          data-select-focus-surface="true"
          data-focused={isFocused ? "true" : "false"}
          data-focus-visible={isFocusVisible ? "true" : "false"}
          {...domProps}
        >
          <div {...indicatorProps} data-focus-indicator="local" />
          {otherContent}
          {trigger}
          {contentItems}
        </div>
      </SelectContext.Provider>
    )
  }
)
Select.displayName = "Select"

export { Select, SelectContext }
