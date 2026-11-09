"use client";

import React, { forwardRef, useId } from "react";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useDragToggle } from "@/hooks/useDragToggle";
import css from "./Checkbox.module.css";

/**
 * Class-based styling targets for Checkbox icons.
 * @typeDoc CheckboxIconStyles
 */
export interface CheckboxIconStyles {
  /** Styles the checkmark shown when the checkbox is checked. */
  checkmark?: Style;
  /** Styles the horizontal mark shown when the checkbox is indeterminate. */
  indeterminate?: Style;
}

/**
 * Named class-based styling targets for the Checkbox anatomy.
 * @typeDoc CheckboxStyleSlots
 */
export interface CheckboxStyleSlots {
  /** Styles the outer checkbox row. */
  root?: Style;
  /** Styles the control wrapper containing the input and state icon. */
  control?: Style;
  /** Styles the native checkbox input. */
  checkbox?: Style;
  /** Styles both icons or targets them independently with CheckboxIconStyles. */
  icon?: Style | CheckboxIconStyles;
  /** Styles the visible label associated with the native input. */
  label?: Style;
  /** Styles the helper or validation message below the label. */
  helperText?: Style;
}

/**
 * Class-based style overrides accepted by Checkbox.
 * @typeDoc CheckboxStylesProp
 */
export type CheckboxStylesProp = StylesProp<CheckboxStyleSlots>;

const resolveCheckboxBaseStyles = createStylesResolver([
  "root",
  "control",
  "checkbox",
  "icon.checkmark",
  "icon.indeterminate",
  "label",
  "helperText",
] as const);

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "checked" | "defaultChecked" | "onChange"
> {
  /**
   * Initial selected value. The component manages subsequent changes internally.
   * @category Core
   * @default false
   */
  selected?: boolean;
  /**
   * Receives the next selected value. Disabled and read-only checkboxes do not call it.
   * @category Events
   */
  onChange?: (selected: boolean) => void;
  /**
   * Visible label rendered next to and associated with the native input.
   * @category Content
   */
  label?: React.ReactNode;
  /**
   * Helper or validation text rendered below the label. This takes precedence over helperText.
   * @category Content
   */
  helper?: React.ReactNode;
  /**
   * Legacy alias for helper.
   * @category Advanced
   * @deprecated Use helper.
   */
  helperText?: React.ReactNode;
  /**
   * Marks the helper text and native input invalid.
   * @category Forms
   * @default false
   */
  helperTextError?: boolean;
  /**
   * Marks the checkbox invalid for styling and accessibility.
   * @category Forms
   * @default false
   */
  error?: boolean;
  /**
   * Form-library alias for error.
   * @category Advanced
   * @deprecated Use error.
   */
  isInvalid?: boolean;
  /**
   * Displays a partial-selection mark and sets aria-checked to mixed.
   * @category Core
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Receives the underlying native checkbox input. The forwarded ref targets this same element.
   * @category Advanced
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Applies class-based overrides to the root and named Checkbox anatomy slots. Use className for conventional root classes.
   * @category Styling
   * @typeDoc CheckboxStylesProp
   */
  styles?: CheckboxStylesProp;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      style,
      label,
      helper,
      helperText,
      helperTextError = false,
      error = false,
      isInvalid = false,
      id,
      disabled = false,
      selected: initialSelected = false,
      readOnly,
      onChange,
      indeterminate = false,
      inputRef: forwardedInputRef,
      styles,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const inputId = id ?? `checkbox-${generatedId}`;
    const helperId = `${inputId}-helper`;
    const resolvedHelper = helper ?? helperText;
    const [selected, setSelected] = React.useState(initialSelected);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const [isPressed, setIsPressed] = React.useState(false);
    const { scopeProps, indicatorProps } = useFocus({
      scopeRef: rootRef,
      containerRef: rootRef,
      surfaceSelector: '[data-checkbox-focus-surface="true"]',
      radiusSource: "surface",
    });

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;
      const next = e.target.checked;
      setSelected(next);
      onChange?.(next);
    };

    const inputProps = mergeProps(props, focusProps, {
      onChange: handleChange,
      onClick: (event: React.MouseEvent<HTMLInputElement>) => {
        if (readOnly) event.preventDefault();
      },
    }) as React.InputHTMLAttributes<HTMLInputElement>;

    // Tracked on the root rather than the input: label clicks and
    // drag-toggle selection resolve to a programmatic input.click() that
    // never dispatches pointerdown/pointerup on the input itself.
    const handleMouseDown = () => {
      if (!disabled) setIsPressed(true);
    };
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    const propAriaInvalid = props["aria-invalid"];
    const resolvedInvalid =
      error ||
      isInvalid ||
      helperTextError ||
      propAriaInvalid === true ||
      propAriaInvalid === "true";
    const describedBy =
      [props["aria-describedby"], resolvedHelper ? helperId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    const resolved = resolveCheckboxBaseStyles(styles);
    const mergedInputRef = useMergeRefs(inputRef, forwardedInputRef, ref);
    const dragToggleProps = useDragToggle("checkbox", rootRef, inputRef);

    return (
      <div
        {...dragToggleProps}
        ref={rootRef}
        className={cn(
          "checkbox",
          selected && "selected",
          disabled && "disabled",
          resolvedInvalid && "invalid",
          indeterminate && "indeterminate",
          scopeProps.className,
          css.checkbox,
          className,
          resolved.root,
        )}
        style={style}
        data-slot="root"
        data-disabled={disabled ? "true" : undefined}
        data-invalid={resolvedInvalid ? "true" : undefined}
        data-indeterminate={indeterminate ? "true" : undefined}
        data-selected={selected ? "true" : undefined}
        data-pressed={!disabled && isPressed ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div {...indicatorProps} data-focus-indicator="local" />
        <div className={cn("checkbox-control", css.container, resolved.control)} data-slot="control">
          <input
            {...inputProps}
            ref={mergedInputRef}
            type="checkbox"
            id={inputId}
            disabled={disabled}
            checked={selected}
            readOnly={readOnly}
            className={cn("checkbox-input", css.box, resolved.checkbox)}
            data-slot="checkbox"
            data-selected={selected ? "true" : undefined}
            data-disabled={disabled ? "true" : undefined}
            data-invalid={resolvedInvalid ? "true" : undefined}
            data-error={resolvedInvalid ? "true" : undefined}
            data-indeterminate={indeterminate ? "true" : undefined}
            data-pressed={!disabled && isPressed ? "true" : "false"}
            data-focused={isFocused ? "true" : "false"}
            data-focus-visible={isFocusVisible ? "true" : "false"}
            data-checkbox-focus-surface="true"
            aria-invalid={resolvedInvalid || undefined}
            aria-checked={indeterminate ? "mixed" : props["aria-checked"]}
            aria-describedby={describedBy}
          />
            <svg
              className={cn("checkmark", css.checkmark, resolved["icon.checkmark"])}
              data-slot="icon.checkmark"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg
              className={cn("indeterminate", css.indeterminate, resolved["icon.indeterminate"])}
              data-slot="icon.indeterminate"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn("checkbox-label", css.label, css["label-md"], resolved.label)}
            data-slot="label"
            data-disabled={disabled ? "true" : undefined}
          >
            {label}
          </label>
        )}
        {resolvedHelper && (
          <p
            id={helperId}
            className={cn("checkbox-helper-text", css["helper-text"], resolved.helperText)}
            data-slot="helperText"
            data-error={resolvedInvalid ? "true" : undefined}
          >
            {resolvedHelper}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
