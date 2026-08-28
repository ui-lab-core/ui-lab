"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { type SlotStyle, createStylePropsResolver } from "@/lib/styles";
import css from "./Progress.module.css";

/** Named style overrides for the Progress label anatomy.
 * @typeDoc ProgressLabelStyleSlots
 */
export interface ProgressLabelStyleSlots {
  /** Styles the row that contains the visible label and percentage. */
  row?: SlotStyle;
  /** Styles the visible progress label. */
  label?: SlotStyle;
  /** Styles the displayed percentage value. */
  value?: SlotStyle;
}

/** Named style overrides for the Progress root and stable anatomy.
 * @typeDoc ProgressStyleSlots
 */
export interface ProgressStyleSlots {
  /** Styles the root progress container. */
  root?: SlotStyle;
  /** Styles the visible label anatomy. */
  label?: ProgressLabelStyleSlots;
  /** Styles the progress track. */
  track?: SlotStyle;
  /** Styles the filled progress range. */
  range?: SlotStyle;
  /** Styles the optional draggable thumb. */
  thumb?: SlotStyle;
}

/** Style overrides accepted by Progress.
 * @typeDoc ProgressStylesProp
 */
export type ProgressStylesProp = ProgressStyleSlots;

const progressStyleSlotKeys = [
  "root",
  "label.row",
  "label.label",
  "label.value",
  "track",
  "range",
  "thumb",
] as const;
const resolveProgressStyles = createStylePropsResolver(progressStyleSlotKeys);

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getValuePercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function getDecimalPrecision(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const str = value.toString();
  const exp = str.match(/e-(\d+)$/);
  if (exp) return Number(exp[1]);
  return str.split(".")[1]?.length ?? 0;
}

function snapToStep(value: number, min: number, max: number, step: number): number {
  const effectiveStep = Number.isFinite(step) && step > 0 ? step : 1;
  const snapped = Math.round((value - min) / effectiveStep) * effectiveStep + min;
  const precision = Math.min(
    Math.max(
      getDecimalPrecision(effectiveStep),
      getDecimalPrecision(min),
      getDecimalPrecision(max),
    ),
    12,
  );
  return clamp(Number(snapped.toFixed(precision)), min, max);
}

function getValueFromPointer(
  clientX: number,
  track: HTMLDivElement,
  min: number,
  max: number,
  step: number,
): number {
  const rect = track.getBoundingClientRect();
  if (rect.width <= 0) return min;
  const percent = clamp((clientX - rect.left) / rect.width, 0, 1);
  return snapToStep(percent * (max - min) + min, min, max, step);
}

