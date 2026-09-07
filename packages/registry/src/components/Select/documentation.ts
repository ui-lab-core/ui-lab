import type { ComponentStyleDocumentation } from "../../types";

import { variableReference } from "./variable-reference";

export const styleDocumentation = {
  variableReference,
  quickStart: {
    title: "How to style Select",
    description:
      "Start with className on the root, use styles for named anatomy, override CSS variables when one decision should cascade, and reach for state attributes when the change depends on interaction.",
    recipes: [
      {
        title: "Size the Select root",
        description: "Give longer labels room to breathe. Compare the wider wrapper with the default width.",
        code: '<Select className="w-80 max-w-full">...</Select>',
      },
      {
        title: "Style named anatomy",
        description:
          "Use styles when a change belongs to a specific element inside a subcomponent. Nested groups are addressed as objects.",
        code: `<Select.Trigger
  icon={{ prefix: <Globe /> }}
  styles={{
    root: "rounded-xl ring-2 ring-accent-500/50",
    value: "px-5 py-3 font-semibold",
    icon: { left: "text-accent-500", right: "text-accent-500", section: "bg-accent-500/15 px-4" },
  }}
/>`,
      },
      {
        title: "Cascade a decision with variables",
        description:
          "Set variables on the Select root when several parts and states should follow one value.",
        code: `.select {
  --background: color-mix(in srgb, var(--accent-500) 18%, var(--background-950));
  --foreground: var(--foreground-100);

  @slot trigger {
    --padding-inline: 1rem;
    --background-hover: color-mix(in srgb, var(--accent-500) 25%, transparent);
  }
}`,
      },
      {
        title: "Style option states",
        description:
          "State attributes keep highlight, selection, and disabled styling next to the option.",
        code: `<Select.Item
  value="design"
  styles={{
    root: "data-[highlighted=true]:bg-accent-500/20 data-[selected=true]:text-accent-400 data-[selected=true]:font-semibold data-[disabled=true]:opacity-30 data-[disabled=true]:line-through",
  }}
>
  Design
</Select.Item>`,
      },
    ],
    notice:
      "Select.Content and Select.SubContent are portalled to the document body. The overlay carries the global select class, so root-scoped CSS variables still reach the panel, and inline styles supplied to the root style slot are copied onto the overlay. A class on the Select root is not an ancestor of the panel, so use Select.Content's own className or styles instead.",
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Hover or focus a subcomponent to spotlight it within the complete Select. SearchableTrigger reveals the input; submenu parts reveal the nested panel. Choose a part to explore its slots and matching Onyx CSS scopes. Dotted styles names such as icon.left are supplied as nested objects; @slot scopes CSS variables.",
    groupOrder: [
      "SelectStyleSlots",
      "SelectTriggerStyleSlots",
      "SearchableTriggerStyleSlots",
      "SelectValueStyleSlots",
      "SelectContentStyleSlots",
      "SelectListStyleSlots",
      "SelectItemStyleSlots",
      "SelectGroupStyleSlots",
      "SelectSeparatorStyleSlots",
      "SelectSubTriggerStyleSlots",
      "SelectSubContentStyleSlots",
    ],
    groupLabels: {
      SelectStyleSlots: "Select",
      SelectTriggerStyleSlots: "Select.Trigger",
      SearchableTriggerStyleSlots: "Select.SearchableTrigger",
      SelectValueStyleSlots: "Select.Value",
      SelectContentStyleSlots: "Select.Content",
      SelectListStyleSlots: "Select.List",
      SelectItemStyleSlots: "Select.Item",
      SelectGroupStyleSlots: "Select.Group",
      SelectSeparatorStyleSlots: "Select.Separator",
      SelectSubTriggerStyleSlots: "Select.SubTrigger",
      SelectSubContentStyleSlots: "Select.SubContent",
    },
  },
  customization: {
    title: "Customize Select",
    description:
      "Start with these variables for common Select changes. Set them on the Select root; the component passes them to the trigger, the floating panel, and their states. Trigger-only values live in the trigger slot scope.",
    groups: [
      {
        title: "Colors and text",
        description:
          "Control the Select fill, label, icon, and secondary text. The floating panel also carries the Select root class, so these values reach the options unless a theme overrides them further down.",
        variables: [
          {
            name: "--background",
            selector: ".select",
            description: "Sets the fill behind the trigger and the floating panel.",
          },
          {
            name: "--foreground",
            selector: ".select",
            description: "Sets the label and option text color.",
          },
          {
            name: "--icon-foreground",
            selector: ".select",
            description: "Sets the color inherited by the value icon and option icons.",
          },
          {
            name: "--foreground-muted",
            selector: ".select",
            description:
              "Sets the color of the placeholder, option descriptions, group titles, and the empty-results message.",
          },
          {
            name: "--size",
            selector: ".select",
            description: "Sets the font size shared by the trigger, the value section, and options.",
          },
        ],
        code: `.select {
  --background: color-mix(in srgb, var(--accent-500) 12%, var(--background-950));
  --foreground: var(--foreground-100);
  --icon-foreground: var(--accent-500);
  --foreground-muted: var(--foreground-400);
  --size: 1rem;
}`,
      },
      {
        title: "Border and shape",
        description: "Adjust the border and corner radius without replacing Select's structural CSS.",
        variables: [
          {
            name: "--width",
            selector: ".select",
            slot: "border",
            description: "Sets the border width of the Select surface and the floating panel.",
          },
          {
            name: "--style",
            selector: ".select",
            slot: "border",
            description: "Sets the border style.",
          },
          {
            name: "--background",
            selector: ".select",
            slot: "border",
            description: "Sets the border color, and the color of Select.Separator.",
          },
          {
            name: "--background-radius",
            selector: ".select",
            description:
              "Sets the outer corner radius. The inner value and icon sections derive their radius from it.",
          },
        ],
        code: `.select {
  --background-radius: 1rem;

  @slot border {
    --width: 2px;
    --style: solid;
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Trigger padding and hover",
        description:
          "The trigger's spacing and hover fill are scoped to the trigger part, so they can change without affecting the panel.",
        variables: [
          {
            name: "--padding-inline",
            selector: ".select",
            slot: "trigger",
            description:
              "Sets the horizontal padding of the value section, the icon section, and the searchable trigger's chevron section.",
          },
          {
            name: "--padding-block",
            selector: ".select",
            slot: "trigger",
            description: "Sets the vertical padding of the value and icon sections.",
          },
          {
            name: "--background-hover",
            selector: ".select",
            slot: "trigger",
            description:
              "Sets the fill shown behind the hovered value and icon sections. It is transparent when unset.",
          },
        ],
        code: `.select {
  @slot trigger {
    --padding-inline: 1.25rem;
    --padding-block: 0.875rem;
    --background-hover: color-mix(in srgb, var(--accent-500) 25%, transparent);
  }
}`,
      },
      {
        title: "States and timing",
        description:
          "Open, pressed, and disabled states read their own values from the Select root, and the hover transition uses the shared interaction timing contract.",
        variables: [
          {
            name: "--background",
            selector: '.select[data-open="true"]',
            description: "Sets the fill while the option panel is open.",
          },
          {
            name: "--background",
            selector: '.select[data-pressed="true"]:not([data-disabled])',
            description: "Sets the fill while the trigger is pressed.",
          },
          {
            name: "--disabled-opacity",
            selector: ".select",
            description: "Sets the opacity applied to a disabled Select and to disabled options.",
          },
          {
            name: "--hover-enter-duration",
            selector: ".select",
            description: "Sets how quickly the trigger hover fill appears.",
          },
          {
            name: "--hover-leave-duration",
            selector: ".select",
            description: "Sets how slowly the trigger hover fill fades out.",
          },
          {
            name: "--hover-transition-timing-function",
            selector: ".select",
            description: "Sets the easing used by the hover fill transition.",
          },
        ],
        code: `.select {
  --disabled-opacity: 0.3;
  --hover-enter-duration: 0ms;
  --hover-leave-duration: 450ms;
  --hover-transition-timing-function: var(--ease-snappy-pop);

  @slot trigger {
    --background-hover: color-mix(in srgb, var(--accent-500) 25%, transparent);
  }
}

.select[data-open="true"] {
  --background: color-mix(in srgb, var(--accent-500) 18%, var(--background-950));
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
