import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "../..");
const next = path.join(root, ".next");
const dist = path.join(workspace, "packages/@ui/dist");

const cases = {
  checkbox: ["Checkbox.css", "Divider.css", "Scroll.css"],
  divider: ["Divider.css", "Scroll.css"],
  gallery: ["Gallery.css", "Grid.css", "Divider.css", "Scroll.css"],
};

for (const [page, assets] of Object.entries(cases)) {
  const html = await readFile(path.join(next, `server/app/components/${page}.html`), "utf8");
  const hrefs = [...html.matchAll(/\/_next\/static\/css\/([a-z0-9]+\.css)/g)]
    .map((match) => match[1]);
  const uniqueHrefs = [...new Set(hrefs)];

  if (uniqueHrefs.length > 8) {
    throw new Error(`${page} emitted ${uniqueHrefs.length} stylesheets; expected at most 8`);
  }

  const linkedCss = (await Promise.all(
    uniqueHrefs.map((href) => readFile(path.join(next, "static/css", href), "utf8")),
  )).join("\n");

  for (const asset of assets) {
    const source = await readFile(path.join(dist, asset), "utf8");
    const selector = source.match(/\.(_[A-Za-z0-9_-]+)/)?.[1];
    if (!selector) throw new Error(`Could not identify a CSS module selector in ${asset}`);
    if (!html.includes(selector)) throw new Error(`${page} does not render ${asset}'s ${selector}`);
    if (!linkedCss.includes(selector)) throw new Error(`${page} does not link the rule for ${selector}`);
  }
}

console.log("Verified component CSS coverage and stylesheet request budget.");
