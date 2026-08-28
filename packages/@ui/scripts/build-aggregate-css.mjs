import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const output = path.join(dist, "styles.css");
const temporaryOutput = path.join(dist, ".styles.css.tmp");
const cssFiles = (await readdir(dist))
  .filter(
    (file) =>
      file.endsWith(".css") &&
      file !== "styles.css" &&
      file !== "typography.css" &&
      !file.startsWith("."),
  )
  .sort((a, b) => (a === "base.css" ? -1 : b === "base.css" ? 1 : a.localeCompare(b)));

const aggregate = (await Promise.all(cssFiles.map((file) => readFile(path.join(dist, file), "utf8"))))
  .join("");

await writeFile(temporaryOutput, aggregate);
await rename(temporaryOutput, output);
