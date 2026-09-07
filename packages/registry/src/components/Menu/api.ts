import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

const ARIA_LABEL_MDN =
  "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label";
const STYLE_MDN = "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style";
const CLASS_NAME_MDN = "https://developer.mozilla.org/en-US/docs/Web/API/Element/className";

const childrenProp = (description: string): PropDefinition => ({
  name: "children",
  type: "React.ReactNode",
  required: false,
  category: "Content",
  description,
});
const styleProp = (description: string): PropDefinition => ({
  name: "style",
  type: "React.CSSProperties",
  required: false,
  category: "Styling",
  description,
  links: [{ label: "MDN", url: STYLE_MDN }],
});
const classNameProp = (description: string): PropDefinition => ({
  name: "className",
  type: "string",
  required: false,
  category: "Styling",
  description,
  links: [{ label: "MDN", url: CLASS_NAME_MDN }],
});

const buttonOnly: Record<string, string> = {
  variant:
    "Variant class applied when the trigger renders a Button. The span branch does not forward it.",
  size: "Size class applied when the trigger renders a Button. The span branch does not forward it.",
  icon: "Icon content rendered beside the label when the trigger renders a Button. The span branch does not forward it.",
  hint: "Keyboard hint rendered after the label when the trigger renders a Button. The span branch does not forward it.",
  onPress:
    "React Aria press handler available when the trigger renders a Button. It runs alongside the Menu's own toggle handling.",
  href: "Renders the Button trigger branch as an anchor. The span branch does not forward it.",
  target:
    "Browsing context used when the Button trigger branch renders an anchor. The span branch does not forward it.",
};

