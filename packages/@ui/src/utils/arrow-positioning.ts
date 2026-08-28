type ArrowSide = "top" | "right" | "bottom" | "left";

export interface ArrowMiddlewareData {
  x?: number;
  y?: number;
}

export interface ArrowDimensions {
  width: number;
  height: number;
}

function getPlacementSide(placement: string): ArrowSide | undefined {
  const side = placement.split("-")[0];
  return side === "top" || side === "right" || side === "bottom" || side === "left"
    ? side
    : undefined;
}

/** Returns the Frame edge that faces the reference for a resolved placement. */
export function getFrameSideFromPlacement(placement: string): ArrowSide | undefined {
  const side = getPlacementSide(placement);

  if (!side) return undefined;

  const oppositeSides: Record<ArrowSide, ArrowSide> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };

  return oppositeSides[side];
}

/**
 * Converts Floating UI arrow middleware data to the center coordinate required
 * by Frame's path shape. The middleware coordinate is the arrow's leading
 * edge, while Frame's shapeOffset identifies the center of its path.
 */
export function getArrowShapeOffset(
  placement: string,
  arrow: ArrowMiddlewareData | undefined,
  dimensions: ArrowDimensions,
): number | undefined {
  const side = getPlacementSide(placement);

  if (!side) return undefined;

  const isHorizontal = side === "top" || side === "bottom";
  const position = isHorizontal ? arrow?.x : arrow?.y;
  const size = isHorizontal ? dimensions.width : dimensions.height;

  return typeof position === "number" && Number.isFinite(position) ? position + size / 2 : undefined;
}
