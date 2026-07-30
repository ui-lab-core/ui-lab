import React from 'react';
import type { StyleValue } from '../../lib/utils';
import type { StylesProp } from '../../lib/styles';
import type { GapSize } from '../../lib/gap';

export type PagePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type PageGap = GapSize | 'none' | number;

export interface PageSeo {
  /** Sets the document title via a hoisted `<title>` tag. */
  title?: string;
  /** Sets the `<meta name="description">` tag. */
  description?: string;
  /** Sets a `<link rel="canonical">` tag. */
  canonical?: string;
}

export interface PageStyleSlots {
  root?: StyleValue;
  header?: StyleValue;
  body?: StyleValue;
  footer?: StyleValue;
}

export type PageStylesProp = StylesProp<PageStyleSlots>;

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the page content area */
  'max-width'?: string | number;
  /** Controls the internal padding of the page */
  padding?: PagePadding;
  /** Controls the space between direct page regions using the shared Flex gap contract. */
  gap?: PageGap;
  /** Whether the page container is horizontally centered */
  centered?: boolean;
  /** Whether the page fills the viewport and ignores maxWidth */
  fullscreen?: boolean;
  /** Document metadata (title, description, canonical) to render for this page. */
  seo?: PageSeo;
  /** Keyed classes for the root and compound component slots. */
  styles?: PageStylesProp;
  children: React.ReactNode;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Keeps the header at the top of the page while its scroll container moves. */
  sticky?: boolean;
  /** Adds a divider between the header and page body. */
  divided?: boolean;
}

export interface PageBodyProps extends React.HTMLAttributes<HTMLElement> {}

export interface PageFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Keeps the footer at the bottom of the page while its scroll container moves. */
  sticky?: boolean;
  /** Adds a divider between page body and the footer. */
  divided?: boolean;
}
