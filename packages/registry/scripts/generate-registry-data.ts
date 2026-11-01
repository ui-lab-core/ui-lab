import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createHash } from "node:crypto";
import { extractAllComponentAPIs, extractPublicExportNames } from "./generate-api-data";
import { extractAllComponentStyles } from "./generate-styles-data";
import { generatePublicArtifact } from "./generate-public-artifacts";
import { publicArtifactDefinitions } from "./public-artifacts.config";
import {
  componentDependencies,
  coreNpmDependencies,
  corePeerDependencies,
} from "../src/component-dependencies";
import { loadComponentMetadata } from "./metadata-source";
import { generateSetupTemplate } from "./generate-setup-template";
import type {
  ComponentRegistry,
  ComponentAPI,
  ComponentStyles,
  ComponentDeps,
  PackageMetadata,
  ComponentImport,
} from "../src/types";
import { validateContracts } from "./validate-contracts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.resolve(__dirname, "../src/registry.ts");
const GENERATED_DATA_PATH = path.resolve(__dirname, "../src/.generated/data.ts");
const GENERATED_ARTIFACTS_PATH = path.resolve(__dirname, "../src/.generated/artifacts.ts");
const COMPONENTS_DIR = path.resolve(__dirname, "../../@ui/src/components");
const PACKAGE_JSON_PATH = path.resolve(__dirname, "../package.json");
const componentRegistry = loadComponentMetadata();

const REACT_ARIA_PLACEHOLDERS: Record<string, string> = {
  button: "https://react-spectrum.adobe.com/react-aria/useButton.html",
  checkbox: "https://react-spectrum.adobe.com/react-aria/useCheckbox.html",
  radio: "https://react-spectrum.adobe.com/react-aria/useRadioGroup.html",
  switch: "https://react-spectrum.adobe.com/react-aria/useSwitch.html",
  slider: "https://react-spectrum.adobe.com/react-aria/useSlider.html",
  select: "https://react-spectrum.adobe.com/react-aria/useSelect.html",
  modal: "https://react-spectrum.adobe.com/react-aria/useDialog.html",
  page: "",
  popover: "https://react-spectrum.adobe.com/react-aria/usePopover.html",
  tooltip: "https://react-spectrum.adobe.com/react-aria/useTooltip.html",
  tabs: "https://react-spectrum.adobe.com/react-aria/useTabs.html",
  menu: "https://react-spectrum.adobe.com/react-aria/useMenu.html",
  input: "https://react-spectrum.adobe.com/react-aria/useTextField.html",
  textarea: "https://react-spectrum.adobe.com/react-aria/useFocusRing.html",
  label: "https://react-spectrum.adobe.com/react-aria/useLabel.html",
  progress: "https://react-spectrum.adobe.com/react-aria/useProgressBar.html",
  path: "https://react-spectrum.adobe.com/react-aria/useBreadcrumbs.html",
  table: "https://react-spectrum.adobe.com/react-aria/useTable.html",
  toast: "",
  badge: "",
  card: "",
  divider: "",
  flex: "",
  fold: "",
  grid: "",
  group: "",
  form: "",
  confirm: "",
  "command-palette": "",
  panel: "",
};

function getComponentIds(): string[] {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error("Components directory not found:", COMPONENTS_DIR);
    return [];
  }

  return fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function getPackageMetadata(): PackageMetadata {
  const uiRoot = path.resolve(COMPONENTS_DIR, "../..");
  const uiPackage = JSON.parse(fs.readFileSync(path.join(uiRoot, "package.json"), "utf8"));
  const registryPackage = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
  const hash = createHash("sha256");
  const visit = (filename: string) => {
    if (fs.statSync(filename).isDirectory()) {
      for (const entry of fs.readdirSync(filename).sort()) {
        if (["tests", "__tests__"].includes(entry) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(entry)) continue;
        visit(path.join(filename, entry));
      }
    } else {
      hash.update(path.relative(path.resolve(__dirname, "../.."), filename).replace(/\\/g, "/"));
      hash.update("\0").update(fs.readFileSync(filename)).update("\0");
    }
  };
  for (const filename of [
    path.join(uiRoot, "src"), path.join(uiRoot, "package.json"),
    path.resolve(__dirname, "../src/components"), path.resolve(__dirname, "../src/types.ts"),
    path.join(__dirname, "generate-api-data.ts"), path.join(__dirname, "generate-styles-data.ts"),
    path.join(__dirname, "api-enrichment.ts"),
  ]) visit(filename);
  return { version: uiPackage.version, registryVersion: registryPackage.version, schemaVersion: 1, sourceHash: hash.digest("hex") };
}

