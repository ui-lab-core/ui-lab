import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Progress",
    description:
      "Use className for root layout, styles for named Progress anatomy, root CSS variables for values that cascade, and state attributes for mode-specific treatment.",
    recipes: [
      {
        title: "Size the progressbar",
        description: "Use className to control the root width or placement.",
        code: '<Progress className="w-72" value={60} label="Uploading" />',
      },
      {
        title: "Style label anatomy",
        description: "Use nested label slots for the visible row, label, and percentage.",
        code: `<Progress
  value={60}
  label="Uploading"
  showValue
  styles={{
    label: {
      row: "text-foreground-300",
      label: "font-medium",
      value: "text-accent-400",
    },
    range: "bg-accent-500",
  }}
/>`,
      },
      {
        title: "Cascade component variables",
        description: "Set variables on the root when track and thumb geometry should inherit one decision.",
        code: `<Progress
  value={60}
  show-controls
  style={{
    "--size": "0.5rem",
    "--progress-thumb-size": "0.75rem",
  } as React.CSSProperties}
/>`,
      },
      {
        title: "Style progress states",
        description: "Target stable range state attributes from the range slot.",
        code: `<Progress
  indeterminate
  styles={{
    range: "data-[indeterminate=true]:bg-accent-500",
  }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Progress slot to style the corresponding stable element.",
    groupOrder: ["ProgressLabelStyleSlots", "ProgressStyleSlots"],
    groupLabels: {
      ProgressLabelStyleSlots: "Progress label",
      ProgressStyleSlots: "Progress",
    },
  },
} satisfies ComponentStyleDocumentation;
