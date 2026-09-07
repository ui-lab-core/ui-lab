import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by List style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    ListOrientation: {
      name: "ListOrientation",
      summary: "Axis used by List layout and keyboard navigation.",
      type: '"vertical" | "horizontal"',
      kind: "alias",
      values: [
        {
          value: "vertical",
          description: "Items stack top to bottom and Up/Down arrow keys move focus between them.",
        },
        {
          value: "horizontal",
          description:
            "Items lay out left to right and Left/Right arrow keys move focus between them.",
        },
      ],
    },
    ListGap: {
      name: "ListGap",
      summary: "Named gap step between direct List.Item children.",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      kind: "alias",
      values: [
        { value: "xs", description: "Extra-small gap between items." },
        { value: "sm", description: "Small gap between items." },
        { value: "md", description: "Medium gap between items." },
        { value: "lg", description: "Large gap between items." },
        { value: "xl", description: "Extra-large gap between items." },
      ],
    },
    ListNavigateCallbacks: {
      name: "ListNavigateCallbacks",
      summary: "Notifications from the List imperative navigation methods.",
      type: "{ up?: () => void; down?: () => void; enter?: () => void; escape?: () => void }",
      kind: "interface",
      members: [
        {
          name: "up",
          type: "() => void",
          required: false,
          description: "Called after focusPrev or focusLast.",
        },
        {
          name: "down",
          type: "() => void",
          required: false,
          description: "Called after focusNext or focusFirst.",
        },
        {
          name: "enter",
          type: "() => void",
          required: false,
          description: "Called by selectHighlighted.",
        },
        {
          name: "escape",
          type: "() => void",
          required: false,
          description: "Reserved for an integration escape action.",
        },
      ],
    },
    ListRef: {
      name: "ListRef",
      summary: "The listbox element augmented with List navigation methods.",
      type: "HTMLDivElement & { focusNext: () => void; focusPrev: () => void; focusFirst: () => void; focusLast: () => void; selectHighlighted: () => void; clearHighlight: () => void; getHighlightedIndex: () => number | null }",
      kind: "interface",
      members: [
        {
          name: "focusNext",
          type: "() => void",
          required: true,
          description: "Focuses the next eligible option, wrapping at the end.",
        },
        {
          name: "focusPrev",
          type: "() => void",
          required: true,
          description: "Focuses the previous eligible option, wrapping at the start.",
        },
        {
          name: "focusFirst",
          type: "() => void",
          required: true,
          description: "Focuses the first eligible option.",
        },
        {
          name: "focusLast",
          type: "() => void",
          required: true,
          description: "Focuses the last eligible option.",
        },
        {
          name: "selectHighlighted",
          type: "() => void",
          required: true,
          description: "Calls the configured enter navigation callback.",
        },
        {
          name: "clearHighlight",
          type: "() => void",
          required: true,
          description: "Clears the current keyboard highlight.",
        },
        {
          name: "getHighlightedIndex",
          type: "() => number | null",
          required: true,
          description: "Returns the highlighted eligible-option index, or null.",
        },
      ],
    },
    ListActionDef: {
      name: "ListActionDef",
      summary: "Declarative action rendered by List.Actions.",
      type: "{ icon: React.ReactNode; title: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }",
      kind: "interface",
      members: [
        {
          name: "icon",
          type: "React.ReactNode",
          required: true,
          description: "Content rendered inside the generated action button.",
        },
        {
          name: "title",
          type: "string",
          required: true,
          description: "Tooltip content and accessible name for the action button.",
        },
        {
          name: "onClick",
          type: "React.MouseEventHandler<HTMLButtonElement>",
          required: false,
          description: "Runs when the generated action button is clicked.",
        },
      ],
    },
    ListItemStyleSlots: {
      name: "ListItemStyleSlots",
      summary: "Class-based slots for one List.Item and its List-owned descendants.",
      type: `{
  root?: Style;
  checkbox?: Style;
  control?: Style;
  media?: Style;
  title?: Style;
  desc?: Style;
  actions?: Style;
  action?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the option row." },
        {
          name: "checkbox",
          type: "Style",
          required: false,
          description: "Styles List.CheckboxIndicator.",
        },
        {
          name: "control",
          type: "Style",
          required: false,
          description: "Styles an embedded control wrapper.",
        },
        { name: "media", type: "Style", required: false, description: "Styles List.Media." },
        { name: "title", type: "Style", required: false, description: "Styles List.Title." },
        { name: "desc", type: "Style", required: false, description: "Styles List.Desc." },
        {
          name: "actions",
          type: "Style",
          required: false,
          description: "Styles the List.Actions container.",
        },
        {
          name: "action",
          type: "Style",
          required: false,
          description: "Styles generated List.Actions buttons.",
        },
      ],
    },
    ListItemStylesProp: {
      name: "ListItemStylesProp",
      summary: "Keyed class names for one List.Item anatomy.",
      type: "ListItemStyleSlots",
      kind: "alias",
    },
    ListItemStyleValue: {
      name: "ListItemStyleValue",
      summary: "A shared row class or keyed List.Item anatomy styles.",
      type: "Style | ListItemStyleSlots",
      kind: "alias",
      notes: [
        "A shared Style value applies to item.root; use the keyed form for a specific descendant.",
      ],
    },
    ListStyleSlots: {
      name: "ListStyleSlots",
      summary: "Class-based slots for the List root and stable compound anatomy.",
      type: `{
  root?: Style;
  header?: Style;
  item?: ListItemStyleValue;
  actionGroup?: Style;
  divider?: Style;
  footer?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the listbox root." },
        { name: "header", type: "Style", required: false, description: "Styles List.Header." },
        {
          name: "item",
          type: "ListItemStyleValue",
          required: false,
          description: "Styles every List.Item and its keyed anatomy.",
        },
        {
          name: "actionGroup",
          type: "Style",
          required: false,
          description: "Styles List.ActionGroup.",
        },
        { name: "divider", type: "Style", required: false, description: "Styles List.Divider." },
        { name: "footer", type: "Style", required: false, description: "Styles List.Footer." },
      ],
    },
    ListStylesProp: {
      name: "ListStylesProp",
      summary: "Keyed class names for List anatomy.",
      type: "ListStyleSlots",
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
        "Adds classes to the listbox root after its default class and before styles.root.",
      links: [
        { label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" },
      ],
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description:
        "Applies inline CSS properties to the listbox root. The gap prop supplies its internal gap variable when present.",
      links: [
        { label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style" },
      ],
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description:
        "Provides the accessible name for the listbox when no visible label identifies it.",
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
      description: "References element IDs that provide the listbox's accessible name.",
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
      description: "References element IDs that describe the listbox.",
      links: [
        {
          label: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
        },
      ],
    },
  ],

  subComponents: {
    props: {
      "List.Item": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description:
            "Adds classes to this option row after List-level item styles and before this item's styles.root.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className",
            },
          ],
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description:
            "Applies inline CSS properties to this option row. List-owned column layout supplies gridTemplateColumns when needed.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style",
            },
          ],
        },
        {
          name: "onClick",
          type: "React.MouseEventHandler<HTMLDivElement>",
          required: false,
          category: "Events",
          description:
            "Runs for a row click unless the event originates from a nested interactive control or the row is disabled. A successful click focuses the row.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event",
            },
          ],
        },
        {
          name: "onKeyDown",
          type: "React.KeyboardEventHandler<HTMLDivElement>",
          required: false,
          category: "Events",
          description:
            "Runs before List handles row navigation and activation. Prevent the event's default behavior to retain custom keyboard handling.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event",
            },
          ],
        },
        {
          name: "aria-disabled",
          type: 'React.AriaAttributes["aria-disabled"]',
          required: false,
          category: "Accessibility",
          description:
            "Removes the option from List keyboard navigation and suppresses row activation when set to true.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled",
            },
          ],
        },
      ],
    },
  },

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Accessibility" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description: "Stable List anatomy identity on the matching rendered element.",
      values: [
        "root",
        "header",
        "item",
        "item.checkbox",
        "item.control",
        "item.media",
        "item.title",
        "item.desc",
        "item.actions",
        "item.action",
        "actionGroup",
        "divider",
        "footer",
      ],
    },
    {
      name: "data-variant",
      description: "The configured List root variant.",
      values: ["default", "feed"],
    },
    {
      name: "data-orientation",
      description: "The configured layout and arrow-key axis.",
      values: ["vertical", "horizontal"],
    },
    {
      name: "data-gap",
      description: "The configured named gap step; omitted when no gap prop is supplied.",
      values: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      name: "data-spacing",
      description: "The configured spacing token.",
      values: ["default", "sm"],
    },
    {
      name: "data-focus-mode",
      description: "The root emits row while a row owns keyboard focus; it is omitted otherwise.",
      values: ["row"],
    },
    {
      name: "data-keyboard-mode",
      description:
        "The root emits true while row keyboard focus mode is active; it is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focused",
      description: "An option persistently emits true or false according to its focus state.",
      values: ["true", "false"],
    },
    {
      name: "data-focus-visible",
      description: "An option persistently emits true or false when focus is keyboard-visible.",
      values: ["true", "false"],
    },
    {
      name: "data-highlighted",
      description:
        "An option persistently emits true or false when it is the List keyboard-highlighted row.",
      values: ["true", "false"],
    },
    {
      name: "data-selected",
      description: "An option emits true when selected and omits the attribute otherwise.",
      values: ["true"],
    },
    {
      name: "data-interactive",
      description:
        "An option emits true when its interactive styling marker is enabled and omits it otherwise.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description:
        "An option preserves a supplied disabled marker; List treats true as disabled during navigation and activation.",
      values: ["true", "false"],
    },
    {
      name: "data-value",
      description: "An option emits its supplied value string; it is omitted without a value.",
    },
    {
      name: "data-list-layout",
      description:
        "An option emits columns when List-owned leading or trailing slots create column layout.",
      values: ["columns"],
    },
    {
      name: "data-list-focus-owner",
      description: "Marks the option row as the owner of List's roving focus behavior.",
      values: ["true"],
    },
    {
      name: "data-actions",
      description: "Marks the List.Actions container when it renders.",
      values: ["true"],
    },
    {
      name: "data-checked",
      description: "List.CheckboxIndicator persistently emits its indicator state.",
      values: ["true", "false"],
    },
    {
      name: "data-placement",
      description: "List.Checkbox emits its control placement.",
      values: ["start", "end"],
    },
    {
      name: "data-control",
      description: "List.Input marks its shared control wrapper as an input control.",
      values: ["input"],
    },
    {
      name: "data-justify",
      description: "List.ActionGroup persistently emits its resolved inline alignment.",
      values: ["start", "between", "end"],
    },
    {
      name: "data-list-primary-action",
      description: "Marks a nested control wrapper as the row's explicit activation target.",
      values: ["true"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map((prop) => {
      if (prop.name === "orientation") return { ...prop, type: "ListOrientation" };
      if (prop.name === "gap") return { ...prop, type: "ListGap" };
      if (prop.name === "styles") return { ...prop, type: "ListStylesProp" };
      return prop;
    }),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name,
            {
              ...component,
              props: component.props.map((prop) => {
                if (name === "List.Item" && prop.name === "styles") {
                  return { ...prop, type: "ListItemStylesProp" };
                }
                if (
                  (name === "List.Item" || name === "List.Actions") &&
                  prop.name === "actions"
                ) {
                  return { ...prop, type: "Array<ListActionDef | React.ReactNode>" };
                }
                return prop;
              }),
            },
          ]),
        )
      : undefined,
  }),
} satisfies ComponentAPIEnrichment;
