import type { GuideMetadata } from '../types.js';

const translateExistingUiToUiLabGuide: GuideMetadata = {
  id: 'translate-existing-ui-to-ui-lab',
  name: 'Translate Existing UI To UI Lab',
  description:
    "Refactor an existing screen, component, or feature to UI Lab primitives without rewriting the user's data flow, state model, or domain logic.",
  category: 'migration',
  summary:
    'Use this guide for targeted UI translation or migration work where the visual layer changes but the product logic should stay intact.',
  tags: [
    'migration',
    'translation',
    'refactor',
    'existing-ui',
    'component-mapping',
    'design-system',
  ],
  whenToUse: [
    'The user has existing JSX or HTML and wants it rewritten with UI Lab components.',
    'The task is to preserve logic and data structures while swapping the UI layer.',
    'The request is well-defined enough to map concrete UI affordances to components, elements, patterns, or sections.',
  ],
  notFor: [
    'Do not start by rewriting business logic, data fetching, or form state unless the user explicitly asks for it.',
    'Do not force a component mapping when a pattern, element, or section would preserve the structure more cleanly.',
  ],
  taskMatchers: [
    'translate this ui to ui lab',
    'migrate this component to ui lab',
    'refactor markup to ui lab',
    'replace custom ui with ui lab',
    'map existing screen to ui lab',
    'convert tailwind ui to ui lab',
  ],
  prerequisites: [
    'The target file or markup is available so the agent can inspect the current structure.',
    'UI Lab is already installed, or the setup guide is applied first.',
    'The migration scope is known: single component, feature area, or whole page.',
  ],
  steps: [
    {
      title: 'Freeze the existing behavior before changing the view layer',
      goal:
        'Preserve state, events, and data contracts so the migration changes the UI shell instead of the feature semantics.',
      instructions: [
        'Read the target component and identify its state, props, callbacks, and data flow before touching markup.',
        'List which parts are presentation-only and which parts are domain logic that must remain unchanged.',
      ],
    },
    {
      title: 'Find the best UI Lab match before rewriting code',
      goal:
        'Choose the narrowest matching abstraction: component, pattern, element, or section.',
      instructions: [
        'Use search_components for atomic parts such as buttons, inputs, cards, modals, lists, and tables.',
        'Use search_patterns when the problem already has a repeatable UI structure like auth, empty states, or settings forms.',
        'Use search_elements or search_sections when the current UI is already a multi-component block or landing-page section.',
      ],
      relatedTools: [
        'search_components',
        'get_component',
        'search_patterns',
        'get_pattern',
        'search_elements',
        'get_element',
        'search_sections',
        'get_section',
      ],
    },
    {
      title: 'Translate structure first, then style tokens',
      goal:
        'Get the semantic component tree right before fine-tuning appearance.',
      instructions: [
        'Preserve prop names, event handlers, and rendering branches from the original implementation where possible.',
        'Replace only the visual wrappers and interactive primitives with UI Lab components.',
        'After the structure is stable, use get_semantic_color or component APIs to refine variants and token usage.',
      ],
    },
    {
      title: 'Keep domain models and public contracts stable',
      goal:
        'Avoid regressions by keeping existing prop signatures and data structures unless the user explicitly wants an API redesign.',
      instructions: [
        'Do not reshape user data solely to satisfy a new UI component.',
        'Wrap or adapt UI Lab components around the existing model instead of rewriting the model around the component.',
        'If a cleaner model change is beneficial, call it out separately rather than bundling it into the migration by default.',
      ],
    },
    {
      title: 'Verify the translated UI against the original behavior',
      goal:
        'Make sure the migration preserved state transitions, accessibility, and visual hierarchy.',
      instructions: [
        'Check empty, loading, disabled, and error states if the original UI had them.',
        'Verify labels, button intent, keyboard behavior, and aria attributes are still correct.',
        'If the original view used ad-hoc Tailwind colors, replace them with UI Lab token families instead of raw Tailwind colors or hex values.',
      ],
      relatedTools: ['get_semantic_color', 'get_component'],
    },
  ],
  validation: [
    'The original data structures, callbacks, and state transitions still work.',
    'The migration uses UI Lab primitives or patterns for the view layer instead of custom replacements where a match exists.',
    'Raw Tailwind colors or hex colors are removed in favor of UI Lab token classes when styles are touched.',
    'Interactive behavior and accessibility semantics remain intact.',
  ],
  relatedTools: [
    'search_components',
    'get_component',
    'get_semantic_color',
    'search_patterns',
    'get_pattern',
    'search_elements',
    'get_element',
    'search_sections',
    'get_section',
  ],
  relatedGuides: ['setup-ui-lab-in-project'],
  examplePrompts: [
    {
      title: 'Targeted component migration',
      prompt:
        'I have this component already working. Refactor only the rendering to use UI Lab components, keep the same props, state, and event handlers, and explain which existing UI pieces map to which UI Lab primitives.',
    },
    {
      title: 'Feature-level translation',
      prompt:
        'Translate this settings page to UI Lab. Keep the current form logic and API calls, but replace the visual structure with the best matching patterns and components from the MCP.',
    },
  ],
};

export default translateExistingUiToUiLabGuide;
