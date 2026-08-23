import { Command as CommandBase } from "./Command";
import { CommandInput } from "./Command.Input";
import {
  CommandCategory,
  CommandDescription,
  CommandFooter,
  CommandGroups,
  CommandItem,
  CommandLabel,
  CommandList,
} from "./Command.Items";
import { CommandRoot } from "./Command.Root";
import { CommandTrigger } from "./Command.Trigger";

const Command = Object.assign(CommandBase, {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Item: CommandItem,
  Label: CommandLabel,
  Description: CommandDescription,
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
  CommandItemStyleSlots,
  CommandGroupsStyleSlots,
  CommandStyleSlots,
  CommandStylesProp,
} from "./Command.shared";
export { scoreCommandRelevance, useCommandContext } from "./Command.shared";
export type { CommandInputProps } from "./Command.Input";
export type {
  CommandListProps,
  CommandItemProps,
  CommandLabelProps,
  CommandDescriptionProps,
  CommandCategoryProps,
  CommandFooterProps,
  CommandGroupsProps,
} from "./Command.Items";
export type { CommandTriggerProps } from "./Command.Trigger";
export {
  Command,
  CommandRoot,
  CommandInput,
  CommandList,
  CommandItem,
  CommandLabel,
  CommandDescription,
  CommandCategory,
  CommandFooter,
  CommandGroups,
  CommandTrigger,
};
