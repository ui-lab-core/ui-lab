"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  BODY_FONTS,
  getFontConfig,
  type FontKey,
} from "@/features/theme/constants/font-config";
import {
  DEFAULT_BODY_LINE_HEIGHT,
  DEFAULT_HEADER_LINE_HEIGHT,
} from "@/features/theme/lib/typography-config";
import {
  defaultBodyFont,
  defaultHeaderFont,
  defaultMonoFont,
  KARLA_BODY_FAMILY,
  KARLA_HEADER_FAMILY,
  SAMPLE_GLYPHS,
} from "./lib/constants";
import { measureRenderedFontMetrics } from "./lib/metrics";
import { buildPreviewVars, buildTuningStyle, getFontPreviewState } from "./lib/preview";
import type {
  BodyTypographyState,
  FontTuningByFont,
  FontTuningState,
  PreviewTypographyState,
  RenderedFontMetrics,
} from "./lib/types";

function getFontTuningState(fontConfig = defaultBodyFont): FontTuningState {
  const metrics = fontConfig.metrics;

  return {
    tracking: metrics?.tracking ?? 0,
    leading: metrics?.leading ?? metrics?.bodyLineHeight ?? 1.5,
    pointSize: metrics?.pointSize ?? 18,
    alignment: metrics?.alignment ?? "left",
  };
}

function buildInitialBodyTypographyState(): BodyTypographyState {
  return Object.fromEntries(
    BODY_FONTS.map((font) => [font.name, getFontPreviewState(font)]),
  );
}

function buildInitialFontTuningState(): FontTuningByFont {
  return Object.fromEntries(
    BODY_FONTS.map((font) => [font.name, getFontTuningState(font)]),
  );
}

function buildMetricSnippets({
  activeFontTuning,
  activeTypography,
  bodyFamily,
  bodyFontConfig,
  headerFontConfig,
  renderedMetrics,
  selectedBodyFont,
  selectedHeaderFont,
}: Pick<
  TypographyPlaygroundContextValue,
  | "activeFontTuning"
  | "activeTypography"
  | "bodyFamily"
  | "bodyFontConfig"
  | "headerFontConfig"
  | "renderedMetrics"
  | "selectedBodyFont"
  | "selectedHeaderFont"
>) {
  const bodyFontMetrics: Record<string, number | string> = {
    fontSizeScale: activeTypography.bodyFontSizeScale,
    fontWeightScale: activeTypography.bodyFontWeightScale,
    typeSizeRatio: activeTypography.bodyTypeSizeRatio,
    baseline: 0,
    capHeight: renderedMetrics?.capHeight ?? 0,
    xHeight: renderedMetrics?.xHeight ?? 0,
    ascender: renderedMetrics?.ascender ?? 0,
    descender: renderedMetrics?.descender ?? 0,
    stem: renderedMetrics?.stem ?? 0,
    bowlCounter: renderedMetrics?.counterProxy ?? 0,
    tracking: activeFontTuning.tracking,
    leading: activeFontTuning.leading,
    pointSize: activeFontTuning.pointSize,
    alignment: activeFontTuning.alignment,
  };
  const headerFontMetrics: Record<string, number> = {
    fontSizeScale: activeTypography.headerFontSizeScale,
    fontWeightScale: activeTypography.headerFontWeightScale,
    typeSizeRatio: activeTypography.headerTypeSizeRatio,
  };

  if (activeTypography.bodyLetterSpacingScale !== 1) {
    bodyFontMetrics.bodyLetterSpacingScale = activeTypography.bodyLetterSpacingScale;
  }
  if (activeTypography.bodyLineHeight !== DEFAULT_BODY_LINE_HEIGHT) {
    bodyFontMetrics.bodyLineHeight = activeTypography.bodyLineHeight;
  }
  if (activeTypography.headerLetterSpacingScale !== 0) {
    headerFontMetrics.headerLetterSpacingScale = activeTypography.headerLetterSpacingScale;
  }
  if (activeTypography.headerLineHeight !== DEFAULT_HEADER_LINE_HEIGHT) {
    headerFontMetrics.headerLineHeight = activeTypography.headerLineHeight;
  }

  return {
    bodyConfigSnippet: `{
  name: "${selectedBodyFont}",
  family: '${bodyFontConfig?.family ?? bodyFamily}',
  category: "body",
  isDefault: false,
  metrics: ${JSON.stringify(bodyFontMetrics, null, 4).replace(/\n/g, "\n  ")},
}`,
    headerConfigSnippet: `{
  name: "${selectedHeaderFont}",
  family: '${headerFontConfig?.family ?? "..."}',
  category: "header",
  isDefault: false,
  metrics: ${JSON.stringify(headerFontMetrics, null, 4).replace(/\n/g, "\n  ")},
}`,
  };
}

