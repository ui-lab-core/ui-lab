import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { limitProperty } from "./shared.js";

export const getComponentTool: Tool = {
  name: "get_component",
  description:
    "Authoritative React component APIs and examples. Known id: request api directly, without listing/summary calls. Use parts/props to scope api; omit selectors for complete API. Omit query to list components.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          'A `component:` ref, an `example:` ref, a bare id, or free text. Omit to list every component.',
      },
      detail: {
        type: "string",
        enum: ["summary", "api", "styling", "usage", "examples", "full"],
        description:
          "Exact ref or bare id. summary: identity and import. api: props, compound parts, custom types. styling: style slots and data attributes. usage: when to use and what instead. examples: example refs. full: all of it.",
        default: "summary",
      },
      parts: { type: "array", items: { type: "string" }, description: "api only: compound parts, e.g. Trigger, Value, Content, Item. Omit for all; [] for root only." },
      props: { type: "array", items: { type: "string" }, description: "api only: root or qualified props, e.g. selectedKey, Trigger.children. Required/accessibility props retained; omit for all." },
      limit: limitProperty,
    },
  },
};
