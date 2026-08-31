"use client";

import React, { useState, useEffect, useCallback, useRef, useReducer } from "react";
import { useControlledState } from "@/hooks/useControlledState";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Color.module.css";
import {
  rgbToHsv,
  hsvToRgb,
  formatColorHex,
  formatColorRgb,
  parseColor,
  addRecentColor,
  isValidColor,
} from "./color-utils";
import { ColorCanvas as ColorCanvasPrimitive } from "./Color.Canvas";
import { ColorRecentColors } from "./Color.RecentColors";
import { ColorInput } from "./Color.Input";
import { Popover, type PopoverProps } from "../Popover";
import { Slider } from "../Slider";

/** Class-based styles for the three layers that compose the Color.Canvas gradient.
 * @typeDoc ColorCanvasGradientStyleSlots
 */
export interface ColorCanvasGradientStyleSlots {
  /** The hue-tinted base layer. */
  hue?: Style;
  /** The horizontal white-to-transparent saturation layer. */
  saturation?: Style;
  /** The vertical transparent-to-black brightness layer. */
  brightness?: Style;
}

/** Class-based styles for Color.Canvas anatomy.
 * @typeDoc ColorCanvasStyleSlots
 */
export interface ColorCanvasStyleSlots {
  /** The focusable canvas interaction surface. */
  root?: Style;
  /** The clipped gradient container. */
  inner?: Style;
  /** Shared or layer-specific gradient styles. */
  gradient?: Style | ColorCanvasGradientStyleSlots;
  /** The current-color pointer. */
  pointer?: Style;
}

/** Class-based styles for one Color.Slider channel.
 * @typeDoc ColorSliderChannelStyleSlots
 */
export interface ColorSliderChannelStyleSlots {
  /** The slider interaction surface. */
  root?: Style;
  /** The channel gradient track. */
  track?: Style;
  /** The draggable slider thumb. */
  thumb?: Style;
}

/** Class-based styles for each supported Color.Slider channel.
 * @typeDoc ColorSliderStyleSlots
 */
export interface ColorSliderStyleSlots {
  /** Shared or keyed styles for the hue slider. */
  hue?: Style | ColorSliderChannelStyleSlots;
  /** Shared or keyed styles for the opacity slider. */
  opacity?: Style | ColorSliderChannelStyleSlots;
  /** Shared or keyed styles for the chroma slider. */
  chroma?: Style | ColorSliderChannelStyleSlots;
}

/** Class-based styles for Color.Trigger anatomy.
 * @typeDoc ColorTriggerStyleSlots
 */
export interface ColorTriggerStyleSlots {
  /** The trigger button. */
  root?: Style;
  /** The default trigger color swatch. */
  swatch?: Style;
  /** The default trigger color value. */
  value?: Style;
}

/** Class-based styles for the recent-color collection.
 * @typeDoc ColorRecentColorsStyleSlots
 */
export interface ColorRecentColorsStyleSlots {
  /** The recent-colors group. */
  root?: Style;
  /** Every recent-color button. */
  swatch?: Style;
}

/** Class-based styles for the color input controls.
 * @typeDoc ColorInputStyleSlots
 */
export interface ColorInputStyleSlots {
  /** The grouped input, format selector, and optional preview. */
  group?: Style;
  /** The editable color text field. */
  input?: Style;
  /** The color-format selector. */
  format?: Style;
  /** The optional color preview swatch. */
  previewSwatch?: Style;
}

/** Class-based styles for the Color root and compound anatomy.
 * @typeDoc ColorStyleSlots
 */
export interface ColorStyleSlots {
  /** The compound-component provider rendered when custom children are supplied. */
  provider?: Style;
  /** The Color.Area picker surface. */
  root?: Style;
  /** Shared or keyed Color.Trigger styles. */
  trigger?: Style | ColorTriggerStyleSlots;
  /** The picker controls below the canvas. */
  controls?: Style;
  /** Shared or keyed Color.Canvas styles. */
  canvas?: Style | ColorCanvasStyleSlots;
  /** Channel-specific Color.Slider styles. */
  slider?: ColorSliderStyleSlots;
  /** Shared or keyed recent-color styles. */
  recentColors?: Style | ColorRecentColorsStyleSlots;
  /** Color input and preview styles. */
  input?: ColorInputStyleSlots;
}

