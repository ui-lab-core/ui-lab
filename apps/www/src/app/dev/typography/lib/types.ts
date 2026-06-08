import type { TypographyConfig } from "@/features/theme/lib/typography-config";

export type PreviewTypographyState = TypographyConfig;
export type BodyTypographyState = Record<string, PreviewTypographyState>;
export type TextAlignment = "left" | "center" | "right" | "justify";

export interface FontTuningState {
  tracking: number;
  leading: number;
  pointSize: number;
  alignment: TextAlignment;
}

export type FontTuningByFont = Record<string, FontTuningState>;

export interface PointSizeMetrics {
  capHeight: number;
  xHeight: number;
  ascender: number;
  descender: number;
  stem: number;
  bowlWidth: number;
  counterProxy: number;
}

export interface ComparisonRow {
  pointSize: number;
  target: PointSizeMetrics;
  reference: PointSizeMetrics;
}

export interface GlyphMeasurement {
  character: string;
  width: number;
  actualLeft: number;
  actualRight: number;
  actualAscent: number;
  actualDescent: number;
  fontAscent: number;
  fontDescent: number;
  capHeightRatio: number;
  xHeightRatio: number;
}

export interface KerningMeasurement {
  pair: string;
  width: number;
  sumWidth: number;
  delta: number;
}

export interface RenderedFontMetrics {
  selected: GlyphMeasurement;
  capHeight: number;
  xHeight: number;
  ascender: number;
  descender: number;
  stem: number;
  bowlWidth: number;
  counterProxy: number;
  kerningPairs: KerningMeasurement[];
  loaded: boolean;
}
