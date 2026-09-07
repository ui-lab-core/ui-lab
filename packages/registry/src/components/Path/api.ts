import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  customTypes: {
    PathStyleSlots: {
      name: "PathStyleSlots",
      summary: "Style overrides for the Path root and named component parts.",
      type: "{ root?: Style; list?: Style; separator?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the root nav element.",
        },
        {
          name: "list",
          type: "Style",
          required: false,
          description: "Styles the ordered list element.",
        },
        {
          name: "separator",
          type: "Style",
          required: false,
          description: "Styles each separator rendered between items.",
        },
      ],
    },
    PathStylesProp: {
      name: "PathStylesProp",
      summary: "Style overrides accepted by Path.",
      type: "PathStyleSlots",
      kind: "alias",
    },
    PathItemStyleSlots: {
      name: "PathItemStyleSlots",
      summary: "Style overrides for the Path.Item root.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the rendered anchor, button, or span element.",
        },
      ],
    },
    PathItemStylesProp: {
      name: "PathItemStylesProp",
      summary: "Style overrides accepted by Path.Item.",
      type: "PathItemStyleSlots",
      kind: "alias",
    },
  },

  // Path's root is an Object.assign result, which docgen cannot resolve, so its
  // own props are declared here rather than extracted.
  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      category: "Core",
      description: "Path.Item elements rendered inside the ordered list.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Additional CSS class names applied to the root nav element.",
    },
    {
      name: "separator",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description:
        "Custom separator rendered between path items. Omit to rely on the default spacing with no visible divider.",
    },
    {
      name: "styles",
      type: "PathStylesProp",
      required: false,
      category: "Styling",
      description:
        "Keyed styles for the root and named component parts. Use className for conventional root classes.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the root nav element.",
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name applied to the root nav landmark.",
      defaultValue: '"Path"',
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
      },
    },
  ],

  subComponents: {
    include: (name: string) => name === "Path.Item",
    props: {
      "Path.Item": [
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the rendered anchor, button, or span element.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description:
            "Accessible name for the item's rendered element. Required when the item's content does not provide a discernible text alternative.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
          },
        },
      ],
    },
  },

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Link behavior" },
    { name: "Accessibility" },
  ],

  stateAttributes: [
    {
      name: "data-selected",
      description:
        "Path.Item's rendered element emits true on the current item (the last child) and omits the attribute otherwise.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description:
        "Path.Item's rendered element emits true when disabled and omits the attribute when enabled.",
      values: ["true"],
    },
    {
      name: "data-focused",
      description: "Path.Item's rendered element is focused; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focus-visible",
      description: "Path.Item's rendered element has keyboard-visible focus; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over an interactive, enabled Path.Item; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-pressed",
      description: "An interactive Path.Item is currently pressed; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-path-item-focus-surface",
      description:
        "Marks every Path.Item's rendered element as a focus surface tracked by Path's shared local focus indicator.",
      values: ["true"],
    },
    {
      name: "data-path-list",
      description:
        "Marks the ordered list element that arrow-key navigation and the focus indicator scope to.",
      values: ["true"],
    },
    {
      name: "data-separator",
      description:
        "Set on the ordered list element when a custom separator is supplied; omitted when using the default spacing.",
      values: ["custom"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks Path's local shared focus indicator.",
      values: ["local"],
    },
  ],
} satisfies ComponentAPIEnrichment;
