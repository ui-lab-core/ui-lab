"use client";

import * as React from "react";

import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";

/**
 * Coordinates a horizontal group of typed input regions that together own one
 * composite value — date segments (month/day/year), an OTP's per-character
 * boxes, a phone number's parts.
 *
 * The hook is deliberately value-shape agnostic: it takes an ordered list of
 * region configs and hands back a per-region value string plus DOM props. It
 * knows nothing about dates, so the same coordinator drives Date.Input and an
 * OTP field. Callers own the mapping between the region values and whatever
 * composite value they represent.
 *
 * Movement is plain roving DOM focus (`element.focus()`) over a ref array,
 * matching how Date.tsx already moves focus manually, rather than a focus
 * manager from a higher-level React Aria package.
 */

/** Matches a single character allowed in a region. */
const DIGIT = /[0-9]/;

export interface RegionConfig {
  /** Stable key for this region within the group. */
  id: string;
  /** Maximum number of characters the region holds. */
  length: number;
  /** Per-character filter. Characters failing this are ignored. Defaults to digits. */
  pattern?: RegExp;
  /** Whole-region validity check, used for the `isFilled` flag and completion. */
  validate?: (value: string) => boolean;
  /**
   * Advance to the next region early, before `length` characters are typed —
   * e.g. a month region advances on "5" because no valid month starts with 5.
   * Reaching `length` always advances regardless.
   */
  shouldAdvance?: (value: string) => boolean;
  /** Normalizes the region when it loses focus, e.g. "5" -> "05". */
  format?: (value: string) => string;
  /** Placeholder shown while the region is empty. */
  placeholder?: string;
  /** Accessible name for the region. */
  label?: string;
}

export type RegionValues = Record<string, string>;

export interface UseRegionCoordinatorOptions {
  /** Ordered region configs. Order is the visual and focus order. */
  regions: RegionConfig[];
  /** Controlled region values, keyed by region id. */
  values?: RegionValues;
  /** Initial region values for uncontrolled usage. */
  defaultValues?: RegionValues;
  /** Called whenever a single region's value changes, with the full next map. */
  onRegionChange?: (id: string, value: string, values: RegionValues) => void;
  /** Called when every region is filled and valid. */
  onComplete?: (values: RegionValues) => void;
  /** Disables typing and focus movement across the whole group. */
  disabled?: boolean;
}

