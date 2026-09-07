import type { GuideMetadata } from "../types.js";

const guide: GuideMetadata = {
  id: "theme-switching-vite",
  name: "Theme Setup And Switching In Vite React",
  description: "Install the complete Onyx foundation in Vite, wire Tailwind's Vite plugin, and configure first-paint color mode.",
  category: "theming",
  summary: "The Vite-specific theme path: CLI-generated Onyx base, fonts, local overrides, typography, Vite plugin, and index.html color-mode setup.",
  tags: ["theme", "vite", "react", "onyx", "fonts", "typography", "dark-mode"],
  whenToUse: ["The project is Vite React and needs UI Lab styling or theme switching."],
  notFor: ["Do not use the Next.js cookie/layout guide for Vite."],
  taskMatchers: ["theme switching vite", "ui lab vite theme", "vite dark mode"],
  prerequisites: ["A Vite React project and a known entry stylesheet."],
  steps: [
    {
      title: "Let the CLI install the full Vite foundation",
      goal: "Avoid incomplete hand-authored tokens and framework mismatch.",
      instructions: [
        "Run ui-lab init --non-interactive --framework vite --stylesheet <entry.css> --dry-run, then the same command without --dry-run.",
        "Keep theme onyx and typography enabled unless explicitly declined.",
        "The CLI installs ui-lab-theme-onyx and @tailwindcss/vite, updates vite.config, creates fonts.css, theme.css, and typography.css, and integrates index.html.",
      ],
      code: `ui-lab init --non-interactive --framework vite --stylesheet src/index.css`,
      language: "bash",
    },
    {
      title: "Preserve the generated cascade",
      goal: "Load the complete defaults before local overrides and component CSS.",
      instructions: ["Do not replace Onyx with theme.css; theme.css contains app overrides only."],
      code: `@import "tailwindcss";
@import "ui-lab-theme-onyx/styles.css";
@import "./fonts.css";
@import "./theme.css";
@import "ui-lab-components/styles.css";
@import "./typography.css";`,
      language: "css",
      path: "src/index.css",
    },
  ],
  validation: ["@tailwindcss/vite is registered.", "Onyx, fonts, overrides, components, and typography load in that order.", "ui-lab status reports configured: true."],
  relatedTools: ["search_guides", "get_component"],
  relatedGuides: ["setup-ui-lab-in-project", "typography"],
  examplePrompts: [{ title: "Vite setup", prompt: "Set up UI Lab and theme switching in this Vite React app." }],
};

export default guide;
