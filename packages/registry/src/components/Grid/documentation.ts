import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Grid",
    description:
      "Start with className for root sizing, use styles.root when a conflicting default class needs to lose, and reach for CSS variables when a color decision should cascade through the grid surface.",
    recipes: [
      {
        title: "Size the root",
        description: "Use className and the h/w shorthand props to size the grid within its layout.",
        code: '<Grid className="max-w-4xl" columns={3} gap="md">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</Grid>',
      },
      {
        title: "Guarantee an override with styles.root",
        description:
          "styles.root is resolved after className, so it reliably wins over a conflicting default class such as a fixed column count.",
        code: '<Grid columns={3} styles={{ root: "grid-cols-[repeat(2,1fr)]" }}>\n  <div>1</div>\n  <div>2</div>\n</Grid>',
      },
      {
        title: "Cascade a color to the grid surface",
        description:
          "Set --background and --foreground on a class targeting the grid root; both are plain custom properties, so they inherit into the CSS grid element even when a responsive layout wraps it in a container-query parent.",
        code: `<Grid className="brand-grid" columns={3} gap="md">
  <div>1</div>
  <div>2</div>
</Grid>

/* .brand-grid {
  --background: var(--accent-950);
  --foreground: var(--accent-200);
} */`,
      },
    ],
    notice:
      "Setting columns, rows, gap, or masonryColumnWidth to a responsive object, or containerQueryResponsive to true, wraps Grid's actual CSS grid element in an outer container-query parent. The ref, native HTML attributes, h/w sizing, className, and styles.root all apply to that outer wrapper; CSS custom properties still inherit normally into the grid surface it contains.",
  },
  anatomy: {
    title: "Anatomy",
    description: "Grid exposes a single root style slot for the rendered CSS grid element.",
    groupOrder: ["GridStyleSlots"],
    groupLabels: {
      GridStyleSlots: "Grid",
    },
  },
  customization: {
    title: "Customize Grid",
    description:
      "Grid's root declares generic background and foreground variables. Set them on a class applied to the root to tint the grid surface without overriding rendered classes.",
    groups: [
      {
        title: "Surface colors",
        description: "Set the grid root's background and foreground colors.",
        variables: [
          {
            name: "--background",
            selector: ".grid",
            description: "Sets the grid root's background color. Defaults to transparent.",
          },
          {
            name: "--foreground",
            selector: ".grid",
            description: "Sets the grid root's text color. Defaults to inherit.",
          },
        ],
        code: `.brand-grid {
  --background: var(--accent-950);
  --foreground: var(--accent-200);
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
