import type { GuideMetadata } from '../types.js';

const setupUiLabInProjectGuide: GuideMetadata = {
  id: 'setup-ui-lab-in-project',
  name: 'Set Up UI Lab In A Project',
  description:
    'Install UI Lab in an existing app, wire the stylesheet order correctly, and verify that components render with tokens instead of raw browser defaults.',
  category: 'setup',
  summary:
    'Use this guide when the task is to add UI Lab to an existing codebase rather than generating a one-off component snippet.',
  tags: [
    'setup',
    'installation',
    'tailwind',
    'theme',
    'nextjs',
    'vite',
    'styles',
  ],
  whenToUse: [
    'The user wants UI Lab installed in an existing project.',
    'The task includes wiring styles, tokens, or the base component package.',
    'The repo already has an app and needs the minimum safe integration path.',
  ],
  notFor: [
    'Do not use this as the only source for advanced theme switching. Pair it with the theme-switching guide when the user asks for cookie-backed light/dark mode or server-stamped HTML state.',
    'Do not assume a blank app. Inspect the current stylesheet entrypoints and framework conventions first.',
  ],
  taskMatchers: [
    'install ui lab',
    'set up ui lab',
    'add ui-lab-components',
    'configure ui lab styles',
    'wire ui lab in next app',
    'wire ui lab in vite app',
    'add ui lab to existing project',
  ],
  prerequisites: [
    'The app uses Tailwind v4 or another setup that can import UI Lab CSS.',
    'The agent can edit the app stylesheet entrypoint such as app/globals.css, src/index.css, or src/main.css.',
    'The package manager for the repo is known before writing install commands.',
    'theme.css must be created (via get_theme_setup) before the stylesheet entrypoint is edited — the import will be broken otherwise.',
  ],
  steps: [
    {
      title: 'Inspect the current app shell before installing anything',
      goal:
        'Find the framework, the main stylesheet, and whether a token layer already exists so the integration matches the repo instead of fighting it.',
      instructions: [
        'Identify the framework entrypoint and stylesheet import path before editing.',
        'Check whether the app already owns a theme.css or equivalent token file.',
        'If UI Lab or a theme package is already installed, adapt the existing setup instead of duplicating imports.',
      ],
    },
    {
      title: 'Install the base package',
      goal: 'Add the minimum package required for styled components.',
      instructions: [
        'Install ui-lab-components. Do not install ui-lab-theme-onyx — the app uses an app-owned theme.css as the token layer instead.',
        'Match the repo package manager instead of introducing a different one.',
      ],
      code: `pnpm add ui-lab-components`,
      language: 'bash',
    },
    {
      title: 'Create the app-owned theme.css token file',
      goal: 'Provide the design token layer that UI Lab components depend on for color.',
      instructions: [
        'Call get_theme_setup to get the canonical theme.css content and creation instructions.',
        'Create the file at app/theme.css (Next.js) or src/theme.css (Vite) using the code returned by get_theme_setup.',
        'Do not skip this step — if theme.css is missing, components will render without tokens and the site will look broken.',
      ],
      relatedTools: ['get_theme_setup'],
    },
    {
      title: 'Import styles in the correct order',
      goal: 'Ensure tokens are defined before UI Lab component styles consume them.',
      instructions: [
        'Edit the app stylesheet entrypoint rather than scattering imports across components.',
        'Keep the order exactly: tailwind, theme.css, then ui-lab-components styles.',
        'Do not import ui-lab-theme-onyx/styles.css — theme.css replaces it as the token layer.',
      ],
      code: `@import "tailwindcss";
@import "./theme.css";
@import "ui-lab-components/styles.css";`,
      language: 'css',
      path: 'app/globals.css',
    },
    {
      title: 'Render one simple UI Lab component in an existing page',
      goal:
        'Verify that styles, tokens, and imports are all active before attempting a larger migration.',
      instructions: [
        'Use a simple component with visible structure such as Card, Input, or Button.',
        'Prefer an existing route or page that already renders during development so verification is fast.',
      ],
      code: `import { Button, Card, Input } from 'ui-lab-components';

export default function Home() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input placeholder="your@email.com" />
      </Card.Content>
      <Card.Footer>
        <Button>Get Started</Button>
      </Card.Footer>
    </Card>
  );
}`,
      language: 'tsx',
    },
    {
      title: 'Escalate to theme switching only if the user asks for it',
      goal:
        'Keep the base setup small and predictable, then branch into the dedicated theming workflow when needed.',
      instructions: [
        'If the task includes light/dark mode persistence or first-paint correctness, fetch the theme-switching guide next.',
        'Use get_theme_setup only as supplementary MCP context if the repo still uses that provider-based path.',
      ],
      relatedTools: ['search_guides', 'get_guide', 'get_theme_setup'],
    },
  ],
  validation: [
    'theme.css exists in the project and was created using the content from get_theme_setup.',
    'A page renders at least one UI Lab component with non-default visual styling.',
    'The stylesheet import order is: tailwindcss → theme.css → ui-lab-components/styles.css.',
    'ui-lab-theme-onyx is not installed or imported — theme.css replaces it.',
    'The chosen install command matches the repo package manager.',
  ],
  relatedTools: ['search_components', 'get_component', 'get_theme_setup', 'search_guides', 'get_guide'],
  relatedResources: ['component://button', 'component://card', 'component://input'],
  relatedGuides: ['theme-switching-nextjs', 'translate-existing-ui-to-ui-lab'],
  examplePrompts: [
    {
      title: 'Existing Next.js app',
      prompt:
        'Set up UI Lab in this existing Next.js app. Inspect the current globals.css and app/layout.tsx first, then install only what is missing and verify the import order.',
    },
    {
      title: 'Existing Vite app',
      prompt:
        'Add UI Lab to this Vite project without changing the app architecture. Keep the current CSS entrypoint and render one small verification component after installation.',
    },
  ],
};

export default setupUiLabInProjectGuide;