/** Keyed class names for Color anatomy.
 * @typeDoc ColorStylesProp
 */
export type ColorStylesProp = StylesProp<ColorStyleSlots>;

const colorStyleSlotKeys = [
  "provider",
  "root",
  "trigger.root",
  "trigger.swatch",
  "trigger.value",
  "controls",
  "canvas.root",
  "canvas.inner",
  "canvas.gradient.hue",
  "canvas.gradient.saturation",
  "canvas.gradient.brightness",
  "canvas.pointer",
  "slider.hue.root",
  "slider.hue.track",
  "slider.hue.thumb",
  "slider.opacity.root",
  "slider.opacity.track",
  "slider.opacity.thumb",
  "slider.chroma.root",
  "slider.chroma.track",
  "slider.chroma.thumb",
  "recentColors.root",
  "recentColors.swatch",
  "input.group",
  "input.input",
  "input.format",
  "input.previewSwatch",
] as const;

const resolveColorBaseStyles = createStylesResolver([
  ...colorStyleSlotKeys,
]);

function isSharedStyle(value: unknown): value is Style {
  return typeof value === "string" || Array.isArray(value);
}

function normalizeNestedStyle(value: unknown, keys: readonly string[]): unknown {
  if (!isSharedStyle(value)) return value;
  return Object.fromEntries(keys.map((key) => [key, value]));
}

function resolveColorStyles(styles: ColorStylesProp | undefined) {
  if (!styles) return resolveColorBaseStyles(styles);

  const canvas = normalizeNestedStyle(styles.canvas, ["root", "inner", "gradient", "pointer"]);
  const normalizedCanvas = isSharedStyle(canvas)
    ? canvas
    : canvas && typeof canvas === "object"
      ? {
          ...canvas,
          gradient: normalizeNestedStyle((canvas as ColorCanvasStyleSlots).gradient, [
            "hue",
            "saturation",
            "brightness",
          ]),
        }
      : canvas;
  const normalizeChannel = (value: unknown) => normalizeNestedStyle(value, ["root", "track", "thumb"]);

  return resolveColorBaseStyles({
    ...styles,
    trigger: normalizeNestedStyle(styles.trigger, ["root", "swatch", "value"]),
    canvas: normalizedCanvas,
    slider: styles.slider
      ? {
          hue: normalizeChannel(styles.slider.hue),
          opacity: normalizeChannel(styles.slider.opacity),
          chroma: normalizeChannel(styles.slider.chroma),
        }
      : undefined,
    recentColors: normalizeNestedStyle(styles.recentColors, ["root", "swatch"]),
  });
}

type CanvasState = { s: number; v: number; h: number; hg: number };
type CanvasAction =
  | { type: "SET_FROM_COLOR"; h: number; s: number; v: number }
  | { type: "SET_CANVAS"; s: number; v: number }
  | { type: "SET_HUE"; h: number; updateHg: boolean };

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "SET_FROM_COLOR":
      if (action.s > 0) return { s: action.s, v: action.v, h: action.h, hg: action.h };
      return { ...state, s: action.s, v: action.v };
    case "SET_CANVAS":
      return { ...state, s: action.s, v: action.v };
    case "SET_HUE":
      return { ...state, h: action.h, hg: action.updateHg ? action.h : state.hg };
    default:
      return state;
  }
}

/** Supported serialized color formats.
 * @typeDoc ColorFormat
 */
export type ColorFormat = "hex" | "rgb";

/** Named Color sizing presets.
 * @typeDoc ColorSize
 */
export type ColorSize = "sm" | "md" | "lg";

/** Visual treatments for the picker area.
 * @typeDoc ColorAreaVariant
 */
export type ColorAreaVariant = "standalone" | "popover";

/** Channels supported by Color.Slider.
 * @typeDoc ColorSliderType
 */
export type ColorSliderType = "hue" | "opacity" | "chroma";

/** Popover placement accepted by Color.Trigger.
 * @typeDoc ColorTriggerPosition
 */
export type ColorTriggerPosition = PopoverProps["position"];

/** Popover anatomy styles forwarded by Color.Trigger.
 * @typeDoc ColorPopoverStyles
 */
export type ColorPopoverStyles = PopoverProps["styles"];

/** Controlled Color value state.
 * @typeDoc ColorState
 */
