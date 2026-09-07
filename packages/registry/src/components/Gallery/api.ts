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
    GalleryResponsiveColumns: {
      name: "GalleryResponsiveColumns",
      summary:
        "Per-breakpoint column override accepted by columns, applied at the sm, md, lg, and xl container-query breakpoints.",
      type: "{ sm?: number; md?: number; lg?: number; xl?: number }",
      kind: "interface",
      members: [
        {
          name: "sm",
          type: "number",
          required: false,
          description: "Column count applied from the smallest supported container-query breakpoint up.",
        },
        {
          name: "md",
          type: "number",
          required: false,
          description: "Column count applied from the md container-query breakpoint up.",
        },
        {
          name: "lg",
          type: "number",
          required: false,
          description: "Column count applied from the lg container-query breakpoint up.",
        },
        {
          name: "xl",
          type: "number",
          required: false,
          description: "Column count applied from the xl container-query breakpoint up.",
        },
      ],
      notes: [
        "Supplying a responsive object wraps the root in a container-query parent, so breakpoints track the container's width rather than the viewport.",
      ],
    },
    GalleryGap: {
      name: "GalleryGap",
      summary: "Gap size accepted by gap, gap-x, and gap-y.",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      kind: "alias",
      values: [
        { value: "xs", description: "The smallest gap step." },
        { value: "sm", description: "A small gap step." },
        { value: "md", description: "The default, medium gap step." },
        { value: "lg", description: "A large gap step." },
        { value: "xl", description: "The largest gap step." },
      ],
      notes: [
        "gap, gap-x, and gap-y also accept a Tailwind spacing-scale number or a raw CSS gap value; both are mapped to the nearest gap step.",
      ],
    },
    GalleryRows: {
      name: "GalleryRows",
      summary: "Fixed row count or auto, accepted by rows.",
      type: '"1" | "2" | "3" | "4" | "5" | "6" | "auto"',
      kind: "alias",
      values: [
        { value: "1", description: "A single fixed row." },
        { value: "2", description: "Two fixed rows." },
        { value: "3", description: "Three fixed rows." },
        { value: "4", description: "Four fixed rows." },
        { value: "5", description: "Five fixed rows." },
        { value: "6", description: "Six fixed rows." },
        { value: "auto", description: "Rows size automatically to their content." },
      ],
    },
    GalleryItemOrientation: {
      name: "GalleryItemOrientation",
      summary: "Layout direction of a Gallery.Item's view and body, accepted by orientation.",
      type: '"vertical" | "horizontal"',
      kind: "alias",
      values: [
        { value: "vertical", description: "Stacks the view above the body." },
        { value: "horizontal", description: "Places the view and body side by side." },
      ],
    },
    GalleryStyleSlots: {
      name: "GalleryStyleSlots",
      summary: "Style overrides for the Gallery root and named component parts.",
      type: "{ root?: Style; item?: Style; view?: Style; body?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the root grid element.",
        },
        {
          name: "item",
          type: "Style",
          required: false,
          description: "Styles every Gallery.Item, in addition to each item's own styles.",
        },
        {
          name: "view",
          type: "Style",
          required: false,
          description: "Styles every Gallery.View, in addition to each view's own styles.",
        },
        {
          name: "body",
          type: "Style",
          required: false,
          description: "Styles every Gallery.Body, in addition to each body's own styles.",
        },
      ],
    },
    GalleryStylesProp: {
      name: "GalleryStylesProp",
      summary: "Style overrides accepted by Gallery.",
      type: "GalleryStyleSlots",
      kind: "alias",
    },
    GalleryItemStyleSlots: {
      name: "GalleryItemStyleSlots",
      summary: "Style overrides for the Gallery.Item root.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the rendered anchor, button, or div element.",
        },
      ],
    },
    GalleryItemStylesProp: {
      name: "GalleryItemStylesProp",
      summary: "Style overrides accepted by Gallery.Item.",
      type: "GalleryItemStyleSlots",
      kind: "alias",
    },
    GalleryViewStyleSlots: {
      name: "GalleryViewStyleSlots",
      summary: "Style overrides for the Gallery.View root.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the view root element.",
        },
      ],
    },
    GalleryViewStylesProp: {
      name: "GalleryViewStylesProp",
      summary: "Style overrides accepted by Gallery.View.",
      type: "GalleryViewStyleSlots",
      kind: "alias",
    },
    GalleryBodyStyleSlots: {
      name: "GalleryBodyStyleSlots",
      summary: "Style overrides for the Gallery.Body root.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the body root element.",
        },
      ],
    },
    GalleryBodyStylesProp: {
      name: "GalleryBodyStylesProp",
      summary: "Style overrides accepted by Gallery.Body.",
      type: "GalleryBodyStyleSlots",
      kind: "alias",
    },
  },

  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description: "Gallery.Item elements (or other content) rendered as direct children of the grid.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds conventional classes to the root grid element after its default classes and before styles.root.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the root grid element.",
    },
  ],

  subComponents: {
    props: {
      "Gallery.Item": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description:
            "Adds conventional classes to the rendered anchor, button, or div element after its default classes and before styles.root.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description:
            "Applies inline styles to the rendered element. Merges with the grid-column/grid-row styles derived from columnSpan and rowSpan.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description:
            "Accessible name for the item. Falls back to a generic name only for an interactive item with no aria-label, aria-labelledby, or children.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
          },
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "References the id of an element that labels the item.",
        },
      ],
      "Gallery.View": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Adds conventional classes to the view root element after its default classes and before styles.root.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description:
            "Applies inline styles to the view root element. Merges with the --aspect-ratio custom property Gallery.View derives from aspectRatio.",
        },
      ],
      "Gallery.Body": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Adds conventional classes to the body root element after its default classes and before styles.root.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the body root element.",
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
      name: "data-orientation",
      description: "Gallery.Item's rendered element mirrors the orientation prop. Always emitted.",
      values: ["vertical", "horizontal"],
    },
    {
      name: "data-selected",
      description: "Gallery.Item's rendered element emits true when selected and omits the attribute otherwise.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description: "Gallery.Item's rendered element emits true when disabled and omits the attribute otherwise.",
      values: ["true"],
    },
    {
      name: "data-focused",
      description: "An interactive Gallery.Item's rendered element is focused; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focus-visible",
      description: "An interactive Gallery.Item's rendered element has keyboard-visible focus; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over an interactive, enabled Gallery.Item; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-pressed",
      description: "An interactive Gallery.Item is currently pressed; omitted otherwise.",
      values: ["true"],
    },
  ],
} satisfies ComponentAPIEnrichment;
