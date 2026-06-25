"use client";

import { useTypographyPlayground } from "../context";
import { SAMPLE_GLYPHS } from "../lib/constants";

function GlyphInspector({
  character,
  fontName,
  fontFamily,
}: {
  character: string;
  fontName: string;
  fontFamily: string;
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
        <svg className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={`${fontName} glyph ${displayText}`}>
          <text
            x="50%"
            y={baselineY}
            textAnchor="middle"
            className="fill-foreground-50"
            style={{ fontFamily, fontKerning: "normal", fontSize: displayFontSize }}
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
  fontFamily,
}: {
  selectedCharacter: string;
  onSelectCharacter: (character: string) => void;
  fontFamily: string;
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
            style={{ fontFamily, fontSize: 30, lineHeight: 1 }}
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
    bodyFamily,
    selectedBodyFont,
    selectedCharacter,
    setSelectedCharacter,
  } = useTypographyPlayground();

  return (
    <section className="space-y-4">
      <div>
        <div className="text-sm font-medium text-foreground-400">Glyph Lab</div>
        <p className="mt-1 text-sm text-foreground-500">
          Inspect individual characters in the selected body font.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <GlyphInspector
          character={selectedCharacter}
          fontName={selectedBodyFont}
          fontFamily={bodyFamily}
        />
        <GlyphGrid
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          fontFamily={bodyFamily}
        />
      </div>
    </section>
  );
}
