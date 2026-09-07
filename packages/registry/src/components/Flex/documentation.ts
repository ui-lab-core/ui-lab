import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Flex",
    description:
      "Flex renders a single styleable root. Start with className for outer sizing, use styles.root for a scoped override, and reach for the emitted data attributes when a change depends on the resolved layout.",
    recipes: [
      {
        title: "Size the Flex root",
        description: "Constrain or grow the root with ordinary utility classes.",
        code: '<Flex gap="md" className="max-w-lg">...</Flex>',
      },
      {
        title: "Override the root style slot",
        description:
          "Use styles.root when a change should apply after className, such as an override supplied further down a composition chain.",
        code: `<Flex
  gap="md"
  styles={{ root: "rounded-xl border border-dashed border-accent-500/50" }}
>
  ...
</Flex>`,
      },
      {
        title: "Style by resolved layout state",
        description:
          "data-direction, data-wrap, data-justify, and data-align reflect the resolved layout, so a theme or utility selector can target a specific configuration.",
        code: `.flex[data-direction="column"] {
  padding-block: 1rem;
}`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Flex has one stable style target: its own root. The container-query parent rendered when containerQueryResponsive is enabled is layout plumbing for the responsive behavior, not a separate public style target.",
    groupOrder: ["FlexStyleSlots"],
    groupLabels: {
      FlexStyleSlots: "Flex",
    },
  },
} satisfies ComponentStyleDocumentation;
