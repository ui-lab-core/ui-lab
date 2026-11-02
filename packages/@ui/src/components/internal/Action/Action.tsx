"use client";

import React from "react";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/Tooltip";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import css from "./Action.module.css";

/** Declarative action rendered as a minimal icon button. */
export interface ActionDef {
  /** Icon content for the action button. */
  icon: React.ReactNode;
  /** Accessible name and tooltip content for the action button. */
  title: string;
  /** Invoked when the action button is pressed. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/** A declarative action or custom action node. */
export type ActionItem = ActionDef | React.ReactNode;

export interface ActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Accessible name and tooltip content. */
  title: string;
}

/**
 * Minimal icon button shared by components that accept an `actions` prop.
 * It carries no Button variant or size classes; hosts configure it through
 * their `@slot action` scope and it draws its own focus ring.
 */
export const Action = React.forwardRef<HTMLButtonElement, ActionProps>(
  ({ title, disabled, className, children, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergeRefs(ref, buttonRef);
    const { buttonProps, isPressed } = useButton({ isDisabled: disabled }, buttonRef);
    const { focusProps, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
    const { targetProps } = useFocus({ mode: "target" });

    return (
      <Tooltip content={title} position="top">
        <button
          {...mergeProps(buttonProps, focusProps, hoverProps, props)}
          {...targetProps}
          ref={mergedRef}
          type="button"
          aria-label={title}
          className={cn("action", css.action, className)}
          data-hovered={isHovered ? "true" : undefined}
          data-pressed={isPressed ? "true" : undefined}
          data-focus-visible={isFocusVisible ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
        >
          <span className={css.icon} aria-hidden="true">
            {children}
          </span>
        </button>
      </Tooltip>
    );
  },
);
Action.displayName = "Action";

/** Renders a declarative action as Action and passes custom nodes through. */
export function renderAction(
  action: ActionItem,
  index: number,
  props?: Omit<ActionProps, "title">,
) {
  if (React.isValidElement(action) || !isActionDef(action)) {
    return <React.Fragment key={index}>{action}</React.Fragment>;
  }

  return (
    <Action key={action.title || index} title={action.title} onClick={action.onClick} {...props}>
      {action.icon}
    </Action>
  );
}

function isActionDef(action: ActionItem): action is ActionDef {
  return typeof action === "object" && action !== null && "title" in action && "icon" in action;
}
