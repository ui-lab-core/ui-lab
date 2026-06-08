import { generateTypeScaleFromRatio } from "../config";
import {
  DEFAULT_BODY_MIN_FONT_SIZE_PX,
  TYPOGRAPHY_FONT_SIZE_SCALE_MAX,
  TYPOGRAPHY_FONT_SIZE_SCALE_MIN,
  TYPOGRAPHY_TYPE_SIZE_RATIO_MAX,
  TYPOGRAPHY_TYPE_SIZE_RATIO_MIN,
  clampMinFontSizePx,
} from "./typography-config";

interface TypographyConstraintInput {
  typeSizeRatio: number;
  fontSizeScale: number;
}

interface TypographyConstraintResult extends TypographyConstraintInput {
  minFontSizePx: number;
}

const FONT_SCALE_SEARCH_STEP = 0.001;

function getSmallestMinSize(
  typeSizeRatio: number,
  fontSizeScale: number,
  minFontSizePx: number = DEFAULT_BODY_MIN_FONT_SIZE_PX,
): number {
  const typeScale = generateTypeScaleFromRatio(typeSizeRatio, fontSizeScale, 1, {
    minFontSizePx,
  });
  const minSizes = typeScale.map((item) => item.minSize);
  return Math.min(...minSizes);
}

export function isValidTypographyConfig(
  typeSizeRatio: number,
  fontSizeScale: number,
  minFontSizePx: number = DEFAULT_BODY_MIN_FONT_SIZE_PX,
): boolean {
  const smallestMin = getSmallestMinSize(
    typeSizeRatio,
    fontSizeScale,
    minFontSizePx,
  );
  return smallestMin >= minFontSizePx / 16;
}

export function findClosestValidFontSizeScale(
  typeSizeRatio: number,
  targetFontSizeScale: number,
  minFontSizePx: number = DEFAULT_BODY_MIN_FONT_SIZE_PX,
): number {
  const normalizedMinFontSizePx = clampMinFontSizePx(minFontSizePx);
  const clampedTargetScale = Math.max(
    TYPOGRAPHY_FONT_SIZE_SCALE_MIN,
    Math.min(TYPOGRAPHY_FONT_SIZE_SCALE_MAX, targetFontSizeScale),
  );

  if (
    isValidTypographyConfig(
      typeSizeRatio,
      clampedTargetScale,
      normalizedMinFontSizePx,
    )
  ) {
    return clampedTargetScale;
  }

  let closestScale = clampedTargetScale;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (
    let scale = TYPOGRAPHY_FONT_SIZE_SCALE_MIN;
    scale <= TYPOGRAPHY_FONT_SIZE_SCALE_MAX + FONT_SCALE_SEARCH_STEP;
    scale += FONT_SCALE_SEARCH_STEP
  ) {
    const roundedScale = Number(scale.toFixed(3));

    if (
      !isValidTypographyConfig(
        typeSizeRatio,
        roundedScale,
        normalizedMinFontSizePx,
      )
    ) {
      continue;
    }

    const distance = Math.abs(roundedScale - clampedTargetScale);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestScale = roundedScale;
    }
  }

  return closestScale;
}

export function clampTypographyConfig(
  typeSizeRatio: number,
  fontSizeScale: number,
  minFontSizePx: number = DEFAULT_BODY_MIN_FONT_SIZE_PX,
): TypographyConstraintResult {
  const clampedRatio = Math.max(
    TYPOGRAPHY_TYPE_SIZE_RATIO_MIN,
    Math.min(TYPOGRAPHY_TYPE_SIZE_RATIO_MAX, typeSizeRatio),
  );
  const normalizedMinFontSizePx = clampMinFontSizePx(minFontSizePx);
  const clampedScale = findClosestValidFontSizeScale(
    clampedRatio,
    fontSizeScale,
    normalizedMinFontSizePx,
  );

  return {
    typeSizeRatio: clampedRatio,
    fontSizeScale: clampedScale,
    minFontSizePx: normalizedMinFontSizePx,
  };
}

function clampTypographySettings(
  input: TypographyConstraintInput,
  minFontSizePx: number = DEFAULT_BODY_MIN_FONT_SIZE_PX,
): TypographyConstraintResult {
  return clampTypographyConfig(
    input.typeSizeRatio,
    input.fontSizeScale,
    minFontSizePx,
  );
}
