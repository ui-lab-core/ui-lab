import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const searchGuidesTool: Tool = {
  name: 'search_guides',
  description:
    'Search for task-specific UI Lab guides. Use this first when the request is a well-defined workflow such as setup, migration, translation, theming, or integration so the agent can follow the right playbook before editing code.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Describe the workflow or task you need help with (e.g., "set up ui lab in next app", "translate existing settings page", "add dark mode with cookies").',
      },
    },
    required: ['query'],
  },
};

export const getGuideTool: Tool = {
  name: 'get_guide',
  description:
    'Get a specific UI Lab guide by ID, including when to use it, prerequisites, step-by-step instructions, validation checks, and related MCP tools.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description:
          'Guide ID (e.g., "setup-ui-lab-in-project", "theme-switching-nextjs", "translate-existing-ui-to-ui-lab")',
      },
    },
    required: ['id'],
  },
};
