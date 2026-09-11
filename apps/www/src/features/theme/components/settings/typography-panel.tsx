"use client";

import { memo, useState, type ReactNode } from "react";
import {
  FaChevronDown,
  FaFont,
  FaHeading,
} from "@/shared/icons/fa6";
import { Divider, Select, Slider } from "ui-lab-components";
import {
  MAX_MIN_FONT_SIZE_PX,
  MIN_MIN_FONT_SIZE_PX,
  TYPOGRAPHY_SCALE_MAX,
  TYPOGRAPHY_SCALE_MIN,
  TYPOGRAPHY_LINE_HEIGHT_MAX,
  TYPOGRAPHY_LINE_HEIGHT_MIN,
  TypographyConfig,
} from "../../lib/typography-config";
import { FONTS, MONO_FONTS, type FontFamilyConfig, type FontId, type FontOption } from "../../lib/fonts";

type TypographySectionKey = "header" | "body" | "mono";
type TypographyFontRole = "header" | "body" | "mono";

interface TypographyPanelProps {
  typography: TypographyConfig;
  onTypographyChange: (next: Partial<TypographyConfig>) => void;
  fontFamily: FontFamilyConfig;
  onFontFamilyChange: (role: TypographyFontRole, fontId: FontId) => void;
}

interface TypographySectionProps {
  icon: ReactNode;
  title: string;
  select: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

const TypographySection = memo(
  ({ icon, title, select, isExpanded, onToggle, children }: TypographySectionProps) => {
    return (
      <div>
        <div
          className={`mx-[6px] rounded-[7px] ${isExpanded ? "bg-background-900 border border-background-700" : "hover:bg-background-900 border border-transparent hover:border-background-700"} mb-[8px] transition-all duration-300 overflow-hidden group`}
        >
          <div
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="cursor-pointer flex items-center gap-3 py-[10px] px-[10px]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none">
              <div className="w-5 h-5 flex items-center justify-center rounded-[5px] bg-background-700 text-foreground-200 shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-xs font-medium text-foreground-200 leading-tight group-hover:text-foreground-100 transition-colors">
                  {title}
                </div>
              </div>
            </div>

            <div className="w-47 min-w-0" onClick={(e) => e.stopPropagation()}>
              {select}
            </div>

            <div
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${title} typography settings`}
              className={`mr-2 text-foreground-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            >
              <FaChevronDown size={11} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${isExpanded ? "max-h-[660px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="pb-4 pt-0">
              <div className="h-px w-full bg-background-700 mb-4" />
              <div className="px-4">{children}</div>
            </div>
          </div>
        </div>
        <Divider />
      </div>
    );
  },
);

TypographySection.displayName = "TypographySection";

const SliderRow = memo(({ label, value, min, max, step, unit, onChange }: SliderRowProps) => {
  const safeValue = value ?? min + (max - min) / 2;

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-foreground-400 group-hover:text-foreground-300 transition-colors">
          {label}
        </label>
        <span className="border border-background-700 rounded-[8px] bg-background-900 px-1.5 py-0.5 text-sm text-foreground-300 tabular-nums">
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
});

SliderRow.displayName = "SliderRow";

const FontFamilySelect = memo(
  ({
    value,
    options,
    onChange,
  }: {
    value: FontId;
    options: FontOption[];
    onChange: (fontId: FontId) => void;
  }) => {
    return (
      <Select
          selectedKey={value}
          onSelectionChange={(key) => key !== null && onChange(String(key) as FontId)}
          className="w-full"
        >
          <Select.Trigger className="w-full" aria-label="Font family">
            <Select.Value placeholder="Choose a font" />
          </Select.Trigger>
          <Select.Content>
            {options.map((option) => (
              <Select.Item key={option.id} value={option.id} textValue={option.name}>
                {option.name}
              </Select.Item>
            ))}
          </Select.Content>
      </Select>
    );
  },
);

FontFamilySelect.displayName = "FontFamilySelect";

export const TypographyPanel = memo(
  ({ typography, onTypographyChange, fontFamily, onFontFamilyChange }: TypographyPanelProps) => {
    const {
      headerScale,
      bodyScale,
      bodyMinFontSizePx,
      headerMinFontSizePx,
      monoFontSizeScale,
      monoLetterSpacingScale,
      monoFontWeightScale,
      monoLineHeight,
      monoMinFontSizePx,
    } = typography;
    const [expandedSection, setExpandedSection] = useState<TypographySectionKey | null>(null);

    return (
    <div className="m-0 space-y-[8px]">
      <div className="space-y-[8px]">
        <TypographySection
          icon={<FaHeading size={11} />}
          title="Header"
          select={
            <FontFamilySelect
              value={fontFamily.headerFontId}
              options={FONTS}
              onChange={(id) => onFontFamilyChange("header", id)}
            />
          }
          isExpanded={expandedSection === "header"}
          onToggle={() => setExpandedSection((current) => (current === "header" ? null : "header"))}
        >
          <div className="space-y-3">
            <SliderRow
              label="Scale"
              value={headerScale}
              min={TYPOGRAPHY_SCALE_MIN}
              max={TYPOGRAPHY_SCALE_MAX}
              step={0.01}
              unit="x"
              onChange={(scale) => onTypographyChange({ headerScale: scale })}
            />
            <SliderRow
              label="Minimum Font Size"
              value={headerMinFontSizePx}
              min={MIN_MIN_FONT_SIZE_PX}
              max={MAX_MIN_FONT_SIZE_PX}
              step={0.05}
              unit="px"
              onChange={(size) => onTypographyChange({ headerMinFontSizePx: size })}
            />
          </div>
        </TypographySection>

        <TypographySection
          icon={<FaFont size={11} />}
          title="Body"
          select={
            <FontFamilySelect
              value={fontFamily.bodyFontId}
              options={FONTS}
              onChange={(id) => onFontFamilyChange("body", id)}
            />
          }
          isExpanded={expandedSection === "body"}
          onToggle={() => setExpandedSection((current) => (current === "body" ? null : "body"))}
        >
          <div className="space-y-3">
            <SliderRow
              label="Scale"
              value={bodyScale}
              min={TYPOGRAPHY_SCALE_MIN}
              max={TYPOGRAPHY_SCALE_MAX}
              step={0.01}
              unit="x"
              onChange={(scale) => onTypographyChange({ bodyScale: scale })}
            />
            <SliderRow
              label="Minimum Font Size"
              value={bodyMinFontSizePx}
              min={MIN_MIN_FONT_SIZE_PX}
              max={MAX_MIN_FONT_SIZE_PX}
              step={0.05}
              unit="px"
              onChange={(size) => onTypographyChange({ bodyMinFontSizePx: size })}
            />
          </div>
        </TypographySection>
      </div>

      <TypographySection
        icon={<FaFont size={11} />}
        title="Mono"
        select={
          <FontFamilySelect
            value={fontFamily.monoFontId}
            options={MONO_FONTS}
            onChange={(id) => onFontFamilyChange("mono", id)}
          />
        }
        isExpanded={expandedSection === "mono"}
        onToggle={() => setExpandedSection((current) => (current === "mono" ? null : "mono"))}
      >
        <div className="space-y-3">
          <SliderRow
            label="Code Size"
            value={monoFontSizeScale}
            min={0.8}
            max={1.2}
            step={0.01}
            unit="x"
            onChange={(scale) => onTypographyChange({ monoFontSizeScale: scale })}
          />
          <SliderRow
            label="Code Letter Spacing"
            value={monoLetterSpacingScale}
            min={0}
            max={3.5}
            step={0.05}
            unit="x"
            onChange={(scale) => onTypographyChange({ monoLetterSpacingScale: scale })}
          />
          <SliderRow
            label="Code Weight"
            value={monoFontWeightScale}
            min={0.8}
            max={1.2}
            step={0.01}
            unit="x"
            onChange={(scale) => onTypographyChange({ monoFontWeightScale: scale })}
          />
          <SliderRow
            label="Code Line Height"
            value={monoLineHeight}
            min={TYPOGRAPHY_LINE_HEIGHT_MIN}
            max={TYPOGRAPHY_LINE_HEIGHT_MAX}
            step={0.01}
            unit=""
            onChange={(lineHeight) => onTypographyChange({ monoLineHeight: lineHeight })}
          />
          <SliderRow
            label="Code Minimum Size"
            value={monoMinFontSizePx}
            min={MIN_MIN_FONT_SIZE_PX}
            max={MAX_MIN_FONT_SIZE_PX}
            step={0.05}
            unit="px"
            onChange={(size) => onTypographyChange({ monoMinFontSizePx: size })}
          />
        </div>
      </TypographySection>
    </div>
  );
});

TypographyPanel.displayName = "TypographyPanel";
