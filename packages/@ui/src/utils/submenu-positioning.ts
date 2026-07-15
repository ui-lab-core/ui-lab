import { flip } from "../hooks/useFloat/core/middleware/flip"
import { offset } from "../hooks/useFloat/core/middleware/offset"
import { shift } from "../hooks/useFloat/core/middleware/shift"

import type { Middleware } from "../hooks/useFloat/core/types"

const inset = 8

interface Options {
  mainAxis: number
  crossAxis: number
}

/** Shared viewport-collision policy for nested flyout menus. */
export function getMiddleware({ mainAxis, crossAxis }: Options): Middleware[] {
  return [
    offset({ mainAxis, crossAxis }),
    flip({ fallbackPlacements: ["left-start"], padding: inset }),
    shift({ padding: inset, crossAxis: true }),
  ]
}

/** CSS constraints paired with the collision padding above. */
export const maxHeight = `calc(100dvh - ${inset * 2}px)`
export const maxWidth = `calc(100dvw - ${inset * 2}px)`
