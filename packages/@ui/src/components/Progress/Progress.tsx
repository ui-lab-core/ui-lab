"use client";

import * as React from "react";
import { cn, type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import css from "./Progress.module.css";

export interface ProgressStyleSlots {
  root?: StyleValue;
  labelRow?: StyleValue;
  label?: StyleValue;
  value?: StyleValue;
  track?: StyleValue;
  range?: StyleValue;
  thumb?: StyleValue;
}

export type ProgressStylesProp = StylesProp<ProgressStyleSlots>;

const resolveProgressBaseStyles = createStylesResolver([
  'root',
  'labelRow',
  'label',
  'value',
  'track',
  'range',
  'thumb',
] as const);

function resolveProgressStyles(styles: ProgressStylesProp | undefined) {
  if (!styles || typeof styles === "string" || Array.isArray(styles)) {
    return resolveProgressBaseStyles(styles);
  }
  const { root, labelRow, label, value, track, range, thumb } = styles;
  return resolveProgressBaseStyles({ root, labelRow, label, value, track, range, thumb });
}

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
    Math.max(getDecimalPrecision(effectiveStep), getDecimalPrecision(min), getDecimalPrecision(max)),
    12
  );
  return clamp(Number(snapped.toFixed(precision)), min, max);
}

function getValueFromPointer(
  clientX: number,
  track: HTMLDivElement,
  min: number,
  max: number,
  step: number
): number {
  const rect = track.getBoundingClientRect();
  if (rect.width <= 0) return min;
  const percent = clamp((clientX - rect.left) / rect.width, 0, 1);
  return snapToStep(percent * (max - min) + min, min, max, step);
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value */
  value?: number;
  /** Initial value for uncontrolled interactive usage */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value that represents 100% */
  max?: number;
  /** Step increment when dragging */
  step?: number;
  /** Called when the value changes via controls */
  onValueChange?: (value: number) => void;
  /** Visual color variant indicating progress state */
  variant?: string;
  /** Whether to show an infinite loading animation instead of a fixed value */
  indeterminate?: boolean;
  /** Accessible label describing what is progressing */
  label?: string;
  /** Whether to display the percentage value next to the label */
  showValue?: boolean;
  /** Whether to show a shimmer animation on the progress fill */
  animated?: boolean;
  /** Whether to show a draggable thumb on hover, allowing value adjustment */
  "show-controls"?: boolean;
  /** Whether the progress is disabled */
  disabled?: boolean;
  /** Classes applied to the root or named slots. Accepts a string, cn()-compatible array, slot object, or array of any of those. */
  styles?: ProgressStylesProp;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
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
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
      ...props
    },
    ref
  ) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const activeDragRef = React.useRef<number | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(
      () => defaultValue ?? controlledValue ?? min
    );
    const currentValue = isControlled ? controlledValue! : internalValue;
    const clampedValue = clamp(currentValue, min, max);
    const percentage = indeterminate ? 0 : getValuePercent(clampedValue, min, max);
    const hasLabelContent = label || showValue;

    const resolved = resolveProgressStyles(stylesProp);
    const mergedRef = useMergeRefs(ref, trackRef);

    const updateValue = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return;
        const newValue = getValueFromPointer(clientX, track, min, max, step);
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, min, max, step, onValueChange]
    );

    const handlePointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (!showControls || disabled || event.button !== 0 || event.defaultPrevented) return;
        event.preventDefault();
        activeDragRef.current = event.pointerId;
        setIsDragging(true);
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* noop */ }
        updateValue(event.clientX);
      },
      [showControls, disabled, onPointerDown, updateValue]
    );

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);
        if (!showControls || disabled || activeDragRef.current !== event.pointerId || event.defaultPrevented) return;
        event.preventDefault();
        updateValue(event.clientX);
      },
      [showControls, disabled, onPointerMove, updateValue]
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
      [onPointerUp, stopDrag]
    );

    const handlePointerCancel = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerCancel?.(event);
        stopDrag(event.pointerId);
      },
      [onPointerCancel, stopDrag]
    );

    const handleLostPointerCapture = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onLostPointerCapture?.(event);
        stopDrag(event.pointerId);
      },
      [onLostPointerCapture, stopDrag]
    );

    React.useEffect(() => {
      if (disabled && activeDragRef.current !== null) {
        stopDrag(activeDragRef.current);
      }
    }, [disabled, stopDrag]);

    return (
      <div
        className={cn("progress", css.progress, resolved.root)}
        data-has-label={hasLabelContent ? "true" : "false"}
        data-show-controls={showControls ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-dragging={isDragging ? "true" : undefined}
      >
        {hasLabelContent && (
          <div className={cn("label-row", css['label-row'], resolved.labelRow)}>
            {label && (
              <span className={cn(css.label, resolved.label)}>{label}</span>
            )}
            {showValue && !indeterminate && (
              <span className={cn(css.value, resolved.value)}>{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div
          ref={mergedRef}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : clampedValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
          aria-disabled={disabled || undefined}
          className={cn("track", css.track, className, resolved.track)}
          data-indeterminate={indeterminate ? "true" : "false"}
          data-disabled={disabled ? "true" : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handleLostPointerCapture}
          {...props}
        >
          <div
            className={cn("range", css.range, resolved.range)}
            data-variant={variant}
            data-animated={animated || indeterminate ? "true" : "false"}
            data-indeterminate={indeterminate ? "true" : "false"}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
          {showControls && !indeterminate && (
            <div
              className={cn("thumb", css.thumb, resolved.thumb)}
              style={{ left: `${percentage}%` }}
              data-disabled={disabled ? "true" : undefined}
            />
          )}
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
