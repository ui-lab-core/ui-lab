import { NextRequest, NextResponse } from "next/server";
import { getKarlaMetrics } from "@/features/theme/lib/metrics-api";
import type { FontCategory } from "@/features/theme/constants/font-config";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = (searchParams.get("category") as FontCategory) || "body";

  const karlaMetrics = getKarlaMetrics(category);

  if (!karlaMetrics) {
    return NextResponse.json(
      { error: `Karla metrics not found for category "${category}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(karlaMetrics);
}
