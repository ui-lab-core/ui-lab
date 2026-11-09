import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by Checkbox class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    CheckboxIconStyles: {
      name: "CheckboxIconStyles",
      summary: "Class-based styling targets for Checkbox state icons.",
      type: "{ checkmark?: Style; indeterminate?: Style }",
      kind: "interface",
      members: [
        {
          name: "checkmark",
          type: "Style",
          required: false,
          description: "Styles the checkmark shown when the checkbox is checked.",
        },
        {
          name: "indeterminate",
          type: "Style",
          required: false,
          description: "Styles the horizontal mark shown for partial selection.",
        },
      ],
    },
    CheckboxStyleSlots: {
      name: "CheckboxStyleSlots",
      summary: "Named class-based styling targets for the Checkbox anatomy.",
      type: `{
  root?: Style;
  control?: Style;
  checkbox?: Style;
  icon?: Style | CheckboxIconStyles;
  label?: Style;
  helperText?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the outer checkbox row.",
        },
        {
          name: "control",
          type: "Style",
          required: false,
          description: "Styles the control wrapper containing the input and state icon.",
        },
        {
          name: "checkbox",
          type: "Style",
          required: false,
          description: "Styles the native checkbox input.",
        },
        {
          name: "icon",
          type: "Style | CheckboxIconStyles",
          required: false,
          description:
            "Styles both state icons or targets checkmark and indeterminate icons separately.",
        },
        {
          name: "label",
          type: "Style",
          required: false,
          description: "Styles the visible label associated with the native input.",
        },
        {
          name: "helperText",
          type: "Style",
          required: false,
          description: "Styles the helper or validation message below the label.",
        },
      ],
    },
    CheckboxStylesProp: {
      name: "CheckboxStylesProp",
      summary: "Class-based style overrides accepted by Checkbox.",
      type: "StylesProp<CheckboxStyleSlots>",
      kind: "alias",
      notes: [
        "The icon value may be a shared class value or an object targeting icon.checkmark and icon.indeterminate.",
      ],
    },
  },

  props: [
    {
      name: "selected",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Initial selected value. The component manages subsequent changes internally.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#checked",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Disables interaction and native focus while applying disabled styling.",
      tags: {
        default: "false",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled",
        see: "https://react-spectrum.adobe.com/react-aria/useCheckbox.html",
      },
    },
    {
      name: "onChange",
      type: "(selected: boolean) => void",
      required: false,
      category: "Events",
      description:
        "Receives the next selected value after pointer, keyboard, or drag-toggle interaction. Disabled and read-only checkboxes do not invoke it.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event" },
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Classes applied to the outer checkbox row after its default classes.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Inline CSS properties applied to the outer checkbox row.",
    },
    {
      name: "name",
      type: "string",
      required: false,
      category: "Forms",
      description: "Form field name submitted when the checkbox is checked.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#name",
      },
    },
    {
      name: "value",
      type: "string | number | readonly string[]",
      required: false,
      category: "Forms",
      description: "Form value submitted with name when the checkbox is checked.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#value",
      },
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      category: "Forms",
      description: "Requires the checkbox to be checked before native form submission succeeds.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required",
      },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name used when no visible label is rendered.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
      },
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the checkbox's accessible name.",
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
        "References additional descriptive elements. Checkbox appends its helper text ID when helper content is rendered.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
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
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description: "Stable anatomy identity on the matching Checkbox element.",
      values: [
        "root",
        "control",
        "checkbox",
        "icon.checkmark",
        "icon.indeterminate",
        "label",
        "helperText",
      ],
    },
    {
      name: "data-selected",
      description:
        "The root and native input emit true when checked and omit the attribute when unchecked.",
      values: ["true"],
    },
    {
      name: "data-indeterminate",
      description:
        "The root and native input emit true for partial selection and omit the attribute otherwise.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description:
        "The root, native input, and visible label emit true when disabled and omit the attribute when enabled.",
      values: ["true"],
    },
    {
      name: "data-invalid",
      description:
        "The root and native input emit true when error, isInvalid, helperTextError, or aria-invalid marks the checkbox invalid.",
      values: ["true"],
    },
    {
      name: "data-error",
      description:
        "The native input and helper text emit true when Checkbox resolves an invalid state and omit it otherwise.",
      values: ["true"],
    },
    {
      name: "data-pressed",
      description:
        "The root and native input persistently emit true while an enabled checkbox is pressed and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-focused",
      description:
        "The root and native input persistently emit true while the native input is focused and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-focus-visible",
      description:
        "The root and native input persistently emit true while focus is keyboard-visible and false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-checkbox-focus-surface",
      description:
        "Marks the native input as the focus surface used by Checkbox's local focus indicator.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks Checkbox's local shared focus indicator.",
      values: ["local"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map((prop) =>
      prop.name === "styles" ? { ...prop, type: "CheckboxStylesProp" } : prop,
    ),
  }),
} satisfies ComponentAPIEnrichment;
