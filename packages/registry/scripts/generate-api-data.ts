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
      type: "{ root?: Style; overlay?: Style; search?: Style; input?: Style; inner?: Style; list?: Style; empty?: Style; item?: Style | CommandItemStyles; hint?: Style; category?: Style; footer?: Style; groups?: Style; group?: Style }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles applied to the command surface." },
        { name: "overlay", type: "Style", required: false, description: "Styles applied to the modal backdrop in floating mode." },
        { name: "search", type: "Style", required: false, description: "Styles applied to the search input wrapper." },
        { name: "input", type: "Style", required: false, description: "Styles applied to the search input root." },
        { name: "inner", type: "Style", required: false, description: "Styles applied to the framed list container." },
        { name: "list", type: "Style", required: false, description: "Styles applied to the scrollable command list." },
        { name: "empty", type: "Style", required: false, description: "Styles applied to the empty-state message." },
        { name: "item", type: "Style | CommandItemStyles", required: false, description: "Shared item styles or separate root, content, and icon styles." },
        { name: "hint", type: "Style", required: false, description: "Styles applied to item hint badges." },
        { name: "category", type: "Style", required: false, description: "Styles applied to category headers." },
        { name: "footer", type: "Style", required: false, description: "Styles applied to the command footer." },
        { name: "groups", type: "Style", required: false, description: "Styles applied to the Command.Groups container." },
        { name: "group", type: "Style", required: false, description: "Styles applied to each group rendered by Command.Groups." },
      ],
      notes: ["The item slot accepts one shared Style or a CommandItemStyles object with root, content, and icon members."],
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
  };
}

function enrichInputAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
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
    InputStyleSlots: {
      name: "InputStyleSlots",
      summary: "Named style slots for the Input anatomy.",
      type: "{ root?: Style; input?: Style; startAdornments?: Style; endAdornments?: Style; icon?: Style | InputIconStyles; actions?: Style | InputActionStyles; hint?: Style; controls?: Style; stepper?: Style | InputStepperStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "Style", required: false, description: "Styles the visual input surface." },
        { name: "input", type: "Style", required: false, description: "Styles the native input or custom input content surface." },
        { name: "startAdornments", type: "Style", required: false, description: "Styles the wrapper for leading icons and actions." },
        { name: "endAdornments", type: "Style", required: false, description: "Styles the wrapper for trailing icons, actions, hints, and steppers." },
        { name: "icon", type: "Style | InputIconStyles", required: false, description: "Styles one or both icon wrappers." },
        { name: "actions", type: "Style | InputActionStyles", required: false, description: "Styles one or both actions wrappers." },
        { name: "hint", type: "Style", required: false, description: "Styles the hint content." },
        { name: "controls", type: "Style", required: false, description: "Styles the number-input controls wrapper." },
        { name: "stepper", type: "Style | InputStepperStyles", required: false, description: "Styles one or both number-input stepper buttons." },
      ],
    },
  };

  return {
    ...api,
    props: api.props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) })),
    propGroups: [{ name: "Core" }, { name: "Content" }, { name: "Events" }, { name: "Styling" }, { name: "Forms" }, { name: "Accessibility" }, { name: "Advanced" }],
    stateAttributes: [
      { name: "data-focused", description: "The input or its custom content has focus.", values: ["true"] },
      { name: "data-focus-visible", description: "The input has keyboard-visible focus.", values: ["true"] },
      { name: "data-disabled", description: "The input is disabled.", values: ["true"] },
      { name: "data-error", description: "The input displays error styling.", values: ["true"] },
      { name: "data-variant", description: "The resolved variant name." },
    ],
    customTypes,
  };
}

