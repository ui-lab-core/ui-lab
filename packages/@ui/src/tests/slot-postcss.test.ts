import { readFile } from "node:fs/promises";
import postcss from "postcss";
import { describe, expect, it } from "vitest";
import slotPlugin from "../../../../postcss/slot.mjs";

async function transform(css: string) {
  return (await postcss([slotPlugin()]).process(css, { from: undefined })).css;
}

describe("slot PostCSS transform", () => {
  it("expands a slot declaration", async () => {
    expect(await transform(":root { @slot border { --background: red; } }")).toContain(
      "--slot-border-background: red",
    );
  });

  it("expands multiple properties and contextual overrides", async () => {
    const css = await transform(`
      :root { @slot border { --background: black; --width: 1px; } }
      .command { @slot border { --background-focus: red; } }
    `);
    expect(css).toContain("--slot-border-background: black");
    expect(css).toContain("--slot-border-width: 1px");
    expect(css).toContain(".command { --slot-border-background-focus: red }");
  });

  it("expands values, fallbacks, and nested fallbacks", async () => {
    const css = await transform(`a {
      color: slot(border, background);
      border-color: slot(border, background, transparent);
      outline-color: slot(border, background-focus, slot(border, background, transparent));
    }`);
    expect(css).toContain("color: var(--slot-border-background)");
    expect(css).toContain("border-color: var(--slot-border-background, transparent)");
    expect(css).toContain(
      "outline-color: var(--slot-border-background-focus, var(--slot-border-background, transparent))",
    );
  });

  it.each([
    "a { @slot border; }",
    "a { @slot border extra { --background: red; } }",
    "a { @slot border { color: red; } }",
    "a { color: slot(border); }",
    "a { color: slot(border, background; }",
    "a { color: slot(border, background, red, blue); }",
  ])("rejects malformed input: %s", async (css) => {
    await expect(transform(css)).rejects.toThrow();
  });

  it("preserves unrelated CSS", async () => {
    const css = "@media (hover: hover) { .plain { color: color-mix(in srgb, red, blue); } }";
    expect(await transform(css)).toBe(css);
  });

  it("keeps a parent focus override inheritable through a nested surface", async () => {
    const css = await transform(`
      .command { @slot border { --background-focus: red; } }
      .input { @slot border { --background: gray; } }
      .input[data-focused] { border-color: slot(border, background-focus); }
    `);
    expect(css).toContain(".command { --slot-border-background-focus: red }");
    expect(css).toContain(".input { --slot-border-background: gray }");
    expect(css).not.toMatch(/\.input\s*\{[^}]*--slot-border-background-focus/s);
  });

  it("expands explicit focus-ring slots into independent namespaces", async () => {
    const css = await transform(`
      [data-ring="true"] {
        @slot ring {
          --background: var(--ring-background);
          --width: 2px;
          --shadow: 0 0 0 slot(ring, width) slot(ring, background);
        }
        @slot ring-border {
          --background: var(--ring-background);
          --background-visible: var(--ring-background);
        }
      }
    `);

    expect(css).toContain("--slot-ring-background: var(--ring-background)");
    expect(css).toContain("--slot-ring-width: 2px");
    expect(css).toContain("--slot-ring-border-background: var(--ring-background)");
    expect(css).toContain("--slot-ring-border-background-visible: var(--ring-background)");
    expect(css).toContain(
      "--slot-ring-shadow: 0 0 0 var(--slot-ring-width) var(--slot-ring-background)",
    );
  });

  it("preserves target surface variables and state-specific border slots", async () => {
    const css = await transform(`
      .button {
        --background: gray;
        @slot border { --background: silver; }
      }
      .button[data-hovered="true"] {
        @slot border { --background-hover: white; }
      }
      .button[data-pressed="true"] {
        @slot border { --background-pressed: black; }
      }
      .button[data-ring="true"] {
        @slot ring { --background: blue; }
        @slot ring-border { --background-visible: blue; }
      }
    `);

    expect(css).toContain(".button {\n        --background: gray");
    expect(css).toContain("--slot-border-background: silver");
    expect(css).toContain("--slot-border-background-hover: white");
    expect(css).toContain("--slot-border-background-pressed: black");
    expect(css).toContain("--slot-ring-background: blue");
    expect(css).toContain("--slot-ring-border-background-visible: blue");
  });

  it("expands slots before later plugins can hoist nested CSS", async () => {
    let cssSeenByLaterPlugin = "";
    const observer = {
      postcssPlugin: "slot-order-observer",
      Once(root: postcss.Root) {
        cssSeenByLaterPlugin = root.toString();
      },
    };
    const input = `
      @layer components.theme {
        .button {
          @supports (color: color-mix(in srgb, red, blue)) {
            @slot border { --background: red; }
          }
          &[data-hovered="true"] {
            @slot border { --background-hover: blue; }
          }
        }
      }
    `;

    const css = (await postcss([slotPlugin(), observer]).process(input, { from: undefined })).css;
    expect(cssSeenByLaterPlugin).not.toContain("@slot");
    expect(css).toContain("@layer components.theme");
    expect(css).toContain("@supports (color: color-mix(in srgb, red, blue))");
    expect(css).toContain('&[data-hovered="true"]');
    expect(css).toContain("--slot-border-background: red");
    expect(css).toContain("--slot-border-background-hover: blue");
    expect(postcss.parse(css).nodes.some((node) => node.type === "decl")).toBe(false);
  });

  it("leaves no unresolved slot syntax in compiled ring and component CSS", async () => {
    const css = await transform(`
      @layer components.defaults {
        .surface { border-color: slot(border, background, transparent); }
      }
      @layer components.theme {
        [data-ring="true"] {
          @slot ring {
            --background: blue;
            --width: 2px;
            --shadow: 0 0 0 slot(ring, width) slot(ring, background);
          }
          @slot ring-border { --background: blue; --background-visible: blue; }
        }
      }
    `);
    expect(css).not.toMatch(/@slot\b|\bslot\(/);
  });

  it("compiles the supported ring path for overlay, self, inset, target, and Group", async () => {
    const sources = await Promise.all(
      [
        "../base.css",
        "../hooks/useFocus.module.css",
        "../components/Button/Button.module.css",
        "../components/Checkbox/Checkbox.module.css",
        "../components/Group/Group.module.css",
        "../components/Input/Input.module.css",
        "../components/Radio/Radio.module.css",
        "../../../themes/onyx/styles.css",
      ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
    );
    const css = await transform(sources.join("\n"));

    expect(css).not.toMatch(/@slot\b|\bslot\(/);
    expect(css).not.toMatch(/--ring(?:-width|-border|-border-visible|-shadow)?\s*:/);
    expect(css).toContain("--slot-ring-shadow: 0 0 0 var(--slot-ring-width) var(--slot-ring-background)");
    expect(css).toContain("--slot-ring-border-background-visible: var(--ring-background)");
    expect(css).toContain('.focus-indicator[data-visible="true"]');
    expect(css).toContain('.focus-indicator[data-ring-inset="true"]');
    expect(css).toContain('.focus-indicator[data-self-target="true"]');
    expect(css).toContain('[data-focus-indicator="target"]');
    expect(css).toContain("outline: var(--slot-ring-width, 0px)");
    expect(css).toContain("outline-offset: calc(");
    expect(css).toContain(".group [data-ring=\"true\"]");
    expect(css).toContain("--slot-ring-shadow: none");
    expect(css).toContain("--slot-border-background-hover");
    expect(css).toContain("--slot-border-background-pressed");
    expect(css).toContain("--slot-border-background-selected");
    expect(css).toContain("--slot-border-background-error");
    expect(css).toContain("background-color: var(--background)");
    expect(css).toContain("border: var(--slot-border-width, var(--border-width-base, 1px))");
    expect(css).toContain(
      "border-color: var(--slot-border-background-hover, var(--slot-border-background, transparent))",
    );
    expect(css).toContain(
      "border-color: var(--slot-border-background-pressed, var(--slot-border-background, transparent))",
    );
    expect(css).toContain(
      "border-color: var(--slot-border-background-selected, var(--slot-border-background, transparent))",
    );
    expect(css).toContain('&[data-disabled="true"]');
    expect(css).toContain('&[data-variant="ghost"]');
    expect(css).toContain("border-color: transparent");
    expect(css).toContain("var(--slot-ring-border-background-visible");
    expect(css).not.toContain("--ui-focus-ring-");
  });
});
