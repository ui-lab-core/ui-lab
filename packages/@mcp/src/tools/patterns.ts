import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const searchPatternsTool: Tool = {
  name: 'search_patterns',
  description:
    'Search for UI Lab design patterns by use case or intent. Returns patterns with working code examples that use correct design tokens and compound components. Use this before building from scratch to find an existing pattern foundation.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Search query describing what you want to build (e.g., "delete confirmation", "settings form", "empty state", "pricing cards", "auth login")',
      },
    },
    required: ['query'],
  },
};

export const getPatternTool: Tool = {
  name: 'get_pattern',
  description:
    'Get a specific design pattern by ID, including its working TSX code and design notes explaining why each token and component choice was made. Use after search_patterns to get the full pattern implementation.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description:
          'Pattern ID (e.g., "auth-form", "destructive-confirm", "empty-state", "status-list-item", "settings-form-layout")',
      },
    },
    required: ['id'],
  },
};
