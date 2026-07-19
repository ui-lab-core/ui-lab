export interface Entry {
  version: string;
  date: string;
  title: string;
  description?: string;
  changes: string[];
}

export interface MonthGroup {
  id: string;
  label: string;
  entries: Entry[];
}

const entries: Entry[] = [
  {
    version: "0.3.49",
    date: "2026-06-10",
    title: "Typography metrics and scroll lock overhaul",
    description:
      "A ground-up rework of the typography system alongside a redesigned landing experience.",
    changes: [
      "New typography metrics API with per-category font configuration",
      "Overhauled scroll lock behavior, now wired into Modal and Select",
      "Landing page redesign with improved sidebar layout",
    ],
  },
  {
    version: "0.3.48",
    date: "2026-05-28",
    title: "Registry refresh",
    changes: [
      "Public registry and site metadata refreshed from the latest library examples",
      "Live elements, sections, and patterns now match current source content",
    ],
  },
  {
    version: "0.3.47",
    date: "2026-05-28",
    title: "Form control refinements",
    changes: [
      "Cleaner single-child grouping in Group",
      "Stable Select value rendering",
      "Reduced motion in Checkbox and Radio for calmer form controls",
    ],
  },
  {
    version: "0.3.46",
    date: "2026-05-27",
    title: "Live previews and authentication",
    description:
      "Patterns and sections now render as live previews, backed by new authentication and entitlement support.",
    changes: [
      "Live previews for patterns and sections",
      "Convex and Clerk authentication with premium entitlement support",
      "Custom Shiki code themes and new theme configuration options",
      "Removed legacy dev example pages",
    ],
  },
  {
    version: "0.3.45",
    date: "2026-05-11",
    title: "Component styling and focus management",
    description:
      "A broad accessibility and styling pass across nine components.",
    changes: [
      "Overhauled Badge, Banner, Flex, Grid, List, Popover, Progress, Slider, and Tabs",
      "New useFocus hook for consistent focus management",
      "Improved accessibility semantics throughout",
    ],
  },
  {
    version: "0.3.44",
    date: "2026-04-14",
    title: "Focus indicators",
    changes: [
      "New focus indicator infrastructure across all interactive components",
      "Accessibility improvements and style refinements",
    ],
  },
  {
    version: "0.3.43",
    date: "2026-04-07",
    title: "Package reference fix",
    changes: [
      "Package references now point to published npm versions instead of workspace links",
    ],
  },
  {
    version: "0.3.42",
    date: "2026-04-07",
    title: "Surface and list refresh",
    changes: [
      "Refreshed styles across List, Table, Divider, Frame, Popover, Tooltip, and Badge",
      "New List.Title subcomponent",
      "Tabs defaultValue prop renamed to default",
      "Fixed Group sizing, Menu trigger forwarding, and Select/Scroll scrollbar rendering",
    ],
  },
  {
    version: "0.3.41",
    date: "2026-03-30",
    title: "Server-side rendering support",
    description:
      "Core overlay and utility components no longer require a client boundary.",
    changes: [
      "Anchor, Mask, Scroll, and Tooltip are now SSR-compatible",
      "Anchor previews use Tooltip with an arrow indicator",
      "New preview prop for hover previews in server components",
    ],
  },
  {
    version: "0.3.4",
    date: "2026-03-28",
    title: "Styling system improvements",
    changes: [
      "Better typography and layout support in the component styling system",
      "Enhanced component examples and metadata in the registry",
      "Fixed styling issues in Divider and Checkbox",
    ],
  },
  {
    version: "0.3.3",
    date: "2026-03-27",
    title: "Onyx theme release",
    changes: ["Onyx theme package added to the release pipeline"],
  },
  {
    version: "0.3.2",
    date: "2026-03-24",
    title: "Visual consistency pass",
    changes: [
      "Refined typography sizing across Badge, Banner, Button, and Anchor",
      "Improved hover interaction styles",
    ],
  },
  {
    version: "0.3.1",
    date: "2026-03-24",
    title: "Floating positioning fixes",
    changes: [
      "Fixed floating positioning in Select, Tooltip, and Popover",
      "Cookie-based server-side theme support",
      "Updated color mode API for easier theme integration",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-03-19",
    title: "Semantic theme system",
    description:
      "The theme system was redesigned around CSS variables and semantic color tokens.",
    changes: [
      "New theme architecture with semantic color tokens",
      "Onyx theme introduced",
      "Textarea maxHeight prop for scroll-constrained inputs",
      "Searchable Select trigger with better accessibility",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-03-17",
    title: "List controls and API simplification",
    description:
      "New composable list controls, with simplified APIs across form and overlay components.",
    changes: [
      "List.Controls — checkbox, switch, input, and select wrappers",
      "Select valueLabel prop for SSR label persistence",
      "Simplified Switch and Modal APIs",
      "Removed Breadcrumbs and Confirmation components",
    ],
  },
];

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function getMonthGroups(): MonthGroup[] {
  const groups: MonthGroup[] = [];

  for (const entry of entries) {
    const label = formatter.format(new Date(entry.date));
    const id = label.toLowerCase().replace(/\s+/g, "-");
    const group = groups.at(-1);

    if (group && group.id === id) {
      group.entries.push(entry);
    } else {
      groups.push({ id, label, entries: [entry] });
    }
  }

  return groups;
}
