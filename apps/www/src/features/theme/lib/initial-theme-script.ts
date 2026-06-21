import { BORDER_SCALE_STEPS, RADIUS_SCALE_STEPS, SPACING_SCALE_STEPS } from "../config/shared/layout-variables";
import {
  baseTextSizeIndex,
  derivedTextSizes,
  minFontSizeConstraints,
  staticFontSizes,
  textSizeNames,
} from "../config/typography/constants";
import { BODY_FONTS, HEADER_FONTS, MONO_FONTS } from "../constants/font-config";
import {
  DEFAULT_FONT_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  getTypographyConfigForFonts,
} from "./default-theme-config";
import { THEME_CACHE_KEY } from "./theme-cache";
import {
  DEFAULT_HEADING_TRACKING_EM,
  DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
  DEFAULT_TYPOGRAPHY_CONFIG,
  ROOT_FONT_SIZE_PX,
} from "./typography-config";

const REQUIRED_CACHE_VARS = ["--background-500", "--text-md"];

const FONT_FAMILY_MAP = Object.fromEntries(
  [...BODY_FONTS, ...HEADER_FONTS, ...MONO_FONTS].map((font) => [font.name, font.family]),
);
const HEADER_FONT_TYPOGRAPHY_MAP = Object.fromEntries(
  HEADER_FONTS.map((font) => [
    font.name,
    getTypographyConfigForFonts({
      ...DEFAULT_FONT_CONFIG,
      headerFont: font.name,
    }),
  ]),
);
const MONO_FONT_TYPOGRAPHY_MAP = Object.fromEntries(
  MONO_FONTS.map((font) => [
    font.name,
    getTypographyConfigForFonts({
      ...DEFAULT_FONT_CONFIG,
      monoFont: font.name,
    }),
  ]),
);

