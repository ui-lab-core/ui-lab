import type { APIEnumValue, ComponentAPIEnrichment, PropDefinition } from "../../types";

/**
 * Hand-authored API documentation for Grid. The generator merges this over
 * what react-docgen-typescript extracts from the component source.
 */

const enumValueDetailsByProp: Record<string, APIEnumValue[]> = {
  justifyItems: [
    { value: "start", description: "Packs items to the start edge of their cell." },
    { value: "end", description: "Packs items to the end edge of their cell." },
    { value: "center", description: "Centers items within their cell." },
    { value: "stretch", description: "Stretches items to fill their cell's inline size." },
  ],
  alignContent: [
    { value: "start", description: "Packs grid rows to the start of the container's block axis." },
    { value: "end", description: "Packs grid rows to the end of the container's block axis." },
    { value: "center", description: "Centers grid rows on the container's block axis." },
    { value: "stretch", description: "Stretches grid rows to fill the container's block size." },
    {
      value: "space-between",
      description: "Distributes rows with the first and last flush against the container edges.",
    },
    {
      value: "space-around",
      description: "Distributes rows with equal space surrounding each row.",
    },
    {
      value: "space-evenly",
      description: "Distributes rows with equal space between and around every row.",
    },
  ],
  autoFlow: [
    {
      value: "row",
      description: "Fills each row in turn, adding new rows for overflow items.",
    },
    {
      value: "column",
      description: "Fills each column in turn, adding new columns for overflow items.",
    },
    {
      value: "row-dense",
      description: "Fills rows in turn and backfills earlier gaps left by differently sized items.",
    },
    {
      value: "column-dense",
      description:
        "Fills columns in turn and backfills earlier gaps left by differently sized items.",
    },
  ],
  masonryColumnFill: [
    {
      value: "auto",
      description: "Fills columns sequentially, one after another.",
    },
    {
      value: "balance",
      description: "Balances content across columns to roughly equal length.",
    },
    {
      value: "balance-all",
      description: "Balances content across all columns, including the final one.",
    },
  ],
  layout: [
    { value: "cards", description: "A fluid card grid that tracks auto-fit to the available width." },
    {
      value: "dashboard",
      description: "A metric/overview row that steps from 1 to 2 to 4 columns as space appears.",
    },
    { value: "sidebar", description: "A fixed navigation rail beside fluid content." },
    { value: "sidebar-end", description: "Fluid content beside a fixed aside or table of contents." },
    { value: "split", description: "Two equal panes." },
    { value: "gallery", description: "A masonry gallery that steps from 1 to 2 to 3 columns." },
  ],
};

