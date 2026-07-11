import { prepareWithSegments, walkLineRanges } from "@chenglou/pretext";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const BASE_PX = 16;
const METRIC_PX = 128;
const COVERAGE_PX = 128;
const INK_ALPHA_THRESHOLD = 127;

// Keep these in sync with the body paragraph path in the typography generator.
const FONT_SIZE_ROUNDING_STEP_PX = 0.15;
const STATIC_SM_PX = 15;
const BODY_TEXT_MULTIPLIER = 1.025;
const BODY_MIN_TO_SM_FACTOR = 1 / 0.9;
const BODY_TEXT_STEPS_FROM_BASE = -1;
const BASE_LS_FACTOR = 0.020;

const REFERENCE_COLUMN_CPL = 38;

const SIZE_X_HEIGHT_WEIGHT = 0.55;
const SIZE_CAP_HEIGHT_WEIGHT = 0.2;
const SIZE_WIDTH_WEIGHT = 0.25;
const SIZE_DARKNESS_GAIN = 0.1;

const DARKNESS_COVERAGE_WEIGHT = 0.75;
const DARKNESS_STEM_WEIGHT = 0.25;

const TRACKING_WIDTH_GAIN = 0.55;
const TRACKING_DARKNESS_GAIN = 0.35;

const FONT_SIZE_SCALE_MIN = 0.8;
const FONT_SIZE_SCALE_MAX = 1.2;
const LINE_HEIGHT_MIN = 1;
const LINE_HEIGHT_MAX = 2;
const LETTER_SPACING_SCALE_MIN = 1;
const LETTER_SPACING_SCALE_MAX = 3.5;
const MIN_FONT_SIZE_MIN = 10;
const MIN_FONT_SIZE_MAX = 18;

const REFERENCE_TEXT =
  "Interface typography needs to stay readable while labels, values, and nested actions compete for attention. " +
  "Dense tools reward fonts with clear counters, sturdy stems, reliable spacing, and numerals that scan cleanly in tables. " +
  "Pairing a geometric header face with a humanist body creates a productive visual tension. " +
  "Getting the size ratio right between the two is often more consequential than the choice of either typeface individually. " +
  "A half-point shift in the scale can tip the balance from comfortable to crowded.";

interface IntrinsicMetrics {
  xHeight: number;
  capHeight: number;
  lowercaseAdvance: number;
  coverage: number;
  stemToXHeight: number;
}

export interface ParagraphReport {
  lineCount: number;
  lastLineFillRatio: number;
}

export interface FontCorrections {
  fontSizeScale: number;
  bodyLineHeight: number;
  bodyLetterSpacingScale: number;
  bodyMinFontSizePx: number;
  paragraph: {
    baseline: ParagraphReport;
    target: ParagraphReport;
  };
}

export interface BaselineConfig {
  fontSizeScale: number;
  bodyLineHeight: number;
  bodyLetterSpacingScale: number;
  bodyMinFontSizePx: number;
}

function round(n: number, decimals: number): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function safeRatio(numerator: number, denominator: number): number {
  return numerator > 0 && denominator > 0 ? numerator / denominator : 1;
}

function metricDelta(value: number, baselineValue: number): number {
  return baselineValue > 0 ? value / baselineValue - 1 : 0;
}

function bodyTextPx(config: Pick<BaselineConfig, "fontSizeScale" | "bodyMinFontSizePx">): number {
  const smPx = roundToStep(
    Math.max(
      STATIC_SM_PX * config.fontSizeScale,
      config.bodyMinFontSizePx * BODY_MIN_TO_SM_FACTOR,
    ),
    FONT_SIZE_ROUNDING_STEP_PX,
  );

  return roundToStep(smPx * BODY_TEXT_MULTIPLIER, FONT_SIZE_ROUNDING_STEP_PX);
}

