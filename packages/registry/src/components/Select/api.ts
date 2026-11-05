import type { ComponentAPIEnrichment } from "../../types";

/**
 * Hand-authored API documentation for Select. The generator merges this over
 * what react-docgen-typescript extracts from the component source.
 */
export const apiEnrichment = {
  documentation: {
    props: {
      value: { description: "Controlled key (single) or keys (multiple). null explicitly clears a single selection; undefined leaves selection uncontrolled unless selectedKey/selectedKeys is supplied. state.value takes precedence." },
      selectedKey: { description: "Controlled single-selection key. null is an explicitly empty controlled selection. Use selected only for an uncontrolled initial value." },
      open: { description: "Legacy initial panel visibility. Prefer defaultOpen for initial visibility. For controlled visibility use state={{ open }} and onOpenChange." },
    },
  },
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
      summary: "Object form that supplies className and style to one slot.",
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
    SelectItemData: {
      name: "SelectItemData",
      summary:
        "Registered option data used for navigation, filtering, and Select.Value render functions.",
      type: "{ key: Key; textValue: string; isDisabled?: boolean; icon?: React.ReactNode }",
      kind: "interface",
      members: [
        {
          name: "key",
          type: "Key",
          required: true,
          description: "The option's value, used for selection and focus tracking.",
        },
        {
          name: "textValue",
          type: "string",
          required: true,
          description: "Text used for the trigger label and for search matching.",
        },
        {
          name: "isDisabled",
          type: "boolean",
          required: false,
          description: "Whether the option rejects selection and keyboard focus.",
        },
        {
          name: "icon",
          type: "React.ReactNode",
          required: false,
          description: "Icon content registered alongside the option.",
        },
      ],
      notes: [
        "Select.Item children register this data automatically; the items prop supplies it directly.",
      ],
    },
    SelectMode: {
      name: "SelectMode",
      summary: "Selection behavior for the Select root.",
      type: '"single" | "multiple"',
      kind: "alias",
      notes: [
        "Multiple mode renders a checkbox in every option and marks the panel aria-multiselectable.",
      ],
      values: [
        {
          value: "single",
          description: "Selecting an option replaces the current value and the panel closes.",
        },
        {
          value: "multiple",
          description:
            "Selecting an option toggles it in the current value set and the panel stays open.",
        },
      ],
    },
    SelectTriggerMode: {
      name: "SelectTriggerMode",
      summary: "How a Select trigger opens its option panel.",
      type: '"click" | "hover"',
      kind: "alias",
      notes: [
        "Hover mode opens on pointer entry and closes shortly after the pointer leaves the trigger and panel.",
      ],
      values: [
        {
          value: "click",
          description: "The panel opens when the trigger is clicked or activated by keyboard.",
        },
        {
          value: "hover",
          description:
            "The panel opens on pointer entry and closes shortly after the pointer leaves the trigger and panel.",
        },
      ],
    },
    SelectState: {
      name: "SelectState",
      summary: "Controlled selection and open state supplied to Select.",
      type: "{ value?: Key | Key[] | null; open?: boolean }",
      kind: "interface",
      members: [
        {
          name: "value",
          type: "Key | Key[] | null",
          required: false,
          description: "Selected key in single mode or selected keys in multiple mode.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Whether the option panel is open.",
        },
      ],
      notes: [
        "Values supplied here take precedence over value, selectedKey, selectedKeys, and open.",
      ],
    },
    SelectStyleSlots: {
      name: "SelectStyleSlots",
      summary: "Named style slot for the Select root.",
      type: "{ root?: SlotStyle }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyle",
          required: false,
          description:
            "Styles the root wrapper; its inline style is also copied onto the portalled content overlay.",
        },
      ],
      notes: [
        "A class supplied here does not reach the portalled overlay because the overlay is not a descendant of the root.",
      ],
    },
    SelectStylesProp: {
      name: "SelectStylesProp",
      summary: "Style override for the Select root.",
      type: "SelectStyleSlots",
      kind: "alias",
    },
    SelectTriggerVariant: {
      name: "SelectTriggerVariant",
      summary: "An open string type selecting the Select surface treatment.",
      type: '"ghost" | (string & {})',
      kind: "alias",
      notes: [
        "The value is published on the Select root as a global class and as data-variant, so themes can restyle the whole surface.",
      ],
    },
    SelectTriggerIconSlots: {
      name: "SelectTriggerIconSlots",
      summary: "Icon content rendered at either edge of the trigger.",
      type: "{ prefix?: React.ReactNode; chevron?: React.ReactNode }",
      kind: "interface",
      members: [
        {
          name: "prefix",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered before the trigger value, in the icon.left slot.",
        },
        {
          name: "chevron",
          type: "React.ReactNode",
          required: false,
          description: "Content replacing the default chevron, in the icon.right slot.",
        },
      ],
      notes: ["icon.chevron takes precedence over the standalone chevron prop."],
    },
    SelectTriggerIconStyles: {
      name: "SelectTriggerIconStyles",
      summary: "Styles for the individual trigger icon parts.",
      type: "{ left?: Style; right?: Style; section?: Style }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "Style",
          required: false,
          description: "Styles the prefix icon wrapper rendered before the trigger value.",
        },
        {
          name: "right",
          type: "Style",
          required: false,
          description: "Styles the chevron wrapper rendered inside the icon section.",
        },
        {
          name: "section",
          type: "Style",
          required: false,
          description: "Styles the section that holds the trailing chevron.",
        },
      ],
    },
    SelectTriggerStyleSlots: {
      name: "SelectTriggerStyleSlots",
      summary: "Named style slots for the Select.Trigger anatomy.",
      type: "{ root?: Style; value?: Style; icon?: Style | SelectTriggerIconStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the trigger button." },
        {
          name: "value",
          type: "Style",
          required: false,
          description: "Styles the trigger value section.",
        },
        {
          name: "icon",
          type: "Style | SelectTriggerIconStyles",
          required: false,
          description:
            "Styles every icon part, or individually styles icon.left, icon.right, and icon.section.",
        },
      ],
      notes: [
        "A single class supplied to icon is applied to icon.left, icon.right, and icon.section.",
      ],
    },
    SelectTriggerStylesProp: {
      name: "SelectTriggerStylesProp",
      summary: "Class-based style overrides for Select.Trigger's root and named anatomy slots.",
      type: "StylesProp<SelectTriggerStyleSlots>",
      kind: "alias",
      notes: [
        "Nested slot objects address dotted anatomy paths such as icon.left and icon.section.",
      ],
    },
    SearchableTriggerIconStyles: {
      name: "SearchableTriggerIconStyles",
      summary: "Styles for the individual searchable trigger icon parts.",
      type: "{ right?: Style; section?: Style }",
      kind: "interface",
      members: [
        {
          name: "right",
          type: "Style",
          required: false,
          description: "Styles the chevron wrapper.",
        },
        {
          name: "section",
          type: "Style",
          required: false,
          description: "Styles the section that holds the chevron.",
        },
      ],
    },
    SearchableTriggerStyleSlots: {
      name: "SearchableTriggerStyleSlots",
      summary: "Named style slots for the Select.SearchableTrigger anatomy.",
      type: "{ root?: Style; value?: Style; input?: Style; icon?: Style | SearchableTriggerIconStyles }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the searchable trigger wrapper.",
        },
        {
          name: "value",
          type: "Style",
          required: false,
          description: "Styles the section that holds the search input.",
        },
        {
          name: "input",
          type: "Style",
          required: false,
          description: "Styles the search input surface.",
        },
        {
          name: "icon",
          type: "Style | SearchableTriggerIconStyles",
          required: false,
          description:
            "Styles every icon part, or individually styles icon.right and icon.section.",
        },
      ],
    },
    SearchableTriggerStylesProp: {
      name: "SearchableTriggerStylesProp",
      summary:
        "Class-based style overrides for Select.SearchableTrigger's root and named anatomy slots.",
      type: "StylesProp<SearchableTriggerStyleSlots>",
      kind: "alias",
    },
    SelectContentSearchStyles: {
      name: "SelectContentSearchStyles",
      summary: "Styles for the search anatomy rendered inside searchable content.",
      type: "{ wrapper?: SlotStyle; input?: SlotStyle }",
      kind: "interface",
      members: [
        {
          name: "wrapper",
          type: "SlotStyle",
          required: false,
          description: "Styles the wrapper around the panel search input.",
        },
        {
          name: "input",
          type: "SlotStyle",
          required: false,
          description: "Styles the panel search input surface.",
        },
      ],
    },
    SelectContentListStyles: {
      name: "SelectContentListStyles",
      summary: "Styles for the option-list anatomy rendered inside the panel.",
      type: "{ root?: SlotStyle; padding?: SlotStyle }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyle",
          required: false,
          description: "Styles the element that groups the rendered options.",
        },
        {
          name: "padding",
          type: "SlotStyle",
          required: false,
          description: "Styles the padding wrapper around the option list.",
        },
      ],
    },
    SelectContentStyleSlots: {
      name: "SelectContentStyleSlots",
      summary: "Named style slots for the Select.Content anatomy.",
      type: "{ root?: SlotStyle; overlay?: SlotStyle; search?: SelectContentSearchStyles; empty?: SlotStyle; list?: SelectContentListStyles }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyle",
          required: false,
          description: "Styles the listbox panel.",
        },
        {
          name: "overlay",
          type: "SlotStyle",
          required: false,
          description: "Styles the positioned floating overlay.",
        },
        {
          name: "search",
          type: "SelectContentSearchStyles",
          required: false,
          description: "Styles the search.wrapper and search.input anatomy.",
        },
        {
          name: "empty",
          type: "SlotStyle",
          required: false,
          description: "Styles the live empty-results message.",
        },
        {
          name: "list",
          type: "SelectContentListStyles",
          required: false,
          description: "Styles the list.root and list.padding anatomy.",
        },
      ],
      notes: ["search.wrapper and search.input render only while searchable content is enabled."],
    },
    SelectContentStylesProp: {
      name: "SelectContentStylesProp",
      summary: "Style overrides for Select.Content's root and named anatomy slots.",
      type: "SelectContentStyleSlots",
      kind: "alias",
    },
    SelectValueChildren: {
      name: "SelectValueChildren",
      summary:
        "Static value content, or a function that renders from the selected registered item.",
      type: "((selectedItem: SelectItemData | null) => React.ReactNode) | React.ReactNode",
      kind: "alias",
      examples: ['<Select.Value>{(item) => item?.textValue ?? "None"}</Select.Value>'],
      notes: ["The function receives null until an option is selected and registered."],
    },
    SelectValueStyleSlots: {
      name: "SelectValueStyleSlots",
      summary: "Named style slots for the Select.Value anatomy.",
      type: "{ root?: Style; icon?: Style; text?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the value wrapper." },
        {
          name: "icon",
          type: "Style",
          required: false,
          description: "Styles the icon wrapper rendered before the value text.",
        },
        {
          name: "text",
          type: "Style",
          required: false,
          description: "Styles the rendered value text.",
        },
      ],
    },
    SelectValueStylesProp: {
      name: "SelectValueStylesProp",
      summary: "Class-based style overrides for Select.Value's root and named anatomy slots.",
      type: "StylesProp<SelectValueStyleSlots>",
      kind: "alias",
    },
    SelectItemStyleSlots: {
      name: "SelectItemStyleSlots",
      summary: "Named style slots for the Select.Item anatomy.",
      type: "{ root?: Style; icon?: Style; content?: Style; text?: Style; description?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the option row." },
        {
          name: "icon",
          type: "Style",
          required: false,
          description: "Styles the leading icon wrapper.",
        },
        {
          name: "content",
          type: "Style",
          required: false,
          description: "Styles the wrapper that stacks the label above a description.",
        },
        {
          name: "text",
          type: "Style",
          required: false,
          description: "Styles the primary option text.",
        },
        {
          name: "description",
          type: "Style",
          required: false,
          description: "Styles the secondary description text.",
        },
      ],
      notes: ["The content wrapper renders only when the option supplies a description."],
    },
    SelectItemStylesProp: {
      name: "SelectItemStylesProp",
      summary: "Class-based style overrides for Select.Item's root and named anatomy slots.",
      type: "StylesProp<SelectItemStyleSlots>",
      kind: "alias",
    },
    SelectGroupStyleSlots: {
      name: "SelectGroupStyleSlots",
      summary: "Named style slots for the Select.Group anatomy.",
      type: "{ root?: Style; title?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the group wrapper." },
        {
          name: "title",
          type: "Style",
          required: false,
          description: "Styles the optional visible title above the grouped options.",
        },
      ],
    },
    SelectGroupStylesProp: {
      name: "SelectGroupStylesProp",
      summary: "Class-based style overrides for Select.Group's root and named anatomy slots.",
      type: "StylesProp<SelectGroupStyleSlots>",
      kind: "alias",
    },
    SelectListStyleSlots: {
      name: "SelectListStyleSlots",
      summary: "Named style slot for the Select.List anatomy.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the list wrapper." },
      ],
    },
    SelectListStylesProp: {
      name: "SelectListStylesProp",
      summary: "Class-based style override for Select.List's root slot.",
      type: "StylesProp<SelectListStyleSlots>",
      kind: "alias",
    },
    SelectSeparatorStyleSlots: {
      name: "SelectSeparatorStyleSlots",
      summary: "Named style slot for the Select.Separator anatomy.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the separator element.",
        },
      ],
    },
    SelectSeparatorStylesProp: {
      name: "SelectSeparatorStylesProp",
      summary: "Class-based style override for Select.Separator's root slot.",
      type: "StylesProp<SelectSeparatorStyleSlots>",
      kind: "alias",
    },
    SelectSubTriggerIconStyles: {
      name: "SelectSubTriggerIconStyles",
      summary: "Styles for the individual submenu trigger icon parts.",
      type: "{ right?: Style }",
      kind: "interface",
      members: [
        {
          name: "right",
          type: "Style",
          required: false,
          description: "Styles the right-pointing submenu indicator.",
        },
      ],
    },
    SelectSubTriggerStyleSlots: {
      name: "SelectSubTriggerStyleSlots",
      summary: "Named style slots for the Select.SubTrigger anatomy.",
      type: "{ root?: Style; icon?: Style | SelectSubTriggerIconStyles }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the submenu trigger option row.",
        },
        {
          name: "icon",
          type: "Style | SelectSubTriggerIconStyles",
          required: false,
          description: "Styles every icon part, or individually styles icon.right.",
        },
      ],
    },
    SelectSubTriggerStylesProp: {
      name: "SelectSubTriggerStylesProp",
      summary: "Class-based style overrides for Select.SubTrigger's root and named anatomy slots.",
      type: "StylesProp<SelectSubTriggerStyleSlots>",
      kind: "alias",
    },
    SelectSubContentListStyles: {
      name: "SelectSubContentListStyles",
      summary: "Styles for the option-list anatomy rendered inside a submenu panel.",
      type: "{ root?: Style; padding?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the element that groups the rendered submenu options.",
        },
        {
          name: "padding",
          type: "Style",
          required: false,
          description: "Styles the padding wrapper around the submenu option list.",
        },
      ],
    },
    SelectSubContentStyleSlots: {
      name: "SelectSubContentStyleSlots",
      summary: "Named style slots for the Select.SubContent anatomy.",
      type: "{ root?: Style; overlay?: Style; scroller?: Style; list?: Style | SelectSubContentListStyles }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the submenu listbox panel.",
        },
        {
          name: "overlay",
          type: "Style",
          required: false,
          description: "Styles the positioned submenu overlay.",
        },
        {
          name: "scroller",
          type: "Style",
          required: false,
          description: "Styles the scrollable surface that constrains the submenu height.",
        },
        {
          name: "list",
          type: "Style | SelectSubContentListStyles",
          required: false,
          description: "Styles every list part, or individually styles list.root and list.padding.",
        },
      ],
    },
    SelectSubContentStylesProp: {
      name: "SelectSubContentStylesProp",
      summary: "Class-based style overrides for Select.SubContent's root and named anatomy slots.",
      type: "StylesProp<SelectSubContentStyleSlots>",
      kind: "alias",
    },
  },

  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description:
        "Composes the Select from a trigger, panel content, and optional external Select.Value segments.",
      tags: { mdn: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" },
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description:
        "Applies native inline styles to the root wrapper, taking precedence over the resolved styles.root inline style.",
      tags: { mdn: "https://react.dev/reference/react-dom/components/common#style" },
    },
    {
      name: "id",
      type: "string",
      required: false,
      category: "Advanced",
      description:
        "Sets the id of the root wrapper. The floating panel keeps its own generated id for aria-controls.",
      tags: {
        mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/id",
      },
    },
  ],

  subComponents: {
    // SelectContext is an internal composition detail, not a public subcomponent.
    include: (name: string) => name.startsWith("Select."),
    props: {
      "Select.Trigger": [
        {
          name: "children",
          type: "React.ReactNode",
          required: false,
          category: "Content",
          description:
            "Replaces the default trigger label. Plain text is wrapped in a truncating span inside the value section.",
          tags: { mdn: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" },
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description:
            "Names the trigger when its visible content does not, which matters for icon-only or value-only triggers.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
          },
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "References the elements that label the trigger.",
          tags: {
            mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",
          },
        },
        {
          name: "onKeyDown",
          type: "React.KeyboardEventHandler<HTMLButtonElement>",
          required: false,
          category: "Events",
          description:
            "Runs before Select's own key handling, which stays installed through mergeProps.",
          tags: { see: "https://react-spectrum.adobe.com/react-aria/useButton.html" },
        },
      ],
    },
  },

  propGroups: [
    { name: "Core" },
    { name: "Content" },
    { name: "Items" },
    { name: "Events" },
    { name: "Styling" },
    { name: "Accessibility" },
    { name: "Advanced" },
  ],

  stateAttributes: [
    {
      name: "data-slot",
      description:
        "Stable styling identity for the root or a named Select anatomy part. Option rows keep List's item identity instead of a Select slot name.",
      values: [
        "root",
        "overlay",
        "value",
        "input",
        "icon.left",
        "icon.right",
        "icon.section",
        "search.wrapper",
        "empty",
        "list.root",
        "list.padding",
        "title",
        "icon",
        "content",
        "text",
        "description",
        "item",
      ],
    },
    {
      name: "data-mode",
      description: "The configured selection mode, emitted on the Select root.",
      values: ["single", "multiple"],
    },
    {
      name: "data-variant",
      description:
        "The Select.Trigger variant published on the Select root; omitted when the trigger sets no variant.",
      values: ["ghost"],
    },
    {
      name: "data-disabled",
      description: "The root, trigger, or option is disabled. It is omitted while enabled.",
      values: ["true"],
    },
    {
      name: "data-open",
      description: "The button trigger, searchable trigger, or submenu trigger is open.",
      values: ["true", "false"],
    },
    {
      name: "data-state",
      description: "A floating panel or submenu panel is open or closed while it is mounted.",
      values: ["open", "closed"],
    },
    {
      name: "data-placement",
      description:
        "The resolved floating side of the panel, the submenu panel, or the searchable trigger.",
      values: ["top", "bottom", "left", "right"],
    },
    {
      name: "data-selected",
      description: "An option is selected; it is omitted while unselected.",
      values: ["true"],
    },
    {
      name: "data-highlighted",
      description:
        "An option or submenu trigger is the current keyboard or pointer navigation target.",
      values: ["true", "false"],
    },
    {
      name: "data-focused",
      description: "The root or trigger has focus, or an option is the navigation focus target.",
      values: ["true", "false"],
    },
    {
      name: "data-focus-visible",
      description: "The root or trigger has keyboard-visible focus.",
      values: ["true", "false"],
    },
    {
      name: "data-pressed",
      description: "The button trigger is currently pressed.",
      values: ["true", "false"],
    },
    {
      name: "data-hovered",
      description: "The pointer is over the button trigger.",
      values: ["true", "false"],
    },
    {
      name: "data-external",
      description:
        "A Select.Value rendered beside the trigger is the label segment of a split Select.",
      values: ["true"],
    },
    {
      name: "data-value",
      description: "The option's registered key, emitted on the option row.",
    },
    {
      name: "data-select-focus-surface",
      description:
        "Marks the root as the visual focus surface used by Select's local focus indicator.",
      values: ["true"],
    },
    {
      name: "data-focus-indicator",
      description: "Marks Select's local shared focus indicator element.",
      values: ["local"],
    },
    {
      name: "data-ring",
      description: "Marks the local focus indicator element.",
      values: ["true"],
    },
    {
      name: "data-self-target",
      description: "Marks the local focus indicator as drawing on the Select root itself.",
      values: ["true"],
    },
    {
      name: "data-visible",
      description:
        "The local focus indicator is visible for keyboard focus; it is omitted while hidden.",
      values: ["true"],
    },
    {
      name: "data-select-submenu-content",
      description:
        "Marks a portalled submenu panel so outside-press dismissal treats it as inside the Select.",
      values: ["true"],
    },
  ],
} satisfies ComponentAPIEnrichment;
