import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const searchComponentsTool: Tool = {
  name: 'search_components',
  description:
    'Search for UI Lab components using natural language queries. Understands multi-word searches and semantic meaning (e.g., "input form field text" finds Input component). Returns up to 10 matching components ranked by relevance.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Search query (e.g., "input form field", "button primary action", "form container card"). Use natural language - the search understands keywords and will find relevant components.',
      },
    },
    required: ['query'],
  },
};

export const getComponentTool: Tool = {
  name: 'get_component',
  description:
    'Get complete metadata for a component or source code for a component example. Pass a component ID (for example, "button") for API metadata, or a component/example ID (for example, "button/04-media-player") to retrieve that exact example for use as an implementation reference.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'Component ID (e.g., "button", "input", "card") or canonical example ID (e.g., "button/04-media-player")',
      },
      detail: {
        type: 'string',
        enum: ['api', 'examples', 'usage', 'full'],
        description:
          '"api" = props+subComponents only. "examples" = description+examples only. "usage" = composition guidance, when-to-use, and anti-patterns. "full" = complete response with design guidance (default).',
        default: 'full',
      },
    },
    required: ['id'],
  },
};