function solveBodyTextConfig(targetBodyPx: number): {
  fontSizeScale: number;
  bodyMinFontSizePx: number;
} {
  const sourceSmPx = targetBodyPx / BODY_TEXT_MULTIPLIER;

  return {
    fontSizeScale: round(
      clamp(sourceSmPx / STATIC_SM_PX, FONT_SIZE_SCALE_MIN, FONT_SIZE_SCALE_MAX),
      3,
    ),
    bodyMinFontSizePx: round(
      clamp(sourceSmPx / BODY_MIN_TO_SM_FACTOR, MIN_FONT_SIZE_MIN, MIN_FONT_SIZE_MAX),
      2,
    ),
  };
}

function bodyLetterSpacingPx(scale: number, bodyPx: number): number {
  return (
    (BODY_TEXT_STEPS_FROM_BASE + scale - 1) *
    BASE_LS_FACTOR *
    bodyPx
  );
}

function bodyLetterSpacingScaleFromPx(letterSpacingPx: number, bodyPx: number): number {
  if (!(bodyPx > 0)) return 1;

  const letterSpacingEm = letterSpacingPx / bodyPx;
  return (
    1 +
    (letterSpacingEm - BODY_TEXT_STEPS_FROM_BASE * BASE_LS_FACTOR) /
      BASE_LS_FACTOR
  );
}

