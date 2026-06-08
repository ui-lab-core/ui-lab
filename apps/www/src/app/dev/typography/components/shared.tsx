"use client";

import type { CSSProperties, ReactNode } from "react";
import { Label, Slider } from "ui-lab-components";
import { roundMetric } from "../lib/metrics";

export function PreviewSurface({
  activeStyle,
  children,
  reference,
  referenceStyle,
}: {
  activeStyle: CSSProperties;
  children: ReactNode;
  reference?: ReactNode;
  referenceStyle?: CSSProperties;
}) {
  return (
    <div className="relative">
      {reference && referenceStyle ? (
        <div
          className="pointer-events-none absolute inset-0 select-none"
          style={{ ...referenceStyle, opacity: 0.2 }}
          aria-hidden
        >
          {reference}
        </div>
      ) : null}
      <div style={activeStyle}>{children}</div>
    </div>
  );
}

export function TuningSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="block space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <Label className="font-medium text-foreground-400">{label}</Label>
        <span className="rounded border border-background-700 bg-background-900 px-1.5 py-0.5 text-foreground-300 tabular-nums">
          {value.toFixed(step < 0.01 ? 3 : 2)}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        aria-label={label}
      />
    </div>
  );
}

export function MetricsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded border border-background-700 bg-background-900/40 p-4">
      <h3 className="text-sm font-semibold text-foreground-100">{title}</h3>
      {children}
    </section>
  );
}

export function MetricReadout({
  label,
  value,
  unit = "",
}: {
  label: string;
  value: number | string | undefined;
  unit?: string;
}) {
  const displayValue =
    typeof value === "number" ? `${roundMetric(value)}${unit}` : value ?? "Measuring";

  return (
    <>
      <dt className="text-foreground-500">{label}</dt>
      <dd className="text-right font-mono text-foreground-200">{displayValue}</dd>
    </>
  );
}
