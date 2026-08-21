import type { ComponentRegistry } from './types.js';

export const componentRegistry: ComponentRegistry = {
  anchor: {
    id: "anchor",
    name: "Anchor",
    description: "Link with animated underline and popover preview.",
    category: "navigation",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Anchor",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["popover","breadcrumbs"],
    tags: ["navigation","interactive","link"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible with focus visible states","Built on Popover for accessible overlay handling","Screen reader friendly"]},
    usage: undefined,
    examples: [],
  },

  badge: {
    id: "badge",
    name: "Badge",
    description: "Small badge for displaying labels or status indicators.",
    category: "information",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Badge",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: [],
    tags: ["label","status","tag"],
    accessibility: {"hasAriaSupport":false,"notes":["Semantic HTML","Use with proper context"]},
    usage: undefined,
    examples: [],
  },

  banner: {
    id: "banner",
    name: "Banner",
    description: "Full-width strip for surfacing alerts, notices, and messages.",
    category: "information",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Banner",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","alert","badge"],
    tags: ["notification","layout","visual","full-width"],
    accessibility: {"hasAriaSupport":true,"notes":["Supports keyboard navigation for dismiss button","Semantic HTML structure","ARIA labels for accessibility","Focus management for interactive elements"]},
    usage: undefined,
    examples: [],
  },

  button: {
    id: "button",
    name: "Button",
    description: "Clickable element that triggers an action.",
    category: "action",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Button",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["group"],
    tags: ["cta","interactive","primary-action"],
    accessibility: {"hasAriaSupport":true,"notes":["Supports keyboard navigation","Screen reader friendly"]},
    usage: undefined,
    examples: [],
  },

  card: {
    id: "card",
    name: "Card",
    description: "Container for grouping related content.",
    category: "container",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Card",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["modal","divider"],
    tags: ["container","grouping","layout"],
    accessibility: {"hasAriaSupport":false,"notes":["Semantic HTML structure","Proper heading hierarchy"]},
    usage: {"summary":"Use Card as a top-level surface that groups related content into a single visual panel.","whenToUse":["Page sections that need their own surface boundary","Standalone panels such as summaries, settings sections, and detail blocks","Collections of related content that benefit from header/body/footer structure"],"whenNotToUse":["Inside other surfaced overlays like Modal, Popover, Confirm, or Menu","For simple internal spacing inside an existing surfaced component","As a generic replacement for every padded container"],"rules":[{"type":"do","title":"Reserve Card for top-level surfaces","description":"Treat Card as the main boundary for a section or standalone block, not as a default inner wrapper."},{"type":"avoid","title":"Do not nest Card inside overlay surfaces","description":"Avoid putting Card inside Modal, Popover, Confirm, or Menu because it creates double-surface chrome and weakens hierarchy.","relatedComponents":["modal","popover","confirm","menu"]},{"type":"prefer","title":"Prefer layout primitives for internal grouping","description":"When content already sits inside a surfaced component, use Flex, Grid, Group, or the host component's slots to structure it instead of adding another Card.","relatedComponents":["flex","grid","group","modal"]}]},
    examples: [],
  },

  chart: {
    id: "chart",
    name: "Chart",
    description: "Visualizes structured data with bars, lines, and trend displays.",
    category: "display",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Chart",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["tooltip","table"],
    tags: ["data","visualization","graph"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible data navigation","Screen reader status announcements","Accessible chart labeling"]},
    usage: undefined,
    examples: [],
  },

  checkbox: {
    id: "checkbox",
    name: "Checkbox",
    description: "Input for selecting one or multiple options.",
    category: "input",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Checkbox",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["radio","switch","label"],
    tags: ["form","selection","boolean"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible","Visual focus indicator","Works with labels"]},
    usage: undefined,
    examples: [],
  },

  code: {
    id: "code",
    name: "Code",
    description: "Displays syntax-highlighted code with a copy button.",
    category: "display",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Code",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: [],
    tags: ["code","syntax-highlighting","display"],
    accessibility: {"hasAriaSupport":false,"notes":["Pre-formatted content","Copy button is keyboard accessible"]},
    usage: undefined,
    examples: [],
  },

  color: {
    id: "color",
    name: "Color",
    description: "Color picker with hue slider and format selection.",
    category: "input",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Color",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["input","select"],
    tags: ["color","form","user-input","interactive"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible sliders","ARIA labels for color components","Visual focus indicators","Screen reader announcements for color values"]},
    usage: undefined,
    examples: [],
  },

  command: {
    id: "command",
    name: "Command",
    description: "Searchable command palette with instance-scoped trigger and controller APIs.",
    category: "action",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "CommandPalette",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["modal","input"],
    tags: ["search","command","navigation"],
    accessibility: {"hasAriaSupport":true,"notes":["Application-owned keyboard shortcuts","Search support","Focus management"]},
    usage: undefined,
    examples: [],
  },

  confirm: {
    id: "confirm",
    name: "Confirm",
    description: "Confirm dialog for critical user actions.",
    category: "action",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Confirm",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["modal","button","card"],
    tags: ["dialog","confirm","safety"],
    accessibility: {"hasAriaSupport":true,"notes":["Focus management","Clear action buttons","Alert dialog role"]},
    usage: undefined,
    examples: [],
  },

  date: {
    id: "date",
    name: "Date",
    description: "Date picker with calendar and keyboard navigation.",
    category: "input",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Date",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["input","select"],
    tags: ["date","selection","input","interactive"],
    accessibility: {"hasAriaSupport":true,"notes":["Full keyboard navigation with arrow keys","Enter/Space to select dates","PageUp/PageDown for month navigation","Screen reader friendly with semantic HTML","Focus management with visible focus ring","Disabled dates properly announced"]},
    usage: undefined,
    examples: [],
  },

  divider: {
    id: "divider",
    name: "Divider",
    description: "Horizontal or vertical separator for dividing content.",
    category: "display",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Divider",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","modal"],
    tags: ["separator","layout","visual"],
    accessibility: {"hasAriaSupport":false,"notes":["Semantic divider element","Visual separator only"]},
    usage: undefined,
    examples: [],
  },

  expand: {
    id: "expand",
    name: "Expand",
    description: "Collapsible component for expanding hidden sections.",
    category: "layout",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Expand",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","modal"],
    tags: ["disclosure","accordion","collapsible","expandable"],
    accessibility: {"hasAriaSupport":true,"notes":["Full ARIA disclosure pattern support","Keyboard navigation with Tab and Enter/Space","Proper button and panel roles","Screen reader friendly"]},
    usage: undefined,
    examples: [],
  },

  flex: {
    id: "flex",
    name: "Flex",
    description: "Flexbox layout with container query support.",
    category: "layout",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Flex",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","group","divider"],
    tags: ["layout","flex","container-queries","responsive"],
    accessibility: {"hasAriaSupport":false,"notes":["Semantic div element with flexbox layout","No built-in ARIA roles - use for layout purposes","Compose with accessible child components"]},
    usage: undefined,
    examples: [],
  },

  frame: {
    id: "frame",
    name: "Frame",
    description: "Decorative border with advanced SVG path support.",
    category: "container",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Frame",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","modal"],
    tags: ["container","decorative","border","svg","custom-shapes"],
    accessibility: {"hasAriaSupport":false,"notes":["Decorative SVG elements are properly hidden from assistive technology"]},
    usage: undefined,
    examples: [],
  },

  gallery: {
    id: "gallery",
    name: "Gallery",
    description: "Responsive grid for displaying images and media.",
    category: "layout",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Gallery",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","grid"],
    tags: ["gallery","grid","media","images","video","responsive"],
    accessibility: {"hasAriaSupport":true,"notes":["Uses React Aria useFocusRing for keyboard focus indication","Supports both link and button interaction modes","Proper focus order through natural DOM order","Hover and focus states for visual feedback"]},
    usage: undefined,
    examples: [],
  },

  grid: {
    id: "grid",
    name: "Grid",
    description: "Responsive grid layout with container query support.",
    category: "layout",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Grid",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["flex","card","divider"],
    tags: ["layout","grid","container-queries","responsive","columns"],
    accessibility: {"hasAriaSupport":false,"notes":["Semantic div element with grid layout","No built-in ARIA roles - use for layout purposes","Compose with accessible child components"]},
    usage: undefined,
    examples: [],
  },

  group: {
    id: "group",
    name: "Group",
    description: "Groups controls with unified borders.",
    category: "composition",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Group",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["button","input","select","expand"],
    tags: ["composition","grouped","compound","form"],
    accessibility: {"hasAriaSupport":true,"notes":["Uses role=\"group\" for semantic grouping","Propagates disabled state to children","Maintains keyboard navigation for all child components"]},
    usage: undefined,
    examples: [],
  },

  icon: {
    id: "icon",
    name: "Icon",
    description: "Framework-agnostic local SVG icon resolved by variant and filename.",
    category: "media",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Icon",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["button","badge"],
    tags: ["icon","svg","mask","asset"],
    accessibility: {"hasAriaSupport":true,"notes":["Decorative by default with aria-hidden","Meaningful icons support an accessible label"]},
    usage: undefined,
    examples: [],
  },

  input: {
    id: "input",
    name: "Input",
    description: "Text input field for capturing user data.",
    category: "input",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Input",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["label","form","group"],
    tags: ["form","text","user-input"],
    accessibility: {"hasAriaSupport":true,"notes":["Works with label elements","Supports placeholder text","Keyboard accessible"]},
    usage: undefined,
    examples: [],
  },

  label: {
    id: "label",
    name: "Label",
    description: "Text label for form elements.",
    category: "information",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Label",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["input","checkbox","radio","switch"],
    tags: ["form","text","accessibility"],
    accessibility: {"hasAriaSupport":true,"notes":["Associates with form controls","Improves accessibility"]},
    usage: undefined,
    examples: [],
  },

  list: {
    id: "list",
    name: "List",
    description: "Displays item collections with built-in selection and actions.",
    category: "composition",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "List",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","table"],
    tags: ["list","items","collections","selection","actions"],
    accessibility: {"hasAriaSupport":true,"notes":["Uses list role for semantic structure","Supports interactive items with keyboard navigation","Proper ARIA labels for selection states"]},
    usage: undefined,
    examples: [],
  },

  mask: {
    id: "mask",
    name: "Mask",
    description: "Container with fading edge effects on content.",
    category: "container",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Mask",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card","scroll"],
    tags: ["container","visual","effect","fade"],
    accessibility: {"hasAriaSupport":false,"notes":["Visual effect only, does not affect content semantics"]},
    usage: undefined,
    examples: [],
  },

  menu: {
    id: "menu",
    name: "Menu",
    description: "Context menu for right-click actions.",
    category: "navigation",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Menu",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["popover"],
    tags: ["menu","right-click","actions"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible","Menu role","Focus management"]},
    usage: undefined,
    examples: [],
  },

  modal: {
    id: "modal",
    name: "Modal",
    description: "Modal dialog for focusing user attention on important content.",
    category: "container",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Modal",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["button","card"],
    tags: ["dialog","overlay","container"],
    accessibility: {"hasAriaSupport":true,"notes":["Focus trap","Backdrop focus","Keyboard dismissal","ARIA dialog role"]},
    usage: {"summary":"Use Modal for short, focused dialog tasks that need a dedicated overlay surface and clear dismissal path.","whenToUse":["Interruptive tasks that need focused attention","Short forms, confirmations, or contextual workflows that should not navigate away","Situations where the dialog itself should provide the only surfaced container"],"whenNotToUse":["Long, browse-heavy, or primary page flows","Cases where inline expansion or a dedicated page would be clearer","Layouts that require another nested surface just to hold the content"],"rules":[{"type":"do","title":"Let Modal be the surface","description":"Use the modal shell, title, content area, and footer as the dialog structure instead of wrapping the body in another surface component."},{"type":"avoid","title":"Avoid nested surfaced containers","description":"Do not place Card or other panel-like surfaces inside the modal body unless there is a strong semantic need for a distinct sub-region.","relatedComponents":["card","panel","confirm"]},{"type":"prefer","title":"Prefer direct content plus layout primitives","description":"Arrange modal content with Flex, Grid, Group, and Modal footer slots so the hierarchy stays shallow and the dialog reads as a single unit.","relatedComponents":["flex","grid","group"]}]},
    examples: [],
  },

  page: {
    id: "page",
    name: "Page",
    description: "Semantic responsive container for page-level layouts.",
    category: "layout",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Page",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["flex","card","grid"],
    tags: ["container","layout","page-wrapper","responsive","seo"],
    accessibility: {"hasAriaSupport":true,"notes":["Uses semantic header, main, and footer landmarks for page structure","Flexible padding and max-width constraints","seo prop renders a hoisted <title>, <meta name=\"description\">, and <link rel=\"canonical\">"]},
    usage: undefined,
    examples: [],
  },

  panel: {
    id: "panel",
    name: "Panel",
    description: "Resizable layout regions with collapsible sidebars.",
    category: "layout",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Panel",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["page","grid","flex","button"],
    tags: ["composition","panel","sidebar","regions","responsive","resize"],
    accessibility: {"hasAriaSupport":true,"notes":["Uses semantic aside, header, main, and footer regions","Toggle exposes aria-expanded and aria-controls while preserving consumer handlers","Responsive stacking follows Panel container width and preserves authored reading order","Resize handles expose separator semantics, values, controls, and keyboard interaction"]},
    usage: undefined,
    examples: [],
  },

  path: {
    id: "path",
    name: "Path",
    description: "Breadcrumb navigation showing page hierarchy.",
    category: "navigation",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Path",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: [],
    tags: ["navigation","path","hierarchy","parent-pages"],
    accessibility: {"hasAriaSupport":true,"notes":["Uses nav element with landmark role","Semantic ordered list structure","Current page marked with aria-current","Full keyboard navigation support","Screen reader friendly labels"]},
    usage: undefined,
    examples: [],
  },

  popover: {
    id: "popover",
    name: "Popover",
    description: "Popover component for displaying content on demand.",
    category: "feedback",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Popover",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["tooltip","modal"],
    tags: ["overlay","content","information"],
    accessibility: {"hasAriaSupport":true,"notes":["Focus management","Dismissible","Keyboard support"]},
    usage: undefined,
    examples: [],
  },

  progress: {
    id: "progress",
    name: "Progress",
    description: "Progress bar component for showing completion status.",
    category: "feedback",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Progress",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["slider"],
    tags: ["feedback","status","progress"],
    accessibility: {"hasAriaSupport":true,"notes":["ARIA progressbar role","aria-valuenow","aria-valuemin","aria-valuemax"]},
    usage: undefined,
    examples: [],
  },

  radio: {
    id: "radio",
    name: "Radio",
    description: "Radio button for selecting one option from a group.",
    category: "input",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Radio",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["checkbox","switch","label"],
    tags: ["form","selection","single-choice"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible","Radio group support","Arrow key navigation"]},
    usage: undefined,
    examples: [],
  },

  scroll: {
    id: "scroll",
    name: "Scroll",
    description: "Scroll area with custom scrollbars for overflow.",
    category: "container",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Scroll",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: [],
    tags: ["scroll","overflow","layout","scrollbar"],
    accessibility: {"hasAriaSupport":false,"notes":["Custom scrollbar implementation for visual consistency"]},
    usage: undefined,
    examples: [],
  },

  select: {
    id: "select",
    name: "Select",
    description: "Dropdown select component for choosing from multiple options.",
    category: "input",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Select",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["input","label","form","group"],
    tags: ["form","dropdown","selection"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible","Screen reader friendly","ARIA roles included"]},
    usage: undefined,
    examples: [],
  },

  skeleton: {
    id: "skeleton",
    name: "Skeleton",
    description: "Decorative placeholders with rectangle, text, and media shapes.",
    category: "feedback",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Skeleton",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["progress","card"],
    tags: ["feedback","placeholder","loading","ssr"],
    accessibility: {"hasAriaSupport":true,"notes":["Visual placeholders are aria-hidden by default","Consumers own aria-busy and the accessible label on the loading region","Animation honors prefers-reduced-motion"]},
    usage: {"summary":"Use Skeleton to preserve content geometry while content is unavailable, redacted, or loading.","whenToUse":["Server-rendered placeholders that must hydrate without changing shape","Text blocks whose line count or numeric total height is known","Media and card layouts that should retain their eventual dimensions"],"whenNotToUse":["To communicate measurable completion; use Progress instead","As an individually announced progress indicator","With responsive height measurement; provide explicit lines instead"],"rules":[{"type":"do","title":"Animate the region once","description":"Put data-skeleton-animate on a common ancestor so every descendant shape follows the active theme animation."},{"type":"do","title":"Label meaningful loading regions","description":"When placeholders represent loading, apply aria-busy and an accessible label to their containing section."},{"type":"avoid","title":"Do not measure after hydration","description":"Use numeric h for deterministic height-derived rows or explicit lines for responsive layouts."},{"type":"prefer","title":"Prefer semantic text sizes","description":"Start with body, heading, or display and reserve scale for local geometry adjustments."}]},
    examples: [],
  },

  slider: {
    id: "slider",
    name: "Slider",
    description: "Slider component for selecting a value from a range.",
    category: "input",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Slider",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["input","label"],
    tags: ["form","range","numeric"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible","ARIA range role","Arrow key support"]},
    usage: undefined,
    examples: [],
  },

  switch: {
    id: "switch",
    name: "Switch",
    description: "Toggle switch for boolean input.",
    category: "input",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Switch",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["checkbox","radio","label"],
    tags: ["form","boolean","toggle"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible","ARIA switch role","Visual state indication"]},
    usage: undefined,
    examples: [],
  },

  table: {
    id: "table",
    name: "Table",
    description: "Expressive table component with consumer-defined headers and cell rendering logic.",
    category: "display",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Table",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card"],
    tags: ["data","table","display","custom cells","rendering"],
    accessibility: {"hasAriaSupport":true,"notes":["Table role","Header associations","Keyboard navigation"]},
    usage: undefined,
    examples: [],
  },

  tabs: {
    id: "tabs",
    name: "Tabs",
    description: "Tabbed interface for organizing content into sections.",
    category: "navigation",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Tabs",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["card"],
    tags: ["navigation","organization","content-switching"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard navigation","ARIA tab roles","Focus management"]},
    usage: undefined,
    examples: [],
  },

  textarea: {
    id: "textarea",
    name: "Textarea",
    description: "Multi-line text input field for longer user input.",
    category: "input",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "TextArea",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["input","label","form"],
    tags: ["form","text","multi-line"],
    accessibility: {"hasAriaSupport":true,"notes":["Works with label elements","Resizable option available"]},
    usage: undefined,
    examples: [],
  },

  toast: {
    id: "toast",
    name: "Toast",
    description: "Temporary notification messages.",
    category: "feedback",
    experimental: true,
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Toast",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: [],
    tags: ["notification","feedback","temporary"],
    accessibility: {"hasAriaSupport":true,"notes":["ARIA live regions","Role=\"status\"","Auto-dismiss support"]},
    usage: undefined,
    examples: [],
  },

  tooltip: {
    id: "tooltip",
    name: "Tooltip",
    description: "Displays additional information on hover or focus.",
    category: "information",
    source: {
  "packageName": "ui-lab-components",
  "exportName": "Tooltip",
  "packagePath": "dist/index.d.ts"
},
    relatedComponents: ["popover"],
    tags: ["information","hover","help-text"],
    accessibility: {"hasAriaSupport":true,"notes":["Keyboard accessible","ARIA labels","Focus management"]},
    usage: undefined,
    examples: [],
  },
};

export const componentMetadata = Object.values(componentRegistry).map(comp => ({
  id: comp.id,
  name: comp.name,
  description: comp.description,
  category: comp.category,
  tags: comp.tags || []
}));
