import {
  getDefaultBodyFont,
  getDefaultHeaderFont,
  getDefaultMonoFont,
} from "@/features/theme/constants/font-config";

export const defaultBodyFont = getDefaultBodyFont();
export const defaultHeaderFont = getDefaultHeaderFont();
export const defaultMonoFont = getDefaultMonoFont();

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

export const CONTEXT_PARAGRAPHS = [
  "Interface typography needs to stay readable while labels, values, and nested actions compete for attention.",
  "Dense tools reward fonts with clear counters, sturdy stems, reliable spacing, and numerals that scan cleanly in tables.",
];
