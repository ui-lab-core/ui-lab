"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Button, type ButtonProps } from "../Button";
import { Expand } from "../Expand";
import { Input } from "../Input";
import { Select } from "../Select";
import { GroupContext } from "./Group.Context";
import type {
  GroupButtonProps,
  GroupExpandProps,
  GroupInputProps,
  GroupSelectProps,
} from "./group.types";
import css from "./Group.module.css";

function useGroupContext() {
  const context = React.useContext(GroupContext);
  if (!context) {
    throw new Error("Group sub-components must be used within Group");
  }
  return context;
}

function hasInput(item: Element | null): boolean {
  return !!item?.querySelector('[data-input="true"]');
}

function isNextToInput(surface: HTMLElement): boolean {
  const item = surface.closest('[data-item="true"]');
  return (
    hasInput(item?.previousElementSibling ?? null) || hasInput(item?.nextElementSibling ?? null)
  );
}

/** Button styled to merge seamlessly with adjacent group items */
const GroupButton = React.forwardRef<HTMLButtonElement, GroupButtonProps>(
  (
    { active, value, variant, className, onPress, onPointerDown, onMouseDown, ...restProps },
    ref,
  ) => {
    const context = useGroupContext();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergeRefs(buttonRef, ref);

    // Merge disabled state from group context
    const isDisabled = restProps.disabled ?? context.groupIsDisabled;

    // Derive active and onPress from toggle group context when value is provided
    const isActive =
      value !== undefined && context.groupValue !== undefined
        ? value === context.groupValue
        : active;
    const handlePress = React.useCallback(
      (e: Parameters<NonNullable<ButtonProps["onPress"]>>[0]) => {
        if (value !== undefined && context.groupOnChange !== undefined) {
          context.groupOnChange(value);
        }
        onPress?.(e);
      },
      [context.groupOnChange, onPress, value],
    );

    // Activate input on pointer down to avoid focus ring flicker
    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
        if (!isDisabled && e.pointerType !== "mouse" && isNextToInput(e.currentTarget)) {
          // Pre-activate the input before button loses focus
          context.activateInput?.();
        }
        onPointerDown?.(e);
      },
      [context, isDisabled, onPointerDown],
    );

    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled && isNextToInput(e.currentTarget) && context.activateInput?.()) {
          e.preventDefault();
        }
        onMouseDown?.(e);
      },
      [context, isDisabled, onMouseDown],
    );

    React.useEffect(() => {
      context.registerFocusableSurface?.(buttonRef);
      return () => {
        context.unregisterFocusableSurface?.(buttonRef);
      };
    }, [context]);

    const buttonVariant = variant ?? context.groupVariant;

    return (
      <Button
        ref={mergedRef}
        {...restProps}
        onPress={handlePress}
        onPointerDown={handlePointerDown}
        onMouseDown={handleMouseDown}
        variant={buttonVariant}
        disabled={isDisabled}
        data-focus-surface="true"
        data-selected={isActive ? "true" : "false"}
        className={cn(css.button, className, context.groupStyles.button)}
      />
    );
  },
);
GroupButton.displayName = "Group.Button";

/** Input field integrated into the button group */
const GroupInput = React.forwardRef<HTMLInputElement, GroupInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const context = useGroupContext();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(ref, inputRef);

    // Register and unregister the input ref with the group context
    React.useEffect(() => {
      context.registerInput?.(containerRef, inputRef);
      return () => {
        context.unregisterInput?.(containerRef);
      };
    }, [context]);

    React.useEffect(() => {
      context.registerFocusableSurface?.(containerRef);
      return () => {
        context.unregisterFocusableSurface?.(containerRef);
      };
    }, [context]);

    // Merge disabled state from group context
    const inputDisabled = disabled ?? context.groupIsDisabled;

    return (
      <div
        ref={containerRef}
        className={cn(
          "input",
          context.groupVariant,
          css.input,
          className,
          context.groupStyles.input,
        )}
        data-slot="input"
        data-focus-surface="true"
        data-input="true"
      >
        <Input ref={mergedRef} {...props} disabled={inputDisabled} className="h-full w-full" />
      </div>
    );
  },
);
GroupInput.displayName = "Group.Input";

/** Select dropdown integrated into the button group */
const GroupSelect = React.forwardRef<HTMLDivElement, GroupSelectProps>(
  ({ className, disabled: disabledProp, ...props }, ref) => {
    const context = useGroupContext();
    const selectRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(selectRef, ref);

    // Merge disabled state from group context
    const disabled = disabledProp ?? context.groupIsDisabled;

    React.useEffect(() => {
      context.registerFocusableSurface?.(selectRef);
      return () => {
        context.unregisterFocusableSurface?.(selectRef);
      };
    }, [context]);

    return (
      <Select
        ref={mergedRef}
        {...props}
        disabled={disabled}
        data-focus-surface="true"
        className={cn(
          "select",
          context.groupVariant,
          css.select,
          className,
          context.groupStyles.select,
        )}
      />
    );
  },
);
GroupSelect.displayName = "Group.Select";

/** Expand primitive integrated into the group */
const GroupExpand = React.forwardRef<HTMLDivElement, GroupExpandProps>(
  ({ className, disabled: disabledProp, styles: stylesProp, ...props }, ref) => {
    const context = useGroupContext();
    const surfaceRef = React.useRef<HTMLDivElement>(null);
    const disabled = disabledProp ?? context.groupIsDisabled;

    React.useEffect(() => {
      context.registerFocusableSurface?.(surfaceRef);
      return () => {
        context.unregisterFocusableSurface?.(surfaceRef);
      };
    }, [context]);

    return (
      <div
        ref={surfaceRef}
        data-slot="expand"
        data-focus-surface="true"
        className={cn(
          "expand",
          context.groupVariant,
          css.expand,
          context.groupStyles.expand,
        )}
      >
        <Expand
          ref={ref}
          {...props}
          className={className}
          styles={stylesProp}
          disabled={disabled}
        />
      </div>
    );
  },
);
GroupExpand.displayName = "Group.Expand";

export { GroupButton, GroupInput, GroupSelect, GroupExpand };
