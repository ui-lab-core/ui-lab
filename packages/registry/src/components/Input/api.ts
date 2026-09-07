import type { ComponentAPIEnrichment } from "../../types";

/**
 * Hand-authored API documentation for Input. The generator merges this over
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
    InputVariant: {
      name: "InputVariant",
      summary: "An open string type selecting the input surface treatment.",
      type: '"default" | "ghost" | (string & {})',
      kind: "alias",
      notes: [
        "The built-in variants are default and ghost; custom variant names remain valid theme hooks.",
      ],
    },
    InputState: {
      name: "InputState",
      summary: "Controlled values accepted through the Input state abstraction.",
      type: "{ value?: string }",
      kind: "interface",
      members: [
        {
          name: "value",
          type: "string",
          required: false,
          description: "Current input value. Takes precedence over the native value prop.",
        },
      ],
    },
    InputIconSlots: {
      name: "InputIconSlots",
      summary: "Icon content positioned before and/or after the input value.",
      type: "{ prefix?: React.ReactNode; suffix?: React.ReactNode }",
      kind: "interface",
      members: [
        {
          name: "prefix",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered before the input value.",
        },
        {
          name: "suffix",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered after the input value.",
        },
      ],
    },
    InputActionDef: {
      name: "InputActionDef",
      summary: "Declarative inline action rendered as an icon button.",
      type: "{ icon: React.ReactNode; title: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }",
      kind: "interface",
      members: [
        {
          name: "icon",
          type: "React.ReactNode",
          required: true,
          description: "Icon content for the action button.",
        },
        {
          name: "title",
          type: "string",
          required: true,
          description: "Accessible name and tooltip content for the action button.",
        },
        {
          name: "onClick",
          type: "React.MouseEventHandler<HTMLButtonElement>",
          required: false,
          description: "Invoked when the action button is pressed.",
        },
      ],
    },
    InputAction: {
      name: "InputAction",
      summary: "An inline action definition or custom action node.",
      type: "InputActionDef | React.ReactNode",
      kind: "alias",
    },
    InputActionSlots: {
      name: "InputActionSlots",
      summary: "Inline actions positioned at either edge of the input.",
      type: "{ left?: InputAction[]; right?: InputAction[] }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "InputAction[]",
          required: false,
          description: "Actions rendered before the input value.",
        },
        {
          name: "right",
          type: "InputAction[]",
          required: false,
          description: "Actions rendered after the input value.",
        },
      ],
    },
    InputAdornmentStyles: {
      name: "InputAdornmentStyles",
      summary: "Styles for adornment wrappers at either edge of the input.",
      type: "{ start?: Style; end?: Style }",
      kind: "interface",
      members: [
        {
          name: "start",
          type: "Style",
          required: false,
          description: "Styles the wrapper containing leading icons and actions.",
        },
        {
          name: "end",
          type: "Style",
          required: false,
          description:
            "Styles the wrapper containing trailing icons, actions, hints, and controls.",
        },
      ],
    },
    InputIconStyles: {
      name: "InputIconStyles",
      summary: "Styles for icons rendered at either edge of the input.",
      type: "{ left?: Style; right?: Style }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "Style",
          required: false,
          description: "Styles the icon before the input value.",
        },
        {
          name: "right",
          type: "Style",
          required: false,
          description: "Styles the icon after the input value.",
        },
      ],
    },
    InputActionStyles: {
      name: "InputActionStyles",
      summary: "Styles for action groups at either edge of the input.",
      type: "{ left?: Style; right?: Style }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "Style",
          required: false,
          description: "Styles the actions before the input value.",
        },
        {
          name: "right",
          type: "Style",
          required: false,
          description: "Styles the actions after the input value.",
        },
      ],
    },
    InputStepperStyles: {
      name: "InputStepperStyles",
      summary: "Styles for the number-input stepper buttons.",
      type: "{ up?: Style; down?: Style }",
      kind: "interface",
      members: [
        { name: "up", type: "Style", required: false, description: "Styles the increment button." },
        {
          name: "down",
          type: "Style",
          required: false,
          description: "Styles the decrement button.",
        },
      ],
    },
    InputStyleSlots: {
      name: "InputStyleSlots",
      summary: "Named style slots for the Input anatomy.",
      type: "{ root?: Style; input?: Style; adornments?: InputAdornmentStyles; icon?: Style | InputIconStyles; actions?: Style | InputActionStyles; hint?: Style; controls?: Style; stepper?: Style | InputStepperStyles }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the visual input surface.",
        },
        {
          name: "input",
          type: "Style",
          required: false,
          description: "Styles the native input or custom input content surface.",
        },
        {
          name: "adornments",
          type: "InputAdornmentStyles",
          required: false,
          description: "Styles adornment wrappers through adornments.start and adornments.end.",
        },
        {
          name: "icon",
          type: "Style | InputIconStyles",
          required: false,
          description: "Styles one or both icon wrappers.",
        },
        {
          name: "actions",
          type: "Style | InputActionStyles",
          required: false,
          description: "Styles one or both actions wrappers.",
        },
        { name: "hint", type: "Style", required: false, description: "Styles the hint content." },
        {
          name: "controls",
          type: "Style",
          required: false,
          description: "Styles the number-input controls wrapper.",
        },
        {
          name: "stepper",
          type: "Style | InputStepperStyles",
          required: false,
          description: "Styles one or both number-input stepper buttons.",
        },
      ],
    },
    InputStylesProp: {
      name: "InputStylesProp",
      summary: "Class-based style overrides for Input's root and named anatomy slots.",
      type: "StylesProp<InputStyleSlots>",
      kind: "alias",
      notes: [
        "Nested slot objects address dotted anatomy paths such as adornments.start and stepper.up.",
      ],
    },
  },

  props: [
    {
      name: "value",
      type: "string | number | readonly string[]",
      required: false,
      category: "Core",
      description: "Controls the native input value when state.value is not provided.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value" },
    },
    {
      name: "defaultValue",
      type: "string | number | readonly string[]",
      required: false,
      category: "Core",
      description:
        "Sets the initial uncontrolled native input value when state.value and value are absent.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value" },
    },
    {
      name: "type",
      type: "React.HTMLInputTypeAttribute",
      required: false,
      category: "Core",
      description:
        "Selects the native input type. Number inputs render stepper controls unless hide-controls is set.",
      defaultValue: '"text"',
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types" },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      category: "Core",
      description:
        "Disables the native input and declarative inline actions, then applies disabled styling.",
      defaultValue: "false",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled" },
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      category: "Content",
      description: "Displays a placeholder while the native input has no value.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder",
      },
    },
    {
      name: "onChange",
      type: "React.ChangeEventHandler<HTMLInputElement>",
      required: false,
      category: "Events",
      description:
        "Runs after the native input value changes, including changes made by number stepper controls.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/input#onchange" },
    },
    {
      name: "onFocus",
      type: "React.FocusEventHandler<HTMLInputElement>",
      required: false,
      category: "Events",
      description:
        "Runs when the native input, or custom content in children mode, receives focus.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/common#onfocus" },
    },
    {
      name: "onBlur",
      type: "React.FocusEventHandler<HTMLInputElement>",
      required: false,
      category: "Events",
      description: "Runs when the native input, or custom content in children mode, loses focus.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/common#onblur" },
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds conventional classes to the root input surface before the resolved styles.root class.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" },
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies native inline styles to the root input surface.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/common#style" },
    },
    {
      name: "name",
      type: "string",
      required: false,
      category: "Forms",
      description: "Names the native input for form submission.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/name" },
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      category: "Forms",
      description: "Requires a value before a containing form can submit the native input.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required",
      },
    },
    {
      name: "autoComplete",
      type: "string",
      required: false,
      category: "Forms",
      description: "Supplies the browser autocomplete hint for the native input.",
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
      description: "References elements that label the native input.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
      },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References elements that describe the native input.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
      },
    },
    {
      name: "autoFocus",
      type: "boolean",
      required: false,
      category: "Accessibility",
      description: "Requests focus for the native input after it mounts.",
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
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-focused",
      description: "The input or its custom content has focus.",
      values: ["true"],
    },
    {
      name: "data-focus-visible",
      description: "The input has keyboard-visible focus.",
      values: ["true"],
    },
    { name: "data-disabled", description: "The input is disabled.", values: ["true"] },
    { name: "data-error", description: "The input displays error styling.", values: ["true"] },
    { name: "data-variant", description: "The resolved variant name." },
    {
      name: "data-slot",
      description: "Stable styling identity for the root or named Input anatomy part.",
      values: [
        "root",
        "input",
        "adornments.start",
        "adornments.end",
        "icon.left",
        "icon.right",
        "actions.left",
        "actions.right",
        "hint",
        "controls",
        "stepper.up",
        "stepper.down",
      ],
    },
    {
      name: "data-input-focus-surface",
      description:
        "Marks the root as the visual focus surface used by Input's local focus indicator.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description:
        "Marks Input's local shared focus indicator when Input is not rendered inside Group.",
      values: ["local"],
    },
    {
      name: "data-ring",
      description:
        "Marks the local focus indicator element when Input is not rendered inside Group.",
      values: ["true"],
    },
    {
      name: "data-visible",
      description:
        "The local focus indicator is visible for keyboard focus; it is omitted while hidden.",
      values: ["true"],
    },
  ],
} satisfies ComponentAPIEnrichment;