export interface ColorState {
  /** The controlled serialized color value. */
  value?: string;
}

/** Props for the Color value provider and default picker surface. */
export interface ColorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Supplies controlled state; state.value takes precedence over value.
   * @category Core
   * @typeDoc ColorState
   */
  state?: ColorState;
  /** Controls the serialized color when state.value is not supplied.
   * @category Core
   */
  value?: string;
  /** Sets the initial serialized color for uncontrolled usage.
   * @category Core
   * @default "#000000"
   */
  defaultValue?: string;
  /** Called whenever canvas, slider, input, or recent-color interaction changes the color.
   * @category Events
   */
  onChange?: (color: string) => void;
  /** Called after a valid text or recent-color selection is committed.
   * @category Events
   */
  onChangeComplete?: (color: string) => void;
  /** Renders the opacity slider in the default Color.Area.
   * @category Content
   * @default false
   */
  showOpacity?: boolean;
  /** Renders the preview swatch beside the color input.
   * @category Content
   * @default false
   */
  showPreview?: boolean;
  /** Sets the initial displayed color format. The format selector can change it locally.
   * @category Core
   * @default "hex"
   * @typeDoc ColorFormat
   */
  format?: ColorFormat;
  /** Disables picker interaction and publishes disabled styling hooks.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /** Selects a named size for the picker and compound controls.
   * @category Core
   * @default "md"
   * @typeDoc ColorSize
   */
  size?: ColorSize;
  /** Applies class-based styles to the root and stable Color anatomy.
   * @category Styling
   * @typeDoc ColorStylesProp
   */
  styles?: ColorStylesProp;
}

type ResolvedColorStyles = ReturnType<typeof resolveColorStyles>;

interface ColorContextValue {
  value: string;
  displayValue: string;
  baseColor: string;
  previewColor: string;
  format: "hex" | "rgb";
  size: "sm" | "md" | "lg";
  disabled: boolean;
  showOpacity: boolean;
  showPreview: boolean;
  hue: number;
  canvasSaturation: number;
  canvasBrightness: number;
  opacity: number;
  resolved: ResolvedColorStyles;
  handleRecentColorSelect: (color: string) => void;
  handleCanvasChange: (saturation: number, brightness: number) => void;
  handleHueChange: (hue: number) => void;
  handleOpacityChange: (opacity: number) => void;
  handleInputChange: (value: string) => void;
  handleFormatChange: (format: "hex" | "rgb") => void;
}

const ColorContext = React.createContext<ColorContextValue | null>(null);

function useColorContext() {
  const context = React.useContext(ColorContext);
  if (!context) {
    throw new Error("Color compound components must be used within Color");
  }

  return context;
}

function useOptionalColorContext() {
  return React.useContext(ColorContext);
}

