"use client";

import {
  createContext,
  useCallback,
  useContext,
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
  DEFAULT_HEADER_LINE_HEIGHT,
} from "@/features/theme/lib/typography-config";
import {
  defaultBodyFont,
  defaultHeaderFont,
  defaultMonoFont,
} from "./lib/constants";
import { buildPreviewVars, getFontPreviewState } from "./lib/preview";
import type {
  BodyTypographyState,
  PreviewTypographyState,
} from "./lib/types";

function buildInitialBodyTypographyState(): BodyTypographyState {
  return Object.fromEntries(
    BODY_FONTS.map((font) => [font.name, getFontPreviewState(font)]),
  );
}

function buildMetricSnippets({
  activeTypography,
  bodyFamily,
  bodyFontConfig,
  headerFontConfig,
  selectedBodyFont,
  selectedHeaderFont,
}: Pick<
  TypographyPlaygroundContextValue,
  | "activeTypography"
  | "bodyFamily"
  | "bodyFontConfig"
  | "headerFontConfig"
  | "selectedBodyFont"
  | "selectedHeaderFont"
>) {
  const bodyFontMetrics: Record<string, number> = {
    fontSizeScale: activeTypography.bodyFontSizeScale,
    fontWeightScale: activeTypography.bodyFontWeightScale,
    typeSizeRatio: activeTypography.bodyTypeSizeRatio,
    bodyLetterSpacingScale: activeTypography.bodyLetterSpacingScale,
    bodyLineHeight: activeTypography.bodyLineHeight,
    bodyMinFontSizePx: activeTypography.bodyMinFontSizePx,
    headerMinFontSizePx: activeTypography.headerMinFontSizePx,
  };
  const headerFontMetrics: Record<string, number> = {
    fontSizeScale: activeTypography.headerFontSizeScale,
    fontWeightScale: activeTypography.headerFontWeightScale,
    typeSizeRatio: activeTypography.headerTypeSizeRatio,
  };

  if (activeTypography.headerLetterSpacingScale !== 0) {
    bodyFontMetrics.headerLetterSpacingScale = activeTypography.headerLetterSpacingScale;
    headerFontMetrics.headerLetterSpacingScale = activeTypography.headerLetterSpacingScale;
  }
  if (activeTypography.headerLineHeight !== DEFAULT_HEADER_LINE_HEIGHT) {
    bodyFontMetrics.headerLineHeight = activeTypography.headerLineHeight;
    headerFontMetrics.headerLineHeight = activeTypography.headerLineHeight;
  }

  const formatMetrics = (metrics: Record<string, number>) =>
    Object.entries(metrics)
      .map(([key, value]) => `      ${key}: ${value}`)
      .join(",\n");

  return {
    bodyConfigSnippet: `  {
    name: "${selectedBodyFont}",
    family: '${bodyFontConfig?.family ?? bodyFamily}',
    isDefault: false,
    metrics: {
${formatMetrics(bodyFontMetrics)}
    },
  },`,
    headerConfigSnippet: `  {
    name: "${selectedHeaderFont}",
    family: '${headerFontConfig?.family ?? "..."}',
    isDefault: false,
    metrics: {
${formatMetrics(headerFontMetrics)}
    },
  },`,
  };
}

interface TypographyPlaygroundContextValue {
  activeBodyPreviewStyle: CSSProperties;
  activeTypography: PreviewTypographyState;
  bodyConfigSnippet: string;
  bodyFamily: string;
  bodyFontConfig: ReturnType<typeof getFontConfig>;
  headerConfigSnippet: string;
  headerFamily: string;
  headerFontConfig: ReturnType<typeof getFontConfig>;
  compareExpandedExamples: Record<string, boolean>;
  monoFontConfig: ReturnType<typeof getFontConfig>;
  resetAll: () => void;
  selectedBodyFont: string;
  selectedCharacter: string;
  selectedHeaderFont: string;
  selectedMonoFont: string;
  setSelectedCharacter: (character: string) => void;
  setSelectedMonoFont: (fontName: FontKey) => void;
  setCompareExpandedExample: (key: string, isExpanded: boolean) => void;
  updateSelectedBodyTypography: (updates: Partial<PreviewTypographyState>) => void;
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
  const [compareExpandedExamples, setCompareExpandedExamples] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedCharacter, setSelectedCharacter] = useState("A");

  const activeTypography =
    bodyTypographyByFont[selectedBodyFont] ?? getFontPreviewState(defaultBodyFont);

  const bodyFontConfig = getFontConfig(selectedBodyFont as FontKey, "body");
  const headerFontConfig = getFontConfig(selectedHeaderFont as FontKey, "header");
  const monoFontConfig = getFontConfig(selectedMonoFont as FontKey, "mono");
  const bodyFamily = bodyFontConfig?.family ?? defaultBodyFont.family;
  const headerFamily = headerFontConfig?.family ?? defaultHeaderFont.family;

  const updateSelectedBodyTypography = useCallback((updates: Partial<PreviewTypographyState>) => {
    setBodyTypographyByFont((current) => {
      const currentTypography = current[selectedBodyFont] ?? getFontPreviewState(defaultBodyFont);

      return {
        ...current,
        [selectedBodyFont]: { ...currentTypography, ...updates },
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
          bodyMinFontSizePx: nextTypography.bodyMinFontSizePx,
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
    setCompareExpandedExamples({});
    setSelectedCharacter("A");
  }, []);

  const setCompareExpandedExample = useCallback((key: string, isExpanded: boolean) => {
    setCompareExpandedExamples((current) => {
      if (current[key] === isExpanded) {
        return current;
      }

      return {
        ...current,
        [key]: isExpanded,
      };
    });
  }, []);

  const value = useMemo(() => {
    const snippets = buildMetricSnippets({
      activeTypography,
      bodyFamily,
      bodyFontConfig,
      headerFontConfig,
      selectedBodyFont,
      selectedHeaderFont,
    });

    return {
      ...snippets,
      activeBodyPreviewStyle: buildPreviewVars(bodyFamily, headerFamily, activeTypography),
      activeTypography,
      applyBodyFontPreset,
      applyHeaderFontPreset,
      bodyFamily,
      bodyFontConfig,
      compareExpandedExamples,
      headerFamily,
      headerFontConfig,
      monoFontConfig,
      resetAll,
      selectedBodyFont,
      selectedCharacter,
      selectedHeaderFont,
      selectedMonoFont,
      setSelectedCharacter,
      setSelectedMonoFont,
      setCompareExpandedExample,
      updateSelectedBodyTypography,
    };
  }, [
    activeTypography,
    applyBodyFontPreset,
    applyHeaderFontPreset,
    bodyFamily,
    bodyFontConfig,
    compareExpandedExamples,
    headerFamily,
    headerFontConfig,
    monoFontConfig,
    resetAll,
    selectedBodyFont,
    selectedCharacter,
    selectedHeaderFont,
    selectedMonoFont,
    updateSelectedBodyTypography,
    setCompareExpandedExample,
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
