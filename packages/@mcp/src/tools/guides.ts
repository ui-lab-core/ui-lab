import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { envelopeSchema, limitProperty, REF_HELP } from "./shared.js";

export const searchGuidesTool: Tool = {
  name: "search_guides",
  description:
    "Read UI Lab's durable design and implementation guidance. " +
    'Call `search_guides { query: "foundation", detail: "full" }` before designing or reviewing any UI: it carries the composition, token, responsive, interaction, and accessibility rules the library expects. ' +
    "Other guides cover setup, theming, and migrating existing UI. Omit `query` to list every guide. " +
    REF_HELP,
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          'A guide ref ("guide:foundation" or "foundation") or a topic such as "theme switching", "tokens", or "accessibility". Omit to list every guide.',
      },
      detail: {
        type: "string",
        enum: ["summary", "full"],
        description:
          "Applies only when `query` resolves to exactly one guide. full returns its complete steps and validation checklist.",
        default: "summary",
      },
      limit: limitProperty,
    },
  },
  outputSchema: envelopeSchema,
};
