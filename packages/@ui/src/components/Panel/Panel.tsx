'use client'

import React from 'react'
import {
  PanelProps,
  PanelHeaderProps,
  PanelContentProps,
  PanelFooterProps,
  PanelMainProps,
  PanelSidebarProps,
  PanelToggleProps,
  PanelGroupProps,
  PanelPaneProps,
  PanelResizeProps,
  PanelGroupContextValue,
} from './panel.types'
import { PanelContext, PanelGroupContext, usePanelContext, usePanelGroupContext } from './panel.context'
import { cn } from '../../lib/utils'
import { createStylesResolver } from '../../lib/styles'
import { useMergeRefs } from '../../hooks/useMergeRefs'
import styles from './Panel.module.css'

const resolveStyles = createStylesResolver(['root'] as const)

function toSize(value: string | number) {
  return typeof value === 'number' ? `${value}px` : value
}

function isSidebar(child: React.ReactNode): child is React.ReactElement<PanelSidebarProps> {
  return React.isValidElement(child) && child.type === PanelSidebar
}

function isMain(child: React.ReactNode): child is React.ReactElement<PanelMainProps> {
  return React.isValidElement(child) && child.type === PanelMain
}

function getInitialOpen(children: React.ReactNode, fallback: boolean) {
  const sidebar = React.Children.toArray(children).find(isSidebar)
  return sidebar?.props.defaultOpen ?? fallback
}

/** Coordinates a sidebar and a header/content/footer main column within its own bounds. */
const PanelRoot = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      spacing = 'md',
      variant = 'default',
      open,
      defaultOpen,
      state,
      onOpenChange,
      collapseAt = 768,
      className,
      children,
      styles: stylesProp,
      ...props
    },
    ref
  ) => {
    const controlledOpen = state?.open ?? open
    const [internalOpen, setInternalOpen] = React.useState(
      () => defaultOpen ?? getInitialOpen(children, true)
    )
    const sidebarOpen = controlledOpen ?? internalOpen
    const [isStacked, setIsStacked] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const mergedRef = useMergeRefs(containerRef, ref)
    const generatedId = React.useId()
    const sidebar = React.Children.toArray(children).find(isSidebar)
    const sidebarId = sidebar?.props.id ?? `panel-${generatedId.replace(/:/g, '')}-sidebar`

    const setSidebarOpen = React.useCallback((next: boolean) => {
      if (next === sidebarOpen) return
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    }, [controlledOpen, onOpenChange, sidebarOpen])

    const toggleSidebar = React.useCallback(
      () => setSidebarOpen(!sidebarOpen),
      [setSidebarOpen, sidebarOpen]
    )

    React.useEffect(() => {
      const container = containerRef.current
      if (!container || typeof ResizeObserver === 'undefined') return

      const update = (width: number) => setIsStacked(width < collapseAt)
      update(container.getBoundingClientRect().width || container.clientWidth)

      const observer = new ResizeObserver(([entry]) => {
        update(entry?.contentRect.width ?? container.clientWidth)
      })
      observer.observe(container)
      return () => observer.disconnect()
    }, [collapseAt])

    const contextValue = React.useMemo(
      () => ({
        spacing,
        isStacked,
        variant,
        sidebarOpen,
        sidebarId,
        setSidebarOpen,
        toggleSidebar,
      }),
      [spacing, isStacked, variant, sidebarOpen, sidebarId, setSidebarOpen, toggleSidebar]
    )

    const spacingClass = {
      none: styles.spacingNone,
      sm: styles.spacingSm,
      md: styles.spacingMd,
      lg: styles.spacingLg,
    }[spacing]
    const resolved = resolveStyles(stylesProp)

    const childArray = React.Children.toArray(children)
    const regions: React.ReactNode[] = []

    // Keep the original concise API intact, while allowing callers to opt out
    // of implicit child rewriting with an explicit Panel.Main.
    if (childArray.some(isMain)) {
      regions.push(...childArray)
    } else {
      let main: React.ReactNode[] = []
      const flushMain = () => {
        if (!main.length) return
        regions.push(
          <div className={styles.main} data-panel-main="" key={`main-${regions.length}`}>
            {main}
          </div>
        )
        main = []
      }

      childArray.forEach((child) => {
        if (isSidebar(child)) {
          flushMain()
          regions.push(child)
        } else {
          main.push(child)
        }
      })
      flushMain()
    }

    return (
      <PanelContext.Provider value={contextValue}>
        <div
          ref={mergedRef}
          className={cn(
            styles.panel,
            spacingClass,
            variant === 'compact' && styles.compact,
            isStacked && styles.stacked,
            className,
            resolved.root
          )}
          data-spacing={spacing}
          data-variant={variant}
          data-stacked={isStacked}
          {...props}
        >
          {regions}
        </div>
      </PanelContext.Provider>
    )
  }
)

