import { Command as CommandBase } from "./Command";
import { CommandInput } from "./Command.Input";
import {
  CommandCategory,
  CommandFooter,
  CommandGroups,
  CommandItem,
  CommandList,
} from "./Command.Items";
import { CommandRoot } from "./Command.Root";
import { CommandTrigger } from "./Command.Trigger";

const Command = Object.assign(CommandBase, {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Item: CommandItem,
  Category: CommandCategory,
  Footer: CommandFooter,
  Groups: CommandGroups,
  Trigger: CommandTrigger,
});

export type { CommandProps, CommandState, UseCommandStateProps } from "./Command";
export { useCommandState } from "./Command";
export type { CommandRootProps } from "./Command.Root";
export type {
  CommandItem,
  CommandGroupedItems,
  CommandStyleSlots,
  CommandStylesProp,
} from "./Command.shared";
export { scoreCommandRelevance, useCommandContext } from "./Command.shared";
export type { CommandInputProps } from "./Command.Input";
export type {
  CommandListProps,
  CommandItemProps,
  CommandCategoryProps,
  CommandFooterProps,
  CommandGroupsProps,
} from "./Command.Items";
export type { CommandTriggerProps } from "./Command.Trigger";
export { Command };
