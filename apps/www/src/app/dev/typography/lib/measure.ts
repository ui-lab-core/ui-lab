import { prepareWithSegments, walkLineRanges } from "@chenglou/pretext";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const BASE_PX = 16;
const CONTAINER_CPL = 65;
// Must match baseLetterSpacingFactor in generator.ts
const BASE_LS_FACTOR = 0.020;

// Render size for the ink-coverage measurement. Large enough that anti-aliased
// edges are a small fraction of the filled area, so getImageData coverage
// approximates the font's geometric ink ratio.
const COVERAGE_PX = 128;
const INK_ALPHA_THRESHOLD = 127;

// --- Perceptual model (InfoTypography, Lang & Nacenta, ACM TOG 2022) ---
// Perceived text "size/presence" is a two-channel quantity: an x-height channel
// (taller looks bigger) and a dominant weight/darkness channel measured as ink
// coverage (darker looks bigger). fontSizeScale compensates both, anchored to
// the Karla baseline, using a local-linear approximation of the paper's sigmoid
// (x-height) and concave-quadratic (weight) response curves. Gains fit to the
// hand-tuned Karla/Inter/Geist/Work Sans targets (RMS 0.012); since ink coverage
// is browser-dependent, DARKNESS_GAIN is the primary recalibration knob.
const X_HEIGHT_GAIN = 4.4;
const DARKNESS_GAIN = 7.6;
// Letter spacing rises with darkness to keep counters open at body size.
const LS_DARKNESS_GAIN = 23;
const LS_MIN = 1;
const LS_MAX = 3;
// Line height tracks the font's vertical metrics box (browser fontBoundingBox).
const LINE_HEIGHT_EXP = 1.49;

const REFERENCE_TEXT =
  "Interface typography needs to stay readable while labels, values, and nested actions compete for attention. " +
  "Dense tools reward fonts with clear counters, sturdy stems, reliable spacing, and numerals that scan cleanly in tables. " +
  "Pairing a geometric header face with a humanist body creates a productive visual tension. " +
  "Getting the size ratio right between the two is often more consequential than the choice of either typeface individually — " +
  "a half-point shift in the scale can tip the balance from comfortable to crowded.";

interface IntrinsicMetrics {
  xHeight: number; // actualBoundingBoxAscent of "x" at BASE_PX
  fontBox: number; // fontBoundingBoxAscent + fontBoundingBoxDescent at BASE_PX
  avgAdvance: number; // measured at BASE_PX
  coverage: number; // ink fraction, scale-invariant (darkness channel)
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

// Ink coverage = filled pixels / (advance * x-height) for the lowercase alphabet,
// rendered large and thresholded. Scale-invariant, so it reads as per-font
// darkness independent of the chosen render size.
function measureCoverage(family: string): number {
  const meter = new OffscreenCanvas(1, 1).getContext("2d")!;
  meter.font = `${COVERAGE_PX}px ${family}`;
  const advance = meter.measureText(LOWER).width;
  const xHeight = meter.measureText("x").actualBoundingBoxAscent;
  if (!(advance > 0) || !(xHeight > 0)) return 0;

  const padX = COVERAGE_PX;
  const width = Math.ceil(advance + padX * 2);
  const height = Math.ceil(COVERAGE_PX * 2.2);
  const baseline = Math.round(COVERAGE_PX * 1.4);

  const ctx = new OffscreenCanvas(width, height).getContext("2d")!;
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

function measureIntrinsic(family: string): IntrinsicMetrics {
  const ctx = new OffscreenCanvas(1, 1).getContext("2d")!;
  ctx.font = `${BASE_PX}px ${family}`;

  const x = ctx.measureText("x");
  const alpha = ctx.measureText(ALPHABET);

  return {
    xHeight: x.actualBoundingBoxAscent,
    fontBox: x.fontBoundingBoxAscent + x.fontBoundingBoxDescent,
    avgAdvance: alpha.width / ALPHABET.length,
    coverage: measureCoverage(family),
  };
}

// CSS letter-spacing in px at effective font size, for base text (stepsFromBase = 0)
function lsPx(scale: number, effectivePx: number): number {
  return (scale - 1) * BASE_LS_FACTOR * effectivePx;
}

function measureParagraph(
  family: string,
  effectivePx: number,
  lsScale: number,
  containerWidth: number,
): ParagraphReport {
  const prepared = prepareWithSegments(REFERENCE_TEXT, `${effectivePx}px ${family}`, {
    letterSpacing: lsPx(lsScale, effectivePx),
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

function round(n: number, decimals: number): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function computeFontCorrections(
  targetFamily: string,
  baselineFamily: string,
  baseline: BaselineConfig,
): FontCorrections {
  const bm = measureIntrinsic(baselineFamily);
  const tm = measureIntrinsic(targetFamily);

  // Two perceptual channels, relative to the baseline so absolute calibration
  // (browser anti-aliasing, render size) largely cancels.
  const relXHeight = (tm.xHeight - bm.xHeight) / bm.xHeight;
  const relCoverage =
    bm.coverage > 0 ? (tm.coverage - bm.coverage) / bm.coverage : 0;

  // 1. fontSizeScale: compensate perceived size. Taller x-height reads bigger
  //    (scale up); darker ink reads bigger (scale down) — darkness dominates.
  const fontSizeScale = round(
    baseline.fontSizeScale *
      (1 + X_HEIGHT_GAIN * relXHeight - DARKNESS_GAIN * relCoverage),
    3,
  );

  // 2. bodyLineHeight: keep the vertical rhythm proportional to the font box.
  const bodyLineHeight = round(
    baseline.bodyLineHeight * (tm.fontBox / bm.fontBox) ** LINE_HEIGHT_EXP,
    2,
  );

  // 3. bodyLetterSpacingScale: open up tracking for darker faces.
  const bodyLetterSpacingScale = round(
    clamp(
      baseline.bodyLetterSpacingScale + LS_DARKNESS_GAIN * relCoverage,
      LS_MIN,
      LS_MAX,
    ),
    2,
  );

  // 4. bodyMinFontSizePx: hold a constant perceived x-height at the floor, so a
  //    larger-x-height font may shrink further before becoming illegible.
  const bodyMinFontSizePx = round(
    Math.max(10, baseline.bodyMinFontSizePx * (bm.xHeight / tm.xHeight)),
    2,
  );

  // Paragraph validation: measure both fonts at their effective settings
  const baselinePx = BASE_PX * baseline.fontSizeScale;
  const targetPx = BASE_PX * fontSizeScale;
  // Container width: 65 chars at Karla's effective advance (including letter spacing)
  const containerWidth =
    CONTAINER_CPL *
    (bm.avgAdvance * baseline.fontSizeScale + lsPx(baseline.bodyLetterSpacingScale, baselinePx));

  return {
    fontSizeScale,
    bodyLineHeight,
    bodyLetterSpacingScale,
    bodyMinFontSizePx,
    paragraph: {
      baseline: measureParagraph(
        baselineFamily,
        baselinePx,
        baseline.bodyLetterSpacingScale,
        containerWidth,
      ),
      target: measureParagraph(targetFamily, targetPx, bodyLetterSpacingScale, containerWidth),
    },
  };
}
