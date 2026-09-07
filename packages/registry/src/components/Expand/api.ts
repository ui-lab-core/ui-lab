import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

/**
 * Hand-authored API documentation for Expand. The generator merges this over
 * what react-docgen-typescript extracts from the component source.
 */

const rootInheritedProps: PropDefinition[] = [
  {
    name: "className",
    type: "string",
    required: false,
    category: "Styling",
    description:
      "Adds conventional classes to the root expand container after its default classes and before styles.root.",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    required: false,
    category: "Styling",
    description: "Applies inline styles to the root expand container.",
  },
  {
    name: "aria-label",
    type: "string",
    required: false,
    category: "Accessibility",
    description:
      "Accessible name applied to the root container. Does not replace the trigger's own accessible name.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
    },
  },
  {
    name: "aria-labelledby",
    type: "string",
    required: false,
    category: "Accessibility",
    description: "References element IDs that label the root container.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
    },
  },
  {
    name: "aria-describedby",
    type: "string",
    required: false,
    category: "Accessibility",
    description: "References element IDs that describe the root container.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
    },
  },
];

const triggerInheritedProps: PropDefinition[] = [
  {
    name: "className",
    type: "string",
    required: false,
    category: "Styling",
    description:
      "Adds classes to the trigger button after its default classes and before the root styles.trigger value.",
  },
  {
    name: "onClick",
    type: "React.MouseEventHandler<HTMLButtonElement>",
    required: false,
    category: "Events",
    description:
      "Native click handler composed with the internal toggle press handler. Disabled triggers do not invoke it.",
    tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" },
  },
  {
    name: "autoFocus",
    type: "boolean",
    required: false,
    category: "Accessibility",
    description: "Requests focus for the trigger button when it mounts.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus",
    },
  },
];

const contentInheritedProps: PropDefinition[] = [
  {
    name: "className",
    type: "string",
    required: false,
    category: "Styling",
    description:
      "Adds classes to the collapsing content panel after its default classes and before the root styles.content value.",
  },
];

const iconInheritedProps: PropDefinition[] = [
  {
    name: "className",
    type: "string",
    required: false,
    category: "Styling",
    description:
      "Adds classes to the icon wrapper after its default classes and before the root styles.icon value.",
  },
];

