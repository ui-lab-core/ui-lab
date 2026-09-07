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
    SliderOrientation: {
      name: "SliderOrientation",
      summary: "Direction in which slider values increase.",
      type: '"horizontal" | "vertical"',
      kind: "alias",
      values: [
        {
          value: "horizontal",
          description: "The track runs left to right and values increase toward the right.",
        },
        {
          value: "vertical",
          description: "The track runs bottom to top and values increase upward.",
        },
      ],
    },
    SliderStyleSlots: {
      name: "SliderStyleSlots",
      summary: "Named style overrides for the Slider anatomy.",
      type: "{ root?: SlotStyle; track?: SlotStyle; range?: SlotStyle; thumb?: SlotStyle }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyle",
          required: false,
          description: "Styles the root slider interaction surface.",
        },
        {
          name: "track",
          type: "SlotStyle",
          required: false,
          description: "Styles the track that contains the range and thumbs.",
        },
        {
          name: "range",
          type: "SlotStyle",
          required: false,
          description: "Styles the filled portion of the track.",
        },
        {
          name: "thumb",
          type: "SlotStyle",
          required: false,
          description: "Styles every slider thumb.",
        },
      ],
    },
    SliderStylesProp: {
      name: "SliderStylesProp",
      summary: "Style overrides accepted by Slider.",
      type: "SliderStyleSlots",
      kind: "alias",
    },
  },

  props: [
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds conventional classes to the root slider surface.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description:
        "Applies inline styles to the root slider surface after styles.root inline styles.",
    },
  ],

  propGroups: [
    { name: "Core" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Accessibility" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description: "Stable anatomy identity on root, track, range, and thumb elements.",
      values: ["root", "track", "range", "thumb"],
    },
    { name: "data-slider-track", description: "Identifies the track element.", values: ["true"] },
    {
      name: "data-slider-range",
      description: "Identifies the filled range element.",
      values: ["true"],
    },
    {
      name: "data-slider-thumb",
      description: "Identifies each thumb element.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description: "The root, track, range, or thumb is disabled. It is omitted when enabled.",
      values: ["true"],
    },
    {
      name: "data-orientation",
      description: "The configured slider direction on the root and track.",
      values: ["horizontal", "vertical"],
    },
    {
      name: "data-focused",
      description: "A thumb has focus. It is omitted when the thumb is not focused.",
      values: ["true"],
    },
    {
      name: "data-focus-visible",
      description: "A thumb has keyboard-visible focus. It is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "A thumb is hovered. It is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-pressed",
      description:
        "A thumb is pressed by keyboard interaction or is being dragged. It is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-dragging",
      description: "A thumb is the active pointer-drag target. It is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-slider-thumb-index",
      description: "Zero-based index of a thumb in the supplied value array.",
    },
    {
      name: "data-slider-focus-surface",
      description: "Marks a thumb as the focus surface used by Slider's shared focus indicator.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks the track's local focus indicator, matching the shared focus contract.",
      values: ["local"],
    },
  ],
} satisfies ComponentAPIEnrichment;
