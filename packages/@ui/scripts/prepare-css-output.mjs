import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const chunks = path.join(dist, "chunks");

// Keep styles.css in place so concurrent consumers never observe a missing
// export. The aggregate builder replaces it atomically after this copy is made.
await copyFile(path.join(dist, "styles.css"), path.join(dist, "base.css"));

for (const entry of await readdir(chunks, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

  const file = path.join(chunks, entry.name);
  const source = await readFile(file, "utf8");
  const updated = source.replaceAll('import "../styles.css";', 'import "../base.css";');
  if (updated !== source) await writeFile(file, updated);
}
