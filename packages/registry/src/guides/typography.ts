import type { GuideMetadata } from "../types.js";

const guide: GuideMetadata = {
  id: "typography",
  name: "Fonts And Typography",
  description: "Configure UI Lab font sources, font variables, and prose typography without browser-default fonts.",
  category: "setup",
  summary: "Use CLI-generated fonts.css and typography.css, loaded in the canonical cascade order.",
  tags: ["typography", "fonts", "fontsource", "vite", "nextjs"],
  whenToUse: ["Setting up UI Lab", "Text renders with browser-default fonts", "A screen includes prose typography"],
  notFor: ["Do not hand-copy an incomplete font scale when CLI setup is available."],
  taskMatchers: ["typography", "fonts", "font source", "typography css"],
  prerequisites: ["UI Lab CLI setup with the Onyx theme."],
  steps: [{
    title: "Generate and load fonts and typography",
    goal: "Load real font sources and the canonical hierarchy.",
    instructions: [
      "Run ui-lab init with --font work-sans|inter|manrope and --typography; Work Sans is the default and JetBrains Mono is included for monospace.",
      "The CLI creates fonts.css and typography.css. Fonts must load after the Onyx base and before theme overrides; typography loads after component styles.",
      "Do not add ad hoc web-font @imports or invent type sizes when these generated files are present.",
    ],
  }],
  validation: ["fonts.css is imported.", "typography.css is imported after component styles.", "Font variables resolve to the selected Fontsource packages."],
  relatedTools: ["search_guides"],
  relatedGuides: ["setup-ui-lab-in-project", "theme-switching-vite", "theme-switching-nextjs"],
  examplePrompts: [{ title: "Typography setup", prompt: "Configure UI Lab fonts and typography in this app." }],
};
export default guide;
