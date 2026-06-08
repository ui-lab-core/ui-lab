"use client";

import type { CSSProperties } from "react";
import { useTypographyPlayground } from "../context";
import { SAMPLE_GLYPHS } from "../lib/constants";
import type { RenderedFontMetrics } from "../lib/types";

function MetricGuide({
  baselineY,
  displayFontSize,
  metrics,
}: {
  baselineY: number;
  displayFontSize: number;
  metrics: RenderedFontMetrics | null;
}) {
  const capHeight = metrics?.capHeight ?? 0;
  const xHeight = metrics?.xHeight ?? 0;
  const ascender = metrics?.ascender ?? 0;
  const descender = metrics?.descender ?? 0;
  const guideLines = [
    { label: "Asc", y: baselineY - ascender * displayFontSize, color: "bg-info-500" },
    { label: "Cap", y: baselineY - capHeight * displayFontSize, color: "bg-success-500" },
    { label: "X", y: baselineY - xHeight * displayFontSize, color: "bg-warning-500" },
    { label: "Base", y: baselineY, color: "bg-foreground-300" },
    { label: "Desc", y: baselineY + descender * displayFontSize, color: "bg-danger-500" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {guideLines.map((line) => (
        <div key={line.label} className="absolute left-0 right-0" style={{ top: line.y }}>
          <span className={`absolute left-0 top-0 h-px w-full ${line.color} opacity-55`} />
          <span className="absolute -top-2 right-0 bg-background-900 pl-2 text-[10px] font-medium text-foreground-500">
            {line.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function GlyphInspector({
  character,
  fontName,
  metrics,
  style,
}: {
  character: string;
  fontName: string;
  metrics: RenderedFontMetrics | null;
  style: CSSProperties;
}) {
  const displayFontSize = 180;
  const baselineY = 200;
  const uppercaseChar = character.toUpperCase();
  const lowercaseChar = character.toLowerCase();
  const displayText = uppercaseChar === lowercaseChar ? character : `${uppercaseChar}${lowercaseChar}`;

  return (
    <div className="relative min-h-[330px] overflow-hidden rounded border border-background-700 bg-background-900 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-foreground-400">Selected glyph</div>
          <div className="text-xs text-foreground-500">{fontName}</div>
        </div>
        <div className="rounded border border-background-700 bg-background-950 px-2 py-1 font-mono text-sm text-foreground-300">
          U+{character.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}
        </div>
      </div>
      <div className="relative h-[260px]">
        <MetricGuide
          baselineY={baselineY}
          displayFontSize={displayFontSize}
          metrics={metrics}
        />
        <svg className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={`${fontName} glyph ${displayText}`}>
          <text
            x="50%"
            y={baselineY}
            textAnchor="middle"
            className="fill-foreground-50"
            style={{
              fontFamily: style.fontFamily,
              fontKerning: "normal",
              fontSize: displayFontSize,
              letterSpacing: style.letterSpacing,
            }}
          >
            {displayText}
          </text>
        </svg>
      </div>
    </div>
  );
}

function GlyphGrid({
  selectedCharacter,
  onSelectCharacter,
  style,
}: {
  selectedCharacter: string;
  onSelectCharacter: (character: string) => void;
  style: CSSProperties;
}) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-12">
      {Array.from(SAMPLE_GLYPHS).map((character) => {
        const isSelected = character === selectedCharacter;

        return (
          <button
            key={character}
            type="button"
            onClick={() => onSelectCharacter(character)}
            className={`aspect-square rounded border text-center text-3xl leading-none transition-colors ${isSelected
              ? "border-foreground-200 bg-background-700 text-foreground-50"
              : "border-background-700 bg-background-900 text-foreground-200 hover:border-background-500 hover:bg-background-800"
              }`}
            style={{ ...style, fontSize: 30, lineHeight: 1 }}
          >
            {character}
          </button>
        );
      })}
    </div>
  );
}

export function GlyphLab() {
  const {
    activeFontTuning,
    renderedMetrics,
    selectedBodyFont,
    selectedCharacter,
    setSelectedCharacter,
    tuningStyle,
  } = useTypographyPlayground();

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-foreground-400">Glyph Lab</div>
          <p className="mt-1 text-sm text-foreground-500">
            Inspect individual characters against Canvas-measured glyph metrics.
          </p>
        </div>
        <div className="rounded border border-background-700 bg-background-900 px-2 py-1 font-mono text-sm text-foreground-300">
          {activeFontTuning.pointSize}px / {activeFontTuning.leading.toFixed(2)} leading
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <GlyphInspector
          character={selectedCharacter}
          fontName={selectedBodyFont}
          metrics={renderedMetrics}
          style={tuningStyle}
        />
        <GlyphGrid
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          style={tuningStyle}
        />
      </div>
    </section>
  );
}
