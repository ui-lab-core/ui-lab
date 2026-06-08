import { NextRequest, NextResponse } from "next/server";
import {
  measureGlyphMetrics,
  compareMeasuredMetrics,
} from "@/features/theme/lib/metrics-api";
import {
  getFontConfig,
  type FontKey,
  type FontCategory,
  type FontMetrics,
} from "@/features/theme/constants/font-config";

interface CompareMeasuresRequest {
  targetFont: FontKey;
  referenceFont?: FontKey;
  category?: FontCategory;
  pointSize?: number;
  targetMetrics?: Partial<FontMetrics>;
  referenceMetrics?: Partial<FontMetrics>;
}

interface CompareMeasuresResponse {
  targetFont: string;
  referenceFont: string;
  category: FontCategory;
  pointSize: number;
  targetMetrics: Record<string, number | null>;
  referenceMetrics: Record<string, number | null>;
  comparison: Record<string, {
    target: number | null;
    reference: number | null;
    delta: number | null;
    deltaPercent: number | null;
  }>;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CompareMeasuresRequest = await request.json();

    const {
      targetFont,
      referenceFont = "Karla",
      category = "body",
      pointSize = 18,
      targetMetrics: targetProposedMetrics,
      referenceMetrics: referenceProposedMetrics,
    } = body;

    if (!targetFont) {
      return NextResponse.json(
        { error: "Missing required field: targetFont" },
        { status: 400 },
      );
    }

    // Get font configs
    const targetConfig = getFontConfig(targetFont, category);
    const referenceConfig = getFontConfig(referenceFont, category);

    if (!targetConfig) {
      return NextResponse.json(
        { error: `Target font "${targetFont}" not found in category "${category}"` },
        { status: 404 },
      );
    }

    if (!referenceConfig) {
      return NextResponse.json(
        {
          error: `Reference font "${referenceFont}" not found in category "${category}"`,
        },
        { status: 404 },
      );
    }

    // Merge proposed metrics
    const targetAppliedMetrics: FontMetrics = {
      ...targetConfig.metrics,
      ...(targetProposedMetrics || {}),
    };

    const referenceAppliedMetrics: FontMetrics = {
      ...referenceConfig.metrics,
      ...(referenceProposedMetrics || {}),
    };

    // Measure both fonts
    const targetMeasured = measureGlyphMetrics(targetConfig.family, pointSize);
    const referenceMeasured = measureGlyphMetrics(referenceConfig.family, pointSize);

    // Compare measurements
    const comparison = compareMeasuredMetrics(
      targetMeasured,
      referenceMeasured,
      targetFont,
      referenceFont,
      pointSize,
    );

    // Create response with readable metric names
    const metricsMap = {
      baseline: "Baseline (0px)",
      capHeight: "Cap Height (em)",
      xHeight: "X-height (em)",
      ascender: "Ascender (em)",
      descender: "Descender (em)",
      stem: "Stem (em)",
      bowlWidth: "Bowl Width (em)",
      counterProxy: "Counter Proxy",
    };

    const response: CompareMeasuresResponse = {
      targetFont,
      referenceFont,
      category,
      pointSize,
      targetMetrics: targetMeasured
        ? Object.fromEntries(
            Object.entries(metricsMap).map(([key, label]) => [
              label,
              targetMeasured[key as keyof typeof metricsMap] ?? null,
            ]),
          )
        : {},
      referenceMetrics: referenceMeasured
        ? Object.fromEntries(
            Object.entries(metricsMap).map(([key, label]) => [
              label,
              referenceMeasured[key as keyof typeof metricsMap] ?? null,
            ]),
          )
        : {},
      comparison: comparison.metrics,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 },
    );
  }
}
