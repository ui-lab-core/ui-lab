// Tailwind only emits the --color-* variables its generated utilities actually
// use, so a runtime colour like color="orange-500" cannot rely on
// var(--color-orange-500) existing in the consumer's stylesheet. Snapshot
// Tailwind's default palette here so the resolver always has a literal to fall
// back to while still preferring a theme's own value when one is defined.
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themeCss = path.join(path.dirname(require.resolve("tailwindcss/package.json")), "theme.css");
const source = await readFile(themeCss, "utf8");

const entries = [...source.matchAll(/^\s*--color-([a-z0-9-]+):\s*([^;]+);/gm)].map(
  ([, name, value]) => [name, value.trim().replace(/\s+/g, " ")],
);

if (entries.length === 0) {
  throw new Error(`No --color-* declarations found in ${themeCss}`);
}

const body = entries.map(([name, value]) => `  "${name}": "${value}",`).join("\n");

await writeFile(
  path.join(root, "src/generated-tailwind-palette.ts"),
  `// Generated from tailwindcss/theme.css. Do not edit directly.\n` +
    `export const tailwindPalette: Record<string, string> = {\n${body}\n};\n`,
  "utf8",
);

console.log(`Wrote ${entries.length} palette colours to src/generated-tailwind-palette.ts`);
