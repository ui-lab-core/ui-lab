import * as React from "react";

import { PlusIcon } from "@/assets";

/** A hint is a single node, or a list of segments joined by a `+` divider. */
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
