import {
  getFontConfig,
  getDefaultBodyFont,
  type FontKey,
  type FontCategory,
  type FontMetrics,
} from "@/features/theme/constants/font-config";

export interface FontMetricsResponse {
  name: string;
  family: string;
  category: FontCategory;
  metrics: FontMetrics;
}

export interface MetricsComparison {
  targetFont: string;
  referenceFont: string;
  metrics: Record<string, {
    target: number | undefined;
    reference: number | undefined;
    delta: number | null;
    deltaPercent: number | null;
  }>;
}

export interface AdjustmentSuggestion {
  metric: string;
  currentValue: number | undefined;
  suggestedValue: number;
  reason: string;
}

const NUMERIC_METRICS = [
  "fontSizeScale",
  "fontWeightScale",
  "typeSizeRatio",
  "capHeight",
  "xHeight",
  "ascender",
  "descender",
  "stem",
  "bowlCounter",
  "tracking",
  "leading",
  "pointSize",
  "baseline",
  "headerLetterSpacingScale",
  "headerLineHeight",
  "bodyLetterSpacingScale",
  "bodyTypeSizeRatio",
  "headerFontWeightScale",
  "bodyFontWeightScale",
  "bodyFontSizeScale",
  "bodyLineHeight",
] as const;

export function getFontMetricsResponse(
  fontName: FontKey,
  category: FontCategory,
): FontMetricsResponse | null {
  const config = getFontConfig(fontName, category);
  if (!config) return null;

  return {
    name: config.name,
    family: config.family,
    category: config.category,
    metrics: config.metrics,
  };
}

export function getKarlaMetrics(
  category: FontCategory,
): FontMetricsResponse | null {
  return getFontMetricsResponse("Karla", category);
}

export function compareMetrics(
  targetFont: FontKey,
  referenceFont: FontKey = "Karla",
  category: FontCategory = "body",
): MetricsComparison | null {
  const target = getFontConfig(targetFont, category);
  const reference = getFontConfig(referenceFont, category);

  if (!target || !reference) return null;

  const comparison: MetricsComparison = {
    targetFont: target.name,
    referenceFont: reference.name,
    metrics: {},
  };

  NUMERIC_METRICS.forEach((metric) => {
    const targetValue = target.metrics[metric];
    const refValue = reference.metrics[metric];

    let delta: number | null = null;
    let deltaPercent: number | null = null;

    if (
      typeof targetValue === "number" &&
      typeof refValue === "number" &&
      refValue !== 0
    ) {
      delta = targetValue - refValue;
      deltaPercent = (delta / refValue) * 100;
    }

    comparison.metrics[metric] = {
      target: targetValue,
      reference: refValue,
      delta,
      deltaPercent,
    };
  });

  return comparison;
}

export function suggestAdjustments(
  targetFont: FontKey,
  referenceFont: FontKey = "Karla",
  category: FontCategory = "body",
  threshold = 0.05,
): AdjustmentSuggestion[] {
  const comparison = compareMetrics(targetFont, referenceFont, category);
  if (!comparison) return [];

  const suggestions: AdjustmentSuggestion[] = [];

  Object.entries(comparison.metrics).forEach(([metric, data]) => {
    if (
      data.target === undefined ||
      data.reference === undefined ||
      data.deltaPercent === null
    ) {
      return;
    }

    const absDeltaPercent = Math.abs(data.deltaPercent);

    if (absDeltaPercent > threshold * 100) {
      suggestions.push({
        metric,
        currentValue: data.target,
        suggestedValue: data.reference,
        reason: `Differs by ${absDeltaPercent.toFixed(1)}% from ${referenceFont}`,
      });
    }
  });

  return suggestions.sort(
    (a, b) =>
      Math.abs(
        ((b.currentValue ?? 0) - (b.suggestedValue ?? 0)) / (b.suggestedValue ?? 1),
      ) -
      Math.abs(
        ((a.currentValue ?? 0) - (a.suggestedValue ?? 0)) / (a.suggestedValue ?? 1),
      ),
  );
}

export interface MeasuredGlyphMetrics {
  baseline: number;
  capHeight: number;
  xHeight: number;
  ascender: number;
  descender: number;
  stem: number;
  bowlWidth: number;
  counterProxy: number;
  loaded: boolean;
}

export interface MeasuredMetricsComparison {
  targetFont: string;
  referenceFont: string;
  pointSize: number;
  metrics: Record<string, {
    target: number | null;
    reference: number | null;
    delta: number | null;
    deltaPercent: number | null;
  }>;
}

