"use client";

import * as React from "react";

import { DEFAULT_ICON_ASSET_BASE_URL, IconContext } from "./icon.context";
import type { IconSourceResolver, IconVariant } from "./icon.context";

export { DEFAULT_ICON_ASSET_BASE_URL } from "./icon.context";

export interface IconProviderProps {
  children: React.ReactNode;
  /** Base URL containing variant folders. Defaults to `/ui/icons`. */
  "asset-url"?: string;
  /** Variant folder to use when an `<Icon>` doesn't specify one. */
  "default-variant"?: IconVariant;
  /** Optional application-level resolver for base paths, CDNs, or custom asset layouts. */
  "resolve-source"?: IconSourceResolver;
}

export function IconProvider({
  children,
  "asset-url": assetUrl,
  "default-variant": defaultVariant,
  "resolve-source": resolveSource,
}: IconProviderProps) {
  const parent = React.useContext(IconContext);
  const value = React.useMemo(
    () => ({
      assetBaseUrl: assetUrl ?? parent.assetBaseUrl,
      defaultVariant: defaultVariant ?? parent.defaultVariant,
      resolveSource: resolveSource ?? parent.resolveSource,
    }),
    [assetUrl, defaultVariant, resolveSource, parent],
  );

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}
