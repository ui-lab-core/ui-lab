import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  customTypes: {
    ButtonSize: {
      name: "ButtonSize",
      summary: "An open string type used to select a button size class.",
      type: "string & {}",
      kind: "alias",
      notes: ["Known stylesheet sizes are accepted without preventing custom size names."],
    },
    ButtonIconSlots: {
      name: "ButtonIconSlots",
      summary: "Icon content rendered on either side of the button label.",
      type: "{ left?: React.ReactNode; right?: React.ReactNode }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered before the button label.",
        },
        {
          name: "right",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered after the button label.",
        },
      ],
    },
    ButtonStyleSlots: {
      name: "ButtonStyleSlots",
      summary: "Style overrides for the button root and named content slots.",
      type: `{
  root?: SlotStyle;
  icon?: SlotStyle | ButtonIconStyleSlots;
  hint?: SlotStyle;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the root element.",
        },
        {
          name: "icon",
          type: "SlotStyle | ButtonIconStyleSlots",
          required: false,
          description: "Shared or side-specific icon styles.",
        },
        {
          name: "hint",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the hint badge.",
        },
      ],
    },
    ButtonIconStyleSlots: {
      name: "ButtonIconStyleSlots",
      summary: "Side-specific styles used when the icon slot is configured as an object.",
      type: `{
  left?: SlotStyle;
  right?: SlotStyle;
}`,
      kind: "interface",
      members: [
        {
          name: "left",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the leading icon.",
        },
        {
          name: "right",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the trailing icon.",
        },
      ],
    },
    HintValue: {
      name: "HintValue",
      summary: "Content displayed as a compact button hint or keyboard shortcut.",
      type: "React.ReactNode | React.ReactNode[]",
      kind: "alias",
      examples: ['hint="Esc"', 'hint={["Ctrl", "K"]}'],
      notes: ["Arrays render as shortcut segments joined by a plus divider."],
    },
  },

  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description:
        "Button label and content. Text content determines the accessible name and, together with icon, whether Button infers icon-only sizing.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds conventional classes to the root button or anchor after its default classes and before styles.root.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the root element after styles.root inline styles.",
    },
    {
      name: "onClick",
      type: "React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>",
      required: false,
      category: "Events",
      description: "Native click handler composed with onPress. Disabled buttons do not invoke it.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" },
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      required: false,
      category: "Forms",
      description:
        "Native submission behavior for the button-element branch. Has no effect when Button renders as an anchor.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type" },
    },
    {
      name: "name",
      type: "string",
      required: false,
      category: "Forms",
      description:
        "Form field name submitted with value when Button renders as a native button inside a form.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#name" },
    },
    {
      name: "value",
      type: "string",
      required: false,
      category: "Forms",
      description:
        "Form value submitted with name when Button renders as a native button inside a form.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#value" },
    },
    {
      name: "rel",
      type: "string",
      required: false,
      category: "Link behavior",
      description:
        "Relationship applied to the anchor variant. Defaults to noopener noreferrer when target is _blank and rel is not supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel" },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name for the button, required when it renders icon-only content.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
      },
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the button's accessible name.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
      },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that describe the button.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
      },
    },
    {
      name: "autoFocus",
      type: "boolean",
      required: false,
      category: "Accessibility",
      description: "Requests focus for the root element when it mounts.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus",
      },
    },
  ],

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Forms" },
    { name: "Accessibility" },
    { name: "Link behavior" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable anatomy identity on the root, icon.left, icon.right, and hint elements.",
      values: ["root", "icon.left", "icon.right", "hint"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over the button, or the visual hover state is forced.",
      values: ["true", "false"],
    },
    {
      name: "data-pressed",
      description: "The button is currently pressed.",
      values: ["true", "false"],
    },
    { name: "data-focused", description: "The button is focused.", values: ["true", "false"] },
    {
      name: "data-focus-visible",
      description: "The button has keyboard-visible focus.",
      values: ["true", "false"],
    },
    { name: "data-disabled", description: "The button is disabled.", values: ["true"] },
    { name: "data-hint", description: "Hint content is present.", values: ["true"] },
    {
      name: "data-icon-only",
      description: "The button is rendered with icon-only sizing.",
      values: ["true"],
    },
    { name: "data-variant", description: "The resolved variant name." },
    { name: "data-size", description: "The resolved size name." },
  ],

  refine: (api) => ({
    ...api,
    // resolveButtonIcon is a plain exported helper, not a compound component; docgen's
    // component heuristic misidentifies it because it takes one object-shaped argument.
    subComponents: undefined,
  }),
} satisfies ComponentAPIEnrichment;
