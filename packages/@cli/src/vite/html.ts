import type { ColorMode } from "../themes/onyx.js";

const THEME_STORAGE_KEY = "ui-lab-theme-complete";
const SCRIPT_ID = "ui-lab-theme";

/**
 * First-paint theme script for client-only (Vite) apps.
 *
 * Next.js stamps html[data-theme] on the server from a cookie. A Vite SPA has
 * no server render, so the equivalent recovery runs as an inline <head> script
 * before React mounts: it reads the stored mode (or the configured default, or
 * the system preference), resolves it to light/dark, and stamps the root so the
 * Onyx tokens resolve on the very first paint instead of flashing.
 */
export function viteThemeScript(colorMode: ColorMode): string {
  return `(function () {
      var root = document.documentElement;
      var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      var defaultMode = ${JSON.stringify(colorMode)};

      function isThemeMode(value) {
        return value === "light" || value === "dark";
      }

      function getSystemMode() {
        try {
          return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        } catch (_error) {
          return "light";
        }
      }

      function readStoredMode() {
        try {
          var raw = localStorage.getItem(storageKey);
          if (!raw) return null;
          var parsed = JSON.parse(raw);
          if (isThemeMode(parsed)) return parsed;
          return parsed && isThemeMode(parsed.themeMode) ? parsed.themeMode : null;
        } catch (_error) {
          return null;
        }
      }

      var mode = readStoredMode();
      if (!isThemeMode(mode)) {
        mode = isThemeMode(defaultMode) ? defaultMode : getSystemMode();
      }

      root.dataset.theme = mode;
      root.style.colorScheme = mode;
    })();`;
}

export function manualHtmlSnippet(colorMode: ColorMode): string {
  return `Add this script as the first child of <head> in index.html:\n<script id="${SCRIPT_ID}">${viteThemeScript(colorMode)}</script>`;
}

function fallback(message: string, colorMode: ColorMode): Error {
  return new Error(`${message} Apply this manually:\n${manualHtmlSnippet(colorMode)}`);
}

/**
 * Insert (or refresh) the UI Lab theme script as the first child of <head>.
 * Idempotent: a re-run replaces the managed script rather than duplicating it.
 */
export function integrateViteHtml(source: string, colorMode: ColorMode): string {
  const script = `<script id="${SCRIPT_ID}">${viteThemeScript(colorMode)}</script>`;
  const existing = new RegExp(`\\s*<script id="${SCRIPT_ID}">[\\s\\S]*?</script>`);
  if (existing.test(source)) {
    const cleaned = source.replace(existing, "");
    return injectIntoHead(cleaned, script, colorMode);
  }
  return injectIntoHead(source, script, colorMode);
}

function injectIntoHead(source: string, script: string, colorMode: ColorMode): string {
  const match = source.match(/<head[^>]*>/i);
  if (!match || match.index === undefined)
    throw fallback("Cannot find a <head> element in index.html.", colorMode);
  const insertAt = match.index + match[0].length;
  const indent = "\n    ";
  return `${source.slice(0, insertAt)}${indent}${script}${source.slice(insertAt)}`;
}
