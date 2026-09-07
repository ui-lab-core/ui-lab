"use client";

import * as React from "react";

import { DEFAULT_ICON_ASSET_BASE_URL, IconContext } from "./IconContext";
import type { IconSourceResolver, IconVariant } from "./IconContext";

export { DEFAULT_ICON_ASSET_BASE_URL } from "./IconContext";

export interface IconProviderProps {
  children: React.ReactNode;
  /** Base URL containing variant folders. Defaults to `/ui/icons`. */
  assetBaseUrl?: string;
  /** Variant folder to use when an `<Icon>` doesn't specify one. */
  defaultVariant?: IconVariant;
  /** Optional application-level resolver for base paths, CDNs, or custom asset layouts. */
  resolveSource?: IconSourceResolver;
}

export function IconProvider({
  children,
  assetBaseUrl = DEFAULT_ICON_ASSET_BASE_URL,
  defaultVariant,
  resolveSource,
}: IconProviderProps) {
  const value = React.useMemo(
    () => ({ assetBaseUrl, defaultVariant, resolveSource }),
    [assetBaseUrl, defaultVariant, resolveSource],
  );

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}
