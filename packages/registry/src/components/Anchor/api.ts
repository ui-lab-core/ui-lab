import type { APIEnumValue, ComponentAPIEnrichment, PropDefinition } from "../../types";

const variantEnumValues: APIEnumValue[] = [
  { value: "solid", description: "Draws a continuous underline." },
  { value: "dashed", description: "Draws an underline of evenly spaced dashes." },
  { value: "dotted", description: "Draws an underline of evenly spaced dots." },
];

const withVariantEnumValues = (props: PropDefinition[]) =>
  props.map((prop) =>
    prop.name === "variant" ? { ...prop, enumValueDetails: variantEnumValues } : prop,
  );

export const apiEnrichment = {
  customTypes: {
    AnchorPreviewStyleSlots: {
      name: "AnchorPreviewStyleSlots",
      summary: "Class-based slots for the Anchor preview overlay.",
      type: "{ root?: Style; content?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the portaled overlay element that positions the preview.",
        },
        {
          name: "content",
          type: "Style",
          required: false,
          description: "Styles the preview surface rendered inside the overlay.",
        },
      ],
    },
    AnchorPreviewStyleValue: {
      name: "AnchorPreviewStyleValue",
      summary:
        "Shared or keyed styles for the Anchor preview overlay. A shared class applies to every preview slot; the keyed form addresses one slot.",
      type: "Style | AnchorPreviewStyleSlots",
      kind: "alias",
      examples: [
        'styles={{ preview: "shadow-lg" }}',
        'styles={{ preview: { content: "max-w-xs" } }}',
      ],
    },
    AnchorPreviewStylesProp: {
      name: "AnchorPreviewStylesProp",
      summary: "Keyed class names for Anchor preview anatomy.",
      type: "AnchorPreviewStyleSlots",
      kind: "alias",
    },
    AnchorStyleSlots: {
      name: "AnchorStyleSlots",
      summary: "Class-based slots for the Anchor root and stable compound anatomy.",
      type: "{ root?: Style; underline?: Style; preview?: AnchorPreviewStyleValue }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the rendered anchor or span root element.",
        },
        {
          name: "underline",
          type: "Style",
          required: false,
          description:
            "Styles the underline drawn beneath the label, including a consumer-supplied Anchor.Underline.",
        },
        {
          name: "preview",
          type: "AnchorPreviewStyleValue",
          required: false,
          description: "Shared or keyed anatomy for the hover preview overlay.",
        },
      ],
      notes: [
        "The preview overlay renders in a portal, so preview slots are the only way to reach it from Anchor.",
      ],
    },
    AnchorStylesProp: {
      name: "AnchorStylesProp",
      summary: "Keyed class names for Anchor anatomy.",
      type: "AnchorStyleSlots",
      kind: "alias",
    },
  },

  props: [
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds conventional classes to the root element after its default classes and before styles.root.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the rendered anchor or span root element.",
    },
    {
      name: "onClick",
      type: "React.MouseEventHandler<HTMLAnchorElement>",
      required: false,
      category: "Events",
      description:
        "Native click handler on the root element, composed with Anchor's own hover and focus handlers.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" },
    },
    {
      name: "download",
      type: "string | boolean",
      required: false,
      category: "Link behavior",
      description:
        "Downloads the destination instead of navigating to it. Only applies when href is supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download" },
    },
    {
      name: "referrerPolicy",
      type: "React.HTMLAttributeReferrerPolicy",
      required: false,
      category: "Link behavior",
      description:
        "Referrer information sent when following the link. Only applies when href is supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#referrerpolicy" },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description:
        "Accessible name for the link, required when the label text does not describe the destination on its own.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
      },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that describe the link.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
      },
    },
  ],

  subComponents: {
    // docgen resolves a dotted displayName only for forwardRef parts, so
    // AnchorPreview (a plain function component) still arrives under its
    // declaration name; refine renames it to the public "Anchor.Preview" key.
    include: (name: string) => name === "AnchorPreview" || name === "Anchor.Underline",
    props: {
      "Anchor.Underline": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description:
            "Adds classes to the underline element after its default classes and before styles.underline.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description:
            "Applies inline styles to the underline element after the variant's generated mask styles.",
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
      name: "data-slot",
      description: "Stable anatomy identity on the root element and on the underline element.",
      values: ["root", "underline"],
    },
    {
      name: "data-variant",
      description:
        "The resolved line treatment. Set on the root element and on each underline element, which may differ when Anchor.Underline overrides the root variant.",
      values: ["solid", "dashed", "dotted"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over the Anchor root. Always present on the root element.",
      values: ["true", "false"],
    },
    {
      name: "data-focused",
      description: "The Anchor root is focused. Always present on the root element.",
      values: ["true", "false"],
    },
    {
      name: "data-focus-visible",
      description:
        "The Anchor root has keyboard-visible focus. Always present on the root element.",
      values: ["true", "false"],
    },
    {
      name: "data-anchor-focus-surface",
      description:
        "Marks the Anchor root as the focus surface tracked by its local focus indicator.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks Anchor's local focus indicator element.",
      values: ["local"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: withVariantEnumValues(api.props),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name === "AnchorPreview" ? "Anchor.Preview" : name,
            { ...component, props: withVariantEnumValues(component.props) },
          ]),
        )
      : undefined,
  }),
} satisfies ComponentAPIEnrichment;
