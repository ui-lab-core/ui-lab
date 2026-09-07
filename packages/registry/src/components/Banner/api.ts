import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  props: [
    {
      name: "variant",
      type: "string",
      required: false,
      category: "Core",
      description: "Variant class appended to the root element. Accepts any string.",
    },
    {
      name: "dismissible",
      type: "boolean",
      required: false,
      category: "Core",
      description: "When true, renders a dismiss button that hides the banner on click.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      required: false,
      category: "Events",
      description: "Called when the dismiss button is clicked.",
    },
    {
      name: "styles",
      type: "BannerStylesProp",
      required: false,
      category: "Styling",
      description:
        "Keyed styles for the root and named component parts. Use className for conventional root classes.",
    },
  ],

  propGroups: [{ name: "Core" }, { name: "Events" }, { name: "Styling" }],

  refine: (api) => ({
    ...api,
    subComponents: {
      "Banner.Title": { description: "Heading text for the banner message", props: [] },
      "Banner.Body": { description: "Body text content of the banner", props: [] },
    },
  }),
} satisfies ComponentAPIEnrichment;
