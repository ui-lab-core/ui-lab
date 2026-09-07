import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { limitProperty } from "./shared.js";

export const searchGuidesTool: Tool = {
  name: "search_guides",
  description:
    'UI Lab\'s durable design and implementation guidance. Call `search_guides { query: "foundation", detail: "full" }` once before designing or reviewing any UI. Other guides cover setup, theming, and migration. Omit `query` to list them.',
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: 'A `guide:` ref, a bare id, or a topic. Omit to list every guide.',
      },
      detail: {
        type: "string",
        enum: ["summary", "full"],
        description: "Applies only to an exact guide ref. full returns its steps and validation checklist.",
        default: "summary",
      },
      limit: limitProperty,
    },
  },
};