const normalizeExpandPropType = (componentName: string, prop: PropDefinition) => {
  if (componentName === "Expand" && prop.name === "layout") return { ...prop, type: "ExpandLayout" };
  if (componentName === "Expand.Content" && prop.name === "from")
    return { ...prop, type: "ExpandDirection" };
  return prop;
};

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by Expand class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    ExpandDirection: {
      name: "ExpandDirection",
      summary: "Direction the content panel reveals from relative to the trigger.",
      type: '"below" | "above" | "left" | "right"',
      kind: "alias",
      notes: [
        "Below is the default and is treated as the implicit direction; the root layout and icon rotation update to match.",
      ],
      values: [
        {
          value: "below",
          description:
            "The content panel opens downward beneath the trigger. This is the implicit default.",
        },
        { value: "above", description: "The content panel opens upward above the trigger." },
        { value: "left", description: "The content panel opens to the left of the trigger." },
        { value: "right", description: "The content panel opens to the right of the trigger." },
      ],
    },
    ExpandLayout: {
      name: "ExpandLayout",
      summary:
        "Controls whether Expand supplies its own corner radius or sits flush inside a bordered container.",
      type: '"standalone" | "contained"',
      kind: "alias",
      notes: [
        "contained removes the trigger's corner radius so Expand can sit flush inside an enclosing bordered surface.",
      ],
      values: [
        {
          value: "standalone",
          description: "Expand supplies its own corner radius, suitable as a freestanding surface.",
        },
        {
          value: "contained",
          description:
            "Removes the trigger's corner radius so Expand can sit flush inside an enclosing bordered surface.",
        },
      ],
    },
    ExpandState: {
      name: "ExpandState",
      summary: "Controlled expanded state supplied to Expand.",
      type: "{ expanded?: boolean }",
      kind: "interface",
      members: [
        {
          name: "expanded",
          type: "boolean",
          required: false,
          description: "Controlled expanded value.",
        },
      ],
    },
    ExpandIconStyleSlots: {
      name: "ExpandIconStyleSlots",
      summary:
        "Class-based styling targets for the Expand icon, addressed by collapsed/expanded state.",
      type: "{ collapsed?: Style; expanded?: Style }",
      kind: "interface",
      members: [
        {
          name: "collapsed",
          type: "Style",
          required: false,
          description: "Styles the icon while the panel is collapsed.",
        },
        {
          name: "expanded",
          type: "Style",
          required: false,
          description: "Styles the icon while the panel is expanded.",
        },
      ],
    },
    ExpandContentStyleSlots: {
      name: "ExpandContentStyleSlots",
      summary:
        "Class-based styling targets for the Expand content panel and its padded inner region.",
      type: "{ root?: Style; inner?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the collapsing outer content panel.",
        },
        {
          name: "inner",
          type: "Style",
          required: false,
          description: "Styles the padded region wrapping the panel's children.",
        },
      ],
    },
    ExpandStyleSlots: {
      name: "ExpandStyleSlots",
      summary: "Named style overrides for the Expand root and stable compound anatomy.",
      type: `{
  root?: Style;
  trigger?: Style;
  icon?: Style | ExpandIconStyleSlots;
  title?: Style;
  content?: Style | ExpandContentStyleSlots;
  divider?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the root expand container.",
        },
        {
          name: "trigger",
          type: "Style",
          required: false,
          description: "Styles the trigger button.",
        },
        {
          name: "icon",
          type: "Style | ExpandIconStyleSlots",
          required: false,
          description: "Shared or state-specific styles for the disclosure icon.",
        },
        {
          name: "title",
          type: "Style",
          required: false,
          description: "Styles the trigger's title/label text.",
        },
        {
          name: "content",
          type: "Style | ExpandContentStyleSlots",
          required: false,
          description: "Shared or keyed styles for the content panel and its inner region.",
        },
        {
          name: "divider",
          type: "Style",
          required: false,
          description: "Styles the divider rendered between the trigger and content.",
        },
      ],
    },
    ExpandStylesProp: {
      name: "ExpandStylesProp",
      summary: "Style overrides accepted by Expand.",
      type: "ExpandStyleSlots",
      kind: "alias",
    },
  },

  props: rootInheritedProps,

  subComponents: {
    // useExpandContext, the divider/content type guards, and moveDividersIntoContent
    // are internal helpers, not public subcomponents.
    include: (name: string) => name.startsWith("Expand."),
    props: {
      "Expand.Trigger": triggerInheritedProps,
      "Expand.Content": contentInheritedProps,
      "Expand.Icon": iconInheritedProps,
    },
  },

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Accessibility" },
  ],

  stateAttributes: [
    {
      name: "data-selected",
      description:
        "The root, trigger, icon, and content panel emit true while expanded and omit the attribute while collapsed.",
      values: ["true"],
    },
    {
      name: "data-expanded",
      description:
        "The root, trigger, icon, and content panel emit true while expanded and omit the attribute while collapsed.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description: "The root and trigger emit true when disabled and omit the attribute when enabled.",
      values: ["true"],
    },
    {
      name: "data-layout",
      description: "The configured layout on the root.",
      values: ["standalone", "contained"],
    },
    {
      name: "data-from",
      description:
        "The content panel's configured reveal direction. Omitted for the default below direction.",
      values: ["above", "left", "right"],
    },
    {
      name: "data-focused",
      description: "The trigger is focused; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focus-visible",
      description: "The trigger has keyboard-visible focus; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-pressed",
      description: "The trigger is currently pressed; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over the enabled trigger; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-expand-focus-surface",
      description:
        "Marks the trigger as the focus surface used by Expand's shared local focus indicator.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks Expand's local shared focus indicator.",
      values: ["local"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map((prop) => normalizeExpandPropType("Expand", prop)),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name,
            { ...component, props: component.props.map((prop) => normalizeExpandPropType(name, prop)) },
          ]),
        )
      : undefined,
  }),
} satisfies ComponentAPIEnrichment;
