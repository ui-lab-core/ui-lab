import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { withCustomConfig, type ComponentDoc, type PropItem } from "react-docgen-typescript";
import type { APITypeToken, APIEnumValue, PropDefinition, ComponentAPI } from "../src/types";
import { componentRegistry } from "../src/registry.js";
import {
  loadApiCache,
  saveApiCache,
  getCachedAPI,
  updateCacheEntry,
  pruneCache,
} from "./cache-api-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.resolve(__dirname, "../../@ui/src/components");

const parser = withCustomConfig(path.resolve(__dirname, "../../@ui/tsconfig.json"), {
  savePropValueAsString: true,
  shouldIncludePropTagMap: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop: PropItem) => {
    if (prop.declarations && prop.declarations.length > 0) {
      const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
        return !declaration.fileName.includes("node_modules");
      });
      return Boolean(hasPropAdditionalDescription);
    }
    return true;
  },
});

const TYPE_LINKS: Record<string, string> = {
  boolean: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
  Date: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
  number: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
  object: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object",
  string: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
  ReactNode: "https://react.dev/reference/react/Children",
  "React.ReactNode": "https://react.dev/reference/react/Children",
  ReactElement: "https://react.dev/reference/react/createElement#returns",
  "React.ReactElement": "https://react.dev/reference/react/createElement#returns",
  CSSProperties: "https://react.dev/reference/react-dom/components/common#style",
  "React.CSSProperties": "https://react.dev/reference/react-dom/components/common#style",
  Key: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
  Ref: "https://react.dev/reference/react/useRef",
  RefObject: "https://react.dev/reference/react/useRef",
  MutableRefObject: "https://react.dev/reference/react/useRef",
  "React.Ref": "https://react.dev/reference/react/useRef",
  "React.RefObject": "https://react.dev/reference/react/useRef",
  "React.MutableRefObject": "https://react.dev/reference/react/useRef",
};

const TYPESCRIPT_UTILITY_TYPES = new Set([
  "Awaited", "Partial", "Required", "Readonly", "Record", "Pick", "Omit", "Exclude",
  "Extract", "NonNullable", "Parameters", "ConstructorParameters", "ReturnType",
  "InstanceType", "NoInfer", "ThisParameterType", "OmitThisParameter", "ThisType",
]);

function getTypeLink(symbol: string): string | undefined {
  if (TYPE_LINKS[symbol]) return TYPE_LINKS[symbol];
  if (TYPESCRIPT_UTILITY_TYPES.has(symbol)) {
    return "https://www.typescriptlang.org/docs/handbook/utility-types.html";
  }

  const reactType = symbol.replace(/^React\./, "");
  if (/^(?:Animation|Clipboard|Composition|Drag|Focus|Form|Input|Keyboard|Mouse|Pointer|Touch|Transition|UI|Wheel)?Event(?:Handler)?$/.test(reactType)) {
    const anchor = reactType.replace(/Handler$/, "").toLowerCase();
    return `https://react.dev/reference/react-dom/components/common#${anchor}-handler-function`;
  }
  if (/^(?:ComponentType|ElementType|JSXElementConstructor)$/.test(reactType)) {
    return "https://react.dev/reference/react/createElement#parameters";
  }
  if (/^(?:Dispatch|SetStateAction)$/.test(reactType)) {
    return "https://react.dev/reference/react/useState";
  }
  if (symbol.startsWith("React.")) return "https://react.dev/reference/react";

  if (/^(?:Array|BigInt|Error|Function|Map|Object|Promise|RegExp|Set|Symbol|WeakMap|WeakSet)$/.test(symbol)) {
    return `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${symbol}`;
  }
  if (/^(?:Element|Node|EventTarget|HTMLElement|SVGElement|HTML[A-Za-z]+Element|SVG[A-Za-z]+Element)$/.test(symbol)) {
    return `https://developer.mozilla.org/en-US/docs/Web/API/${symbol}`;
  }
}

function tokenizeType(type: string, customTypes: string[] = []): APITypeToken[] {
  return type
    .split(/(React\.[A-Za-z_$][\w$]*|[A-Za-z_$][\w$]*)/g)
    .filter(Boolean)
    .map((text) =>
      customTypes.includes(text)
        ? { text, customType: text }
        : { text, href: getTypeLink(text) },
    );
}

function enrichTypeTokens(api: ComponentAPI): ComponentAPI {
  const customTypeNames = Object.keys(api.customTypes ?? {});
  const enrichProps = (props: PropDefinition[]) =>
    props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, customTypeNames) }));
  const customTypes = api.customTypes
    ? Object.fromEntries(Object.entries(api.customTypes).map(([name, type]) => [name, {
        ...type,
        typeTokens: tokenizeType(type.type, customTypeNames),
        members: type.members ? enrichProps(type.members) : undefined,
      }]))
    : undefined;

  return {
    ...api,
    props: enrichProps(api.props),
    subComponents: api.subComponents
      ? Object.fromEntries(Object.entries(api.subComponents).map(([name, component]) => [
          name,
          { ...component, props: enrichProps(component.props) },
        ]))
      : undefined,
    customTypes,
  };
}

function toKebabCase(pascalCase: string): string {
  return pascalCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function formatType(type: string): string {
  return type
    .replace(/\s+/g, " ")
    .replace(/\| undefined/g, "")
    .trim();
}

function extractEnumValues(prop: PropItem): string[] | undefined {
  const typeObj = prop.type as any;

  if (typeObj.name === "enum" && Array.isArray(typeObj.value)) {
    return typeObj.value
      .map((item: any) => {
        const val = item.value || "";
        return val.replace(/^["']|["']$/g, "");
      })
      .filter((val: string) => val.length > 0);
  }

  return undefined;
}

function extractPropsFromDoc(doc: ComponentDoc): PropDefinition[] {
  return Object.entries(doc.props).map(([name, prop]) => {
    const enumValues = extractEnumValues(prop);
    const tags = prop.tags as Record<string, string> | undefined;
    const type = enumValues ? enumValues.join(" | ") : formatType(prop.type.name);
    const customType = tags?.typeDoc;
    const links = [
      tags?.mdn ? { label: "MDN", url: tags.mdn } : undefined,
      tags?.see ? { label: "Related documentation", url: tags.see } : undefined,
    ].filter((link): link is { label: string; url: string } => Boolean(link));
    return {
      name,
      type,
      required: prop.required,
      defaultValue: prop.defaultValue?.value,
      description: prop.description || undefined,
      enumValues,
      category: tags?.category,
      tags: tags && Object.keys(tags).length ? tags : undefined,
      links: links.length ? links : undefined,
      typeTokens: tokenizeType(type, customType ? [customType] : []),
    };
  });
}

function enrichButtonAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    ButtonSize: {
      name: "ButtonSize",
      summary: "An open string type used to select a button size class.",
      type: "string & {}",
      kind: "alias",
      notes: ["Known stylesheet sizes are accepted without preventing custom size names."],
    },
    ButtonIconSlots: {
      name: "ButtonIconSlots",
      summary: "Icon content rendered on either side of the button label.",
      type: "{ left?: React.ReactNode; right?: React.ReactNode }",
      kind: "interface",
      members: [
        {
          name: "left",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered before the button label.",
        },
        {
          name: "right",
          type: "React.ReactNode",
          required: false,
          description: "Content rendered after the button label.",
        },
      ],
    },
    ButtonStyleSlots: {
      name: "ButtonStyleSlots",
      summary: "Style overrides for the button root and named content slots.",
      type: `{
  root?: SlotStyle;
  icon?: SlotStyle | ButtonIconStyleSlots;
  hint?: SlotStyle;
}`,
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the root element.",
        },
        {
          name: "icon",
          type: "SlotStyle | ButtonIconStyleSlots",
          required: false,
          description: "Shared or side-specific icon styles.",
        },
        {
          name: "hint",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the hint badge.",
        },
      ],
    },
    ButtonIconStyleSlots: {
      name: "ButtonIconStyleSlots",
      summary: "Side-specific styles used when the icon slot is configured as an object.",
      type: `{
  left?: SlotStyle;
  right?: SlotStyle;
}`,
      kind: "interface",
      members: [
        {
          name: "left",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the leading icon.",
        },
        {
          name: "right",
          type: "SlotStyle",
          required: false,
          description: "Styles applied to the trailing icon.",
        },
      ],
    },
    HintValue: {
      name: "HintValue",
      summary: "Content displayed as a compact button hint or keyboard shortcut.",
      type: "React.ReactNode | React.ReactNode[]",
      kind: "alias",
      examples: ['hint="Esc"', 'hint={["Ctrl", "K"]}'],
      notes: ["Arrays render as shortcut segments joined by a plus divider."],
    },
  };

  const inheritedProps: PropDefinition[] = [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description: "Button label and content. Text content determines the accessible name and, together with icon, whether Button infers icon-only sizing.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds conventional classes to the root button or anchor after its default classes and before styles.root.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the root element after styles.root inline styles.",
    },
    {
      name: "onClick",
      type: "React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>",
      required: false,
      category: "Events",
      description: "Native click handler composed with onPress. Disabled buttons do not invoke it.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" },
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      required: false,
      category: "Forms",
      description: "Native submission behavior for the button-element branch. Has no effect when Button renders as an anchor.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type" },
    },
    {
      name: "name",
      type: "string",
      required: false,
      category: "Forms",
      description: "Form field name submitted with value when Button renders as a native button inside a form.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#name" },
    },
    {
      name: "value",
      type: "string",
      required: false,
      category: "Forms",
      description: "Form value submitted with name when Button renders as a native button inside a form.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#value" },
    },
    {
      name: "rel",
      type: "string",
      required: false,
      category: "Link behavior",
      description: "Relationship applied to the anchor variant. Defaults to noopener noreferrer when target is _blank and rel is not supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel" },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name for the button, required when it renders icon-only content.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" },
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the button's accessible name.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that describe the button.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" },
    },
    {
      name: "autoFocus",
      type: "boolean",
      required: false,
      category: "Accessibility",
      description: "Requests focus for the root element when it mounts.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus" },
    },
  ];
  const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
  const enrichProps = (props: PropDefinition[]) =>
    props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }

  return {
    ...api,
    props: enrichProps([
      ...api.props.filter((prop) => !inheritedNames.has(prop.name)),
      ...inheritedProps,
    ]),
    // resolveButtonIcon is a plain exported helper, not a compound component; docgen's
    // component heuristic misidentifies it because it takes one object-shaped argument.
    subComponents: undefined,
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Forms" },
      { name: "Accessibility" },
      { name: "Link behavior" },
      { name: "Advanced" },
    ],
    stateAttributes: [
      { name: "data-slot", description: "Stable anatomy identity on the root, icon.left, icon.right, and hint elements.", values: ["root", "icon.left", "icon.right", "hint"] },
      { name: "data-hovered", description: "The pointer is over the button, or the visual hover state is forced.", values: ["true", "false"] },
      { name: "data-pressed", description: "The button is currently pressed.", values: ["true", "false"] },
      { name: "data-focused", description: "The button is focused.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "The button has keyboard-visible focus.", values: ["true", "false"] },
      { name: "data-disabled", description: "The button is disabled.", values: ["true"] },
      { name: "data-hint", description: "Hint content is present.", values: ["true"] },
      { name: "data-icon-only", description: "The button is rendered with icon-only sizing.", values: ["true"] },
      { name: "data-variant", description: "The resolved variant name." },
      { name: "data-size", description: "The resolved size name." },
    ],
    customTypes,
  };
}

