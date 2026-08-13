import { cp, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptsDirectory, "..");
const sourceDirectory = path.join(appDirectory, "src/assets/fill");
const outputDirectory = path.join(appDirectory, "public/ui-lab-icons/fill");

await mkdir(outputDirectory, { recursive: true });

const entries = await readdir(sourceDirectory, { withFileTypes: true });
await Promise.all(
  entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
    .map((entry) =>
      cp(
        path.join(sourceDirectory, entry.name),
        path.join(outputDirectory, entry.name),
        { force: true },
      ),
    ),
);
