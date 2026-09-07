import assert from "node:assert/strict";
import test from "node:test";
import { encode } from "./encode.js";
import { handleTool } from "./handlers/index.js";
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
const CALLS: Array<{ tool: string; args: Record<string, unknown>; before: number; ceiling: number }> = [
  { tool: "get_component", args: {}, before: 7726, ceiling: 4300 },
  { tool: "get_component", args: { query: "component:button" }, before: 870, ceiling: 400 },
  { tool: "get_component", args: { query: "component:button", detail: "api" }, before: 19918, ceiling: 5100 },
  { tool: "get_component", args: { query: "component:select", detail: "api" }, before: 95279, ceiling: 18000 },
  { tool: "get_component", args: { query: "component:button", detail: "full" }, before: 22082, ceiling: 7500 },
  { tool: "get_component", args: { query: "date range input" }, before: 3264, ceiling: 750 },
  { tool: "search_guides", args: {}, before: 3838, ceiling: 1050 },
  { tool: "search_guides", args: { query: "foundation", detail: "full" }, before: 5751, ceiling: 5100 },
  { tool: "search_workshop", args: {}, before: 81150, ceiling: 9000 },
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

  assert.ok(total <= 50_000, `${total} characters across the suite`);
  assert.ok(total < baseline / 4, `${total} is not materially below the ${baseline}-character baseline`);
});

test("tool definitions stay small, because they are re-sent every turn", () => {
  // A response is paid for once per call; this payload is paid for once per
  // request in the whole session, which made it the costliest text here.
  assert.ok(JSON.stringify(tools).length <= 3000);
  // Declaring an output schema obliges the server to return structuredContent
  // alongside the text body, sending every response twice.
  assert.ok(tools.every((tool) => tool.outputSchema === undefined));
});
