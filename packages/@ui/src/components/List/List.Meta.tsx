"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { useListContext, useListItemContext } from "./list.context";
import { ListMetaProps } from "./list.types";
import css from "./List.module.css";
import { markListItemSlot } from "./list.item-layout";

/** Decorative trailing text such as a count, kept out of the interactive actions */
const Meta = React.forwardRef<HTMLDivElement, ListMetaProps>(
  ({ children, className, ...props }, ref) => {
    const { styles: listStyles } = useListContext();
    const { styles: itemStyles } = useListItemContext();

    return (
      <div
        ref={ref}
        className={cn(css.meta, listStyles.item.desc, itemStyles.desc, className)}
        {...props}
        data-slot="item.meta"
      >
        {children}
      </div>
    );
  },
);
Meta.displayName = "List.Meta";
markListItemSlot(Meta, () => "trailing");

export { Meta };
