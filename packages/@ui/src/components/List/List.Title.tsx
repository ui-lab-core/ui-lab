"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useListContext, useListItemContext } from "./list.context";
import { ListTitleProps } from "./list.types";
import css from "./List.module.css";

/** Primary label text in a list item */
const Title = React.forwardRef<HTMLDivElement, ListTitleProps>(
  ({ children, className, ...props }, ref) => {
    const { styles: listStyles } = useListContext();
    const { styles: itemStyles } = useListItemContext();

    return (
      <div
        ref={ref}
        className={cn(css.title, listStyles.item.title, itemStyles.title, className)}
        {...props}
        data-slot="item.title"
      >
        {children}
      </div>
    );
  },
);
Title.displayName = "List.Title";

export { Title };
