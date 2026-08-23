"use client";

import React from "react";

import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { useSwitch } from "@react-aria/switch";

import { useToggleState } from "react-stately";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { resolveAccessibleLabel } from "@/lib/react-aria";
import { useControlledState } from "@/hooks/useControlledState";
import { useDragToggle } from "@/hooks/useDragToggle";

import css from "./Switch.module.css";

/**
 * Named class-based styling targets for the Switch anatomy.
 * @typeDoc SwitchStyleSlots
 */
export interface SwitchStyleSlots {
  /** Styles the outer switch surface. */
  root?: Style;
  /** Styles the background track behind the thumb. */
  track?: Style;
  /** Styles the movable thumb. */
  thumb?: Style;
}

/**
 * Class-based style overrides accepted by Switch.
 * @typeDoc SwitchStylesProp
 */
export type SwitchStylesProp = StylesProp<SwitchStyleSlots>;

const resolveSwitchBaseStyles = createStylesResolver(["root", "track", "thumb"] as const) as (
  stylesProp?: SwitchStylesProp,
) => SwitchStyleSlots;

/**
 * Controlled state supplied to Switch.
 * @typeDoc SwitchState
 */
export interface SwitchState {
  /** Controlled checked value. */
  checked?: boolean;
}

export interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange" | "checked"
> {
  /**
   * Controlled checked value. `state.checked` takes precedence when supplied.
   * @category Core
   */
  checked?: boolean;
  /**
   * Controlled switch state. Its `checked` value takes precedence over `checked`.
   * @category Core
   * @typeDoc SwitchState
   */
  state?: SwitchState;
  /**
   * Legacy alias for `checked` when `state.checked` is absent.
   * @category Advanced
   * @deprecated Use `checked`.
   */
  isSelected?: boolean;
  /**
   * Receives the next checked value after keyboard, pointer, or drag-toggle interaction.
   * @category Events
   * @see https://react-spectrum.adobe.com/react-aria/useSwitch.html
   */
  onChange?: (isSelected: boolean) => void;
  /**
   * Legacy initial checked value used when neither controlled value is supplied.
   * @category Advanced
   * @deprecated Use `defaultChecked`.
   */
  defaultSelected?: boolean;

  /**
   * Disables interaction and native focus while applying disabled styling.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
   * @see https://react-spectrum.adobe.com/react-aria/useSwitch.html
   */
  disabled?: boolean;
  /**
   * Selects the switch geometry.
   * @category Core
   * @default "default"
   */
  size?: "default" | "sm";
  /**
   * Applies class-based overrides to the root, track, and thumb. Use `className` for conventional root classes.
   * @category Styling
   * @typeDoc SwitchStylesProp
   */
  styles?: SwitchStylesProp;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      style,
      styles: stylesProp,
      disabled = false,
      checked,
      state: controlledState,
      isSelected: legacySelected,
      onChange,
      defaultChecked,
      defaultSelected,
      size = "default",
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = useControlledState(
      controlledState?.checked,
      checked ?? legacySelected,
      defaultChecked ?? defaultSelected ?? false,
    );
    const toggleState = useToggleState({
      isSelected: selected,
      onChange: (next) => {
        setSelected(next);
        onChange?.(next);
      },
    });

    const inputRef = React.useRef<HTMLInputElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);

    // Extract aria-label from props if provided
    const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...otherProps } = props;
    const resolvedAriaLabel = ariaLabelledby
      ? undefined
      : resolveAccessibleLabel(
          "Switch",
          ariaLabel,
          `Switch ${props.id ?? props.name ?? ""}`.trim(),
        );

    const { inputProps, isSelected } = useSwitch(
      {
        isDisabled: disabled,
        ...(resolvedAriaLabel && { "aria-label": resolvedAriaLabel }),
        ...(ariaLabelledby && { "aria-labelledby": ariaLabelledby }),
      },
      toggleState,
      inputRef,
    );
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });

    const { indicatorProps } = useFocus({
      scopeRef: rootRef,
      containerRef: rootRef,
      surfaceSelector: '[data-switch-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
    });

    const resolved = resolveSwitchBaseStyles(stylesProp);
    const mergedInputRef = useMergeRefs(inputRef, ref);
    const dragToggleProps = useDragToggle("switch", rootRef, inputRef, toggleState.setSelected);

    return (
      <div
        {...dragToggleProps}
        ref={rootRef}
        className={cn(
          "switch",
          size,
          isSelected && "selected",
          disabled && "disabled",
          css.switch,
          size === "sm" && css["switch-sm"],
          className,
          resolved.root,
        )}
        style={style}
        data-slot="root"
        data-switch-focus-surface="true"
        data-selected={isSelected ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-size={size}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        data-hovered={isHovered ? "true" : undefined}
      >
        <div {...indicatorProps} data-focus-indicator="local" />
        <div
          className={cn("switch-track", css["switch-track"], resolved.track)}
          data-slot="track"
        />
        <div
          className={cn("switch-thumb", css["switch-thumb"], resolved.thumb)}
          data-slot="thumb"
        />
        <input
          ref={mergedInputRef}
          type="checkbox"
          className={css.input}
          aria-checked={isSelected}
          {...mergeProps(inputProps, focusProps, hoverProps, otherProps)}
        />
      </div>
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
