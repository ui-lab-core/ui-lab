"use client";

import * as React from "react";

import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { useButton } from "@react-aria/button";
import { enableShadowDOM } from "@react-stately/flags";
import type { FocusableElement, PressEvent } from "@react-types/shared";

import { cn } from "@/lib/utils";
import { type SlotStyleValue, createStylePropsResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { type HintValue, hasHint, renderHint } from "@/lib/hint";
import { Badge } from "../Badge";
import css from "./Button.module.css";

// React Aria otherwise reads retargeted document-level events as coming from the
// shadow host, which cancels presses completed inside a ShadowRoot.
enableShadowDOM();

/** An open string type used to select a button size class. */
type ButtonSize = string & {};

/** Icon content rendered on either side of the button label. */
type ButtonIconSlots = {
  /** Content rendered before the button label. */
  left?: React.ReactNode;
  /** Content rendered after the button label. */
  right?: React.ReactNode;
};

/** Side-specific styles used when the icon slot is configured as an object. */
interface ButtonIconStyles {
  /** Styles applied to the leading icon. */
  left?: SlotStyleValue;
  /** Styles applied to the trailing icon. */
  right?: SlotStyleValue;
}

/** Style overrides for the button root and named content slots. */
export interface ButtonStyleSlots {
  /** Styles applied to the root element. */
  root?: SlotStyleValue;
  /** Shared icon styles or separate leading and trailing icon styles. */
  icon?: SlotStyleValue | ButtonIconStyles;
  /** Styles applied to the hint badge. */
  hint?: SlotStyleValue;
}

export type ButtonStylesProp = ButtonStyleSlots;

const resolveButtonBaseStyles = createStylePropsResolver([
  "root",
  "iconLeft",
  "iconRight",
  "hint",
] as const);

function isButtonIconStyles(icon: ButtonStyleSlots["icon"]): icon is ButtonIconStyles {
  return typeof icon === "object" && icon !== null && ("left" in icon || "right" in icon);
}

function resolveButtonStyles(styles: ButtonStylesProp | undefined) {
  if (!styles) return resolveButtonBaseStyles(styles);
  const { root, icon, hint } = styles;

  let iconLeft: SlotStyleValue | undefined;
  let iconRight: SlotStyleValue | undefined;

  if (icon) {
    if (typeof icon === "string" || Array.isArray(icon)) {
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

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "href" | "target"
> {
  /** Variant class appended to the root element. Accepts any string.
   * @category Core
   * @default primary
   */
  variant?: string;
  /** Size class appended to the root element. Accepts any string.
   * @category Core
   * @typeDoc ButtonSize
   */
  size?: ButtonSize;
  /** Disables interaction and applies disabled styling. Disabled buttons cannot receive focus.
   * @category Core
   * @default false
   * @see https://react-spectrum.adobe.com/react-aria/useButton.html
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
   */
  disabled?: boolean;
  /** React Aria press handler, preferred over onClick for keyboard and pointer consistency.
   * @category Events
   * @see https://react-spectrum.adobe.com/react-aria/interactions.html#usepress
   */
  onPress?: (e: PressEvent) => void;
  /** Icon slots rendered before (left) or after (right) the button label.
   * @category Content
   * @typeDoc ButtonIconSlots
   */
  icon?: React.ReactNode | ButtonIconSlots;
  /** Keyboard shortcut or hint rendered as a Badge at the end of the button. Arrays render as shortcut segments joined by a plus divider.
   * @category Content
   * @typeDoc HintValue
   */
  hint?: HintValue;
  /** Renders the button as an anchor element when provided.
   * @category Link behavior
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href
   */
  href?: string;
  /** Browsing context for the anchor variant, such as _blank.
   * @category Link behavior
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
   */
  target?: React.HTMLAttributeAnchorTarget;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes.
   * @category Styling
   * @typeDoc ButtonStyleSlots
   */
  styles?: ButtonStylesProp;
  /** Forces the visual hover state. Set by Menu.Trigger to keep the trigger highlighted while the menu is open. This is an advanced visual-state escape hatch, not a pending state.
   * @category Advanced
   */
  "data-hovered"?: "true" | "false";
}

function isButtonIconSlots(icon: ButtonProps["icon"]): icon is ButtonIconSlots {
  return (
    typeof icon === "object" &&
    icon !== null &&
    !React.isValidElement(icon) &&
    ("left" in icon || "right" in icon)
  );
}

export function resolveButtonIcon(icon: ButtonProps["icon"]) {
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

function hasRenderableContent(value: React.ReactNode): boolean {
  if (Array.isArray(value)) {
    return value.some(hasRenderableContent);
  }

  if (value === null || value === undefined || typeof value === "boolean") {
    return false;
  }

  return typeof value === "string" ? value.trim().length > 0 : true;
}

// Text (strings/numbers), including text nested in an element, makes a button
// label-bearing. Elements without textual children are treated as icons.
function hasTextContent(value: React.ReactNode): boolean {
  if (Array.isArray(value)) {
    return value.some(hasTextContent);
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return true;
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(value)) {
    return hasTextContent(value.props.children);
  }

  return false;
}

// Single source of truth for "is this button icon-only" so consumers that render
// a Button indirectly (e.g. Group.Button) can match Button's own sizing decision
// instead of re-deriving it from a narrower check like an explicit size prop.
export function isIconOnlyContent(
  icon: ButtonIconSlots | undefined,
  children: React.ReactNode,
): boolean {
  return (
    !hasTextContent(children) &&
    (hasRenderableContent(children) ||
      hasRenderableContent(icon?.left) ||
      hasRenderableContent(icon?.right))
  );
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      styles,
      variant = "primary",
      size,
      children,
      onClick,
      onPress,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      disabled = false,
      icon,
      hint,
      href,
      target,
      rel,
      "data-hovered": forcedHovered,
      ...props
    },
    ref,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const mergedRef = useMergeRefs(ref, buttonRef);
    const isButtonDisabled = disabled;
    const [isPressed, setIsPressed] = React.useState(false);
    const isAnchor = !!href;

    const handleClick = React.useCallback(
      (e: React.MouseEvent<FocusableElement>) => {
        if (!isButtonDisabled) {
          onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        }
      },
      [isButtonDisabled, onClick],
    );

    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (!isButtonDisabled) {
          setIsPressed(true);
        }
        onMouseDown?.(e as any);
      },
      [isButtonDisabled, onMouseDown],
    );

    const handleMouseUp = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        setIsPressed(false);
        onMouseUp?.(e as any);
      },
      [onMouseUp],
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        setIsPressed(false);
        onMouseLeave?.(e as any);
      },
      [onMouseLeave],
    );

    const { buttonProps } = useButton(
      {
        elementType: isAnchor ? "a" : "button",
        isDisabled: isButtonDisabled,
        onPress,
        onClick: handleClick,
      },
      buttonRef as React.RefObject<HTMLButtonElement>,
    );

    const { focusProps, isFocused, isFocusVisible } = useFocusRing({ autoFocus: props.autoFocus });
    const { hoverProps, isHovered } = useHover({ isDisabled: isButtonDisabled });
    const isVisualHovered =
      !isButtonDisabled && (forcedHovered === "true" || (forcedHovered !== "false" && isHovered));
    const isVisualPressed = !isButtonDisabled && isPressed;

    const resolved = resolveButtonStyles(styles);
    const resolvedIcon = resolveButtonIcon(icon);
    const isIconOnly = isIconOnlyContent(resolvedIcon, children);
    const actualSize = size ?? (isIconOnly ? "icon" : "md");
    const isIconButton = isIconOnly || size === "icon";

    const iconSizeClassName = resolveButtonIconSizeClass(actualSize);
    const iconSlotClassName = isIconOnly ? "icon" : undefined;
    // An icon passed through `children` (rather than the `icon` prop) still
    // needs the `.icon` slot wrapper so slot-scoped styling applies to it.
    const wrapChildrenAsIcon = isIconOnly && hasRenderableContent(children);

    const buttonClassName = cn(
      "button",
      variant,
      actualSize,
      isIconButton && "icon",
      isIconButton && css.icon,
      css.button,
      className,
      resolved.root.className,
    );

    const content = (
      <>
        {resolvedIcon?.left && (
          <span
            className={cn(iconSlotClassName, iconSizeClassName, resolved.iconLeft.className)}
            style={resolved.iconLeft.style}
          >
            {resolvedIcon.left}
          </span>
        )}
        {wrapChildrenAsIcon ? (
          <span
            className={cn(iconSlotClassName, iconSizeClassName, resolved.iconLeft.className)}
            style={resolved.iconLeft.style}
          >
            {children}
          </span>
        ) : (
          children
        )}
        {resolvedIcon?.right && (
          <span
            className={cn(iconSlotClassName, iconSizeClassName, resolved.iconRight.className)}
            style={resolved.iconRight.style}
          >
            {resolvedIcon.right}
          </span>
        )}
        {hasHint(hint) && (
          <Badge
            variant="secondary"
            className={cn("hint", css.hint, resolved.hint.className)}
            style={resolved.hint.style}
          >
            {renderHint(hint)}
          </Badge>
        )}
      </>
    );

    const { targetProps } = useFocus({ mode: "target" });

    if (isAnchor) {
      return (
        <a
          {...mergeProps(buttonProps, focusProps, hoverProps, props as any, {
            onMouseDown: handleMouseDown,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseLeave,
          })}
          {...targetProps}
          ref={mergedRef as unknown as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          className={buttonClassName}
          data-disabled={isButtonDisabled ? "true" : undefined}
          data-pressed={isVisualPressed ? "true" : "false"}
          data-hovered={isVisualHovered ? "true" : "false"}
          data-focused={isFocused ? "true" : "false"}
          data-focus-visible={isFocusVisible ? "true" : "false"}
          data-hint={hasHint(hint) ? "true" : undefined}
          data-icon-only={isIconButton ? "true" : undefined}
          data-variant={variant}
          data-size={actualSize}
          style={{ ...resolved.root.style, ...props.style }}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...mergeProps(buttonProps, focusProps, hoverProps, props, {
          onMouseDown: handleMouseDown,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseLeave,
        })}
        {...targetProps}
        disabled={isButtonDisabled}
        ref={mergedRef as unknown as React.RefObject<HTMLButtonElement>}
        className={buttonClassName}
        data-disabled={isButtonDisabled ? "true" : undefined}
        data-pressed={isVisualPressed ? "true" : "false"}
        data-hovered={isVisualHovered ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        data-hint={hasHint(hint) ? "true" : undefined}
        data-icon-only={isIconButton ? "true" : undefined}
        data-variant={variant}
        data-size={actualSize}
        style={{ ...resolved.root.style, ...props.style }}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
