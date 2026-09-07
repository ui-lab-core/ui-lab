"use client";

import * as React from "react";

import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { useButton } from "@react-aria/button";
import { enableShadowDOM } from "@react-stately/flags";

// React Aria otherwise reads retargeted document-level events as coming from the
// shadow host, which cancels presses completed inside a ShadowRoot.
enableShadowDOM();

import type { FocusableElement, PressEvent } from "@react-types/shared";

import { cn } from "@/lib/utils";
import { type SlotStyle, createStylePropsResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { type HintValue, HintBadges, hasHint } from "@/lib/hint";
import { isSkeletonElement } from "../Skeleton";
import type { ButtonVariantOverrides } from "../../theme-contract";
import type { DefaultButtonVariant } from "../../generated-theme-contract";
import { tailwindPalette } from "../../generated-tailwind-palette";
import css from "./Button.module.css";

/** An open string type used to select a button size class. */
export type ButtonSize = string & {};

/** A variant supplied by an installed theme, while preserving custom theme hooks. */
export type ButtonVariant = DefaultButtonVariant | keyof ButtonVariantOverrides | (string & {});

/** A fill colour for the button: a theme colour token, a custom property, or any CSS colour. */
export type ButtonColor = string & {};

const CUSTOM_PROPERTY = /^--[a-z0-9-]+$/i;
const THEME_TOKEN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/i;

export function resolveButtonColor(color: ButtonColor | undefined): string | undefined {
  if (!color) return undefined;
  const value = color.trim();
  if (!value) return undefined;
  if (CUSTOM_PROPERTY.test(value)) return `var(${value})`;
  if (THEME_TOKEN.test(value)) {
    const fallback = tailwindPalette[value];
    return fallback
      ? `var(--${value}, var(--color-${value}, ${fallback}))`
      : `var(--${value}, var(--color-${value}))`;
  }
  return value;
}

/** Icon content rendered on either side of the button label. */
export type ButtonIconSlots = {
  /** Content rendered before the button label. */
  left?: React.ReactNode;
  /** Content rendered after the button label. */
  right?: React.ReactNode;
};

/** Side-specific styles used when the icon slot is configured as an object. */
export interface ButtonIconStyleSlots {
  /** Styles applied to the leading icon. */
  left?: SlotStyle;
  /** Styles applied to the trailing icon. */
  right?: SlotStyle;
}

/**
 * Style overrides for the button root and named content slots.
 * Use className for root layout and styles for individual parts.
 *
 * @example
 * <Button className="w-full justify-start" styles={{ hint: "opacity-60" }} hint="⌘S">
 *   Save
 * </Button>
 */
export interface ButtonStyleSlots {
  /** Styles applied to the button or anchor root (data-slot="root"). Target interaction states here with data-[hovered=true], data-[pressed=true], data-[disabled=true], or data-[focus-visible=true]. */
  root?: SlotStyle;
  /** Styles applied to the icon wrappers, not the SVG itself. A shared value styles both sides; { left, right } styles them independently. An icon-only child uses the left slot. */
  icon?: SlotStyle | ButtonIconStyleSlots;
  /** Styles applied to the hint badge container (data-slot="hint"), rather than the button label. */
  hint?: SlotStyle;
}

export type ButtonStylesProp = ButtonStyleSlots;

const resolveButtonBaseStyles = createStylePropsResolver([
  "root",
  "iconLeft",
  "iconRight",
  "hint",
] as const);

function isButtonIconStyles(icon: ButtonStyleSlots["icon"]): icon is ButtonIconStyleSlots {
  return typeof icon === "object" && icon !== null && ("left" in icon || "right" in icon);
}

function resolveButtonStyles(styles: ButtonStylesProp | undefined) {
  if (!styles) return resolveButtonBaseStyles(styles);
  const { root, icon, hint } = styles;

  let iconLeft: SlotStyle | undefined;
  let iconRight: SlotStyle | undefined;

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
  /** Variant class appended to the root element. When omitted, the active theme supplies the default. Accepts any string.
   * @category Core
   */
  variant?: ButtonVariant;
  /** Fill colour for the button. Accepts a theme colour token (color="accent-500"), a Tailwind palette colour (color="purple-500"), a custom property (color="--brand"), or any CSS colour. The active theme paints the same treatment it gives its filled variant over that colour.
   * @category Core
   * @typeDoc ButtonColor
   */
  color?: ButtonColor;
  /** Size class appended to the root element. Accepts any string defined by your theme. Defaults to "md" for labeled buttons and "icon" for icon-only content. Set size explicitly to override automatic sizing.
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
  /** Icon content rendered before the label by default. Use icon={{ left: <Icon /> }} or icon={{ right: <Icon /> }} to choose a side; both slots may be provided together.
   * Icon-only buttons are sized automatically; provide aria-label or screen-reader-only text for an accessible name. An explicitly supplied icon size prop is preserved.
   * @category Content
   * @typeDoc ButtonIconSlots
   * @example
   * <Button icon={<Plus />} aria-label="Add item" />
   */
  icon?: React.ReactNode | ButtonIconSlots;
  /** Keyboard shortcut or hint rendered as Badges at the end of the button. Arrays render each segment as its own badge.
   * This is display-only; it does not register a keyboard shortcut.
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
   * When target="_blank", rel defaults to "noopener noreferrer" unless explicitly supplied.
   * @category Link behavior
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
   */
  target?: React.HTMLAttributeAnchorTarget;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes.
   * Available slots are root, icon (shared or { left, right }), and hint. Use the style prop for root inline styles; it takes precedence over styles.root inline styles.
   * @category Styling
   * @typeDoc ButtonStyleSlots
   * @example
   * <Button styles={{ root: "data-[pressed=true]:scale-95", hint: "opacity-60" }} hint="⌘S">
   *   Save
   * </Button>
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

// SVG size attributes lose to the button's themed CSS dimensions. Promote only
// explicitly supplied sizes, leaving icon-library defaults under theme control.
function preserveIconSize(content: React.ReactNode): React.ReactNode {
  return React.Children.map(content, (child) => {
    if (!React.isValidElement<{ size?: number | string; style?: React.CSSProperties }>(child)) {
      return child;
    }

    const { size, style } = child.props;
    if (size == null) return child;

    return React.cloneElement(child, {
      style: { width: size, height: size, ...style },
    });
  });
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

function hasRenderableContent(value: React.ReactNode): boolean {
  if (Array.isArray(value)) {
    return value.some(hasRenderableContent);
  }

  if (value === null || value === undefined || typeof value === "boolean") {
    return false;
  }

  return typeof value === "string" ? value.trim().length > 0 : true;
}

function isScreenReaderOnlyElement(value: React.ReactNode): boolean {
  if (!React.isValidElement<{ className?: string }>(value)) {
    return false;
  }

  return value.props.className?.split(/\s+/).includes("sr-only") ?? false;
}

function hasVisuallyRenderableContent(value: React.ReactNode): boolean {
  if (Array.isArray(value)) {
    return value.some(hasVisuallyRenderableContent);
  }

  if (isScreenReaderOnlyElement(value)) {
    return false;
  }

  if (
    React.isValidElement<{ children?: React.ReactNode }>(value) &&
    value.type === React.Fragment
  ) {
    return hasVisuallyRenderableContent(value.props.children);
  }

  return hasRenderableContent(value);
}

// Text (strings/numbers), including text nested in an element, makes a button
// label-bearing unless its containing element is explicitly screen-reader-only.
// Elements without visible textual children are treated as icons.
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

  if (isScreenReaderOnlyElement(value)) {
    return false;
  }

  if (isSkeletonElement(value)) {
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
    (hasVisuallyRenderableContent(children) ||
      hasRenderableContent(icon?.left) ||
      hasRenderableContent(icon?.right))
  );
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      styles,
      variant,
      color,
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
    const resolvedColor = resolveButtonColor(color);
    const resolvedIcon = resolveButtonIcon(icon);
    const isIconOnly = isIconOnlyContent(resolvedIcon, children);
    const actualSize = size ?? (isIconOnly ? "icon" : "md");
    const isIconButton = isIconOnly || size === "icon";

    const iconSlotClassName = isIconOnly ? "icon" : undefined;
    // An icon passed through `children` (rather than the `icon` prop) still
    // needs the `.icon` slot wrapper so slot-scoped styling applies to it.
    const wrapChildrenAsIcon = isIconOnly && hasVisuallyRenderableContent(children);

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
            className={cn(iconSlotClassName, resolved.iconLeft.className)}
            style={resolved.iconLeft.style}
            data-slot="icon.left"
          >
            {preserveIconSize(resolvedIcon.left)}
          </span>
        )}
        {wrapChildrenAsIcon ? (
          <span
            className={cn(iconSlotClassName, resolved.iconLeft.className)}
            style={resolved.iconLeft.style}
            data-slot="icon.left"
          >
            {preserveIconSize(children)}
          </span>
        ) : (
          children
        )}
        {resolvedIcon?.right && (
          <span
            className={cn(iconSlotClassName, resolved.iconRight.className)}
            style={resolved.iconRight.style}
            data-slot="icon.right"
          >
            {preserveIconSize(resolvedIcon.right)}
          </span>
        )}
        {hasHint(hint) && (
          <HintBadges
            hint={hint}
            className={cn(css.hint, resolved.hint.className)}
            style={resolved.hint.style}
            data-slot="hint"
          />
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
          // useButton assigns role="button" for any non-<button> elementType, but an
          // anchor with an href is a navigational link and must keep its implicit role.
          role={undefined}
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          className={buttonClassName}
          data-slot="root"
          data-disabled={isButtonDisabled ? "true" : undefined}
          data-pressed={isVisualPressed ? "true" : "false"}
          data-hovered={isVisualHovered ? "true" : "false"}
          data-focused={isFocused ? "true" : "false"}
          data-focus-visible={isFocusVisible ? "true" : "false"}
          data-hint={hasHint(hint) ? "true" : undefined}
          data-icon-only={isIconButton ? "true" : undefined}
          data-variant={variant}
          data-color={resolvedColor ? color : undefined}
          data-size={actualSize}
          style={{
            ...resolved.root.style,
            ...(resolvedColor ? ({ "--color": resolvedColor } as React.CSSProperties) : null),
            ...props.style,
          }}
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
        data-slot="root"
        data-disabled={isButtonDisabled ? "true" : undefined}
        data-pressed={isVisualPressed ? "true" : "false"}
        data-hovered={isVisualHovered ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
        data-hint={hasHint(hint) ? "true" : undefined}
        data-icon-only={isIconButton ? "true" : undefined}
        data-variant={variant}
        data-color={resolvedColor ? color : undefined}
        data-size={actualSize}
        style={{
          ...resolved.root.style,
          ...(resolvedColor ? ({ "--color": resolvedColor } as React.CSSProperties) : null),
          ...props.style,
        }}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
