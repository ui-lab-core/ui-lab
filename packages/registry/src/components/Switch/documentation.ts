import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Switch",
    description:
      "Use className for root layout, styles for the track and thumb, CSS variables for switch geometry, and data attributes for checked or disabled states.",
    recipes: [
      {
        title: "Resize the root",
        description: "Use className to set root variables when only the switch width needs to change.",
        code: '<Switch className="[--width:3rem]" aria-label="Notifications" />',
      },
      {
        title: "Style the track and thumb",
        description: "Use named anatomy slots when the visual change belongs to one switch part.",
        code: `<Switch
  aria-label="Notifications"
  styles={{
    track: "bg-foreground-800",
    thumb: "bg-accent-400",
  }}
/>`,
      },
      {
        title: "Adjust switch geometry",
        description: "Set root variables when track and thumb measurements should stay coordinated.",
        code: `<Switch
  aria-label="Notifications"
  style={{
    "--width": "3rem",
    "--height": "1.5rem",
    "--thumb-size": "1.2rem",
  } as React.CSSProperties}
/>`,
      },
      {
        title: "Style checked state",
        description: "Target the root's stable selected attribute for state-driven styling.",
        code: `<Switch
  aria-label="Notifications"
  styles={{ root: "data-[selected=true]:[--background:var(--accent-600)]" }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Switch slot to style the corresponding stable element.",
    groupOrder: ["SwitchStyleSlots"],
    groupLabels: {
      SwitchStyleSlots: "Switch",
    },
  },
} satisfies ComponentStyleDocumentation;
