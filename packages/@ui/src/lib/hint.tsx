import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/Badge";

/**
 * Content displayed as a compact hint or keyboard shortcut.
 * A single React node renders as one badge. An array renders each node as its
 * own badge, laid out with a small gap between them.
 *
 * @example "Esc"
 * @example ["Ctrl", "K"]
 */
export type HintValue = React.ReactNode | React.ReactNode[];

export function hasHint(hint: HintValue): boolean {
  return Array.isArray(hint) ? hint.length > 0 : !!hint;
}

export interface HintBadgesProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Hint content. An array renders as one badge per segment. */
  hint: HintValue;
  /** Badge variant applied to every segment. */
  variant?: string;
  /** className applied to each segment's Badge. */
  badgeClassName?: string;
}

/**
 * Renders a `HintValue` as one or more Badges sharing a small gap, used by
 * Button and Tooltip so keyboard-shortcut hints look identical everywhere.
 */
export function HintBadges({ hint, variant = "secondary", badgeClassName, className, ...props }: HintBadgesProps) {
  if (!hasHint(hint)) return null;

  const segments = Array.isArray(hint) ? hint : [hint];

  return (
    <span className={cn("hint", className)} {...props}>
      {segments.map((segment, i) => (
        <Badge key={i} variant={variant} className={badgeClassName}>
          {segment}
        </Badge>
      ))}
    </span>
  );
}
