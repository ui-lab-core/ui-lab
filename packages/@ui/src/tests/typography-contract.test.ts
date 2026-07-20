import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = join(import.meta.dirname, "..");
const componentRoot = join(sourceRoot, "components");

function componentStylesheets(): string[] {
  return readdirSync(componentRoot, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    const path = join(componentRoot, entry.name, `${entry.name}.module.css`);

    try {
      readFileSync(path, "utf8");
      return [path];
    } catch {
      return [];
    }
  });
}

describe("component typography contract", () => {
  it("keeps body, heading, and mono families as the only shared roles", () => {
    const base = readFileSync(join(sourceRoot, "base.css"), "utf8");
    const typography = readFileSync(join(sourceRoot, "typography.css"), "utf8");

    expect(base).toContain("--font-body:");
    expect(base).toContain("--font-heading:");
    expect(base).toContain("--font-mono:");
    expect(base).not.toMatch(/--font-(control|label|caption|body-text|heading-text|mono-text):/);
    expect(typography).toContain("long-form reading surfaces only");
  });

  it("rejects retired aliases and raw component type values", () => {
    const invalid: string[] = [];
    const retired = /--(?:font-(?:control|label|caption|body-text|heading-text|mono-text)|text-(?:control|body|label|caption|heading|mono)|weight-(?:control|body|label|caption|heading|mono)|leading-(?:control|body-text|label|caption|heading-text|mono)|tracking-(?:control|body|label|caption|heading|mono)|font-medium|font-weight-medium|font-weight-semibold|header-font-weight|filter-label-font-size)(?![-\w])/;
    const raw = /^\s*(?:font-size|font-weight):\s*\d+(?:\.\d+)?(?:rem|px)?;/;

    for (const path of componentStylesheets()) {
      const relativePath = path.slice(componentRoot.length + 1);
      readFileSync(path, "utf8").split("\n").forEach((line, index) => {
        if (retired.test(line) || raw.test(line)) {
          invalid.push(`${relativePath}:${index + 1}: ${line.trim()}`);
        }
      });
    }

    expect(invalid).toEqual([]);
  });
});
