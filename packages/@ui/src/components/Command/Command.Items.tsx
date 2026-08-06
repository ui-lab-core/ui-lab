import * as React from "react";
import type { Key } from "react-aria";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Badge } from "../Badge";
import { Card } from "../Card";
import { Frame } from "../Frame";
import { List } from "../List";
import { Scroll } from "../Scroll";
import styles from "./Command.module.css";
import { type CommandItem as CommandItemData, useCommandContext } from "./Command.shared";

export interface CommandListProps { children?: React.ReactNode; emptyMessage?: string; className?: string; maxHeight?: string; }
export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(({ children, emptyMessage = "No items found.", className, maxHeight = "44dvh" }, ref) => {
  const { scrollableRef, focusedKey } = useCommandContext();
  return <Frame edges="top" strokeAlign="outside" className={cn(styles.inner, className)}><Scroll ref={useMergeRefs(ref, scrollableRef)} className={styles.list} maxHeight={maxHeight} fade-y><List aria-label="Commands" highlighted={focusedKey as string | number | null}>{!children ? <div className={styles.empty}>{emptyMessage}</div> : children}</List></Scroll></Frame>;
});
CommandList.displayName = "Command.List";

export interface CommandItemProps { value: Key; textValue: string; action: () => void | Promise<void>; icon?: React.ReactNode; children?: React.ReactNode; className?: string; hint?: string; }
export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(({ value, textValue, action, icon, children, className, hint }, ref) => {
  const { focusedKey, registerItem, unregisterItem, actionRef, close } = useCommandContext();
  React.useEffect(() => { registerItem(value, textValue); actionRef.current.set(value, action); return () => { unregisterItem(value); actionRef.current.delete(value); }; }, [value, textValue, action, registerItem, unregisterItem, actionRef]);
  const isHighlighted = focusedKey === value;
  return <div ref={ref} data-highlighted={isHighlighted} role="option" aria-selected={isHighlighted} onClick={() => { action(); close(); }} className={cn("item", styles.item, className)}><div className={styles["item-content"]}>{icon && <List.Media className={styles["item-icon"]}>{icon}</List.Media>}{children}</div>{hint && <Badge variant="secondary" className={styles["hint-wrapper"]}>{hint}</Badge>}</div>;
});
CommandItem.displayName = "Command.Item";

export interface CommandCategoryProps { children?: React.ReactNode; className?: string; }
export const CommandCategory = React.forwardRef<HTMLDivElement, CommandCategoryProps>(({ children, className }, ref) => <div ref={ref} className={cn(styles["category-header"], className)}>{children}</div>);
CommandCategory.displayName = "Command.Category";

export interface CommandFooterProps { children?: React.ReactNode; className?: string; }
export const CommandFooter = React.forwardRef<HTMLDivElement, CommandFooterProps>(({ children, className }, ref) => <Card.Footer ref={ref} className={cn(styles.footer, className)}>{children}</Card.Footer>);
CommandFooter.displayName = "Command.Footer";

export interface CommandGroupsProps { renderCategory?: (category: string | undefined) => React.ReactNode; renderItem: (command: CommandItemData, hint?: string) => React.ReactNode; className?: string; }
export const CommandGroups = React.forwardRef<HTMLDivElement, CommandGroupsProps>(({ renderCategory, renderItem, className }, ref) => {
  const { groupedItems } = useCommandContext();
  return <div ref={ref} className={className}>{groupedItems.map(({ category, items }) => <div key={category || "uncategorized"}>{renderCategory?.(category)}{items.map((command) => <React.Fragment key={command.id}>{renderItem(command, command.hint)}</React.Fragment>)}</div>)}</div>;
});
CommandGroups.displayName = "Command.Groups";
