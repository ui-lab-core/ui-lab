"use client";

import { TypographyPanel } from "@/features/theme/components/settings/typography-panel";
import type { FontKey } from "@/features/theme/constants/font-config";
import { useTypographyPlayground } from "../context";

export function ControlsSidebar() {
  const {
    activeTypography,
    applyBodyFontPreset,
    applyHeaderFontPreset,
    selectedBodyFont,
    selectedHeaderFont,
    selectedMonoFont,
    setSelectedMonoFont,
    updateSelectedBodyTypography,
  } = useTypographyPlayground();

  return (
    <div className="sticky top-8 h-fit max-h-[calc(100vh-4rem)] space-y-5 overflow-y-auto pr-1">
      <h2 className="mb-4 text-lg font-semibold text-foreground-100">Controls</h2>
      <TypographyPanel
        selectedBodyFont={selectedBodyFont}
        selectedHeaderFont={selectedHeaderFont}
        selectedMonoFont={selectedMonoFont}
        typography={activeTypography}
        onBodyFontChange={applyBodyFontPreset}
        onHeaderFontChange={applyHeaderFontPreset}
        onMonoFontChange={(fontName) => setSelectedMonoFont(fontName as FontKey)}
        onTypographyChange={updateSelectedBodyTypography}
      />
    </div>
  );
}
