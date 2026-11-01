import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export function generateSetupTemplate(): void {
  const directory = path.dirname(fileURLToPath(import.meta.url));
  const source = readFileSync(path.resolve(directory, "../../@ui/src/typography.css"), "utf8");
  const target = path.resolve(directory, "../src/.generated/setup-template.ts");
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `// Generated from @ui/src/typography.css. Do not edit.\nexport const typographyTemplate = ${JSON.stringify(source)};\n`, "utf8");
}