interface TypographyPlaygroundContextValue {
  activeBodyPreviewStyle: CSSProperties;
  activeFontTuning: FontTuningState;
  activeTypography: PreviewTypographyState;
  bodyConfigSnippet: string;
  bodyFamily: string;
  bodyFontConfig: ReturnType<typeof getFontConfig>;
  headerConfigSnippet: string;
  headerFamily: string;
  headerFontConfig: ReturnType<typeof getFontConfig>;
  headerTuningStyle: CSSProperties;
  isKarlaSelected: boolean;
  monoFontConfig: ReturnType<typeof getFontConfig>;
  renderedMetrics: RenderedFontMetrics | null;
  resetAll: () => void;
  selectedBodyFont: string;
  selectedCharacter: string;
  selectedHeaderFont: string;
  selectedMonoFont: string;
  setSelectedCharacter: (character: string) => void;
  setSelectedMonoFont: (fontName: FontKey) => void;
  setUseBaseline: (useBaseline: boolean) => void;
  tuningStyle: CSSProperties;
  updateSelectedBodyTypography: (updates: Partial<PreviewTypographyState>) => void;
  updateSelectedFontTuning: (updates: Partial<FontTuningState>) => void;
  useBaseline: boolean;
  applyBodyFontPreset: (fontName: string) => void;
  applyHeaderFontPreset: (fontName: string) => void;
}

const TypographyPlaygroundContext = createContext<TypographyPlaygroundContextValue | null>(null);

