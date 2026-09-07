import type { ComponentAPIEnrichment } from "../../types";

/**
 * Hand-authored API documentation for Textarea. The generator merges this over
 * what react-docgen-typescript extracts from the component source.
 */
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
    TextAreaSize: {
      name: "TextAreaSize",
      summary: "Height preset and text density applied to the field.",
      type: '"sm" | "md" | "lg"',
      kind: "alias",
      values: [
        {
          value: "sm",
          description: "A compact field with tighter padding and a smaller minimum height.",
        },
        { value: "md", description: "The default field padding and minimum height." },
        {
          value: "lg",
          description: "A roomier field with larger padding, body text size, and minimum height.",
        },
      ],
      notes: [
        "The size is published on the root and the field as data-size, and as a conventional class on the root.",
      ],
    },
    TextAreaResize: {
      name: "TextAreaResize",
      summary: "Axis the field can be dragged along with the custom resize handle.",
      type: '"none" | "x" | "y" | "both"',
      kind: "alias",
      values: [
        {
          value: "none",
          description: "Renders no handle and leaves the field at its preset size.",
        },
        {
          value: "x",
          description: "Renders a handle on the trailing edge that changes width only.",
        },
        {
          value: "y",
          description: "Renders a handle on the bottom edge that changes height only.",
        },
        {
          value: "both",
          description: "Renders a corner handle that changes width and height together.",
        },
      ],
      notes: [
        "Native textarea resizing is always disabled; the handle is a pointer-driven affordance.",
        "A disabled TextArea resolves to none, so no handle renders and data-resize reports none.",
      ],
    },
    TextAreaState: {
      name: "TextAreaState",
      summary: "Controlled values accepted through the TextArea state abstraction.",
      type: `{
  value?: string;
}`,
      kind: "interface",
      members: [
        {
          name: "value",
          type: "string",
          required: false,
          description: "Current field value. Takes precedence over the native value prop.",
        },
      ],
    },
    TextAreaResizeHandleStyles: {
      name: "TextAreaResizeHandleStyles",
      summary: "Axis-specific styles for the drag-to-resize handle.",
      type: `{
  both?: Style;
  x?: Style;
  y?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "both",
          type: "Style",
          required: false,
          description: 'Styles the corner handle rendered while resize is "both".',
        },
        {
          name: "x",
          type: "Style",
          required: false,
          description: 'Styles the trailing-edge handle rendered while resize is "x".',
        },
        {
          name: "y",
          type: "Style",
          required: false,
          description: 'Styles the bottom-edge handle rendered while resize is "y".',
        },
      ],
    },
    TextAreaStyleSlots: {
      name: "TextAreaStyleSlots",
      summary: "Named style slots for the TextArea anatomy.",
      type: `{
  root?: Style;
  surface?: Style;
  scroll?: Style;
  field?: Style;
  resizeHandle?: Style | TextAreaResizeHandleStyles;
  characterCount?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the outer wrapper that carries the conventional textarea class.",
        },
        {
          name: "surface",
          type: "Style",
          required: false,
          description: "Styles the positioned surface holding the field and the resize handle.",
        },
        {
          name: "scroll",
          type: "Style",
          required: false,
          description:
            "Styles the bordered scroll wrapper rendered in place of the field border when maxHeight is set.",
        },
        {
          name: "field",
          type: "Style",
          required: false,
          description: "Styles the native textarea element.",
        },
        {
          name: "resizeHandle",
          type: "Style | TextAreaResizeHandleStyles",
          required: false,
          description:
            "Styles every resize handle, or one axis through resizeHandle.both, resizeHandle.x, and resizeHandle.y.",
        },
        {
          name: "characterCount",
          type: "Style",
          required: false,
          description: "Styles the character count rendered below the field.",
        },
      ],
    },
    TextAreaStylesProp: {
      name: "TextAreaStylesProp",
      summary: "Class-based style overrides for TextArea's root and named anatomy slots.",
      type: "StylesProp<TextAreaStyleSlots>",
      kind: "alias",
      notes: [
        "The resizeHandle slot accepts one shared value applied to whichever axis renders, or an object addressing resizeHandle.both, resizeHandle.x, and resizeHandle.y.",
      ],
    },
  },

  props: [
    {
      name: "value",
      type: "string | number | readonly string[]",
      required: false,
      category: "Core",
      description:
        "Sets the field value when state.value is not supplied. Numbers are converted to strings.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea" },
    },
    {
      name: "defaultValue",
      type: "string | number | readonly string[]",
      required: false,
      category: "Core",
      description:
        "Sets the initial uncontrolled value used when neither state.value nor value is supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea" },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      category: "Core",
      description:
        "Disables the native textarea, removes the resize handle, and applies disabled styling.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled" },
    },
    {
      name: "readOnly",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Blocks editing while the field stays focusable and selectable.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly" },
    },
    {
      name: "rows",
      type: "number",
      required: false,
      category: "Core",
      description:
        "Sets the native visible row count. The size preset still supplies a minimum height, so rows only grows the field beyond that minimum.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows" },
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      category: "Content",
      description: "Displays placeholder text while the field is empty.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder",
      },
    },
    {
      name: "onChange",
      type: "React.ChangeEventHandler<HTMLTextAreaElement>",
      required: false,
      category: "Events",
      description:
        "Runs after the value changes. When maxCharacters truncates the input, the event is forwarded carrying the truncated value.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/textarea#onchange" },
    },
    {
      name: "onFocus",
      type: "React.FocusEventHandler<HTMLTextAreaElement>",
      required: false,
      category: "Events",
      description:
        "Runs when the native textarea receives focus, alongside the internal focus-state tracking.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/common#onfocus" },
    },
    {
      name: "onBlur",
      type: "React.FocusEventHandler<HTMLTextAreaElement>",
      required: false,
      category: "Events",
      description:
        "Runs when the native textarea loses focus, alongside the internal focus-state tracking.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/common#onblur" },
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds conventional classes to the root wrapper, after the component and size classes and before the resolved styles.root class.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" },
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description:
        "Applies native inline styles to the root wrapper. Use styles.field for inline-free class overrides on the textarea itself.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/common#style" },
    },
    {
      name: "name",
      type: "string",
      required: false,
      category: "Forms",
      description: "Names the native textarea for form submission.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/name" },
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      category: "Forms",
      description: "Requires a value before a containing form can submit.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required",
      },
    },
    {
      name: "maxLength",
      type: "number",
      required: false,
      category: "Forms",
      description:
        "Applies the native length limit. Use maxCharacters instead when the character count should render and truncation should reach onChange.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength" },
    },
    {
      name: "autoComplete",
      type: "string",
      required: false,
      category: "Forms",
      description: "Supplies the browser autocomplete hint for the native textarea.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete",
      },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Provides an accessible name when no associated label supplies one.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
      },
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References elements that label the native textarea.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
      },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description:
        "References elements that describe the native textarea, such as a hint or the character count.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
      },
    },
    {
      name: "autoFocus",
      type: "boolean",
      required: false,
      category: "Accessibility",
      description: "Requests focus for the native textarea after it mounts.",
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
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable anatomy identity on the root, surface, scroll wrapper, field, resize handle, and character count.",
      values: [
        "root",
        "surface",
        "scroll",
        "field",
        "resizeHandle.both",
        "resizeHandle.x",
        "resizeHandle.y",
        "characterCount",
      ],
    },
    {
      name: "data-size",
      description: "The resolved size preset, published on the root and the field.",
      values: ["sm", "md", "lg"],
    },
    {
      name: "data-resize",
      description:
        "The resolved resize axis, published on the root, the surface, and the field. A disabled TextArea always reports none.",
      values: ["none", "x", "y", "both"],
    },
    {
      name: "data-scroll",
      description:
        "The field is wrapped in the capped scroll surface because maxHeight is set; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description: "The TextArea is disabled; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-error",
      description:
        "The error prop is set or the value exceeds maxCharacters; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focused",
      description: "The field has focus; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focus-visible",
      description: "The field has keyboard-visible focus; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-over-limit",
      description:
        "Set on the character count while the value exceeds maxCharacters; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-textarea-focus-surface",
      description:
        "Marks the element the shared focus indicator measures: the scroll wrapper when maxHeight is set, otherwise the field.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks TextArea's local shared focus indicator element.",
      values: ["local"],
    },
    {
      name: "data-ring",
      description: "Marks the local focus indicator element.",
      values: ["true"],
    },
    {
      name: "data-visible",
      description:
        "The local focus indicator is visible for keyboard focus; the attribute is omitted while hidden.",
      values: ["true"],
    },
  ],

  refine: (api) => {
    const sizeProp = api.props.find((prop) => prop.name === "size");
    if (sizeProp)
      sizeProp.enumValueDetails = [
        {
          value: "sm",
          description: "A compact field with tighter padding and a smaller minimum height.",
        },
        { value: "md", description: "The default field padding and minimum height." },
        {
          value: "lg",
          description: "A roomier field with larger padding, body text size, and minimum height.",
        },
      ];

    const resizeProp = api.props.find((prop) => prop.name === "resize");
    if (resizeProp)
      resizeProp.enumValueDetails = [
        {
          value: "none",
          description: "Renders no handle and leaves the field at its preset size.",
        },
        {
          value: "x",
          description: "Renders a handle on the trailing edge that changes width only.",
        },
        {
          value: "y",
          description: "Renders a handle on the bottom edge that changes height only.",
        },
        {
          value: "both",
          description: "Renders a corner handle that changes width and height together.",
        },
      ];

    return api;
  },
} satisfies ComponentAPIEnrichment;
