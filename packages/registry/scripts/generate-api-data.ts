import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { withCustomConfig, type ComponentDoc, type PropItem } from "react-docgen-typescript";
import type { APITypeToken, PropDefinition, ComponentAPI } from "../src/types";
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
      type: "{ root?: SlotStyle; icon?: SlotStyle | ButtonIconStyles; hint?: SlotStyle }",
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
          type: "SlotStyle | ButtonIconStyles",
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
    HintValue: {
      name: "HintValue",
      summary: "Content displayed as a compact button hint or keyboard shortcut.",
      type: "React.ReactNode | React.ReactNode[]",
      kind: "alias",
      examples: ['hint="Esc"', 'hint={["Ctrl", "K"]}'],
      notes: ["Arrays render as shortcut segments joined by a plus divider."],
    },
  };

  return {
    ...api,
    props: api.props.map((prop) => ({
      ...prop,
      typeTokens: tokenizeType(prop.type, Object.keys(customTypes)),
    })),
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
    },
    SliderState: {
      name: "SliderState",
      summary: "Controlled values supplied through Slider's state object.",
      type: "{ value?: number | number[] }",
      kind: "interface",
      members: [
        { name: "value", type: "number | number[]", required: false, description: "Current value for a single thumb or ordered values for multiple thumbs." },
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
  const enrichProps = (props: PropDefinition[]) => props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }
  return {
    ...api,
    props: enrichProps(api.props),
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
      { name: "data-focus-indicator", description: "Marks the track's local focus indicator.", values: ["track"] },
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
      type: "{ root?: Style; track?: Style; thumb?: Style }",
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
      name: "defaultChecked",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Initial checked value for uncontrolled usage when neither controlled value is supplied.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#checked" },
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description: "Classes applied to the outer switch surface after its default classes.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description: "Inline CSS properties applied to the outer switch surface.",
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
      description: "ID for the native input. Checkbox uses it to associate a rendered label and helper text.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/id" },
    },
    {
      name: "autoFocus",
      type: "boolean",
      required: false,
      category: "Accessibility",
      description: "Requests focus for the native checkbox when it mounts.",
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
      description: "Marks the native input invalid. A value of true also activates Checkbox invalid styling.",
      tags: { mdn: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid" },
    },
  ];
  const props = [...api.props.filter((prop) => !inheritedProps.some((inherited) => inherited.name === prop.name)), ...inheritedProps];
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
      { name: "data-focused", description: "The native switch input is focused.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "The switch input has keyboard-visible focus.", values: ["true", "false"] },
      { name: "data-size", description: "The configured switch size.", values: ["default", "sm"] },
      { name: "data-slot", description: "Stable styling identity emitted as root, track, or thumb on the matching anatomy element.", values: ["root", "track", "thumb"] },
      { name: "data-switch-focus-surface", description: "Marks the root as the visual focus surface for the native switch input.", values: ["true"] },
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
    },
    ListGap: {
      name: "ListGap",
      summary: "Named gap step between direct List.Item children.",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      kind: "alias",
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
    },
    SelectTriggerMode: {
      name: "SelectTriggerMode",
      summary: "How a Select trigger opens its option panel.",
      type: '"click" | "hover"',
      kind: "alias",
      notes: ["Hover mode opens on pointer entry and closes shortly after the pointer leaves the trigger and panel."],
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
  if (componentDirName === "Command") return enrichCommandAPI(api);
  if (componentDirName === "List") return enrichListAPI(api);
  if (componentDirName === "Input") return enrichInputAPI(api);
  if (componentDirName === "Select") return enrichSelectAPI(api);
  if (componentDirName === "Progress") return enrichProgressAPI(api);
  if (componentDirName === "Slider") return enrichSliderAPI(api);
  if (componentDirName === "Switch") return enrichSwitchAPI(api);
  if (componentDirName === "Checkbox") return enrichCheckboxAPI(api);
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
