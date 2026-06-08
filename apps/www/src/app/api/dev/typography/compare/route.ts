import { NextRequest, NextResponse } from "next/server";
import {
  compareMetrics,
  suggestAdjustments,
} from "@/features/theme/lib/metrics-api";
import type { FontKey, FontCategory } from "@/features/theme/constants/font-config";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetFont = searchParams.get("targetFont");
  const referenceFont = (searchParams.get("referenceFont") || "Karla") as FontKey;
  const category = (searchParams.get("category") as FontCategory) || "body";
  const threshold = parseFloat(searchParams.get("threshold") || "0.05");
  const includeSuggestions = searchParams.get("suggestions") !== "false";

  if (!targetFont) {
    return NextResponse.json(
      { error: "Missing required parameter: targetFont" },
      { status: 400 },
    );
  }

  const comparison = compareMetrics(
    targetFont as FontKey,
    referenceFont,
    category,
  );

  if (!comparison) {
    return NextResponse.json(
      {
        error: `Could not compare "${targetFont}" against "${referenceFont}" in category "${category}"`,
      },
      { status: 404 },
    );
  }

  let suggestions = undefined;
  if (includeSuggestions) {
    suggestions = suggestAdjustments(
      targetFont as FontKey,
      referenceFont,
      category,
      threshold,
    );
  }

  return NextResponse.json({
    comparison,
    suggestions,
  });
}
