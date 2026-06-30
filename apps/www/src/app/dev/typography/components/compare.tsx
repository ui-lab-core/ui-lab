"use client";

import { Fragment, useEffect, useState } from "react";
import { Button, Divider, Expand } from "ui-lab-components";
import {
  getDefaultBodyFont,
  getFontConfig,
  getFontMetrics,
} from "@/features/theme/constants/font-config";
import { useTypographyPlayground } from "../context";
import { buildPreviewVars, getFontPreviewState } from "../lib/preview";
import {
  computeFontCorrections,
  type BaselineConfig,
  type FontCorrections,
} from "../lib/measure";

const karlaBodyConfig = getFontConfig("Karla", "body") ?? getDefaultBodyFont();

const karlaBaselineStyle = buildPreviewVars(
  karlaBodyConfig.family,
  karlaBodyConfig.family,
  getFontPreviewState(karlaBodyConfig),
);

const KARLA_FAMILY = karlaBodyConfig.family;
const karlaBodyMetrics = getFontMetrics(karlaBodyConfig, "body");
const KARLA_BASELINE: BaselineConfig = {
  fontSizeScale: karlaBodyMetrics.fontSizeScale,
  bodyLineHeight: karlaBodyMetrics.lineHeight,
  bodyLetterSpacingScale: karlaBodyMetrics.letterSpacingScale,
  bodyMinFontSizePx: karlaBodyMetrics.minFontSizePx,
};

type ExpandExample = {
  title: string;
  paragraphs: string[];
};

const EXPAND_EXAMPLES: ExpandExample[] = [
  {
    title: "Quick scan",
    paragraphs: [
      "Typography in dense tooling has to stay legible even when the screen is full of labels, values, and controls competing for attention.",
    ],
  },
  {
    title: "Working notes",
    paragraphs: [
      "A strong body face keeps counters open and spacing reliable so short notes do not collapse into a blur at smaller sizes.",
      "That matters most when the interface mixes small metadata, action labels, and explanatory copy in the same visual band.",
    ],
  },
  {
    title: "Comparison checklist",
    paragraphs: [
      "Headers should feel unmistakable without overpowering the surrounding text, especially when the page already carries a lot of structure.",
      "Body text needs enough contrast to support scanning, but not so much weight that it competes with the hierarchy above it.",
      "Numbers and symbols deserve a quick pass too because tables and metrics can expose spacing weaknesses faster than prose does.",
    ],
  },
  {
    title: "Long-form specimen",
    paragraphs: [
      "When the copy stretches into a longer reading sample, line length and rhythm become more important than raw size because the eye needs a stable track from one line to the next.",
      "A font that looks tidy in a heading can still feel brittle in a paragraph if its strokes taper too sharply or its spacing closes up under real content.",
      "That is why this comparison keeps the example text concrete: labels, guidance, and plain reading prose each expose a different part of the type system.",
      "By the end of the sample, the goal is not just to see whether the font looks good in isolation, but whether it stays calm, consistent, and readable across an extended block of text.",
    ],
  },
];

function ExpandExampleCard({
  title,
  paragraphs,
  isExpanded,
  onExpandedChange,
}: ExpandExample & {
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
}) {
  return (
    <Expand
      title={title}
      isExpanded={isExpanded}
      onExpandedChange={onExpandedChange}
      className="overflow-hidden rounded border border-background-700 bg-background-900"
      styles={{ contentInner: "space-y-3 px-4 py-4" }}
    >
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-foreground-200">
          {paragraph}
        </p>
      ))}
    </Expand>
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
        <Button
          onClick={() => onApply(corrections)}
        >
          Apply
        </Button>
      )}
    </div>
  );
}

