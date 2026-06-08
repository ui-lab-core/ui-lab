"use client";

import { TypographyPanel } from "@/features/theme/components/settings/typography-panel";
import type { FontKey } from "@/features/theme/constants/font-config";
import { Label, Select } from "ui-lab-components";
import { useTypographyPlayground } from "../context";
import { SPACING_CONTROLS } from "../lib/constants";
import type { TextAlignment } from "../lib/types";
import { MetricReadout, MetricsGroup, TuningSlider } from "./shared";

export function ControlsSidebar() {
  const {
    activeFontTuning,
    activeTypography,
    applyBodyFontPreset,
    applyHeaderFontPreset,
    renderedMetrics,
    selectedBodyFont,
    selectedCharacter,
    selectedHeaderFont,
    selectedMonoFont,
    setSelectedMonoFont,
    updateSelectedBodyTypography,
    updateSelectedFontTuning,
  } = useTypographyPlayground();

  return (
    <div className="sticky top-8 h-fit max-h-[calc(100vh-4rem)] space-y-5 overflow-y-auto pr-1">
      <div>
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

      <MetricsGroup title="Measured Anatomy">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <MetricReadout label="Baseline" value={0} unit="px" />
          <MetricReadout label="Cap Height" value={renderedMetrics?.capHeight} unit="em" />
          <MetricReadout label="X-height" value={renderedMetrics?.xHeight} unit="em" />
          <MetricReadout label="Ascender" value={renderedMetrics?.ascender} unit="em" />
          <MetricReadout label="Descender" value={renderedMetrics?.descender} unit="em" />
          <MetricReadout label="Stem" value={renderedMetrics?.stem} unit="em" />
          <MetricReadout label="Bowl Width" value={renderedMetrics?.bowlWidth} unit="em" />
          <MetricReadout label="Counter Proxy" value={renderedMetrics?.counterProxy} />
        </dl>
      </MetricsGroup>

      <MetricsGroup title="Spacing and Measurement">
        <div className="space-y-4">
          {SPACING_CONTROLS.map((control) => (
            <TuningSlider
              key={control.key}
              label={control.label}
              value={activeFontTuning[control.key]}
              min={control.min}
              max={control.max}
              step={control.step}
              unit={control.unit}
              onChange={(value) => updateSelectedFontTuning({ [control.key]: value })}
            />
          ))}
          <div className="block space-y-2">
            <Label className="text-sm font-medium text-foreground-400">Alignment</Label>
            <Select
              selectedKey={activeFontTuning.alignment}
              onSelectionChange={(key) =>
                updateSelectedFontTuning({
                  alignment: key as TextAlignment,
                })
              }
            >
              <Select.Trigger>
                <Select.Value placeholder="Select alignment" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="left" textValue="Left">Left</Select.Item>
                <Select.Item value="center" textValue="Center">Center</Select.Item>
                <Select.Item value="right" textValue="Right">Right</Select.Item>
                <Select.Item value="justify" textValue="Justify">Justify</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>
      </MetricsGroup>

      <MetricsGroup title="Selected Font Metrics">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-foreground-500">Font</dt>
          <dd className="text-right text-foreground-200">{selectedBodyFont}</dd>
          <dt className="text-foreground-500">Glyph</dt>
          <dd className="text-right font-mono text-foreground-200">{selectedCharacter}</dd>
          <dt className="text-foreground-500">Cap / X</dt>
          <dd className="text-right text-foreground-200">
            {renderedMetrics
              ? `${renderedMetrics.capHeight.toFixed(2)} / ${renderedMetrics.xHeight.toFixed(2)}`
              : "Measuring"}
          </dd>
          <dt className="text-foreground-500">Tracking Override</dt>
          <dd className="text-right text-foreground-200">
            {activeFontTuning.tracking.toFixed(3)}em
          </dd>
        </dl>
      </MetricsGroup>

      <MetricsGroup title="Selected Glyph Bounds">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <MetricReadout label="Width" value={renderedMetrics?.selected.width} unit="px" />
          <MetricReadout label="Left" value={renderedMetrics?.selected.actualLeft} unit="px" />
          <MetricReadout label="Right" value={renderedMetrics?.selected.actualRight} unit="px" />
          <MetricReadout label="Ascent" value={renderedMetrics?.selected.actualAscent} unit="px" />
          <MetricReadout label="Descent" value={renderedMetrics?.selected.actualDescent} unit="px" />
          <MetricReadout label="Font Asc" value={renderedMetrics?.selected.fontAscent} unit="px" />
          <MetricReadout label="Font Desc" value={renderedMetrics?.selected.fontDescent} unit="px" />
        </dl>
      </MetricsGroup>

      <MetricsGroup title="Measured Kerning Pairs">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          {renderedMetrics?.kerningPairs.map((pair) => (
            <MetricReadout
              key={pair.pair}
              label={pair.pair}
              value={pair.delta}
              unit="px"
            />
          )) ?? <MetricReadout label="Pairs" value="Measuring" />}
        </dl>
      </MetricsGroup>
    </div>
  );
}
