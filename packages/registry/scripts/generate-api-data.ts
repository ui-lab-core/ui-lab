import * as path from "path";
import * as fs from "fs";
import ts from "typescript";
import { fileURLToPath } from "url";
import { withCustomConfig, type ComponentDoc, type PropItem } from "react-docgen-typescript";
import type { APITypeToken, PropDefinition, ComponentAPI, ComponentRegistry } from "../src/types";
import { componentRegistry } from "../src/registry.js";
import {
  loadApiCache,
  saveApiCache,
  getCachedAPI,
  updateCacheEntry,
  pruneCache,
} from "./cache-api-data.js";
import { loadComponentEnrichment, applyEnrichment } from "./api-enrichment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.resolve(__dirname, "../../@ui/src/components");

// Keep everyday DOM/event props without emitting hundreds of obscure inherited
// attributes for every component. Only publish them when the type declares them.
const nativeProps = new Set([
  "children", "id", "htmlFor", "className", "style", "role", "tabIndex", "title",
  "name", "value", "defaultValue", "type", "disabled", "required", "readOnly",
  "placeholder", "min", "max", "step", "minLength", "maxLength", "rows", "cols",
  "autoComplete", "autoFocus", "onChange", "onInput", "onSelect", "onClick",
  "onFocus", "onBlur", "onKeyDown", "onKeyUp", "ref",
]);
// Do not repeat the entire React ARIA dictionary on every compound part.
// Explicit component-owned ARIA props still pass the declaration filter below.
const commonAriaProps = new Set(["aria-label", "aria-labelledby", "aria-describedby", "aria-live", "aria-invalid", "aria-busy"]);
const keepNativeProp = (name: string) => nativeProps.has(name) || commonAriaProps.has(name);

const parser = withCustomConfig(path.resolve(__dirname, "../../@ui/tsconfig.json"), {
  savePropValueAsString: true,
  shouldIncludePropTagMap: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop: PropItem) => {
    if (keepNativeProp(prop.name)) return true;
    if (prop.declarations && prop.declarations.length > 0) {
      const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
        return !declaration.fileName.includes("node_modules");
      });
      return Boolean(hasPropAdditionalDescription);
    }
    return true;
  },
});

let typeProgram: ts.Program | undefined;

/** Use declared public prop names, not destructuring aliases inferred by docgen.
 * Also recovers compound parts hidden behind Object.assign/casts.
 */
function getTypeProgram(): ts.Program {
  if (!typeProgram) {
    const configPath = path.resolve(COMPONENTS_DIR, "../../tsconfig.json");
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
    typeProgram = ts.createProgram(parsed.fileNames, parsed.options);
  }
  return typeProgram;
}

/** Runtime export names, including re-exports, from the actual public source entry. */
export function extractPublicExportNames(componentDirName: string): string[] {
  const program = getTypeProgram();
  const source = program.getSourceFile(path.join(COMPONENTS_DIR, componentDirName, "index.ts"));
  if (!source) throw new Error(`Missing public entry for ${componentDirName}`);
  const checker = program.getTypeChecker();
  const module = checker.getSymbolAtLocation(source);
  if (!module) throw new Error(`Invalid public entry for ${componentDirName}`);
  return checker.getExportsOfModule(module).filter((symbol) => {
    const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    return (resolved.flags & ts.SymbolFlags.Value) !== 0;
  }).map((symbol) => symbol.name).sort();
}

