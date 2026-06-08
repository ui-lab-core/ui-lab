import { NextRequest, NextResponse } from "next/server";
import type { FontKey, FontCategory, FontMetrics } from "@/features/theme/constants/font-config";
import { getFontConfig } from "@/features/theme/constants/font-config";

interface AdjustmentRequest {
  fontName: FontKey;
  category: FontCategory;
  metrics: Partial<FontMetrics>;
}

interface AdjustmentResponse {
  fontName: string;
  category: FontCategory;
  currentMetrics: FontMetrics;
  proposedMetrics: FontMetrics;
  changes: Record<string, { from: unknown; to: unknown }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: AdjustmentRequest = await request.json();

    const { fontName, category, metrics: proposedMetrics } = body;

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

    const currentMetrics = fontConfig.metrics;
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    Object.entries(proposedMetrics).forEach(([key, value]) => {
      if (currentMetrics[key as keyof FontMetrics] !== value) {
        changes[key] = {
          from: currentMetrics[key as keyof FontMetrics],
          to: value,
        };
      }
    });

    const response: AdjustmentResponse = {
      fontName,
      category,
      currentMetrics,
      proposedMetrics: { ...currentMetrics, ...proposedMetrics },
      changes,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
