import { describe, expect, it } from "vitest";
import postcss from "postcss";
import variantPlugin from "../../../../postcss/variant.mjs";

async function transform(css: string) {
  return (await postcss([variantPlugin()]).process(css, { from: undefined })).css;
}

describe("@variant", () => {
  it("targets the component data-variant attribute", async () => {
    await expect(transform("@variant button primary { color: red; }")).resolves.toBe(
      '.button[data-variant="primary"] { color: red; }',
    );
  });

  it("preserves nested state selectors", async () => {
    const output = await transform(`@variant button primary {
  &:is([data-hovered="true"]) { color: red; }
}`);
    expect(output).toContain('.button[data-variant="primary"]');
    expect(output).toContain('&:is([data-hovered="true"])');
  });

  it("targets an omitted variant for every rule of the theme-defined default", async () => {
    const output = await transform(`@variant button secondary default { color: red; }
@variant button secondary { &:hover { color: blue; } }`);
    expect(output.match(/\.button:not\(\[data-variant\]\)/g)).toHaveLength(2);
    expect(output).toContain('.button[data-variant="secondary"]');
  });

  it("rejects multiple defaults for one component", async () => {
    await expect(
      transform(`@variant button primary default { color: red; }
@variant button secondary default { color: blue; }`),
    ).rejects.toThrow("@variant defines more than one default for button");
  });

  it("rejects malformed declarations", async () => {
    await expect(transform("@variant primary { color: red; }")).rejects.toThrow(
      "@variant requires a component and variant CSS identifier, optionally followed by default",
    );
  });
});
