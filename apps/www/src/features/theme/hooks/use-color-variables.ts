'use client'

import { useMemo } from 'react'
import { useApp } from '../lib/app-context'
import {
  generateThemePalettes,
  getShadesForRole,
  type OklchColor,
  type ShadeScale,
  type ColorRole,
} from '../lib/color-utils'

export function useColorVariables(family: ColorRole): Partial<Record<ShadeScale, OklchColor | null>> {
  const { currentThemeColors, currentThemeMode } = useApp()

  return useMemo(() => {
    if (!currentThemeColors) {
      return Object.fromEntries(
        getShadesForRole(family).map(shade => [shade, null])
      )
    }

    const palettes = generateThemePalettes(
      currentThemeColors.background,
      currentThemeColors.foreground,
      currentThemeColors.accent,
      currentThemeMode,
      0,
      currentThemeColors.semantic,
      currentThemeColors.accentChromaLimit ?? 0.3,
      currentThemeColors.accentEasing,
      currentThemeColors.accentChromaScaling,
      currentThemeColors.globalAdjustments,
    )

    if (family === 'background' || family === 'foreground' || family === 'accent') {
      return palettes[family]
    }

    return palettes.semantic?.[family] ?? Object.fromEntries(
      getShadesForRole(family).map(shade => [shade, null])
    )
  }, [currentThemeColors, currentThemeMode, family])
}
