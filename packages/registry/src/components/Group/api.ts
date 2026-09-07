import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

/**
 * Hand-authored API documentation for Group. The generator merges this over
 * what react-docgen-typescript extracts from the component source.
 */
export const apiEnrichment = {
  customTypes: {
    GroupOrientation: {
      name: "GroupOrientation",
      summary: "Axis that Group arranges its owned items along.",
      type: '"horizontal" | "vertical"',
      kind: "alias",
      values: [
        {
          value: "horizontal",
          description:
            "Items sit side by side, the group takes a fixed control height, and Left and Right arrows move focus between items.",
        },
        {
          value: "vertical",
          description:
            "Items stack in a column, the group grows to fit them, and Up and Down arrows move focus between items.",
        },
      ],
      notes: [
        "A nested Divider that does not set its own orientation adopts the perpendicular axis so it separates the items.",
      ],
    },
    GroupSpacing: {
      name: "GroupSpacing",
      summary: "Named gap step applied between Group's owned items.",
      type: '"none" | "xs" | "sm"',
      kind: "alias",
      values: [
        {
          value: "none",
          description:
            "Removes the gap and the group padding so the items read as one connected surface; only the outer corners of the first and last item are rounded.",
        },
        {
          value: "xs",
          description: "Separates the items by a narrow gap and rounds every item individually.",
        },
        {
          value: "sm",
          description: "Separates the items by a wider gap and rounds every item individually.",
        },
      ],
    },
    GroupItemStyleSlots: {
      name: "GroupItemStyleSlots",
      summary: "Style overrides for the wrapper Group renders around each owned child.",
      type: `{
  root?: Style;
  first?: Style;
  last?: Style;
  divider?: Style;
  grow?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles every item wrapper Group renders around a child.",
        },
        {
          name: "first",
          type: "Style",
          required: false,
          description: "Styles the first item wrapper in the group.",
        },
        {
          name: "last",
          type: "Style",
          required: false,
          description: "Styles the last item wrapper in the group.",
        },
        {
          name: "divider",
          type: "Style",
          required: false,
          description: "Styles an item wrapper whose child is a separator.",
        },
        {
          name: "grow",
          type: "Style",
          required: false,
          description:
            "Styles an item wrapper that stretches because its child requests w-full or flex-1.",
        },
      ],
      notes: [
        "Every slot targets the same kind of element. The positional and role slots apply only to the wrappers that currently match, and they compose with root.",
      ],
    },
    GroupItemStyleValue: {
      name: "GroupItemStyleValue",
      summary: "Shared or keyed styles for Group item wrappers.",
      type: "Style | GroupItemStyleSlots",
      kind: "alias",
      examples: ['item: "rounded-none"', 'item: { first: "pl-2", last: "pr-2" }'],
      notes: [
        "A shared Style value normalizes to item.root, so it reaches every wrapper exactly once. Use the keyed form to address one positional or role slot.",
      ],
    },
    GroupStyleSlots: {
      name: "GroupStyleSlots",
      summary: "Class-based slots for the Group root and its stable compound anatomy.",
      type: `{
  root?: Style;
  item?: GroupItemStyleValue;
  button?: Style;
  input?: Style;
  select?: Style;
  expand?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: 'Styles the role="group" root element, after className.',
        },
        {
          name: "item",
          type: "GroupItemStyleValue",
          required: false,
          description: "Styles every item wrapper and its keyed positional and role anatomy.",
        },
        {
          name: "button",
          type: "Style",
          required: false,
          description: "Styles every Group.Button surface.",
        },
        {
          name: "input",
          type: "Style",
          required: false,
          description: "Styles every Group.Input surface that wraps the nested Input.",
        },
        {
          name: "select",
          type: "Style",
          required: false,
          description: "Styles every Group.Select surface.",
        },
        {
          name: "expand",
          type: "Style",
          required: false,
          description: "Styles every Group.Expand surface that wraps the nested Expand.",
        },
      ],
    },
    GroupStylesProp: {
      name: "GroupStylesProp",
      summary: "Keyed class names for Group anatomy.",
      type: "GroupStyleSlots",
      kind: "alias",
    },
  },

  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description:
        "Controls to group. Group wraps each element child in its own item element; nested fragments are flattened first so every real element becomes its own item.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds classes to the group root after its default classes and before styles.root. The w-full and flex-1 utilities are also forwarded to the focus scope wrapper so root sizing takes effect.",
      links: [
        { label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" },
      ],
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description:
        "Applies inline CSS properties to the group root, including any CSS variables the stylesheet consumes.",
      links: [
        { label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style" },
      ],
    },
    {
      name: "onKeyDown",
      type: "React.KeyboardEventHandler<HTMLDivElement>",
      required: false,
      category: "Events",
      description:
        "Runs alongside Group's arrow-key navigation rather than replacing it. Group only claims the arrow keys that match its orientation.",
      links: [
        {
          label: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event",
        },
      ],
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description:
        'Provides the accessible name for the role="group" root when no visible label identifies it.',
      links: [
        {
          label: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
        },
      ],
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the group's accessible name.",
      links: [
        {
          label: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
        },
      ],
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that describe the group.",
      links: [
        {
          label: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
        },
      ],
    },
  ],

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Accessibility" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable Group anatomy identity on the elements Group itself renders. Group.Button and Group.Select roots are owned by Button and Select, so they keep those components' own slot identities and are targeted through the button and select classes instead.",
      values: ["root", "item", "input", "expand"],
    },
    {
      name: "data-orientation",
      description: "The configured layout and arrow-key axis, always present on the root.",
      values: ["horizontal", "vertical"],
    },
    {
      name: "data-spacing",
      description: "The configured spacing step, always present on the root.",
      values: ["none", "xs", "sm"],
    },
    {
      name: "data-variant",
      description: "The configured variant name on the root; omitted when no variant is supplied.",
    },
    {
      name: "data-disabled",
      description:
        "The root emits true while the group is disabled and omits the attribute otherwise. The root also sets aria-disabled in that state.",
      values: ["true"],
    },
    {
      name: "data-item",
      description:
        "Marks each wrapper Group renders around an owned child. Group.Button uses it to detect an adjacent Group.Input.",
      values: ["true"],
    },
    {
      name: "data-divider",
      description:
        "An item wrapper emits true when its child is a separator and omits the attribute otherwise.",
      values: ["true"],
    },
    {
      name: "data-grow",
      description:
        "An item wrapper emits true when its child requests w-full or flex-1 and omits the attribute otherwise.",
      values: ["true"],
    },
    {
      name: "data-focus-surface",
      description:
        "Marks Group.Button, Group.Input, Group.Select, and Group.Expand as the surfaces the shared group focus ring tracks.",
      values: ["true"],
    },
    {
      name: "data-selected",
      description:
        "Group.Button persistently emits its selected state, resolved from the Group value when the button declares one and from active otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-input",
      description:
        "Marks the Group.Input surface so adjacent Group.Buttons can hand pointer activation to the input.",
      values: ["true"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map((prop: PropDefinition) => {
      if (prop.name === "orientation") return { ...prop, type: "GroupOrientation" };
      if (prop.name === "spacing") return { ...prop, type: "GroupSpacing" };
      if (prop.name === "styles") return { ...prop, type: "GroupStylesProp" };
      return prop;
    }),
  }),
} satisfies ComponentAPIEnrichment;
