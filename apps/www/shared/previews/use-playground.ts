"use client";

import { useState, type ReactNode } from "react";
import {
  findSwitcher,
  initialControlValues,
  type ControlValue,
  type ControlValues,
  type PlaygroundControl,
} from "./controls";

export type PlaygroundFactory = (
  values: Record<string, unknown>,
  onStateChange?: (updates: Record<string, unknown>) => void,
) => {
  preview: ReactNode;
  code: string;
  files?: Array<{ name: string; code: string; language?: string }>;
};

const emptyControls: PlaygroundControl[] = [];

/**
 * Holds a playground's control values and renders its factory with them. The
 * `switcher` control is split out for the bar under the preview; the rest go
 * to the form.
 */
export function usePlayground({
  controls = emptyControls,
  factory,
}: {
  controls?: readonly PlaygroundControl[];
  factory?: PlaygroundFactory;
}) {
  const [values, setValues] = useState<ControlValues>(() => initialControlValues(controls));
  const change = (name: string, value: ControlValue) => {
    setValues((current) => ({ ...current, [name]: value }));
  };
  const result = factory?.(values, (updates) => {
    setValues((current) => ({ ...current, ...(updates as ControlValues) }));
  });
  const switcher = findSwitcher(controls);
  const formControls = controls.filter((control) => control !== switcher);

  return { values, change, result, switcher, formControls };
}
