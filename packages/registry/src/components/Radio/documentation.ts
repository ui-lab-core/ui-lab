import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Radio",
    description:
      "Use className to adjust the circle itself, styles for named anatomy slots such as the row or label, and stable data attributes for state-driven styling.",
    recipes: [
      {
        title: "Adjust the circle",
        description:
          "className applies to the radio circle (data-slot=\"root\"), not the outer row, so it targets the control's own appearance.",
        code: '<Radio label="Notify me" className="ring-2 ring-offset-2 ring-accent-500" />',
      },
      {
        title: "Style named anatomy",
        description:
          "Use styles when the change belongs to the row, label, description, or helper text instead of the circle.",
        code: `<Radio
  label="Notify me"
  description="Get an email when this changes"
  styles={{ item: "w-full", label: "text-accent-500" }}
/>`,
      },
      {
        title: "Style an interaction state",
        description: "Target the public state attributes from the root style slot.",
        code: `<Radio
  label="Notify me"
  styles={{ root: "data-[selected=true]:ring-2 data-[selected=true]:ring-accent-500" }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Choose a named Radio or Radio.Group slot to style the corresponding stable element.",
    groupOrder: ["RadioStyleSlots", "RadioGroupStyleSlots"],
    groupLabels: {
      RadioStyleSlots: "Radio",
      RadioGroupStyleSlots: "Radio.Group",
    },
  },
  customization: {
    title: "Customize Radio",
    description:
      "Start with these variables for common Radio changes. Set them on the .radio global class or a documented state branch; the component passes them to the circle and its border.",
    groups: [
      {
        title: "Colors",
        description:
          "Control the circle's fill. The inner dot reads the same variable, so overriding it recolors both together unless a state branch sets it separately.",
        variables: [
          {
            name: "--background",
            selector: ".radio",
            description: "Sets the circle's fill color, and the dot's color by inheritance.",
          },
        ],
        code: `.radio[data-selected="true"] {
  --background: var(--accent-500);
}`,
      },
      {
        title: "Border and shape",
        description: "Adjust the ring border without replacing Radio's structural CSS.",
        variables: [
          {
            name: "--width",
            selector: ".radio",
            slot: "border",
            description: "Sets the ring's border width.",
          },
          {
            name: "--style",
            selector: ".radio",
            slot: "border",
            description: "Sets the ring's border style.",
          },
          {
            name: "--background",
            selector: ".radio",
            slot: "border",
            description: "Sets the ring's border color.",
          },
          {
            name: "--background-error",
            selector: '.radio[data-error="true"]:not([data-selected="true"])',
            slot: "border",
            description: "Sets the ring's border color while error is set and the radio is unselected.",
          },
        ],
        code: `.radio {
  @slot border {
    --width: 2px;
    --style: solid;
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Disabled state",
        description: "Adjust how much the circle and label dim while disabled.",
        variables: [
          {
            name: "--disabled-opacity",
            selector: ".radio",
            description: "Sets the circle's and label's opacity while the row is disabled.",
          },
        ],
        code: `.radio {
  --disabled-opacity: 0.4;
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
