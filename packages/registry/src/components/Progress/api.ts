import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    SlotStyleObject: {
      name: "SlotStyleObject",
      summary: "Inline CSS properties accepted by a style slot.",
      type: "React.CSSProperties",
      kind: "alias",
    },
    SlotStyleProps: {
      name: "SlotStyleProps",
      summary: "Object form that supplies classes and inline styles to one slot.",
      type: "{ className?: Style; style?: SlotStyleObject }",
      kind: "interface",
      members: [
        {
          name: "className",
          type: "Style",
          required: false,
          description: "Classes applied to the slot element.",
        },
        {
          name: "style",
          type: "SlotStyleObject",
          required: false,
          description: "Inline CSS properties applied to the slot element.",
        },
      ],
    },
    SlotStyle: {
      name: "SlotStyle",
      summary: "A style slot value expressed as classes, inline CSS properties, or both.",
      type: "Style | SlotStyleObject | SlotStyleProps",
      kind: "alias",
      notes: ["A plain object without className or style is treated as inline CSS properties."],
    },
    ProgressLabelStyleSlots: {
      name: "ProgressLabelStyleSlots",
      summary: "Named style overrides for the Progress label anatomy.",
      type: "{ row?: SlotStyle; label?: SlotStyle; value?: SlotStyle }",
      kind: "interface",
      members: [
        {
          name: "row",
          type: "SlotStyle",
          required: false,
          description: "Styles the row that contains the visible label and percentage.",
        },
        {
          name: "label",
          type: "SlotStyle",
          required: false,
          description: "Styles the visible progress label.",
        },
        {
          name: "value",
          type: "SlotStyle",
          required: false,
          description: "Styles the displayed percentage value.",
        },
      ],
    },
    ProgressStyleSlots: {
      name: "ProgressStyleSlots",
      summary: "Named style overrides for the Progress root and stable anatomy.",
      type: "{ root?: SlotStyle; label?: ProgressLabelStyleSlots; track?: SlotStyle; range?: SlotStyle; thumb?: SlotStyle }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyle",
          required: false,
          description: "Styles the root progress container.",
        },
        {
          name: "label",
          type: "ProgressLabelStyleSlots",
          required: false,
          description: "Styles label.row, label.label, and label.value.",
        },
        {
          name: "track",
          type: "SlotStyle",
          required: false,
          description: "Styles the progress track.",
        },
        {
          name: "range",
          type: "SlotStyle",
          required: false,
          description: "Styles the filled progress range.",
        },
        {
          name: "thumb",
          type: "SlotStyle",
          required: false,
          description: "Styles the optional draggable thumb.",
        },
      ],
    },
    ProgressStylesProp: {
      name: "ProgressStylesProp",
      summary: "Style overrides accepted by Progress.",
      type: "ProgressStyleSlots",
      kind: "alias",
    },
  },

  props: [
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds conventional classes to the root progressbar.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the root progressbar after styles.root inline styles.",
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Provides an accessible name and takes precedence over label.",
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
      description: "References visible text that labels the progressbar.",
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
      description: "References additional text that describes the progressbar.",
      links: [
        {
          label: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
        },
      ],
    },
    {
      name: "aria-valuetext",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Supplies a human-readable value in place of the numeric progress value.",
      links: [
        {
          label: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext",
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
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description: "Stable anatomy identity on Progress elements.",
      values: ["root", "label.row", "label.label", "label.value", "track", "range", "thumb"],
    },
    { name: "data-variant", description: "The resolved variant name on the root progressbar." },
    {
      name: "data-indeterminate",
      description:
        "The root and range persistently emit whether Progress has an unknown completion value.",
      values: ["true", "false"],
    },
    {
      name: "data-animated",
      description:
        "The range persistently emits whether it is animated by animated or indeterminate mode.",
      values: ["true", "false"],
    },
    {
      name: "data-has-label",
      description: "The root persistently emits whether a visible label row is rendered.",
      values: ["true", "false"],
    },
    {
      name: "data-show-controls",
      description: "The root emits this when pointer controls are enabled and omits it otherwise.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description:
        "The root, track, and thumb emit this when Progress is disabled and omit it otherwise.",
      values: ["true"],
    },
    {
      name: "data-dragging",
      description: "The root emits this while a pointer drag is active and omits it otherwise.",
      values: ["true"],
    },
  ],
} satisfies ComponentAPIEnrichment;
