import type { ComponentMetadata } from "../types.js";

// Generated from components/*/metadata.json. Do not edit.
export const generatedComponentMetadata = [
  {
    "id": "anchor",
    "name": "Anchor",
    "description": "Link with an animated underline and hover preview.",
    "category": "navigation",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Anchor",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "tooltip",
      "path",
      "button"
    ],
    "tags": [
      "navigation",
      "interactive",
      "link"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Renders a native anchor element when href is supplied, and a span otherwise",
        "Adds rel=\"noopener noreferrer\" automatically when target is _blank",
        "Keyboard focusable with a keyboard-visible focus indicator",
        "The underline is decorative and hidden from assistive technology",
        "Hover previews are rendered by Tooltip, which handles accessible overlay behavior"
      ]
    }
  },
  {
    "id": "badge",
    "name": "Badge",
    "description": "Small badge for displaying labels or status indicators.",
    "category": "information",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Badge",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [],
    "tags": [
      "label",
      "status",
      "tag"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Semantic HTML",
        "Use with proper context"
      ]
    }
  },
  {
    "id": "banner",
    "name": "Banner",
    "description": "Full-width strip for surfacing alerts, notices, and messages.",
    "category": "information",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Banner",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "alert",
      "badge"
    ],
    "tags": [
      "notification",
      "layout",
      "visual",
      "full-width"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Supports keyboard navigation for dismiss button",
        "Semantic HTML structure",
        "ARIA labels for accessibility",
        "Focus management for interactive elements"
      ]
    }
  },
  {
    "id": "button",
    "name": "Button",
    "description": "Clickable element that triggers an action.",
    "category": "action",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Button",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "group"
    ],
    "tags": [
      "cta",
      "interactive",
      "primary-action"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Renders a native button element, or an anchor with role preserved when href is set.",
        "Disabled buttons are unfocusable and excluded from the tab order.",
        "Icon-only buttons require an accessible name via aria-label or aria-labelledby."
      ]
    }
  },
  {
    "id": "card",
    "name": "Card",
    "description": "Container for grouping related content.",
    "category": "container",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Card",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "modal",
      "divider"
    ],
    "tags": [
      "container",
      "grouping",
      "layout"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Semantic HTML structure",
        "Proper heading hierarchy"
      ]
    },
    "usage": {
      "summary": "Use Card as a top-level surface that groups related content into a single visual panel.",
      "whenToUse": [
        "Page sections that need their own surface boundary",
        "Standalone panels such as summaries, settings sections, and detail blocks",
        "Collections of related content that benefit from header/body/footer structure"
      ],
      "whenNotToUse": [
        "Inside other surfaced overlays like Modal, Popover, Confirm, or Menu",
        "For simple internal spacing inside an existing surfaced component",
        "As a generic replacement for every padded container"
      ],
      "rules": [
        {
          "type": "do",
          "title": "Reserve Card for top-level surfaces",
          "description": "Treat Card as the main boundary for a section or standalone block, not as a default inner wrapper."
        },
        {
          "type": "avoid",
          "title": "Do not nest Card inside overlay surfaces",
          "description": "Avoid putting Card inside Modal, Popover, Confirm, or Menu because it creates double-surface chrome and weakens hierarchy.",
          "relatedComponents": [
            "modal",
            "popover",
            "confirm",
            "menu"
          ]
        },
        {
          "type": "prefer",
          "title": "Prefer layout primitives for internal grouping",
          "description": "When content already sits inside a surfaced component, use Flex, Grid, Group, or the host component's slots to structure it instead of adding another Card.",
          "relatedComponents": [
            "flex",
            "grid",
            "group",
            "modal"
          ]
        }
      ]
    }
  },
  {
    "id": "chart",
    "name": "Chart",
    "description": "Visualizes structured data with bars, lines, and trend displays.",
    "category": "display",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Chart",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "tooltip",
      "table"
    ],
    "tags": [
      "data",
      "visualization",
      "graph"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Keyboard accessible data navigation",
        "Screen reader status announcements",
        "Accessible chart labeling"
      ]
    }
  },
  {
    "id": "checkbox",
    "name": "Checkbox",
    "description": "Native checkbox input for a boolean form choice.",
    "category": "input",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Checkbox",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "radio",
      "switch",
      "label"
    ],
    "tags": [
      "form",
      "selection",
      "boolean"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Keyboard accessible",
        "Visual focus indicator",
        "Works with labels"
      ]
    }
  },
  {
    "id": "code",
    "name": "Code",
    "description": "Displays syntax-highlighted code with a copy button.",
    "category": "display",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Code",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [],
    "tags": [
      "code",
      "syntax-highlighting",
      "display"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Pre-formatted content",
        "Copy button is keyboard accessible"
      ]
    }
  },
  {
    "id": "color",
    "name": "Color",
    "description": "Color picker with a canvas, sliders, and format input.",
    "category": "input",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Color",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "input",
      "select"
    ],
    "tags": [
      "color",
      "form",
      "user-input",
      "interactive"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Hue, opacity, and chroma controls use keyboard-operable slider semantics",
        "The saturation and brightness canvas exposes a slider role and value text",
        "Trigger, input, selector, recent colors, and preview surfaces have accessible names",
        "Canvas and slider controls expose visible keyboard focus state"
      ]
    }
  },
  {
    "id": "command",
    "name": "Command",
    "description": "Searchable command palette for quick actions.",
    "category": "action",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Command",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "modal",
      "input"
    ],
    "tags": [
      "search",
      "command",
      "navigation"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Application-owned keyboard shortcuts",
        "Search support",
        "Focus management"
      ]
    }
  },
  {
    "id": "confirm",
    "name": "Confirm",
    "description": "Confirm dialog for critical user actions.",
    "category": "action",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Confirm",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "modal",
      "button",
      "card"
    ],
    "tags": [
      "dialog",
      "confirm",
      "safety"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Focus management",
        "Clear action buttons",
        "Alert dialog role"
      ]
    }
  },
  {
    "id": "date",
    "name": "Date",
    "description": "Date picker with calendar and keyboard navigation.",
    "category": "input",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Date",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "input",
      "select"
    ],
    "tags": [
      "date",
      "selection",
      "input",
      "interactive"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Full keyboard navigation with arrow keys",
        "Enter/Space to select dates",
        "PageUp/PageDown for month navigation",
        "Screen reader friendly with semantic HTML",
        "Focus management with visible focus ring",
        "Disabled dates properly announced"
      ]
    }
  },
  {
    "id": "divider",
    "name": "Divider",
    "description": "Horizontal or vertical separator for dividing content.",
    "category": "display",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Divider",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "modal"
    ],
    "tags": [
      "separator",
      "layout",
      "visual"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Semantic divider element",
        "Visual separator only"
      ]
    }
  },
  {
    "id": "expand",
    "name": "Expand",
    "description": "Collapsible component for expanding hidden sections.",
    "category": "container",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Expand",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "modal"
    ],
    "tags": [
      "disclosure",
      "accordion",
      "collapsible",
      "expandable"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "The trigger publishes aria-expanded and aria-controls referencing the content panel's id, matching the ARIA disclosure pattern",
        "Keyboard navigation with Tab and Enter/Space",
        "The content panel is aria-hidden while collapsed"
      ]
    },
    "contract": {
      "version": 1,
      "element": "div containing disclosure button and content panel",
      "nativeProps": "Div attributes/events go to the root. Trigger props/events go to its native button; Content props go to the outer collapsing div.",
      "ref": "Root HTMLDivElement.",
      "state": "state.expanded is controlled; onExpandedChange reports toggles. expanded is the legacy uncontrolled initial value, not controlled. defaultExpanded and isExpanded remain compatibility aliases; do not use them as controlled props.",
      "layout": "String trigger children/title receive built-in title/icon layout. Element children without title switch to consumer-owned trigger layout and padding. Vertical padding on content.inner prevents a full collapse; pad a child instead.",
      "composition": "Preset mode uses title plus body children. Compound mode uses Trigger and Content; with custom element children include Expand.Icon explicitly. Put a navigation link beside an icon-only Trigger rather than nesting a link in a button.",
      "accessibility": "Trigger publishes aria-expanded and aria-controls. Custom icon-only triggers need aria-label. Contained layout removes trigger radius; match enclosing inner corners deliberately if clipping a focus ring.",
      "parts": {
        "Trigger": {
          "element": "button",
          "nativeProps": "Button attributes/events are composed with disclosure press behavior.",
          "ref": "HTMLButtonElement.",
          "composition": "Element children own layout and must include Expand.Icon if wanted; plain text gets a generated icon."
        },
        "Content": {
          "element": "div around an inner content wrapper",
          "nativeProps": "Div attributes/events target the collapsing panel.",
          "ref": "HTMLDivElement.",
          "layout": "Keep the collapsing inner wrapper free of vertical padding; pad a child for spacing."
        }
      }
    },
    "examples": [
      {
        "id": "controlled-disclosure",
        "name": "Controlled disclosure",
        "description": "Keep expansion controlled and explicitly compose a custom trigger.",
        "code": "\"use client\";\nimport { useState } from \"react\";\nimport { Expand } from \"ui-lab-components/expand\";\nexport function Details() { const [expanded, setExpanded] = useState(false); return <Expand state={{ expanded }} onExpandedChange={setExpanded}><Expand.Trigger><span>Details</span><Expand.Icon /></Expand.Trigger><Expand.Content><div>Additional information</div></Expand.Content></Expand>; }\n"
      }
    ]
  },
  {
    "id": "flex",
    "name": "Flex",
    "description": "Flexbox layout with container query support.",
    "category": "layout",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Flex",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "group",
      "divider"
    ],
    "tags": [
      "layout",
      "flex",
      "container-queries",
      "responsive"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Semantic div element with flexbox layout",
        "No built-in ARIA roles - use for layout purposes",
        "Compose with accessible child components"
      ]
    }
  },
  {
    "id": "frame",
    "name": "Frame",
    "description": "Decorative border with advanced SVG path support.",
    "category": "container",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Frame",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "modal"
    ],
    "tags": [
      "container",
      "decorative",
      "border",
      "svg",
      "custom-shapes"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Decorative SVG elements are properly hidden from assistive technology"
      ]
    }
  },
  {
    "id": "gallery",
    "name": "Gallery",
    "description": "Responsive grid for displaying images and media.",
    "category": "layout",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Gallery",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "grid"
    ],
    "tags": [
      "gallery",
      "grid",
      "media",
      "images",
      "video",
      "responsive"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Uses React Aria useFocusRing for keyboard focus indication",
        "Renders as an anchor when href is set, a role=\"button\" element when only onPress is set, and a plain, non-interactive element otherwise",
        "disabled removes the item from tab order and suppresses press, hover, and onPress",
        "Proper focus order through natural DOM order",
        "Hover and focus states for visual feedback"
      ]
    }
  },
  {
    "id": "grid",
    "name": "Grid",
    "description": "Responsive grid layout with container query support.",
    "category": "layout",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Grid",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "flex",
      "card",
      "divider"
    ],
    "tags": [
      "layout",
      "grid",
      "container-queries",
      "responsive",
      "columns"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Semantic div element with grid layout",
        "No built-in ARIA roles - use for layout purposes",
        "Compose with accessible child components"
      ]
    }
  },
  {
    "id": "group",
    "name": "Group",
    "description": "Groups controls with unified borders.",
    "category": "composition",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Group",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "button",
      "input",
      "select",
      "expand",
      "divider"
    ],
    "tags": [
      "composition",
      "grouped",
      "compound",
      "form",
      "toolbar"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Renders role=\"group\" and accepts aria-label or aria-labelledby to name the collection",
        "Marks a disabled group with aria-disabled and disables every child that does not set its own disabled value",
        "Moves focus between grouped controls with the arrow keys matching the orientation, wrapping at both ends, while leaving other keys to the focused control",
        "Composes with a consumer onKeyDown handler instead of replacing it",
        "Renders one shared focus ring that tracks the focused grouped surface"
      ]
    },
    "usage": {
      "summary": "Compose related controls using Group.Button, Group.Input, and Group.Select. Use Group value/onChange with Group.Button value for controlled toggle groups.",
      "rules": [
        {
          "type": "do",
          "title": "Compose grouped selects",
          "description": "Group.Select uses Select.Trigger and Select.Content containing Select.List and Select.Item children."
        },
        {
          "type": "do",
          "title": "Use the standalone divider",
          "description": "Place Divider inside Group; there is no Group.Divider part."
        }
      ]
    },
    "contract": {
      "version": 1,
      "element": "div role=\"group\" inside a sizing/focus wrapper",
      "nativeProps": "Div attributes and events go to the inner group. className styles that group; w-full/flex-1 also propagate to the outer sizing wrapper.",
      "ref": "Inner HTMLDivElement.",
      "state": "Group holds no selection state. Supply value and onChange; Group.Button value identifies each toggle. Group disabled applies unless a part explicitly overrides it.",
      "layout": "Each direct child gets an item wrapper. orientation controls layout and arrow navigation; spacing=\"none\" joins surfaces.",
      "composition": "Use Group.Button/Input/Select/Expand. Use standalone Divider, not Group.Divider. Tooltip can wrap Group.Button as one group child. Nested groups own their own controls.",
      "accessibility": "Name the collection with aria-label/aria-labelledby. Toggle buttons expose aria-pressed when Group value is supplied. This is a group of toggle buttons, not a radio group.",
      "parts": {
        "Button": {
          "element": "button (or Button link mode)",
          "nativeProps": "Inherits Button native props, including aria-label and event handlers.",
          "ref": "HTMLButtonElement in button mode."
        },
        "Input": {
          "element": "Input inside a grouped div surface",
          "nativeProps": "className goes to the grouped surface; other props follow Input forwarding. Native mode events reach the input, not the grouped wrapper.",
          "ref": "HTMLInputElement in native input mode.",
          "composition": "Children mode renders a custom Input shell; provide your own editable control and event handlers there."
        },
        "Select": {
          "element": "Select root div",
          "nativeProps": "Props follow Select. Accessibility labels/descriptions for the control belong on Select.Trigger.",
          "ref": "HTMLDivElement.",
          "composition": "Use Select.Trigger/Value and Select.Content/List/Item inside Group.Select. The panel anchors to this segment, not the entire Group."
        }
      }
    },
    "examples": [
      {
        "id": "01-basic-group",
        "name": "Basic toggle group",
        "description": "Controlled toggles with accessible selected state and a named collection.",
        "code": "\"use client\";\nimport { useState } from \"react\";\nimport { Group } from \"ui-lab-components/group\";\nexport function ModeToggle() {\n  const [mode, setMode] = useState(\"edit\");\n  return <Group aria-label=\"Mode\" value={mode} onChange={setMode}><Group.Button value=\"edit\">Edit</Group.Button><Group.Button value=\"preview\">Preview</Group.Button></Group>;\n}\n"
      }
    ]
  },
  {
    "id": "icon",
    "name": "Icon",
    "description": "Local SVG icon resolved by variant and name.",
    "category": "media",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Icon",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "button",
      "badge"
    ],
    "tags": [
      "icon",
      "svg",
      "mask",
      "asset"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Decorative by default with aria-hidden",
        "Meaningful icons support an accessible label"
      ]
    },
    "usage": {
      "summary": "Icon renders a span with an SVG CSS mask, not an inline svg. Assets are application-owned. Load guide:icon-setup for IconProvider, static assets and on-demand routes.",
      "rules": [
        {
          "type": "do",
          "title": "Configure the asset contract",
          "description": "Serve {asset-url}/{variant}/{id}.svg. Default asset-url is /ui/icons; a variant prop or provider default-variant is required. Missing assets warn in development."
        },
        {
          "type": "do",
          "title": "Size icons through their slot",
          "description": "Default size uses --icon-size with a 20px standalone fallback. Button/Select/Expand/Badge slots set this variable. An explicit size prop overrides it."
        },
        {
          "type": "prefer",
          "title": "Use explicit per-icon overrides",
          "description": "An Icon asset-url overrides the provider resolver for that icon. Otherwise resolve-source wins over the provider base URL. Icon IDs come from the installed application collection, not a universal built-in set."
        }
      ]
    }
  },
  {
    "id": "input",
    "name": "Input",
    "description": "Text or number field with adornments and error states.",
    "category": "input",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Input",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "label",
      "group"
    ],
    "tags": [
      "form",
      "text",
      "number",
      "user-input"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Works with label elements",
        "Supports placeholder text",
        "Supports native input keyboard interaction"
      ]
    },
    "contract": {
      "version": 1,
      "element": "Native input inside surface/focus wrappers; a custom content div when children are supplied",
      "nativeProps": "In native mode, input attributes and events (id, min, step, onKeyDown, ARIA) reach the input. className and style target the surface, not the input.",
      "ref": "HTMLInputElement in native mode. Children mode does not render a native input.",
      "state": "value is controlled; state.value takes precedence. Use defaultValue for an uncontrolled initial value. onChange receives the native input event.",
      "layout": "Use styles.input for field styling and className/styles.root for the surface. Icon/adornment/action slots are separate from input text.",
      "composition": "Use Label htmlFor matching Input id. Children mode replaces the input; own your custom child control, ref, and keyboard behavior.",
      "accessibility": "Put naming and description attributes on Input in native mode. A placeholder does not replace a visible/accessibility label."
    },
    "examples": [
      {
        "id": "labeled-number-field",
        "name": "Labeled number input",
        "description": "Native constraints and keyboard events belong on the field.",
        "code": "\"use client\";\nimport { Input } from \"ui-lab-components/input\";\nimport { Label } from \"ui-lab-components/label\";\nexport function QuantityField() { return <div><Label htmlFor=\"quantity\">Quantity</Label><Input id=\"quantity\" type=\"number\" min={1} step={1} defaultValue=\"1\" aria-describedby=\"quantity-help\" /><p id=\"quantity-help\">Use a positive whole number.</p></div>; }\n"
      }
    ]
  },
  {
    "id": "label",
    "name": "Label",
    "description": "Text label for form elements.",
    "category": "information",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Label",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "input",
      "checkbox",
      "radio",
      "switch"
    ],
    "tags": [
      "form",
      "text",
      "accessibility"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Associates with form controls",
        "Improves accessibility"
      ]
    }
  },
  {
    "id": "list",
    "name": "List",
    "description": "Displays item collections with built-in selection and actions.",
    "category": "composition",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "List",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "table"
    ],
    "tags": [
      "list",
      "items",
      "collections",
      "selection",
      "actions"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Uses listbox and option roles for composite list navigation",
        "Supports interactive items with keyboard navigation",
        "Proper ARIA labels for selection states"
      ]
    },
    "contract": {
      "version": 1,
      "element": "div with default role=\"listbox\"",
      "nativeProps": "Native div attributes and ARIA reach the root; role can override the default for presentational compositions.",
      "ref": "HTMLDivElement augmented with List navigation methods.",
      "state": "Selection is consumer-owned through Item selected and callbacks. Keyboard focus/highlight is distinct from selection. highlighted triggers scrolling to an item already marked data-highlighted; it is not a selection setter.",
      "layout": "Use a single content wrapper for stacked Title and Desc. Media and Actions occupy separate row slots; resize media through Item styles.media.",
      "composition": "Compose Item with leading Media, one stacked text region, and Actions. Do not put arbitrary direct text parts into separate columns when a stacked label is intended.",
      "accessibility": "Name the listbox. Item defaults to role=\"option\" with aria-selected; Enter/Space activate eligible rows. Use role=\"presentation\" when a containing component already owns listbox semantics.",
      "parts": {
        "Item": {
          "element": "div role=\"option\" by default",
          "nativeProps": "Div attributes/events reach the row and are composed with keyboard/focus behavior.",
          "ref": "HTMLDivElement.",
          "composition": "Use onClick for row activation; events from nested controls keep their own interaction. selected sets aria-selected. focusable={false} disables row focus, useful for virtual-focus integrations."
        }
      }
    },
    "examples": [
      {
        "id": "stacked-row",
        "name": "Stacked list row",
        "description": "Title and description share one text column; selection is owned by the consumer.",
        "code": "\"use client\";\nimport { useState } from \"react\";\nimport { List } from \"ui-lab-components/list\";\nexport function FileList() { const [selected, setSelected] = useState(false); return <List aria-label=\"Files\"><List.Item value=\"report\" selected={selected} onClick={() => setSelected(true)}><div><List.Title>Report</List.Title><List.Desc>Updated today</List.Desc></div></List.Item></List>; }\n"
      }
    ]
  },
  {
    "id": "mask",
    "name": "Mask",
    "description": "Container with fading edge effects on content.",
    "category": "container",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Mask",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card",
      "scroll"
    ],
    "tags": [
      "container",
      "visual",
      "effect",
      "fade"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Visual effect only, does not affect content semantics"
      ]
    }
  },
  {
    "id": "menu",
    "name": "Menu",
    "description": "Context or dropdown menu with nested submenus.",
    "category": "action",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Menu",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "popover",
      "select",
      "list",
      "button"
    ],
    "tags": [
      "menu",
      "context-menu",
      "right-click",
      "dropdown",
      "actions",
      "submenu"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "The trigger publishes aria-haspopup=\"menu\" and aria-expanded. Pop-over menus render a Button by default; the span branch adds role=\"button\" and a tab stop so Enter and Space open the panel.",
        "The floating panel is the single element with role=\"menu\"; the inner collection is presentational so items are owned directly by it.",
        "Items expose role=\"menuitem\", or role=\"menuitemradio\" and role=\"menuitemcheckbox\" with aria-checked when selection or a checkbox or radio item is used. Disabled items expose aria-disabled and are skipped by keyboard navigation.",
        "Arrow keys, Home, End, typeahead, Enter, and Escape follow the menu pattern. ArrowRight opens a submenu from its trigger and ArrowLeft closes it, returning focus to that trigger.",
        "Menu.Separator uses role=\"separator\", Menu.Group and Menu.RadioGroup use role=\"group\", and selection indicators and the submenu chevron are hidden from assistive technology.",
        "Icon-only triggers need an accessible name through aria-label on Menu.Trigger."
      ]
    }
  },
  {
    "id": "modal",
    "name": "Modal",
    "description": "Modal dialog for focusing user attention on important content.",
    "category": "feedback",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Modal",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "button",
      "card"
    ],
    "tags": [
      "dialog",
      "overlay",
      "container"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Focus trap",
        "Backdrop focus",
        "Keyboard dismissal",
        "ARIA dialog role"
      ]
    },
    "usage": {
      "summary": "Use Modal for short, focused dialog tasks that need a dedicated overlay surface and clear dismissal path.",
      "whenToUse": [
        "Interruptive tasks that need focused attention",
        "Short forms, confirmations, or contextual workflows that should not navigate away",
        "Situations where the dialog itself should provide the only surfaced container"
      ],
      "whenNotToUse": [
        "Long, browse-heavy, or primary page flows",
        "Cases where inline expansion or a dedicated page would be clearer",
        "Layouts that require another nested surface just to hold the content"
      ],
      "rules": [
        {
          "type": "do",
          "title": "Let Modal be the surface",
          "description": "Use the modal shell, title, content area, and footer as the dialog structure instead of wrapping the body in another surface component."
        },
        {
          "type": "avoid",
          "title": "Avoid nested surfaced containers",
          "description": "Do not place Card or other panel-like surfaces inside the modal body unless there is a strong semantic need for a distinct sub-region.",
          "relatedComponents": [
            "card",
            "panel",
            "confirm"
          ]
        },
        {
          "type": "prefer",
          "title": "Prefer direct content plus layout primitives",
          "description": "Arrange modal content with Flex, Grid, Group, and Modal footer slots so the hierarchy stays shallow and the dialog reads as a single unit.",
          "relatedComponents": [
            "flex",
            "grid",
            "group"
          ]
        }
      ]
    }
  },
  {
    "id": "page",
    "name": "Page",
    "description": "Semantic responsive container for page-level layouts.",
    "category": "layout",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Page",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "flex",
      "card",
      "grid"
    ],
    "tags": [
      "container",
      "layout",
      "page-wrapper",
      "responsive",
      "seo"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Uses semantic header, main, and footer landmarks for page structure",
        "Flexible padding and max-width constraints",
        "seo prop renders a hoisted <title>, <meta name=\"description\">, and <link rel=\"canonical\">"
      ]
    }
  },
  {
    "id": "panel",
    "name": "Panel",
    "description": "Resizable layout regions with collapsible sidebars.",
    "category": "layout",
    "experimental": false,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Panel",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "page",
      "grid",
      "flex",
      "button"
    ],
    "tags": [
      "composition",
      "panel",
      "sidebar",
      "regions",
      "responsive",
      "resize"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Uses semantic aside, header, main, and footer regions",
        "Toggle exposes aria-expanded and aria-controls while preserving consumer handlers",
        "Responsive stacking follows Panel container width and preserves authored reading order",
        "Resize handles expose separator semantics, values, controls, and keyboard interaction"
      ]
    }
  },
  {
    "id": "path",
    "name": "Path",
    "description": "Breadcrumb navigation showing page hierarchy.",
    "category": "navigation",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Path",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [],
    "tags": [
      "navigation",
      "path",
      "hierarchy",
      "parent-pages"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Uses nav element with landmark role",
        "Semantic ordered list structure",
        "Current page marked with aria-current",
        "Full keyboard navigation support",
        "Screen reader friendly labels"
      ]
    }
  },
  {
    "id": "popover",
    "name": "Popover",
    "description": "Popover component for displaying content on demand.",
    "category": "feedback",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Popover",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "tooltip",
      "modal"
    ],
    "tags": [
      "overlay",
      "content",
      "information"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Focus management",
        "Dismissible",
        "Keyboard support"
      ]
    }
  },
  {
    "id": "progress",
    "name": "Progress",
    "description": "Progress bar component for showing completion status.",
    "category": "feedback",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Progress",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "slider"
    ],
    "tags": [
      "feedback",
      "status",
      "progress"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "ARIA progressbar role",
        "aria-valuenow, aria-valuemin, and aria-valuemax",
        "A visible label supplies the default accessible name unless aria-label or aria-labelledby is provided"
      ]
    }
  },
  {
    "id": "radio",
    "name": "Radio",
    "description": "Radio button for selecting one option from a group.",
    "category": "input",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Radio",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "checkbox",
      "switch",
      "label"
    ],
    "tags": [
      "form",
      "selection",
      "single-choice"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Keyboard accessible",
        "Radio group support",
        "Arrow key navigation"
      ]
    }
  },
  {
    "id": "scroll",
    "name": "Scroll",
    "description": "Scroll area with custom scrollbars for overflow.",
    "category": "container",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Scroll",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [],
    "tags": [
      "scroll",
      "overflow",
      "layout",
      "scrollbar"
    ],
    "accessibility": {
      "hasAriaSupport": false,
      "notes": [
        "Custom scrollbar implementation for visual consistency"
      ]
    },
    "usage": {
      "summary": "Scroll forwards native div attributes to its outer root. Use viewport-ref for the inner scrolling element. Prop names are kebab-case, not camelCase.",
      "rules": [
        {
          "type": "do",
          "title": "Constrain the parent",
          "description": "Vertical Scroll fills parent height. Give the parent a definite height; use min-h-0 on shrinking grid/flex tracks. Example: <div className=\"h-64 min-h-0\"><Scroll inline>{content}</Scroll></div>."
        },
        {
          "type": "prefer",
          "title": "Reserve the scrollbar gutter",
          "description": "Use inline when edge-aligned content must not sit beneath the scrollbar."
        }
      ]
    },
    "contract": {
      "version": 1,
      "element": "div wrapping a scrolling viewport; enabled={false} uses the non-scrolling path",
      "nativeProps": "Div attributes/events go to the outer root. Use viewport-ref to access scrollTop/scrollLeft on the actual viewport.",
      "state": "No controlled React scroll-position prop. Use viewport-ref for programmatic position and storage-key for session restoration.",
      "layout": "Vertical Scroll needs a definite parent height and min-h-0 on shrinking flex/grid tracks. max-height/max-width cap the viewport; inline reserves a scrollbar gutter. Prop names are kebab-case.",
      "composition": "Use Scroll directly as the constrained layout child; avoid stacking independent scroll owners. Optional Track/Thumb customize the scrollbar.",
      "accessibility": "Name the scrolling region when needed using root ARIA attributes. presentational changes structural roles, not keyboard behavior. The native viewport remains the scrolling element."
    },
    "examples": [
      {
        "id": "fixed-height-sidebar",
        "name": "Fixed-height scrolling region",
        "description": "Constrain the parent and reserve a scrollbar gutter.",
        "code": "\"use client\";\nimport { Scroll } from \"ui-lab-components/scroll\";\nexport function Activity() { return <div className=\"h-64 min-h-0\"><Scroll inline role=\"region\" aria-label=\"Activity\">{Array.from({ length: 30 }, (_, index) => <p key={index}>Activity {index + 1}</p>)}</Scroll></div>; }\n"
      }
    ]
  },
  {
    "id": "select",
    "name": "Select",
    "description": "Dropdown for choosing one or more options.",
    "category": "input",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Select",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "input",
      "list",
      "label",
      "group"
    ],
    "tags": [
      "form",
      "dropdown",
      "selection",
      "combobox",
      "listbox"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "The trigger is a native button with aria-haspopup=\"listbox\", aria-expanded, and aria-controls pointing at the floating panel.",
        "The floating panel is the single listbox; the inner collection is presentational so options are owned directly by it. Multiple mode adds aria-multiselectable.",
        "Options expose role=\"option\" with aria-selected, and disabled options expose aria-disabled and are skipped by keyboard navigation.",
        "Arrow keys, Home, End, Enter, Space, Tab, and Escape follow the listbox pattern; Escape and selection restore focus to the trigger or its owning list row.",
        "Searchable content announces its empty-results message through a polite live region.",
        "Icon-only triggers need an accessible name through aria-label on Select.Trigger; the chevron sections are hidden from assistive technology."
      ]
    },
    "usage": {
      "summary": "Compose Select.Trigger with Select.Value, and Select.Content with Select.List containing Select.Item options.",
      "rules": [
        {
          "type": "do",
          "title": "Use the canonical composition",
          "description": "<Select><Select.Trigger><Select.Value placeholder=\"Choose\" /></Select.Trigger><Select.Content><Select.List><Select.Item value=\"one\">One</Select.Item></Select.List></Select.Content></Select>"
        },
        {
          "type": "do",
          "title": "Size the root and label the trigger",
          "description": "For a full-width field, apply className=\"w-full self-stretch\" to Select, not just its Trigger. Put aria-label or aria-labelledby on Select.Trigger."
        }
      ]
    },
    "contract": {
      "version": 1,
      "element": "div",
      "nativeProps": "HTML div attributes and events go to the root, not the trigger.",
      "ref": "Root HTMLDivElement.",
      "state": "value/state.value are controlled and accept null for an explicitly empty single selection; selectedKey is the single-selection alternative and also accepts null. Omit controlled selection props for uncontrolled usage; use defaultSelectedKey/defaultSelectedKeys for initial selection. Multiple mode uses arrays. state.open is controlled; onOpenChange reports changes. defaultOpen is initial visibility; open retains legacy initial-only behavior. onSelectionChange reports selection changes.",
      "layout": "The trigger fills the root. Set className=\"w-full self-stretch\" on the root for a full-width form field.",
      "composition": "Trigger contains Value. Content contains List with Item options; Group can wrap related options. Separator belongs between option groups. Use Group value/onChange for segmented buttons instead of Select.",
      "accessibility": "Put aria-label or aria-labelledby on Trigger, not the root. Associate a visible Label with the Trigger id. Put aria-describedby on Trigger.",
      "parts": {
        "Trigger": {
          "element": "button",
          "nativeProps": "Native button props and events are merged onto the trigger.",
          "ref": "HTMLButtonElement.",
          "composition": "Use Value as children. An icon-only trigger still needs an accessible name."
        },
        "Content": {
          "element": "div inside a portalled overlay",
          "nativeProps": "HTML div attributes, style, and key events go to the panel, not the positioning overlay.",
          "ref": "HTMLDivElement.",
          "layout": "Anchors to this Select root, including inside Group. Group padding/border affects the offset, not which segment determines the width. position=\"overlay\" aligns the selected option/search surface; top/bottom place a dropdown."
        },
        "Value": {
          "element": "div",
          "nativeProps": "Native div props go to the value wrapper.",
          "ref": "HTMLDivElement.",
          "composition": "placeholder supplies empty text. Render-function children receive the selected registered item or null."
        },
        "Group": {
          "element": "div",
          "nativeProps": "Native div props go to the group wrapper.",
          "ref": "HTMLDivElement.",
          "composition": "Place inside Content/List around related Item options; title renders a visible heading."
        }
      }
    },
    "examples": [
      {
        "id": "labeled-controlled-field",
        "name": "Labeled controlled field",
        "description": "A full-width single select with an explicit empty controlled selection and trigger-level labeling.",
        "code": "\"use client\";\n\nimport { useState } from \"react\";\nimport { Select } from \"ui-lab-components/select\";\nimport { Label } from \"ui-lab-components/label\";\n\nexport function ModeField() {\n  const [mode, setMode] = useState<string | null>(null);\n  return (\n    <div>\n      <Label htmlFor=\"mode\">Mode</Label>\n      <Select selectedKey={mode} onSelectionChange={(key) => setMode(String(key))} className=\"w-full self-stretch\">\n        <Select.Trigger id=\"mode\" aria-describedby=\"mode-help\">\n          <Select.Value placeholder=\"Choose a mode\" />\n        </Select.Trigger>\n        <Select.Content position=\"bottom\">\n          <Select.List>\n            <Select.Item value=\"draft\">Draft</Select.Item>\n            <Select.Item value=\"publish\">Publish</Select.Item>\n          </Select.List>\n        </Select.Content>\n      </Select>\n      <p id=\"mode-help\">Choose how this item will be saved.</p>\n    </div>\n  );\n}\n"
      }
    ]
  },
  {
    "id": "skeleton",
    "name": "Skeleton",
    "description": "Placeholder shapes for loading content.",
    "category": "feedback",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Skeleton",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "progress",
      "card"
    ],
    "tags": [
      "feedback",
      "placeholder",
      "loading",
      "ssr"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Visual placeholders are aria-hidden by default",
        "Consumers own aria-busy and the accessible label on the loading region",
        "Animation honors prefers-reduced-motion"
      ]
    },
    "usage": {
      "summary": "Use Skeleton to preserve content geometry while content is unavailable, redacted, or loading.",
      "whenToUse": [
        "Server-rendered placeholders that must hydrate without changing shape",
        "Text blocks whose line count or numeric total height is known",
        "Media and card layouts that should retain their eventual dimensions"
      ],
      "whenNotToUse": [
        "To communicate measurable completion; use Progress instead",
        "As an individually announced progress indicator",
        "With responsive height measurement; provide explicit lines instead"
      ],
      "rules": [
        {
          "type": "do",
          "title": "Animate the region once",
          "description": "Put data-skeleton-animate on a common ancestor so every descendant shape follows the active theme animation."
        },
        {
          "type": "do",
          "title": "Label meaningful loading regions",
          "description": "When placeholders represent loading, apply aria-busy and an accessible label to their containing section."
        },
        {
          "type": "avoid",
          "title": "Do not measure after hydration",
          "description": "Use numeric h for deterministic height-derived rows or explicit lines for responsive layouts."
        },
        {
          "type": "prefer",
          "title": "Prefer semantic text sizes",
          "description": "Start with body, heading, or display and reserve scale for local geometry adjustments."
        }
      ]
    }
  },
  {
    "id": "slider",
    "name": "Slider",
    "description": "Slider component for selecting a value from a range.",
    "category": "input",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Slider",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "input",
      "label"
    ],
    "tags": [
      "form",
      "range",
      "numeric"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Keyboard accessible",
        "ARIA range role",
        "Arrow key support"
      ]
    }
  },
  {
    "id": "switch",
    "name": "Switch",
    "description": "Toggle switch for boolean input.",
    "category": "input",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Switch",
      "packagePath": "dist/switch.d.ts"
    },
    "relatedComponents": [
      "checkbox",
      "radio",
      "label"
    ],
    "tags": [
      "form",
      "boolean",
      "toggle"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Native checkbox input exposes the switch role and checked state.",
        "Provide aria-label, aria-labelledby, or an external label associated with the input ID.",
        "Space toggles a focused switch; disabled switches cannot receive focus.",
        "Read-only switches remain focusable and suppress changes.",
        "The local focus indicator follows keyboard-visible focus."
      ]
    }
  },
  {
    "id": "table",
    "name": "Table",
    "description": "Data table with custom headers and cells.",
    "category": "display",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Table",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card"
    ],
    "tags": [
      "data",
      "table",
      "display",
      "custom cells",
      "rendering"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Table role",
        "Header associations",
        "Keyboard navigation"
      ]
    }
  },
  {
    "id": "tabs",
    "name": "Tabs",
    "description": "Tabbed interface for organizing content into sections.",
    "category": "navigation",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Tabs",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "card"
    ],
    "tags": [
      "navigation",
      "organization",
      "content-switching"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Keyboard navigation",
        "ARIA tab roles",
        "Focus management"
      ]
    }
  },
  {
    "id": "textarea",
    "name": "TextArea",
    "description": "Multi-line text input field for longer user input.",
    "category": "input",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "TextArea",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "input",
      "label"
    ],
    "tags": [
      "form",
      "text",
      "multi-line"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Renders a native textarea, so labels, aria-label, aria-labelledby, aria-describedby, and form validation behave natively",
        "Disabled uses the native disabled attribute and also publishes data-disabled for styling",
        "Keyboard focus is indicated by the shared focus indicator, which tracks the field or the scroll surface when maxHeight is set",
        "The drag-to-resize handle is decorative, aria-hidden, and pointer-only; keyboard users are never required to use it"
      ]
    },
    "contract": {
      "version": 1,
      "element": "Native textarea inside root/surface wrappers and an optional scroll wrapper",
      "nativeProps": "Textarea attributes and events, including id, aria-describedby and onKeyDown, reach the textarea. className and style target the outer root.",
      "ref": "HTMLTextAreaElement.",
      "state": "value is controlled; state.value takes precedence. defaultValue supplies an uncontrolled initial value; onChange receives a native textarea event.",
      "layout": "size controls minimum height/density. maxHeight enables an internal scroll surface. Style the field with styles.field and the scroll region with styles.scroll.",
      "composition": "For embedded composers, clear surface styles through the documented field/surface/scroll slots, rather than intercepting keyboard events on a wrapper.",
      "accessibility": "Use Label htmlFor matching the textarea id. Keyboard shortcuts can be handled directly with onKeyDown; keep ordinary Enter available unless the product explicitly changes it."
    },
    "examples": [
      {
        "id": "keyboard-submit",
        "name": "Textarea keyboard submission",
        "description": "Handle Ctrl/Cmd+Enter directly on the native textarea.",
        "code": "\"use client\";\nimport { TextArea } from \"ui-lab-components/textarea\";\nimport { Label } from \"ui-lab-components/label\";\nexport function MessageField({ onSubmit }: { onSubmit: () => void }) { return <div><Label htmlFor=\"message\">Message</Label><TextArea id=\"message\" onKeyDown={(event) => { if (event.key === \"Enter\" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); onSubmit(); } }} /></div>; }\n"
      }
    ]
  },
  {
    "id": "toast",
    "name": "Toast",
    "description": "Temporary notification messages.",
    "category": "feedback",
    "experimental": true,
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Toaster",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [],
    "tags": [
      "notification",
      "feedback",
      "temporary"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "ARIA live regions",
        "Role=\"status\"",
        "Auto-dismiss support"
      ]
    },
    "usage": {
      "summary": "Mount Toaster once in a client application shell. Import the callable toast helper from ui-lab-components/toast to enqueue notifications; there is no Toast component export."
    }
  },
  {
    "id": "tooltip",
    "name": "Tooltip",
    "description": "Displays additional information on hover or focus.",
    "category": "information",
    "source": {
      "packageName": "ui-lab-components",
      "exportName": "Tooltip",
      "packagePath": "dist/index.d.ts"
    },
    "relatedComponents": [
      "popover"
    ],
    "tags": [
      "information",
      "hover",
      "help-text"
    ],
    "accessibility": {
      "hasAriaSupport": true,
      "notes": [
        "Keyboard accessible",
        "ARIA labels",
        "Focus management"
      ]
    }
  }
] as ComponentMetadata[];
