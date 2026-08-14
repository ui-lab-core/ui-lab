import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const getComponentTool: Tool = {
  name: 'get_component',
  description:
    'Find a UI Lab component and retrieve only the authoritative context needed. Pass an exact component ID for details, a natural-language query for ranked matches, or a component/example reference for that example source. Responses are concise unless a deeper detail level is requested.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Component ID, natural-language query, or component/example reference (for example, "button", "date range input", or "button/04-media-player").',
      },
      detail: {
        type: 'string',
        enum: ['summary', 'api', 'usage', 'examples', 'full'],
        description:
          'How much context to return for an exact component. Summary is the default; full includes API, usage, accessibility, imports, and example references without embedding every example source.',
        default: 'summary',
      },
    },
    required: ['query'],
  },
};
