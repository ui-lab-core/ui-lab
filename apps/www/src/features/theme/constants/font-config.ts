const NAMES = {
  sans: ["Karla", "Geist Sans", "Inter", "Nunito Sans", "Work Sans", "Readex Pro"],
  mono: ["Ioskeley Mono", "Geist Mono", "JetBrains Mono"],
} as const;

export type FontKey =
  | (typeof NAMES.sans)[number]
  | (typeof NAMES.mono)[number];
export type FontCategory = "body" | "header" | "mono";
export type FontCategoryInput = FontCategory | "sans";

export interface BodyFontMetrics {
  fontWeightScale: number;
  typeSizeRatio: number;
  fontSizeScale: number;
  lineHeight: number;
  minFontSizePx: number;
  letterSpacingScale: number;
}

export interface HeaderFontMetrics {
  fontWeightScale: number;
  typeSizeRatio: number;
  fontSizeScale: number;
  lineHeight: number;
  minFontSizePx: number;
  letterSpacingScale: number;
}

export interface MonoFontMetrics {
  fontWeightScale: number;
  typeSizeRatio: number;
  fontSizeScale: number;
  lineHeight: number;
  minFontSizePx: number;
  letterSpacingScale: number;
}

export interface FontMetrics {
  body: BodyFontMetrics;
  header: HeaderFontMetrics;
  mono: MonoFontMetrics;
}

export interface FontConfig {
  name: FontKey;
  family: string;
  category: FontCategory;
  isDefault: boolean;
  metrics: FontMetrics;
}

type FontDefinition = Omit<FontConfig, "category">;
export interface FontTable {
  family: "body" | "header" | "mono";
  fonts: FontConfig[];
}

const SANS: FontDefinition[] = [
  {
    name: "Karla",
    family: '"Karla Variable", system-ui, sans-serif',
    isDefault: true,
    metrics: {
      body: {
        fontWeightScale: 1.05,
        typeSizeRatio: 1.100,
        fontSizeScale: 1.05,
        lineHeight: 1.430,
        minFontSizePx: 14.35,
        letterSpacingScale: 1.460,
      },
      header: {
        fontWeightScale: 1,
        typeSizeRatio: 1.245,
        fontSizeScale: 0.92,
        lineHeight: 1.4,
        minFontSizePx: 13.0,
        letterSpacingScale: 1.50,
      },
      mono: {
        fontWeightScale: 1,
        typeSizeRatio: 1.245,
        fontSizeScale: 0.92,
        lineHeight: 1.4,
        minFontSizePx: 13.0,
        letterSpacingScale: 1.50,
      },
    },
  },
  {
    name: "Inter",
    family: '"Inter Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      body: {
        fontWeightScale: 1.04,
        typeSizeRatio: 1.200,
        fontSizeScale: 0.95,
        lineHeight: 1.580,
        minFontSizePx: 13.30,
        letterSpacingScale: 3.2,
      },
      header: {
        fontWeightScale: 0.86,
        typeSizeRatio: 1.175,
        fontSizeScale: 0.95,
        lineHeight: 1.580,
        minFontSizePx: 10.12,
        letterSpacingScale: 3,
      },
      mono: {
        fontWeightScale: 0.86,
        typeSizeRatio: 1.175,
        fontSizeScale: 0.95,
        lineHeight: 1.550,
        minFontSizePx: 10.12,
        letterSpacingScale: 3,
      },
    },
  },
  {
    name: "Nunito Sans",
    family: '"Nunito Sans Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      body: {
        fontWeightScale: 1.2,
        typeSizeRatio: 1.185,
        fontSizeScale: 0.985,
        lineHeight: 1.500,
        minFontSizePx: 13.75,
        letterSpacingScale: 3.25,
      },
      header: {
        fontWeightScale: 0.92,
        typeSizeRatio: 1.185,
        fontSizeScale: 0.945,
        lineHeight: 1.46,
        minFontSizePx: 12.2,
        letterSpacingScale: 1.8,
      },
      mono: {
        fontWeightScale: 0.92,
        typeSizeRatio: 1.185,
        fontSizeScale: 0.945,
        lineHeight: 1.46,
        minFontSizePx: 12.2,
        letterSpacingScale: 1.8,
      },
    },
  },
  {
    name: "Geist Sans",
    family: '"Geist Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      body: {
        fontWeightScale: 1.05,
        typeSizeRatio: 1.200,
        fontSizeScale: 0.97,
        lineHeight: 1.550,
        minFontSizePx: 13.5,
        letterSpacingScale: 3.25,
      },
      header: {
        fontWeightScale: 0.86,
        typeSizeRatio: 1.175,
        fontSizeScale: 0.831,
        lineHeight: 1.5,
        minFontSizePx: 10.76,
        letterSpacingScale: 3,
      },
      mono: {
        fontWeightScale: 0.86,
        typeSizeRatio: 1.175,
        fontSizeScale: 0.831,
        lineHeight: 1.5,
        minFontSizePx: 10.76,
        letterSpacingScale: 3,
      },
    },
  },
  {
    name: "Work Sans",
    family: '"Work Sans Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      body: {
        fontWeightScale: 1.02,
        typeSizeRatio: 1.200,
        fontSizeScale: 0.98,
        lineHeight: 1.580,
        minFontSizePx: 12.65,
        letterSpacingScale: 2.35,
      },
      header: {
        fontWeightScale: 0.86,
        typeSizeRatio: 1.235,
        fontSizeScale: 1.039,
        lineHeight: 1.74,
        minFontSizePx: 12.36,
        letterSpacingScale: 2.19,
      },
      mono: {
        fontWeightScale: 0.86,
        typeSizeRatio: 1.235,
        fontSizeScale: 1.039,
        lineHeight: 1.74,
        minFontSizePx: 12.36,
        letterSpacingScale: 2.19,
      },
    },
  },
  {
    name: "Readex Pro",
    family: '"Readex Pro Variable", system-ui, sans-serif',
    isDefault: false,
    metrics: {
      body: {
        fontWeightScale: 0.80,
        typeSizeRatio: 1.200,
        fontSizeScale: 0.97,
        lineHeight: 1.550,
        minFontSizePx: 13.55,
        letterSpacingScale: 2.5,
      },
      header: {
        fontWeightScale: 0.9,
        typeSizeRatio: 1.200,
        fontSizeScale: 0.95,
        lineHeight: 1.5,
        minFontSizePx: 12.0,
        letterSpacingScale: 2.0,
      },
      mono: {
        fontWeightScale: 0.9,
        typeSizeRatio: 1.200,
        fontSizeScale: 0.95,
        lineHeight: 1.5,
        minFontSizePx: 12.0,
        letterSpacingScale: 2.0,
      },
    },
  },
];

