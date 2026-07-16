"use client";

import * as React from "react";

import { mergeProps, } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus"
import { useButton } from "@react-aria/button";

import { cn } from "@/lib/utils";
import { type SlotStyleValue, createStylePropsResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { type HintValue, hasHint, renderHint } from "@/lib/hint";
import { Badge } from "../Badge";
import css from "./Button.module.css";

type ButtonSize = (string & {});
type ButtonIconSlots = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

interface ButtonIconStyles {
  left?: SlotStyleValue;
  right?: SlotStyleValue;
}

export interface ButtonStyleSlots {
  root?: SlotStyleValue;
  icon?: SlotStyleValue | ButtonIconStyles;
  hint?: SlotStyleValue;
}

export type ButtonStylesProp = ButtonStyleSlots;

const resolveButtonBaseStyles = createStylePropsResolver(['root', 'iconLeft', 'iconRight', 'hint'] as const);

function isButtonIconStyles(icon: ButtonStyleSlots['icon']): icon is ButtonIconStyles {
  return typeof icon === 'object' && icon !== null && ('left' in icon || 'right' in icon);
}

function resolveButtonStyles(styles: ButtonStylesProp | undefined) {
  if (!styles) return resolveButtonBaseStyles(styles)
  const { root, icon, hint } = styles;

  let iconLeft: SlotStyleValue | undefined;
  let iconRight: SlotStyleValue | undefined;

  if (icon) {
    if (typeof icon === 'string' || Array.isArray(icon)) {
      iconLeft = icon;
      iconRight = icon;
    } else if (isButtonIconStyles(icon)) {
      iconLeft = icon.left;
      iconRight = icon.right;
    } else {
      iconLeft = icon;
      iconRight = icon;
    }
  }

  return resolveButtonBaseStyles({ root, iconLeft, iconRight, hint });
}

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "href" | "target"> {
  /** Variant class appended to the root element. Accepts any string. */
  variant?: string;
  /** Size class appended to the root element. Accepts any string. */
  size?: ButtonSize;
  /** Disables interaction and applies disabled styling */
  isDisabled?: boolean;
  /** React Aria press handler — preferred over onClick for accessibility */
  onPress?: (e: { target: EventTarget | null }) => void;
  /** Icon slots rendered before (left) or after (right) the button label */
  icon?: React.ReactNode | ButtonIconSlots;
  /** Keyboard shortcut or hint rendered as a Badge at the end of the button. An array renders its segments joined by a `+` divider. */
  hint?: HintValue;
  /** Renders the button as an anchor element when provided */
  href?: string;
  /** Browsing context for the anchor variant (e.g. "_blank") */
  target?: React.HTMLAttributeAnchorTarget;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ButtonStylesProp;
  /** Forces the visual hover state. Set by Menu.Trigger to keep the trigger highlighted while the menu is open. */
  "data-hovered"?: "true" | "false";
}

function isButtonIconSlots(icon: ButtonProps["icon"]): icon is ButtonIconSlots {
  return typeof icon === "object" && icon !== null && !React.isValidElement(icon) && ('left' in icon || 'right' in icon);
}

function resolveButtonIcon(icon: ButtonProps["icon"]) {
  if (!icon) {
    return undefined;
  }

  if (isButtonIconSlots(icon)) {
    return icon;
  }

  return { left: icon };
}

function resolveButtonIconSizeClass(size: ButtonSize | undefined) {
  if (!size) {
    return undefined;
  }

  return (css as unknown as Record<string, string | undefined>)[`icon-${size}`];
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, styles, variant = "default", size, children, onClick, onPress, isDisabled, disabled, icon, hint, href, target, rel, "data-hovered": forcedHovered, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const mergedRef = useMergeRefs(ref, buttonRef);
    const isButtonDisabled = isDisabled ?? disabled ?? false;
    const [isPressed, setIsPressed] = React.useState(false);
    const isAnchor = !!href;

    const handlePress = React.useCallback((e: any) => {
      if (onPress) onPress({ target: e.target });
      if (onClick) onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
    }, [onPress, onClick]);

    const handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (!isButtonDisabled) {
        setIsPressed(true);
      }
      props.onMouseDown?.(e as any);
    }, [isButtonDisabled, props]);

    const handleMouseUp = React.useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      setIsPressed(false);
      props.onMouseUp?.(e as any);
    }, [props]);

    const handleMouseLeave = React.useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      setIsPressed(false);
      props.onMouseLeave?.(e as any);
    }, [props]);

    const { buttonProps } = useButton({
      isDisabled: isButtonDisabled,
      onPress: handlePress,
    }, buttonRef as React.RefObject<HTMLButtonElement>);

    const { focusProps, isFocused, isFocusVisible } = useFocusRing({ autoFocus: props.autoFocus });
    const { hoverProps, isHovered } = useHover({ isDisabled: isButtonDisabled });
    const isVisualHovered = !isButtonDisabled && (forcedHovered === "true" || (forcedHovered !== "false" && isHovered));
    const isVisualPressed = !isButtonDisabled && isPressed;

    const actualSize = size ?? "md";
    const isIconOnly = !children && !!icon;

    const resolved = resolveButtonStyles(styles);
    const resolvedIcon = resolveButtonIcon(icon);

    const iconSizeClassName = resolveButtonIconSizeClass(actualSize);
    const iconSlotClassName = isIconOnly ? "icon" : undefined;

    const buttonClassName = cn(
      "button",
      variant,
      actualSize,
      isIconOnly && "icon",
      css.button,
      className,
      resolved.root.className
    );

    const { targetProps } = useFocus({ mode: "target" });

    if (isAnchor) {
      return (
        <a
          {...mergeProps(focusProps, hoverProps, props as any)}
          {...targetProps}
          ref={mergedRef as unknown as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={buttonClassName}
          data-disabled={isButtonDisabled ? "true" : undefined}
          data-pressed={isVisualPressed ? "true" : "false"}
          data-hovered={isVisualHovered ? "true" : "false"}
          data-focused={isFocused ? "true" : "false"}
          data-focus-visible={isFocusVisible ? "true" : "false"}
          data-hint={hasHint(hint) ? "true" : undefined}
          style={{ ...resolved.root.style, ...props.style }}
        >
          {resolvedIcon?.left && <span className={cn(iconSlotClassName, iconSizeClassName, resolved.iconLeft.className)} style={resolved.iconLeft.style}>{resolvedIcon.left}</span>}
          {children}
          {resolvedIcon?.right && <span className={cn(iconSlotClassName, iconSizeClassName, resolved.iconRight.className)} style={resolved.iconRight.style}>{resolvedIcon.right}</span>}
          {hasHint(hint) && <Badge variant="secondary" className={cn(css.hint, resolved.hint.className)} style={resolved.hint.style}>{renderHint(hint)}</Badge>}
        </a>
      );
    }

    return (
      <button
        {...mergeProps(buttonProps, focusProps, hoverProps, props)}
        {...targetProps}
        disabled={isButtonDisabled}
        ref={mergedRef as unknown as React.RefObject<HTMLButtonElement>}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={buttonClassName}
        data-disabled={isButtonDisabled ? "true" : undefined}
        data-pressed={isVisualPressed ? "true" : "false"}
        data-hovered={isVisualHovered ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        data-hint={hasHint(hint) ? "true" : undefined}
        style={{ ...resolved.root.style, ...props.style }}
      >
        {resolvedIcon?.left && <span className={cn(iconSlotClassName, iconSizeClassName, resolved.iconLeft.className)} style={resolved.iconLeft.style}>{resolvedIcon.left}</span>}
        {children}
        {resolvedIcon?.right && <span className={cn(iconSlotClassName, iconSizeClassName, resolved.iconRight.className)} style={resolved.iconRight.style}>{resolvedIcon.right}</span>}
        {hasHint(hint) && <Badge variant="secondary" className={cn('hint', css.hint, resolved.hint.className)} style={resolved.hint.style}>{renderHint(hint)}</Badge>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
