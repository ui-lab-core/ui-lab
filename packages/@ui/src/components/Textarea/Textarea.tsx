"use client";

import React, { forwardRef, type ComponentPropsWithoutRef } from "react";

import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";

import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import { Scroll } from "@/components/Scroll";
import css from "./Textarea.module.css";

/**
 * Height preset and text density applied to the field.
 * @typeDoc TextAreaSize
 */
export type TextAreaSize = "sm" | "md" | "lg";

/**
 * Axis the field can be dragged along with the custom resize handle.
 * @typeDoc TextAreaResize
 */
export type TextAreaResize = "none" | "x" | "y" | "both";

/**
 * Axis-specific styles for the drag-to-resize handle.
 * @typeDoc TextAreaResizeHandleStyles
 */
export interface TextAreaResizeHandleStyles {
  /** Styles the corner handle rendered while resize is "both". */
  both?: Style;
  /** Styles the trailing-edge handle rendered while resize is "x". */
  x?: Style;
  /** Styles the bottom-edge handle rendered while resize is "y". */
  y?: Style;
}

/**
 * Named style slots for the TextArea anatomy.
 * @typeDoc TextAreaStyleSlots
 */
export interface TextAreaStyleSlots {
  /** Styles the outer wrapper that carries the conventional textarea class. */
  root?: Style;
  /** Styles the positioned surface holding the field and the resize handle. */
  surface?: Style;
  /** Styles the bordered scroll wrapper rendered in place of the field border when maxHeight is set. */
  scroll?: Style;
  /** Styles the native textarea element. */
  field?: Style;
  /** Styles every resize handle, or one axis through resizeHandle.both, resizeHandle.x, and resizeHandle.y. */
  resizeHandle?: Style | TextAreaResizeHandleStyles;
  /** Styles the character count rendered below the field. */
  characterCount?: Style;
}

/**
 * Class-based style overrides for TextArea's root and named anatomy slots.
 * @typeDoc TextAreaStylesProp
 */
export type TextAreaStylesProp = StylesProp<TextAreaStyleSlots>;

/**
 * Controlled values accepted through the TextArea state abstraction.
 * @typeDoc TextAreaState
 */
export interface TextAreaState {
  /** Current field value. Takes precedence over the native value prop. */
  value?: string;
}

const resolveTextAreaStyles = createStylesResolver([
  "root",
  "surface",
  "scroll",
  "field",
  "resizeHandle.both",
  "resizeHandle.x",
  "resizeHandle.y",
  "characterCount",
] as const);

export interface TextAreaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "size"> {
  /**
   * Controlled state whose value takes precedence over the native value prop.
   * @category Core
   * @typeDoc TextAreaState
   */
  state?: TextAreaState;
  /**
   * Selects the minimum height and text density preset applied to the field.
   * @category Core
   * @default "md"
   * @typeDoc TextAreaSize
   */
  size?: TextAreaSize;
  /**
   * Applies error styling to the field without changing native validity. Exceeding maxCharacters applies the same styling.
   * @category Core
   * @default false
   */
  error?: boolean;
  /**
   * Selects the axis of the custom drag handle rendered over the field. Native resizing is always off; a disabled TextArea renders no handle regardless of this value.
   * @category Core
   * @default "y"
   * @typeDoc TextAreaResize
   */
  resize?: TextAreaResize;
  /**
   * Renders a live character count below the field, paired with maxCharacters when it is set.
   * @category Content
   * @default false
   */
  showCharacterCount?: boolean;
  /**
   * Limits the value length. Input beyond the limit is truncated before onChange runs, and the character count reports the overflow.
   * @category Core
   */
  maxCharacters?: number;
  /**
   * Caps the visible height with a custom scrollbar and grows the field with its content up to that cap. Accepts any CSS length.
   * @category Core
   */
  maxHeight?: string;
  /**
   * Applies class-based overrides to the root and named anatomy slots. Use className for the conventional root hook.
   * @category Styling
   * @typeDoc TextAreaStyleSlots
   */
  styles?: TextAreaStylesProp;
}

const sizeClassMap: Record<TextAreaSize, string> = {
  sm: css["size-sm"],
  md: css["size-md"],
  lg: css["size-lg"],
};

const resizeHandleClassMap: Record<Exclude<TextAreaResize, "none">, string> = {
  both: css["resize-handle-both"],
  x: css["resize-handle-x"],
  y: css["resize-handle-y"],
};

