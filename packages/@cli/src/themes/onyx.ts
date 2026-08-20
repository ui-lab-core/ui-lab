import {
  onyxImports as legacyImports,
  onyxTheme as legacyTheme,
  type ColorMode,
} from "../theme.js";

export type { ColorMode };
export const onyxTheme = legacyTheme;
export const onyxImports = legacyImports;
export const ONYX_ID = onyxTheme.id;
export const ONYX_VERSION = onyxTheme.version;
export const ONYX_COOKIE_NAME = onyxTheme.cookieName;
export const ONYX_PACKAGES = onyxTheme.packages;
export const ONYX_THEME_CSS = onyxTheme.themeCss;
export const ONYX_TYPOGRAPHY_CSS = onyxTheme.typographyCss;
export const ONYX_GLOBAL_CSS = onyxTheme.globalCssBody;
export const ONYX_DEFAULT_THEME_FILE = "theme.css";
export const ONYX_DEFAULT_TYPOGRAPHY_FILE = "typography.css";

export function imports(
  typography: boolean,
  themeImport = "./theme.css",
): string[] {
  return onyxImports(typography, themeImport);
}
