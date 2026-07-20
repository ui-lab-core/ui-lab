import React from 'react';
import type { StyleValue } from '../../lib/utils';
import type { StylesProp } from '../../lib/styles';
import type { GapSize } from '../../lib/gap';

export type PagePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type PageGap = GapSize | 'none' | number;
/** @deprecated Use PageGap and the `gap` prop. */
export type PageSpacing = PageGap;

export interface PageStyleSlots {
  root?: StyleValue;
  header?: StyleValue;
  title?: StyleValue;
  description?: StyleValue;
  actions?: StyleValue;
  content?: StyleValue;
  footer?: StyleValue;
}

export type PageStylesProp = StylesProp<PageStyleSlots>;

export interface PageContextValue {
  /** Current rendered width of the Page container. */
  pageWidth: number | undefined;
  isMobile: boolean;
  pageMaxWidth: string | number | undefined;
  pagePadding: PagePadding;
  /** Effective direct-region gap, retained for context compatibility. */
  pageSpacing: PageGap;
}

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the page content area */
  maxWidth?: string | number;
  /** Controls the internal padding of the page */
  padding?: PagePadding;
  /** Controls the space between direct page regions using the shared Flex gap contract. */
  gap?: PageGap;
  /** @deprecated Use `gap`. When both are provided, `gap` wins. */
  spacing?: PageSpacing;
  /** Whether the page container is horizontally centered */
  centered?: boolean;
  /** Whether the page fills the viewport and ignores maxWidth */
  fullscreen?: boolean;
  /** Container width, in pixels, below which `isMobile` is true. */
  collapseAt?: number;
  /** Keyed classes for the root and compound component slots. */
  styles?: PageStylesProp;
  children: React.ReactNode;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Keeps the header at the top of the page while its scroll container moves. */
  sticky?: boolean;
  /** Adds a divider between the header and page content. */
  divided?: boolean;
}

export interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface PageDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface PageActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface PageContentProps extends React.HTMLAttributes<HTMLElement> {}

export interface PageFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Keeps the footer at the bottom of the page while its scroll container moves. */
  sticky?: boolean;
  /** Adds a divider between page content and the footer. */
  divided?: boolean;
}
