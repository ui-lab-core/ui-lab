import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
import { parseVariant } from "../../../../postcss/variant.mjs";
import { createPostcssPlugins } from "../postcss.config.mts";

const root = path.resolve(import.meta.dirname, "..");
const uiContractPath = path.resolve(root, "../../@ui/src/theme/generated/variants.ts");
const source = await readFile(path.join(root, "styles.css"), "utf8");
const sourceRoot = postcss.parse(source);
const variants: Record<string, string[]> = {};
const defaults: Record<string, string> = {};

sourceRoot.walkAtRules("variant", (rule) => {
  const { component, variant, isDefault } = parseVariant(rule);
  if (isDefault) {
    const existing = defaults[component];
    if (existing && existing !== variant) {
      throw rule.error(`@variant defines more than one default for ${component}`);
    }
    defaults[component] = variant;
  }
  variants[component] = [...new Set([...(variants[component] ?? []), variant])];
});

const css = (await postcss(createPostcssPlugins()).process(source, { from: path.join(root, "styles.css") })).css;

const defaultTypeAliases = Object.entries(variants)
  .map(([component, values]) => {
    const componentName = component
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
      .join("");
    const union = values.length > 0 ? values.map(JSON.stringify).join(" | ") : "never";
    return `export type Default${componentName}Variant = ${union};`;
  })
  .join("\n");
await writeFile(
  uiContractPath,
  `// Generated from ui-lab-theme-onyx. Do not edit directly.\n${defaultTypeAliases}\n`,
);

if (/(?:@slot\b|(?:^|[^\w-])slot\s*\()/m.test(css)) {
  throw new Error("Unresolved slot syntax in published Onyx CSS");
}
if (/@variant\b/m.test(css)) {
  throw new Error("Unresolved variant syntax in published Onyx CSS");
}

const outputIndex = process.argv.indexOf("--out");
if (outputIndex !== -1) {
  const output = path.resolve(root, process.argv[outputIndex + 1]);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, css);
  await writeFile(
    path.join(path.dirname(output), "theme-contract.json"),
    `${JSON.stringify({ variants, defaults }, null, 2)}\n`,
  );
  const augmentations = Object.entries(variants)
    .map(([component, values]) => {
      const interfaceName = `${component
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
        .join("")}VariantOverrides`;
      const members = values.map((variant) => `    ${JSON.stringify(variant)}: true;`).join("\n");
      return `  interface ${interfaceName} {\n${members}\n  }`;
    })
    .join("\n\n");
  await writeFile(
    path.join(path.dirname(output), "theme-contract.d.ts"),
    `import "ui-lab-components/theme-contract";\n\ndeclare module "ui-lab-components/theme-contract" {\n${augmentations}\n}\n\nexport {};\n`,
  );
} else if (!process.argv.includes("--check")) {
  process.stdout.write(css);
}
