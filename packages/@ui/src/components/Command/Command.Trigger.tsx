import * as React from "react";
import type { CommandState } from "./Command";

export interface CommandTriggerProps {
  state: CommandState;
  asChild?: boolean;
  children: React.ReactElement;
}

export const CommandTrigger = React.forwardRef<HTMLElement, CommandTriggerProps>(
  ({ state, asChild = false, children }, forwardedRef) => {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>;
    const isNativeButton = typeof child.type === "string" && child.type === "button";
    const childProps = child.props as {
      onClick?: (event: React.MouseEvent<HTMLElement>) => void;
      onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
    };
    const triggerProps = {
      "aria-haspopup": "dialog" as const,
      "aria-expanded": state.isOpen,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        if (!event.defaultPrevented) state.open();
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        childProps.onKeyDown?.(event);
        if (
          !event.defaultPrevented &&
          !isNativeButton &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          state.open();
        }
      },
    };
    const setRef = (element: HTMLElement | null) => {
      state.setTrigger(element);
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    };
    if (asChild)
      return React.cloneElement(child, {
        ...triggerProps,
        ...(isNativeButton ? {} : { role: "button", tabIndex: 0 }),
        ref: setRef,
      });
    return (
      <button ref={setRef as React.Ref<HTMLButtonElement>} type="button" {...triggerProps}>
        {children}
      </button>
    );
  },
);

CommandTrigger.displayName = "Command.Trigger";
