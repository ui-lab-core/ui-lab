import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const getInspirationTool: Tool = {
  name: 'get_inspiration',
  description:
    'Discover relevant Elements, Sections, and Patterns from the UI Lab registry. Returns lightweight metadata (purpose, tags, structure hints) for design reasoning—no full source code. Use during ideation to find existing patterns that match your design needs.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Search query describing what you want to build or discover (e.g., "file list", "auth form", "empty state", "hero landing", "sidebar navigation"). Supports fuzzy matching across IDs, descriptions, and tags.',
      },
      category: {
        type: 'string',
        enum: ['elements', 'sections', 'patterns', 'all'],
        description:
          '"elements" = multi-component UI blocks (Chat, Sidebar, TOC), "sections" = full-width landing blocks (Hero, Pricing, Features), "patterns" = reusable atomic patterns (media-object, empty-state), "all" = search everything (default)',
        default: 'all',
      },
      limit: {
        type: 'number',
        description: 'Maximum results to return (default: 10)',
        default: 10,
      },
    },
    required: ['query'],
  },
};

export const getVariationCodeTool: Tool = {
  name: 'get_variation_code',
  description:
    'Fetch the source code for a specific variation of an Element, Section, or Pattern discovered via get_inspiration. Returns only the requested variation—no other variations, no full metadata. Use this to drill into a specific implementation without polluting context.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      type: {
        type: 'string',
        enum: ['element', 'section', 'pattern'],
        description: 'The type of item to fetch code for',
      },
      id: {
        type: 'string',
        description: 'The item ID from get_inspiration results (e.g., "chat", "hero", "media-object")',
      },
      variation: {
        type: 'string',
        description:
          'Which variation to fetch. Accepts: 1-based index ("1", "2", "3"), variation name substring ("filter toolbar", "with actions"), demoPath ("chat-basic"), or pattern variation ID ("media-object-sm"). Omit to get the first/main variation.',
      },
    },
    required: ['type', 'id'],
  },
};