export function TypographyPlaygroundProvider({ children }: { children: ReactNode }) {
  const [selectedBodyFont, setSelectedBodyFont] = useState<string>(defaultBodyFont.name);
  const [selectedHeaderFont, setSelectedHeaderFont] = useState<string>(defaultHeaderFont.name);
  const [selectedMonoFont, setSelectedMonoFont] = useState<string>(defaultMonoFont.name);
  const [bodyTypographyByFont, setBodyTypographyByFont] = useState<BodyTypographyState>(
    buildInitialBodyTypographyState,
  );
  const [fontTuningByFont, setFontTuningByFont] = useState<FontTuningByFont>(
    buildInitialFontTuningState,
  );
  const [selectedCharacter, setSelectedCharacter] = useState("A");
  const [useBaseline, setUseBaseline] = useState(true);
  const [renderedMetrics, setRenderedMetrics] = useState<RenderedFontMetrics | null>(null);

  const activeTypography =
    bodyTypographyByFont[selectedBodyFont] ?? getFontPreviewState(defaultBodyFont);
  const activeFontTuning =
    fontTuningByFont[selectedBodyFont] ?? getFontTuningState(defaultBodyFont);

  const bodyFontConfig = getFontConfig(selectedBodyFont as FontKey, "body");
  const headerFontConfig = getFontConfig(selectedHeaderFont as FontKey, "header");
  const monoFontConfig = getFontConfig(selectedMonoFont as FontKey, "mono");
  const bodyFamily = bodyFontConfig?.family ?? KARLA_BODY_FAMILY;
  const headerFamily = headerFontConfig?.family ?? KARLA_HEADER_FAMILY;

  const updateSelectedBodyTypography = useCallback((updates: Partial<PreviewTypographyState>) => {
    setBodyTypographyByFont((current) => {
      const currentTypography = current[selectedBodyFont] ?? getFontPreviewState(defaultBodyFont);

      return {
        ...current,
        [selectedBodyFont]: { ...currentTypography, ...updates },
      };
    });
  }, [selectedBodyFont]);

  const updateSelectedFontTuning = useCallback((updates: Partial<FontTuningState>) => {
    setFontTuningByFont((current) => {
      const currentTuning = current[selectedBodyFont] ?? getFontTuningState(defaultBodyFont);

      return {
        ...current,
        [selectedBodyFont]: { ...currentTuning, ...updates },
      };
    });
  }, [selectedBodyFont]);

  const applyBodyFontPreset = useCallback((fontName: string) => {
    setSelectedBodyFont(fontName);
    setBodyTypographyByFont((current) => {
      const nextFontConfig = getFontConfig(fontName as FontKey, "body");
      const nextTypography = getFontPreviewState(nextFontConfig);
      const currentTypography = current[selectedBodyFont] ?? getFontPreviewState(defaultBodyFont);

      return {
        ...current,
        [fontName]: {
          ...currentTypography,
          bodyTypeSizeRatio: nextTypography.bodyTypeSizeRatio,
          bodyFontSizeScale: nextTypography.bodyFontSizeScale,
          bodyFontWeightScale: nextTypography.bodyFontWeightScale,
          bodyLetterSpacingScale: nextTypography.bodyLetterSpacingScale,
          bodyLineHeight: nextTypography.bodyLineHeight,
        },
      };
    });
  }, [selectedBodyFont]);

  const applyHeaderFontPreset = useCallback((fontName: string) => {
    setSelectedHeaderFont(fontName);
    const nextFontConfig = getFontConfig(fontName as FontKey, "header");
    const nextTypography = getFontPreviewState(nextFontConfig);
    updateSelectedBodyTypography({
      headerTypeSizeRatio: nextTypography.headerTypeSizeRatio,
      headerFontSizeScale: nextTypography.headerFontSizeScale,
      headerFontWeightScale: nextTypography.headerFontWeightScale,
      headerLetterSpacingScale: nextTypography.headerLetterSpacingScale,
      headerLineHeight: nextTypography.headerLineHeight,
    });
  }, [updateSelectedBodyTypography]);

  const resetAll = useCallback(() => {
    setSelectedBodyFont(defaultBodyFont.name);
    setSelectedHeaderFont(defaultHeaderFont.name);
    setSelectedMonoFont(defaultMonoFont.name);
    setBodyTypographyByFont(buildInitialBodyTypographyState());
    setFontTuningByFont(buildInitialFontTuningState());
    setSelectedCharacter("A");
    setUseBaseline(true);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function measureFont() {
      setRenderedMetrics(null);

      if (typeof document === "undefined") return;

      try {
        await document.fonts.load(`400 ${activeFontTuning.pointSize}px ${bodyFamily}`, SAMPLE_GLYPHS);
        await document.fonts.ready;
      } catch {
        // Canvas still gives rendered fallback metrics when a font-load check fails.
      }

      if (!isCancelled) {
        setRenderedMetrics(
          measureRenderedFontMetrics(bodyFamily, activeFontTuning.pointSize, selectedCharacter),
        );
      }
    }

    measureFont();

    return () => {
      isCancelled = true;
    };
  }, [activeFontTuning.pointSize, bodyFamily, selectedCharacter]);

  const value = useMemo(() => {
    const tuningStyle = buildTuningStyle(bodyFamily, activeFontTuning);
    const headerTuningStyle = {
      ...buildTuningStyle(headerFamily, activeFontTuning),
      fontSize: Math.round(activeFontTuning.pointSize * 1.75),
      lineHeight: Math.max(1.05, activeFontTuning.leading - 0.18),
    };
    const snippets = buildMetricSnippets({
      activeFontTuning,
      activeTypography,
      bodyFamily,
      bodyFontConfig,
      headerFontConfig,
      renderedMetrics,
      selectedBodyFont,
      selectedHeaderFont,
    });

    return {
      ...snippets,
      activeBodyPreviewStyle: buildPreviewVars(bodyFamily, headerFamily, activeTypography),
      activeFontTuning,
      activeTypography,
      applyBodyFontPreset,
      applyHeaderFontPreset,
      bodyFamily,
      bodyFontConfig,
      headerFamily,
      headerFontConfig,
      headerTuningStyle,
      isKarlaSelected: selectedBodyFont === "Karla" && selectedHeaderFont === "Karla",
      monoFontConfig,
      renderedMetrics,
      resetAll,
      selectedBodyFont,
      selectedCharacter,
      selectedHeaderFont,
      selectedMonoFont,
      setSelectedCharacter,
      setSelectedMonoFont,
      setUseBaseline,
      tuningStyle,
      updateSelectedBodyTypography,
      updateSelectedFontTuning,
      useBaseline,
    };
  }, [
    activeFontTuning,
    activeTypography,
    applyBodyFontPreset,
    applyHeaderFontPreset,
    bodyFamily,
    bodyFontConfig,
    headerFamily,
    headerFontConfig,
    monoFontConfig,
    renderedMetrics,
    resetAll,
    selectedBodyFont,
    selectedCharacter,
    selectedHeaderFont,
    selectedMonoFont,
    updateSelectedBodyTypography,
    updateSelectedFontTuning,
    useBaseline,
  ]);

  return (
    <TypographyPlaygroundContext.Provider value={value}>
      {children}
    </TypographyPlaygroundContext.Provider>
  );
}

export function useTypographyPlayground() {
  const context = useContext(TypographyPlaygroundContext);

  if (!context) {
    throw new Error("useTypographyPlayground must be used within TypographyPlaygroundProvider");
  }

  return context;
}
