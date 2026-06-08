export type FontKey = "Karla" | "Geist Sans" | "Inter" | "Work Sans" | "Ioskeley Mono" | "JetBrains Mono";
export type FontCategory = "body" | "header" | "mono";
export type FontCategoryInput = FontCategory | "sans";

export interface FontMetrics {
  fontSizeScale: number;
  fontWeightScale: number;
  typeSizeRatio: number;
  baseline?: number;
  capHeight?: number;
  xHeight?: number;
  ascender?: number;
  descender?: number;
  stem?: number;
  bowlCounter?: number;
  tracking?: number;
  leading?: number;
  pointSize?: number;
  alignment?: "left" | "center" | "right" | "justify";
  headerLetterSpacingScale?: number;
  headerLineHeight?: number;
  bodyLetterSpacingScale?: number;
  bodyTypeSizeRatio?: number;
  headerFontWeightScale?: number;
  bodyFontWeightScale?: number;
  bodyFontSizeScale?: number;
  bodyLineHeight?: number;
}

export interface FontConfig {
  name: FontKey;
  family: string;
  category: FontCategory;
  isDefault: boolean;
  metrics: FontMetrics;
}

export const BODY_FONTS: FontConfig[] = [
  {
    name: "Karla",
    family: '"Karla Variable", system-ui, sans-serif',
    category: "body",
    isDefault: true,
    metrics: {
      fontSizeScale: 1,
      fontWeightScale: 1,
      typeSizeRatio: 1.2,
    },
  },
  {
    name: "Geist Sans",
    family: '"Geist Variable", system-ui, sans-serif',
    category: "body",
    isDefault: false,
    metrics: {
      "fontSizeScale": 0.95,
      "fontWeightScale": 0.86,
      "typeSizeRatio": 1.175,
      "baseline": 0,
      "capHeight": 0.722,
      "xHeight": 0.556,
      "ascender": 0.944,
      "descender": 0.222,
      "stem": 0.269,
      "bowlCounter": 0.784,
      "tracking": 0,
      "leading": 1.5,
      "pointSize": 18,
      "alignment": "left",
      "bodyLetterSpacingScale": 2.65,
      "bodyLineHeight": 1.530
    },
  },
  {
    name: "Inter",
    family: '"Inter Variable", system-ui, sans-serif',
    category: "body",
    isDefault: false,
    metrics: {
      "fontSizeScale": 0.95,
      "fontWeightScale": 0.86,
      "typeSizeRatio": 1.175,
      "baseline": 0,
      "capHeight": 0.722,
      "xHeight": 0.556,
      "ascender": 0.944,
      "descender": 0.222,
      "stem": 0.269,
      "bowlCounter": 0.784,
      "tracking": 0,
      "leading": 1.5,
      "pointSize": 18,
      "alignment": "left",
      "bodyLetterSpacingScale": 2.65,
      "bodyLineHeight": 1.530
    },
  },
  {
    name: "Work Sans",
    family: '"Work Sans Variable", system-ui, sans-serif',
    category: "body",
    isDefault: false,
    metrics: {
      fontSizeScale: 1.05,
      fontWeightScale: 0.95,
      typeSizeRatio: 1.20,
    },
  },
];

export const HEADER_FONTS: FontConfig[] = BODY_FONTS.map((font) => ({
  ...font,
  category: "header" as const,
}));

export const SANS_FONTS = BODY_FONTS;

export const MONO_FONTS: FontConfig[] = [
  {
    name: "Ioskeley Mono",
    family: "var(--font-ioskeley-mono), monospace",
    category: "mono",
    isDefault: true,
    metrics: {
      fontSizeScale: 1,
      fontWeightScale: 1,
      typeSizeRatio: 1.2,
    },
  },
  {
    name: "JetBrains Mono",
    family: '"JetBrains Mono", monospace',
    category: "mono",
    isDefault: false,
    metrics: {
      fontSizeScale: 0.95,
      fontWeightScale: 1.05,
      typeSizeRatio: 1.15,
    },
  },
];

export function getFontConfig(name: FontKey, category: FontCategoryInput): FontConfig | undefined {
  const fonts =
    category === "mono"
      ? MONO_FONTS
      : category === "header"
        ? HEADER_FONTS
        : BODY_FONTS;
  return fonts.find((font) => font.name === name);
}

export function getDefaultBodyFont(): FontConfig {
  return BODY_FONTS.find((f) => f.isDefault) || BODY_FONTS[0];
}

export function getDefaultHeaderFont(): FontConfig {
  return HEADER_FONTS.find((f) => f.isDefault) || HEADER_FONTS[0];
}

export function getDefaultSansFont(): FontConfig {
  return getDefaultBodyFont();
}

export function getDefaultMonoFont(): FontConfig {
  return MONO_FONTS.find((f) => f.isDefault) || MONO_FONTS[0];
}
