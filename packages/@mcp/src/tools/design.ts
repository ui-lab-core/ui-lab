import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const getSemanticColorTool: Tool = {
  name: 'get_semantic_color',
  description:
    'Get the recommended semantic color for a component with a specific intent. Returns ONE choice (not options) with full color pairing info (background, text, border, hover, active, disabled) and WCAG compliance details. Use before generating component code to determine correct colors.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      component: {
        type: 'string',
        description: 'Component ID (e.g., "button", "alert", "badge")',
      },
      semantic_intent: {
        type: 'string',
        description:
          'Semantic intent: "primary", "secondary", "danger", "success", "warning", "info"',
      },
    },
    required: ['component', 'semantic_intent'],
  },
};

export const getThemeSetupTool: Tool = {
  name: 'get_theme_setup',
  description:
    'Get complete setup instructions for UI Lab light/dark mode using the recommended cookie-backed server layout approach. Returns the theme.css token file, correct CSS import order, Next.js layout.tsx with parseThemeCookie/resolveThemeRootState, and a client toggle using useColorMode. Use this before wiring any theme switching.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
  },
};
