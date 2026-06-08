import { NextRequest, NextResponse } from "next/server";
import {
  getFontMetricsResponse,
  type FontMetricsResponse,
} from "@/features/theme/lib/metrics-api";
import type { FontKey, FontCategory } from "@/features/theme/constants/font-config";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fontName = searchParams.get("fontName");
  const category = (searchParams.get("category") as FontCategory) || "body";

  if (!fontName) {
    return NextResponse.json(
      { error: "Missing required parameter: fontName" },
      { status: 400 },
    );
  }

  const metrics = getFontMetricsResponse(fontName as FontKey, category);

  if (!metrics) {
    return NextResponse.json(
      { error: `Font "${fontName}" not found in category "${category}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(metrics);
}
