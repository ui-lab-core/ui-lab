"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useListContext, useListItemContext } from "./list.context";
import { ListDescProps } from "./list.types";
import css from "./List.module.css";

/** Secondary description text below the list item label */
const Desc = React.forwardRef<HTMLDivElement, ListDescProps>(
  ({ children, className, ...props }, ref) => {
    const { styles: listStyles } = useListContext();
    const { styles: itemStyles } = useListItemContext();

    return (
      <div
        ref={ref}
        className={cn(css.desc, listStyles.item.desc, itemStyles.desc, className)}
        {...props}
        data-slot="item.desc"
      >
        {children}
      </div>
    );
  },
);
Desc.displayName = "List.Desc";

export { Desc };
