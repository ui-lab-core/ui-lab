import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { limitProperty } from "./shared.js";

export const searchWorkshopTool: Tool = {
  name: "search_workshop",
  description:
    "How a UI Lab item is obtained, and its copyable source when the registry marks it public. Use `get_component` for component APIs. Omit `query` to list the index.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "A `pattern:`/`element:`/`section:`/`starter:`/`artifact:`/`component:` ref, a bare id, or free text. Omit to list everything.",
      },
      kind: {
        type: "string",
        enum: ["component", "artifact", "pattern", "element", "section", "starter", "all"],
        description: "Restrict the index. Defaults to all.",
        default: "all",
      },
      detail: {
        type: "string",
        enum: ["summary", "full"],
        description: "Applies only to an exact ref. full adds source for items marked copyable.",
        default: "summary",
      },
      limit: limitProperty,
    },
  },
};