PanelRoot.displayName = 'Panel'

const PanelHeader = React.forwardRef<HTMLElement, PanelHeaderProps>(
  ({ sticky = true, className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(styles.header, sticky && styles.sticky, className)}
      {...props}
    />
  )
)
PanelHeader.displayName = 'Panel.Header'

const PanelContent = React.forwardRef<HTMLDivElement, PanelContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="main" className={cn(styles.content, className)} {...props} />
  )
)
PanelContent.displayName = 'Panel.Content'

const PanelMain = React.forwardRef<HTMLDivElement, PanelMainProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.main, className)} data-panel-main="" {...props} />
  )
)
PanelMain.displayName = 'Panel.Main'

const PanelFooter = React.forwardRef<HTMLElement, PanelFooterProps>(
  ({ fixed = false, className, ...props }, ref) => (
    <footer ref={ref} className={cn(styles.footer, fixed && styles.fixed, className)} {...props} />
  )
)
PanelFooter.displayName = 'Panel.Footer'

const PanelSidebar = React.forwardRef<HTMLElement, PanelSidebarProps>(
  (
    {
      side = 'left',
      defaultOpen: _defaultOpen,
      width = '240px',
      collapsedWidth = '0px',
      className,
      id,
      style,
      ...props
    },
    ref
  ) => {
    const { sidebarOpen, sidebarId } = usePanelContext()
    const customStyle = {
      '--size': toSize(width),
      '--collapsed-size': toSize(collapsedWidth),
      ...style,
    } as React.CSSProperties

    return (
      <aside
        ref={ref}
        id={id ?? sidebarId}
        className={cn(styles.sidebar, className)}
        data-open={sidebarOpen}
        data-side={side}
        aria-hidden={!sidebarOpen}
        style={customStyle}
        {...props}
      />
    )
  }
)
PanelSidebar.displayName = 'Panel.Sidebar'

