import assert from "node:assert/strict";
import test from "node:test";
import { extractAllComponentStyles } from "./generate-styles-data.js";

test("Progress CSS variables include consumed component stylesheet variables", async () => {
  const styles = await extractAllComponentStyles(["Progress"]);
  const variables = styles.progress.cssVariables;

  for (const name of [
    "--background",
    "--foreground",
    "--width",
    "--style",
  ]) {
    const variable = variables.find(
      (candidate) => candidate.name === name && (name === "--width" || name === "--style" ? candidate.slot === "border" : true),
    );
    assert.equal(variable?.value, "unset");
  }
  assert.equal(
    variables.find((candidate) => candidate.name === "--background" && candidate.slot === "border")?.value,
    "unset",
  );
  assert.match(styles.progress.onyxThemeCss ?? "", /\.progress \{/);
  assert.match(styles.progress.onyxThemeCss ?? "", /@slot border \{/);
  assert.match(styles.progress.onyxThemeCss ?? "", /@slot track \{/);
  assert.match(styles.progress.onyxThemeCss ?? "", /@slot range \{/);
  assert.match(styles.progress.onyxThemeCss ?? "", /@slot thumb \{/);
  // Part variables are configured on the root via @slot, never structural descendant chains.
  assert.doesNotMatch(styles.progress.onyxThemeCss ?? "", /\.progress > \.track/);
});

test("Command preserves commas within functional selectors in the Onyx stylesheet", async () => {
  const styles = await extractAllComponentStyles(["Command"]);

  assert.match(
    styles.command.onyxThemeCss ?? "",
    /\.command :where\(\.options, \.group\) > \.item[\s\S]*--foreground: var\(--foreground-300\)/,
  );
});

test("Button keeps Onyx variants out of CSS variables and excludes parent-owned overrides", async () => {
  const styles = await extractAllComponentStyles(["Button"]);

  assert.equal(styles.button.cssVariables.some(({ selector }) => selector === ".button.sm"), false);
  assert.equal(styles.button.cssVariables.some(({ selector }) => selector === ".button.md"), false);
  assert.doesNotMatch(styles.button.onyxThemeCss ?? "", /\.list > \[role="option"\]/);
  assert.doesNotMatch(styles.button.onyxThemeCss ?? "", /\.group > \.button/);
  assert.match(styles.button.onyxThemeCss ?? "", /\.button \{/);
  assert.equal((styles.button.onyxThemeCss?.match(/@layer components\.theme/g) ?? []).length, 1);
  assert.equal((styles.button.onyxThemeCss?.match(/@layer utilities/g) ?? []).length, 1);
});
