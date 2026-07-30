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
