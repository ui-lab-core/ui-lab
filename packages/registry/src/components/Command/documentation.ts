import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Command",
    description:
      "Use className for the command surface, styles for named command anatomy, CSS variables for palette-wide values, and data attributes for overlay or option state.",
    recipes: [
      {
        title: "Size the command surface",
        description: "Use className for the embedded surface width or placement.",
        code: '<Command embedded open className="w-96">...</Command>',
      },
      {
        title: "Style item anatomy",
        description: "Use nested item slots when a change belongs to an option region.",
        code: `<Command
  styles={{
    item: {
      root: "rounded-md",
      icon: "text-accent-500",
      hint: "text-foreground-400",
    },
  }}
>
  ...
</Command>`,
      },
      {
        title: "Cascade palette variables",
        description: "Set height on the surface and portal positioning variables on the overlay slot.",
        code: `<Command
  open
  style={{ "--height": "24rem" } as React.CSSProperties}
  styles={{
    overlay: "[--origin:50%_12%] [--width:32rem]",
  }}
>
  ...
</Command>`,
      },
      {
        title: "Style option state",
        description: "Target the persistent highlighted state from the item root slot.",
        code: `<Command
  styles={{
    item: {
      root: "data-[highlighted=true]:bg-accent-900",
    },
  }}
>
  ...
</Command>`,
      },
    ],
    notice:
      "Floating Command content is portalled to document.body. A class on the Command surface is not an ancestor of the overlay; use the overlay slot or global .command hooks for floating backdrop styling.",
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Command slot to style its stable rendered element.",
    groupOrder: ["CommandStyleSlots", "CommandItemStyleSlots", "CommandGroupsStyleSlots"],
    groupLabels: {
      CommandStyleSlots: "Command",
      CommandItemStyleSlots: "Command.Item",
      CommandGroupsStyleSlots: "Command.Groups",
    },
  },
} satisfies ComponentStyleDocumentation;
