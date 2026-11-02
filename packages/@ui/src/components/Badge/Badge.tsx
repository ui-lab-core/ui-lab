"use client";

import * as React from "react";

import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useButton } from "@react-aria/button";

import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Badge.module.css";

import { X } from "lucide-react";

type BadgeIconSlots = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

interface BadgeIconStyles {
  left?: Style;
  right?: Style;
}

export interface BadgeStyleSlots {
  root?: Style;
  icon?: Style | BadgeIconStyles;
  iconLeft?: Style;
  iconRight?: Style;
  dismiss?: Style;
}

export type BadgeStylesProp = StylesProp<BadgeStyleSlots>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual color style of the badge */
  variant?: string;
  /** Icon slots rendered before (left) or after (right) the badge label */
  icon?: React.ReactNode | BadgeIconSlots;
  /** Whether to show a dismiss button */
  dismissible?: boolean;
  /** Accessible name for this badge's dismiss control. */
  dismissLabel?: string;
  /** Called when the dismiss button is clicked */
  onDismiss?: () => void;
  /** Whether to render with a fully rounded pill shape */
  pill?: boolean;
  /** Numeric count to display; replaces children when provided */
  count?: number;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: BadgeStylesProp;
}

interface DismissButtonProps {
  label: string;
  onDismiss?: () => void;
  variant: string;
  className?: Style;
}

function DismissButton({ onDismiss, variant, className, label }: DismissButtonProps) {
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const { buttonProps, isPressed } = useButton(
    {
      "aria-label": label,
      onPress: onDismiss,
    },
    buttonRef,
  );

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({});

  return (
    <div
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      ref={buttonRef}
      role="button"
      tabIndex={0}
      className={cn("badge", variant, "dismiss", css.dismiss, className)}
      data-pressed={isPressed ? "true" : "false"}
      data-hovered={isHovered ? "true" : "false"}
      data-focused={isFocused ? "true" : "false"}
      data-focus-visible={isFocusVisible ? "true" : "false"}
    >
      <X size={14} />
    </div>
  );
}

const resolveBadgeBaseStyles = createStylesResolver([
  "root",
  "icon",
  "iconLeft",
  "iconRight",
  "dismiss",
] as const);

function resolveBadgeStyles(styles: BadgeStylesProp | undefined) {
  if (!styles) return resolveBadgeBaseStyles(styles);
  const { root, icon, iconLeft, iconRight, dismiss } = styles;
  if (!icon || typeof icon === "string" || Array.isArray(icon)) {
    return resolveBadgeBaseStyles({
      root,
      icon: icon as Style | undefined,
      iconLeft,
      iconRight,
      dismiss,
    });
  }

  return resolveBadgeBaseStyles({
    root,
    iconLeft: icon.left ?? iconLeft,
    iconRight: icon.right ?? iconRight,
    dismiss,
  });
}

function isBadgeIconSlots(icon: BadgeProps["icon"]): icon is BadgeIconSlots {
  return (
    typeof icon === "object" &&
    icon !== null &&
    !React.isValidElement(icon) &&
    ("left" in icon || "right" in icon)
  );
}

function resolveBadgeIcon(icon: BadgeProps["icon"]) {
  if (!icon) {
    return undefined;
  }

  if (isBadgeIconSlots(icon)) {
    return icon;
  }

  return { left: icon };
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      icon,
      dismissible = false,
      dismissLabel = "Dismiss",
      onDismiss,
      pill = false,
      count,
      children,
      className,
      styles,
      ...props
    },
    ref,
  ) => {
    const resolved = resolveBadgeStyles(styles);
    const resolvedIcon = resolveBadgeIcon(icon);
    const rootRef = React.useRef<HTMLSpanElement | null>(null);
    const setRootRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    React.useLayoutEffect(() => {
      const root = rootRef.current;
      if (!dismissible || !root) return;

      const updateControlSize = () => {
        root.style.setProperty("--control-size", `${root.clientHeight}px`);
      };
      const observer = new ResizeObserver(updateControlSize);

      updateControlSize();
      observer.observe(root);
      return () => observer.disconnect();
    }, [dismissible]);

    return (
      <span
        ref={setRootRef}
        className={cn(
          "badge",
          variant,
          css.badge,
          pill && css.pill,
          dismissible && css.dismissible,
          className,
          resolved.root,
        )}
        data-variant={variant}
        data-pill={pill ? "true" : undefined}
        data-dismissible={dismissible || undefined}
        {...props}
      >
        <span className={css.content}>
          {resolvedIcon?.left && (
            <span
              className={cn("badge", variant, "icon", css.icon, resolved.icon, resolved.iconLeft)}
              aria-hidden="true"
            >
              {resolvedIcon.left}
            </span>
          )}
          {count !== undefined ? count : children}
          {resolvedIcon?.right && (
            <span
              className={cn("badge", variant, "icon", css.icon, resolved.icon, resolved.iconRight)}
              aria-hidden="true"
            >
              {resolvedIcon.right}
            </span>
          )}
        </span>
        {dismissible && (
          <DismissButton label={dismissLabel} onDismiss={onDismiss} variant={variant} className={resolved.dismiss} />
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
