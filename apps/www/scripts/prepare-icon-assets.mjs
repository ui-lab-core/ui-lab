import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lumenIcons } from "@ui-lab-core/library/icons";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptsDirectory, "..");
const sourceDirectory = path.join(appDirectory, "src/assets/stroke");
const outputDirectory = path.join(appDirectory, "public/ui/icons/stroke");
const require = createRequire(import.meta.url);
const libraryDirectory = path.dirname(require.resolve("@ui-lab-core/library/package.json"));

// Core is public static content. Clear its generated variant directories first
// so cached assets cannot survive a set being changed to premium.
for (const variant of lumenIcons.variants) {
  if (variant === "stroke") throw new Error("Lumen variant conflicts with legacy stroke assets");
  const target = path.join(appDirectory, "public/ui/icons", variant);
  await rm(target, { recursive: true, force: true });
  if (lumenIcons.access !== "free") continue;
  await mkdir(target, { recursive: true });
  await Promise.all(
    lumenIcons.icons
      .filter((icon) => icon.variants.includes(variant))
      .map((icon) => cp(
        path.join(libraryDirectory, "content/icons", lumenIcons.id, variant, `${icon.id}.svg`),
        path.join(target, `${icon.id}.svg`),
      )),
  );
}

await mkdir(outputDirectory, { recursive: true });

const entries = await readdir(sourceDirectory, { withFileTypes: true });
await Promise.all(
  entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
    .map((entry) =>
      cp(path.join(sourceDirectory, entry.name), path.join(outputDirectory, entry.name), {
        force: true,
      }),
    ),
);
