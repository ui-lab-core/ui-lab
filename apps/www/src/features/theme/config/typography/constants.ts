export const textSizeNames = [
  "xs",
  "sm",
  "md",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
] as const;

export type TextSizeName = (typeof textSizeNames)[number];

export const baseTextSizeIndex = 3;

export const derivedTextSizes = [
  {
    name: "body-size",
    source: "sm",
    multiplier: 1.025,
  },
  {
    name: "code-size",
    source: "xs",
    multiplier: 1.01,
  },
] as const satisfies Array<{
  name: string;
  source: TextSizeName;
  multiplier: number;
}>;

export const minFontSizeConstraints = {
  xs: 0.900,
  sm: 1.0,
  md: 1.0,
  base: 1.0,
  lg: 1.125,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 1.75,
  "4xl": 2.0,
  "5xl": 2.25,
} as const;

export const staticFontSizes = {
  xs: 0.875,
  sm: 0.9375,
  md: 1.0,
  base: 1.0,
} as const;

export const fluidSizes = new Set<TextSizeName>([
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
]);
