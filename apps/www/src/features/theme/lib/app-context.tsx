"use client";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { type SimpleThemeColors, DEFAULT_GLOBAL_ADJUSTMENTS } from "../constants/themes";
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
  DEFAULT_BODY_SCALE,
  DEFAULT_HEADER_MIN_FONT_SIZE_PX,
  DEFAULT_HEADER_SCALE,
  normalizeMinFontSizePx,
  normalizeTypographyScale,
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
  headerScale: number;
  setHeaderScale: (scale: number) => void;
  bodyScale: number;
  setBodyScale: (scale: number) => void;
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
  headerScale: number;
  bodyScale: number;
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
  "isSettingsPanelOpen" | "isCommandPaletteOpen" | "panelPosition" | "isThemeInitialized"
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
  headerScale: defaultPreferences.headerScale,
  bodyScale: defaultPreferences.bodyScale,
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

function getPersistedPreferences(sourceConfig: ThemeSourceConfig): PersistedAppPreferences {
  const validatedColors: SimpleThemeColors = {
    ...sourceConfig.colors,
    codeTheme: normalizeCodeThemeId(sourceConfig.colors.codeTheme),
    semantic: sourceConfig.colors.semantic
      ? ensureSemanticColorIntegrity(sourceConfig.colors.semantic)
      : undefined,
  };

  const bodyMinFontSizePx = normalizeMinFontSizePx(
    sourceConfig.typography.bodyMinFontSizePx,
    DEFAULT_BODY_MIN_FONT_SIZE_PX,
  );
  const headerMinFontSizePx = normalizeMinFontSizePx(
    sourceConfig.typography.headerMinFontSizePx,
    DEFAULT_HEADER_MIN_FONT_SIZE_PX,
  );
  const monoMinFontSizePx = normalizeMinFontSizePx(
    sourceConfig.typography.monoMinFontSizePx,
    defaultPreferences.monoMinFontSizePx,
  );
  return {
    currentThemeColors: validatedColors,
    currentThemeMode: sourceConfig.mode,
    radius: sourceConfig.layout.radius,
    borderWidth: sourceConfig.layout.borderWidth,
    spacingScale: sourceConfig.layout.spacingScale,
    globalAdjustments: sourceConfig.colors.globalAdjustments ?? DEFAULT_GLOBAL_ADJUSTMENTS,
    headerScale: normalizeTypographyScale(
      sourceConfig.typography.headerScale,
      DEFAULT_HEADER_SCALE,
    ),
    bodyScale: normalizeTypographyScale(sourceConfig.typography.bodyScale, DEFAULT_BODY_SCALE),
    monoFontSizeScale:
      sourceConfig.typography.monoFontSizeScale ?? defaultPreferences.monoFontSizeScale,
    monoFontWeightScale:
      sourceConfig.typography.monoFontWeightScale ?? defaultPreferences.monoFontWeightScale,
    monoLetterSpacingScale:
      sourceConfig.typography.monoLetterSpacingScale ?? defaultPreferences.monoLetterSpacingScale,
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
      setBorderWidth: (value) => dispatch({ type: "set", key: "borderWidth", value }),
      spacingScale: state.spacingScale,
      setSpacingScale: (value) => dispatch({ type: "set", key: "spacingScale", value }),
      globalAdjustments: state.globalAdjustments,
      setGlobalAdjustments: (adjustments) =>
        dispatch({ type: "set", key: "globalAdjustments", value: adjustments }),
      headerScale: state.headerScale,
      setHeaderScale: (scale) => dispatch({ type: "set", key: "headerScale", value: scale }),
      bodyScale: state.bodyScale,
      setBodyScale: (scale) => dispatch({ type: "set", key: "bodyScale", value: scale }),
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useApp must be used within an AppProvider");
  return context;
}
