import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const searchSectionsTool: Tool = {
  name: 'search_sections',
  description:
    'Search for UI Lab page sections by intent. Sections are full-width landing page blocks (Hero, Features, CTA, Pricing, Testimonials). Use when building marketing pages or landing pages.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Search query describing the page section (e.g., "hero", "pricing cards", "feature grid", "testimonials", "call to action")',
      },
    },
    required: ['query'],
  },
};

export const getSectionTool: Tool = {
  name: 'get_section',
  description:
    'Get a specific UI Lab section by ID, including its variations and design notes.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'Section ID (e.g., "hero", "features", "cta", "pricing", "testimonials")',
      },
    },
    required: ['id'],
  },
};
