import * as React from "react";

/** Name of an icon variant folder (e.g. `stroke`, `fill`, `duotone`). Consuming apps define their own. */
export type IconVariant = string;

export interface IconSource {
  id: string;
  variant: IconVariant;
}

export type IconSourceResolver = (icon: IconSource) => string;

export const DEFAULT_ICON_ASSET_BASE_URL = "/ui/icons";

export interface IconContextValue {
  assetBaseUrl: string;
  defaultVariant?: IconVariant;
  resolveSource?: IconSourceResolver;
}

export const IconContext = React.createContext<IconContextValue>({
  assetBaseUrl: DEFAULT_ICON_ASSET_BASE_URL,
});
