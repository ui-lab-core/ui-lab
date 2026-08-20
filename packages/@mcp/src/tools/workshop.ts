import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const searchWorkshopTool: Tool = {
  name: "search_workshop",
  description:
    "Search public UI Lab artifact metadata. Full mode returns source only when the public registry explicitly marks an artifact copyable; package and premium items return a structured install intent.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          'Natural-language search, item ID, or stable workshop reference (for example, "empty state", "hero", "pattern:media-object", or "example:button/04-media-player").',
      },
      kind: {
        type: "string",
        enum: ["example", "pattern", "element", "section", "starter", "all"],
        description: "Optional content filter. Defaults to all workshop content.",
        default: "all",
      },
      detail: {
        type: "string",
        enum: ["summary", "full"],
        description:
          "Summary returns ranked metadata. Full returns public copyable source only when the registry contract permits it.",
        default: "summary",
      },
      variation: {
        type: "string",
        description:
          "Optional variation ID, demo path, 1-based index, or name substring when retrieving a full pattern, element, or section.",
      },
      limit: {
        type: "number",
        minimum: 1,
        maximum: 10,
        description: "Maximum summary matches to return. Defaults to 5.",
        default: 5,
      },
    },
    required: ["query"],
  },
};