function toKebabCase(pascalCase: string): string {
  return pascalCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function generateDataFile(
  apiData: Record<string, ComponentAPI>,
  stylesData: Record<string, ComponentStyles>,
  reactAriaUrls: Record<string, string>,
  packageMetadata: PackageMetadata,
): void {
  const uiPackage = JSON.parse(fs.readFileSync(path.resolve(COMPONENTS_DIR, "../../package.json"), "utf8"));
  const imports: Record<string, ComponentImport> = {};
  for (const directory of getComponentIds()) {
    const id = toKebabCase(directory);
    const component = componentRegistry[id];
    if (!component) continue;
    const entry = uiPackage.exports?.[`./${id}`];
    if (!entry) throw new Error(`${id}: no package subpath export`);
    const names = extractPublicExportNames(directory);
    if (!names.includes(component.source.exportName)) throw new Error(`${id}: ${component.source.exportName} is not a public runtime export (available: ${names.join(", ")})`);
    const namedParts = Object.fromEntries(Object.keys(apiData[id]?.subComponents ?? {}).flatMap((name) => {
      const flat = name.replace(/\./g, "");
      return names.includes(flat) ? [[name, flat]] : [];
    }));
    imports[id] = {
      statement: `import { ${component.source.exportName} } from '${uiPackage.name}/${id}';`,
      namedParts,
      serverCompound: !!entry["react-server"],
    };
  }
  const content = `import type { ComponentAPI, ComponentStyles, ComponentDeps, PackageMetadata, ComponentImport } from '../types';

export const generatedComponentImports: Record<string, ComponentImport> = ${JSON.stringify(imports, null, 2)};

export const generatedAPI: Record<string, ComponentAPI> = ${JSON.stringify(apiData, null, 2)};

export const generatedStyles: Record<string, ComponentStyles> = ${JSON.stringify(stylesData, null, 2)};

export const reactAriaUrls: Record<string, string> = ${JSON.stringify(reactAriaUrls, null, 2)};

export const generatedComponentDependencies: Record<string, ComponentDeps> = ${JSON.stringify(componentDependencies, null, 2)};

export const generatedCoreNpmDependencies = ${JSON.stringify(Array.from(coreNpmDependencies), null, 2)};

export const generatedCorePeerDependencies = ${JSON.stringify(Array.from(corePeerDependencies), null, 2)};

export const packageMetadata: PackageMetadata = ${JSON.stringify(packageMetadata, null, 2)};
`;

  fs.mkdirSync(path.dirname(GENERATED_DATA_PATH), { recursive: true });
  fs.writeFileSync(GENERATED_DATA_PATH, content, "utf-8");
  fs.writeFileSync(path.resolve(__dirname, "../src/.generated/component-metadata.ts"),
    `import type { ComponentMetadata } from "../types.js";\n\n// Generated from components/*/metadata.json. Do not edit.\nexport const generatedComponentMetadata = ${JSON.stringify(Object.values(componentRegistry), null, 2)} as ComponentMetadata[];\n`, "utf8");
  console.log(`Generated data written to: ${GENERATED_DATA_PATH}`);
}

function generateArtifactFile(): void {
  const artifacts = Object.fromEntries(
    publicArtifactDefinitions.map((definition) => [definition.id, generatePublicArtifact(definition)]),
  );
  for (const artifact of Object.values(artifacts)) {
    for (const file of artifact.files) {
      if (file.language === "css" && /(?:@slot\b|(?:^|[^\w-])slot\s*\()/m.test(file.content)) {
        throw new Error(`Unresolved slot syntax in generated ${artifact.id} artifact: ${file.outputPath}`);
      }
    }
  }
  const content = `import type { SourceArtifact } from "../types.js";\n\nexport const generatedPublicArtifacts: Record<string, SourceArtifact> = ${JSON.stringify(artifacts, null, 2)};\n\nexport const generatedPremiumArtifacts: Record<string, SourceArtifact> = {};\n`;
  fs.mkdirSync(path.dirname(GENERATED_ARTIFACTS_PATH), { recursive: true });
  fs.writeFileSync(GENERATED_ARTIFACTS_PATH, content, "utf8");
}

async function main() {
  generateSetupTemplate();
  console.log("Starting registry data extraction...\n");

  const componentIds = getComponentIds();
  console.log(`Found ${componentIds.length} components: ${componentIds.join(", ")}\n`);

  console.log("Extracting API documentation...");
  const apiData = await extractAllComponentAPIs(componentIds, componentRegistry);
  validateContracts(componentRegistry, apiData);
  console.log(`Extracted API for ${Object.keys(apiData).length} components\n`);

  console.log("Extracting styles data...");
  const stylesData = await extractAllComponentStyles(componentIds);
  console.log(`Extracted styles for ${Object.keys(stylesData).length} components\n`);

  console.log("Generating explicitly public copyable artifacts...");
  generateArtifactFile();
  console.log(`Generated ${publicArtifactDefinitions.length} public source artifacts\n`);

  const reactAriaUrls: Record<string, string> = {};
  for (const id of componentIds) {
    const kebabId = toKebabCase(id);
    reactAriaUrls[kebabId] = REACT_ARIA_PLACEHOLDERS[kebabId] || "";
  }

  console.log("Extracting package metadata...");
  const packageMetadata = getPackageMetadata();
  console.log(`Package version: ${packageMetadata.version}\n`);

  generateDataFile(apiData, stylesData, reactAriaUrls, packageMetadata);

  console.log("\nSummary:");
  console.log("--------");
  for (const id of componentIds) {
    const kebabId = toKebabCase(id);
    const hasApi = kebabId in apiData;
    const hasStyles = kebabId in stylesData;
    const hasReactAria = reactAriaUrls[kebabId] !== "";
    console.log(
      `${id}: API=${hasApi ? "✓" : "✗"} Styles=${hasStyles ? "✓" : "✗"} ReactAria=${hasReactAria ? "✓" : "-"}`,
    );
  }

  console.log("\nDone! Run `pnpm build` to rebuild the registry package.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