function declaredProps(componentDirName: string, interfaceName: string): PropDefinition[] | undefined {
  const program = getTypeProgram();
  const checker = program.getTypeChecker();
  const directory = path.join(COMPONENTS_DIR, componentDirName) + path.sep;
  for (const source of program.getSourceFiles()) {
    if (!source.fileName.startsWith(directory)) continue;
    const declaration = source.statements.find((node) =>
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text === interfaceName,
    );
    if (!declaration) continue;
    const type = checker.getTypeAtLocation(declaration);
    return checker.getPropertiesOfType(type).flatMap((symbol) => {
      const location = symbol.valueDeclaration ?? symbol.declarations?.[0];
      if (!location) return [];
      const inherited = symbol.declarations?.every((node) => node.getSourceFile().fileName.includes("node_modules"));
      if (inherited && !keepNativeProp(symbol.name)) return [];
      return [{
        name: symbol.name,
        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, location), location, ts.TypeFormatFlags.NoTruncation),
        required: !(symbol.flags & ts.SymbolFlags.Optional),
        description: ts.displayPartsToString(symbol.getDocumentationComment(checker)) || undefined,
        inherited: !!inherited,
        category: symbol.name.startsWith("aria-") ? "Accessibility" : undefined,
      }];
    });
  }
  return undefined;
}

function reconcileProps(declared: PropDefinition[], extracted: PropDefinition[]): PropDefinition[] {
  return declared.map((prop) => {
    const existing = extracted.find((entry) => entry.name === prop.name);
    return existing ? { ...prop, ...existing, category: existing.category ?? prop.category } : prop;
  });
}

const TYPE_LINKS: Record<string, string> = {
  boolean:
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
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
  "Awaited",
  "Partial",
  "Required",
  "Readonly",
  "Record",
  "Pick",
  "Omit",
  "Exclude",
  "Extract",
  "NonNullable",
  "Parameters",
  "ConstructorParameters",
  "ReturnType",
  "InstanceType",
  "NoInfer",
  "ThisParameterType",
  "OmitThisParameter",
  "ThisType",
]);

function getTypeLink(symbol: string): string | undefined {
  if (TYPE_LINKS[symbol]) return TYPE_LINKS[symbol];
  if (TYPESCRIPT_UTILITY_TYPES.has(symbol)) {
    return "https://www.typescriptlang.org/docs/handbook/utility-types.html";
  }

  const reactType = symbol.replace(/^React\./, "");
  if (
    /^(?:Animation|Clipboard|Composition|Drag|Focus|Form|Input|Keyboard|Mouse|Pointer|Touch|Transition|UI|Wheel)?Event(?:Handler)?$/.test(
      reactType,
    )
  ) {
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

  if (
    /^(?:Array|BigInt|Error|Function|Map|Object|Promise|RegExp|Set|Symbol|WeakMap|WeakSet)$/.test(
      symbol,
    )
  ) {
    return `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${symbol}`;
  }
  if (
    /^(?:Element|Node|EventTarget|HTMLElement|SVGElement|HTML[A-Za-z]+Element|SVG[A-Za-z]+Element)$/.test(
      symbol,
    )
  ) {
    return `https://developer.mozilla.org/en-US/docs/Web/API/${symbol}`;
  }
}

function tokenizeType(type: string, customTypes: string[] = []): APITypeToken[] {
  return type
    .split(/(React\.[A-Za-z_$][\w$]*|[A-Za-z_$][\w$]*)/g)
    .filter(Boolean)
    .map((text) =>
      customTypes.includes(text) ? { text, customType: text } : { text, href: getTypeLink(text) },
    );
}

function enrichTypeTokens(api: ComponentAPI): ComponentAPI {
  const customTypeNames = Object.keys(api.customTypes ?? {});
  const enrichProps = (props: PropDefinition[]) =>
    props.map((prop) => ({ ...prop, typeTokens: tokenizeType(prop.type, customTypeNames) }));
  const customTypes = api.customTypes
    ? Object.fromEntries(
        Object.entries(api.customTypes).map(([name, type]) => [
          name,
          {
            ...type,
            typeTokens: tokenizeType(type.type, customTypeNames),
            members: type.members ? enrichProps(type.members) : undefined,
          },
        ]),
      )
    : undefined;

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

/**
 * Banner's root is cast to BannerComponent, which leaves docgen with no doc for
 * the module at all. Its API is declared on BannerProps and its two parts.
 */
/**
 * Table's root is cast through `unknown` so its generic signature survives the
 * forwardRef, which leaves docgen with no doc for it at all. Its props are
 * declared on TableProps and would otherwise reach agents as an empty API.
 */
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

  // Banner is documented by hand: its root cast leaves docgen with nothing.
  const declaredRoot = declaredProps(componentDirName, `${componentDirName}Props`);
  if (allDocs.length === 0 && !declaredRoot) {
    return componentDirName === "Banner" ? { props: [] } : null;
  }

  // Prefer the doc whose displayName matches the component directory name (e.g. "Modal" for Modal dir).
  // A dotted displayName is a compound part; promoting one to the root, which happens when a cast
  // hides the root from docgen, publishes the part's props as the component's own.
  const partNames = new Set(
    allDocs
      .map((d) => d.displayName)
      .filter((name) => name?.includes("."))
      .map((name) => name.replace(/\./g, "")),
  );
  const mainDoc =
    allDocs.find((d) => d.displayName === componentDirName) ??
    allDocs.find(
      (d) => d.displayName && !d.displayName.includes(".") && !partNames.has(d.displayName),
    );
  const mainProps = mainDoc ? normalizeExtractedProps(extractPropsFromDoc(mainDoc)) : [];

  const subComponents: Record<string, { description?: string; props: PropDefinition[] }> = {};
  for (const doc of allDocs) {
    if (doc.displayName && doc.displayName !== mainDoc?.displayName) {
      subComponents[doc.displayName] = {
        description: doc.description || undefined,
        props: normalizeExtractedProps(extractPropsFromDoc(doc)),
      };
    }
  }

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/\.displayName\s*=\s*["']([^"']+)["']/g)) {
      const name = match[1]!;
      if (!name.startsWith(`${componentDirName}.`)) continue;
      const declared = declaredProps(componentDirName, `${name.replace(/\./g, "")}Props`);
      if (!declared) continue;
      const flatName = name.replace(/\./g, "");
      const existing = subComponents[name] ?? subComponents[flatName];
      delete subComponents[flatName];
      subComponents[name] = { ...existing, props: reconcileProps(declared, existing?.props ?? []) };
    }
  }

  const api: ComponentAPI = {
    props: declaredRoot ? reconcileProps(declaredRoot, mainProps) : mainProps,
    subComponents: Object.keys(subComponents).length > 0 ? subComponents : undefined,
  };

  return api;
}

