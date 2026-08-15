import type { GuideMetadata } from "../types.js";

const foundationGuide: GuideMetadata = {
  id: "foundation",
  name: "UI Lab Design Foundation",
  description:
    "Core design, composition, token, interaction, responsive, and accessibility rules for producing interfaces that belong in UI Lab.",
  category: "foundation",
  summary:
    "Use these durable constraints whenever designing or implementing with UI Lab. They define the system without prescribing a page-specific recipe.",
  tags: [
    "foundation",
    "design-system",
    "composition",
    "tokens",
    "accessibility",
    "responsive",
    "interaction",
  ],
  whenToUse: [
    "Before designing or implementing an interface with UI Lab.",
    "When reviewing whether an interface follows the library’s visual and interaction rules.",
    "When choosing tokens, hierarchy, component composition, or responsive behavior.",
  ],
  notFor: [
    "Do not treat this as a page template or a prescribed workflow.",
    "Use the setup or theming guides when framework-specific installation code is required.",
  ],
  taskMatchers: [
    "ui lab foundation",
    "ui lab design rules",
    "design with ui lab",
    "review ui lab design",
    "ui lab tokens",
    "ui lab accessibility",
    "ui lab composition",
  ],
  steps: [
    {
      title: "Start with semantic structure",
      goal: "Let content, actions, and relationships determine the component tree.",
      instructions: [
        "Choose the narrowest UI Lab primitive that expresses the intended behavior and semantics.",
        "Use compound component APIs as designed instead of recreating their internal structure with generic wrappers.",
        "Prefer a clear reading and interaction order over decorative layout complexity.",
        "Use workshop examples as compositional references, then adapt them to the actual content and constraints.",
      ],
    },
    {
      title: "Create hierarchy through structure and restraint",
      goal: "Make importance legible without relying on decoration.",
      instructions: [
        "Use spacing, grouping, typography, surface contrast, and action prominence to establish hierarchy.",
        "Avoid unnecessary nested cards, borders, separators, and competing primary actions.",
        "Keep repeated structures visually consistent and align related content to a shared rhythm.",
        "Do not introduce gradients or shadows as substitutes for hierarchy; UI Lab relies on surfaces, borders, and spacing.",
      ],
    },
    {
      title: "Use the token vocabulary",
      goal: "Keep color choices theme-compatible and semantically coherent.",
      instructions: [
        "Use background tokens for page and surface layers, foreground tokens for text and neutral borders, accent for primary emphasis, and success, danger, warning, or info for semantic states.",
        "Use background shades 500–950, foreground shades 50–400, and accent or semantic shades 50–600.",
        "Prefer component variants and defaults before adding token classes through a supported className or styles API.",
        "Do not use generic Tailwind palette colors, raw hex values, or arbitrary color values alongside UI Lab tokens.",
      ],
    },
    {
      title: "Preserve interaction meaning",
      goal: "Make every state understandable and every action proportionate to its consequence.",
      instructions: [
        "Reserve primary emphasis for the main action in a local context and danger styling for destructive actions.",
        "Provide clear hover, pressed, focus, selected, disabled, loading, empty, success, and error states when the interaction can produce them.",
        "Use labels and supporting text to explain intent; do not rely on color or icons alone.",
        "Keep destructive and irreversible actions distinct and require confirmation when consequences warrant it.",
      ],
    },
    {
      title: "Keep accessibility and responsiveness structural",
      goal: "Ensure the interface remains usable across input methods, content sizes, and viewports.",
      instructions: [
        "Preserve native semantics and UI Lab accessibility behavior instead of replacing controls with clickable generic elements.",
        "Give controls accessible names, maintain visible focus, and keep keyboard order aligned with the visual order.",
        "Allow content to wrap and reflow; do not depend on fixed dimensions that break with longer text or smaller viewports.",
        "Prefer fewer, meaningful responsive changes over separate desktop and mobile component trees.",
      ],
    },
  ],
  validation: [
    "The component tree reflects content and behavior rather than decorative wrappers.",
    "UI Lab components, variants, and supported style slots are used before custom replacements.",
    "Colors use the UI Lab token families and valid shade ranges.",
    "Hierarchy remains clear without gradients, shadows, or excessive containers.",
    "Interactive states, accessible names, focus behavior, and keyboard order are accounted for.",
    "The layout can reflow for narrow viewports and variable content.",
  ],
  relatedTools: ["get_component", "search_workshop", "search_guides"],
  relatedGuides: [
    "setup-ui-lab-in-project",
    "theme-switching-nextjs",
    "translate-existing-ui-to-ui-lab",
  ],
};

export default foundationGuide;
