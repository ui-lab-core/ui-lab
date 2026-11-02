import type { ThemeMode } from "./tokens";
import { isThemePreference, type ThemePreference } from "./preference";

interface ThemeRootState {
  className?: ThemeMode;
  colorScheme?: ThemeMode;
  dataTheme?: ThemeMode;
}

export function parseThemeCookie(value: string | null | undefined): ThemePreference | null {
  return isThemePreference(value) ? value : null;
}

export function resolveThemeRootState(
  preference: ThemePreference | null | undefined,
): ThemeRootState {
  if (preference !== "light" && preference !== "dark") {
    return {};
  }

  return {
    className: preference,
    colorScheme: preference,
    dataTheme: preference,
  };
}
