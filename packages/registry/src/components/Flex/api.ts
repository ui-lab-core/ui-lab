import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

const justifyDescriptions: Record<string, string> = {
  "justify-start":
    "Sets justify-content to flex-start, packing items toward the start of the main axis. The default when no justify flag or layout preset applies.",
  "justify-end": "Sets justify-content to flex-end, packing items toward the end of the main axis.",
  "justify-center":
    "Sets justify-content to center, packing items around the center of the main axis.",
  "justify-between":
    "Sets justify-content to space-between, distributing extra space evenly between items.",
  "justify-around":
    "Sets justify-content to space-around, distributing extra space evenly around each item.",
  "justify-evenly":
    "Sets justify-content to space-evenly, distributing extra space evenly between and around items.",
};
const alignDescriptions: Record<string, string> = {
  "align-start": "Sets align-items to flex-start, aligning items to the start of the cross axis.",
  "align-end": "Sets align-items to flex-end, aligning items to the end of the cross axis.",
  "align-center": "Sets align-items to center, centering items on the cross axis.",
  "align-stretch":
    "Sets align-items to stretch, filling the cross axis. The default when no align flag or layout preset applies.",
  "align-baseline": "Sets align-items to baseline, aligning items along their text baseline.",
};
const justifyMdn = "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content";
const alignMdn = "https://developer.mozilla.org/en-US/docs/Web/CSS/align-items";

const typeOverrides: Record<string, string> = {
  direction: "FlexDirection",
  gap: "FlexGap",
  "gap-x": "FlexGap",
  "gap-y": "FlexGap",
  h: "SizingValue",
  w: "SizingValue",
  layout: "FlexLayout",
  styles: "FlexStylesProp",
};
const defaultOverrides: Record<string, string> = {
  direction: '"row"',
  wrap: "false",
  gap: '"none"',
};

const enrichProp = (prop: PropDefinition): PropDefinition => {
  let next = prop;

  if (next.name in justifyDescriptions) {
    next = {
      ...next,
      category: "Layout",
      description: justifyDescriptions[next.name],
      tags: { ...next.tags, category: "Layout", mdn: justifyMdn },
      links: [{ label: "MDN", url: justifyMdn }],
    };
  } else if (next.name in alignDescriptions) {
    next = {
      ...next,
      category: "Layout",
      description: alignDescriptions[next.name],
      tags: { ...next.tags, category: "Layout", mdn: alignMdn },
      links: [{ label: "MDN", url: alignMdn }],
    };
  }

  if (typeOverrides[next.name]) {
    next = { ...next, type: typeOverrides[next.name] };
  }
  if (defaultOverrides[next.name] && next.defaultValue === undefined) {
    next = { ...next, defaultValue: defaultOverrides[next.name] };
  }

  return next;
};

export const apiEnrichment = {
  customTypes: {
    Style: {
      name: "Style",
      summary: "Class names accepted by Flex class-based style slots.",
      type: "string | (string | false | null | undefined)[]",
      kind: "alias",
      notes: [
        "Array entries support conditional classes; false, null, and undefined entries are ignored.",
      ],
    },
    FlexStyleSlots: {
      name: "FlexStyleSlots",
      summary: "Style overrides for the Flex root element.",
      type: "{ root?: Style }",
      kind: "interface",
      members: [
        {
          name: "root",
          type: "Style",
          required: false,
          description: "Styles applied to the root element.",
        },
      ],
    },
    FlexStylesProp: {
      name: "FlexStylesProp",
      summary: "Style overrides accepted by Flex.",
      type: "FlexStyleSlots",
      kind: "alias",
    },
    FlexDirection: {
      name: "FlexDirection",
      summary: "Axis flex items are laid out along.",
      type: '"row" | "column"',
      kind: "alias",
      values: [
        {
          value: "row",
          description:
            "Lays out items left to right along the horizontal axis. The implicit default.",
        },
        { value: "column", description: "Lays out items top to bottom along the vertical axis." },
      ],
    },
    GapSize: {
      name: "GapSize",
      summary: "Design-system spacing-scale keyword shared by gap and spacing props across components.",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      kind: "alias",
      values: [
        { value: "xs", description: "Extra-small gap step." },
        { value: "sm", description: "Small gap step." },
        { value: "md", description: "Medium gap step." },
        { value: "lg", description: "Large gap step." },
        { value: "xl", description: "Extra-large gap step." },
      ],
    },
    FlexGap: {
      name: "FlexGap",
      summary: "Gap between flex items.",
      type: 'GapSize | "none" | number',
      kind: "alias",
      notes: [
        '"none" removes the gap entirely.',
        "A number maps directly to the Tailwind spacing step (matching the gap-{n} utility) and is used as-is instead of resolving through the design-system keyword scale.",
      ],
    },
    SizingValue: {
      name: "SizingValue",
      summary:
        "A Tailwind spacing step or a CSS dimension value, shared by height/width shorthand props across components.",
      type: "number | (string & {})",
      kind: "alias",
      notes: [
        '"full" resolves to 100%. "screen" resolves to 100vh for height and 100vw for width.',
        "Any other string is used as a literal CSS dimension.",
      ],
    },
    FlexLayout: {
      name: "FlexLayout",
      summary: "Golden-standard layout preset name.",
      type: '"center" | "stack" | "cluster" | "bar" | "actions" | "inline"',
      kind: "alias",
      notes: [
        "Each preset bundles direction/wrap/gap/justify/align defaults; any explicit prop the caller passes overrides the matching preset value.",
      ],
      values: [
        {
          value: "center",
          description: "Content centered on both axes — empty states, loaders, hero copy.",
        },
        { value: "stack", description: "Vertical column with consistent block-axis rhythm." },
        {
          value: "cluster",
          description:
            "Wrapping row of small items (chips, tags, avatars), vertically centered.",
        },
        {
          value: "bar",
          description: "Space-between row with centered items — nav bars, headers, toolbars.",
        },
        {
          value: "actions",
          description: "Right-aligned action row — form footers, dialog buttons.",
        },
        { value: "inline", description: "Label beside control on a single baseline-centered row." },
      ],
    },
  },

  propGroups: [{ name: "Core" }, { name: "Layout" }, { name: "Styling" }],

  stateAttributes: [
    {
      name: "data-direction",
      description: "The resolved flex-direction axis.",
      values: ["row", "column"],
    },
    {
      name: "data-wrap",
      description: "Whether items wrap to the next line.",
      values: ["wrap", "nowrap"],
    },
    {
      name: "data-gap",
      description:
        'The resolved gap: "none", a design-system size keyword, or a stringified number when gap is set numerically.',
    },
    {
      name: "data-justify",
      description: "The resolved justify-content flag.",
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
      description: "The resolved align-items flag.",
      values: ["align-start", "align-end", "align-center", "align-stretch", "align-baseline"],
    },
    {
      name: "data-container-responsive",
      description:
        "Marks the element establishing the container-query context when containerQueryResponsive is enabled; omitted otherwise.",
      values: ["true"],
    },
  ],

  refine: (api) => ({
    ...api,
    props: api.props.map(enrichProp),
  }),
} satisfies ComponentAPIEnrichment;