export interface ProgressProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "aria-disabled" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "children" | "role"
> {
  /** Controls the current progress value.
   * @category Core
   */
  value?: number;
  /** Sets the initial value when Progress is uncontrolled.
   * @category Core
   */
  defaultValue?: number;
  /** Sets the lowest value represented by the progress bar.
   * @category Core
   * @default 0
   */
  min?: number;
  /** Sets the value represented by 100% completion.
   * @category Core
   * @default 100
   */
  max?: number;
  /** Snaps pointer-controlled values to this increment.
   * @category Core
   * @default 1
   */
  step?: number;
  /** Runs with the next value after pointer controls change progress. Disabled Progress instances do not call it.
   * @category Events
   */
  onValueChange?: (value: number) => void;
  /** Adds a conventional variant class and data attribute to the root.
   * @category Core
   * @default "default"
   */
  variant?: string;
  /** Shows an animated range when completion is unknown and omits aria-valuenow.
   * @category Core
   * @default false
   */
  indeterminate?: boolean;
  /** Displays a visible label and uses it as the default accessible name when aria-label is not supplied.
   * @category Content
   */
  label?: string;
  /** Displays the rounded completion percentage next to the label for determinate progress.
   * @category Content
   * @default false
   */
  showValue?: boolean;
  /** Animates the determinate range with a pulse.
   * @category Core
   * @default false
   */
  animated?: boolean;
  /** Enables pointer dragging and shows the thumb on hover.
   * @category Core
   * @default false
   */
  "show-controls"?: boolean;
  /** Disables pointer controls and applies disabled styling.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled
   */
  disabled?: boolean;
  /** Styles the root and stable Progress anatomy. Use className for conventional root classes.
   * @category Styling
   * @typeDoc ProgressStyleSlots
   */
  styles?: ProgressStylesProp;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      style,
      value: controlledValue,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      variant = "default",
      indeterminate = false,
      label,
      showValue = false,
      animated = false,
      "show-controls": showControls = false,
      disabled = false,
      styles: stylesProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
      ...props
    },
    ref,
  ) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const activeDragRef = React.useRef<number | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(
      () => defaultValue ?? controlledValue ?? min,
    );
    const currentValue = isControlled ? controlledValue! : internalValue;
    const clampedValue = clamp(currentValue, min, max);
    const percentage = indeterminate ? 0 : getValuePercent(clampedValue, min, max);
    const hasLabelContent = label || showValue;

    const resolved = resolveProgressStyles(stylesProp);

    const updateValue = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return;
        const newValue = getValueFromPointer(clientX, track, min, max, step);
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, min, max, step, onValueChange],
    );

    const handlePointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (!showControls || disabled || event.button !== 0 || event.defaultPrevented) return;
        event.preventDefault();
        activeDragRef.current = event.pointerId;
        setIsDragging(true);
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* noop */
        }
        updateValue(event.clientX);
      },
      [showControls, disabled, onPointerDown, updateValue],
    );

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);
        if (
          !showControls ||
          disabled ||
          activeDragRef.current !== event.pointerId ||
          event.defaultPrevented
        )
          return;
        event.preventDefault();
        updateValue(event.clientX);
      },
      [showControls, disabled, onPointerMove, updateValue],
    );

    const stopDrag = React.useCallback((pointerId: number) => {
      if (activeDragRef.current !== pointerId) return;
      activeDragRef.current = null;
      setIsDragging(false);
    }, []);

    const handlePointerUp = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerUp?.(event);
        stopDrag(event.pointerId);
      },
      [onPointerUp, stopDrag],
    );

    const handlePointerCancel = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerCancel?.(event);
        stopDrag(event.pointerId);
      },
      [onPointerCancel, stopDrag],
    );

    const handleLostPointerCapture = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onLostPointerCapture?.(event);
        stopDrag(event.pointerId);
      },
      [onLostPointerCapture, stopDrag],
    );

    React.useEffect(() => {
      if (disabled && activeDragRef.current !== null) {
        stopDrag(activeDragRef.current);
      }
    }, [disabled, stopDrag]);

    return (
      <div
        ref={ref}
        {...props}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel ?? label}
        aria-labelledby={ariaLabelledBy}
        aria-disabled={disabled || undefined}
        className={cn("progress", variant, css.progress, className, resolved.root.className)}
        style={{ ...resolved.root.style, ...style }}
        data-slot="root"
        data-variant={variant}
        data-indeterminate={indeterminate ? "true" : "false"}
        data-has-label={hasLabelContent ? "true" : "false"}
        data-show-controls={showControls ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-dragging={isDragging ? "true" : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
      >
        {hasLabelContent && (
          <div
            className={cn("label-row", css["label-row"], resolved["label.row"].className)}
            style={resolved["label.row"].style}
            data-slot="label.row"
          >
            {label && (
              <span
                className={cn("label", css.label, resolved["label.label"].className)}
                style={resolved["label.label"].style}
                data-slot="label.label"
              >
                {label}
              </span>
            )}
            {showValue && !indeterminate && (
              <span
                className={cn("value", css.value, resolved["label.value"].className)}
                style={resolved["label.value"].style}
                data-slot="label.value"
              >
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          ref={trackRef}
          className={cn("track", css.track, resolved.track.className)}
          style={resolved.track.style}
          data-slot="track"
          data-disabled={disabled ? "true" : undefined}
        >
          <div
            className={cn("range", css.range, resolved.range.className)}
            data-slot="range"
            data-animated={animated || indeterminate ? "true" : "false"}
            data-indeterminate={indeterminate ? "true" : "false"}
            style={{
              ...(indeterminate ? undefined : { width: `${percentage}%` }),
              ...resolved.range.style,
            }}
          />
          {showControls && !indeterminate && (
            <div
              className={cn("thumb", css.thumb, resolved.thumb.className)}
              style={{ left: `${percentage}%`, ...resolved.thumb.style }}
              data-slot="thumb"
              data-disabled={disabled ? "true" : undefined}
            />
          )}
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";

export { Progress };