function useComputedCorrections(targetFamily: string, isBaseline: boolean): FontCorrections | null {
  const [corrections, setCorrections] = useState<{
    family: string;
    value: FontCorrections;
  } | null>(null);

  useEffect(() => {
    if (isBaseline || typeof OffscreenCanvas === "undefined") return;

    const primaryFamily = (f: string) => f.split(",")[0].trim();
    let cancelled = false;

    Promise.all([
      document.fonts.load(`16px ${primaryFamily(targetFamily)}`),
      document.fonts.load(`16px ${primaryFamily(KARLA_FAMILY)}`),
    ])
      .then(() => {
        if (cancelled) return;
        setCorrections({
          family: targetFamily,
          value: computeFontCorrections(targetFamily, KARLA_FAMILY, KARLA_BASELINE),
        });
      })
      .catch(() => { });

    return () => {
      cancelled = true;
    };
  }, [targetFamily, isBaseline]);

  return corrections?.family === targetFamily ? corrections.value : null;
}

export function Compare() {
  const {
    activeTypography,
    bodyFontConfig,
    compareExpandedExamples,
    selectedBodyFont,
    setCompareExpandedExample,
    updateSelectedBodyTypography,
  } = useTypographyPlayground();

  const selectedBodyConfig = bodyFontConfig ?? karlaBodyConfig;
  const selectedBodyPreviewStyle = buildPreviewVars(
    selectedBodyConfig.family,
    selectedBodyConfig.family,
    activeTypography,
  );
  const isBaseline = selectedBodyFont === karlaBodyConfig.name;
  const corrections = useComputedCorrections(selectedBodyConfig.family, isBaseline);

  function handleApply(c: FontCorrections) {
    updateSelectedBodyTypography({
      bodyFontSizeScale: c.fontSizeScale,
      bodyLineHeight: c.bodyLineHeight,
      bodyLetterSpacingScale: c.bodyLetterSpacingScale,
      bodyMinFontSizePx: c.bodyMinFontSizePx,
    });
  }

  function getExpandedStateKey(title: string, variant: "baseline" | "target") {
    return `${variant}:${title}`;
  }

  return (
    <section className="space-y-4">
      <div>
        <div className="text-sm font-medium text-foreground-400">Compare</div>
        <p className="mt-1 text-sm text-foreground-500">
          Baseline Karla metrics versus the selected font in dedicated expand specimens.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-6">
          <div className="text-xs font-medium uppercase tracking-wider text-foreground-500">
            Baseline — Karla
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-foreground-500">
            Target — {selectedBodyFont}
          </div>

          {EXPAND_EXAMPLES.map((example, index) => (
            <Fragment key={example.title}>
              <div style={karlaBaselineStyle}>
                <ExpandExampleCard
                  title={example.title}
                  paragraphs={example.paragraphs}
                  isExpanded={compareExpandedExamples[getExpandedStateKey(example.title, "baseline")] ?? true}
                  onExpandedChange={(isExpanded) =>
                    setCompareExpandedExample(getExpandedStateKey(example.title, "baseline"), isExpanded)
                  }
                />
              </div>
              <div style={selectedBodyPreviewStyle}>
                <ExpandExampleCard
                  title={example.title}
                  paragraphs={example.paragraphs}
                  isExpanded={compareExpandedExamples[getExpandedStateKey(example.title, "target")] ?? true}
                  onExpandedChange={(isExpanded) =>
                    setCompareExpandedExample(getExpandedStateKey(example.title, "target"), isExpanded)
                  }
                />
              </div>

              {index < EXPAND_EXAMPLES.length - 1 && (
                <div className="col-span-2 py-3">
                  <Divider size="sm" variant="dashed" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {!isBaseline && (
          <div className="space-y-3">
            <Divider size="sm" variant="dashed" />
            <MetricsRow
              corrections={corrections}
              currentSizeScale={activeTypography.bodyFontSizeScale}
              currentLineHeight={activeTypography.bodyLineHeight}
              currentLsScale={activeTypography.bodyLetterSpacingScale}
              onApply={handleApply}
            />
          </div>
        )}
      </div>
    </section>
  );
}
