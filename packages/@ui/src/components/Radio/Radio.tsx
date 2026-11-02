"use client";

import React, { useId, createContext, useContext } from "react";
import { useRadioGroupState } from "react-stately";

import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { useRadioGroup, useRadio } from "@react-aria/radio";

import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { asElementProps, resolveAccessibleLabel } from "@/lib/react-aria";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import css from "./Radio.module.css";

/**
 * Radio button size. Accepts "sm", "md", or "lg".
 * @typeDoc RadioSize
 */
export type RadioSize = "sm" | "md" | "lg";

/**
 * Named class-based styling targets for the Radio anatomy. Shared by the
 * standalone Radio and Radio.Item.
 * @typeDoc RadioStyleSlots
 */
export interface RadioStyleSlots {
  /** Styles the radio circle (data-slot="root"), the visible control surface. */
  root?: Style;
  /** Styles the outer row containing the circle, label, description, and helper text. */
  item?: Style;
  /** Styles the native radio input. */
  input?: Style;
  /** Styles the inner dot shown when selected. */
  dot?: Style;
  /** Styles the visible label associated with the native input. */
  label?: Style;
  /** Styles the secondary description below the label. */
  description?: Style;
  /** Styles the helper or validation message below the row. */
  helperText?: Style;
}

/**
 * Class-based style overrides accepted by Radio and Radio.Item.
 * @typeDoc RadioStylesProp
 */
export type RadioStylesProp = StylesProp<RadioStyleSlots>;

const resolveRadioBaseStyles = createStylesResolver([
  "root",
  "item",
  "input",
  "dot",
  "label",
  "description",
  "helperText",
] as const);

function resolveRadioStyles(styles: RadioStylesProp | undefined) {
  if (!styles) {
    return resolveRadioBaseStyles(styles);
  }

  const { root, item, input, dot, label, description, helperText } = styles;
  return resolveRadioBaseStyles({ root, item, input, dot, label, description, helperText });
}

interface RadioGroupContextType {
  state?: ReturnType<typeof useRadioGroupState>;
  disabled?: boolean;
  size?: RadioSize;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  return context;
};

/**
 * Controlled state supplied to Radio.Group.
 * @typeDoc RadioGroupState
 */
export interface RadioGroupState {
  /** Controlled selected value. Each render reflects this value until onValueChange requests a change. */
  value?: string;
}

/**
 * Named class-based styling targets for the Radio.Group anatomy.
 * @typeDoc RadioGroupStyleSlots
 */
export interface RadioGroupStyleSlots {
  /** Styles the outer group container (data-slot="root"). */
  root?: Style;
  /** Styles the group's visible label. */
  label?: Style;
  /** Styles the descriptive text below the group label. */
  description?: Style;
  /** Styles the container wrapping the group's Radio.Item children. */
  group?: Style;
}

/**
 * Class-based style overrides accepted by Radio.Group.
 * @typeDoc RadioGroupStylesProp
 */
export type RadioGroupStylesProp = StylesProp<RadioGroupStyleSlots>;

const resolveRadioGroupBaseStyles = createStylesResolver([
  "root",
  "label",
  "description",
  "group",
] as const);

