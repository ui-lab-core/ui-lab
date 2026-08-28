import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Group",
    description:
      "Start with className for the group's own size and layout, then use styles for named anatomy, CSS variables for decisions that should cascade to every item, and data attributes for state.",
    recipes: [
      {
        title: "Size and lay out the group",
        description:
          "Use className when the group root is all you need to change. Group forwards w-full and flex-1 to its focus scope wrapper so those utilities take effect.",
        code: `<Group className="w-full" spacing="sm">
  <Group.Button>Save</Group.Button>
  <Group.Button>Cancel</Group.Button>
</Group>`,
      },
      {
        title: "Style named anatomy slots",
        description:
          "Use styles for changes that belong to a specific part. The item slot accepts one shared class or the keyed form that addresses individual wrappers.",
        code: `<Group
  styles={{
    root: "shadow-sm",
    item: { first: "pl-1", last: "pr-1", divider: "opacity-60" },
    button: "font-medium",
    input: "min-w-40",
  }}
>
  <Group.Button>Bold</Group.Button>
  <Divider />
  <Group.Input aria-label="Search" />
</Group>`,
      },
      {
        title: "Cascade one decision with CSS variables",
        description:
          "Set a variable on the group root and every part that consumes it follows, instead of repeating the same class on each slot.",
        code: `.group {
  --background: var(--background-950);
  --radius-sm: 0.75rem;

  @slot border {
    --background: var(--background-500);
  }
}`,
      },
      {
        title: "Style state from data attributes",
        description:
          "Group publishes its configuration and item roles as data attributes, and Group.Button publishes its toggle state, so state styling needs no extra props.",
        code: `<Group
  value={value}
  onChange={setValue}
  styles={{
    root: "data-[disabled=true]:opacity-50",
    item: { divider: "data-[divider=true]:mx-0.5" },
    button: "data-[selected=true]:bg-accent-500",
  }}
>
  <Group.Button value="list">List</Group.Button>
  <Group.Button value="grid">Grid</Group.Button>
</Group>`,
      },
    ],
    notice:
      "Group renders a focus scope wrapper above the role=\"group\" root, so className and styles.root land on the root rather than the outermost box; only the w-full and flex-1 utilities are forwarded to that wrapper. A Group.Select dropdown is portalled and is not a descendant of the group root, so target it through Select's own styles prop instead of a Group root selector.",
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Choose a named Group slot to style the corresponding region. Nested item anatomy is addressed with dotted paths such as item.first and item.divider. Every wrapper also carries the shared item class, and a separator wrapper adds divider, so themes can target .group > .item and .group > .item.divider.",
    groupOrder: ["GroupItemStyleSlots", "GroupStyleSlots"],
    groupLabels: {
      GroupItemStyleSlots: "Group item",
      GroupStyleSlots: "Group",
    },
  },
  customization: {
    title: "Customize Group",
    description:
      "Start with these variables for common Group changes. Set them on the group root; the component passes them to the connected surface, its border, and every grouped control.",
    groups: [
      {
        title: "Colors",
        description: "Control the connected surface fill and the text color items inherit.",
        variables: [
          {
            name: "--background",
            selector: ".group",
            description: "Sets the fill behind the grouped items.",
          },
          {
            name: "--foreground",
            selector: ".group",
            description: "Sets the text color the grouped items inherit.",
          },
        ],
        code: `.group {
  --background: var(--background-950);
  --foreground: var(--foreground-200);
}`,
      },
      {
        title: "Border and shape",
        description:
          "Adjust the outer border and corner radius. The radius flows into the inner radius each item uses, so the first and last items stay flush with the group edge.",
        variables: [
          {
            name: "--width",
            selector: ".group",
            slot: "border",
            description: "Sets the group border width, which is also subtracted from the inner item radius.",
          },
          {
            name: "--style",
            selector: ".group",
            slot: "border",
            description: "Sets the group border style.",
          },
          {
            name: "--background",
            selector: ".group",
            slot: "border",
            description:
              "Sets the group border color. A nested Divider inherits it as its own line color.",
          },
          {
            name: "--radius-sm",
            selector: ".group",
            description: "Sets the outer corner radius that the item radii are derived from.",
          },
        ],
        code: `.group {
  --radius-sm: 0.75rem;

  @slot border {
    --width: 1px;
    --style: solid;
    --background: var(--background-500);
  }
}`,
      },
      {
        title: "Size",
        description:
          "Change how tall a horizontal group is and how much block size each grouped control is guaranteed.",
        variables: [
          {
            name: "--control-height",
            selector: ".group",
            description:
              "Sets the block size of a horizontal group and the value each item's minimum height is derived from.",
          },
          {
            name: "--item-height",
            selector: ".group",
            description:
              "Overrides the minimum block size given to Group.Button, Group.Input, Group.Select, and Group.Expand.",
          },
        ],
        code: `.group {
  --control-height: 2.25rem;
  --item-height: 1.75rem;
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
