import React from 'react'
import { StyleValue } from '../../lib/utils'
import { StylesProp } from '../../lib/styles'

export type PanelSpacing = 'none' | 'sm' | 'md' | 'lg'
export type PanelVariant = 'default' | 'compact'
export type PanelSide = 'left' | 'right'
export type PanelDirection = 'horizontal' | 'vertical'

export interface PanelStyleSlots {
  root?: StyleValue
}

export type PanelStylesProp = StylesProp<PanelStyleSlots>
export interface PanelState { open?: boolean }

export interface PanelContextValue {
  spacing: PanelSpacing
  isStacked: boolean
  variant: PanelVariant
  sidebarOpen: boolean
  sidebarId: string
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export interface PanelGroupContextValue {
  sizes: number[]
  setSize: (index: number, delta: number, unit?: 'pixel' | 'percent') => void
  direction: PanelDirection
  containerRef: React.RefObject<HTMLDivElement | null>
  getBounds: (index: number) => { min: number; max: number }
  getPaneIds: (index: number) => [string | undefined, string | undefined]
  keyboardStep: number
}

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Backward-compatible controlled state object. Prefer `open`. */
  state?: PanelState
  /** Controlled sidebar visibility. */
  open?: boolean
  /** Initial sidebar visibility when uncontrolled. */
  defaultOpen?: boolean
  /** Called whenever a toggle requests a sidebar visibility change. */
  onOpenChange?: (open: boolean) => void
  /** Container width, in pixels, below which regions stack without changing sidebar state. */
  collapseAt?: number
  /** Controls the internal spacing between panel sections. */
  spacing?: PanelSpacing
  /** Controls the visual density of the panel. */
  variant?: PanelVariant
  children: React.ReactNode
  /** Slot styles. */
  styles?: PanelStylesProp
}

export interface PanelHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Keeps the header at the top of its local main column. */
  sticky?: boolean
}

export interface PanelContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/** An explicit main column for advanced Panel compositions. */
export interface PanelMainProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface PanelFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Keeps the footer at the bottom of the local main column, never the viewport. */
  fixed?: boolean
}

export interface PanelSidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Which side of the main column the sidebar occupies. Match this to authored order. */
  side?: PanelSide
  /** Backward-compatible initial state seed when the root has no `defaultOpen`. */
  defaultOpen?: boolean
  /** Width of the sidebar when open. */
  width?: string | number
  /** Width of the sidebar when collapsed. */
  collapsedWidth?: string | number
}

export interface PanelToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A single button-like element. Panel composes its handlers and ARIA state. */
  children: React.ReactElement
}

export interface PanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls the axis panes are arranged along. */
  direction?: PanelDirection
  /** Initial pane sizes expressed as percentages. Prefer `Panel.Pane.defaultSize` for new compositions. */
  defaultSizes?: number[]
  /** Minimum pane size, or one percentage per pane. Prefer `Panel.Pane.minSize` for new compositions. */
  minSize?: number | number[]
  /** Maximum pane size, or one percentage per pane. Prefer `Panel.Pane.maxSize` for new compositions. */
  maxSize?: number | number[]
  /** Percentage moved by each keyboard arrow press. */
  keyboardStep?: number
  /** Called after pane sizes change. */
  onSizesChange?: (sizes: number[]) => void
  children: React.ReactNode
}

/**
 * A sized region inside a Panel.Group. Keeping sizing beside the region makes
 * nested application layouts readable without relying on child order arrays.
 */
export interface PanelPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial pane size expressed as a percentage. All panes need a value when this API is used. */
  defaultSize?: number
  /** Minimum pane size expressed as a percentage. */
  minSize?: number
  /** Maximum pane size expressed as a percentage. */
  maxSize?: number
}

export interface PanelResizeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible label for the separator. */
  'aria-label'?: string
}