export function getInitialThemeScript(): string {
  const payload = {
    cacheKey: THEME_CACHE_KEY,
    requiredCacheVars: REQUIRED_CACHE_VARS,
    defaultLayout: DEFAULT_LAYOUT_CONFIG,
    defaultFonts: DEFAULT_FONT_CONFIG,
    defaultTypography: getTypographyConfigForFonts(DEFAULT_FONT_CONFIG),
    staticDefaultTypography: DEFAULT_TYPOGRAPHY_CONFIG,
    headerFontTypographyMap: HEADER_FONT_TYPOGRAPHY_MAP,
    monoFontTypographyMap: MONO_FONT_TYPOGRAPHY_MAP,
    spacingSteps: SPACING_SCALE_STEPS,
    radiusSteps: RADIUS_SCALE_STEPS,
    borderSteps: BORDER_SCALE_STEPS,
    fontFamilyMap: FONT_FAMILY_MAP,
    staticFontSizes: staticFontSizes,
    minFontSizeConstraints: minFontSizeConstraints,
    textSizeNames,
    derivedTextSizes,
    baseTextSizeIndex,
    rootFontSizePx: ROOT_FONT_SIZE_PX,
    fontSizeRoundingStepPx: DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
    headingTrackingEm: DEFAULT_HEADING_TRACKING_EM,
  };

  return `
(function () {
  var payload = ${JSON.stringify(payload)};
  var root = document.documentElement;

  function getPreferredTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyVars(vars) {
    if (!vars || typeof vars !== "object") return;
    Object.keys(vars).forEach(function (name) {
      root.style.setProperty(name, vars[name]);
    });
  }

  function getNumber(value) {
    return typeof value === "number" && isFinite(value) ? value : null;
  }

  function getNumberOrFallback(value, fallback) {
    var number = getNumber(value);
    return number === null ? fallback : number;
  }

  function formatRem(value) {
    return String(Number(value.toFixed(6))) + "rem";
  }

  function roundFontSizeRem(value) {
    var stepPx = payload.fontSizeRoundingStepPx;
    if (!(stepPx > 0) || !isFinite(stepPx)) return value;
    return Math.round((value * payload.rootFontSizePx) / stepPx) * stepPx / payload.rootFontSizePx;
  }

  function fontSizeRem(value) {
    return formatRem(roundFontSizeRem(value));
  }

  function computeLayoutVars(layout) {
    var radius = getNumber(layout && layout.radius);
    var borderWidth = getNumber(layout && layout.borderWidth);
    var spacingScale = getNumber(layout && layout.spacingScale);
    var resolved = {
      radius: radius === null ? payload.defaultLayout.radius : radius,
      borderWidth: borderWidth === null ? payload.defaultLayout.borderWidth : borderWidth,
      spacingScale: spacingScale === null ? payload.defaultLayout.spacingScale : spacingScale,
    };
    var vars = { "--spacing-scale": String(resolved.spacingScale) };

    payload.spacingSteps.forEach(function (step) {
      vars["--spacing-" + step.name] = "clamp("
        + (step.min * resolved.spacingScale).toFixed(3)
        + "rem, "
        + (step.fluid * resolved.spacingScale).toFixed(2)
        + "vw, "
        + (step.max * resolved.spacingScale).toFixed(3)
        + "rem)";
    });
    vars["--spacing"] = "clamp("
      + (0.2 * resolved.spacingScale).toFixed(3)
      + "rem, "
      + (2.5 * resolved.spacingScale).toFixed(2)
      + "vw, "
      + (0.25 * resolved.spacingScale).toFixed(3)
      + "rem)";

    var radiusFactor = resolved.radius / 0.2;
    payload.radiusSteps.forEach(function (step) {
      var value = step.value * radiusFactor;
      vars["--radius-" + step.name] = value > 100 ? "9999px" : value.toFixed(3) + "rem";
    });
    vars["--radius-full"] = "9999px";
    vars["--radius-ratio"] = String((resolved.radius / 0.2) * 0.5);

    var borderFactor = resolved.borderWidth / 1;
    payload.borderSteps.forEach(function (step) {
      vars["--border-width-" + step.name] = (step.value * borderFactor).toFixed(1) + "px";
    });

    return vars;
  }

  function getTypographyDefaults(fonts) {
    var header = fonts && (fonts.headerFont || fonts.bodyFont || fonts.sansFont) || payload.defaultFonts.headerFont;
    var mono = fonts && fonts.monoFont || payload.defaultFonts.monoFont;
    return Object.assign(
      {},
      payload.defaultTypography,
      payload.headerFontTypographyMap[header] || {},
      payload.monoFontTypographyMap[mono] || {}
    );
  }

  function computeTypographyVars(typography, fonts) {
    var defaults = getTypographyDefaults(fonts);
    var staticDefaults = payload.staticDefaultTypography;
    var bodyRatio = getNumberOrFallback(typography && typography.bodyTypeSizeRatio, defaults.bodyTypeSizeRatio);
    var bodyScale = getNumberOrFallback(typography && typography.bodyFontSizeScale, defaults.bodyFontSizeScale);
    var headerRatio = getNumberOrFallback(typography && typography.headerTypeSizeRatio, defaults.headerTypeSizeRatio);
    var headerScale = getNumberOrFallback(typography && typography.headerFontSizeScale, defaults.headerFontSizeScale);
    var headerLineHeight = getNumberOrFallback(typography && typography.headerLineHeight, defaults.headerLineHeight);
    var bodyLineHeight = getNumberOrFallback(typography && typography.bodyLineHeight, defaults.bodyLineHeight);
    var monoLineHeight = getNumberOrFallback(typography && typography.monoLineHeight, defaults.monoLineHeight);
    var bodyLetterSpacingScale = getNumberOrFallback(typography && typography.bodyLetterSpacingScale, defaults.bodyLetterSpacingScale);
    var monoFontSizeScale = getNumberOrFallback(typography && typography.monoFontSizeScale, defaults.monoFontSizeScale);
    var monoFontWeightScale = getNumberOrFallback(typography && typography.monoFontWeightScale, defaults.monoFontWeightScale);
    var monoLetterSpacingScale = getNumberOrFallback(typography && typography.monoLetterSpacingScale, defaults.monoLetterSpacingScale);
    var headerLetterSpacingValue = typography && typography.headerLetterSpacingScale;
    if (
      headerLetterSpacingValue === staticDefaults.headerLetterSpacingScale &&
      defaults.headerLetterSpacingScale !== staticDefaults.headerLetterSpacingScale
    ) {
      headerLetterSpacingValue = null;
    }
    var headerLetterSpacingScale = getNumberOrFallback(headerLetterSpacingValue, defaults.headerLetterSpacingScale);
    var legacyMinFontSizePx = getNumber(typography && typography.globalMinFontSizePx);
    var bodyMinFontSizePx = getNumberOrFallback(
      typography && typography.bodyMinFontSizePx,
      legacyMinFontSizePx === null ? defaults.bodyMinFontSizePx : legacyMinFontSizePx
    );
    var headerMinFontSizePx = getNumberOrFallback(
      typography && typography.headerMinFontSizePx,
      legacyMinFontSizePx === null ? defaults.headerMinFontSizePx : legacyMinFontSizePx
    );
    var monoMinFontSizePx = getNumberOrFallback(
      typography && typography.monoMinFontSizePx,
      legacyMinFontSizePx === null ? defaults.monoMinFontSizePx : legacyMinFontSizePx
    );
    var vars = {};
    var bodySizeMap = {};
    var bodyGlobalMin = bodyMinFontSizePx / payload.rootFontSizePx;
    var headerGlobalMin = headerMinFontSizePx / payload.rootFontSizePx;

    payload.textSizeNames.forEach(function (name, index) {
      var bodyConstraint = bodyGlobalMin * (
        payload.minFontSizeConstraints[name] / payload.minFontSizeConstraints.xs
      );
      var headerConstraint = headerGlobalMin * (
        payload.minFontSizeConstraints[name] / payload.minFontSizeConstraints.xs
      );
      var staticSize = payload.staticFontSizes[name];

      if (staticSize !== undefined) {
        var bodyStaticSize = roundFontSizeRem(Math.max(staticSize * bodyScale, bodyConstraint));
        vars["--text-" + name] = formatRem(bodyStaticSize);
        vars["--header-text-" + name] = fontSizeRem(Math.max(staticSize * headerScale, headerConstraint));
        bodySizeMap[name] = {
          isFluid: false,
          minSize: bodyStaticSize,
          fluidVw: 0,
          maxSize: bodyStaticSize,
        };
        return;
      }

      var stepsFromBase = index - payload.baseTextSizeIndex;
      var bodySize = Math.pow(bodyRatio, stepsFromBase) * bodyScale;
      var bodyMin = Math.max(bodySize * 0.85, bodyConstraint * bodyScale);
      var bodyMinSize = roundFontSizeRem(bodyMin);
      var bodyPreferred = roundFontSizeRem(bodySize);
      var bodyMaxSize = roundFontSizeRem(bodySize * 1.15);
      vars["--text-" + name] = "clamp("
        + formatRem(bodyMinSize)
        + ", "
        + (bodyPreferred * 1.8).toFixed(2)
        + "vw, "
        + formatRem(bodyMaxSize)
        + ")";
      bodySizeMap[name] = {
        isFluid: true,
        minSize: bodyMinSize,
        fluidVw: bodyPreferred * 1.8,
        maxSize: bodyMaxSize,
      };

      var headerSize = Math.pow(headerRatio, stepsFromBase) * headerScale;
      var headerMin = Math.max(headerSize * 0.85, headerConstraint * headerScale);
      var headerPreferred = roundFontSizeRem(headerSize);
      vars["--header-text-" + name] = "clamp("
        + fontSizeRem(headerMin)
        + ", "
        + (headerPreferred * 1.8).toFixed(2)
        + "vw, "
        + fontSizeRem(headerSize * 1.15)
        + ")";
    });

    payload.derivedTextSizes.forEach(function (config) {
      var source = bodySizeMap[config.source];
      if (!source) return;

      if (!source.isFluid) {
        vars["--text-" + config.name] = fontSizeRem(source.minSize * config.multiplier);
        return;
      }

      var preferredSize = roundFontSizeRem(source.fluidVw / 1.8 * config.multiplier);
      vars["--text-" + config.name] = "clamp("
        + fontSizeRem(source.minSize * config.multiplier)
        + ", "
        + (preferredSize * 1.8).toFixed(2)
        + "vw, "
        + fontSizeRem(source.maxSize * config.multiplier)
        + ")";
    });

    vars["--leading-header"] = String(headerLineHeight);
    vars["--leading-body"] = String(bodyLineHeight);
    vars["--leading-code"] = String(monoLineHeight);

    var baseLetterSpacingFactor = 0.020;
    payload.textSizeNames.forEach(function (name, index) {
      var letterSpacing = (index - payload.baseTextSizeIndex) * baseLetterSpacingFactor
        + (bodyLetterSpacingScale - 1) * baseLetterSpacingFactor;
      vars["--letter-spacing-" + name] = letterSpacing.toFixed(4) + "em";
    });
    ["sm", "md", "lg", "xl"].forEach(function (name) {
      vars["--letter-spacing-header-" + name] = (payload.headingTrackingEm + (headerLetterSpacingScale - 1) * baseLetterSpacingFactor).toFixed(4) + "em";
    });
    vars["--text-code-size"] = fontSizeRem(Math.max(0.875 * monoFontSizeScale, monoMinFontSizePx / payload.rootFontSizePx));
    vars["--letter-spacing-code"] = ((monoLetterSpacingScale - 1) * 0.010).toFixed(4) + "em";
    vars["--font-weight-code"] = String(Math.max(100, Math.min(900, Math.round(400 * monoFontWeightScale))));

    return vars;
  }

  function applyFonts(fonts) {
    var body = fonts && (fonts.bodyFont || fonts.sansFont) || payload.defaultFonts.bodyFont;
    var header = fonts && (fonts.headerFont || fonts.bodyFont || fonts.sansFont) || payload.defaultFonts.headerFont;
    var mono = fonts && fonts.monoFont || payload.defaultFonts.monoFont;
    var bodyFamily = payload.fontFamilyMap[body] || payload.fontFamilyMap[payload.defaultFonts.bodyFont];
    var headerFamily = payload.fontFamilyMap[header] || payload.fontFamilyMap[payload.defaultFonts.headerFont] || bodyFamily;
    var monoFamily = payload.fontFamilyMap[mono] || payload.fontFamilyMap[payload.defaultFonts.monoFont];
    root.style.setProperty("--font-body", bodyFamily);
    root.style.setProperty("--font-header", headerFamily);
    root.style.setProperty("--font-sans", bodyFamily);
    root.style.setProperty("--font-mono", monoFamily);
  }

  function validateCache(cache) {
    if (!cache || typeof cache !== "object") throw new Error("Invalid cache format");
    if (cache.themeMode !== "light" && cache.themeMode !== "dark") throw new Error("Invalid themeMode");
    if (!cache.cssVariables || typeof cache.cssVariables !== "object") throw new Error("Missing cssVariables");
    for (var index = 0; index < payload.requiredCacheVars.length; index += 1) {
      var key = payload.requiredCacheVars[index];
      if (typeof cache.cssVariables[key] !== "string") throw new Error("Missing: " + key);
    }
    return cache;
  }

  try {
    var raw = localStorage.getItem(payload.cacheKey);
    if (!raw) {
      root.setAttribute("data-theme", getPreferredTheme());
      applyVars(computeLayoutVars(payload.defaultLayout));
      applyVars(computeTypographyVars(payload.defaultTypography, payload.defaultFonts));
      applyFonts(payload.defaultFonts);
      return;
    }

    var cache = validateCache(JSON.parse(raw));
    root.setAttribute("data-theme", cache.themeMode);
    applyVars(cache.cssVariables);
    applyVars(computeLayoutVars(cache.sourceConfig && cache.sourceConfig.layout));
    applyVars(computeTypographyVars(
      cache.sourceConfig && cache.sourceConfig.typography,
      cache.sourceConfig && cache.sourceConfig.fonts
    ));
    applyFonts(cache.sourceConfig && cache.sourceConfig.fonts);
  } catch (error) {
    root.setAttribute("data-theme", getPreferredTheme());
    applyVars(computeLayoutVars(payload.defaultLayout));
    applyVars(computeTypographyVars(payload.defaultTypography, payload.defaultFonts));
    applyFonts(payload.defaultFonts);
    if (error && error.message !== "Invalid cache format") {
      console.warn("[Theme] Cache invalid, using defaults:", error.message);
    }
  }
})();
`.trim();
}
