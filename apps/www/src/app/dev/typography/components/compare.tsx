"use client";

import { useEffect, useState } from "react";
import { Divider } from "ui-lab-components";
import { getFontConfig } from "@/features/theme/constants/font-config";
import { useTypographyPlayground } from "../context";
import { CONTEXT_PARAGRAPHS } from "../lib/constants";
import { buildPreviewVars, getFontPreviewState } from "../lib/preview";
import {
  computeFontCorrections,
  type BaselineConfig,
  type FontCorrections,
} from "../lib/measure";

const karlaBodyConfig = getFontConfig("Karla", "body");
const karlaHeaderConfig = getFontConfig("Karla", "header");

const karlaBaselineStyle = buildPreviewVars(
  karlaBodyConfig?.family ?? '"Karla Variable", system-ui, sans-serif',
  karlaHeaderConfig?.family ?? '"Karla Variable", system-ui, sans-serif',
  getFontPreviewState(karlaBodyConfig),
);

const KARLA_FAMILY = karlaBodyConfig?.family ?? '"Karla Variable", system-ui, sans-serif';
const KARLA_BASELINE: BaselineConfig = {
  fontSizeScale: karlaBodyConfig?.metrics.fontSizeScale ?? 0.92,
  bodyLineHeight: karlaBodyConfig?.metrics.bodyLineHeight ?? 1.4,
  bodyLetterSpacingScale: karlaBodyConfig?.metrics.bodyLetterSpacingScale ?? 1.35,
  bodyMinFontSizePx: karlaBodyConfig?.metrics.bodyMinFontSizePx ?? 14.35,
};

const headerStyle = { fontFamily: "var(--font-header)" };