function enrichSelectAPI(api: ComponentAPI): ComponentAPI {
  const customTypes: NonNullable<ComponentAPI["customTypes"]> = {
    Style: { name: "Style", summary: "Class names accepted by class-based style slots.", type: "string | (string | false | null | undefined)[]", kind: "alias", notes: ["Array entries support conditional classes; false, null, and undefined entries are ignored."] },
    SlotStyleObject: { name: "SlotStyleObject", summary: "Inline CSS properties accepted by a style slot.", type: "React.CSSProperties", kind: "alias" },
    SlotStyleProps: { name: "SlotStyleProps", summary: "Object form that supplies className and style to one slot.", type: "{ className?: Style; style?: SlotStyleObject }", kind: "interface", members: [{ name: "className", type: "Style", required: false, description: "Classes applied to the slot element." }, { name: "style", type: "SlotStyleObject", required: false, description: "Inline CSS properties applied to the slot element." }] },
    SlotStyle: { name: "SlotStyle", summary: "A style slot value expressed as classes, inline CSS properties, or both.", type: "Style | SlotStyleObject | SlotStyleProps", kind: "alias", notes: ["A plain object without className or style is treated as inline CSS properties."] },
    SelectMode: { name: "SelectMode", summary: "Selection behavior for the Select root.", type: '"single" | "multiple"', kind: "alias" },
    SelectTriggerMode: { name: "SelectTriggerMode", summary: "How a Select trigger opens its option panel.", type: '"click" | "hover"', kind: "alias", notes: ["Hover mode opens on pointer entry and closes shortly after the pointer leaves the trigger and panel."] },
    SelectState: {
      name: "SelectState", summary: "Controlled selection and open state supplied to Select.", type: "{ value?: Key | Key[]; open?: boolean }", kind: "interface",
      members: [
        { name: "value", type: "Key | Key[]", required: false, description: "Selected key in single mode or selected keys in multiple mode." },
        { name: "open", type: "boolean", required: false, description: "Whether the option panel is open." },
      ],
    },
    SelectStyleSlots: { name: "SelectStyleSlots", summary: "Style override for the Select root.", type: "{ root?: SlotStyle }", kind: "interface", members: [{ name: "root", type: "SlotStyle", required: false, description: "Styles the root wrapper and floating content overlay base style." }] },
    SelectTriggerStyleSlots: { name: "SelectTriggerStyleSlots", summary: "Named styles for Select.Trigger anatomy.", type: "{ root?: Style; value?: Style; icon?: Style | { left?: Style; right?: Style }; iconSection?: Style }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the trigger button." }, { name: "value", type: "Style", required: false, description: "Styles the value section." }, { name: "icon", type: "Style | { left?: Style; right?: Style }", required: false, description: "Styles both icon wrappers or individual icon.left and icon.right slots." }, { name: "iconSection", type: "Style", required: false, description: "Styles the chevron section." }] },
    SearchableTriggerStyleSlots: { name: "SearchableTriggerStyleSlots", summary: "Named styles for the searchable trigger anatomy.", type: "{ root?: Style; valueSection?: Style; input?: Style; iconSection?: Style; icon?: Style }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the wrapper." }, { name: "valueSection", type: "Style", required: false, description: "Styles the input section." }, { name: "input", type: "Style", required: false, description: "Styles the input." }, { name: "iconSection", type: "Style", required: false, description: "Styles the icon section." }, { name: "icon", type: "Style", required: false, description: "Styles the chevron icon." }] },
    SelectContentStyleSlots: { name: "SelectContentStyleSlots", summary: "Named styles for the floating Select content anatomy.", type: "{ root?: SlotStyle; overlay?: SlotStyle; search?: { wrapper?: SlotStyle; input?: SlotStyle }; empty?: SlotStyle; list?: { padding?: SlotStyle } }", kind: "interface", members: [{ name: "root", type: "SlotStyle", required: false, description: "Styles the listbox panel." }, { name: "overlay", type: "SlotStyle", required: false, description: "Styles the positioned overlay." }, { name: "search", type: "{ wrapper?: SlotStyle; input?: SlotStyle }", required: false, description: "Styles search.wrapper and search.input." }, { name: "empty", type: "SlotStyle", required: false, description: "Styles the empty-results message." }, { name: "list", type: "{ padding?: SlotStyle }", required: false, description: "Styles list.padding." }] },
    SelectValueStyleSlots: { name: "SelectValueStyleSlots", summary: "Named styles for the selected-value anatomy.", type: "{ root?: Style; icon?: Style; text?: Style }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the value wrapper." }, { name: "icon", type: "Style", required: false, description: "Styles the value icon." }, { name: "text", type: "Style", required: false, description: "Styles selected text." }] },
    SelectItemStyleSlots: { name: "SelectItemStyleSlots", summary: "Named styles for a selectable option.", type: "{ root?: Style; icon?: Style; content?: Style; text?: Style; description?: Style }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the option." }, { name: "icon", type: "Style", required: false, description: "Styles the leading icon." }, { name: "content", type: "Style", required: false, description: "Styles the description wrapper." }, { name: "text", type: "Style", required: false, description: "Styles the label." }, { name: "description", type: "Style", required: false, description: "Styles secondary content." }] },
    SelectGroupStyleSlots: { name: "SelectGroupStyleSlots", summary: "Named styles for an option group.", type: "{ root?: Style; title?: Style }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the group." }, { name: "title", type: "Style", required: false, description: "Styles the visible title." }] },
    SelectListStyleSlots: { name: "SelectListStyleSlots", summary: "Style override for the list wrapper.", type: "{ root?: Style }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the list wrapper." }] },
    SelectSeparatorStyleSlots: { name: "SelectSeparatorStyleSlots", summary: "Style override for a visual separator.", type: "{ root?: Style }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the separator." }] },
    SelectSubTriggerStyleSlots: { name: "SelectSubTriggerStyleSlots", summary: "Named styles for a submenu trigger option.", type: "{ root?: Style; icon?: Style | { right?: Style } }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the submenu trigger." }, { name: "icon", type: "Style | { right?: Style }", required: false, description: "Styles the chevron or icon.right." }] },
    SelectSubContentStyleSlots: { name: "SelectSubContentStyleSlots", summary: "Named styles for a floating submenu panel.", type: "{ root?: Style; overlay?: Style; list?: Style | { root?: Style; padding?: Style } }", kind: "interface", members: [{ name: "root", type: "Style", required: false, description: "Styles the submenu listbox." }, { name: "overlay", type: "Style", required: false, description: "Styles the positioned overlay." }, { name: "list", type: "Style | { root?: Style; padding?: Style }", required: false, description: "Styles all list descendants or list.root and list.padding." }] },
  };
  const enrichProps = (props: PropDefinition[]) => props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, Object.keys(customTypes)) }));
  for (const customType of Object.values(customTypes)) {
    customType.typeTokens = tokenizeType(customType.type, Object.keys(customTypes));
    if (customType.members) customType.members = enrichProps(customType.members);
  }
  return {
    ...api,
    props: enrichProps(api.props),
    subComponents: api.subComponents ? Object.fromEntries(Object.entries(api.subComponents).map(([name, component]) => [name, { ...component, props: enrichProps(component.props) }])) : undefined,
    propGroups: [{ name: "Core" }, { name: "Content" }, { name: "Events" }, { name: "Styling" }, { name: "Forms" }, { name: "Accessibility" }, { name: "Advanced" }],
    stateAttributes: [
      { name: "data-mode", description: "The configured selection mode.", values: ["single", "multiple"] },
      { name: "data-disabled", description: "The root, trigger, or option is disabled. The root and trigger omit it when enabled; options use \"true\" or \"false\" for selection-related states.", values: ["true"] },
      { name: "data-open", description: "A trigger or submenu trigger is open. Trigger variants persistently emit \"true\" or \"false\"; the searchable trigger omits it when closed.", values: ["true", "false"] },
      { name: "data-state", description: "A floating root or submenu panel is open or closed while it is mounted.", values: ["open", "closed"] },
      { name: "data-placement", description: "The resolved floating panel side.", values: ["top", "bottom", "left", "right"] },
      { name: "data-selected", description: "An option is selected; Select.Item persistently emits \"true\" or \"false\".", values: ["true", "false"] },
      { name: "data-highlighted", description: "An option is the current keyboard or pointer navigation target; item triggers persistently emit \"true\" or \"false\".", values: ["true", "false"] },
      { name: "data-focused", description: "The root or trigger has focus, or an option is the navigation focus target.", values: ["true", "false"] },
      { name: "data-focus-visible", description: "The root or trigger has keyboard-visible focus.", values: ["true", "false"] },
      { name: "data-pressed", description: "The button trigger is currently pressed.", values: ["true", "false"] },
      { name: "data-hovered", description: "The button trigger is hovered.", values: ["true", "false"] },
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
  if (componentDirName === "Input") return enrichInputAPI(api);
  if (componentDirName === "Select") return enrichSelectAPI(api);
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
    if (dirName === "Input" && result[kebabId]) {
      result[kebabId] = enrichInputAPI(result[kebabId]);
    }
    if (dirName === "Select" && result[kebabId]) {
      result[kebabId] = enrichSelectAPI(result[kebabId]);
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
