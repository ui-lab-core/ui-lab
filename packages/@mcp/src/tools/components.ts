import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { envelopeSchema, limitProperty, REF_HELP } from "./shared.js";

export const getComponentTool: Tool = {
  name: "get_component",
  description:
    "Look up UI Lab components: the authoritative props, usage rules, and example source for anything from `ui-lab-components`. " +
    "Omit `query` to list every component id first — that is cheaper than guessing. " +
    "Pass a `component:` ref for that component, an `example:` ref for that example's source, or free text for ranked matches. " +
    "Every result carries the exact import statement to write: components are imported from their own subpath, `ui-lab-components/<componentId>`, not from the package barrel. " +
    `${REF_HELP} A miss returns status "not_found" with suggestions rather than an error.`,
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          'A component ref ("component:button" or "button"), an example ref ("example:button/04-media-player"), or a natural-language query ("date range input"). Omit to list every component.',
      },
      detail: {
        type: "string",
        enum: ["summary", "api", "usage", "examples", "full"],
        description:
          "Applies only when `query` resolves to exactly one component. summary: identity and import. api: props, slots, variants. usage: when to use and what to use instead. examples: example refs. full: everything except example source.",
        default: "summary",
      },
      limit: limitProperty,
    },
  },
  outputSchema: envelopeSchema,
};