const PanelToggle = React.forwardRef<HTMLDivElement, PanelToggleProps>(
  ({ children, className, ...props }, ref) => {
    const { sidebarOpen, sidebarId, toggleSidebar } = usePanelContext()
    const child = React.Children.only(children)
    const childProps = child.props as Record<string, unknown>
    const tag = typeof child.type === 'string' ? child.type : undefined
    const nativeInteractive = tag === 'button' || tag === 'a' || tag === 'input'

    const onClick = (event: React.MouseEvent<HTMLElement>) => {
      ;(childProps.onClick as ((event: React.MouseEvent<HTMLElement>) => void) | undefined)?.(event)
      if (!event.defaultPrevented) toggleSidebar()
    }
    const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      ;(childProps.onKeyDown as ((event: React.KeyboardEvent<HTMLElement>) => void) | undefined)?.(event)
      if (
        !event.defaultPrevented &&
        !nativeInteractive &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    const trigger = React.cloneElement(child, {
      onClick,
      onKeyDown,
      'aria-expanded': sidebarOpen,
      'aria-controls': sidebarId,
      role: nativeInteractive ? childProps.role : childProps.role ?? 'button',
      tabIndex: nativeInteractive ? childProps.tabIndex : childProps.tabIndex ?? 0,
      ...(tag === 'button' && childProps.type === undefined ? { type: 'button' } : {}),
    } as React.HTMLAttributes<HTMLElement>)

    return (
      <div ref={ref} className={cn(styles.toggle, className)} {...props}>
        {trigger}
      </div>
    )
  }
)
PanelToggle.displayName = 'Panel.Toggle'

function values(value: number | number[], count: number, fallback: number) {
  return Array.from({ length: count }, (_, index) =>
    Array.isArray(value) ? value[index] ?? fallback : value
  )
}

function initialSizes(count: number, requested?: number[]) {
  if (!count) return []
  if (!requested || requested.length !== count || requested.some((size) => size <= 0)) {
    return Array(count).fill(100 / count)
  }
  const total = requested.reduce((sum, size) => sum + size, 0)
  return requested.map((size) => (size / total) * 100)
}

function paneNumber(
  child: React.ReactNode,
  property: keyof Pick<PanelPaneProps, 'defaultSize' | 'minSize' | 'maxSize'>
) {
  if (!React.isValidElement(child)) return undefined
  return (child.props as PanelPaneProps)[property]
}

const PanelGroup = React.forwardRef<HTMLDivElement, PanelGroupProps>(
  (
    {
      direction = 'horizontal',
      defaultSizes,
      minSize = 10,
      maxSize = 90,
      keyboardStep = 5,
      onSizesChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const mergedRef = useMergeRefs(containerRef, ref)
    const generatedId = React.useId().replace(/:/g, '')
    const childArray = React.Children.toArray(children)
    const panes = childArray.filter(
      (child) => React.isValidElement(child) && child.type !== PanelResize
    )
    const paneCount = panes.length
    const paneDefaults = panes.map((child) => paneNumber(child, 'defaultSize') ?? 0)
    const requestedSizes = defaultSizes ?? paneDefaults
    const [sizes, setSizes] = React.useState(() => initialSizes(paneCount, requestedSizes))
    const mins = React.useMemo(() => {
      const fallback = values(minSize, paneCount, 10)
      return panes.map((child, index) => paneNumber(child, 'minSize') ?? fallback[index])
    }, [minSize, paneCount, panes])
    const maxes = React.useMemo(() => {
      const fallback = values(maxSize, paneCount, 90)
      return panes.map((child, index) => paneNumber(child, 'maxSize') ?? fallback[index])
    }, [maxSize, paneCount, panes])
    const paneIds = React.useMemo(
      () => Array.from({ length: paneCount }, (_, index) => `panel-${generatedId}-pane-${index + 1}`),
      [generatedId, paneCount]
    )

    React.useEffect(() => {
      setSizes((current) =>
        current.length === paneCount ? current : initialSizes(paneCount, requestedSizes)
      )
    }, [defaultSizes, paneCount])

    const getBounds = React.useCallback((index: number) => {
      const total = (sizes[index] ?? 0) + (sizes[index + 1] ?? 0)
      return {
        min: Math.max(mins[index] ?? 0, total - (maxes[index + 1] ?? 100)),
        max: Math.min(maxes[index] ?? 100, total - (mins[index + 1] ?? 0)),
      }
    }, [maxes, mins, sizes])

    const setSize = React.useCallback(
      (index: number, delta: number, unit: 'pixel' | 'percent' = 'pixel') => {
        setSizes((current) => {
          if (index < 0 || index + 1 >= current.length) return current
          const containerSize =
            direction === 'horizontal'
              ? containerRef.current?.clientWidth ?? 0
              : containerRef.current?.clientHeight ?? 0
          if (unit === 'pixel' && containerSize <= 0) return current
          const change = unit === 'percent' ? delta : (delta / containerSize) * 100
          const total = current[index] + current[index + 1]
          const lower = Math.max(mins[index], total - maxes[index + 1])
          const upper = Math.min(maxes[index], total - mins[index + 1])
          const first = Math.max(lower, Math.min(upper, current[index] + change))
          if (first === current[index]) return current
          const next = [...current]
          next[index] = first
          next[index + 1] = total - first
          onSizesChange?.(next)
          return next
        })
      },
      [direction, maxes, mins, onSizesChange]
    )

    const getPaneIds = React.useCallback(
      (index: number): [string | undefined, string | undefined] => [
        paneIds[index],
        paneIds[index + 1],
      ],
      [paneIds]
    )

    const contextValue = React.useMemo<PanelGroupContextValue>(
      () => ({
        sizes,
        setSize,
        direction,
        containerRef,
        getBounds,
        getPaneIds,
        keyboardStep,
      }),
      [sizes, setSize, direction, getBounds, getPaneIds, keyboardStep]
    )

    let paneIndex = 0
    let resizeIndex = 0
    const renderedChildren = childArray.map((child) => {
      if (!React.isValidElement(child)) return child
      if (child.type === PanelResize) {
        return React.cloneElement(child as React.ReactElement<PanelResizeProps>, {
          'data-resize-index': resizeIndex++,
        } as PanelResizeProps)
      }

      const index = paneIndex++
      const childProps = child.props as React.HTMLAttributes<HTMLElement>
      return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        id: childProps.id ?? paneIds[index],
        'data-panel-pane': '',
        style: {
          ...childProps.style,
          flex: `0 0 ${sizes[index] ?? 100 / paneCount}%`,
        },
      } as any)
    })

    return (
      <PanelGroupContext.Provider value={contextValue}>
        <div
          ref={mergedRef}
          className={cn(styles.group, className)}
          data-direction={direction}
          {...props}
        >
          {renderedChildren}
        </div>
      </PanelGroupContext.Provider>
    )
  }
)
PanelGroup.displayName = 'Panel.Group'

