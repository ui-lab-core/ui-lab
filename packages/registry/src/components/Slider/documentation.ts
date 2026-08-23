import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Slider",
    description:
      "Use className for the root layout, styles for stable track anatomy, CSS variables for values that cascade through the slider, and data attributes for interaction state.",
    recipes: [
      {
        title: "Size the slider",
        description: "Use className to control the root width or placement.",
        code: '<Slider className="w-72" aria-label="Volume" defaultValue={40} />',
      },
      {
        title: "Style track anatomy",
        description: "Use named slots when a change belongs to the track, range, or every thumb.",
        code: `<Slider
  aria-label="Volume"
  defaultValue={40}
  styles={{
    track: "bg-foreground-800",
    range: "bg-accent-500",
    thumb: "bg-background-50 shadow-sm",
  }}
/>`,
      },
      {
        title: "Cascade slider variables",
        description: "Set component variables on the root when one value should affect the track or thumbs.",
        code: `<Slider
  aria-label="Volume"
  defaultValue={40}
  style={{
    "--slider-track-size": "0.5rem",
    "--slider-thumb-size": "1rem",
  } as React.CSSProperties}
/>`,
      },
      {
        title: "Style drag state",
        description: "Target the thumb's public state attributes from its style slot.",
        code: `<Slider
  aria-label="Volume"
  defaultValue={40}
  styles={{
    thumb: "data-[dragging=true]:scale-110 data-[focus-visible=true]:ring-2",
  }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Slider slot to style the corresponding stable element.",
    groupOrder: ["SliderStyleSlots"],
    groupLabels: {
      SliderStyleSlots: "Slider",
    },
  },
} satisfies ComponentStyleDocumentation;
