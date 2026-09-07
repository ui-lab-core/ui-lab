import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

const radioInheritedProps = (component: "Radio" | "Radio.Item"): PropDefinition[] => [
  {
    name: "disabled",
    type: "boolean",
    required: false,
    category: "Core",
    description:
      component === "Radio"
        ? "Disables interaction and native focus while applying disabled styling."
        : "Disables interaction for this item only. Falls back to the disabled value set on the parent Radio.Group.",
    tags: {
      default: "false",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled",
      see: "https://react-spectrum.adobe.com/react-aria/useRadio.html",
    },
  },
  {
    name: "onChange",
    type: "React.ChangeEventHandler<HTMLInputElement>",
    required: false,
    category: "Events",
    description:
      component === "Radio"
        ? "Runs after native pointer or keyboard interaction selects the radio. Disabled radios do not invoke it."
        : "Runs after native pointer or keyboard interaction selects this item. Prefer Radio.Group's onValueChange for group-level selection.",
    tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event" },
  },
  {
    name: "className",
    type: "string",
    required: false,
    category: "Styling",
    description: "Classes applied to the radio circle after its default classes.",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    required: false,
    category: "Styling",
    description: "Inline CSS properties applied to the radio circle.",
  },
  {
    name: "name",
    type: "string",
    required: false,
    category: "Forms",
    description: "Form field name submitted when this radio is selected.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#name",
    },
  },
  {
    name: "required",
    type: "boolean",
    required: false,
    category: "Forms",
    description: "Requires a selection in this radio's native form group before submission succeeds.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required",
    },
  },
  {
    name: "aria-label",
    type: "string",
    required: false,
    category: "Accessibility",
    description:
      component === "Radio"
        ? "Accessible name used when no visible label is rendered."
        : 'Accessible name used when no visible label is rendered. Falls back to "Radio option {value}" with a development console warning.',
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
    },
  },
  {
    name: "aria-labelledby",
    type: "string",
    required: false,
    category: "Accessibility",
    description: "References element IDs that provide this radio's accessible name.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
    },
  },
  {
    name: "aria-describedby",
    type: "string",
    required: false,
    category: "Accessibility",
    description: "References additional descriptive elements for this radio.",
    tags: {
      mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
    },
  },
];

const groupInheritedProps: PropDefinition[] = [
  {
    name: "id",
    type: "string",
    required: false,
    category: "Advanced",
    description:
      "ID applied to the group root, useful for external aria-describedby or aria-labelledby references.",
    tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id" },
  },
];

