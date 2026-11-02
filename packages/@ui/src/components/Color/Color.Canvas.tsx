"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { asElementProps } from "@/lib/react-aria";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useDocumentSelectionSuppression } from "@/hooks/useDocumentSelectionSuppression";
import { hsvToRgb } from "./color-utils";
import css from "./Color.module.css";

interface ColorCanvasProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current hue value (0–360) used to tint the canvas gradient */
  hue: number;
  /** Current saturation value (0–100) determining the horizontal position of the pointer */
  saturation: number;
  /** Current brightness value (0–100) determining the vertical position of the pointer */
  brightness: number;
  /** Called when the user drags the canvas pointer with updated saturation and brightness values */
  onChange?: (saturation: number, brightness: number) => void;
  /** Disables pointer interaction on the canvas */
  disabled?: boolean;
  /** Size of the canvas */
  size?: "sm" | "md" | "lg";
  /** Additional CSS class names */
  className?: string;
  innerClassName?: string;
  pointerClassName?: string;
}

/** 2D saturation/lightness gradient canvas for picking color values */
export const ColorCanvas = React.forwardRef<HTMLDivElement, ColorCanvasProps>(
  (
    {
      hue,
      saturation,
      brightness,
      onChange,
      disabled,
      size = "md",
      className,
      innerClassName,
      pointerClassName,
      style,
      "aria-label": ariaLabel,
      "aria-valuetext": ariaValueText,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pointerAreaRef = useRef<HTMLDivElement>(null);
    const pointerRef = useRef<HTMLDivElement>(null);
    const fieldRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const mergedRef = useMergeRefs(ref, containerRef);
    const { suppressSelection, restoreSelection } = useDocumentSelectionSuppression();

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.focus();
      e.currentTarget.setPointerCapture(e.pointerId);
      suppressSelection(e.currentTarget.ownerDocument);
      setIsDragging(true);
      updateColor(e);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || disabled) return;
      updateColor(e);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      restoreSelection();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      const nextSaturation =
        event.key === "ArrowLeft"
          ? saturation - 1
          : event.key === "ArrowRight"
            ? saturation + 1
            : saturation;
      const nextBrightness =
        event.key === "ArrowDown"
          ? brightness - 1
          : event.key === "ArrowUp"
            ? brightness + 1
            : brightness;

      if (nextSaturation !== saturation || nextBrightness !== brightness) {
        event.preventDefault();
        onChange?.(
          Math.max(0, Math.min(100, nextSaturation)),
          Math.max(0, Math.min(100, nextBrightness)),
        );
      }
    };

    const updateColor = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerAreaRef.current) return;

      const rect = pointerAreaRef.current.getBoundingClientRect();
      const pointerRect = pointerRef.current?.getBoundingClientRect();
      const insetX = (pointerRect?.width ?? 0) / 2;
      const insetY = (pointerRect?.height ?? 0) / 2;
      const width = Math.max(1, rect.width - insetX * 2);
      const height = Math.max(1, rect.height - insetY * 2);
      const s = Math.max(0, Math.min(100, ((e.clientX - rect.left - insetX) / width) * 100));
      const b = Math.max(
        0,
        Math.min(100, (1 - (e.clientY - rect.top - insetY) / height) * 100),
      );

      onChange?.(s, b);
    };

    const { focusProps, isFocused, isFocusVisible } = useFocusRing();

    // Paint the field as a single raster so the rounded clip softens its edge once.
    // Stacked vector layers are clipped separately in some engines and the hue fringes through.
    useLayoutEffect(() => {
      const field = fieldRef.current;
      const context = field?.getContext("2d");
      if (!field || !context) return;

      const paint = () => {
        const scale = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.round(field.clientWidth * scale));
        const height = Math.max(1, Math.round(field.clientHeight * scale));
        if (field.width !== width) field.width = width;
        if (field.height !== height) field.height = height;

        context.fillStyle = `hsl(${hue}, 100%, 50%)`;
        context.fillRect(0, 0, width, height);
        const white = context.createLinearGradient(0, 0, width, 0);
        white.addColorStop(0, "rgba(255, 255, 255, 1)");
        white.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = white;
        context.fillRect(0, 0, width, height);
        const black = context.createLinearGradient(0, height, 0, 0);
        black.addColorStop(0, "rgba(0, 0, 0, 1)");
        black.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = black;
        context.fillRect(0, 0, width, height);
        field.parentElement?.setAttribute("data-painted", "");
      };

      paint();
      const observer = new ResizeObserver(paint);
      observer.observe(field);
      return () => observer.disconnect();
    }, [hue]);

    const { r, g, b } = hsvToRgb(hue, saturation, brightness);
    const pointerX = Math.max(0, Math.min(100, saturation));
    const pointerY = Math.max(0, Math.min(100, 100 - brightness));
    const positionStyle = {
      left: `${pointerX}%`,
      top: `${pointerY}%`,
      transform: `translate(-${pointerX}%, -${pointerY}%)`,
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
    };

    return (
      <div
        ref={mergedRef}
        {...asElementProps<"div">(
          mergeProps(props, focusProps, {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerCancel: handlePointerUp,
            onLostPointerCapture: handlePointerUp,
            onKeyDown: handleKeyDown,
          }),
        )}
        className={cn("canvas", css.canvas, className)}
        style={style}
        data-slot="canvas.root"
        data-size={size}
        data-disabled={disabled || undefined}
        data-focused={isFocused ? "true" : undefined}
        data-focus-visible={isFocusVisible || undefined}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={saturation}
        aria-label={ariaLabel ?? "Color saturation and brightness"}
        aria-valuetext={
          ariaValueText ??
          `Saturation: ${saturation.toFixed(0)}%, Brightness: ${brightness.toFixed(0)}%`
        }
      >
        <div
          className={cn("canvas-inner", css["canvas-inner"], innerClassName)}
          data-slot="canvas.inner"
          style={{ "--canvas-hue": `hsl(${hue}, 100%, 50%)` } as React.CSSProperties}
        >
          <canvas ref={fieldRef} className={css["canvas-field"]} aria-hidden="true" />
        </div>
        <div
          ref={pointerAreaRef}
          style={{
            position: "absolute",
            inset: "var(--canvas-pointer-padding, 2px)",
            pointerEvents: "none",
          }}
        >
          <div
            ref={pointerRef}
            className={cn("pointer", css["canvas-pointer"], pointerClassName)}
            data-slot="canvas.pointer"
            style={positionStyle}
          />
        </div>
      </div>
    );
  },
);

ColorCanvas.displayName = "Color.CanvasPrimitive";
