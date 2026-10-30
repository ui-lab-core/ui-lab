import assert from "node:assert/strict";
import test from "node:test";
import { encode } from "./encode.js";

test("scalars are written raw, and nothing is spent on absence", () => {
  const text = encode({
    status: "exact",
    name: "Button",
    experimental: false,
    deprecated: true,
    description: undefined,
    tags: [],
    api: {},
  });
  assert.equal(text, "status: exact\nname: Button\ndeprecated: yes\n");
});

test("a uniform array becomes one header and one row per item", () => {
  const text = encode({
    props: [
      { name: "variant", type: "string", required: true },
      { name: "size", type: "number" },
    ],
    after: 1,
  });
  assert.equal(
    text,
    ["props:", "name\ttype\trequired", "variant\tstring\tyes", "size\tnumber\t-", "", "after: 1"].join("\n") +
      "\n",
  );
});

test("a column that is empty in every row is never given a heading", () => {
  const text = encode({ rows: [{ name: "a", note: undefined }, { name: "b" }] });
  assert.equal(text.split("\n")[1], "name");
});

test("multi-line text keeps its lines and is never flattened into a cell", () => {
  const source = "const a = 1;\n\nexport default a;";
  const text = encode({ files: [{ path: "a.ts", content: source }, { path: "b.ts", content: source }] });
  assert.ok(text.includes(source), "source survived verbatim");
  assert.ok(!text.includes("a.ts\t"), "a multi-line field must not be tabulated");
  // Fences sit at column zero so indentation never becomes part of the source.
  assert.ok(text.includes("\n```\nconst a = 1;"));
});

test("a list of sentences keeps its lines rather than becoming a run-on cell", () => {
  const long = "Prefer a clear reading and interaction order over decorative layout complexity, always.";
  const text = encode({ steps: [{ title: "One", instructions: [long] }, { title: "Two", instructions: [long] }] });
  assert.ok(!text.includes(`${long}\n`.replace("\n", "\t")));
  assert.ok(text.includes(`\n    - ${long}`));
});

test("an item block stays flush: the marker replaces one indent level", () => {
  const text = encode({ outer: [{ a: 1, b: 2 }, { a: 3, b: { c: 4 } }] });
  const lines = text.split("\n");
  assert.equal(lines[0], "outer:");
  assert.equal(lines[1], "  - a: 1");
  assert.equal(lines[2], "    b: 2");
  assert.equal(lines[3], "  - a: 3");
  assert.equal(lines[4], "    b:");
  assert.equal(lines[5], "      c: 4");
});

test("short scalar lists stay on one line and long ones do not", () => {
  assert.equal(encode({ tags: ["form", "input"] }), "tags: form, input\n");
  assert.equal(
    encode({ notes: ["One sentence, with a comma."] }),
    "notes:\n- One sentence, with a comma.\n",
  );
});

test("tabs and newlines inside a cell are neutralised rather than breaking the grid", () => {
  const text = encode({ rows: [{ name: "a", note: "x\ty" }, { name: "b", note: "p" }] });
  const cells = text.split("\n")[2]!.split("\t");
  assert.deepEqual(cells, ["a", "x y"]);
});

 test("zero availability counts survive empty-array omission", () => {
  assert.equal(encode({exampleCount: 0, examples: []}), "exampleCount: 0\n");
});
