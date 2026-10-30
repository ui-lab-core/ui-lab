"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { renderAction } from "@/lib/internal/Action";
import { useListContext, useListItemContext } from "./list.context";
import { ListActionsProps } from "./list.types";
import css from "./List.module.css";
import { markListItemSlot } from "./list.item-layout";

/**
 * Trailing actions container for a list item. Place it among the item's children
 * to control where the actions render; when omitted, List.Item appends it after
 * the row content. Reads action definitions from the item's `actions` prop unless
 * `actions` or `children` are provided directly.
 */
const Actions = React.forwardRef<HTMLDivElement, ListActionsProps>(
  ({ actions: actionsProp, children, className, ...props }, ref) => {
    const { styles: listStyles } = useListContext();
    const { actions: contextActions, styles: itemStyles } = useListItemContext();
    const actions = actionsProp ?? contextActions;

    if (children == null && (!actions || actions.length === 0)) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(css.actions, listStyles.item.actions, itemStyles.actions, className)}
        {...props}
        data-slot="item.actions"
        data-actions
      >
        {children ??
          actions?.map((action, i) =>
            renderAction(action, i, {
              className: cn(listStyles.item.action, itemStyles.action),
              "data-slot": "item.action",
            } as React.ComponentProps<"button">),
          )}
      </div>
    );
  },
);
Actions.displayName = "List.Actions";
markListItemSlot(Actions, () => "trailing");

export { Actions };
