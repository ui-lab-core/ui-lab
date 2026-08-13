"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import css from "./Icon.module.css";

export type IconVariant = "fill";

export interface IconSource {
  id: string;
  variant: IconVariant;
}

export type IconSourceResolver = (icon: IconSource) => string;

export const DEFAULT_ICON_ASSET_BASE_URL = "/ui-lab-icons";

const ICON_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeAssetBaseUrl(assetBaseUrl: string): string {
  return assetBaseUrl.replace(/\/+$/, "");
}

export function normalizeIconId(id: string): string {
  const normalized = id.endsWith(".svg") ? id.slice(0, -4) : id;

  if (!ICON_ID_PATTERN.test(normalized)) {
    throw new Error(
      `Invalid icon id "${id}". Icon ids may only contain lowercase letters, numbers, and hyphens.`,
    );
  }

  return normalized;
}

export function resolveIconSource(
  { id, variant }: IconSource,
  assetBaseUrl = DEFAULT_ICON_ASSET_BASE_URL,
): string {
  return `${normalizeAssetBaseUrl(assetBaseUrl)}/${variant}/${normalizeIconId(id)}.svg`;
}

interface IconContextValue {
  assetBaseUrl: string;
  resolveSource?: IconSourceResolver;
}

const IconContext = React.createContext<IconContextValue>({
  assetBaseUrl: DEFAULT_ICON_ASSET_BASE_URL,
});

export interface IconProviderProps {
  children: React.ReactNode;
  /** Base URL containing variant folders. Defaults to `/ui-lab-icons`. */
  assetBaseUrl?: string;
  /** Optional application-level resolver for base paths, CDNs, or custom asset layouts. */
  resolveSource?: IconSourceResolver;
}

export function IconProvider({
  children,
  assetBaseUrl = DEFAULT_ICON_ASSET_BASE_URL,
  resolveSource,
}: IconProviderProps) {
  const value = React.useMemo(
    () => ({ assetBaseUrl, resolveSource }),
    [assetBaseUrl, resolveSource],
  );

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** SVG filename with or without the `.svg` extension. */
  id: string;
  /** Icon collection to resolve. */
  variant?: IconVariant;
  /** Width and height. Numeric values are interpreted as pixels. */
  size?: number | string;
  /** Accessible label for a meaningful icon. Icons are decorative by default. */
  label?: string;
  /** Per-icon override for the provider's asset base URL. */
  assetBaseUrl?: string;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      id,
      variant = "fill",
      size = 20,
      label,
      assetBaseUrl,
      className,
      style,
      role,
      "aria-label": ariaLabel,
      "aria-hidden": ariaHidden,
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(IconContext);
    const normalizedId = normalizeIconId(id);
    const icon = { id: normalizedId, variant };
    const source = context.resolveSource
      ? context.resolveSource(icon)
      : resolveIconSource(icon, assetBaseUrl ?? context.assetBaseUrl);
    const accessibleLabel = label ?? ariaLabel;

    return (
      <span
        {...props}
        ref={ref}
        role={role ?? (accessibleLabel ? "img" : undefined)}
        aria-label={accessibleLabel}
        aria-hidden={ariaHidden ?? (accessibleLabel ? undefined : true)}
        data-icon-id={normalizedId}
        data-icon-variant={variant}
        className={cn("icon", variant, css.icon, className)}
        style={{
          width: size,
          height: size,
          WebkitMaskImage: `url(${JSON.stringify(source)})`,
          maskImage: `url(${JSON.stringify(source)})`,
          ...style,
        }}
      />
    );
  },
);

Icon.displayName = "Icon";
