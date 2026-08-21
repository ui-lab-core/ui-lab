"use client";

import React, { forwardRef, type ComponentPropsWithoutRef } from "react";

import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";

import { ChevronUp, ChevronDown } from "lucide-react";
import { cn, type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import { GroupContext } from "@/components/Group/Group.Context";
import css from "./Input.module.css";

/** Visual treatment applied to the input surface. */
export type InputVariant = "default" | "ghost" | (string & {});

/** Styles for icons rendered at either edge of the input. */
export interface InputIconStyles {
  /** Styles the icon before the input value. */
  left?: StyleValue;
  /** Styles the icon after the input value. */
  right?: StyleValue;
}

export interface InputAdornmentStyles {
  start?: StyleValue;
  end?: StyleValue;
}

/** Styles for the number-input stepper buttons. */
export interface InputStepperStyles {
  /** Styles the increment button. */
  up?: StyleValue;
  /** Styles the decrement button. */
  down?: StyleValue;
}

/** Named style slots for the Input anatomy. */
export interface InputStyleSlots {
  /** Styles the visual input surface. */
  root?: StyleValue;
  /** Styles the native input or custom input content surface. */
  input?: StyleValue;
  adornments?: InputAdornmentStyles;
  /** Styles one or both icon wrappers. */
  icon?: StyleValue | InputIconStyles;
  /** Styles one or both actions wrappers. */
  actions?: StyleValue | InputActionStyles;
  /** Styles the hint content. */
  hint?: StyleValue;
  /** Styles the number-input controls wrapper. */
  controls?: StyleValue;
  /** Styles one or both number-input stepper buttons. */
  stepper?: StyleValue | InputStepperStyles;
}

/** Styles for action groups at either edge of the input. */
export interface InputActionStyles {
  /** Styles the actions before the input value. */
  left?: StyleValue;
  /** Styles the actions after the input value. */
  right?: StyleValue;
}

export type InputStylesProp = StylesProp<InputStyleSlots>;
/** Controlled values accepted through the Input state abstraction. */
export interface InputState {
  /** Current input value. Takes precedence over the native value prop. */
  value?: string;
}

/** An inline action definition or custom action node. */
export type InputAction = InputActionDef | React.ReactNode;
/** Icon content positioned before and/or after the input value. */
export interface InputIconSlots {
  /** Content rendered before the input value. */
  prefix?: React.ReactNode;
  /** Content rendered after the input value. */
  suffix?: React.ReactNode;
}

/** Declarative inline action rendered as an icon button. */
export interface InputActionDef {
  /** Icon content for the action button. */
  icon: React.ReactNode;
  /** Accessible name and tooltip content for the action button. */
  title: string;
  /** Invoked when the action button is pressed. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/** Inline actions positioned at either edge of the input. */
export interface InputActionSlots {
  /** Actions rendered before the input value. */
  left?: InputAction[];
  /** Actions rendered after the input value. */
  right?: InputAction[];
}

const resolveInputBaseStyles = createStylesResolver([
  "root",
  "input",
  "adornments.start",
  "adornments.end",
  "icon.left",
  "icon.right",
  "actions.left",
  "actions.right",
  "hint",
  "controls",
  "stepper.up",
  "stepper.down",
] as const);

function resolveInputStyles(styles: InputStylesProp | undefined) {
  if (!styles) return resolveInputBaseStyles(styles);
  const { root, input, adornments, icon, actions, hint, controls, stepper } = styles;

  let iconLeft: StyleValue | undefined;
  let iconRight: StyleValue | undefined;
  let actionsLeft: StyleValue | undefined;
  let actionsRight: StyleValue | undefined;
  let stepperUp: StyleValue | undefined;
  let stepperDown: StyleValue | undefined;

  if (icon) {
    if (typeof icon === "string" || Array.isArray(icon)) {
      iconLeft = icon;
      iconRight = icon;
    } else {
      iconLeft = icon.left;
      iconRight = icon.right;
    }
  }

  if (actions) {
    if (typeof actions === "string" || Array.isArray(actions)) {
      actionsLeft = actions;
      actionsRight = actions;
    } else {
      actionsLeft = actions.left;
      actionsRight = actions.right;
    }
  }

  if (stepper) {
    if (typeof stepper === "string" || Array.isArray(stepper)) {
      stepperUp = stepper;
      stepperDown = stepper;
    } else {
      stepperUp = stepper.up;
      stepperDown = stepper.down;
    }
  }

  return resolveInputBaseStyles({
    root,
    input,
    "adornments.start": adornments?.start,
    "adornments.end": adornments?.end,
    "icon.left": iconLeft,
    "icon.right": iconRight,
    "actions.left": actionsLeft,
    "actions.right": actionsRight,
    hint,
    controls,
    "stepper.up": stepperUp,
    "stepper.down": stepperDown,
  });
}

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  /** Controlled state. Takes precedence over the native value prop.
   * @category Core
   * @typeDoc InputState
   */
  state?: InputState;
  /** Controls the visual treatment of the input surface.
   * @category Core
   * @default "default"
   * @typeDoc InputVariant
   */
  variant?: InputVariant;
  /** Applies error styling to the input surface.
   * @category Core
   * @default false
   */
  error?: boolean;
  /** Icon displayed before the input value by default, or in named prefix/suffix slots.
   * @category Content
   * @typeDoc InputIconSlots
   */
  icon?: React.ReactNode | InputIconSlots;
  /** Inline actions rendered on the left or right side of the input. An array renders on the right.
   * @category Content
   * @typeDoc InputActionSlots
   */
  actions?: InputAction[] | InputActionSlots;
  /** Hint content rendered on the right side of the input, commonly used for keyboard shortcuts.
   * @category Content
   */
  hint?: React.ReactNode;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes.
   * @category Styling
   * @typeDoc InputStyleSlots
   */
  styles?: InputStylesProp;
  /** Hides the spinner controls for number inputs.
   * @category Core
   * @default false
   */
  "hide-controls"?: boolean;
  /**
   * Custom content rendered in place of the native `<input>`, keeping the
   * surrounding shell (focus surface, icons, actions, hint) intact. Used by
   * composite fields such as Date.Input that own several focusable segments
   * instead of one text input.
   *
   * In this mode the input-specific props (`type`, `value`, `placeholder`, the
   * forwarded ref, …) have no element to apply to and are ignored — the content
   * owns its own values. `disabled`, `error` and `variant` still style the shell.
   */
  children?: React.ReactNode;
}

function isInputIconSlots(icon: InputProps["icon"]): icon is InputIconSlots {
  return (
    typeof icon === "object" &&
    icon !== null &&
    !React.isValidElement(icon) &&
    ("prefix" in icon || "suffix" in icon)
  );
}

function resolveInputIcon(icon: InputProps["icon"]) {
  if (!icon) {
    return undefined;
  }

  if (isInputIconSlots(icon)) {
    return icon;
  }

  return { prefix: icon };
}

function isInputActionSlots(actions: InputProps["actions"]): actions is InputActionSlots {
  return (
    typeof actions === "object" &&
    actions !== null &&
    !Array.isArray(actions) &&
    !React.isValidElement(actions) &&
    ("left" in actions || "right" in actions)
  );
}

function resolveInputActions(actions: InputProps["actions"]): InputActionSlots {
  if (!actions) {
    return {};
  }

  if (isInputActionSlots(actions)) {
    return actions;
  }

  return { right: actions };
}

function normalizeInputValue(value: InputProps["value"] | InputProps["defaultValue"]) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      style,
      variant = "default",
      error = false,
      disabled,
      icon,
      actions,
      hint,
      type = "text",
      value,
      defaultValue,
      state: controlledState,
      onChange,
      onFocus,
      onBlur,
      styles: stylesProp,
      "hide-controls": hideControls = false,
      children,
      ...props
    },
    ref,
  ) => {
    const groupContext = React.useContext(GroupContext);
    const resolvedActions = resolveInputActions(actions);
    const resolvedIcon = resolveInputIcon(icon);
    const leftActions = resolvedActions.left ?? [];
    const rightActions = resolvedActions.right ?? [];
    const hasPrefix = !!resolvedIcon?.prefix;
    const hasSuffix = !!resolvedIcon?.suffix;
    const hasLeftActions = leftActions.length > 0;
    const hasRightActions = rightActions.length > 0;
    const hasHint = hint !== undefined && hint !== null;
    const hasStartAdornment = hasPrefix || hasLeftActions;
    const isNumberType = type === "number";
    const controlledValue = controlledState?.value ?? normalizeInputValue(value);
    const [isFocused, setIsFocused] = React.useState(false);
    const [currentValue, setCurrentValue] = useControlledState(
      controlledValue,
      undefined,
      normalizeInputValue(defaultValue) ?? "",
    );

    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scopeRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(ref, inputRef);

    // With custom content the focusable element is one of the children, so the
    // ring has to track focus anywhere within the content wrapper.
    const hasCustomContent = children !== undefined && children !== null;
    const { focusProps, isFocusVisible } = useFocusRing({
      within: hasCustomContent,
      isTextInput: !hasCustomContent,
    });
    const { scopeProps, indicatorProps } = useFocus({
      scopeRef,
      containerRef,
      surfaceSelector: '[data-input-focus-surface="true"]',
      radiusSource: "surface",
    });

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleSpinClick = (direction: "up" | "down") => {
      if (!inputRef.current || disabled) return;

      const input = inputRef.current;

      if (direction === "up") {
        input.stepUp();
      } else {
        input.stepDown();
      }

      // Dispatch native input event to trigger React onChange handlers
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    };

    const resolved = resolveInputStyles(stylesProp);
    const showControls = isNumberType && !hideControls;
    const hasEndAdornment = hasSuffix || hasRightActions || hasHint || showControls;
    const adornmentPadding = "var(--adornment-offset)";
    const inputPaddingStyle: React.CSSProperties = {
      ...(hasStartAdornment ? { paddingInlineStart: adornmentPadding } : {}),
      ...(hasEndAdornment ? { paddingInlineEnd: adornmentPadding } : {}),
    };

    const renderAction = (action: InputAction, index: number) => {
      const key = React.isValidElement(action) ? index : (action as InputActionDef).title || index;

      return React.isValidElement(action) ? (
        <React.Fragment key={key}>{action}</React.Fragment>
      ) : (
        <Tooltip key={key} content={(action as InputActionDef).title} position="top">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className={css.action}
            aria-label={(action as InputActionDef).title}
            onClick={(action as InputActionDef).onClick}
            icon={(action as InputActionDef).icon}
          />
        </Tooltip>
      );
    };

    const inputRoot = (
      <div
        ref={containerRef}
        className={cn("input", variant, css.container, className, resolved.root)}
        style={style}
        data-input-focus-surface="true"
        data-focused={isFocused ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-disabled={disabled || undefined}
        data-error={error ? "true" : undefined}
        data-variant={variant}
      >
        {hasStartAdornment && (
          <div className={cn("prefix", css.prefix, resolved["adornments.start"])}>
            {hasPrefix && (
              <div className={cn("icon", "left", css["icon-wrapper"], resolved["icon.left"])}>
                <span className={css.icon}>{resolvedIcon?.prefix}</span>
              </div>
            )}
            {hasLeftActions && (
              <div className={cn("actions", "left", css.actions, resolved["actions.left"])}>
                {leftActions.map(renderAction)}
              </div>
            )}
          </div>
        )}
        {hasCustomContent ? (
          <div
            className={cn(css.input, css.content, resolved.input)}
            style={inputPaddingStyle}
            data-focus-visible={isFocusVisible ? "true" : undefined}
            data-focused={isFocused ? "true" : undefined}
            data-disabled={disabled || undefined}
            data-error={error ? "true" : undefined}
            data-variant={variant}
            {...mergeProps(focusProps, {
              onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
                setIsFocused(true);
                onFocus?.(event as unknown as React.FocusEvent<HTMLInputElement>);
              },
              onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
                setIsFocused(false);
                onBlur?.(event as unknown as React.FocusEvent<HTMLInputElement>);
              },
            })}
          >
            {children}
          </div>
        ) : (
          <input
            ref={mergedRef}
            type={type}
            disabled={disabled}
            data-focus-visible={isFocusVisible ? "true" : undefined}
            data-focused={isFocused ? "true" : undefined}
            data-disabled={disabled || undefined}
            data-error={error ? "true" : undefined}
            data-variant={variant}
            className={cn(css.input, resolved.input)}
            style={inputPaddingStyle}
            {...mergeProps(focusProps, {
              onFocus: handleFocus,
              onBlur: handleBlur,
              value: currentValue,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                setCurrentValue(event.target.value);
                onChange?.(event);
              },
              ...props,
            })}
          />
        )}
        {hasEndAdornment && (
          <div className={cn("suffix", css.suffix, resolved["adornments.end"])}>
            {hasSuffix && (
              <div className={cn("icon", "right", css["icon-wrapper"], resolved["icon.right"])}>
                <span className={css.icon}>{resolvedIcon?.suffix}</span>
              </div>
            )}
            {hasRightActions && (
              <div className={cn("actions", "right", css.actions, resolved["actions.right"])}>
                {rightActions.map(renderAction)}
              </div>
            )}
            {hasHint && (
              <span className={cn("hint", css.hint, resolved.hint)}>
                {hint}
              </span>
            )}
            {showControls && (
              <div className={cn("controls", css.controls, resolved.controls)} data-disabled={disabled || undefined}>
                <button
                  type="button"
                  className={cn("stepper", "up", css.stepper, resolved["stepper.up"])}
                  onClick={() => handleSpinClick("up")}
                  disabled={disabled}
                  tabIndex={-1}
                  aria-label="Increment"
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  type="button"
                  className={cn("stepper", "down", css.stepper, resolved["stepper.down"])}
                  onClick={() => handleSpinClick("down")}
                  disabled={disabled}
                  tabIndex={-1}
                  aria-label="Decrement"
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );

    if (groupContext) {
      return inputRoot;
    }

    return (
      <div ref={scopeRef} className={cn("input-scope", scopeProps.className, css.scope)}>
        <div {...indicatorProps} data-focus-indicator="local" />
        {inputRoot}
      </div>
    );
  },
);

Input.displayName = "Input";
