import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { limitProperty } from "./shared.js";

export const getComponentTool: Tool = {
  name: "get_component",
  description:
    "Authoritative props, usage, and example source for `ui-lab-components`. Omit `query` to list every component id.",
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
          "Applies only to an exact component ref. summary: identity and import. api: props, compound parts, custom types. styling: style slots and data attributes. usage: when to use and what instead. examples: example refs. full: all of it.",
        default: "summary",
      },
      limit: limitProperty,
    },
  },
};
