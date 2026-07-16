"use client";

import React from "react";

import { mergeProps, } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus"
import { useSwitch } from "@react-aria/switch";

import { useToggleState } from "react-stately";
import { cn, type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { resolveAccessibleLabel } from "@/lib/react-aria";
import { useControlledState } from "@/hooks/useControlledState";

import styles from "./Switch.module.css";



interface SwitchStyleSlots {
  root?: StyleValue;
  track?: StyleValue;
  thumb?: StyleValue;
}

type SwitchStylesProp = StylesProp<SwitchStyleSlots>;

const resolveSwitchBaseStyles = createStylesResolver(['root', 'track', 'thumb'] as const) as (stylesProp?: SwitchStylesProp) => SwitchStyleSlots;

export interface SwitchState {
  checked?: boolean;
}

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange" | "checked" | "defaultChecked"> {
  /** Initial checked state. For controlled usage, pass `state={{ checked }}`. */
  checked?: boolean;
  /** Controlled state. */
  state?: SwitchState;
  /** @deprecated Use `state={{ checked }}`. */
  isSelected?: boolean;
  /** Called when the switch is toggled */
  onChange?: (isSelected: boolean) => void;
  /** @deprecated Use `checked`. */
  defaultSelected?: boolean;

  /** Whether the switch is disabled */
  isDisabled?: boolean;
  /** Size of the switch */
  size?: "default" | "sm";
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: SwitchStylesProp;
}


const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({
    className,
    styles: stylesProp,
    isDisabled = false,
    checked,
    state: controlledState,
    isSelected: legacySelected,
    onChange,
    defaultSelected,
    size = "default",
    ...props
  },
    ref
  ) => {
    const [selected, setSelected] = useControlledState(
      controlledState?.checked,
      checked ?? legacySelected,
      defaultSelected ?? false,
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
      : resolveAccessibleLabel("Switch", ariaLabel, `Switch ${props.id ?? props.name ?? ""}`.trim());

    const { inputProps, isSelected } = useSwitch(
      {
        isDisabled,
        ...(resolvedAriaLabel && { "aria-label": resolvedAriaLabel }),
        ...(ariaLabelledby && { "aria-labelledby": ariaLabelledby }),
      },
      toggleState,
      inputRef
    );
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled });

    const { indicatorProps } = useFocus({
      scopeRef: rootRef,
      containerRef: rootRef,
      surfaceSelector: '[data-switch-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
    });

    React.useImperativeHandle(ref, () => inputRef.current!);

    const resolved = resolveSwitchBaseStyles(stylesProp);

    return (
      <div
        ref={rootRef}
        className={cn(
          'switch',
          styles.switch,
          size === "sm" && styles["switch-sm"],
          className,
          resolved.root
        )}
        data-switch-focus-surface="true"
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        data-hovered={isHovered || undefined}
      >
        <div {...indicatorProps} data-focus-indicator="local" />
        <div
          className={cn(
            'switch-track',
            styles["switch-track"],
            resolved.track
          )}
        />
        <div
          className={cn(
            'switch-thumb',
            styles["switch-thumb"],
            resolved.thumb
          )}
        />
        <input
          ref={inputRef}
          type="checkbox"
          className={styles.input}
          aria-checked={isSelected}
          {...mergeProps(inputProps, focusProps, hoverProps, otherProps)}
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