function roundMetric(value: number, decimals = 3) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(decimals));
}

// Pre-measured metrics for fallback (measured at 18px using browser Canvas API)
const FALLBACK_METRICS: Record<string, MeasuredGlyphMetrics> = {
  "Karla Variable": {
    baseline: 0,
    capHeight: 0.667,
    xHeight: 0.5,
    ascender: 0.944,
    descender: 0.278,
    stem: 0.28,
    bowlWidth: 0.645,
    counterProxy: 0.846,
    loaded: true,
  },
  "Inter Variable": {
    baseline: 0,
    capHeight: 0.683,
    xHeight: 0.517,
    ascender: 0.95,
    descender: 0.25,
    stem: 0.078,
    bowlWidth: 0.71,
    counterProxy: 0.839,
    loaded: true,
  },
};

export function measureGlyphMetrics(
  fontFamily: string,
  pointSize: number,
): MeasuredGlyphMetrics | null {
  try {
    // Use same measurement logic as client-side typography page
    const { createCanvas } = require("canvas");

    const canvas = createCanvas(400, 300);
    const context = canvas.getContext("2d");

    context.font = `400 ${pointSize}px ${fontFamily}`;
    context.textBaseline = "alphabetic";

    // Exact same measurement logic as client.tsx
    const measureGlyph = (character: string) => {
      const metrics = context.measureText(character);
      const actualAscent = metrics.actualBoundingBoxAscent || 0;
      const actualDescent = metrics.actualBoundingBoxDescent || 0;

      return {
        actualAscent: roundMetric(actualAscent),
        actualDescent: roundMetric(actualDescent),
        fontAscent: roundMetric(metrics.fontBoundingBoxAscent || actualAscent),
        fontDescent: roundMetric(metrics.fontBoundingBoxDescent || actualDescent),
        width: roundMetric(metrics.width),
      };
    };

    const cap = measureGlyph("H");
    const x = measureGlyph("x");
    const asc = measureGlyph("h");
    const desc = measureGlyph("p");
    const stem = measureGlyph("I");
    const bowl = measureGlyph("O");
    const counter = measureGlyph("o");

    return {
      baseline: 0,
      capHeight: roundMetric(cap.actualAscent / pointSize),
      xHeight: roundMetric(x.actualAscent / pointSize),
      ascender: roundMetric(Math.max(asc.actualAscent, asc.fontAscent) / pointSize),
      descender: roundMetric(Math.max(desc.actualDescent, desc.fontDescent) / pointSize),
      stem: roundMetric(stem.width / pointSize),
      bowlWidth: roundMetric(bowl.width / pointSize),
      counterProxy: roundMetric(counter.width / Math.max(bowl.width, 1)),
      loaded: true,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Failed to measure glyph metrics:", errorMsg);

    // Try to return fallback metrics if available
    for (const [fontName, metrics] of Object.entries(FALLBACK_METRICS)) {
      if (fontFamily.includes(fontName)) {
        console.info(`Using fallback metrics for ${fontName} (measured at 18px)`);
        return metrics;
      }
    }

    return null;
  }
}

export function compareMeasuredMetrics(
  targetMetrics: MeasuredGlyphMetrics | null,
  referenceMetrics: MeasuredGlyphMetrics | null,
  targetFontName: string,
  referenceFontName: string,
  pointSize: number,
): MeasuredMetricsComparison {
  const metrics: Record<string, {
    target: number | null;
    reference: number | null;
    delta: number | null;
    deltaPercent: number | null;
  }> = {};

  const metricsKeys: Array<keyof MeasuredGlyphMetrics> = [
    "baseline",
    "capHeight",
    "xHeight",
    "ascender",
    "descender",
    "stem",
    "bowlWidth",
    "counterProxy",
  ];

  metricsKeys.forEach((key) => {
    const targetValue = targetMetrics?.[key] ?? null;
    const refValue = referenceMetrics?.[key] ?? null;

    let delta: number | null = null;
    let deltaPercent: number | null = null;

    if (
      typeof targetValue === "number" &&
      typeof refValue === "number" &&
      refValue !== 0
    ) {
      delta = roundMetric(targetValue - refValue);
      deltaPercent = roundMetric((delta / refValue) * 100);
    }

    metrics[key] = {
      target: targetValue,
      reference: refValue,
      delta,
      deltaPercent,
    };
  });

  return {
    targetFont: targetFontName,
    referenceFont: referenceFontName,
    pointSize,
    metrics,
  };
}