/** Docgen extracts "styles", "size", and "state" with their structural type; this restores the alias names. */
const normalizePropType = (componentName: string, prop: PropDefinition): PropDefinition => {
  if (prop.name === "styles") {
    return { ...prop, type: componentName === "Radio.Group" ? "RadioGroupStylesProp" : "RadioStylesProp" };
  }
  if (prop.name === "size") return { ...prop, type: "RadioSize" };
  if (prop.name === "state") {
    return { ...prop, type: componentName === "Radio.Group" ? "RadioGroupState" : "RadioState" };
  }
  return prop;
};

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by Radio class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    RadioSize: {
      name: "RadioSize",
      summary: "Radio button size.",
      type: '"sm" | "md" | "lg"',
      kind: "alias",
      values: [
        { value: "sm", description: "Renders a 1rem circle with a small inner dot." },
        { value: "md", description: "Renders a 1.25rem circle with a medium inner dot." },
        { value: "lg", description: "Renders a 1.5rem circle with a large inner dot." },
      ],
    },
    RadioState: {
      name: "RadioState",
      summary: "Controlled state supplied to standalone Radio.",
      type: "{ checked?: boolean }",
      kind: "interface",
      members: [
        {
          name: "checked",
          type: "boolean",
          required: false,
          description: "Controlled checked value. The caller updates it in response to onChange.",
        },
      ],
    },
    RadioGroupState: {
      name: "RadioGroupState",
      summary: "Controlled state supplied to Radio.Group.",
      type: "{ value?: string }",
      kind: "interface",
      members: [
        {
          name: "value",
          type: "string",
          required: false,
          description:
            "Controlled selected value. Each render reflects this value until onValueChange requests a change.",
        },
      ],
    },
    RadioStyleSlots: {
      name: "RadioStyleSlots",
      summary:
        "Named class-based styling targets for the Radio anatomy, shared by the standalone Radio and Radio.Item.",
      type: `{
  root?: Style;
  item?: Style;
  input?: Style;
  dot?: Style;
  label?: Style;
  description?: Style;
  helperText?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: 'Styles the radio circle (data-slot="root"), the visible control surface.',
        },
        {
          name: "item",
          type: "Style",
          required: false,
          description:
            "Styles the outer row containing the circle, label, description, and helper text.",
        },
        {
          name: "input",
          type: "Style",
          required: false,
          description: "Styles the native radio input.",
        },
        {
          name: "dot",
          type: "Style",
          required: false,
          description: "Styles the inner dot shown when selected.",
        },
        {
          name: "label",
          type: "Style",
          required: false,
          description: "Styles the visible label associated with the native input.",
        },
        {
          name: "description",
          type: "Style",
          required: false,
          description: "Styles the secondary description below the label.",
        },
        {
          name: "helperText",
          type: "Style",
          required: false,
          description: "Styles the helper or validation message below the row.",
        },
      ],
    },
    RadioStylesProp: {
      name: "RadioStylesProp",
      summary: "Class-based style overrides accepted by Radio and Radio.Item.",
      type: "StylesProp<RadioStyleSlots>",
      kind: "alias",
    },
    RadioGroupStyleSlots: {
      name: "RadioGroupStyleSlots",
      summary: "Named class-based styling targets for the Radio.Group anatomy.",
      type: `{
  root?: Style;
  label?: Style;
  description?: Style;
  group?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: 'Styles the outer group container (data-slot="root").',
        },
        {
          name: "label",
          type: "Style",
          required: false,
          description: "Styles the group's visible label.",
        },
        {
          name: "description",
          type: "Style",
          required: false,
          description: "Styles the descriptive text below the group label.",
        },
        {
          name: "group",
          type: "Style",
          required: false,
          description: "Styles the container wrapping the group's Radio.Item children.",
        },
      ],
    },
    RadioGroupStylesProp: {
      name: "RadioGroupStylesProp",
      summary: "Class-based style overrides accepted by Radio.Group.",
      type: "StylesProp<RadioGroupStyleSlots>",
      kind: "alias",
    },
  },

  props: radioInheritedProps("Radio"),

  subComponents: {
    props: {
      "Radio.Item": radioInheritedProps("Radio.Item"),
      "Radio.Group": groupInheritedProps,
    },
  },

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Forms" },
    { name: "Accessibility" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable anatomy identity on the matching Radio element. Radio.Group additionally emits it on its label, description, and items container.",
      values: ["item", "root", "dot", "input", "label", "description", "helperText", "group"],
    },
    {
      name: "data-selected",
      description: "The circle emits true when checked or selected and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-disabled",
      description:
        "The row, circle, and visible label emit true when disabled and omit the attribute when enabled.",
      values: ["true"],
    },
    {
      name: "data-error",
      description:
        "The circle and description emit true when error marks the radio invalid and omit it otherwise.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "The circle persistently emits true while an enabled radio is hovered and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-pressed",
      description: "The circle persistently emits true while an enabled radio is pressed and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-focused",
      description:
        "The focus surface wrapping the circle and native input persistently emits true while the native input is focused and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-focus-visible",
      description:
        "The focus surface persistently emits true while focus is keyboard-visible and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-radio-focus-surface",
      description: "Marks the wrapper around the circle and native input as the focus surface used by Radio's local focus indicator.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks Radio's local shared focus indicator.",
      values: ["local"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map((prop) => normalizePropType("Radio", prop)),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name,
            { ...component, props: component.props.map((prop) => normalizePropType(name, prop)) },
          ]),
        )
      : undefined,
  }),
} satisfies ComponentAPIEnrichment;
