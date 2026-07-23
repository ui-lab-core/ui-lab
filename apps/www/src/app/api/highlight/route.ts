import { highlightCodeForTheme } from "@/features/docs/lib/shiki-server";
import type { SimpleThemeColors } from "@/features/theme/constants/themes";

const MAX_SOURCE_LENGTH = 200_000;

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { code, language, colors, mode } = (input ?? {}) as {
    code?: unknown;
    language?: unknown;
    colors?: unknown;
    mode?: unknown;
  };
  if (
    typeof code !== "string" ||
    typeof language !== "string" ||
    !colors ||
    typeof colors !== "object" ||
    (mode !== "light" && mode !== "dark")
  ) {
    return Response.json({ error: "Code, language, colors, and mode are required" }, { status: 400 });
  }
  if (code.length > MAX_SOURCE_LENGTH) {
    return Response.json({ error: "Source is too large" }, { status: 413 });
  }

  try {
    const html = await highlightCodeForTheme(code, language, colors as SimpleThemeColors, mode);
    return Response.json({ html });
  } catch (error) {
    console.error("Failed to highlight code:", error);
    return Response.json({ error: "Unable to highlight source" }, { status: 400 });
  }
}
