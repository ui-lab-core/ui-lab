import * as React from "react";

import { PlusIcon } from "@/assets";

/**
 * Content displayed as a compact hint or keyboard shortcut.
 * A single React node renders directly. An array renders each node as a shortcut
 * segment, joined by a plus divider.
 *
 * @example "Esc"
 * @example ["Ctrl", "K"]
 */
export type HintValue = React.ReactNode | React.ReactNode[];

export function hasHint(hint: HintValue): boolean {
  return Array.isArray(hint) ? hint.length > 0 : !!hint;
}

export function renderHint(hint: HintValue): React.ReactNode {
  if (!Array.isArray(hint)) return hint;

  return hint.flatMap((segment, i) => {
    const node = <React.Fragment key={`s${i}`}>{segment}</React.Fragment>;
    return i === 0 ? [node] : [<PlusIcon key={`d${i}`} />, node];
  });
}