/** Provides color state and renders the default picker or custom compound children. */
const ColorRoot = React.forwardRef<HTMLDivElement, ColorProps>(
  (
    {
      value: controlledValue,
      state: controlledState,
      defaultValue = "#000000",
      onChange,
      onChangeComplete,
      showOpacity = false,
      showPreview = false,
      format: controlledFormat = "hex",
      disabled = false,
      size = "md",
      className,
      styles: stylesProp,
      children,
      ...props
    },
    ref,
  ) => {
    const [currentValue, setUncontrolledValue] = useControlledState(
      controlledState?.value,
      controlledValue,
      defaultValue,
    );

    const [format, setFormat] = useState<"hex" | "rgb">(controlledFormat);
    const [isDragging, setIsDragging] = useState(false);

    // Initialize state using HSV for better canvas mapping
    const initializeState = () => {
      const parsed = parseColor(currentValue);
      const { h, s, v } = rgbToHsv(parsed.r, parsed.g, parsed.b);
      return { h, s, v };
    };

    const [initialState] = useState(initializeState);

    // Source of truth for canvas position (HSV Saturation & Value) and hue
    const [canvasState, dispatchCanvas] = useReducer(canvasReducer, {
      s: initialState.s,
      v: initialState.v,
      h: initialState.h,
      hg: initialState.h,
    });
    const { s: canvasSaturation, v: canvasBrightness, h: hue, hg: hueWhenGrayscale } = canvasState;

    // Track the last emitted color to distinguish external updates from internal ones
    const lastEmittedColor = useRef(currentValue);

    const parsed = parseColor(currentValue);
    const opacity = parsed.a ?? 1;

    // Sync with external updates
    useEffect(() => {
      if (currentValue !== lastEmittedColor.current) {
        const parsed = parseColor(currentValue);
        const { h, s, v } = rgbToHsv(parsed.r, parsed.g, parsed.b);

        dispatchCanvas({ type: "SET_FROM_COLOR", h, s, v });

        lastEmittedColor.current = currentValue;
      }
    }, [currentValue]);

    // Compute display color from current state (HSV -> RGB)
    const {
      r: displayR,
      g: displayG,
      b: displayB,
    } = hsvToRgb(hue, canvasSaturation, canvasBrightness);

    const displayValue =
      format === "hex"
        ? formatColorHex(displayR, displayG, displayB, opacity < 1 ? opacity : undefined)
        : formatColorRgb(displayR, displayG, displayB, opacity < 1 ? opacity : undefined);

    const handleColorChange = useCallback(
      (newColor: string) => {
        setUncontrolledValue(newColor);
        onChange?.(newColor);
      },
      [onChange, setUncontrolledValue],
    );

    const handleChangeComplete = useCallback(
      (newColor: string) => {
        addRecentColor(newColor);
        onChangeComplete?.(newColor);
      },
      [onChangeComplete],
    );

    const handleCanvasChange = useCallback(
      (saturation: number, brightness: number) => {
        setIsDragging(true);
        dispatchCanvas({ type: "SET_CANVAS", s: saturation, v: brightness });

        const { r, g, b } = hsvToRgb(hue, saturation, brightness);
        const newColor =
          format === "hex"
            ? formatColorHex(r, g, b, opacity < 1 ? opacity : undefined)
            : formatColorRgb(r, g, b, opacity < 1 ? opacity : undefined);

        lastEmittedColor.current = newColor;
        handleColorChange(newColor);
      },
      [hue, opacity, format, handleColorChange],
    );

    const handleHueChange = useCallback(
      (newHue: number) => {
        setIsDragging(true);
        dispatchCanvas({ type: "SET_HUE", h: newHue, updateHg: canvasSaturation > 0 });

        const { r, g, b } = hsvToRgb(newHue, canvasSaturation, canvasBrightness);
        const newColor =
          format === "hex"
            ? formatColorHex(r, g, b, opacity < 1 ? opacity : undefined)
            : formatColorRgb(r, g, b, opacity < 1 ? opacity : undefined);

        lastEmittedColor.current = newColor;
        handleColorChange(newColor);
      },
      [canvasSaturation, canvasBrightness, opacity, format, handleColorChange],
    );

    const handleOpacityChange = useCallback(
      (newOpacity: number) => {
        setIsDragging(true);
        const { r, g, b } = hsvToRgb(hue, canvasSaturation, canvasBrightness);
        const newColor =
          format === "hex"
            ? formatColorHex(r, g, b, newOpacity < 1 ? newOpacity : undefined)
            : formatColorRgb(r, g, b, newOpacity < 1 ? newOpacity : undefined);

        lastEmittedColor.current = newColor;
        handleColorChange(newColor);
      },
      [hue, canvasSaturation, canvasBrightness, format, handleColorChange],
    );

    const handleRecentColorSelect = useCallback(
      (color: string) => {
        // Update internal state immediately
        const parsed = parseColor(color);
        const { h, s, v } = rgbToHsv(parsed.r, parsed.g, parsed.b);
        dispatchCanvas({ type: "SET_FROM_COLOR", h, s, v });

        lastEmittedColor.current = color;
        handleColorChange(color);
        handleChangeComplete(color);
      },
      [handleColorChange, handleChangeComplete],
    );

    const handleInputChange = useCallback(
      (newValue: string) => {
        if (isValidColor(newValue)) {
          // Update internal state immediately
          const parsed = parseColor(newValue);
          const { h, s, v } = rgbToHsv(parsed.r, parsed.g, parsed.b);
          dispatchCanvas({ type: "SET_FROM_COLOR", h, s, v });

          lastEmittedColor.current = newValue;
          handleColorChange(newValue);
          handleChangeComplete(newValue);
        }
      },
      [handleColorChange, handleChangeComplete],
    );

    const handleFormatChange = useCallback((newFormat: "hex" | "rgb") => {
      setFormat(newFormat);
    }, []);

    const resolved = resolveColorStyles(stylesProp);
    const baseColor = formatColorRgb(displayR, displayG, displayB);
    const previewColor = formatColorRgb(
      displayR,
      displayG,
      displayB,
      opacity < 1 ? opacity : undefined,
    );
    const contextValue = React.useMemo<ColorContextValue>(
      () => ({
        value: currentValue,
        displayValue,
        baseColor,
        previewColor,
        format,
        size,
        disabled,
        showOpacity,
        showPreview,
        hue,
        canvasSaturation,
        canvasBrightness,
        opacity,
        resolved,
        handleRecentColorSelect,
        handleCanvasChange,
        handleHueChange,
        handleOpacityChange,
        handleInputChange,
        handleFormatChange,
      }),
      [
        currentValue,
        displayValue,
        baseColor,
        previewColor,
        format,
        size,
        disabled,
        showOpacity,
        showPreview,
        hue,
        canvasSaturation,
        canvasBrightness,
        opacity,
        resolved,
        handleRecentColorSelect,
        handleCanvasChange,
        handleHueChange,
        handleOpacityChange,
        handleInputChange,
        handleFormatChange,
      ],
    );

    if (children === undefined) {
      return (
        <ColorContext.Provider value={contextValue}>
          <ColorArea ref={ref} className={className} {...props} />
        </ColorContext.Provider>
      );
    }

    return (
      <ColorContext.Provider value={contextValue}>
        <div
          ref={ref}
          {...props}
          className={cn("color-provider", css["color-provider"], className, resolved.provider)}
          data-slot="provider"
          data-size={size}
          data-disabled={disabled || undefined}
        >
          {children}
        </div>
      </ColorContext.Provider>
    );
  },
);