function enrichColorAPI(api: ComponentAPI): ComponentAPI {
  const member = (name: string, type: string, description: string): PropDefinition => ({
    name,
    type,
    required: false,
    description,
  });
  const styleInterface = (
    name: string,
    summary: string,
    members: Array<[string, string, string]>,
  ): NonNullable<ComponentAPI["customTypes"]>[string] => ({
    name,
    summary,
    type: `{\n${members.map(([key, type]) => `  ${key}?: ${type};`).join("\n")}\n}`,
    kind: "interface",
    members: members.map(([key, type, description]) => member(key, type, description)),
  });

  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
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
        { value: '"popover"', description: "Removes the shell so Popover supplies the outer surface." },
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
        { value: '"right"', description: "Places the picker to the right of the trigger when space permits." },
        { value: '"bottom"', description: "Places the picker below the trigger when space permits." },
        { value: '"left"', description: "Places the picker to the left of the trigger when space permits." },
      ],
    },
    ColorState: styleInterface("ColorState", "Controlled Color value state.", [
      ["value", "string", "The controlled serialized color value."],
    ]),
    ColorCanvasGradientStyleSlots: styleInterface(
      "ColorCanvasGradientStyleSlots",
      "Layer-specific classes for the Color.Canvas gradient.",
      [
        ["hue", "Style", "Styles the hue-tinted base layer."],
        ["saturation", "Style", "Styles the horizontal saturation layer."],
        ["brightness", "Style", "Styles the vertical brightness layer."],
      ],
    ),
    ColorCanvasStyleSlots: styleInterface(
      "ColorCanvasStyleSlots",
      "Classes for Color.Canvas anatomy.",
      [
        ["root", "Style", "Styles the focusable canvas interaction surface."],
        ["inner", "Style", "Styles the clipped gradient container."],
        ["gradient", "Style | ColorCanvasGradientStyleSlots", "Styles every gradient layer or selected layers."],
        ["pointer", "Style", "Styles the current-color pointer."],
      ],
    ),
    ColorSliderChannelStyleSlots: styleInterface(
      "ColorSliderChannelStyleSlots",
      "Classes for one Color.Slider channel.",
      [
        ["root", "Style", "Styles the slider interaction surface."],
        ["track", "Style", "Styles the channel gradient track."],
        ["thumb", "Style", "Styles the draggable slider thumb."],
      ],
    ),
    ColorSliderStyleSlots: styleInterface(
      "ColorSliderStyleSlots",
      "Channel-specific classes for Color.Slider anatomy.",
      [
        ["hue", "Style | ColorSliderChannelStyleSlots", "Styles all hue anatomy or selected hue parts."],
        ["opacity", "Style | ColorSliderChannelStyleSlots", "Styles all opacity anatomy or selected opacity parts."],
        ["chroma", "Style | ColorSliderChannelStyleSlots", "Styles all chroma anatomy or selected chroma parts."],
      ],
    ),
    ColorTriggerStyleSlots: styleInterface(
      "ColorTriggerStyleSlots",
      "Classes for Color.Trigger anatomy.",
      [
        ["root", "Style", "Styles the trigger button."],
        ["swatch", "Style", "Styles the default trigger swatch."],
        ["value", "Style", "Styles the default trigger value."],
      ],
    ),
    ColorRecentColorsStyleSlots: styleInterface(
      "ColorRecentColorsStyleSlots",
      "Classes for the recent-color collection.",
      [
        ["root", "Style", "Styles the recent-colors group."],
        ["swatch", "Style", "Styles every recent-color button."],
      ],
    ),
    ColorInputStyleSlots: styleInterface(
      "ColorInputStyleSlots",
      "Classes for the color input controls.",
      [
        ["group", "Style", "Styles the grouped input controls."],
        ["input", "Style", "Styles the editable color field."],
        ["format", "Style", "Styles the format selector."],
        ["previewSwatch", "Style", "Styles the optional preview swatch."],
      ],
    ),
    ColorStyleSlots: styleInterface(
      "ColorStyleSlots",
      "Classes for the Color root and complete compound anatomy.",
      [
        ["provider", "Style", "Styles the compound-component provider root."],
        ["root", "Style", "Styles the Color.Area picker surface."],
        ["trigger", "Style | ColorTriggerStyleSlots", "Styles all trigger anatomy or selected trigger parts."],
        ["controls", "Style", "Styles the controls below the canvas."],
        ["canvas", "Style | ColorCanvasStyleSlots", "Styles all canvas anatomy or selected canvas parts."],
        ["slider", "ColorSliderStyleSlots", "Styles channel-specific slider anatomy."],
        ["recentColors", "Style | ColorRecentColorsStyleSlots", "Styles the recent-color group or its swatches."],
        ["input", "ColorInputStyleSlots", "Styles color input anatomy."],
      ],
    ),
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
        member("root", "Style", "Styles the Popover root."),
        member("content", "Style", "Styles the positioned Popover content."),
        member("trigger", "Style", "Styles the Popover trigger wrapper."),
        member("frame", "Style", "Styles the Popover frame around Color.Area."),
      ],
    },
  };

  const inheritedRoot: PropDefinition[] = [
    member("children", "React.ReactNode", "Renders custom compound children; when omitted, Color renders Color.Area."),
    member("className", "string", "Adds classes to the Color.Area root or to the compound provider when custom children are supplied."),
    member("style", "React.CSSProperties", "Applies inline styles to the Color.Area root or compound provider."),
    member("aria-label", "string", "Provides an accessible label for the root region when one is needed."),
    member("aria-labelledby", "string", "References element IDs that label the root region."),
  ];
  inheritedRoot[0].category = "Content";
  inheritedRoot[1].category = inheritedRoot[2].category = "Styling";
  inheritedRoot[3].category = inheritedRoot[4].category = "Accessibility";

  const inheritedByPart: Record<string, PropDefinition[]> = {
    "Color.Area": [
      { ...member("className", "string", "Adds classes to the picker surface after Color styles.root."), category: "Styling" },
      { ...member("style", "React.CSSProperties", "Applies inline styles to the picker surface."), category: "Styling" },
    ],
    "Color.Canvas": [
      { ...member("className", "string", "Adds classes to the canvas interaction surface after context styles."), category: "Styling" },
      { ...member("style", "React.CSSProperties", "Applies inline styles to the canvas interaction surface."), category: "Styling" },
      { ...member("aria-label", "string", "Overrides the default accessible name for the saturation and brightness slider."), category: "Accessibility" },
      { ...member("aria-valuetext", "string", "Overrides the announced saturation and brightness value text."), category: "Accessibility" },
    ],
    "Color.Slider": [
      { ...member("className", "string", "Adds classes to the channel slider root after its defaults and context style."), category: "Styling" },
      { ...member("style", "React.CSSProperties", "Applies inline styles to the channel slider root; opacity also supplies the generic --color variable."), category: "Styling" },
      { ...member("aria-label", "string", "Overrides the channel-derived accessible name for the slider thumb."), category: "Accessibility" },
      { ...member("aria-labelledby", "string", "References element IDs that label the slider thumb."), category: "Accessibility" },
    ],
    "Color.Trigger": [
      { ...member("children", "React.ReactNode", "Replaces the default swatch and serialized value inside the trigger."), category: "Content" },
      { ...member("className", "string", "Adds classes to the trigger button after Color trigger styles."), category: "Styling" },
      { ...member("style", "React.CSSProperties", "Applies inline styles to the trigger button."), category: "Styling" },
      { ...member("disabled", "boolean", "Disables the trigger in addition to any disabled state inherited from Color."), category: "Core", defaultValue: "false" },
      { ...member("onClick", "React.MouseEventHandler<HTMLButtonElement>", "Runs for native click activation while the trigger is enabled."), category: "Events" },
      { ...member("aria-label", "string", "Provides the trigger's accessible name when its content is not sufficient."), category: "Accessibility" },
      { ...member("aria-labelledby", "string", "References element IDs that label the trigger button."), category: "Accessibility" },
    ],
  };

  const customTypeNames = Object.keys(customTypes);
  const replaceTypes = (componentName: string, props: PropDefinition[]) => {
    const replacements: Record<string, string> = componentName === "Color"
      ? { state: "ColorState", format: "ColorFormat", size: "ColorSize", styles: "ColorStylesProp" }
      : componentName === "Color.Area"
        ? { variant: "ColorAreaVariant" }
        : componentName === "Color.Canvas"
          ? { size: "ColorSize" }
          : componentName === "Color.Slider"
            ? { type: "ColorSliderType", size: "ColorSize" }
            : componentName === "Color.Trigger"
              ? { position: "ColorTriggerPosition", popoverStyles: "ColorPopoverStyles" }
              : {};
    const inherited = componentName === "Color" ? inheritedRoot : inheritedByPart[componentName] ?? [];
    const inheritedNames = new Set(inherited.map((prop) => prop.name));
    return [...props.filter((prop) => !inheritedNames.has(prop.name)), ...inherited].map((prop) => {
      const normalized = replacements[prop.name] ? { ...prop, type: replacements[prop.name] } : prop;
      return { ...normalized, typeTokens: tokenizeType(normalized.type, customTypeNames) };
    });
  };

  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, customTypeNames);
    if (customType.members) {
      customType.members = customType.members.map((entry) => ({
        ...entry,
        typeTokens: tokenizeType(entry.type, customTypeNames),
      }));
    }
  }

  return {
    ...api,
    props: replaceTypes("Color", api.props),
    subComponents: api.subComponents
      ? Object.fromEntries(Object.entries(api.subComponents).map(([name, component]) => [
          name,
          { ...component, props: replaceTypes(name, component.props) },
        ]))
      : undefined,
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
          "canvas.gradient.hue",
          "canvas.gradient.saturation",
          "canvas.gradient.brightness",
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
      { name: "data-size", description: "The resolved Color size on roots and size-aware parts.", values: ["sm", "md", "lg"] },
      { name: "data-disabled", description: "Emitted as true on disabled roots and interactive parts; omitted when enabled.", values: ["true"] },
      { name: "data-variant", description: "Emitted on Color.Area only for the popover treatment; omitted for standalone.", values: ["popover"] },
      { name: "data-focused", description: "Emitted as true while Color.Canvas or a slider thumb is focused; omitted otherwise.", values: ["true"] },
      { name: "data-focus-visible", description: "Emitted as true for keyboard-visible canvas or slider-thumb focus; omitted otherwise.", values: ["true"] },
      { name: "data-hovered", description: "Emitted as true while a slider thumb is hovered; omitted otherwise.", values: ["true"] },
      { name: "data-pressed", description: "Emitted as true while a slider thumb is pressed or dragged; omitted otherwise.", values: ["true"] },
      { name: "data-dragging", description: "Emitted as true while a slider thumb is being dragged; omitted otherwise.", values: ["true"] },
      { name: "data-orientation", description: "The underlying Color.Slider orientation.", values: ["horizontal"] },
      { name: "data-slider-track", description: "Emitted as true on each Color.Slider track.", values: ["true"] },
      { name: "data-slider-range", description: "Emitted as true on each Color.Slider range.", values: ["true"] },
      { name: "data-slider-thumb", description: "Emitted as true on each Color.Slider thumb.", values: ["true"] },
      { name: "data-slider-thumb-index", description: "Zero-based index of a Color.Slider thumb." },
    ],
    customTypes,
  };
}

function enrichProgressAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
    },
    SlotStyleObject: {
      name: "SlotStyleObject",
      summary: "Inline CSS properties accepted by a style slot.",
      type: "React.CSSProperties",
      kind: "alias",
    },
    SlotStyleProps: {
      name: "SlotStyleProps",
      summary: "Object form that supplies classes and inline styles to one slot.",
      type: "{ className?: Style; style?: SlotStyleObject }",
      kind: "interface",
      members: [
        { name: "className", type: "Style", required: false, description: "Classes applied to the slot element." },
        { name: "style", type: "SlotStyleObject", required: false, description: "Inline CSS properties applied to the slot element." },
      ],
    },
    SlotStyle: {
      name: "SlotStyle",
      summary: "A style slot value expressed as classes, inline CSS properties, or both.",
      type: "Style | SlotStyleObject | SlotStyleProps",
      kind: "alias",
      notes: ["A plain object without className or style is treated as inline CSS properties."],
    },
    ProgressLabelStyleSlots: {
      name: "ProgressLabelStyleSlots",
      summary: "Named style overrides for the Progress label anatomy.",
      type: "{ row?: SlotStyle; label?: SlotStyle; value?: SlotStyle }",
      kind: "interface",
      members: [
        { name: "row", type: "SlotStyle", required: false, description: "Styles the row that contains the visible label and percentage." },
        { name: "label", type: "SlotStyle", required: false, description: "Styles the visible progress label." },
        { name: "value", type: "SlotStyle", required: false, description: "Styles the displayed percentage value." },
      ],
    },
    ProgressStyleSlots: {
      name: "ProgressStyleSlots",
      summary: "Named style overrides for the Progress root and stable anatomy.",
      type: "{ root?: SlotStyle; label?: ProgressLabelStyleSlots; track?: SlotStyle; range?: SlotStyle; thumb?: SlotStyle }",
      kind: "interface",
      members: [
        { name: "root", type: "SlotStyle", required: false, description: "Styles the root progress container." },
        { name: "label", type: "ProgressLabelStyleSlots", required: false, description: "Styles label.row, label.label, and label.value." },
        { name: "track", type: "SlotStyle", required: false, description: "Styles the progress track." },
        { name: "range", type: "SlotStyle", required: false, description: "Styles the filled progress range." },
        { name: "thumb", type: "SlotStyle", required: false, description: "Styles the optional draggable thumb." },
      ],
    },
    ProgressStylesProp: {
      name: "ProgressStylesProp",
      summary: "Style overrides accepted by Progress.",
      type: "ProgressStyleSlots",
      kind: "alias",
    },
  };
  const inheritedProps: PropDefinition[] = [
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds conventional classes to the root progressbar." },
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies inline styles to the root progressbar after styles.root inline styles." },
    { name: "aria-label", type: "string", required: false, category: "Accessibility", description: "Provides an accessible name and takes precedence over label.", links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" }] },
    { name: "aria-labelledby", type: "string", required: false, category: "Accessibility", description: "References visible text that labels the progressbar.", links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" }] },
    { name: "aria-describedby", type: "string", required: false, category: "Accessibility", description: "References additional text that describes the progressbar.", links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" }] },
    { name: "aria-valuetext", type: "string", required: false, category: "Accessibility", description: "Supplies a human-readable value in place of the numeric progress value.", links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext" }] },
  ];
  const enrichProps = (props: PropDefinition[]) =>
    props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }
  const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));

  return {
    ...api,
    props: enrichProps([
      ...api.props.filter((prop) => !inheritedNames.has(prop.name)),
      ...inheritedProps,
    ]),
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Accessibility" },
    ],
    stateAttributes: [
      { name: "data-slot", description: "Stable anatomy identity on Progress elements.", values: ["root", "label.row", "label.label", "label.value", "track", "range", "thumb"] },
      { name: "data-variant", description: "The resolved variant name on the root progressbar." },
      { name: "data-indeterminate", description: "The root and range persistently emit whether Progress has an unknown completion value.", values: ["true", "false"] },
      { name: "data-animated", description: "The range persistently emits whether it is animated by animated or indeterminate mode.", values: ["true", "false"] },
      { name: "data-has-label", description: "The root persistently emits whether a visible label row is rendered.", values: ["true", "false"] },
      { name: "data-show-controls", description: "The root emits this when pointer controls are enabled and omits it otherwise.", values: ["true"] },
      { name: "data-disabled", description: "The root, track, and thumb emit this when Progress is disabled and omit it otherwise.", values: ["true"] },
      { name: "data-dragging", description: "The root emits this while a pointer drag is active and omits it otherwise.", values: ["true"] },
    ],
    customTypes,
  };
}

function enrichSliderAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
    },
    SlotStyleObject: {
      name: "SlotStyleObject",
      summary: "Inline CSS properties accepted by a style slot.",
      type: "React.CSSProperties",
      kind: "alias",
    },
    SlotStyleProps: {
      name: "SlotStyleProps",
      summary: "Object form that supplies classes and inline styles to one slot.",
      type: "{ className?: Style; style?: SlotStyleObject }",
      kind: "interface",
      members: [
        { name: "className", type: "Style", required: false, description: "Classes applied to the slot element." },
        { name: "style", type: "SlotStyleObject", required: false, description: "Inline CSS properties applied to the slot element." },
      ],
    },
    SlotStyle: {
      name: "SlotStyle",
      summary: "A style slot value expressed as classes, inline CSS properties, or both.",
      type: "Style | SlotStyleObject | SlotStyleProps",
      kind: "alias",
      notes: ["A plain object without className or style is treated as inline CSS properties."],
    },
    SliderOrientation: {
      name: "SliderOrientation",
      summary: "Direction in which slider values increase.",
      type: '"horizontal" | "vertical"',
      kind: "alias",
      values: [
        { value: "horizontal", description: "The track runs left to right and values increase toward the right." },
        { value: "vertical", description: "The track runs bottom to top and values increase upward." },
      ],
    },
    SliderStyleSlots: {
      name: "SliderStyleSlots",
      summary: "Named style overrides for the Slider anatomy.",
      type: "{ root?: SlotStyle; track?: SlotStyle; range?: SlotStyle; thumb?: SlotStyle }",
      kind: "interface",
      members: [
        { name: "root", type: "SlotStyle", required: false, description: "Styles the root slider interaction surface." },
        { name: "track", type: "SlotStyle", required: false, description: "Styles the track that contains the range and thumbs." },
        { name: "range", type: "SlotStyle", required: false, description: "Styles the filled portion of the track." },
        { name: "thumb", type: "SlotStyle", required: false, description: "Styles every slider thumb." },
      ],
    },
    SliderStylesProp: {
      name: "SliderStylesProp",
      summary: "Style overrides accepted by Slider.",
      type: "SliderStyleSlots",
      kind: "alias",
    },
  };
  const inheritedProps: PropDefinition[] = [
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds conventional classes to the root slider surface." },
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies inline styles to the root slider surface after styles.root inline styles." },
  ];
  const enrichProps = (props: PropDefinition[]) => props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }
  const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
  return {
    ...api,
    props: enrichProps([
      ...api.props.filter((prop) => !inheritedNames.has(prop.name)),
      ...inheritedProps,
    ]),
    propGroups: [
      { name: "Core" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Accessibility" },
    ],
    stateAttributes: [
      { name: "data-slot", description: "Stable anatomy identity on root, track, range, and thumb elements.", values: ["root", "track", "range", "thumb"] },
      { name: "data-slider-track", description: "Identifies the track element.", values: ["true"] },
      { name: "data-slider-range", description: "Identifies the filled range element.", values: ["true"] },
      { name: "data-slider-thumb", description: "Identifies each thumb element.", values: ["true"] },
      { name: "data-disabled", description: "The root, track, range, or thumb is disabled. It is omitted when enabled.", values: ["true"] },
      { name: "data-orientation", description: "The configured slider direction on the root and track.", values: ["horizontal", "vertical"] },
      { name: "data-focused", description: "A thumb has focus. It is omitted when the thumb is not focused.", values: ["true"] },
      { name: "data-focus-visible", description: "A thumb has keyboard-visible focus. It is omitted otherwise.", values: ["true"] },
      { name: "data-hovered", description: "A thumb is hovered. It is omitted otherwise.", values: ["true"] },
      { name: "data-pressed", description: "A thumb is pressed by keyboard interaction or is being dragged. It is omitted otherwise.", values: ["true"] },
      { name: "data-dragging", description: "A thumb is the active pointer-drag target. It is omitted otherwise.", values: ["true"] },
      { name: "data-slider-thumb-index", description: "Zero-based index of a thumb in the supplied value array." },
      { name: "data-slider-focus-surface", description: "Marks a thumb as the focus surface used by Slider's shared focus indicator.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks the track's local focus indicator, matching the shared focus contract.", values: ["local"] },
    ],
    customTypes,
  };
}

function enrichSwitchAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
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
  };

  const inheritedProps: PropDefinition[] = [
    {
      name: "readOnly",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Prevents keyboard, pointer, and drag-toggle changes while keeping the switch focusable.",
      tags: { see: "https://react-spectrum.adobe.com/react-aria/useSwitch.html" },
    },
    {
      name: "value",
      type: "string | number | readonly string[]",
      required: false,
      category: "Forms",
      description: "Native input value submitted under name when the switch is checked.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#value" },
    },
    {
      name: "form",
      type: "string",
      required: false,
      category: "Forms",
      description: "Associates the native input with a form by its ID.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#form" },
    },
    ...["onFocus", "onBlur"].map((name): PropDefinition => ({
      name,
      type: "React.FocusEventHandler<HTMLInputElement>",
      required: false,
      category: "Events",
      description: `Receives the native input's ${name === "onFocus" ? "focus" : "blur"} event alongside the shared focus behavior.`,
      tags: { mdn: `https://developer.mozilla.org/en-US/docs/Web/API/Element/${name === "onFocus" ? "focus" : "blur"}_event` },
    })),

    {
      name: "defaultChecked",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Initial checked value when state.checked, checked, and isSelected are absent; takes precedence over defaultSelected.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#checked" },
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Classes applied to the outer .switch surface after default classes and before styles.root.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/class" },
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Inline CSS properties applied to the outer switch surface; named slots accept classes only.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/style" },
    },
    {
      name: "name",
      type: "string",
      required: false,
      category: "Forms",
      description: "Form field name submitted with the checked switch value.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#name" },
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      category: "Forms",
      description: "Requires the switch to be checked before native form submission succeeds.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required" },
    },
    {
      name: "id",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "ID for the native switch input, allowing an external label to target it with htmlFor.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/id" },
    },
    {
      name: "autoFocus",
      type: "boolean",
      required: false,
      category: "Accessibility",
      description: "Requests focus for the native switch input when it mounts.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus" },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name for the switch when visible labeling is unavailable.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" },
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the switch's accessible name.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide additional switch instructions or context.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" },
    },
    {
      name: "aria-invalid",
      type: "boolean | \"true\" | \"false\" | \"grammar\" | \"spelling\"",
      required: false,
      category: "Accessibility",
      description: "Marks the native switch input invalid for assistive technology; does not add invalid styling.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid" },
    },
  ];
  const props = [...api.props.filter((prop) => !inheritedProps.some((inherited) => inherited.name === prop.name)), ...inheritedProps];
  const sizeProp = props.find((prop) => prop.name === "size");
  if (sizeProp) sizeProp.enumValueDetails = [
    { value: "default", description: "Uses the standard switch geometry." },
    { value: "sm", description: "Uses a smaller track and thumb." },
  ];
  const enrichProps = (definitions: PropDefinition[]) =>
    definitions.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));

  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }

  return {
    ...api,
    props: enrichProps(props),
    propGroups: [
      { name: "Core" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Forms" },
      { name: "Accessibility" },
      { name: "Advanced" },
    ],
    stateAttributes: [
      { name: "data-selected", description: "The switch is checked; omitted when unchecked.", values: ["true"] },
      { name: "data-disabled", description: "The switch is disabled; omitted when enabled.", values: ["true"] },
      { name: "data-hovered", description: "The pointer is over the enabled switch; omitted otherwise.", values: ["true"] },
      { name: "data-focused", description: "Root and input emit true when the input is focused, false otherwise.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "Root and input emit true for keyboard-visible focus, false otherwise.", values: ["true", "false"] },
      { name: "data-size", description: "The configured switch size.", values: ["default", "sm"] },
      { name: "data-slot", description: "Stable styling identity on each matching anatomy element; track and thumb also retain switch-track and switch-thumb class hooks.", values: ["root", "track", "thumb", "input", "focusIndicator"] },
      { name: "data-switch-focus-surface", description: "Marks the root as the visual focus surface for the native switch input.", values: ["true"] },
      { name: "data-ring", description: "Marks the local focus indicator as a shared focus ring.", values: ["true"] },
      { name: "data-self-target", description: "The indicator belongs to this switch's own focus surface.", values: ["true"] },
      { name: "data-visible", description: "The focus indicator is visible; omitted when hidden.", values: ["true"] },
      { name: "data-transition-radius", description: "The focus indicator animates a radius change on the same surface; omitted otherwise.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks the root's local shared focus indicator.", values: ["local"] },
    ],
    customTypes,
  };
}

function enrichCheckboxAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by Checkbox class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
    },
    CheckboxState: {
      name: "CheckboxState",
      summary: "Controlled state supplied to Checkbox.",
      type: "{ checked?: boolean; indeterminate?: boolean }",
      kind: "interface",
      members: [
        { name: "checked", type: "boolean", required: false, description: "Controlled checked value updated in response to onChange." },
        { name: "indeterminate", type: "boolean", required: false, description: "Controlled partial-selection state displayed with the indeterminate mark." },
      ],
    },
    CheckboxIconStyles: {
      name: "CheckboxIconStyles",
      summary: "Class-based styling targets for Checkbox state icons.",
      type: "{ checkmark?: Style; indeterminate?: Style }",
      kind: "interface",
      members: [
        { name: "checkmark", type: "Style", required: false, description: "Styles the checkmark shown when the checkbox is checked." },
        { name: "indeterminate", type: "Style", required: false, description: "Styles the horizontal mark shown for partial selection." },
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
        { name: "root", type: "Style", required: false, description: "Styles the outer checkbox row." },
        { name: "control", type: "Style", required: false, description: "Styles the control wrapper containing the input and state icon." },
        { name: "checkbox", type: "Style", required: false, description: "Styles the native checkbox input." },
        { name: "icon", type: "Style | CheckboxIconStyles", required: false, description: "Styles both state icons or targets checkmark and indeterminate icons separately." },
        { name: "label", type: "Style", required: false, description: "Styles the visible label associated with the native input." },
        { name: "helperText", type: "Style", required: false, description: "Styles the helper or validation message below the label." },
      ],
    },
    CheckboxStylesProp: {
      name: "CheckboxStylesProp",
      summary: "Class-based style overrides accepted by Checkbox.",
      type: "StylesProp<CheckboxStyleSlots>",
      kind: "alias",
      notes: ["The icon value may be a shared class value or an object targeting icon.checkmark and icon.indeterminate."],
    },
  };

  const inheritedProps: PropDefinition[] = [
    {
      name: "defaultChecked",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Initial checked value for uncontrolled usage when state.checked is absent.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#checked" },
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
      type: "React.ChangeEventHandler<HTMLInputElement>",
      required: false,
      category: "Events",
      description: "Runs after native pointer or keyboard toggling changes the checked value. Disabled checkboxes do not invoke it.",
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
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#name" },
    },
    {
      name: "value",
      type: "string | number | readonly string[]",
      required: false,
      category: "Forms",
      description: "Form value submitted with name when the checkbox is checked.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#value" },
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      category: "Forms",
      description: "Requires the checkbox to be checked before native form submission succeeds.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required" },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name used when no visible label is rendered.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" },
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the checkbox's accessible name.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References additional descriptive elements. Checkbox appends its helper text ID when helper content is rendered.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" },
    },
  ];

  const props = [
    ...api.props.filter((prop) => !inheritedProps.some((inherited) => inherited.name === prop.name)),
    ...inheritedProps,
  ].map((prop) => (prop.name === "styles" ? { ...prop, type: "CheckboxStylesProp" } : prop));
  const enrichProps = (definitions: PropDefinition[]) =>
    definitions.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));

  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }

  return {
    ...api,
    props: enrichProps(props),
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
      { name: "data-slot", description: "Stable anatomy identity on the matching Checkbox element.", values: ["root", "control", "checkbox", "icon.checkmark", "icon.indeterminate", "label", "helperText"] },
      { name: "data-selected", description: "The root and native input emit true when checked and omit the attribute when unchecked.", values: ["true"] },
      { name: "data-indeterminate", description: "The root and native input emit true for partial selection and omit the attribute otherwise.", values: ["true"] },
      { name: "data-disabled", description: "The root, native input, and visible label emit true when disabled and omit the attribute when enabled.", values: ["true"] },
      { name: "data-invalid", description: "The root and native input emit true when error, isInvalid, helperTextError, or aria-invalid marks the checkbox invalid.", values: ["true"] },
      { name: "data-error", description: "The native input and helper text emit true when Checkbox resolves an invalid state and omit it otherwise.", values: ["true"] },
      { name: "data-pressed", description: "The root and native input persistently emit true while an enabled checkbox is pressed and false otherwise.", values: ["true", "false"] },
      { name: "data-focused", description: "The root and native input persistently emit true while the native input is focused and false otherwise.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "The root and native input persistently emit true while focus is keyboard-visible and false otherwise.", values: ["true", "false"] },
      { name: "data-checkbox-focus-surface", description: "Marks the native input as the focus surface used by Checkbox's local focus indicator.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks Checkbox's local shared focus indicator.", values: ["local"] },
    ],
    customTypes,
  };
}

function enrichGroupAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    GroupOrientation: {
      name: "GroupOrientation",
      summary: "Axis that Group arranges its owned items along.",
      type: '"horizontal" | "vertical"',
      kind: "alias",
      values: [
        { value: "horizontal", description: "Items sit side by side, the group takes a fixed control height, and Left and Right arrows move focus between items." },
        { value: "vertical", description: "Items stack in a column, the group grows to fit them, and Up and Down arrows move focus between items." },
      ],
      notes: ["A nested Divider that does not set its own orientation adopts the perpendicular axis so it separates the items."],
    },
    GroupSpacing: {
      name: "GroupSpacing",
      summary: "Named gap step applied between Group's owned items.",
      type: '"none" | "xs" | "sm"',
      kind: "alias",
      values: [
        { value: "none", description: "Removes the gap and the group padding so the items read as one connected surface; only the outer corners of the first and last item are rounded." },
        { value: "xs", description: "Separates the items by a narrow gap and rounds every item individually." },
        { value: "sm", description: "Separates the items by a wider gap and rounds every item individually." },
      ],
    },
    GroupItemStyleSlots: {
      name: "GroupItemStyleSlots",
      summary: "Style overrides for the wrapper Group renders around each owned child.",
      type: `{
  root?: Style;
  first?: Style;
  last?: Style;
  divider?: Style;
  grow?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles every item wrapper Group renders around a child." },
        { name: "first", type: "Style", required: false, description: "Styles the first item wrapper in the group." },
        { name: "last", type: "Style", required: false, description: "Styles the last item wrapper in the group." },
        { name: "divider", type: "Style", required: false, description: "Styles an item wrapper whose child is a separator." },
        { name: "grow", type: "Style", required: false, description: "Styles an item wrapper that stretches because its child requests w-full or flex-1." },
      ],
      notes: [
        "Every slot targets the same kind of element. The positional and role slots apply only to the wrappers that currently match, and they compose with root.",
      ],
    },
    GroupItemStyleValue: {
      name: "GroupItemStyleValue",
      summary: "Shared or keyed styles for Group item wrappers.",
      type: "Style | GroupItemStyleSlots",
      kind: "alias",
      examples: ['item: "rounded-none"', 'item: { first: "pl-2", last: "pr-2" }'],
      notes: [
        "A shared Style value normalizes to item.root, so it reaches every wrapper exactly once. Use the keyed form to address one positional or role slot.",
      ],
    },
    GroupStyleSlots: {
      name: "GroupStyleSlots",
      summary: "Class-based slots for the Group root and its stable compound anatomy.",
      type: `{
  root?: Style;
  item?: GroupItemStyleValue;
  button?: Style;
  input?: Style;
  select?: Style;
  expand?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: 'Styles the role="group" root element, after className.' },
        { name: "item", type: "GroupItemStyleValue", required: false, description: "Styles every item wrapper and its keyed positional and role anatomy." },
        { name: "button", type: "Style", required: false, description: "Styles every Group.Button surface." },
        { name: "input", type: "Style", required: false, description: "Styles every Group.Input surface that wraps the nested Input." },
        { name: "select", type: "Style", required: false, description: "Styles every Group.Select surface." },
        { name: "expand", type: "Style", required: false, description: "Styles every Group.Expand surface that wraps the nested Expand." },
      ],
    },
    GroupStylesProp: {
      name: "GroupStylesProp",
      summary: "Keyed class names for Group anatomy.",
      type: "GroupStyleSlots",
      kind: "alias",
    },
  };

  const rootInheritedProps: PropDefinition[] = [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description: "Controls to group. Group wraps each element child in its own item element; nested fragments are flattened first so every real element becomes its own item.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds classes to the group root after its default classes and before styles.root. The w-full and flex-1 utilities are also forwarded to the focus scope wrapper so root sizing takes effect.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" }],
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline CSS properties to the group root, including any CSS variables the stylesheet consumes.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style" }],
    },
    {
      name: "onKeyDown",
      type: "React.KeyboardEventHandler<HTMLDivElement>",
      required: false,
      category: "Events",
      description: "Runs alongside Group's arrow-key navigation rather than replacing it. Group only claims the arrow keys that match its orientation.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event" }],
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: 'Provides the accessible name for the role="group" root when no visible label identifies it.',
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" }],
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the group's accessible name.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" }],
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that describe the group.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" }],
    },
  ];

  const normalizeGroupPropType = (componentName: string, prop: PropDefinition) => {
    if (componentName === "Group") {
      if (prop.name === "orientation") return { ...prop, type: "GroupOrientation" };
      if (prop.name === "spacing") return { ...prop, type: "GroupSpacing" };
      if (prop.name === "styles") return { ...prop, type: "GroupStylesProp" };
    }
    return prop;
  };

  const mergeInheritedProps = (props: PropDefinition[], inheritedProps: PropDefinition[]) => {
    const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
    return [...props.filter((prop) => !inheritedNames.has(prop.name)), ...inheritedProps];
  };

  const enrichProps = (componentName: string, props: PropDefinition[]) =>
    props.map((prop) => {
      const normalized = normalizeGroupPropType(componentName, prop);
      return { ...normalized, typeTokens: tokenizeType(normalized.type, Object.keys(customTypes)) };
    });

  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps("customType", customType.members);
  }

  return {
    ...api,
    props: enrichProps("Group", mergeInheritedProps(api.props, rootInheritedProps)),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name,
            { ...component, props: enrichProps(name, component.props) },
          ]),
        )
      : undefined,
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Accessibility" },
      { name: "Advanced" },
    ],
    stateAttributes: [
      { name: "data-slot", description: "Stable Group anatomy identity on the elements Group itself renders. Group.Button and Group.Select roots are owned by Button and Select, so they keep those components' own slot identities and are targeted through the button and select classes instead.", values: ["root", "item", "input", "expand"] },
      { name: "data-orientation", description: "The configured layout and arrow-key axis, always present on the root.", values: ["horizontal", "vertical"] },
      { name: "data-spacing", description: "The configured spacing step, always present on the root.", values: ["none", "xs", "sm"] },
      { name: "data-variant", description: "The configured variant name on the root; omitted when no variant is supplied." },
      { name: "data-disabled", description: "The root emits true while the group is disabled and omits the attribute otherwise. The root also sets aria-disabled in that state.", values: ["true"] },
      { name: "data-item", description: "Marks each wrapper Group renders around an owned child. Group.Button uses it to detect an adjacent Group.Input.", values: ["true"] },
      { name: "data-divider", description: "An item wrapper emits true when its child is a separator and omits the attribute otherwise.", values: ["true"] },
      { name: "data-grow", description: "An item wrapper emits true when its child requests w-full or flex-1 and omits the attribute otherwise.", values: ["true"] },
      { name: "data-focus-surface", description: "Marks Group.Button, Group.Input, Group.Select, and Group.Expand as the surfaces the shared group focus ring tracks.", values: ["true"] },
      { name: "data-selected", description: "Group.Button persistently emits its selected state, resolved from the Group value when the button declares one and from active otherwise.", values: ["true", "false"] },
      { name: "data-input", description: "Marks the Group.Input surface so adjacent Group.Buttons can hand pointer activation to the input.", values: ["true"] },
    ],
    customTypes,
  };
}

function enrichMenuAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
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
  };

  const CLASS_NAME_MDN = "https://developer.mozilla.org/en-US/docs/Web/API/Element/className";
  const STYLE_MDN = "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style";
  const ARIA_LABEL_MDN =
    "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label";

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

  const inheritedByComponent: Record<string, PropDefinition[]> = {
    Menu: [childrenProp("Menu.Trigger, Menu.Content, and any Menu.Portal wrapper that scopes them.")],
    "Menu.Portal": [
      childrenProp("Menu.Content and Menu.SubContent elements that should render into container."),
    ],
    "Menu.Trigger": [
      childrenProp(
        "Trigger content. With as=\"child\" this must be exactly one non-Fragment element, which receives the merged trigger props.",
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
  };

  const normalizeMenuPropType = (componentName: string, prop: PropDefinition): PropDefinition => {
    if (componentName === "Menu") {
      if (prop.name === "type") return { ...prop, type: "MenuType" };
      if (prop.name === "selectionMode") return { ...prop, type: "MenuSelectionMode" };
    }
    if (componentName === "Menu.Trigger") {
      if (prop.name === "as") return { ...prop, type: "MenuTriggerAs" };
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

  const mergeInherited = (componentName: string, props: PropDefinition[]) => {
    const inherited = inheritedByComponent[componentName] ?? [];
    const inheritedNames = new Set(inherited.map((prop) => prop.name));
    return [...props.filter((prop) => !inheritedNames.has(prop.name)), ...inherited];
  };

  const enrichProps = (componentName: string, props: PropDefinition[]) =>
    props.map((prop) => {
      const normalized = normalizeMenuPropType(componentName, prop);
      return {
        ...normalized,
        typeTokens: tokenizeType(normalized.type, Object.keys(customTypes)),
      };
    });

  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps("customType", customType.members);
  }

  const subComponents = api.subComponents
    ? Object.fromEntries(
        Object.entries(api.subComponents)
          // Contexts and hooks exported from the same files are not public compound parts.
          .filter(([name]) => name.startsWith("Menu."))
          .map(([name, component]) => [
            name,
            { ...component, props: enrichProps(name, mergeInherited(name, component.props)) },
          ]),
      )
    : undefined;

  return {
    ...api,
    props: enrichProps("Menu", mergeInherited("Menu", api.props)),
    subComponents,
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
    customTypes,
  };
}

function enrichAnchorAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    AnchorPreviewStyleSlots: {
      name: "AnchorPreviewStyleSlots",
      summary: "Class-based slots for the Anchor preview overlay.",
      type: "{ root?: Style; content?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the portaled overlay element that positions the preview." },
        { name: "content", type: "Style", required: false, description: "Styles the preview surface rendered inside the overlay." },
      ],
    },
    AnchorPreviewStyleValue: {
      name: "AnchorPreviewStyleValue",
      summary:
        "Shared or keyed styles for the Anchor preview overlay. A shared class applies to every preview slot; the keyed form addresses one slot.",
      type: "Style | AnchorPreviewStyleSlots",
      kind: "alias",
      examples: ['styles={{ preview: "shadow-lg" }}', 'styles={{ preview: { content: "max-w-xs" } }}'],
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
        { name: "root", type: "Style", required: false, description: "Styles the rendered anchor or span root element." },
        { name: "underline", type: "Style", required: false, description: "Styles the underline drawn beneath the label, including a consumer-supplied Anchor.Underline." },
        { name: "preview", type: "AnchorPreviewStyleValue", required: false, description: "Shared or keyed anatomy for the hover preview overlay." },
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
  };

  const rootInheritedProps: PropDefinition[] = [
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds conventional classes to the root element after its default classes and before styles.root.",
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
      description: "Native click handler on the root element, composed with Anchor's own hover and focus handlers.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" },
    },
    {
      name: "download",
      type: "string | boolean",
      required: false,
      category: "Link behavior",
      description: "Downloads the destination instead of navigating to it. Only applies when href is supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download" },
    },
    {
      name: "referrerPolicy",
      type: "React.HTMLAttributeReferrerPolicy",
      required: false,
      category: "Link behavior",
      description: "Referrer information sent when following the link. Only applies when href is supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#referrerpolicy" },
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Accessible name for the link, required when the label text does not describe the destination on its own.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" },
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that describe the link.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" },
    },
  ];

  const underlineInheritedProps: PropDefinition[] = [
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds classes to the underline element after its default classes and before styles.underline.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline styles to the underline element after the variant's generated mask styles.",
    },
  ];

  const withInherited = (props: PropDefinition[], inheritedProps: PropDefinition[]) => {
    const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
    return [...props.filter((prop) => !inheritedNames.has(prop.name)), ...inheritedProps];
  };
  const optionsByProp: Record<string, APIEnumValue[]> = {
    variant: [
      { value: "solid", description: "Draws a continuous underline." },
      { value: "dashed", description: "Draws an underline of evenly spaced dashes." },
      { value: "dotted", description: "Draws an underline of evenly spaced dots." },
    ],
  };
  const enrichProps = (props: PropDefinition[]) =>
    props.map((prop) => ({
      ...prop,
      ...(optionsByProp[prop.name] ? { enumValueDetails: optionsByProp[prop.name] } : {}),
      typeTokens: tokenizeType(prop.type, Object.keys(customTypes)),
    }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }

  // docgen resolves a dotted displayName only for forwardRef parts, so the
  // marker component still arrives under its declaration name. Enrichment runs
  // twice per component, so the renamed key must map to itself.
  const subComponentNames: Record<string, string> = {
    AnchorPreview: "Anchor.Preview",
    "Anchor.Preview": "Anchor.Preview",
    "Anchor.Underline": "Anchor.Underline",
  };
  const inheritedBySubComponent: Record<string, PropDefinition[]> = {
    "Anchor.Underline": underlineInheritedProps,
    "Anchor.Preview": [],
  };

  const subComponents = api.subComponents
    ? Object.fromEntries(
        Object.entries(api.subComponents)
          .filter(([name]) => name in subComponentNames)
          .map(([name, component]) => {
            const publicName = subComponentNames[name];
            return [
              publicName,
              {
                ...component,
                props: enrichProps(
                  withInherited(component.props, inheritedBySubComponent[publicName]),
                ),
              },
            ];
          }),
      )
    : undefined;

  return {
    ...api,
    props: enrichProps(withInherited(api.props, rootInheritedProps)),
    subComponents: subComponents && Object.keys(subComponents).length > 0 ? subComponents : undefined,
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Link behavior" },
      { name: "Accessibility" },
    ],
    stateAttributes: [
      { name: "data-slot", description: "Stable anatomy identity on the root element and on the underline element.", values: ["root", "underline"] },
      { name: "data-variant", description: "The resolved line treatment. Set on the root element and on each underline element, which may differ when Anchor.Underline overrides the root variant.", values: ["solid", "dashed", "dotted"] },
      { name: "data-hovered", description: "The pointer is over the Anchor root. Always present on the root element.", values: ["true", "false"] },
      { name: "data-focused", description: "The Anchor root is focused. Always present on the root element.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "The Anchor root has keyboard-visible focus. Always present on the root element.", values: ["true", "false"] },
      { name: "data-anchor-focus-surface", description: "Marks the Anchor root as the focus surface tracked by its local focus indicator.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks Anchor's local focus indicator element.", values: ["local"] },
    ],
    customTypes,
  };
}

function enrichPathAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    PathStyleSlots: {
      name: "PathStyleSlots",
      summary: "Style overrides for the Path root and named component parts.",
      type: "{ root?: Style; list?: Style; separator?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the root nav element." },
        { name: "list", type: "Style", required: false, description: "Styles the ordered list element." },
        { name: "separator", type: "Style", required: false, description: "Styles each separator rendered between items." },
      ],
    },
    PathStylesProp: {
      name: "PathStylesProp",
      summary: "Style overrides accepted by Path.",
      type: "PathStyleSlots",
      kind: "alias",
    },
    PathItemStyleSlots: {
      name: "PathItemStyleSlots",
      summary: "Style overrides for the Path.Item root.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the rendered anchor, button, or span element." },
      ],
    },
    PathItemStylesProp: {
      name: "PathItemStylesProp",
      summary: "Style overrides accepted by Path.Item.",
      type: "PathItemStyleSlots",
      kind: "alias",
    },
  };

  const rootInheritedProps: PropDefinition[] = [
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies inline styles to the root nav element." },
    { name: "aria-label", type: "string", required: false, category: "Accessibility", description: "Accessible name applied to the root nav landmark.", defaultValue: '"Path"', tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" } },
  ];
  const itemInheritedProps: PropDefinition[] = [
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies inline styles to the rendered anchor, button, or span element." },
    { name: "aria-label", type: "string", required: false, category: "Accessibility", description: "Accessible name for the item's rendered element. Required when the item's content does not provide a discernible text alternative.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" } },
  ];

  const withInherited = (props: PropDefinition[], inheritedProps: PropDefinition[]) => {
    const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
    return [...props.filter((prop) => !inheritedNames.has(prop.name)), ...inheritedProps];
  };
  const enrichProps = (props: PropDefinition[]) =>
    props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }

  const subComponents = api.subComponents
    ? Object.fromEntries(
        Object.entries(api.subComponents)
          .filter(([name]) => name === "Path.Item")
          .map(([name, component]) => [
            name,
            { ...component, props: enrichProps(withInherited(component.props, itemInheritedProps)) },
          ]),
      )
    : undefined;

  return {
    ...api,
    props: enrichProps(withInherited(api.props, rootInheritedProps)),
    subComponents,
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Link behavior" },
      { name: "Accessibility" },
    ],
    stateAttributes: [
      { name: "data-selected", description: "Path.Item's rendered element emits true on the current item (the last child) and omits the attribute otherwise.", values: ["true"] },
      { name: "data-disabled", description: "Path.Item's rendered element emits true when disabled and omits the attribute when enabled.", values: ["true"] },
      { name: "data-focused", description: "Path.Item's rendered element is focused; omitted otherwise.", values: ["true"] },
      { name: "data-focus-visible", description: "Path.Item's rendered element has keyboard-visible focus; omitted otherwise.", values: ["true"] },
      { name: "data-hovered", description: "The pointer is over an interactive, enabled Path.Item; omitted otherwise.", values: ["true"] },
      { name: "data-pressed", description: "An interactive Path.Item is currently pressed; omitted otherwise.", values: ["true"] },
      { name: "data-path-item-focus-surface", description: "Marks every Path.Item's rendered element as a focus surface tracked by Path's shared local focus indicator.", values: ["true"] },
      { name: "data-path-list", description: "Marks the ordered list element that arrow-key navigation and the focus indicator scope to.", values: ["true"] },
      { name: "data-separator", description: "Set on the ordered list element when a custom separator is supplied; omitted when using the default spacing.", values: ["custom"] },
      { name: "data-focus-indicator", description: "Marks Path's local shared focus indicator.", values: ["local"] },
    ],
    customTypes,
  };
}

function enrichDividerAPI(api: ComponentAPI): ComponentAPI {
  const optionsByProp: Record<string, APIEnumValue[]> = {
    variant: [
      { value: "solid", description: "Renders a continuous line." },
      { value: "dashed", description: "Renders a line of evenly spaced dashes." },
      { value: "dotted", description: "Renders a line of evenly spaced dots." },
    ],
    orientation: [
      { value: "horizontal", description: "Spans the full width and separates stacked content." },
      { value: "vertical", description: "Stretches to the cross-axis height and separates inline content." },
    ],
    size: [
      { value: "sm", description: "The thinnest divider thickness." },
      { value: "md", description: "The default divider thickness." },
      { value: "lg", description: "The thickest divider thickness." },
      { value: "auto", description: "Uses the theme's base border width instead of a fixed thickness." },
    ],
    spacing: [
      { value: "none", description: "No margin around the divider." },
      { value: "sm", description: "A small margin around the divider." },
      { value: "md", description: "A medium margin around the divider." },
      { value: "lg", description: "A large margin around the divider." },
    ],
  };

  return {
    ...api,
    props: api.props.map((prop) =>
      optionsByProp[prop.name] ? { ...prop, enumValueDetails: optionsByProp[prop.name] } : prop,
    ),
  };
}

function enrichExpandAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by Expand class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
    },
    ExpandDirection: {
      name: "ExpandDirection",
      summary: "Direction the content panel reveals from relative to the trigger.",
      type: '"below" | "above" | "left" | "right"',
      kind: "alias",
      notes: ["Below is the default and is treated as the implicit direction; the root layout and icon rotation update to match."],
      values: [
        { value: "below", description: "The content panel opens downward beneath the trigger. This is the implicit default." },
        { value: "above", description: "The content panel opens upward above the trigger." },
        { value: "left", description: "The content panel opens to the left of the trigger." },
        { value: "right", description: "The content panel opens to the right of the trigger." },
      ],
    },
    ExpandLayout: {
      name: "ExpandLayout",
      summary: "Controls whether Expand supplies its own corner radius or sits flush inside a bordered container.",
      type: '"standalone" | "contained"',
      kind: "alias",
      notes: ["contained removes the trigger's corner radius so Expand can sit flush inside an enclosing bordered surface."],
      values: [
        { value: "standalone", description: "Expand supplies its own corner radius, suitable as a freestanding surface." },
        { value: "contained", description: "Removes the trigger's corner radius so Expand can sit flush inside an enclosing bordered surface." },
      ],
    },
    ExpandState: {
      name: "ExpandState",
      summary: "Controlled expanded state supplied to Expand.",
      type: "{ expanded?: boolean }",
      kind: "interface",
      members: [
        { name: "expanded", type: "boolean", required: false, description: "Controlled expanded value." },
      ],
    },
    ExpandIconStyleSlots: {
      name: "ExpandIconStyleSlots",
      summary: "Class-based styling targets for the Expand icon, addressed by collapsed/expanded state.",
      type: "{ collapsed?: Style; expanded?: Style }",
      kind: "interface",
      members: [
        { name: "collapsed", type: "Style", required: false, description: "Styles the icon while the panel is collapsed." },
        { name: "expanded", type: "Style", required: false, description: "Styles the icon while the panel is expanded." },
      ],
    },
    ExpandContentStyleSlots: {
      name: "ExpandContentStyleSlots",
      summary: "Class-based styling targets for the Expand content panel and its padded inner region.",
      type: "{ root?: Style; inner?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the collapsing outer content panel." },
        { name: "inner", type: "Style", required: false, description: "Styles the padded region wrapping the panel's children." },
      ],
    },
    ExpandStyleSlots: {
      name: "ExpandStyleSlots",
      summary: "Named style overrides for the Expand root and stable compound anatomy.",
      type: `{
  root?: Style;
  trigger?: Style;
  icon?: Style | ExpandIconStyleSlots;
  title?: Style;
  content?: Style | ExpandContentStyleSlots;
  divider?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the root expand container." },
        { name: "trigger", type: "Style", required: false, description: "Styles the trigger button." },
        { name: "icon", type: "Style | ExpandIconStyleSlots", required: false, description: "Shared or state-specific styles for the disclosure icon." },
        { name: "title", type: "Style", required: false, description: "Styles the trigger's title/label text." },
        { name: "content", type: "Style | ExpandContentStyleSlots", required: false, description: "Shared or keyed styles for the content panel and its inner region." },
        { name: "divider", type: "Style", required: false, description: "Styles the divider rendered between the trigger and content." },
      ],
    },
    ExpandStylesProp: {
      name: "ExpandStylesProp",
      summary: "Style overrides accepted by Expand.",
      type: "ExpandStyleSlots",
      kind: "alias",
    },
  };

  const rootInheritedProps: PropDefinition[] = [
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds conventional classes to the root expand container after its default classes and before styles.root." },
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies inline styles to the root expand container." },
    { name: "aria-label", type: "string", required: false, category: "Accessibility", description: "Accessible name applied to the root container. Does not replace the trigger's own accessible name.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" } },
    { name: "aria-labelledby", type: "string", required: false, category: "Accessibility", description: "References element IDs that label the root container.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" } },
    { name: "aria-describedby", type: "string", required: false, category: "Accessibility", description: "References element IDs that describe the root container.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" } },
  ];
  const triggerInheritedProps: PropDefinition[] = [
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds classes to the trigger button after its default classes and before the root styles.trigger value." },
    { name: "onClick", type: "React.MouseEventHandler<HTMLButtonElement>", required: false, category: "Events", description: "Native click handler composed with the internal toggle press handler. Disabled triggers do not invoke it.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" } },
    { name: "autoFocus", type: "boolean", required: false, category: "Accessibility", description: "Requests focus for the trigger button when it mounts.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus" } },
  ];
  const contentInheritedProps: PropDefinition[] = [
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds classes to the collapsing content panel after its default classes and before the root styles.content value." },
  ];
  const iconInheritedProps: PropDefinition[] = [
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds classes to the icon wrapper after its default classes and before the root styles.icon value." },
  ];

  const withInherited = (props: PropDefinition[], inheritedProps: PropDefinition[]) => {
    const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
    return [...props.filter((prop) => !inheritedNames.has(prop.name)), ...inheritedProps];
  };
  const normalizeExpandPropType = (componentName: string, prop: PropDefinition) => {
    if (componentName === "Expand" && prop.name === "layout") return { ...prop, type: "ExpandLayout" };
    if (componentName === "Expand.Content" && prop.name === "from") return { ...prop, type: "ExpandDirection" };
    return prop;
  };
  const enrichProps = (componentName: string, props: PropDefinition[]) =>
    props.map((prop) => {
      const normalized = normalizeExpandPropType(componentName, prop);
      return { ...normalized, typeTokens: tokenizeType(normalized.type, Object.keys(customTypes)) };
    });
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps("customType", customType.members);
  }

  const subComponents = api.subComponents
    ? Object.fromEntries(
        Object.entries(api.subComponents)
          // useExpandContext, the divider/content type guards, and moveDividersIntoContent
          // are internal helpers, not public subcomponents.
          .filter(([name]) => name.startsWith("Expand."))
          .map(([name, component]) => [
            name,
            {
              ...component,
              props: enrichProps(
                name,
                name === "Expand.Trigger"
                  ? withInherited(component.props, triggerInheritedProps)
                  : name === "Expand.Content"
                    ? withInherited(component.props, contentInheritedProps)
                    : name === "Expand.Icon"
                      ? withInherited(component.props, iconInheritedProps)
                      : component.props,
              ),
            },
          ]),
      )
    : undefined;

  return {
    ...api,
    props: enrichProps("Expand", withInherited(api.props, rootInheritedProps)),
    subComponents,
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Accessibility" },
    ],
    stateAttributes: [
      { name: "data-selected", description: "The root, trigger, icon, and content panel emit true while expanded and omit the attribute while collapsed.", values: ["true"] },
      { name: "data-expanded", description: "The root, trigger, icon, and content panel emit true while expanded and omit the attribute while collapsed.", values: ["true"] },
      { name: "data-disabled", description: "The root and trigger emit true when disabled and omit the attribute when enabled.", values: ["true"] },
      { name: "data-layout", description: "The configured layout on the root.", values: ["standalone", "contained"] },
      { name: "data-from", description: "The content panel's configured reveal direction. Omitted for the default below direction.", values: ["above", "left", "right"] },
      { name: "data-focused", description: "The trigger is focused; omitted otherwise.", values: ["true"] },
      { name: "data-focus-visible", description: "The trigger has keyboard-visible focus; omitted otherwise.", values: ["true"] },
      { name: "data-pressed", description: "The trigger is currently pressed; omitted otherwise.", values: ["true"] },
      { name: "data-hovered", description: "The pointer is over the enabled trigger; omitted otherwise.", values: ["true"] },
      { name: "data-expand-focus-surface", description: "Marks the trigger as the focus surface used by Expand's shared local focus indicator.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks Expand's local shared focus indicator.", values: ["local"] },
    ],
    customTypes,
  };
}

function enrichListAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by List style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
    },
    ListOrientation: {
      name: "ListOrientation",
      summary: "Axis used by List layout and keyboard navigation.",
      type: '"vertical" | "horizontal"',
      kind: "alias",
      values: [
        { value: "vertical", description: "Items stack top to bottom and Up/Down arrow keys move focus between them." },
        { value: "horizontal", description: "Items lay out left to right and Left/Right arrow keys move focus between them." },
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
        { name: "up", type: "() => void", required: false, description: "Called after focusPrev or focusLast." },
        { name: "down", type: "() => void", required: false, description: "Called after focusNext or focusFirst." },
        { name: "enter", type: "() => void", required: false, description: "Called by selectHighlighted." },
        { name: "escape", type: "() => void", required: false, description: "Reserved for an integration escape action." },
      ],
    },
    ListRef: {
      name: "ListRef",
      summary: "The listbox element augmented with List navigation methods.",
      type: "HTMLDivElement & { focusNext: () => void; focusPrev: () => void; focusFirst: () => void; focusLast: () => void; selectHighlighted: () => void; clearHighlight: () => void; getHighlightedIndex: () => number | null }",
      kind: "interface",
      members: [
        { name: "focusNext", type: "() => void", required: true, description: "Focuses the next eligible option, wrapping at the end." },
        { name: "focusPrev", type: "() => void", required: true, description: "Focuses the previous eligible option, wrapping at the start." },
        { name: "focusFirst", type: "() => void", required: true, description: "Focuses the first eligible option." },
        { name: "focusLast", type: "() => void", required: true, description: "Focuses the last eligible option." },
        { name: "selectHighlighted", type: "() => void", required: true, description: "Calls the configured enter navigation callback." },
        { name: "clearHighlight", type: "() => void", required: true, description: "Clears the current keyboard highlight." },
        { name: "getHighlightedIndex", type: "() => number | null", required: true, description: "Returns the highlighted eligible-option index, or null." },
      ],
    },
    ListActionDef: {
      name: "ListActionDef",
      summary: "Declarative action rendered by List.Actions.",
      type: "{ icon: React.ReactNode; title: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }",
      kind: "interface",
      members: [
        { name: "icon", type: "React.ReactNode", required: true, description: "Content rendered inside the generated action button." },
        { name: "title", type: "string", required: true, description: "Tooltip content and accessible name for the action button." },
        { name: "onClick", type: "React.MouseEventHandler<HTMLButtonElement>", required: false, description: "Runs when the generated action button is clicked." },
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
        { name: "checkbox", type: "Style", required: false, description: "Styles List.CheckboxIndicator." },
        { name: "control", type: "Style", required: false, description: "Styles an embedded control wrapper." },
        { name: "media", type: "Style", required: false, description: "Styles List.Media." },
        { name: "title", type: "Style", required: false, description: "Styles List.Title." },
        { name: "desc", type: "Style", required: false, description: "Styles List.Desc." },
        { name: "actions", type: "Style", required: false, description: "Styles the List.Actions container." },
        { name: "action", type: "Style", required: false, description: "Styles generated List.Actions buttons." },
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
      notes: ["A shared Style value applies to item.root; use the keyed form for a specific descendant."],
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
        { name: "item", type: "ListItemStyleValue", required: false, description: "Styles every List.Item and its keyed anatomy." },
        { name: "actionGroup", type: "Style", required: false, description: "Styles List.ActionGroup." },
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
  };

  const rootInheritedProps: PropDefinition[] = [
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds classes to the listbox root after its default class and before styles.root.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" }],
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline CSS properties to the listbox root. The gap prop supplies its internal gap variable when present.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style" }],
    },
    {
      name: "aria-label",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "Provides the accessible name for the listbox when no visible label identifies it.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" }],
    },
    {
      name: "aria-labelledby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that provide the listbox's accessible name.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" }],
    },
    {
      name: "aria-describedby",
      type: "string",
      required: false,
      category: "Accessibility",
      description: "References element IDs that describe the listbox.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" }],
    },
  ];
  const itemInheritedProps: PropDefinition[] = [
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Adds classes to this option row after List-level item styles and before this item's styles.root.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" }],
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Applies inline CSS properties to this option row. List-owned column layout supplies gridTemplateColumns when needed.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style" }],
    },
    {
      name: "onClick",
      type: "React.MouseEventHandler<HTMLDivElement>",
      required: false,
      category: "Events",
      description: "Runs for a row click unless the event originates from a nested interactive control or the row is disabled. A successful click focuses the row.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event" }],
    },
    {
      name: "onKeyDown",
      type: "React.KeyboardEventHandler<HTMLDivElement>",
      required: false,
      category: "Events",
      description: "Runs before List handles row navigation and activation. Prevent the event's default behavior to retain custom keyboard handling.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event" }],
    },
    {
      name: "aria-disabled",
      type: "React.AriaAttributes[\"aria-disabled\"]",
      required: false,
      category: "Accessibility",
      description: "Removes the option from List keyboard navigation and suppresses row activation when set to true.",
      links: [{ label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled" }],
    },
  ];
  const mergeInheritedProps = (props: PropDefinition[], inheritedProps: PropDefinition[]) => {
    const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
    return [...props.filter((prop) => !inheritedNames.has(prop.name)), ...inheritedProps];
  };
  const normalizeListPropType = (componentName: string, prop: PropDefinition) => {
    if (componentName === "List") {
      if (prop.name === "orientation") return { ...prop, type: "ListOrientation" };
      if (prop.name === "gap") return { ...prop, type: "ListGap" };
      if (prop.name === "styles") return { ...prop, type: "ListStylesProp" };
    }

    if (componentName === "List.Item") {
      if (prop.name === "styles") return { ...prop, type: "ListItemStylesProp" };
      if (prop.name === "actions") {
        return { ...prop, type: "Array<ListActionDef | React.ReactNode>" };
      }
    }

    if (componentName === "List.Actions" && prop.name === "actions") {
      return { ...prop, type: "Array<ListActionDef | React.ReactNode>" };
    }

    return prop;
  };
  const enrichProps = (componentName: string, props: PropDefinition[]) =>
    props.map((prop) => {
      const normalized = normalizeListPropType(componentName, prop);
      return { ...normalized, typeTokens: tokenizeType(normalized.type, Object.keys(customTypes)) };
    });
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps("customType", customType.members);
  }

  return {
    ...api,
    props: enrichProps("List", mergeInheritedProps(api.props, rootInheritedProps)),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name,
            {
              ...component,
              props: enrichProps(
                name,
                name === "List.Item"
                  ? mergeInheritedProps(component.props, itemInheritedProps)
                  : component.props,
              ),
            },
          ]),
        )
      : undefined,
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Accessibility" },
      { name: "Advanced" },
    ],
    stateAttributes: [
      { name: "data-slot", description: "Stable List anatomy identity on the matching rendered element.", values: ["root", "header", "item", "item.checkbox", "item.control", "item.media", "item.title", "item.desc", "item.actions", "item.action", "actionGroup", "divider", "footer"] },
      { name: "data-variant", description: "The configured List root variant.", values: ["default", "feed"] },
      { name: "data-orientation", description: "The configured layout and arrow-key axis.", values: ["vertical", "horizontal"] },
      { name: "data-gap", description: "The configured named gap step; omitted when no gap prop is supplied.", values: ["xs", "sm", "md", "lg", "xl"] },
      { name: "data-spacing", description: "The configured spacing token.", values: ["default", "sm"] },
      { name: "data-focus-mode", description: "The root emits row while a row owns keyboard focus; it is omitted otherwise.", values: ["row"] },
      { name: "data-keyboard-mode", description: "The root emits true while row keyboard focus mode is active; it is omitted otherwise.", values: ["true"] },
      { name: "data-focused", description: "An option persistently emits true or false according to its focus state.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "An option persistently emits true or false when focus is keyboard-visible.", values: ["true", "false"] },
      { name: "data-highlighted", description: "An option persistently emits true or false when it is the List keyboard-highlighted row.", values: ["true", "false"] },
      { name: "data-selected", description: "An option emits true when selected and omits the attribute otherwise.", values: ["true"] },
      { name: "data-interactive", description: "An option emits true when its interactive styling marker is enabled and omits it otherwise.", values: ["true"] },
      { name: "data-disabled", description: "An option preserves a supplied disabled marker; List treats true as disabled during navigation and activation.", values: ["true", "false"] },
      { name: "data-value", description: "An option emits its supplied value string; it is omitted without a value." },
      { name: "data-list-layout", description: "An option emits columns when List-owned leading or trailing slots create column layout.", values: ["columns"] },
      { name: "data-list-focus-owner", description: "Marks the option row as the owner of List's roving focus behavior.", values: ["true"] },
      { name: "data-actions", description: "Marks the List.Actions container when it renders.", values: ["true"] },
      { name: "data-checked", description: "List.CheckboxIndicator persistently emits its indicator state.", values: ["true", "false"] },
      { name: "data-placement", description: "List.Checkbox emits its control placement.", values: ["start", "end"] },
      { name: "data-control", description: "List.Input marks its shared control wrapper as an input control.", values: ["input"] },
      { name: "data-justify", description: "List.ActionGroup persistently emits its resolved inline alignment.", values: ["start", "between", "end"] },
      { name: "data-list-primary-action", description: "Marks a nested control wrapper as the row's explicit activation target.", values: ["true"] },
    ],
    customTypes,
  };
}

function enrichCommandAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    CommandState: {
      name: "CommandState",
      summary: "Imperative open state and trigger registration shared by Command and Command.Trigger.",
      type: "{ isOpen: boolean; setOpen: (open: boolean) => void; open: () => void; close: () => void; toggle: () => void; setTrigger: (element: HTMLElement | null) => void; triggerRef: React.MutableRefObject<HTMLElement | null> }",
      kind: "interface",
      members: [
        {
          name: "isOpen",
          type: "boolean",
          required: true,
          description: "Whether the command palette is currently open.",
        },
        {
          name: "setOpen",
          type: "(open: boolean) => void",
          required: true,
          description: "Sets the command palette to an explicit open state.",
        },
        {
          name: "open",
          type: "() => void",
          required: true,
          description: "Opens the command palette.",
        },
        {
          name: "close",
          type: "() => void",
          required: true,
          description: "Closes the command palette.",
        },
        {
          name: "toggle",
          type: "() => void",
          required: true,
          description: "Toggles the current open state.",
        },
        {
          name: "setTrigger",
          type: "(element: HTMLElement | null) => void",
          required: true,
          description: "Registers the trigger element that receives focus after the floating palette closes.",
        },
        {
          name: "triggerRef",
          type: "React.MutableRefObject<HTMLElement | null>",
          required: true,
          description: "Mutable reference to the registered trigger element.",
        },
      ],
      notes: ["Pass the same state instance to Command and Command.Trigger so opening and focus restoration remain coordinated."],
    },
    CommandStyleSlots: {
      name: "CommandStyleSlots",
      summary: "Style overrides for the command surface and its named compound parts.",
      type: `{
  root?: Style;
  overlay?: Style;
  search?: Style;
  input?: Style;
  inner?: Style;
  list?: Style;
  empty?: Style;
  item?: CommandItemStyleSlots;
  category?: Style;
  footer?: Style;
  groups?: CommandGroupsStyleSlots;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles applied to the command surface." },
        { name: "overlay", type: "Style", required: false, description: "Styles applied to the modal backdrop in floating mode." },
        { name: "search", type: "Style", required: false, description: "Styles applied to the search input wrapper." },
        { name: "input", type: "Style", required: false, description: "Styles applied to the search input root." },
        { name: "inner", type: "Style", required: false, description: "Styles applied to the framed list container." },
        { name: "list", type: "Style", required: false, description: "Styles the List primitive rendered inside Command.List, not its scroller frame." },
        { name: "empty", type: "Style", required: false, description: "Styles applied to the empty-state message." },
        { name: "item", type: "CommandItemStyleSlots", required: false, description: "Styles the Command.Item anatomy." },
        { name: "category", type: "Style", required: false, description: "Styles applied to category headers." },
        { name: "footer", type: "Style", required: false, description: "Styles applied to the command footer." },
        { name: "groups", type: "CommandGroupsStyleSlots", required: false, description: "Styles the Command.Groups container and its category groups." },
      ],
    },
    CommandItemStyleSlots: {
      name: "CommandItemStyleSlots",
      summary: "Style overrides for the stable anatomy rendered by Command.Item.",
      type: `{
  root?: Style;
  content?: Style;
  icon?: Style;
  hint?: Style;
  label?: Style;
  description?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the option element." },
        { name: "content", type: "Style", required: false, description: "Styles the wrapper containing the icon and item content." },
        { name: "icon", type: "Style", required: false, description: "Styles the icon container." },
        { name: "hint", type: "Style", required: false, description: "Styles the trailing hint badge." },
        { name: "label", type: "Style", required: false, description: "Styles Command.Label within the item." },
        { name: "description", type: "Style", required: false, description: "Styles Command.Description within the item." },
      ],
    },
    CommandGroupsStyleSlots: {
      name: "CommandGroupsStyleSlots",
      summary: "Style overrides for the stable anatomy rendered by Command.Groups.",
      type: `{
  root?: Style;
  group?: Style;
}`,
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the Command.Groups container." },
        { name: "group", type: "Style", required: false, description: "Styles each category group." },
      ],
    },
    CommandItem: {
      name: "CommandItem",
      summary: "Declarative command data consumed by filtering, grouping, focus management, and Command.Groups.",
      type: "{ id: string; label: string; description?: string; category?: string; shortcut?: string; icon?: React.ReactNode; keywords?: string[]; action: () => void | Promise<void>; hint?: string }",
      kind: "interface",
      members: [
        { name: "id", type: "string", required: true, description: "Stable identifier used for rendering, focus tracking, and action lookup." },
        { name: "label", type: "string", required: true, description: "Primary searchable label for the command." },
        { name: "description", type: "string", required: false, description: "Supplemental description available to custom item renderers." },
        { name: "category", type: "string", required: false, description: "Group name used by Command.Groups." },
        { name: "shortcut", type: "string", required: false, description: "Keyboard shortcut text available to custom item renderers." },
        { name: "icon", type: "React.ReactNode", required: false, description: "Icon content available to custom item renderers." },
        { name: "keywords", type: "string[]", required: false, description: "Additional terms considered when ranking a search query." },
        { name: "action", type: "() => void | Promise<void>", required: true, description: "Action invoked when this command is selected." },
        { name: "hint", type: "string", required: false, description: "Compact hint text passed to the Command.Groups item renderer." },
      ],
      examples: ['items={[{ id: "settings", label: "Settings", category: "Navigation", action: openSettings }]}'],
      notes: ["Filtering preserves the supplied item objects, then query relevance orders matches by label and keywords."],
    },
  };

  const enrichProps = (props: PropDefinition[]) =>
    props.map((prop) => ({
      ...prop,
      typeTokens: tokenizeType(prop.type, Object.keys(customTypes)),
    }));

  return {
    ...api,
    props: enrichProps(api.props),
    subComponents: api.subComponents
      ? Object.fromEntries(
          Object.entries(api.subComponents).map(([name, component]) => [
            name,
            { ...component, props: enrichProps(component.props) },
          ]),
        )
      : undefined,
    customTypes,
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
      { name: "data-slot", description: "Stable anatomy identity. The command surface emits root; compound parts emit their matching slot path.", values: ["root", "overlay", "search", "input", "inner", "list", "empty", "item.root", "item.content", "item.icon", "item.hint", "item.label", "item.description", "category", "footer", "groups.root", "groups.group"] },
      { name: "data-state", description: "The floating overlay transition state. Command omits the overlay in embedded mode.", values: ["entering", "entered", "exiting"] },
      { name: "data-highlighted", description: "Each Command.Item emits true when it is the keyboard-highlighted option and false otherwise.", values: ["true", "false"] },
    ],
  };
}

function enrichInputAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
    },
    InputVariant: {
      name: "InputVariant",
      summary: "An open string type selecting the input surface treatment.",
      type: '"default" | "ghost" | (string & {})',
      kind: "alias",
      notes: ["The built-in variants are default and ghost; custom variant names remain valid theme hooks."],
    },
    InputState: {
      name: "InputState",
      summary: "Controlled values accepted through the Input state abstraction.",
      type: "{ value?: string }",
      kind: "interface",
      members: [{ name: "value", type: "string", required: false, description: "Current input value. Takes precedence over the native value prop." }],
    },
    InputIconSlots: {
      name: "InputIconSlots",
      summary: "Icon content positioned before and/or after the input value.",
      type: "{ prefix?: React.ReactNode; suffix?: React.ReactNode }",
      kind: "interface",
      members: [
        { name: "prefix", type: "React.ReactNode", required: false, description: "Content rendered before the input value." },
        { name: "suffix", type: "React.ReactNode", required: false, description: "Content rendered after the input value." },
      ],
    },
    InputActionDef: {
      name: "InputActionDef",
      summary: "Declarative inline action rendered as an icon button.",
      type: "{ icon: React.ReactNode; title: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }",
      kind: "interface",
      members: [
        { name: "icon", type: "React.ReactNode", required: true, description: "Icon content for the action button." },
        { name: "title", type: "string", required: true, description: "Accessible name and tooltip content for the action button." },
        { name: "onClick", type: "React.MouseEventHandler<HTMLButtonElement>", required: false, description: "Invoked when the action button is pressed." },
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
        { name: "left", type: "InputAction[]", required: false, description: "Actions rendered before the input value." },
        { name: "right", type: "InputAction[]", required: false, description: "Actions rendered after the input value." },
      ],
    },
    InputAdornmentStyles: {
      name: "InputAdornmentStyles",
      summary: "Styles for adornment wrappers at either edge of the input.",
      type: "{ start?: Style; end?: Style }",
      kind: "interface",
      members: [
        { name: "start", type: "Style", required: false, description: "Styles the wrapper containing leading icons and actions." },
        { name: "end", type: "Style", required: false, description: "Styles the wrapper containing trailing icons, actions, hints, and controls." },
      ],
    },
    InputIconStyles: {
      name: "InputIconStyles",
      summary: "Styles for icons rendered at either edge of the input.",
      type: "{ left?: Style; right?: Style }",
      kind: "interface",
      members: [
        { name: "left", type: "Style", required: false, description: "Styles the icon before the input value." },
        { name: "right", type: "Style", required: false, description: "Styles the icon after the input value." },
      ],
    },
    InputActionStyles: {
      name: "InputActionStyles",
      summary: "Styles for action groups at either edge of the input.",
      type: "{ left?: Style; right?: Style }",
      kind: "interface",
      members: [
        { name: "left", type: "Style", required: false, description: "Styles the actions before the input value." },
        { name: "right", type: "Style", required: false, description: "Styles the actions after the input value." },
      ],
    },
    InputStepperStyles: {
      name: "InputStepperStyles",
      summary: "Styles for the number-input stepper buttons.",
      type: "{ up?: Style; down?: Style }",
      kind: "interface",
      members: [
        { name: "up", type: "Style", required: false, description: "Styles the increment button." },
        { name: "down", type: "Style", required: false, description: "Styles the decrement button." },
      ],
    },
    InputStyleSlots: {
      name: "InputStyleSlots",
      summary: "Named style slots for the Input anatomy.",
      type: "{ root?: Style; input?: Style; adornments?: InputAdornmentStyles; icon?: Style | InputIconStyles; actions?: Style | InputActionStyles; hint?: Style; controls?: Style; stepper?: Style | InputStepperStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the visual input surface." },
        { name: "input", type: "Style", required: false, description: "Styles the native input or custom input content surface." },
        { name: "adornments", type: "InputAdornmentStyles", required: false, description: "Styles adornment wrappers through adornments.start and adornments.end." },
        { name: "icon", type: "Style | InputIconStyles", required: false, description: "Styles one or both icon wrappers." },
        { name: "actions", type: "Style | InputActionStyles", required: false, description: "Styles one or both actions wrappers." },
        { name: "hint", type: "Style", required: false, description: "Styles the hint content." },
        { name: "controls", type: "Style", required: false, description: "Styles the number-input controls wrapper." },
        { name: "stepper", type: "Style | InputStepperStyles", required: false, description: "Styles one or both number-input stepper buttons." },
      ],
    },
    InputStylesProp: {
      name: "InputStylesProp",
      summary: "Class-based style overrides for Input's root and named anatomy slots.",
      type: "StylesProp<InputStyleSlots>",
      kind: "alias",
      notes: ["Nested slot objects address dotted anatomy paths such as adornments.start and stepper.up."],
    },
  };

  const inheritedProps: PropDefinition[] = [
    { name: "value", type: "string | number | readonly string[]", required: false, category: "Core", description: "Controls the native input value when state.value is not provided.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value" } },
    { name: "defaultValue", type: "string | number | readonly string[]", required: false, category: "Core", description: "Sets the initial uncontrolled native input value when state.value and value are absent.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value" } },
    { name: "type", type: "React.HTMLInputTypeAttribute", required: false, category: "Core", description: "Selects the native input type. Number inputs render stepper controls unless hide-controls is set.", defaultValue: "\"text\"", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types" } },
    { name: "disabled", type: "boolean", required: false, category: "Core", description: "Disables the native input and declarative inline actions, then applies disabled styling.", defaultValue: "false", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled" } },
    { name: "placeholder", type: "string", required: false, category: "Content", description: "Displays a placeholder while the native input has no value.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder" } },
    { name: "onChange", type: "React.ChangeEventHandler<HTMLInputElement>", required: false, category: "Events", description: "Runs after the native input value changes, including changes made by number stepper controls.", tags: { mdn: "https://react.dev/reference/react-dom/components/input#onchange" } },
    { name: "onFocus", type: "React.FocusEventHandler<HTMLInputElement>", required: false, category: "Events", description: "Runs when the native input, or custom content in children mode, receives focus.", tags: { mdn: "https://react.dev/reference/react-dom/components/common#onfocus" } },
    { name: "onBlur", type: "React.FocusEventHandler<HTMLInputElement>", required: false, category: "Events", description: "Runs when the native input, or custom content in children mode, loses focus.", tags: { mdn: "https://react.dev/reference/react-dom/components/common#onblur" } },
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds conventional classes to the root input surface before the resolved styles.root class.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" } },
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies native inline styles to the root input surface.", tags: { mdn: "https://react.dev/reference/react-dom/components/common#style" } },
    { name: "name", type: "string", required: false, category: "Forms", description: "Names the native input for form submission.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/name" } },
    { name: "required", type: "boolean", required: false, category: "Forms", description: "Requires a value before a containing form can submit the native input.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required" } },
    { name: "autoComplete", type: "string", required: false, category: "Forms", description: "Supplies the browser autocomplete hint for the native input.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete" } },
    { name: "aria-label", type: "string", required: false, category: "Accessibility", description: "Provides an accessible name when no associated label supplies one.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" } },
    { name: "aria-labelledby", type: "string", required: false, category: "Accessibility", description: "References elements that label the native input.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" } },
    { name: "aria-describedby", type: "string", required: false, category: "Accessibility", description: "References elements that describe the native input.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" } },
    { name: "autoFocus", type: "boolean", required: false, category: "Accessibility", description: "Requests focus for the native input after it mounts.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus" } },
  ];
  const props = [
    ...api.props.filter((prop) => !inheritedProps.some((inherited) => inherited.name === prop.name)),
    ...inheritedProps,
  ];

  return {
    ...api,
    props: props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) })),
    propGroups: [{ name: "Core" }, { name: "Content" }, { name: "Events" }, { name: "Styling" }, { name: "Forms" }, { name: "Accessibility" }, { name: "Advanced" }],
    stateAttributes: [
      { name: "data-focused", description: "The input or its custom content has focus.", values: ["true"] },
      { name: "data-focus-visible", description: "The input has keyboard-visible focus.", values: ["true"] },
      { name: "data-disabled", description: "The input is disabled.", values: ["true"] },
      { name: "data-error", description: "The input displays error styling.", values: ["true"] },
      { name: "data-variant", description: "The resolved variant name." },
      { name: "data-slot", description: "Stable styling identity for the root or named Input anatomy part.", values: ["root", "input", "adornments.start", "adornments.end", "icon.left", "icon.right", "actions.left", "actions.right", "hint", "controls", "stepper.up", "stepper.down"] },
      { name: "data-input-focus-surface", description: "Marks the root as the visual focus surface used by Input's local focus indicator.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks Input's local shared focus indicator when Input is not rendered inside Group.", values: ["local"] },
      { name: "data-ring", description: "Marks the local focus indicator element when Input is not rendered inside Group.", values: ["true"] },
      { name: "data-visible", description: "The local focus indicator is visible for keyboard focus; it is omitted while hidden.", values: ["true"] },
    ],
    customTypes,
  };
}

function enrichTextAreaAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
    },
    TextAreaSize: {
      name: "TextAreaSize",
      summary: "Height preset and text density applied to the field.",
      type: '"sm" | "md" | "lg"',
      kind: "alias",
      values: [
        { value: "sm", description: "A compact field with tighter padding and a smaller minimum height." },
        { value: "md", description: "The default field padding and minimum height." },
        { value: "lg", description: "A roomier field with larger padding, body text size, and minimum height." },
      ],
      notes: ["The size is published on the root and the field as data-size, and as a conventional class on the root."],
    },
    TextAreaResize: {
      name: "TextAreaResize",
      summary: "Axis the field can be dragged along with the custom resize handle.",
      type: '"none" | "x" | "y" | "both"',
      kind: "alias",
      values: [
        { value: "none", description: "Renders no handle and leaves the field at its preset size." },
        { value: "x", description: "Renders a handle on the trailing edge that changes width only." },
        { value: "y", description: "Renders a handle on the bottom edge that changes height only." },
        { value: "both", description: "Renders a corner handle that changes width and height together." },
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
          description: "Styles the bordered scroll wrapper rendered in place of the field border when maxHeight is set.",
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
          description: "Styles every resize handle, or one axis through resizeHandle.both, resizeHandle.x, and resizeHandle.y.",
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
  };

  const optionsByProp: Record<string, APIEnumValue[]> = {
    size: customTypes.TextAreaSize.values ?? [],
    resize: customTypes.TextAreaResize.values ?? [],
  };

  const inheritedProps: PropDefinition[] = [
    { name: "value", type: "string | number | readonly string[]", required: false, category: "Core", description: "Sets the field value when state.value is not supplied. Numbers are converted to strings.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea" } },
    { name: "defaultValue", type: "string | number | readonly string[]", required: false, category: "Core", description: "Sets the initial uncontrolled value used when neither state.value nor value is supplied.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea" } },
    { name: "disabled", type: "boolean", required: false, category: "Core", description: "Disables the native textarea, removes the resize handle, and applies disabled styling.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled" } },
    { name: "readOnly", type: "boolean", required: false, category: "Core", description: "Blocks editing while the field stays focusable and selectable.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly" } },
    { name: "rows", type: "number", required: false, category: "Core", description: "Sets the native visible row count. The size preset still supplies a minimum height, so rows only grows the field beyond that minimum.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows" } },
    { name: "placeholder", type: "string", required: false, category: "Content", description: "Displays placeholder text while the field is empty.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder" } },
    { name: "onChange", type: "React.ChangeEventHandler<HTMLTextAreaElement>", required: false, category: "Events", description: "Runs after the value changes. When maxCharacters truncates the input, the event is forwarded carrying the truncated value.", tags: { mdn: "https://react.dev/reference/react-dom/components/textarea#onchange" } },
    { name: "onFocus", type: "React.FocusEventHandler<HTMLTextAreaElement>", required: false, category: "Events", description: "Runs when the native textarea receives focus, alongside the internal focus-state tracking.", tags: { mdn: "https://react.dev/reference/react-dom/components/common#onfocus" } },
    { name: "onBlur", type: "React.FocusEventHandler<HTMLTextAreaElement>", required: false, category: "Events", description: "Runs when the native textarea loses focus, alongside the internal focus-state tracking.", tags: { mdn: "https://react.dev/reference/react-dom/components/common#onblur" } },
    { name: "className", type: "string", required: false, category: "Styling", description: "Adds conventional classes to the root wrapper, after the component and size classes and before the resolved styles.root class.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Element/className" } },
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies native inline styles to the root wrapper. Use styles.field for inline-free class overrides on the textarea itself.", tags: { mdn: "https://react.dev/reference/react-dom/components/common#style" } },
    { name: "name", type: "string", required: false, category: "Forms", description: "Names the native textarea for form submission.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/name" } },
    { name: "required", type: "boolean", required: false, category: "Forms", description: "Requires a value before a containing form can submit.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required" } },
    { name: "maxLength", type: "number", required: false, category: "Forms", description: "Applies the native length limit. Use maxCharacters instead when the character count should render and truncation should reach onChange.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength" } },
    { name: "autoComplete", type: "string", required: false, category: "Forms", description: "Supplies the browser autocomplete hint for the native textarea.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete" } },
    { name: "aria-label", type: "string", required: false, category: "Accessibility", description: "Provides an accessible name when no associated label supplies one.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" } },
    { name: "aria-labelledby", type: "string", required: false, category: "Accessibility", description: "References elements that label the native textarea.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" } },
    { name: "aria-describedby", type: "string", required: false, category: "Accessibility", description: "References elements that describe the native textarea, such as a hint or the character count.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" } },
    { name: "autoFocus", type: "boolean", required: false, category: "Accessibility", description: "Requests focus for the native textarea after it mounts.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus" } },
  ];

  const inheritedNames = new Set(inheritedProps.map((prop) => prop.name));
  const props = [...api.props.filter((prop) => !inheritedNames.has(prop.name)), ...inheritedProps];

  return {
    ...api,
    props: props.map((prop) => ({
      ...prop,
      typeTokens: tokenizeType(prop.type, Object.keys(customTypes)),
      ...(optionsByProp[prop.name]?.length ? { enumValueDetails: optionsByProp[prop.name] } : {}),
    })),
    propGroups: [
      { name: "Core" },
      { name: "Content" },
      { name: "Events" },
      { name: "Styling" },
      { name: "Forms" },
      { name: "Accessibility" },
    ],
    stateAttributes: [
      { name: "data-slot", description: "Stable anatomy identity on the root, surface, scroll wrapper, field, resize handle, and character count.", values: ["root", "surface", "scroll", "field", "resizeHandle.both", "resizeHandle.x", "resizeHandle.y", "characterCount"] },
      { name: "data-size", description: "The resolved size preset, published on the root and the field.", values: ["sm", "md", "lg"] },
      { name: "data-resize", description: "The resolved resize axis, published on the root, the surface, and the field. A disabled TextArea always reports none.", values: ["none", "x", "y", "both"] },
      { name: "data-scroll", description: "The field is wrapped in the capped scroll surface because maxHeight is set; the attribute is omitted otherwise.", values: ["true"] },
      { name: "data-disabled", description: "The TextArea is disabled; the attribute is omitted otherwise.", values: ["true"] },
      { name: "data-error", description: "The error prop is set or the value exceeds maxCharacters; the attribute is omitted otherwise.", values: ["true"] },
      { name: "data-focused", description: "The field has focus; the attribute is omitted otherwise.", values: ["true"] },
      { name: "data-focus-visible", description: "The field has keyboard-visible focus; the attribute is omitted otherwise.", values: ["true"] },
      { name: "data-over-limit", description: "Set on the character count while the value exceeds maxCharacters; the attribute is omitted otherwise.", values: ["true"] },
      { name: "data-textarea-focus-surface", description: "Marks the element the shared focus indicator measures: the scroll wrapper when maxHeight is set, otherwise the field.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks TextArea's local shared focus indicator element.", values: ["local"] },
      { name: "data-ring", description: "Marks the local focus indicator element.", values: ["true"] },
      { name: "data-visible", description: "The local focus indicator is visible for keyboard focus; the attribute is omitted while hidden.", values: ["true"] },
    ],
    customTypes,
  };
}

function enrichSelectAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."],
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
        { name: "className", type: "Style", required: false, description: "Classes applied to the slot element." },
        { name: "style", type: "SlotStyleObject", required: false, description: "Inline CSS properties applied to the slot element." },
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
      summary: "Registered option data used for navigation, filtering, and Select.Value render functions.",
      type: "{ key: Key; textValue: string; isDisabled?: boolean; icon?: React.ReactNode }",
      kind: "interface",
      members: [
        { name: "key", type: "Key", required: true, description: "The option's value, used for selection and focus tracking." },
        { name: "textValue", type: "string", required: true, description: "Text used for the trigger label and for search matching." },
        { name: "isDisabled", type: "boolean", required: false, description: "Whether the option rejects selection and keyboard focus." },
        { name: "icon", type: "React.ReactNode", required: false, description: "Icon content registered alongside the option." },
      ],
      notes: ["Select.Item children register this data automatically; the items prop supplies it directly."],
    },
    SelectMode: {
      name: "SelectMode",
      summary: "Selection behavior for the Select root.",
      type: '"single" | "multiple"',
      kind: "alias",
      notes: ["Multiple mode renders a checkbox in every option and marks the panel aria-multiselectable."],
      values: [
        { value: "single", description: "Selecting an option replaces the current value and the panel closes." },
        { value: "multiple", description: "Selecting an option toggles it in the current value set and the panel stays open." },
      ],
    },
    SelectTriggerMode: {
      name: "SelectTriggerMode",
      summary: "How a Select trigger opens its option panel.",
      type: '"click" | "hover"',
      kind: "alias",
      notes: ["Hover mode opens on pointer entry and closes shortly after the pointer leaves the trigger and panel."],
      values: [
        { value: "click", description: "The panel opens when the trigger is clicked or activated by keyboard." },
        { value: "hover", description: "The panel opens on pointer entry and closes shortly after the pointer leaves the trigger and panel." },
      ],
    },
    SelectState: {
      name: "SelectState",
      summary: "Controlled selection and open state supplied to Select.",
      type: "{ value?: Key | Key[]; open?: boolean }",
      kind: "interface",
      members: [
        { name: "value", type: "Key | Key[]", required: false, description: "Selected key in single mode or selected keys in multiple mode." },
        { name: "open", type: "boolean", required: false, description: "Whether the option panel is open." },
      ],
      notes: ["Values supplied here take precedence over value, selectedKey, selectedKeys, and open."],
    },
    SelectStyleSlots: {
      name: "SelectStyleSlots",
      summary: "Named style slot for the Select root.",
      type: "{ root?: SlotStyle }",
      kind: "interface",
      members: [
        { name: "root", type: "SlotStyle", required: false, description: "Styles the root wrapper; its inline style is also copied onto the portalled content overlay." },
      ],
      notes: ["A class supplied here does not reach the portalled overlay because the overlay is not a descendant of the root."],
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
      notes: ["The value is published on the Select root as a global class and as data-variant, so themes can restyle the whole surface."],
    },
    SelectTriggerIconSlots: {
      name: "SelectTriggerIconSlots",
      summary: "Icon content rendered at either edge of the trigger.",
      type: "{ prefix?: React.ReactNode; chevron?: React.ReactNode }",
      kind: "interface",
      members: [
        { name: "prefix", type: "React.ReactNode", required: false, description: "Content rendered before the trigger value, in the icon.left slot." },
        { name: "chevron", type: "React.ReactNode", required: false, description: "Content replacing the default chevron, in the icon.right slot." },
      ],
      notes: ["icon.chevron takes precedence over the standalone chevron prop."],
    },
    SelectTriggerIconStyles: {
      name: "SelectTriggerIconStyles",
      summary: "Styles for the individual trigger icon parts.",
      type: "{ left?: Style; right?: Style; section?: Style }",
      kind: "interface",
      members: [
        { name: "left", type: "Style", required: false, description: "Styles the prefix icon wrapper rendered before the trigger value." },
        { name: "right", type: "Style", required: false, description: "Styles the chevron wrapper rendered inside the icon section." },
        { name: "section", type: "Style", required: false, description: "Styles the section that holds the trailing chevron." },
      ],
    },
    SelectTriggerStyleSlots: {
      name: "SelectTriggerStyleSlots",
      summary: "Named style slots for the Select.Trigger anatomy.",
      type: "{ root?: Style; value?: Style; icon?: Style | SelectTriggerIconStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the trigger button." },
        { name: "value", type: "Style", required: false, description: "Styles the trigger value section." },
        { name: "icon", type: "Style | SelectTriggerIconStyles", required: false, description: "Styles every icon part, or individually styles icon.left, icon.right, and icon.section." },
      ],
      notes: ["A single class supplied to icon is applied to icon.left, icon.right, and icon.section."],
    },
    SelectTriggerStylesProp: {
      name: "SelectTriggerStylesProp",
      summary: "Class-based style overrides for Select.Trigger's root and named anatomy slots.",
      type: "StylesProp<SelectTriggerStyleSlots>",
      kind: "alias",
      notes: ["Nested slot objects address dotted anatomy paths such as icon.left and icon.section."],
    },
    SearchableTriggerIconStyles: {
      name: "SearchableTriggerIconStyles",
      summary: "Styles for the individual searchable trigger icon parts.",
      type: "{ right?: Style; section?: Style }",
      kind: "interface",
      members: [
        { name: "right", type: "Style", required: false, description: "Styles the chevron wrapper." },
        { name: "section", type: "Style", required: false, description: "Styles the section that holds the chevron." },
      ],
    },
    SearchableTriggerStyleSlots: {
      name: "SearchableTriggerStyleSlots",
      summary: "Named style slots for the Select.SearchableTrigger anatomy.",
      type: "{ root?: Style; value?: Style; input?: Style; icon?: Style | SearchableTriggerIconStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the searchable trigger wrapper." },
        { name: "value", type: "Style", required: false, description: "Styles the section that holds the search input." },
        { name: "input", type: "Style", required: false, description: "Styles the search input surface." },
        { name: "icon", type: "Style | SearchableTriggerIconStyles", required: false, description: "Styles every icon part, or individually styles icon.right and icon.section." },
      ],
    },
    SearchableTriggerStylesProp: {
      name: "SearchableTriggerStylesProp",
      summary: "Class-based style overrides for Select.SearchableTrigger's root and named anatomy slots.",
      type: "StylesProp<SearchableTriggerStyleSlots>",
      kind: "alias",
    },
    SelectContentSearchStyles: {
      name: "SelectContentSearchStyles",
      summary: "Styles for the search anatomy rendered inside searchable content.",
      type: "{ wrapper?: SlotStyle; input?: SlotStyle }",
      kind: "interface",
      members: [
        { name: "wrapper", type: "SlotStyle", required: false, description: "Styles the wrapper around the panel search input." },
        { name: "input", type: "SlotStyle", required: false, description: "Styles the panel search input surface." },
      ],
    },
    SelectContentListStyles: {
      name: "SelectContentListStyles",
      summary: "Styles for the option-list anatomy rendered inside the panel.",
      type: "{ root?: SlotStyle; padding?: SlotStyle }",
      kind: "interface",
      members: [
        { name: "root", type: "SlotStyle", required: false, description: "Styles the element that groups the rendered options." },
        { name: "padding", type: "SlotStyle", required: false, description: "Styles the padding wrapper around the option list." },
      ],
    },
    SelectContentStyleSlots: {
      name: "SelectContentStyleSlots",
      summary: "Named style slots for the Select.Content anatomy.",
      type: "{ root?: SlotStyle; overlay?: SlotStyle; search?: SelectContentSearchStyles; empty?: SlotStyle; list?: SelectContentListStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "SlotStyle", required: false, description: "Styles the listbox panel." },
        { name: "overlay", type: "SlotStyle", required: false, description: "Styles the positioned floating overlay." },
        { name: "search", type: "SelectContentSearchStyles", required: false, description: "Styles the search.wrapper and search.input anatomy." },
        { name: "empty", type: "SlotStyle", required: false, description: "Styles the live empty-results message." },
        { name: "list", type: "SelectContentListStyles", required: false, description: "Styles the list.root and list.padding anatomy." },
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
      summary: "Static value content, or a function that renders from the selected registered item.",
      type: "((selectedItem: SelectItemData | null) => React.ReactNode) | React.ReactNode",
      kind: "alias",
      examples: ["<Select.Value>{(item) => item?.textValue ?? \"None\"}</Select.Value>"],
      notes: ["The function receives null until an option is selected and registered."],
    },
    SelectValueStyleSlots: {
      name: "SelectValueStyleSlots",
      summary: "Named style slots for the Select.Value anatomy.",
      type: "{ root?: Style; icon?: Style; text?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the value wrapper." },
        { name: "icon", type: "Style", required: false, description: "Styles the icon wrapper rendered before the value text." },
        { name: "text", type: "Style", required: false, description: "Styles the rendered value text." },
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
        { name: "icon", type: "Style", required: false, description: "Styles the leading icon wrapper." },
        { name: "content", type: "Style", required: false, description: "Styles the wrapper that stacks the label above a description." },
        { name: "text", type: "Style", required: false, description: "Styles the primary option text." },
        { name: "description", type: "Style", required: false, description: "Styles the secondary description text." },
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
        { name: "title", type: "Style", required: false, description: "Styles the optional visible title above the grouped options." },
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
        { name: "root", type: "Style", required: false, description: "Styles the separator element." },
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
        { name: "right", type: "Style", required: false, description: "Styles the right-pointing submenu indicator." },
      ],
    },
    SelectSubTriggerStyleSlots: {
      name: "SelectSubTriggerStyleSlots",
      summary: "Named style slots for the Select.SubTrigger anatomy.",
      type: "{ root?: Style; icon?: Style | SelectSubTriggerIconStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the submenu trigger option row." },
        { name: "icon", type: "Style | SelectSubTriggerIconStyles", required: false, description: "Styles every icon part, or individually styles icon.right." },
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
        { name: "root", type: "Style", required: false, description: "Styles the element that groups the rendered submenu options." },
        { name: "padding", type: "Style", required: false, description: "Styles the padding wrapper around the submenu option list." },
      ],
    },
    SelectSubContentStyleSlots: {
      name: "SelectSubContentStyleSlots",
      summary: "Named style slots for the Select.SubContent anatomy.",
      type: "{ root?: Style; overlay?: Style; scroller?: Style; list?: Style | SelectSubContentListStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the submenu listbox panel." },
        { name: "overlay", type: "Style", required: false, description: "Styles the positioned submenu overlay." },
        { name: "scroller", type: "Style", required: false, description: "Styles the scrollable surface that constrains the submenu height." },
        { name: "list", type: "Style | SelectSubContentListStyles", required: false, description: "Styles every list part, or individually styles list.root and list.padding." },
      ],
    },
    SelectSubContentStylesProp: {
      name: "SelectSubContentStylesProp",
      summary: "Class-based style overrides for Select.SubContent's root and named anatomy slots.",
      type: "StylesProp<SelectSubContentStyleSlots>",
      kind: "alias",
    },
  };

  const rootInheritedProps: PropDefinition[] = [
    { name: "children", type: "React.ReactNode", required: false, category: "Content", description: "Composes the Select from a trigger, panel content, and optional external Select.Value segments.", tags: { mdn: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" } },
    { name: "style", type: "React.CSSProperties", required: false, category: "Styling", description: "Applies native inline styles to the root wrapper, taking precedence over the resolved styles.root inline style.", tags: { mdn: "https://react.dev/reference/react-dom/components/common#style" } },
    { name: "id", type: "string", required: false, category: "Advanced", description: "Sets the id of the root wrapper. The floating panel keeps its own generated id for aria-controls.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/id" } },
  ];

  const triggerInheritedProps: PropDefinition[] = [
    { name: "children", type: "React.ReactNode", required: false, category: "Content", description: "Replaces the default trigger label. Plain text is wrapped in a truncating span inside the value section.", tags: { mdn: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" } },
    { name: "aria-label", type: "string", required: false, category: "Accessibility", description: "Names the trigger when its visible content does not, which matters for icon-only or value-only triggers.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label" } },
    { name: "aria-labelledby", type: "string", required: false, category: "Accessibility", description: "References the elements that label the trigger.", tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby" } },
    { name: "onKeyDown", type: "React.KeyboardEventHandler<HTMLButtonElement>", required: false, category: "Events", description: "Runs before Select's own key handling, which stays installed through mergeProps.", tags: { see: "https://react-spectrum.adobe.com/react-aria/useButton.html" } },
  ];

  const withInherited = (props: PropDefinition[], inherited: PropDefinition[]) => [
    ...props.filter((prop) => !inherited.some((entry) => entry.name === prop.name)),
    ...inherited,
  ];

  const enrichProps = (props: PropDefinition[]) => props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }

  const subComponents = api.subComponents
    ? Object.fromEntries(
        Object.entries(api.subComponents)
          // SelectContext is an internal composition detail, not a public subcomponent.
          .filter(([name]) => name.startsWith("Select."))
          .map(([name, component]) => [
            name,
            {
              ...component,
              props: enrichProps(
                name === "Select.Trigger"
                  ? withInherited(component.props, triggerInheritedProps)
                  : component.props,
              ),
            },
          ]),
      )
    : undefined;

  return {
    ...api,
    props: enrichProps(withInherited(api.props, rootInheritedProps)),
    subComponents,
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
      { name: "data-slot", description: "Stable styling identity for the root or a named Select anatomy part. Option rows keep List's item identity instead of a Select slot name.", values: ["root", "overlay", "value", "input", "icon.left", "icon.right", "icon.section", "search.wrapper", "empty", "list.root", "list.padding", "title", "icon", "content", "text", "description", "item"] },
      { name: "data-mode", description: "The configured selection mode, emitted on the Select root.", values: ["single", "multiple"] },
      { name: "data-variant", description: "The Select.Trigger variant published on the Select root; omitted when the trigger sets no variant.", values: ["ghost"] },
      { name: "data-disabled", description: "The root, trigger, or option is disabled. It is omitted while enabled.", values: ["true"] },
      { name: "data-open", description: "The button trigger, searchable trigger, or submenu trigger is open.", values: ["true", "false"] },
      { name: "data-state", description: "A floating panel or submenu panel is open or closed while it is mounted.", values: ["open", "closed"] },
      { name: "data-placement", description: "The resolved floating side of the panel, the submenu panel, or the searchable trigger.", values: ["top", "bottom", "left", "right"] },
      { name: "data-selected", description: "An option is selected; it is omitted while unselected.", values: ["true"] },
      { name: "data-highlighted", description: "An option or submenu trigger is the current keyboard or pointer navigation target.", values: ["true", "false"] },
      { name: "data-focused", description: "The root or trigger has focus, or an option is the navigation focus target.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "The root or trigger has keyboard-visible focus.", values: ["true", "false"] },
      { name: "data-pressed", description: "The button trigger is currently pressed.", values: ["true", "false"] },
      { name: "data-hovered", description: "The pointer is over the button trigger.", values: ["true", "false"] },
      { name: "data-external", description: "A Select.Value rendered beside the trigger is the label segment of a split Select.", values: ["true"] },
      { name: "data-value", description: "The option's registered key, emitted on the option row." },
      { name: "data-select-focus-surface", description: "Marks the root as the visual focus surface used by Select's local focus indicator.", values: ["true"] },
      { name: "data-focus-indicator", description: "Marks Select's local shared focus indicator element.", values: ["local"] },
      { name: "data-ring", description: "Marks the local focus indicator element.", values: ["true"] },
      { name: "data-self-target", description: "Marks the local focus indicator as drawing on the Select root itself.", values: ["true"] },
      { name: "data-visible", description: "The local focus indicator is visible for keyboard focus; it is omitted while hidden.", values: ["true"] },
      { name: "data-select-submenu-content", description: "Marks a portalled submenu panel so outside-press dismissal treats it as inside the Select.", values: ["true"] },
    ],
    customTypes,
  };
}

function shouldHideLegacySlotClassNameProp(prop: PropDefinition, hasStylesProp: boolean): boolean {
  if (!hasStylesProp) return false;
  if (prop.name === "className") return false;
  return /.+ClassName$/.test(prop.name);
}

function normalizeExtractedProps(props: PropDefinition[]): PropDefinition[] {
  const hasStylesProp = props.some((prop) => prop.name === "styles");

  return props.filter((prop) => !shouldHideLegacySlotClassNameProp(prop, hasStylesProp));
}

function getComponentFiles(componentDirName: string): string[] {
  const componentDir = path.join(COMPONENTS_DIR, componentDirName);
  if (!fs.existsSync(componentDir)) return [];

  const mainFileName = `${componentDirName}.tsx`;
  return fs
    .readdirSync(componentDir)
    .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
    .sort((a, b) => {
      // Main component file first so allDocs[0] is always the root component
      if (a === mainFileName) return -1;
      if (b === mainFileName) return 1;
      return a.localeCompare(b);
    })
    .map((f) => path.join(componentDir, f));
}

function extractComponentAPI(componentDirName: string): ComponentAPI | null {
  const files = getComponentFiles(componentDirName);
  if (files.length === 0) return null;

  const allDocs: ComponentDoc[] = [];
  for (const file of files) {
    try {
      const docs = parser.parse(file);
      allDocs.push(...docs);
    } catch (e) {
      console.warn(`Failed to parse ${file}:`, e);
    }
  }

  if (allDocs.length === 0) return null;

  // Prefer the doc whose displayName matches the component directory name (e.g. "Modal" for Modal dir)
  const mainDoc = allDocs.find((d) => d.displayName === componentDirName) || allDocs[0];
  const mainProps = normalizeExtractedProps(extractPropsFromDoc(mainDoc));

  const subComponents: Record<string, { description?: string; props: PropDefinition[] }> = {};
  for (const doc of allDocs) {
    if (doc.displayName && doc.displayName !== mainDoc.displayName) {
      subComponents[doc.displayName] = {
        description: doc.description || undefined,
        props: normalizeExtractedProps(extractPropsFromDoc(doc)),
      };
    }
  }

  const api: ComponentAPI = {
    props: mainProps,
    subComponents: Object.keys(subComponents).length > 0 ? subComponents : undefined,
  };

  if (componentDirName === "Button") return enrichButtonAPI(api);
  if (componentDirName === "Color") return enrichColorAPI(api);
  if (componentDirName === "Expand") return enrichExpandAPI(api);
  if (componentDirName === "Command") return enrichCommandAPI(api);
  if (componentDirName === "List") return enrichListAPI(api);
  if (componentDirName === "Input") return enrichInputAPI(api);
  if (componentDirName === "Select") return enrichSelectAPI(api);
  if (componentDirName === "Progress") return enrichProgressAPI(api);
  if (componentDirName === "Slider") return enrichSliderAPI(api);
  if (componentDirName === "Switch") return enrichSwitchAPI(api);
  if (componentDirName === "Checkbox") return enrichCheckboxAPI(api);
  if (componentDirName === "Divider") return enrichDividerAPI(api);
  if (componentDirName === "Group") return enrichGroupAPI(api);
  if (componentDirName === "Path") return enrichPathAPI(api);
  if (componentDirName === "Anchor") return enrichAnchorAPI(api);
  if (componentDirName === "Menu") return enrichMenuAPI(api);
  if (componentDirName === "Textarea") return enrichTextAreaAPI(api);
  return api;
}

export function extractAllComponentAPIs(componentDirNames: string[]): Record<string, ComponentAPI> {
  const result: Record<string, ComponentAPI> = {};
  let cache = loadApiCache();

  const cachedCount = Object.keys(cache.files).length;
  if (cachedCount > 0) {
    console.log(`Loaded API cache with ${cachedCount} entries`);
  }

  let parsedCount = 0;
  let cacheHitCount = 0;

  for (const dirName of componentDirNames) {
    const kebabId = toKebabCase(dirName);

    // Try to get cached API first
    const cachedAPI = getCachedAPI(dirName, cache, COMPONENTS_DIR);
    if (cachedAPI !== null) {
      result[kebabId] = cachedAPI;
      cacheHitCount++;
    } else {
      // Parse and cache
      const api = extractComponentAPI(dirName);
      if (api) {
        result[kebabId] = api;
        cache = updateCacheEntry(dirName, cache, api, COMPONENTS_DIR);
        parsedCount++;
      } else {
        // Component parse failed, cache null result
        cache = updateCacheEntry(dirName, cache, null, COMPONENTS_DIR);
      }
    }

    if (dirName === "Button" && result[kebabId]) {
      result[kebabId] = enrichButtonAPI(result[kebabId]);
    }
    if (dirName === "Color" && result[kebabId]) {
      result[kebabId] = enrichColorAPI(result[kebabId]);
    }
    if (dirName === "Expand" && result[kebabId]) {
      result[kebabId] = enrichExpandAPI(result[kebabId]);
    }
    if (dirName === "Command" && result[kebabId]) {
      result[kebabId] = enrichCommandAPI(result[kebabId]);
    }
    if (dirName === "List" && result[kebabId]) {
      result[kebabId] = enrichListAPI(result[kebabId]);
    }
    if (dirName === "Input" && result[kebabId]) {
      result[kebabId] = enrichInputAPI(result[kebabId]);
    }
    if (dirName === "Select" && result[kebabId]) {
      result[kebabId] = enrichSelectAPI(result[kebabId]);
    }
    if (dirName === "Progress" && result[kebabId]) {
      result[kebabId] = enrichProgressAPI(result[kebabId]);
    }
    if (dirName === "Slider" && result[kebabId]) {
      result[kebabId] = enrichSliderAPI(result[kebabId]);
    }
    if (dirName === "Switch" && result[kebabId]) {
      result[kebabId] = enrichSwitchAPI(result[kebabId]);
    }
    if (dirName === "Checkbox" && result[kebabId]) {
      result[kebabId] = enrichCheckboxAPI(result[kebabId]);
    }
    if (dirName === "Divider" && result[kebabId]) {
      result[kebabId] = enrichDividerAPI(result[kebabId]);
    }
    if (dirName === "Group" && result[kebabId]) {
      result[kebabId] = enrichGroupAPI(result[kebabId]);
    }
    if (dirName === "Path" && result[kebabId]) {
      result[kebabId] = enrichPathAPI(result[kebabId]);
    }
    if (dirName === "Anchor" && result[kebabId]) {
      result[kebabId] = enrichAnchorAPI(result[kebabId]);
    }
    if (dirName === "Textarea" && result[kebabId]) {
      result[kebabId] = enrichTextAreaAPI(result[kebabId]);
    }
    if (result[kebabId]) result[kebabId] = enrichTypeTokens(result[kebabId]);

    // Add examples from registry metadata
    const metadata = componentRegistry[kebabId];
    if (metadata?.examples && result[kebabId]) {
      result[kebabId].examples = metadata.examples;
    }
  }

  // Prune cache entries for deleted components
  cache = pruneCache(cache, COMPONENTS_DIR);

  // Save updated cache
  saveApiCache(cache);

  console.log(
    `Cache: ${cacheHitCount} hits, ${parsedCount} parsed, total ${Object.keys(result).length} components`,
  );

  return result;
}
