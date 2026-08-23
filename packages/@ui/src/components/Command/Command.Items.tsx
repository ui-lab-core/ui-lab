import * as React from "react";
import type { Key } from "react-aria";
import { cn } from "@/lib/utils";
import { Badge } from "../Badge";
import { Frame } from "../Frame";
import { List } from "../List";
import { Scroll } from "../Scroll";
import css from "./Command.module.css";
import { type CommandItem as CommandItemData, useCommandContext } from "./Command.shared";

/** Props for the scrollable command list and its empty state. */
export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Message rendered when the list has no children.
   * @category Content
   * @default "No items found."
   */
  emptyMessage?: string;
  /** Maximum height applied to the list scroller in addition to the palette's available-height constraint.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/max-height
   */
  maxHeight?: string;
}

/** Scrollable listbox for command items, with an optional empty-state message. */
export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ children, emptyMessage = "No items found.", className, maxHeight, ...props }, ref) => {
    const { scrollableRef, focusedKey, styles } = useCommandContext();
    return (
        <Frame {...props} edges="top" strokeAlign="outside" className={cn("options", css.inner, styles["inner.root"], className)} data-slot="inner">
        <Scroll
          ref={ref}
          viewportRef={scrollableRef}
          className={css.list}
          maxHeight={maxHeight}
          fade-y
        >
          <List
            className={cn("options", styles["list.root"])}
            aria-label="Commands"
            data-slot="list"
            highlighted={focusedKey as string | number | null}
          >
            {!children ? <div className={cn("empty", css.empty, styles["empty.root"])} data-slot="empty">{emptyMessage}</div> : children}
          </List>
        </Scroll>
      </Frame>
    );
  },
);
CommandList.displayName = "Command.List";

/** Props for a selectable command option. */
export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Stable key used for highlight tracking and action lookup.
   * @category Core
   */
  value: Key;
  /** Searchable text registered with the command engine.
   * @category Core
   */
  textValue: string;
  /** Runs when the item is clicked or selected with Enter. Promise results are not awaited.
   * @category Events
   */
  action: () => void | Promise<void>;
  /** Icon rendered before the item content.
   * @category Content
   */
  icon?: React.ReactNode;
  /** Compact badge rendered after the item content.
   * @category Content
   */
  hint?: string;
}

/**
 * Selectable command option registered with the nearest Command context. It
 * emits data-highlighted as "true" or "false" and exposes option semantics.
 */
export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ value, textValue, action, icon, children, className, hint, onClick, ...props }, ref) => {
    const { focusedKey, registerItem, unregisterItem, actionRef, close, styles } = useCommandContext();
    React.useEffect(() => {
      registerItem(value, textValue);
      actionRef.current.set(value, action);
      return () => {
        unregisterItem(value);
        actionRef.current.delete(value);
      };
    }, [value, textValue, action, registerItem, unregisterItem, actionRef]);
    const isHighlighted = focusedKey === value;
    return (
      <div
        ref={ref}
        {...props}
        data-highlighted={isHighlighted ? "true" : "false"}
        role="option"
        aria-selected={isHighlighted}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          action();
          close();
        }}
        className={cn("item", css.item, className, styles["item.root"])}
        data-slot="item.root"
      >
        <div className={cn("content", css["item-content"], styles["item.content"])} data-slot="item.content">
          {icon && <List.Media className={cn("icon", css["item-icon"], styles["item.icon"])} data-slot="item.icon">{icon}</List.Media>}
          {children}
        </div>
        {hint && (
          <Badge variant="secondary" className={cn("hint", css["hint-wrapper"], styles["item.hint"])} data-slot="item.hint">
            {hint}
          </Badge>
        )}
      </div>
    );
  },
);
CommandItem.displayName = "Command.Item";

/** Props forwarded to the primary text element within a command item. */
export interface CommandLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Primary text rendered within a command item. */
export const CommandLabel = React.forwardRef<HTMLDivElement, CommandLabelProps>(
  ({ children, className, ...props }, ref) => {
    const { styles } = useCommandContext();
    return (
      <div ref={ref} {...props} className={cn("label", css.label, className, styles["item.label"])} data-slot="item.label">
        {children}
      </div>
    );
  },
);
CommandLabel.displayName = "Command.Label";

/** Props forwarded to the supplemental text element within a command item. */
export interface CommandDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Supplemental text rendered within a command item. */
export const CommandDescription = React.forwardRef<HTMLDivElement, CommandDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    const { styles } = useCommandContext();
    return (
      <div ref={ref} {...props} className={cn("description", css.description, className, styles["item.description"])} data-slot="item.description">
        {children}
      </div>
    );
  },
);
CommandDescription.displayName = "Command.Description";

/** Props forwarded to a command category header element. */
export interface CommandCategoryProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Category header for a group of command items. */
export const CommandCategory = React.forwardRef<HTMLDivElement, CommandCategoryProps>(
  ({ children, className, ...props }, ref) => {
    const { styles } = useCommandContext();
    return <div ref={ref} {...props} className={cn("category", css["category-header"], className, styles["category.root"])} data-slot="category">
      {children}
    </div>;
  },
);
CommandCategory.displayName = "Command.Category";

/** Props forwarded to the command footer element. */
export interface CommandFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Footer content rendered after the command list or groups. */
export const CommandFooter = React.forwardRef<HTMLDivElement, CommandFooterProps>(
  ({ children, className, ...props }, ref) => {
    const { styles } = useCommandContext();
    return <div ref={ref} {...props} className={cn("footer", css.footer, className, styles["footer.root"])} data-slot="footer">
      {children}
    </div>;
  },
);
CommandFooter.displayName = "Command.Footer";

/** Props for rendering filtered declarative commands by category. */
export interface CommandGroupsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Renders a header for each category, including undefined for uncategorized commands.
   * @category Content
   */
  renderCategory?: (category: string | undefined) => React.ReactNode;
  /** Renders each filtered command and receives its optional hint.
   * @category Content
   * @typeDoc CommandItem
   */
  renderItem: (command: CommandItemData, hint?: string) => React.ReactNode;
}

/** Renders the filtered declarative command collection grouped by category. */
export const CommandGroups = React.forwardRef<HTMLDivElement, CommandGroupsProps>(
  ({ renderCategory, renderItem, className, ...props }, ref) => {
    const { groupedItems, styles } = useCommandContext();
    return (
      <div ref={ref} {...props} className={cn("groups", className, styles["groups.root"])} data-slot="groups.root">
        {groupedItems.map(({ category, items }) => (
          <div key={category || "uncategorized"} className={cn("group", "options", styles["groups.group"])} data-slot="groups.group">
            {renderCategory?.(category)}
            {items.map((command) => (
              <React.Fragment key={command.id}>{renderItem(command, command.hint)}</React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  },
);
CommandGroups.displayName = "Command.Groups";
