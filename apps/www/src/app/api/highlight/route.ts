import { highlightCode } from "@/features/docs/lib/shiki-server";

const MAX_SOURCE_LENGTH = 200_000;

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { code, language } = (input ?? {}) as { code?: unknown; language?: unknown };
  if (typeof code !== "string" || typeof language !== "string") {
    return Response.json({ error: "Code and language are required" }, { status: 400 });
  }
  if (code.length > MAX_SOURCE_LENGTH) {
    return Response.json({ error: "Source is too large" }, { status: 413 });
  }

  return Response.json(await highlightCode(code, language));
}
