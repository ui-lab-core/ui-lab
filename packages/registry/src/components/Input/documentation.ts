import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Input",
    description:
      "Use className for the input surface, styles for named anatomy, CSS variables for shared visual decisions, and data attributes for state-driven changes.",
    recipes: [
      {
        title: "Size the input surface",
        description: "Use className when only the outer input surface needs sizing or layout changes.",
        code: '<Input className="w-80" placeholder="Search" />',
      },
      {
        title: "Style nested anatomy",
        description: "Use dotted nested slots to target a specific adornment or icon wrapper.",
        code: `<Input
  icon={<SearchIcon />}
  styles={{
    adornments: { start: "ps-4" },
    icon: { left: "text-accent-500" },
  }}
/>`,
      },
      {
        title: "Set shared surface variables",
        description: "Set semantic variables on the root when its surface colors should cascade through the input.",
        code: '<Input style={{ "--background": "var(--background-900)", "--foreground": "var(--foreground-100)" }} />',
      },
      {
        title: "Style error state",
        description: "Use the persistent root data attribute for state-specific styling.",
        code: '<Input error className="data-[error=true]:ring-1 data-[error=true]:ring-danger-500" />',
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Input exposes stable root and nested anatomy slots through its styles prop.",
    groupOrder: ["InputStyleSlots"],
    groupLabels: {
      InputStyleSlots: "Input",
    },
  },
} satisfies ComponentStyleDocumentation;
