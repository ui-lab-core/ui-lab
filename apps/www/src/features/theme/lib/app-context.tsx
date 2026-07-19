"use client";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  type SimpleThemeColors,
  DEFAULT_GLOBAL_ADJUSTMENTS,
} from "../constants/themes";
import {
  getSourceConfig,
  validateThemeCache,
  applyThemeCacheToDOM,
  THEME_CACHE_KEY,
  type ThemeSourceConfig,
} from "./theme-cache";
import { ensureSemanticColorIntegrity } from "./color/semantic";
import { type GlobalColorAdjustments } from "./color-utils";
import {
  DEFAULT_BODY_MIN_FONT_SIZE_PX,
  DEFAULT_HEADER_MIN_FONT_SIZE_PX,
  normalizeMinFontSizePx,
  normalizeTypographyLineHeight,
} from "./typography-config";
import { getDefaultAppPreferences } from "./default-theme-config";
import { normalizeCodeThemeId } from "./themes/shiki/code-theme-options";

interface AppContextType {
  isSettingsPanelOpen: boolean;
  setIsSettingsPanelOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  currentThemeColors: SimpleThemeColors | null;
  setCurrentThemeColors: (colors: SimpleThemeColors) => void;
  currentThemeMode: "light" | "dark";
  setCurrentThemeMode: (mode: "light" | "dark") => void;
  panelPosition: { x: number; y: number };
  setPanelPosition: (position: { x: number; y: number }) => void;
  isThemeInitialized: boolean;
  radius: number;
  setRadius: (value: number) => void;
  borderWidth: number;
  setBorderWidth: (value: number) => void;
  spacingScale: number;
  setSpacingScale: (value: number) => void;
  globalAdjustments: GlobalColorAdjustments;
  setGlobalAdjustments: (adjustments: GlobalColorAdjustments) => void;
  headerTypeSizeRatio: number;
  setHeaderTypeSizeRatio: (ratio: number) => void;
  headerFontSizeScale: number;
  setHeaderFontSizeScale: (scale: number) => void;
  headerFontWeightScale: number;
  setHeaderFontWeightScale: (scale: number) => void;
  headerLetterSpacingScale: number;
  setHeaderLetterSpacingScale: (scale: number) => void;
  headerLineHeight: number;
  setHeaderLineHeight: (lineHeight: number) => void;
  bodyTypeSizeRatio: number;
  setBodyTypeSizeRatio: (ratio: number) => void;
  bodyFontSizeScale: number;
  setBodyFontSizeScale: (scale: number) => void;
  bodyFontWeightScale: number;
  setBodyFontWeightScale: (scale: number) => void;
  bodyLetterSpacingScale: number;
  setBodyLetterSpacingScale: (scale: number) => void;
  bodyLineHeight: number;
  setBodyLineHeight: (lineHeight: number) => void;
  monoFontSizeScale: number;
  setMonoFontSizeScale: (scale: number) => void;
  monoFontWeightScale: number;
  setMonoFontWeightScale: (scale: number) => void;
  monoLetterSpacingScale: number;
  setMonoLetterSpacingScale: (scale: number) => void;
  monoLineHeight: number;
  setMonoLineHeight: (lineHeight: number) => void;
  monoMinFontSizePx: number;
  setMonoMinFontSizePx: (size: number) => void;
  bodyMinFontSizePx: number;
  setBodyMinFontSizePx: (size: number) => void;
  headerMinFontSizePx: number;
  setHeaderMinFontSizePx: (size: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPreferences = getDefaultAppPreferences();

interface AppState {
  isSettingsPanelOpen: boolean;
  isCommandPaletteOpen: boolean;
  currentThemeColors: SimpleThemeColors | null;
  currentThemeMode: "light" | "dark";
  panelPosition: { x: number; y: number };
  isThemeInitialized: boolean;
  radius: number;
  borderWidth: number;
  spacingScale: number;
  globalAdjustments: GlobalColorAdjustments;
  headerTypeSizeRatio: number;
  headerFontSizeScale: number;
  headerFontWeightScale: number;
  headerLetterSpacingScale: number;
  headerLineHeight: number;
  bodyTypeSizeRatio: number;
  bodyFontSizeScale: number;
  bodyFontWeightScale: number;
  bodyLetterSpacingScale: number;
  bodyLineHeight: number;
  monoFontSizeScale: number;
  monoFontWeightScale: number;
  monoLetterSpacingScale: number;
  monoLineHeight: number;
  monoMinFontSizePx: number;
  bodyMinFontSizePx: number;
  headerMinFontSizePx: number;
}

type PersistedAppPreferences = Omit<
  AppState,
  | "isSettingsPanelOpen"
  | "isCommandPaletteOpen"
  | "panelPosition"
  | "isThemeInitialized"
>;

type AppAction =
  | { type: "merge"; value: Partial<AppState> }
  | {
      type: "set";
      key: keyof AppState;
      value: AppState[keyof AppState];
    };

const initialAppState: AppState = {
  isSettingsPanelOpen: false,
  isCommandPaletteOpen: false,
  currentThemeColors: defaultPreferences.colors,
  currentThemeMode: defaultPreferences.mode,
  panelPosition: { x: 20, y: 80 },
  isThemeInitialized: false,
  radius: defaultPreferences.radius,
  borderWidth: defaultPreferences.borderWidth,
  spacingScale: defaultPreferences.spacingScale,
  globalAdjustments: defaultPreferences.globalAdjustments,
  headerTypeSizeRatio: defaultPreferences.headerTypeSizeRatio,
  headerFontSizeScale: defaultPreferences.headerFontSizeScale,
  headerFontWeightScale: defaultPreferences.headerFontWeightScale,
  headerLetterSpacingScale: defaultPreferences.headerLetterSpacingScale,
  headerLineHeight: defaultPreferences.headerLineHeight,
  bodyTypeSizeRatio: defaultPreferences.bodyTypeSizeRatio,
  bodyFontSizeScale: defaultPreferences.bodyFontSizeScale,
  bodyFontWeightScale: defaultPreferences.bodyFontWeightScale,
  bodyLetterSpacingScale: defaultPreferences.bodyLetterSpacingScale,
  bodyLineHeight: defaultPreferences.bodyLineHeight,
  monoFontSizeScale: defaultPreferences.monoFontSizeScale,
  monoFontWeightScale: defaultPreferences.monoFontWeightScale,
  monoLetterSpacingScale: defaultPreferences.monoLetterSpacingScale,
  monoLineHeight: defaultPreferences.monoLineHeight,
  monoMinFontSizePx: defaultPreferences.monoMinFontSizePx,
  bodyMinFontSizePx: defaultPreferences.bodyMinFontSizePx,
  headerMinFontSizePx: defaultPreferences.headerMinFontSizePx,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "merge":
      return { ...state, ...action.value };
    case "set":
      return {
        ...state,
        [action.key]: action.value,
      } as AppState;
    default:
      return state;
  }
}

function getPersistedPreferences(
  sourceConfig: ThemeSourceConfig,
): PersistedAppPreferences {
  const validatedColors: SimpleThemeColors = {
    ...sourceConfig.colors,
    codeTheme: normalizeCodeThemeId(sourceConfig.colors.codeTheme),
    semantic: sourceConfig.colors.semantic
      ? ensureSemanticColorIntegrity(sourceConfig.colors.semantic)
      : undefined,
  };

  const legacyMinFontSizePx = sourceConfig.typography.globalMinFontSizePx;
  const bodyMinFontSizePx = normalizeMinFontSizePx(
    sourceConfig.typography.bodyMinFontSizePx ?? legacyMinFontSizePx,
    DEFAULT_BODY_MIN_FONT_SIZE_PX,
  );
  const headerMinFontSizePx = normalizeMinFontSizePx(
    sourceConfig.typography.headerMinFontSizePx ?? legacyMinFontSizePx,
    DEFAULT_HEADER_MIN_FONT_SIZE_PX,
  );
  const monoMinFontSizePx = normalizeMinFontSizePx(
    sourceConfig.typography.monoMinFontSizePx ?? legacyMinFontSizePx,
    defaultPreferences.monoMinFontSizePx,
  );
  const bodyTypeSizeRatio =
    sourceConfig.typography.bodyTypeSizeRatio ??
    defaultPreferences.bodyTypeSizeRatio;
  const bodyFontSizeScale =
    sourceConfig.typography.bodyFontSizeScale ??
    defaultPreferences.bodyFontSizeScale;
  const headerTypeSizeRatio =
    sourceConfig.typography.headerTypeSizeRatio ??
    defaultPreferences.headerTypeSizeRatio;
  const headerFontSizeScale =
    sourceConfig.typography.headerFontSizeScale ??
    defaultPreferences.headerFontSizeScale;

  return {
    currentThemeColors: validatedColors,
    currentThemeMode: sourceConfig.mode,
    radius: sourceConfig.layout.radius,
    borderWidth: sourceConfig.layout.borderWidth,
    spacingScale: sourceConfig.layout.spacingScale,
    globalAdjustments:
      sourceConfig.colors.globalAdjustments ?? DEFAULT_GLOBAL_ADJUSTMENTS,
    headerTypeSizeRatio,
    headerFontSizeScale,
    headerFontWeightScale:
      sourceConfig.typography.headerFontWeightScale ??
      defaultPreferences.headerFontWeightScale,
    headerLetterSpacingScale:
      sourceConfig.typography.headerLetterSpacingScale ??
      defaultPreferences.headerLetterSpacingScale,
    headerLineHeight: normalizeTypographyLineHeight(
      sourceConfig.typography.headerLineHeight,
      defaultPreferences.headerLineHeight,
    ),
    bodyTypeSizeRatio,
    bodyFontSizeScale,
    bodyFontWeightScale:
      sourceConfig.typography.bodyFontWeightScale ??
      defaultPreferences.bodyFontWeightScale,
    bodyLetterSpacingScale:
      sourceConfig.typography.bodyLetterSpacingScale ??
      defaultPreferences.bodyLetterSpacingScale,
    bodyLineHeight: normalizeTypographyLineHeight(
      sourceConfig.typography.bodyLineHeight,
      defaultPreferences.bodyLineHeight,
    ),
    monoFontSizeScale:
      sourceConfig.typography.monoFontSizeScale ??
      defaultPreferences.monoFontSizeScale,
    monoFontWeightScale:
      sourceConfig.typography.monoFontWeightScale ??
      defaultPreferences.monoFontWeightScale,
    monoLetterSpacingScale:
      sourceConfig.typography.monoLetterSpacingScale ??
      defaultPreferences.monoLetterSpacingScale,
    monoLineHeight: normalizeTypographyLineHeight(
      sourceConfig.typography.monoLineHeight,
      defaultPreferences.monoLineHeight,
    ),
    monoMinFontSizePx,
    bodyMinFontSizePx,
    headerMinFontSizePx,
  };
}

function loadPreferencesFromStorage(): PersistedAppPreferences | null {
  if (typeof window === "undefined") return null;

  const sourceConfig = getSourceConfig();
  if (!sourceConfig) return null;

  return getPersistedPreferences(sourceConfig);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  useEffect(() => {
    const savedPrefs = loadPreferencesFromStorage();
    dispatch({
      type: "merge",
      value: {
        ...(savedPrefs ?? {}),
        isThemeInitialized: true,
      },
    });
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_CACHE_KEY && e.newValue) {
        try {
          const cache = validateThemeCache(JSON.parse(e.newValue));
          if (cache) {
            // Multi-tab synchronization:
            // Tab A changed theme → stored in localStorage → fires storage event in Tab B
            // Runtime sync can apply the full cached token set because state updates
            // immediately afterwards and React takes back ownership of live changes.
            applyThemeCacheToDOM(cache);
            dispatch({
              type: "merge",
              value: getPersistedPreferences(cache.sourceConfig),
            });
          }
        } catch (error) {
          console.warn("[AppContext] Failed to sync storage change:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = React.useMemo<AppContextType>(
    () => ({
      isSettingsPanelOpen: state.isSettingsPanelOpen,
      setIsSettingsPanelOpen: (open) =>
        dispatch({ type: "set", key: "isSettingsPanelOpen", value: open }),
      isCommandPaletteOpen: state.isCommandPaletteOpen,
      setIsCommandPaletteOpen: (open) =>
        dispatch({ type: "set", key: "isCommandPaletteOpen", value: open }),
      currentThemeColors: state.currentThemeColors,
      setCurrentThemeColors: (colors) =>
        dispatch({ type: "set", key: "currentThemeColors", value: colors }),
      currentThemeMode: state.currentThemeMode,
      setCurrentThemeMode: (mode) =>
        dispatch({ type: "set", key: "currentThemeMode", value: mode }),
      panelPosition: state.panelPosition,
      setPanelPosition: (position) =>
        dispatch({ type: "set", key: "panelPosition", value: position }),
      isThemeInitialized: state.isThemeInitialized,
      radius: state.radius,
      setRadius: (value) => dispatch({ type: "set", key: "radius", value }),
      borderWidth: state.borderWidth,
      setBorderWidth: (value) =>
        dispatch({ type: "set", key: "borderWidth", value }),
      spacingScale: state.spacingScale,
      setSpacingScale: (value) =>
        dispatch({ type: "set", key: "spacingScale", value }),
      globalAdjustments: state.globalAdjustments,
      setGlobalAdjustments: (adjustments) =>
        dispatch({ type: "set", key: "globalAdjustments", value: adjustments }),
      headerTypeSizeRatio: state.headerTypeSizeRatio,
      setHeaderTypeSizeRatio: (ratio) =>
        dispatch({ type: "set", key: "headerTypeSizeRatio", value: ratio }),
      headerFontSizeScale: state.headerFontSizeScale,
      setHeaderFontSizeScale: (scale) =>
        dispatch({ type: "set", key: "headerFontSizeScale", value: scale }),
      headerFontWeightScale: state.headerFontWeightScale,
      setHeaderFontWeightScale: (scale) =>
        dispatch({ type: "set", key: "headerFontWeightScale", value: scale }),
      headerLetterSpacingScale: state.headerLetterSpacingScale,
      setHeaderLetterSpacingScale: (scale) =>
        dispatch({
          type: "set",
          key: "headerLetterSpacingScale",
          value: scale,
        }),
      headerLineHeight: state.headerLineHeight,
      setHeaderLineHeight: (lineHeight) =>
        dispatch({ type: "set", key: "headerLineHeight", value: lineHeight }),
      bodyTypeSizeRatio: state.bodyTypeSizeRatio,
      setBodyTypeSizeRatio: (ratio) =>
        dispatch({ type: "set", key: "bodyTypeSizeRatio", value: ratio }),
      bodyFontSizeScale: state.bodyFontSizeScale,
      setBodyFontSizeScale: (scale) =>
        dispatch({ type: "set", key: "bodyFontSizeScale", value: scale }),
      bodyFontWeightScale: state.bodyFontWeightScale,
      setBodyFontWeightScale: (scale) =>
        dispatch({ type: "set", key: "bodyFontWeightScale", value: scale }),
      bodyLetterSpacingScale: state.bodyLetterSpacingScale,
      setBodyLetterSpacingScale: (scale) =>
        dispatch({
          type: "set",
          key: "bodyLetterSpacingScale",
          value: scale,
        }),
      bodyLineHeight: state.bodyLineHeight,
      setBodyLineHeight: (lineHeight) =>
        dispatch({ type: "set", key: "bodyLineHeight", value: lineHeight }),
      monoFontSizeScale: state.monoFontSizeScale,
      setMonoFontSizeScale: (scale) =>
        dispatch({ type: "set", key: "monoFontSizeScale", value: scale }),
      monoFontWeightScale: state.monoFontWeightScale,
      setMonoFontWeightScale: (scale) =>
        dispatch({ type: "set", key: "monoFontWeightScale", value: scale }),
      monoLetterSpacingScale: state.monoLetterSpacingScale,
      setMonoLetterSpacingScale: (scale) =>
        dispatch({ type: "set", key: "monoLetterSpacingScale", value: scale }),
      monoLineHeight: state.monoLineHeight,
      setMonoLineHeight: (lineHeight) =>
        dispatch({ type: "set", key: "monoLineHeight", value: lineHeight }),
      monoMinFontSizePx: state.monoMinFontSizePx,
      setMonoMinFontSizePx: (size) =>
        dispatch({ type: "set", key: "monoMinFontSizePx", value: size }),
      bodyMinFontSizePx: state.bodyMinFontSizePx,
      setBodyMinFontSizePx: (size) =>
        dispatch({ type: "set", key: "bodyMinFontSizePx", value: size }),
      headerMinFontSizePx: state.headerMinFontSizePx,
      setHeaderMinFontSizePx: (size) =>
        dispatch({ type: "set", key: "headerMinFontSizePx", value: size }),
    }),
    [state, dispatch],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("useApp must be used within an AppProvider");
  return context;
}
