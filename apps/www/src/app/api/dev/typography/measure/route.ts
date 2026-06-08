import { NextRequest, NextResponse } from "next/server";
import {
  measureGlyphMetrics,
  type MeasuredGlyphMetrics,
} from "@/features/theme/lib/metrics-api";
import {
  getFontConfig,
  type FontKey,
  type FontCategory,
  type FontMetrics,
} from "@/features/theme/constants/font-config";

interface MeasureRequest {
  fontName: FontKey;
  category: FontCategory;
  pointSize?: number;
  metrics?: Partial<FontMetrics>;
  globalMinFontSize?: number;
}

interface MeasureResponse {
  fontName: string;
  category: FontCategory;
  pointSize: number;
  globalMinFontSize: number;
  appliedMetrics: FontMetrics;
  measuredMetrics: MeasuredGlyphMetrics | null;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MeasureRequest = await request.json();

    const {
      fontName,
      category,
      pointSize = 18,
      metrics: proposedMetrics,
      globalMinFontSize = 12,
    } = body;

    if (!fontName || !category) {
      return NextResponse.json(
        { error: "Missing required fields: fontName, category" },
        { status: 400 },
      );
    }

    const fontConfig = getFontConfig(fontName, category);
    if (!fontConfig) {
      return NextResponse.json(
        { error: `Font "${fontName}" not found in category "${category}"` },
        { status: 404 },
      );
    }

    // Merge proposed metrics with existing config
    const appliedMetrics: FontMetrics = {
      ...fontConfig.metrics,
      ...(proposedMetrics || {}),
    };

    // Measure glyph metrics with the applied configuration
    const fontFamily = fontConfig.family;
    let measuredMetrics = null;
    let measureError: string | undefined;

    try {
      measuredMetrics = measureGlyphMetrics(fontFamily, pointSize);
    } catch (e) {
      measureError = e instanceof Error ? e.message : String(e);
    }

    const response: any = {
      fontName,
      category,
      pointSize,
      globalMinFontSize,
      appliedMetrics,
      measuredMetrics,
    };

    if (measureError) {
      response.measureError = measureError;
    }

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
