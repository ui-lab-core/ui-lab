import { KERNING_PAIRS } from "./constants";
import type { GlyphMeasurement, PointSizeMetrics, RenderedFontMetrics } from "./types";

export function roundMetric(value: number, decimals = 3) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(decimals));
}

export function measureGlyph(
  context: CanvasRenderingContext2D,
  character: string,
  pointSize: number,
): GlyphMeasurement {
  const metrics = context.measureText(character);
  const actualAscent = metrics.actualBoundingBoxAscent || 0;
  const actualDescent = metrics.actualBoundingBoxDescent || 0;

  return {
    character,
    width: roundMetric(metrics.width),
    actualLeft: roundMetric(metrics.actualBoundingBoxLeft || 0),
    actualRight: roundMetric(metrics.actualBoundingBoxRight || metrics.width),
    actualAscent: roundMetric(actualAscent),
    actualDescent: roundMetric(actualDescent),
    fontAscent: roundMetric(metrics.fontBoundingBoxAscent || actualAscent),
    fontDescent: roundMetric(metrics.fontBoundingBoxDescent || actualDescent),
    capHeightRatio: roundMetric(actualAscent / pointSize),
    xHeightRatio: roundMetric(actualAscent / pointSize),
  };
}

export function measureRenderedFontMetrics(
  fontFamily: string,
  pointSize: number,
  character: string,
): RenderedFontMetrics | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) return null;

  context.font = `400 ${pointSize}px ${fontFamily}`;
  context.textBaseline = "alphabetic";
  (context as CanvasRenderingContext2D & { fontKerning?: string }).fontKerning = "normal";

  const selected = measureGlyph(context, character, pointSize);
  const cap = measureGlyph(context, "H", pointSize);
  const x = measureGlyph(context, "x", pointSize);
  const asc = measureGlyph(context, "h", pointSize);
  const desc = measureGlyph(context, "p", pointSize);
  const stem = measureGlyph(context, "I", pointSize);
  const bowl = measureGlyph(context, "O", pointSize);
  const counter = measureGlyph(context, "o", pointSize);

  return {
    selected: {
      ...selected,
      capHeightRatio: roundMetric(cap.actualAscent / pointSize),
      xHeightRatio: roundMetric(x.actualAscent / pointSize),
    },
    capHeight: roundMetric(cap.actualAscent / pointSize),
    xHeight: roundMetric(x.actualAscent / pointSize),
    ascender: roundMetric(Math.max(asc.actualAscent, selected.fontAscent) / pointSize),
    descender: roundMetric(Math.max(desc.actualDescent, selected.fontDescent) / pointSize),
    stem: roundMetric(stem.width / pointSize),
    bowlWidth: roundMetric(bowl.width / pointSize),
    counterProxy: roundMetric(counter.width / Math.max(bowl.width, 1)),
    kerningPairs: KERNING_PAIRS.map((pair) => {
      const [first, second] = Array.from(pair);
      const firstWidth = context.measureText(first).width;
      const secondWidth = context.measureText(second).width;
      const pairWidth = context.measureText(pair).width;

      return {
        pair,
        width: roundMetric(pairWidth),
        sumWidth: roundMetric(firstWidth + secondWidth),
        delta: roundMetric(pairWidth - firstWidth - secondWidth),
      };
    }),
    loaded: true,
  };
}

export function toPointSizeMetrics(metrics: RenderedFontMetrics | null): PointSizeMetrics {
  return {
    capHeight: metrics?.capHeight ?? 0,
    xHeight: metrics?.xHeight ?? 0,
    ascender: metrics?.ascender ?? 0,
    descender: metrics?.descender ?? 0,
    stem: metrics?.stem ?? 0,
    bowlWidth: metrics?.bowlWidth ?? 0,
    counterProxy: metrics?.counterProxy ?? 0,
  };
}
