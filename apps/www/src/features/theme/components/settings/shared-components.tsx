"use client";

import { memo, useMemo, useCallback, useEffect, useState, type CSSProperties } from "react";
import { FaChevronDown, FaCheck, FaSun } from "@/shared/icons/fa6";
import { type OklchColor, type HueRange, cssToOklch, oklchToCss } from "../../lib/color-utils";
import { Slider, Divider, Label, Badge, Color, Input } from "ui-lab-components";
import { useApp } from "../../lib/app-context";
import {
  colorFromHue,
  colorFromChroma,
  getMaxChroma,
  type ThemeColorType,
} from "../../lib/color/set-color";

const MICRO_LABEL = "text-sm font-semibold text-foreground-400";
const VALUE_LABEL = "text-sm text-foreground-300";
const BACKGROUND_CHROMA_PREVIEW_MULTIPLIER = 10;

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

interface GlobalSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  formatValue: (value: number) => string;
  onChange: (value: number) => void;
}

interface ColorRowProps {
  type: ThemeColorType;
  color: OklchColor;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (color: OklchColor) => void;
  hueRange?: HueRange;
}

interface CoreColorControlsProps {
  color: OklchColor;
  onChange: (color: OklchColor) => void;
  type: "background" | "accent";
}

interface SemanticColorPickerProps {
  color: OklchColor;
  onChange: (color: OklchColor) => void;
  hueRange?: HueRange;
  type: ThemeColorType;
}

export const SliderControl = memo(
  ({ label, value, min, max, step, unit, onChange }: SliderControlProps) => {
    const safeValue = value ?? min + (max - min) / 2;
    return (
      <div className="space-y-2 group">
        <div className="flex justify-between items-end">
          <label className="text-sm font-medium text-foreground-400 group-hover:text-foreground-300 transition-colors">
            {label}
          </label>
          <span
            className={`${VALUE_LABEL} border border-background-700 rounded-[8px] bg-background-900 px-1.5 py-0.5 text-foreground-300`}
          >
            {safeValue.toFixed(unit ? 2 : 3)}
            {unit}
          </span>
        </div>
        <Slider.Root
          value={[safeValue]}
          onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
          min={min}
          max={max}
          step={step}
        />
      </div>
    );
  },
);

SliderControl.displayName = "SliderControl";

const GlobalSlider = memo(
  ({ label, value, min, max, step, formatValue, onChange }: GlobalSliderProps) => {
    return (
      <div className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 group">
        <Badge className="col-start-2 justify-self-end">{formatValue(value)}</Badge>
        <span className="text-xs font-medium text-foreground-400">{label}</span>
        <div className="min-w-0">
          <Slider.Root
            value={[value]}
            onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
    );
  },
);

GlobalSlider.displayName = "GlobalSlider";

const getPreviewColor = (
  type: ColorRowProps["type"],
  color: OklchColor,
  themeMode: "dark" | "light",
): OklchColor => {
  const isNeutral = color.c <= 0.005;

  if (type === "background") {
    return themeMode === "dark"
      ? { l: 0.32, c: isNeutral ? 0 : Math.min(color.c, 0.008), h: color.h }
      : { l: 0.88, c: isNeutral ? 0 : Math.min(color.c, 0.008), h: color.h };
  }

  if (type === "foreground") {
    return themeMode === "dark"
      ? { l: 0.95, c: isNeutral ? 0 : Math.min(color.c, 0.04), h: color.h }
      : { l: 0.29, c: isNeutral ? 0 : Math.min(color.c, 0.04), h: color.h };
  }

  if (type === "accent") {
    if (isNeutral) {
      return themeMode === "dark" ? { l: 0.58, c: 0, h: 0 } : { l: 0.58, c: 0, h: 0 };
    }
    return { l: 0.7, c: Math.min(color.c, 0.32), h: color.h };
  }

  return { l: 0.55, c: Math.min(color.c, 0.2), h: color.h };
};