ColorRoot.displayName = "Color";

export interface ColorAreaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Selects the picker shell treatment. Popover mode removes the standalone background and border.
   * @category Core
   * @default "standalone"
   * @typeDoc ColorAreaVariant
   */
  variant?: ColorAreaVariant;
}

export interface ColorSliderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "value" | "onChange"
> {
  /** Selects the controlled color channel and its default range, step, label, and visual treatment.
   * @category Core
   * @default "hue"
   * @typeDoc ColorSliderType
   */
  type?: ColorSliderType;
  /** Controls the slider value. Hue uses degrees; opacity and chroma use decimal units.
   * @category Core
   */
  value?: number;
  /** Sets the initial value for standalone uncontrolled usage.
   * @category Core
   */
  defaultValue?: number;
  /** Called after pointer or keyboard interaction changes the channel value.
   * @category Events
   */
  onChange?: (value: number) => void;
  /**
   * Base CSS color used to render opacity and chroma gradients. For chroma,
   * supply an OKLCH color so the track can preserve its lightness and hue.
   * @category Styling
   */
  color?: string;
  /** Overrides the channel's default minimum value.
   * @category Core
   */
  min?: number;
  /** Overrides the channel's default maximum value.
   * @category Core
   */
  max?: number;
  /**
   * Maximum chroma used only for the track preview. This does not change the
   * slider's interactive range.
   * @category Styling
   */
  previewMax?: number;
  /** Overrides the channel's default keyboard and pointer increment.
   * @category Core
   */
  step?: number;
  /** Disables pointer and keyboard interaction.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /** Selects a named slider size.
   * @category Core
   * @default "md"
   * @typeDoc ColorSize
   */
  size?: ColorSize;
  /** Adds classes to the channel track after its defaults and context styles.
   * @category Styling
   */
  trackClassName?: string;
  /** Adds classes to the channel thumb after its defaults and context styles.
   * @category Styling
   */
  thumbClassName?: string;
}

function getChromaTrackBackground(color: string, maxChroma: number): string {
  const oklchMatch = color.match(
    /^oklch\(\s*([+-]?(?:\d*\.\d+|\d+))(%?)\s+([+-]?(?:\d*\.\d+|\d+))\s+([+-]?(?:\d*\.\d+|\d+))\s*\)$/i,
  );

  if (oklchMatch) {
    const [, lightness, lightnessUnit, , hue] = oklchMatch;
    const preservedLightness = `${lightness}${lightnessUnit}`;

    return `linear-gradient(to right, oklch(${preservedLightness} 0 ${hue}), oklch(${preservedLightness} ${maxChroma} ${hue}))`;
  }

  return `linear-gradient(to right, oklch(from ${color} l 0 h), oklch(from ${color} l ${maxChroma} h))`;
}

