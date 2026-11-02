import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

/**
 * Hand-authored API documentation for Color. The generator merges this over
 * what react-docgen-typescript extracts from the component source.
 */
export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "A class name or conditional class-name array.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
    },
    StylesProp: {
      name: "StylesProp",
      summary: "Preserves a component-specific class-based style-slot table.",
      type: "StylesProp<S extends { root?: Style }> = S",
      kind: "alias",
    },
    ColorFormat: {
      name: "ColorFormat",
      summary: "A serialized color format supported by the picker input.",
      type: '"hex" | "rgb"',
      kind: "alias",
      values: [
        { value: '"hex"', description: "Displays and emits hexadecimal color strings." },
        { value: '"rgb"', description: "Displays and emits rgb() or rgba() color strings." },
      ],
    },
    ColorSize: {
      name: "ColorSize",
      summary: "A named sizing preset shared by Color anatomy.",
      type: '"sm" | "md" | "lg"',
      kind: "alias",
      values: [
        { value: '"sm"', description: "Uses the compact picker dimensions." },
        { value: '"md"', description: "Uses the default picker dimensions." },
        { value: '"lg"', description: "Uses the large picker dimensions." },
      ],
    },
    ColorAreaVariant: {
      name: "ColorAreaVariant",
      summary: "The visual shell used by Color.Area.",
      type: '"standalone" | "popover"',
      kind: "alias",
      values: [
        { value: '"standalone"', description: "Renders the normal picker background and border." },
        {
          value: '"popover"',
          description: "Removes the shell so Popover supplies the outer surface.",
        },
      ],
    },
    ColorSliderType: {
      name: "ColorSliderType",
      summary: "The channel controlled by Color.Slider.",
      type: '"hue" | "opacity" | "chroma"',
      kind: "alias",
      values: [
        { value: '"hue"', description: "Controls hue in degrees from 0 to 360 by default." },
        { value: '"opacity"', description: "Controls alpha from 0 to 1 by default." },
        { value: '"chroma"', description: "Controls OKLCH chroma from 0 to 0.4 by default." },
      ],
    },
    ColorTriggerPosition: {
      name: "ColorTriggerPosition",
      summary: "The preferred side for the Color.Trigger popover.",
      type: '"top" | "right" | "bottom" | "left"',
      kind: "alias",
      values: [
        { value: '"top"', description: "Places the picker above the trigger when space permits." },
        {
          value: '"right"',
          description: "Places the picker to the right of the trigger when space permits.",
        },
        {
          value: '"bottom"',
          description: "Places the picker below the trigger when space permits.",
        },
        {
          value: '"left"',
          description: "Places the picker to the left of the trigger when space permits.",
        },
      ],
    },
    ColorState: {
      name: "ColorState",
      summary: "Controlled Color value state.",
      type: "{\n  value?: string;\n}",
      kind: "interface",
      members: [
        { name: "value", type: "string", required: false, description: "The controlled serialized color value." },
      ],
    },
    ColorCanvasStyleSlots: {
      name: "ColorCanvasStyleSlots",
      summary: "Classes for Color.Canvas anatomy.",
      type: "{\n  root?: Style;\n  inner?: Style;\n  pointer?: Style;\n}",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the focusable canvas interaction surface." },
        { name: "inner", type: "Style", required: false, description: "Styles the clipped gradient field." },
        { name: "pointer", type: "Style", required: false, description: "Styles the current-color pointer." },
      ],
    },
    ColorSliderChannelStyleSlots: {
      name: "ColorSliderChannelStyleSlots",
      summary: "Classes for one Color.Slider channel.",
      type: "{\n  root?: Style;\n  track?: Style;\n  thumb?: Style;\n}",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the slider interaction surface." },
        { name: "track", type: "Style", required: false, description: "Styles the channel gradient track." },
        { name: "thumb", type: "Style", required: false, description: "Styles the draggable slider thumb." },
      ],
    },
    ColorSliderStyleSlots: {
      name: "ColorSliderStyleSlots",
      summary: "Channel-specific classes for Color.Slider anatomy.",
      type: "{\n  hue?: Style | ColorSliderChannelStyleSlots;\n  opacity?: Style | ColorSliderChannelStyleSlots;\n  chroma?: Style | ColorSliderChannelStyleSlots;\n}",
      kind: "interface",
      members: [
        {
          name: "hue",
          type: "Style | ColorSliderChannelStyleSlots",
          required: false,
          description: "Styles all hue anatomy or selected hue parts.",
        },
        {
          name: "opacity",
          type: "Style | ColorSliderChannelStyleSlots",
          required: false,
          description: "Styles all opacity anatomy or selected opacity parts.",
        },
        {
          name: "chroma",
          type: "Style | ColorSliderChannelStyleSlots",
          required: false,
          description: "Styles all chroma anatomy or selected chroma parts.",
        },
      ],
    },
    ColorTriggerStyleSlots: {
      name: "ColorTriggerStyleSlots",
      summary: "Classes for Color.Trigger anatomy.",
      type: "{\n  root?: Style;\n  swatch?: Style;\n  value?: Style;\n}",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the trigger button." },
        { name: "swatch", type: "Style", required: false, description: "Styles the default trigger swatch." },
        { name: "value", type: "Style", required: false, description: "Styles the default trigger value." },
      ],
    },
    ColorRecentColorsStyleSlots: {
      name: "ColorRecentColorsStyleSlots",
      summary: "Classes for the recent-color collection.",
      type: "{\n  root?: Style;\n  swatch?: Style;\n}",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the recent-colors group." },
        { name: "swatch", type: "Style", required: false, description: "Styles every recent-color button." },
      ],
    },
    ColorInputStyleSlots: {
      name: "ColorInputStyleSlots",
      summary: "Classes for the color input controls.",
      type: "{\n  group?: Style;\n  input?: Style;\n  format?: Style;\n  previewSwatch?: Style;\n}",
      kind: "interface",
      members: [
        { name: "group", type: "Style", required: false, description: "Styles the grouped input controls." },
        { name: "input", type: "Style", required: false, description: "Styles the editable color field." },
        { name: "format", type: "Style", required: false, description: "Styles the format selector." },
        { name: "previewSwatch", type: "Style", required: false, description: "Styles the optional preview swatch." },
      ],
    },
    ColorStyleSlots: {
      name: "ColorStyleSlots",
      summary: "Classes for the Color root and complete compound anatomy.",
      type: "{\n  provider?: Style;\n  root?: Style;\n  trigger?: Style | ColorTriggerStyleSlots;\n  controls?: Style;\n  canvas?: Style | ColorCanvasStyleSlots;\n  slider?: ColorSliderStyleSlots;\n  recentColors?: Style | ColorRecentColorsStyleSlots;\n  input?: ColorInputStyleSlots;\n}",
      kind: "interface",
      members: [
        { name: "provider", type: "Style", required: false, description: "Styles the compound-component provider root." },
        { name: "root", type: "Style", required: false, description: "Styles the Color.Area picker surface." },
        {
          name: "trigger",
          type: "Style | ColorTriggerStyleSlots",
          required: false,
          description: "Styles all trigger anatomy or selected trigger parts.",
        },
        { name: "controls", type: "Style", required: false, description: "Styles the controls below the canvas." },
        {
          name: "canvas",
          type: "Style | ColorCanvasStyleSlots",
          required: false,
          description: "Styles all canvas anatomy or selected canvas parts.",
        },
        { name: "slider", type: "ColorSliderStyleSlots", required: false, description: "Styles channel-specific slider anatomy." },
        {
          name: "recentColors",
          type: "Style | ColorRecentColorsStyleSlots",
          required: false,
          description: "Styles the recent-color group or its swatches.",
        },
        { name: "input", type: "ColorInputStyleSlots", required: false, description: "Styles color input anatomy." },
      ],
    },
    ColorStylesProp: {
      name: "ColorStylesProp",
      summary: "The keyed class-based styling contract for Color anatomy.",
      type: "StylesProp<ColorStyleSlots>",
      kind: "alias",
    },
    ColorPopoverStyles: {
      name: "ColorPopoverStyles",
      summary: "Popover anatomy classes forwarded by Color.Trigger.",
      type: "{ root?: Style; content?: Style; trigger?: Style; frame?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the Popover root." },
        { name: "content", type: "Style", required: false, description: "Styles the positioned Popover content." },
        { name: "trigger", type: "Style", required: false, description: "Styles the Popover trigger wrapper." },
        { name: "frame", type: "Style", required: false, description: "Styles the Popover frame around Color.Area." },
      ],
    },
  },

  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description: "Renders custom compound children; when omitted, Color renders Color.Area.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds classes to the Color.Area root or to the compound provider when custom children are supplied.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the Color.Area root or compound provider.",
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Provides an accessible label for the root region when one is needed.",
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that label the root region.",
    },
  ],

  subComponents: {
    props: {
      "Color.Area": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Adds classes to the picker surface after Color styles.root.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the picker surface.",
        },
      ],
      "Color.Canvas": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Adds classes to the canvas interaction surface after context styles.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the canvas interaction surface.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "Overrides the default accessible name for the saturation and brightness slider.",
        },
        {
          name: "aria-valuetext",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "Overrides the announced saturation and brightness value text.",
        },
      ],
      "Color.Slider": [
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Adds classes to the channel slider root after its defaults and context style.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description:
            "Applies inline styles to the channel slider root; opacity also supplies the generic --color variable.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "Overrides the channel-derived accessible name for the slider thumb.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "References element IDs that label the slider thumb.",
        },
      ],
      "Color.Trigger": [
        {
          name: "children",
          type: "React.ReactNode",
          required: false,
          category: "Content",
          description: "Replaces the default swatch and serialized value inside the trigger.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          category: "Styling",
          description: "Adds classes to the trigger button after Color trigger styles.",
        },
        {
          name: "style",
          type: "React.CSSProperties",
          required: false,
          category: "Styling",
          description: "Applies inline styles to the trigger button.",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          category: "Core",
          defaultValue: "false",
          description: "Disables the trigger in addition to any disabled state inherited from Color.",
        },
        {
          name: "onClick",
          type: "React.MouseEventHandler<HTMLButtonElement>",
          required: false,
          category: "Events",
          description: "Runs for native click activation while the trigger is enabled.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "Provides the trigger's accessible name when its content is not sufficient.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          category: "Accessibility",
          description: "References element IDs that label the trigger button.",
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
      description: "Stable anatomy identity emitted by Color and its composed Slider parts.",
      values: [
        "provider",
        "root",
        "trigger.root",
        "trigger.swatch",
        "trigger.value",
        "controls",
        "canvas.root",
        "canvas.inner",
        "canvas.pointer",
        "slider.hue.root",
        "slider.opacity.root",
        "slider.chroma.root",
        "recentColors.root",
        "recentColors.swatch",
        "input.group",
        "input.input",
        "input.format",
        "input.previewSwatch",
        "track",
        "range",
        "thumb",
      ],
    },
    {
      name: "data-size",
      description: "The resolved Color size on roots and size-aware parts.",
      values: ["sm", "md", "lg"],
    },
    {
      name: "data-disabled",
      description: "Emitted as true on disabled roots and interactive parts; omitted when enabled.",
      values: ["true"],
    },
    {
      name: "data-variant",
      description: "Emitted on Color.Area only for the popover treatment; omitted for standalone.",
      values: ["popover"],
    },
    {
      name: "data-focused",
      description: "Emitted as true while Color.Canvas or a slider thumb is focused; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-focus-visible",
      description: "Emitted as true for keyboard-visible canvas or slider-thumb focus; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-hovered",
      description: "Emitted as true while a slider thumb is hovered; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-pressed",
      description: "Emitted as true while a slider thumb is pressed or dragged; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-dragging",
      description: "Emitted as true while a slider thumb is being dragged; omitted otherwise.",
      values: ["true"],
    },
    {
      name: "data-orientation",
      description: "The underlying Color.Slider orientation.",
      values: ["horizontal"],
    },
    {
      name: "data-slider-track",
      description: "Emitted as true on each Color.Slider track.",
      values: ["true"],
    },
    {
      name: "data-slider-range",
      description: "Emitted as true on each Color.Slider range.",
      values: ["true"],
    },
    {
      name: "data-slider-thumb",
      description: "Emitted as true on each Color.Slider thumb.",
      values: ["true"],
    },
    { name: "data-slider-thumb-index", description: "Zero-based index of a Color.Slider thumb." },
  ],

  refine: (api) => {
    const withTypes = (replacements: Record<string, string>) => (props: PropDefinition[]) =>
      props.map((prop) =>
        replacements[prop.name] ? { ...prop, type: replacements[prop.name] } : prop,
      );

    const rootReplacements: Record<string, string> = {
      state: "ColorState",
      format: "ColorFormat",
      size: "ColorSize",
      styles: "ColorStylesProp",
    };
    const subComponentReplacements: Record<string, Record<string, string>> = {
      "Color.Area": { variant: "ColorAreaVariant" },
      "Color.Canvas": { size: "ColorSize" },
      "Color.Slider": { type: "ColorSliderType", size: "ColorSize" },
      "Color.Trigger": { position: "ColorTriggerPosition", popoverStyles: "ColorPopoverStyles" },
    };

    return {
      ...api,
      props: withTypes(rootReplacements)(api.props),
      subComponents: api.subComponents
        ? Object.fromEntries(
            Object.entries(api.subComponents).map(([name, component]) => {
              const replacements = subComponentReplacements[name];
              return [
                name,
                replacements
                  ? { ...component, props: withTypes(replacements)(component.props) }
                  : component,
              ];
            }),
          )
        : undefined,
    };
  },
} satisfies ComponentAPIEnrichment;
