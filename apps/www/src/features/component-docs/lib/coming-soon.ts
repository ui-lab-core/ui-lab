import type { ComponentCategory } from "ui-lab-registry";

export type SiteComponentCategory = ComponentCategory;

export type SiteComponentCategoryDefinition = {
  id: SiteComponentCategory;
  name: string;
  label: string;
  description: string;
  iconName: string;
};

type ComingSoonComponent = {
  id: string;
  name: string;
  description: string;
  category: SiteComponentCategory;
};

export const comingSoonComponents: ComingSoonComponent[] = [
  {
    id: "toolbar",
    name: "Toolbar",
    description: "Groups action buttons into a structured strip for operations.",
    category: "composition",
  },
  {
    id: "voice",
    name: "Voice",
    description: "Captures voice input with recording controls and audio visualization.",
    category: "action",
  },
  {
    id: "carousel",
    name: "Carousel",
    description: "Cycles through content slides with navigation controls for browsing.",
    category: "navigation",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Shows events along a chronological axis for history and progress.",
    category: "information",
  },
  {
    id: "loading",
    name: "Loading",
    description: "Displays an animated indicator to communicate ongoing activity.",
    category: "feedback",
  },
  {
    id: "alert",
    name: "Alert",
    description: "Surfaces important messages inline to inform or warn users.",
    category: "feedback",
  },
  {
    id: "image",
    name: "Image",
    description: "Displays responsive images with framing, loading, and presentation controls.",
    category: "media",
  },
  {
    id: "video",
    name: "Video",
    description: "Embeds video content with playback framing and responsive presentation.",
    category: "media",
  },
];
