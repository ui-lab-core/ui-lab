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

  it("rejects malformed declarations", async () => {
    await expect(transform("@variant primary { color: red; }")).rejects.toThrow(
      "@variant requires a component and variant CSS identifier",
    );
  });
});