export const ColorRow = memo(
  ({ type, color, isExpanded, onToggle, onChange, hueRange }: ColorRowProps) => {
    const { currentThemeMode } = useApp();
    const formattedColor = oklchToCss(color);
    const [colorValue, setColorValue] = useState(formattedColor);
    const [isEditingColor, setIsEditingColor] = useState(false);
    const previewStyle = useMemo(() => {
      const previewColor = oklchToCss(getPreviewColor(type, color, currentThemeMode));

      return {
        backgroundColor: previewColor,
      } as CSSProperties;
    }, [type, color, currentThemeMode]);

    useEffect(() => {
      if (!isEditingColor) setColorValue(formattedColor);
    }, [formattedColor, isEditingColor]);

    const commitColorValue = () => {
      const nextColor = cssToOklch(colorValue);
      if (nextColor) {
        onChange(nextColor);
        setColorValue(oklchToCss(nextColor));
      } else {
        setColorValue(formattedColor);
      }
      setIsEditingColor(false);
    };

    return (
      <div>
        <div
          className={`mx-[6px] rounded-[7px] ${isExpanded ? "bg-background-900 border border-background-700" : "hover:bg-background-900 border border-transparent hover:border-background-700 active:bg-background-950/50"} mb-[8px] transition-all duration-300 overflow-hidden group`}
        >
          <div className="flex items-center gap-3 py-[10px] px-[10px]">
            <button
              type="button"
              onClick={onToggle}
              className="cursor-pointer flex min-w-0 flex-1 items-center gap-4 text-left outline-none"
              aria-expanded={isExpanded}
            >
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-sm font-semibold text-foreground-100 capitalize leading-tight group-hover:text-foreground-100 transition-colors">
                  {type}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-3 relative">
              <div className="w-4 h-4 rounded-full" style={previewStyle} />
              <Input
                aria-label={`${type} OKLCH color`}
                value={colorValue}
                onFocus={() => setIsEditingColor(true)}
                onChange={(event) => setColorValue(event.target.value)}
                variant="ghost"
                onBlur={commitColorValue}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                  if (event.key === "Escape") {
                    setColorValue(formattedColor);
                    event.currentTarget.blur();
                  }
                }}
                className="h-8 w-fit"
                styles={{ input: "text-foreground-400 font-mono text-xs" }}
              />
            </div>

            <button
              type="button"
              onClick={onToggle}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${type} color controls`}
              className={`mr-3 text-foreground-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            >
              <FaChevronDown size={13} />
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="pb-4 pt-0">
              <div className="h-px w-full bg-background-700 mb-4" />
              <div className="px-4">
                {type === "background" || type === "accent" ? (
                  <CoreColorControls type={type} color={color} onChange={onChange} />
                ) : (
                  <SemanticColorPicker
                    type={type}
                    color={color}
                    onChange={onChange}
                    hueRange={hueRange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Divider />
      </div>
    );
  },
);

ColorRow.displayName = "ColorRow";

const CoreColorControls = memo(({ color, onChange, type }: CoreColorControlsProps) => {
  const { currentThemeMode } = useApp();

  return (
    <div className="space-y-4">
      <div className="space-y-2 group">
        <Label styles={{ text: "text-xs font-medium" }}>Hue</Label>
        <Color.Slider
          type="hue"
          aria-label={`${type} hue`}
          value={color.c <= 0.005 ? 0 : color.h}
          onChange={(hue) => onChange(colorFromHue(type, hue, color, currentThemeMode))}
        />
      </div>
      <div className="space-y-2 group">
        <Label styles={{ text: "text-xs font-medium" }}>Chroma</Label>
        <Color.Slider
          type="chroma"
          aria-label={`${type} chroma`}
          value={color.c}
          color={oklchToCss(getPreviewColor(type, color, currentThemeMode))}
          min={0}
          max={getMaxChroma(type)}
          previewMax={
            type === "background"
              ? getMaxChroma(type) * BACKGROUND_CHROMA_PREVIEW_MULTIPLIER
              : undefined
          }
          step={0.001}
          onChange={(chroma) => onChange(colorFromChroma(type, chroma, color))}
        />
      </div>
    </div>
  );
});

CoreColorControls.displayName = "CoreColorControls";

const SemanticColorPicker = memo(
  ({ color, onChange, hueRange, type }: SemanticColorPickerProps) => {
    const { currentThemeMode } = useApp();

    const swatches = useMemo(() => {
      const hueSwatches = Array.from({ length: 7 }, (_, i) => {
        if (hueRange) return hueRange.min + (hueRange.max - hueRange.min) * (i / 6);

        return (i * (360 / 7)) % 360;
      });
      if (type === "background" || type === "foreground" || type === "accent") {
        return [...hueSwatches, null];
      }
      return hueSwatches;
    }, [hueRange, type]);

    const getSwatchColor = (h: number): OklchColor => {
      if (type === "background") {
        return currentThemeMode === "dark" ? { l: 0.32, c: 0.008, h } : { l: 0.88, c: 0.008, h };
      }
      if (type === "foreground") {
        return currentThemeMode === "dark" ? { l: 0.95, c: 0.04, h } : { l: 0.29, c: 0.04, h };
      }
      if (type === "accent") {
        return { l: 0.7, c: 0.18, h };
      }
      return { l: 0.55, c: 0.2, h };
    };

    const getNeutralSwatchColor = (): OklchColor => {
      if (type === "background") {
        return currentThemeMode === "dark" ? { l: 0.3, c: 0, h: 0 } : { l: 0.9, c: 0, h: 0 };
      }
      if (type === "foreground") {
        return currentThemeMode === "dark" ? { l: 0.95, c: 0, h: 0 } : { l: 0.29, c: 0, h: 0 };
      }
      return { l: 0.58, c: 0, h: 0 };
    };

    const getCheckmarkDark = (isNeutral: boolean): boolean => {
      if (type === "background") return currentThemeMode === "light";
      if (type === "foreground") return currentThemeMode === "dark";
      if (isNeutral) return false;
      return false;
    };

    const handleHueChange = (h: number) => {
      const clampedH = hueRange ? Math.min(hueRange.max, Math.max(hueRange.min, h)) : h;
      onChange(colorFromHue(type, clampedH, color, currentThemeMode));
    };

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {swatches.map((h) => {
            const isNeutral = h === null;
            const isSelected =
              color.c <= 0.005 ? isNeutral : !isNeutral && Math.abs(h - color.h) < 2;
            const displayColor = isNeutral
              ? oklchToCss(getNeutralSwatchColor())
              : oklchToCss(getSwatchColor(h));

            return (
              <button
                key={h ?? "neutral"}
                onClick={() => {
                  if (isNeutral) {
                    onChange({ l: 1, c: 0, h: 0 });
                  } else {
                    onChange(colorFromHue(type, h, color, currentThemeMode));
                  }
                }}
                className="relative h-10 rounded-[4px] flex items-center justify-center"
                style={{ backgroundColor: displayColor }}
              >
                {isSelected && (
                  <FaCheck
                    className={
                      getCheckmarkDark(isNeutral) ? "text-background-950" : "text-accent-50"
                    }
                    size={14}
                  />
                )}
              </button>
            );
          })}
        </div>
        <Color.Slider
          type="hue"
          value={color.c <= 0.005 ? 0 : color.h}
          onChange={handleHueChange}
        />
      </div>
    );
  },
);

