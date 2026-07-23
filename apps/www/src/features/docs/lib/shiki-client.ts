import type { SimpleThemeColors } from "@/features/theme/constants/themes";
import { resolveCodeThemeSelection } from "@/features/theme/lib/themes/shiki/resolve-code-theme";
import { resolveShikiLanguage } from "@/features/docs/lib/shiki-language";

type ShikiModule = typeof import("shiki");

let shikiPromise: Promise<ShikiModule> | undefined;
const highlightCache = new Map<string, Promise<string>>();
const MAX_CACHE_ENTRIES = 100;

function loadShiki() {
  shikiPromise ??= import("shiki");
  return shikiPromise;
}

export function highlightInlineCode(
  code: string,
  language: string,
  colors: SimpleThemeColors,
  mode: "light" | "dark",
) {
  const key = `${language}\u0000${mode}\u0000${JSON.stringify(colors)}\u0000${code}`;
  const cached = highlightCache.get(key);
  if (cached) return cached;

  const request = loadShiki().then(async ({ bundledLanguages, bundledLanguagesAlias, codeToHtml }) => {
    const html = await codeToHtml(code, {
      lang: resolveShikiLanguage(language, bundledLanguages, bundledLanguagesAlias),
      theme: resolveCodeThemeSelection(colors, mode, `custom-inline-${mode}`),
    });
    const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
    if (!codeMatch) throw new Error("Shiki returned no code element");
    return codeMatch[1]!;
  });

  if (highlightCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = highlightCache.keys().next().value;
    if (oldest) highlightCache.delete(oldest);
  }
  highlightCache.set(key, request);
  request.catch(() => highlightCache.delete(key));
  return request;
}