const justifyFlagDescriptions: Record<string, string> = {
  "justify-start": "Packs grid tracks to the start edge of the inline axis.",
  "justify-end": "Packs grid tracks to the end edge of the inline axis.",
  "justify-center": "Centers grid tracks on the inline axis.",
  "justify-between": "Distributes grid tracks with the first and last flush against the container edges.",
  "justify-around": "Distributes grid tracks with equal space surrounding each track.",
  "justify-evenly": "Distributes grid tracks with equal space between and around every track.",
};
const alignFlagDescriptions: Record<string, string> = {
  "align-start": "Aligns grid tracks to the start edge of the block axis.",
  "align-end": "Aligns grid tracks to the end edge of the block axis.",
  "align-center": "Centers grid tracks on the block axis.",
  "align-stretch": "Stretches grid tracks to fill the block axis.",
  "align-baseline": "Aligns grid tracks to a shared text baseline.",
};
const flagDescriptions: Record<string, string> = {
  ...justifyFlagDescriptions,
  ...alignFlagDescriptions,
};

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    GridStyleSlots: {
      name: "GridStyleSlots",
      summary: "Style overrides for the Grid root element.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles the grid root element.",
        },
      ],
    },
    GridColumns: {
      name: "GridColumns",
      summary: "Column count or auto-placement keyword accepted by columns.",
      type: 'number | "auto-fit" | "auto-fill"',
      kind: "alias",
      notes: [
        "A number becomes a fixed track count. auto-fit and auto-fill create as many 200px-minimum tracks as fit the available width, collapsing or keeping empty tracks respectively.",
      ],
    },
    GridRows: {
      name: "GridRows",
      summary: "Fixed row count or auto-placement keyword accepted by rows.",
      type: '"1" | "2" | "3" | "4" | "5" | "6" | "auto" | "masonry"',
      kind: "alias",
      notes: [
        "masonry falls back to a CSS multi-column layout, since grid-template-rows: masonry is not supported by Chromium or WebKit.",
      ],
    },
    GridTemplateColumns: {
      name: "GridTemplateColumns",
      summary: "grid-template-columns value accepted by columns.",
      type: "GridColumns | (string & {})",
      kind: "alias",
      notes: ["Known column keywords are accepted without preventing an arbitrary CSS value."],
    },
    GridTemplateRows: {
      name: "GridTemplateRows",
      summary: "grid-template-rows value accepted by rows.",
      type: "GridRows | (string & {})",
      kind: "alias",
      notes: ["Known row keywords are accepted without preventing an arbitrary CSS value."],
    },
    GridMasonryColumnWidth: {
      name: "GridMasonryColumnWidth",
      summary: "An open CSS width value accepted by masonryColumnWidth.",
      type: "string & {}",
      kind: "alias",
      examples: ['masonryColumnWidth="18rem"', 'masonryColumnWidth="max(22rem, 40vw)"'],
    },
    GapSize: {
      name: "GapSize",
      summary: "A design-system gap step name.",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      kind: "alias",
      values: [
        { value: "xs", description: "The smallest gap step." },
        { value: "sm", description: "A small gap step." },
        { value: "md", description: "The default, medium gap step." },
        { value: "lg", description: "A large gap step." },
        { value: "xl", description: "The largest gap step." },
      ],
    },
    GridGap: {
      name: "GridGap",
      summary: "Gap size accepted by gap, rowGap, and columnGap.",
      type: 'GapSize | "none" | number',
      kind: "alias",
      notes: [
        "A number maps directly to the Tailwind spacing scale, so gap={4} behaves like gap-4. none removes the gap entirely.",
      ],
    },
    SizingValue: {
      name: "SizingValue",
      summary: "A Tailwind spacing step or a CSS dimension value.",
      type: "number | (string & {})",
      kind: "alias",
      notes: [
        'A number maps to the Tailwind spacing scale. "full" and "screen" resolve to 100% and 100vw/100vh; any other string is used as a literal CSS value.',
      ],
    },
    ResponsiveValue: {
      name: "ResponsiveValue",
      summary:
        "Per-breakpoint override of a Grid value, applied at the sm, md, lg, and xl container-query breakpoints.",
      type: "{ sm?: T; md?: T; lg?: T; xl?: T }",
      kind: "interface",
      members: [
        {
          name: "sm",
          type: "T",
          required: false,
          description: "Value applied from the smallest supported container-query breakpoint up.",
        },
        {
          name: "md",
          type: "T",
          required: false,
          description: "Value applied from the md container-query breakpoint up.",
        },
        {
          name: "lg",
          type: "T",
          required: false,
          description: "Value applied from the lg container-query breakpoint up.",
        },
        {
          name: "xl",
          type: "T",
          required: false,
          description: "Value applied from the xl container-query breakpoint up.",
        },
      ],
      notes: [
        "Supplying any prop as a ResponsiveValue wraps Grid's root in a container-query parent, so breakpoints track the container's width rather than the viewport.",
      ],
    },
  },

  props: [
    {
      name: "children",
      type: "React.ReactNode",
      required: false,
      category: "Content",
      description: "Grid items rendered as direct children of the grid.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      category: "Styling",
      description:
        "Adds conventional classes to the root grid element after its default classes and before styles.root.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      category: "Styling",
      description:
        "Applies inline styles to the root element. Merges with the styles Grid derives from columns, rows, gap, h, and w; explicit CSS custom properties such as --background cascade to the grid surface even when a responsive layout wraps it in a container-query parent.",
    },
  ],

  propGroups: [
    { name: "Core" },
    { name: "Alignment" },
    { name: "Masonry" },
    { name: "Content" },
    { name: "Styling" },
  ],

  stateAttributes: [
    {
      name: "data-container-responsive",
      description:
        "Marks the outer wrapper rendered when columns, rows, gap, or masonryColumnWidth is set to a responsive object, or when containerQueryResponsive is true. Omitted when Grid renders as a single element.",
      values: ["true"],
    },
    {
      name: "data-gap",
      description:
        'The resolved gap value serialized as a string, such as "md", "none", or a numeric spacing step. Omitted when gap is set to a responsive object, since no single value applies.',
    },
    {
      name: "data-justify",
      description:
        "The active justify-content keyword, resolved from whichever justify-* flag prop is set. Always emitted; defaults to justify-start.",
      values: [
        "justify-start",
        "justify-end",
        "justify-center",
        "justify-between",
        "justify-around",
        "justify-evenly",
      ],
    },
    {
      name: "data-align",
      description:
        "The active align-items keyword, resolved from whichever align-* flag prop is set. Always emitted; defaults to align-stretch.",
      values: ["align-start", "align-end", "align-center", "align-stretch", "align-baseline"],
    },
    {
      name: "data-flow",
      description: "Mirrors the resolved autoFlow value. Always emitted.",
      values: ["row", "column", "row-dense", "column-dense"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map((prop: PropDefinition) => {
      let next = prop;
      if (enumValueDetailsByProp[prop.name]) {
        next = { ...next, enumValueDetails: enumValueDetailsByProp[prop.name] };
      }
      if (flagDescriptions[prop.name]) {
        next = { ...next, category: "Alignment", description: flagDescriptions[prop.name] };
      }
      return next;
    }),
  }),
} satisfies ComponentAPIEnrichment;
