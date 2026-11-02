"use client";

import { useThemeVariables, type ThemeContextType } from "./theme-provider";

export function useTheme(): ThemeContextType {
  return useThemeVariables();
}

export function useThemeMode() {
  const { themeMode, setThemeMode, toggleThemeMode } = useThemeVariables();
  return { themeMode, setThemeMode, toggleThemeMode };
}
