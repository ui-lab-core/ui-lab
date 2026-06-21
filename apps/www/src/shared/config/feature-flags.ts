/**
 * Build/measurement feature flags.
 *
 * Default = the full showcase experience (every flag ON). Disable a feature
 * for a Lighthouse measurement run by setting its env var to "off" (or
 * "false"/"0") — this gates the feature without removing any code, so the
 * functionality can be restored by flipping the flag back.
 *
 *   NEXT_PUBLIC_FF_HEAVY_FONTS=off pnpm build   # drop the heavy local/web fonts
 *
 * NEXT_PUBLIC_* vars are inlined at build time, so each flag produces a clean,
 * isolated bundle to measure against the baseline.
 */
const isOff = (value: string | undefined): boolean =>
  value === "off" || value === "false" || value === "0";

export const featureFlags = {
  /** Heavy local IoskeleyMono (mono) + extra @fontsource families. */
  heavyFonts: !isOff(process.env.NEXT_PUBLIC_FF_HEAVY_FONTS),
  /** Lazy chat window + provider. */
  chat: !isOff(process.env.NEXT_PUBLIC_FF_CHAT),
  /** Command palette (lazy). */
  commandPalette: !isOff(process.env.NEXT_PUBLIC_FF_COMMAND_PALETTE),
  /** Landing-page interactive showcase. */
  showcase: !isOff(process.env.NEXT_PUBLIC_FF_SHOWCASE),
} as const;

export type FeatureFlags = typeof featureFlags;