function normalizeTextAreaValue(value: TextAreaProps["value"] | TextAreaProps["defaultValue"]) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      style,
      size = "md",
      error = false,
      disabled,
      resize = "y",
      showCharacterCount = false,
      maxCharacters,
      maxHeight,
      value,
      defaultValue,
      state: controlledState,
      onChange,
      onFocus,
      onBlur,
      styles: stylesProp,
      ...props
    },
    ref,
  ) => {
    const controlledValue = controlledState?.value ?? normalizeTextAreaValue(value);
    const [currentValue, setCurrentValue] = useControlledState(
      controlledValue,
      undefined,
      normalizeTextAreaValue(defaultValue) ?? "",
    );
    const [isFocused, setIsFocused] = React.useState(false);
    const [draggedHeight, setDraggedHeight] = React.useState<number | null>(null);
    const [draggedWidth, setDraggedWidth] = React.useState<number | null>(null);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const surfaceRef = React.useRef<HTMLDivElement>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const fieldRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergeRefs(ref, fieldRef);

    const { focusProps, isFocusVisible } = useFocusRing();
    const { indicatorProps } = useFocus({
      scopeRef: rootRef,
      containerRef: rootRef,
      surfaceSelector: '[data-textarea-focus-surface="true"]',
      radiusSource: "surface",
      dependencies: [maxHeight, size],
    });

    const charCount = currentValue.length;
    const isOverLimit = maxCharacters !== undefined ? charCount > maxCharacters : false;
    const hasError = error || isOverLimit;
    const hasScrollSurface = maxHeight !== undefined;
    // A disabled field never offers the drag affordance, so every consumer of the
    // axis - padding, handle rendering, and the data attribute - reads one value.
    const resolvedResize: TextAreaResize = disabled ? "none" : resize;
    const resizeAxis = resolvedResize === "none" ? null : resolvedResize;
    const resolved = resolveTextAreaStyles(stylesProp);

    const stateAttributes = {
      "data-disabled": disabled ? "true" : undefined,
      "data-error": hasError ? "true" : undefined,
      "data-focused": isFocused ? "true" : undefined,
      "data-focus-visible": isFocusVisible ? "true" : undefined,
    } as const;

    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value;

      if (maxCharacters !== undefined && nextValue.length > maxCharacters) {
        const truncatedValue = nextValue.slice(0, maxCharacters);

        setCurrentValue(truncatedValue);

        onChange?.({
          ...event,
          target: { ...event.target, value: truncatedValue },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        return;
      }

      setCurrentValue(nextValue);

      onChange?.(event);
    };

    const handleResizeMouseDown = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!resizeAxis) return;

        event.preventDefault();

        const field = fieldRef.current;
        const surface = surfaceRef.current;
        const scroll = scrollRef.current;
        if (!field || !surface) return;

        const computed = window.getComputedStyle(field);
        const minHeight = Number.parseFloat(computed.minHeight) || 60;
        const minWidth = Number.parseFloat(computed.minWidth) || 160;
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = surface.getBoundingClientRect().width;
        const startHeight = hasScrollSurface
          ? (scroll?.getBoundingClientRect().height ?? surface.getBoundingClientRect().height)
          : surface.getBoundingClientRect().height;

        const onMouseMove = (nextEvent: MouseEvent) => {
          if (resizeAxis === "x" || resizeAxis === "both") {
            const deltaX = nextEvent.clientX - startX;
            setDraggedWidth(Math.max(minWidth, startWidth + deltaX));
          }

          if (resizeAxis === "y" || resizeAxis === "both") {
            const deltaY = nextEvent.clientY - startY;
            setDraggedHeight(Math.max(minHeight, startHeight + deltaY));
          }
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          document.body.style.userSelect = "";
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.body.style.userSelect = "none";
      },
      [hasScrollSurface, resizeAxis],
    );

    const effectiveMaxHeight = draggedHeight !== null ? `${draggedHeight}px` : maxHeight;

    const autoResize = React.useCallback(() => {
      const element = fieldRef.current;
      if (!element || !maxHeight) return;

      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }, [maxHeight]);

    React.useLayoutEffect(() => {
      autoResize();
    }, [autoResize, currentValue]);

    const surfaceStyle: React.CSSProperties = {
      ...(draggedWidth !== null ? { width: `${draggedWidth}px`, maxWidth: "100%" } : {}),
      ...(!hasScrollSurface && draggedHeight !== null ? { height: `${draggedHeight}px` } : {}),
    };

    const fieldStyle: React.CSSProperties = {
      resize: "none",
      ...(!hasScrollSurface && draggedHeight !== null ? { height: "100%" } : {}),
    };

    const field = (
      <textarea
        ref={mergedRef}
        disabled={disabled}
        data-slot="field"
        data-size={size}
        data-resize={resolvedResize}
        data-scroll={hasScrollSurface ? "true" : undefined}
        data-textarea-focus-surface={hasScrollSurface ? undefined : "true"}
        {...stateAttributes}
        className={cn("field", css.field, sizeClassMap[size], resolved.field)}
        style={fieldStyle}
        value={currentValue}
        {...mergeProps(focusProps, {
          onFocus: handleFocus,
          onBlur: handleBlur,
          onChange: handleChange,
          ...props,
        })}
      />
    );

    return (
      <div
        ref={rootRef}
        className={cn("textarea", size, css.root, className, resolved.root)}
        style={style}
        data-slot="root"
        data-size={size}
        data-resize={resolvedResize}
        data-scroll={hasScrollSurface ? "true" : undefined}
        {...stateAttributes}
      >
        <div {...indicatorProps} data-focus-indicator="local" />
        <div
          ref={surfaceRef}
          className={cn("surface", css.surface, resolved.surface)}
          data-slot="surface"
          data-resize={resolvedResize}
          {...stateAttributes}
          style={surfaceStyle}
        >
          {hasScrollSurface ? (
            <div
              ref={scrollRef}
              className={cn("scroll", css.scroll, resolved.scroll)}
              data-slot="scroll"
              data-textarea-focus-surface="true"
              {...stateAttributes}
            >
              <Scroll maxHeight={effectiveMaxHeight} style={{ height: "auto" }}>
                {field}
              </Scroll>
            </div>
          ) : (
            field
          )}
          {resizeAxis && (
            <div
              aria-hidden="true"
              data-slot={`resizeHandle.${resizeAxis}`}
              className={cn(
                "handle",
                css["resize-handle"],
                resizeHandleClassMap[resizeAxis],
                resolved[`resizeHandle.${resizeAxis}`],
              )}
              onMouseDown={handleResizeMouseDown}
            />
          )}
        </div>
        {showCharacterCount && (
          <div
            className={cn("count", css["character-count"], resolved.characterCount)}
            data-slot="characterCount"
            data-over-limit={isOverLimit ? "true" : undefined}
          >
            {charCount}
            {maxCharacters !== undefined ? ` / ${maxCharacters}` : ""} characters
          </div>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