/** Controls one hue, opacity, or chroma channel using the shared Slider behavior. */
const ColorSlider = React.forwardRef<HTMLDivElement, ColorSliderProps>(
  (
    {
      type = "hue",
      value,
      defaultValue,
      onChange,
      color,
      min,
      max,
      previewMax,
      step,
      disabled,
      size,
      className,
      trackClassName,
      thumbClassName,
      "aria-label": ariaLabel,
      style,
      ...props
    },
    ref,
  ) => {
    const context = useOptionalColorContext();
    const usesContextValue = value === undefined && context !== null;

    const resolvedValue =
      value ??
      (context
        ? type === "opacity"
          ? context.opacity
          : type === "hue"
            ? context.hue
            : undefined
        : undefined);

    const resolvedDefaultValue = defaultValue ?? (type === "opacity" ? 1 : 0);
    const resolvedDisabled = disabled ?? context?.disabled ?? false;
    const resolvedSize = size ?? context?.size ?? "md";
    const resolvedTrackColor = color ?? context?.baseColor ?? "rgb(0, 0, 0)";
    const resolvedMin = min ?? 0;
    const resolvedMax = max ?? (type === "hue" ? 360 : type === "opacity" ? 1 : 0.4);
    const resolvedPreviewMax = previewMax ?? resolvedMax;
    const resolvedStep = step ?? (type === "hue" ? 1 : type === "opacity" ? 0.01 : 0.001);
    const resolvedClassName =
      type === "opacity"
        ? context?.resolved["slider.opacity.root"]
        : type === "chroma"
          ? context?.resolved["slider.chroma.root"]
          : context?.resolved["slider.hue.root"];
    const resolvedTrackClassName =
      type === "opacity"
        ? context?.resolved["slider.opacity.track"]
        : type === "chroma"
          ? context?.resolved["slider.chroma.track"]
          : context?.resolved["slider.hue.track"];
    const resolvedThumbClassName =
      type === "opacity"
        ? context?.resolved["slider.opacity.thumb"]
        : type === "chroma"
          ? context?.resolved["slider.chroma.thumb"]
          : context?.resolved["slider.hue.thumb"];
    const contextOnChange =
      type === "opacity"
        ? context?.handleOpacityChange
        : type === "hue"
          ? context?.handleHueChange
          : undefined;

    const handleValueChange = React.useCallback(
      ([nextValue]: number[]) => {
        onChange?.(nextValue);

        if (usesContextValue) {
          contextOnChange?.(nextValue);
        }
      },
      [contextOnChange, onChange, usesContextValue],
    );

    const sliderStyle = React.useMemo(
      () => ({
        ...(style as React.CSSProperties | undefined),
        ...(type === "opacity"
          ? {
              "--color": resolvedTrackColor,
            }
          : undefined),
      }),
      [resolvedTrackColor, style, type],
    );
    const trackStyle = React.useMemo(
      () =>
        type === "chroma"
          ? { backgroundImage: getChromaTrackBackground(resolvedTrackColor, resolvedPreviewMax) }
          : undefined,
      [resolvedPreviewMax, resolvedTrackColor, type],
    );

    return (
      <Slider
        ref={ref}
        {...props}
        min={resolvedMin}
        max={resolvedMax}
        step={resolvedStep}
        aria-label={
          ariaLabel ?? (type === "opacity" ? "Opacity" : type === "chroma" ? "Chroma" : "Hue")
        }
        value={resolvedValue}
        defaultValue={resolvedValue === undefined ? resolvedDefaultValue : undefined}
        onValueChange={handleValueChange}
        disabled={resolvedDisabled}
        data-size={resolvedSize}
        data-slot={`slider.${type}.root`}
        style={sliderStyle}
        className={cn(
          type === "opacity"
            ? "opacity-slider"
            : type === "chroma"
              ? "chroma-slider"
              : "hue-slider",
          type === "opacity"
            ? css["opacity-slider"]
            : type === "chroma"
              ? css["chroma-slider"]
              : css["hue-slider"],
          className,
          resolvedClassName,
        )}
        styles={{
          track: {
            className: cn(
              type === "opacity"
                ? "opacity-track"
                : type === "chroma"
                  ? "chroma-track"
                  : "hue-track",
              type === "opacity"
                ? css["opacity-track"]
                : type === "chroma"
                  ? css["chroma-track"]
                  : css["hue-track"],
              trackClassName,
              resolvedTrackClassName,
            ),
            style: trackStyle,
          },
          range: cn(
            type === "opacity" ? "opacity-range" : type === "chroma" ? "chroma-range" : "hue-range",
            type === "opacity"
              ? css["opacity-range"]
              : type === "chroma"
                ? css["chroma-range"]
                : css["hue-range"],
          ),
          thumb: cn(
            type === "opacity" ? "opacity-thumb" : type === "chroma" ? "chroma-thumb" : "hue-thumb",
            type === "opacity"
              ? css["opacity-thumb"]
              : type === "chroma"
                ? css["chroma-thumb"]
                : css["hue-thumb"],
            thumbClassName,
            resolvedThumbClassName,
          ),
        }}
      />
    );
  },
);
ColorSlider.displayName = "Color.Slider";