/** DOM props for a region's input element. */
export interface RegionDOMProps {
  value: string;
  disabled: boolean | undefined;
  inputMode: "numeric" | "text";
  autoComplete: "off";
  autoCorrect: "off";
  spellCheck: false;
  "aria-label": string | undefined;
  placeholder: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

export interface RegionCoordinator {
  regions: RegionConfig[];
  values: RegionValues;
  /** True when every region passes `isRegionFilled`. */
  isComplete: boolean;
  disabled: boolean;
  setRegionValue: (id: string, value: string) => void;
  /** Replaces every region value at once, e.g. when an external value changes. */
  setValues: (values: RegionValues) => void;
  focusRegion: (index: number, select?: boolean) => void;
  registerRegion: (index: number, node: HTMLInputElement | null) => void;
  getRegionProps: (index: number) => RegionDOMProps;
}

export interface UseRegionResult {
  config: RegionConfig;
  value: string;
  /** Whether this region currently holds DOM focus. */
  isFocused: boolean;
  /** Whether the focus ring should be shown (keyboard focus). */
  isFocusVisible: boolean;
  /** Whether this region holds a complete, valid value. */
  isFilled: boolean;
  ref: (node: HTMLInputElement | null) => void;
  /** Merge with consumer props via `mergeProps` before spreading. */
  props: RegionDOMProps;
}

/** A region counts as filled once it holds `length` characters and validates. */
export function isRegionFilled(config: RegionConfig, value: string): boolean {
  if (value.length !== config.length) return false;
  return config.validate ? config.validate(value) : true;
}

function emptyValues(regions: RegionConfig[]): RegionValues {
  const values: RegionValues = {};
  for (const region of regions) values[region.id] = "";
  return values;
}

export function useRegionCoordinator({
  regions,
  values: controlledValues,
  defaultValues,
  onRegionChange,
  onComplete,
  disabled = false,
}: UseRegionCoordinatorOptions): RegionCoordinator {
  const isControlled = controlledValues !== undefined;

  const [internalValues, setInternalValues] = React.useState<RegionValues>(() => ({
    ...emptyValues(regions),
    ...defaultValues,
  }));

  const values = React.useMemo(
    () => (isControlled ? { ...emptyValues(regions), ...controlledValues } : internalValues),
    [isControlled, controlledValues, internalValues, regions],
  );

  // Handlers read through this ref so a burst of keystrokes within one render
  // never operates on a stale value map.
  const valuesRef = React.useRef(values);
  valuesRef.current = values;

  const regionsRef = React.useRef(regions);
  regionsRef.current = regions;

  const nodesRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const registerRegion = React.useCallback((index: number, node: HTMLInputElement | null) => {
    nodesRef.current[index] = node;
  }, []);

  const focusRegion = React.useCallback((index: number, select = true) => {
    const node = nodesRef.current[index];
    if (!node) return;
    node.focus();
    if (select) node.select();
  }, []);

  const commit = React.useCallback(
    (next: RegionValues, changedId: string) => {
      valuesRef.current = next;
      if (!isControlled) setInternalValues(next);
      onRegionChange?.(changedId, next[changedId] ?? "", next);

      const allFilled = regionsRef.current.every((region) =>
        isRegionFilled(region, next[region.id] ?? ""),
      );
      if (allFilled) onComplete?.(next);
    },
    [isControlled, onRegionChange, onComplete],
  );

  const setRegionValue = React.useCallback(
    (id: string, value: string) => {
      commit({ ...valuesRef.current, [id]: value }, id);
    },
    [commit],
  );

  const setValues = React.useCallback(
    (next: RegionValues) => {
      valuesRef.current = next;
      if (!isControlled) setInternalValues(next);
    },
    [isControlled],
  );

  const getRegionProps = React.useCallback(
    (index: number): RegionDOMProps => {
      const config = regionsRef.current[index];
      const pattern = config.pattern ?? DIGIT;
      const value = valuesRef.current[config.id] ?? "";

      const advanceFrom = (nextValue: string) => {
        const isLast = index === regionsRef.current.length - 1;
        if (isLast) return;
        if (nextValue.length >= config.length || config.shouldAdvance?.(nextValue)) {
          focusRegion(index + 1);
        }
      };

      return {
        value,
        disabled: disabled || undefined,
        inputMode: pattern === DIGIT ? "numeric" : "text",
        autoComplete: "off",
        autoCorrect: "off",
        spellCheck: false,
        "aria-label": config.label,
        placeholder: config.placeholder,

        onChange: (event) => {
          if (disabled) return;
          // The element is fully controlled, so the raw value is the previous
          // value with the typed characters spliced in (or just the typed
          // character, since focusing a region selects it).
          const filtered = Array.from(event.target.value)
            .filter((char) => pattern.test(char))
            .join("")
            .slice(0, config.length);

          setRegionValue(config.id, filtered);
          advanceFrom(filtered);
        },

        onKeyDown: (event) => {
          if (disabled) return;

          switch (event.key) {
            case "Backspace": {
              event.preventDefault();
              const current = valuesRef.current[config.id] ?? "";
              if (current.length > 0) {
                setRegionValue(config.id, current.slice(0, -1));
                return;
              }
              // Empty region: step back and clear what's behind, so holding
              // backspace walks the whole group clean.
              if (index > 0) {
                const previous = regionsRef.current[index - 1];
                setRegionValue(previous.id, "");
                focusRegion(index - 1);
              }
              return;
            }
            case "Delete": {
              event.preventDefault();
              setRegionValue(config.id, "");
              return;
            }
            case "ArrowLeft": {
              event.preventDefault();
              if (index > 0) focusRegion(index - 1);
              return;
            }
            case "ArrowRight": {
              event.preventDefault();
              if (index < regionsRef.current.length - 1) focusRegion(index + 1);
              return;
            }
            case "Home": {
              event.preventDefault();
              focusRegion(0);
              return;
            }
            case "End": {
              event.preventDefault();
              focusRegion(regionsRef.current.length - 1);
              return;
            }
          }
        },

        onFocus: (event) => {
          // Selecting on focus makes the next keystroke replace the region,
          // which is what segmented fields are expected to do.
          event.currentTarget.select();
        },

        onBlur: () => {
          const current = valuesRef.current[config.id] ?? "";
          if (!config.format || current.length === 0) return;
          const formatted = config.format(current);
          if (formatted !== current) setRegionValue(config.id, formatted);
        },

        onPaste: (event) => {
          if (disabled) return;
          event.preventDefault();

          const text = event.clipboardData.getData("text");
          const next = { ...valuesRef.current };
          let cursor = 0;
          let lastId = config.id;

          // Fill forward from this region, spilling into the ones after it.
          for (let i = index; i < regionsRef.current.length && cursor < text.length; i++) {
            const target = regionsRef.current[i];
            const targetPattern = target.pattern ?? DIGIT;
            let chunk = "";

            while (cursor < text.length && chunk.length < target.length) {
              const char = text[cursor];
              cursor++;
              if (targetPattern.test(char)) chunk += char;
              else if (chunk.length > 0) break; // a separator ends this region
            }

            if (chunk.length === 0) continue;
            next[target.id] = chunk;
            lastId = target.id;
          }

          commit(next, lastId);

          const lastIndex = regionsRef.current.findIndex((region) => region.id === lastId);
          focusRegion(Math.min(lastIndex + 1, regionsRef.current.length - 1));
        },
      };
    },
    [disabled, focusRegion, setRegionValue, commit],
  );

  const isComplete = React.useMemo(
    () => regions.every((region) => isRegionFilled(region, values[region.id] ?? "")),
    [regions, values],
  );

  return React.useMemo(
    () => ({
      regions,
      values,
      isComplete,
      disabled,
      setRegionValue,
      setValues,
      focusRegion,
      registerRegion,
      getRegionProps,
    }),
    [
      regions,
      values,
      isComplete,
      disabled,
      setRegionValue,
      setValues,
      focusRegion,
      registerRegion,
      getRegionProps,
    ],
  );
}

/**
 * Per-region companion hook. Each region needs its own `useFocusRing`, which
 * can't be called in a loop, so regions render as their own component and call
 * this to get their state and props.
 */
export function useRegion(coordinator: RegionCoordinator, index: number): UseRegionResult {
  const config = coordinator.regions[index];
  const { focusProps, isFocused, isFocusVisible } = useFocusRing({ isTextInput: true });

  const { registerRegion } = coordinator;
  const ref = React.useCallback(
    (node: HTMLInputElement | null) => registerRegion(index, node),
    [registerRegion, index],
  );

  const value = coordinator.values[config.id] ?? "";
  const props = mergeProps(focusProps, coordinator.getRegionProps(index)) as RegionDOMProps;

  return {
    config,
    value,
    isFocused,
    isFocusVisible,
    isFilled: isRegionFilled(config, value),
    ref,
    props,
  };
}
