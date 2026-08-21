import type { ComponentAPI, ComponentStyles, ComponentDeps, PackageMetadata } from './types';

export const generatedAPI: Record<string, ComponentAPI> = {
  "anchor": {
    "props": [
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class for the anchor element"
      },
      {
        "name": "href",
        "type": "string",
        "required": false,
        "description": "URL the anchor navigates to"
      },
      {
        "name": "target",
        "type": "string",
        "required": false,
        "defaultValue": "_blank",
        "description": "Browsing context for the link (e.g. \"_blank\")"
      },
      {
        "name": "variant",
        "type": "solid | dashed | dotted",
        "required": false,
        "defaultValue": "solid",
        "description": "Controls the underline treatment.",
        "enumValues": [
          "solid",
          "dashed",
          "dotted"
        ]
      },
      {
        "name": "styles",
        "type": "AnchorStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      },
      {
        "name": "preview",
        "type": "ReactNode",
        "required": false,
        "description": "Preview content to show in a tooltip on hover. Use this in server components instead of <Anchor.Preview>."
      }
    ],
    "subComponents": {
      "AnchorPreview": {
        "props": []
      }
    },
    "examples": []
  },
  "badge": {
    "props": [
      {
        "name": "variant",
        "type": "string",
        "required": false,
        "defaultValue": "default",
        "description": "Visual color style of the badge"
      },
      {
        "name": "icon",
        "type": "ReactNode | BadgeIconSlots",
        "required": false,
        "description": "Icon slots rendered before (left) or after (right) the badge label"
      },
      {
        "name": "dismissible",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to show a dismiss button"
      },
      {
        "name": "onDismiss",
        "type": "(() => void)",
        "required": false,
        "description": "Called when the dismiss button is clicked"
      },
      {
        "name": "pill",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to render with a fully rounded pill shape"
      },
      {
        "name": "count",
        "type": "number",
        "required": false,
        "description": "Numeric count to display; replaces children when provided"
      },
      {
        "name": "styles",
        "type": "BadgeStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "button": {
    "props": [
      {
        "name": "variant",
        "type": "string",
        "required": false,
        "defaultValue": "primary",
        "description": "Variant class appended to the root element. Accepts any string.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "default": "primary"
        },
        "typeTokens": [
          {
            "text": "string",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
          }
        ]
      },
      {
        "name": "size",
        "type": "ButtonSize",
        "required": false,
        "description": "Size class appended to the root element. Accepts any string.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "typeDoc": "ButtonSize"
        },
        "typeTokens": [
          {
            "text": "ButtonSize",
            "customType": "ButtonSize"
          }
        ]
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Disables interaction and applies disabled styling. Disabled buttons cannot receive focus.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "default": "false",
          "see": "https://react-spectrum.adobe.com/react-aria/useButton.html",
          "mdn": "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled"
        },
        "links": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled"
          },
          {
            "label": "Related documentation",
            "url": "https://react-spectrum.adobe.com/react-aria/useButton.html"
          }
        ],
        "typeTokens": [
          {
            "text": "boolean",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
          }
        ]
      },
      {
        "name": "onPress",
        "type": "((e: PressEvent) => void)",
        "required": false,
        "description": "React Aria press handler, preferred over onClick for keyboard and pointer consistency.",
        "category": "Events",
        "tags": {
          "category": "Events",
          "see": "https://react-spectrum.adobe.com/react-aria/interactions.html#usepress"
        },
        "links": [
          {
            "label": "Related documentation",
            "url": "https://react-spectrum.adobe.com/react-aria/interactions.html#usepress"
          }
        ],
        "typeTokens": [
          {
            "text": "((e: PressEvent) => void)"
          }
        ]
      },
      {
        "name": "icon",
        "type": "ReactNode | ButtonIconSlots",
        "required": false,
        "description": "Icon slots rendered before (left) or after (right) the button label.",
        "category": "Content",
        "tags": {
          "category": "Content",
          "typeDoc": "ButtonIconSlots"
        },
        "typeTokens": [
          {
            "text": "ReactNode"
          },
          {
            "text": " | "
          },
          {
            "text": "ButtonIconSlots",
            "customType": "ButtonIconSlots"
          }
        ]
      },
      {
        "name": "hint",
        "type": "HintValue",
        "required": false,
        "description": "Keyboard shortcut or hint rendered as a Badge at the end of the button. Arrays render as shortcut segments joined by a plus divider.",
        "category": "Content",
        "tags": {
          "category": "Content",
          "typeDoc": "HintValue"
        },
        "typeTokens": [
          {
            "text": "HintValue",
            "customType": "HintValue"
          }
        ]
      },
      {
        "name": "href",
        "type": "string",
        "required": false,
        "description": "Renders the button as an anchor element when provided.",
        "category": "Link behavior",
        "tags": {
          "category": "Link behavior",
          "mdn": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href"
        },
        "links": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href"
          }
        ],
        "typeTokens": [
          {
            "text": "string",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
          }
        ]
      },
      {
        "name": "target",
        "type": "HTMLAttributeAnchorTarget",
        "required": false,
        "description": "Browsing context for the anchor variant, such as _blank.",
        "category": "Link behavior",
        "tags": {
          "category": "Link behavior",
          "mdn": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target"
        },
        "links": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target"
          }
        ],
        "typeTokens": [
          {
            "text": "HTMLAttributeAnchorTarget"
          }
        ]
      },
      {
        "name": "styles",
        "type": "ButtonStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes.",
        "category": "Styling",
        "tags": {
          "category": "Styling",
          "typeDoc": "ButtonStyleSlots"
        },
        "typeTokens": [
          {
            "text": "ButtonStyleSlots",
            "customType": "ButtonStyleSlots"
          }
        ]
      },
      {
        "name": "data-hovered",
        "type": "true | false",
        "required": false,
        "description": "Forces the visual hover state. Set by Menu.Trigger to keep the trigger highlighted while the menu is open. This is an advanced visual-state escape hatch, not a pending state.",
        "enumValues": [
          "true",
          "false"
        ],
        "category": "Advanced",
        "tags": {
          "category": "Advanced"
        },
        "typeTokens": [
          {
            "text": "true"
          },
          {
            "text": " | "
          },
          {
            "text": "false"
          }
        ]
      }
    ],
    "subComponents": {
      "resolveButtonIcon": {
        "props": [
          {
            "name": "left",
            "type": "ReactNode",
            "required": false,
            "description": "Content rendered before the button label.",
            "typeTokens": [
              {
                "text": "ReactNode"
              }
            ]
          },
          {
            "name": "right",
            "type": "ReactNode",
            "required": false,
            "description": "Content rendered after the button label.",
            "typeTokens": [
              {
                "text": "ReactNode"
              }
            ]
          }
        ]
      }
    },
    "propGroups": [
      {
        "name": "Core"
      },
      {
        "name": "Content"
      },
      {
        "name": "Events"
      },
      {
        "name": "Styling"
      },
      {
        "name": "Forms"
      },
      {
        "name": "Accessibility"
      },
      {
        "name": "Link behavior"
      },
      {
        "name": "Advanced"
      }
    ],
    "stateAttributes": [
      {
        "name": "data-hovered",
        "description": "The pointer is over the button, or the visual hover state is forced.",
        "values": [
          "true",
          "false"
        ]
      },
      {
        "name": "data-pressed",
        "description": "The button is currently pressed.",
        "values": [
          "true",
          "false"
        ]
      },
      {
        "name": "data-focused",
        "description": "The button is focused.",
        "values": [
          "true",
          "false"
        ]
      },
      {
        "name": "data-focus-visible",
        "description": "The button has keyboard-visible focus.",
        "values": [
          "true",
          "false"
        ]
      },
      {
        "name": "data-disabled",
        "description": "The button is disabled.",
        "values": [
          "true"
        ]
      },
      {
        "name": "data-hint",
        "description": "Hint content is present.",
        "values": [
          "true"
        ]
      },
      {
        "name": "data-icon-only",
        "description": "The button is rendered with icon-only sizing.",
        "values": [
          "true"
        ]
      },
      {
        "name": "data-variant",
        "description": "The resolved variant name."
      },
      {
        "name": "data-size",
        "description": "The resolved size name."
      }
    ],
    "customTypes": {
      "ButtonSize": {
        "name": "ButtonSize",
        "summary": "An open string type used to select a button size class.",
        "type": "string & {}",
        "kind": "alias",
        "notes": [
          "Known stylesheet sizes are accepted without preventing custom size names."
        ]
      },
      "ButtonIconSlots": {
        "name": "ButtonIconSlots",
        "summary": "Icon content rendered on either side of the button label.",
        "type": "{ left?: React.ReactNode; right?: React.ReactNode }",
        "kind": "interface",
        "members": [
          {
            "name": "left",
            "type": "React.ReactNode",
            "required": false,
            "description": "Content rendered before the button label."
          },
          {
            "name": "right",
            "type": "React.ReactNode",
            "required": false,
            "description": "Content rendered after the button label."
          }
        ]
      },
      "ButtonStyleSlots": {
        "name": "ButtonStyleSlots",
        "summary": "Style overrides for the button root and named content slots.",
        "type": "{ root?: SlotStyleValue; icon?: SlotStyleValue | ButtonIconStyles; hint?: SlotStyleValue }",
        "kind": "interface",
        "members": [
          {
            "name": "root",
            "type": "SlotStyleValue",
            "required": false,
            "description": "Styles applied to the root element."
          },
          {
            "name": "icon",
            "type": "SlotStyleValue | ButtonIconStyles",
            "required": false,
            "description": "Shared or side-specific icon styles."
          },
          {
            "name": "hint",
            "type": "SlotStyleValue",
            "required": false,
            "description": "Styles applied to the hint badge."
          }
        ]
      },
      "HintValue": {
        "name": "HintValue",
        "summary": "Content displayed as a compact button hint or keyboard shortcut.",
        "type": "React.ReactNode | React.ReactNode[]",
        "kind": "alias",
        "examples": [
          "hint=\"Esc\"",
          "hint={[\"Ctrl\", \"K\"]}"
        ],
        "notes": [
          "Arrays render as shortcut segments joined by a plus divider."
        ]
      }
    },
    "examples": []
  },
  "card": {
    "props": [
      {
        "name": "variant",
        "type": "string",
        "required": false,
        "defaultValue": "default"
      },
      {
        "name": "styles",
        "type": "CardStyleSlots",
        "required": false
      }
    ],
    "subComponents": {
      "Card.Header": {
        "description": "Top section of the card, typically containing a title or toolbar",
        "props": []
      },
      "Card.Body": {
        "description": "Main content area of the card",
        "props": []
      },
      "Card.Footer": {
        "description": "Bottom section of the card, typically containing actions",
        "props": []
      }
    },
    "examples": []
  },
  "chart": {
    "props": [
      {
        "name": "data",
        "type": "any[]",
        "required": true,
        "description": "Rows to plot; series reference fields of each row"
      },
      {
        "name": "x",
        "type": "string | number | symbol | ((row: any) => string | number | Date)",
        "required": true,
        "description": "Field key or accessor producing the shared x value for each row"
      },
      {
        "name": "scale",
        "type": "linear | time | band",
        "required": false,
        "description": "X-scale override; inferred from the resolved x values by default\n(numbers → linear, dates → time, strings → band; bar series force band)",
        "enumValues": [
          "linear",
          "time",
          "band"
        ]
      },
      {
        "name": "domain",
        "type": "[number | \"auto\", number | \"auto\"]",
        "required": false,
        "description": "Y-domain override; \"auto\" per side keeps the nice-number default"
      },
      {
        "name": "state",
        "type": "ChartState",
        "required": false,
        "description": "Controlled state. `activeIndex` is the hovered/keyboard-focused row."
      },
      {
        "name": "activeIndex",
        "type": "number | null",
        "required": false,
        "description": "Initial active row index"
      },
      {
        "name": "defaultActiveIndex",
        "type": "number | null",
        "required": false,
        "description": "Default active row index for uncontrolled usage"
      },
      {
        "name": "onActiveChange",
        "type": "((index: number | null, row: any) => void)",
        "required": false,
        "description": "Called when the active row changes; receives the index and the row"
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class for the root wrapper"
      },
      {
        "name": "styles",
        "type": "ChartStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "subComponents": {
      "ChartAxis": {
        "description": "Axis line, tick labels and optional title for either dimension",
        "props": [
          {
            "name": "axis",
            "type": "x | y",
            "required": false,
            "defaultValue": "y",
            "description": "Which axis to render",
            "enumValues": [
              "x",
              "y"
            ]
          },
          {
            "name": "ticks",
            "type": "number",
            "required": false,
            "description": "Preferred tick count"
          },
          {
            "name": "format",
            "type": "((value: any) => string)",
            "required": false,
            "description": "Formats tick values for display"
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Axis title rendered beside the ticks"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartAxisStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartGrid": {
        "description": "Recessive hairline gridlines aligned to the axis ticks",
        "props": [
          {
            "name": "axis",
            "type": "x | y",
            "required": false,
            "defaultValue": "y",
            "description": "Gridline axis; defaults to horizontal y-axis rules",
            "enumValues": [
              "x",
              "y"
            ]
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartGridStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartReference": {
        "description": "Annotation line marking a threshold or moment across the plot",
        "props": [
          {
            "name": "x",
            "type": "string | number | Date",
            "required": false,
            "description": "X value the reference line marks; matches a row's x value or a numeric/time position"
          },
          {
            "name": "y",
            "type": "number",
            "required": false,
            "description": "Y value the reference line marks"
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Annotation text rendered beside the line"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartReferenceStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartCursor": {
        "description": "Dashed vertical guide following the active chart row",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartCursorStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and line. Use className for conventional root classes."
          }
        ]
      },
      "ChartTooltip": {
        "description": "Floating readout of every series' value at the active row",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "children",
            "type": "((row: any, series: SeriesData[]) => ReactNode)",
            "required": false,
            "description": "Custom render function receiving the active row and the registered series"
          },
          {
            "name": "styles",
            "type": "ChartTooltipStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartLegend": {
        "description": "Swatch and label for every registered series, in registration order",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartLegendStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartLine": {
        "description": "Polyline series connecting one y value per row",
        "props": [
          {
            "name": "curve",
            "type": "linear | smooth | step",
            "required": false,
            "defaultValue": "smooth",
            "description": "Interpolation between points",
            "enumValues": [
              "linear",
              "smooth",
              "step"
            ]
          },
          {
            "name": "y",
            "type": "string | number | symbol | ((row: any) => number | null)",
            "required": true,
            "description": "Field key or accessor producing this series' y value; null renders a gap"
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Legend/tooltip name; defaults to the y key when y is a string"
          },
          {
            "name": "color",
            "type": "string",
            "required": false,
            "description": "Overrides the palette color assigned by registration order"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartSeriesStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartArea": {
        "description": "Line series with an accent fill that fades toward the baseline",
        "props": [
          {
            "name": "curve",
            "type": "linear | smooth | step",
            "required": false,
            "defaultValue": "smooth",
            "description": "Interpolation between points",
            "enumValues": [
              "linear",
              "smooth",
              "step"
            ]
          },
          {
            "name": "y",
            "type": "string | number | symbol | ((row: any) => number | null)",
            "required": true,
            "description": "Field key or accessor producing this series' y value; null renders a gap"
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Legend/tooltip name; defaults to the y key when y is a string"
          },
          {
            "name": "color",
            "type": "string",
            "required": false,
            "description": "Overrides the palette color assigned by registration order"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartSeriesStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartBar": {
        "description": "Bar series; band-scaled columns that stack by id or group side by side",
        "props": [
          {
            "name": "stack",
            "type": "string",
            "required": false,
            "description": "Series sharing a stack id are stacked; otherwise bars group side by side"
          },
          {
            "name": "y",
            "type": "string | number | symbol | ((row: any) => number | null)",
            "required": true,
            "description": "Field key or accessor producing this series' y value; null renders a gap"
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Legend/tooltip name; defaults to the y key when y is a string"
          },
          {
            "name": "color",
            "type": "string",
            "required": false,
            "description": "Overrides the palette color assigned by registration order"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartSeriesStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "ChartPoint": {
        "description": "Discrete point series; one marker per row",
        "props": [
          {
            "name": "y",
            "type": "string | number | symbol | ((row: any) => number | null)",
            "required": true,
            "description": "Field key or accessor producing this series' y value; null renders a gap"
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Legend/tooltip name; defaults to the y key when y is a string"
          },
          {
            "name": "color",
            "type": "string",
            "required": false,
            "description": "Overrides the palette color assigned by registration order"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "ChartSeriesStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "GridChart": {
        "props": [
          {
            "name": "data",
            "type": "any[]",
            "required": true,
            "description": "One row per populated grid cell."
          },
          {
            "name": "x",
            "type": "GridChartAccessor<any, GridChartKey>",
            "required": true,
            "description": "Field or accessor that identifies the cell's column."
          },
          {
            "name": "y",
            "type": "GridChartAccessor<any, GridChartKey>",
            "required": true,
            "description": "Field or accessor that identifies the cell's row."
          },
          {
            "name": "value",
            "type": "GridChartAccessor<any, number | null >",
            "required": true,
            "description": "Field or accessor that provides the cell intensity."
          },
          {
            "name": "columns",
            "type": "GridChartKey[]",
            "required": false,
            "description": "Explicit column order. Defaults to first appearance in data."
          },
          {
            "name": "rows",
            "type": "GridChartKey[]",
            "required": false,
            "description": "Explicit row order. Defaults to first appearance in data."
          },
          {
            "name": "domain",
            "type": "[number | \"auto\", number | \"auto\"]",
            "required": false,
            "description": "Intensity domain. Each \"auto\" edge is inferred from the data."
          },
          {
            "name": "levels",
            "type": "number",
            "required": false,
            "defaultValue": "5",
            "description": "Number of discrete color steps. Set to 0 for a continuous scale."
          },
          {
            "name": "color",
            "type": "string",
            "required": false,
            "defaultValue": "var(--color-1, #3987e5)",
            "description": "Filled-cell color."
          },
          {
            "name": "emptyColor",
            "type": "string",
            "required": false,
            "defaultValue": "var(--background-800, #1c2530)",
            "description": "Empty and minimum-value cell color."
          },
          {
            "name": "getColor",
            "type": "((context: GridChartCellContext<any>) => string)",
            "required": false,
            "description": "Cell color override for categorical or custom grid charts."
          },
          {
            "name": "gap",
            "type": "number",
            "required": false,
            "defaultValue": "4",
            "description": "Gap between cells in pixels."
          },
          {
            "name": "radius",
            "type": "number",
            "required": false,
            "defaultValue": "4",
            "description": "Cell corner radius in pixels."
          },
          {
            "name": "minCellSize",
            "type": "number",
            "required": false,
            "defaultValue": "16",
            "description": "Minimum cell width before the chart scrolls horizontally."
          },
          {
            "name": "height",
            "type": "Height<string | number>",
            "required": false,
            "description": "Chart height. Accepts any CSS height value."
          },
          {
            "name": "formatX",
            "type": "((value: GridChartKey) => ReactNode)",
            "required": false,
            "description": "Formats column labels."
          },
          {
            "name": "formatY",
            "type": "((value: GridChartKey) => ReactNode)",
            "required": false,
            "description": "Formats row labels."
          },
          {
            "name": "formatValue",
            "type": "((value: number) => ReactNode)",
            "required": false,
            "description": "Formats values for accessible cell labels."
          },
          {
            "name": "showLegend",
            "type": "boolean",
            "required": false,
            "defaultValue": "true",
            "description": "Show the low-to-high color key."
          },
          {
            "name": "legendLabels",
            "type": "[ReactNode, ReactNode]",
            "required": false,
            "defaultValue": "[\"Less\", \"More\"]",
            "description": "Labels displayed at the ends of the color key."
          },
          {
            "name": "legendGap",
            "type": "number",
            "required": false,
            "defaultValue": "6",
            "description": "Gap between items in the color key, in pixels."
          },
          {
            "name": "legendOffset",
            "type": "number",
            "required": false,
            "defaultValue": "16",
            "description": "Space between the grid and its color key, in pixels."
          },
          {
            "name": "activeIndex",
            "type": "number | null",
            "required": false,
            "description": "Controlled active data index."
          },
          {
            "name": "defaultActiveIndex",
            "type": "number | null",
            "required": false,
            "defaultValue": "null",
            "description": "Initial active data index."
          },
          {
            "name": "onActiveChange",
            "type": "((index: number | null, row: any) => void)",
            "required": false,
            "description": "Called when the hovered or keyboard-focused cell changes."
          },
          {
            "name": "styles",
            "type": "GridChartStyleSlots",
            "required": false
          }
        ]
      }
    },
    "examples": []
  },
  "checkbox": {
    "props": [
      {
        "name": "checked",
        "type": "boolean",
        "required": false,
        "description": "Initial checked value (uncontrolled). For controlled usage, pass `state={{ checked }}`."
      },
      {
        "name": "state",
        "type": "CheckboxState",
        "required": false,
        "description": "Controlled state. Keys that are present are controlled; absent keys stay self-managed."
      },
      {
        "name": "label",
        "type": "ReactNode",
        "required": false,
        "description": "Label text or element displayed next to the checkbox"
      },
      {
        "name": "helper",
        "type": "ReactNode",
        "required": false,
        "description": "Helper text shown below the checkbox. Prefer `helper`; `helperText` is kept as a compatibility alias."
      },
      {
        "name": "helperText",
        "type": "ReactNode",
        "required": false,
        "description": "Compatibility alias for `helper`."
      },
      {
        "name": "helperTextError",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to style the helper text as an error and mark the checkbox invalid."
      },
      {
        "name": "error",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the checkbox is invalid. Prefer `error`; `isInvalid` is an alias for form libraries."
      },
      {
        "name": "isInvalid",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Alias for `error`."
      },
      {
        "name": "isIndeterminate",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to show an indeterminate (partial selection) state. Prefer `indeterminate`; `isIndeterminate` is kept as an alias."
      },
      {
        "name": "indeterminate",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to show an indeterminate (partial selection) state."
      },
      {
        "name": "inputRef",
        "type": "Ref<HTMLInputElement>",
        "required": false,
        "description": "Ref for the underlying input. The forwarded ref remains attached to the wrapper element."
      },
      {
        "name": "styles",
        "type": "CheckboxStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "code": {
    "props": [
      {
        "name": "language",
        "type": "string",
        "required": false,
        "defaultValue": "ts",
        "description": "Programming language for syntax highlighting"
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class names"
      },
      {
        "name": "filename",
        "type": "string",
        "required": false,
        "description": "Filename displayed in the header bar"
      },
      {
        "name": "heading",
        "type": "string",
        "required": false,
        "description": "Custom heading text displayed in the header bar instead of filename"
      },
      {
        "name": "theme",
        "type": "string | { light: string; dark: string; }",
        "required": false,
        "description": "Shiki theme name or separate light/dark theme names"
      },
      {
        "name": "colorScheme",
        "type": "light | dark | system",
        "required": false,
        "defaultValue": "system",
        "description": "Color scheme used for theme selection; 'system' follows the page data-theme attribute",
        "enumValues": [
          "light",
          "dark",
          "system"
        ]
      },
      {
        "name": "preHighlightedLight",
        "type": "string",
        "required": false,
        "description": "Pre-highlighted HTML string for light mode to skip client-side Shiki processing"
      },
      {
        "name": "preHighlightedDark",
        "type": "string",
        "required": false,
        "description": "Pre-highlighted HTML string for dark mode to skip client-side Shiki processing"
      },
      {
        "name": "styles",
        "type": "CodeStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "color": {
    "props": [
      {
        "name": "state",
        "type": "ColorState",
        "required": false
      },
      {
        "name": "value",
        "type": "string",
        "required": false
      },
      {
        "name": "defaultValue",
        "type": "string",
        "required": false,
        "defaultValue": "#000000"
      },
      {
        "name": "onChange",
        "type": "((color: string) => void)",
        "required": false
      },
      {
        "name": "onChangeComplete",
        "type": "((color: string) => void)",
        "required": false
      },
      {
        "name": "showOpacity",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "showPreview",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "format",
        "type": "hex | rgb",
        "required": false,
        "defaultValue": "hex",
        "enumValues": [
          "hex",
          "rgb"
        ]
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "size",
        "type": "sm | md | lg",
        "required": false,
        "defaultValue": "md",
        "enumValues": [
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      },
      {
        "name": "styles",
        "type": "ColorStyleSlots",
        "required": false
      }
    ],
    "subComponents": {
      "Color.Area": {
        "props": [
          {
            "name": "variant",
            "type": "popover | standalone",
            "required": false,
            "defaultValue": "standalone",
            "description": "Visual treatment for the picker area. Popover mode removes the standalone shell.",
            "enumValues": [
              "popover",
              "standalone"
            ]
          }
        ]
      },
      "Color.Canvas": {
        "props": [
          {
            "name": "hue",
            "type": "number",
            "required": false,
            "description": "Current hue (0-360). Defaults to the value from context."
          },
          {
            "name": "saturation",
            "type": "number",
            "required": false,
            "description": "Current saturation (0-100). Defaults to the value from context."
          },
          {
            "name": "brightness",
            "type": "number",
            "required": false,
            "description": "Current brightness (0-100). Defaults to the value from context."
          },
          {
            "name": "onChange",
            "type": "((saturation: number, brightness: number) => void)",
            "required": false,
            "description": "Called when the user drags the canvas pointer with updated saturation and brightness values."
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false"
          },
          {
            "name": "size",
            "type": "sm | md | lg",
            "required": false,
            "defaultValue": "md",
            "enumValues": [
              "sm",
              "md",
              "lg"
            ]
          }
        ]
      },
      "Color.Slider": {
        "props": [
          {
            "name": "type",
            "type": "hue | opacity | chroma",
            "required": false,
            "defaultValue": "hue",
            "description": "Which color channel this slider controls.",
            "enumValues": [
              "hue",
              "opacity",
              "chroma"
            ]
          },
          {
            "name": "value",
            "type": "number",
            "required": false,
            "description": "Current slider value. Hue uses 0-360; opacity and OKLCH chroma use their native unit ranges."
          },
          {
            "name": "defaultValue",
            "type": "number",
            "required": false,
            "defaultValue": "#000000",
            "description": "Initial slider value for uncontrolled usage."
          },
          {
            "name": "onChange",
            "type": "((value: number) => void)",
            "required": false,
            "description": "Called when the slider value changes."
          },
          {
            "name": "color",
            "type": "string",
            "required": false,
            "description": "Base CSS color used to render opacity and chroma gradients. For chroma,\nsupply an OKLCH color so the track can preserve its lightness and hue."
          },
          {
            "name": "min",
            "type": "number",
            "required": false,
            "description": "Overrides the channel's default minimum value."
          },
          {
            "name": "max",
            "type": "number",
            "required": false,
            "description": "Overrides the channel's default maximum value."
          },
          {
            "name": "previewMax",
            "type": "number",
            "required": false,
            "description": "Maximum chroma used only for the track preview. This does not change the\nslider's interactive range."
          },
          {
            "name": "step",
            "type": "number",
            "required": false,
            "description": "Overrides the channel's default keyboard and pointer increment."
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Disables slider interaction."
          },
          {
            "name": "size",
            "type": "sm | md | lg",
            "required": false,
            "defaultValue": "md",
            "description": "Size of the slider.",
            "enumValues": [
              "sm",
              "md",
              "lg"
            ]
          },
          {
            "name": "className",
            "type": "string",
            "required": false
          },
          {
            "name": "trackClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "thumbClassName",
            "type": "string",
            "required": false
          }
        ]
      },
      "Color.Trigger": {
        "props": [
          {
            "name": "position",
            "type": "top | right | bottom | left",
            "required": false,
            "defaultValue": "bottom",
            "description": "Preferred side where the picker area appears.",
            "enumValues": [
              "top",
              "right",
              "bottom",
              "left"
            ]
          },
          {
            "name": "area",
            "type": "ReactNode",
            "required": false,
            "description": "Picker content shown in the popover. Defaults to Color.Area."
          },
          {
            "name": "popoverStyles",
            "type": "PopoverStyleSlots",
            "required": false,
            "description": "Classes applied to the popover primitive slots. The frame slot controls the picker shell padding."
          },
          {
            "name": "showArrow",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Whether to render a directional popover arrow."
          }
        ]
      },
      "ColorCanvas": {
        "description": "2D saturation/lightness gradient canvas for picking color values",
        "props": [
          {
            "name": "hue",
            "type": "number",
            "required": true,
            "description": "Current hue value (0–360) used to tint the canvas gradient"
          },
          {
            "name": "saturation",
            "type": "number",
            "required": true,
            "description": "Current saturation value (0–100) determining the horizontal position of the pointer"
          },
          {
            "name": "brightness",
            "type": "number",
            "required": true,
            "description": "Current brightness value (0–100) determining the vertical position of the pointer"
          },
          {
            "name": "onChange",
            "type": "((saturation: number, brightness: number) => void)",
            "required": false,
            "description": "Called when the user drags the canvas pointer with updated saturation and brightness values"
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "description": "Disables pointer interaction on the canvas"
          },
          {
            "name": "size",
            "type": "sm | md | lg",
            "required": false,
            "defaultValue": "md",
            "description": "Size of the canvas",
            "enumValues": [
              "sm",
              "md",
              "lg"
            ]
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "innerClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "gradientHueClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "gradientSaturationClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "gradientBrightnessClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "pointerClassName",
            "type": "string",
            "required": false
          }
        ]
      },
      "ColorInput": {
        "props": [
          {
            "name": "value",
            "type": "string",
            "required": true
          },
          {
            "name": "format",
            "type": "hex | rgb",
            "required": true,
            "enumValues": [
              "hex",
              "rgb"
            ]
          },
          {
            "name": "onFormatChange",
            "type": "((format: \"hex\" | \"rgb\") => void)",
            "required": false
          },
          {
            "name": "onValueChange",
            "type": "((value: string) => void)",
            "required": false
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false
          },
          {
            "name": "size",
            "type": "sm | md | lg",
            "required": false,
            "defaultValue": "md",
            "enumValues": [
              "sm",
              "md",
              "lg"
            ]
          },
          {
            "name": "showPreview",
            "type": "boolean",
            "required": false,
            "defaultValue": "false"
          },
          {
            "name": "previewColor",
            "type": "string",
            "required": false
          },
          {
            "name": "groupClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "inputClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "formatClassName",
            "type": "string",
            "required": false
          },
          {
            "name": "previewClassName",
            "type": "string",
            "required": false
          }
        ]
      },
      "ColorRecentColors": {
        "description": "Palette of recently used colors for quick re-selection",
        "props": [
          {
            "name": "onSelect",
            "type": "((color: string) => void)",
            "required": false,
            "description": "Called when the user clicks a recent color swatch"
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "description": "Disables all swatch buttons"
          },
          {
            "name": "size",
            "type": "sm | md | lg",
            "required": false,
            "defaultValue": "md",
            "description": "Size of the recent color swatches",
            "enumValues": [
              "sm",
              "md",
              "lg"
            ]
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "swatchClassName",
            "type": "string",
            "required": false
          }
        ]
      }
    },
    "examples": []
  },
  "command": {
    "props": [
      {
        "name": "state",
        "type": "CommandState",
        "required": false,
        "description": "External state controller. When provided, it takes precedence over open, defaultOpen, and onOpenChange.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "typeDoc": "CommandState"
        },
        "typeTokens": [
          {
            "text": "CommandState",
            "customType": "CommandState"
          }
        ]
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Controls whether the command palette is open when local state is used.",
        "category": "Core",
        "tags": {
          "category": "Core"
        },
        "typeTokens": [
          {
            "text": "boolean",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
          }
        ]
      },
      {
        "name": "defaultOpen",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Initial open state for an uncontrolled command palette.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "default": "false"
        },
        "typeTokens": [
          {
            "text": "boolean",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
          }
        ]
      },
      {
        "name": "onOpenChange",
        "type": "((open: boolean) => void)",
        "required": false,
        "description": "Called with the next open state when local state opens or closes the palette.",
        "category": "Events",
        "tags": {
          "category": "Events"
        },
        "typeTokens": [
          {
            "text": "((open: boolean) => void)"
          }
        ]
      },
      {
        "name": "embedded",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Renders the palette inline without a portal, backdrop, focus scope, or dialog semantics.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "default": "false"
        },
        "typeTokens": [
          {
            "text": "boolean",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
          }
        ]
      },
      {
        "name": "styles",
        "type": "CommandStyleSlots",
        "required": false,
        "description": "Keyed styles for the command surface and its named compound parts.",
        "category": "Styling",
        "tags": {
          "category": "Styling",
          "typeDoc": "CommandStyleSlots"
        },
        "typeTokens": [
          {
            "text": "CommandStyleSlots",
            "customType": "CommandStyleSlots"
          }
        ]
      },
      {
        "name": "items",
        "type": "CommandItem[]",
        "required": false,
        "defaultValue": "[]",
        "description": "Declarative commands used for filtering, grouping, focus order, and Command.Groups rendering.",
        "category": "Items",
        "tags": {
          "category": "Items",
          "default": "[]",
          "typeDoc": "CommandItem"
        },
        "typeTokens": [
          {
            "text": "CommandItem[]",
            "customType": "CommandItem"
          }
        ]
      },
      {
        "name": "filter",
        "type": "((command: CommandItem, query: string) => boolean)",
        "required": false,
        "description": "Includes or excludes each declarative command before query relevance ranking.",
        "category": "Items",
        "tags": {
          "category": "Items"
        },
        "typeTokens": [
          {
            "text": "((command: CommandItem, query: string) => boolean)"
          }
        ]
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "description": "Compound command content, typically Command.Input, Command.List, and item or group parts.",
        "category": "Content",
        "tags": {
          "category": "Content"
        },
        "typeTokens": [
          {
            "text": "ReactNode"
          }
        ]
      }
    ],
    "subComponents": {
      "useCommandState": {
        "description": "Creates a command palette state controller for Command and Command.Trigger.",
        "props": [
          {
            "name": "open",
            "type": "boolean",
            "required": false,
            "description": "Controlled open state.",
            "category": "Core",
            "tags": {
              "category": "Core"
            },
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          },
          {
            "name": "defaultOpen",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Initial open state when uncontrolled.",
            "category": "Core",
            "tags": {
              "category": "Core",
              "default": "false"
            },
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          },
          {
            "name": "onOpenChange",
            "type": "((open: boolean) => void)",
            "required": false,
            "description": "Called whenever the state controller receives a new open state.",
            "category": "Events",
            "tags": {
              "category": "Events"
            },
            "typeTokens": [
              {
                "text": "((open: boolean) => void)"
              }
            ]
          }
        ]
      },
      "Command.Input": {
        "description": "Search input connected to the nearest Command or Command.Root context.",
        "props": [
          {
            "name": "state",
            "type": "InputState",
            "required": false,
            "description": "Controlled state.",
            "typeTokens": [
              {
                "text": "InputState"
              }
            ]
          },
          {
            "name": "variant",
            "type": "default | ghost",
            "required": false,
            "description": "Controls the visual style of the input",
            "enumValues": [
              "default",
              "ghost"
            ],
            "typeTokens": [
              {
                "text": "default"
              },
              {
                "text": " | "
              },
              {
                "text": "ghost"
              }
            ]
          },
          {
            "name": "error",
            "type": "boolean",
            "required": false,
            "description": "Whether the input is in an error state",
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          },
          {
            "name": "icon",
            "type": "ReactNode | InputIconSlots",
            "required": false,
            "description": "Icon displayed before the input value by default, or in named prefix/suffix slots",
            "typeTokens": [
              {
                "text": "ReactNode"
              },
              {
                "text": " | "
              },
              {
                "text": "InputIconSlots"
              }
            ]
          },
          {
            "name": "actions",
            "type": "InputAction[] | InputActionSlots",
            "required": false,
            "description": "Inline actions rendered on the left or right side of the input. Passing an array keeps the existing right-side behavior.",
            "typeTokens": [
              {
                "text": "InputAction[]"
              },
              {
                "text": " | "
              },
              {
                "text": "InputActionSlots"
              }
            ]
          },
          {
            "name": "hint",
            "type": "ReactNode",
            "required": false,
            "description": "Hint content rendered inside a badge on the right side of the input, commonly used for keyboard shortcuts.",
            "typeTokens": [
              {
                "text": "ReactNode"
              }
            ]
          },
          {
            "name": "styles",
            "type": "InputStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes.",
            "typeTokens": [
              {
                "text": "InputStyleSlots"
              }
            ]
          },
          {
            "name": "hide-controls",
            "type": "boolean",
            "required": false,
            "description": "Hides the spinner controls for number inputs",
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          },
          {
            "name": "children",
            "type": "ReactNode",
            "required": false,
            "description": "Custom content rendered in place of the native `<input>`, keeping the\nsurrounding shell (focus surface, icons, actions, hint) intact. Used by\ncomposite fields such as Date.Input that own several focusable segments\ninstead of one text input.\n\nIn this mode the input-specific props (`type`, `value`, `placeholder`, the\nforwarded ref, …) have no element to apply to and are ignored — the content\nowns its own values. `disabled`, `error` and `variant` still style the shell.",
            "typeTokens": [
              {
                "text": "ReactNode"
              }
            ]
          }
        ]
      },
      "Command.List": {
        "description": "Scrollable listbox for command items, with an optional empty-state message.",
        "props": [
          {
            "name": "emptyMessage",
            "type": "string",
            "required": false,
            "defaultValue": "No items found.",
            "description": "Message rendered when the list has no children.",
            "category": "Content",
            "tags": {
              "category": "Content",
              "default": "\"No items found.\""
            },
            "typeTokens": [
              {
                "text": "string",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
              }
            ]
          },
          {
            "name": "maxHeight",
            "type": "string",
            "required": false,
            "description": "Maximum height applied to the list scroller in addition to the palette's available-height constraint.",
            "category": "Styling",
            "tags": {
              "category": "Styling",
              "mdn": "https://developer.mozilla.org/en-US/docs/Web/CSS/max-height"
            },
            "links": [
              {
                "label": "MDN",
                "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/max-height"
              }
            ],
            "typeTokens": [
              {
                "text": "string",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
              }
            ]
          }
        ]
      },
      "Command.Item": {
        "description": "Selectable command option registered with the nearest Command context. It\nemits data-highlighted as \"true\" or \"false\" and exposes option semantics.",
        "props": [
          {
            "name": "value",
            "type": "Key",
            "required": true,
            "description": "Stable key used for highlight tracking and action lookup.",
            "category": "Core",
            "tags": {
              "category": "Core"
            },
            "typeTokens": [
              {
                "text": "Key"
              }
            ]
          },
          {
            "name": "textValue",
            "type": "string",
            "required": true,
            "description": "Searchable text registered with the command engine.",
            "category": "Core",
            "tags": {
              "category": "Core"
            },
            "typeTokens": [
              {
                "text": "string",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
              }
            ]
          },
          {
            "name": "action",
            "type": "() => void | Promise<void>",
            "required": true,
            "description": "Runs when the item is clicked or selected with Enter. Promise results are not awaited.",
            "category": "Events",
            "tags": {
              "category": "Events"
            },
            "typeTokens": [
              {
                "text": "() => void"
              },
              {
                "text": " | "
              },
              {
                "text": "Promise<void>"
              }
            ]
          },
          {
            "name": "icon",
            "type": "ReactNode",
            "required": false,
            "description": "Icon rendered before the item content.",
            "category": "Content",
            "tags": {
              "category": "Content"
            },
            "typeTokens": [
              {
                "text": "ReactNode"
              }
            ]
          },
          {
            "name": "hint",
            "type": "string",
            "required": false,
            "description": "Compact badge rendered after the item content.",
            "category": "Content",
            "tags": {
              "category": "Content"
            },
            "typeTokens": [
              {
                "text": "string",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
              }
            ]
          }
        ]
      },
      "Command.Category": {
        "description": "Category header for a group of command items.",
        "props": []
      },
      "Command.Footer": {
        "description": "Footer content rendered after the command list or groups.",
        "props": []
      },
      "Command.Groups": {
        "description": "Renders the filtered declarative command collection grouped by category.",
        "props": [
          {
            "name": "renderCategory",
            "type": "((category: string) => ReactNode)",
            "required": false,
            "description": "Renders a header for each category, including undefined for uncategorized commands.",
            "category": "Content",
            "tags": {
              "category": "Content"
            },
            "typeTokens": [
              {
                "text": "((category: string) => ReactNode)"
              }
            ]
          },
          {
            "name": "renderItem",
            "type": "(command: CommandItem, hint?: string ) => ReactNode",
            "required": true,
            "description": "Renders each filtered command and receives its optional hint.",
            "category": "Content",
            "tags": {
              "category": "Content",
              "typeDoc": "CommandItem"
            },
            "typeTokens": [
              {
                "text": "(command: CommandItem, hint?: string ) => ReactNode"
              }
            ]
          }
        ]
      },
      "Command.Root": {
        "description": "Headless Command primitive with no dialog, portal, or Card chrome — it never\nunmounts itself and isn't gated on any open/close state, so it drops into a\nsidebar, panel, or list exactly like any other block of content. Compose it\nwith Command.Input / Command.List / Command.Groups / Command.Item as usual;\nuse the floating `Command` instead when you want the Cmd+K style overlay.",
        "props": [
          {
            "name": "styles",
            "type": "CommandStyleSlots",
            "required": false,
            "description": "Keyed styles for the command surface and its named compound parts.",
            "category": "Styling",
            "tags": {
              "category": "Styling",
              "typeDoc": "CommandStyleSlots"
            },
            "typeTokens": [
              {
                "text": "CommandStyleSlots",
                "customType": "CommandStyleSlots"
              }
            ]
          },
          {
            "name": "items",
            "type": "CommandItem[]",
            "required": false,
            "defaultValue": "[]",
            "description": "Declarative commands used for filtering, grouping, focus order, and Command.Groups rendering.",
            "category": "Items",
            "tags": {
              "category": "Items",
              "default": "[]",
              "typeDoc": "CommandItem"
            },
            "typeTokens": [
              {
                "text": "CommandItem[]",
                "customType": "CommandItem"
              }
            ]
          },
          {
            "name": "filter",
            "type": "((command: CommandItem, query: string) => boolean)",
            "required": false,
            "description": "Includes or excludes each declarative command before query relevance ranking.",
            "category": "Items",
            "tags": {
              "category": "Items"
            },
            "typeTokens": [
              {
                "text": "((command: CommandItem, query: string) => boolean)"
              }
            ]
          },
          {
            "name": "onOpenChange",
            "type": "((open: boolean) => void)",
            "required": false,
            "description": "Notifies a parent-owned overlay with false after selection when closeOnSelect is enabled.",
            "category": "Events",
            "tags": {
              "category": "Events"
            },
            "typeTokens": [
              {
                "text": "((open: boolean) => void)"
              }
            ]
          },
          {
            "name": "closeOnSelect",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Requests that the parent-owned overlay close after a command action is selected.",
            "category": "Core",
            "tags": {
              "category": "Core",
              "default": "false"
            },
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          }
        ]
      },
      "Command.Trigger": {
        "description": "Button trigger that opens a Command state controller and supplies dialog\ndisclosure attributes. Must share its state instance with Command.",
        "props": [
          {
            "name": "state",
            "type": "CommandState",
            "required": true,
            "description": "Command state controller opened by the trigger and used to restore focus.",
            "category": "Core",
            "tags": {
              "category": "Core",
              "typeDoc": "CommandState"
            },
            "typeTokens": [
              {
                "text": "CommandState",
                "customType": "CommandState"
              }
            ]
          },
          {
            "name": "asChild",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Clones the child as the trigger instead of wrapping it in a button. Non-button children receive button role and keyboard behavior.",
            "category": "Advanced",
            "tags": {
              "category": "Advanced",
              "default": "false"
            },
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          },
          {
            "name": "children",
            "type": "ReactElement<unknown, string | JSXElementConstructor<any>>",
            "required": true,
            "description": "Single element rendered inside the default button or cloned when asChild is enabled.",
            "category": "Content",
            "tags": {
              "category": "Content"
            },
            "typeTokens": [
              {
                "text": "ReactElement<unknown, string"
              },
              {
                "text": " | "
              },
              {
                "text": "JSXElementConstructor<any>>"
              }
            ]
          }
        ]
      }
    },
    "examples": [],
    "customTypes": {
      "CommandState": {
        "name": "CommandState",
        "summary": "Imperative open state and trigger registration shared by Command and Command.Trigger.",
        "type": "{ isOpen: boolean; setOpen: (open: boolean) => void; open: () => void; close: () => void; toggle: () => void; setTrigger: (element: HTMLElement | null) => void; triggerRef: React.MutableRefObject<HTMLElement | null> }",
        "kind": "interface",
        "members": [
          {
            "name": "isOpen",
            "type": "boolean",
            "required": true,
            "description": "Whether the command palette is currently open."
          },
          {
            "name": "setOpen",
            "type": "(open: boolean) => void",
            "required": true,
            "description": "Sets the command palette to an explicit open state."
          },
          {
            "name": "open",
            "type": "() => void",
            "required": true,
            "description": "Opens the command palette."
          },
          {
            "name": "close",
            "type": "() => void",
            "required": true,
            "description": "Closes the command palette."
          },
          {
            "name": "toggle",
            "type": "() => void",
            "required": true,
            "description": "Toggles the current open state."
          },
          {
            "name": "setTrigger",
            "type": "(element: HTMLElement | null) => void",
            "required": true,
            "description": "Registers the trigger element that receives focus after the floating palette closes."
          },
          {
            "name": "triggerRef",
            "type": "React.MutableRefObject<HTMLElement | null>",
            "required": true,
            "description": "Mutable reference to the registered trigger element."
          }
        ],
        "notes": [
          "Pass the same state instance to Command and Command.Trigger so opening and focus restoration remain coordinated."
        ]
      },
      "CommandStyleSlots": {
        "name": "CommandStyleSlots",
        "summary": "Style overrides for the command surface and its named compound parts.",
        "type": "{ root?: StyleValue; overlay?: StyleValue; search?: StyleValue; input?: StyleValue; inner?: StyleValue; list?: StyleValue; empty?: StyleValue; item?: StyleValue | CommandItemStyles; hint?: StyleValue; category?: StyleValue; footer?: StyleValue; groups?: StyleValue; group?: StyleValue }",
        "kind": "interface",
        "members": [
          {
            "name": "root",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the command surface."
          },
          {
            "name": "overlay",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the modal backdrop in floating mode."
          },
          {
            "name": "search",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the search input wrapper."
          },
          {
            "name": "input",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the search input root."
          },
          {
            "name": "inner",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the framed list container."
          },
          {
            "name": "list",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the scrollable command list."
          },
          {
            "name": "empty",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the empty-state message."
          },
          {
            "name": "item",
            "type": "StyleValue | CommandItemStyles",
            "required": false,
            "description": "Shared item styles or separate root, content, and icon styles."
          },
          {
            "name": "hint",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to item hint badges."
          },
          {
            "name": "category",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to category headers."
          },
          {
            "name": "footer",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the command footer."
          },
          {
            "name": "groups",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to the Command.Groups container."
          },
          {
            "name": "group",
            "type": "StyleValue",
            "required": false,
            "description": "Styles applied to each group rendered by Command.Groups."
          }
        ],
        "notes": [
          "The item slot accepts one shared StyleValue or a CommandItemStyles object with root, content, and icon members."
        ]
      },
      "CommandItem": {
        "name": "CommandItem",
        "summary": "Declarative command data consumed by filtering, grouping, focus management, and Command.Groups.",
        "type": "{ id: string; label: string; description?: string; category?: string; shortcut?: string; icon?: React.ReactNode; keywords?: string[]; action: () => void | Promise<void>; hint?: string }",
        "kind": "interface",
        "members": [
          {
            "name": "id",
            "type": "string",
            "required": true,
            "description": "Stable identifier used for rendering, focus tracking, and action lookup."
          },
          {
            "name": "label",
            "type": "string",
            "required": true,
            "description": "Primary searchable label for the command."
          },
          {
            "name": "description",
            "type": "string",
            "required": false,
            "description": "Supplemental description available to custom item renderers."
          },
          {
            "name": "category",
            "type": "string",
            "required": false,
            "description": "Group name used by Command.Groups."
          },
          {
            "name": "shortcut",
            "type": "string",
            "required": false,
            "description": "Keyboard shortcut text available to custom item renderers."
          },
          {
            "name": "icon",
            "type": "React.ReactNode",
            "required": false,
            "description": "Icon content available to custom item renderers."
          },
          {
            "name": "keywords",
            "type": "string[]",
            "required": false,
            "description": "Additional terms considered when ranking a search query."
          },
          {
            "name": "action",
            "type": "() => void | Promise<void>",
            "required": true,
            "description": "Action invoked when this command is selected."
          },
          {
            "name": "hint",
            "type": "string",
            "required": false,
            "description": "Compact hint text passed to the Command.Groups item renderer."
          }
        ],
        "examples": [
          "items={[{ id: \"settings\", label: \"Settings\", category: \"Navigation\", action: openSettings }]}"
        ],
        "notes": [
          "Filtering preserves the supplied item objects, then query relevance orders matches by label and keywords."
        ]
      }
    }
  },
  "confirm": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Initial confirmation visibility. For controlled usage, pass `state={{ open }}`."
      },
      {
        "name": "state",
        "type": "ConfirmState",
        "required": false,
        "description": "Controlled state."
      },
      {
        "name": "mode",
        "type": "inline | dialog",
        "required": false,
        "defaultValue": "inline",
        "description": "\"inline\" swaps the trigger for confirm/cancel buttons in place. \"dialog\" opens a modal.",
        "enumValues": [
          "inline",
          "dialog"
        ]
      },
      {
        "name": "severity",
        "type": "low | medium | high | critical",
        "required": false,
        "defaultValue": "medium",
        "description": "Severity level that affects icon and button color",
        "enumValues": [
          "low",
          "medium",
          "high",
          "critical"
        ]
      },
      {
        "name": "onConfirm",
        "type": "() => void | Promise<void>",
        "required": true,
        "description": "Called when the user confirms the action"
      },
      {
        "name": "onCancel",
        "type": "(() => void)",
        "required": false,
        "description": "Called when the user cancels the action"
      },
      {
        "name": "labels",
        "type": "ConfirmLabels",
        "required": true,
        "description": "Text for the trigger, idle/confirming stages, and confirm/cancel buttons."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the trigger button is disabled"
      },
      {
        "name": "icon",
        "type": "ReactNode",
        "required": false,
        "description": "Custom icon shown in the dialog header"
      },
      {
        "name": "destructive-action-warning",
        "type": "string",
        "required": false,
        "description": "Warning message displayed in a colored box before confirming. Dialog mode only."
      },
      {
        "name": "countdown-seconds",
        "type": "number",
        "required": false,
        "description": "Seconds the user must wait before the confirm button becomes active"
      },
      {
        "name": "requires-reason",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the user must type confirm-text to enable the confirm button. Dialog mode only."
      },
      {
        "name": "confirm-text",
        "type": "string",
        "required": false,
        "description": "Text the user must type to confirm when requires-reason is true"
      },
      {
        "name": "auto-reset-after",
        "type": "number",
        "required": false,
        "description": "Milliseconds after which the inline confirm auto-resets to idle state"
      },
      {
        "name": "styles",
        "type": "ConfirmStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "date": {
    "props": [
      {
        "name": "mode",
        "type": "single | range",
        "required": false,
        "enumValues": [
          "single",
          "range"
        ]
      },
      {
        "name": "state",
        "type": "DateState | DateRangeState",
        "required": false
      },
      {
        "name": "value",
        "type": "Date | DateRangeValue | null",
        "required": false,
        "description": "Controlled selected date\nControlled selected range"
      },
      {
        "name": "onChange",
        "type": "((date: Date) => void) | ((range: DateRangeValue) => void)",
        "required": false,
        "description": "Called when the user selects a date\nCalled whenever the start or end of the range changes"
      },
      {
        "name": "disabled",
        "type": "((date: Date) => boolean)",
        "required": false,
        "description": "Function returning true for dates that should be unselectable"
      },
      {
        "name": "minDate",
        "type": "Date",
        "required": false,
        "description": "Earliest selectable date"
      },
      {
        "name": "maxDate",
        "type": "Date",
        "required": false,
        "description": "Latest selectable date"
      },
      {
        "name": "defaultMonth",
        "type": "Date",
        "required": false,
        "description": "Month shown initially when no date is selected"
      },
      {
        "name": "styles",
        "type": "DateStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "subComponents": {
      "Date.Header": {
        "description": "Navigation header with month/year display and prev/next controls",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class for the header"
          }
        ]
      },
      "Date.Grid": {
        "description": "The 7-column calendar grid containing date cells",
        "props": [
          {
            "name": "grid",
            "type": "Date[][]",
            "required": true,
            "description": "Calendar grid rows, each containing 7 Date objects"
          },
          {
            "name": "dayCellClassName",
            "type": "string",
            "required": false,
            "description": "Classes applied to each individual date cell (DateDay component)"
          }
        ]
      },
      "Date.Day": {
        "description": "Individual date cell in the calendar grid",
        "props": [
          {
            "name": "date",
            "type": "Date",
            "required": true,
            "description": "The date this cell represents"
          }
        ]
      },
      "Date.Input": {
        "description": "A full date field: typed month/day/year segments inside an Input shell, with\na calendar action that opens the Date calendar in a Popover. This is the\nrecommended way to compose a date field — the bare Date root stays available\nfor embedded, always-visible calendars.",
        "props": [
          {
            "name": "mode",
            "type": "single | range",
            "required": false,
            "enumValues": [
              "single",
              "range"
            ]
          },
          {
            "name": "state",
            "type": "{ value?: Date | null; } | { value?: DateRangeValue | null; }",
            "required": false
          },
          {
            "name": "value",
            "type": "Date | DateRangeValue | null",
            "required": false,
            "description": "Initial selected date. Pass `state={{ value }}` for controlled usage.\nInitial selected range. Pass `state={{ value }}` for controlled usage."
          },
          {
            "name": "onChange",
            "type": "((date: Date | null) => void) | ((range: DateRangeValue) => void)",
            "required": false,
            "description": "Called when a complete date is typed or picked, or when the field is cleared.\nCalled whenever the start or end of the range changes."
          },
          {
            "name": "locale",
            "type": "string",
            "required": false,
            "description": "BCP 47 locale that determines segment order and separator."
          },
          {
            "name": "isDateDisabled",
            "type": "((date: Date) => boolean)",
            "required": false,
            "description": "Function returning true for dates that should be unselectable."
          },
          {
            "name": "minDate",
            "type": "Date",
            "required": false,
            "description": "Earliest selectable date."
          },
          {
            "name": "maxDate",
            "type": "Date",
            "required": false,
            "description": "Latest selectable date."
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "description": "Disables the whole field."
          },
          {
            "name": "error",
            "type": "boolean",
            "required": false,
            "description": "Whether the field is in an error state."
          },
          {
            "name": "variant",
            "type": "default | ghost",
            "required": false,
            "description": "Visual style forwarded to the underlying Input.",
            "enumValues": [
              "default",
              "ghost"
            ]
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Accessible name for the segment group."
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class for the field wrapper."
          }
        ]
      }
    },
    "examples": []
  },
  "divider": {
    "props": [
      {
        "name": "variant",
        "type": "solid | dashed | dotted",
        "required": false,
        "defaultValue": "solid",
        "description": "Controls the line style of the divider",
        "enumValues": [
          "solid",
          "dashed",
          "dotted"
        ]
      },
      {
        "name": "orientation",
        "type": "horizontal | vertical",
        "required": false,
        "description": "Controls the axis the divider spans",
        "enumValues": [
          "horizontal",
          "vertical"
        ]
      },
      {
        "name": "size",
        "type": "sm | md | lg | auto",
        "required": false,
        "defaultValue": "auto",
        "description": "Size of the divider thickness",
        "enumValues": [
          "sm",
          "md",
          "lg",
          "auto"
        ]
      },
      {
        "name": "spacing",
        "type": "sm | md | lg | none",
        "required": false,
        "description": "Controls the margin around the divider",
        "enumValues": [
          "sm",
          "md",
          "lg",
          "none"
        ]
      },
      {
        "name": "color",
        "type": "string",
        "required": false,
        "description": "Tailwind background color utility (e.g. \"bg-background-700\") overriding the default line color"
      },
      {
        "name": "styles",
        "type": "DividerStyleSlots",
        "required": false,
        "description": "Keyed styles for the root. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "expand": {
    "props": [
      {
        "name": "title",
        "type": "ReactNode",
        "required": false,
        "description": "Header content rendered in preset mode"
      },
      {
        "name": "layout",
        "type": "standalone | contained",
        "required": false,
        "defaultValue": "standalone",
        "description": "Controls whether the expand supplies its own radius or sits flush inside a bordered container.",
        "enumValues": [
          "standalone",
          "contained"
        ]
      },
      {
        "name": "expanded",
        "type": "boolean",
        "required": false,
        "description": "Initial expanded state. For controlled usage, pass `state={{ expanded }}`."
      },
      {
        "name": "state",
        "type": "ExpandState",
        "required": false,
        "description": "Controlled state."
      },
      {
        "name": "isExpanded",
        "type": "boolean",
        "required": false,
        "description": "@deprecated Use `expanded`."
      },
      {
        "name": "defaultExpanded",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "@deprecated Use `expanded`."
      },
      {
        "name": "onExpandedChange",
        "type": "((isExpanded: boolean) => void)",
        "required": false,
        "description": "Called when the expanded state changes"
      },
      {
        "name": "onChange",
        "type": "((isExpanded: boolean) => void)",
        "required": false,
        "description": "Alias for onExpandedChange"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the expand is disabled"
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "description": "Compound sub-components or content nodes"
      },
      {
        "name": "styles",
        "type": "ExpandStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "flex": {
    "props": [
      {
        "name": "direction",
        "type": "row | column",
        "required": false,
        "description": "Direction of the flex container",
        "enumValues": [
          "row",
          "column"
        ]
      },
      {
        "name": "wrap",
        "type": "boolean",
        "required": false,
        "description": "Whether items wrap to the next line when they overflow"
      },
      {
        "name": "gap",
        "type": "FlexGap",
        "required": false,
        "description": "Gap between flex items. A number maps directly to the Tailwind spacing scale (e.g. `gap={4}` behaves like `gap-4`)."
      },
      {
        "name": "gap-x",
        "type": "FlexGap",
        "required": false,
        "description": "Override horizontal (column) gap between items."
      },
      {
        "name": "gap-y",
        "type": "FlexGap",
        "required": false,
        "description": "Override vertical (row) gap between items."
      },
      {
        "name": "h",
        "type": "SizingValue",
        "required": false,
        "description": "Root height. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS height. Overrides `style.height` and sizing classes."
      },
      {
        "name": "w",
        "type": "SizingValue",
        "required": false,
        "description": "Root width. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS width. Overrides `style.width` and sizing classes. Defaults to full width."
      },
      {
        "name": "containerQueryResponsive",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Wraps the flex container in a container query parent for breakpoint-aware responsiveness"
      },
      {
        "name": "layout",
        "type": "center | stack | cluster | bar | actions | inline",
        "required": false,
        "description": "Golden-standard layout preset. Sets sensible `direction`/`wrap`/`gap`/`justify`/`align` defaults that any explicit prop overrides.",
        "enumValues": [
          "center",
          "stack",
          "cluster",
          "bar",
          "actions",
          "inline"
        ]
      },
      {
        "name": "justify-start",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-end",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-center",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-between",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-around",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-evenly",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-start",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-end",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-center",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-stretch",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-baseline",
        "type": "boolean",
        "required": false
      }
    ],
    "examples": []
  },
  "frame": {
    "props": [
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "SVG path data for the shape carried by the frame border. Author it along\nthe top edge, starting at `0 0` and running left to right, with the curve\nbulging *outwards* (negative y). Frame rotates it onto `side` and mirrors it\nfor `shapeMode=\"indent\"`, so one path works on every edge in either mode.\n\nIt usually returns to the edge at `pathWidth 0`, but it does not have to: a\npath anchored to a corner can leave off deep into the adjoining edge, and\nFrame closes the region back along the outside of the border either way."
      },
      {
        "name": "pathWidth",
        "type": "number",
        "required": false,
        "defaultValue": "0",
        "description": "Width of the path shape in pixels — how far along the edge it reaches from its start"
      },
      {
        "name": "side",
        "type": "top | bottom | left | right",
        "required": false,
        "defaultValue": "top",
        "description": "Which side of the frame the path shape appears on",
        "enumValues": [
          "top",
          "bottom",
          "left",
          "right"
        ]
      },
      {
        "name": "shapeAlign",
        "type": "start | center | end",
        "required": false,
        "defaultValue": "center",
        "description": "Where the path shape sits along that side. `start` and `end` pin it to a\ncorner, so a shape can swallow the corner and hand the frame a new one.",
        "enumValues": [
          "start",
          "center",
          "end"
        ]
      },
      {
        "name": "shapeMode",
        "type": "indent | extend",
        "required": false,
        "defaultValue": "indent",
        "description": "Whether the path shape is cut into the frame or protrudes from it. Either\nway the frame clips its content to the resulting outline, so anything that\nshould sit in a cutout — an avatar in a notch, say — belongs alongside the\nFrame rather than inside it.",
        "enumValues": [
          "indent",
          "extend"
        ]
      },
      {
        "name": "pathStroke",
        "type": "solid | dashed | dotted",
        "required": false,
        "defaultValue": "solid",
        "description": "Controls the line style of the frame border and notch stroke",
        "enumValues": [
          "solid",
          "dashed",
          "dotted"
        ]
      },
      {
        "name": "edges",
        "type": "top | bottom | left | right | all",
        "required": false,
        "defaultValue": "all",
        "description": "Which edges of the frame render a border stroke. A single edge keeps its corner arcs.",
        "enumValues": [
          "top",
          "bottom",
          "left",
          "right",
          "all"
        ]
      },
      {
        "name": "strokeAlign",
        "type": "center | inside | outside",
        "required": false,
        "defaultValue": "center",
        "description": "Where the border stroke sits relative to the frame bounds, like Figma's stroke position",
        "enumValues": [
          "center",
          "inside",
          "outside"
        ]
      },
      {
        "name": "styles",
        "type": "FrameStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "gallery": {
    "props": [
      {
        "name": "columns",
        "type": "number | ResponsiveColumns",
        "required": false,
        "defaultValue": "3",
        "description": "Number of columns in the gallery grid"
      },
      {
        "name": "gap",
        "type": "string | number",
        "required": false,
        "defaultValue": "md",
        "description": "Gap between gallery items"
      },
      {
        "name": "gap-x",
        "type": "string | number",
        "required": false,
        "description": "Override horizontal (column) gap between gallery items"
      },
      {
        "name": "gap-y",
        "type": "string | number",
        "required": false,
        "description": "Override vertical (row) gap between gallery items"
      },
      {
        "name": "rows",
        "type": "1 | 2 | 3 | 4 | 5 | 6 | auto",
        "required": false,
        "description": "Number of rows in the gallery grid",
        "enumValues": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "auto"
        ]
      },
      {
        "name": "responsive",
        "type": "boolean",
        "required": false,
        "description": "Whether to enable container-query-based responsive columns"
      },
      {
        "name": "styles",
        "type": "GalleryStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "subComponents": {
      "Gallery.Item": {
        "props": [
          {
            "name": "href",
            "type": "string",
            "required": false,
            "description": "URL the item links to"
          },
          {
            "name": "onPress",
            "type": "((href?: string) => void)",
            "required": false,
            "description": "Called when the item is pressed"
          },
          {
            "name": "columnSpan",
            "type": "number",
            "required": false,
            "description": "Number of columns this item spans"
          },
          {
            "name": "rowSpan",
            "type": "number",
            "required": false,
            "description": "Number of rows this item spans"
          },
          {
            "name": "orientation",
            "type": "vertical | horizontal",
            "required": false,
            "defaultValue": "vertical",
            "description": "Controls the item's layout orientation",
            "enumValues": [
              "vertical",
              "horizontal"
            ]
          },
          {
            "name": "styles",
            "type": "GalleryItemStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "Gallery.View": {
        "props": [
          {
            "name": "aspectRatio",
            "type": "string",
            "required": false,
            "defaultValue": "16/9",
            "description": "Aspect ratio of the view area (e.g. \"16/9\")"
          },
          {
            "name": "styles",
            "type": "GalleryViewStyleSlots",
            "required": false,
            "description": "Keyed styles for the root. Use className for conventional root classes."
          }
        ]
      },
      "Gallery.Body": {
        "props": [
          {
            "name": "styles",
            "type": "GalleryBodyStyleSlots",
            "required": false,
            "description": "Keyed styles for the root. Use className for conventional root classes."
          }
        ]
      }
    },
    "examples": []
  },
  "grid": {
    "props": [
      {
        "name": "columns",
        "type": "GridTemplateColumns | ResponsiveValue<GridTemplateColumns>",
        "required": false,
        "description": "Grid template columns value, or responsive object per breakpoint"
      },
      {
        "name": "rows",
        "type": "GridTemplateRows | ResponsiveValue<GridTemplateRows>",
        "required": false,
        "description": "Grid template rows value, or responsive object per breakpoint"
      },
      {
        "name": "gap",
        "type": "GridGap | ResponsiveValue<GridGap>",
        "required": false,
        "description": "Gap between all grid cells, or responsive object per breakpoint. A number maps directly to the Tailwind spacing scale (e.g. `gap={4}` behaves like `gap-4`)."
      },
      {
        "name": "h",
        "type": "SizingValue",
        "required": false,
        "description": "Root height. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS height. Overrides `style.height` and sizing classes."
      },
      {
        "name": "w",
        "type": "SizingValue",
        "required": false,
        "description": "Root width. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS width. Overrides `style.width` and sizing classes."
      },
      {
        "name": "rowGap",
        "type": "GridGap",
        "required": false,
        "description": "Override gap between rows only"
      },
      {
        "name": "columnGap",
        "type": "GridGap",
        "required": false,
        "description": "Override gap between columns only"
      },
      {
        "name": "gap-x",
        "type": "GridGap",
        "required": false,
        "description": "Override horizontal (column) gap. Alias for `columnGap`."
      },
      {
        "name": "gap-y",
        "type": "GridGap",
        "required": false,
        "description": "Override vertical (row) gap. Alias for `rowGap`."
      },
      {
        "name": "justifyItems",
        "type": "start | end | center | stretch",
        "required": false,
        "defaultValue": "stretch",
        "description": "Horizontal alignment of items within their cells",
        "enumValues": [
          "start",
          "end",
          "center",
          "stretch"
        ]
      },
      {
        "name": "alignContent",
        "type": "start | end | center | stretch | space-between | space-around | space-evenly",
        "required": false,
        "defaultValue": "start",
        "description": "Vertical distribution of the grid rows within its container",
        "enumValues": [
          "start",
          "end",
          "center",
          "stretch",
          "space-between",
          "space-around",
          "space-evenly"
        ]
      },
      {
        "name": "autoFlow",
        "type": "row | column | row-dense | column-dense",
        "required": false,
        "defaultValue": "row",
        "description": "Direction items are auto-placed when no explicit placement is set",
        "enumValues": [
          "row",
          "column",
          "row-dense",
          "column-dense"
        ]
      },
      {
        "name": "masonryColumnWidth",
        "type": "GridMasonryColumnWidth | ResponsiveValue<GridMasonryColumnWidth>",
        "required": false,
        "description": "Fixed masonry column width. Useful for horizontal masonry tracks that overflow the viewport."
      },
      {
        "name": "masonryColumnFill",
        "type": "auto | balance | balance-all",
        "required": false,
        "description": "How masonry content fills columns when the grid has a constrained height.",
        "enumValues": [
          "auto",
          "balance",
          "balance-all"
        ]
      },
      {
        "name": "masonryItemGap",
        "type": "boolean",
        "required": false,
        "defaultValue": "true",
        "description": "Whether masonry children receive the Grid-managed vertical gap margin."
      },
      {
        "name": "containerQueryResponsive",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Wraps the grid in a container query parent for breakpoint-aware responsiveness"
      },
      {
        "name": "layout",
        "type": "cards | dashboard | sidebar | sidebar-end | split | gallery",
        "required": false,
        "description": "Golden-standard layout preset. Sets sensible `columns`/`rows`/`gap` defaults that any explicit prop overrides.",
        "enumValues": [
          "cards",
          "dashboard",
          "sidebar",
          "sidebar-end",
          "split",
          "gallery"
        ]
      },
      {
        "name": "styles",
        "type": "GridStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      },
      {
        "name": "justify-start",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-end",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-center",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-between",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-around",
        "type": "boolean",
        "required": false
      },
      {
        "name": "justify-evenly",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-start",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-end",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-center",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-stretch",
        "type": "boolean",
        "required": false
      },
      {
        "name": "align-baseline",
        "type": "boolean",
        "required": false
      }
    ],
    "examples": []
  },
  "group": {
    "props": [
      {
        "name": "variant",
        "type": "string",
        "required": false,
        "description": "Variant class appended to the root and grouped slots. Accepts any string."
      },
      {
        "name": "orientation",
        "type": "horizontal | vertical",
        "required": false,
        "defaultValue": "horizontal",
        "description": "Controls the axis that children are arranged along",
        "enumValues": [
          "horizontal",
          "vertical"
        ]
      },
      {
        "name": "spacing",
        "type": "none | xs | sm",
        "required": false,
        "defaultValue": "none",
        "description": "Controls the gap between group items",
        "enumValues": [
          "none",
          "xs",
          "sm"
        ]
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether all items in the group are non-interactive"
      },
      {
        "name": "value",
        "type": "string",
        "required": false,
        "description": "The currently active button value for toggle group behavior"
      },
      {
        "name": "onChange",
        "type": "((value: string) => void)",
        "required": false,
        "description": "Called when a button with a value prop is pressed"
      },
      {
        "name": "styles",
        "type": "GroupStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "icon": {
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "SVG filename with or without the `.svg` extension."
      },
      {
        "name": "variant",
        "type": "string",
        "required": false,
        "description": "Icon collection to resolve. Falls back to the `IconProvider`'s `defaultVariant`."
      },
      {
        "name": "size",
        "type": "string | number",
        "required": false,
        "defaultValue": "20",
        "description": "Width and height. Numeric values are interpreted as pixels."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Accessible label for a meaningful icon. Icons are decorative by default."
      },
      {
        "name": "assetBaseUrl",
        "type": "string",
        "required": false,
        "description": "Per-icon override for the provider's asset base URL."
      }
    ],
    "subComponents": {
      "normalizeIconId": {
        "props": []
      },
      "IconProvider": {
        "props": [
          {
            "name": "assetBaseUrl",
            "type": "string",
            "required": false,
            "defaultValue": "/ui-lab-icons",
            "description": "Base URL containing variant folders. Defaults to `/ui-lab-icons`."
          },
          {
            "name": "defaultVariant",
            "type": "string",
            "required": false,
            "description": "Variant folder to use when an `<Icon>` doesn't specify one."
          },
          {
            "name": "resolveSource",
            "type": "IconSourceResolver",
            "required": false,
            "description": "Optional application-level resolver for base paths, CDNs, or custom asset layouts."
          }
        ]
      }
    },
    "examples": []
  },
  "input": {
    "props": [
      {
        "name": "state",
        "type": "InputState",
        "required": false,
        "description": "Controlled state. Takes precedence over the native value prop.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "typeDoc": "InputState"
        },
        "typeTokens": [
          {
            "text": "InputState",
            "customType": "InputState"
          }
        ]
      },
      {
        "name": "variant",
        "type": "InputVariant",
        "required": false,
        "defaultValue": "default",
        "description": "Controls the visual treatment of the input surface.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "default": "\"default\"",
          "typeDoc": "InputVariant"
        },
        "typeTokens": [
          {
            "text": "InputVariant",
            "customType": "InputVariant"
          }
        ]
      },
      {
        "name": "error",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Applies error styling to the input surface.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "default": "false"
        },
        "typeTokens": [
          {
            "text": "boolean",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
          }
        ]
      },
      {
        "name": "icon",
        "type": "ReactNode | InputIconSlots",
        "required": false,
        "description": "Icon displayed before the input value by default, or in named prefix/suffix slots.",
        "category": "Content",
        "tags": {
          "category": "Content",
          "typeDoc": "InputIconSlots"
        },
        "typeTokens": [
          {
            "text": "ReactNode"
          },
          {
            "text": " | "
          },
          {
            "text": "InputIconSlots",
            "customType": "InputIconSlots"
          }
        ]
      },
      {
        "name": "actions",
        "type": "InputAction[] | InputActionSlots",
        "required": false,
        "description": "Inline actions rendered on the left or right side of the input. An array renders on the right.",
        "category": "Content",
        "tags": {
          "category": "Content",
          "typeDoc": "InputActionSlots"
        },
        "typeTokens": [
          {
            "text": "InputAction[]",
            "customType": "InputAction"
          },
          {
            "text": " | "
          },
          {
            "text": "InputActionSlots",
            "customType": "InputActionSlots"
          }
        ]
      },
      {
        "name": "hint",
        "type": "ReactNode",
        "required": false,
        "description": "Hint content rendered on the right side of the input, commonly used for keyboard shortcuts.",
        "category": "Content",
        "tags": {
          "category": "Content"
        },
        "typeTokens": [
          {
            "text": "ReactNode"
          }
        ]
      },
      {
        "name": "styles",
        "type": "InputStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes.",
        "category": "Styling",
        "tags": {
          "category": "Styling",
          "typeDoc": "InputStyleSlots"
        },
        "typeTokens": [
          {
            "text": "InputStyleSlots",
            "customType": "InputStyleSlots"
          }
        ]
      },
      {
        "name": "hide-controls",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Hides the spinner controls for number inputs.",
        "category": "Core",
        "tags": {
          "category": "Core",
          "default": "false"
        },
        "typeTokens": [
          {
            "text": "boolean",
            "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
          }
        ]
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "description": "Custom content rendered in place of the native `<input>`, keeping the\nsurrounding shell (focus surface, icons, actions, hint) intact. Used by\ncomposite fields such as Date.Input that own several focusable segments\ninstead of one text input.\n\nIn this mode the input-specific props (`type`, `value`, `placeholder`, the\nforwarded ref, …) have no element to apply to and are ignored — the content\nowns its own values. `disabled`, `error` and `variant` still style the shell.",
        "typeTokens": [
          {
            "text": "ReactNode"
          }
        ]
      }
    ],
    "propGroups": [
      {
        "name": "Core"
      },
      {
        "name": "Content"
      },
      {
        "name": "Events"
      },
      {
        "name": "Styling"
      },
      {
        "name": "Forms"
      },
      {
        "name": "Accessibility"
      },
      {
        "name": "Advanced"
      }
    ],
    "stateAttributes": [
      {
        "name": "data-focused",
        "description": "The input or its custom content has focus.",
        "values": [
          "true"
        ]
      },
      {
        "name": "data-focus-visible",
        "description": "The input has keyboard-visible focus.",
        "values": [
          "true"
        ]
      },
      {
        "name": "data-disabled",
        "description": "The input is disabled.",
        "values": [
          "true"
        ]
      },
      {
        "name": "data-error",
        "description": "The input displays error styling.",
        "values": [
          "true"
        ]
      },
      {
        "name": "data-variant",
        "description": "The resolved variant name."
      }
    ],
    "customTypes": {
      "InputVariant": {
        "name": "InputVariant",
        "summary": "An open string type selecting the input surface treatment.",
        "type": "\"default\" | \"ghost\" | (string & {})",
        "kind": "alias",
        "notes": [
          "The built-in variants are default and ghost; custom variant names remain valid theme hooks."
        ]
      },
      "InputState": {
        "name": "InputState",
        "summary": "Controlled values accepted through the Input state abstraction.",
        "type": "{ value?: string }",
        "kind": "interface",
        "members": [
          {
            "name": "value",
            "type": "string",
            "required": false,
            "description": "Current input value. Takes precedence over the native value prop."
          }
        ]
      },
      "InputIconSlots": {
        "name": "InputIconSlots",
        "summary": "Icon content positioned before and/or after the input value.",
        "type": "{ prefix?: React.ReactNode; suffix?: React.ReactNode }",
        "kind": "interface",
        "members": [
          {
            "name": "prefix",
            "type": "React.ReactNode",
            "required": false,
            "description": "Content rendered before the input value."
          },
          {
            "name": "suffix",
            "type": "React.ReactNode",
            "required": false,
            "description": "Content rendered after the input value."
          }
        ]
      },
      "InputActionDef": {
        "name": "InputActionDef",
        "summary": "Declarative inline action rendered as an icon button.",
        "type": "{ icon: React.ReactNode; title: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }",
        "kind": "interface",
        "members": [
          {
            "name": "icon",
            "type": "React.ReactNode",
            "required": true,
            "description": "Icon content for the action button."
          },
          {
            "name": "title",
            "type": "string",
            "required": true,
            "description": "Accessible name and tooltip content for the action button."
          },
          {
            "name": "onClick",
            "type": "React.MouseEventHandler<HTMLButtonElement>",
            "required": false,
            "description": "Invoked when the action button is pressed."
          }
        ]
      },
      "InputAction": {
        "name": "InputAction",
        "summary": "An inline action definition or custom action node.",
        "type": "InputActionDef | React.ReactNode",
        "kind": "alias"
      },
      "InputActionSlots": {
        "name": "InputActionSlots",
        "summary": "Inline actions positioned at either edge of the input.",
        "type": "{ left?: InputAction[]; right?: InputAction[] }",
        "kind": "interface",
        "members": [
          {
            "name": "left",
            "type": "InputAction[]",
            "required": false,
            "description": "Actions rendered before the input value."
          },
          {
            "name": "right",
            "type": "InputAction[]",
            "required": false,
            "description": "Actions rendered after the input value."
          }
        ]
      },
      "InputStyleSlots": {
        "name": "InputStyleSlots",
        "summary": "Named style slots for the Input anatomy.",
        "type": "{ root?: StyleValue; input?: StyleValue; startAdornments?: StyleValue; endAdornments?: StyleValue; icon?: StyleValue | InputIconStyles; actions?: StyleValue | InputActionStyles; hint?: StyleValue; controls?: StyleValue; stepper?: StyleValue | InputStepperStyles }",
        "kind": "interface",
        "members": [
          {
            "name": "root",
            "type": "StyleValue",
            "required": false,
            "description": "Styles the visual input surface."
          },
          {
            "name": "input",
            "type": "StyleValue",
            "required": false,
            "description": "Styles the native input or custom input content surface."
          },
          {
            "name": "startAdornments",
            "type": "StyleValue",
            "required": false,
            "description": "Styles the wrapper for leading icons and actions."
          },
          {
            "name": "endAdornments",
            "type": "StyleValue",
            "required": false,
            "description": "Styles the wrapper for trailing icons, actions, hints, and steppers."
          },
          {
            "name": "icon",
            "type": "StyleValue | InputIconStyles",
            "required": false,
            "description": "Styles one or both icon wrappers."
          },
          {
            "name": "actions",
            "type": "StyleValue | InputActionStyles",
            "required": false,
            "description": "Styles one or both actions wrappers."
          },
          {
            "name": "hint",
            "type": "StyleValue",
            "required": false,
            "description": "Styles the hint content."
          },
          {
            "name": "controls",
            "type": "StyleValue",
            "required": false,
            "description": "Styles the number-input controls wrapper."
          },
          {
            "name": "stepper",
            "type": "StyleValue | InputStepperStyles",
            "required": false,
            "description": "Styles one or both number-input stepper buttons."
          }
        ]
      }
    },
    "examples": []
  },
  "label": {
    "props": [
      {
        "name": "styles",
        "type": "LabelStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Whether to show a required asterisk indicator"
      },
      {
        "name": "helperText",
        "type": "ReactNode",
        "required": false,
        "description": "Helper text shown below the label"
      },
      {
        "name": "helperTextError",
        "type": "boolean",
        "required": false,
        "description": "Whether to style the helper text as an error"
      },
      {
        "name": "size",
        "type": "\"sm\" | \"md\" | \"lg\" | null",
        "required": false,
        "defaultValue": "md",
        "description": "Size of the label text"
      },
      {
        "name": "disabled",
        "type": "boolean | null",
        "required": false,
        "description": "Whether the label appears disabled"
      },
      {
        "name": "error",
        "type": "boolean | null",
        "required": false,
        "description": "Whether to apply error styling"
      }
    ],
    "examples": []
  },
  "list": {
    "props": [
      {
        "name": "items",
        "type": "unknown[]",
        "required": false,
        "defaultValue": "[]",
        "description": "Array of data items; length used for keyboard navigation bounds"
      },
      {
        "name": "variant",
        "type": "default | feed",
        "required": false,
        "defaultValue": "default",
        "description": "Controls the visual style of the list",
        "enumValues": [
          "default",
          "feed"
        ]
      },
      {
        "name": "orientation",
        "type": "vertical | horizontal",
        "required": false,
        "defaultValue": "vertical",
        "description": "Controls whether list items are stacked vertically or laid out horizontally",
        "enumValues": [
          "vertical",
          "horizontal"
        ]
      },
      {
        "name": "gap",
        "type": "xs | sm | md | lg | xl",
        "required": false,
        "description": "Controls the gap between list items",
        "enumValues": [
          "xs",
          "sm",
          "md",
          "lg",
          "xl"
        ]
      },
      {
        "name": "spacing",
        "type": "default | sm",
        "required": false,
        "defaultValue": "default",
        "description": "Controls the spacing between list items",
        "enumValues": [
          "default",
          "sm"
        ]
      },
      {
        "name": "onNavigate",
        "type": "ListNavigateCallbacks",
        "required": false,
        "description": "Keyboard navigation event callbacks"
      },
      {
        "name": "highlighted",
        "type": "string | number | null",
        "required": false,
        "description": "Value of the externally highlighted item; the container instantly scrolls the `[data-highlighted=\"true\"]` item into view when this changes"
      },
      {
        "name": "styles",
        "type": "ListStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "subComponents": {
      "List.Header": {
        "description": "Semantic heading region for list content",
        "props": []
      },
      "List.ActionGroup": {
        "description": "Row of action buttons aligned to the right of a list item",
        "props": [
          {
            "name": "justify",
            "type": "start | between | end",
            "required": false,
            "defaultValue": "start",
            "description": "Controls the horizontal alignment of action group items",
            "enumValues": [
              "start",
              "between",
              "end"
            ]
          }
        ]
      },
      "List.Divider": {
        "description": "Horizontal separator between list sections",
        "props": [
          {
            "name": "variant",
            "type": "solid | dashed | dotted",
            "required": false,
            "defaultValue": "default",
            "description": "Controls the line style of the divider",
            "enumValues": [
              "solid",
              "dashed",
              "dotted"
            ]
          },
          {
            "name": "orientation",
            "type": "vertical | horizontal",
            "required": false,
            "defaultValue": "vertical",
            "description": "Controls the axis the divider spans",
            "enumValues": [
              "vertical",
              "horizontal"
            ]
          },
          {
            "name": "size",
            "type": "sm | md | lg | auto",
            "required": false,
            "description": "Size of the divider thickness",
            "enumValues": [
              "sm",
              "md",
              "lg",
              "auto"
            ]
          },
          {
            "name": "spacing",
            "type": "sm | md | lg | none",
            "required": false,
            "defaultValue": "default",
            "description": "Controls the margin around the divider",
            "enumValues": [
              "sm",
              "md",
              "lg",
              "none"
            ]
          },
          {
            "name": "color",
            "type": "string",
            "required": false,
            "description": "Tailwind background color utility (e.g. \"bg-background-700\") overriding the default line color"
          },
          {
            "name": "styles",
            "type": "DividerStyleSlots",
            "required": false,
            "description": "Keyed styles for the root. Use className for conventional root classes."
          }
        ]
      },
      "List.Footer": {
        "description": "Semantic footer region for list content",
        "props": []
      },
      "List.Actions": {
        "description": "Trailing actions container for a list item. Place it among the item's children\nto control where the actions render; when omitted, List.Item appends it after\nthe row content. Reads action definitions from the item's `actions` prop unless\n`actions` or `children` are provided directly.",
        "props": [
          {
            "name": "actions",
            "type": "(ListActionDef | ReactNode)[]",
            "required": false,
            "description": "Action definitions to render. Falls back to the parent List.Item's `actions` prop."
          },
          {
            "name": "children",
            "type": "ReactNode",
            "required": false,
            "description": "Custom action content. Overrides `actions` when provided."
          }
        ]
      },
      "List.Checkbox": {
        "description": "Interactive checkbox inside a list item",
        "props": [
          {
            "name": "placement",
            "type": "start | end",
            "required": false,
            "defaultValue": "end",
            "description": "Controls whether the checkbox is placed before or after row content.",
            "enumValues": [
              "start",
              "end"
            ]
          },
          {
            "name": "onCheckedChange",
            "type": "((checked: boolean, event: ChangeEvent<HTMLInputElement>) => void)",
            "required": false,
            "description": "Called with the next checked value when the checkbox changes."
          },
          {
            "name": "checked",
            "type": "boolean",
            "required": false,
            "description": "Initial checked value (uncontrolled). For controlled usage, pass `state={{ checked }}`."
          },
          {
            "name": "state",
            "type": "CheckboxState",
            "required": false,
            "description": "Controlled state. Keys that are present are controlled; absent keys stay self-managed."
          },
          {
            "name": "label",
            "type": "ReactNode",
            "required": false,
            "description": "Label text or element displayed next to the checkbox"
          },
          {
            "name": "helper",
            "type": "ReactNode",
            "required": false,
            "description": "Helper text shown below the checkbox. Prefer `helper`; `helperText` is kept as a compatibility alias."
          },
          {
            "name": "helperText",
            "type": "ReactNode",
            "required": false,
            "description": "Compatibility alias for `helper`."
          },
          {
            "name": "helperTextError",
            "type": "boolean",
            "required": false,
            "description": "Whether to style the helper text as an error and mark the checkbox invalid."
          },
          {
            "name": "error",
            "type": "boolean",
            "required": false,
            "description": "Whether the checkbox is invalid. Prefer `error`; `isInvalid` is an alias for form libraries."
          },
          {
            "name": "isInvalid",
            "type": "boolean",
            "required": false,
            "description": "Alias for `error`."
          },
          {
            "name": "isIndeterminate",
            "type": "boolean",
            "required": false,
            "description": "Whether to show an indeterminate (partial selection) state. Prefer `indeterminate`; `isIndeterminate` is kept as an alias."
          },
          {
            "name": "indeterminate",
            "type": "boolean",
            "required": false,
            "description": "Whether to show an indeterminate (partial selection) state."
          },
          {
            "name": "inputRef",
            "type": "Ref<HTMLInputElement>",
            "required": false,
            "description": "Ref for the underlying input. The forwarded ref remains attached to the wrapper element."
          },
          {
            "name": "styles",
            "type": "CheckboxStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "List.CheckboxIndicator": {
        "description": "Non-interactive checkbox indicator inside a list item",
        "props": [
          {
            "name": "checked",
            "type": "boolean",
            "required": false,
            "description": "Whether the indicator is in a checked state"
          }
        ]
      },
      "List.Switch": {
        "description": "Interactive switch inside a list item",
        "props": [
          {
            "name": "size",
            "type": "default | sm",
            "required": false,
            "description": "Size of the switch",
            "enumValues": [
              "default",
              "sm"
            ]
          },
          {
            "name": "checked",
            "type": "boolean",
            "required": false,
            "description": "Initial checked state. For controlled usage, pass `state={{ checked }}`."
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "description": "Whether the switch is disabled"
          },
          {
            "name": "onChange",
            "type": "((isSelected: boolean) => void)",
            "required": false,
            "description": "Called when the switch is toggled"
          },
          {
            "name": "state",
            "type": "SwitchState",
            "required": false,
            "description": "Controlled state."
          },
          {
            "name": "styles",
            "type": "SwitchStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          },
          {
            "name": "isSelected",
            "type": "boolean",
            "required": false,
            "description": "@deprecated Use `state={{ checked }}`."
          },
          {
            "name": "defaultSelected",
            "type": "boolean",
            "required": false,
            "description": "@deprecated Use `checked`."
          }
        ]
      },
      "List.Input": {
        "description": "Input element inside a list item",
        "props": [
          {
            "name": "children",
            "type": "ReactNode",
            "required": false,
            "description": "Custom content rendered in place of the native `<input>`, keeping the\nsurrounding shell (focus surface, icons, actions, hint) intact. Used by\ncomposite fields such as Date.Input that own several focusable segments\ninstead of one text input.\n\nIn this mode the input-specific props (`type`, `value`, `placeholder`, the\nforwarded ref, …) have no element to apply to and are ignored — the content\nowns its own values. `disabled`, `error` and `variant` still style the shell."
          },
          {
            "name": "state",
            "type": "InputState",
            "required": false,
            "description": "Controlled state."
          },
          {
            "name": "error",
            "type": "boolean",
            "required": false,
            "description": "Whether the input is in an error state"
          },
          {
            "name": "styles",
            "type": "InputStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          },
          {
            "name": "variant",
            "type": "default | ghost",
            "required": false,
            "description": "Controls the visual style of the input",
            "enumValues": [
              "default",
              "ghost"
            ]
          },
          {
            "name": "icon",
            "type": "ReactNode | InputIconSlots",
            "required": false,
            "description": "Icon displayed before the input value by default, or in named prefix/suffix slots"
          },
          {
            "name": "actions",
            "type": "InputAction[] | InputActionSlots",
            "required": false,
            "description": "Inline actions rendered on the left or right side of the input. Passing an array keeps the existing right-side behavior."
          },
          {
            "name": "hint",
            "type": "ReactNode",
            "required": false,
            "description": "Hint content rendered inside a badge on the right side of the input, commonly used for keyboard shortcuts."
          },
          {
            "name": "hide-controls",
            "type": "boolean",
            "required": false,
            "description": "Hides the spinner controls for number inputs"
          }
        ]
      },
      "List.Select": {
        "description": "Select element wrapper inside a list item",
        "props": [
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "description": "Disables the entire select and prevents interaction"
          },
          {
            "name": "value",
            "type": "Key | Key[]",
            "required": false,
            "description": "Initial selected value."
          },
          {
            "name": "defaultValue",
            "type": "string",
            "required": false,
            "description": "Default display text shown in the trigger when nothing is selected"
          },
          {
            "name": "autoFocus",
            "type": "boolean",
            "required": false,
            "description": "Focuses the trigger automatically on mount"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class for the root wrapper"
          },
          {
            "name": "state",
            "type": "SelectState",
            "required": false,
            "description": "Controlled state. `value` is a key (single) or key array (multiple)."
          },
          {
            "name": "label",
            "type": "string",
            "required": false,
            "description": "Display text for the currently selected value — used for SSR/SSG to avoid\nflash of placeholder before items register. Provide alongside selectedKey or\ndefaultSelectedKey so the correct label renders on the first pass."
          },
          {
            "name": "styles",
            "type": "SelectStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          },
          {
            "name": "filter",
            "type": "((item: any) => boolean)",
            "required": false,
            "description": "Custom filter predicate applied to the items array"
          },
          {
            "name": "open",
            "type": "boolean",
            "required": false,
            "description": "Initial open state."
          },
          {
            "name": "mode",
            "type": "multiple | single",
            "required": false,
            "description": "Selection mode: \"single\" for one item, \"multiple\" for multi-item selection",
            "enumValues": [
              "multiple",
              "single"
            ]
          },
          {
            "name": "items",
            "type": "any[]",
            "required": false,
            "description": "External items array — used when items are provided as data rather than JSX"
          },
          {
            "name": "selectedKey",
            "type": "Key | null",
            "required": false,
            "description": "Controlled selected key for single-select mode"
          },
          {
            "name": "defaultSelectedKey",
            "type": "Key | null",
            "required": false,
            "description": "Default selected key for uncontrolled single-select"
          },
          {
            "name": "selectedKeys",
            "type": "Key[]",
            "required": false,
            "description": "Controlled selected keys for multi-select mode"
          },
          {
            "name": "defaultSelectedKeys",
            "type": "Key[]",
            "required": false,
            "description": "Default selected keys for uncontrolled multi-select"
          },
          {
            "name": "onSelectionChange",
            "type": "((value: any) => void)",
            "required": false,
            "description": "Called when selection changes; receives a single key (single) or key array (multiple)"
          },
          {
            "name": "maxItems",
            "type": "number",
            "required": false,
            "description": "Maximum number of items visible before the dropdown scrolls"
          },
          {
            "name": "trigger",
            "type": "click | hover",
            "required": false,
            "description": "How the dropdown opens: \"click\" (default) or \"hover\"",
            "enumValues": [
              "click",
              "hover"
            ]
          }
        ]
      },
      "List.Desc": {
        "description": "Secondary description text below the list item label",
        "props": [
          {
            "name": "children",
            "type": "ReactNode",
            "required": true,
            "description": "Secondary description text content"
          }
        ]
      },
      "List.Item": {
        "description": "A single interactive row in the list",
        "props": [
          {
            "name": "value",
            "type": "string",
            "required": false,
            "description": "Unique value identifier for this item"
          },
          {
            "name": "focusable",
            "type": "boolean",
            "required": false,
            "defaultValue": "true",
            "description": "Whether the item should participate in the tab order by default"
          },
          {
            "name": "interactive",
            "type": "boolean",
            "required": false,
            "description": "Whether the item responds to hover and keyboard highlight"
          },
          {
            "name": "selected",
            "type": "boolean",
            "required": false,
            "description": "Whether the item is in a selected state"
          },
          {
            "name": "styles",
            "type": "ListStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          },
          {
            "name": "actions",
            "type": "(ReactNode | ListActionDef)[]",
            "required": false
          }
        ]
      },
      "List.Media": {
        "description": "Slot sub-component for media content in a list item",
        "props": [
          {
            "name": "children",
            "type": "ReactNode",
            "required": true,
            "description": "Child content for the media slot"
          }
        ]
      },
      "List.Title": {
        "description": "Primary label text in a list item",
        "props": [
          {
            "name": "children",
            "type": "ReactNode",
            "required": true,
            "description": "Primary label text content"
          }
        ]
      }
    },
    "examples": []
  },
  "mask": {
    "props": [
      {
        "name": "asChild",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "styles",
        "type": "MaskStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "menu": {
    "props": [
      {
        "name": "state",
        "type": "{ open?: boolean; selected?: Set<Key>; }",
        "required": false,
        "description": "Controlled state."
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Initial open state."
      },
      {
        "name": "type",
        "type": "context-menu | pop-over",
        "required": false,
        "defaultValue": "context-menu",
        "description": "The behavior type of the menu",
        "enumValues": [
          "context-menu",
          "pop-over"
        ]
      },
      {
        "name": "selectionMode",
        "type": "none | single | multiple",
        "required": false,
        "defaultValue": "none",
        "description": "Controls how many items can be selected at once",
        "enumValues": [
          "none",
          "single",
          "multiple"
        ]
      },
      {
        "name": "selectedKeys",
        "type": "Set<Key>",
        "required": false,
        "description": "Controlled set of selected item keys"
      },
      {
        "name": "defaultSelectedKeys",
        "type": "Set<Key>",
        "required": false,
        "description": "Initial selected keys for uncontrolled usage"
      },
      {
        "name": "onSelectionChange",
        "type": "((keys: Set<Key>) => void)",
        "required": false,
        "description": "Called when the selected keys change"
      }
    ],
    "subComponents": {
      "MenuSubmenuContext": {
        "props": []
      },
      "RadioGroupContext": {
        "props": []
      },
      "MenuPortal": {
        "props": [
          {
            "name": "container",
            "type": "HTMLElement",
            "required": false,
            "description": "DOM element to portal the menu content into"
          }
        ]
      },
      "MenuTrigger": {
        "description": "Wrapper element that opens the context menu on right-click",
        "props": [
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Whether the trigger is non-interactive"
          },
          {
            "name": "as",
            "type": "button | span | child",
            "required": false,
            "description": "Render using Button, a span, or exactly one child element. Defaults to button for pop-overs and span for context menus.",
            "enumValues": [
              "button",
              "span",
              "child"
            ]
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuTriggerStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          },
          {
            "name": "href",
            "type": "string",
            "required": false,
            "description": "Renders the button as an anchor element when provided"
          },
          {
            "name": "target",
            "type": "HTMLAttributeAnchorTarget",
            "required": false,
            "description": "Browsing context for the anchor variant (e.g. \"_blank\")"
          },
          {
            "name": "variant",
            "type": "string",
            "required": false,
            "description": "Variant class appended to the root element. Accepts any string."
          },
          {
            "name": "size",
            "type": "ButtonSize",
            "required": false,
            "description": "Size class appended to the root element. Accepts any string."
          },
          {
            "name": "onPress",
            "type": "((e: PressEvent) => void)",
            "required": false,
            "description": "React Aria press handler — preferred over onClick for accessibility"
          },
          {
            "name": "icon",
            "type": "ReactNode | ButtonIconSlots",
            "required": false,
            "description": "Icon slots rendered before (left) or after (right) the button label"
          },
          {
            "name": "hint",
            "type": "HintValue",
            "required": false,
            "description": "Keyboard shortcut or hint rendered as a Badge at the end of the button. An array renders its segments joined by a `+` divider."
          },
          {
            "name": "data-hovered",
            "type": "true | false",
            "required": false,
            "description": "Forces the visual hover state. Set by Menu.Trigger to keep the trigger highlighted while the menu is open.",
            "enumValues": [
              "true",
              "false"
            ]
          }
        ]
      },
      "MenuContent": {
        "description": "Floating panel that contains the menu items, positioned relative to the click location",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "side",
            "type": "top | bottom | left | right",
            "required": false,
            "defaultValue": "bottom",
            "description": "The side to position the menu content relative to the trigger (for pop-over type)",
            "enumValues": [
              "top",
              "bottom",
              "left",
              "right"
            ]
          },
          {
            "name": "align",
            "type": "start | center | end",
            "required": false,
            "defaultValue": "start",
            "description": "The alignment of the menu content relative to the trigger (for pop-over type)",
            "enumValues": [
              "start",
              "center",
              "end"
            ]
          },
          {
            "name": "onCloseAutoFocus",
            "type": "((event: Event) => void)",
            "required": false,
            "description": "Called when focus returns to the trigger after close"
          },
          {
            "name": "onEscapeKeyDown",
            "type": "((event: KeyboardEvent) => void)",
            "required": false,
            "description": "Called when the Escape key is pressed"
          },
          {
            "name": "onPointerDownOutside",
            "type": "((event: PointerEvent) => void)",
            "required": false,
            "description": "Called when a pointer event occurs outside the menu"
          },
          {
            "name": "offset",
            "type": "number",
            "required": false,
            "defaultValue": "0",
            "description": "Distance offset from the trigger in all directions (for pop-over type)"
          },
          {
            "name": "styles",
            "type": "MenuContentStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuGroup": {
        "description": "Logical grouping container for related menu items",
        "props": []
      },
      "MenuRadioGroup": {
        "description": "Group of mutually exclusive radio items sharing a single selected value",
        "props": [
          {
            "name": "value",
            "type": "string",
            "required": false,
            "description": "Controlled value of the selected radio item"
          },
          {
            "name": "onValueChange",
            "type": "((value: string) => void)",
            "required": false,
            "description": "Called when the selected radio value changes"
          }
        ]
      },
      "MenuLabel": {
        "description": "Non-interactive label for a section of menu items",
        "props": [
          {
            "name": "inset",
            "type": "boolean",
            "required": false,
            "description": "Whether to add leading inset padding"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuLabelStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuSeparator": {
        "description": "Horizontal rule that visually divides sections of the menu",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuSeparatorStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuShortcut": {
        "description": "Keyboard shortcut hint aligned to the right side of a menu item",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuShortcutStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuItem": {
        "description": "A clickable action item that closes the menu on selection",
        "props": [
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Whether the item is non-interactive"
          },
          {
            "name": "onSelect",
            "type": "(() => void)",
            "required": false,
            "description": "Called when the item is selected"
          },
          {
            "name": "textValue",
            "type": "string",
            "required": false,
            "description": "Accessible text used for typeahead matching"
          },
          {
            "name": "inset",
            "type": "boolean",
            "required": false,
            "description": "Whether to add leading inset padding"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuItemStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuCheckboxItem": {
        "description": "A menu item with a checkmark indicator for toggling a boolean state",
        "props": [
          {
            "name": "checked",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Whether the checkbox item is checked"
          },
          {
            "name": "onCheckedChange",
            "type": "((checked: boolean) => void)",
            "required": false,
            "description": "Called when the checked state changes"
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Whether the item is non-interactive"
          },
          {
            "name": "onSelect",
            "type": "(() => void)",
            "required": false,
            "description": "Called when the item is selected"
          },
          {
            "name": "textValue",
            "type": "string",
            "required": false,
            "description": "Accessible text used for typeahead matching"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuCheckboxItemStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuRadioItem": {
        "description": "A mutually exclusive option within a MenuRadioGroup",
        "props": [
          {
            "name": "value",
            "type": "string",
            "required": true,
            "description": "Value this radio item represents"
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Whether the item is non-interactive"
          },
          {
            "name": "onSelect",
            "type": "(() => void)",
            "required": false,
            "description": "Called when the item is selected"
          },
          {
            "name": "textValue",
            "type": "string",
            "required": false,
            "description": "Accessible text used for typeahead matching"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuRadioItemStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuSub": {
        "description": "Context provider that scopes a nested flyout submenu within the menu",
        "props": [
          {
            "name": "open",
            "type": "boolean",
            "required": false,
            "description": "Controlled open state of the submenu"
          },
          {
            "name": "defaultOpen",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Initial open state for uncontrolled usage"
          },
          {
            "name": "onOpenChange",
            "type": "((open: boolean) => void)",
            "required": false,
            "description": "Called when the submenu open state changes"
          }
        ]
      },
      "MenuSubTrigger": {
        "description": "Menu item that opens a nested submenu on hover or keyboard right-arrow",
        "props": [
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Whether the trigger is non-interactive"
          },
          {
            "name": "inset",
            "type": "boolean",
            "required": false,
            "description": "Whether to add leading inset padding"
          },
          {
            "name": "textValue",
            "type": "string",
            "required": false,
            "description": "Accessible text used for typeahead matching"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "MenuSubTriggerStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "MenuSubContent": {
        "description": "Floating panel containing the items of a nested submenu",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "offset",
            "type": "number",
            "required": false,
            "defaultValue": "8",
            "description": "Distance offset from the trigger in all directions"
          },
          {
            "name": "styles",
            "type": "MenuSubContentStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      }
    },
    "examples": []
  },
  "modal": {
    "props": [
      {
        "name": "state",
        "type": "ModalState",
        "required": false
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Initial open state. For controlled usage, pass `state={{ open }}`."
      },
      {
        "name": "isOpen",
        "type": "boolean",
        "required": false,
        "description": "@deprecated Use `open`."
      },
      {
        "name": "onOpenChange",
        "type": "((isOpen: boolean) => void)",
        "required": false,
        "description": "Callback when the open state changes"
      },
      {
        "name": "title",
        "type": "ReactNode",
        "required": false,
        "description": "Optional title rendered in the modal header bar"
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Accessible name used when the modal has no visible title."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "description": "Modal body content"
      },
      {
        "name": "footer",
        "type": "ReactNode",
        "required": false,
        "description": "Optional footer content rendered below the body"
      },
      {
        "name": "close",
        "type": "boolean",
        "required": false,
        "defaultValue": "true",
        "description": "Whether to show the X close button in the header"
      },
      {
        "name": "size",
        "type": "fit | auto",
        "required": false,
        "defaultValue": "auto",
        "description": "Controls modal width: \"fit\" adapts to content, \"auto\" uses default width",
        "enumValues": [
          "fit",
          "auto"
        ]
      },
      {
        "name": "animation",
        "type": "default | fade",
        "required": false,
        "defaultValue": "default",
        "description": "Controls the panel entrance and exit animation.",
        "enumValues": [
          "default",
          "fade"
        ]
      },
      {
        "name": "isDismissable",
        "type": "boolean",
        "required": false,
        "defaultValue": "true",
        "description": "Whether clicking the backdrop dismisses the modal"
      },
      {
        "name": "isKeyboardDismissDisabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Prevents the Escape key from dismissing the modal"
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional class for the modal panel"
      },
      {
        "name": "styles",
        "type": "ModalStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "subComponents": {
      "Modal.Header": {
        "description": "ModalHeader component for use with compound Modal pattern",
        "props": []
      },
      "Modal.Body": {
        "description": "ModalBody component for use with compound Modal pattern",
        "props": [
          {
            "name": "scrollable",
            "type": "boolean",
            "required": false,
            "defaultValue": "true",
            "description": "Whether Modal.Body owns vertical scrolling. Disable when a nested pane owns overflow."
          }
        ]
      },
      "Modal.Footer": {
        "description": "ModalFooter component for use with compound Modal pattern",
        "props": []
      }
    },
    "examples": []
  },
  "page": {
    "props": [
      {
        "name": "max-width",
        "type": "string | number",
        "required": false,
        "defaultValue": "1400px",
        "description": "Maximum width of the page content area"
      },
      {
        "name": "padding",
        "type": "none | sm | md | lg | xl",
        "required": false,
        "defaultValue": "md",
        "description": "Controls the internal padding of the page",
        "enumValues": [
          "none",
          "sm",
          "md",
          "lg",
          "xl"
        ]
      },
      {
        "name": "gap",
        "type": "PageGap",
        "required": false,
        "defaultValue": "lg",
        "description": "Controls the space between direct page regions using the shared Flex gap contract."
      },
      {
        "name": "centered",
        "type": "boolean",
        "required": false,
        "defaultValue": "true",
        "description": "Whether the page container is horizontally centered"
      },
      {
        "name": "fullscreen",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the page fills the viewport and ignores maxWidth"
      },
      {
        "name": "seo",
        "type": "PageSeo",
        "required": false,
        "description": "Document metadata (title, description, canonical) to render for this page."
      },
      {
        "name": "styles",
        "type": "PageStyleSlots",
        "required": false,
        "description": "Keyed classes for the root and compound component slots."
      }
    ],
    "examples": []
  },
  "panel": {
    "props": [
      {
        "name": "orientation",
        "type": "horizontal | vertical",
        "required": false,
        "defaultValue": "horizontal",
        "description": "Axis along which direct child regions are arranged.",
        "enumValues": [
          "horizontal",
          "vertical"
        ]
      },
      {
        "name": "collapseAt",
        "type": "number",
        "required": false,
        "description": "Container width, in pixels, below which a horizontal layout stacks."
      },
      {
        "name": "spacing",
        "type": "none | sm | md | lg",
        "required": false,
        "defaultValue": "md",
        "description": "Controls the gap between direct child regions.",
        "enumValues": [
          "none",
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "name": "variant",
        "type": "default | compact",
        "required": false,
        "defaultValue": "default",
        "description": "Controls the visual density of the layout.",
        "enumValues": [
          "default",
          "compact"
        ]
      },
      {
        "name": "styles",
        "type": "PanelStyleSlots",
        "required": false,
        "description": "Slot styles."
      }
    ],
    "examples": []
  },
  "path": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "description": "Content rendered inside the path item."
      },
      {
        "name": "href",
        "type": "string",
        "required": false,
        "description": "URL this path item navigates to."
      },
      {
        "name": "onPress",
        "type": "(() => void)",
        "required": false,
        "description": "Called when the item is activated."
      },
      {
        "name": "isCurrent",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether this item represents the current page."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the item is non-interactive."
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class names applied to the item root."
      },
      {
        "name": "styles",
        "type": "PathItemStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "popover": {
    "props": [
      {
        "name": "state",
        "type": "PopoverState",
        "required": false
      },
      {
        "name": "content",
        "type": "ReactNode",
        "required": true,
        "description": "Content to display inside the popover panel"
      },
      {
        "name": "position",
        "type": "top | right | bottom | left",
        "required": false,
        "defaultValue": "bottom",
        "description": "Preferred side of the trigger where the popover appears",
        "enumValues": [
          "top",
          "right",
          "bottom",
          "left"
        ]
      },
      {
        "name": "align",
        "type": "start | center | end",
        "required": false,
        "defaultValue": "center",
        "description": "Cross-axis alignment relative to the trigger. \"start\" and \"end\" follow reading direction along the trigger's edge; \"center\" (default) centers the panel over the trigger.",
        "enumValues": [
          "start",
          "center",
          "end"
        ]
      },
      {
        "name": "disable-animations",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Renders and closes the panel with no opacity/scale transition."
      },
      {
        "name": "styles",
        "type": "PopoverStyleSlots",
        "required": false,
        "description": "Keyed styles for named component parts. The frame slot controls panel layout such as padding."
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class for the trigger element."
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Initial open state. For controlled usage, pass `state={{ open }}`."
      },
      {
        "name": "isOpen",
        "type": "boolean",
        "required": false,
        "description": "@deprecated Use `open`."
      },
      {
        "name": "onOpenChange",
        "type": "((isOpen: boolean) => void)",
        "required": false,
        "description": "Called when the popover opens or closes"
      },
      {
        "name": "showArrow",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to render a directional arrow pointing at the trigger"
      }
    ],
    "examples": []
  },
  "progress": {
    "props": [
      {
        "name": "value",
        "type": "number",
        "required": false,
        "description": "Current progress value"
      },
      {
        "name": "defaultValue",
        "type": "number",
        "required": false,
        "description": "Initial value for uncontrolled interactive usage"
      },
      {
        "name": "min",
        "type": "number",
        "required": false,
        "defaultValue": "0",
        "description": "Minimum value"
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "defaultValue": "100",
        "description": "Maximum value that represents 100%"
      },
      {
        "name": "step",
        "type": "number",
        "required": false,
        "defaultValue": "1",
        "description": "Step increment when dragging"
      },
      {
        "name": "onValueChange",
        "type": "((value: number) => void)",
        "required": false,
        "description": "Called when the value changes via controls"
      },
      {
        "name": "variant",
        "type": "string",
        "required": false,
        "defaultValue": "default",
        "description": "Visual color variant indicating progress state"
      },
      {
        "name": "indeterminate",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to show an infinite loading animation instead of a fixed value"
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Accessible label describing what is progressing"
      },
      {
        "name": "showValue",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to display the percentage value next to the label"
      },
      {
        "name": "animated",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to show a shimmer animation on the progress fill"
      },
      {
        "name": "show-controls",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to show a draggable thumb on hover, allowing value adjustment"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the progress is disabled"
      },
      {
        "name": "styles",
        "type": "ProgressStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "radio": {
    "props": [
      {
        "name": "size",
        "type": "sm | md | lg",
        "required": false,
        "defaultValue": "md",
        "description": "Size of the radio button",
        "enumValues": [
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "name": "label",
        "type": "ReactNode",
        "required": false,
        "description": "Label text or element displayed next to the radio"
      },
      {
        "name": "description",
        "type": "ReactNode",
        "required": false,
        "description": "Secondary description shown below the label"
      },
      {
        "name": "helperText",
        "type": "ReactNode",
        "required": false,
        "description": "Helper text shown below the radio item"
      },
      {
        "name": "helperTextError",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to style the helper text as an error"
      },
      {
        "name": "error",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to apply error styling"
      },
      {
        "name": "styles",
        "type": "RadioStyleSlots",
        "required": false,
        "description": "Classes applied to named slots"
      },
      {
        "name": "checked",
        "type": "boolean",
        "required": false,
        "description": "Initial checked value. For controlled usage, pass `state={{ checked }}`."
      },
      {
        "name": "state",
        "type": "RadioState",
        "required": false,
        "description": "Controlled state."
      }
    ],
    "examples": []
  },
  "scroll": {
    "props": [
      {
        "name": "viewportRef",
        "type": "Ref<HTMLDivElement>",
        "required": false
      },
      {
        "name": "maxHeight",
        "type": "string",
        "required": false
      },
      {
        "name": "maxWidth",
        "type": "string",
        "required": false
      },
      {
        "name": "direction",
        "type": "vertical | horizontal",
        "required": false,
        "defaultValue": "vertical",
        "enumValues": [
          "vertical",
          "horizontal"
        ]
      },
      {
        "name": "paddingY",
        "type": "string | number",
        "required": false,
        "defaultValue": "4"
      },
      {
        "name": "fade-y",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "fade-x",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "fadeDistance",
        "type": "number",
        "required": false,
        "defaultValue": "5"
      },
      {
        "name": "fadeSize",
        "type": "number",
        "required": false,
        "defaultValue": "4"
      },
      {
        "name": "enabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "true"
      },
      {
        "name": "hide",
        "type": "boolean",
        "required": false,
        "defaultValue": "true"
      },
      {
        "name": "inline",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "scrollMode",
        "type": "native | programmatic",
        "required": false,
        "defaultValue": "native",
        "description": "Controls whether the viewport itself consumes user scroll input.\n\n- \"native\": normal scroll container behavior.\n- \"programmatic\": the viewport can still be changed through scrollTop /\n  scrollLeft, but wheel/trackpad scrolling falls through to the document.",
        "enumValues": [
          "native",
          "programmatic"
        ]
      },
      {
        "name": "presentational",
        "type": "boolean",
        "required": false,
        "defaultValue": "false"
      },
      {
        "name": "styles",
        "type": "ScrollStyleSlots",
        "required": false
      },
      {
        "name": "storageKey",
        "type": "string",
        "required": false
      }
    ],
    "examples": []
  },
  "select": {
    "props": [
      {
        "name": "state",
        "type": "SelectState",
        "required": false,
        "description": "Controlled state. `value` is a key (single) or key array (multiple)."
      },
      {
        "name": "value",
        "type": "Key | Key[]",
        "required": false,
        "description": "Initial selected value."
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Initial open state."
      },
      {
        "name": "mode",
        "type": "single | multiple",
        "required": false,
        "defaultValue": "single",
        "description": "Selection mode: \"single\" for one item, \"multiple\" for multi-item selection",
        "enumValues": [
          "single",
          "multiple"
        ]
      },
      {
        "name": "items",
        "type": "any[]",
        "required": false,
        "defaultValue": "[]",
        "description": "External items array — used when items are provided as data rather than JSX"
      },
      {
        "name": "selectedKey",
        "type": "Key | null",
        "required": false,
        "description": "Controlled selected key for single-select mode"
      },
      {
        "name": "defaultSelectedKey",
        "type": "Key | null",
        "required": false,
        "description": "Default selected key for uncontrolled single-select"
      },
      {
        "name": "selectedKeys",
        "type": "Key[]",
        "required": false,
        "description": "Controlled selected keys for multi-select mode"
      },
      {
        "name": "defaultSelectedKeys",
        "type": "Key[]",
        "required": false,
        "defaultValue": "[]",
        "description": "Default selected keys for uncontrolled multi-select"
      },
      {
        "name": "defaultValue",
        "type": "string",
        "required": false,
        "description": "Default display text shown in the trigger when nothing is selected"
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Display text for the currently selected value — used for SSR/SSG to avoid\nflash of placeholder before items register. Provide alongside selectedKey or\ndefaultSelectedKey so the correct label renders on the first pass."
      },
      {
        "name": "onSelectionChange",
        "type": "((value: any) => void)",
        "required": false,
        "description": "Called when selection changes; receives a single key (single) or key array (multiple)"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Disables the entire select and prevents interaction"
      },
      {
        "name": "autoFocus",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Focuses the trigger automatically on mount"
      },
      {
        "name": "maxItems",
        "type": "number",
        "required": false,
        "defaultValue": "6",
        "description": "Maximum number of items visible before the dropdown scrolls"
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class for the root wrapper"
      },
      {
        "name": "trigger",
        "type": "click | hover",
        "required": false,
        "defaultValue": "click",
        "description": "How the dropdown opens: \"click\" (default) or \"hover\"",
        "enumValues": [
          "click",
          "hover"
        ]
      },
      {
        "name": "filter",
        "type": "((item: any) => boolean)",
        "required": false,
        "description": "Custom filter predicate applied to the items array"
      },
      {
        "name": "styles",
        "type": "SelectStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "subComponents": {
      "SelectContent": {
        "description": "Floating panel that renders the list of selectable options",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "searchable",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Renders a search input inside the dropdown for filtering items"
          },
          {
            "name": "searchPlaceholder",
            "type": "string",
            "required": false,
            "defaultValue": "Search items...",
            "description": "Placeholder text for the search input when searchable is true"
          },
          {
            "name": "onSearch",
            "type": "((value: string) => void)",
            "required": false,
            "description": "Called when the search input value changes"
          },
          {
            "name": "emptyContent",
            "type": "ReactNode",
            "required": false,
            "defaultValue": "No results found.",
            "description": "Content shown below the search input when no searchable results match"
          },
          {
            "name": "styles",
            "type": "SelectContentStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SearchableContent": {
        "description": "Dropdown panel with a built-in search input for filtering the option list",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "searchPlaceholder",
            "type": "string",
            "required": false,
            "defaultValue": "Search items...",
            "description": "Placeholder text for the search input when searchable is true"
          },
          {
            "name": "onSearch",
            "type": "((value: string) => void)",
            "required": false,
            "description": "Called when the search input value changes"
          },
          {
            "name": "emptyContent",
            "type": "ReactNode",
            "required": false,
            "defaultValue": "No results found.",
            "description": "Content shown below the search input when no searchable results match"
          },
          {
            "name": "styles",
            "type": "SelectContentStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectSeparator": {
        "description": "Horizontal rule that visually separates groups of items in the dropdown",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "SelectSeparatorStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectGroup": {
        "description": "Named grouping of related items with an optional visible title label",
        "props": [
          {
            "name": "key",
            "type": "string",
            "required": false
          },
          {
            "name": "title",
            "type": "string",
            "required": false,
            "description": "Label displayed above the group of items"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "styles",
            "type": "SelectGroupStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectValue": {
        "description": "Renders the selected item's label inside the trigger",
        "props": [
          {
            "name": "placeholder",
            "type": "string",
            "required": false,
            "defaultValue": "Select an option",
            "description": "Text shown in the trigger when no item is selected"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "icon",
            "type": "ReactNode",
            "required": false,
            "description": "Icon displayed to the left of the selected value text"
          },
          {
            "name": "children",
            "type": "ReactNode | ((selectedItem: ItemData | null) => ReactNode)",
            "required": false,
            "description": "Custom render function receiving the selected item, or static content to display"
          },
          {
            "name": "styles",
            "type": "SelectValueStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectItem": {
        "description": "A single selectable option in the dropdown list",
        "props": [
          {
            "name": "value",
            "type": "Key",
            "required": true,
            "description": "Unique key used to identify this item in the selection state"
          },
          {
            "name": "textValue",
            "type": "string",
            "required": false,
            "description": "Accessible text value used for search filtering and selection display; defaults to children string"
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Prevents the item from being selected or keyboard-focused"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "icon",
            "type": "ReactNode",
            "required": false,
            "description": "Icon displayed to the left of the item label"
          },
          {
            "name": "description",
            "type": "ReactNode",
            "required": false,
            "description": "Secondary descriptive text displayed below the item label"
          },
          {
            "name": "styles",
            "type": "SelectItemStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectList": {
        "description": "Wrapper for a collection of SelectItem components",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "filter",
            "type": "((item: any) => boolean)",
            "required": false,
            "description": "Custom filter predicate applied to the items array"
          },
          {
            "name": "styles",
            "type": "SelectListStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectSub": {
        "description": "Context provider that scopes a nested flyout submenu within the dropdown",
        "props": [
          {
            "name": "open",
            "type": "boolean",
            "required": false,
            "description": "Controlled open state of the submenu"
          },
          {
            "name": "defaultOpen",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Initial open state for uncontrolled usage"
          },
          {
            "name": "onOpenChange",
            "type": "((open: boolean) => void)",
            "required": false,
            "description": "Called when the submenu open state changes"
          }
        ]
      },
      "SelectSubTrigger": {
        "description": "Item that opens a nested submenu on hover or keyboard right-arrow",
        "props": [
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "defaultValue": "false",
            "description": "Prevents the trigger from opening the submenu"
          },
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "textValue",
            "type": "string",
            "required": false,
            "description": "Accessible text value used for keyboard navigation registration; defaults to children string"
          },
          {
            "name": "styles",
            "type": "SelectSubTriggerStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectSubContent": {
        "description": "Floating panel containing the items of a nested submenu",
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "sideOffset",
            "type": "number",
            "required": false,
            "defaultValue": "8",
            "description": "Distance in pixels between the submenu panel and its trigger along the main axis"
          },
          {
            "name": "alignOffset",
            "type": "number",
            "required": false,
            "defaultValue": "0",
            "description": "Offset in pixels along the cross axis for submenu panel alignment"
          },
          {
            "name": "styles",
            "type": "SelectSubContentStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SelectTrigger": {
        "props": [
          {
            "name": "className",
            "type": "string",
            "required": false,
            "description": "Additional CSS class names"
          },
          {
            "name": "chevron",
            "type": "ReactNode",
            "required": false,
            "description": "Custom chevron icon displayed on the right side of the trigger; defaults to ChevronDown"
          },
          {
            "name": "icon",
            "type": "{ prefix?: ReactNode; chevron?: ReactNode; }",
            "required": false,
            "description": "Icon slot object for prefix and chevron overrides"
          },
          {
            "name": "variant",
            "type": "ghost",
            "required": false,
            "description": "Visual style variant; \"ghost\" removes the default button background",
            "enumValues": [
              "ghost"
            ]
          },
          {
            "name": "styles",
            "type": "SelectTriggerStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          }
        ]
      },
      "SearchableTrigger": {
        "description": "Combobox-style input that opens the dropdown on focus and filters items as you type",
        "props": [
          {
            "name": "styles",
            "type": "SearchableTriggerStyleSlots",
            "required": false,
            "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
          },
          {
            "name": "children",
            "type": "ReactNode",
            "required": false,
            "description": "Custom content rendered in place of the native `<input>`, keeping the\nsurrounding shell (focus surface, icons, actions, hint) intact. Used by\ncomposite fields such as Date.Input that own several focusable segments\ninstead of one text input.\n\nIn this mode the input-specific props (`type`, `value`, `placeholder`, the\nforwarded ref, …) have no element to apply to and are ignored — the content\nowns its own values. `disabled`, `error` and `variant` still style the shell."
          },
          {
            "name": "icon",
            "type": "ReactNode | InputIconSlots",
            "required": false,
            "description": "Icon displayed before the input value by default, or in named prefix/suffix slots"
          },
          {
            "name": "variant",
            "type": "ghost | default",
            "required": false,
            "description": "Controls the visual style of the input",
            "enumValues": [
              "ghost",
              "default"
            ]
          },
          {
            "name": "state",
            "type": "InputState",
            "required": false,
            "description": "Controlled state."
          },
          {
            "name": "error",
            "type": "boolean",
            "required": false,
            "description": "Whether the input is in an error state"
          },
          {
            "name": "actions",
            "type": "InputAction[] | InputActionSlots",
            "required": false,
            "description": "Inline actions rendered on the left or right side of the input. Passing an array keeps the existing right-side behavior."
          },
          {
            "name": "hint",
            "type": "ReactNode",
            "required": false,
            "description": "Hint content rendered inside a badge on the right side of the input, commonly used for keyboard shortcuts."
          },
          {
            "name": "hide-controls",
            "type": "boolean",
            "required": false,
            "description": "Hides the spinner controls for number inputs"
          }
        ]
      }
    },
    "examples": []
  },
  "skeleton": {
    "props": [
      {
        "name": "w",
        "type": "Width<string | number>",
        "required": false,
        "description": "Width of the placeholder. Numeric values are pixels."
      },
      {
        "name": "h",
        "type": "Height<string | number>",
        "required": false,
        "description": "Height of the placeholder. Numeric values are pixels."
      },
      {
        "name": "color",
        "type": "background-500 | background-600 | background-700 | background-800 | background-900 | background-950 | foreground-50 | foreground-100 | foreground-200 | foreground-300 | foreground-400 | accent-500 | accent-600 | accent-50 | accent-100 | accent-200 | accent-300 | accent-400 | success-500 | success-600 | success-50 | success-100 | success-200 | success-300 | success-400 | danger-500 | danger-600 | danger-50 | danger-100 | danger-200 | danger-300 | danger-400 | warning-500 | warning-600 | warning-50 | warning-100 | warning-200 | warning-300 | warning-400 | info-500 | info-600 | info-50 | info-100 | info-200 | info-300 | info-400",
        "required": false,
        "description": "Design-system color token used for the placeholder fill.",
        "enumValues": [
          "background-500",
          "background-600",
          "background-700",
          "background-800",
          "background-900",
          "background-950",
          "foreground-50",
          "foreground-100",
          "foreground-200",
          "foreground-300",
          "foreground-400",
          "accent-500",
          "accent-600",
          "accent-50",
          "accent-100",
          "accent-200",
          "accent-300",
          "accent-400",
          "success-500",
          "success-600",
          "success-50",
          "success-100",
          "success-200",
          "success-300",
          "success-400",
          "danger-500",
          "danger-600",
          "danger-50",
          "danger-100",
          "danger-200",
          "danger-300",
          "danger-400",
          "warning-500",
          "warning-600",
          "warning-50",
          "warning-100",
          "warning-200",
          "warning-300",
          "warning-400",
          "info-500",
          "info-600",
          "info-50",
          "info-100",
          "info-200",
          "info-300",
          "info-400"
        ]
      }
    ],
    "subComponents": {
      "Skeleton.Text": {
        "description": "Repeated decorative rows for body, heading, or display text placeholders.",
        "props": [
          {
            "name": "color",
            "type": "background-500 | background-600 | background-700 | background-800 | background-900 | background-950 | foreground-50 | foreground-100 | foreground-200 | foreground-300 | foreground-400 | accent-500 | accent-600 | accent-50 | accent-100 | accent-200 | accent-300 | accent-400 | success-500 | success-600 | success-50 | success-100 | success-200 | success-300 | success-400 | danger-500 | danger-600 | danger-50 | danger-100 | danger-200 | danger-300 | danger-400 | warning-500 | warning-600 | warning-50 | warning-100 | warning-200 | warning-300 | warning-400 | info-500 | info-600 | info-50 | info-100 | info-200 | info-300 | info-400",
            "required": false,
            "description": "Design-system color token used for each row's fill.",
            "enumValues": [
              "background-500",
              "background-600",
              "background-700",
              "background-800",
              "background-900",
              "background-950",
              "foreground-50",
              "foreground-100",
              "foreground-200",
              "foreground-300",
              "foreground-400",
              "accent-500",
              "accent-600",
              "accent-50",
              "accent-100",
              "accent-200",
              "accent-300",
              "accent-400",
              "success-500",
              "success-600",
              "success-50",
              "success-100",
              "success-200",
              "success-300",
              "success-400",
              "danger-500",
              "danger-600",
              "danger-50",
              "danger-100",
              "danger-200",
              "danger-300",
              "danger-400",
              "warning-500",
              "warning-600",
              "warning-50",
              "warning-100",
              "warning-200",
              "warning-300",
              "warning-400",
              "info-500",
              "info-600",
              "info-50",
              "info-100",
              "info-200",
              "info-300",
              "info-400"
            ]
          },
          {
            "name": "lines",
            "type": "number",
            "required": false
          },
          {
            "name": "h",
            "type": "number",
            "required": false
          },
          {
            "name": "size",
            "type": "body | heading | display",
            "required": false,
            "defaultValue": "body",
            "description": "Semantic row geometry. Body text defaults to three rows; heading and display default to one.",
            "enumValues": [
              "body",
              "heading",
              "display"
            ]
          },
          {
            "name": "w",
            "type": "Width<string | number>",
            "required": false,
            "description": "Width available to each full row. Numeric values are pixels."
          },
          {
            "name": "lastLineWidth",
            "type": "Width<string | number>",
            "required": false,
            "description": "Width of the final row when more than one row is rendered."
          },
          {
            "name": "scale",
            "type": "number",
            "required": false,
            "description": "Multiplies row thickness and gap without changing width. Invalid values fall back to 1."
          }
        ]
      },
      "Skeleton.Image": {
        "description": "Decorative media placeholder with an explicit size or aspect ratio.",
        "props": [
          {
            "name": "w",
            "type": "Width<string | number>",
            "required": false,
            "description": "Width of the media placeholder. Numeric values are pixels."
          },
          {
            "name": "h",
            "type": "Height<string | number>",
            "required": false,
            "description": "Explicit height. When present, it takes precedence over ratio."
          },
          {
            "name": "ratio",
            "type": "AspectRatio",
            "required": false,
            "description": "CSS aspect ratio used when no explicit height is supplied."
          },
          {
            "name": "color",
            "type": "background-500 | background-600 | background-700 | background-800 | background-900 | background-950 | foreground-50 | foreground-100 | foreground-200 | foreground-300 | foreground-400 | accent-500 | accent-600 | accent-50 | accent-100 | accent-200 | accent-300 | accent-400 | success-500 | success-600 | success-50 | success-100 | success-200 | success-300 | success-400 | danger-500 | danger-600 | danger-50 | danger-100 | danger-200 | danger-300 | danger-400 | warning-500 | warning-600 | warning-50 | warning-100 | warning-200 | warning-300 | warning-400 | info-500 | info-600 | info-50 | info-100 | info-200 | info-300 | info-400",
            "required": false,
            "description": "Design-system color token used for the placeholder fill.",
            "enumValues": [
              "background-500",
              "background-600",
              "background-700",
              "background-800",
              "background-900",
              "background-950",
              "foreground-50",
              "foreground-100",
              "foreground-200",
              "foreground-300",
              "foreground-400",
              "accent-500",
              "accent-600",
              "accent-50",
              "accent-100",
              "accent-200",
              "accent-300",
              "accent-400",
              "success-500",
              "success-600",
              "success-50",
              "success-100",
              "success-200",
              "success-300",
              "success-400",
              "danger-500",
              "danger-600",
              "danger-50",
              "danger-100",
              "danger-200",
              "danger-300",
              "danger-400",
              "warning-500",
              "warning-600",
              "warning-50",
              "warning-100",
              "warning-200",
              "warning-300",
              "warning-400",
              "info-500",
              "info-600",
              "info-50",
              "info-100",
              "info-200",
              "info-300",
              "info-400"
            ]
          }
        ]
      }
    },
    "examples": []
  },
  "slider": {
    "props": [
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the slider is disabled."
      },
      {
        "name": "min",
        "type": "number",
        "required": false,
        "defaultValue": "0",
        "description": "Minimum value of the slider range."
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "defaultValue": "100",
        "description": "Maximum value of the slider range."
      },
      {
        "name": "step",
        "type": "number",
        "required": false,
        "defaultValue": "1",
        "description": "Step increment between values."
      },
      {
        "name": "state",
        "type": "SliderState",
        "required": false,
        "description": "Initial value or values. For controlled usage, pass `state={{ value }}`."
      },
      {
        "name": "defaultValue",
        "type": "number | number[]",
        "required": false,
        "description": "@deprecated Use `value`."
      },
      {
        "name": "value",
        "type": "number | number[]",
        "required": false,
        "description": "Controlled value or values for the slider thumbs."
      },
      {
        "name": "onValueChange",
        "type": "((value: number[]) => void)",
        "required": false,
        "description": "Called when the slider value changes."
      },
      {
        "name": "orientation",
        "type": "horizontal | vertical",
        "required": false,
        "defaultValue": "horizontal",
        "description": "Orientation of the slider track.",
        "enumValues": [
          "horizontal",
          "vertical"
        ]
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Accessible label for the slider."
      },
      {
        "name": "aria-labelledby",
        "type": "string",
        "required": false,
        "description": "ID of an element that labels the slider."
      },
      {
        "name": "styles",
        "type": "SliderStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      },
      {
        "name": "trackStyle",
        "type": "CSSProperties",
        "required": false,
        "description": "Inline styles applied to the slider track."
      }
    ],
    "examples": []
  },
  "switch": {
    "props": [
      {
        "name": "checked",
        "type": "boolean",
        "required": false,
        "description": "Initial checked state. For controlled usage, pass `state={{ checked }}`."
      },
      {
        "name": "state",
        "type": "SwitchState",
        "required": false,
        "description": "Controlled state."
      },
      {
        "name": "isSelected",
        "type": "boolean",
        "required": false,
        "description": "@deprecated Use `state={{ checked }}`."
      },
      {
        "name": "onChange",
        "type": "((isSelected: boolean) => void)",
        "required": false,
        "description": "Called when the switch is toggled"
      },
      {
        "name": "defaultSelected",
        "type": "boolean",
        "required": false,
        "description": "@deprecated Use `checked`."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the switch is disabled"
      },
      {
        "name": "size",
        "type": "default | sm",
        "required": false,
        "defaultValue": "default",
        "description": "Size of the switch",
        "enumValues": [
          "default",
          "sm"
        ]
      },
      {
        "name": "styles",
        "type": "SwitchStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "table": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "description": "Optional header content. When omitted, columns from Table context are rendered.",
        "typeTokens": [
          {
            "text": "ReactNode"
          }
        ]
      }
    ],
    "subComponents": {
      "Table.HeaderCell": {
        "props": []
      },
      "Table.Body": {
        "props": [
          {
            "name": "children",
            "type": "ReactNode",
            "required": false,
            "description": "Optional body content. When omitted, filtered rows from Table context are rendered.",
            "typeTokens": [
              {
                "text": "ReactNode"
              }
            ]
          },
          {
            "name": "rows",
            "type": "Record<string, any>[]",
            "required": false,
            "description": "Optional rows for custom body composition. Defaults to filtered context data.",
            "typeTokens": [
              {
                "text": "Record<string, any>[]"
              }
            ]
          }
        ]
      },
      "Table.Row": {
        "props": [
          {
            "name": "row",
            "type": "Record<string, any>",
            "required": false,
            "description": "Row data used to render default cells.",
            "typeTokens": [
              {
                "text": "Record<string, any>"
              }
            ]
          },
          {
            "name": "rowIndex",
            "type": "number",
            "required": false,
            "defaultValue": "0",
            "description": "Zero-based index for generated rows.",
            "typeTokens": [
              {
                "text": "number",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number"
              }
            ]
          },
          {
            "name": "selected",
            "type": "boolean",
            "required": false,
            "description": "Marks the row as selected for styling and assistive technology.",
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          },
          {
            "name": "disabled",
            "type": "boolean",
            "required": false,
            "description": "Marks the row as disabled for future interactive behavior.",
            "typeTokens": [
              {
                "text": "boolean",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"
              }
            ]
          }
        ]
      },
      "Table.Cell": {
        "props": [
          {
            "name": "row",
            "type": "Record<string, any>",
            "required": false,
            "description": "Row data used with the column render function.",
            "typeTokens": [
              {
                "text": "Record<string, any>"
              }
            ]
          },
          {
            "name": "column",
            "type": "Column<Record<string, any>, string>",
            "required": false,
            "description": "Column definition for this cell. Inferred by columnIndex when omitted.",
            "typeTokens": [
              {
                "text": "Column<Record<string, any>, string>"
              }
            ]
          },
          {
            "name": "columnIndex",
            "type": "number",
            "required": false,
            "defaultValue": "0",
            "description": "Zero-based column index used to read the column from context.",
            "typeTokens": [
              {
                "text": "number",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number"
              }
            ]
          },
          {
            "name": "rowIndex",
            "type": "number",
            "required": false,
            "defaultValue": "0",
            "description": "Zero-based row index supplied to the custom cell renderer.",
            "typeTokens": [
              {
                "text": "number",
                "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number"
              }
            ]
          },
          {
            "name": "value",
            "type": "ReactNode",
            "required": false,
            "description": "Explicit cell value. Defaults to row[column.key].",
            "typeTokens": [
              {
                "text": "ReactNode"
              }
            ]
          }
        ]
      }
    },
    "examples": []
  },
  "tabs": {
    "props": [
      {
        "name": "state",
        "type": "TabsState",
        "required": false
      },
      {
        "name": "variant",
        "type": "underline",
        "required": false,
        "description": "Optional alternate visual style of the tab list indicator",
        "enumValues": [
          "underline"
        ]
      },
      {
        "name": "orientation",
        "type": "horizontal | vertical",
        "required": false,
        "defaultValue": "horizontal",
        "description": "Direction of the tab list layout",
        "enumValues": [
          "horizontal",
          "vertical"
        ]
      },
      {
        "name": "default",
        "type": "string",
        "required": false,
        "description": "Initially selected tab value for uncontrolled usage"
      },
      {
        "name": "value",
        "type": "string",
        "required": false,
        "description": "Controlled selected tab value"
      },
      {
        "name": "onValueChange",
        "type": "((value: string) => void)",
        "required": false,
        "description": "Called when the selected tab changes"
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class for the tabs root"
      },
      {
        "name": "styles",
        "type": "TabsStyleSlots",
        "required": false,
        "description": "Custom styles for the component slots"
      }
    ],
    "examples": []
  },
  "textarea": {
    "props": [
      {
        "name": "state",
        "type": "TextareaState",
        "required": false,
        "description": "Controlled state."
      },
      {
        "name": "size",
        "type": "sm | md | lg",
        "required": false,
        "defaultValue": "md",
        "description": "Size of the textarea.",
        "enumValues": [
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "name": "error",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to apply error styling."
      },
      {
        "name": "resizable",
        "type": "boolean",
        "required": false,
        "defaultValue": "true",
        "description": "Whether the textarea can be manually resized by the user. When enabled, `className` may include Tailwind `resize`, `resize-x`, `resize-y`, or `resize-none` to select the resize axis. Defaults to vertical resizing."
      },
      {
        "name": "showCharacterCount",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to display a character count below the textarea."
      },
      {
        "name": "maxCharacters",
        "type": "number",
        "required": false,
        "description": "Maximum number of characters allowed."
      },
      {
        "name": "maxHeight",
        "type": "string",
        "required": false,
        "description": "Maximum height before the custom scrollbar activates."
      },
      {
        "name": "styles",
        "type": "TextareaStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  },
  "toast": {
    "props": [
      {
        "name": "toast",
        "type": "ToastProps",
        "required": true,
        "description": "Toast data object containing content and display options"
      },
      {
        "name": "pauseOnHover",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the auto-dismiss timer pauses on mouse hover"
      },
      {
        "name": "boundary",
        "type": "HTMLElement",
        "required": false,
        "description": "Custom containing block used as the entrance animation boundary"
      },
      {
        "name": "onDragStart",
        "type": "(() => void)",
        "required": false
      },
      {
        "name": "onDragEnd",
        "type": "(() => void)",
        "required": false
      },
      {
        "name": "onDismissStart",
        "type": "(() => void)",
        "required": false
      },
      {
        "name": "onDismissAnimation",
        "type": "((complete: () => void) => void)",
        "required": false,
        "description": "Lets the stack coordinate close motion and invoke completion."
      },
      {
        "name": "onDismissEnd",
        "type": "(() => void)",
        "required": false
      }
    ],
    "subComponents": {
      "Toaster": {
        "props": [
          {
            "name": "container",
            "type": "ToastPortalContainer",
            "required": false,
            "description": "Element that receives the Toast portal. Defaults to document.body.\nA custom container must establish a containing block, for example with\nposition: relative. The container also owns any desired overflow clipping.\nPass null while a target is unavailable to avoid rendering the portal."
          },
          {
            "name": "toasterId",
            "type": "string",
            "required": false,
            "description": "Channel rendered by this Toaster. Omit to use the default channel."
          }
        ]
      }
    },
    "examples": []
  },
  "tooltip": {
    "props": [
      {
        "name": "state",
        "type": "TooltipState",
        "required": false
      },
      {
        "name": "content",
        "type": "ReactNode",
        "required": true,
        "description": "Content to display inside the tooltip"
      },
      {
        "name": "position",
        "type": "top | right | bottom | left",
        "required": false,
        "defaultValue": "top",
        "description": "Preferred side of the trigger where the tooltip appears",
        "enumValues": [
          "top",
          "right",
          "bottom",
          "left"
        ]
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "description": "Additional CSS class for the trigger wrapper"
      },
      {
        "name": "delay",
        "type": "number",
        "required": false,
        "defaultValue": "600",
        "description": "Milliseconds before the tooltip appears after hover"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether the tooltip is disabled"
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Initial open state. For controlled usage, pass `state={{ open }}`."
      },
      {
        "name": "isOpen",
        "type": "boolean",
        "required": false,
        "description": "@deprecated Use `open`."
      },
      {
        "name": "onOpenChange",
        "type": "((isOpen: boolean) => void)",
        "required": false,
        "description": "Called when the tooltip opens or closes"
      },
      {
        "name": "showArrow",
        "type": "boolean",
        "required": false,
        "defaultValue": "false",
        "description": "Whether to render a directional arrow pointing at the trigger"
      },
      {
        "name": "hint",
        "type": "HintValue",
        "required": false,
        "description": "Keyboard shortcut or hint rendered as a Badge at the end of the tooltip. An array renders its segments joined by a `+` divider."
      },
      {
        "name": "styles",
        "type": "TooltipStyleSlots",
        "required": false,
        "description": "Keyed styles for the root and named component parts. Use className for conventional root classes."
      }
    ],
    "examples": []
  }
};

export const generatedStyles: Record<string, ComponentStyles> = {
  "anchor": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .preview,\n  .anchor {\n    display: inline;\n  }\n\n  .root {\n    @apply inline-flex items-center justify-center relative cursor-pointer select-none whitespace-nowrap;\n    color: var(--foreground, currentColor);\n    text-decoration: none;\n    border: 0 solid transparent;\n    border-radius: var(--radius-sm, 0.375rem);\n    font-size: inherit;\n    font-weight: inherit;\n    letter-spacing: inherit;\n    line-height: inherit;\n\n    &[data-hovered=\"true\"]:not([data-disabled=\"true\"]) .underline {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n\n    &[data-focus-visible=\"true\"] {\n      outline: 2px solid var(--focus-visible, var(--focus-ring));\n      outline-offset: 2px;\n      border-radius: 2px;\n    }\n  }\n\n  .underline {\n    @apply absolute left-0 right-0 bottom-0 h-px;\n    background-color: var(--underline-background, var(--background-600));\n    transform-origin: right;\n    transform: scaleX(1);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    pointer-events: none;\n  }\n\n  .preview {\n  }\n}\n",
  "badge": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .badge {\n    @apply inline-flex items-center justify-center gap-2 select-none whitespace-nowrap px-1.5;\n    height: fit-content;\n    width: fit-content;\n    background-color: var(--background, var(--background-800));\n    color: var(--foreground, var(--foreground-200));\n    border: var(--border-width-base, 1px) solid var(--background-border, var(--background-600));\n    border-radius: var(--radius-sm, 0.375rem);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .badge.dismissible {\n    @apply pr-0.5;\n  }\n\n  .pill {\n    border-radius: 9999px;\n  }\n\n  .icon {\n    @apply flex items-center shrink-0;\n  }\n\n  .dismiss {\n    @apply ml-1 flex shrink-0 items-center justify-center p-0 cursor-pointer;\n    width: 1em;\n    height: 1em;\n    line-height: 1; /* icon-only hit target */\n    border-radius: var(--radius-xs, 0.25rem);\n    background-color: var(--background, transparent);\n    color: var(--foreground, var(--foreground-400));\n    border: none;\n    transition:\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    outline: none;\n  }\n\n  .dismiss svg {\n    width: 100%;\n    height: 100%;\n  }\n\n  .dismiss[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background, transparent);\n  }\n\n  .dismiss[data-pressed=\"true\"] {\n    background-color: var(--background, transparent);\n    transform: scale(0.95);\n  }\n\n  .dismiss[data-focus-visible=\"true\"] {\n    box-shadow: 0 0 0 1.5px var(--focus-visible, var(--foreground));\n  }\n}\n",
  "banner": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .banner {\n    @apply flex w-full items-start gap-3 px-4 py-3;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    background-color: var(--background, var(--background-900));\n    color: var(--foreground, var(--foreground-200));\n    border: var(--border-width-base, 1px) solid var(--border, var(--background-700));\n    border-radius: var(--radius-sm, 0.375rem);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .banner:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background, var(--background-900));\n    border-color: var(--border, var(--background-700));\n  }\n\n  .banner[data-pressed=\"true\"] {\n    background-color: var(--background, var(--background-900));\n    border-color: var(--border, var(--background-700));\n  }\n\n  .content {\n    @apply min-w-0 flex flex-col gap-1;\n  }\n\n  .iconContainer {\n    @apply flex shrink-0 items-start justify-center pt-0.5;\n  }\n\n  .icon {\n    @apply h-5 w-5;\n    color: var(--icon-color, currentColor);\n  }\n\n  .dismiss {\n    @apply flex h-8 w-8 shrink-0 items-center justify-center p-0 cursor-pointer;\n    background-color: transparent;\n    color: currentColor;\n    border: none;\n    border-radius: var(--radius-sm, 0.375rem);\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &:hover {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      background-color: var(--background, transparent);\n    }\n\n    &[data-pressed=\"true\"] {\n      background-color: var(--background, transparent);\n    }\n\n    &:focus-visible {\n      outline: 2px solid currentColor;\n      outline-offset: 2px;\n    }\n  }\n\n  .title {\n    font-family: var(--font-heading, var(--font-body, inherit));\n    font-size: var(--header-text-lg, var(--text-lg, 1.125rem));\n    font-weight: var(--font-weight-header-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-heading, 1.25);\n    @apply my-0;\n  }\n\n  .body {\n    font: inherit;\n    @apply my-0;\n  }\n}\n",
  "button": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .button {\n    @apply inline-flex items-center justify-center gap-2 select-none cursor-pointer whitespace-nowrap;\n    --padding-block: 0;\n    --padding-inline: 0;\n    --padding-inline-end: var(--padding-inline);\n    position: relative;\n    min-width: 0;\n    box-sizing: border-box;\n    padding-block: var(--padding-block);\n    padding-inline: var(--padding-inline);\n    padding-inline-end: var(--padding-inline-end);\n    background-color: var(--background);\n    color: var(--foreground);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius-sm, 0.375rem);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition-property: background-color, border-color, color, opacity, transform;\n    transition-duration:\n      var(--hover-duration, var(--hover-leave-duration, 150ms)),\n      var(--hover-duration, var(--hover-leave-duration, 150ms)),\n      var(--hover-duration, var(--hover-leave-duration, 150ms)),\n      var(--hover-duration, var(--hover-leave-duration, 150ms)), var(--press-duration, 120ms);\n    transition-timing-function:\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--press-ease, cubic-bezier(0.34, 1.56, 0.64, 1));\n\n    &:global(.flex-start) {\n      justify-content: flex-start;\n    }\n\n    &:global(.center) {\n      justify-content: center;\n    }\n\n    &:global(.flex-end) {\n      justify-content: flex-end;\n    }\n\n    &:global(.space-between) {\n      justify-content: space-between;\n    }\n\n    &[data-hovered=\"true\"]:not([data-disabled=\"true\"]) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      background-color: var(--background);\n      border-color: var(--background-border);\n      color: var(--foreground);\n    }\n\n    &[data-pressed=\"true\"]:not([data-disabled=\"true\"]) {\n      background-color: var(--background);\n      border-color: var(--background-border);\n      color: var(--foreground);\n      transform: var(--press-transform, scale(0.96));\n    }\n\n    & > span > svg,\n    & > svg {\n      color: var(--icon-foreground, currentColor);\n    }\n  }\n\n  .button:focus-visible {\n    outline: none;\n  }\n\n  .button:disabled,\n  .button[data-disabled=\"true\"] {\n    opacity: 0.5;\n    cursor: not-allowed;\n    filter: grayscale(0.5);\n  }\n\n  .button.icon {\n    aspect-ratio: 1;\n    width: var(--size, 2.25rem);\n    height: var(--size, 2.25rem);\n    --padding-block: 0.25rem;\n    --padding-inline: 0.25rem;\n  }\n\n  .hint {\n    @apply shrink-0 gap-1;\n  }\n}\n",
  "card": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .card {\n    @apply overflow-hidden;\n    background-color: var(--background, var(--background-900));\n    color: var(--foreground, inherit);\n    border: var(--border-width-base, 1px) solid var(--background-border, var(--border));\n    border-radius: var(--radius-sm, 0.375rem);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .header {\n    @apply p-4;\n    color: var(--foreground, inherit);\n    border-bottom: var(--border-width-base, 1px) solid var(--background-border, var(--border));\n  }\n\n  .body {\n    @apply px-4 py-2;\n    color: var(--foreground, inherit);\n  }\n\n  .footer {\n    @apply px-2 py-2;\n    color: var(--foreground, inherit);\n    background-color: var(--background, var(--background-900));\n    border-top: var(--border-width-base, 1px) solid var(--background-border, var(--border));\n  }\n}\n",
  "chart": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .chart {\n    /* Categorical palette, fixed order — assigned by series registration order.\n     * Dark-first like the token system; light steps override below. */\n    --color-1: #3987e5;\n    --color-2: #008300;\n    --color-3: #d55181;\n    --color-4: #c98500;\n    --color-5: #199e70;\n    --color-6: #d95926;\n    --color-7: #9085e9;\n    --color-8: #e66767;\n\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    height: 15rem;\n  }\n\n  :global([data-theme=\"light\"]) .chart {\n    --color-1: #2a78d6;\n    --color-2: #008300;\n    --color-3: #e87ba4;\n    --color-4: #eda100;\n    --color-5: #1baf7a;\n    --color-6: #eb6834;\n    --color-7: #4a3aa7;\n    --color-8: #e34948;\n  }\n\n  .plot {\n    display: block;\n    flex: 1 1 auto;\n    min-height: 0;\n    width: 100%;\n    overflow: visible;\n  }\n\n  .surface {\n    position: absolute;\n    outline: none;\n    cursor: crosshair;\n  }\n\n  .chart[data-focus-visible=\"true\"] .surface {\n    box-shadow: 0 0 0 2px var(--ring-background, var(--accent-400));\n    border-radius: var(--radius-sm, 0.375rem);\n  }\n\n  .line {\n    fill: none;\n    stroke: currentColor;\n    stroke-width: 2;\n    stroke-linejoin: round;\n    stroke-linecap: round;\n  }\n\n  .area {\n    stroke: none;\n  }\n\n  .marker,\n  .point {\n    fill: currentColor;\n    stroke: var(--background-950, oklch(18% 0 0));\n    stroke-width: 2;\n  }\n\n  .bar {\n    fill: currentColor;\n    stroke: none;\n    transition: opacity var(--chart-bar-highlight-duration, 160ms) ease-out;\n  }\n\n  .bar[data-active=\"true\"] {\n    filter: brightness(1.08);\n  }\n\n  .column-highlight {\n    fill: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    opacity: 0.08;\n    pointer-events: none;\n  }\n\n  .cursor {\n    pointer-events: none;\n  }\n\n  .cursor-line {\n    stroke: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    stroke-width: 1;\n    stroke-dasharray: 4 4;\n    opacity: 0.75;\n    vector-effect: non-scaling-stroke;\n  }\n\n  .rule {\n    stroke: var(--background-border, var(--background-700, oklch(26% 0 0)));\n    stroke-width: 1;\n  }\n\n  .grid .rule {\n    opacity: 0.5;\n  }\n\n  .axis .rule {\n    opacity: 0.8;\n  }\n\n  .reference .rule {\n    stroke: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    stroke-dasharray: 4 4;\n    opacity: 0.6;\n  }\n\n  .tick,\n  .label {\n    fill: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .tick {\n    font-variant-numeric: tabular-nums;\n  }\n\n  .label {\n    font-family: var(--font-body, inherit);\n    font-weight: var(--font-weight-body-medium, 500);\n  }\n\n  .tooltip {\n    position: absolute;\n    z-index: 10;\n    box-sizing: border-box;\n    pointer-events: none;\n    display: flex;\n    flex-direction: column;\n    gap: var(--spacing, 0.25rem);\n    min-width: 8rem;\n    padding: calc(var(--spacing, 0.25rem) * 2);\n    background-color: var(--background, var(--background-950, oklch(21% 0 0)));\n    border: var(--border-width-base, 1px) solid\n      var(--background-border, var(--background-700, oklch(26% 0 0)));\n    border-radius: var(--radius-sm, 0.375rem);\n    color: var(--foreground, var(--foreground-100, oklch(95% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition: transform var(--chart-tooltip-move-duration, 200ms)\n      var(--chart-tooltip-move-easing, var(--ease-snappy-pop, ease-out));\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .tooltip,\n    .bar {\n      transition: none;\n    }\n  }\n\n  .header {\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-weight: var(--font-weight-body-medium, 500);\n  }\n\n  .row {\n    display: flex;\n    align-items: center;\n    gap: calc(var(--spacing, 0.25rem) * 1.5);\n  }\n\n  .swatch {\n    flex-shrink: 0;\n    width: 0.5rem;\n    height: 0.5rem;\n    border-radius: 2px;\n  }\n\n  .name {\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n  }\n\n  .value {\n    margin-left: auto;\n    font-variant-numeric: tabular-nums;\n  }\n\n  .legend {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n    column-gap: calc(var(--spacing, 0.25rem) * 4);\n    row-gap: var(--spacing, 0.25rem);\n    padding-top: calc(var(--spacing, 0.25rem) * 2);\n  }\n\n  .item {\n    display: flex;\n    align-items: center;\n    gap: calc(var(--spacing, 0.25rem) * 1.5);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n  }\n\n  .live-region {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n    border: 0;\n  }\n\n  .grid-chart {\n    --grid-chart-color: var(--color-1, #3987e5);\n    --grid-chart-empty: var(--background-800, #1c2530);\n    --grid-chart-cell-color: var(--grid-chart-color);\n\n    width: 100%;\n    height: 15rem;\n    min-height: 0;\n    display: flex;\n    flex-direction: column;\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n  }\n\n  .grid-chart-viewport {\n    flex: 1 1 auto;\n    min-height: 0;\n    width: 100%;\n    overflow-x: auto;\n    overflow-y: hidden;\n  }\n\n  .grid-chart-layout {\n    display: grid;\n    grid-template-columns: max-content minmax(var(--grid-chart-min-width), 1fr);\n    grid-template-rows: minmax(0, 1fr) auto;\n    gap: calc(var(--grid-chart-gap) * 2) calc(var(--grid-chart-gap) * 3);\n    min-width: max-content;\n    height: 100%;\n    min-height: 0;\n  }\n\n  .grid-chart-y-labels {\n    display: grid;\n    grid-template-rows: repeat(var(--grid-chart-rows), minmax(0, 1fr));\n    grid-column: 1;\n    grid-row: 1;\n    gap: var(--grid-chart-gap);\n  }\n\n  .grid-chart-y-label {\n    display: flex;\n    align-items: center;\n    min-height: 0;\n    white-space: nowrap;\n  }\n\n  .grid-chart-cells {\n    display: grid;\n    grid-template-columns: repeat(var(--grid-chart-columns), minmax(0, 1fr));\n    grid-template-rows: repeat(var(--grid-chart-rows), minmax(0, 1fr));\n    grid-column: 2;\n    grid-row: 1;\n    gap: var(--grid-chart-gap);\n    min-height: 0;\n  }\n\n  .grid-chart-cell {\n    width: 100%;\n    height: 100%;\n    min-width: 0;\n    min-height: 0;\n    padding: 0;\n    appearance: none;\n    background: color-mix(\n      in srgb,\n      var(--grid-chart-cell-color, var(--grid-chart-color)) var(--grid-chart-cell-strength),\n      var(--grid-chart-empty)\n    );\n    border: 0;\n    border-radius: var(--grid-chart-radius);\n    outline: none;\n    transition: filter 120ms ease-out, box-shadow 120ms ease-out;\n  }\n\n  button.grid-chart-cell {\n    cursor: pointer;\n  }\n\n  .grid-chart-cell-empty {\n    --grid-chart-cell-strength: 0%;\n  }\n\n  .grid-chart-cell:hover,\n  .grid-chart-cell[data-active=\"true\"] {\n    filter: brightness(1.14);\n  }\n\n  .grid-chart-cell:focus-visible {\n    box-shadow: 0 0 0 2px var(--background-950, #111), 0 0 0 4px var(--ring-background, var(--accent-400));\n  }\n\n  .grid-chart-x-labels {\n    display: grid;\n    grid-template-columns: repeat(var(--grid-chart-columns), minmax(0, 1fr));\n    grid-column: 2;\n    grid-row: 2;\n    gap: var(--grid-chart-gap);\n  }\n\n  .grid-chart-x-label {\n    min-width: 0;\n    overflow: hidden;\n    text-align: center;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .grid-chart-legend {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: var(--grid-chart-legend-gap, 6px);\n    margin-top: var(--grid-chart-legend-offset, 16px);\n  }\n\n  .grid-chart-legend-swatch {\n    width: 1.25rem;\n    flex: 0 0 auto;\n    aspect-ratio: 1;\n    background: color-mix(\n      in srgb,\n      var(--grid-chart-color) var(--grid-chart-cell-strength),\n      var(--grid-chart-empty)\n    );\n    border-radius: var(--grid-chart-radius, 4px);\n  }\n}\n",
  "checkbox": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .checkbox {\n    @apply inline-grid gap-x-3;\n    grid-template-columns: auto 1fr;\n    grid-template-rows: auto auto;\n  }\n\n  .container {\n    @apply relative inline-flex items-center justify-center;\n  }\n\n  .box {\n    @apply relative h-5 w-5 cursor-pointer appearance-none;\n\n    background-color: var(--background);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius-xs, 0.25rem);\n    outline: none;\n    transition-property: transform;\n    transition-duration: var(--press-duration, 120ms);\n    transition-timing-function: var(--press-ease, cubic-bezier(0.34, 1.56, 0.64, 1));\n\n    &[data-invalid=\"true\"] {\n      border-color: var(--background-error-border, var(--danger-600));\n    }\n\n    &[data-invalid=\"true\"][data-selected=\"true\"],\n    &[data-invalid=\"true\"][data-indeterminate=\"true\"] {\n      border-color: var(--background-border);\n    }\n\n    &[data-disabled=\"true\"] {\n      cursor: not-allowed;\n      opacity: var(--disabled-opacity, 0.6);\n      pointer-events: none;\n    }\n\n    &[data-pressed=\"true\"]:not([data-disabled=\"true\"]) {\n      transform: var(--press-transform, scale(0.96));\n    }\n  }\n\n  .checkmark,\n  .indeterminate {\n    @apply absolute;\n    inset: 50%;\n    width: 65%;\n    height: 65%;\n    transform: translate(-50%, -50%);\n    color: var(--foreground);\n    pointer-events: none;\n  }\n\n  .label {\n    @apply cursor-pointer select-none;\n\n    &[data-disabled=\"true\"] {\n      @apply opacity-60 cursor-not-allowed;\n    }\n  }\n\n  .label-md {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .helper-text {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    grid-column: 2;\n    color: var(--helper-foreground);\n\n    &[data-error=\"true\"] {\n      color: var(--helper-error-foreground, var(--foreground-error, var(--danger-600)));\n    }\n  }\n}\n",
  "code": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .code {\n    --border-color: var(--background-700);\n    --header-bg: mix(var(--background-900) 90%, transparent);\n    --scroll-track-bg: mix(var(--background-950) 50%, transparent);\n\n    max-height: 52.5rem;\n    border-radius: var(--radius-sm);\n    border: 1px solid var(--border-color);\n    @apply flex w-full min-w-0 flex-col overflow-hidden;\n  }\n\n  .header {\n    flex: none;\n    background-color: var(--header-bg);\n    @apply flex items-center justify-between px-3 py-1.5;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    border-bottom: 1px solid var(--border-color);\n    color: var(--foreground-400);\n  }\n\n  .body {\n    @apply relative flex min-h-0 flex-1 flex-col;\n    flex: 1;\n  }\n\n  .viewport {\n    @apply overflow-hidden;\n  }\n\n  .viewport :global(pre) {\n    background: transparent;\n    @apply m-0 p-0;\n    width: fit-content;\n  }\n\n  .viewport :global(code) {\n    color: var(--foreground-300);\n    font-family: var(--font-mono, ui-monospace, monospace);\n    font-size: var(--text-code-size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-code, var(--font-weight-body-normal, 400));\n    letter-spacing: var(--letter-spacing-code, 0);\n    line-height: var(--leading-code, 1.5);\n    white-space: pre;\n  }\n\n  .viewport::-webkit-scrollbar {\n    width: 0.5rem;\n  }\n\n  .viewport::-webkit-scrollbar-track {\n    background: transparent;\n  }\n\n  .viewport::-webkit-scrollbar-thumb {\n    background-color: var(--background-700);\n    border-radius: 9999px;\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .viewport::-webkit-scrollbar-thumb:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background-600);\n  }\n\n  .scroll-track {\n    flex: none;\n    @apply w-full;\n    overflow-x: auto;\n    background-color: var(--scroll-track-bg);\n    backdrop-filter: blur(4px);\n  }\n\n  .expand-button {\n    @apply flex w-full items-center gap-3 px-4 py-2 cursor-pointer;\n    color: var(--foreground-300);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    border-top: 1px solid var(--border-color);\n    background: transparent;\n    border-left: none;\n    border-right: none;\n    border-bottom: none;\n  }\n\n  .expand-button:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background-800);\n  }\n\n  .expand-icon {\n    @apply shrink-0;\n    color: var(--foreground-400);\n  }\n\n  .copy-button {\n    @apply absolute right-2 top-2 flex items-center justify-center p-1 cursor-pointer;\n    border-radius: var(--radius-sm);\n    color: var(--foreground-400);\n    opacity: 0;\n    transition:\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    background: transparent;\n    border: none;\n    z-index: 1;\n  }\n\n  .copy-button:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background-800);\n    color: var(--foreground-300);\n  }\n\n  .copy-button:focus,\n  .body:hover .copy-button {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    opacity: 1;\n  }\n}\n",
  "color": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .color {\n    --background: color-mix(in srgb, var(--background-800) 30%, transparent);\n    --background-border: var(--background-700);\n    --focus-visible: var(--accent-500);\n\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    background-color: var(--background);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius-sm, 0.375rem);\n    width: 260px;\n  }\n\n  .color[data-disabled=\"true\"] {\n    opacity: 0.5;\n    pointer-events: none;\n  }\n\n  .color[data-variant=\"popover\"] {\n    background: transparent;\n    border-color: transparent;\n    border-radius: 0;\n  }\n\n  .color-provider {\n    display: inline-flex;\n    width: fit-content;\n  }\n\n  .color-provider .color-trigger {\n    --trigger-background: color-mix(in srgb, var(--background-800) 35%, transparent);\n    --trigger-background-hover: color-mix(in srgb, var(--background-700) 45%, transparent);\n    --trigger-border: var(--background-700);\n    --trigger-text: var(--foreground-200);\n    --background-border: var(--background-700);\n    --focus-visible: var(--accent-500);\n    --checkerboard-dark: var(--background-700);\n    --checkerboard-light: var(--background-800);\n\n    display: inline-flex;\n    align-items: center;\n    gap: 0.625rem;\n    min-width: 170px;\n    height: 40px;\n    padding: 0 0.75rem;\n    border: var(--border-width-base, 1px) solid var(--trigger-border);\n    border-radius: var(--radius-sm, 0.375rem);\n    background: var(--trigger-background);\n    color: var(--trigger-text);\n    cursor: pointer;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .color-provider .color-trigger:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background: var(--trigger-background-hover);\n  }\n\n  .color-provider .color-trigger:focus-visible {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .color-provider .color-trigger[data-disabled=\"true\"] {\n    opacity: 0.5;\n    cursor: not-allowed;\n  }\n\n  .color-provider .color-trigger[data-size=\"sm\"] {\n    min-width: 150px;\n    height: 34px;\n    padding: 0 0.625rem;\n    font-size: var(--text-xs, 0.75rem);\n  }\n\n  .color-provider .color-trigger[data-size=\"lg\"] {\n    min-width: 190px;\n    height: 46px;\n    padding: 0 0.875rem;\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n  }\n\n  .color-provider .color-trigger-swatch {\n    position: relative;\n    width: 20px;\n    height: 20px;\n    flex: 0 0 auto;\n    border-radius: var(--radius-xs, 0.25rem);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    overflow: hidden;\n  }\n\n  .color-provider .color-trigger-swatch::before {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-image: repeating-linear-gradient(\n      45deg,\n      var(--checkerboard-dark),\n      var(--checkerboard-dark) 4px,\n      var(--checkerboard-light) 4px,\n      var(--checkerboard-light) 8px\n    );\n  }\n\n  .color-provider .color-trigger-swatch::after {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-color: var(--preview-color, transparent);\n  }\n\n  .color-provider .color-trigger-value {\n    min-width: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .color .controls {\n    @apply pb-3 px-3 space-y-3;\n  }\n\n  .input-group {\n    width: 100%;\n  }\n\n  .input-group > div:first-child {\n    flex: 1;\n  }\n\n  .input-group .input {\n    width: 100%;\n  }\n\n  .input-group .format {\n    flex-shrink: 0;\n    width: 85px;\n  }\n\n  .color[data-size=\"sm\"] .format {\n    width: 75px;\n  }\n\n  .canvas {\n    position: relative;\n    width: 240px;\n    height: 160px;\n    @apply mx-auto mt-2 rounded-sm;\n    cursor: crosshair;\n    touch-action: none;\n    display: flex;\n    flex-direction: column;\n  }\n\n  .canvas[data-size=\"sm\"] {\n    width: 200px;\n    height: 130px;\n  }\n\n  .canvas[data-size=\"lg\"] {\n    width: 280px;\n    height: 190px;\n  }\n\n  .canvas[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .canvas .canvas-inner {\n    position: relative;\n    width: 100%;\n    flex: 1;\n    overflow: hidden;\n    @apply rounded-sm;\n  }\n\n  .canvas .canvas-gradient-hue {\n    position: absolute;\n    inset: 0;\n    overflow: hidden;\n  }\n\n  .canvas .canvas-gradient-saturation {\n    position: absolute;\n    inset: 0;\n    background: linear-gradient(to right, rgb(255, 255, 255), transparent);\n  }\n\n  .canvas .canvas-gradient-brightness {\n    position: absolute;\n    inset: 0;\n    background: linear-gradient(to top, rgb(0, 0, 0), transparent);\n  }\n\n  .canvas .canvas-pointer {\n    --pointer-border: color-mix(in srgb, var(--foreground-200) 50%, transparent);\n\n    position: absolute;\n    width: 12px;\n    height: 12px;\n    border-radius: var(--radius-full);\n    border: 2px solid var(--pointer-border);\n    box-shadow:\n      0 0 0 1px rgb(0 0 0 / 0.3),\n      0 2px 4px rgb(0 0 0 / 0.3);\n    pointer-events: none;\n    transform: translate(-50%, -50%);\n    z-index: 10;\n  }\n\n  .hue-slider {\n    --track-height: calc(var(--spacing, 0.25rem) * 5);\n    --padding-block: var(--padding, calc(var(--spacing, 0.25rem) * 0.5));\n    --side-padding: var(--inline-padding, 2px);\n    --thumb-width: calc(var(--track-height) - (var(--padding-block) * 2));\n    --thumb-height: var(--thumb-width);\n    --gradient-inset: 0;\n    --track-background: linear-gradient(\n      to right,\n      hsl(0, 100%, 50%),\n      hsl(60, 100%, 50%),\n      hsl(120, 100%, 50%),\n      hsl(180, 100%, 50%),\n      hsl(240, 100%, 50%),\n      hsl(300, 100%, 50%),\n      hsl(360, 100%, 50%)\n    );\n    --range-background: transparent;\n    --hit-size: calc(var(--track-height) + (var(--padding-block) * 2));\n    --thumb-inset: calc(var(--side-padding) + (var(--thumb-width) / 2));\n    --thumb-background: transparent;\n    --thumb-border: 2px solid white;\n    --thumb-shadow: 0 0 0 1px rgb(0 0 0 / 0.28);\n    --top: 50%;\n    --transform: translate(-50%, -50%);\n\n    width: 100%;\n    box-sizing: border-box;\n    min-height: var(--hit-size);\n    padding-block: var(--padding-block);\n  }\n\n  .hue-slider .hue-track {\n    position: relative;\n    width: 100%;\n    height: var(--track-height);\n    overflow: hidden;\n    @apply rounded-full;\n    background: transparent;\n  }\n\n  .hue-slider .hue-track::before {\n    content: \"\";\n    position: absolute;\n    inset-block: 0;\n    inset-inline: var(--gradient-inset);\n    @apply rounded-full;\n    background: var(--track-background);\n    pointer-events: none;\n  }\n\n  .hue-slider .hue-range {\n    background: transparent;\n  }\n\n  .hue-slider .hue-thumb {\n    --thumb-shadow-hover: 0 0 0 1px rgb(0 0 0 / 0.38);\n    --thumb-shadow-active: 0 0 0 1px rgb(0 0 0 / 0.24);\n\n    position: absolute;\n    left: clamp(var(--thumb-inset, 0px), var(--position, 0%), calc(100% - var(--thumb-inset, 0px)));\n    top: var(--top);\n    box-sizing: border-box;\n    width: var(--thumb-width);\n    height: var(--thumb-height);\n    transform: var(--transform);\n    border: var(--thumb-border);\n    @apply rounded-full;\n    background: var(--thumb-background);\n    box-shadow: var(--thumb-shadow);\n  }\n\n  .opacity-slider {\n    --size: calc(var(--spacing, 0.25rem) * 4);\n    --padding-block: var(--padding, calc(var(--spacing, 0.25rem) * 0.5));\n    --range-background: transparent;\n    --thumb-width: calc(var(--size) - (var(--padding-block) * 2));\n    --padding-inline: var(--inline-padding, var(--padding-block));\n    --hit-size: calc(var(--size) + (var(--padding-block) * 2));\n    --thumb-height: var(--thumb-width);\n    --side-padding: 2px;\n    --thumb-inset: calc(var(--side-padding) + (var(--thumb-width) / 2));\n    --thumb-background: transparent;\n    --thumb-border: 2px solid white;\n    --thumb-shadow: 0 0 0 1px rgb(0 0 0 / 0.28);\n    --top: 50%;\n    --transform: translate(-50%, -50%);\n    --checkerboard-dark: var(--background-800);\n    --checkerboard-light: var(--background-700);\n    --track-background:\n      linear-gradient(to right, transparent, var(--color-slider-opacity-color, rgb(0, 0, 0))),\n      repeating-linear-gradient(\n        45deg,\n        var(--checkerboard-dark),\n        var(--checkerboard-dark) 10px,\n        var(--checkerboard-light) 10px,\n        var(--checkerboard-light) 20px\n      );\n\n    width: 100%;\n    box-sizing: border-box;\n    min-height: var(--hit-size);\n    padding-block: var(--padding-block);\n    padding-inline: var(--padding-inline);\n    @apply rounded-full;\n  }\n\n  .opacity-slider .opacity-track {\n    position: relative;\n    width: 100%;\n    height: var(--size);\n    overflow: hidden;\n    @apply rounded-full;\n    background: var(--track-background);\n  }\n\n  .opacity-slider .opacity-range {\n    background: transparent;\n  }\n\n  .opacity-slider .opacity-thumb {\n    --thumb-shadow-hover: 0 0 0 1px rgb(0 0 0 / 0.38);\n    --thumb-shadow-active: 0 0 0 1px rgb(0 0 0 / 0.24);\n\n    position: absolute;\n    top: var(--top);\n    box-sizing: border-box;\n    width: var(--thumb-width);\n    height: var(--thumb-height);\n    transform: var(--transform);\n    border: var(--thumb-border);\n    @apply rounded-full;\n    background: var(--thumb-background);\n    box-shadow: var(--thumb-shadow);\n  }\n\n  .hue-slider .hue-thumb[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .hue-slider .hue-thumb[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    box-shadow: var(--thumb-shadow-hover, var(--thumb-shadow));\n  }\n\n  .hue-slider .hue-thumb[data-pressed=\"true\"] {\n    box-shadow: var(--thumb-shadow-active, var(--thumb-shadow));\n  }\n\n  .opacity-slider .opacity-thumb[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .opacity-slider .opacity-thumb[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    box-shadow: var(--thumb-shadow-hover);\n  }\n\n  .opacity-slider .opacity-thumb[data-pressed=\"true\"] {\n    box-shadow: var(--thumb-shadow-active);\n  }\n\n  .chroma-slider {\n    --size: calc(var(--spacing, 0.25rem) * 4);\n    --padding-block: var(--padding, calc(var(--spacing, 0.25rem) * 0.5));\n    --range-background: transparent;\n    --thumb-width: calc(var(--size) - (var(--padding-block) * 2));\n    --padding-inline: var(--inline-padding, var(--padding-block));\n    --hit-size: calc(var(--size) + (var(--padding-block) * 2));\n    --thumb-height: var(--thumb-width);\n    --side-padding: 2px;\n    --thumb-inset: calc(var(--side-padding) + (var(--thumb-width) / 2));\n    --thumb-background: transparent;\n    --thumb-border: 2px solid white;\n    --thumb-shadow: 0 0 0 1px rgb(0 0 0 / 0.28);\n    --top: 50%;\n    --transform: translate(-50%, -50%);\n    width: 100%;\n    box-sizing: border-box;\n    min-height: var(--hit-size);\n    padding-block: var(--padding-block);\n    padding-inline: var(--padding-inline);\n    @apply rounded-full;\n  }\n\n  .chroma-slider .chroma-track {\n    position: relative;\n    width: 100%;\n    height: var(--size);\n    overflow: hidden;\n    @apply rounded-full;\n  }\n\n  .chroma-slider .chroma-range {\n    background: transparent;\n  }\n\n  .chroma-slider .chroma-thumb {\n    --thumb-shadow-hover: 0 0 0 1px rgb(0 0 0 / 0.38);\n    --thumb-shadow-active: 0 0 0 1px rgb(0 0 0 / 0.24);\n\n    position: absolute;\n    top: var(--top);\n    box-sizing: border-box;\n    width: var(--thumb-width);\n    height: var(--thumb-height);\n    transform: var(--transform);\n    border: var(--thumb-border);\n    @apply rounded-full;\n    background: var(--thumb-background);\n    box-shadow: var(--thumb-shadow);\n  }\n\n  .chroma-slider .chroma-thumb[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .chroma-slider .chroma-thumb[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    box-shadow: var(--thumb-shadow-hover);\n  }\n\n  .chroma-slider .chroma-thumb[data-pressed=\"true\"] {\n    box-shadow: var(--thumb-shadow-active);\n  }\n\n  .recent-colors {\n    display: flex;\n    gap: 0.5rem;\n    overflow-x: auto;\n    padding-bottom: 0.25rem;\n  }\n\n  .recent-colors .recent-color-swatch {\n    flex-shrink: 0;\n    width: 32px;\n    height: 32px;\n    border-radius: var(--radius-sm);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    cursor: pointer;\n    background: none;\n    padding: 0;\n    outline: none;\n    transition:\n      box-shadow var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .recent-colors .recent-color-swatch:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    transform: scale(1.1);\n    box-shadow: 0 0 0 2px var(--focus-visible);\n  }\n\n  .recent-colors .recent-color-swatch:active {\n    transform: scale(0.95);\n  }\n\n  .recent-colors .recent-color-swatch:focus-visible {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .preview-swatch {\n    --checkerboard-dark: var(--background-700);\n    --checkerboard-light: var(--background-800);\n\n    position: relative;\n    width: 36px;\n    height: 36px;\n    border-radius: var(--radius-sm);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);\n    overflow: hidden;\n    flex-shrink: 0;\n  }\n\n  .preview-swatch::before {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-image: repeating-linear-gradient(\n      45deg,\n      var(--checkerboard-dark),\n      var(--checkerboard-dark) 6px,\n      var(--checkerboard-light) 6px,\n      var(--checkerboard-light) 12px\n    );\n    border-radius: var(--radius-sm);\n    pointer-events: none;\n    z-index: 1;\n  }\n\n  .preview-swatch::after {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-color: var(--preview-color, transparent);\n    border-radius: var(--radius-sm);\n    pointer-events: none;\n    z-index: 2;\n  }\n\n  .preview {\n    --checkerboard-dark: var(--background-700);\n    --checkerboard-light: var(--background-800);\n\n    position: relative;\n    width: 64px;\n    height: 64px;\n    border-radius: var(--radius-sm);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);\n    overflow: hidden;\n  }\n\n  .preview::before {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-image: repeating-linear-gradient(\n      45deg,\n      var(--checkerboard-dark),\n      var(--checkerboard-dark) 10px,\n      var(--checkerboard-light) 10px,\n      var(--checkerboard-light) 20px\n    );\n    border-radius: var(--radius-sm);\n    pointer-events: none;\n    z-index: 1;\n  }\n}\n",
  "command": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    min-width: 0;\n  }\n\n  .content {\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr) auto;\n    min-height: 0;\n    /* Single source of truth for the palette height: the search row and footer\n       keep their intrinsic size and the list absorbs whatever is left, so\n       raising --height grows the scroll region instead of doing nothing. */\n    --content-max-height: var(--height, min(32rem, 60dvh));\n    max-height: var(--content-max-height);\n  }\n\n  /* Overlay Container */\n  .overlay {\n    @apply fixed inset-0;\n    z-index: 999;\n    /* Apply backdrop styles directly to avoid creating a containing block that disrupts sticky elements */\n    background-color: var(--overlay);\n    backdrop-filter: var(--overlay-backdrop);\n    opacity: 0;\n    pointer-events: none;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      backdrop-filter 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] {\n    opacity: 1;\n    pointer-events: auto;\n  }\n\n  /* Content */\n  .overlay .content {\n    @apply absolute;\n    /* Anchor the palette's top center at a viewport-relative position. Keeping\n       the anchor on the top edge prevents filtering from moving the palette\n       when its animated height changes. */\n    offset-path: ray(0deg at var(--origin, 50% 20%));\n    offset-distance: 0;\n    offset-anchor: center top;\n    offset-rotate: 0deg;\n    width: min(var(--width, 28rem), calc(100% - 2rem));\n    /* Alignment positioning keeps the palette on screen at any origin, so the\n       cap only has to leave the viewport gutter. */\n    max-height: min(var(--content-max-height), calc(100% - 2rem));\n    /* Keep opening motion anchored to the same stable top edge. */\n    transform-origin: center top;\n    border-radius: var(--radius-sm);\n    background: var(--background);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    box-shadow: var(--background-shadow);\n    opacity: 0;\n    transform: scale(0.98);\n    pointer-events: none;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      transform 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] .content {\n    opacity: 1;\n    transform: scale(1);\n    pointer-events: auto;\n  }\n\n  .embedded {\n    @apply relative;\n    width: min(var(--width, 100%), 100%);\n    transform-origin: top center;\n    border-radius: var(--radius-sm);\n    background: var(--background);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    box-shadow: var(--background-shadow);\n  }\n\n  .inner {\n    @apply pt-1.5;\n    display: flex;\n    flex-direction: column;\n    min-height: 0;\n    --stroke-color: var(--border);\n    --fill: var(--background-list);\n    --frame-radius: var(--radius-sm);\n  }\n\n  /* Frame wraps its children in a div; it has to shrink with the Frame so the\n     scroll region resolves its height against the palette, not its content. */\n  .inner > div {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    min-height: 0;\n    overflow: hidden;\n  }\n\n  /* Search Section */\n  .search {\n    @apply flex p-1.5;\n    --input-active-border-color: transparent;\n    --input-active-box-shadow: none;\n  }\n\n  .search :global(.input-scope) {\n    flex: 1;\n    min-width: 0;\n  }\n\n  .input {\n    border-color: transparent;\n    background: transparent;\n    box-shadow: none;\n    font-weight: var(--font-weight-body-medium, 500);\n\n    &[data-active],\n    &[data-focus-visible] {\n      border-color: transparent;\n      box-shadow: none;\n    }\n  }\n\n  .search :global([data-focus-indicator=\"local\"]) {\n    display: none;\n  }\n\n  .input-empty :global([data-actions-position=\"right\"]) {\n    visibility: hidden;\n  }\n\n  /* List Section */\n  .list {\n    @apply py-0.5 px-2 space-y-2;\n    border-radius: var(--frame-radius) var(--frame-radius) 0 0;\n  }\n\n  .list :global([role=\"listbox\"]) {\n    @apply flex w-full flex-col;\n  }\n\n  .item {\n    @apply flex items-center justify-between rounded-sm px-2 py-0.5 cursor-pointer;\n    border-radius: 0.375rem;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    background-color: var(--background);\n    color: var(--foreground);\n  }\n\n  .item:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .item-content {\n    @apply flex min-w-0 flex-1 items-center gap-2.5;\n    flex: 1;\n  }\n\n  .item-icon {\n    @apply h-8 w-8 self-start rounded-sm;\n    background-color: var(--background-800);\n    color: var(--foreground-400);\n  }\n\n  .item-labels {\n    flex: 1;\n    @apply min-w-0;\n  }\n\n  .item-label {\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading, var(--leading-sm, 1.25rem));\n    color: var(--foreground);\n    @apply overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .item-description {\n    color: var(--foreground-muted);\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-body-size, var(--text-base, 0.9375rem)));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading, var(--leading-body, 1.5));\n    @apply overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .hint-wrapper {\n    @apply flex items-center;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .category-header {\n    @apply px-2 py-1.5 mt-2 first:mt-0;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground-muted);\n  }\n\n  /* Empty State */\n  .empty {\n    padding: 1.5rem 1rem;\n    text-align: center;\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-body-size, var(--text-base, 0.9375rem)));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading, var(--leading-body, 1.5));\n    color: var(--foreground-muted);\n  }\n\n  /* Footer */\n  .footer {\n    @apply flex w-full items-center gap-2 px-1.5 py-2;\n    background-color: var(--background-footer);\n    border-top: 1px solid var(--border);\n    justify-content: flex-between;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .overlay,\n    .content {\n      transition: none;\n    }\n  }\n}\n",
  "confirm": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .confirm {\n    --header-foreground: var(--foreground-100);\n    --description-foreground: var(--foreground-300);\n    --error-foreground: var(--foreground-danger);\n    --countdown-foreground: var(--foreground-400);\n    --label-foreground: var(--foreground-300);\n    --input-background: var(--background-800);\n    --input-border-color: var(--background-700);\n    --input-foreground: var(--foreground-100);\n  }\n\n  .container {\n    @apply flex flex-col;\n  }\n\n  .body {\n    @apply flex flex-col gap-4;\n  }\n\n  .row {\n    @apply flex items-center justify-between gap-8;\n  }\n\n  .row-text {\n    @apply flex flex-col;\n  }\n\n  .row-title {\n    font: var(--font-weight-body-medium, 500) var(--text-md, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--header-foreground);\n  }\n\n  .row-description {\n    font: var(--font-weight-body-medium, 500) var(--text-sm, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--description-foreground);\n  }\n\n  .header {\n    @apply flex items-center gap-3;\n  }\n\n  .description {\n    font: var(--font-weight-body-normal, 400) var(--text-body-size, var(--text-base, 0.9375rem)) /\n      var(--leading-body, 1.5) var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--description-foreground);\n  }\n\n  .error-message {\n    font: var(--font-weight-body-normal, 400) var(--text-xs, 0.75rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--error-foreground);\n  }\n\n  .warning-box {\n    @apply p-3 rounded-sm;\n    border: var(--border-width-base, 1px) solid var(--warning-border-color);\n    background-color: var(--warning-background);\n    color: var(--warning-foreground);\n    font: var(--font-weight-body-normal, 400) var(--text-body-size, var(--text-base, 0.9375rem)) /\n      var(--leading-body, 1.5) var(--font-body, inherit);\n    letter-spacing: normal;\n  }\n\n  .warning-box-low {\n    --warning-background: var(--warning-background-low);\n    --warning-border-color: var(--warning-border-color-low);\n    --warning-foreground: var(--warning-foreground-low);\n  }\n\n  .warning-box-medium {\n    --warning-background: var(--warning-background-medium);\n    --warning-border-color: var(--warning-border-color-medium);\n    --warning-foreground: var(--warning-foreground-medium);\n  }\n\n  .warning-box-high {\n    --warning-background: var(--warning-background-high);\n    --warning-border-color: var(--warning-border-color-high);\n    --warning-foreground: var(--warning-foreground-high);\n  }\n\n  .warning-box-critical {\n    --warning-background: var(--warning-background-critical);\n    --warning-border-color: var(--warning-border-color-critical);\n    --warning-foreground: var(--warning-foreground-critical);\n  }\n\n  .countdown-text {\n    font: var(--font-weight-body-normal, 400) var(--text-xs, 0.75rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--countdown-foreground);\n  }\n\n  .input-label {\n    font: var(--font-weight-body-medium, 500) var(--text-sm, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    margin-left: 0.25rem;\n    color: var(--label-foreground);\n  }\n\n  .input {\n    @apply w-full mt-2 rounded-sm transition-all duration-200;\n    --background: var(--input-background);\n    --background-border: var(--input-border-color);\n    --foreground: var(--input-foreground);\n  }\n\n  .actions {\n    @apply flex items-center gap-2;\n  }\n}\n",
  "date": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .calendar {\n    --disabled-opacity: 0.5;\n\n    @apply inline-grid gap-1;\n    grid-template-columns: repeat(7, 1fr);\n  }\n\n  .day-headers {\n    @apply grid gap-1 pb-1;\n    grid-template-columns: repeat(7, 1fr);\n    grid-column: 1 / -1;\n  }\n\n  .day-header {\n    @apply flex items-center justify-center;\n    font: var(--font-weight-body-normal, 400) var(--text-xs, 0.75rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--foreground);\n  }\n\n  .header {\n    @apply flex items-center gap-2 pl-2 pr-1.5 py-1.5;\n    color: var(--foreground);\n    grid-column: 1 / -1;\n  }\n\n  .month-year {\n    @apply mr-auto;\n    font: var(--font-weight-header-medium, 500) var(--text-sm, 0.875rem) /\n      var(--leading-sm, 1.25rem) var(--font-body, inherit);\n    letter-spacing: normal;\n    text-align: left;\n  }\n\n  .nav-button {\n    @apply inline-flex min-h-8 min-w-8 items-center justify-center cursor-pointer;\n    border-radius: var(--radius-sm);\n    background-color: var(--background, transparent);\n    color: var(--foreground);\n    border: 1px solid transparent;\n    font: var(--font-weight-body-medium, 500) var(--text-sm, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .nav-button:focus-visible {\n    outline: none;\n  }\n\n  .nav-button:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .grid {\n    @apply gap-x-1 gap-y-1;\n  }\n\n  .day-cell {\n    --day-cell-border-width: 2px;\n\n    @apply flex min-h-8 items-center justify-center px-2.5 py-2 cursor-pointer;\n    position: relative;\n    border-radius: var(--radius-sm);\n    background-color: var(--background, transparent);\n    color: var(--foreground);\n    border: var(--day-cell-border-width) solid transparent;\n    font: var(--font-weight-body-medium, 500) var(--text-sm, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .day-cell:focus-visible {\n    outline: none;\n  }\n\n  .week-header {\n    display: none;\n  }\n\n  .week-number {\n    display: none;\n  }\n}\n\n/* Variant states - these are outside @layer */\n.day-cell[data-selected=\"true\"] {\n  font-weight: var(--font-weight-body-medium, 500);\n}\n\n/*\n * .day-cell's background-color/border-color/color transition is tuned for\n * single-cell hover affordance (instant on enter, a 300ms fade on leave, via\n * --hover-duration). During range drag-preview, cells behind the cursor flip\n * their in-range state without being :hover themselves, so they'd inherit the\n * 300ms leave-fade and visibly trail the pointer. Range fill needs to track\n * the pointer exactly, so make those three instant in range mode only; opacity\n * (disabled/out-of-range dimming) keeps its normal duration. Positional\n * override of transition-duration against the base rule's\n * background-color/border-color/color/opacity transition-property order.\n */\n[data-mode=\"range\"] .day-cell {\n  transition-duration: 0s, 0s, 0s, var(--hover-duration, var(--hover-leave-duration, 300ms));\n}\n\n.day-cell[data-in-range=\"true\"] {\n  background-color: var(--range-background, var(--background-700));\n  border-radius: 0;\n}\n\n.day-cell[data-in-range=\"true\"][data-connect-right=\"true\"] {\n  /* Extend the track through the grid gutter without changing the grid item's\n   * dimensions or participating in track sizing. The shifted shadow overlaps\n   * the cell itself, so it reads as one continuous fill rather than a separate\n   * per-gap bridge. */\n  box-shadow: var(--spacing, 0.25rem) 0 0 var(--range-background, var(--background-700));\n}\n\n.day-cell[data-in-range=\"true\"]:not([data-connect-left=\"true\"]) {\n  border-top-left-radius: var(--radius-sm);\n  border-bottom-left-radius: var(--radius-sm);\n}\n\n.day-cell[data-in-range=\"true\"]:not([data-connect-right=\"true\"]) {\n  border-top-right-radius: var(--radius-sm);\n  border-bottom-right-radius: var(--radius-sm);\n}\n\n.day-cell[data-range-start=\"true\"],\n.day-cell[data-range-end=\"true\"] {\n  background-color: transparent;\n  color: var(--range-selected-foreground, var(--accent-50));\n  border-radius: var(--radius-sm);\n}\n\n/* The range track continues under the inside half of each endpoint. The\n * endpoint's selected circle is then painted above it, avoiding the empty\n * corner notches that occur when a rectangular track meets a rounded button.\n */\n.day-cell[data-range-start=\"true\"][data-connect-right=\"true\"]::before,\n.day-cell[data-range-end=\"true\"][data-connect-left=\"true\"]::before {\n  content: \"\";\n  position: absolute;\n  top: calc(-1 * var(--day-cell-border-width));\n  height: calc(100% + 2 * var(--day-cell-border-width));\n  background-color: var(--range-background, var(--background-700));\n  pointer-events: none;\n  z-index: 0;\n}\n\n.day-cell[data-range-start=\"true\"][data-connect-right=\"true\"]::before {\n  left: 50%;\n  right: calc(-1 * (var(--spacing, 0.25rem) + var(--day-cell-border-width)));\n}\n\n.day-cell[data-range-end=\"true\"][data-connect-left=\"true\"]::before {\n  left: calc(-1 * (var(--spacing, 0.25rem) + var(--day-cell-border-width)));\n  right: 50%;\n}\n\n.day-cell[data-range-start=\"true\"]::after,\n.day-cell[data-range-end=\"true\"]::after {\n  content: \"\";\n  position: absolute;\n  inset: calc(-1 * var(--day-cell-border-width));\n  border-radius: inherit;\n  background-color: var(--range-selected-background, var(--accent-500));\n  pointer-events: none;\n  z-index: 0;\n}\n\n.day-cell > span {\n  position: relative;\n  z-index: 1;\n}\n\n.day-cell[data-hovered=\"true\"]:not([data-disabled=\"true\"]):not([data-out-of-range=\"true\"]),\n.day-cell:hover:not([data-disabled=\"true\"]):not([data-out-of-range=\"true\"]) {\n  --hover-duration: var(--hover-enter-duration, 0ms);\n}\n\n.day-cell[data-today=\"true\"] {\n  border-color: transparent;\n}\n\n.day-cell[data-disabled=\"true\"],\n.day-cell[data-out-of-range=\"true\"] {\n  opacity: var(--disabled-opacity);\n}\n\n.day-cell[data-disabled=\"true\"] {\n  cursor: not-allowed;\n}\n",
  "divider": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .divider {\n    --background: var(--background-border, currentColor);\n  }\n}\n",
  "expand": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .scope {\n    position: relative;\n    display: block;\n    width: 100%;\n  }\n\n  .expand {\n    --expand-disabled-opacity: 0.6;\n    --expand-trigger-padding-x: 0.75rem;\n    --expand-trigger-padding-y: 0.5rem;\n    --expand-trigger-radius: var(--radius-sm, 0.375rem);\n\n    @apply flex w-full flex-col;\n  }\n\n  .expand[data-layout=\"contained\"] {\n    --expand-trigger-radius: 0;\n  }\n\n  .expand[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--expand-disabled-opacity);\n  }\n\n  .trigger {\n    @apply flex w-full items-stretch justify-between border-0 p-0 text-left;\n\n    appearance: none;\n    color: var(--foreground);\n    background-color: var(--background);\n    cursor: pointer;\n    border-radius: var(--expand-trigger-radius);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    outline: none;\n    box-shadow: none;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-smooth-settle, ease-out)),\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-smooth-settle, ease-out));\n  }\n\n  .trigger:focus,\n  .trigger:focus-visible {\n    outline: none;\n    box-shadow: none;\n  }\n\n  .trigger[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--expand-disabled-opacity);\n  }\n\n  .title {\n    @apply flex min-w-0 flex-1 items-center overflow-hidden;\n\n    padding: var(--expand-trigger-padding-y) 0 var(--expand-trigger-padding-y)\n      var(--expand-trigger-padding-x);\n    border-radius: var(--expand-trigger-radius) 0 0 var(--expand-trigger-radius);\n    color: inherit;\n    background-color: transparent;\n  }\n\n  .icon {\n    @apply flex shrink-0 items-center justify-center;\n\n    padding: var(--expand-trigger-padding-y) var(--expand-trigger-padding-x);\n    color: inherit;\n    background-color: transparent;\n    border-radius: 0 var(--expand-trigger-radius) var(--expand-trigger-radius) 0;\n  }\n\n  @media (hover: hover) {\n    .trigger:not([data-disabled=\"true\"]):hover {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n\n    .trigger:not([data-disabled=\"true\"]) .icon:hover {\n      border-radius: var(--expand-trigger-radius);\n    }\n  }\n\n  .icon > * {\n    transition: transform 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));\n  }\n\n  .icon[data-selected=\"true\"] > * {\n    transform: rotate(180deg);\n  }\n\n  .expand:has(.content[data-from=\"above\"]) {\n    flex-direction: column-reverse;\n  }\n\n  .expand:has(.content[data-from=\"above\"]) .icon > * {\n    transform: rotate(180deg);\n  }\n\n  .expand:has(.content[data-from=\"above\"]) .icon[data-selected=\"true\"] > * {\n    transform: rotate(0deg);\n  }\n\n  .expand:has(.content[data-from=\"left\"]) {\n    @apply flex-row-reverse items-start;\n  }\n\n  .expand:has(.content[data-from=\"left\"]) .trigger {\n    @apply w-auto flex-col;\n  }\n\n  .expand:has(.content[data-from=\"left\"]) .icon > * {\n    transform: rotate(-90deg);\n  }\n\n  .expand:has(.content[data-from=\"left\"]) .icon[data-selected=\"true\"] > * {\n    transform: rotate(90deg);\n  }\n\n  .expand:has(.content[data-from=\"right\"]) {\n    @apply flex-row items-start;\n  }\n\n  .expand:has(.content[data-from=\"right\"]) .trigger {\n    @apply w-auto flex-col;\n  }\n\n  .expand:has(.content[data-from=\"right\"]) .icon > * {\n    transform: rotate(90deg);\n  }\n\n  .expand:has(.content[data-from=\"right\"]) .icon[data-selected=\"true\"] > * {\n    transform: rotate(-90deg);\n  }\n\n  .content {\n    display: grid;\n    overflow: hidden;\n    grid-template-rows: 0fr;\n    transition: grid-template-rows 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));\n  }\n\n  .content[data-selected=\"true\"] {\n    grid-template-rows: 1fr;\n  }\n\n  .content[data-from=\"left\"],\n  .content[data-from=\"right\"] {\n    grid-template-rows: 1fr;\n    grid-template-columns: 0fr;\n    transition: grid-template-columns 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));\n  }\n\n  .content[data-from=\"left\"][data-selected=\"true\"],\n  .content[data-from=\"right\"][data-selected=\"true\"] {\n    grid-template-columns: 1fr;\n  }\n\n  .content-inner {\n    @apply min-h-0 overflow-hidden;\n\n    min-width: 0;\n    color: var(--foreground);\n    background-color: var(--background);\n  }\n\n  .divider {\n    margin: 0;\n  }\n}\n",
  "flex": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .flex {\n    --gap-scale: 0.5;\n\n    @apply flex;\n    gap: calc(var(--spacing, 0.25rem) * var(--flex-gap-step, 0) * var(--gap-scale, 1));\n  }\n\n  /* Direction variants */\n  .flex.row {\n    flex-direction: row;\n  }\n  .flex.column {\n    flex-direction: column;\n  }\n\n  /* Wrap variants */\n  .flex.wrap {\n    flex-wrap: wrap;\n  }\n\n  /* Per-axis gap overrides */\n  .flex.has-col-gap {\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--flex-col-gap-step, var(--flex-gap-step, 0)) *\n        var(--gap-scale, 1)\n    );\n  }\n  .flex.has-row-gap {\n    row-gap: calc(\n      var(--spacing, 0.25rem) * var(--flex-row-gap-step, var(--flex-gap-step, 0)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  /* Justify-content variants */\n  .flex.justify-start {\n    justify-content: flex-start;\n  }\n  .flex.justify-end {\n    justify-content: flex-end;\n  }\n  .flex.justify-center {\n    justify-content: center;\n  }\n  .flex.justify-between {\n    justify-content: space-between;\n  }\n  .flex.justify-around {\n    justify-content: space-around;\n  }\n  .flex.justify-evenly {\n    justify-content: space-evenly;\n  }\n\n  /* Align-items variants */\n  .flex.align-start {\n    align-items: flex-start;\n  }\n  .flex.align-end {\n    align-items: flex-end;\n  }\n  .flex.align-center {\n    align-items: center;\n  }\n  .flex.align-stretch {\n    align-items: stretch;\n  }\n  .flex.align-baseline {\n    align-items: baseline;\n  }\n\n  /* Container query parent - establishes containment context */\n  .container-query-parent {\n    container-type: inline-size;\n    container-name: flex-parent;\n    @apply w-full;\n  }\n\n  /* Container query responsive behavior - use .flex.container-responsive for specificity parity with base variants */\n  @container flex-parent (width < 400px) {\n    .flex.container-responsive {\n      flex-direction: column;\n      flex-wrap: wrap;\n      justify-content: flex-start;\n      --flex-gap-step: 2;\n    }\n  }\n\n  @container flex-parent (400px <= width < 500px) {\n    .flex.container-responsive {\n      flex-wrap: wrap;\n      --flex-gap-step: 2;\n    }\n  }\n\n  @container flex-parent (500px <= width < 900px) {\n    .flex.container-responsive {\n      --flex-gap-step: 4;\n    }\n  }\n\n  @container flex-parent (width >= 900px) {\n    .flex.container-responsive {\n      --flex-gap-step: 6;\n    }\n  }\n}\n",
  "frame": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    --frame-radius: var(--radius-sm, 24px);\n    --frame-stroke-width: var(--border-width-base, 1px);\n  }\n\n  .shape {\n    rx: var(--frame-radius);\n  }\n\n  .stroke {\n    stroke-width: var(--frame-stroke-width);\n    vector-effect: non-scaling-stroke;\n  }\n\n  /* Widens the shape's closed region by one whole stroke where it cuts the\n     border away — a stroke grows a filled region by half its width, so this is\n     twice the border. Half of that clears the border's own thickness; the other\n     half is the margin that keeps the two antialiased edges from landing on the\n     same pixel column and leaving a hairline of border behind. `CAP_OVERRUN` in\n     Frame.tsx is what runs the shape's outline back across it. */\n  .cut {\n    stroke-width: calc(var(--frame-stroke-width) * 2);\n    vector-effect: non-scaling-stroke;\n  }\n}\n",
  "gallery": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .item {\n    --border-width: var(--border-width-base, 1px);\n    --radius: var(--radius-sm, 0.375rem);\n    --transition: var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    --view-width: 200px;\n\n    @apply flex flex-col overflow-hidden no-underline cursor-pointer w-full h-full min-w-0;\n\n    color: inherit;\n    background: var(--background);\n    border: var(--border-width) solid var(--background-border);\n    border-radius: var(--radius);\n    transition:\n      border-color var(--transition),\n      transform var(--transition),\n      background-color var(--transition),\n      box-shadow var(--transition);\n  }\n\n  .item:focus {\n    outline: none;\n  }\n\n  .item[data-disabled=\"true\"] {\n    @apply cursor-not-allowed;\n  }\n\n  .item[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    border-color: var(--background-border);\n  }\n\n  .item[data-pressed=\"true\"] {\n    border-color: var(--background-border);\n  }\n\n  .item[data-orientation=\"horizontal\"] {\n    @apply flex-row;\n  }\n\n  .item[data-orientation=\"horizontal\"] .view {\n    width: var(--view-width);\n  }\n\n  .view {\n    --aspect-ratio: 16/9;\n\n    @apply relative overflow-hidden;\n\n    aspect-ratio: var(--aspect-ratio);\n    background: var(--background);\n  }\n\n  .view > img,\n  .view > video {\n    @apply w-full h-full object-cover;\n  }\n\n  .body {\n    --gap: calc(var(--spacing, 0.25rem) * 1);\n    --padding: calc(var(--spacing, 0.25rem) * 3);\n    --title-color: var(--foreground);\n    --description-color: var(--foreground-muted, var(--foreground));\n\n    @apply flex flex-col self-start min-w-0;\n\n    gap: var(--gap);\n    padding: var(--padding);\n  }\n\n  .item[data-orientation=\"horizontal\"] .body {\n    flex: 1;\n    align-self: stretch;\n  }\n\n  .body > :first-child {\n    color: var(--title-color);\n  }\n\n  .body > :not(:first-child) {\n    color: var(--description-color);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n}\n",
  "grid": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .grid {\n    --gap-scale: 1;\n\n    --background: transparent;\n    --foreground: inherit;\n\n    @apply grid w-full;\n    background-color: var(--background);\n    color: var(--foreground);\n    grid-template-columns: var(--grid-tpl, repeat(3, 1fr));\n    grid-template-rows: var(--grid-rows, auto);\n    gap: calc(var(--spacing, 0.25rem) * var(--grid-gap-step, 4) * var(--gap-scale, 1));\n    row-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-row-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n    justify-items: var(--grid-ji, stretch);\n    align-items: var(--grid-ai, stretch);\n    justify-content: var(--grid-jc, start);\n    align-content: var(--grid-ac, start);\n    grid-auto-flow: var(--grid-flow, row);\n  }\n\n  .container {\n    container-type: inline-size;\n    container-name: grid-ctx;\n    @apply w-full;\n  }\n\n  .grid.responsive-cols {\n    grid-template-columns: var(--grid-tpl-sm, 1fr);\n  }\n\n  @media (min-width: 640px) {\n    .grid.responsive-cols {\n      grid-template-columns: var(--grid-tpl-md, var(--grid-tpl-sm, 1fr));\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.responsive-cols {\n      grid-template-columns: var(--grid-tpl-lg, var(--grid-tpl-md, var(--grid-tpl-sm, 1fr)));\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.responsive-cols {\n      grid-template-columns: var(\n        --grid-tpl-xl,\n        var(--grid-tpl-lg, var(--grid-tpl-md, var(--grid-tpl-sm, 1fr)))\n      );\n    }\n  }\n\n  .grid.responsive-gap {\n    --grid-gap-step: var(--grid-gap-step-sm, 2);\n  }\n\n  @media (min-width: 640px) {\n    .grid.responsive-gap {\n      --grid-gap-step: var(--grid-gap-step-md, var(--grid-gap-step-sm, 4));\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.responsive-gap {\n      --grid-gap-step: var(--grid-gap-step-lg, var(--grid-gap-step-md, var(--grid-gap-step-sm, 4)));\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.responsive-gap {\n      --grid-gap-step: var(\n        --grid-gap-step-xl,\n        var(--grid-gap-step-lg, var(--grid-gap-step-md, var(--grid-gap-step-sm, 4)))\n      );\n    }\n  }\n\n  .grid.responsive-rows {\n    grid-template-rows: var(--grid-rows-sm, auto);\n  }\n\n  @media (min-width: 640px) {\n    .grid.responsive-rows {\n      grid-template-rows: var(--grid-rows-md, var(--grid-rows-sm, auto));\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.responsive-rows {\n      grid-template-rows: var(--grid-rows-lg, var(--grid-rows-md, var(--grid-rows-sm, auto)));\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.responsive-rows {\n      grid-template-rows: var(\n        --grid-rows-xl,\n        var(--grid-rows-lg, var(--grid-rows-md, var(--grid-rows-sm, auto)))\n      );\n    }\n  }\n\n  .grid.has-row-gap {\n    row-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-row-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  .grid.has-col-gap {\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  @container grid-ctx (width < 400px) {\n    .container .grid {\n      grid-template-columns: 1fr;\n      --grid-gap-step: 2;\n    }\n  }\n\n  /*\n   * grid-template-rows: masonry isn't supported by Chromium or WebKit,\n   * so masonry falls back to a CSS multi-column layout instead.\n   */\n  .grid.masonry {\n    display: block;\n    column-count: var(--grid-col-count, 1);\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  .grid.masonry.masonry-fixed-width {\n    --grid-masonry-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n    column-width: var(--grid-masonry-col-width);\n    width: max(\n      100%,\n      calc(\n        (var(--grid-col-count, 1) * var(--grid-masonry-col-width)) +\n          ((var(--grid-col-count, 1) - 1) * var(--grid-masonry-gap))\n      )\n    );\n  }\n\n  .grid.masonry.masonry-column-fill {\n    column-fill: var(--grid-masonry-col-fill);\n  }\n\n  .grid.masonry > * {\n    break-inside: avoid;\n    margin-bottom: calc(\n      var(--spacing, 0.25rem) * var(--grid-row-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  .grid.masonry.masonry-no-item-gap > * {\n    margin-bottom: 0;\n  }\n\n  .grid.masonry.responsive-cols {\n    column-count: var(--grid-col-count-sm, 1);\n  }\n\n  .grid.masonry.responsive-masonry-width {\n    --grid-masonry-col-width: var(--grid-masonry-col-width-sm, auto);\n  }\n\n  @media (min-width: 640px) {\n    .grid.masonry.responsive-cols {\n      column-count: var(--grid-col-count-md, var(--grid-col-count-sm, 1));\n    }\n\n    .grid.masonry.responsive-masonry-width {\n      --grid-masonry-col-width: var(\n        --grid-masonry-col-width-md,\n        var(--grid-masonry-col-width-sm, auto)\n      );\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.masonry.responsive-cols {\n      column-count: var(--grid-col-count-lg, var(--grid-col-count-md, var(--grid-col-count-sm, 1)));\n    }\n\n    .grid.masonry.responsive-masonry-width {\n      --grid-masonry-col-width: var(\n        --grid-masonry-col-width-lg,\n        var(--grid-masonry-col-width-md, var(--grid-masonry-col-width-sm, auto))\n      );\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.masonry.responsive-cols {\n      column-count: var(\n        --grid-col-count-xl,\n        var(--grid-col-count-lg, var(--grid-col-count-md, var(--grid-col-count-sm, 1)))\n      );\n    }\n\n    .grid.masonry.responsive-masonry-width {\n      --grid-masonry-col-width: var(\n        --grid-masonry-col-width-xl,\n        var(\n          --grid-masonry-col-width-lg,\n          var(--grid-masonry-col-width-md, var(--grid-masonry-col-width-sm, auto))\n        )\n      );\n    }\n  }\n\n  @container grid-ctx (width < 400px) {\n    .container .grid.masonry {\n      column-count: 1;\n    }\n  }\n}\n",
  "group": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .group {\n    --radius-size: calc(var(--spacing) * 1.5);\n    --padding-size: var(--radius-size);\n    --background-radius: var(--radius-sm, 0.375rem);\n    --background-border-width: var(--border-width-base, 1px);\n    --background-inner-radius: calc(var(--background-radius) - var(--background-border-width));\n    --text-height: calc(0.8em * var(--leading-tight, 1.25));\n    --vertical-spacing: calc(var(--spacing) * 4);\n    --border-height: calc(var(--background-border-width) * 2);\n    --padding-height: calc(var(--padding-size) * 2);\n    --control-height: calc(var(--text-height) + var(--vertical-spacing) + var(--border-height));\n    --item-height: max(\n      calc(var(--control-height) - var(--padding-height) - var(--border-height)),\n      0px\n    );\n\n    @apply flex overflow-hidden shrink-0 box-border;\n    color: var(--foreground, currentColor);\n    background-color: var(--background, transparent);\n    border: var(--background-border-width) solid var(--background-border, transparent);\n    border-radius: var(--background-radius);\n    padding: var(--padding-size);\n\n    &.horizontal {\n      @apply flex-row items-stretch;\n      height: var(--control-height);\n\n      .item.divider {\n        margin-block: calc(var(--padding-size) * -1);\n      }\n      .item [role=\"separator\"][aria-orientation=\"vertical\"] {\n        height: 100%;\n      }\n    }\n\n    &.vertical {\n      @apply flex-col;\n\n      .item.divider {\n        margin-inline: calc(var(--padding-size) * -1);\n      }\n      .item [role=\"separator\"][aria-orientation=\"horizontal\"] {\n        width: 100%;\n      }\n    }\n\n    &.none {\n      --padding-size: 0px;\n      @apply gap-0;\n    }\n\n    &.xs {\n      --radius-size: calc(var(--spacing) * 0.875);\n      @apply space-x-0.5;\n    }\n\n    &.sm {\n      --radius-size: calc(var(--spacing) * 1.25);\n      @apply space-x-1;\n    }\n  }\n\n  .item {\n    @apply flex items-stretch;\n    position: relative;\n    isolation: isolate;\n    box-sizing: border-box;\n    min-width: 0;\n    border-radius: var(--group-item-radius, 0);\n    overflow: visible;\n\n    &.grow {\n      flex: 1;\n    }\n\n    &.divider {\n      @apply p-0 shrink-0 flex-none;\n\n      > [role=\"separator\"] {\n        flex: 0 0 auto;\n      }\n    }\n  }\n\n  :is(.button, .input, .select, .expand) {\n    height: 100%;\n    min-height: var(--item-height);\n    min-width: 0;\n    box-sizing: border-box;\n    position: relative;\n    isolation: isolate;\n    overflow: visible;\n  }\n\n  .button {\n    @apply flex box-border;\n    /* Keep connected controls geometrically stable while pressed. The theme's\n       pressed colors provide feedback without pulling the button away from its\n       neighboring group items. Use no transform at all rather than scale(1),\n       which can still subtly alter text rendering on a composited layer.\n       Standalone Buttons retain their scale effect. */\n    --press-transform: none;\n    width: auto;\n    border-radius: var(--group-item-radius, var(--background-inner-radius));\n  }\n\n  /* Button resolves icon-only state itself. Put the square sizing contract on\n     the flex item so its intrinsic inline contribution matches its rendered\n     width after the Group's block size is resolved. */\n  .horizontal .item:has(.button[data-icon-only=\"true\"]):not(:has([role=\"separator\"])) {\n    flex: 0 0 auto;\n    aspect-ratio: 1;\n  }\n\n  .horizontal\n    .item:has(.button[data-icon-only=\"true\"]):not(:has([role=\"separator\"]))\n    .button[data-icon-only=\"true\"] {\n    flex: 1 1 auto;\n    width: 100%;\n    height: 100%;\n    aspect-ratio: auto;\n  }\n\n  .vertical .item .button[data-icon-only=\"true\"],\n  .horizontal .item:has([role=\"separator\"]) .button[data-icon-only=\"true\"] {\n    flex: 0 0 auto;\n    width: auto;\n    height: 100%;\n    aspect-ratio: 1;\n  }\n\n  .input {\n    @apply flex flex-1 items-stretch overflow-visible;\n    border-radius: var(--group-item-radius, var(--background-inner-radius));\n\n    > [data-ring=\"true\"] {\n      border-radius: inherit;\n    }\n  }\n\n  .select {\n    @apply flex items-stretch min-w-0 p-0 bg-transparent border-none;\n    border-radius: var(--group-item-radius, var(--background-inner-radius));\n  }\n\n  .select > :global(.value) {\n    @apply flex flex-1 items-stretch min-w-0 h-full p-0;\n    border-radius: inherit;\n  }\n\n  .select\n    > :global(.value):has(> :global(.button[data-hovered=\"true\"]:not([data-disabled=\"true\"]))) {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background, transparent);\n  }\n\n  .select > :global(.value) > :global(.button) {\n    @apply w-full h-full min-h-0;\n    background-color: transparent;\n    border: none;\n    border-radius: inherit;\n  }\n\n  .expand {\n    @apply flex items-stretch;\n    border-radius: var(--group-item-radius, var(--background-inner-radius));\n  }\n\n  .expand :global(.expand-scope),\n  .expand :global(.expand) {\n    @apply flex w-full h-full;\n  }\n\n  .expand :global(.expand) {\n    @apply flex-col;\n    border-radius: inherit;\n  }\n\n  .expand :global(.trigger) {\n    @apply min-h-0;\n    border-radius: inherit;\n  }\n\n  .trigger {\n  }\n\n  .group {\n    .item :is(.button, .select) {\n      border: none;\n    }\n\n    .input > [data-input-focus-surface=\"true\"] {\n      border: none;\n    }\n\n    .item [role=\"separator\"] {\n      --background: var(--background-border);\n    }\n\n    &.none {\n      .item:not(.divider) {\n        overflow: hidden;\n      }\n\n      :is(.button, .trigger, .select) {\n        border-radius: 0;\n        --background-radius: 0;\n        --background-inner-radius: 0;\n      }\n\n      .input {\n        --radius-sm: 0;\n      }\n\n      .item:first-child {\n        --group-item-radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n      }\n\n      .item:last-child {\n        --group-item-radius: 0 var(--background-inner-radius) var(--background-inner-radius) 0;\n      }\n\n      .item:only-child {\n        --group-item-radius: var(--background-inner-radius);\n      }\n\n      &.horizontal {\n        .item:first-child :is(.button, .trigger, .input > *, .select) {\n          border-top-left-radius: var(--background-inner-radius);\n          border-bottom-left-radius: var(--background-inner-radius);\n        }\n\n        .item:last-child :is(.button, .trigger, .input > *, .select) {\n          border-top-right-radius: var(--background-inner-radius);\n          border-bottom-right-radius: var(--background-inner-radius);\n        }\n\n        .item:last-child .trigger .icon-section {\n          border-top-right-radius: var(--background-inner-radius);\n          border-bottom-right-radius: var(--background-inner-radius);\n        }\n      }\n\n      &.vertical {\n        .item:first-child {\n          --group-item-radius: var(--background-inner-radius) var(--background-inner-radius) 0 0;\n        }\n\n        .item:last-child {\n          --group-item-radius: 0 0 var(--background-inner-radius) var(--background-inner-radius);\n        }\n\n        .item:first-child :is(.button, .trigger, .input > *, .select) {\n          border-top-left-radius: var(--background-inner-radius);\n          border-top-right-radius: var(--background-inner-radius);\n        }\n\n        .item:last-child :is(.button, .trigger, .input > *, .select) {\n          border-bottom-left-radius: var(--background-inner-radius);\n          border-bottom-right-radius: var(--background-inner-radius);\n        }\n      }\n    }\n\n    &:is(.xs, .sm) {\n      .item {\n        --group-item-radius: var(--background-inner-radius);\n      }\n\n      :is(.button, .trigger, .select) {\n        border-radius: var(--background-inner-radius);\n      }\n\n      .input {\n        --radius-sm: var(--background-inner-radius);\n      }\n    }\n  }\n\n  .group [data-ring=\"true\"] {\n    --ring-shadow: none;\n    --ring-border: transparent;\n    --ring-border-visible: transparent;\n  }\n\n  .group :global(.focus-indicator) {\n    display: none;\n  }\n\n  .group [data-focus-indicator=\"local\"] {\n    display: none;\n  }\n\n  :is(.button[data-focus-visible=\"true\"], .trigger[data-focus-visible=\"true\"]) {\n    @apply outline-none;\n    box-shadow: none;\n  }\n}\n",
  "icon": "@layer components.defaults {\n  .icon {\n    display: inline-block;\n    flex: none;\n    vertical-align: middle;\n    background-color: currentColor;\n    -webkit-mask-position: center;\n    mask-position: center;\n    -webkit-mask-repeat: no-repeat;\n    mask-repeat: no-repeat;\n    -webkit-mask-size: contain;\n    mask-size: contain;\n  }\n}\n",
  "input": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .scope {\n    @apply flex;\n    position: relative;\n    min-width: 0;\n    overflow: visible;\n  }\n\n  .input {\n    height: fit-content;\n    min-width: 0;\n    flex: 1;\n    @apply py-1.5 px-3;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground, currentColor);\n    background-color: transparent;\n    border: none;\n    outline: none;\n    box-sizing: border-box;\n\n    &::placeholder {\n      color: var(--placeholder, var(--foreground, currentColor));\n    }\n\n    &[data-disabled] {\n      color: var(--disabled-foreground, var(--foreground, currentColor));\n      cursor: not-allowed;\n    }\n\n    /* Hide default browser spinners for number inputs */\n    &[type=\"number\"] {\n      &::-webkit-outer-spin-button,\n      &::-webkit-inner-spin-button {\n        -webkit-appearance: none;\n        margin: 0;\n        display: none;\n      }\n\n      /* Firefox */\n      &[type=\"number\"] {\n        -moz-appearance: textfield;\n      }\n    }\n  }\n\n  /* Content wrapper used in place of the native input when children are\n     provided. Shares .input's box so composite fields line up with plain ones. */\n  .content {\n    @apply flex items-center;\n    cursor: text;\n  }\n\n  .icon-wrapper {\n    @apply z-10 flex items-center;\n    pointer-events: none;\n  }\n\n  .icon {\n    @apply flex items-center shrink-0;\n    color: var(--foreground, currentColor);\n  }\n\n  .icon-left {\n    @apply relative;\n  }\n\n  .icon-right {\n    @apply relative;\n  }\n\n  .container {\n    --adornment-offset: calc(var(--spacing, 0.25rem) * 1.5);\n    --action-inset: calc(var(--spacing, 0.25rem) * 0.5);\n    --background-radius: var(--radius-sm, 0.375rem);\n    --background-inner-radius: calc(var(--background-radius) - var(--border-width-base, 1px));\n\n    display: flex;\n    align-items: center;\n    min-width: 0;\n    flex: 1;\n    background-color: var(--background, transparent);\n    border: var(--border-width-base, 1px) solid var(--background-border, transparent);\n    border-radius: var(--background-radius);\n    box-sizing: border-box;\n    overflow: hidden;\n    transition: border-color var(--focus-transition-duration, 150ms)\n      var(--focus-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-focused=\"true\"]:not([data-disabled]) {\n      border-color: var(--focus-border, var(--background-border, transparent));\n    }\n\n    &[data-disabled] {\n      background-color: var(--disabled-background, var(--background, transparent));\n      cursor: not-allowed;\n      opacity: 0.5;\n    }\n\n    &[data-variant=\"ghost\"] {\n      --ring-shadow: none;\n      --ring-border: transparent;\n      --ring-border-visible: transparent;\n\n      background-color: transparent;\n      border-color: transparent;\n    }\n  }\n\n  .start-adornments,\n  .end-adornments {\n    @apply flex items-center gap-1;\n    align-self: stretch;\n    flex-shrink: 0;\n    pointer-events: none;\n  }\n\n  .start-adornments {\n    @apply pl-2.5;\n  }\n\n  .end-adornments {\n    padding-right: var(--adornment-offset);\n\n    &:has(.actions) {\n      padding-right: var(--action-inset);\n    }\n\n    &:has(.controls) {\n      padding-right: 0;\n    }\n\n    &:has([data-hint]) {\n      padding-right: 0;\n    }\n  }\n\n  .actions {\n    @apply flex items-center gap-0.5;\n    padding-block: var(--action-inset);\n    pointer-events: auto;\n  }\n\n  .action {\n    @apply flex items-center justify-center;\n    border-radius: var(--background-inner-radius);\n    color: var(--action-foreground, var(--foreground, currentColor));\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .action:global(.button):global(.icon) {\n    --size: calc(var(--spacing, 0.25rem) * 7);\n    --padding-block: calc(var(--spacing, 0.25rem) * 1.5);\n    --padding-inline: calc(var(--spacing, 0.25rem) * 1.5);\n  }\n\n  .action:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--action-background-hover, transparent);\n    color: var(--action-foreground-hover, var(--action-foreground, var(--foreground, currentColor)));\n  }\n\n  .hint {\n    @apply inline-flex items-center justify-center whitespace-nowrap;\n    flex-shrink: 0;\n    margin-inline-start: calc(var(--spacing, 0.25rem) * 0.5);\n    margin-inline-end: var(--adornment-offset);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    line-height: 1; /* adornment is vertically centered by its fixed surface */\n    color: var(--foreground, currentColor);\n    background-color: var(--background, transparent);\n    pointer-events: auto;\n  }\n\n  .controls {\n    @apply flex w-7.5 flex-col;\n    align-self: stretch;\n    min-height: 100%;\n    border-left: var(--border-width-base, 1px) solid var(--background-border, transparent);\n    pointer-events: auto;\n  }\n\n  .controls[data-disabled] {\n    opacity: 0.5;\n    cursor: not-allowed;\n  }\n\n  .stepper {\n    @apply flex w-full flex-1 items-center justify-center p-0 cursor-pointer;\n    flex: 1;\n    background-color: transparent;\n    border: none;\n    color: var(--foreground, currentColor);\n    --active-background: var(--background-700);\n    --active-color: var(--foreground-100);\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    & + .stepper {\n      border-top: var(--border-width-base, 1px) solid var(--background-border, transparent);\n    }\n\n    &:hover:not(:disabled) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      background-color: var(--hover-background, transparent);\n      color: var(--hover-color, var(--foreground, currentColor));\n    }\n\n    &:active:not(:disabled) {\n      background-color: var(--active-background, var(--hover-background, transparent));\n      color: var(--active-color, var(--foreground, currentColor));\n    }\n\n    &:disabled {\n      cursor: not-allowed;\n      opacity: 0.5;\n    }\n  }\n}\n",
  "label": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .label {\n    --background: transparent;\n    --foreground: var(--foreground-primary);\n    --disabled-foreground: var(--foreground-secondary);\n    --error-foreground: var(--danger-600);\n    --helper-color: var(--foreground-secondary);\n    --helper-error-color: var(--danger-600);\n    --required-color: var(--danger-600);\n  }\n\n  .text {\n    display: block;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n    transition: color 150ms ease;\n\n    &[data-disabled] {\n      color: var(--disabled-foreground);\n      opacity: 0.6;\n      cursor: not-allowed;\n    }\n\n    &[data-error] {\n      color: var(--error-foreground);\n    }\n  }\n\n  .required-indicator {\n    margin-left: 0.25rem;\n    color: var(--required-color);\n  }\n\n  .helper-text {\n    display: block;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    margin-top: 0.25rem;\n    transition: color 150ms ease;\n    color: var(--helper-color);\n\n    &[data-error] {\n      color: var(--helper-error-color);\n    }\n  }\n}\n",
  "list": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .container {\n    --gap-scale: 1;\n\n    color: var(--foreground);\n    @apply flex flex-col;\n    gap: calc(var(--spacing, 0.25rem) * var(--list-gap-step, 0.5) * var(--gap-scale, 1));\n  }\n\n  .container[data-orientation=\"horizontal\"] {\n    @apply flex-row flex-wrap;\n  }\n\n  .item {\n    --background: transparent;\n\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border-radius: var(--item-radius, var(--radius-sm, 0.375rem));\n    @apply flex items-center gap-3 px-3 py-1 cursor-pointer;\n    background-color: var(--background);\n    color: var(--foreground);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .item[data-list-layout=\"columns\"] {\n    display: grid;\n  }\n\n  .item[data-list-layout=\"columns\"] > * {\n    min-width: 0;\n  }\n\n  .item[data-focus-visible=\"true\"] {\n    box-shadow:\n      inset 0 0 0 1px var(--item-focus-visible-background, var(--focus-visible-background)),\n      0 0 0 2px var(--item-focus-visible, var(--focus-visible));\n    outline: none;\n  }\n\n  .item:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .container[data-keyboard-mode=\"true\"] .item[data-highlighted=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .item[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--disabled-opacity, 0.6);\n    pointer-events: none;\n  }\n\n  .checkbox,\n  .control,\n  .media {\n    @apply flex items-center justify-center flex-shrink-0;\n  }\n\n  .control {\n    margin-left: auto;\n  }\n\n  .item[data-list-layout=\"columns\"] .control,\n  .item[data-list-layout=\"columns\"] .actions {\n    margin-left: 0;\n    justify-self: end;\n  }\n\n  .control[data-placement=\"start\"] {\n    margin-left: 0;\n  }\n\n  .item[data-list-layout=\"columns\"] .control[data-placement=\"start\"],\n  .item[data-list-layout=\"columns\"] .checkbox,\n  .item[data-list-layout=\"columns\"] .media {\n    justify-self: start;\n  }\n\n  .media {\n    @apply h-8 w-8;\n  }\n\n  .title {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n  }\n\n  .desc {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    color: var(--desc-foreground);\n  }\n\n  .actionGroup {\n    @apply flex items-center;\n    padding-left: 0.25rem;\n    padding-right: 0.25rem;\n  }\n\n  .actionGroup[data-justify=\"between\"] {\n    justify-content: space-between;\n  }\n  .actionGroup[data-justify=\"start\"] {\n    justify-content: flex-start;\n  }\n  .actionGroup[data-justify=\"end\"] {\n    justify-content: flex-end;\n  }\n\n  .actions {\n    align-items: center;\n    gap: 0.25rem;\n    margin-left: auto;\n    flex-shrink: 0;\n    @apply flex p-1.5 opacity-70 transition-opacity;\n  }\n\n  .item:hover .actions,\n  .item:focus-within .actions {\n    opacity: 1;\n  }\n\n  .action {\n    --background: transparent;\n\n    @apply flex items-center justify-center;\n    border-radius: 0.25rem;\n    background-color: var(--background);\n    color: var(--foreground);\n    @apply p-2;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .action:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n}\n",
  "mask": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .mask {\n    @apply relative h-full w-full;\n  }\n}\n\n.mask[style*=\"mask-image\"],\n.mask[style*=\"-webkit-mask-image\"] {\n  -webkit-mask-size: 100% 100%;\n  mask-size: 100% 100%;\n}\n\n.mask[style*=\"--mask-clip-path\"] {\n  clip-path: var(--mask-clip-path);\n}\n\n.mask-gradient {\n  background: var(--mask-gradient);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n  color: transparent;\n}\n",
  "menu": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .trigger-root:global(.menu) {\n    display: inline-flex;\n    align-items: stretch;\n    min-width: 0;\n  }\n\n  .trigger-root:global(.menu) > .trigger {\n    flex: 1 1 auto;\n  }\n\n  .content-root:global(.menu),\n  .sub-content-root:global(.menu) {\n    display: block;\n    position: absolute;\n  }\n\n  :global(.menu) {\n    display: contents;\n\n    .content,\n    .sub-content {\n      --content-padding: calc(var(--spacing) * 2);\n      --content-radius: var(--radius-sm, 0.375rem);\n      --content-inner-radius: calc(var(--content-radius) - var(--border-width-base, 1px));\n      --disabled-opacity: 0.5;\n\n      @apply min-w-40 max-w-80 overflow-hidden;\n      background-color: var(--background);\n      border: var(--border-width-base, 1px) solid var(--background-border);\n      border-radius: var(--content-radius);\n      outline: none;\n      transition:\n        opacity 180ms var(--ease-snappy-pop, ease-out),\n        transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);\n    }\n\n    .trigger {\n      @apply flex items-center justify-center;\n      cursor: pointer;\n      outline: none;\n      user-select: none;\n\n      &[data-disabled=\"true\"] {\n        opacity: 0.5;\n        pointer-events: none;\n      }\n    }\n\n    .item {\n      @apply flex min-w-0 items-center gap-2;\n      padding: calc(var(--content-padding) / 1.5) var(--content-padding);\n      border-radius: var(--content-inner-radius);\n      cursor: pointer;\n      user-select: none;\n      outline: none;\n      color: var(--foreground);\n      background-color: var(--background);\n      font-family: var(--font-body, inherit);\n      font-size: var(--text-sm, 0.875rem);\n      font-weight: var(--font-weight-body-medium, 500);\n      letter-spacing: normal;\n      line-height: var(--leading-sm, 1.25rem);\n\n      &[data-disabled=\"true\"] {\n        opacity: var(--disabled-opacity);\n        pointer-events: none;\n        color: var(--foreground-400);\n      }\n    }\n\n    .item[data-inset=\"true\"] {\n      padding-left: calc(var(--content-padding) * 2.67);\n    }\n\n    .item-indicator {\n      @apply flex h-4 w-4 shrink-0 items-center justify-center;\n      margin-left: auto;\n      color: var(--foreground);\n    }\n\n    .sub-trigger {\n      @apply flex min-w-0 w-full items-center gap-2;\n      padding: calc(var(--content-padding) / 1.5) var(--content-padding);\n      border-radius: var(--content-inner-radius);\n      cursor: pointer;\n      user-select: none;\n      outline: none;\n      color: var(--foreground);\n      background-color: var(--background);\n      font-family: var(--font-body, inherit);\n      font-size: var(--text-sm, 0.875rem);\n      font-weight: var(--font-weight-body-medium, 500);\n      letter-spacing: normal;\n      line-height: var(--leading-sm, 1.25rem);\n\n      &[data-disabled=\"true\"] {\n        opacity: var(--disabled-opacity);\n        pointer-events: none;\n        color: var(--foreground-400);\n      }\n    }\n\n    .sub-trigger[data-inset=\"true\"] {\n      padding-left: calc(var(--content-padding) * 2.67);\n    }\n\n    .sub-trigger-chevron {\n      @apply h-4 w-4 shrink-0;\n      margin-left: auto;\n      color: var(--foreground-400);\n    }\n\n    .label {\n      padding: calc(var(--content-padding) / 2) var(--content-padding);\n      color: var(--foreground-400);\n      font-family: var(--font-body, inherit);\n      font-size: var(--text-sm, 0.875rem);\n      font-weight: var(--font-weight-body-medium, 500);\n      letter-spacing: normal;\n      line-height: var(--leading-sm, 1.25rem);\n\n      &[data-inset=\"true\"] {\n        padding-left: calc(var(--content-padding) * 2.67);\n      }\n    }\n\n    .separator {\n      @apply my-1;\n      margin-left: calc(var(--content-padding) / -2);\n      margin-right: calc(var(--content-padding) / -2);\n      height: 1px;\n      background-color: var(--background-border);\n    }\n\n    .shortcut {\n      margin-left: auto;\n      color: var(--foreground-400);\n      font-family: var(--font-mono, ui-monospace, monospace);\n      font-size: var(--text-code-size, var(--text-sm, 0.875rem));\n      font-weight: var(--font-weight-code, var(--font-weight-body-normal, 400));\n      letter-spacing: var(--letter-spacing-code, 0);\n      line-height: var(--leading-code, 1.5);\n    }\n  }\n}\n",
  "modal": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .overlay {\n    position: fixed;\n    inset: 0;\n    z-index: 9999;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    isolation: isolate;\n  }\n\n  .overlay[data-state=\"exiting\"] {\n    pointer-events: none;\n  }\n\n  .backdrop {\n    @apply absolute inset-0 cursor-pointer;\n    background-color: var(--background);\n    opacity: 0;\n    backdrop-filter: blur(0px);\n    pointer-events: none;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      backdrop-filter 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] .backdrop {\n    opacity: 1;\n    backdrop-filter: blur(4px);\n    pointer-events: auto;\n  }\n\n  .panel {\n    @apply relative flex w-full flex-col overflow-hidden;\n    z-index: 1;\n    opacity: 0;\n    transform: translateY(0.5rem) scale(0.98);\n    max-height: 90vh;\n    margin: 1rem;\n    color: var(--foreground);\n    background-color: var(--background);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius-sm, 0.375rem);\n    outline: none;\n    pointer-events: auto;\n    overflow: hidden;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      transform 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] .panel {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n\n  .panel[data-animation=\"fade\"] {\n    transform: none;\n    transition-property: opacity;\n  }\n\n  .overlay[data-state=\"entered\"] .panel[data-animation=\"fade\"] {\n    transform: none;\n  }\n\n  .overlay[data-state=\"exiting\"] .panel {\n    pointer-events: none;\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .backdrop,\n    .panel {\n      transition: none;\n    }\n  }\n\n  .header {\n    @apply flex shrink-0 items-center justify-between gap-2 px-6 py-4;\n    border-bottom: var(--border-width-base, 1px) solid var(--background-border);\n  }\n\n  .title {\n    @apply m-0;\n    font-family: var(--font-heading, var(--font-body, inherit));\n    font-size: var(--header-text-lg, var(--text-lg, 1.125rem));\n    font-weight: var(--font-weight-header-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-heading, 1.25);\n    color: var(--title-foreground, var(--foreground));\n  }\n\n  .spacer {\n    flex: 1;\n  }\n\n  .close {\n    @apply ml-auto flex items-center justify-center cursor-pointer;\n    background: none;\n    border: none;\n    color: var(--foreground);\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-hovered=\"true\"] {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n\n    &[data-pressed=\"true\"] {\n      transform: scale(0.92);\n    }\n\n    &[data-focus-visible=\"true\"] {\n      outline: 2px solid var(--focus-visible);\n      outline-offset: 2px;\n      border-radius: var(--radius-xs, 0.25rem);\n    }\n  }\n\n  .close-icon {\n    @apply h-5 w-5;\n  }\n\n  .content {\n    @apply px-3 py-1.5;\n    color: var(--foreground);\n  }\n\n  .body-scroll {\n    flex: 1 1 auto;\n    min-height: 0;\n  }\n\n  .body-static {\n    flex: 1 1 auto;\n    min-width: 0;\n    min-height: 0;\n    overflow: hidden;\n  }\n\n  .footer {\n    @apply flex shrink-0 items-center justify-between gap-4 px-6 py-4;\n    background-color: var(--footer-background, var(--background));\n    border-top: var(--border-width-base, 1px) solid var(--background-border);\n  }\n\n  /* Size variants. :where() keeps these at the same specificity as `.panel`\n     itself (an attribute selector alone would outrank a plain consumer\n     className like `max-w-3xl`, which should always be free to override the\n     default size). */\n  .panel:where([data-size=\"fit\"]) {\n    width: fit-content;\n  }\n\n  .panel:where([data-size=\"auto\"]) {\n    max-width: min(90vw, 28rem);\n  }\n\n  /* Media queries for smaller screens */\n  @media (max-width: 640px) {\n    .panel {\n      margin: 1rem;\n    }\n  }\n}\n",
  "page": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .page {\n    --padding: 1rem;\n    --gap: 0;\n\n    @apply relative flex w-full min-w-0 flex-col;\n    box-sizing: border-box;\n    container-type: inline-size;\n    max-width: var(--max-width);\n    gap: var(--gap);\n  }\n\n  .page[data-centered=\"true\"] {\n    margin-inline: auto;\n  }\n\n  .page[data-fullscreen=\"true\"] {\n    min-height: 100dvh;\n    max-width: none;\n  }\n\n  .padding-none {\n    --padding: 0;\n    padding: 0;\n  }\n\n  .padding-sm {\n    --padding: 0.5rem;\n    padding: var(--padding);\n  }\n\n  .padding-md {\n    --padding: 1rem;\n    padding: var(--padding);\n  }\n\n  .padding-lg {\n    --padding: 1.5rem;\n    padding: var(--padding);\n  }\n\n  .padding-xl {\n    --padding: 2rem;\n    padding: var(--padding);\n  }\n\n  .header,\n  .footer {\n    @apply w-full min-w-0;\n  }\n\n  .header {\n    z-index: 10;\n  }\n\n  .footer {\n    z-index: 5;\n  }\n\n  .sticky {\n    position: sticky;\n    background: inherit;\n  }\n\n  .header.sticky {\n    top: 0;\n  }\n\n  .footer.sticky {\n    bottom: 0;\n  }\n\n  .header.divided {\n    border-bottom: var(--border-width-base, 1px) solid var(--background-700);\n    padding-bottom: var(--padding);\n  }\n\n  .footer.divided {\n    border-top: var(--border-width-base, 1px) solid var(--background-700);\n    padding-top: var(--padding);\n  }\n\n  .body {\n    @apply flex w-full min-w-0 flex-none flex-col;\n  }\n}\n",
  "panel": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .panel {\n    @apply flex h-full w-full min-h-0 min-w-0;\n    container-type: inline-size;\n    background: inherit;\n  }\n\n  .panel[data-orientation=\"vertical\"] {\n    flex-direction: column;\n  }\n\n  .panel > :not(.resize) {\n    min-width: 0;\n    min-height: 0;\n    flex: 1 1 0%;\n  }\n\n  .panel > .sidebar {\n    @apply min-h-0 shrink-0 overflow-hidden;\n    flex: 0 0 var(--size);\n  }\n\n  .sidebar[data-open=\"true\"] {\n    transition: flex-basis 0.2s ease;\n  }\n\n  .sidebar[data-open=\"false\"] {\n    flex-basis: var(--collapsed-size);\n    visibility: hidden;\n  }\n\n  .panel[data-stacked=\"true\"] > .sidebar {\n    width: 100%;\n    max-width: 100%;\n    flex-basis: auto;\n  }\n\n  .panel[data-stacked=\"true\"] > .sidebar[data-open=\"false\"] {\n    height: 0;\n    min-height: 0;\n    flex-basis: 0;\n  }\n\n  .resize {\n    @apply relative shrink-0;\n    width: 10px;\n    cursor: col-resize;\n    touch-action: none;\n    user-select: none;\n    background: transparent;\n  }\n\n  .resize::before {\n    content: \"\";\n    position: absolute;\n    inset-block: 0;\n    left: 50%;\n    width: 1px;\n    background: var(--divider-color, #374151);\n    transform: translateX(-50%);\n    transition: width var(--hover-leave-duration, 300ms) var(--ease-snappy-pop, ease-out);\n  }\n\n  .resize[data-orientation=\"vertical\"] {\n    width: auto;\n    height: 10px;\n    cursor: row-resize;\n  }\n\n  .resize[data-orientation=\"vertical\"]::before {\n    inset-block: auto;\n    inset-inline: 0;\n    top: 50%;\n    width: auto;\n    height: 1px;\n    transform: translateY(-50%);\n    transition: height var(--hover-leave-duration, 300ms) var(--ease-snappy-pop, ease-out);\n  }\n\n  .resize:hover::before,\n  .resize:focus-visible::before,\n  .resize[data-resizing=\"true\"]::before {\n    width: 2px;\n  }\n\n  .resize[data-orientation=\"vertical\"]:hover::before,\n  .resize[data-orientation=\"vertical\"]:focus-visible::before,\n  .resize[data-orientation=\"vertical\"][data-resizing=\"true\"]::before {\n    width: auto;\n    height: 2px;\n  }\n\n  .spacingNone,\n  .spacing-none {\n    gap: 0;\n  }\n\n  .spacingSm,\n  .spacing-sm {\n    gap: var(--spacing-sm, 0.5rem);\n  }\n\n  .spacingMd,\n  .spacing-md {\n    gap: var(--spacing-md, 1rem);\n  }\n\n  .spacingLg,\n  .spacing-lg {\n    gap: var(--spacing-lg, 1.5rem);\n  }\n\n  .compact {\n    gap: calc(var(--spacing-sm, 0.5rem) / 2);\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .sidebar[data-open=\"true\"] {\n      transition: none;\n    }\n  }\n}\n",
  "path": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .path {\n    @apply block;\n  }\n\n  .list {\n    @apply m-0 flex flex-wrap items-center gap-2 p-0;\n    list-style: none;\n  }\n\n  .separator {\n    @apply m-0 flex items-center p-0;\n    list-style: none;\n    color: var(--foreground);\n    pointer-events: none;\n    user-select: none;\n  }\n\n  .link {\n    @apply relative cursor-pointer px-2 py-1;\n    border: 0;\n    /* Small radius on each entry so the focus ring matches rounded breadcrumbs. */\n    border-radius: var(--radius-sm, 0.375rem);\n    background-color: var(--background);\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    text-decoration: none;\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    outline: none;\n  }\n\n  button.link {\n    font: inherit;\n  }\n\n  .link:focus,\n  .link:focus-visible {\n    outline: none;\n  }\n\n  .link[data-hovered=\"true\"]:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .link[data-selected=\"true\"] {\n    cursor: default;\n  }\n\n  .link[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--disabled-opacity);\n  }\n}\n",
  "popover": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .trigger {\n    @apply inline-block;\n  }\n\n  .root {\n    @apply fixed;\n    pointer-events: none;\n    z-index: 50;\n  }\n\n  .content {\n    --fill: var(--background);\n    --stroke-color: var(--background-border);\n    --frame-radius: 8px;\n    opacity: 0;\n    transform: scale(0.95);\n    transition:\n      opacity 0.2s ease-out,\n      transform 0.2s ease-out;\n    pointer-events: none;\n    min-width: 200px;\n    max-width: calc(100vw - 16px);\n  }\n\n  .content[data-visible=\"true\"] {\n    opacity: 1;\n    transform: scale(1);\n    pointer-events: auto;\n  }\n\n  .content[data-instant] {\n    transition: none;\n  }\n\n  .frame {\n    @apply flex items-center gap-1.5 p-2.5;\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n  }\n}\n",
  "progress": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .progress {\n    @apply w-full;\n  }\n\n  .progress[data-has-label=\"true\"] {\n    @apply space-y-1;\n  }\n\n  .progress[data-show-controls=\"true\"] {\n    touch-action: none;\n    user-select: none;\n    cursor: pointer;\n  }\n\n  .progress[data-disabled=\"true\"] {\n    opacity: var(--disabled-opacity, 0.6);\n    cursor: not-allowed;\n    pointer-events: none;\n  }\n\n  .label-row {\n    @apply flex items-center justify-between;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n  }\n\n  .label {\n    user-select: none;\n  }\n\n  .value {\n    font-variant-numeric: tabular-nums;\n  }\n\n  .track {\n    --thickness: var(--size, calc(var(--spacing-md) * 0.8));\n    position: relative;\n    width: 100%;\n    height: var(--thickness);\n    border-radius: var(--radius, var(--radius-sm, 0.375rem));\n    border: var(--border-width-base) solid var(--border-color);\n    background-color: var(--background);\n    overflow: visible;\n  }\n\n  .range {\n    position: absolute;\n    top: 0;\n    height: 100%;\n    border-radius: var(--radius, var(--radius-sm, 0.375rem));\n    background-color: var(--background);\n    transition: none;\n    overflow: hidden;\n  }\n\n  .range[data-animated=\"true\"] {\n    animation: pulse 2s var(--ease-gentle-ease, ease-in-out) infinite;\n  }\n\n  .range[data-indeterminate=\"true\"] {\n    width: 33.333%;\n    animation: progress-indeterminate 1.5s var(--ease-gentle-ease, ease-in-out) infinite;\n  }\n\n  .thumb {\n    --thumb-inline-size: var(\n      --thumb-width,\n      var(--thumb-size, var(--progress-thumb-size, var(--width, auto)))\n    );\n    --thumb-block-size: var(\n      --thumb-height,\n      var(--thumb-size, var(--progress-thumb-size, var(--height, 100%)))\n    );\n\n    position: absolute;\n    top: var(--top, 0);\n    box-sizing: border-box;\n    width: var(--thumb-inline-size);\n    height: var(--thumb-block-size);\n    aspect-ratio: var(--thumb-ratio, var(--ratio, 0.666667));\n    transform: var(--transform, translateX(-50%));\n    border-radius: var(--radius, var(--radius-sm, 0.375rem));\n    background: var(--background);\n    border: none;\n    opacity: 0;\n    pointer-events: none;\n    transition: none;\n  }\n\n  .progress[data-show-controls=\"true\"]:hover .thumb,\n  .progress[data-show-controls=\"true\"][data-dragging=\"true\"] .thumb {\n    opacity: 1;\n    pointer-events: auto;\n  }\n\n  @keyframes pulse {\n    0%,\n    100% {\n      opacity: 1;\n    }\n    50% {\n      opacity: 0.5;\n    }\n  }\n\n  @keyframes progress-indeterminate {\n    0% {\n      transform: translateX(-100%);\n    }\n    100% {\n      transform: translateX(400%);\n    }\n  }\n}\n",
  "radio": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .radio-items {\n    @apply flex flex-col gap-3;\n  }\n\n  .radio-item {\n    @apply flex items-start gap-3 cursor-pointer select-none;\n    position: relative;\n    overflow: visible;\n  }\n\n  .radio-surface {\n    @apply inline-flex shrink-0;\n    border-radius: 9999px;\n  }\n\n  .radio-input {\n    @apply absolute inset-0 h-full w-full cursor-pointer opacity-0;\n  }\n\n  .radio {\n    --disabled-opacity: 0.6;\n    @apply relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center;\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: 9999px;\n    background-color: var(--background);\n    color: var(--foreground);\n    transition-property: transform;\n    transition-duration: var(--press-duration, 120ms);\n    transition-timing-function: var(--press-ease, cubic-bezier(0.34, 1.56, 0.64, 1));\n\n    &[data-focus-visible=\"true\"] {\n      outline: none;\n    }\n\n    &[data-pressed=\"true\"]:not([data-disabled=\"true\"]) {\n      transform: var(--press-transform, scale(0.96));\n    }\n  }\n\n  .dot {\n    border-radius: 9999px;\n    background-color: var(--background);\n    transform: scale(0);\n  }\n\n  .radio[data-selected=\"true\"] .dot {\n    transform: scale(1);\n  }\n\n  @media (hover: hover) {\n    .radio-item:not([data-disabled=\"true\"]):hover .radio {\n      opacity: 0.9;\n    }\n  }\n\n  .radio-item[data-disabled=\"true\"] .radio {\n    opacity: var(--disabled-opacity);\n    cursor: not-allowed;\n  }\n\n  .radio-label {\n    @apply cursor-pointer;\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    user-select: none;\n\n    &[data-disabled=\"true\"] {\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n    }\n  }\n\n  .radio-description {\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    margin-top: 0.125rem;\n  }\n\n  .helper-text {\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    margin-top: 0.5rem;\n    margin-left: 2rem;\n  }\n\n  .radio.sm {\n    @apply h-4 w-4;\n  }\n\n  .radio.sm .dot {\n    width: 0.375rem;\n    height: 0.375rem;\n  }\n\n  .radio.md {\n    @apply h-5 w-5;\n  }\n\n  .radio.md .dot {\n    width: 0.5rem;\n    height: 0.5rem;\n  }\n\n  .radio.lg {\n    @apply h-6 w-6;\n  }\n\n  .radio.lg .dot {\n    width: 0.625rem;\n    height: 0.625rem;\n  }\n}\n",
  "scroll": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    @apply relative;\n    min-height: 0;\n    isolation: isolate;\n  }\n\n  .vertical {\n    --scrollbar-width: 12px;\n  }\n\n  .horizontal {\n    --scrollbar-height: 12px;\n  }\n\n  .content {\n    @apply h-full w-full;\n    overflow: auto;\n  }\n\n  .vertical .content {\n    overflow-y: auto;\n    overflow-x: hidden;\n    scrollbar-width: none;\n    -webkit-overflow-scrolling: touch;\n  }\n\n  .vertical[data-inline=\"true\"] .content {\n    padding-inline-end: 16px;\n  }\n\n  .horizontal .content {\n    overflow-x: auto;\n    overflow-y: hidden;\n    scrollbar-width: none;\n    -webkit-overflow-scrolling: touch;\n  }\n\n  .horizontal[data-inline=\"true\"] .content {\n    padding-block-end: 16px;\n  }\n\n  .vertical .content::-webkit-scrollbar,\n  .horizontal .content::-webkit-scrollbar {\n    display: none;\n  }\n\n  .track {\n    @apply absolute;\n    z-index: 10;\n    background-color: var(--background);\n  }\n\n  .track[data-hide=\"true\"] .thumb {\n    transition-property: opacity;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .vertical .track {\n    right: 4px;\n    top: 0;\n    width: 12px;\n    height: 100%;\n    box-sizing: border-box;\n  }\n\n  .horizontal .track {\n    bottom: 2px;\n    left: 0;\n    height: 12px;\n    width: 100%;\n  }\n\n  .thumb {\n    position: absolute;\n    border-radius: calc(var(--radius-xs, 0.25rem) * 0.8);\n    background-color: var(--background);\n    transition-property: opacity, background-color, width, height;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .thumb:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .vertical .thumb {\n    width: 6px;\n    margin-left: 6px;\n    transition-property: opacity, background-color, width, margin-left;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .vertical .thumb:hover,\n  .vertical[data-pressed] .thumb {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    width: 8px;\n    margin-left: 4px;\n  }\n\n  .horizontal .thumb {\n    height: 6px;\n    margin-top: 6px;\n    transition-property: opacity, background-color, height, margin-top;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .horizontal .thumb:hover,\n  .horizontal[data-pressed] .thumb {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    height: 8px;\n    margin-top: 4px;\n  }\n}\n",
  "select": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .scope {\n    @apply flex w-full;\n    position: relative;\n    overflow: visible;\n  }\n\n  .select {\n    --disabled-opacity: 0.5;\n    --trigger-padding-inline: calc(var(--spacing) * 2);\n    --trigger-padding-block: calc(var(--spacing) * 1.5);\n    --background-radius: var(--radius-sm, 0.375rem);\n    --background-inner-radius: calc(var(--background-radius) - var(--border-width-base, 1px));\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    height: fit-content;\n    align-self: center;\n\n    @apply p-0 gap-0 w-fit min-w-0 flex-none flex-row items-center;\n    position: relative;\n    overflow: visible;\n\n    background-color: var(--background);\n    color: var(--foreground);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--background-radius);\n\n    @apply select-none cursor-pointer;\n\n    &[data-disabled] {\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n    }\n\n    &[data-pressed=\"true\"]:not([data-disabled]) {\n      background-color: var(--background);\n    }\n\n    &[data-open=\"true\"] {\n      background-color: var(--background);\n    }\n\n    &:global(.group) {\n      height: 100%;\n      align-self: stretch;\n    }\n  }\n\n  .trigger {\n    @apply flex items-stretch flex-1 gap-0 w-full min-w-0 h-full min-h-0;\n\n    background: transparent;\n\n    @apply border-none cursor-pointer select-none;\n\n    @media (hover: hover) {\n      &:not([data-disabled]):hover .icon-section,\n      &:not([data-disabled]):hover .value-section:not(:empty) {\n        --hover-duration: var(--hover-enter-duration, 0ms);\n        --background: var(--trigger-background-hover, transparent);\n        background-color: var(--background);\n      }\n    }\n\n    &[data-focus-visible=\"true\"] {\n      @apply outline-none;\n    }\n  }\n\n  .trigger-compact {\n    @apply flex-none w-auto;\n  }\n\n  /* A Value placed beside the Trigger is the label segment of one Select,\n     not another interactive control. Give that segment the same visual\n     treatment as a normal trigger value while keeping one focus target. */\n  .select.select-split > .value[data-external=\"true\"] {\n    align-items: center;\n    padding: var(--trigger-padding-block) var(--trigger-padding-inline);\n    border-radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n    background-color: var(--background, transparent);\n    transition-property: background-color;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration));\n    transition-timing-function: var(--hover-transition-timing-function);\n\n    @media (hover: hover) {\n      &:not([data-disabled]):hover {\n        --hover-duration: var(--hover-enter-duration, 0ms);\n        --background: var(--trigger-background-hover, transparent);\n        background-color: var(--background);\n      }\n    }\n  }\n\n  .select button.trigger {\n    @apply p-0;\n  }\n\n  .value-section {\n    @apply flex items-center flex-1 min-w-0 gap-0.5;\n\n    background-color: var(--background, transparent);\n    transition-property: background-color;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration));\n    transition-timing-function: var(--hover-transition-timing-function);\n    padding: var(--trigger-padding-block) var(--trigger-padding-inline);\n    border-radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    &:only-child {\n      border-radius: var(--background-inner-radius);\n      justify-content: center;\n    }\n    &:empty {\n      flex: 0;\n      padding: 0;\n      min-width: auto;\n    }\n  }\n\n  .icon-section {\n    @apply flex items-center justify-center shrink-0;\n    background-color: var(--background, transparent);\n    transition-property: background-color;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration));\n    transition-timing-function: var(--hover-transition-timing-function);\n    padding: var(--trigger-padding-block) var(--trigger-padding-inline);\n    border-radius: 0 var(--background-inner-radius) var(--background-inner-radius) 0;\n  }\n\n  .icon {\n    @apply flex items-center justify-center w-4 h-4 opacity-70;\n  }\n\n  .text {\n    @apply block flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .value {\n    @apply flex items-center flex-1 min-w-0 gap-2 bg-transparent border-none;\n    cursor: inherit;\n  }\n\n  .value-icon {\n    @apply flex items-center justify-center shrink-0 w-4 h-4;\n    align-self: center;\n    color: var(--icon-foreground, currentColor);\n\n    > svg {\n      display: block;\n    }\n  }\n\n  .value-text {\n    @apply min-w-0 overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .content,\n  .sub-content {\n    --content-padding: calc(var(--spacing) * 2);\n    --content-radius: var(--radius-sm, 0.375rem);\n    --content-inner-radius: calc(var(--content-radius) - var(--border-width-base, 1px));\n    --disabled-opacity: 0.5;\n    @apply overflow-hidden;\n    background-color: var(--background);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--content-radius);\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);\n  }\n\n  .content-root:global(.select),\n  .sub-content-root:global(.select) {\n    display: block;\n    position: absolute;\n  }\n\n  .list {\n    @apply space-y-1;\n  }\n\n  .item,\n  .sub-trigger {\n    @apply flex items-center gap-2 outline-none cursor-default select-none;\n    padding: calc(var(--content-padding) / 1.5) var(--content-padding);\n    border-radius: var(--content-inner-radius);\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n    background-color: var(--background);\n    &[data-disabled] {\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n      pointer-events: none;\n      color: var(--foreground-400);\n    }\n  }\n\n  .item {\n    &[data-selected=\"true\"] {\n      color: var(--foreground);\n    }\n  }\n\n  .item-content {\n    @apply flex flex-col flex-1 min-w-0;\n  }\n\n  .item-text {\n    @apply min-w-0 overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .item-description {\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-body-size, var(--text-base, 0.9375rem)));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    color: var(--foreground-muted);\n    @apply min-w-0 whitespace-normal break-words;\n  }\n\n  .item-icon,\n  .item-indicator {\n    @apply flex items-center justify-center shrink-0 w-4 h-4;\n  }\n\n  .item-icon {\n    color: var(--icon-foreground);\n  }\n  .item-indicator {\n    color: var(--indicator-foreground);\n    margin-left: auto;\n  }\n\n  .item-with-description {\n    @apply items-start py-2;\n  }\n  .item-icon-with-description,\n  .item-indicator-with-description {\n    @apply mt-0.5;\n  }\n\n  .separator {\n    @apply my-1;\n    margin-left: calc(var(--content-padding) / -2);\n    margin-right: calc(var(--content-padding) / -2);\n    height: 1px;\n    background-color: var(--background-border);\n  }\n\n  .placeholder {\n    color: var(--foreground-muted);\n  }\n\n  .icon-prefix {\n    @apply inline-flex items-center shrink-0;\n  }\n\n  .select[data-mode=\"multiple\"] .item {\n    gap: 0.5rem;\n  }\n\n  .search-trigger {\n    @apply flex items-stretch relative bg-transparent cursor-text overflow-hidden;\n    border-radius: var(--background-inner-radius);\n    &:focus-within {\n      @apply outline-none;\n      z-index: 1;\n    }\n  }\n\n  .search-trigger :global(.focus-indicator) {\n    display: none;\n  }\n\n  .search-value-section {\n    @apply p-0;\n    border-radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n  }\n\n  .input {\n    padding-right: calc(var(--trigger-padding-inline) * 2 + 1rem);\n    @apply border-none rounded-none shadow-none bg-transparent;\n\n    &[data-focused],\n    &[data-focus-visible] {\n      @apply border-none shadow-none;\n    }\n  }\n\n  .search-content-input {\n    @apply border-none rounded-none bg-transparent;\n  }\n\n  .search-icon-section {\n    @apply absolute right-0 top-0 bottom-0 flex items-center justify-center bg-transparent pointer-events-none;\n    padding-inline: var(--trigger-padding-inline);\n  }\n\n  .search-wrapper {\n    @apply overflow-hidden;\n    border-bottom: var(--border-width-base, 1px) solid var(--background-border);\n  }\n\n  .empty-state {\n    @apply px-3 py-2;\n    color: var(--foreground-muted);\n  }\n\n  .content[data-placement=\"top\"] .search-wrapper {\n    border-radius: 0;\n    border-bottom: none;\n    border-top: var(--border-width-base, 1px) solid var(--background-border);\n  }\n\n  .sub-trigger {\n    &[data-open=\"true\"]:not([data-highlighted=\"true\"]) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n  }\n\n  .sub-trigger-chevron {\n    @apply shrink-0 w-4 h-4;\n    margin-left: auto;\n    color: var(--foreground-400);\n  }\n\n  .sub-content {\n    @apply min-w-40 max-w-80;\n  }\n}\n",
  "skeleton": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .shape {\n    display: block;\n    background: var(--skeleton-color, var(--background, var(--background-950)));\n    border-radius: var(--radius, var(--radius-sm, 0.375rem));\n  }\n\n  .rectangle {\n    width: var(--width, 10rem);\n    height: var(--height, 0.75rem);\n  }\n\n  .text {\n    display: flex;\n    width: 100%;\n    flex-direction: column;\n    gap: calc(var(--gap, 0.375rem) * var(--scale, 1));\n    align-content: start;\n  }\n\n  .text[data-size=\"body\"] {\n    --row-height: 0.75rem;\n    --gap: 0.375rem;\n  }\n\n  .text[data-size=\"heading\"] {\n    --row-height: 1.25rem;\n    --gap: 0.5rem;\n  }\n\n  .text[data-size=\"display\"] {\n    --row-height: 2rem;\n    --gap: 0.625rem;\n  }\n\n  .row {\n    width: 100%;\n    height: calc(var(--row-height, 0.75rem) * var(--scale, 1));\n    flex: none;\n  }\n\n  .lastRow {\n    width: var(--last-line-width, 70%);\n  }\n\n  .image {\n    width: var(--width, 100%);\n    height: auto;\n    aspect-ratio: var(--ratio, 16 / 9);\n  }\n\n  :global(.skeleton) {\n    animation: none;\n  }\n\n  :global([data-skeleton-animate]) :global(.skeleton) {\n    animation: var(--animation, none);\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    :global([data-skeleton-animate]) :global(.skeleton) {\n      animation: none !important;\n    }\n  }\n}\n",
  "slider": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .slider {\n    --disabled-opacity: 0.6;\n    @apply relative flex w-full items-center;\n    min-inline-size: var(--inline-size, 3.5rem);\n    min-height: var(--hit-size, var(--slider-hit-size, 1.5rem));\n    touch-action: none;\n    user-select: none;\n  }\n\n  .track {\n    --thickness: var(--size, var(--slider-track-size, calc(var(--spacing-md) * 0.8)));\n    --length: calc(var(--thickness) * var(--ratio, 0.5));\n    @apply relative flex grow items-center;\n    flex-grow: 1;\n    height: var(--thickness);\n    overflow: visible;\n    border-radius: var(--radius, var(--slider-track-radius, calc(var(--spacing-sm) * 0.35)));\n    border: var(--border-width-base) solid var(--border-color);\n    background: var(--track-background, var(--slider-track-background, var(--background)));\n  }\n\n  .range {\n    @apply absolute;\n    display: var(--range-display, var(--slider-range-display, block));\n    border-radius: inherit;\n    pointer-events: none;\n    background: var(--range-background, var(--slider-range-background, var(--background)));\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .thumb {\n    --thumb-inline-size: var(\n      --thumb-width,\n      var(--thumb-size, var(--slider-thumb-size, var(--width, var(--length))))\n    );\n    --thumb-block-size: var(\n      --thumb-height,\n      var(--thumb-size, var(--slider-thumb-size, var(--height, 100%)))\n    );\n\n    @apply absolute block;\n    top: var(--top, 0);\n    box-sizing: border-box;\n    width: var(--thumb-inline-size);\n    height: var(--thumb-block-size);\n    transform: var(--transform, translateX(-50%));\n    border-radius: var(--thumb-radius, var(--radius, calc(var(--spacing-xs) * 0.25)));\n    outline: none;\n    background: var(--thumb-background, var(--slider-thumb-background, var(--background)));\n    border: var(--thumb-border, var(--slider-thumb-border, none));\n    box-shadow: var(--thumb-shadow, var(--slider-thumb-shadow, none));\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      box-shadow var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .slider[data-orientation=\"horizontal\"] .range {\n    top: 0;\n    height: 100%;\n  }\n\n  .slider[data-orientation=\"horizontal\"] .thumb {\n    left: clamp(var(--thumb-inset, 0px), var(--position, 0%), calc(100% - var(--thumb-inset, 0px)));\n  }\n\n  .slider[data-orientation=\"vertical\"] {\n    justify-content: center;\n    min-inline-size: auto;\n    width: fit-content;\n  }\n\n  .slider[data-orientation=\"vertical\"] .track {\n    width: var(--thickness);\n    height: 100%;\n  }\n\n  .slider[data-orientation=\"vertical\"] .range {\n    left: 0;\n    width: 100%;\n  }\n\n  .slider[data-orientation=\"vertical\"] .thumb {\n    left: 50%;\n    top: auto;\n    bottom: clamp(\n      var(--thumb-inset, 0px),\n      var(--position, 0%),\n      calc(100% - var(--thumb-inset, 0px))\n    );\n    width: var(--thumb-block-size);\n    height: var(--thumb-inline-size);\n    transform: translate(-50%, 50%);\n  }\n\n  .slider[data-disabled=\"true\"] {\n    opacity: var(--disabled-opacity);\n    cursor: not-allowed;\n  }\n\n  .slider[data-disabled=\"true\"] .range {\n    background: var(\n      --disabled-background,\n      var(--range-background, var(--slider-range-background, var(--background)))\n    );\n  }\n\n  .thumb[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    background: var(\n      --disabled-background,\n      var(--thumb-background, var(--slider-thumb-background, var(--background)))\n    );\n  }\n\n  .thumb[data-pressed=\"true\"] {\n    transform: var(--transform, translateX(-50%));\n  }\n\n  .slider[data-orientation=\"vertical\"] .thumb[data-pressed=\"true\"] {\n    transform: translate(-50%, 50%);\n  }\n}\n",
  "switch": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .switch {\n    --radius: 9999px;\n    --inner-radius: calc(var(--radius) - var(--border-width-base, 1px));\n\n    --width: 2.4rem;\n    --height: 1.35rem;\n    --thumb-size: 1.05rem;\n    --thumb-offset: 0.15rem;\n\n    --disabled-opacity: 0.6;\n\n    @apply relative inline-flex shrink-0 cursor-pointer items-center;\n    user-select: none;\n    border-radius: var(--radius);\n    width: var(--width);\n    height: var(--height);\n  }\n\n  .switch-track {\n    @apply absolute inset-0;\n    transition:\n      background-color var(--transition-duration) var(--transition-easing),\n      border-color var(--transition-duration) var(--transition-easing),\n      transform var(--transition-duration) var(--transition-easing);\n    background-color: var(--background);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius);\n  }\n\n  .switch:active:not([data-disabled]) .switch-track {\n    transform: scale(0.98);\n  }\n\n  .input {\n    @apply absolute inset-0 h-full w-full cursor-pointer opacity-0;\n  }\n\n  .switch-thumb {\n    @apply absolute top-0 bottom-0 my-auto;\n    left: var(--thumb-offset);\n    width: var(--thumb-size);\n    height: var(--thumb-size);\n    transition:\n      left var(--transition-duration) var(--transition-easing),\n      background-color var(--transition-duration) var(--transition-easing);\n    background-color: var(--foreground);\n    border-radius: var(--inner-radius);\n    z-index: 1;\n    pointer-events: none;\n  }\n\n  .switch[data-selected] .switch-thumb {\n    left: calc(var(--width) - var(--thumb-size) - var(--thumb-offset));\n  }\n\n  .switch[data-disabled] {\n    opacity: var(--disabled-opacity);\n    cursor: not-allowed;\n  }\n\n  .switch-sm {\n    --width: 2rem;\n    --height: 1.125rem;\n    --thumb-size: 0.875rem;\n    --thumb-offset: 0.125rem;\n  }\n}\n",
  "table": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    @apply w-full min-w-0 max-w-full;\n    /* Keep the public `.table` theme hook from matching Tailwind's display utility. */\n    display: block !important;\n  }\n\n  /*\n   * `clip` keeps the rounded corners without making the container a scroll\n   * container, so a sticky header resolves against whatever ancestor really\n   * scrolls. Only the measured overflow case swaps in a scroll port, since a\n   * box that scrolls horizontally scrolls on both axes and would capture the\n   * header itself.\n   */\n  .container {\n    @apply w-full min-w-0 max-w-full rounded-sm;\n    overflow: clip;\n    /* Keep the public `.container` theme hook from applying Tailwind's breakpoint max-widths. */\n    max-width: 100% !important;\n    border: var(--border-width-base) solid var(--border, var(--background-border));\n    background-color: var(--container-background, var(--background));\n  }\n\n  /* The Scroll port inside handles the overflow in this mode. */\n  .container[data-scroll=\"horizontal\"] {\n    overflow: visible;\n  }\n\n  /* Rows scroll on their own, so the container just hands down its height. */\n  .container[data-scroll=\"rows\"] {\n    display: flex;\n    height: 100%;\n    min-height: 0;\n  }\n\n  .scroller {\n    @apply block w-full min-w-0 max-w-full;\n    border-radius: inherit;\n    overscroll-behavior-inline: contain;\n  }\n\n  .scroller :global(.mask) {\n    border-radius: inherit;\n  }\n\n  .scrollerTrack {\n    background-color: var(--background, transparent);\n  }\n\n  .scrollerThumb {\n    background-color: var(--background-500, var(--foreground));\n  }\n\n  .table {\n    @apply w-full;\n    display: table;\n    border-collapse: collapse;\n    min-width: max-content;\n    background-color: var(--background, transparent);\n    color: var(--foreground);\n    font-family: var(--font-mono, ui-monospace, monospace);\n    font-size: var(--text-code-size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-code, var(--font-weight-body-normal, 400));\n    letter-spacing: var(--letter-spacing-code, 0);\n    line-height: var(--leading-code, 1.5);\n  }\n\n  .header {\n    display: table-header-group;\n    background-color: var(--background);\n  }\n\n  .body {\n    display: table-row-group;\n    background-color: var(--background);\n  }\n\n  .headerRow {\n    display: table-row;\n    background-color: var(--background);\n  }\n\n  .table .headerCell {\n    @apply px-3 py-2.5 text-left;\n    display: table-cell;\n    background-color: var(--background);\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    white-space: nowrap;\n    border: 0;\n    border-bottom: var(--border-width-base) solid var(--border, var(--background-border));\n  }\n\n  /*\n   * `rows` layout: the header is a plain box above the scroll port instead of a\n   * sticky cell inside it, so it keeps ordinary borders, never shifts by a\n   * hairline, and the scrollbar runs beside the rows only. Header and body are\n   * separate boxes now, so every row lines up on one shared grid template.\n   */\n  .table.rowsLayout {\n    /* Grid, not flex: the row track hands the scroll port a definite height. */\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr);\n    height: 100%;\n    min-width: 0;\n    min-height: 0;\n  }\n\n  .table.rowsLayout .header {\n    display: block;\n  }\n\n  .bodyScroller {\n    @apply block w-full min-w-0;\n    min-height: 0;\n    overscroll-behavior-block: contain;\n  }\n\n  .table.rowsLayout .body {\n    display: block;\n  }\n\n  .table.rowsLayout .headerRow,\n  .table.rowsLayout .row,\n  .table.rowsLayout .emptyRow {\n    display: grid;\n    grid-template-columns: var(--table-columns, 1fr);\n    align-items: stretch;\n  }\n\n  /*\n   * Grid, not flex: a lone child still stretches to the cell's width, so\n   * `justify-end`, `w-full` children and truncation all behave like they did\n   * in a table cell, while `align-items` keeps the vertical centring.\n   */\n  .table.rowsLayout .headerCell,\n  .table.rowsLayout .cell {\n    display: grid;\n    align-items: center;\n    align-content: center;\n    min-width: 0;\n  }\n\n  .table.rowsLayout .emptyState {\n    display: block;\n    grid-column: 1 / -1;\n  }\n\n  .row {\n    display: table-row;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .row[data-interactive=\"true\"] {\n    @apply cursor-pointer;\n  }\n\n  .row:hover:not([data-disabled=\"true\"]) .cell {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .row[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--disabled-opacity, 0.5);\n  }\n\n  .row[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-ring);\n    outline-offset: -2px;\n  }\n\n  .interactive {\n    @apply cursor-pointer;\n  }\n\n  .table .cell {\n    @apply px-3 py-2.5 align-middle;\n    display: table-cell;\n    background-color: var(--background, transparent);\n    color: var(--foreground);\n    border: 0;\n    border-bottom: var(--border-width-base) solid var(--border, var(--background-border));\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .row:last-child .cell {\n    border-bottom: none;\n  }\n\n  .emptyRow {\n    border-bottom: none;\n  }\n\n  .emptyRow {\n    display: table-row;\n  }\n\n  .emptyState {\n    @apply px-4 py-8 text-center;\n    background-color: var(--background);\n    color: var(--foreground);\n  }\n\n  .emptyState {\n    display: table-cell;\n  }\n\n  .filterBar {\n    @apply mb-4 rounded-xs border p-4;\n    border: var(--border-width-base) solid var(--background-border);\n    background-color: var(--background);\n  }\n\n  .filterBar {\n    display: block;\n  }\n\n  .filterGrid {\n    @apply grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3;\n    background-color: var(--background);\n  }\n\n  .filterGrid {\n    display: grid;\n  }\n\n  .filterField {\n    @apply min-w-0;\n  }\n\n  .filterLabel {\n    @apply mb-2 block;\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .filterLabel {\n    display: block;\n  }\n\n  .filterInput {\n    @apply w-full;\n  }\n}\n",
  "tabs": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .tabs {\n    @apply flex w-full flex-col;\n\n    &[data-orientation=\"vertical\"] {\n      flex-direction: row;\n    }\n  }\n\n  .list {\n    @apply relative grid w-full items-center gap-3 py-1;\n    grid-auto-flow: column;\n    grid-auto-columns: max-content;\n    justify-content: start;\n    border-radius: var(--radius-sm, 0.375rem);\n\n    &[data-orientation=\"vertical\"] {\n      grid-auto-flow: row;\n      grid-auto-columns: auto;\n      grid-auto-rows: max-content;\n      width: fit-content;\n      min-width: 0;\n      height: auto;\n      align-self: flex-start;\n    }\n\n    &:global(.underline) {\n      text-decoration: none !important;\n    }\n\n    &[data-variant=\"underline\"] {\n      background-color: transparent;\n      border-radius: 0;\n      padding: 0 0 4px;\n    }\n\n    &[data-variant=\"underline\"][data-orientation=\"vertical\"] {\n      border-bottom: none;\n      border-left: var(--border-width-base) solid var(--border);\n      align-items: stretch;\n      padding: 0 0 0 4px;\n    }\n  }\n\n  .indicator {\n    @apply absolute;\n    background-color: var(--background);\n    box-sizing: border-box;\n    border-radius: var(--radius-sm);\n    z-index: 0;\n    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n    pointer-events: none;\n  }\n\n  .indicator-fallback {\n    z-index: 0;\n  }\n\n  .indicator-fallback-frame {\n    display: none;\n    position: absolute;\n    inset: 0;\n    min-width: 0;\n    min-height: 0;\n    pointer-events: none;\n    z-index: 0;\n  }\n\n  .trigger[data-selected=\"true\"] + .indicator-fallback-frame {\n    display: block;\n  }\n\n  .indicator-underline {\n    border-radius: 0;\n  }\n\n  .trigger {\n    @apply relative z-[1] flex shrink-0 items-center justify-center gap-2 px-2 py-1.5 cursor-pointer select-none;\n    height: auto;\n    background-color: var(--background);\n    border: none;\n    border-radius: var(--radius-sm);\n    color: var(--foreground);\n    outline: none;\n    box-shadow: none;\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-hovered=\"true\"]:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n\n    &[data-selected=\"true\"] {\n      cursor: pointer;\n\n      .list:not([data-variant=\"underline\"]) & {\n        background-color: transparent;\n        transition-property: color;\n      }\n    }\n\n    &[data-selected=\"true\"]:not([data-indicator-ready=\"true\"]):not(\n        [data-indicator-fallback=\"true\"]\n      ) {\n      .list.underline & {\n        border-bottom-color: var(--underline-border);\n      }\n\n      .list.underline[data-orientation=\"vertical\"] & {\n        border-bottom-color: transparent;\n        border-left-color: var(--underline-border);\n      }\n    }\n\n    &:focus {\n      outline: none !important;\n      box-shadow: none !important;\n    }\n\n    &[data-focus-visible=\"true\"] {\n      box-shadow: inset 0 0 0 var(--ring-width, 2px) var(--focus-visible) !important;\n    }\n\n    &[data-disabled=\"true\"] {\n      --disabled-opacity: 0.5;\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n      pointer-events: none;\n    }\n\n    .list.underline & {\n      background-color: var(--background);\n      background-clip: padding-box;\n      border-radius: var(--radius-sm, 0.375rem);\n      border-bottom: 2px solid transparent;\n    }\n\n    .list.underline &:focus,\n    .list.underline &:focus-visible {\n      outline: none !important;\n      box-shadow: none !important;\n    }\n\n    .list.underline &[data-focus-visible=\"true\"] {\n      box-shadow: inset 0 0 0 var(--ring-width, 2px) var(--focus-visible) !important;\n    }\n\n    .list.underline[data-orientation=\"vertical\"] & {\n      border-bottom: none;\n      border-left: 2px solid transparent;\n    }\n\n    .list.underline[data-orientation=\"vertical\"]\n      &[data-selected=\"true\"]:not([data-indicator-ready=\"true\"]):not(\n        [data-indicator-fallback=\"true\"]\n      ) {\n      border-left-color: var(--underline-border);\n      border-bottom: none;\n    }\n  }\n\n  .icon {\n    @apply flex h-4 w-4 shrink-0 items-center justify-center;\n  }\n\n  .content {\n    @apply w-full p-0 outline-none;\n    flex: 1;\n    padding-top: 1rem;\n\n    &[data-orientation=\"vertical\"] {\n      flex: 1;\n      width: 100%;\n    }\n\n    &:focus-visible {\n      outline: 2px solid var(--focus-visible);\n      outline-offset: 2px;\n    }\n  }\n\n  @media (max-width: 640px) {\n    .list {\n      padding: 0.125rem;\n\n      &[data-variant=\"underline\"] {\n        padding: 0 0 4px;\n      }\n    }\n\n    .trigger {\n      @apply px-1 py-1;\n      .list.underline & {\n        margin: 0.5rem 0.75rem;\n      }\n    }\n  }\n}\n",
  "textarea": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .textarea {\n    --padding-inline: 0.75rem;\n    --padding-block: 0.5rem;\n\n    @apply block w-full px-3 py-2;\n    box-sizing: border-box;\n    resize: none;\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius-sm, 0.375rem);\n    background-color: var(--background);\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    outline: none;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &::placeholder {\n      color: var(--placeholder);\n    }\n\n    &[data-disabled=\"true\"] {\n      cursor: not-allowed;\n      opacity: var(--disabled-opacity);\n    }\n\n    &[data-resize-axis=\"x\"],\n    &[data-resize-axis=\"both\"] {\n      padding-inline-end: calc(var(--padding-inline) + 1rem);\n    }\n\n    &[data-resize-axis=\"y\"],\n    &[data-resize-axis=\"both\"] {\n      padding-block-end: calc(var(--padding-block) + 1rem);\n    }\n\n    &[data-scroll=\"true\"] {\n      border: none;\n      border-radius: 0;\n      background: transparent;\n      box-shadow: none;\n      overflow: hidden;\n\n      &[data-disabled=\"true\"] {\n        opacity: 1;\n      }\n    }\n  }\n\n  .size-sm {\n    /* Rows expressed in `lh` (the element's own resolved line-height) so the\n       preset keeps its intended row count no matter what line-height the\n       consumer applies (e.g. a `leading-*` override), instead of assuming\n       the `--leading-sm` default baked in at build time. Multiplier chosen\n       to match the previous fixed 5rem at the default line-height. */\n    min-height: calc(3.5 * 1lh + var(--padding-block) * 2 + var(--border-width-base, 1px) * 2);\n    --padding-inline: 0.5rem;\n    --padding-block: 0.25rem;\n    font-size: var(--text-sm, 0.875rem);\n    @apply px-2 py-1;\n  }\n\n  .size-md {\n    min-height: calc(3.9 * 1lh + var(--padding-block) * 2 + var(--border-width-base, 1px) * 2);\n    --padding-inline: 0.75rem;\n    --padding-block: 0.5rem;\n    font-size: var(--text-sm, 0.875rem);\n    @apply px-3 py-2;\n  }\n\n  .size-lg {\n    min-height: calc(5.1 * 1lh + var(--padding-block) * 2 + var(--border-width-base, 1px) * 2);\n    --padding-inline: 1rem;\n    --padding-block: 0.75rem;\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    @apply px-4 py-3;\n  }\n\n  .container {\n    min-width: 0;\n    @apply w-full;\n  }\n\n  .scope {\n    @apply relative flex w-full;\n    overflow: visible;\n  }\n\n  .surface {\n    min-width: 0;\n    @apply relative w-full;\n  }\n\n  .scroll-wrapper {\n    @apply w-full overflow-hidden;\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius-sm, 0.375rem);\n    background-color: var(--background);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-disabled=\"true\"] {\n      opacity: var(--disabled-opacity);\n    }\n  }\n\n  .resize-handle {\n    position: absolute;\n    z-index: 1;\n    touch-action: none;\n    user-select: none;\n\n    &::before,\n    &::after {\n      content: \"\";\n      position: absolute;\n      border-radius: var(--radius-full);\n      background-color: var(--background);\n      transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    }\n\n    &:hover::before,\n    &:hover::after {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n  }\n\n  .resize-handle-both {\n    right: 3px;\n    bottom: 3px;\n    width: 1.5rem;\n    height: 1.5rem;\n    cursor: nwse-resize;\n\n    &::before {\n      right: 0.15rem;\n      bottom: 0.35rem;\n      width: 0.5rem;\n      height: 0.125rem;\n      transform: rotate(-45deg);\n      transform-origin: center;\n    }\n\n    &::after {\n      right: 0.2rem;\n      bottom: 0.6rem;\n      width: 1rem;\n      height: 0.125rem;\n      transform: rotate(-45deg);\n      transform-origin: center;\n    }\n  }\n\n  .resize-handle-x {\n    top: 50%;\n    right: 0;\n    width: 0.75rem;\n    height: 2rem;\n    cursor: ew-resize;\n    transform: translateY(-50%);\n\n    &::before {\n      top: 50%;\n      left: 50%;\n      width: 0.125rem;\n      height: 1.5rem;\n      transform: translate(-50%, -50%);\n    }\n\n    &::after {\n      display: none;\n    }\n  }\n\n  .resize-handle-y {\n    left: 50%;\n    bottom: 0;\n    width: 2rem;\n    height: 0.75rem;\n    cursor: ns-resize;\n    transform: translateX(-50%);\n\n    &::before {\n      top: 50%;\n      left: 50%;\n      width: 1.5rem;\n      height: 0.125rem;\n      transform: translate(-50%, -50%);\n    }\n\n    &::after {\n      display: none;\n    }\n  }\n\n  .character-count {\n    @apply mt-1;\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition: color 0.15s var(--ease-snappy-pop, ease-out);\n  }\n\n  .character-count[data-over-limit=\"true\"] {\n    color: var(--foreground-error);\n  }\n}\n",
  "toast": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    @apply flex w-full max-w-[28rem] items-start gap-3 px-4 py-2.5 select-none;\n    background: var(--background);\n    color: var(--foreground);\n    border: var(--border-width-base, 1px) solid var(--background-border);\n    border-radius: var(--radius-sm, 0.375rem);\n    box-shadow: var(--background-shadow);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    touch-action: pan-y;\n  }\n\n  .icon-wrap {\n    @apply mr-4 mt-2 h-5 w-5 shrink-0;\n  }\n\n  .icon {\n    @apply h-5 w-5;\n    color: var(--icon-foreground, var(--foreground));\n  }\n\n  .content {\n    @apply min-w-0 flex-1;\n  }\n\n  .title {\n    @apply m-0;\n    --foreground: inherit;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n  }\n\n  .description {\n    @apply mt-1 mb-0;\n    --foreground: inherit;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    color: var(--foreground);\n  }\n\n  .close {\n    @apply flex shrink-0 items-center justify-center p-2 cursor-pointer;\n    --foreground: currentColor;\n    background-color: var(--background, transparent);\n    border: none;\n    border-radius: var(--radius-sm, 0.375rem);\n    color: var(--foreground);\n    opacity: 0.6;\n    transition:\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-settle-in, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-settle-in, ease-out));\n\n    &[data-focus-visible=\"true\"] {\n      box-shadow: 0 0 0 var(--border-width-base, 1px) var(--focus-visible);\n      outline: none;\n    }\n\n    &[data-hovered=\"true\"] {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      opacity: 1;\n    }\n  }\n\n  .close-icon {\n    @apply h-4 w-4;\n  }\n}\n",
  "tooltip": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .trigger {\n    display: contents;\n  }\n\n  .root {\n    @apply absolute;\n    pointer-events: none;\n    z-index: 50;\n  }\n\n  .content {\n    --fill: var(--background);\n    --stroke-color: var(--background-border);\n    opacity: 0;\n    transition:\n      opacity 0.15s ease-out,\n      transform 0.15s ease-out;\n  }\n\n  .content[data-open=\"true\"] {\n    opacity: 1;\n    pointer-events: auto;\n  }\n\n  .content[data-instant=\"true\"] {\n    transition: none;\n  }\n\n  .frame {\n    @apply flex items-center gap-1.5 px-2 py-1 whitespace-nowrap;\n    color: var(--foreground);\n  }\n\n  .frame[data-hint=\"true\"] {\n    @apply pr-1;\n  }\n\n  .hint {\n    @apply flex-shrink-0 gap-1;\n  }\n}\n"
};

export const reactAriaUrls: Record<string, string> = {
  "anchor": "",
  "badge": "",
  "banner": "",
  "button": "https://react-spectrum.adobe.com/react-aria/useButton.html",
  "card": "",
  "chart": "",
  "checkbox": "https://react-spectrum.adobe.com/react-aria/useCheckbox.html",
  "code": "",
  "color": "",
  "command": "",
  "confirm": "",
  "date": "",
  "divider": "",
  "expand": "",
  "flex": "",
  "frame": "",
  "gallery": "",
  "grid": "",
  "group": "",
  "icon": "",
  "input": "https://react-spectrum.adobe.com/react-aria/useTextField.html",
  "label": "https://react-spectrum.adobe.com/react-aria/useLabel.html",
  "list": "",
  "mask": "",
  "menu": "https://react-spectrum.adobe.com/react-aria/useMenu.html",
  "modal": "https://react-spectrum.adobe.com/react-aria/useDialog.html",
  "page": "",
  "panel": "",
  "path": "https://react-spectrum.adobe.com/react-aria/useBreadcrumbs.html",
  "popover": "https://react-spectrum.adobe.com/react-aria/usePopover.html",
  "progress": "https://react-spectrum.adobe.com/react-aria/useProgressBar.html",
  "radio": "https://react-spectrum.adobe.com/react-aria/useRadioGroup.html",
  "scroll": "",
  "select": "https://react-spectrum.adobe.com/react-aria/useSelect.html",
  "skeleton": "",
  "slider": "https://react-spectrum.adobe.com/react-aria/useSlider.html",
  "switch": "https://react-spectrum.adobe.com/react-aria/useSwitch.html",
  "table": "https://react-spectrum.adobe.com/react-aria/useTable.html",
  "tabs": "https://react-spectrum.adobe.com/react-aria/useTabs.html",
  "textarea": "https://react-spectrum.adobe.com/react-aria/useTextField.html",
  "toast": "",
  "tooltip": "https://react-spectrum.adobe.com/react-aria/useTooltip.html"
};

export const generatedComponentDependencies: Record<string, ComponentDeps> = {
  "badge": {
    "npm": [],
    "internal": []
  },
  "path": {
    "npm": [],
    "internal": []
  },
  "button": {
    "npm": [],
    "internal": []
  },
  "card": {
    "npm": [],
    "internal": []
  },
  "chart": {
    "npm": [],
    "internal": []
  },
  "checkbox": {
    "npm": [],
    "internal": [
      "label"
    ]
  },
  "command": {
    "npm": [
      "cmdk"
    ],
    "internal": [
      "card",
      "badge",
      "divider"
    ]
  },
  "confirm": {
    "npm": [],
    "internal": [
      "modal",
      "button",
      "card"
    ]
  },
  "divider": {
    "npm": [],
    "internal": []
  },
  "flex": {
    "npm": [],
    "internal": []
  },
  "expand": {
    "npm": [
      "gsap",
      "@gsap/react"
    ],
    "internal": []
  },
  "frame": {
    "npm": [],
    "internal": []
  },
  "form": {
    "npm": [],
    "internal": [
      "input",
      "label"
    ]
  },
  "gallery": {
    "npm": [],
    "internal": [
      "card"
    ]
  },
  "grid": {
    "npm": [],
    "internal": []
  },
  "group": {
    "npm": [],
    "internal": [
      "button",
      "input",
      "select"
    ]
  },
  "input": {
    "npm": [],
    "internal": [
      "label"
    ]
  },
  "icon": {
    "npm": [],
    "internal": []
  },
  "label": {
    "npm": [],
    "internal": []
  },
  "panel": {
    "npm": [],
    "internal": []
  },
  "menu": {
    "npm": [
      "@floating-ui/react-dom"
    ],
    "internal": []
  },
  "modal": {
    "npm": [],
    "internal": [
      "card",
      "button"
    ]
  },
  "page": {
    "npm": [],
    "internal": []
  },
  "popover": {
    "npm": [
      "@floating-ui/react-dom"
    ],
    "internal": []
  },
  "progress": {
    "npm": [],
    "internal": []
  },
  "radio": {
    "npm": [],
    "internal": [
      "label"
    ]
  },
  "select": {
    "npm": [
      "@floating-ui/react-dom"
    ],
    "internal": []
  },
  "slider": {
    "npm": [
      "@react-stately/slider"
    ],
    "internal": []
  },
  "switch": {
    "npm": [
      "@react-stately/toggle"
    ],
    "internal": []
  },
  "table": {
    "npm": [],
    "internal": [
      "card"
    ]
  },
  "tabs": {
    "npm": [],
    "internal": []
  },
  "textarea": {
    "npm": [],
    "internal": [
      "label"
    ]
  },
  "toast": {
    "npm": [],
    "internal": []
  },
  "tooltip": {
    "npm": [
      "@floating-ui/react-dom"
    ],
    "internal": []
  },
  "scroll": {
    "npm": [],
    "internal": []
  },
  "skeleton": {
    "npm": [],
    "internal": []
  }
};

export const generatedCoreNpmDependencies = [
  "react-aria",
  "clsx",
  "class-variance-authority"
];

export const generatedCorePeerDependencies = [
  "react",
  "react-dom"
];

export const packageMetadata: PackageMetadata = {
  "version": "0.4.3"
};
