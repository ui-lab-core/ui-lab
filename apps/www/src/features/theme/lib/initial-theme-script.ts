import { COLOR_CSS_VARIABLE_PREFIXES, THEME_CACHE_KEY } from "./theme-cache";

const REQUIRED_CACHE_VARS = ["--background-500"];

/**
 * First-paint script. Static CSS owns every structural token (typography,
 * spacing, radius, borders, fonts); the only user customization the site
 * carries is colors, so the script just stamps the mode and restores the
 * cached color variables.
 */
export function getInitialThemeScript(): string {
  const payload = {
    cacheKey: THEME_CACHE_KEY,
    requiredCacheVars: REQUIRED_CACHE_VARS,
    colorPrefixes: COLOR_CSS_VARIABLE_PREFIXES,
  };

  return `
(function () {
  var payload = ${JSON.stringify(payload)};
  var root = document.documentElement;

  function getPreferredTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  try {
    var raw = localStorage.getItem(payload.cacheKey);
    if (!raw) {
      root.setAttribute("data-theme", getPreferredTheme());
      return;
    }

    var cache = JSON.parse(raw);
    if (!cache || typeof cache !== "object" || (cache.themeMode !== "light" && cache.themeMode !== "dark")) {
      throw new Error("Invalid cache format");
    }
    var vars = cache.cssVariables;
    if (!vars || typeof vars !== "object") throw new Error("Missing cssVariables");
    for (var index = 0; index < payload.requiredCacheVars.length; index += 1) {
      if (typeof vars[payload.requiredCacheVars[index]] !== "string") {
        throw new Error("Missing: " + payload.requiredCacheVars[index]);
      }
    }

    root.setAttribute("data-theme", cache.themeMode);
    Object.keys(vars).forEach(function (name) {
      var isColorVar = payload.colorPrefixes.some(function (prefix) {
        return name.indexOf(prefix) === 0;
      });
      if (isColorVar) root.style.setProperty(name, vars[name]);
    });
  } catch (error) {
    root.setAttribute("data-theme", getPreferredTheme());
    if (error && error.message !== "Invalid cache format") {
      console.warn("[Theme] Cache invalid, using defaults:", error.message);
    }
  }
})();
`.trim();
}
