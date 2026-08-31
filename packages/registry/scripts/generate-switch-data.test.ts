import assert from "node:assert/strict";
import test from "node:test";
import { extractAllComponentAPIs } from "./generate-api-data.js";
import { extractAllComponentStyles } from "./generate-styles-data.js";

const slots = ["root", "track", "thumb", "input", "focusIndicator"];

test("Switch styles preserve public anatomy, scoped variables, and root-owned theme rules", async () => {
  const { switch: styles } = await extractAllComponentStyles(["Switch"]);
  assert.deepEqual(styles.styleableParts.map(({ name }) => name), slots);
  assert.deepEqual(styles.styleableGroups[0].slots.map(({ name }) => name), slots);
  assert.equal(styles.documentation?.customization?.title, "Customize Switch");
  const selectedFill = styles.cssVariables.find((variable) =>
    variable.slot === "track" && variable.name === "--background-selected");
  assert.equal(selectedFill?.selector, '.switch[data-selected="true"] > .switch-track');
  assert.equal(selectedFill?.value, "unset");
  // The shared extractor omits layer metadata; raw CSS retains the authored layer.
  assert.match(styles.rawCss, /@layer components\.defaults/);
  assert.ok(selectedFill?.referencedVars.includes("--background"));
  assert.equal(styles.cssVariables.some(({ name }) => name === "--thumb-size" || name === "--thumb-offset"), false);
  assert.match(styles.onyxThemeCss ?? "", /@slot track/);
  assert.match(styles.onyxThemeCss ?? "", /@slot thumb/);
  assert.doesNotMatch(styles.onyxThemeCss ?? "", /\.switch > \.switch-thumb/);
  for (const group of styles.documentation!.customization!.groups) {
    for (const documented of group.variables) {
      assert.ok(styles.cssVariables.some((variable) => variable.name === documented.name && variable.slot === documented.slot), `${documented.slot ?? "root"}.${documented.name}`);
    }
  }
});

test("Switch API documents every slot and emitted state without Checkbox claims", () => {
  const { switch: api } = extractAllComponentAPIs(["Switch"]);
  assert.deepEqual(api.customTypes?.SwitchStyleSlots.members?.map(({ name }) => name), slots);
  assert.deepEqual(api.stateAttributes?.find(({ name }) => name === "data-slot")?.values, slots);
  assert.equal(new Set(api.props.map(({ name }) => name)).size, api.props.length);
  assert.equal(api.props.find(({ name }) => name === "readOnly")?.category, "Core");
  assert.equal(api.props.find(({ name }) => name === "size")?.enumValueDetails?.length, 2);
  assert.doesNotMatch(JSON.stringify(api), /Checkbox/);
  for (const member of api.customTypes!.SwitchStyleSlots.members!) {
    assert.ok(member.typeTokens?.some((token) => token.text === "Style"));
  }
});
