"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/Tooltip";
import { useListContext, useListItemContext } from "./list.context";
import { ListActionsProps, ListActionDef } from "./list.types";
import styles from "./List.module.css";
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
    const { actions: contextActions } = useListItemContext();
    const actions = actionsProp ?? contextActions;

    if (children == null && (!actions || actions.length === 0)) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(styles.actions, listStyles.actions, className)}
        data-actions
        {...props}
      >
        {children ??
          actions?.map((action, i) => {
            const key = React.isValidElement(action) ? i : (action as ListActionDef).title || i;
            return React.isValidElement(action) ? (
              <React.Fragment key={key}>{action}</React.Fragment>
            ) : (
              <Tooltip key={key} content={(action as ListActionDef).title} position="top">
                <button
                  type="button"
                  className={cn(styles.action, listStyles.action)}
                  aria-label={(action as ListActionDef).title}
                  onClick={(action as ListActionDef).onClick}
                >
                  {(action as ListActionDef).icon}
                </button>
              </Tooltip>
            );
          })}
      </div>
    );
  },
);
Actions.displayName = "List.Actions";
markListItemSlot(Actions, () => "trailing");

export { Actions };
