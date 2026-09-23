"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import css from "./Icon.module.css";
import { DEFAULT_ICON_ASSET_BASE_URL, IconContext } from "./IconContext";
import type { IconSource, IconVariant } from "./IconContext";

export { DEFAULT_ICON_ASSET_BASE_URL } from "./IconContext";

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

export interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** SVG filename with or without the `.svg` extension. */
  id: string;
  /** Icon collection to resolve. Falls back to the `IconProvider`'s `default-variant`. */
  variant?: IconVariant;
  /** Width and height. Numeric values are interpreted as pixels. */
  size?: number | string;
  /** Accessible label for a meaningful icon. Icons are decorative by default. */
  label?: string;
  /** Per-icon override for the provider's asset base URL. */
  "asset-url"?: string;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      id,
      variant,
      size = 20,
      label,
      "asset-url": assetUrl,
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
    const resolvedVariant = variant ?? context.defaultVariant;
    if (!resolvedVariant) {
      throw new Error(
        `<Icon id="${id}"> requires a "variant" prop or an <IconProvider default-variant="...">.`,
      );
    }
    const normalizedId = normalizeIconId(id);
    const icon = { id: normalizedId, variant: resolvedVariant };
    const source = context.resolveSource
      ? context.resolveSource(icon)
      : resolveIconSource(icon, assetUrl ?? context.assetBaseUrl);
    const accessibleLabel = label ?? ariaLabel;

    return (
      <span
        {...props}
        ref={ref}
        role={role ?? (accessibleLabel ? "img" : undefined)}
        aria-label={accessibleLabel}
        aria-hidden={ariaHidden ?? (accessibleLabel ? undefined : true)}
        data-icon-id={normalizedId}
        data-icon-variant={resolvedVariant}
        className={cn("icon", resolvedVariant, css.icon, className)}
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
