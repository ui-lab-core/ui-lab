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
  number: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
  string: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
};

function tokenizeType(type: string, customTypes: string[] = []): APITypeToken[] {
  return type.split(/(\s*\|\s*)/).map((text) => {
    const symbol = text.trim();
    if (!symbol || symbol === "|") return { text };
    const customType = customTypes.find(
      (name) =>
        symbol === name ||
        symbol === `${name}[]` ||
        symbol === `Array<${name}>` ||
        symbol === `ReadonlyArray<${name}>`,
    );
    if (customType) return { text, customType };
    return { text, href: TYPE_LINKS[symbol] };
  });
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
      type: "{ root?: SlotStyleValue; icon?: SlotStyleValue | ButtonIconStyles; hint?: SlotStyleValue }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "SlotStyleValue",
          required: false,
          description: "Styles applied to the root element.",
        },
        {
          name: "icon",
          type: "SlotStyleValue | ButtonIconStyles",
          required: false,
          description: "Shared or side-specific icon styles.",
        },
        {
          name: "hint",
          type: "SlotStyleValue",
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
      type: "{ root?: StyleValue; overlay?: StyleValue; search?: StyleValue; input?: StyleValue; inner?: StyleValue; list?: StyleValue; empty?: StyleValue; item?: StyleValue | CommandItemStyles; hint?: StyleValue; category?: StyleValue; footer?: StyleValue; groups?: StyleValue; group?: StyleValue }",
      kind: "interface",
      members: [
        { name: "root", type: "StyleValue", required: false, description: "Styles applied to the command surface." },
        { name: "overlay", type: "StyleValue", required: false, description: "Styles applied to the modal backdrop in floating mode." },
        { name: "search", type: "StyleValue", required: false, description: "Styles applied to the search input wrapper." },
        { name: "input", type: "StyleValue", required: false, description: "Styles applied to the search input root." },
        { name: "inner", type: "StyleValue", required: false, description: "Styles applied to the framed list container." },
        { name: "list", type: "StyleValue", required: false, description: "Styles applied to the scrollable command list." },
        { name: "empty", type: "StyleValue", required: false, description: "Styles applied to the empty-state message." },
        { name: "item", type: "StyleValue | CommandItemStyles", required: false, description: "Shared item styles or separate root, content, and icon styles." },
        { name: "hint", type: "StyleValue", required: false, description: "Styles applied to item hint badges." },
        { name: "category", type: "StyleValue", required: false, description: "Styles applied to category headers." },
        { name: "footer", type: "StyleValue", required: false, description: "Styles applied to the command footer." },
        { name: "groups", type: "StyleValue", required: false, description: "Styles applied to the Command.Groups container." },
        { name: "group", type: "StyleValue", required: false, description: "Styles applied to each group rendered by Command.Groups." },
      ],
      notes: ["The item slot accepts one shared StyleValue or a CommandItemStyles object with root, content, and icon members."],
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
      type: "{ root?: StyleValue; input?: StyleValue; startAdornments?: StyleValue; endAdornments?: StyleValue; icon?: StyleValue | InputIconStyles; actions?: StyleValue | InputActionStyles; hint?: StyleValue; controls?: StyleValue; stepper?: StyleValue | InputStepperStyles }",
      kind: "interface",
      members: [
        { name: "root", type: "StyleValue", required: false, description: "Styles the visual input surface." },
        { name: "input", type: "StyleValue", required: false, description: "Styles the native input or custom input content surface." },
        { name: "startAdornments", type: "StyleValue", required: false, description: "Styles the wrapper for leading icons and actions." },
        { name: "endAdornments", type: "StyleValue", required: false, description: "Styles the wrapper for trailing icons, actions, hints, and steppers." },
        { name: "icon", type: "StyleValue | InputIconStyles", required: false, description: "Styles one or both icon wrappers." },
        { name: "actions", type: "StyleValue | InputActionStyles", required: false, description: "Styles one or both actions wrappers." },
        { name: "hint", type: "StyleValue", required: false, description: "Styles the hint content." },
        { name: "controls", type: "StyleValue", required: false, description: "Styles the number-input controls wrapper." },
        { name: "stepper", type: "StyleValue | InputStepperStyles", required: false, description: "Styles one or both number-input stepper buttons." },
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