export interface ColorCanvasFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  /** Controls the canvas hue in degrees and defaults to the nearest Color context value.
   * @category Core
   */
  hue?: number;
  /** Controls the horizontal saturation percentage and defaults to Color context.
   * @category Core
   */
  saturation?: number;
  /** Controls the vertical brightness percentage and defaults to Color context.
   * @category Core
   */
  brightness?: number;
  /** Called while pointer interaction changes saturation or brightness.
   * @category Events
   */
  onChange?: (saturation: number, brightness: number) => void;
  /** Disables pointer interaction and removes the canvas from the tab sequence.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /** Selects a named canvas size.
   * @category Core
   * @default "md"
   * @typeDoc ColorSize
   */
  size?: ColorSize;
}

/** Selects saturation and brightness on a two-dimensional color field. */
const ColorCanvasField = React.forwardRef<HTMLDivElement, ColorCanvasFieldProps>(
  ({ hue, saturation, brightness, onChange, disabled, size, className, ...props }, ref) => {
    const context = useOptionalColorContext();
    const usesContextValue =
      hue === undefined && saturation === undefined && brightness === undefined;

    const resolvedHue = hue ?? context?.hue ?? 0;
    const resolvedSaturation = saturation ?? context?.canvasSaturation ?? 0;
    const resolvedBrightness = brightness ?? context?.canvasBrightness ?? 0;
    const resolvedDisabled = disabled ?? context?.disabled ?? false;
    const resolvedSize = size ?? context?.size ?? "md";

    const handleChange = React.useCallback(
      (s: number, b: number) => {
        onChange?.(s, b);

        if (usesContextValue) {
          context?.handleCanvasChange(s, b);
        }
      },
      [context, onChange, usesContextValue],
    );

    return (
      <ColorCanvasPrimitive
        ref={ref}
        hue={resolvedHue}
        saturation={resolvedSaturation}
        brightness={resolvedBrightness}
        onChange={handleChange}
        disabled={resolvedDisabled}
        size={resolvedSize}
        className={cn(className, context?.resolved["canvas.root"])}
        innerClassName={context?.resolved["canvas.inner"]}
        gradientHueClassName={context?.resolved["canvas.gradient.hue"]}
        gradientSaturationClassName={context?.resolved["canvas.gradient.saturation"]}
        gradientBrightnessClassName={context?.resolved["canvas.gradient.brightness"]}
        pointerClassName={context?.resolved["canvas.pointer"]}
        {...props}
      />
    );
  },
);
ColorCanvasField.displayName = "Color.Canvas";

