import { transformerRenderIndentGuides } from "@shikijs/transformers";
import { getDefaultThemeSourceConfig } from "@/features/theme/lib/default-theme-config";
import { resolveCodeThemeSelection } from "@/features/theme/lib/themes/shiki/resolve-code-theme";
import { resolveShikiLanguage } from "@shared/code/language";
import type { SimpleThemeColors } from "@/features/theme/constants/themes";

type ShikiTheme = ReturnType<typeof resolveCodeThemeSelection>;

// Cache the precomputed themes globally/module-level.
let precomputedThemes: Record<"light" | "dark", ShikiTheme> | null = null;

function addCodePadding(html: string): string {
  return html.replace(/<code([^>]*)>/, (match, attrs: string) => {
    if (!attrs.includes("style=")) {
      return `<code${attrs} style="display: block; padding: 1rem;">`;
    }

    return match.replace(/style="([^"]*)"/, (_, style: string) => {
      const normalized = style.trim();
      const suffix = normalized && !normalized.endsWith(";") ? ";" : "";
      return `style="${normalized}${suffix} display: block; padding: 1rem;"`;
    });
  });
}

function removePreBackgroundOnly(html: string): string {
  return html.replace(
    /<pre([^>]*)style="([^"]*)"([^>]*)>/,
    (_, before: string, style: string, after: string) => {
      const cleanedStyle = style
        .split(";")
        .map((declaration) => declaration.trim())
        .filter(Boolean)
        .filter((declaration) => {
          const property = declaration.split(":")[0]?.trim().toLowerCase();
          return property !== "background" && property !== "background-color";
        })
        .join("; ");

      const styleAttr = cleanedStyle
        ? ` style="${cleanedStyle}${cleanedStyle.endsWith(";") ? "" : ";"}"`
        : "";

      return `<pre${before}${styleAttr}${after}>`;
    },
  );
}

function removePreTabIndex(html: string): string {
  return html.replace(/<pre([^>]*)\s+tabindex="[^"]*"([^>]*)>/gi, "<pre$1$2>");
}

function normalizeShikiHtml(html: string): string {
  return removePreTabIndex(removePreBackgroundOnly(addCodePadding(html)));
}

function getPrecomputedThemes() {
  if (precomputedThemes) return precomputedThemes;

  const modes: ("light" | "dark")[] = ["light", "dark"];
  const result = {} as Record<"light" | "dark", ShikiTheme>;

  for (const mode of modes) {
    const colors = getDefaultThemeSourceConfig(mode).colors;
    result[mode] = resolveCodeThemeSelection(colors, mode, `server-${mode}`);
  }

  precomputedThemes = result;
  return precomputedThemes;
}

export async function highlightCode(code: string, lang: string) {
  "use cache";
  const { bundledLanguages, bundledLanguagesAlias, codeToHtml } = await import("shiki");
  const resolvedLanguage = resolveShikiLanguage(lang, bundledLanguages, bundledLanguagesAlias);
  const currentThemes = getPrecomputedThemes();

  try {
    const html = normalizeShikiHtml(
      await codeToHtml(code, {
        lang: resolvedLanguage,
        themes: currentThemes,
        defaultColor: false,
        transformers: [transformerRenderIndentGuides()],
      }),
    );

    return { light: html, dark: html };
  } catch (error) {
    console.error("Failed to highlight code:", error);
    return { light: "", dark: "" };
  }
}

export async function highlightCodeForTheme(
  code: string,
  lang: string,
  colors: SimpleThemeColors,
  mode: "light" | "dark",
) {
  const { bundledLanguages, bundledLanguagesAlias, codeToHtml } = await import("shiki");
  const resolvedLanguage = resolveShikiLanguage(lang, bundledLanguages, bundledLanguagesAlias);
  const theme = resolveCodeThemeSelection(colors, mode, `runtime-${mode}`);
  const html = await codeToHtml(code, {
    lang: resolvedLanguage,
    theme,
    transformers: [transformerRenderIndentGuides()],
  });

  return normalizeShikiHtml(html);
}
