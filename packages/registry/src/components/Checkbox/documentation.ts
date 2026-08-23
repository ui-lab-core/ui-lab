import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Checkbox",
    description:
      "Use className for the checkbox row, styles for named anatomy slots, local CSS variables for coordinated color changes, and stable data attributes for state-driven styling.",
    recipes: [
      {
        title: "Size the root row",
        description: "Use className when the checkbox needs a different layout width or surrounding spacing.",
        code: '<Checkbox className="w-full" label="Accept terms" />',
      },
      {
        title: "Style named anatomy",
        description: "Use styles when the change belongs to the input, label, helper text, or a specific state icon.",
        code: `<Checkbox
  label="Accept terms"
  helper="Required to continue"
  styles={{
    checkbox: "border-accent-500",
    icon: { checkmark: "text-accent-500" },
    helperText: "text-foreground-400",
  }}
/>`,
      },
      {
        title: "Coordinate control colors",
        description: "Set semantic CSS variables on the root when the input background and icon foreground need coordinated values.",
        code: `<Checkbox
  label="Accept terms"
  style={{
    "--background": "var(--accent-600)",
    "--foreground": "var(--foreground-50)",
  } as React.CSSProperties}
/>`,
      },
      {
        title: "Style checked state",
        description: "Target the root's selected attribute for styles that apply only while the checkbox is checked.",
        code: `<Checkbox
  label="Accept terms"
  styles={{ root: "data-[selected=true]:[--background:var(--accent-600)]" }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Checkbox slot to style the corresponding stable element.",
    groupOrder: ["CheckboxStyleSlots"],
    groupLabels: {
      CheckboxStyleSlots: "Checkbox",
    },
  },
} satisfies ComponentStyleDocumentation;
