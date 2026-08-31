"use client";

import * as React from "react";

import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";

import { cn } from "@/lib/utils";
import { type SlotStyle, createStylePropsResolver } from "@/lib/styles";
import { asElementProps } from "@/lib/react-aria";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import { getThumbPosition, getThumbTrackPercent, useThumbTrack } from "@/hooks/useThumbTrack";

import css from "./Slider.module.css";

/** Direction in which the slider values increase.
 * @typeDoc SliderOrientation
 */
export type SliderOrientation = "horizontal" | "vertical";

/** Named style overrides for the Slider anatomy.
 * @typeDoc SliderStyleSlots
 */
export interface SliderStyleSlots {
  /** Styles the root slider interaction surface. */
  root?: SlotStyle;
  /** Styles the track that contains the range and thumbs. */
  track?: SlotStyle;
  /** Styles the filled portion of the track. */
  range?: SlotStyle;
  /** Styles every slider thumb. */
  thumb?: SlotStyle;
}

/** Style overrides accepted by Slider.
 * @typeDoc SliderStylesProp
 */
export type SliderStylesProp = SliderStyleSlots;

const sliderStyleSlotKeys = ["root", "track", "range", "thumb"] as const;
const resolveSliderStyles = createStylePropsResolver(sliderStyleSlotKeys);

export interface SliderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "value" | "onChange"
> {
  /** Disables pointer and keyboard interaction and removes thumbs from the tab sequence.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled
   */
  disabled?: boolean;
  /** Sets the lowest permitted thumb value.
   * @category Core
   * @default 0
   */
  min?: number;
  /** Sets the highest permitted thumb value.
   * @category Core
   * @default 100
   */
  max?: number;
  /** Snaps pointer and keyboard changes to this increment.
   * @category Core
   * @default 1
   */
  step?: number;
  /** Sets the initial value when Slider is uncontrolled.
   * @category Core
   * @default [min]
   */
  defaultValue?: number | number[];
  /** Controls one thumb with a number or multiple thumbs with an ordered number array.
   * @category Core
   */
  value?: number | number[];
  /** Called with the next thumb values after pointer or keyboard interaction changes a value. Disabled sliders do not call it.
   * @category Events
   * @see https://react-spectrum.adobe.com/react-aria/useSlider.html
   */
  onValueChange?: (value: number[]) => void;
  /** Chooses a horizontal or vertical track.
   * @category Core
   * @default "horizontal"
   * @typeDoc SliderOrientation
   */
  orientation?: SliderOrientation;
  /** Labels every thumb when no visible label is associated with the slider.
   * @category Accessibility
   * @mdn https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label
   */
  "aria-label"?: string;
  /** References visible text that labels every thumb.
   * @category Accessibility
   * @mdn https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby
   */
  "aria-labelledby"?: string;
  /** Styles the root and stable slider anatomy. Use className for conventional root classes.
   * @category Styling
   * @typeDoc SliderStyleSlots
   */
  styles?: SliderStylesProp;
}

interface SliderThumbProps {
  index: number;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  orientation: SliderOrientation;
  onValueChange: (index: number, value: number) => void;
  onThumbRef: (index: number, element: HTMLDivElement | null) => void;
  isDragging?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
  style?: React.CSSProperties;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
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

function normalizeValue(value: number | number[] | undefined): number[] | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value : [value];
}

function getValuePercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function getDecimalPrecision(value: number): number {
  if (!Number.isFinite(value)) return 0;

  const valueString = value.toString();
  const exponentMatch = valueString.match(/e-(\d+)$/);

  if (exponentMatch) {
    return Number(exponentMatch[1]);
  }

  return valueString.split(".")[1]?.length ?? 0;
}

