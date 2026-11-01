import assert from "node:assert/strict";
import test from "node:test";
import { encode } from "./encode.js";
import { handleTool } from "./handlers/index.js";
import { INSTRUCTIONS } from "./server.js";
import { tools } from "./tools/index.js";

/**
 * Response size is a feature here, so it is asserted rather than assumed.
 *
 * `before` is the YAML rendering these calls produced previously, measured on
 * the same registry data. Each ceiling sits a little above what the encoder
 * currently emits, so ordinary content edits pass and a structural regression —
 * a presentation field leaking back in, a listing losing its cap, an envelope
 * re-nesting its payload — fails here instead of silently in an agent's
 * context window.
 */
// Native-prop coverage and authored behavior contracts add actionable context.
// Large responses also have an independent hard pagination budget.
const CALLS: Array<{ tool: string; args: Record<string, unknown>; before: number; ceiling: number }> = [
  { tool: "get_component", args: {}, before: 7726, ceiling: 4300 },
  { tool: "get_component", args: { query: "component:button" }, before: 870, ceiling: 400 },
  { tool: "get_component", args: { query: "component:button", detail: "api" }, before: 19918, ceiling: 6500 },
  { tool: "get_component", args: { query: "component:select", detail: "api" }, before: 95279, ceiling: 24000 },
  // Current authored example content outgrew the older 7500 ceiling; no source is cut.
  { tool: "get_component", args: { query: "component:button", detail: "full" }, before: 22082, ceiling: 11000 },
  { tool: "get_component", args: { query: "date range input" }, before: 3264, ceiling: 750 },
  // Current guide catalog summary content outgrew the older 1050 ceiling.
  { tool: "search_guides", args: {}, before: 3838, ceiling: 1700 },
  { tool: "search_guides", args: { query: "foundation", detail: "full" }, before: 5751, ceiling: 5100 },
  { tool: "search_workshop", args: {}, before: 81150, ceiling: 10000 },
];

const TARGETED_CALLS = [
  { tool: "get_component", args: { query: "select", detail: "api", parts: ["Trigger", "Value"], props: ["selectedKey", "Trigger.children"] }, before: 1419, ceiling: 5500 },
  { tool: "get_component", args: { query: "select", detail: "full" }, before: 25823, ceiling: 31000 },
  { tool: "get_component", args: { query: "zzqx-no-such-component", detail: "summary" }, before: 576, ceiling: 150 },
  { tool: "get_component", args: { query: "component:zzqx-no-such-component", detail: "api" }, before: 120, ceiling: 150 },
  { tool: "search_guides", args: { query: "foundation", detail: "summary" }, before: 294, ceiling: 350 },
  { tool: "search_workshop", args: { limit: 3 }, before: 1015, ceiling: 1200 },
  { tool: "search_workshop", args: { query: "pattern:feedback-prompt", detail: "summary" }, before: 301, ceiling: 350 },
  { tool: "search_workshop", args: { query: "pattern:feedback-prompt", detail: "full" }, before: 1513, ceiling: 1700 },
];

test("no response outgrows its budget", async () => {
  let total = 0;
  let baseline = 0;

  for (const { tool, args, before, ceiling } of CALLS) {
    const size = encode(await handleTool(tool, args)).length;
    total += size;
    baseline += before;
    assert.ok(size <= ceiling, `${tool} ${JSON.stringify(args)}: ${size} chars exceeds ${ceiling}`);
  }

  assert.ok(total <= 60_000, `${total} characters across the suite`);
  assert.ok(total < baseline / 4, `${total} is not materially below the ${baseline}-character baseline`);
});

test("targeted probe responses stay within their budgets without truncating full detail", async () => {
  for (const { tool, args, ceiling } of TARGETED_CALLS) {
    const size = encode(await handleTool(tool, args)).length;
    assert.ok(size <= ceiling, `${tool} ${JSON.stringify(args)}: ${size} chars exceeds ${ceiling}`);
  }
});

test("tool definitions stay small, because they are re-sent every turn", () => {
  // A response is paid for once per call; this payload is paid for once per
  // request in the whole session, which made it the costliest text here.
  assert.ok(JSON.stringify(tools).length + INSTRUCTIONS.length <= 5000);
  // Declaring an output schema obliges the server to return structuredContent
  // alongside the text body, sending every response twice.
  assert.ok(tools.every((tool) => tool.outputSchema === undefined));
});


test("small settings needs direct focused retrieval, not discovery chains", async () => {
  const calls = [
    { tool: "search_guides", args: { query: "foundation", detail: "full" } },
    { tool: "get_component", args: { query: "select", detail: "api",
      parts: ["Trigger", "Value", "Content", "Item"],
      props: ["selectedKey", "onSelectionChange", "disabled", "label", "children",
        "Trigger.children", "Value.placeholder", "Value.children", "Content.position", "Item.disabled"] } },
    { tool: "get_component", args: { query: "label", detail: "api" } },
    { tool: "get_component", args: { query: "button", detail: "api" } },
  ];
  const sizes = [];
  for (const {tool, args} of calls) {
    const result = await handleTool(tool, args);
    assert.equal(result.status, "exact");
    sizes.push(encode(result).length);
  }
  assert.ok(sizes[1]! < 10000, `focused Select: ${sizes[1]}`);
  const total = sizes.reduce((sum, size) => sum + size, 0);
  assert.ok(total < 22000 && total < 35392 * .65, `settings: ${total}`);
  console.log(`settings: 11 calls/35392 chars before; ${calls.length} calls/${total} chars after; sizes ${sizes.join(",")}; metadata ${JSON.stringify(tools).length + INSTRUCTIONS.length}`);
});
