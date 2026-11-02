import assert from "node:assert/strict";
import test from "node:test";

import { extractAllComponentAPIs } from "./generate-api-data.js";
import { extractAllComponentStyles } from "./generate-styles-data.js";

test("Color API documents hierarchical anatomy and compound state", async () => {
  const { color: api } = await extractAllComponentAPIs(["Color"]);
  const slots = api.customTypes?.ColorStyleSlots.members?.map(({ name }) => name);

  assert.deepEqual(slots, [
    "provider",
    "root",
    "trigger",
    "controls",
    "canvas",
    "slider",
    "recentColors",
    "input",
  ]);
  assert.equal(api.customTypes?.ColorCanvasGradientStyleSlots, undefined);
  assert.ok(api.customTypes?.ColorSliderChannelStyleSlots.members?.length === 3);
  assert.equal(api.props.find(({ name }) => name === "styles")?.type, "ColorStylesProp");
  assert.equal(new Set(api.props.map(({ name }) => name)).size, api.props.length);
  assert.ok(api.stateAttributes?.find(({ name }) => name === "data-slot")?.values?.includes("canvas.inner"));
});

test("Color styles preserve dotted anatomy and authored variable scopes", async () => {
  const { color: styles } = await extractAllComponentStyles(["Color"]);
  const parts = styles.styleableParts.map(({ name }) => name);

  for (const slot of [
    "trigger.root",
    "canvas.inner",
    "slider.opacity.track",
    "recentColors.swatch",
    "input.previewSwatch",
  ]) {
    assert.ok(parts.includes(slot), slot);
  }
  assert.equal(parts.some((slot) => /^(?:triggerSwatch|canvasGradient|sliderTrack)/.test(slot)), false);
  assert.equal(styles.documentation?.customization?.title, "Customize Color");
  assert.match(styles.onyxThemeCss ?? "", /@slot pointer/);
  assert.doesNotMatch(styles.onyxThemeCss ?? "", /\.color > \.canvas/);

  for (const group of styles.documentation!.customization!.groups) {
    for (const documented of group.variables) {
      assert.ok(
        styles.cssVariables.some(
          (variable) =>
            variable.name === documented.name &&
            variable.slot === documented.slot,
        ),
        `${documented.selector ?? ""}:${documented.slot ?? "root"}.${documented.name}`,
      );
    }
  }
});
