import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

async function filesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(file));
    else files.push(file);
  }
  return files;
}

const files = await filesIn(dist);
const javascript = files.filter((file) => file.endsWith(".js"));
const imported = new Set();

for (const file of javascript) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(/import\s+["']([^"']+\.css)["'];/g)) {
    imported.add(path.resolve(path.dirname(file), match[1]));
  }
}

const aggregate = await readFile(path.join(dist, "styles.css"), "utf8");
const automatic = files.filter(
  (file) => file.endsWith(".css") && !file.endsWith("styles.css") && !file.endsWith("typography.css"),
);

for (const file of automatic) {
  if (!imported.has(file)) throw new Error(`CSS asset is not auto-imported: ${path.relative(dist, file)}`);

  const css = await readFile(file, "utf8");
  if (!aggregate.includes(css)) {
    throw new Error(`Aggregate stylesheet is missing: ${path.relative(dist, file)}`);
  }
}

for (const name of ["Checkbox.css", "Divider.css", "Gallery.css", "Grid.css", "Scroll.css"]) {
  const css = await readFile(path.join(dist, name), "utf8");
  if (!css.includes("@layer components.defaults")) {
    throw new Error(`${name} is outside the component defaults layer`);
  }
}

console.log(`Verified ${automatic.length} automatic CSS assets and the aggregate bundle.`);
