import type { GuideMetadata } from "../types.js";

const guide: GuideMetadata = {
  id: "build-checklist",
  name: "Pre-Build UI Lab Checklist",
  description: "Required discovery and setup checks before writing a UI Lab screen.",
  category: "workflow",
  summary: "Validate foundation, inventory the screen, search form/layout compositions, resolve every component, and prevent native-control fallbacks.",
  tags: ["build", "checklist", "validation", "forms", "layout", "native html"],
  whenToUse: ["Before writing JSX for a new UI Lab screen."],
  notFor: ["This does not replace framework setup or component API documentation."],
  taskMatchers: ["build checklist", "pre build validation", "ui lab bill of materials"],
  prerequisites: ["UI Lab setup is complete and ui-lab status reports configured: true."],
  steps: [
    { title: "Validate the foundation", goal: "Prevent building on broken styles.", instructions: ["Confirm Onyx, fonts.css, theme.css, component styles, and typography.css exist and load in canonical order.", "Confirm Tailwind integration for the detected framework."] },
    { title: "Create the complete bill of materials", goal: "Discover all controls before JSX.", instructions: ["Inventory every action, field, selection control, label, feedback state, and layout primitive.", "Search workshop patterns separately for the screen domain, forms, and layout.", "Resolve every chosen component and fetch API; fetch usage for nesting and experimental components.", "Experimental means API stability risk, not 'use native HTML'. Use it unless its usage notes name a blocker and alternative."] },
    { title: "Audit the result at source level", goal: "Prevent silent native fallbacks.", instructions: ["Scan changed JSX for button, a, input, select, textarea, and styled native layout wrappers.", "Replace them with fetched UI Lab equivalents wherever one exists."] },
  ],
  validation: ["No JSX was written before the BOM was complete.", "All form and layout needs were searched.", "No native interactive element substitutes for an available UI Lab component."],
  relatedTools: ["search_workshop", "get_component", "search_guides"],
  relatedGuides: ["setup-ui-lab-in-project", "foundation"],
  examplePrompts: [{ title: "Todo form", prompt: "Prepare the UI Lab bill of materials for a todo form before building it." }],
};
export default guide;