function getClosestValueIndex(values: number[], targetValue: number): number {
  let closestIndex = 0;
  let closestDistance = Math.abs(values[0] - targetValue);

  for (let index = 1; index < values.length; index += 1) {
    const distance = Math.abs(values[index] - targetValue);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

function getThumbIndexFromTarget(target: EventTarget | null): number | undefined {
  if (!(target instanceof Element)) return undefined;

  const thumb = target.closest<HTMLElement>("[data-slider-thumb-index]");
  if (!thumb) return undefined;

  const index = Number(thumb.dataset.sliderThumbIndex);
  return Number.isInteger(index) ? index : undefined;
}

function getValueFromPointer(
  clientX: number,
  clientY: number,
  track: HTMLDivElement,
  orientation: SliderOrientation,
  min: number,
  max: number,
  step: number,
) {
  const percent = getThumbTrackPercent(clientX, clientY, track, orientation);
  if (percent === 0) return min;
  if (percent === 1) return max;
  const rawValue = percent * (max - min) + min;
  return snapToStep(rawValue, min, max, step);
}

function SliderThumb({
  index,
  value,
  min,
  max,
  step,
  disabled,
  orientation,
  onValueChange,
  onThumbRef,
  isDragging,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  style,
}: SliderThumbProps) {
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = React.useState(false);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
  const handleThumbRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      onThumbRef(index, element);
    },
    [index, onThumbRef],
  );
  const mergedRef = useMergeRefs<HTMLDivElement>(thumbRef, handleThumbRef);

  const percent = getValuePercent(value, min, max);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      let newValue = value;
      const largeStep = step * 10;
      const incrementValue = (amount: number) => snapToStep(value + amount, min, max, step);

      switch (event.key) {
        case "ArrowRight":
          newValue = orientation === "horizontal" ? incrementValue(step) : value;
          break;
        case "ArrowUp":
          newValue = incrementValue(step);
          break;
        case "ArrowLeft":
          newValue = orientation === "horizontal" ? incrementValue(-step) : value;
          break;
        case "ArrowDown":
          newValue = incrementValue(-step);
          break;
        case "PageUp":
          newValue = incrementValue(largeStep);
          break;
        case "PageDown":
          newValue = incrementValue(-largeStep);
          break;
        case "Home":
          newValue = min;
          break;
        case "End":
          newValue = max;
          break;
        default:
          return;
      }

      event.preventDefault();
      setIsPressed(true);

      if (newValue !== value) {
        onValueChange(index, newValue);
      }
    },
    [disabled, index, max, min, onValueChange, orientation, step, value],
  );

  const handleKeyUp = React.useCallback(() => {
    setIsPressed(false);
  }, []);

  const positionStyle = {
    "--position": getThumbPosition(percent),
  } as React.CSSProperties;

  return (
    <div
      ref={mergedRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-orientation={orientation}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn("thumb", css.thumb, className)}
      style={{ ...positionStyle, ...style }}
      data-slot="thumb"
      data-slider-thumb="true"
      data-slider-thumb-index={index}
      data-disabled={disabled ? "true" : undefined}
      data-focused={isFocused ? "true" : undefined}
      data-focus-visible={isFocusVisible ? "true" : undefined}
      data-hovered={isHovered ? "true" : undefined}
      data-pressed={isPressed || isDragging ? "true" : undefined}
      data-dragging={isDragging ? "true" : undefined}
      data-slider-focus-surface="true"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      {...asElementProps<"div">(mergeProps(focusProps, hoverProps))}
    />
  );
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      styles,
      disabled = false,
      style,
      defaultValue,
      value: controlledValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
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
    const rootRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const thumbRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const { travelRef, setThumbRef: measureThumb, trackStyle, travelProps, halfSize } =
      useThumbTrack(orientation);
    const activeDragRef = React.useRef<{ pointerId: number; thumbIndex: number } | null>(null);
    const [draggingThumbIndex, setDraggingThumbIndex] = React.useState<number | null>(null);

    const normalizedControlledValueKey = Array.isArray(controlledValue)
      ? controlledValue.join(",")
      : controlledValue;
    const normalizedControlledValue = React.useMemo(
      () => normalizeValue(controlledValue),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [normalizedControlledValueKey],
    );

    const [normalizedValues, setInternalValues] = useControlledState(
      normalizedControlledValue,
      undefined,
      normalizeValue(defaultValue) ?? [min],
    );
    const values = normalizedValues.length > 0 ? normalizedValues : [min];

    const mergedRef = useMergeRefs(ref, rootRef);
    const resolved = resolveSliderStyles(styles);
    const { indicatorProps } = useFocus({
      scopeRef: trackRef,
      containerRef: trackRef,
      surfaceSelector: '[data-slider-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
      dependencies: [values, orientation, disabled, halfSize],
    });

    const setThumbRef = React.useCallback((index: number, element: HTMLDivElement | null) => {
      thumbRefs.current[index] = element;
      if (index === 0) measureThumb(element);
    }, [measureThumb]);

    const handleValueChange = React.useCallback(
      (index: number, newValue: number) => {
        if (values[index] === newValue) return;

        const nextValues = [...values];
        nextValues[index] = newValue;

        setInternalValues(nextValues);

        onValueChange?.(nextValues);
      },
      [onValueChange, setInternalValues, values],
    );

    const updateValueFromPointer = React.useCallback(
      (thumbIndex: number, clientX: number, clientY: number) => {
        const track = travelRef.current;
        if (!track) return undefined;

        const newValue = getValueFromPointer(clientX, clientY, track, orientation, min, max, step);

        handleValueChange(thumbIndex, newValue);
        return newValue;
      },
      [handleValueChange, max, min, orientation, step, travelRef],
    );

    const stopPointerDrag = React.useCallback((pointerId: number, releaseCapture = true) => {
      const activeDrag = activeDragRef.current;
      if (!activeDrag || activeDrag.pointerId !== pointerId) return;

      const root = rootRef.current;
      if (releaseCapture && root?.releasePointerCapture) {
        try {
          if (!root.hasPointerCapture || root.hasPointerCapture(pointerId)) {
            root.releasePointerCapture(pointerId);
          }
        } catch {
          // Pointer capture can already be gone after browser-level cancellation.
        }
      }

      activeDragRef.current = null;
      setDraggingThumbIndex(null);
    }, []);

    const startPointerDrag = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>, requestedThumbIndex?: number) => {
        if (disabled || event.button !== 0 || event.isPrimary === false) return;

        const track = travelRef.current;
        const root = rootRef.current ?? event.currentTarget;
        if (!track || !root) return;

        const nextValue = getValueFromPointer(
          event.clientX,
          event.clientY,
          track,
          orientation,
          min,
          max,
          step,
        );
        const thumbIndex =
          requestedThumbIndex !== undefined &&
          requestedThumbIndex >= 0 &&
          requestedThumbIndex < values.length
            ? requestedThumbIndex
            : getClosestValueIndex(values, nextValue);

        event.preventDefault();

        activeDragRef.current = { pointerId: event.pointerId, thumbIndex };
        setDraggingThumbIndex(thumbIndex);

        if (root.setPointerCapture) {
          try {
            root.setPointerCapture(event.pointerId);
          } catch {
            // Some test and embedded environments expose the API without active pointer capture support.
          }
        }

        thumbRefs.current[thumbIndex]?.focus({ preventScroll: true });
        handleValueChange(thumbIndex, nextValue);
      },
      [disabled, handleValueChange, max, min, orientation, step, values, travelRef],
    );

    const handleRootPointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented) return;

        startPointerDrag(event, getThumbIndexFromTarget(event.target));
      },
      [onPointerDown, startPointerDrag],
    );

    const handleRootPointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);
        if (event.defaultPrevented || disabled) return;

        const activeDrag = activeDragRef.current;
        if (!activeDrag || activeDrag.pointerId !== event.pointerId) return;

        event.preventDefault();
        updateValueFromPointer(activeDrag.thumbIndex, event.clientX, event.clientY);
      },
      [disabled, onPointerMove, updateValueFromPointer],
    );

    const handleRootPointerEnd = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerUp?.(event);
        stopPointerDrag(event.pointerId);
      },
      [onPointerUp, stopPointerDrag],
    );

    const handleRootPointerCancel = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerCancel?.(event);
        stopPointerDrag(event.pointerId);
      },
      [onPointerCancel, stopPointerDrag],
    );

    const handleRootLostPointerCapture = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onLostPointerCapture?.(event);
        stopPointerDrag(event.pointerId, false);
      },
      [onLostPointerCapture, stopPointerDrag],
    );

    React.useEffect(() => {
      const activeDrag = activeDragRef.current;
      if (disabled && activeDrag) {
        stopPointerDrag(activeDrag.pointerId);
      }
    }, [disabled, stopPointerDrag]);

    const rangeStartPercent = values.length > 1 ? getValuePercent(values[0], min, max) : 0;
    const rangeEndPercent = getValuePercent(values[values.length - 1], min, max);
    const isRange = values.length > 1;
    const rangeStart = isRange ? getThumbPosition(rangeStartPercent, "start") : "0px";
    const rangeEnd = getThumbPosition(rangeEndPercent, "end");
    const rangeSize = `max(0px, calc(${rangeEnd} - ${rangeStart}))`;

    const rangeStyle =
      orientation === "vertical"
        ? {
            bottom: rangeStart,
            height: rangeSize,
          }
        : {
            left: rangeStart,
            width: rangeSize,
          };

    return (
      <div
        ref={mergedRef}
        data-disabled={disabled ? "true" : undefined}
        data-orientation={orientation}
        style={{ ...resolved.root.style, ...style }}
        className={cn("slider", css.slider, className, resolved.root.className)}
        data-slot="root"
        onPointerDown={handleRootPointerDown}
        onPointerMove={handleRootPointerMove}
        onPointerUp={handleRootPointerEnd}
        onPointerCancel={handleRootPointerCancel}
        onLostPointerCapture={handleRootLostPointerCapture}
        {...props}
      >
        <div
          ref={trackRef}
          className={cn("track", css.track, resolved.track.className)}
          data-slider-track="true"
          data-disabled={disabled ? "true" : undefined}
          data-orientation={orientation}
          style={{ ...trackStyle, ...resolved.track.style }}
          data-slot="track"
        >
          <div {...travelProps} />
          <div {...indicatorProps} data-focus-indicator="local" />
          <div className={css.surface}>
            <div
              className={cn("range", css.range, resolved.range.className)}
              data-slider-range="true"
              data-disabled={disabled ? "true" : undefined}
              style={{ ...rangeStyle, ...resolved.range.style }}
              data-slot="range"
            />
            {values.map((sliderValue, index) => (
              <SliderThumb
                key={index}
                index={index}
                value={sliderValue}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                orientation={orientation}
                onValueChange={handleValueChange}
                onThumbRef={setThumbRef}
                isDragging={draggingThumbIndex === index}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                className={resolved.thumb.className}
                style={resolved.thumb.style}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);

Slider.displayName = "Slider";

const SliderComponent = Object.assign(Slider, {
  Root: Slider,
});

export { SliderComponent as Slider };
