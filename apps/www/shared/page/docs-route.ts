import { NextResponse } from "next/server";
import { generatedAPI, generatedStyles } from "ui-lab-registry";

/**
 * Serves a component's API and styles docs to the lazy tabs and the copy
 * action. Mount at `app/api/component-docs/[component]/route.ts`.
 */
export async function GET(request: Request, { params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;
  const tab = new URL(request.url).searchParams.get("tab");
  const styles = generatedStyles[component] ?? null;

  if (tab === "api") {
    return NextResponse.json({
      api: generatedAPI[component] ?? null,
      parts: styles?.styleableParts ?? [],
    });
  }

  if (tab === "styles") return NextResponse.json({ styles });
  return NextResponse.json({ error: "Unknown documentation tab" }, { status: 400 });
}