/**
 * Hand-authored API documentation that still lives in this script. Each entry
 * moves to `src/components/<Component>/api.ts` as that component is migrated.
 */
const legacyEnrichers: Record<string, (api: ComponentAPI) => ComponentAPI> = {};

/** Prefers the component's own api.ts, falling back to a legacy enricher. */
async function enrichAPI(componentDirName: string, api: ComponentAPI): Promise<ComponentAPI> {
  const enrichment = await loadComponentEnrichment(componentDirName);
  if (enrichment) return applyEnrichment(api, enrichment);

  const legacyEnricher = legacyEnrichers[componentDirName];
  return legacyEnricher ? legacyEnricher(api) : api;
}

export async function extractAllComponentAPIs(
  componentDirNames: string[],
  registry: ComponentRegistry = componentRegistry,
): Promise<Record<string, ComponentAPI>> {
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

    // The cache holds extracted docs only. Enrichment runs on every build so an
    // edit to a component's api.ts takes effect without invalidating the cache.
    let extracted = getCachedAPI(dirName, cache, COMPONENTS_DIR);
    if (extracted !== null) {
      cacheHitCount++;
    } else {
      extracted = extractComponentAPI(dirName);
      cache = updateCacheEntry(dirName, cache, extracted, COMPONENTS_DIR);
      if (extracted) parsedCount++;
    }

    if (!extracted && registry[kebabId]) {
      throw new Error(`Failed to extract the public API for ${kebabId}.`);
    }
    if (extracted) {
      result[kebabId] = enrichTypeTokens(await enrichAPI(dirName, extracted));
    }

    // Add examples from registry metadata
    const metadata = registry[kebabId];
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
