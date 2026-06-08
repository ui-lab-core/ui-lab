import { NextRequest, NextResponse } from "next/server";
import {
  BODY_FONTS,
  HEADER_FONTS,
  MONO_FONTS,
  type FontCategory,
} from "@/features/theme/constants/font-config";
import { getFontMetricsResponse } from "@/features/theme/lib/metrics-api";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = (searchParams.get("category") as FontCategory) || "body";

  let fontList;
  switch (category) {
    case "header":
      fontList = HEADER_FONTS;
      break;
    case "mono":
      fontList = MONO_FONTS;
      break;
    case "body":
    default:
      fontList = BODY_FONTS;
  }

  const fonts = fontList.map((font) => getFontMetricsResponse(font.name, category)).filter(Boolean);

  return NextResponse.json({
    category,
    count: fonts.length,
    fonts,
  });
}
