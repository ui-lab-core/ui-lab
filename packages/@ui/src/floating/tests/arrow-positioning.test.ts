import { describe, expect, it } from "vitest";

import { getArrowShapeOffset, getFrameSideFromPlacement } from "../arrow-positioning";

describe("arrow positioning", () => {
  it.each([
    ["top", { x: 18 }, 24],
    ["bottom", { x: 72 }, 78],
    ["left", { y: 14 }, 20],
    ["right", { y: 56 }, 62],
  ] as const)("uses the correct arrow axis for %s placements", (placement, arrow, expected) => {
    expect(getArrowShapeOffset(placement, arrow, { width: 12, height: 12 })).toBe(expected);
  });

  it("uses resolved flipped placements and retains clamped coordinates", () => {
    expect(getFrameSideFromPlacement("bottom-start")).toBe("top");
    expect(getArrowShapeOffset("bottom-start", { x: 0 }, { width: 12, height: 12 })).toBe(6);
    expect(getFrameSideFromPlacement("right-end")).toBe("left");
    expect(getArrowShapeOffset("right-end", { y: 80 }, { width: 12, height: 12 })).toBe(86);
  });

  it("does not create an offset when arrow middleware has no usable coordinate", () => {
    expect(getArrowShapeOffset("top", {}, { width: 12, height: 12 })).toBeUndefined();
  });
});
