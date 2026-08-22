import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
import { createPostcssPlugins } from "../postcss.config.mts";

const root = path.resolve(import.meta.dirname, "..");
const source = await readFile(path.join(root, "styles.css"), "utf8");
const css = (await postcss(createPostcssPlugins()).process(source, { from: path.join(root, "styles.css") })).css;

if (/(?:@slot\b|(?:^|[^\w-])slot\s*\()/m.test(css)) {
  throw new Error("Unresolved slot syntax in published Onyx CSS");
}

const outputIndex = process.argv.indexOf("--out");
if (outputIndex !== -1) {
  const output = path.resolve(root, process.argv[outputIndex + 1]);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, css);
} else if (!process.argv.includes("--check")) {
  process.stdout.write(css);
}
