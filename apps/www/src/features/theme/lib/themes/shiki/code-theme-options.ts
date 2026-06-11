import type { BundledTheme } from "shiki";

export type CodeThemeOptionId =
  | "adaptive"
  | "github"
  | "one-dark"
  | "vitesse"
  | "vscode"
  | "catppuccin"
  | "gruvbox"
  | "rose-pine"
  | "solarized"
  | "material";

export interface CodeThemeOption {
  id: CodeThemeOptionId;
  label: string;
  themes: {
    light: BundledTheme;
    dark: BundledTheme;
  } | null;
}

export const DEFAULT_CODE_THEME: CodeThemeOptionId = "adaptive";

export const CODE_THEME_OPTIONS: CodeThemeOption[] = [
  {
    id: "adaptive",
    label: "Adaptive",
    themes: null,
  },
  {
    id: "github",
    label: "GitHub",
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
  },
  {
    id: "one-dark",
    label: "One Dark",
    themes: {
      light: "one-light",
      dark: "one-dark-pro",
    },
  },
  {
    id: "vitesse",
    label: "Vitesse",
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
  },
  {
    id: "vscode",
    label: "VS Code",
    themes: {
      light: "light-plus",
      dark: "dark-plus",
    },
  },
  {
    id: "catppuccin",
    label: "Catppuccin",
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
  },
  {
    id: "gruvbox",
    label: "Gruvbox",
    themes: {
      light: "gruvbox-light-medium",
      dark: "gruvbox-dark-medium",
    },
  },
  {
    id: "rose-pine",
    label: "Rose Pine",
    themes: {
      light: "rose-pine-dawn",
      dark: "rose-pine-moon",
    },
  },
  {
    id: "solarized",
    label: "Solarized",
    themes: {
      light: "solarized-light",
      dark: "solarized-dark",
    },
  },
  {
    id: "material",
    label: "Material",
    themes: {
      light: "material-theme-lighter",
      dark: "material-theme-ocean",
    },
  },
];

const CODE_THEME_OPTION_MAP = new Map(
  CODE_THEME_OPTIONS.map((option) => [option.id, option]),
);

export function normalizeCodeThemeId(
  value: string | null | undefined,
): CodeThemeOptionId {
  if (!value) return DEFAULT_CODE_THEME;

  return CODE_THEME_OPTION_MAP.has(value as CodeThemeOptionId)
    ? (value as CodeThemeOptionId)
    : DEFAULT_CODE_THEME;
}

export function getCodeThemeOption(
  value: string | null | undefined,
): CodeThemeOption {
  return (
    CODE_THEME_OPTION_MAP.get(normalizeCodeThemeId(value)) ??
    CODE_THEME_OPTION_MAP.get(DEFAULT_CODE_THEME)!
  );
}

export function getBundledCodeTheme(
  value: string | null | undefined,
  mode: "light" | "dark",
): BundledTheme | null {
  return getCodeThemeOption(value).themes?.[mode] ?? null;
}
