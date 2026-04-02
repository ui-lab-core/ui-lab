import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const searchElementsTool: Tool = {
  name: 'search_elements',
  description:
    'Search for UI Lab elements by use case or intent. Elements are pre-built, multi-component UI blocks (e.g., Chat interface, AIChatInput, TOC, Sidebar). Use before building complex UI to find a ready-made element foundation.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Search query describing the UI block you want (e.g., "chat interface", "sidebar navigation", "table of contents", "AI input")',
      },
    },
    required: ['query'],
  },
};

export const getElementTool: Tool = {
  name: 'get_element',
  description:
    'Get a specific UI Lab element by ID, including its variations, files, and design notes. Use after search_elements to get the full element structure.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'Element ID (e.g., "chat", "sidebar", "toc", "aichatinput")',
      },
    },
    required: ['id'],
  },
};
