"use client";

import React, { forwardRef, type ComponentPropsWithoutRef } from "react";

import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";

import { ChevronUp, ChevronDown } from "lucide-react";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useControlledState } from "@/hooks/useControlledState";
import { GroupContext } from "@/components/Group/Group.Context";
import css from "./Input.module.css";

/**
 * Visual treatment applied to the input surface.
 * @typeDoc InputVariant
 */
export type InputVariant = "default" | "ghost" | (string & {});

/**
 * Styles for icons rendered at either edge of the input.
 * @typeDoc InputIconStyles
 */
export interface InputIconStyles {
  /** Styles the icon before the input value. */
  left?: Style;
  /** Styles the icon after the input value. */
  right?: Style;
}

/**
 * Styles for adornment wrappers at either edge of the input.
 * @typeDoc InputAdornmentStyles
 */
export interface InputAdornmentStyles {
  /** Styles the wrapper containing leading icons and actions. */
  start?: Style;
  /** Styles the wrapper containing trailing icons, actions, hints, and controls. */
  end?: Style;
}

/**
 * Styles for the number-input stepper buttons.
 * @typeDoc InputStepperStyles
 */
export interface InputStepperStyles {
  /** Styles the increment button. */
  up?: Style;
  /** Styles the decrement button. */
  down?: Style;
}

/**
 * Named style slots for the Input anatomy.
 * @typeDoc InputStyleSlots
 */
export interface InputStyleSlots {
  /** Styles the visual input surface. */
  root?: Style;
  /** Styles the native input or custom input content surface. */
  input?: Style;
  /** Styles the adornment wrappers through adornments.start and adornments.end. */
  adornments?: InputAdornmentStyles;
  /** Styles one or both icon wrappers. */
  icon?: Style | InputIconStyles;
  /** Styles one or both actions wrappers. */
  actions?: Style | InputActionStyles;
  /** Styles the hint content. */
  hint?: Style;
  /** Styles the number-input controls wrapper. */
  controls?: Style;
  /** Styles one or both number-input stepper buttons. */
  stepper?: Style | InputStepperStyles;
}

/**
 * Styles for action groups at either edge of the input.
 * @typeDoc InputActionStyles
 */
export interface InputActionStyles {
  /** Styles the actions before the input value. */
  left?: Style;
  /** Styles the actions after the input value. */
  right?: Style;
}

/**
 * Class-based style overrides for Input's root and named anatomy slots.
 * @typeDoc InputStylesProp
 */
export type InputStylesProp = StylesProp<InputStyleSlots>;
/**
 * Controlled values accepted through the Input state abstraction.
 * @typeDoc InputState
 */
export interface InputState {
  /** Current input value. Takes precedence over the native value prop. */
  value?: string;
}

/**
 * An inline action definition or custom action node.
 * @typeDoc InputAction
 */
export type InputAction = InputActionDef | React.ReactNode;
/**
 * Icon content positioned before and/or after the input value.
 * @typeDoc InputIconSlots
 */
export interface InputIconSlots {
  /** Content rendered before the input value. */
  prefix?: React.ReactNode;
  /** Content rendered after the input value. */
  suffix?: React.ReactNode;
}

/**
 * Declarative inline action rendered as an icon button.
 * @typeDoc InputActionDef
 */
