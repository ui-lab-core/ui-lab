import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { envelopeSchema, limitProperty, REF_HELP } from "./shared.js";

export const searchWorkshopTool: Tool = {
  name: "search_workshop",
  description:
    "Resolve how a UI Lab item is obtained. Components install from `ui-lab-components`; source artifacts are copied or delivered by the UI Lab CLI. " +
    "Every result carries a structured `installIntent`, and `detail: \"full\"` returns source only for artifacts the public registry marks copyable. " +
    "Use `get_component` for component APIs and examples; this tool answers install and access questions. Omit `query` to list the whole index. " +
    REF_HELP,
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          'A ref ("component:button", "pattern:badge-row", "element:foundation/shell", "section:cta-banner", "starter:astro-static"), a bare id, or a natural-language query. Omit to list every indexed item.',
      },
      kind: {
        type: "string",
        enum: ["component", "artifact", "pattern", "element", "section", "starter", "all"],
        description:
          "Filter components, legacy artifacts, patterns, elements, sections, or starters. Defaults to all.",
        default: "all",
      },
      detail: {
        type: "string",
        enum: ["summary", "full"],
        description:
          "Applies only when `query` resolves to exactly one item. full adds copyable source when, and only when, the registry marks the artifact public and copyable.",
        default: "summary",
      },
      limit: limitProperty,
    },
  },
  outputSchema: envelopeSchema,
};
