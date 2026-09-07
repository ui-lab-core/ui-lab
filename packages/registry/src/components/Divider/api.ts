import type { APIEnumValue, ComponentAPIEnrichment } from "../../types";

const optionsByProp: Record<string, APIEnumValue[]> = {
  variant: [
    { value: "solid", description: "Renders a continuous line." },
    { value: "dashed", description: "Renders a line of evenly spaced dashes." },
    { value: "dotted", description: "Renders a line of evenly spaced dots." },
  ],
  orientation: [
    { value: "horizontal", description: "Spans the full width and separates stacked content." },
    {
      value: "vertical",
      description: "Stretches to the cross-axis height and separates inline content.",
    },
  ],
  size: [
    { value: "sm", description: "The thinnest divider thickness." },
    { value: "md", description: "The default divider thickness." },
    { value: "lg", description: "The thickest divider thickness." },
    {
      value: "auto",
      description: "Uses the theme's base border width instead of a fixed thickness.",
    },
  ],
  spacing: [
    { value: "none", description: "No margin around the divider." },
    { value: "sm", description: "A small margin around the divider." },
    { value: "md", description: "A medium margin around the divider." },
    { value: "lg", description: "A large margin around the divider." },
  ],
};

export const apiEnrichment = {
  refine: (api) => ({
    ...api,
    props: api.props.map((prop) =>
      optionsByProp[prop.name] ? { ...prop, enumValueDetails: optionsByProp[prop.name] } : prop,
    ),
  }),
} satisfies ComponentAPIEnrichment;