const MONO: FontDefinition[] = [
  {
    name: "Ioskeley Mono",
    family: "var(--font-ioskeley-mono), monospace",
    isDefault: true,
    metrics: {
      body: {
        fontWeightScale: 1,
        typeSizeRatio: 1.2,
        fontSizeScale: 0.98,
        lineHeight: 1.55,
        minFontSizePx: 13.0,
        letterSpacingScale: 0.8,
      },
      header: {
        fontWeightScale: 1,
        typeSizeRatio: 1.2,
        fontSizeScale: 0.98,
        lineHeight: 1.55,
        minFontSizePx: 13.0,
        letterSpacingScale: 0.8,
      },
      mono: {
        fontWeightScale: 1,
        typeSizeRatio: 1.2,
        fontSizeScale: 0.98,
        lineHeight: 1.55,
        minFontSizePx: 13.0,
        letterSpacingScale: 0.8,
      },
    },
  },
  {
    name: "Geist Mono",
    family: '"Geist Mono", monospace',
    isDefault: false,
    metrics: {
      body: {
        fontWeightScale: 1,
        typeSizeRatio: 1.2,
        fontSizeScale: 0.96,
        lineHeight: 1.52,
        minFontSizePx: 13.25,
        letterSpacingScale: 0.7,
      },
      header: {
        fontWeightScale: 1,
        typeSizeRatio: 1.2,
        fontSizeScale: 0.96,
        lineHeight: 1.52,
        minFontSizePx: 13.25,
        letterSpacingScale: 0.7,
      },
      mono: {
        fontWeightScale: 1,
        typeSizeRatio: 1.2,
        fontSizeScale: 0.96,
        lineHeight: 1.52,
        minFontSizePx: 13.25,
        letterSpacingScale: 0.7,
      },
    },
  },
  {
    name: "JetBrains Mono",
    family: '"JetBrains Mono", monospace',
    isDefault: false,
    metrics: {
      body: {
        fontWeightScale: 1.05,
        typeSizeRatio: 1.15,
        fontSizeScale: 0.94,
        lineHeight: 1.58,
        minFontSizePx: 13.5,
        letterSpacingScale: 0.45,
      },
      header: {
        fontWeightScale: 1.05,
        typeSizeRatio: 1.15,
        fontSizeScale: 0.94,
        lineHeight: 1.58,
        minFontSizePx: 13.5,
        letterSpacingScale: 0.45,
      },
      mono: {
        fontWeightScale: 1.05,
        typeSizeRatio: 1.15,
        fontSizeScale: 0.94,
        lineHeight: 1.58,
        minFontSizePx: 13.5,
        letterSpacingScale: 0.45,
      },
    },
  },
];

const DEFINITIONS = {
  body: SANS,
  header: SANS,
  mono: MONO,
} satisfies Record<FontCategory, FontDefinition[]>;

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

export const FONT_TABLES = {
  body: {
    family: "body",
    fonts: createFonts("body", DEFINITIONS.body),
  },
  header: {
    family: "header",
    fonts: createFonts("header", DEFINITIONS.header),
  },
  mono: {
    family: "mono",
    fonts: createFonts("mono", DEFINITIONS.mono),
  },
} satisfies Record<FontCategory, FontTable>;

function getMetricsForCategory(
  metrics: FontMetrics,
  category: FontCategory,
): BodyFontMetrics | HeaderFontMetrics | MonoFontMetrics {
  return metrics[category];
}

export function getFontMetrics(
  font: FontConfig,
  category: FontCategoryInput,
): BodyFontMetrics | HeaderFontMetrics | MonoFontMetrics {
  return getMetricsForCategory(font.metrics, normalizeCategory(category));
}

export const BODY_FONTS = FONT_TABLES.body.fonts;
export const HEADER_FONTS = FONT_TABLES.header.fonts;
export const SANS_FONTS = BODY_FONTS;
export const MONO_FONTS = FONT_TABLES.mono.fonts;

function normalizeCategory(category: FontCategoryInput): FontCategory {
  return category === "sans" ? "body" : category;
}

export function getFontsByCategory(category: FontCategoryInput): FontConfig[] {
  return FONT_TABLES[normalizeCategory(category)].fonts;
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