/** Renders the picker canvas, channel controls, recent colors, and color input. */
const ColorArea = React.forwardRef<HTMLDivElement, ColorAreaProps>(
  ({ className, variant = "standalone", ...props }, ref) => {
    const {
      displayValue,
      baseColor,
      previewColor,
      format,
      size,
      disabled,
      showOpacity,
      showPreview,
      hue,
      canvasSaturation,
      canvasBrightness,
      opacity,
      resolved,
      handleRecentColorSelect,
      handleCanvasChange,
      handleHueChange,
      handleOpacityChange,
      handleInputChange,
      handleFormatChange,
    } = useColorContext();

    return (
      <div
        ref={ref}
        {...props}
        className={cn("color", css.color, className, resolved.root)}
        data-slot="root"
        data-size={size}
        data-disabled={disabled || undefined}
        data-variant={variant !== "standalone" ? variant : undefined}
      >
        <ColorRecentColors
          onSelect={handleRecentColorSelect}
          disabled={disabled}
          size={size}
          className={resolved["recentColors.root"]}
          swatchClassName={resolved["recentColors.swatch"]}
        />

        <ColorCanvasField />

        <div className={cn("controls", css.controls, resolved.controls)} data-slot="controls">
          <ColorSlider
            type="hue"
            value={hue}
            onChange={handleHueChange}
            disabled={disabled}
            size={size}
            className={resolved["slider.hue.root"]}
            trackClassName={resolved["slider.hue.track"]}
            thumbClassName={resolved["slider.hue.thumb"]}
          />

          {showOpacity && (
            <ColorSlider
              type="opacity"
              value={opacity}
              color={baseColor}
              onChange={handleOpacityChange}
              disabled={disabled}
              size={size}
              className={resolved["slider.opacity.root"]}
              trackClassName={resolved["slider.opacity.track"]}
              thumbClassName={resolved["slider.opacity.thumb"]}
            />
          )}

          <ColorInput
            value={displayValue}
            format={format}
            onValueChange={handleInputChange}
            onFormatChange={handleFormatChange}
            disabled={disabled}
            size={size}
            showPreview={showPreview}
            groupClassName={resolved["input.group"]}
            inputClassName={resolved["input.input"]}
            formatClassName={resolved["input.format"]}
            previewClassName={resolved["input.previewSwatch"]}
            previewColor={previewColor}
          />
        </div>
      </div>
    );
  },
);
ColorArea.displayName = "Color.Area";

export interface ColorTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  /** Selects the preferred side for the picker popover.
   * @category Core
   * @default "bottom"
   * @typeDoc ColorTriggerPosition
   */
  position?: ColorTriggerPosition;
  /** Replaces the default Color.Area rendered in the popover.
   * @category Content
   */
  area?: React.ReactNode;
  /** Applies Popover slot styles; the frame slot controls the picker shell padding.
   * @category Styling
   * @typeDoc ColorPopoverStyles
   */
  popoverStyles?: ColorPopoverStyles;
  /** Renders a directional arrow on the picker popover.
   * @category Content
   * @default false
   */
  showArrow?: boolean;
}

/** Opens a popover containing Color.Area from a native button. */
const ColorTrigger = React.forwardRef<HTMLButtonElement, ColorTriggerProps>(
  (
    {
      children,
      className,
      position = "bottom",
      area,
      popoverStyles,
      showArrow = false,
      disabled: triggerDisabled,
      ...props
    },
    ref,
  ) => {
    const { disabled, displayValue, previewColor, resolved, size } = useColorContext();
    const isDisabled = disabled || triggerDisabled;

    const trigger = (
      <button
        ref={ref}
        {...props}
        type="button"
        disabled={isDisabled}
        className={cn("color-trigger", css["color-trigger"], className, resolved["trigger.root"])}
        data-slot="trigger.root"
        data-size={size}
        data-disabled={isDisabled || undefined}
      >
        {children ?? (
          <>
            <span
              className={cn(
                "color-trigger-swatch",
                css["color-trigger-swatch"],
                resolved["trigger.swatch"],
              )}
              data-slot="trigger.swatch"
              style={{ "--preview-color": previewColor } as React.CSSProperties}
              aria-hidden="true"
            />
            <span
              className={cn(
                "color-trigger-value",
                css["color-trigger-value"],
                resolved["trigger.value"],
              )}
              data-slot="trigger.value"
            >
              {displayValue}
            </span>
          </>
        )}
      </button>
    );

    if (isDisabled) {
      return trigger;
    }

    return (
      <Popover
        content={area ?? <ColorArea variant="popover" />}
        position={position}
        styles={{
          ...popoverStyles,
          frame: popoverStyles?.frame ?? "p-0",
        }}
        show-arrow={showArrow}
      >
        {trigger}
      </Popover>
    );
  },
);
ColorTrigger.displayName = "Color.Trigger";

export { ColorArea, ColorCanvasField, ColorRoot, ColorSlider, ColorTrigger };