const PanelPane = React.forwardRef<HTMLDivElement, PanelPaneProps>(
  ({ defaultSize: _defaultSize, minSize: _minSize, maxSize: _maxSize, className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.pane, className)} data-panel-pane="" {...props} />
  )
)
PanelPane.displayName = 'Panel.Pane'

type ResizeProps = PanelResizeProps & { 'data-resize-index'?: number }

const PanelResize = React.forwardRef<HTMLDivElement, ResizeProps>(
  (
    {
      className,
      'data-resize-index': resizeIndex = 0,
      onPointerDown,
      onKeyDown,
      'aria-label': ariaLabel = 'Resize panes',
      ...props
    },
    ref
  ) => {
    const {
      direction,
      setSize,
      sizes,
      getBounds,
      getPaneIds,
      keyboardStep,
    } = usePanelGroupContext()
    const [isDragging, setIsDragging] = React.useState(false)
    const startRef = React.useRef(0)
    const bounds = getBounds(resizeIndex)
    const controlledIds = getPaneIds(resizeIndex).filter(Boolean).join(' ')

    React.useEffect(() => {
      if (!isDragging) return
      const move = (event: PointerEvent) => {
        const position = direction === 'horizontal' ? event.clientX : event.clientY
        setSize(resizeIndex, position - startRef.current)
        startRef.current = position
      }
      const stop = () => setIsDragging(false)
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', stop, { once: true })
      window.addEventListener('pointercancel', stop, { once: true })
      return () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', stop)
        window.removeEventListener('pointercancel', stop)
      }
    }, [direction, isDragging, resizeIndex, setSize])

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event)
      if (event.defaultPrevented || event.button !== 0) return
      event.preventDefault()
      startRef.current = direction === 'horizontal' ? event.clientX : event.clientY
      setIsDragging(true)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      const previous = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
      const next = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
      let delta: number | undefined
      if (event.key === previous) delta = -keyboardStep
      if (event.key === next) delta = keyboardStep
      if (event.key === 'Home') delta = -100
      if (event.key === 'End') delta = 100
      if (delta === undefined) return
      event.preventDefault()
      setSize(resizeIndex, delta, 'percent')
    }

    return (
      <div
        ref={ref}
        role="separator"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuemin={Math.round(bounds.min)}
        aria-valuemax={Math.round(bounds.max)}
        aria-valuenow={Math.round(sizes[resizeIndex] ?? 0)}
        aria-controls={controlledIds || undefined}
        className={cn(styles.resize, className)}
        data-resizing={isDragging}
        data-direction={direction}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
PanelResize.displayName = 'Panel.Resize'

export const Panel = Object.assign(PanelRoot, {
  Sidebar: PanelSidebar,
  Main: PanelMain,
  Header: PanelHeader,
  Content: PanelContent,
  Footer: PanelFooter,
  Toggle: PanelToggle,
  Group: PanelGroup,
  Pane: PanelPane,
  Resize: PanelResize,
})

export { PanelContext, PanelGroupContext }