// Ink coverage = filled pixels / (advance * x-height) for the lowercase alphabet.
// It is scale-invariant and gives a useful darkness signal for body text.
function measureCoverage(family: string): number {
  const meter = new OffscreenCanvas(1, 1).getContext("2d");
  if (!meter) return 0;

  meter.font = `${COVERAGE_PX}px ${family}`;
  const advance = meter.measureText(LOWER).width;
  const xHeight = meter.measureText("x").actualBoundingBoxAscent;
  if (!(advance > 0) || !(xHeight > 0)) return 0;

  const padX = COVERAGE_PX;
  const width = Math.ceil(advance + padX * 2);
  const height = Math.ceil(COVERAGE_PX * 2.2);
  const baseline = Math.round(COVERAGE_PX * 1.4);

  const ctx = new OffscreenCanvas(width, height).getContext("2d");
  if (!ctx) return 0;

  ctx.font = `${COVERAGE_PX}px ${family}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  ctx.fillText(LOWER, padX, baseline);

  const data = ctx.getImageData(0, 0, width, height).data;
  let ink = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > INK_ALPHA_THRESHOLD) ink++;
  }

  return ink / (advance * xHeight);
}

function measureStemToXHeight(family: string): number {
  const ctx = new OffscreenCanvas(1, 1).getContext("2d");
  if (!ctx) return 0;

  ctx.font = `${COVERAGE_PX}px ${family}`;
  const xHeight = ctx.measureText("x").actualBoundingBoxAscent;
  const n = ctx.measureText("n");
  const advance = n.width;

  if (!(advance > 0) || !(xHeight > 0)) return 0;

  const pad = COVERAGE_PX;
  const width = Math.ceil(advance + pad * 2);
  const height = Math.ceil(COVERAGE_PX * 2.2);
  const baseline = Math.round(COVERAGE_PX * 1.4);
  const canvas = new OffscreenCanvas(width, height);
  const ink = canvas.getContext("2d");
  if (!ink) return 0;

  ink.font = `${COVERAGE_PX}px ${family}`;
  ink.textBaseline = "alphabetic";
  ink.fillStyle = "#000";
  ink.fillText("n", pad, baseline);

  const data = ink.getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha <= INK_ALPHA_THRESHOLD) continue;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return 0;

  const bboxHeight = maxY - minY + 1;
  const bandTop = Math.floor(minY + bboxHeight * 0.25);
  const bandBottom = Math.ceil(minY + bboxHeight * 0.75);
  const bandHeight = Math.max(1, bandBottom - bandTop + 1);
  let maxRun = 0;
  let currentRun = 0;

  for (let x = minX; x <= maxX; x++) {
    let columnInk = 0;

    for (let y = bandTop; y <= bandBottom; y++) {
      if (data[(y * width + x) * 4 + 3] > INK_ALPHA_THRESHOLD) {
        columnInk++;
      }
    }

    if (columnInk >= bandHeight * 0.6) {
      currentRun++;
      maxRun = Math.max(maxRun, currentRun);
    } else {
      currentRun = 0;
    }
  }

  const stemWidthAtBase = (maxRun * BASE_PX) / COVERAGE_PX;
  const xHeightAtBase = (xHeight * BASE_PX) / COVERAGE_PX;

  return xHeightAtBase > 0 ? stemWidthAtBase / xHeightAtBase : 0;
}

function measureIntrinsic(family: string): IntrinsicMetrics {
  const ctx = new OffscreenCanvas(1, 1).getContext("2d");
  if (!ctx) {
    return {
      xHeight: 0,
      capHeight: 0,
      lowercaseAdvance: 0,
      coverage: 0,
      stemToXHeight: 0,
    };
  }

  ctx.font = `${METRIC_PX}px ${family}`;

  const x = ctx.measureText("x");
  const h = ctx.measureText("H");
  const lower = ctx.measureText(LOWER);
  const metricScale = BASE_PX / METRIC_PX;

  return {
    xHeight: x.actualBoundingBoxAscent * metricScale,
    capHeight: h.actualBoundingBoxAscent * metricScale,
    lowercaseAdvance: (lower.width / LOWER.length) * metricScale,
    coverage: measureCoverage(family),
    stemToXHeight: measureStemToXHeight(family),
  };
}

function normalizedDarkness(target: IntrinsicMetrics, baseline: IntrinsicMetrics): number {
  return (
    DARKNESS_COVERAGE_WEIGHT * metricDelta(target.coverage, baseline.coverage) +
    DARKNESS_STEM_WEIGHT *
      metricDelta(target.stemToXHeight, baseline.stemToXHeight)
  );
}

function measureParagraph(
  family: string,
  bodyPx: number,
  letterSpacingPx: number,
  containerWidth: number,
): ParagraphReport {
  const prepared = prepareWithSegments(REFERENCE_TEXT, `${bodyPx}px ${family}`, {
    letterSpacing: letterSpacingPx,
  });
  let lastLineWidth = 0;
  const lineCount = walkLineRanges(prepared, containerWidth, ({ width }) => {
    lastLineWidth = width;
  });

  return {
    lineCount,
    lastLineFillRatio: containerWidth > 0 ? lastLineWidth / containerWidth : 0,
  };
}

function paragraphContainerWidth(metrics: IntrinsicMetrics, baseline: BaselineConfig): number {
  const baselineBodyPx = bodyTextPx(baseline);
  const baselineAdvancePx =
    metrics.lowercaseAdvance * (baselineBodyPx / BASE_PX) +
    bodyLetterSpacingPx(baseline.bodyLetterSpacingScale, baselineBodyPx);

  return REFERENCE_COLUMN_CPL * baselineAdvancePx;
}

function computeParagraphReports({
  baselineFamily,
  targetFamily,
  baselineMetrics,
  baseline,
  target,
}: {
  baselineFamily: string;
  targetFamily: string;
  baselineMetrics: IntrinsicMetrics;
  baseline: BaselineConfig;
  target: BaselineConfig;
}): FontCorrections["paragraph"] {
  const baselineBodyPx = bodyTextPx(baseline);
  const targetBodyPx = bodyTextPx(target);
  const containerWidth = paragraphContainerWidth(baselineMetrics, baseline);

  return {
    baseline: measureParagraph(
      baselineFamily,
      baselineBodyPx,
      bodyLetterSpacingPx(baseline.bodyLetterSpacingScale, baselineBodyPx),
      containerWidth,
    ),
    target: measureParagraph(
      targetFamily,
      targetBodyPx,
      bodyLetterSpacingPx(target.bodyLetterSpacingScale, targetBodyPx),
      containerWidth,
    ),
  };
}

export function computeFontCorrections(
  targetFamily: string,
  baselineFamily: string,
  baseline: BaselineConfig,
): FontCorrections {
  const baselineMetrics = measureIntrinsic(baselineFamily);
  const targetMetrics = measureIntrinsic(targetFamily);

  if (targetFamily === baselineFamily) {
    return {
      fontSizeScale: baseline.fontSizeScale,
      bodyLineHeight: baseline.bodyLineHeight,
      bodyLetterSpacingScale: baseline.bodyLetterSpacingScale,
      bodyMinFontSizePx: baseline.bodyMinFontSizePx,
      paragraph: computeParagraphReports({
        baselineFamily,
        targetFamily,
        baselineMetrics,
        baseline,
        target: baseline,
      }),
    };
  }

  const baselineBodyPx = bodyTextPx(baseline);
  const darkness = normalizedDarkness(targetMetrics, baselineMetrics);

  const desiredBodyPx =
    baselineBodyPx *
    Math.exp(
      SIZE_X_HEIGHT_WEIGHT *
        Math.log(safeRatio(baselineMetrics.xHeight, targetMetrics.xHeight)) +
        SIZE_CAP_HEIGHT_WEIGHT *
          Math.log(safeRatio(baselineMetrics.capHeight, targetMetrics.capHeight)) +
        SIZE_WIDTH_WEIGHT *
          Math.log(
            safeRatio(
              baselineMetrics.lowercaseAdvance,
              targetMetrics.lowercaseAdvance,
            ),
          ) -
        SIZE_DARKNESS_GAIN * darkness,
    );

  const sizeConfig = solveBodyTextConfig(desiredBodyPx);
  const targetBodyPx = bodyTextPx(sizeConfig);
  const baselineLinePx = baselineBodyPx * baseline.bodyLineHeight;

  const bodyLineHeight = round(
    clamp(baselineLinePx / targetBodyPx, LINE_HEIGHT_MIN, LINE_HEIGHT_MAX),
    2,
  );

  const baselineLetterSpacingPx = bodyLetterSpacingPx(
    baseline.bodyLetterSpacingScale,
    baselineBodyPx,
  );
  const baselineAdvancePx =
    baselineMetrics.lowercaseAdvance * (baselineBodyPx / BASE_PX);
  const targetAdvancePx =
    targetMetrics.lowercaseAdvance * (targetBodyPx / BASE_PX);
  const targetLetterSpacingPx =
    baselineLetterSpacingPx +
    TRACKING_WIDTH_GAIN * (baselineAdvancePx - targetAdvancePx);

  const bodyLetterSpacingScale = round(
    clamp(
      bodyLetterSpacingScaleFromPx(targetLetterSpacingPx, targetBodyPx) +
        TRACKING_DARKNESS_GAIN * darkness,
      LETTER_SPACING_SCALE_MIN,
      LETTER_SPACING_SCALE_MAX,
    ),
    2,
  );

  const targetConfig: BaselineConfig = {
    fontSizeScale: sizeConfig.fontSizeScale,
    bodyLineHeight,
    bodyLetterSpacingScale,
    bodyMinFontSizePx: sizeConfig.bodyMinFontSizePx,
  };

  return {
    fontSizeScale: targetConfig.fontSizeScale,
    bodyLineHeight: targetConfig.bodyLineHeight,
    bodyLetterSpacingScale: targetConfig.bodyLetterSpacingScale,
    bodyMinFontSizePx: targetConfig.bodyMinFontSizePx,
    paragraph: computeParagraphReports({
      baselineFamily,
      targetFamily,
      baselineMetrics,
      baseline,
      target: targetConfig,
    }),
  };
}
