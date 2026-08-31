import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Every tool returns the same envelope, so one output schema describes all of
 * them. Declaring it lets clients read `structuredContent` instead of parsing
 * the YAML rendering.
 */
export const envelopeSchema: Tool["outputSchema"] = {
  type: "object" as const,
  properties: {
    tool: { type: "string" },
    status: {
      type: "string",
      enum: ["exact", "matches", "list", "not_found"],
      description:
        "exact: the requested item. matches: ranked candidates, call again with a match's ref. list: the full index. not_found: no match, with suggestions and nextSteps.",
    },
    refGrammar: { type: "string" },
    ref: { type: "string" },
    query: { type: "string" },
    total: { type: "number" },
    data: { type: "object" },
    matches: { type: "array" },
    items: { type: "array" },
    suggestions: { type: "array" },
    message: { type: "string" },
    note: { type: "string" },
    nextSteps: { type: "array", items: { type: "string" } },
  },
  required: ["tool", "status"],
};

export const limitProperty = {
  type: "number" as const,
  minimum: 1,
  maximum: 25,
  description: "Maximum ranked matches to return. Defaults to 5.",
  default: 5,
};

export const REF_HELP =
  "References are `component:<id>`, `example:<componentId>/<exampleId>`, `pattern:<id>`, `element:<packageId>/<id>`, `section:<id>`, `starter:<id>`, `artifact:<id>`, or `guide:<id>`. Every response emits the ref of everything it returns; pass one back verbatim to fetch that item exactly.";
