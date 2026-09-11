import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// These faces are only ever loaded at runtime for the theme settings font
// picker (see src/features/theme/lib/fonts.ts). Copying the prebuilt
// @fontsource-variable CSS + woff2 files into public/ lets that preview use a
// plain <link> tag instead of a bundler import, so the faces never enter the
// webpack module graph and can't get attributed to every page's CSS.
const PREVIEW_FONT_PACKAGES = [
  "inter",
  "geist",
  "work-sans",
  "karla",
  "dm-sans",
  "manrope",
  "jetbrains-mono",
  "fira-code",
  "roboto-mono",
  "source-code-pro",
];

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptsDirectory, "..");
const outputRoot = path.join(appDirectory, "public/fonts/preview");

await Promise.all(
  PREVIEW_FONT_PACKAGES.map(async (id) => {
    const sourceDirectory = path.join(appDirectory, `node_modules/@fontsource-variable/${id}`);
    const outputDirectory = path.join(outputRoot, id);
    await mkdir(outputDirectory, { recursive: true });
    await cp(path.join(sourceDirectory, "wght.css"), path.join(outputDirectory, "wght.css"), {
      force: true,
    });
    await cp(path.join(sourceDirectory, "files"), path.join(outputDirectory, "files"), {
      recursive: true,
      force: true,
    });
  }),
);
