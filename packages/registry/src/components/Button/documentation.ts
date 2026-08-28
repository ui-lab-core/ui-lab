import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Button",
    description:
      "Start with className for the button's size and layout, then use styles for named content slots or state-specific styling.",
    recipes: [
      {
        title: "Size and align the button",
        description: "Use className when the root element is all you need to change.",
        code: '<Button className="w-full justify-start">Continue</Button>',
      },
      {
        title: "Style icon and hint slots",
        description: "Use styles for changes that belong to named content regions.",
        code: `<Button
  icon={{ left: <ArrowRight />, right: <ChevronRight /> }}
  hint="⌘↵"
  styles={{
    icon: { left: "text-accent-500", right: "text-foreground-400" },
    hint: "text-foreground-400",
  }}
>
  Continue
</Button>`,
      },
      {
        title: "Style an interaction state",
        description: "Target the public state attributes from the root style slot.",
        code: `<Button
  styles={{
    root: "data-[pressed=true]:scale-95 data-[disabled=true]:opacity-40",
  }}
>
  Save
</Button>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Button slot to style the corresponding region of the component.",
    groupOrder: ["ButtonIconStyleSlots", "ButtonStyleSlots"],
    groupLabels: {
      ButtonIconStyleSlots: "Button icon",
      ButtonStyleSlots: "Button",
    },
  },
  customization: {
    title: "Customize Button",
    description:
      "Start with these variables for common Button changes. Set them on the Button or a wrapping selector; the component passes them to the relevant parts and states.",
    groups: [
      {
        title: "Colors",
        description: "Control the button fill and label color.",
        variables: [
          {
            name: "--background",
            selector: ".button",
            description: "Sets the button fill color.",
          },
          {
            name: "--foreground",
            selector: ".button",
            description: "Sets the label color.",
          },
        ],
        code: `.button {
  --background: var(--accent-600);
  --foreground: var(--accent-50);
}`,
      },
      {
        title: "Icon",
        description:
          "Adjust the icon glyph's color and size independently of the button's own dimensions. Falls back to --icon-foreground, then currentColor, when unset.",
        variables: [
          {
            name: "--foreground",
            selector: ".button",
            slot: "icon",
            description: "Sets the icon color.",
          },
          {
            name: "--size",
            selector: ".button",
            slot: "icon",
            description: "Sets the icon glyph's width and height.",
          },
        ],
        code: `.button {
  @slot icon {
    --foreground: var(--accent-500);
    --size: 1.25rem;
  }
}`,
      },
      {
        title: "Border and shape",
        description: "Adjust the border without replacing Button's structural CSS.",
        variables: [
          {
            name: "--width",
            selector: ".button",
            slot: "border",
            description: "Sets the border width.",
          },
          {
            name: "--style",
            selector: ".button",
            slot: "border",
            description: "Sets the border style.",
          },
          {
            name: "--background",
            selector: ".button",
            slot: "border",
            description: "Sets the border color.",
          },
          {
            name: "--radius-sm",
            selector: ".button",
            description: "Sets the button corner radius in this scope.",
          },
        ],
        code: `.button {
  --radius-sm: 0.5rem;

  @slot border {
    --width: 1px;
    --style: solid;
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Spacing and icon-only sizing",
        description: "Change the Button's internal padding or make an icon-only Button larger.",
        variables: [
          {
            name: "--padding-inline",
            selector: ".button",
            description: "Sets horizontal padding.",
          },
          {
            name: "--padding-block",
            selector: ".button",
            description: "Sets vertical padding.",
          },
          {
            name: "--padding-inline-end",
            selector: ".button",
            description: "Overrides end padding when a hint needs different spacing.",
          },
          {
            name: "--size",
            selector: ".button.icon",
            description: "Sets the width and height of the icon-only Button root, distinct from the icon glyph's own --size.",
          },
        ],
        code: `.button {
  --padding-inline: 1rem;
  --padding-block: 0.625rem;
}

.button.icon {
  --size: 2.75rem;
}`,
      },
      {
        title: "Interaction states",
        description: "Provide state-specific border colors or adjust press feedback.",
        variables: [
          {
            name: "--background-hover",
            selector: '.button[data-hovered="true"]:not([data-disabled="true"])',
            slot: "border",
            description: "Sets the border color while hovered.",
          },
          {
            name: "--background-pressed",
            selector: '.button[data-pressed="true"]:not([data-disabled="true"])',
            slot: "border",
            description: "Sets the border color while pressed.",
          },
          {
            name: "--background-selected",
            selector: '.button[data-selected="true"]:not([data-disabled="true"])',
            slot: "border",
            description: "Sets the border color while selected.",
          },
          {
            name: "--press-transform",
            selector: '.button[data-pressed="true"]:not([data-disabled="true"])',
            description: "Overrides the press transform.",
          },
        ],
        code: `.button[data-hovered="true"] {
  @slot border {
    --background-hover: var(--accent-400);
  }
}

.button[data-pressed="true"] {
  --press-transform: scale(0.98);
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
