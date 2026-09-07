import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

/**
 * Hand-authored API documentation for Switch. The generator merges this over
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
    SwitchState: {
      name: "SwitchState",
      summary: "Controlled state supplied to Switch.",
      type: "{ checked?: boolean }",
      kind: "interface",
      members: [
        {
          name: "checked",
          type: "boolean",
          required: false,
          description: "Controlled checked value.",
        },
      ],
    },
    SwitchStyleSlots: {
      name: "SwitchStyleSlots",
      summary: "Named class-based styling targets for the Switch anatomy.",
      type: "{ root?: Style; track?: Style; thumb?: Style; input?: Style; focusIndicator?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the outer switch surface.",
        },
        {
          name: "track",
          type: "Style",
          required: false,
          description: "Styles the background track behind the thumb.",
        },
        {
          name: "thumb",
          type: "Style",
          required: false,
          description: "Styles the movable thumb.",
        },
        {
          name: "input",
          type: "Style",
          required: false,
          description: "Styles the native input that receives focus and pointer interaction.",
        },
        {
          name: "focusIndicator",
          type: "Style",
          required: false,
          description: "Styles the local focus indicator without replacing its measured geometry.",
        },
      ],
    },
    SwitchStylesProp: {
      name: "SwitchStylesProp",
      summary: "Class-based style overrides accepted by Switch.",
      type: "StylesProp<SwitchStyleSlots>",
      kind: "alias",
      notes: ["Each key applies classes only to its matching stable anatomy slot."],
    },
  },

  props: [
    {
      name: "readOnly",
      type: "boolean",
      required: false,
      category: "Core",
      description:
        "Prevents keyboard, pointer, and drag-toggle changes while keeping the switch focusable.",
      tags: { see: "https://react-spectrum.adobe.com/react-aria/useSwitch.html" },
    },
    {
      name: "value",
      type: "string | number | readonly string[]",
      required: false,
      category: "Forms",
      description: "Native input value submitted under name when the switch is checked.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#value",
      },
    },
    {
      name: "form",
      type: "string",
      required: false,
      category: "Forms",
      description: "Associates the native input with a form by its ID.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#form",
      },
    },
    ...["onFocus", "onBlur"].map(
      (name): PropDefinition => ({
        name,
        type: "React.FocusEventHandler<HTMLInputElement>",
        required: false,
        category: "Events",
        description: `Receives the native input's ${name === "onFocus" ? "focus" : "blur"} event alongside the shared focus behavior.`,
        tags: {
          mdn: `https://developer.mozilla.org/en-US/docs/Web/API/Element/${name === "onFocus" ? "focus" : "blur"}_event`,
        },
      }),
    ),

    {
      name: "defaultChecked",
      type: "boolean",
      required: false,
      category: "Core",
      description:
        "Initial checked value when state.checked, checked, and isSelected are absent; takes precedence over defaultSelected.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#checked",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Classes applied to the outer .switch surface after default classes and before styles.root.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/class",
      },
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description:
        "Inline CSS properties applied to the outer switch surface; named slots accept classes only.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/style",
      },
    },
    {
      name: "name",
      type: "string",
      required: false,
      category: "Forms",
      description: "Form field name submitted with the checked switch value.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#name",
      },
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      category: "Forms",
      description: "Requires the switch to be checked before native form submission succeeds.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required",
      },
    },
    {
      name: "id",
      type: "string",
      required: false,
      category: "Accessibility",
      description:
        "ID for the native switch input, allowing an external label to target it with htmlFor.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/id",
      },
    },
    {
      name: "autoFocus",
      type: "boolean",
      required: false,
      category: "Accessibility",
      description: "Requests focus for the native switch input when it mounts.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus",
      },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name for the switch when visible labeling is unavailable.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
      },
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the switch's accessible name.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
      },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide additional switch instructions or context.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
      },
    },
    {
      name: "aria-invalid",
      type: 'boolean | "true" | "false" | "grammar" | "spelling"',
      required: false,
      category: "Accessibility",
      description:
        "Marks the native switch input invalid for assistive technology; does not add invalid styling.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid",
      },
    },
  ],

  propGroups: [
    { name: "Core" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Forms" },
    { name: "Accessibility" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-selected",
      description: "The switch is checked; omitted when unchecked.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description: "The switch is disabled; omitted when enabled.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over the enabled switch; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focused",
      description: "Root and input emit true when the input is focused, false otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-focus-visible",
      description: "Root and input emit true for keyboard-visible focus, false otherwise.",
      values: ["true", "false"],
    },
    { name: "data-size", description: "The configured switch size.", values: ["default", "sm"] },
    {
      name: "data-slot",
      description:
        "Stable styling identity on each matching anatomy element; track and thumb also retain switch-track and switch-thumb class hooks.",
      values: ["root", "track", "thumb", "input", "focusIndicator"],
    },
    {
      name: "data-switch-focus-surface",
      description: "Marks the root as the visual focus surface for the native switch input.",
      values: ["true"],
    },
    {
      name: "data-ring",
      description: "Marks the local focus indicator as a shared focus ring.",
      values: ["true"],
    },
    {
      name: "data-self-target",
      description: "The indicator belongs to this switch's own focus surface.",
      values: ["true"],
    },
    {
      name: "data-visible",
      description: "The focus indicator is visible; omitted when hidden.",
      values: ["true"],
    },
    {
      name: "data-transition-radius",
      description:
        "The focus indicator animates a radius change on the same surface; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks the root's local shared focus indicator.",
      values: ["local"],
    },
  ],

  refine: (api) => {
    const sizeProp = api.props.find((prop) => prop.name === "size");
    if (sizeProp)
      sizeProp.enumValueDetails = [
        { value: "default", description: "Uses the standard switch geometry." },
        { value: "sm", description: "Uses a smaller track and thumb." },
      ];
    return api;
  },
} satisfies ComponentAPIEnrichment;
