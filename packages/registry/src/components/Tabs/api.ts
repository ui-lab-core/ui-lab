import type { APIEnumValue, ComponentAPIEnrichment } from "../../types";

/**
 * Hand-authored API documentation for Tabs. The generator merges this over
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
    TabsStyleSlots: {
      name: "TabsStyleSlots",
      summary: "Style overrides for the Tabs root and the tab list it owns.",
      type: "{ root?: Style; list?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the root element that wraps the tab list and its panels.",
        },
        {
          name: "list",
          type: "Style",
          required: false,
          description:
            "Styles the Tabs.List element rendered inside this root. It composes with Tabs.List's own className and styles.root.",
        },
      ],
    },
    TabsStylesProp: {
      name: "TabsStylesProp",
      summary: "Style overrides accepted by Tabs.",
      type: "TabsStyleSlots",
      kind: "alias",
    },
    TabsListIndicatorStyleSlots: {
      name: "TabsListIndicatorStyleSlots",
      summary: "Style overrides for the two elements that render the selection indicator.",
      type: "{ root?: Style; fallback?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the measured indicator that tracks the selected tab after layout.",
        },
        {
          name: "fallback",
          type: "Style",
          required: false,
          description:
            "Styles the placeholder indicator rendered during server rendering and before the first measurement.",
        },
      ],
      notes: [
        "Passing a single Style value instead of this object applies it to both indicator elements.",
      ],
    },
    TabsListStyleSlots: {
      name: "TabsListStyleSlots",
      summary: "Style overrides for the Tabs.List root and the parts it owns.",
      type: "{ root?: Style; indicator?: Style | TabsListIndicatorStyleSlots; trigger?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: 'Styles the element with role="tablist".',
        },
        {
          name: "indicator",
          type: "Style | TabsListIndicatorStyleSlots",
          required: false,
          description:
            "Shared indicator styles, or separate styles for the measured and fallback indicators.",
        },
        {
          name: "trigger",
          type: "Style",
          required: false,
          description:
            "Styles every Tabs.Trigger rendered inside this list. It composes with each trigger's own className and styles.root.",
        },
      ],
    },
    TabsListStylesProp: {
      name: "TabsListStylesProp",
      summary: "Style overrides accepted by Tabs.List.",
      type: "TabsListStyleSlots",
      kind: "alias",
    },
    TabsTriggerIconSlots: {
      name: "TabsTriggerIconSlots",
      summary: "Icon content rendered on either side of a tab label.",
      type: "{ left?: React.ReactNode; right?: React.ReactNode }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered before the tab label.",
        },
        {
          name: "right",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered after the tab label.",
        },
      ],
      notes: ["Passing a single node instead of this object renders it before the label."],
    },
    TabsTriggerIconStyleSlots: {
      name: "TabsTriggerIconStyleSlots",
      summary: "Side-specific styles used when the trigger's icon slot is configured as an object.",
      type: "{ left?: Style; right?: Style }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "Style",
          required: false,
          description: "Styles the leading icon wrapper.",
        },
        {
          name: "right",
          type: "Style",
          required: false,
          description: "Styles the trailing icon wrapper.",
        },
      ],
    },
    TabsTriggerStyleSlots: {
      name: "TabsTriggerStyleSlots",
      summary: "Style overrides for the Tabs.Trigger root and its icon slots.",
      type: "{ root?: Style; icon?: Style | TabsTriggerIconStyleSlots }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the tab button element.",
        },
        {
          name: "icon",
          type: "Style | TabsTriggerIconStyleSlots",
          required: false,
          description: "Shared icon styles, or separate leading and trailing icon styles.",
        },
      ],
    },
    TabsTriggerStylesProp: {
      name: "TabsTriggerStylesProp",
      summary: "Style overrides accepted by Tabs.Trigger.",
      type: "TabsTriggerStyleSlots",
      kind: "alias",
    },
    TabsContentStyleSlots: {
      name: "TabsContentStyleSlots",
      summary: "Style overrides for the Tabs.Content root.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: 'Styles the element with role="tabpanel".',
        },
      ],
    },
    TabsContentStylesProp: {
      name: "TabsContentStylesProp",
      summary: "Style overrides accepted by Tabs.Content.",
      type: "TabsContentStyleSlots",
      kind: "alias",
    },
  },

  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Core",
      description: "The Tabs.List and Tabs.Content elements this root owns.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Classes appended to the root element after its component and module classes.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the root element.",
    },
  ],

  subComponents: {
    include: (name: string) => name === "Tabs.List" || name === "Tabs.Trigger" || name === "Tabs.Content",
    props: {
      "Tabs.List": [
        {
          name: "children",
          type: "React.ReactNode",
          required: false,
          category: "Core",
          description: "The Tabs.Trigger elements rendered in this list.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Classes appended to the tab list after its anatomy and module classes.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the tab list element.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description:
            "Accessible name for the tab list. Supply it, or aria-labelledby, so the list is announced with a name.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
          },
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "References the element that labels the tab list.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
          },
        },
      ],
      "Tabs.Trigger": [
        {
          name: "children",
          type: "React.ReactNode",
          required: false,
          category: "Content",
          description: "The tab label rendered between the icon slots.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Classes appended to the tab button after its anatomy and module classes.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the tab button element.",
        },
        {
          name: "onClick",
          type: "React.MouseEventHandler<HTMLButtonElement>",
          required: false,
          category: "Events",
          description:
            "Native click handler. It is preserved alongside the press behavior that selects the tab, and does not fire while the tab is disabled.",
          tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" },
        },
        {
          name: "onKeyDown",
          type: "React.KeyboardEventHandler<HTMLButtonElement>",
          required: false,
          category: "Events",
          description:
            "Native keydown handler. It runs alongside the arrow, Home, End, and Tab navigation the trigger installs.",
          tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event" },
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description:
            "Accessible name for the tab. Required when the trigger renders an icon with no text label.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
          },
        },
      ],
      "Tabs.Content": [
        {
          name: "children",
          type: "React.ReactNode",
          required: false,
          category: "Core",
          description: "Panel content. It is only rendered while the matching tab is selected.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Classes appended to the panel after its anatomy and module classes.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the panel element.",
        },
        {
          name: "tabIndex",
          type: "number",
          required: false,
          category: "Accessibility",
          description:
            "Adds the panel to the tab order. Pass 0 when the panel holds no focusable content so keyboard users can reach it.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex",
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
    { name: "Accessibility" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable anatomy identity for the root, the tab list, each trigger, both indicator elements, the trigger icons, and each panel.",
      values: [
        "root",
        "list",
        "trigger",
        "indicator.root",
        "indicator.fallback",
        "icon.left",
        "icon.right",
        "content",
      ],
    },
    {
      name: "data-orientation",
      description:
        "The configured layout direction, published on the root, the tab list, and every panel.",
      values: ["horizontal", "vertical"],
    },
    {
      name: "data-variant",
      description:
        "The configured variant, published on the root and the tab list. It is omitted when no variant is set.",
      values: ["underline"],
    },
    {
      name: "data-selected",
      description: "Set on every trigger: true on the selected tab and false on the others.",
      values: ["true", "false"],
    },
    {
      name: "data-disabled",
      description: "The trigger is disabled; the attribute is omitted while it is enabled.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over an enabled trigger.",
      values: ["true", "false"],
    },
    {
      name: "data-pressed",
      description: "The trigger is currently pressed.",
      values: ["true", "false"],
    },
    { name: "data-focused", description: "The trigger has focus.", values: ["true", "false"] },
    {
      name: "data-focus-visible",
      description:
        "The trigger has keyboard-visible focus, which is what draws the shared focus ring.",
      values: ["true", "false"],
    },
    {
      name: "data-tabs-value",
      description:
        "The trigger's value, used to pair it with its panel and to measure the indicator.",
    },
    {
      name: "data-indicator-ready",
      description:
        "Set on the selected trigger once the indicator has been measured; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-indicator-fallback",
      description:
        "Set on the selected trigger before the first measurement, and on every placeholder indicator frame rendered during server rendering.",
      values: ["true"],
    },
    {
      name: "data-animate",
      description:
        "Set on the measured indicator: false while keyboard navigation moves it without a transition, true otherwise.",
      values: ["true", "false"],
    },
    {
      name: "data-ring",
      description: "Marks the trigger as the element the shared focus ring is drawn on.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description:
        "Marks the trigger as drawing the shared focus ring on the focused element itself.",
      values: ["target"],
    },
  ],

  refine: (api) => {
    const optionsByProp: Record<string, APIEnumValue[]> = {
      variant: [
        {
          value: "underline",
          description:
            "Draws the indicator as a thin bar along the list's block end, or its inline start when the orientation is vertical, and removes the list's filled surface.",
        },
      ],
      orientation: [
        {
          value: "horizontal",
          description:
            "Lays the triggers out in a row and draws the indicator along the list's block end.",
        },
        {
          value: "vertical",
          description:
            "Lays the triggers out in a column beside the panel and draws the indicator along the list's inline start.",
        },
      ],
      type: [
        { value: "button", description: "Activates the tab without submitting a surrounding form." },
        {
          value: "submit",
          description: "Also submits the surrounding form when the tab is activated.",
        },
        {
          value: "reset",
          description: "Also resets the surrounding form when the tab is activated.",
        },
      ],
    };

    const withOptions = (props: typeof api.props) =>
      props.map((prop) =>
        optionsByProp[prop.name] && prop.enumValues?.length
          ? { ...prop, enumValueDetails: optionsByProp[prop.name] }
          : prop,
      );

    return {
      ...api,
      props: withOptions(api.props),
      subComponents: api.subComponents
        ? Object.fromEntries(
            Object.entries(api.subComponents).map(([name, component]) => [
              name,
              { ...component, props: withOptions(component.props) },
            ]),
          )
        : api.subComponents,
    };
  },
} satisfies ComponentAPIEnrichment;
