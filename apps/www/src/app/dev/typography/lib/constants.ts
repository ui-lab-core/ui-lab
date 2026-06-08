import {
  getDefaultBodyFont,
  getDefaultHeaderFont,
  getDefaultMonoFont,
} from "@/features/theme/constants/font-config";
import type { FontTuningState, PointSizeMetrics } from "./types";

export const defaultBodyFont = getDefaultBodyFont();
export const defaultHeaderFont = getDefaultHeaderFont();
export const defaultMonoFont = getDefaultMonoFont();

export const KARLA_BODY_FAMILY = defaultBodyFont.family;
export const KARLA_HEADER_FAMILY = defaultHeaderFont.family;

export const FONT_WEIGHT_DEFS = [
  { name: "thin", value: 100 },
  { name: "extralight", value: 200 },
  { name: "light", value: 300 },
  { name: "normal", value: 400 },
  { name: "medium", value: 500 },
  { name: "semibold", value: 600 },
  { name: "bold", value: 700 },
  { name: "extrabold", value: 800 },
  { name: "black", value: 900 },
] as const;

export const SAMPLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&@!?$%";
export const KERNING_PAIRS = ["AV", "VA", "To", "Wa", "Yo", "Ta", "LT", "FA"] as const;

export const CONTEXT_PARAGRAPHS = [
  "Interface typography needs to stay readable while labels, values, and nested actions compete for attention.",
  "Dense tools reward fonts with clear counters, sturdy stems, reliable spacing, and numerals that scan cleanly in tables.",
];

export const SPACING_CONTROLS = [
  { key: "tracking", label: "Tracking", min: -0.08, max: 0.16, step: 0.005, unit: "em" },
  { key: "leading", label: "Leading", min: 1, max: 2.2, step: 0.01, unit: "" },
  { key: "pointSize", label: "Point size", min: 10, max: 56, step: 1, unit: "px" },
] as const satisfies ReadonlyArray<{
  key: keyof Pick<FontTuningState, "tracking" | "leading" | "pointSize">;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}>;

export const COMPARISON_SIZES = [12, 14, 16, 18, 20, 24] as const;

export const COMPARISON_METRIC_KEYS: Array<keyof PointSizeMetrics> = [
  "capHeight",
  "xHeight",
  "ascender",
  "descender",
  "stem",
  "bowlWidth",
  "counterProxy",
];

export const COMPARISON_METRIC_LABELS: Record<keyof PointSizeMetrics, string> = {
  capHeight: "Cap Height",
  xHeight: "X-height",
  ascender: "Ascender",
  descender: "Descender",
  stem: "Stem",
  bowlWidth: "Bowl Width",
  counterProxy: "Counter",
};
