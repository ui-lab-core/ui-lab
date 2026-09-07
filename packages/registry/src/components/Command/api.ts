import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  customTypes: {
    CommandState: {
      name: "CommandState",
      summary:
        "Imperative open state and trigger registration shared by Command and Command.Trigger.",
      type: "{ isOpen: boolean; setOpen: (open: boolean) => void; open: () => void; close: () => void; toggle: () => void; setTrigger: (element: HTMLElement | null) => void; triggerRef: React.MutableRefObject<HTMLElement | null> }",
      kind: "interface",
      members: [
        {
          name: "isOpen",
          type: "boolean",
          required: true,
          description: "Whether the command palette is currently open.",
        },
        {
          name: "setOpen",
          type: "(open: boolean) => void",
          required: true,
          description: "Sets the command palette to an explicit open state.",
        },
        {
          name: "open",
          type: "() => void",
          required: true,
          description: "Opens the command palette.",
        },
        {
          name: "close",
          type: "() => void",
          required: true,
          description: "Closes the command palette.",
        },
        {
          name: "toggle",
          type: "() => void",
          required: true,
          description: "Toggles the current open state.",
        },
        {
          name: "setTrigger",
          type: "(element: HTMLElement | null) => void",
          required: true,
          description:
            "Registers the trigger element that receives focus after the floating palette closes.",
        },
        {
          name: "triggerRef",
          type: "React.MutableRefObject<HTMLElement | null>",
          required: true,
          description: "Mutable reference to the registered trigger element.",
        },
      ],
      notes: [
        "Pass the same state instance to Command and Command.Trigger so opening and focus restoration remain coordinated.",
      ],
    },
    CommandStyleSlots: {
      name: "CommandStyleSlots",
      summary: "Style overrides for the command surface and its named compound parts.",
      type: `{
  root?: Style;
  overlay?: Style;
  search?: Style;
  input?: Style;
  inner?: Style;
  list?: Style;
  empty?: Style;
  item?: CommandItemStyleSlots;
  category?: Style;
  footer?: Style;
  groups?: CommandGroupsStyleSlots;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles applied to the command surface.",
        },
        {
          name: "overlay",
          type: "Style",
          required: false,
          description: "Styles applied to the modal backdrop in floating mode.",
        },
        {
          name: "search",
          type: "Style",
          required: false,
          description: "Styles applied to the search input wrapper.",
        },
        {
          name: "input",
          type: "Style",
          required: false,
          description: "Styles applied to the search input root.",
        },
        {
          name: "inner",
          type: "Style",
          required: false,
          description: "Styles applied to the framed list container.",
        },
        {
          name: "list",
          type: "Style",
          required: false,
          description:
            "Styles the List primitive rendered inside Command.List, not its scroller frame.",
        },
        {
          name: "empty",
          type: "Style",
          required: false,
          description: "Styles applied to the empty-state message.",
        },
        {
          name: "item",
          type: "CommandItemStyleSlots",
          required: false,
          description: "Styles the Command.Item anatomy.",
        },
        {
          name: "category",
          type: "Style",
          required: false,
          description: "Styles applied to category headers.",
        },
        {
          name: "footer",
          type: "Style",
          required: false,
          description: "Styles applied to the command footer.",
        },
        {
          name: "groups",
          type: "CommandGroupsStyleSlots",
          required: false,
          description: "Styles the Command.Groups container and its category groups.",
        },
      ],
    },
    CommandItemStyleSlots: {
      name: "CommandItemStyleSlots",
      summary: "Style overrides for the stable anatomy rendered by Command.Item.",
      type: `{
  root?: Style;
  content?: Style;
  icon?: Style;
  hint?: Style;
  label?: Style;
  description?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the option element." },
        {
          name: "content",
          type: "Style",
          required: false,
          description: "Styles the wrapper containing the icon and item content.",
        },
        { name: "icon", type: "Style", required: false, description: "Styles the icon container." },
        {
          name: "hint",
          type: "Style",
          required: false,
          description: "Styles the trailing hint badge.",
        },
        {
          name: "label",
          type: "Style",
          required: false,
          description: "Styles Command.Label within the item.",
        },
        {
          name: "description",
          type: "Style",
          required: false,
          description: "Styles Command.Description within the item.",
        },
      ],
    },
    CommandGroupsStyleSlots: {
      name: "CommandGroupsStyleSlots",
      summary: "Style overrides for the stable anatomy rendered by Command.Groups.",
      type: `{
  root?: Style;
  group?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the Command.Groups container.",
        },
        {
          name: "group",
          type: "Style",
          required: false,
          description: "Styles each category group.",
        },
      ],
    },
    CommandItem: {
      name: "CommandItem",
      summary:
        "Declarative command data consumed by filtering, grouping, focus management, and Command.Groups.",
      type: "{ id: string; label: string; description?: string; category?: string; shortcut?: string; icon?: React.ReactNode; keywords?: string[]; action: () => void | Promise<void>; hint?: string }",
      kind: "interface",
      members: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Stable identifier used for rendering, focus tracking, and action lookup.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          description: "Primary searchable label for the command.",
        },
        {
          name: "description",
          type: "string",
          required: false,
          description: "Supplemental description available to custom item renderers.",
        },
        {
          name: "category",
          type: "string",
          required: false,
          description: "Group name used by Command.Groups.",
        },
        {
          name: "shortcut",
          type: "string",
          required: false,
          description: "Keyboard shortcut text available to custom item renderers.",
        },
        {
          name: "icon",
          type: "React.ReactNode",
          required: false,
          description: "Icon content available to custom item renderers.",
        },
        {
          name: "keywords",
          type: "string[]",
          required: false,
          description: "Additional terms considered when ranking a search query.",
        },
        {
          name: "action",
          type: "() => void | Promise<void>",
          required: true,
          description: "Action invoked when this command is selected.",
        },
        {
          name: "hint",
          type: "string",
          required: false,
          description: "Compact hint text passed to the Command.Groups item renderer.",
        },
      ],
      examples: [
        'items={[{ id: "settings", label: "Settings", category: "Navigation", action: openSettings }]}',
      ],
      notes: [
        "Filtering preserves the supplied item objects, then query relevance orders matches by label and keywords.",
      ],
    },
  },

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Items" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Accessibility" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable anatomy identity. The command surface emits root; compound parts emit their matching slot path.",
      values: [
        "root",
        "overlay",
        "search",
        "input",
        "inner",
        "list",
        "empty",
        "item.root",
        "item.content",
        "item.icon",
        "item.hint",
        "item.label",
        "item.description",
        "category",
        "footer",
        "groups.root",
        "groups.group",
      ],
    },
    {
      name: "data-state",
      description:
        "The floating overlay transition state. Command omits the overlay in embedded mode.",
      values: ["entering", "entered", "exiting"],
    },
    {
      name: "data-highlighted",
      description:
        "Each Command.Item emits true when it is the keyboard-highlighted option and false otherwise.",
      values: ["true", "false"],
    },
  ],
} satisfies ComponentAPIEnrichment;
