import type { TypographyConfig } from "@/features/theme/lib/typography-config";

export type PreviewTypographyState = TypographyConfig;
export type BodyTypographyState = Record<string, PreviewTypographyState>;
