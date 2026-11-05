"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { useListContext, useListItemContext } from "./list.context";
import { ListMediaProps } from "./list.types";
import css from "./List.module.css";
import { markListItemSlot } from "./list.item-layout";

/** Slot sub-component for media content in a list item */
const Media = React.forwardRef<HTMLDivElement, ListMediaProps>(
  ({ children, className, size = 32, style, ...props }, ref) => {
    const { styles: listStyles } = useListContext();
    const { styles: itemStyles } = useListItemContext();

    return (
      <div
        ref={ref}
        className={cn(css.media, listStyles.item.media, itemStyles.media, className)}
        {...props}
        data-slot="item.media"
        style={{ "--media-size": `${size}px`, ...style } as React.CSSProperties}
      >
        {children}
      </div>
    );
  },
);
Media.displayName = "List.Media";
markListItemSlot(Media, () => "leading");

export { Media };
