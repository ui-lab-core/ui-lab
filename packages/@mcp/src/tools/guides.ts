import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const searchGuidesTool: Tool = {
  name: 'search_guides',
  description:
    'Search UI Lab’s durable design and implementation guidance. Consult the "foundation" guide when designing or reviewing UI; use other guides for setup, theming, migration, and integration. Summary mode returns small ranked results. Full mode returns one exact or best-matching guide.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'A guide ID or knowledge topic such as "foundation", "setup", "theme switching", "tokens", or "accessibility".',
      },
      detail: {
        type: 'string',
        enum: ['summary', 'full'],
        description:
          'Summary returns ranked guide metadata. Full returns the complete exact or best-matching guide.',
        default: 'summary',
      },
      limit: {
        type: 'number',
        minimum: 1,
        maximum: 10,
        description: 'Maximum summary matches to return. Defaults to 5.',
        default: 5,
      },
    },
    required: ['query'],
  },
};
