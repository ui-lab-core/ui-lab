"use client";

import { useState } from "react";
import { Button } from "ui-lab-components";
import { useTypographyPlayground } from "../context";
import {
  COMPARISON_METRIC_KEYS,
  COMPARISON_METRIC_LABELS,
  COMPARISON_SIZES,
  KARLA_BODY_FAMILY,
} from "../lib/constants";
import { measureRenderedFontMetrics, roundMetric, toPointSizeMetrics } from "../lib/metrics";
import type { ComparisonRow, PreviewTypographyState } from "../lib/types";

function ComparisonLabPanel({
  targetFamily,
  referenceFamily,
  targetName,
  referenceName = "Karla",
  onAlign,
}: {
  targetFamily: string;
  referenceFamily: string;
  targetName: string;
  referenceName?: string;
  onAlign: (updates: Partial<PreviewTypographyState>) => void;
}) {
  const [rows, setRows] = useState<ComparisonRow[] | null>(null);
  const [running, setRunning] = useState(false);
  const [appliedScale, setAppliedScale] = useState<number | null>(null);

  const run = async () => {
    setRunning(true);
    setRows(null);
    setAppliedScale(null);

    const sample = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    await Promise.all([
      ...COMPARISON_SIZES.map((sz) =>
        document.fonts.load(`400 ${sz}px ${targetFamily}`, sample).catch(() => { }),
      ),
      ...COMPARISON_SIZES.map((sz) =>
        document.fonts.load(`400 ${sz}px ${referenceFamily}`, sample).catch(() => { }),
      ),
    ]);
    await document.fonts.ready;

    const result = COMPARISON_SIZES.map((pointSize) => ({
      pointSize,
      target: toPointSizeMetrics(measureRenderedFontMetrics(targetFamily, pointSize, "H")),
      reference: toPointSizeMetrics(measureRenderedFontMetrics(referenceFamily, pointSize, "H")),
    }));

    setRows(result);

    const baseline = result.find((row) => row.pointSize === 18) ?? result[result.length - 1];
    if (baseline && baseline.target.capHeight > 0) {
      const scale = roundMetric(baseline.reference.capHeight / baseline.target.capHeight, 4);
      onAlign({ bodyFontSizeScale: scale, headerFontSizeScale: scale });
      setAppliedScale(scale);
    }

    setRunning(false);
  };

  const baseline18 = rows?.find((row) => row.pointSize === 18) ?? rows?.[rows.length - 1];
  const deltaPct = (target: number, reference: number) =>
    reference !== 0 ? ((target - reference) / reference) * 100 : 0;
  const fmtPct = (pct: number) => `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
  const deltaClass = (pct: number) =>
    Math.abs(pct) > 3 ? "text-warning-400" : "text-success-500";

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-foreground-400">Comparison Lab</div>
          <p className="mt-1 text-sm text-foreground-500">
            Measures {targetName} vs {referenceName} at {COMPARISON_SIZES.join("/")}px, then
            applies the derived fontSizeScale to the preview.
          </p>
        </div>
        <Button variant="outline" size="sm" onPress={run} isDisabled={running}>
          {running ? "Measuring..." : rows ? "Re-align to Karla" : "Align to Karla"}
        </Button>
      </div>

      {rows && baseline18 && (
        <div className="space-y-4">
          {appliedScale !== null && (
            <div className="grid gap-3 rounded border border-background-700 bg-background-900 p-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-foreground-500">Applied fontSizeScale</div>
                <div className="font-mono text-xl font-semibold text-foreground-100">
                  {appliedScale}
                </div>
                <div className="mt-1 text-xs text-foreground-500">
                  bodyFontSizeScale and headerFontSizeScale updated in preview
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-foreground-500">Formula</div>
                <div className="font-mono text-sm text-foreground-400">
                  {referenceName}.capHeight / {targetName}.capHeight
                </div>
                <div className="font-mono text-sm text-foreground-300">
                  {baseline18.reference.capHeight.toFixed(3)} /{" "}
                  {baseline18.target.capHeight.toFixed(3)} = {appliedScale}
                </div>
              </div>
            </div>
          )}

          <MetricComparisonTable
            baseline={baseline18}
            deltaClass={deltaClass}
            deltaPct={deltaPct}
            fmtPct={fmtPct}
            referenceName={referenceName}
            targetName={targetName}
          />
          <SizeComparisonTable
            deltaClass={deltaClass}
            deltaPct={deltaPct}
            fmtPct={fmtPct}
            referenceName={referenceName}
            rows={rows}
            targetName={targetName}
          />
        </div>
      )}
    </section>
  );
}

function MetricComparisonTable({
  baseline,
  deltaClass,
  deltaPct,
  fmtPct,
  referenceName,
  targetName,
}: {
  baseline: ComparisonRow;
  deltaClass: (pct: number) => string;
  deltaPct: (target: number, reference: number) => number;
  fmtPct: (pct: number) => string;
  referenceName: string;
  targetName: string;
}) {
  return (
    <div className="overflow-x-auto rounded border border-background-700">
      <table className="w-full text-sm">
        <thead className="bg-background-900">
          <tr className="border-b border-background-700">
            <th className="px-3 py-2.5 text-left text-xs font-medium text-foreground-500">
              Metric at 18px
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-medium text-foreground-500">
              {targetName}
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-medium text-foreground-500">
              {referenceName}
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-medium text-foreground-500">
              Delta
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_METRIC_KEYS.map((key, index) => {
            const target = baseline.target[key];
            const reference = baseline.reference[key];
            const pct = deltaPct(target, reference);

            return (
              <tr
                key={key}
                className={`border-b border-background-800 ${index % 2 !== 0 ? "bg-background-900/30" : ""}`}
              >
                <td className="px-3 py-2 text-foreground-400">
                  {COMPARISON_METRIC_LABELS[key]}
                </td>
                <td className="px-3 py-2 text-center font-mono text-foreground-200">
                  {target.toFixed(3)}
                </td>
                <td className="px-3 py-2 text-center font-mono text-foreground-500">
                  {reference.toFixed(3)}
                </td>
                <td className={`px-3 py-2 text-center font-mono ${deltaClass(pct)}`}>
                  {fmtPct(pct)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SizeComparisonTable({
  deltaClass,
  deltaPct,
  fmtPct,
  referenceName,
  rows,
  targetName,
}: {
  deltaClass: (pct: number) => string;
  deltaPct: (target: number, reference: number) => number;
  fmtPct: (pct: number) => string;
  referenceName: string;
  rows: ComparisonRow[];
  targetName: string;
}) {
  return (
    <div className="overflow-x-auto rounded border border-background-700">
      <table className="w-full text-sm">
        <thead className="bg-background-900">
          <tr className="border-b border-background-700">
            <th className="px-3 py-2.5 text-left text-xs font-medium text-foreground-500">
              Size
            </th>
            <th colSpan={3} className="border-l border-background-700 px-3 py-2.5 text-center text-xs font-medium text-foreground-500">
              Cap Height
            </th>
            <th colSpan={3} className="border-l border-background-700 px-3 py-2.5 text-center text-xs font-medium text-foreground-500">
              X-height
            </th>
          </tr>
          <tr className="border-b border-background-700 bg-background-950/50">
            <th />
            <th className="border-l border-background-700 px-2 py-1.5 text-center text-[10px] text-foreground-600">
              {targetName.slice(0, 5)}
            </th>
            <th className="px-2 py-1.5 text-center text-[10px] text-foreground-600">
              {referenceName}
            </th>
            <th className="px-2 py-1.5 text-center text-[10px] text-foreground-600">Delta%</th>
            <th className="border-l border-background-700 px-2 py-1.5 text-center text-[10px] text-foreground-600">
              {targetName.slice(0, 5)}
            </th>
            <th className="px-2 py-1.5 text-center text-[10px] text-foreground-600">
              {referenceName}
            </th>
            <th className="px-2 py-1.5 text-center text-[10px] text-foreground-600">Delta%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const capPct = deltaPct(row.target.capHeight, row.reference.capHeight);
            const xPct = deltaPct(row.target.xHeight, row.reference.xHeight);

            return (
              <tr
                key={row.pointSize}
                className={`border-b border-background-800 ${index % 2 !== 0 ? "bg-background-900/30" : ""}`}
              >
                <td className="px-3 py-2 font-mono text-foreground-400">
                  {row.pointSize}px
                </td>
                <td className="border-l border-background-800 px-2 py-2 text-center font-mono text-foreground-200">
                  {row.target.capHeight.toFixed(3)}
                </td>
                <td className="px-2 py-2 text-center font-mono text-foreground-500">
                  {row.reference.capHeight.toFixed(3)}
                </td>
                <td className={`px-2 py-2 text-center font-mono ${deltaClass(capPct)}`}>
                  {fmtPct(capPct)}
                </td>
                <td className="border-l border-background-800 px-2 py-2 text-center font-mono text-foreground-200">
                  {row.target.xHeight.toFixed(3)}
                </td>
                <td className="px-2 py-2 text-center font-mono text-foreground-500">
                  {row.reference.xHeight.toFixed(3)}
                </td>
                <td className={`px-2 py-2 text-center font-mono ${deltaClass(xPct)}`}>
                  {fmtPct(xPct)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ComparisonLab() {
  const {
    bodyFamily,
    isKarlaSelected,
    selectedBodyFont,
    updateSelectedBodyTypography,
  } = useTypographyPlayground();

  if (isKarlaSelected) return null;

  return (
    <ComparisonLabPanel
      targetName={selectedBodyFont}
      targetFamily={bodyFamily}
      referenceFamily={KARLA_BODY_FAMILY}
      onAlign={updateSelectedBodyTypography}
    />
  );
}