SemanticColorPicker.displayName = "SemanticColorPicker";

export const GlobalAdjustmentsPanel = memo(
  ({
    lightnessValue,
    chromaValue,
    onLightnessChange,
    onChromaChange,
  }: {
    lightnessValue: number;
    chromaValue: number;
    onLightnessChange: (value: number) => void;
    onChromaChange: (value: number) => void;
  }) => {
    const formatLightness = useCallback(
      (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`,
      [],
    );

    const formatChroma = useCallback((v: number) => `×${v.toFixed(2)}`, []);

    return (
      <div className="mx-[6px] mb-2 p-3 bg-background-900 rounded-[7px] border border-background-700">
        <div className="space-y-3">
          <GlobalSlider
            label="Lightness"
            value={lightnessValue}
            min={-0.015}
            max={0.015}
            step={0.001}
            unit="%"
            formatValue={formatLightness}
            onChange={onLightnessChange}
          />
          <GlobalSlider
            label="Chroma"
            value={chromaValue}
            min={0.7}
            max={1.5}
            step={0.05}
            unit="×"
            formatValue={formatChroma}
            onChange={onChromaChange}
          />
        </div>
      </div>
    );
  },
);

GlobalAdjustmentsPanel.displayName = "GlobalAdjustmentsPanel";