export interface InputActionDef {
  /** Icon content for the action button. */
  icon: React.ReactNode;
  /** Accessible name and tooltip content for the action button. */
  title: string;
  /** Invoked when the action button is pressed. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Inline actions positioned at either edge of the input.
 * @typeDoc InputActionSlots
 */
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

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  /**
   * Controlled state whose value takes precedence over the native value prop.
   * @category Core
   * @typeDoc InputState
   */
  state?: InputState;
  /**
   * Controls the visual treatment of the input surface.
   * @category Core
   * @default "default"
   * @typeDoc InputVariant
  */
  variant?: InputVariant;
  /**
   * Applies error styling to the input surface without changing native validity.
   * @category Core
   * @default false
  */
  error?: boolean;
  /**
   * Renders an icon before the value, or positions icons explicitly with prefix and suffix slots.
   * @category Content
   * @typeDoc InputIconSlots
  */
  icon?: React.ReactNode | InputIconSlots;
  /**
   * Renders inline actions. An array renders at the end; use left and right to position actions on both sides. Declarative actions are disabled with the input.
   * @category Content
   * @typeDoc InputActionSlots
  */
  actions?: InputAction[] | InputActionSlots;
  /**
   * Renders hint content at the end of the input, commonly for keyboard shortcuts.
   * @category Content
  */
  hint?: React.ReactNode;
  /**
   * Applies class-based overrides to the root and named anatomy slots. Use className for the conventional root hook.
   * @category Styling
   * @typeDoc InputStyleSlots
  */
  styles?: InputStylesProp;
  /**
   * Hides the increment and decrement controls rendered for number inputs.
   * @category Core
   * @default false
   */
  "hide-controls"?: boolean;
  /**
   * Renders custom content in place of the native input while keeping the surrounding shell intact. Use this for composite fields with their own focusable segments.
   *
   * Native input props, including type, value, placeholder, and the forwarded ref, are ignored in this mode. Disabled, error, and variant continue to style the shell.
   * @category Advanced
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

    const resolved = resolveInputBaseStyles(stylesProp);
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
            disabled={disabled}
          />
        </Tooltip>
      );
    };

    const inputRoot = (
      <div
        ref={containerRef}
        className={cn("input", variant, css.container, className, resolved.root)}
        style={style}
        data-slot="root"
        data-input-focus-surface="true"
        data-focused={isFocused ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-error={error ? "true" : undefined}
        data-variant={variant}
      >
        {hasStartAdornment && (
          <div
            className={cn("prefix", css.prefix, resolved["adornments.start"])}
            data-slot="adornments.start"
          >
            {hasPrefix && (
              <div
                className={cn("icon", "left", css["icon-wrapper"], resolved["icon.left"])}
                data-slot="icon.left"
              >
                <span className={css.icon}>{resolvedIcon?.prefix}</span>
              </div>
            )}
            {hasLeftActions && (
              <div
                className={cn("actions", "left", css.actions, resolved["actions.left"])}
                data-slot="actions.left"
              >
                {leftActions.map(renderAction)}
              </div>
            )}
          </div>
        )}
        {hasCustomContent ? (
          <div
            className={cn(css.input, css.content, resolved.input)}
            style={inputPaddingStyle}
            data-slot="input"
            data-focus-visible={isFocusVisible ? "true" : undefined}
            data-focused={isFocused ? "true" : undefined}
            data-disabled={disabled ? "true" : undefined}
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
            data-slot="input"
            data-focus-visible={isFocusVisible ? "true" : undefined}
            data-focused={isFocused ? "true" : undefined}
            data-disabled={disabled ? "true" : undefined}
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
          <div
            className={cn("suffix", css.suffix, resolved["adornments.end"])}
            data-slot="adornments.end"
          >
            {hasSuffix && (
              <div
                className={cn("icon", "right", css["icon-wrapper"], resolved["icon.right"])}
                data-slot="icon.right"
              >
                <span className={css.icon}>{resolvedIcon?.suffix}</span>
              </div>
            )}
            {hasRightActions && (
              <div
                className={cn("actions", "right", css.actions, resolved["actions.right"])}
                data-slot="actions.right"
              >
                {rightActions.map(renderAction)}
              </div>
            )}
            {hasHint && (
              <span className={cn("hint", css.hint, resolved.hint)} data-slot="hint">
                {hint}
              </span>
            )}
            {showControls && (
              <div
                className={cn("controls", css.controls, resolved.controls)}
                data-slot="controls"
                data-disabled={disabled ? "true" : undefined}
              >
                <button
                  type="button"
                  className={cn("stepper", "up", css.stepper, resolved["stepper.up"])}
                  data-slot="stepper.up"
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
                  data-slot="stepper.down"
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