function resolveRadioGroupStyles(styles: RadioGroupStylesProp | undefined) {
  if (!styles) {
    return resolveRadioGroupBaseStyles(styles);
  }

  const { root, label, description, group } = styles;
  return resolveRadioGroupBaseStyles({ root, label, description, group });
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Selected radio value. For controlled usage, pass state={{ value }} instead.
   * @category Core
   */
  value?: string;
  /**
   * Controlled group state. Its value takes precedence over the uncontrolled value/defaultValue pair.
   * @category Core
   * @typeDoc RadioGroupState
   */
  state?: RadioGroupState;
  /**
   * Initial selected value for uncontrolled usage.
   * @category Advanced
   * @deprecated Use value.
   */
  defaultValue?: string;
  /**
   * Called when the selected value changes.
   * @category Events
   */
  onValueChange?: (value: string) => void;
  /**
   * Disables every Radio.Item in the group unless a child overrides it individually.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /**
   * Size applied to every Radio.Item in the group unless a child overrides it individually.
   * @category Core
   * @default "md"
   * @typeDoc RadioSize
   */
  size?: RadioSize;
  /**
   * Radio.Item elements rendered inside the group.
   * @category Core
   */
  children: React.ReactNode;
  /**
   * Accessible label for the radio group. Rendered visibly and associated with the group via aria-labelledby.
   * @category Accessibility
   */
  label?: string;
  /**
   * Descriptive text shown below the group label and associated with the group via aria-describedby.
   * @category Content
   */
  description?: string;
  /**
   * Applies class-based overrides to the root and named Radio.Group anatomy slots. Use className for conventional root classes.
   * @category Styling
   * @typeDoc RadioGroupStylesProp
   */
  styles?: RadioGroupStylesProp;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      state: controlledState,
      defaultValue,
      onValueChange,
      disabled = false,
      size = "md",
      children,
      className,
      style,
      label,
      description,
      styles: stylesProp,
      ...props
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = useControlledState(
      controlledState?.value,
      value,
      defaultValue,
    );
    const state = useRadioGroupState({
      value: selectedValue,
      defaultValue,
      onChange: (next) => {
        setSelectedValue(next);
        onValueChange?.(next);
      },
      isDisabled: disabled,
    });

    const { radioGroupProps, labelProps, descriptionProps } = useRadioGroup(
      {
        isDisabled: disabled,
        label,
        description,
      },
      state,
    );

    const resolved = resolveRadioGroupStyles(stylesProp);

    return (
      <RadioGroupContext.Provider value={{ state, disabled, size }}>
        <div
          {...mergeProps(radioGroupProps, props)}
          ref={ref}
          className={cn("radio-group", className, resolved.root)}
          style={style}
          data-slot="root"
        >
          {label && (
            <label
              {...labelProps}
              className={cn("label", css["radio-label"], resolved.label)}
              data-slot="label"
              data-disabled={disabled ? "true" : undefined}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              {...descriptionProps}
              className={cn("description", css["radio-description"], resolved.description)}
              data-slot="description"
            >
              {description}
            </p>
          )}
          <div className={cn(css["radio-items"], resolved.group)} data-slot="group">
            {children}
          </div>
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = "Radio.Group";

// Tracked on the row rather than the hidden input: row clicks, label clicks,
// and drag-toggle selection all resolve to a programmatic input.click() that
// never dispatches pointerdown/pointerup on the input.
function useRowPressState(disabled: boolean) {
  const [isPressed, setIsPressed] = React.useState(false);
  return {
    isPressed,
    handleMouseDown: () => {
      if (!disabled) setIsPressed(true);
    },
    handleMouseUp: () => setIsPressed(false),
    handleMouseLeave: () => setIsPressed(false),
  };
}

// The hidden input only overlays the control, so a single row-level handler
// extends selection to the label, description, helper text and spacing.
// Clicks on the input or its <label htmlFor> already select natively, so we
// let those pass through to avoid a double activation.
function handleRowSelect(
  event: React.MouseEvent<HTMLDivElement>,
  disabled: boolean,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  if (disabled) return;
  if ((event.target as HTMLElement).closest("input, label")) return;
  inputRef.current?.focus();
  inputRef.current?.click();
}

type ResolvedRadioStyles = ReturnType<typeof resolveRadioBaseStyles>;

interface RadioAnatomyProps {
  isGroupItem: boolean;
  size: RadioSize;
  disabled: boolean;
  error: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  helperTextError: boolean;
  isSelected: boolean;
  radioId: string;
  resolved: ResolvedRadioStyles;
  style?: React.CSSProperties;
  circleClassName?: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  surfaceRef: React.RefObject<HTMLDivElement | null>;
  scopeClassName: string;
  indicatorProps: ReturnType<typeof useFocus>["indicatorProps"];
  isFocused: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isPressed: boolean;
  onRowClick: React.MouseEventHandler<HTMLDivElement>;
  onRowMouseDown: () => void;
  onRowMouseUp: () => void;
  onRowMouseLeave: () => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.Ref<HTMLInputElement>;
}

// Shared rendered anatomy for the standalone Radio and Radio.Item. Both
// variants only differ in how selection state and the native input's props
// are derived, so the DOM/slot contract stays identical for both.
function RadioAnatomy({
  isGroupItem,
  size,
  disabled,
  error,
  label,
  description,
  helperText,
  helperTextError,
  isSelected,
  radioId,
  resolved,
  style,
  circleClassName,
  rootRef,
  surfaceRef,
  scopeClassName,
  indicatorProps,
  isFocused,
  isFocusVisible,
  isHovered,
  isPressed,
  onRowClick,
  onRowMouseDown,
  onRowMouseUp,
  onRowMouseLeave,
  inputProps,
  inputRef,
}: RadioAnatomyProps) {
  return (
    <div
      ref={rootRef}
      className={cn(
        isGroupItem && "item",
        isGroupItem && "w-full",
        css["radio-item"],
        resolved.item,
      )}
      data-slot="item"
      data-disabled={disabled ? "true" : undefined}
      onClick={onRowClick}
      onMouseDown={onRowMouseDown}
      onMouseUp={onRowMouseUp}
      onMouseLeave={onRowMouseLeave}
    >
      <div
        ref={surfaceRef}
        className={cn("relative", css["radio-surface"], scopeClassName)}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        data-radio-focus-surface="true"
      >
        <div {...indicatorProps} data-focus-indicator="local" />
        <div
          className={cn("radio", css.radio, css[size], circleClassName, resolved.root)}
          style={style}
          data-slot="root"
          data-selected={isSelected ? "true" : "false"}
          data-disabled={disabled ? "true" : undefined}
          data-error={error ? "true" : undefined}
          data-hovered={isHovered ? "true" : "false"}
          data-pressed={!disabled && isPressed ? "true" : "false"}
          role="presentation"
        >
          <div className={cn("dot", css.dot, resolved.dot)} data-slot="dot" />
        </div>
        <input
          {...inputProps}
          ref={inputRef}
          type="radio"
          id={radioId}
          className={cn(css["radio-input"], resolved.input)}
          data-slot="input"
          suppressHydrationWarning
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <label
              htmlFor={radioId}
              className={cn("label", css["radio-label"], resolved.label)}
              data-slot="label"
              data-disabled={disabled ? "true" : undefined}
              suppressHydrationWarning
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={cn("description", css["radio-description"], resolved.description)}
              data-slot="description"
              data-error={error ? "true" : undefined}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {helperText && (
        <p
          className={cn("helper", css["helper-text"], resolved.helperText)}
          data-slot="helperText"
          data-error={helperTextError ? "true" : undefined}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export interface RadioItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Size of this radio button. Overrides the size set on the parent Radio.Group.
   * @category Core
   * @typeDoc RadioSize
   */
  size?: RadioSize;
  /**
   * Label text or element displayed next to the radio.
   * @category Content
   */
  label?: React.ReactNode;
  /**
   * Secondary description shown below the label.
   * @category Content
   */
  description?: React.ReactNode;
  /**
   * Helper text shown below the radio row.
   * @category Content
   */
  helperText?: React.ReactNode;
  /**
   * Styles the helper text and native input as invalid.
   * @category Forms
   * @default false
   */
  helperTextError?: boolean;
  /**
   * Applies error styling to the circle and description.
   * @category Forms
   * @default false
   */
  error?: boolean;
  /**
   * Value submitted when this radio is selected. Compared against Radio.Group's selected value.
   * @category Core
   */
  value: string;
  /**
   * Applies class-based overrides to the root and named Radio anatomy slots. Use className for conventional circle classes.
   * @category Styling
   * @typeDoc RadioStylesProp
   */
  styles?: RadioStylesProp;
}

const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  (
    {
      className,
      style,
      size: sizeProp,
      disabled: disabledProp = false,
      error = false,
      label,
      description,
      helperText,
      helperTextError = false,
      value,
      id,
      styles: stylesProp,
      ...props
    },
    ref,
  ) => {
    const radioGroupContext = useRadioGroupContext();
    const generatedId = useId();
    const radioId = id || `radio-${generatedId}`;

    if (!radioGroupContext?.state) {
      throw new Error("RadioItem must be used within a Radio.Group");
    }

    const { state } = radioGroupContext;
    const size = sizeProp || radioGroupContext?.size || "md";
    const disabled = disabledProp ?? radioGroupContext?.disabled ?? false;
    const isSelected = state.selectedValue === value;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const surfaceRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(ref, inputRef);

    const ariaLabelFromProps = props["aria-label"];
    const ariaLabelValue = ariaLabelFromProps || (typeof label === "string" ? label : undefined);
    const resolvedAriaLabel = resolveAccessibleLabel(
      "Radio.Item",
      ariaLabelValue,
      `Radio option ${value}`,
    );

    const { inputProps } = useRadio(
      {
        value,
        isDisabled: disabled,
        "aria-label": resolvedAriaLabel,
      },
      state,
      inputRef,
    );

    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
    const { isPressed, handleMouseDown, handleMouseUp, handleMouseLeave } =
      useRowPressState(disabled);
    const { scopeProps, indicatorProps } = useFocus({
      scopeRef: surfaceRef,
      containerRef: surfaceRef,
      surfaceSelector: '[data-radio-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
    });
    const resolved = resolveRadioStyles(stylesProp);

    return (
      <RadioAnatomy
        isGroupItem
        size={size}
        disabled={disabled}
        error={error}
        label={label}
        description={description}
        helperText={helperText}
        helperTextError={helperTextError}
        isSelected={isSelected}
        radioId={radioId}
        resolved={resolved}
        style={style}
        circleClassName={className}
        rootRef={rootRef}
        surfaceRef={surfaceRef}
        scopeClassName={scopeProps.className}
        indicatorProps={indicatorProps}
        isFocused={isFocused}
        isFocusVisible={isFocusVisible}
        isHovered={isHovered}
        isPressed={isPressed}
        onRowClick={(event) => handleRowSelect(event, disabled, inputRef)}
        onRowMouseDown={handleMouseDown}
        onRowMouseUp={handleMouseUp}
        onRowMouseLeave={handleMouseLeave}
        inputProps={asElementProps<"input">(mergeProps(inputProps, focusProps, hoverProps, props))}
        inputRef={mergedRef}
      />
    );
  },
);

RadioItem.displayName = "Radio.Item";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Size of the radio button.
   * @category Core
   * @default "md"
   * @typeDoc RadioSize
   */
  size?: RadioSize;
  /**
   * Label text or element displayed next to the radio.
   * @category Content
   */
  label?: React.ReactNode;
  /**
   * Secondary description shown below the label.
   * @category Content
   */
  description?: React.ReactNode;
  /**
   * Helper text shown below the radio row.
   * @category Content
   */
  helperText?: React.ReactNode;
  /**
   * Styles the helper text and native input as invalid.
   * @category Forms
   * @default false
   */
  helperTextError?: boolean;
  /**
   * Applies error styling to the circle and description.
   * @category Forms
   * @default false
   */
  error?: boolean;
  /**
   * Applies class-based overrides to the root and named Radio anatomy slots. Use className for conventional circle classes.
   * @category Styling
   * @typeDoc RadioStylesProp
   */
  styles?: RadioStylesProp;
  /**
   * Initial checked value for uncontrolled usage. Use state.checked for controlled usage.
   * @category Core
   * @default false
   */
  checked?: boolean;
  /**
   * Controlled checked state. Takes precedence over checked/defaultChecked.
   * @category Core
   * @typeDoc RadioState
   */
  state?: RadioState;
}

/**
 * Controlled state supplied to standalone Radio.
 * @typeDoc RadioState
 */
export interface RadioState {
  /** Controlled checked value. The caller updates it in response to onChange. */
  checked?: boolean;
}

const RadioBase = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      style,
      size = "md",
      disabled = false,
      error = false,
      label,
      description,
      helperText,
      helperTextError = false,
      checked: checkedProp,
      state: controlledState,
      defaultChecked,
      onChange,
      id,
      styles: stylesProp,
      ...props
    },
    ref,
  ) => {
    const [checked, setChecked] = useControlledState(
      controlledState?.checked,
      checkedProp,
      defaultChecked ?? false,
    );
    const generatedId = useId();

    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
    const { isPressed, handleMouseDown, handleMouseUp, handleMouseLeave } =
      useRowPressState(disabled);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
      onChange?.(e);
    };

    const radioId = id || `radio-${generatedId}`;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const surfaceRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(ref, inputRef);
    const { scopeProps, indicatorProps } = useFocus({
      scopeRef: surfaceRef,
      containerRef: surfaceRef,
      surfaceSelector: '[data-radio-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
    });
    const resolved = resolveRadioStyles(stylesProp);

    const ariaLabelFromProps = props["aria-label"];
    const resolvedAriaLabel = ariaLabelFromProps || (typeof label === "string" ? label : undefined);

    const inputProps = asElementProps<"input">(
      mergeProps(focusProps, hoverProps, props, {
        checked,
        onChange: handleChange,
        disabled: disabled ?? false,
        "aria-label": resolvedAriaLabel,
      }),
    );

    return (
      <RadioAnatomy
        isGroupItem={false}
        size={size}
        disabled={disabled}
        error={error}
        label={label}
        description={description}
        helperText={helperText}
        helperTextError={helperTextError}
        isSelected={checked}
        radioId={radioId}
        resolved={resolved}
        style={style}
        circleClassName={className}
        rootRef={rootRef}
        surfaceRef={surfaceRef}
        scopeClassName={scopeProps.className}
        indicatorProps={indicatorProps}
        isFocused={isFocused}
        isFocusVisible={isFocusVisible}
        isHovered={isHovered}
        isPressed={isPressed}
        onRowClick={(event) => handleRowSelect(event, disabled, inputRef)}
        onRowMouseDown={handleMouseDown}
        onRowMouseUp={handleMouseUp}
        onRowMouseLeave={handleMouseLeave}
        inputProps={inputProps}
        inputRef={mergedRef}
      />
    );
  },
);

RadioBase.displayName = "Radio";

const Radio = Object.assign(RadioBase, {
  Group: RadioGroup,
  Item: RadioItem,
});

export { Radio };