function SectionHeading() {
  return (
    <div className="space-y-3">
      <h2 className="text-header-lg font-bold text-foreground-50" style={headerStyle}>
        Component settings and usage rhythm
      </h2>
      {CONTEXT_PARAGRAPHS.map((paragraph) => (
        <p key={paragraph} className="text-foreground-200">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function SectionCards() {
  return (
    <div className="space-y-3">
      <div className="rounded border border-background-700 bg-background-900 p-4">
        <div className="mb-3 text-sm font-medium text-foreground-400">Header / body stack</div>
        <h3 className="mb-2 text-header-md font-semibold text-foreground-50" style={headerStyle}>
          Quarterly usage report
        </h3>
        <p className="text-foreground-200">
          Net retention improved by 8.4% after the team simplified labels and grouped related
          controls into smaller repeated blocks.
        </p>
      </div>
      <div className="rounded border border-background-700 bg-background-900 p-4">
        <div className="mb-3 text-sm font-medium text-foreground-400">Numeric scan</div>
        <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-foreground-200">
          <span>Active sessions</span>
          <span className="tabular-nums">12,480</span>
          <span>Latency p95</span>
          <span className="tabular-nums">184 ms</span>
          <span>Success rate</span>
          <span className="tabular-nums">99.92%</span>
        </div>
      </div>
    </div>
  );
}

function SectionLongText() {
  return (
    <div className="space-y-3">
      <p className="text-foreground-200">
        Typographic consistency across a dense interface depends on how well the chosen typeface
        holds its weight distribution at small sizes. When labels shrink below fourteen pixels,
        strokes that seemed balanced at display scale can collapse into indistinct blobs, robbing
        the hierarchy of its intended contrast. A well-tuned body font resists this degradation by
        maintaining open apertures and generous ink traps through the full size range.
      </p>
      <p className="text-foreground-200">
        Pairing a geometric header face with a humanist body creates a productive visual tension:
        the header commands attention through precision and tight spacing, while the body invites
        sustained reading with its organic stroke variation and slightly looser rhythm. Getting the
        size ratio right between the two is often more consequential than the choice of either
        typeface individually — a half-point shift in the scale can tip the balance from
        comfortable to crowded.
      </p>
    </div>
  );
}

function MetricsRow({
  corrections,
  currentSizeScale,
  currentLineHeight,
  currentLsScale,
  onApply,
}: {
  corrections: FontCorrections | null;
  currentSizeScale: number;
  currentLineHeight: number;
  currentLsScale: number;
  onApply: (c: FontCorrections) => void;
}) {
  if (!corrections) {
    return <div className="h-5 animate-pulse rounded bg-background-800" style={{ width: 240 }} />;
  }

  const { fontSizeScale, bodyLineHeight, bodyLetterSpacingScale, paragraph } = corrections;
  const changed =
    fontSizeScale !== currentSizeScale ||
    bodyLineHeight !== currentLineHeight ||
    bodyLetterSpacingScale !== currentLsScale;

  const linesMatch = Math.abs(paragraph.baseline.lineCount - paragraph.target.lineCount) <= 1;

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex gap-5 text-foreground-400">
        <span>
          Scale <span className="tabular-nums text-foreground-200">{fontSizeScale}</span>
        </span>
        <span>
          Leading <span className="tabular-nums text-foreground-200">{bodyLineHeight}</span>
        </span>
        <span>
          LS <span className="tabular-nums text-foreground-200">{bodyLetterSpacingScale}</span>
        </span>
        <span className={linesMatch ? "text-foreground-500" : "text-foreground-300"}>
          {paragraph.baseline.lineCount}&thinsp;/&thinsp;{paragraph.target.lineCount} lines
        </span>
      </div>
      {changed && (
        <button
          onClick={() => onApply(corrections)}
          className="text-foreground-400 transition-colors hover:text-foreground-100"
        >
          Apply
        </button>
      )}
    </div>
  );
}

function useComputedCorrections(targetFamily: string, isBaseline: boolean): FontCorrections | null {
  const [corrections, setCorrections] = useState<FontCorrections | null>(null);

  useEffect(() => {
    if (isBaseline || typeof OffscreenCanvas === "undefined") return;
    setCorrections(null);

    const primaryFamily = (f: string) => f.split(",")[0].trim();

    Promise.all([
      document.fonts.load(`16px ${primaryFamily(targetFamily)}`),
      document.fonts.load(`16px ${primaryFamily(KARLA_FAMILY)}`),
    ])
      .then(() => {
        setCorrections(
          computeFontCorrections(targetFamily, KARLA_FAMILY, KARLA_BASELINE),
        );
      })
      .catch(() => { });
  }, [targetFamily, isBaseline]);

  return corrections;
}

export function Compare() {
  const {
    activeBodyPreviewStyle,
    activeTypography,
    bodyFamily,
    selectedBodyFont,
    updateSelectedBodyTypography,
  } = useTypographyPlayground();

  const isBaseline = selectedBodyFont === "Karla";
  const corrections = useComputedCorrections(bodyFamily, isBaseline);

  function handleApply(c: FontCorrections) {
    updateSelectedBodyTypography({
      bodyFontSizeScale: c.fontSizeScale,
      bodyLineHeight: c.bodyLineHeight,
      bodyLetterSpacingScale: c.bodyLetterSpacingScale,
      bodyMinFontSizePx: c.bodyMinFontSizePx,
    });
  }

  return (
    <section className="space-y-4">
      <div>
        <div className="text-sm font-medium text-foreground-400">Compare</div>
        <p className="mt-1 text-sm text-foreground-500">
          Baseline Karla metrics versus the selected font.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-6">
        <div className="text-xs font-medium uppercase tracking-wider text-foreground-500">
          Baseline — Karla
        </div>
        <div className="text-xs font-medium uppercase tracking-wider text-foreground-500">
          Target — {selectedBodyFont}
        </div>

        <div className="h-[240px] overflow-y-auto" style={karlaBaselineStyle}>
          <SectionHeading />
        </div>
        <div className="h-[240px] overflow-y-auto" style={activeBodyPreviewStyle}>
          <SectionHeading />
        </div>

        <div className="col-span-2 py-3">
          <Divider size="sm" variant="dashed" />
        </div>

        <div className="h-[350px] overflow-y-auto" style={karlaBaselineStyle}>
          <SectionCards />
        </div>
        <div className="h-[350px] overflow-y-auto" style={activeBodyPreviewStyle}>
          <SectionCards />
        </div>

        <div className="col-span-2 py-3">
          <Divider size="sm" variant="dashed" />
        </div>

        <div className="h-[300px] overflow-y-auto" style={karlaBaselineStyle}>
          <SectionLongText />
        </div>
        <div className="h-[300px] overflow-y-auto" style={activeBodyPreviewStyle}>
          <SectionLongText />
        </div>

        {!isBaseline && (
          <>
            <div className="col-span-2 py-3">
              <Divider size="sm" variant="dashed" />
            </div>
            <div className="col-span-2">
              <MetricsRow
                corrections={corrections}
                currentSizeScale={activeTypography.bodyFontSizeScale}
                currentLineHeight={activeTypography.bodyLineHeight}
                currentLsScale={activeTypography.bodyLetterSpacingScale}
                onApply={handleApply}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
