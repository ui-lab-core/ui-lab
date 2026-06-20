const NAMES = {
  sans: ["Karla", "Geist Sans", "Inter", "Work Sans"],
  mono: ["Ioskeley Mono", "Geist Mono", "JetBrains Mono"],
} as const;

export type FontKey =
  | (typeof NAMES.sans)[number]
  | (typeof NAMES.mono)[number];
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
  bodyMinFontSizePx?: number;
  headerMinFontSizePx?: number;
}

export interface FontConfig {
  name: FontKey;
  family: string;
  category: FontCategory;
  isDefault: boolean;
  metrics: FontMetrics;
}

type FontDefinition = Omit<FontConfig, "category">;

const SANS: FontDefinition[] = [
  {
    name: "Karla",
    family: '"Karla Variable", system-ui, sans-serif',
    isDefault: true,
    metrics: {
      fontSizeScale: 0.98,
      fontWeightScale: 1,
      typeSizeRatio: 1.245,
      bodyLineHeight: 1.4,
      bodyMinFontSizePx: 14.35,
      bodyLetterSpacingScale: 1.35,
    },
  },
  {
    name: "Geist Sans",
    family: '"Geist Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      fontSizeScale: 0.95,
      fontWeightScale: 0.86,
      typeSizeRatio: 1.175,
      baseline: 0,
      capHeight: 0.722,
      xHeight: 0.556,
      ascender: 0.944,
      descender: 0.222,
      stem: 0.269,
      bowlCounter: 0.784,
      tracking: 0,
      leading: 1.5,
      pointSize: 18,
      alignment: "left",
      headerLetterSpacingScale: -1.4,
      bodyLetterSpacingScale: 2.65,
      bodyLineHeight: 1.53,
    },
  },
  {
    name: "Inter",
    family: '"Inter Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      fontSizeScale: 0.95,
      fontWeightScale: 0.86,
      typeSizeRatio: 1.175,
      baseline: 0,
      capHeight: 0.722,
      xHeight: 0.556,
      ascender: 0.944,
      descender: 0.222,
      stem: 0.269,
      bowlCounter: 0.784,
      tracking: 0,
      leading: 1.5,
      pointSize: 18,
      alignment: "left",
      bodyLetterSpacingScale: 2.65,
      bodyLineHeight: 1.60,
      bodyMinFontSizePx: 13.25,
    },
  },
  {
    name: "Work Sans",
    family: '"Work Sans Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      fontSizeScale: 0.95,
      fontWeightScale: 0.86,
      typeSizeRatio: 1.175,
      baseline: 0,
      capHeight: 0.722,
      xHeight: 0.556,
      ascender: 0.944,
      descender: 0.222,
      stem: 0.269,
      bowlCounter: 0.784,
      tracking: 0,
      leading: 1.5,
      pointSize: 18,
      alignment: "left",
      bodyLetterSpacingScale: 2.65,
      bodyLineHeight: 1.53,
    },
  },
];

const MONO: FontDefinition[] = [
  {
    name: "Ioskeley Mono",
    family: "var(--font-ioskeley-mono), monospace",
    isDefault: true,
    metrics: {
      fontSizeScale: 1,
      fontWeightScale: 1,
      typeSizeRatio: 1.2,
    },
  },
  {
    name: "Geist Mono",
    family: '"Geist Mono", monospace',
    isDefault: false,
    metrics: {
      fontSizeScale: 1,
      fontWeightScale: 1,
      typeSizeRatio: 1.2,
    },
  },
  {
    name: "JetBrains Mono",
    family: '"JetBrains Mono", monospace',
    isDefault: false,
    metrics: {
      fontSizeScale: 0.95,
      fontWeightScale: 1.05,
      typeSizeRatio: 1.15,
    },
  },
];

const DEFINITIONS = {
  sans: SANS,
  mono: MONO,
} satisfies Record<"sans" | "mono", FontDefinition[]>;

function createFonts(
  category: FontCategory,
  definitions: FontDefinition[],
): FontConfig[] {
  return definitions.map((font) => ({
    ...font,
    category,
    metrics: { ...font.metrics },
  }));
}

const FONTS = {
  body: createFonts("body", DEFINITIONS.sans),
  header: createFonts("header", DEFINITIONS.sans),
  mono: createFonts("mono", DEFINITIONS.mono),
} satisfies Record<FontCategory, FontConfig[]>;

export const BODY_FONTS = FONTS.body;
export const HEADER_FONTS = FONTS.header;
export const SANS_FONTS = BODY_FONTS;
export const MONO_FONTS = FONTS.mono;

function normalizeCategory(category: FontCategoryInput): FontCategory {
  return category === "sans" ? "body" : category;
}

export function getFontsByCategory(category: FontCategoryInput): FontConfig[] {
  return FONTS[normalizeCategory(category)];
}

export function getFontConfig(
  name: FontKey,
  category: FontCategoryInput,
): FontConfig | undefined {
  const fonts = getFontsByCategory(category);
  return fonts.find((font) => font.name === name);
}

function getDefaultFont(category: FontCategoryInput): FontConfig {
  const fonts = getFontsByCategory(category);
  return fonts.find((font) => font.isDefault) ?? fonts[0];
}

export function getDefaultBodyFont(): FontConfig {
  return getDefaultFont("body");
}

export function getDefaultHeaderFont(): FontConfig {
  return getDefaultFont("header");
}

export function getDefaultSansFont(): FontConfig {
  return getDefaultBodyFont();
}

export function getDefaultMonoFont(): FontConfig {
  return getDefaultFont("mono");
}
