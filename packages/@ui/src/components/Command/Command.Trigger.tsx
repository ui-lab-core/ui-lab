import * as React from "react";
import type { CommandState } from "./Command";

/** Props for the element that opens a command palette. */
export interface CommandTriggerProps {
  /** Command state controller opened by the trigger and used to restore focus.
   * @category Core
   * @typeDoc CommandState
   */
  state: CommandState;
  /** Clones the child as the trigger instead of wrapping it in a button. Non-button children receive button role and keyboard behavior.
   * @category Advanced
   * @default false
   */
  asChild?: boolean;
  /** Single element rendered inside the default button or cloned when asChild is enabled.
   * @category Content
   */
  children: React.ReactElement;
}

/**
 * Button trigger that opens a Command state controller and supplies dialog
 * disclosure attributes. Must share its state instance with Command.
 */
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
