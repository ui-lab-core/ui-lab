import type { ComponentAPIEnrichment } from "../../types";

export const apiEnrichment = {
  props: [
    {
      name: "data",
      type: "T[]",
      required: true,
      category: "Core",
      description: "Array of data rows to display.",
    },
    {
      name: "columns",
      type: "Column<T>[]",
      required: true,
      category: "Core",
      description: "Column definitions including key, label, and optional render function.",
    },
    {
      name: "showFilters",
      type: "boolean",
      required: false,
      category: "Core",
      description: "Whether to show filter inputs above the table.",
    },
    {
      name: "scroll",
      type: '"auto" | "rows" | "none"',
      required: false,
      defaultValue: '"auto"',
      enumValues: ["auto", "rows", "none"],
      category: "Core",
      description:
        "What scrolls when the table does not fit. auto flows with the page and only creates a horizontal scroll port when the columns are too wide; rows scrolls the rows alone and needs a bounded height plus column widths; none never creates a scroll port.",
    },
    {
      name: "onRowClick",
      type: "(row: T) => void",
      required: false,
      category: "Events",
      description: "Called when a table row is clicked.",
    },
    {
      name: "onFilterChange",
      type: "(filters: Record<string, string>) => void",
      required: false,
      category: "Events",
      description: "Called when any column filter value changes.",
    },
    {
      name: "styles",
      type: "TableStylesProp",
      required: false,
      category: "Styling",
      description:
        "Keyed styles for the root and named component parts. Use className for conventional root classes.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description:
        "Optional composed table content. When omitted, the default header/body renderer is used.",
    },
  ],

  propGroups: [{ name: "Core" }, { name: "Content" }, { name: "Events" }, { name: "Styling" }],
} satisfies ComponentAPIEnrichment;
