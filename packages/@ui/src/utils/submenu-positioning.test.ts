import { describe, expect, it } from "vitest"

import { getMiddleware, maxHeight, maxWidth } from "./submenu-positioning"

describe("submenu positioning", () => {
  it("shares offset, flip, and two-axis viewport shifting", () => {
    const middleware = getMiddleware({ mainAxis: 8, crossAxis: 2 })

    expect(middleware.map(({ name }) => name)).toEqual(["offset", "flip", "shift"])
    expect(middleware[0].options).toEqual({ mainAxis: 8, crossAxis: 2 })
    expect(middleware[1].options).toMatchObject({
      fallbackPlacements: ["left-start"],
      padding: 8,
    })
    expect(middleware[2].options).toMatchObject({ padding: 8, crossAxis: true })
  })

  it("keeps oversized content within the same viewport inset", () => {
    expect(maxHeight).toBe("calc(100dvh - 16px)")
    expect(maxWidth).toBe("calc(100dvw - 16px)")
  })
})
