import React from "react";
import { Style } from "../../lib/utils";
import { StylesProp } from "../../lib/styles";

export type PanelSpacing = "none" | "sm" | "md" | "lg";
export type PanelVariant = "default" | "compact";
export type PanelSide = "left" | "right";
export type PanelOrientation = "horizontal" | "vertical";
export type PanelSidebarStrategy = "pop-out" | "inset";

export interface PanelStyleSlots {
  root?: Style;
}

export type PanelStylesProp = StylesProp<PanelStyleSlots>;

export interface PanelSidebarRegistration {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface PanelContextValue {
  orientation: PanelOrientation;
  isStacked: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  sidebars: Record<string, PanelSidebarRegistration>;
  registerSidebar: (id: string, sidebar: PanelSidebarRegistration) => void;
  unregisterSidebar: (id: string) => void;
}

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Axis along which direct child regions are arranged. */
  orientation?: PanelOrientation;
  /** Container width, in pixels, below which a horizontal layout stacks. */
  collapseAt?: number;
  /** Controls the gap between direct child regions. */
  spacing?: PanelSpacing;
  /** Controls the visual density of the layout. */
  variant?: PanelVariant;
  children: React.ReactNode;
  /** Slot styles. */
  styles?: PanelStylesProp;
}

export interface PanelSidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Stable identifier used by a toggle's aria-controls attribute. */
  id?: string;
  /** Which edge receives the dividing border. */
  side?: PanelSide;
  /** Controlled visibility. */
  open?: boolean;
  /** Initial visibility when uncontrolled. */
  defaultOpen?: boolean;
  /** Called whenever visibility changes. */
  onOpenChange?: (open: boolean) => void;
  /** Sidebar size along the panel orientation. */
  size?: string | number;
  /** Sidebar size when closed. */
  collapsedSize?: string | number;
  /**
   * How opening affects sibling regions. "pop-out" shrinks them to make room; "inset"
   * keeps them at full width and pushes them aside while the sidebar slides in from its edge.
   */
  strategy?: PanelSidebarStrategy;
}

export interface PanelToggleProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** ID of the Panel.Sidebar this trigger controls. */
  "aria-controls": string;
  /** A single interactive element. Props and behavior are composed onto it. */
  children: React.ReactElement;
}

export interface PanelResizeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Space-separated IDs of the two sibling regions being resized. */
  "aria-controls": string;
  /** Accessible label for the separator. */
  "aria-label"?: string;
  /** Percentage moved by each keyboard arrow press. */
  keyboardStep?: number;
}