const normalizeMenuPropType = (componentName: string, prop: PropDefinition): PropDefinition => {
  if (componentName === "Menu") {
    if (prop.name === "type") return { ...prop, type: "MenuType" };
    if (prop.name === "selectionMode") return { ...prop, type: "MenuSelectionMode" };
  }
  if (componentName === "Menu.Trigger") {
    if (prop.name === "as") return { ...prop, type: "MenuTriggerAs" };
    if (buttonOnly[prop.name]) {
      return { ...prop, description: buttonOnly[prop.name] };
    }
  }
  if (componentName === "Menu.Content" && prop.name === "side") {
    return {
      ...prop,
      enumValueDetails: [
        { value: "top", description: "Places the panel above the trigger." },
        { value: "bottom", description: "Places the panel below the trigger." },
        { value: "left", description: "Places the panel before the trigger in the inline axis." },
        { value: "right", description: "Places the panel after the trigger in the inline axis." },
      ],
    };
  }
  if (componentName === "Menu.Content" && prop.name === "align") {
    return {
      ...prop,
      enumValueDetails: [
        { value: "start", description: "Aligns the panel's leading edge with the trigger." },
        { value: "center", description: "Centers the panel against the trigger." },
        { value: "end", description: "Aligns the panel's trailing edge with the trigger." },
      ],
    };
  }
  if (componentName === "Menu.Trigger" && prop.name === "data-hovered") {
    return {
      ...prop,
      enumValueDetails: [
        {
          value: "true",
          description: "Forces the Button branch to paint its hover treatment.",
        },
        {
          value: "false",
          description: "Suppresses the Button branch's own hover treatment.",
        },
      ],
    };
  }
  return prop;
};

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by Menu style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    Key: {
      name: "Key",
      summary: "Stable identity used by Menu for focus, typeahead, and selection tracking.",
      type: "string | number",
      kind: "alias",
      notes: [
        "An item without an explicit id falls back to a generated React id, which is stable for the lifetime of that element but not meaningful to persist.",
      ],
    },
    MenuType: {
      name: "MenuType",
      summary: "How the Menu is opened and where its panel is anchored.",
      type: '"context-menu" | "pop-over"',
      kind: "alias",
      values: [
        {
          value: "context-menu",
          description:
            "The trigger opens the panel on right-click and anchors it to the pointer position.",
        },
        {
          value: "pop-over",
          description:
            "The trigger opens the panel on click or Enter/Space and anchors it to the trigger using side, align, and offset.",
        },
      ],
    },
    MenuSelectionMode: {
      name: "MenuSelectionMode",
      summary: "How many Menu.Item elements may be selected at once.",
      type: '"none" | "single" | "multiple"',
      kind: "alias",
      values: [
        {
          value: "none",
          description:
            "Items are plain commands with role menuitem and no indicator; onSelectionChange is never called.",
        },
        {
          value: "single",
          description:
            "Items render as role menuitemradio with a dot indicator, and activating one replaces the selected key set.",
        },
        {
          value: "multiple",
          description:
            "Items render as role menuitemcheckbox with a check indicator, activating one toggles its key, and the panel stays open.",
        },
      ],
    },
    MenuTriggerAs: {
      name: "MenuTriggerAs",
      summary: "Element rendered by Menu.Trigger.",
      type: '"button" | "span" | "child"',
      kind: "alias",
      values: [
        {
          value: "button",
          description:
            "Renders a UI Lab Button, so variant, size, icon, hint, href, and target apply.",
        },
        {
          value: "span",
          description:
            "Renders a span. Pop-over menus add role button and a tab stop; Button-only props are not forwarded.",
        },
        {
          value: "child",
          description:
            "Clones the single React element child and merges the trigger props, classes, and ref into it.",
        },
      ],
    },
    ButtonVariant: {
      name: "ButtonVariant",
      summary: "Variant class applied when Menu.Trigger renders a Button.",
      type: "DefaultButtonVariant | keyof ButtonVariantOverrides | (string & {})",
      kind: "alias",
      notes: ["Themes supply the known variant names without preventing custom variant classes."],
    },
    ButtonSize: {
      name: "ButtonSize",
      summary: "An open string type used to select a button size class.",
      type: "string & {}",
      kind: "alias",
      notes: ["Known stylesheet sizes are accepted without preventing custom size names."],
    },
    ButtonIconSlots: {
      name: "ButtonIconSlots",
      summary: "Icon content rendered on either side of the Button trigger label.",
      type: "{ left?: React.ReactNode; right?: React.ReactNode }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered before the trigger label.",
        },
        {
          name: "right",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered after the trigger label.",
        },
      ],
    },
    HintValue: {
      name: "HintValue",
      summary: "Content displayed as a compact hint or keyboard shortcut on a Button trigger.",
      type: "React.ReactNode | React.ReactNode[]",
      kind: "alias",
      examples: ['hint="Esc"', 'hint={["Ctrl", "K"]}'],
      notes: ["Arrays render as shortcut segments joined by a plus divider."],
    },
    MenuTriggerStyleSlots: {
      name: "MenuTriggerStyleSlots",
      summary: "Class-based slots for the Menu.Trigger anatomy.",
      type: `{
  root?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the rendered trigger element.",
        },
      ],
    },
    MenuContentListStyles: {
      name: "MenuContentListStyles",
      summary: "Class-based slots for the option-list anatomy rendered inside Menu.Content.",
      type: `{
  root?: Style;
  padding?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the List element that groups the rendered menu items.",
        },
        {
          name: "padding",
          type: "Style",
          required: false,
          description: "Styles the padding wrapper between the panel and the item list.",
        },
      ],
    },
    MenuContentStyleSlots: {
      name: "MenuContentStyleSlots",
      summary: "Class-based slots for the Menu.Content anatomy.",
      type: `{
  root?: Style;
  overlay?: Style;
  list?: Style | MenuContentListStyles;
}`,
      kind: "interface",
      notes: [
        "A shared Style on list applies to both list.root and list.padding; use the object form to address one of them.",
      ],
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the menu panel that carries role menu.",
        },
        {
          name: "overlay",
          type: "Style",
          required: false,
          description: "Styles the portalled, positioned overlay that holds the panel.",
        },
        {
          name: "list",
          type: "Style | MenuContentListStyles",
          required: false,
          description: "Styles every list part, or individually styles list.root and list.padding.",
        },
      ],
    },
    MenuGroupStyleSlots: {
      name: "MenuGroupStyleSlots",
      summary: "Class-based slots for the Menu.Group anatomy.",
      type: `{
  root?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the role group container.",
        },
      ],
    },
    MenuItemStyleSlots: {
      name: "MenuItemStyleSlots",
      summary: "Class-based slots for the Menu.Item anatomy.",
      type: `{
  root?: Style;
  indicator?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the item row.",
        },
        {
          name: "indicator",
          type: "Style",
          required: false,
          description:
            "Styles the leading selection indicator, which only renders while selectionMode is single or multiple.",
        },
      ],
    },
    MenuCheckboxItemStyleSlots: {
      name: "MenuCheckboxItemStyleSlots",
      summary: "Class-based slots for the Menu.CheckboxItem anatomy.",
      type: `{
  root?: Style;
  indicator?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the item row.",
        },
        {
          name: "indicator",
          type: "Style",
          required: false,
          description: "Styles the leading checkmark indicator wrapper.",
        },
      ],
    },
    MenuRadioGroupStyleSlots: {
      name: "MenuRadioGroupStyleSlots",
      summary: "Class-based slots for the Menu.RadioGroup anatomy.",
      type: `{
  root?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the role group container that scopes the radio value.",
        },
      ],
    },
    MenuRadioItemStyleSlots: {
      name: "MenuRadioItemStyleSlots",
      summary: "Class-based slots for the Menu.RadioItem anatomy.",
      type: `{
  root?: Style;
  indicator?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the item row.",
        },
        {
          name: "indicator",
          type: "Style",
          required: false,
          description: "Styles the leading radio indicator wrapper.",
        },
      ],
    },
    MenuLabelStyleSlots: {
      name: "MenuLabelStyleSlots",
      summary: "Class-based slots for the Menu.Label anatomy.",
      type: `{
  root?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the section label.",
        },
      ],
    },
    MenuSeparatorStyleSlots: {
      name: "MenuSeparatorStyleSlots",
      summary: "Class-based slots for the Menu.Separator anatomy.",
      type: `{
  root?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the role separator rule.",
        },
      ],
    },
    MenuShortcutStyleSlots: {
      name: "MenuShortcutStyleSlots",
      summary: "Class-based slots for the Menu.Shortcut anatomy.",
      type: `{
  root?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the trailing shortcut hint.",
        },
      ],
    },
    MenuSubTriggerStyleSlots: {
      name: "MenuSubTriggerStyleSlots",
      summary: "Class-based slots for the Menu.SubTrigger anatomy.",
      type: `{
  root?: Style;
  chevron?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the submenu trigger row.",
        },
        {
          name: "chevron",
          type: "Style",
          required: false,
          description: "Styles the trailing chevron that indicates the submenu.",
        },
      ],
    },
    MenuSubContentListStyles: {
      name: "MenuSubContentListStyles",
      summary: "Class-based slots for the option-list anatomy rendered inside Menu.SubContent.",
      type: `{
  root?: Style;
  padding?: Style;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the List element that groups the rendered submenu items.",
        },
        {
          name: "padding",
          type: "Style",
          required: false,
          description: "Styles the padding wrapper between the submenu panel and the item list.",
        },
      ],
    },
    MenuSubContentStyleSlots: {
      name: "MenuSubContentStyleSlots",
      summary: "Class-based slots for the Menu.SubContent anatomy.",
      type: `{
  root?: Style;
  overlay?: Style;
  list?: Style | MenuSubContentListStyles;
}`,
      kind: "interface",
      notes: [
        "A shared Style on list applies to both list.root and list.padding; use the object form to address one of them.",
      ],
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the submenu panel that carries role menu.",
        },
        {
          name: "overlay",
          type: "Style",
          required: false,
          description: "Styles the portalled, positioned overlay that holds the submenu panel.",
        },
        {
          name: "list",
          type: "Style | MenuSubContentListStyles",
          required: false,
          description: "Styles every list part, or individually styles list.root and list.padding.",
        },
      ],
    },
  },

  props: [childrenProp("Menu.Trigger, Menu.Content, and any Menu.Portal wrapper that scopes them.")],

  subComponents: {
    // Contexts and hooks exported from the same files are not public compound parts.
    include: (name: string) => name.startsWith("Menu."),
    props: {
      "Menu.Portal": [
        childrenProp("Menu.Content and Menu.SubContent elements that should render into container."),
      ],
      "Menu.Trigger": [
        childrenProp(
          'Trigger content. With as="child" this must be exactly one non-Fragment element, which receives the merged trigger props.',
        ),
        styleProp("Applies inline CSS properties to the rendered trigger element."),
        {
          name: "onClick",
          type: "React.MouseEventHandler<HTMLElement>",
          required: false,
          category: "Events",
          description:
            "Runs alongside the trigger's own capture-phase toggle handler. It does not suppress opening the Menu.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event",
            },
          ],
        },
        {
          name: "rel",
          type: "string",
          required: false,
          category: "Link behavior",
          description:
            "Relationship applied when the Button branch renders an anchor. Ignored by the span branch.",
          links: [
            { label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel" },
          ],
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description:
            "Accessible name for the trigger, required when it renders icon-only content. The trigger already publishes aria-haspopup and aria-expanded.",
          links: [{ label: "MDN", url: ARIA_LABEL_MDN }],
        },
      ],
      "Menu.Content": [
        childrenProp("Menu items, groups, labels, separators, and submenus rendered in the panel."),
        styleProp(
          "Applies inline CSS properties to the panel. Menu appends its own entrance opacity and transform values after them.",
        ),
        {
          name: "onKeyDown",
          type: "React.KeyboardEventHandler<HTMLDivElement>",
          required: false,
          category: "Events",
          description:
            "Runs before the panel's navigation, activation, and dismissal handling. Prevent the event's default behavior to keep Menu from handling the key.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event",
            },
          ],
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description:
            "Accessible name for the panel, useful when no visible label describes the menu.",
          links: [{ label: "MDN", url: ARIA_LABEL_MDN }],
        },
      ],
      "Menu.Group": [
        childrenProp("Related menu items and an optional Menu.Label."),
        classNameProp(
          "Adds classes to the group container after its module class and before the resolved styles.root class.",
        ),
      ],
      "Menu.RadioGroup": [
        childrenProp("Menu.RadioItem elements that share this group's value."),
        classNameProp(
          "Adds classes to the group container after its module class and before the resolved styles.root class.",
        ),
      ],
      "Menu.Item": [
        childrenProp("Item content, such as a label, leading icon, and Menu.Shortcut."),
        styleProp("Applies inline CSS properties to the item row."),
        {
          name: "onClick",
          type: "React.MouseEventHandler<HTMLDivElement>",
          required: false,
          category: "Events",
          description:
            "Runs before the item activates. Prevent the event's default behavior to stop selection, onSelect, and the Menu closing.",
          links: [
            {
              label: "MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event",
            },
          ],
        },
      ],
      "Menu.CheckboxItem": [
        childrenProp("Item content rendered after the checkmark indicator."),
        styleProp("Applies inline CSS properties to the item row."),
      ],
      "Menu.RadioItem": [
        childrenProp("Item content rendered after the radio indicator."),
        styleProp("Applies inline CSS properties to the item row."),
      ],
      "Menu.Label": [childrenProp("Section label text.")],
      "Menu.Shortcut": [childrenProp("Shortcut hint text, such as a key combination.")],
      "Menu.SubTrigger": [
        childrenProp("Row content rendered before the submenu chevron."),
        styleProp("Applies inline CSS properties to the submenu trigger row."),
      ],
      "Menu.SubContent": [
        childrenProp("Submenu items, groups, labels, separators, and nested submenus."),
        styleProp(
          "Applies inline CSS properties to the submenu panel. Menu appends its own entrance opacity and transform values after them.",
        ),
      ],
    },
  },

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Selection" },
    { name: "Overlay" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Accessibility" },
    { name: "Link behavior" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable Menu anatomy identity on the matching rendered element. Menu.Item, Menu.CheckboxItem, and Menu.RadioItem rows carry List's item identity instead.",
      values: ["root", "overlay", "list.padding", "indicator", "chevron", "item"],
    },
    {
      name: "data-type",
      description: "The trigger publishes the Menu's configured interaction type.",
      values: ["context-menu", "pop-over"],
    },
    {
      name: "data-open",
      description: "The trigger persistently publishes whether the Menu panel is open.",
      values: ["true", "false"],
    },
    {
      name: "data-state",
      description:
        "A panel publishes open while it is visible and closed while it is mounted but hidden. Menu.SubTrigger publishes its submenu's state, and Menu.CheckboxItem and Menu.RadioItem publish their checked state instead.",
      values: ["open", "closed", "checked", "unchecked"],
    },
    {
      name: "data-placement",
      description: "A panel publishes the resolved floating side after positioning.",
      values: ["top", "bottom", "left", "right"],
    },
    {
      name: "data-highlighted",
      description:
        "An item row or submenu trigger persistently publishes whether it is the current keyboard or pointer navigation target.",
      values: ["true", "false"],
    },
    {
      name: "data-focused",
      description:
        "An item row or submenu trigger persistently publishes the same navigation target state as data-highlighted; the trigger publishes its own focus state.",
      values: ["true", "false"],
    },
    {
      name: "data-focus-visible",
      description:
        "The span and child trigger branches publish keyboard-visible focus; the Button branch publishes its own.",
      values: ["true", "false"],
    },
    {
      name: "data-hovered",
      description:
        "The trigger publishes true while the pointer is over it or the Menu is open, and Menu.SubTrigger publishes pointer hover. The Button branch receives true only while the Menu is open and otherwise tracks its own hover.",
      values: ["true", "false"],
    },
    {
      name: "data-pressed",
      description: "The Button trigger branch publishes its own press state.",
      values: ["true", "false"],
    },
    {
      name: "data-selected",
      description:
        "A Menu.Item row emits true while selectionMode is single or multiple and its key is selected; it is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-disabled",
      description:
        "A disabled trigger, item row, or submenu trigger emits true; it is omitted when enabled.",
      values: ["true"],
    },
    {
      name: "data-inset",
      description:
        "Menu.Item, Menu.Label, and Menu.SubTrigger emit true when inset is set; the attribute is omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-value",
      description: "An item row publishes its resolved key through List's option value attribute.",
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map((prop) => normalizeMenuPropType("Menu", prop)),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name,
            { ...component, props: component.props.map((prop) => normalizeMenuPropType(name, prop)) },
          ]),
        )
      : undefined,
  }),
} satisfies ComponentAPIEnrichment;
