// This file is auto-generated. Do not edit.
export const generatedStyles: Record<string, { rawCss: string; styleableParts: Array<{ name: string }>; styleableGroups: Array<{ name: string; slots: Array<{ name: string; description: string; type: string }> }>; cssVariables: Array<{ name: string; value: string; defaultValue?: string; referencedVars: string[]; variant?: string | null }> }> = {
  "tooltip": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .trigger {\n    display: contents;\n  }\n\n  .root {\n    @apply absolute;\n    pointer-events: none;\n    z-index: 50;\n  }\n\n  .content {\n    --fill: slot(content, background, var(--background));\n    /* Frame's SVG stroke remains a documented decorative API. */\n    --stroke-color: slot(content, background-border, var(--background-border));\n    color: slot(content, foreground, var(--foreground));\n    opacity: 0;\n    transform: translate(0, 0);\n    transition:\n      opacity 0.15s ease-out,\n      transform 0.15s ease-out;\n  }\n\n  .content[data-open=\"true\"] {\n    opacity: 1;\n    pointer-events: auto;\n  }\n\n  .content[data-instant=\"true\"] {\n    transition: none;\n  }\n\n  .frame {\n    @apply flex max-w-120 items-center gap-1.5 px-2 py-1 whitespace-normal wrap-break-word;\n    font-size: slot(content, font-size, var(--text-xs, 0.75rem));\n    font-weight: slot(content, font-weight, var(--font-weight-body-medium, 500));\n  }\n\n  .frame[data-hint=\"true\"] {\n    @apply pr-1;\n  }\n\n  .hint {\n    @apply shrink-0 gap-1;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "trigger"
      },
      {
        "name": "content"
      },
      {
        "name": "frame"
      },
      {
        "name": "hint"
      }
    ],
    "styleableGroups": [
      {
        "name": "TooltipStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "trigger",
            "description": "",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "",
            "type": "Style"
          },
          {
            "name": "frame",
            "description": "",
            "type": "Style"
          },
          {
            "name": "hint",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--fill",
        "value": "slot(content, background, var(--background))",
        "defaultValue": null,
        "referencedVars": [
          "--background"
        ],
        "variant": ".content"
      },
      {
        "name": "--stroke-color",
        "value": "slot(content, background-border, var(--background-border))",
        "defaultValue": null,
        "referencedVars": [
          "--background-border"
        ],
        "variant": ".content"
      }
    ]
  },
  "textarea": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .textarea {\n    --padding-inline: 0.75rem;\n    --padding-block: 0.5rem;\n\n    @apply block w-full px-3 py-2;\n    box-sizing: border-box;\n    resize: none;\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius-sm, 0.375rem);\n    background-color: var(--background);\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    outline: none;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &::placeholder {\n      color: var(--placeholder);\n    }\n\n    &[data-disabled=\"true\"] {\n      cursor: not-allowed;\n      opacity: var(--disabled-opacity);\n    }\n\n    &[data-error=\"true\"]:not([data-disabled=\"true\"]) {\n      border-color: slot(border, background-error, slot(border, background, transparent));\n    }\n\n    &[data-resize-axis=\"x\"],\n    &[data-resize-axis=\"both\"] {\n      padding-inline-end: calc(var(--padding-inline) + 1rem);\n    }\n\n    &[data-resize-axis=\"y\"],\n    &[data-resize-axis=\"both\"] {\n      padding-block-end: calc(var(--padding-block) + 1rem);\n    }\n\n    &[data-scroll=\"true\"] {\n      border: none;\n      border-radius: 0;\n      background: transparent;\n      box-shadow: none;\n      overflow: hidden;\n\n      &[data-disabled=\"true\"] {\n        opacity: 1;\n      }\n    }\n  }\n\n  .size-sm {\n    /* Rows expressed in `lh` (the element's own resolved line-height) so the\n       preset keeps its intended row count no matter what line-height the\n       consumer applies (e.g. a `leading-*` override), instead of assuming\n       the `--leading-sm` default baked in at build time. Multiplier chosen\n       to match the previous fixed 5rem at the default line-height. */\n    min-height: calc(3.5 * 1lh + var(--padding-block) * 2 + var(--border-width-base, 1px) * 2);\n    --padding-inline: 0.5rem;\n    --padding-block: 0.25rem;\n    font-size: var(--text-sm, 0.875rem);\n    @apply px-2 py-1;\n  }\n\n  .size-md {\n    min-height: calc(3.9 * 1lh + var(--padding-block) * 2 + var(--border-width-base, 1px) * 2);\n    --padding-inline: 0.75rem;\n    --padding-block: 0.5rem;\n    font-size: var(--text-sm, 0.875rem);\n    @apply px-3 py-2;\n  }\n\n  .size-lg {\n    min-height: calc(5.1 * 1lh + var(--padding-block) * 2 + var(--border-width-base, 1px) * 2);\n    --padding-inline: 1rem;\n    --padding-block: 0.75rem;\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    @apply px-4 py-3;\n  }\n\n  .container {\n    min-width: 0;\n    @apply w-full;\n  }\n\n  .scope {\n    @apply relative flex w-full;\n    overflow: visible;\n  }\n\n  .surface {\n    min-width: 0;\n    @apply relative w-full;\n  }\n\n  .scroll-wrapper {\n    @apply w-full overflow-hidden;\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius-sm, 0.375rem);\n    background-color: var(--background);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-disabled=\"true\"] {\n      opacity: var(--disabled-opacity);\n    }\n\n    &[data-error=\"true\"]:not([data-disabled=\"true\"]) {\n      border-color: slot(border, background-error, slot(border, background, transparent));\n    }\n  }\n\n  .resize-handle {\n    position: absolute;\n    z-index: 1;\n    touch-action: none;\n    user-select: none;\n\n    &::before,\n    &::after {\n      content: \"\";\n      position: absolute;\n      border-radius: var(--radius-full);\n      background-color: var(--background);\n      transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    }\n\n    &:hover::before,\n    &:hover::after {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n  }\n\n  .resize-handle-both {\n    right: 3px;\n    bottom: 3px;\n    width: 1.5rem;\n    height: 1.5rem;\n    cursor: nwse-resize;\n\n    &::before {\n      right: 0.15rem;\n      bottom: 0.35rem;\n      width: 0.5rem;\n      height: 0.125rem;\n      transform: rotate(-45deg);\n      transform-origin: center;\n    }\n\n    &::after {\n      right: 0.2rem;\n      bottom: 0.6rem;\n      width: 1rem;\n      height: 0.125rem;\n      transform: rotate(-45deg);\n      transform-origin: center;\n    }\n  }\n\n  .resize-handle-x {\n    top: 50%;\n    right: 0;\n    width: 0.75rem;\n    height: 2rem;\n    cursor: ew-resize;\n    transform: translateY(-50%);\n\n    &::before {\n      top: 50%;\n      left: 50%;\n      width: 0.125rem;\n      height: 1.5rem;\n      transform: translate(-50%, -50%);\n    }\n\n    &::after {\n      display: none;\n    }\n  }\n\n  .resize-handle-y {\n    left: 50%;\n    bottom: 0;\n    width: 2rem;\n    height: 0.75rem;\n    cursor: ns-resize;\n    transform: translateX(-50%);\n\n    &::before {\n      top: 50%;\n      left: 50%;\n      width: 1.5rem;\n      height: 0.125rem;\n      transform: translate(-50%, -50%);\n    }\n\n    &::after {\n      display: none;\n    }\n  }\n\n  .character-count {\n    @apply mt-1;\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition: color 0.15s var(--ease-snappy-pop, ease-out);\n  }\n\n  .character-count[data-over-limit=\"true\"] {\n    color: var(--foreground-error);\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "container"
      },
      {
        "name": "surface"
      },
      {
        "name": "scrollWrapper"
      },
      {
        "name": "resizeHandle.both"
      },
      {
        "name": "resizeHandle.x"
      },
      {
        "name": "resizeHandle.y"
      },
      {
        "name": "characterCount"
      }
    ],
    "styleableGroups": [
      {
        "name": "TextareaStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "container",
            "description": "",
            "type": "Style"
          },
          {
            "name": "surface",
            "description": "",
            "type": "Style"
          },
          {
            "name": "scrollWrapper",
            "description": "",
            "type": "Style"
          },
          {
            "name": "resizeHandle.both",
            "description": "",
            "type": "Style"
          },
          {
            "name": "resizeHandle.x",
            "description": "",
            "type": "Style"
          },
          {
            "name": "resizeHandle.y",
            "description": "",
            "type": "Style"
          },
          {
            "name": "characterCount",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "TextAreaStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "container",
            "description": "",
            "type": "Style"
          },
          {
            "name": "surface",
            "description": "",
            "type": "Style"
          },
          {
            "name": "scrollWrapper",
            "description": "",
            "type": "Style"
          },
          {
            "name": "resizeHandle.both",
            "description": "",
            "type": "Style"
          },
          {
            "name": "resizeHandle.x",
            "description": "",
            "type": "Style"
          },
          {
            "name": "resizeHandle.y",
            "description": "",
            "type": "Style"
          },
          {
            "name": "characterCount",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-950)",
        "defaultValue": null,
        "referencedVars": [
          "--background-950"
        ],
        "variant": ".textarea"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".textarea"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".textarea"
      },
      {
        "name": "--placeholder",
        "value": "color-mix(in srgb, var(--foreground-400) 80%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".textarea"
      },
      {
        "name": "--padding-inline",
        "value": "0.75rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".textarea"
      },
      {
        "name": "--padding-block",
        "value": "0.5rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".textarea"
      },
      {
        "name": "--padding-inline",
        "value": "0.5rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".size-sm"
      },
      {
        "name": "--padding-block",
        "value": "0.25rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".size-sm"
      },
      {
        "name": "--padding-inline",
        "value": "0.75rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".size-md"
      },
      {
        "name": "--padding-block",
        "value": "0.5rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".size-md"
      },
      {
        "name": "--padding-inline",
        "value": "1rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".size-lg"
      },
      {
        "name": "--padding-block",
        "value": "0.75rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".size-lg"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".resize-handle:hover::before,\n    .resize-handle:hover::after"
      }
    ]
  },
  "tabs": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .tabs {\n    @apply flex w-full flex-col;\n\n    &[data-orientation=\"vertical\"] {\n      flex-direction: row;\n    }\n  }\n\n  .list {\n    @apply relative grid w-full items-center gap-3 py-1;\n    grid-auto-flow: column;\n    grid-auto-columns: max-content;\n    justify-content: start;\n    border-radius: var(--radius-sm, 0.375rem);\n\n    &[data-orientation=\"vertical\"] {\n      grid-auto-flow: row;\n      grid-auto-columns: auto;\n      grid-auto-rows: max-content;\n      width: fit-content;\n      min-width: 0;\n      height: auto;\n      align-self: flex-start;\n    }\n\n    &:global(.underline) {\n      text-decoration: none !important;\n    }\n\n    &[data-variant=\"underline\"] {\n      background-color: transparent;\n      border-radius: 0;\n      padding: 0 0 4px;\n    }\n\n    &[data-variant=\"underline\"][data-orientation=\"vertical\"] {\n      border-bottom: none;\n      /* The vertical underline divider is outside the surface-border contract. */\n      border-left: var(--border-width-base) solid var(--border);\n      align-items: stretch;\n      padding: 0 0 0 4px;\n    }\n  }\n\n  .indicator {\n    @apply absolute;\n    background-color: var(--background);\n    box-sizing: border-box;\n    border-radius: var(--radius-sm);\n    z-index: 0;\n    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n    pointer-events: none;\n  }\n\n  .indicator-fallback {\n    z-index: 0;\n  }\n\n  .indicator-fallback-frame {\n    display: none;\n    position: absolute;\n    inset: 0;\n    min-width: 0;\n    min-height: 0;\n    pointer-events: none;\n    z-index: 0;\n  }\n\n  .trigger[data-selected=\"true\"] + .indicator-fallback-frame {\n    display: block;\n  }\n\n  .indicator-underline {\n    border-radius: 0;\n  }\n\n  .trigger {\n    @apply relative z-[1] flex shrink-0 items-center justify-center gap-2 px-2 py-1.5 cursor-pointer select-none;\n    --ring-z: 1;\n    height: auto;\n    background-color: var(--background);\n    border: none;\n    border-radius: var(--radius-sm);\n    color: var(--foreground);\n    outline: none;\n    box-shadow: none;\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-hovered=\"true\"]:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n\n    &[data-selected=\"true\"] {\n      cursor: pointer;\n\n      .list:not([data-variant=\"underline\"]) & {\n        background-color: transparent;\n        transition-property: color;\n      }\n    }\n\n    &[data-selected=\"true\"]:not([data-indicator-ready=\"true\"]):not(\n        [data-indicator-fallback=\"true\"]\n      ) {\n      .list.underline & {\n        border-bottom-color: var(--underline-border);\n      }\n\n      .list.underline[data-orientation=\"vertical\"] & {\n        border-bottom-color: transparent;\n        border-left-color: var(--underline-border);\n      }\n    }\n\n    &[data-disabled=\"true\"] {\n      --disabled-opacity: 0.5;\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n      pointer-events: none;\n    }\n\n    .list.underline & {\n      background-color: var(--background);\n      background-clip: padding-box;\n      border-radius: var(--radius-sm, 0.375rem);\n      border-bottom: 2px solid transparent;\n    }\n\n    .list.underline[data-orientation=\"vertical\"] & {\n      border-bottom: none;\n      border-left: 2px solid transparent;\n    }\n\n    .list.underline[data-orientation=\"vertical\"]\n      &[data-selected=\"true\"]:not([data-indicator-ready=\"true\"]):not(\n        [data-indicator-fallback=\"true\"]\n      ) {\n      border-left-color: var(--underline-border);\n      border-bottom: none;\n    }\n  }\n\n  .icon {\n    @apply flex h-4 w-4 shrink-0 items-center justify-center;\n  }\n\n  .content {\n    @apply w-full p-0 outline-none;\n    flex: 1;\n    padding-top: 1rem;\n\n    &[data-orientation=\"vertical\"] {\n      flex: 1;\n      width: 100%;\n    }\n\n    &:focus-visible {\n      outline: 2px solid var(--focus-visible);\n      outline-offset: 2px;\n    }\n  }\n\n  @media (max-width: 640px) {\n    .list {\n      padding: 0.125rem;\n\n      &[data-variant=\"underline\"] {\n        padding: 0 0 4px;\n      }\n    }\n\n    .trigger {\n      @apply px-1 py-1;\n      .list.underline & {\n        margin: 0.5rem 0.75rem;\n      }\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "list"
      },
      {
        "name": "indicator"
      },
      {
        "name": "trigger"
      },
      {
        "name": "icon.left"
      },
      {
        "name": "icon.right"
      }
    ],
    "styleableGroups": [
      {
        "name": "TabsStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "list",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "TabsListStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "list",
            "description": "",
            "type": "Style"
          },
          {
            "name": "indicator",
            "description": "",
            "type": "Style"
          },
          {
            "name": "trigger",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "TabsTriggerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "icon.left",
            "description": "",
            "type": "Style"
          },
          {
            "name": "icon.right",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "TabsContentStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--ring-z",
        "value": "1",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".trigger"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".trigger[data-hovered=\"true\"]:not([data-disabled=\"true\"]):not([data-selected=\"true\"])"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.5",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".trigger[data-disabled=\"true\"]"
      }
    ]
  },
  "toast": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    @apply flex w-full max-w-[28rem] items-start gap-3 px-4 py-2.5 select-none;\n    background: var(--background);\n    color: var(--foreground);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius-sm, 0.375rem);\n    box-shadow: var(--background-shadow);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    touch-action: pan-y;\n  }\n\n  .icon-wrap {\n    @apply mr-4 mt-2 h-5 w-5 shrink-0;\n  }\n\n  .icon {\n    @apply h-5 w-5;\n    color: var(--icon-foreground, var(--foreground));\n  }\n\n  .content {\n    @apply min-w-0 flex-1;\n  }\n\n  .title {\n    @apply m-0;\n    --foreground: inherit;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n  }\n\n  .description {\n    @apply mt-1 mb-0;\n    --foreground: inherit;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    color: var(--foreground);\n  }\n\n  .close {\n    @apply flex shrink-0 items-center justify-center p-2 cursor-pointer;\n    --foreground: currentColor;\n    background-color: var(--background, transparent);\n    border: none;\n    border-radius: var(--radius-sm, 0.375rem);\n    color: var(--foreground);\n    opacity: 0.6;\n    transition:\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-settle-in, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-settle-in, ease-out));\n\n    &[data-focus-visible=\"true\"] {\n      box-shadow: 0 0 0 var(--border-width-base, 1px) var(--focus-visible);\n      outline: none;\n    }\n\n    &[data-hovered=\"true\"] {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      opacity: 1;\n    }\n  }\n\n  .close-icon {\n    @apply h-4 w-4;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "iconWrap"
      },
      {
        "name": "icon"
      },
      {
        "name": "content"
      },
      {
        "name": "title"
      },
      {
        "name": "description"
      },
      {
        "name": "close"
      },
      {
        "name": "closeIcon"
      }
    ],
    "styleableGroups": [
      {
        "name": "ToastStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "iconWrap",
            "description": "",
            "type": "Style"
          },
          {
            "name": "icon",
            "description": "",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "",
            "type": "Style"
          },
          {
            "name": "description",
            "description": "",
            "type": "Style"
          },
          {
            "name": "close",
            "description": "",
            "type": "Style"
          },
          {
            "name": "closeIcon",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ToastStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "iconWrap",
            "description": "",
            "type": "Style"
          },
          {
            "name": "icon",
            "description": "",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "",
            "type": "Style"
          },
          {
            "name": "description",
            "description": "",
            "type": "Style"
          },
          {
            "name": "close",
            "description": "",
            "type": "Style"
          },
          {
            "name": "closeIcon",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-900)",
        "defaultValue": null,
        "referencedVars": [
          "--background-900"
        ],
        "variant": ".toast"
      },
      {
        "name": "--background-shadow",
        "value": "0 10px 25px -5px rgb(0 0 0 / 10%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".toast"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-200)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-200"
        ],
        "variant": ".toast"
      },
      {
        "name": "--foreground",
        "value": "inherit",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".title"
      },
      {
        "name": "--foreground",
        "value": "inherit",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".description"
      },
      {
        "name": "--foreground",
        "value": "currentColor",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".close"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".close[data-hovered=\"true\"]"
      }
    ]
  },
  "table": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    @apply w-full min-w-0 max-w-full;\n    /* Keep the public `.table` theme hook from matching Tailwind's display utility. */\n    display: block !important;\n  }\n\n  /*\n   * `clip` keeps the rounded corners without making the container a scroll\n   * container, so a sticky header resolves against whatever ancestor really\n   * scrolls. Only the measured overflow case swaps in a scroll port, since a\n   * box that scrolls horizontally scrolls on both axes and would capture the\n   * header itself.\n   */\n  .container {\n    @apply w-full min-w-0 max-w-full rounded-sm;\n    overflow: clip;\n    /* Keep the public `.container` theme hook from applying Tailwind's breakpoint max-widths. */\n    max-width: 100% !important;\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    background-color: var(--container-background, var(--background));\n  }\n\n  /* The Scroll port inside handles the overflow in this mode. */\n  .container[data-scroll=\"horizontal\"] {\n    overflow: visible;\n  }\n\n  /* Rows scroll on their own, so the container just hands down its height. */\n  .container[data-scroll=\"rows\"] {\n    display: flex;\n    height: 100%;\n    min-height: 0;\n  }\n\n  .scroller {\n    @apply block w-full min-w-0 max-w-full;\n    border-radius: inherit;\n    overscroll-behavior-inline: contain;\n  }\n\n  .scroller :global(.mask) {\n    border-radius: inherit;\n  }\n\n  .scrollerTrack {\n    background-color: var(--background, transparent);\n  }\n\n  .scrollerThumb {\n    background-color: var(--background-500, var(--foreground));\n  }\n\n  .table {\n    @apply w-full;\n    display: table;\n    border-collapse: collapse;\n    min-width: max-content;\n    background-color: var(--background, transparent);\n    color: var(--foreground);\n    font-family: var(--font-mono, ui-monospace, monospace);\n    font-size: var(--text-code-size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-code, var(--font-weight-body-normal, 400));\n    letter-spacing: var(--letter-spacing-code, 0);\n    line-height: var(--leading-code, 1.5);\n  }\n\n  .header {\n    display: table-header-group;\n    background-color: var(--background);\n  }\n\n  .body {\n    display: table-row-group;\n    background-color: var(--background);\n  }\n\n  .headerRow {\n    display: table-row;\n    background-color: var(--background);\n  }\n\n  .table .headerCell {\n    @apply px-3 py-2.5 text-left;\n    display: table-cell;\n    background-color: var(--background);\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    white-space: nowrap;\n    border: 0;\n    border-bottom: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n  }\n\n  /*\n   * `rows` layout: the header is a plain box above the scroll port instead of a\n   * sticky cell inside it, so it keeps ordinary borders, never shifts by a\n   * hairline, and the scrollbar runs beside the rows only. Header and body are\n   * separate boxes now, so every row lines up on one shared grid template.\n   */\n  .table.rowsLayout {\n    /* Grid, not flex: the row track hands the scroll port a definite height. */\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr);\n    height: 100%;\n    min-width: 0;\n    min-height: 0;\n  }\n\n  .table.rowsLayout .header {\n    display: block;\n  }\n\n  .bodyScroller {\n    @apply block w-full min-w-0;\n    min-height: 0;\n    overscroll-behavior-block: contain;\n  }\n\n  .table.rowsLayout .body {\n    display: block;\n  }\n\n  .table.rowsLayout .headerRow,\n  .table.rowsLayout .row,\n  .table.rowsLayout .emptyRow {\n    display: grid;\n    grid-template-columns: var(--table-columns, 1fr);\n    align-items: stretch;\n  }\n\n  /*\n   * Grid, not flex: a lone child still stretches to the cell's width, so\n   * `justify-end`, `w-full` children and truncation all behave like they did\n   * in a table cell, while `align-items` keeps the vertical centring.\n   */\n  .table.rowsLayout .headerCell,\n  .table.rowsLayout .cell {\n    display: grid;\n    align-items: center;\n    align-content: center;\n    min-width: 0;\n  }\n\n  .table.rowsLayout .emptyState {\n    display: block;\n    grid-column: 1 / -1;\n  }\n\n  .row {\n    display: table-row;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .row[data-interactive=\"true\"] {\n    @apply cursor-pointer;\n  }\n\n  .row:hover:not([data-disabled=\"true\"]) .cell {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .row[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--disabled-opacity, 0.5);\n  }\n\n  .row[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-ring);\n    outline-offset: -2px;\n  }\n\n  .interactive {\n    @apply cursor-pointer;\n  }\n\n  .table .cell {\n    @apply px-3 py-2.5 align-middle;\n    display: table-cell;\n    background-color: var(--background, transparent);\n    color: var(--foreground);\n    border: 0;\n    border-bottom: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .row:last-child .cell {\n    border-bottom: none;\n  }\n\n  .emptyRow {\n    border-bottom: none;\n  }\n\n  .emptyRow {\n    display: table-row;\n  }\n\n  .emptyState {\n    @apply px-4 py-8 text-center;\n    background-color: var(--background);\n    color: var(--foreground);\n  }\n\n  .emptyState {\n    display: table-cell;\n  }\n\n  .filterBar {\n    @apply mb-4 rounded-xs border p-4;\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    background-color: var(--background);\n  }\n\n  .filterBar {\n    display: block;\n  }\n\n  .filterGrid {\n    @apply grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3;\n    background-color: var(--background);\n  }\n\n  .filterGrid {\n    display: grid;\n  }\n\n  .filterField {\n    @apply min-w-0;\n  }\n\n  .filterLabel {\n    @apply mb-2 block;\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .filterLabel {\n    display: block;\n  }\n\n  .filterInput {\n    @apply w-full;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "container"
      },
      {
        "name": "scroller.root"
      },
      {
        "name": "scroller.track"
      },
      {
        "name": "scroller.thumb"
      },
      {
        "name": "filter.bar"
      },
      {
        "name": "filter.grid"
      },
      {
        "name": "filter.field"
      },
      {
        "name": "filter.label"
      },
      {
        "name": "filter.input"
      },
      {
        "name": "table"
      },
      {
        "name": "header.root"
      },
      {
        "name": "header.row"
      },
      {
        "name": "header.cell"
      },
      {
        "name": "body.root"
      },
      {
        "name": "body.scroller"
      },
      {
        "name": "row"
      },
      {
        "name": "cell"
      },
      {
        "name": "empty.row"
      },
      {
        "name": "empty.state"
      }
    ],
    "styleableGroups": [
      {
        "name": "TableStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "container",
            "description": "",
            "type": "Style"
          },
          {
            "name": "scroller.root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "scroller.track",
            "description": "",
            "type": "Style"
          },
          {
            "name": "scroller.thumb",
            "description": "",
            "type": "Style"
          },
          {
            "name": "filter.bar",
            "description": "",
            "type": "Style"
          },
          {
            "name": "filter.grid",
            "description": "",
            "type": "Style"
          },
          {
            "name": "filter.field",
            "description": "",
            "type": "Style"
          },
          {
            "name": "filter.label",
            "description": "",
            "type": "Style"
          },
          {
            "name": "filter.input",
            "description": "",
            "type": "Style"
          },
          {
            "name": "table",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header.root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header.row",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header.cell",
            "description": "",
            "type": "Style"
          },
          {
            "name": "body.root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "body.scroller",
            "description": "",
            "type": "Style"
          },
          {
            "name": "row",
            "description": "",
            "type": "Style"
          },
          {
            "name": "cell",
            "description": "",
            "type": "Style"
          },
          {
            "name": "empty.row",
            "description": "",
            "type": "Style"
          },
          {
            "name": "empty.state",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-950)",
        "defaultValue": null,
        "referencedVars": [
          "--background-950"
        ],
        "variant": ".table"
      },
      {
        "name": "--focus-ring",
        "value": "var(--accent-400)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-400"
        ],
        "variant": ".table"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".table"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".row:hover:not([data-disabled=\"true\"]) .cell"
      }
    ]
  },
  "switch": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .switch {\n    --radius: 9999px;\n    --inner-radius: calc(var(--radius) - slot(border, width, var(--border-width-base, 1px)));\n\n    --width: 2.4rem;\n    --height: 1.35rem;\n    --thumb-size: 1.05rem;\n    --thumb-offset: 0.15rem;\n\n    --disabled-opacity: 0.6;\n\n    @apply relative inline-flex shrink-0 cursor-pointer items-center;\n    user-select: none;\n    border-radius: var(--radius);\n    inline-size: var(--width);\n    block-size: var(--height);\n  }\n\n  .switch-track {\n    @apply absolute inset-0;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    background-color: var(--background, transparent);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius);\n  }\n\n  .input {\n    @apply absolute inset-0 h-full w-full cursor-pointer opacity-0;\n  }\n\n  .switch-thumb {\n    @apply absolute top-0 bottom-0 my-auto;\n    inset-inline-start: var(--thumb-offset);\n    inline-size: var(--thumb-size);\n    block-size: var(--thumb-size);\n    transition:\n      inset-inline-start var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    background-color: var(--foreground, currentColor);\n    border-radius: var(--inner-radius);\n    z-index: 1;\n    pointer-events: none;\n  }\n\n  .switch[data-selected=\"true\"] .switch-thumb {\n    inset-inline-start: calc(var(--width) - var(--thumb-size) - var(--thumb-offset));\n  }\n\n  .switch[data-disabled=\"true\"] {\n    opacity: var(--disabled-opacity);\n    cursor: not-allowed;\n  }\n\n  .switch-sm {\n    --width: 2rem;\n    --height: 1.125rem;\n    --thumb-size: 0.875rem;\n    --thumb-offset: 0.125rem;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "track"
      },
      {
        "name": "thumb"
      }
    ],
    "styleableGroups": [
      {
        "name": "SwitchStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the outer switch surface.",
            "type": "Style"
          },
          {
            "name": "track",
            "description": "Styles the background track behind the thumb.",
            "type": "Style"
          },
          {
            "name": "thumb",
            "description": "Styles the movable thumb.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--control-track)",
        "defaultValue": null,
        "referencedVars": [
          "--control-track"
        ],
        "variant": ".switch"
      },
      {
        "name": "--focus-visible",
        "value": "color-mix(in srgb, var(--background-500) 40%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-500"
        ],
        "variant": ".switch"
      },
      {
        "name": "--foreground",
        "value": "var(--control-thumb)",
        "defaultValue": null,
        "referencedVars": [
          "--control-thumb"
        ],
        "variant": ".switch"
      },
      {
        "name": "--transition-duration",
        "value": "120ms",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--transition-easing",
        "value": "linear",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--radius",
        "value": "9999px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--inner-radius",
        "value": "calc(var(--radius) - slot(border, width, var(--border-width-base, 1px)))",
        "defaultValue": "1px",
        "referencedVars": [
          "--radius",
          "--border-width-base"
        ],
        "variant": ".switch"
      },
      {
        "name": "--width",
        "value": "2.4rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--height",
        "value": "1.35rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--thumb-size",
        "value": "1.05rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--thumb-offset",
        "value": "0.15rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch"
      },
      {
        "name": "--width",
        "value": "2rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch-sm"
      },
      {
        "name": "--height",
        "value": "1.125rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch-sm"
      },
      {
        "name": "--thumb-size",
        "value": "0.875rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch-sm"
      },
      {
        "name": "--thumb-offset",
        "value": "0.125rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".switch-sm"
      }
    ]
  },
  "slider": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .slider {\n    --disabled-opacity: 0.6;\n    @apply relative flex w-full items-center;\n    min-inline-size: var(--inline-size, 3.5rem);\n    min-block-size: var(--hit-size, 1.5rem);\n    touch-action: none;\n    user-select: none;\n  }\n\n  .track {\n    --thickness: var(--size, calc(var(--spacing-md) * 0.8));\n    --length: calc(var(--thickness) * var(--ratio, 0.5));\n    @apply relative flex grow items-center;\n    flex-grow: 1;\n    height: var(--thickness);\n    overflow: visible;\n    border-radius: slot(track, radius, var(--radius, calc(var(--spacing-sm) * 0.35)));\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    background: slot(track, background, var(--background));\n  }\n\n  .range {\n    @apply absolute;\n    display: block;\n    border-radius: inherit;\n    pointer-events: none;\n    background: slot(range, background, var(--background));\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .thumb {\n    --thumb-inline-size: slot(thumb, width, var(--length));\n    --thumb-block-size: slot(thumb, height, 100%);\n\n    @apply absolute block;\n    top: var(--top, 0);\n    box-sizing: border-box;\n    width: var(--thumb-inline-size);\n    height: var(--thumb-block-size);\n    transform: var(--transform, translateX(-50%));\n    border-radius: slot(thumb, radius, var(--radius, calc(var(--spacing-xs) * 0.25)));\n    outline: none;\n    background: slot(thumb, background, var(--background));\n    border: slot(thumb, border, none);\n    box-shadow: slot(thumb, shadow, none);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      box-shadow var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .slider[data-orientation=\"horizontal\"] .range {\n    top: 0;\n    height: 100%;\n  }\n\n  .slider[data-orientation=\"horizontal\"] .thumb {\n    left: clamp(var(--thumb-inset, 0px), var(--position, 0%), calc(100% - var(--thumb-inset, 0px)));\n  }\n\n  .slider[data-orientation=\"vertical\"] {\n    justify-content: center;\n    min-inline-size: auto;\n    width: fit-content;\n  }\n\n  .slider[data-orientation=\"vertical\"] .track {\n    width: var(--thickness);\n    height: 100%;\n  }\n\n  .slider[data-orientation=\"vertical\"] .range {\n    left: 0;\n    width: 100%;\n  }\n\n  .slider[data-orientation=\"vertical\"] .thumb {\n    left: 50%;\n    top: auto;\n    bottom: clamp(\n      var(--thumb-inset, 0px),\n      var(--position, 0%),\n      calc(100% - var(--thumb-inset, 0px))\n    );\n    width: var(--thumb-block-size);\n    height: var(--thumb-inline-size);\n    transform: translate(-50%, 50%);\n  }\n\n  .slider[data-disabled=\"true\"] {\n    opacity: var(--disabled-opacity);\n    cursor: not-allowed;\n  }\n\n  .slider[data-disabled=\"true\"] .range {\n    background: slot(range, background-disabled, slot(range, background, var(--background)));\n  }\n\n  .thumb[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    background: slot(thumb, background-disabled, slot(thumb, background, var(--background)));\n  }\n\n  .thumb[data-pressed=\"true\"] {\n    transform: var(--transform, translateX(-50%));\n  }\n\n  .slider[data-orientation=\"vertical\"] .thumb[data-pressed=\"true\"] {\n    transform: translate(-50%, 50%);\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "track"
      },
      {
        "name": "range"
      },
      {
        "name": "thumb"
      }
    ],
    "styleableGroups": [
      {
        "name": "SliderStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the root slider interaction surface.",
            "type": "SlotStyle"
          },
          {
            "name": "track",
            "description": "Styles the track that contains the range and thumbs.",
            "type": "SlotStyle"
          },
          {
            "name": "range",
            "description": "Styles the filled portion of the track.",
            "type": "SlotStyle"
          },
          {
            "name": "thumb",
            "description": "Styles every slider thumb.",
            "type": "SlotStyle"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--size",
        "value": "var(--control-size)",
        "defaultValue": null,
        "referencedVars": [
          "--control-size"
        ],
        "variant": ".slider"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".slider"
      },
      {
        "name": "--thickness",
        "value": "var(--size, calc(var(--spacing-md) * 0.8))",
        "defaultValue": "calc(var(--spacing-md",
        "referencedVars": [
          "--size"
        ],
        "variant": ".track"
      },
      {
        "name": "--length",
        "value": "calc(var(--thickness) * var(--ratio, 0.5))",
        "defaultValue": "0.5",
        "referencedVars": [
          "--thickness",
          "--ratio"
        ],
        "variant": ".track"
      },
      {
        "name": "--thumb-inline-size",
        "value": "slot(thumb, width, var(--length))",
        "defaultValue": null,
        "referencedVars": [
          "--length"
        ],
        "variant": ".thumb"
      },
      {
        "name": "--thumb-block-size",
        "value": "slot(thumb, height, 100%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".thumb"
      }
    ]
  },
  "skeleton": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .shape {\n    display: block;\n    /* A placeholder is composed onto whatever surface holds it — the page, a\n       card, a badge, a filled button — so the fill is derived from the text\n       colour of that surface rather than from a fixed background token. Any\n       single token is invisible on at least one of those surfaces. */\n    background: var(\n      --skeleton-color,\n      var(--background, color-mix(in srgb, currentColor 15%, transparent))\n    );\n    border-radius: var(--radius, var(--radius-sm, 0.375rem));\n  }\n\n  .rectangle {\n    width: var(--width, 10rem);\n    height: var(--height, 0.75rem);\n  }\n\n  .text {\n    display: flex;\n    width: 100%;\n    flex-direction: column;\n    gap: calc(var(--gap, 0.375rem) * var(--scale, 1));\n    align-content: start;\n  }\n\n  .text[data-size=\"body\"] {\n    --row-height: 0.75rem;\n    --gap: 0.375rem;\n  }\n\n  .text[data-size=\"heading\"] {\n    --row-height: 1.25rem;\n    --gap: 0.5rem;\n  }\n\n  .text[data-size=\"display\"] {\n    --row-height: 2rem;\n    --gap: 0.625rem;\n  }\n\n  .row {\n    width: 100%;\n    height: calc(var(--row-height, 0.75rem) * var(--scale, 1));\n    flex: none;\n  }\n\n  .lastRow {\n    width: var(--last-line-width, 70%);\n  }\n\n  .image {\n    width: var(--width, 100%);\n    height: auto;\n    aspect-ratio: var(--ratio, 16 / 9);\n  }\n\n  :global(.skeleton) {\n    animation: none;\n  }\n\n  :global([data-skeleton-animate]) :global(.skeleton) {\n    animation: var(--animation, none);\n  }\n\n  :global([data-skeleton-animate]) {\n    --animation: skeleton-pulse 1.6s var(--ease-gentle-ease, ease-in-out) infinite;\n  }\n\n  @keyframes skeleton-pulse {\n    0%,\n    100% {\n      opacity: 1;\n    }\n    50% {\n      opacity: 0.48;\n    }\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    :global([data-skeleton-animate]) :global(.skeleton) {\n      animation: none !important;\n    }\n  }\n}\n",
    "styleableParts": [],
    "styleableGroups": [],
    "cssVariables": [
      {
        "name": "--background",
        "value": "color-mix(in srgb, currentColor 15%, transparent)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".skeleton"
      },
      {
        "name": "--radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".skeleton"
      },
      {
        "name": "--row-height",
        "value": "0.75rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".text[data-size=\"body\"]"
      },
      {
        "name": "--gap",
        "value": "0.375rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".text[data-size=\"body\"]"
      },
      {
        "name": "--row-height",
        "value": "1.25rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".text[data-size=\"heading\"]"
      },
      {
        "name": "--gap",
        "value": "0.5rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".text[data-size=\"heading\"]"
      },
      {
        "name": "--row-height",
        "value": "2rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".text[data-size=\"display\"]"
      },
      {
        "name": "--gap",
        "value": "0.625rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".text[data-size=\"display\"]"
      },
      {
        "name": "--animation",
        "value": "skeleton-pulse 1.6s var(--ease-gentle-ease, ease-in-out) infinite",
        "defaultValue": "ease-in-out",
        "referencedVars": [
          "--ease-gentle-ease"
        ],
        "variant": ":global([data-skeleton-animate])"
      }
    ]
  },
  "select": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .select {\n    --disabled-opacity: 0.5;\n    --background-radius: var(--radius-sm, 0.375rem);\n    --background-inner-radius: calc(\n      var(--background-radius) - slot(border, width, var(--border-width-base, 1px))\n    );\n\n    @slot trigger {\n      --padding-inline: calc(var(--spacing) * 2);\n      --padding-block: calc(var(--spacing) * 1.5);\n    };\n\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    height: fit-content;\n    align-self: center;\n\n    @apply p-0 gap-0 w-fit min-w-0 flex-none flex-row items-center;\n    position: relative;\n    overflow: visible;\n\n    background-color: var(--background);\n    color: var(--foreground);\n    border:\n      slot(border, width, var(--border-width-base, 1px))\n      slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--background-radius);\n\n    @apply select-none cursor-pointer;\n\n    &[data-disabled] {\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n    }\n\n    &[data-pressed=\"true\"]:not([data-disabled]) {\n      background-color: var(--background);\n    }\n\n    &[data-open=\"true\"] {\n      background-color: var(--background);\n    }\n\n    &:global(.group) {\n      height: 100%;\n      align-self: stretch;\n    }\n  }\n\n  .trigger {\n    @apply flex items-stretch flex-1 gap-0 w-full min-w-0 h-full min-h-0;\n\n    background: transparent;\n\n    @apply border-none cursor-pointer select-none;\n\n    @media (hover: hover) {\n      &:not([data-disabled]):hover .icon-section,\n      &:not([data-disabled]):hover .value-section:not(:empty) {\n        --hover-duration: var(--hover-enter-duration, 0ms);\n        background-color: slot(trigger, background-hover, transparent);\n      }\n    }\n\n    &[data-focus-visible=\"true\"] {\n      @apply outline-none;\n    }\n  }\n\n  .trigger-compact {\n    @apply flex-none w-auto;\n  }\n\n  /* A Value placed beside the Trigger is the label segment of one Select,\n     not another interactive control. Give that segment the same visual\n     treatment as a normal trigger value while keeping one focus target. */\n  .select.select-split > .value[data-external=\"true\"] {\n    align-items: center;\n    padding: slot(trigger, padding-block, calc(var(--spacing) * 1.5))\n      slot(trigger, padding-inline, calc(var(--spacing) * 2));\n    border-radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n    background-color: var(--background, transparent);\n    transition-property: background-color;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration));\n    transition-timing-function: var(--hover-transition-timing-function);\n\n    @media (hover: hover) {\n      &:not([data-disabled]):hover {\n        --hover-duration: var(--hover-enter-duration, 0ms);\n        background-color: slot(trigger, background-hover, transparent);\n      }\n    }\n  }\n\n  .select button.trigger {\n    @apply p-0;\n  }\n\n  .value-section {\n    @apply flex items-center flex-1 min-w-0 gap-0.5;\n\n    background-color: var(--background, transparent);\n    transition-property: background-color;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration));\n    transition-timing-function: var(--hover-transition-timing-function);\n    padding: slot(trigger, padding-block, calc(var(--spacing) * 1.5))\n      slot(trigger, padding-inline, calc(var(--spacing) * 2));\n    border-radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    &:only-child {\n      border-radius: var(--background-inner-radius);\n      justify-content: center;\n    }\n    &:empty {\n      flex: 0;\n      padding: 0;\n      min-width: auto;\n    }\n  }\n\n  .icon-section {\n    @apply flex items-center justify-center shrink-0;\n    background-color: var(--background, transparent);\n    transition-property: background-color;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration));\n    transition-timing-function: var(--hover-transition-timing-function);\n    padding: slot(trigger, padding-block, calc(var(--spacing) * 1.5))\n      slot(trigger, padding-inline, calc(var(--spacing) * 2));\n    border-radius: 0 var(--background-inner-radius) var(--background-inner-radius) 0;\n  }\n\n  .icon {\n    @apply flex items-center justify-center w-4 h-4 opacity-70;\n  }\n\n  .text {\n    @apply block flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .value {\n    @apply flex items-center flex-1 min-w-0 gap-2 bg-transparent border-none;\n    cursor: inherit;\n  }\n\n  .value-icon {\n    @apply flex items-center justify-center shrink-0 w-4 h-4;\n    align-self: center;\n    color: var(--icon-foreground, currentColor);\n\n    > svg {\n      display: block;\n    }\n  }\n\n  .value-text {\n    @apply min-w-0 overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .content,\n  .sub-content {\n    --content-padding: calc(var(--spacing) * 2);\n    --content-radius: var(--radius-sm, 0.375rem);\n    --content-inner-radius: calc(\n      var(--content-radius) - slot(border, width, var(--border-width-base, 1px))\n    );\n    --disabled-opacity: 0.5;\n    @apply overflow-hidden;\n    outline: none;\n    background-color: var(--background);\n    border:\n      slot(border, width, var(--border-width-base, 1px))\n      slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--content-radius);\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);\n  }\n\n  .content-root:global(.select),\n  .sub-content-root:global(.select) {\n    display: block;\n    position: absolute;\n  }\n\n  .list {\n    @apply space-y-1;\n  }\n\n  .list-padding {\n    padding: var(--spacing, 0.25rem);\n  }\n\n  .item,\n  .sub-trigger {\n    @apply flex items-center gap-2 outline-none cursor-default select-none;\n    padding: calc(var(--content-padding) / 1.5) var(--content-padding);\n    border-radius: var(--content-inner-radius);\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    /* Rows are List items; List paints their background and foreground. */\n    &[data-disabled] {\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n      pointer-events: none;\n    }\n  }\n\n  .item-content {\n    @apply flex flex-col flex-1 min-w-0;\n  }\n\n  .item-text {\n    @apply min-w-0 overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .item-description {\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-body-size, var(--text-base, 0.9375rem)));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    color: var(--foreground-muted);\n    @apply min-w-0 whitespace-normal break-words;\n  }\n\n  .item-icon {\n    @apply flex items-center justify-center shrink-0 w-4 h-4;\n    color: var(--icon-foreground);\n  }\n\n  .item-with-description {\n    @apply items-start py-2;\n  }\n  .item-icon-with-description {\n    @apply mt-0.5;\n  }\n\n  .option-group-title {\n    @apply px-2 py-1;\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground-muted, var(--foreground-400));\n  }\n\n  .separator {\n    @apply my-1;\n    margin-left: calc(var(--content-padding) / -2);\n    margin-right: calc(var(--content-padding) / -2);\n    height: 1px;\n    background-color: slot(border, background, transparent);\n  }\n\n  .placeholder {\n    color: var(--foreground-muted);\n  }\n\n  .icon-prefix {\n    @apply inline-flex items-center shrink-0;\n  }\n\n  .select[data-mode=\"multiple\"] .item {\n    gap: 0.5rem;\n  }\n\n  .search-trigger {\n    @apply flex items-stretch relative bg-transparent cursor-text overflow-hidden;\n    border-radius: var(--background-inner-radius);\n    &:focus-within {\n      @apply outline-none;\n      z-index: 1;\n    }\n  }\n\n  .search-trigger :global(.focus-indicator) {\n    display: none;\n  }\n\n  .search-value-section {\n    @apply p-0;\n    border-radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n  }\n\n  .input {\n    padding-right: calc(slot(trigger, padding-inline, calc(var(--spacing) * 2)) * 2 + 1rem);\n    @apply border-transparent rounded-none shadow-none bg-transparent;\n\n    &[data-focused],\n    &[data-focus-visible] {\n      @apply border-transparent shadow-none;\n    }\n  }\n\n  .search-content-input {\n    @apply rounded-none bg-transparent;\n  }\n\n  .search-icon-section {\n    @apply absolute right-0 top-0 bottom-0 flex items-center justify-center bg-transparent pointer-events-none;\n    padding-inline: slot(trigger, padding-inline, calc(var(--spacing) * 2));\n  }\n\n  .search-wrapper {\n    @apply overflow-hidden;\n    border-bottom: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n  }\n\n  .empty-state {\n    @apply px-3 py-2;\n    color: var(--foreground-muted);\n  }\n\n  .content[data-placement=\"top\"] .search-wrapper {\n    border-radius: 0;\n    border-bottom: none;\n    border-top: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n  }\n\n  .sub-trigger {\n    &[data-open=\"true\"]:not([data-highlighted=\"true\"]) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n  }\n\n  .sub-trigger-chevron {\n    @apply shrink-0 w-4 h-4;\n    margin-left: auto;\n    color: var(--foreground-400);\n  }\n\n  .sub-content {\n    @apply min-w-40 max-w-80;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "value"
      },
      {
        "name": "icon.left"
      },
      {
        "name": "icon.right"
      },
      {
        "name": "icon.section"
      },
      {
        "name": "input"
      },
      {
        "name": "overlay"
      },
      {
        "name": "scroller"
      },
      {
        "name": "list.root"
      },
      {
        "name": "list.padding"
      },
      {
        "name": "title"
      },
      {
        "name": "icon"
      },
      {
        "name": "text"
      },
      {
        "name": "content"
      },
      {
        "name": "description"
      },
      {
        "name": "search.wrapper"
      },
      {
        "name": "search.input"
      },
      {
        "name": "empty"
      }
    ],
    "styleableGroups": [
      {
        "name": "SelectStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the root wrapper. Its inline style is also copied onto the portalled content overlay so\nvariable overrides reach the floating panel; its class is not.",
            "type": "SlotStyle"
          }
        ]
      },
      {
        "name": "SelectTriggerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the trigger button.",
            "type": "Style"
          },
          {
            "name": "value",
            "description": "Styles the trigger value section.",
            "type": "Style"
          },
          {
            "name": "icon.left",
            "description": "Styles the prefix icon wrapper rendered before the trigger value.",
            "type": "Style"
          },
          {
            "name": "icon.right",
            "description": "Styles the chevron wrapper rendered inside the icon section.",
            "type": "Style"
          },
          {
            "name": "icon.section",
            "description": "Styles the section that holds the trailing chevron.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SearchableTriggerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the searchable trigger wrapper.",
            "type": "Style"
          },
          {
            "name": "value",
            "description": "Styles the section that holds the search input.",
            "type": "Style"
          },
          {
            "name": "input",
            "description": "Styles the search input surface.",
            "type": "Style"
          },
          {
            "name": "icon.right",
            "description": "Styles the chevron wrapper.",
            "type": "Style"
          },
          {
            "name": "icon.section",
            "description": "Styles the section that holds the chevron.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectSubTriggerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the submenu trigger option row.",
            "type": "Style"
          },
          {
            "name": "icon.right",
            "description": "Styles the right-pointing submenu indicator.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectSubContentStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the submenu listbox panel.",
            "type": "Style"
          },
          {
            "name": "overlay",
            "description": "Styles the positioned submenu overlay.",
            "type": "Style"
          },
          {
            "name": "scroller",
            "description": "Styles the scrollable surface that constrains the submenu height.",
            "type": "Style"
          },
          {
            "name": "list.root",
            "description": "Styles the element that groups the rendered submenu options.",
            "type": "Style"
          },
          {
            "name": "list.padding",
            "description": "Styles the padding wrapper around the submenu option list.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectGroupStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the group wrapper.",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "Styles the optional visible title above the grouped options.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectValueStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the value wrapper.",
            "type": "Style"
          },
          {
            "name": "icon",
            "description": "Styles the icon wrapper rendered before the value text.",
            "type": "Style"
          },
          {
            "name": "text",
            "description": "Styles the rendered value text.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the option row.",
            "type": "Style"
          },
          {
            "name": "icon",
            "description": "Styles the leading icon wrapper.",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "Styles the wrapper that stacks the label above a description.",
            "type": "Style"
          },
          {
            "name": "text",
            "description": "Styles the primary option text.",
            "type": "Style"
          },
          {
            "name": "description",
            "description": "Styles the secondary description text.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectListStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the list wrapper.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectSeparatorStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the separator element.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "SelectContentStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the listbox panel.",
            "type": "SlotStyle"
          },
          {
            "name": "overlay",
            "description": "Styles the positioned floating overlay.",
            "type": "SlotStyle"
          },
          {
            "name": "search.wrapper",
            "description": "Styles the wrapper around the panel search input.",
            "type": "SlotStyle"
          },
          {
            "name": "search.input",
            "description": "Styles the panel search input surface.",
            "type": "SlotStyle"
          },
          {
            "name": "empty",
            "description": "Styles the live empty-results message.",
            "type": "SlotStyle"
          },
          {
            "name": "list.root",
            "description": "Styles the element that groups the rendered options.",
            "type": "SlotStyle"
          },
          {
            "name": "list.padding",
            "description": "Styles the padding wrapper around the option list.",
            "type": "SlotStyle"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "color-mix(in srgb, var(--background-800) 30%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".select"
      },
      {
        "name": "--focus-visible",
        "value": "var(--accent-400)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-400"
        ],
        "variant": ".select"
      },
      {
        "name": "--focus-visible-background",
        "value": "var(--background-950)",
        "defaultValue": null,
        "referencedVars": [
          "--background-950"
        ],
        "variant": ".select"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".select"
      },
      {
        "name": "--size",
        "value": "var(--text-sm)",
        "defaultValue": null,
        "referencedVars": [
          "--text-sm"
        ],
        "variant": ".select"
      },
      {
        "name": "--icon-foreground",
        "value": "var(--foreground-400)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".select"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.5",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".select"
      },
      {
        "name": "--background-radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".select"
      },
      {
        "name": "--background-inner-radius",
        "value": "calc(\n      var(--background-radius) - slot(border, width, var(--border-width-base, 1px))\n    )",
        "defaultValue": "1px",
        "referencedVars": [
          "--background-radius",
          "--border-width-base"
        ],
        "variant": ".select"
      },
      {
        "name": "--padding-inline",
        "value": "calc(var(--spacing) * 2)",
        "defaultValue": null,
        "referencedVars": [
          "--spacing"
        ],
        "variant": ""
      },
      {
        "name": "--padding-block",
        "value": "calc(var(--spacing) * 1.5)",
        "defaultValue": null,
        "referencedVars": [
          "--spacing"
        ],
        "variant": ""
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": "&:not([data-disabled]):hover .icon-section,\n      &:not([data-disabled]):hover .value-section:not(:empty)"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": "&:not([data-disabled]):hover"
      },
      {
        "name": "--content-padding",
        "value": "calc(var(--spacing) * 2)",
        "defaultValue": null,
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".content,\n  .sub-content"
      },
      {
        "name": "--content-radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".content,\n  .sub-content"
      },
      {
        "name": "--content-inner-radius",
        "value": "calc(\n      var(--content-radius) - slot(border, width, var(--border-width-base, 1px))\n    )",
        "defaultValue": "1px",
        "referencedVars": [
          "--content-radius",
          "--border-width-base"
        ],
        "variant": ".content,\n  .sub-content"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.5",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".content,\n  .sub-content"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".sub-trigger[data-open=\"true\"]:not([data-highlighted=\"true\"])"
      }
    ]
  },
  "scroll": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    @apply relative;\n    min-height: 0;\n    isolation: isolate;\n  }\n\n  .vertical {\n    --scrollbar-width: 12px;\n  }\n\n  .horizontal {\n    --scrollbar-height: 12px;\n  }\n\n  .content {\n    @apply h-full w-full;\n    overflow: auto;\n  }\n\n  .vertical .content {\n    overflow-y: auto;\n    overflow-x: hidden;\n    scrollbar-width: none;\n    -webkit-overflow-scrolling: touch;\n  }\n\n  .vertical[data-inline=\"true\"] .content {\n    padding-inline-end: 16px;\n  }\n\n  .horizontal .content {\n    overflow-x: auto;\n    overflow-y: hidden;\n    scrollbar-width: none;\n    -webkit-overflow-scrolling: touch;\n  }\n\n  .horizontal[data-inline=\"true\"] .content {\n    padding-block-end: 16px;\n  }\n\n  .vertical .content::-webkit-scrollbar,\n  .horizontal .content::-webkit-scrollbar {\n    display: none;\n  }\n\n  .track {\n    @apply absolute;\n    z-index: 10;\n    background-color: var(--background);\n  }\n\n  .track[data-hide=\"true\"] .thumb {\n    transition-property: opacity;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .vertical .track {\n    right: 4px;\n    top: 0;\n    width: 12px;\n    height: 100%;\n    box-sizing: border-box;\n  }\n\n  .horizontal .track {\n    bottom: 2px;\n    left: 0;\n    height: 12px;\n    width: 100%;\n  }\n\n  .thumb {\n    position: absolute;\n    border-radius: calc(var(--radius-xs, 0.25rem) * 0.8);\n    background-color: var(--background);\n    transition-property: opacity, background-color, width, height;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .thumb:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .vertical .thumb {\n    width: 6px;\n    margin-left: 6px;\n    transition-property: opacity, background-color, width, margin-left;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .vertical .thumb:hover,\n  .vertical[data-pressed] .thumb {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    width: 8px;\n    margin-left: 4px;\n  }\n\n  .horizontal .thumb {\n    height: 6px;\n    margin-top: 6px;\n    transition-property: opacity, background-color, height, margin-top;\n    transition-duration: var(--hover-duration, var(--hover-leave-duration, 300ms));\n    transition-timing-function: var(\n      --hover-transition-timing-function,\n      var(--ease-snappy-pop, ease-out)\n    );\n  }\n\n  .horizontal .thumb:hover,\n  .horizontal[data-pressed] .thumb {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    height: 8px;\n    margin-top: 4px;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "content"
      },
      {
        "name": "track"
      },
      {
        "name": "thumb"
      }
    ],
    "styleableGroups": [
      {
        "name": "ScrollStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "",
            "type": "Style"
          },
          {
            "name": "track",
            "description": "",
            "type": "Style"
          },
          {
            "name": "thumb",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--scrollbar-width",
        "value": "12px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".vertical"
      },
      {
        "name": "--scrollbar-height",
        "value": "12px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".horizontal"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".thumb:hover"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".vertical .thumb:hover,\n  .vertical[data-pressed] .thumb"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".horizontal .thumb:hover,\n  .horizontal[data-pressed] .thumb"
      }
    ]
  },
  "radio": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .radio-items {\n    @apply flex flex-col gap-3;\n  }\n\n  .radio-item {\n    @apply flex items-start gap-3 cursor-pointer select-none;\n    position: relative;\n    overflow: visible;\n  }\n\n  .radio-surface {\n    @apply inline-flex shrink-0;\n    border-radius: 9999px;\n  }\n\n  .radio-input {\n    @apply absolute inset-0 h-full w-full cursor-pointer opacity-0;\n  }\n\n  .radio {\n    --disabled-opacity: 0.6;\n    @apply relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center;\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: 9999px;\n    background-color: var(--background);\n    color: var(--foreground);\n\n    &[data-focus-visible=\"true\"] {\n      outline: none;\n    }\n\n\n    &[data-error=\"true\"]:not([data-selected=\"true\"]) {\n      border-color: slot(border, background-error, slot(border, background, transparent));\n    }\n  }\n\n  .dot {\n    border-radius: 9999px;\n    background-color: var(--background);\n    transform: scale(0);\n  }\n\n  .radio[data-selected=\"true\"] .dot {\n    transform: scale(1);\n  }\n\n  @media (hover: hover) {\n    .radio-item:not([data-disabled=\"true\"]):hover .radio {\n      opacity: 0.9;\n    }\n  }\n\n  .radio-item[data-disabled=\"true\"] .radio {\n    opacity: var(--disabled-opacity);\n    cursor: not-allowed;\n  }\n\n  .radio-label {\n    @apply cursor-pointer;\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    user-select: none;\n\n    &[data-disabled=\"true\"] {\n      opacity: var(--disabled-opacity);\n      cursor: not-allowed;\n    }\n  }\n\n  .radio-description {\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    margin-top: 0.125rem;\n  }\n\n  .helper-text {\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    margin-top: 0.5rem;\n    margin-left: 2rem;\n  }\n\n  .radio.sm {\n    @apply h-4 w-4;\n  }\n\n  .radio.sm .dot {\n    width: 0.375rem;\n    height: 0.375rem;\n  }\n\n  .radio.md {\n    @apply h-5 w-5;\n  }\n\n  .radio.md .dot {\n    width: 0.5rem;\n    height: 0.5rem;\n  }\n\n  .radio.lg {\n    @apply h-6 w-6;\n  }\n\n  .radio.lg .dot {\n    width: 0.625rem;\n    height: 0.625rem;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "item"
      },
      {
        "name": "input"
      },
      {
        "name": "dot"
      },
      {
        "name": "label"
      },
      {
        "name": "description"
      },
      {
        "name": "helperText"
      },
      {
        "name": "group"
      }
    ],
    "styleableGroups": [
      {
        "name": "RadioStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "item",
            "description": "",
            "type": "Style"
          },
          {
            "name": "input",
            "description": "",
            "type": "Style"
          },
          {
            "name": "dot",
            "description": "",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "",
            "type": "Style"
          },
          {
            "name": "description",
            "description": "",
            "type": "Style"
          },
          {
            "name": "helperText",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "RadioGroupStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "",
            "type": "Style"
          },
          {
            "name": "description",
            "description": "",
            "type": "Style"
          },
          {
            "name": "group",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--control-track)",
        "defaultValue": null,
        "referencedVars": [
          "--control-track"
        ],
        "variant": ".radio"
      },
      {
        "name": "--focus-visible",
        "value": "color-mix(in srgb, var(--background-500) 40%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-500"
        ],
        "variant": ".radio"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".radio"
      }
    ]
  },
  "progress": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .progress {\n    --disabled-opacity: 0.6;\n    @apply w-full;\n  }\n\n  .progress[data-has-label=\"true\"] {\n    @apply space-y-1;\n  }\n\n  .progress[data-show-controls=\"true\"] {\n    touch-action: none;\n    user-select: none;\n    cursor: pointer;\n  }\n\n  .progress[data-disabled=\"true\"] {\n    opacity: var(--disabled-opacity, 0.6);\n    cursor: not-allowed;\n    pointer-events: none;\n  }\n\n  .label-row {\n    @apply flex items-center justify-between;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n  }\n\n  .label {\n    user-select: none;\n  }\n\n  .value {\n    font-variant-numeric: tabular-nums;\n  }\n\n  .track {\n    --thickness: var(--size, calc(var(--spacing-md) * 0.8));\n    position: relative;\n    inline-size: 100%;\n    block-size: var(--thickness);\n    border-radius: slot(track, radius, var(--radius, var(--radius-sm, 0.375rem)));\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    background-color: slot(track, background, var(--background));\n    overflow: visible;\n  }\n\n  .range {\n    position: absolute;\n    inset-block-start: 0;\n    inset-inline-start: 0;\n    block-size: 100%;\n    border-radius: slot(range, radius, var(--radius, var(--radius-sm, 0.375rem)));\n    background-color: slot(range, background, var(--background));\n    transition: none;\n    overflow: hidden;\n  }\n\n  .range[data-animated=\"true\"] {\n    animation: pulse 2s var(--ease-gentle-ease, ease-in-out) infinite;\n  }\n\n  .range[data-indeterminate=\"true\"] {\n    width: 33.333%;\n    animation: progress-indeterminate 1.5s var(--ease-gentle-ease, ease-in-out) infinite;\n  }\n\n  .thumb {\n    --thumb-inline-size: slot(thumb, width, var(--width, auto));\n    --thumb-block-size: slot(thumb, height, 100%);\n\n    position: absolute;\n    inset-block-start: var(--top, 0);\n    box-sizing: border-box;\n    inline-size: var(--thumb-inline-size);\n    block-size: var(--thumb-block-size);\n    aspect-ratio: slot(thumb, ratio, var(--ratio, 0.666667));\n    transform: var(--transform, translateX(-50%));\n    border-radius: slot(thumb, radius, var(--radius, var(--radius-sm, 0.375rem)));\n    background: slot(thumb, background, var(--background));\n    border: slot(thumb, border, none);\n    opacity: 0;\n    pointer-events: none;\n    transition: none;\n  }\n\n  .progress[data-show-controls=\"true\"]:hover .thumb,\n  .progress[data-show-controls=\"true\"][data-dragging=\"true\"] .thumb {\n    opacity: 1;\n    pointer-events: auto;\n  }\n\n  @keyframes pulse {\n    0%,\n    100% {\n      opacity: 1;\n    }\n    50% {\n      opacity: 0.5;\n    }\n  }\n\n  @keyframes progress-indeterminate {\n    0% {\n      transform: translateX(-100%);\n    }\n    100% {\n      transform: translateX(400%);\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "row"
      },
      {
        "name": "label"
      },
      {
        "name": "value"
      },
      {
        "name": "root"
      },
      {
        "name": "label.row"
      },
      {
        "name": "label.label"
      },
      {
        "name": "label.value"
      },
      {
        "name": "track"
      },
      {
        "name": "range"
      },
      {
        "name": "thumb"
      }
    ],
    "styleableGroups": [
      {
        "name": "ProgressLabelStyleSlots",
        "slots": [
          {
            "name": "row",
            "description": "Styles the row that contains the visible label and percentage.",
            "type": "SlotStyle"
          },
          {
            "name": "label",
            "description": "Styles the visible progress label.",
            "type": "SlotStyle"
          },
          {
            "name": "value",
            "description": "Styles the displayed percentage value.",
            "type": "SlotStyle"
          }
        ]
      },
      {
        "name": "ProgressStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the root progress container.",
            "type": "SlotStyle"
          },
          {
            "name": "label.row",
            "description": "Styles the row that contains the visible label and percentage.",
            "type": "SlotStyle"
          },
          {
            "name": "label.label",
            "description": "Styles the visible progress label.",
            "type": "SlotStyle"
          },
          {
            "name": "label.value",
            "description": "Styles the displayed percentage value.",
            "type": "SlotStyle"
          },
          {
            "name": "track",
            "description": "Styles the progress track.",
            "type": "SlotStyle"
          },
          {
            "name": "range",
            "description": "Styles the filled progress range.",
            "type": "SlotStyle"
          },
          {
            "name": "thumb",
            "description": "Styles the optional draggable thumb.",
            "type": "SlotStyle"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--size",
        "value": "var(--control-size)",
        "defaultValue": null,
        "referencedVars": [
          "--control-size"
        ],
        "variant": ".progress"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-400)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".progress"
      },
      {
        "name": "--disabled-opacity",
        "value": "0.6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".progress"
      },
      {
        "name": "--thickness",
        "value": "var(--size, calc(var(--spacing-md) * 0.8))",
        "defaultValue": "calc(var(--spacing-md",
        "referencedVars": [
          "--size"
        ],
        "variant": ".track"
      },
      {
        "name": "--thumb-inline-size",
        "value": "slot(thumb, width, var(--width, auto))",
        "defaultValue": "auto",
        "referencedVars": [
          "--width"
        ],
        "variant": ".thumb"
      },
      {
        "name": "--thumb-block-size",
        "value": "slot(thumb, height, 100%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".thumb"
      }
    ]
  },
  "popover": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .trigger {\n    @apply inline-block;\n  }\n\n  .root {\n    @apply fixed;\n    pointer-events: none;\n    z-index: 50000;\n  }\n\n  .content {\n    --fill: slot(content, background, var(--background));\n    /* Frame's SVG stroke remains a documented decorative API. */\n    --stroke-color: slot(content, background-border, var(--background-border));\n    --frame-radius: 8px;\n    opacity: 0;\n    transform: translate(0, 0);\n    transition:\n      opacity 0.2s ease-out,\n      transform 0.2s ease-out;\n    pointer-events: none;\n    min-width: 200px;\n    max-width: calc(100vw - 16px);\n  }\n\n  .content[data-visible=\"true\"] {\n    opacity: 1;\n    transform: translate(0, 0);\n    pointer-events: auto;\n  }\n\n  .content[data-instant] {\n    transition: none;\n  }\n\n  .frame {\n    @apply flex items-center gap-1.5 p-2.5;\n    color: slot(content, foreground, var(--foreground));\n    font-family: slot(content, font-family, var(--font-body, inherit));\n    font-size: slot(content, font-size, var(--text-body-size, var(--text-base, 0.9375rem)));\n    font-weight: slot(content, font-weight, var(--font-weight-body-normal, 400));\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "content"
      },
      {
        "name": "trigger"
      },
      {
        "name": "frame"
      }
    ],
    "styleableGroups": [
      {
        "name": "PopoverStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "",
            "type": "Style"
          },
          {
            "name": "trigger",
            "description": "",
            "type": "Style"
          },
          {
            "name": "frame",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--fill",
        "value": "slot(content, background, var(--background))",
        "defaultValue": null,
        "referencedVars": [
          "--background"
        ],
        "variant": ".content"
      },
      {
        "name": "--stroke-color",
        "value": "slot(content, background-border, var(--background-border))",
        "defaultValue": null,
        "referencedVars": [
          "--background-border"
        ],
        "variant": ".content"
      },
      {
        "name": "--frame-radius",
        "value": "8px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".content"
      }
    ]
  },
  "path": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .path {\n    @apply block;\n  }\n\n  .list {\n    @apply m-0 flex flex-wrap items-center gap-2 p-0;\n    list-style: none;\n  }\n\n  .item {\n    list-style: none;\n  }\n\n  .separator {\n    @apply m-0 flex items-center p-0;\n    list-style: none;\n    color: var(--foreground);\n    pointer-events: none;\n    user-select: none;\n  }\n\n  .link {\n    @apply relative cursor-pointer px-2 py-1;\n    border: 0;\n    /* Small radius on each entry so the focus ring matches rounded breadcrumbs. */\n    border-radius: slot(item, radius, var(--radius, var(--radius-sm, 0.375rem)));\n    background-color: slot(item, background, var(--background, transparent));\n    color: slot(item, foreground, var(--foreground, var(--foreground-100, currentColor)));\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    text-decoration: none;\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    outline: none;\n  }\n\n  button.link {\n    font: inherit;\n  }\n\n  .link:focus,\n  .link:focus-visible {\n    outline: none;\n  }\n\n  .link[data-hovered=\"true\"]:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: slot(item, background-hover, slot(item, background, var(--background, transparent)));\n    color: slot(item, foreground-hover, slot(item, foreground, var(--foreground, var(--foreground-100, currentColor))));\n  }\n\n  .link[data-pressed=\"true\"]:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n    background-color: slot(item, background-pressed, slot(item, background, var(--background, transparent)));\n  }\n\n  .link[data-selected=\"true\"] {\n    cursor: default;\n    color: slot(item, foreground-selected, slot(item, foreground, var(--foreground, var(--foreground-100, currentColor))));\n  }\n\n  .link[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: slot(item, disabled-opacity, var(--disabled-opacity, 0.6));\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "list"
      },
      {
        "name": "separator"
      }
    ],
    "styleableGroups": [
      {
        "name": "PathItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles applied to the rendered anchor, button, or span element.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "PathStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles applied to the root nav element.",
            "type": "Style"
          },
          {
            "name": "list",
            "description": "Styles applied to the ordered list element.",
            "type": "Style"
          },
          {
            "name": "separator",
            "description": "Styles applied to each separator rendered between items.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--foreground",
        "value": "var(--foreground-400)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".path"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".link[data-hovered=\"true\"]:not([data-disabled=\"true\"]):not([data-selected=\"true\"])"
      }
    ]
  },
  "panel": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .panel {\n    @apply flex h-full w-full min-h-0 min-w-0;\n    container-type: inline-size;\n    background: inherit;\n  }\n\n  .panel[data-orientation=\"vertical\"] {\n    flex-direction: column;\n  }\n\n  .panel > :not(.resize) {\n    min-width: 0;\n    min-height: 0;\n    flex: 1 1 0%;\n  }\n\n  .panel > .sidebar {\n    @apply min-h-0 shrink-0 overflow-hidden;\n    flex: 0 0 var(--size);\n  }\n\n  .sidebar[data-open=\"true\"] {\n    transition: flex-basis 0.2s ease;\n  }\n\n  .sidebar[data-open=\"false\"] {\n    flex-basis: var(--collapsed-size);\n    visibility: hidden;\n  }\n\n  .panel[data-stacked=\"true\"] > .sidebar {\n    width: 100%;\n    max-width: 100%;\n    flex-basis: auto;\n  }\n\n  .panel[data-stacked=\"true\"] > .sidebar[data-open=\"false\"] {\n    height: 0;\n    min-height: 0;\n    flex-basis: 0;\n  }\n\n  .resize {\n    @apply relative shrink-0;\n    width: 10px;\n    cursor: col-resize;\n    touch-action: none;\n    user-select: none;\n    background: transparent;\n  }\n\n  .resize::before {\n    content: \"\";\n    position: absolute;\n    inset-block: 0;\n    left: 50%;\n    width: 1px;\n    background: var(--divider-color, #374151);\n    transform: translateX(-50%);\n    transition: width var(--hover-leave-duration, 300ms) var(--ease-snappy-pop, ease-out);\n  }\n\n  .resize[data-orientation=\"vertical\"] {\n    width: auto;\n    height: 10px;\n    cursor: row-resize;\n  }\n\n  .resize[data-orientation=\"vertical\"]::before {\n    inset-block: auto;\n    inset-inline: 0;\n    top: 50%;\n    width: auto;\n    height: 1px;\n    transform: translateY(-50%);\n    transition: height var(--hover-leave-duration, 300ms) var(--ease-snappy-pop, ease-out);\n  }\n\n  .resize:hover::before,\n  .resize:focus-visible::before,\n  .resize[data-resizing=\"true\"]::before {\n    width: 2px;\n  }\n\n  .resize[data-orientation=\"vertical\"]:hover::before,\n  .resize[data-orientation=\"vertical\"]:focus-visible::before,\n  .resize[data-orientation=\"vertical\"][data-resizing=\"true\"]::before {\n    width: auto;\n    height: 2px;\n  }\n\n  .spacingNone,\n  .spacing-none {\n    gap: 0;\n  }\n\n  .spacingSm,\n  .spacing-sm {\n    gap: var(--spacing-sm, 0.5rem);\n  }\n\n  .spacingMd,\n  .spacing-md {\n    gap: var(--spacing-md, 1rem);\n  }\n\n  .spacingLg,\n  .spacing-lg {\n    gap: var(--spacing-lg, 1.5rem);\n  }\n\n  .compact {\n    gap: calc(var(--spacing-sm, 0.5rem) / 2);\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .sidebar[data-open=\"true\"] {\n      transition: none;\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      }
    ],
    "styleableGroups": [
      {
        "name": "PanelStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": []
  },
  "page": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .page {\n    --gap: 0;\n\n    @apply relative flex w-full min-w-0 flex-col;\n    box-sizing: border-box;\n    container-type: inline-size;\n    max-width: var(--max-width);\n    gap: var(--gap);\n    padding: var(--page-padding);\n  }\n\n  .page[data-centered=\"true\"] {\n    margin-inline: auto;\n  }\n\n  .page[data-fullscreen=\"true\"] {\n    min-height: 100dvh;\n    max-width: none;\n  }\n\n  .header,\n  .footer {\n    @apply w-full min-w-0;\n  }\n\n  .header {\n    z-index: 10;\n  }\n\n  .footer {\n    z-index: 5;\n  }\n\n  .sticky {\n    position: sticky;\n    background: inherit;\n  }\n\n  .header.sticky {\n    top: 0;\n  }\n\n  .footer.sticky {\n    bottom: 0;\n  }\n\n  .header.divided {\n    border-bottom: var(--border-width-base, 1px) solid var(--background-700);\n    padding-bottom: var(--page-padding);\n  }\n\n  .footer.divided {\n    border-top: var(--border-width-base, 1px) solid var(--background-700);\n    padding-top: var(--page-padding);\n  }\n\n  .body {\n    @apply flex w-full min-w-0 flex-none flex-col;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "header"
      },
      {
        "name": "body"
      },
      {
        "name": "footer"
      }
    ],
    "styleableGroups": [
      {
        "name": "PageStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header",
            "description": "",
            "type": "Style"
          },
          {
            "name": "body",
            "description": "",
            "type": "Style"
          },
          {
            "name": "footer",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--gap",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".page"
      }
    ]
  },
  "modal": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .overlay {\n    position: fixed;\n    inset: 0;\n    z-index: 9999;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    isolation: isolate;\n  }\n\n  .overlay[data-state=\"exiting\"] {\n    pointer-events: none;\n  }\n\n  .backdrop {\n    @apply absolute inset-0 cursor-pointer;\n    background-color: var(--background);\n    opacity: 0;\n    backdrop-filter: blur(0px);\n    pointer-events: none;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      backdrop-filter 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] .backdrop {\n    opacity: 1;\n    backdrop-filter: blur(4px);\n    pointer-events: auto;\n  }\n\n  .panel {\n    @apply relative flex w-full flex-col overflow-hidden;\n    z-index: 1;\n    opacity: 0;\n    transform: translateY(0.5rem) scale(0.98);\n    max-height: 90vh;\n    margin: 1rem;\n    color: var(--foreground);\n    background-color: var(--background);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius-sm, 0.375rem);\n    outline: none;\n    pointer-events: auto;\n    overflow: hidden;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      transform 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] .panel {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n\n  .panel[data-animation=\"fade\"] {\n    transform: none;\n    transition-property: opacity;\n  }\n\n  .overlay[data-state=\"entered\"] .panel[data-animation=\"fade\"] {\n    transform: none;\n  }\n\n  .overlay[data-state=\"exiting\"] .panel {\n    pointer-events: none;\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .backdrop,\n    .panel {\n      transition: none;\n    }\n  }\n\n  .header {\n    @apply flex shrink-0 items-center justify-between gap-2 px-6 py-4;\n    border-bottom: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n  }\n\n  .title {\n    @apply m-0;\n    font-family: var(--font-heading, var(--font-body, inherit));\n    font-size: var(--header-text-lg, var(--text-lg, 1.125rem));\n    font-weight: var(--font-weight-header-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-heading, 1.25);\n    color: var(--title-foreground, var(--foreground));\n  }\n\n  .spacer {\n    flex: 1;\n  }\n\n  .close {\n    @apply ml-auto flex items-center justify-center cursor-pointer;\n    background: none;\n    border: none;\n    color: var(--foreground);\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-hovered=\"true\"] {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n\n    &[data-pressed=\"true\"] {\n      transform: scale(0.92);\n    }\n\n    &[data-focus-visible=\"true\"] {\n      outline: 2px solid var(--focus-visible);\n      outline-offset: 2px;\n      border-radius: var(--radius-xs, 0.25rem);\n    }\n  }\n\n  .close-icon {\n    @apply h-5 w-5;\n  }\n\n  .content {\n    @apply px-3 py-1.5;\n    color: var(--foreground);\n  }\n\n  .body-scroll {\n    flex: 1 1 auto;\n    min-height: 0;\n  }\n\n  .body-static {\n    flex: 1 1 auto;\n    min-width: 0;\n    min-height: 0;\n    overflow: hidden;\n  }\n\n  .footer {\n    @apply flex shrink-0 items-center justify-between gap-4 px-6 py-4;\n    background-color: var(--footer-background, var(--background));\n    border-top: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n  }\n\n  /* Size variants. :where() keeps these at the same specificity as `.panel`\n     itself (an attribute selector alone would outrank a plain consumer\n     className like `max-w-3xl`, which should always be free to override the\n     default size). */\n  .panel:where([data-size=\"fit\"]) {\n    width: fit-content;\n  }\n\n  .panel:where([data-size=\"auto\"]) {\n    max-width: min(90vw, 28rem);\n  }\n\n  /* Media queries for smaller screens */\n  @media (max-width: 640px) {\n    .panel {\n      margin: 1rem;\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "overlay"
      },
      {
        "name": "backdrop"
      },
      {
        "name": "header"
      },
      {
        "name": "title"
      },
      {
        "name": "spacer"
      },
      {
        "name": "close"
      },
      {
        "name": "closeIcon"
      },
      {
        "name": "content"
      },
      {
        "name": "footer"
      }
    ],
    "styleableGroups": [
      {
        "name": "ModalStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "overlay",
            "description": "",
            "type": "Style"
          },
          {
            "name": "backdrop",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header",
            "description": "",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "",
            "type": "Style"
          },
          {
            "name": "spacer",
            "description": "",
            "type": "Style"
          },
          {
            "name": "close",
            "description": "",
            "type": "Style"
          },
          {
            "name": "closeIcon",
            "description": "",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "",
            "type": "Style"
          },
          {
            "name": "footer",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-950)",
        "defaultValue": null,
        "referencedVars": [
          "--background-950"
        ],
        "variant": ".modal"
      },
      {
        "name": "--focus-visible",
        "value": "var(--accent-400)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-400"
        ],
        "variant": ".modal"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".modal"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".close[data-hovered=\"true\"]"
      }
    ]
  },
  "menu": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .overlay {\n    display: block;\n    position: absolute;\n  }\n\n  .trigger {\n    @apply inline-flex items-center justify-center;\n    min-inline-size: 0;\n    cursor: pointer;\n    outline: none;\n    user-select: none;\n\n    &[data-disabled=\"true\"] {\n      opacity: var(--disabled-opacity, 0.5);\n      pointer-events: none;\n    }\n  }\n\n  .panel {\n    --padding: calc(var(--spacing, 0.25rem) * 2);\n    --radius: var(--radius-sm, 0.375rem);\n    --inner-radius: calc(var(--radius) - slot(border, width, var(--border-width-base, 1px)));\n\n    @apply min-w-40 max-w-80 overflow-hidden;\n    box-sizing: border-box;\n    background-color: var(--background);\n    color: var(--foreground);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius);\n    outline: none;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      transform 180ms var(--press-ease, cubic-bezier(0.34, 1.56, 0.64, 1));\n\n    .viewport {\n      padding: calc(var(--padding) / 2);\n    }\n\n    .group {\n      display: contents;\n    }\n\n    .item {\n      @apply flex min-w-0 items-center gap-2;\n      padding-block: calc(var(--padding) / 1.5);\n      padding-inline: var(--padding);\n      border-radius: slot(item, radius, var(--inner-radius));\n      cursor: pointer;\n      user-select: none;\n      outline: none;\n      font-family: var(--font-body, inherit);\n      font-size: var(--text-sm, 0.875rem);\n      font-weight: var(--font-weight-body-medium, 500);\n      letter-spacing: normal;\n      line-height: var(--leading-sm, 1.25rem);\n    }\n\n    .item[data-disabled=\"true\"] {\n      opacity: slot(item, disabled-opacity, var(--disabled-opacity, 0.5));\n      pointer-events: none;\n    }\n\n    .item[data-inset=\"true\"] {\n      padding-inline-start: calc(var(--padding) * 2.67);\n    }\n\n    .indicator {\n      @apply flex shrink-0 items-center justify-center;\n      block-size: 1rem;\n      inline-size: 1rem;\n      color: slot(indicator, foreground, var(--indicator-foreground, var(--foreground)));\n    }\n\n    .indicator-check {\n      block-size: 0.75rem;\n      inline-size: 0.75rem;\n    }\n\n    .indicator-dot {\n      block-size: 0.5rem;\n      inline-size: 0.5rem;\n      fill: currentColor;\n    }\n\n    .sub-trigger {\n      inline-size: 100%;\n      color: var(--foreground);\n      background-color: slot(item, background, var(--background, transparent));\n    }\n\n    .sub-trigger[data-disabled=\"true\"] {\n      color: var(--foreground-muted, var(--foreground-400));\n    }\n\n    .chevron {\n      @apply shrink-0;\n      block-size: 1rem;\n      inline-size: 1rem;\n      margin-inline-start: auto;\n      color: var(--foreground-muted, var(--foreground-400));\n    }\n\n    .label {\n      padding-block: calc(var(--padding) / 2);\n      padding-inline: var(--padding);\n      color: var(--foreground-muted, var(--foreground-400));\n      font-family: var(--font-body, inherit);\n      font-size: var(--text-sm, 0.875rem);\n      font-weight: var(--font-weight-body-medium, 500);\n      letter-spacing: normal;\n      line-height: var(--leading-sm, 1.25rem);\n    }\n\n    .label[data-inset=\"true\"] {\n      padding-inline-start: calc(var(--padding) * 2.67);\n    }\n\n    .separator {\n      @apply my-1;\n      margin-inline: calc(var(--padding) / -2);\n      block-size: 1px;\n      background-color: slot(border, background, transparent);\n    }\n\n    .shortcut {\n      margin-inline-start: auto;\n      color: var(--foreground-muted, var(--foreground-400));\n      font-family: var(--font-mono, ui-monospace, monospace);\n      font-size: var(--text-code-size, var(--text-sm, 0.875rem));\n      font-weight: var(--font-weight-code, var(--font-weight-body-normal, 400));\n      letter-spacing: var(--letter-spacing-code, 0);\n      line-height: var(--leading-code, 1.5);\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "overlay"
      },
      {
        "name": "list.root"
      },
      {
        "name": "list.padding"
      },
      {
        "name": "indicator"
      },
      {
        "name": "chevron"
      }
    ],
    "styleableGroups": [
      {
        "name": "MenuTriggerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the rendered trigger element.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuContentStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the menu panel.",
            "type": "Style"
          },
          {
            "name": "overlay",
            "description": "Styles the positioned floating overlay that holds the panel.",
            "type": "Style"
          },
          {
            "name": "list.root",
            "description": "Styles the element that groups the rendered menu items.",
            "type": "Style"
          },
          {
            "name": "list.padding",
            "description": "Styles the padding wrapper around the item list.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuGroupStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the group container.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the item row.",
            "type": "Style"
          },
          {
            "name": "indicator",
            "description": "Styles the leading selection indicator rendered while selectionMode is not none.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuCheckboxItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the item row.",
            "type": "Style"
          },
          {
            "name": "indicator",
            "description": "Styles the leading checkmark indicator.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuRadioGroupStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the radio group container.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuRadioItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the item row.",
            "type": "Style"
          },
          {
            "name": "indicator",
            "description": "Styles the leading radio indicator.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuLabelStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the label element.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuSeparatorStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the separator rule.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuShortcutStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the shortcut hint.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuSubTriggerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the submenu trigger row.",
            "type": "Style"
          },
          {
            "name": "chevron",
            "description": "Styles the trailing chevron that indicates the submenu.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "MenuSubContentStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the submenu panel.",
            "type": "Style"
          },
          {
            "name": "overlay",
            "description": "Styles the positioned floating overlay that holds the submenu panel.",
            "type": "Style"
          },
          {
            "name": "list.root",
            "description": "Styles the element that groups the rendered submenu items.",
            "type": "Style"
          },
          {
            "name": "list.padding",
            "description": "Styles the padding wrapper around the submenu item list.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--padding",
        "value": "calc(var(--spacing, 0.25rem) * 2)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".panel"
      },
      {
        "name": "--radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".panel"
      },
      {
        "name": "--inner-radius",
        "value": "calc(var(--radius) - slot(border, width, var(--border-width-base, 1px)))",
        "defaultValue": "1px",
        "referencedVars": [
          "--radius",
          "--border-width-base"
        ],
        "variant": ".panel"
      }
    ]
  },
  "mask": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .mask {\n    @apply relative h-full w-full;\n  }\n}\n\n.mask[style*=\"mask-image\"],\n.mask[style*=\"-webkit-mask-image\"] {\n  -webkit-mask-size: 100% 100%;\n  mask-size: 100% 100%;\n}\n\n.mask[style*=\"--mask-clip-path\"] {\n  clip-path: var(--mask-clip-path);\n}\n\n.mask-gradient {\n  background: var(--mask-gradient);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n  color: transparent;\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "gradient"
      }
    ],
    "styleableGroups": [
      {
        "name": "MaskStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "gradient",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": []
  },
  "list": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .root {\n    color: var(--foreground, var(--foreground-100, currentColor));\n    @apply flex flex-col;\n    gap: var(--gap, calc(var(--spacing, 0.25rem) * 0.5));\n  }\n\n  .root[data-orientation=\"horizontal\"] {\n    @apply flex-row flex-wrap;\n  }\n\n  .item {\n    inline-size: 100%;\n    min-inline-size: 0;\n    box-sizing: border-box;\n    border-radius: slot(item, radius, var(--radius, var(--radius-sm, 0.375rem)));\n    @apply flex items-center gap-3 px-3 py-1 cursor-pointer;\n    background-color: slot(item, background, var(--background, transparent));\n    color: slot(item, foreground, var(--foreground, var(--foreground-100, currentColor)));\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .item[data-list-layout=\"columns\"] {\n    display: grid;\n  }\n\n  .item[data-list-layout=\"columns\"] > * {\n    min-width: 0;\n  }\n\n  .item[data-focus-visible=\"true\"] {\n    box-shadow:\n      inset 0 0 0 1px\n        slot(item, focus-visible-background, var(--focus-visible-background, var(--accent-400))),\n      0 0 0 2px slot(item, focus-visible, var(--focus-visible, var(--accent-400)));\n    outline: none;\n  }\n\n  .item:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  /* Composed lists (Select, Menu) keep rows non-focusable and drive data-highlighted\n     themselves, so the highlight cannot be gated on the root's own keyboard mode. */\n  .item[data-highlighted=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .item:hover:not([data-disabled=\"true\"]),\n  .item[data-highlighted=\"true\"]:not([data-disabled=\"true\"]) {\n    background-color: slot(item, background-hover, slot(item, background, var(--background, transparent)));\n    color: slot(item, foreground-hover, slot(item, foreground, var(--foreground, var(--foreground-100, currentColor))));\n  }\n\n  .item[data-selected=\"true\"] {\n    background-color: slot(item, background-selected, slot(item, background, var(--background, transparent)));\n    color: slot(item, foreground-selected, slot(item, foreground, var(--foreground, var(--foreground-100, currentColor))));\n  }\n\n  .item[data-selected=\"true\"]:hover:not([data-disabled=\"true\"]),\n  .item[data-selected=\"true\"][data-highlighted=\"true\"]:not([data-disabled=\"true\"]) {\n    background-color: slot(item, background-selected-hover, slot(item, background-selected, slot(item, background, var(--background, transparent))));\n    color: slot(item, foreground-selected-hover, slot(item, foreground-selected, slot(item, foreground, var(--foreground, var(--foreground-100, currentColor)))));\n  }\n\n  .item[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: slot(item, disabled-opacity, var(--disabled-opacity, 0.6));\n    pointer-events: none;\n  }\n\n  .checkbox,\n  .control,\n  .media {\n    @apply flex items-center justify-center flex-shrink-0;\n  }\n\n  .control {\n    margin-inline-start: auto;\n  }\n\n  .item[data-list-layout=\"columns\"] .control,\n  .item[data-list-layout=\"columns\"] .actions {\n    margin-inline-start: 0;\n    justify-self: end;\n  }\n\n  .control[data-placement=\"start\"] {\n    margin-inline-start: 0;\n  }\n\n  .item[data-list-layout=\"columns\"] .control[data-placement=\"start\"],\n  .item[data-list-layout=\"columns\"] .checkbox,\n  .item[data-list-layout=\"columns\"] .media {\n    justify-self: start;\n  }\n\n  .media {\n    block-size: 2rem;\n    inline-size: 2rem;\n  }\n\n  .title {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: slot(item, foreground, var(--foreground, var(--foreground-100, currentColor)));\n  }\n\n  .desc {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    color: slot(item, desc-foreground, var(--desc-foreground, var(--foreground-300, currentColor)));\n  }\n\n  .action-group {\n    @apply flex items-center;\n    padding-inline: 0.25rem;\n  }\n\n  .action-group[data-justify=\"between\"] {\n    justify-content: space-between;\n  }\n  .action-group[data-justify=\"start\"] {\n    justify-content: flex-start;\n  }\n  .action-group[data-justify=\"end\"] {\n    justify-content: flex-end;\n  }\n\n  .actions {\n    align-items: center;\n    gap: 0.25rem;\n    margin-inline-start: auto;\n    flex-shrink: 0;\n    @apply flex p-1.5 opacity-70 transition-opacity;\n  }\n\n  .item:hover .actions,\n  .item:focus-within .actions {\n    opacity: 1;\n  }\n\n  .action {\n    @apply flex items-center justify-center;\n    border-radius: 0.25rem;\n    background-color: slot(action, background, var(--background, transparent));\n    color: slot(action, foreground, var(--foreground, var(--foreground-100, currentColor)));\n    @apply p-2;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .action:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: slot(action, background-hover, slot(action, background, var(--background, transparent)));\n    color: slot(action, foreground-hover, slot(action, foreground, var(--foreground, var(--foreground-100, currentColor))));\n  }\n\n  .header,\n  .footer,\n  .divider {\n    min-inline-size: 0;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "header"
      },
      {
        "name": "item.root"
      },
      {
        "name": "item.checkbox"
      },
      {
        "name": "item.control"
      },
      {
        "name": "item.media"
      },
      {
        "name": "item.title"
      },
      {
        "name": "item.desc"
      },
      {
        "name": "item.actions"
      },
      {
        "name": "item.action"
      },
      {
        "name": "actionGroup"
      },
      {
        "name": "divider"
      },
      {
        "name": "footer"
      },
      {
        "name": "checkbox"
      },
      {
        "name": "control"
      },
      {
        "name": "media"
      },
      {
        "name": "title"
      },
      {
        "name": "desc"
      },
      {
        "name": "actions"
      },
      {
        "name": "action"
      }
    ],
    "styleableGroups": [
      {
        "name": "ListStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "The listbox root element.",
            "type": "Style"
          },
          {
            "name": "header",
            "description": "The semantic header region.",
            "type": "Style"
          },
          {
            "name": "item.root",
            "description": "The option row.",
            "type": "Style"
          },
          {
            "name": "item.checkbox",
            "description": "The non-interactive checkbox indicator wrapper.",
            "type": "Style"
          },
          {
            "name": "item.control",
            "description": "A wrapper around an embedded interactive control.",
            "type": "Style"
          },
          {
            "name": "item.media",
            "description": "The leading media area.",
            "type": "Style"
          },
          {
            "name": "item.title",
            "description": "The primary text label.",
            "type": "Style"
          },
          {
            "name": "item.desc",
            "description": "The secondary description text.",
            "type": "Style"
          },
          {
            "name": "item.actions",
            "description": "The trailing actions container.",
            "type": "Style"
          },
          {
            "name": "item.action",
            "description": "An action button generated by List.Actions.",
            "type": "Style"
          },
          {
            "name": "actionGroup",
            "description": "The List.ActionGroup element.",
            "type": "Style"
          },
          {
            "name": "divider",
            "description": "The List.Divider element.",
            "type": "Style"
          },
          {
            "name": "footer",
            "description": "The semantic footer region.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ListItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "The option row.",
            "type": "Style"
          },
          {
            "name": "checkbox",
            "description": "The non-interactive checkbox indicator wrapper.",
            "type": "Style"
          },
          {
            "name": "control",
            "description": "A wrapper around an embedded interactive control.",
            "type": "Style"
          },
          {
            "name": "media",
            "description": "The leading media area.",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "The primary text label.",
            "type": "Style"
          },
          {
            "name": "desc",
            "description": "The secondary description text.",
            "type": "Style"
          },
          {
            "name": "actions",
            "description": "The trailing actions container.",
            "type": "Style"
          },
          {
            "name": "action",
            "description": "An action button generated by List.Actions.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--foreground",
        "value": "var(--foreground-50)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-50"
        ],
        "variant": ".list"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".item:hover"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".item[data-highlighted=\"true\"]"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".action:hover"
      }
    ]
  },
  "label": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .label {\n    --background: transparent;\n    --foreground: var(--foreground-primary);\n    --disabled-foreground: var(--foreground-secondary);\n    --error-foreground: var(--danger-600);\n    --helper-color: var(--foreground-secondary);\n    --helper-error-color: var(--danger-600);\n    --required-color: var(--danger-600);\n  }\n\n  .text {\n    display: block;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n    transition: color 150ms ease;\n\n    &[data-disabled] {\n      color: var(--disabled-foreground);\n      opacity: 0.6;\n      cursor: not-allowed;\n    }\n\n    &[data-error] {\n      color: var(--error-foreground);\n    }\n  }\n\n  .required-indicator {\n    margin-left: 0.25rem;\n    color: var(--required-color);\n  }\n\n  .helper-text {\n    display: block;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    margin-top: 0.25rem;\n    transition: color 150ms ease;\n    color: var(--helper-color);\n\n    &[data-error] {\n      color: var(--helper-error-color);\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "text"
      },
      {
        "name": "requiredIndicator"
      },
      {
        "name": "helperText"
      }
    ],
    "styleableGroups": [
      {
        "name": "LabelStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "text",
            "description": "",
            "type": "Style"
          },
          {
            "name": "requiredIndicator",
            "description": "",
            "type": "Style"
          },
          {
            "name": "helperText",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".label"
      },
      {
        "name": "--disabled-foreground",
        "value": "var(--foreground-400)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".label"
      },
      {
        "name": "--error-foreground",
        "value": "var(--danger-600)",
        "defaultValue": null,
        "referencedVars": [
          "--danger-600"
        ],
        "variant": ".label"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".label"
      },
      {
        "name": "--background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".label"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-primary)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-primary"
        ],
        "variant": ".label"
      },
      {
        "name": "--disabled-foreground",
        "value": "var(--foreground-secondary)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-secondary"
        ],
        "variant": ".label"
      },
      {
        "name": "--error-foreground",
        "value": "var(--danger-600)",
        "defaultValue": null,
        "referencedVars": [
          "--danger-600"
        ],
        "variant": ".label"
      },
      {
        "name": "--helper-color",
        "value": "var(--foreground-secondary)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-secondary"
        ],
        "variant": ".label"
      },
      {
        "name": "--helper-error-color",
        "value": "var(--danger-600)",
        "defaultValue": null,
        "referencedVars": [
          "--danger-600"
        ],
        "variant": ".label"
      },
      {
        "name": "--required-color",
        "value": "var(--danger-600)",
        "defaultValue": null,
        "referencedVars": [
          "--danger-600"
        ],
        "variant": ".label"
      }
    ]
  },
  "input": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .scope {\n    @apply flex;\n    position: relative;\n    min-width: 0;\n    overflow: visible;\n  }\n\n  .input {\n    height: fit-content;\n    min-width: 0;\n    flex: 1;\n    @apply py-1.5 px-3;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground, currentColor);\n    background-color: transparent;\n    border: none;\n    outline: none;\n    box-sizing: border-box;\n\n    &::placeholder {\n      color: var(--placeholder, var(--foreground, currentColor));\n    }\n\n    &[data-disabled] {\n      color: var(--disabled-foreground, var(--foreground, currentColor));\n      cursor: not-allowed;\n    }\n\n    /* Hide default browser spinners for number inputs */\n    &[type=\"number\"] {\n      &::-webkit-outer-spin-button,\n      &::-webkit-inner-spin-button {\n        -webkit-appearance: none;\n        margin: 0;\n        display: none;\n      }\n\n      /* Firefox */\n      &[type=\"number\"] {\n        -moz-appearance: textfield;\n      }\n    }\n  }\n\n  /* Content wrapper used in place of the native input when children are\n     provided. Shares .input's box so composite fields line up with plain ones. */\n  .content {\n    @apply flex items-center;\n    cursor: text;\n  }\n\n  .icon-wrapper {\n    @apply z-10 flex items-center;\n    pointer-events: none;\n  }\n\n  .icon {\n    @apply flex items-center shrink-0;\n    color: var(--foreground, currentColor);\n  }\n\n  .container {\n    --adornment-offset: calc(var(--spacing, 0.25rem) * 1.5);\n    --action-inset: calc(var(--spacing, 0.25rem) * 0.5);\n    --background-radius: var(--radius-sm, 0.375rem);\n    --background-inner-radius: calc(var(--background-radius) - slot(border, width, var(--border-width-base, 1px)));\n\n    display: flex;\n    align-items: center;\n    min-width: 0;\n    flex: 1;\n    background-color: var(--background, transparent);\n    border:\n      slot(border, width, var(--border-width-base, 1px))\n      slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--background-radius);\n    box-sizing: border-box;\n    overflow: hidden;\n    transition: border-color var(--focus-transition-duration, 150ms)\n      var(--focus-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &[data-disabled] {\n      background-color: var(--disabled-background, var(--background, transparent));\n      cursor: not-allowed;\n      opacity: 0.5;\n    }\n\n    &[data-variant=\"ghost\"] {\n      background-color: transparent;\n      border-color: transparent;\n    }\n\n    &[data-focused=\"true\"]:not([data-disabled]) {\n      border-color: slot(\n        border,\n        background-focus,\n        slot(border, background, transparent)\n      );\n    }\n  }\n\n  .prefix,\n  .suffix {\n    @apply flex items-center gap-1;\n    align-self: stretch;\n    flex-shrink: 0;\n    pointer-events: none;\n  }\n\n  .prefix {\n    @apply pl-2.5;\n  }\n\n  .suffix {\n    padding-right: var(--adornment-offset);\n\n    &:has(.actions) {\n      padding-right: var(--action-inset);\n    }\n\n    &:has(.controls) {\n      padding-right: 0;\n    }\n\n    &:has(.hint) {\n      padding-right: 0;\n    }\n  }\n\n  .actions {\n    @apply flex items-center gap-0.5;\n    padding-block: var(--action-inset);\n    pointer-events: auto;\n  }\n\n  .action {\n    @apply flex items-center justify-center;\n    border-radius: var(--background-inner-radius);\n    background-color: var(--background, transparent);\n    color: var(--foreground, currentColor);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .action:global(.button):global(.icon) {\n    --size: calc(var(--spacing, 0.25rem) * 7);\n    --padding-block: calc(var(--spacing, 0.25rem) * 1.5);\n    --padding-inline: calc(var(--spacing, 0.25rem) * 1.5);\n  }\n\n  .action:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .hint {\n    @apply inline-flex items-center justify-center whitespace-nowrap;\n    flex-shrink: 0;\n    margin-inline-start: calc(var(--spacing, 0.25rem) * 0.5);\n    margin-inline-end: var(--adornment-offset);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    line-height: 1; /* adornment is vertically centered by its fixed surface */\n    color: var(--foreground, currentColor);\n    background-color: var(--background, transparent);\n    pointer-events: auto;\n  }\n\n  .controls {\n    @apply flex w-7.5 flex-col;\n    align-self: stretch;\n    min-height: 100%;\n    border-left:\n      slot(border, width, var(--border-width-base, 1px))\n      slot(border, style, solid)\n      slot(border, background, transparent);\n    pointer-events: auto;\n  }\n\n  .controls[data-disabled] {\n    opacity: 0.5;\n    cursor: not-allowed;\n  }\n\n  .stepper {\n    @apply flex w-full flex-1 items-center justify-center p-0 cursor-pointer;\n    flex: 1;\n    background-color: transparent;\n    border: none;\n    color: var(--foreground, currentColor);\n    --active-background: var(--background-700);\n    --active-color: var(--foreground-100);\n    transition:\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    & + .stepper {\n      border-top:\n        slot(border, width, var(--border-width-base, 1px))\n        slot(border, style, solid)\n        slot(border, background, transparent);\n    }\n\n    &:hover:not(:disabled) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      background-color: var(--hover-background, transparent);\n      color: var(--hover-color, var(--foreground, currentColor));\n    }\n\n    &:active:not(:disabled) {\n      background-color: var(--active-background, var(--hover-background, transparent));\n      color: var(--active-color, var(--foreground, currentColor));\n    }\n\n    &:disabled {\n      cursor: not-allowed;\n      opacity: 0.5;\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "input"
      },
      {
        "name": "adornments.start"
      },
      {
        "name": "adornments.end"
      },
      {
        "name": "icon.left"
      },
      {
        "name": "icon.right"
      },
      {
        "name": "actions.left"
      },
      {
        "name": "actions.right"
      },
      {
        "name": "hint"
      },
      {
        "name": "controls"
      },
      {
        "name": "stepper.up"
      },
      {
        "name": "stepper.down"
      }
    ],
    "styleableGroups": [
      {
        "name": "InputStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the visual input surface.",
            "type": "Style"
          },
          {
            "name": "input",
            "description": "Styles the native input or custom input content surface.",
            "type": "Style"
          },
          {
            "name": "adornments.start",
            "description": "Styles the wrapper containing leading icons and actions.",
            "type": "Style"
          },
          {
            "name": "adornments.end",
            "description": "Styles the wrapper containing trailing icons, actions, hints, and controls.",
            "type": "Style"
          },
          {
            "name": "icon.left",
            "description": "Styles the icon before the input value.",
            "type": "Style"
          },
          {
            "name": "icon.right",
            "description": "Styles the icon after the input value.",
            "type": "Style"
          },
          {
            "name": "actions.left",
            "description": "Styles the actions before the input value.",
            "type": "Style"
          },
          {
            "name": "actions.right",
            "description": "Styles the actions after the input value.",
            "type": "Style"
          },
          {
            "name": "hint",
            "description": "Styles the hint content.",
            "type": "Style"
          },
          {
            "name": "controls",
            "description": "Styles the number-input controls wrapper.",
            "type": "Style"
          },
          {
            "name": "stepper.up",
            "description": "Styles the increment button.",
            "type": "Style"
          },
          {
            "name": "stepper.down",
            "description": "Styles the decrement button.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-900)",
        "defaultValue": null,
        "referencedVars": [
          "--background-900"
        ],
        "variant": ".input"
      },
      {
        "name": "--disabled-background",
        "value": "var(--background-900)",
        "defaultValue": null,
        "referencedVars": [
          "--background-900"
        ],
        "variant": ".input"
      },
      {
        "name": "--disabled-foreground",
        "value": "var(--foreground-400)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".input"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".input"
      },
      {
        "name": "--placeholder",
        "value": "color-mix(in srgb, var(--foreground-400) 80%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".input"
      },
      {
        "name": "--adornment-offset",
        "value": "calc(var(--spacing, 0.25rem) * 1.5)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".container"
      },
      {
        "name": "--action-inset",
        "value": "calc(var(--spacing, 0.25rem) * 0.5)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".container"
      },
      {
        "name": "--background-radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".container"
      },
      {
        "name": "--background-inner-radius",
        "value": "calc(var(--background-radius) - slot(border, width, var(--border-width-base, 1px)))",
        "defaultValue": "1px",
        "referencedVars": [
          "--background-radius",
          "--border-width-base"
        ],
        "variant": ".container"
      },
      {
        "name": "--size",
        "value": "calc(var(--spacing, 0.25rem) * 7)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".action:global(.button):global(.icon)"
      },
      {
        "name": "--padding-block",
        "value": "calc(var(--spacing, 0.25rem) * 1.5)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".action:global(.button):global(.icon)"
      },
      {
        "name": "--padding-inline",
        "value": "calc(var(--spacing, 0.25rem) * 1.5)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".action:global(.button):global(.icon)"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".action:hover"
      },
      {
        "name": "--active-background",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".stepper"
      },
      {
        "name": "--active-color",
        "value": "var(--foreground-100)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-100"
        ],
        "variant": ".stepper"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".stepper:hover:not(:disabled)"
      }
    ]
  },
  "icon": {
    "rawCss": "@layer components.defaults {\n  .icon {\n    display: inline-block;\n    flex: none;\n    vertical-align: middle;\n    background-color: currentColor;\n    -webkit-mask-position: center;\n    mask-position: center;\n    -webkit-mask-repeat: no-repeat;\n    mask-repeat: no-repeat;\n    -webkit-mask-size: contain;\n    mask-size: contain;\n  }\n}\n",
    "styleableParts": [],
    "styleableGroups": [],
    "cssVariables": []
  },
  "group": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .group {\n    --radius-size: calc(var(--spacing) * 1.5);\n    --padding-size: var(--radius-size);\n    --background-radius: var(--radius-sm, 0.375rem);\n    --background-inner-radius: calc(var(--background-radius) - slot(border, width, var(--border-width-base, 1px)));\n    --text-height: calc(0.8em * var(--leading-tight, 1.25));\n    --vertical-spacing: calc(var(--spacing) * 4);\n    --border-height: calc(slot(border, width, var(--border-width-base, 1px)) * 2);\n    --padding-height: calc(var(--padding-size) * 2);\n    --control-height: calc(var(--text-height) + var(--vertical-spacing) + var(--border-height));\n    --item-height: max(\n      calc(var(--control-height) - var(--padding-height) - var(--border-height)),\n      0px\n    );\n\n    @apply flex overflow-hidden shrink-0 box-border;\n    color: var(--foreground, currentColor);\n    background-color: var(--background, transparent);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--background-radius);\n    padding: var(--padding-size);\n\n    &.horizontal {\n      @apply flex-row items-stretch;\n      block-size: var(--control-height);\n\n      .item.divider {\n        margin-block: calc(var(--padding-size) * -1);\n      }\n      .item [role=\"separator\"][aria-orientation=\"vertical\"] {\n        block-size: 100%;\n      }\n    }\n\n    &.vertical {\n      @apply flex-col;\n\n      .item.divider {\n        margin-inline: calc(var(--padding-size) * -1);\n      }\n      .item [role=\"separator\"][aria-orientation=\"horizontal\"] {\n        inline-size: 100%;\n      }\n    }\n\n    &.none {\n      --padding-size: 0px;\n      @apply gap-0;\n    }\n\n    &.xs {\n      --radius-size: calc(var(--spacing) * 0.875);\n      @apply space-x-0.5;\n    }\n\n    &.sm {\n      --radius-size: calc(var(--spacing) * 1.25);\n      @apply space-x-1;\n    }\n  }\n\n  .item {\n    @apply flex items-stretch;\n    position: relative;\n    isolation: isolate;\n    box-sizing: border-box;\n    min-inline-size: 0;\n    border-radius: slot(item, radius, 0);\n    overflow: visible;\n\n    &.grow {\n      flex: 1;\n    }\n\n    &.divider {\n      @apply p-0 shrink-0 flex-none;\n\n      > [role=\"separator\"] {\n        flex: 0 0 auto;\n      }\n    }\n  }\n\n  :is(.button, .input, .select, .expand) {\n    block-size: 100%;\n    min-block-size: var(--item-height);\n    min-inline-size: 0;\n    box-sizing: border-box;\n    position: relative;\n    isolation: isolate;\n    overflow: visible;\n  }\n\n  .button {\n    @apply flex box-border;\n    /* Keep connected controls geometrically stable while pressed. The theme's\n       pressed colors provide feedback without pulling the button away from its\n       neighboring group items. Use no transform at all rather than scale(1),\n       which can still subtly alter text rendering on a composited layer.\n       Standalone Buttons retain their scale effect. */\n    --press-transform: none;\n    inline-size: auto;\n    border-radius: slot(item, radius, var(--background-inner-radius));\n  }\n\n  /* Button resolves icon-only state itself. Put the square sizing contract on\n     the flex item so its intrinsic inline contribution matches its rendered\n     width after the Group's block size is resolved. */\n  .horizontal .item:has(.button[data-icon-only=\"true\"]):not(:has([role=\"separator\"])) {\n    flex: 0 0 auto;\n    aspect-ratio: 1;\n  }\n\n  .horizontal\n    .item:has(.button[data-icon-only=\"true\"]):not(:has([role=\"separator\"]))\n    .button[data-icon-only=\"true\"] {\n    flex: 1 1 auto;\n    inline-size: 100%;\n    block-size: 100%;\n    aspect-ratio: auto;\n  }\n\n  .vertical .item .button[data-icon-only=\"true\"],\n  .horizontal .item:has([role=\"separator\"]) .button[data-icon-only=\"true\"] {\n    flex: 0 0 auto;\n    inline-size: auto;\n    block-size: 100%;\n    aspect-ratio: 1;\n  }\n\n  .input {\n    @apply flex flex-1 items-stretch overflow-visible;\n    border-radius: slot(item, radius, var(--background-inner-radius));\n\n    > [data-ring=\"true\"] {\n      border-radius: inherit;\n    }\n  }\n\n  .select {\n    @apply flex items-stretch min-w-0 p-0 bg-transparent border-none;\n    border-radius: slot(item, radius, var(--background-inner-radius));\n  }\n\n  .select > :global(.value) {\n    @apply flex flex-1 items-stretch min-w-0 h-full p-0;\n    border-radius: inherit;\n  }\n\n  .select\n    > :global(.value):has(> :global(.button[data-hovered=\"true\"]:not([data-disabled=\"true\"]))) {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background, transparent);\n  }\n\n  .select > :global(.value) > :global(.button) {\n    @apply w-full h-full min-h-0;\n    background-color: transparent;\n    border: none;\n    border-radius: inherit;\n  }\n\n  .expand {\n    @apply flex items-stretch;\n    border-radius: slot(item, radius, var(--background-inner-radius));\n  }\n\n  .expand :global(.expand-scope),\n  .expand :global(.expand) {\n    @apply flex w-full h-full;\n  }\n\n  .expand :global(.expand) {\n    @apply flex-col;\n    border-radius: inherit;\n  }\n\n  .expand :global(.trigger) {\n    @apply min-h-0;\n    border-radius: inherit;\n  }\n\n  .group {\n    .item :is(.button, .select) {\n      border: none;\n    }\n\n    .input > [data-input-focus-surface=\"true\"] {\n      border: none;\n    }\n\n    .item [role=\"separator\"] {\n      --background: slot(border, background, transparent);\n    }\n\n    &.none {\n      .item:not(.divider) {\n        overflow: hidden;\n      }\n\n      :is(.button, .select) {\n        border-radius: 0;\n        --background-radius: 0;\n        --background-inner-radius: 0;\n      }\n\n      .input {\n        --radius-sm: 0;\n      }\n\n      .item:first-child {\n        @slot item {\n          --radius: var(--background-inner-radius) 0 0 var(--background-inner-radius);\n        }\n      }\n\n      .item:last-child {\n        @slot item {\n          --radius: 0 var(--background-inner-radius) var(--background-inner-radius) 0;\n        }\n      }\n\n      .item:only-child {\n        @slot item {\n          --radius: var(--background-inner-radius);\n        }\n      }\n\n      &.horizontal {\n        .item:first-child :is(.button, .input > *, .select) {\n          border-start-start-radius: var(--background-inner-radius);\n          border-end-start-radius: var(--background-inner-radius);\n        }\n\n        .item:last-child :is(.button, .input > *, .select) {\n          border-start-end-radius: var(--background-inner-radius);\n          border-end-end-radius: var(--background-inner-radius);\n        }\n      }\n\n      &.vertical {\n        .item:first-child {\n          @slot item {\n            --radius: var(--background-inner-radius) var(--background-inner-radius) 0 0;\n          }\n        }\n\n        .item:last-child {\n          @slot item {\n            --radius: 0 0 var(--background-inner-radius) var(--background-inner-radius);\n          }\n        }\n\n        .item:first-child :is(.button, .input > *, .select) {\n          border-start-start-radius: var(--background-inner-radius);\n          border-start-end-radius: var(--background-inner-radius);\n        }\n\n        .item:last-child :is(.button, .input > *, .select) {\n          border-end-start-radius: var(--background-inner-radius);\n          border-end-end-radius: var(--background-inner-radius);\n        }\n      }\n    }\n\n    &:is(.xs, .sm) {\n      .item {\n        @slot item {\n          --radius: var(--background-inner-radius);\n        }\n      }\n\n      :is(.button, .select) {\n        border-radius: var(--background-inner-radius);\n      }\n\n      .input {\n        --radius-sm: var(--background-inner-radius);\n      }\n    }\n  }\n\n  .group [data-ring=\"true\"] {\n    @slot ring {\n      --shadow: none;\n    }\n    @slot ring-border {\n      --background: transparent;\n      --background-visible: transparent;\n    }\n  }\n\n  .group :global(.focus-indicator) {\n    display: none;\n  }\n\n  .group [data-focus-indicator=\"local\"] {\n    display: none;\n  }\n\n  .button[data-focus-visible=\"true\"] {\n    @apply outline-none;\n    box-shadow: none;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "first"
      },
      {
        "name": "last"
      },
      {
        "name": "divider"
      },
      {
        "name": "grow"
      },
      {
        "name": "item.root"
      },
      {
        "name": "item.first"
      },
      {
        "name": "item.last"
      },
      {
        "name": "item.divider"
      },
      {
        "name": "item.grow"
      },
      {
        "name": "button"
      },
      {
        "name": "input"
      },
      {
        "name": "select"
      },
      {
        "name": "expand"
      }
    ],
    "styleableGroups": [
      {
        "name": "GroupItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Every item wrapper Group renders around a child.",
            "type": "Style"
          },
          {
            "name": "first",
            "description": "The first item wrapper in the group.",
            "type": "Style"
          },
          {
            "name": "last",
            "description": "The last item wrapper in the group.",
            "type": "Style"
          },
          {
            "name": "divider",
            "description": "An item wrapper whose child is a separator.",
            "type": "Style"
          },
          {
            "name": "grow",
            "description": "An item wrapper that stretches because its child requests growth.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "GroupStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "The role=\"group\" root element.",
            "type": "Style"
          },
          {
            "name": "item.root",
            "description": "Every item wrapper Group renders around a child.",
            "type": "Style"
          },
          {
            "name": "item.first",
            "description": "The first item wrapper in the group.",
            "type": "Style"
          },
          {
            "name": "item.last",
            "description": "The last item wrapper in the group.",
            "type": "Style"
          },
          {
            "name": "item.divider",
            "description": "An item wrapper whose child is a separator.",
            "type": "Style"
          },
          {
            "name": "item.grow",
            "description": "An item wrapper that stretches because its child requests growth.",
            "type": "Style"
          },
          {
            "name": "button",
            "description": "The Group.Button surface.",
            "type": "Style"
          },
          {
            "name": "input",
            "description": "The Group.Input surface that wraps the nested Input.",
            "type": "Style"
          },
          {
            "name": "select",
            "description": "The Group.Select surface.",
            "type": "Style"
          },
          {
            "name": "expand",
            "description": "The Group.Expand surface that wraps the nested Expand.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-950)",
        "defaultValue": null,
        "referencedVars": [
          "--background-950"
        ],
        "variant": ".group"
      },
      {
        "name": "--backdrop",
        "value": "color-mix(in srgb, var(--background-800) 35%, var(--background-950))",
        "defaultValue": null,
        "referencedVars": [
          "--background-800",
          "--background-950"
        ],
        "variant": ".group"
      },
      {
        "name": "--radius-size",
        "value": "calc(var(--spacing) * 1.5)",
        "defaultValue": null,
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".group"
      },
      {
        "name": "--padding-size",
        "value": "var(--radius-size)",
        "defaultValue": null,
        "referencedVars": [
          "--radius-size"
        ],
        "variant": ".group"
      },
      {
        "name": "--background-radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".group"
      },
      {
        "name": "--background-inner-radius",
        "value": "calc(var(--background-radius) - slot(border, width, var(--border-width-base, 1px)))",
        "defaultValue": "1px",
        "referencedVars": [
          "--background-radius",
          "--border-width-base"
        ],
        "variant": ".group"
      },
      {
        "name": "--text-height",
        "value": "calc(0.8em * var(--leading-tight, 1.25))",
        "defaultValue": "1.25",
        "referencedVars": [
          "--leading-tight"
        ],
        "variant": ".group"
      },
      {
        "name": "--vertical-spacing",
        "value": "calc(var(--spacing) * 4)",
        "defaultValue": null,
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".group"
      },
      {
        "name": "--border-height",
        "value": "calc(slot(border, width, var(--border-width-base, 1px)) * 2)",
        "defaultValue": "1px",
        "referencedVars": [
          "--border-width-base"
        ],
        "variant": ".group"
      },
      {
        "name": "--padding-height",
        "value": "calc(var(--padding-size) * 2)",
        "defaultValue": null,
        "referencedVars": [
          "--padding-size"
        ],
        "variant": ".group"
      },
      {
        "name": "--control-height",
        "value": "calc(var(--text-height) + var(--vertical-spacing) + var(--border-height))",
        "defaultValue": null,
        "referencedVars": [
          "--text-height",
          "--vertical-spacing",
          "--border-height"
        ],
        "variant": ".group"
      },
      {
        "name": "--item-height",
        "value": "max(\n      calc(var(--control-height) - var(--padding-height) - var(--border-height)),\n      0px\n    )",
        "defaultValue": null,
        "referencedVars": [
          "--control-height",
          "--padding-height",
          "--border-height"
        ],
        "variant": ".group"
      },
      {
        "name": "--padding-size",
        "value": "0px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".group.none"
      },
      {
        "name": "--radius-size",
        "value": "calc(var(--spacing) * 0.875)",
        "defaultValue": null,
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".group.xs"
      },
      {
        "name": "--radius-size",
        "value": "calc(var(--spacing) * 1.25)",
        "defaultValue": null,
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".group.sm"
      },
      {
        "name": "--press-transform",
        "value": "none",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".button"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".select\n    > :global(.value):has(> :global(.button[data-hovered=\"true\"]:not([data-disabled=\"true\"])))"
      },
      {
        "name": "--background",
        "value": "slot(border, background, transparent)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".group .item [role=\"separator\"]"
      },
      {
        "name": "--background-radius",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".group.none :is(.button, .select)"
      },
      {
        "name": "--background-inner-radius",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".group.none :is(.button, .select)"
      },
      {
        "name": "--radius-sm",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".group.none .input"
      },
      {
        "name": "--radius",
        "value": "var(--background-inner-radius) 0 0 var(--background-inner-radius)",
        "defaultValue": null,
        "referencedVars": [
          "--background-inner-radius"
        ],
        "variant": ""
      },
      {
        "name": "--radius",
        "value": "0 var(--background-inner-radius) var(--background-inner-radius) 0",
        "defaultValue": null,
        "referencedVars": [
          "--background-inner-radius"
        ],
        "variant": ""
      },
      {
        "name": "--radius",
        "value": "var(--background-inner-radius)",
        "defaultValue": null,
        "referencedVars": [
          "--background-inner-radius"
        ],
        "variant": ""
      },
      {
        "name": "--radius",
        "value": "var(--background-inner-radius) var(--background-inner-radius) 0 0",
        "defaultValue": null,
        "referencedVars": [
          "--background-inner-radius"
        ],
        "variant": ""
      },
      {
        "name": "--radius",
        "value": "0 0 var(--background-inner-radius) var(--background-inner-radius)",
        "defaultValue": null,
        "referencedVars": [
          "--background-inner-radius"
        ],
        "variant": ""
      },
      {
        "name": "--radius",
        "value": "var(--background-inner-radius)",
        "defaultValue": null,
        "referencedVars": [
          "--background-inner-radius"
        ],
        "variant": ""
      },
      {
        "name": "--radius-sm",
        "value": "var(--background-inner-radius)",
        "defaultValue": null,
        "referencedVars": [
          "--background-inner-radius"
        ],
        "variant": ".group:is(.xs, .sm) .input"
      },
      {
        "name": "--shadow",
        "value": "none",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ""
      },
      {
        "name": "--background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ""
      },
      {
        "name": "--background-visible",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ""
      }
    ]
  },
  "grid": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .grid {\n    --gap-scale: 1;\n\n    --background: transparent;\n    --foreground: inherit;\n\n    @apply grid w-full;\n    background-color: var(--background);\n    color: var(--foreground);\n    grid-template-columns: var(--grid-tpl, repeat(3, 1fr));\n    grid-template-rows: var(--grid-rows, auto);\n    gap: calc(var(--spacing, 0.25rem) * var(--grid-gap-step, 4) * var(--gap-scale, 1));\n    row-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-row-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n    justify-items: var(--grid-ji, stretch);\n    align-items: var(--grid-ai, stretch);\n    justify-content: var(--grid-jc, start);\n    align-content: var(--grid-ac, start);\n    grid-auto-flow: var(--grid-flow, row);\n  }\n\n  .container {\n    container-type: inline-size;\n    container-name: grid-ctx;\n    @apply w-full;\n  }\n\n  .grid.responsive-cols {\n    grid-template-columns: var(--grid-tpl-sm, 1fr);\n  }\n\n  @media (min-width: 640px) {\n    .grid.responsive-cols {\n      grid-template-columns: var(--grid-tpl-md, var(--grid-tpl-sm, 1fr));\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.responsive-cols {\n      grid-template-columns: var(--grid-tpl-lg, var(--grid-tpl-md, var(--grid-tpl-sm, 1fr)));\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.responsive-cols {\n      grid-template-columns: var(\n        --grid-tpl-xl,\n        var(--grid-tpl-lg, var(--grid-tpl-md, var(--grid-tpl-sm, 1fr)))\n      );\n    }\n  }\n\n  .grid.responsive-gap {\n    --grid-gap-step: var(--grid-gap-step-sm, 2);\n  }\n\n  @media (min-width: 640px) {\n    .grid.responsive-gap {\n      --grid-gap-step: var(--grid-gap-step-md, var(--grid-gap-step-sm, 4));\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.responsive-gap {\n      --grid-gap-step: var(--grid-gap-step-lg, var(--grid-gap-step-md, var(--grid-gap-step-sm, 4)));\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.responsive-gap {\n      --grid-gap-step: var(\n        --grid-gap-step-xl,\n        var(--grid-gap-step-lg, var(--grid-gap-step-md, var(--grid-gap-step-sm, 4)))\n      );\n    }\n  }\n\n  .grid.responsive-rows {\n    grid-template-rows: var(--grid-rows-sm, auto);\n  }\n\n  @media (min-width: 640px) {\n    .grid.responsive-rows {\n      grid-template-rows: var(--grid-rows-md, var(--grid-rows-sm, auto));\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.responsive-rows {\n      grid-template-rows: var(--grid-rows-lg, var(--grid-rows-md, var(--grid-rows-sm, auto)));\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.responsive-rows {\n      grid-template-rows: var(\n        --grid-rows-xl,\n        var(--grid-rows-lg, var(--grid-rows-md, var(--grid-rows-sm, auto)))\n      );\n    }\n  }\n\n  .grid.has-row-gap {\n    row-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-row-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  .grid.has-col-gap {\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  @container grid-ctx (width < 400px) {\n    .container .grid {\n      grid-template-columns: 1fr;\n      --grid-gap-step: 2;\n    }\n  }\n\n  /*\n   * grid-template-rows: masonry isn't supported by Chromium or WebKit,\n   * so masonry falls back to a CSS multi-column layout instead.\n   */\n  .grid.masonry {\n    display: block;\n    column-count: var(--grid-col-count, 1);\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  .grid.masonry.masonry-fixed-width {\n    --grid-masonry-gap: calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n    column-width: var(--grid-masonry-col-width);\n    width: max(\n      100%,\n      calc(\n        (var(--grid-col-count, 1) * var(--grid-masonry-col-width)) +\n          ((var(--grid-col-count, 1) - 1) * var(--grid-masonry-gap))\n      )\n    );\n  }\n\n  .grid.masonry.masonry-column-fill {\n    column-fill: var(--grid-masonry-col-fill);\n  }\n\n  .grid.masonry > * {\n    break-inside: avoid;\n    margin-bottom: calc(\n      var(--spacing, 0.25rem) * var(--grid-row-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  .grid.masonry.masonry-no-item-gap > * {\n    margin-bottom: 0;\n  }\n\n  .grid.masonry.responsive-cols {\n    column-count: var(--grid-col-count-sm, 1);\n  }\n\n  .grid.masonry.responsive-masonry-width {\n    --grid-masonry-col-width: var(--grid-masonry-col-width-sm, auto);\n  }\n\n  @media (min-width: 640px) {\n    .grid.masonry.responsive-cols {\n      column-count: var(--grid-col-count-md, var(--grid-col-count-sm, 1));\n    }\n\n    .grid.masonry.responsive-masonry-width {\n      --grid-masonry-col-width: var(\n        --grid-masonry-col-width-md,\n        var(--grid-masonry-col-width-sm, auto)\n      );\n    }\n  }\n\n  @media (min-width: 1024px) {\n    .grid.masonry.responsive-cols {\n      column-count: var(--grid-col-count-lg, var(--grid-col-count-md, var(--grid-col-count-sm, 1)));\n    }\n\n    .grid.masonry.responsive-masonry-width {\n      --grid-masonry-col-width: var(\n        --grid-masonry-col-width-lg,\n        var(--grid-masonry-col-width-md, var(--grid-masonry-col-width-sm, auto))\n      );\n    }\n  }\n\n  @media (min-width: 1280px) {\n    .grid.masonry.responsive-cols {\n      column-count: var(\n        --grid-col-count-xl,\n        var(--grid-col-count-lg, var(--grid-col-count-md, var(--grid-col-count-sm, 1)))\n      );\n    }\n\n    .grid.masonry.responsive-masonry-width {\n      --grid-masonry-col-width: var(\n        --grid-masonry-col-width-xl,\n        var(\n          --grid-masonry-col-width-lg,\n          var(--grid-masonry-col-width-md, var(--grid-masonry-col-width-sm, auto))\n        )\n      );\n    }\n  }\n\n  @container grid-ctx (width < 400px) {\n    .container .grid.masonry {\n      column-count: 1;\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      }
    ],
    "styleableGroups": [
      {
        "name": "GridStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--gap-scale",
        "value": "1",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".grid"
      },
      {
        "name": "--background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".grid"
      },
      {
        "name": "--foreground",
        "value": "inherit",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".grid"
      },
      {
        "name": "--grid-gap-step",
        "value": "var(--grid-gap-step-sm, 2)",
        "defaultValue": "2",
        "referencedVars": [
          "--grid-gap-step-sm"
        ],
        "variant": ".grid.responsive-gap"
      },
      {
        "name": "--grid-gap-step",
        "value": "var(--grid-gap-step-md, var(--grid-gap-step-sm, 4))",
        "defaultValue": "var(--grid-gap-step-sm, 4",
        "referencedVars": [
          "--grid-gap-step-md"
        ],
        "variant": ".grid.responsive-gap"
      },
      {
        "name": "--grid-gap-step",
        "value": "var(--grid-gap-step-lg, var(--grid-gap-step-md, var(--grid-gap-step-sm, 4)))",
        "defaultValue": "var(--grid-gap-step-md, var(--grid-gap-step-sm, 4",
        "referencedVars": [
          "--grid-gap-step-lg"
        ],
        "variant": ".grid.responsive-gap"
      },
      {
        "name": "--grid-gap-step",
        "value": "var(\n        --grid-gap-step-xl,\n        var(--grid-gap-step-lg, var(--grid-gap-step-md, var(--grid-gap-step-sm, 4)))\n      )",
        "defaultValue": "var(--grid-gap-step-md, var(--grid-gap-step-sm, 4",
        "referencedVars": [
          "--grid-gap-step-lg"
        ],
        "variant": ".grid.responsive-gap"
      },
      {
        "name": "--grid-gap-step",
        "value": "2",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".container .grid"
      },
      {
        "name": "--grid-masonry-gap",
        "value": "calc(\n      var(--spacing, 0.25rem) * var(--grid-col-gap-step, var(--grid-gap-step, 4)) *\n        var(--gap-scale, 1)\n    )",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing",
          "--grid-col-gap-step",
          "--gap-scale"
        ],
        "variant": ".grid.masonry.masonry-fixed-width"
      },
      {
        "name": "--grid-masonry-col-width",
        "value": "var(--grid-masonry-col-width-sm, auto)",
        "defaultValue": "auto",
        "referencedVars": [
          "--grid-masonry-col-width-sm"
        ],
        "variant": ".grid.masonry.responsive-masonry-width"
      },
      {
        "name": "--grid-masonry-col-width",
        "value": "var(\n        --grid-masonry-col-width-md,\n        var(--grid-masonry-col-width-sm, auto)\n      )",
        "defaultValue": "auto",
        "referencedVars": [
          "--grid-masonry-col-width-sm"
        ],
        "variant": ".grid.masonry.responsive-masonry-width"
      },
      {
        "name": "--grid-masonry-col-width",
        "value": "var(\n        --grid-masonry-col-width-lg,\n        var(--grid-masonry-col-width-md, var(--grid-masonry-col-width-sm, auto))\n      )",
        "defaultValue": "var(--grid-masonry-col-width-sm, auto",
        "referencedVars": [
          "--grid-masonry-col-width-md"
        ],
        "variant": ".grid.masonry.responsive-masonry-width"
      },
      {
        "name": "--grid-masonry-col-width",
        "value": "var(\n        --grid-masonry-col-width-xl,\n        var(\n          --grid-masonry-col-width-lg,\n          var(--grid-masonry-col-width-md, var(--grid-masonry-col-width-sm, auto))\n        )\n      )",
        "defaultValue": "var(--grid-masonry-col-width-sm, auto",
        "referencedVars": [
          "--grid-masonry-col-width-md"
        ],
        "variant": ".grid.masonry.responsive-masonry-width"
      }
    ]
  },
  "gallery": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .item {\n    --radius: var(--radius-sm, 0.375rem);\n    --transition: var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    --view-width: 200px;\n\n    @apply flex flex-col overflow-hidden no-underline cursor-pointer w-full h-full min-w-0;\n\n    color: inherit;\n    background: var(--background);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius);\n    transition:\n      border-color var(--transition),\n      transform var(--transition),\n      background-color var(--transition),\n      box-shadow var(--transition);\n  }\n\n  .item:focus {\n    outline: none;\n  }\n\n  .item[data-disabled=\"true\"] {\n    @apply cursor-not-allowed;\n  }\n\n  .item[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    border-color: slot(border, background-hover, slot(border, background, transparent));\n  }\n\n  .item[data-pressed=\"true\"] {\n    border-color: slot(border, background-pressed, slot(border, background, transparent));\n  }\n\n  .item[data-orientation=\"horizontal\"] {\n    @apply flex-row;\n  }\n\n  .item[data-orientation=\"horizontal\"] .view {\n    width: var(--view-width);\n  }\n\n  .view {\n    --aspect-ratio: 16/9;\n\n    @apply relative overflow-hidden;\n\n    aspect-ratio: var(--aspect-ratio);\n    background: var(--background);\n  }\n\n  .view > img,\n  .view > video {\n    @apply w-full h-full object-cover;\n  }\n\n  .body {\n    --gap: calc(var(--spacing, 0.25rem) * 1);\n    --padding: calc(var(--spacing, 0.25rem) * 3);\n    --title-color: var(--foreground);\n    --description-color: var(--foreground-muted, var(--foreground));\n\n    @apply flex flex-col self-start min-w-0;\n\n    gap: var(--gap);\n    padding: var(--padding);\n  }\n\n  .item[data-orientation=\"horizontal\"] .body {\n    flex: 1;\n    align-self: stretch;\n  }\n\n  .body > :first-child {\n    color: var(--title-color);\n  }\n\n  .body > :not(:first-child) {\n    color: var(--description-color);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "item"
      },
      {
        "name": "view"
      },
      {
        "name": "body"
      }
    ],
    "styleableGroups": [
      {
        "name": "GalleryStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "item",
            "description": "",
            "type": "Style"
          },
          {
            "name": "view",
            "description": "",
            "type": "Style"
          },
          {
            "name": "body",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "GalleryItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "GalleryViewStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "GalleryBodyStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".item"
      },
      {
        "name": "--transition",
        "value": "var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out))",
        "defaultValue": "var(--hover-leave-duration, 300ms",
        "referencedVars": [
          "--hover-duration",
          "--hover-transition-timing-function"
        ],
        "variant": ".item"
      },
      {
        "name": "--view-width",
        "value": "200px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".item"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".item[data-hovered=\"true\"]"
      },
      {
        "name": "--aspect-ratio",
        "value": "16/9",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".view"
      },
      {
        "name": "--gap",
        "value": "calc(var(--spacing, 0.25rem) * 1)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".body"
      },
      {
        "name": "--padding",
        "value": "calc(var(--spacing, 0.25rem) * 3)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".body"
      },
      {
        "name": "--title-color",
        "value": "var(--foreground)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground"
        ],
        "variant": ".body"
      },
      {
        "name": "--description-color",
        "value": "var(--foreground-muted, var(--foreground))",
        "defaultValue": "var(--foreground",
        "referencedVars": [
          "--foreground-muted"
        ],
        "variant": ".body"
      }
    ]
  },
  "frame": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    --frame-radius: var(--radius-sm, 24px);\n    --frame-stroke-width: var(--border-width-base, 1px);\n  }\n\n  .shape {\n    rx: var(--frame-radius);\n  }\n\n  .stroke {\n    stroke-width: var(--frame-stroke-width);\n    vector-effect: non-scaling-stroke;\n  }\n\n  /* Widens the shape's closed region by one whole stroke where it cuts the\n     border away — a stroke grows a filled region by half its width, so this is\n     twice the border. Half of that clears the border's own thickness; the other\n     half is the margin that keeps the two antialiased edges from landing on the\n     same pixel column and leaving a hairline of border behind. `CAP_OVERRUN` in\n     Frame.tsx is what runs the shape's outline back across it. */\n  .cut {\n    stroke-width: calc(var(--frame-stroke-width) * 2);\n    vector-effect: non-scaling-stroke;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      }
    ],
    "styleableGroups": [
      {
        "name": "FrameStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--frame-radius",
        "value": "var(--radius-sm, 24px)",
        "defaultValue": "24px",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".root"
      },
      {
        "name": "--frame-stroke-width",
        "value": "var(--border-width-base, 1px)",
        "defaultValue": "1px",
        "referencedVars": [
          "--border-width-base"
        ],
        "variant": ".root"
      }
    ]
  },
  "flex": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .flex {\n    --gap-scale: 0.5;\n\n    @apply flex;\n    gap: calc(var(--spacing, 0.25rem) * var(--flex-gap-step, 0) * var(--gap-scale, 1));\n  }\n\n  /* Direction variants */\n  .flex.row {\n    flex-direction: row;\n  }\n  .flex.column {\n    flex-direction: column;\n  }\n\n  /* Wrap variants */\n  .flex.wrap {\n    flex-wrap: wrap;\n  }\n\n  /* Per-axis gap overrides */\n  .flex.has-col-gap {\n    column-gap: calc(\n      var(--spacing, 0.25rem) * var(--flex-col-gap-step, var(--flex-gap-step, 0)) *\n        var(--gap-scale, 1)\n    );\n  }\n  .flex.has-row-gap {\n    row-gap: calc(\n      var(--spacing, 0.25rem) * var(--flex-row-gap-step, var(--flex-gap-step, 0)) *\n        var(--gap-scale, 1)\n    );\n  }\n\n  /* Justify-content variants */\n  .flex.justify-start {\n    justify-content: flex-start;\n  }\n  .flex.justify-end {\n    justify-content: flex-end;\n  }\n  .flex.justify-center {\n    justify-content: center;\n  }\n  .flex.justify-between {\n    justify-content: space-between;\n  }\n  .flex.justify-around {\n    justify-content: space-around;\n  }\n  .flex.justify-evenly {\n    justify-content: space-evenly;\n  }\n\n  /* Align-items variants */\n  .flex.align-start {\n    align-items: flex-start;\n  }\n  .flex.align-end {\n    align-items: flex-end;\n  }\n  .flex.align-center {\n    align-items: center;\n  }\n  .flex.align-stretch {\n    align-items: stretch;\n  }\n  .flex.align-baseline {\n    align-items: baseline;\n  }\n\n  /* Container query parent - establishes containment context */\n  .container-query-parent {\n    container-type: inline-size;\n    container-name: flex-parent;\n    @apply w-full;\n  }\n\n  /* Container query responsive behavior - use .flex.container-responsive for specificity parity with base variants */\n  @container flex-parent (width < 400px) {\n    .flex.container-responsive {\n      flex-direction: column;\n      flex-wrap: wrap;\n      justify-content: flex-start;\n      --flex-gap-step: 2;\n    }\n  }\n\n  @container flex-parent (400px <= width < 500px) {\n    .flex.container-responsive {\n      flex-wrap: wrap;\n      --flex-gap-step: 2;\n    }\n  }\n\n  @container flex-parent (500px <= width < 900px) {\n    .flex.container-responsive {\n      --flex-gap-step: 4;\n    }\n  }\n\n  @container flex-parent (width >= 900px) {\n    .flex.container-responsive {\n      --flex-gap-step: 6;\n    }\n  }\n}\n",
    "styleableParts": [],
    "styleableGroups": [],
    "cssVariables": [
      {
        "name": "--gap-scale",
        "value": "0.5",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".flex"
      },
      {
        "name": "--flex-gap-step",
        "value": "2",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".flex.container-responsive"
      },
      {
        "name": "--flex-gap-step",
        "value": "2",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".flex.container-responsive"
      },
      {
        "name": "--flex-gap-step",
        "value": "4",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".flex.container-responsive"
      },
      {
        "name": "--flex-gap-step",
        "value": "6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".flex.container-responsive"
      }
    ]
  },
  "expand": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .scope {\n    position: relative;\n    display: block;\n    width: 100%;\n  }\n\n  .expand {\n    --disabled-opacity: 0.6;\n\n    @slot trigger {\n      --padding-inline: 0.75rem;\n      --padding-block: 0.5rem;\n      --radius: var(--radius-sm, 0.375rem);\n    }\n\n    @apply flex w-full flex-col;\n  }\n\n  .expand[data-layout=\"contained\"] {\n    @slot trigger {\n      --radius: 0;\n    }\n  }\n\n  .expand[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--disabled-opacity);\n  }\n\n  .trigger {\n    @apply flex w-full items-stretch justify-between border-0 p-0 text-left;\n\n    appearance: none;\n    color: var(--foreground);\n    background-color: var(--background);\n    cursor: pointer;\n    border-radius: slot(trigger, radius, 0.375rem);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    outline: none;\n    box-shadow: none;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-smooth-settle, ease-out)),\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-smooth-settle, ease-out));\n  }\n\n  .trigger:focus,\n  .trigger:focus-visible {\n    outline: none;\n    box-shadow: none;\n  }\n\n  .trigger[data-disabled=\"true\"] {\n    cursor: not-allowed;\n    opacity: var(--disabled-opacity);\n  }\n\n  .title {\n    @apply flex min-w-0 flex-1 items-center overflow-hidden;\n\n    padding-block: slot(trigger, padding-block, 0.5rem);\n    padding-inline-start: slot(trigger, padding-inline, 0.75rem);\n    padding-inline-end: 0;\n    border-start-start-radius: slot(trigger, radius, 0.375rem);\n    border-end-start-radius: slot(trigger, radius, 0.375rem);\n    color: inherit;\n    background-color: transparent;\n  }\n\n  .icon {\n    @apply flex shrink-0 items-center justify-center;\n\n    padding-block: slot(trigger, padding-block, 0.5rem);\n    padding-inline: slot(trigger, padding-inline, 0.75rem);\n    color: slot(icon, foreground, inherit);\n    background-color: transparent;\n    border-start-end-radius: slot(trigger, radius, 0.375rem);\n    border-end-end-radius: slot(trigger, radius, 0.375rem);\n  }\n\n  @media (hover: hover) {\n    .trigger:not([data-disabled=\"true\"]):hover {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n    }\n\n    .trigger:not([data-disabled=\"true\"]) .icon:hover {\n      border-radius: slot(trigger, radius, 0.375rem);\n    }\n  }\n\n  .icon > * {\n    transition: transform 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));\n  }\n\n  .icon > svg {\n    width: slot(icon, size, 16px);\n    height: slot(icon, size, 16px);\n  }\n\n  .icon[data-selected=\"true\"] > * {\n    transform: rotate(180deg);\n  }\n\n  .expand:has(.content[data-from=\"above\"]) {\n    flex-direction: column-reverse;\n  }\n\n  .expand:has(.content[data-from=\"above\"]) .icon > * {\n    transform: rotate(180deg);\n  }\n\n  .expand:has(.content[data-from=\"above\"]) .icon[data-selected=\"true\"] > * {\n    transform: rotate(0deg);\n  }\n\n  .expand:has(.content[data-from=\"left\"]) {\n    @apply flex-row-reverse items-start;\n  }\n\n  .expand:has(.content[data-from=\"left\"]) .trigger {\n    @apply w-auto flex-col;\n  }\n\n  .expand:has(.content[data-from=\"left\"]) .icon > * {\n    transform: rotate(-90deg);\n  }\n\n  .expand:has(.content[data-from=\"left\"]) .icon[data-selected=\"true\"] > * {\n    transform: rotate(90deg);\n  }\n\n  .expand:has(.content[data-from=\"right\"]) {\n    @apply flex-row items-start;\n  }\n\n  .expand:has(.content[data-from=\"right\"]) .trigger {\n    @apply w-auto flex-col;\n  }\n\n  .expand:has(.content[data-from=\"right\"]) .icon > * {\n    transform: rotate(90deg);\n  }\n\n  .expand:has(.content[data-from=\"right\"]) .icon[data-selected=\"true\"] > * {\n    transform: rotate(-90deg);\n  }\n\n  .content {\n    display: grid;\n    overflow: hidden;\n    grid-template-rows: 0fr;\n    transition: grid-template-rows 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));\n  }\n\n  .content[data-selected=\"true\"] {\n    grid-template-rows: 1fr;\n  }\n\n  .content[data-from=\"left\"],\n  .content[data-from=\"right\"] {\n    grid-template-rows: 1fr;\n    grid-template-columns: 0fr;\n    transition: grid-template-columns 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));\n  }\n\n  .content[data-from=\"left\"][data-selected=\"true\"],\n  .content[data-from=\"right\"][data-selected=\"true\"] {\n    grid-template-columns: 1fr;\n  }\n\n  .content-inner {\n    @apply min-h-0 overflow-hidden;\n\n    min-width: 0;\n    color: var(--foreground);\n    background-color: var(--background);\n  }\n\n  .divider {\n    margin: 0;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "collapsed"
      },
      {
        "name": "expanded"
      },
      {
        "name": "root"
      },
      {
        "name": "inner"
      },
      {
        "name": "trigger"
      },
      {
        "name": "icon.collapsed"
      },
      {
        "name": "icon.expanded"
      },
      {
        "name": "title"
      },
      {
        "name": "content.root"
      },
      {
        "name": "content.inner"
      },
      {
        "name": "divider"
      }
    ],
    "styleableGroups": [
      {
        "name": "ExpandIconStyleSlots",
        "slots": [
          {
            "name": "collapsed",
            "description": "Styles the icon while the panel is collapsed.",
            "type": "Style"
          },
          {
            "name": "expanded",
            "description": "Styles the icon while the panel is expanded.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ExpandContentStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the collapsing outer content panel.",
            "type": "Style"
          },
          {
            "name": "inner",
            "description": "Styles the padded region wrapping the panel's children.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ExpandStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the root expand container.",
            "type": "Style"
          },
          {
            "name": "trigger",
            "description": "Styles the trigger button.",
            "type": "Style"
          },
          {
            "name": "icon.collapsed",
            "description": "Styles the icon while the panel is collapsed.",
            "type": "Style"
          },
          {
            "name": "icon.expanded",
            "description": "Styles the icon while the panel is expanded.",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "Styles the trigger's title/label text.",
            "type": "Style"
          },
          {
            "name": "content.root",
            "description": "Styles the collapsing outer content panel.",
            "type": "Style"
          },
          {
            "name": "content.inner",
            "description": "Styles the padded region wrapping the panel's children.",
            "type": "Style"
          },
          {
            "name": "divider",
            "description": "Styles the divider rendered between the trigger and content.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--disabled-opacity",
        "value": "0.6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".expand"
      },
      {
        "name": "--padding-inline",
        "value": "0.75rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ""
      },
      {
        "name": "--padding-block",
        "value": "0.5rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ""
      },
      {
        "name": "--radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ""
      },
      {
        "name": "--radius",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ""
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".trigger:not([data-disabled=\"true\"]):hover"
      }
    ]
  },
  "divider": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .divider {\n  /* Divider keeps its legacy color hook because it is not a surface border. */\n  --background: var(--background-border, currentColor);\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      }
    ],
    "styleableGroups": [
      {
        "name": "DividerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".divider"
      },
      {
        "name": "--background",
        "value": "var(--background-border, currentColor)",
        "defaultValue": "currentColor",
        "referencedVars": [
          "--background-border"
        ],
        "variant": ".divider"
      }
    ]
  },
  "date": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  /* Anchors the popover to the whole field rather than the calendar button. */\n  .anchor {\n    @apply flex;\n    position: relative;\n    min-width: 0;\n  }\n\n  .field {\n    @apply flex;\n    min-width: 0;\n    flex: 1;\n  }\n\n  .segments {\n    @apply flex items-center;\n    min-width: 0;\n  }\n\n  .segment {\n    @apply text-center;\n    min-width: 0;\n    padding: 0 1px;\n    font: inherit;\n    color: var(--foreground);\n    background-color: transparent;\n    border: none;\n    border-radius: calc(var(--radius-sm, 0.375rem) * 0.5);\n    outline: none;\n    box-sizing: content-box;\n    /* Sized from the region's character count so segments never reflow as\n       they fill: \"05\" occupies the same box as the empty placeholder. */\n    width: calc(var(--segment-length, 2) * 1ch);\n    caret-color: transparent;\n\n    &::selection {\n      background-color: transparent;\n    }\n\n    &::placeholder {\n      color: var(--placeholder);\n    }\n\n    &[data-focused=\"true\"] {\n      background-color: var(--background-700);\n      color: var(--foreground);\n    }\n\n    &[data-disabled=\"true\"] {\n      color: var(--disabled-foreground);\n      cursor: not-allowed;\n    }\n  }\n\n  .separator {\n    @apply select-none;\n    color: var(--placeholder);\n    pointer-events: none;\n  }\n\n  /* Spacing between the start and end halves of a range field. */\n  .range-separator {\n    @apply select-none px-1.5;\n    color: var(--foreground);\n    pointer-events: none;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "title"
      },
      {
        "name": "navigation.previous"
      },
      {
        "name": "navigation.next"
      },
      {
        "name": "item"
      },
      {
        "name": "header.root"
      },
      {
        "name": "header.title"
      },
      {
        "name": "header.navigation.previous"
      },
      {
        "name": "header.navigation.next"
      },
      {
        "name": "dayHeaders.root"
      },
      {
        "name": "dayHeaders.item"
      },
      {
        "name": "day"
      }
    ],
    "styleableGroups": [
      {
        "name": "DateHeaderStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "",
            "type": "Style"
          },
          {
            "name": "navigation.previous",
            "description": "",
            "type": "Style"
          },
          {
            "name": "navigation.next",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "DateDayHeadersStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "item",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "DateStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header.root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header.title",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header.navigation.previous",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header.navigation.next",
            "description": "",
            "type": "Style"
          },
          {
            "name": "dayHeaders.root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "dayHeaders.item",
            "description": "",
            "type": "Style"
          },
          {
            "name": "day",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": []
  },
  "confirm": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .confirm {\n    --header-foreground: var(--foreground-100);\n    --description-foreground: var(--foreground-300);\n    --error-foreground: var(--foreground-danger);\n    --countdown-foreground: var(--foreground-400);\n    --label-foreground: var(--foreground-300);\n    --input-background: var(--background-800);\n    --input-foreground: var(--foreground-100);\n  }\n\n  .container {\n    @apply flex flex-col;\n  }\n\n  .body {\n    @apply flex flex-col gap-4;\n  }\n\n  .row {\n    @apply flex items-center justify-between gap-8;\n  }\n\n  .row-text {\n    @apply flex flex-col;\n  }\n\n  .row-title {\n    font: var(--font-weight-body-medium, 500) var(--text-md, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--header-foreground);\n  }\n\n  .row-description {\n    font: var(--font-weight-body-medium, 500) var(--text-sm, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--description-foreground);\n  }\n\n  .header {\n    @apply flex items-center gap-3;\n  }\n\n  .description {\n    font: var(--font-weight-body-normal, 400) var(--text-body-size, var(--text-base, 0.9375rem)) /\n      var(--leading-body, 1.5) var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--description-foreground);\n  }\n\n  .error-message {\n    font: var(--font-weight-body-normal, 400) var(--text-xs, 0.75rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--error-foreground);\n  }\n\n  .warning-box {\n    @apply p-3 rounded-sm;\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--warning-border-color-low));\n    background-color: var(--warning-background);\n    color: var(--warning-foreground);\n    font: var(--font-weight-body-normal, 400) var(--text-body-size, var(--text-base, 0.9375rem)) /\n      var(--leading-body, 1.5) var(--font-body, inherit);\n    letter-spacing: normal;\n  }\n\n  .warning-box-low {\n    --warning-background: var(--warning-background-low);\n    @slot border {\n      --background: var(--warning-border-color-low);\n    }\n    --warning-foreground: var(--warning-foreground-low);\n  }\n\n  .warning-box-medium {\n    --warning-background: var(--warning-background-medium);\n    @slot border {\n      --background: var(--warning-border-color-medium);\n    }\n    --warning-foreground: var(--warning-foreground-medium);\n  }\n\n  .warning-box-high {\n    --warning-background: var(--warning-background-high);\n    @slot border {\n      --background: var(--warning-border-color-high);\n    }\n    --warning-foreground: var(--warning-foreground-high);\n  }\n\n  .warning-box-critical {\n    --warning-background: var(--warning-background-critical);\n    @slot border {\n      --background: var(--warning-border-color-critical);\n    }\n    --warning-foreground: var(--warning-foreground-critical);\n  }\n\n  .countdown-text {\n    font: var(--font-weight-body-normal, 400) var(--text-xs, 0.75rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    color: var(--countdown-foreground);\n  }\n\n  .input-label {\n    font: var(--font-weight-body-medium, 500) var(--text-sm, 0.875rem) / var(--leading-sm, 1.25rem)\n      var(--font-body, inherit);\n    letter-spacing: normal;\n    margin-left: 0.25rem;\n    color: var(--label-foreground);\n  }\n\n  .input {\n    @apply w-full mt-2 rounded-sm transition-all duration-200;\n    --background: var(--input-background);\n    @slot border {\n      --background: var(--background-700);\n    }\n    --foreground: var(--input-foreground);\n  }\n\n  .actions {\n    @apply flex items-center gap-2;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "container"
      },
      {
        "name": "panel"
      },
      {
        "name": "header"
      },
      {
        "name": "body"
      },
      {
        "name": "actions"
      },
      {
        "name": "\"row-text\""
      },
      {
        "name": "title"
      },
      {
        "name": "description"
      },
      {
        "name": "\"error-message\""
      },
      {
        "name": "\"warning-box\""
      },
      {
        "name": "input"
      }
    ],
    "styleableGroups": [
      {
        "name": "ConfirmStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "container",
            "description": "",
            "type": "Style"
          },
          {
            "name": "panel",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header",
            "description": "",
            "type": "Style"
          },
          {
            "name": "body",
            "description": "",
            "type": "Style"
          },
          {
            "name": "actions",
            "description": "",
            "type": "Style"
          },
          {
            "name": "\"row-text\"",
            "description": "",
            "type": "Style"
          },
          {
            "name": "title",
            "description": "",
            "type": "Style"
          },
          {
            "name": "description",
            "description": "",
            "type": "Style"
          },
          {
            "name": "\"error-message\"",
            "description": "",
            "type": "Style"
          },
          {
            "name": "\"warning-box\"",
            "description": "",
            "type": "Style"
          },
          {
            "name": "input",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--header-foreground",
        "value": "var(--foreground-100)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-100"
        ],
        "variant": ".confirm"
      },
      {
        "name": "--description-foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".confirm"
      },
      {
        "name": "--error-foreground",
        "value": "var(--foreground-danger)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-danger"
        ],
        "variant": ".confirm"
      },
      {
        "name": "--countdown-foreground",
        "value": "var(--foreground-400)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".confirm"
      },
      {
        "name": "--label-foreground",
        "value": "var(--foreground-300)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-300"
        ],
        "variant": ".confirm"
      },
      {
        "name": "--input-background",
        "value": "var(--background-800)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".confirm"
      },
      {
        "name": "--input-foreground",
        "value": "var(--foreground-100)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-100"
        ],
        "variant": ".confirm"
      },
      {
        "name": "--warning-background",
        "value": "var(--warning-background-low)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-background-low"
        ],
        "variant": ".warning-box-low"
      },
      {
        "name": "--background",
        "value": "var(--warning-border-color-low)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-border-color-low"
        ],
        "variant": ""
      },
      {
        "name": "--warning-foreground",
        "value": "var(--warning-foreground-low)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-foreground-low"
        ],
        "variant": ".warning-box-low"
      },
      {
        "name": "--warning-background",
        "value": "var(--warning-background-medium)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-background-medium"
        ],
        "variant": ".warning-box-medium"
      },
      {
        "name": "--background",
        "value": "var(--warning-border-color-medium)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-border-color-medium"
        ],
        "variant": ""
      },
      {
        "name": "--warning-foreground",
        "value": "var(--warning-foreground-medium)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-foreground-medium"
        ],
        "variant": ".warning-box-medium"
      },
      {
        "name": "--warning-background",
        "value": "var(--warning-background-high)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-background-high"
        ],
        "variant": ".warning-box-high"
      },
      {
        "name": "--background",
        "value": "var(--warning-border-color-high)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-border-color-high"
        ],
        "variant": ""
      },
      {
        "name": "--warning-foreground",
        "value": "var(--warning-foreground-high)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-foreground-high"
        ],
        "variant": ".warning-box-high"
      },
      {
        "name": "--warning-background",
        "value": "var(--warning-background-critical)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-background-critical"
        ],
        "variant": ".warning-box-critical"
      },
      {
        "name": "--background",
        "value": "var(--warning-border-color-critical)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-border-color-critical"
        ],
        "variant": ""
      },
      {
        "name": "--warning-foreground",
        "value": "var(--warning-foreground-critical)",
        "defaultValue": null,
        "referencedVars": [
          "--warning-foreground-critical"
        ],
        "variant": ".warning-box-critical"
      },
      {
        "name": "--background",
        "value": "var(--input-background)",
        "defaultValue": null,
        "referencedVars": [
          "--input-background"
        ],
        "variant": ".input"
      },
      {
        "name": "--background",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ""
      },
      {
        "name": "--foreground",
        "value": "var(--input-foreground)",
        "defaultValue": null,
        "referencedVars": [
          "--input-foreground"
        ],
        "variant": ".input"
      }
    ]
  },
  "color": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer theme, base, components, utilities;\n\n@layer components.defaults {\n  .color {\n    --background: color-mix(in srgb, var(--background-800) 30%, transparent);\n    --focus-visible: var(--accent-500);\n\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    background-color: var(--background);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius-sm, 0.375rem);\n    width: 260px;\n  }\n\n  .color[data-disabled=\"true\"] {\n    opacity: 0.5;\n    pointer-events: none;\n  }\n\n  .color[data-variant=\"popover\"] {\n    background: transparent;\n    border-color: transparent;\n    border-radius: 0;\n  }\n\n  .color-provider {\n    display: inline-flex;\n    width: fit-content;\n  }\n\n  .color-provider .color-trigger {\n    --trigger-background: color-mix(in srgb, var(--background-800) 35%, transparent);\n    --trigger-background-hover: color-mix(in srgb, var(--background-700) 45%, transparent);\n    --trigger-text: var(--foreground-200);\n    --focus-visible: var(--accent-500);\n    --checkerboard-dark: var(--background-700);\n    --checkerboard-light: var(--background-800);\n\n    display: inline-flex;\n    align-items: center;\n    gap: 0.625rem;\n    min-width: 170px;\n    height: 40px;\n    padding: 0 0.75rem;\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    border-radius: var(--radius-sm, 0.375rem);\n    background: var(--trigger-background);\n    color: var(--trigger-text);\n    cursor: pointer;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .color-provider .color-trigger:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background: var(--trigger-background-hover);\n  }\n\n  .color-provider .color-trigger:focus-visible {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .color-provider .color-trigger[data-disabled=\"true\"] {\n    opacity: 0.5;\n    cursor: not-allowed;\n  }\n\n  .color-provider .color-trigger[data-size=\"sm\"] {\n    min-width: 150px;\n    height: 34px;\n    padding: 0 0.625rem;\n    font-size: var(--text-xs, 0.75rem);\n  }\n\n  .color-provider .color-trigger[data-size=\"lg\"] {\n    min-width: 190px;\n    height: 46px;\n    padding: 0 0.875rem;\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n  }\n\n  .color-provider .color-trigger-swatch {\n    position: relative;\n    width: 20px;\n    height: 20px;\n    flex: 0 0 auto;\n    border-radius: var(--radius-xs, 0.25rem);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    overflow: hidden;\n  }\n\n  .color-provider .color-trigger-swatch::before {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-image: repeating-linear-gradient(\n      45deg,\n      var(--checkerboard-dark),\n      var(--checkerboard-dark) 4px,\n      var(--checkerboard-light) 4px,\n      var(--checkerboard-light) 8px\n    );\n  }\n\n  .color-provider .color-trigger-swatch::after {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-color: var(--preview-color, transparent);\n  }\n\n  .color-provider .color-trigger-value {\n    min-width: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .color .controls {\n    @apply pb-3 px-3 space-y-3;\n  }\n\n  .input-group {\n    width: 100%;\n  }\n\n  .input-group > div:first-child {\n    flex: 1;\n  }\n\n  .input-group .input {\n    width: 100%;\n  }\n\n  .input-group .format {\n    flex-shrink: 0;\n    width: 85px;\n  }\n\n  .color[data-size=\"sm\"] .format {\n    width: 75px;\n  }\n\n  .canvas {\n    position: relative;\n    width: 240px;\n    height: 160px;\n    @apply mx-auto mt-2 rounded-sm;\n    cursor: crosshair;\n    touch-action: none;\n    display: flex;\n    flex-direction: column;\n  }\n\n  .canvas[data-size=\"sm\"] {\n    width: 200px;\n    height: 130px;\n  }\n\n  .canvas[data-size=\"lg\"] {\n    width: 280px;\n    height: 190px;\n  }\n\n  .canvas[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .canvas .canvas-inner {\n    position: relative;\n    width: 100%;\n    flex: 1;\n    overflow: hidden;\n    @apply rounded-sm;\n  }\n\n  .canvas .canvas-gradient-hue {\n    position: absolute;\n    inset: 0;\n    overflow: hidden;\n  }\n\n  .canvas .canvas-gradient-saturation {\n    position: absolute;\n    inset: 0;\n    background: linear-gradient(to right, rgb(255, 255, 255), transparent);\n  }\n\n  .canvas .canvas-gradient-brightness {\n    position: absolute;\n    inset: 0;\n    background: linear-gradient(to top, rgb(0, 0, 0), transparent);\n  }\n\n  .canvas .canvas-pointer {\n    --pointer-border: color-mix(in srgb, var(--foreground-200) 50%, transparent);\n\n    position: absolute;\n    width: 12px;\n    height: 12px;\n    border-radius: var(--radius-full);\n    border: 2px solid var(--pointer-border);\n    box-shadow:\n      0 0 0 1px rgb(0 0 0 / 0.3),\n      0 2px 4px rgb(0 0 0 / 0.3);\n    pointer-events: none;\n    transform: translate(-50%, -50%);\n    z-index: 10;\n  }\n\n  .hue-slider {\n    --track-height: calc(var(--spacing, 0.25rem) * 5);\n    --padding-block: var(--padding, calc(var(--spacing, 0.25rem) * 0.5));\n    --side-padding: var(--inline-padding, 2px);\n    --thumb-width: calc(var(--track-height) - (var(--padding-block) * 2));\n    --thumb-height: var(--thumb-width);\n    --gradient-inset: 0;\n    --track-background: linear-gradient(\n      to right,\n      hsl(0, 100%, 50%),\n      hsl(60, 100%, 50%),\n      hsl(120, 100%, 50%),\n      hsl(180, 100%, 50%),\n      hsl(240, 100%, 50%),\n      hsl(300, 100%, 50%),\n      hsl(360, 100%, 50%)\n    );\n    --range-background: transparent;\n    --hit-size: calc(var(--track-height) + (var(--padding-block) * 2));\n    --thumb-inset: calc(var(--side-padding) + (var(--thumb-width) / 2));\n    --thumb-background: transparent;\n    --thumb-border: 2px solid white;\n    --thumb-shadow: 0 0 0 1px rgb(0 0 0 / 0.28);\n    --top: 50%;\n    --transform: translate(-50%, -50%);\n\n    width: 100%;\n    box-sizing: border-box;\n    min-height: var(--hit-size);\n    padding-block: var(--padding-block);\n  }\n\n  .hue-slider .hue-track {\n    position: relative;\n    width: 100%;\n    height: var(--track-height);\n    overflow: hidden;\n    @apply rounded-full;\n    background: transparent;\n  }\n\n  .hue-slider .hue-track::before {\n    content: \"\";\n    position: absolute;\n    inset-block: 0;\n    inset-inline: var(--gradient-inset);\n    @apply rounded-full;\n    background: var(--track-background);\n    pointer-events: none;\n  }\n\n  .hue-slider .hue-range {\n    background: transparent;\n  }\n\n  .hue-slider .hue-thumb {\n    --thumb-shadow-hover: 0 0 0 1px rgb(0 0 0 / 0.38);\n    --thumb-shadow-active: 0 0 0 1px rgb(0 0 0 / 0.24);\n\n    position: absolute;\n    left: clamp(var(--thumb-inset, 0px), var(--position, 0%), calc(100% - var(--thumb-inset, 0px)));\n    top: var(--top);\n    box-sizing: border-box;\n    width: var(--thumb-width);\n    height: var(--thumb-height);\n    transform: var(--transform);\n    border: var(--thumb-border);\n    @apply rounded-full;\n    background: var(--thumb-background);\n    box-shadow: var(--thumb-shadow);\n  }\n\n  .opacity-slider {\n    --size: calc(var(--spacing, 0.25rem) * 4);\n    --padding-block: var(--padding, calc(var(--spacing, 0.25rem) * 0.5));\n    --range-background: transparent;\n    --thumb-width: calc(var(--size) - (var(--padding-block) * 2));\n    --padding-inline: var(--inline-padding, var(--padding-block));\n    --hit-size: calc(var(--size) + (var(--padding-block) * 2));\n    --thumb-height: var(--thumb-width);\n    --side-padding: 2px;\n    --thumb-inset: calc(var(--side-padding) + (var(--thumb-width) / 2));\n    --thumb-background: transparent;\n    --thumb-border: 2px solid white;\n    --thumb-shadow: 0 0 0 1px rgb(0 0 0 / 0.28);\n    --top: 50%;\n    --transform: translate(-50%, -50%);\n    --checkerboard-dark: var(--background-800);\n    --checkerboard-light: var(--background-700);\n    --track-background:\n      linear-gradient(to right, transparent, var(--color-slider-opacity-color, rgb(0, 0, 0))),\n      repeating-linear-gradient(\n        45deg,\n        var(--checkerboard-dark),\n        var(--checkerboard-dark) 10px,\n        var(--checkerboard-light) 10px,\n        var(--checkerboard-light) 20px\n      );\n\n    width: 100%;\n    box-sizing: border-box;\n    min-height: var(--hit-size);\n    padding-block: var(--padding-block);\n    padding-inline: var(--padding-inline);\n    @apply rounded-full;\n  }\n\n  .opacity-slider .opacity-track {\n    position: relative;\n    width: 100%;\n    height: var(--size);\n    overflow: hidden;\n    @apply rounded-full;\n    background: var(--track-background);\n  }\n\n  .opacity-slider .opacity-range {\n    background: transparent;\n  }\n\n  .opacity-slider .opacity-thumb {\n    --thumb-shadow-hover: 0 0 0 1px rgb(0 0 0 / 0.38);\n    --thumb-shadow-active: 0 0 0 1px rgb(0 0 0 / 0.24);\n\n    position: absolute;\n    top: var(--top);\n    box-sizing: border-box;\n    width: var(--thumb-width);\n    height: var(--thumb-height);\n    transform: var(--transform);\n    border: var(--thumb-border);\n    @apply rounded-full;\n    background: var(--thumb-background);\n    box-shadow: var(--thumb-shadow);\n  }\n\n  .hue-slider .hue-thumb[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .hue-slider .hue-thumb[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    box-shadow: var(--thumb-shadow-hover, var(--thumb-shadow));\n  }\n\n  .hue-slider .hue-thumb[data-pressed=\"true\"] {\n    box-shadow: var(--thumb-shadow-active, var(--thumb-shadow));\n  }\n\n  .opacity-slider .opacity-thumb[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .opacity-slider .opacity-thumb[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    box-shadow: var(--thumb-shadow-hover);\n  }\n\n  .opacity-slider .opacity-thumb[data-pressed=\"true\"] {\n    box-shadow: var(--thumb-shadow-active);\n  }\n\n  .chroma-slider {\n    --size: calc(var(--spacing, 0.25rem) * 4);\n    --padding-block: var(--padding, calc(var(--spacing, 0.25rem) * 0.5));\n    --range-background: transparent;\n    --thumb-width: calc(var(--size) - (var(--padding-block) * 2));\n    --padding-inline: var(--inline-padding, var(--padding-block));\n    --hit-size: calc(var(--size) + (var(--padding-block) * 2));\n    --thumb-height: var(--thumb-width);\n    --side-padding: 2px;\n    --thumb-inset: calc(var(--side-padding) + (var(--thumb-width) / 2));\n    --thumb-background: transparent;\n    --thumb-border: 2px solid white;\n    --thumb-shadow: 0 0 0 1px rgb(0 0 0 / 0.28);\n    --top: 50%;\n    --transform: translate(-50%, -50%);\n    width: 100%;\n    box-sizing: border-box;\n    min-height: var(--hit-size);\n    padding-block: var(--padding-block);\n    padding-inline: var(--padding-inline);\n    @apply rounded-full;\n  }\n\n  .chroma-slider .chroma-track {\n    position: relative;\n    width: 100%;\n    height: var(--size);\n    overflow: hidden;\n    @apply rounded-full;\n  }\n\n  .chroma-slider .chroma-range {\n    background: transparent;\n  }\n\n  .chroma-slider .chroma-thumb {\n    --thumb-shadow-hover: 0 0 0 1px rgb(0 0 0 / 0.38);\n    --thumb-shadow-active: 0 0 0 1px rgb(0 0 0 / 0.24);\n\n    position: absolute;\n    top: var(--top);\n    box-sizing: border-box;\n    width: var(--thumb-width);\n    height: var(--thumb-height);\n    transform: var(--transform);\n    border: var(--thumb-border);\n    @apply rounded-full;\n    background: var(--thumb-background);\n    box-shadow: var(--thumb-shadow);\n  }\n\n  .chroma-slider .chroma-thumb[data-focus-visible=\"true\"] {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .chroma-slider .chroma-thumb[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    box-shadow: var(--thumb-shadow-hover);\n  }\n\n  .chroma-slider .chroma-thumb[data-pressed=\"true\"] {\n    box-shadow: var(--thumb-shadow-active);\n  }\n\n  .recent-colors {\n    display: flex;\n    gap: 0.5rem;\n    overflow-x: auto;\n    padding-bottom: 0.25rem;\n  }\n\n  .recent-colors .recent-color-swatch {\n    flex-shrink: 0;\n    width: 32px;\n    height: 32px;\n    border-radius: var(--radius-sm);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    cursor: pointer;\n    background: none;\n    padding: 0;\n    outline: none;\n    transition:\n      box-shadow var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .recent-colors .recent-color-swatch:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    transform: scale(1.1);\n    box-shadow: 0 0 0 2px var(--focus-visible);\n  }\n\n  .recent-colors .recent-color-swatch:active {\n    transform: scale(0.95);\n  }\n\n  .recent-colors .recent-color-swatch:focus-visible {\n    outline: 2px solid var(--focus-visible);\n    outline-offset: 2px;\n  }\n\n  .preview-swatch {\n    --checkerboard-dark: var(--background-700);\n    --checkerboard-light: var(--background-800);\n\n    position: relative;\n    width: 36px;\n    height: 36px;\n    border-radius: var(--radius-sm);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);\n    overflow: hidden;\n    flex-shrink: 0;\n  }\n\n  .preview-swatch::before {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-image: repeating-linear-gradient(\n      45deg,\n      var(--checkerboard-dark),\n      var(--checkerboard-dark) 6px,\n      var(--checkerboard-light) 6px,\n      var(--checkerboard-light) 12px\n    );\n    border-radius: var(--radius-sm);\n    pointer-events: none;\n    z-index: 1;\n  }\n\n  .preview-swatch::after {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-color: var(--preview-color, transparent);\n    border-radius: var(--radius-sm);\n    pointer-events: none;\n    z-index: 2;\n  }\n\n  .preview {\n    --checkerboard-dark: var(--background-700);\n    --checkerboard-light: var(--background-800);\n\n    position: relative;\n    width: 64px;\n    height: 64px;\n    border-radius: var(--radius-sm);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);\n    overflow: hidden;\n  }\n\n  .preview::before {\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    background-image: repeating-linear-gradient(\n      45deg,\n      var(--checkerboard-dark),\n      var(--checkerboard-dark) 10px,\n      var(--checkerboard-light) 10px,\n      var(--checkerboard-light) 20px\n    );\n    border-radius: var(--radius-sm);\n    pointer-events: none;\n    z-index: 1;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "provider"
      },
      {
        "name": "root"
      },
      {
        "name": "trigger"
      },
      {
        "name": "triggerSwatch"
      },
      {
        "name": "triggerValue"
      },
      {
        "name": "controls"
      },
      {
        "name": "canvas"
      },
      {
        "name": "canvasInner"
      },
      {
        "name": "canvasGradient.hue"
      },
      {
        "name": "canvasGradient.saturation"
      },
      {
        "name": "canvasGradient.brightness"
      },
      {
        "name": "canvasPointer"
      },
      {
        "name": "slider.hue"
      },
      {
        "name": "slider.opacity"
      },
      {
        "name": "slider.chroma"
      },
      {
        "name": "sliderTrack.hue"
      },
      {
        "name": "sliderTrack.opacity"
      },
      {
        "name": "sliderTrack.chroma"
      },
      {
        "name": "sliderThumb.hue"
      },
      {
        "name": "sliderThumb.opacity"
      },
      {
        "name": "sliderThumb.chroma"
      },
      {
        "name": "recentColors"
      },
      {
        "name": "recentColorSwatch"
      },
      {
        "name": "inputGroup"
      },
      {
        "name": "input"
      },
      {
        "name": "format"
      },
      {
        "name": "previewSwatch"
      }
    ],
    "styleableGroups": [
      {
        "name": "ColorStyleSlots",
        "slots": [
          {
            "name": "provider",
            "description": "",
            "type": "Style"
          },
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "trigger",
            "description": "",
            "type": "Style"
          },
          {
            "name": "triggerSwatch",
            "description": "",
            "type": "Style"
          },
          {
            "name": "triggerValue",
            "description": "",
            "type": "Style"
          },
          {
            "name": "controls",
            "description": "",
            "type": "Style"
          },
          {
            "name": "canvas",
            "description": "",
            "type": "Style"
          },
          {
            "name": "canvasInner",
            "description": "",
            "type": "Style"
          },
          {
            "name": "canvasGradient.hue",
            "description": "",
            "type": "Style"
          },
          {
            "name": "canvasGradient.saturation",
            "description": "",
            "type": "Style"
          },
          {
            "name": "canvasGradient.brightness",
            "description": "",
            "type": "Style"
          },
          {
            "name": "canvasPointer",
            "description": "",
            "type": "Style"
          },
          {
            "name": "slider.hue",
            "description": "",
            "type": "Style"
          },
          {
            "name": "slider.opacity",
            "description": "",
            "type": "Style"
          },
          {
            "name": "slider.chroma",
            "description": "",
            "type": "Style"
          },
          {
            "name": "sliderTrack.hue",
            "description": "",
            "type": "Style"
          },
          {
            "name": "sliderTrack.opacity",
            "description": "",
            "type": "Style"
          },
          {
            "name": "sliderTrack.chroma",
            "description": "",
            "type": "Style"
          },
          {
            "name": "sliderThumb.hue",
            "description": "",
            "type": "Style"
          },
          {
            "name": "sliderThumb.opacity",
            "description": "",
            "type": "Style"
          },
          {
            "name": "sliderThumb.chroma",
            "description": "",
            "type": "Style"
          },
          {
            "name": "recentColors",
            "description": "",
            "type": "Style"
          },
          {
            "name": "recentColorSwatch",
            "description": "",
            "type": "Style"
          },
          {
            "name": "inputGroup",
            "description": "",
            "type": "Style"
          },
          {
            "name": "input",
            "description": "",
            "type": "Style"
          },
          {
            "name": "format",
            "description": "",
            "type": "Style"
          },
          {
            "name": "previewSwatch",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "color-mix(in srgb, var(--background-800) 30%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".color"
      },
      {
        "name": "--focus-visible",
        "value": "var(--accent-400)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-400"
        ],
        "variant": ".color"
      },
      {
        "name": "--background",
        "value": "color-mix(in srgb, var(--background-800) 30%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".color"
      },
      {
        "name": "--focus-visible",
        "value": "var(--accent-500)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-500"
        ],
        "variant": ".color"
      },
      {
        "name": "--trigger-background",
        "value": "color-mix(in srgb, var(--background-800) 35%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".color-provider .color-trigger"
      },
      {
        "name": "--trigger-background-hover",
        "value": "color-mix(in srgb, var(--background-700) 45%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".color-provider .color-trigger"
      },
      {
        "name": "--trigger-text",
        "value": "var(--foreground-200)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-200"
        ],
        "variant": ".color-provider .color-trigger"
      },
      {
        "name": "--focus-visible",
        "value": "var(--accent-500)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-500"
        ],
        "variant": ".color-provider .color-trigger"
      },
      {
        "name": "--checkerboard-dark",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".color-provider .color-trigger"
      },
      {
        "name": "--checkerboard-light",
        "value": "var(--background-800)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".color-provider .color-trigger"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".color-provider .color-trigger:hover"
      },
      {
        "name": "--pointer-border",
        "value": "color-mix(in srgb, var(--foreground-200) 50%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-200"
        ],
        "variant": ".canvas .canvas-pointer"
      },
      {
        "name": "--track-height",
        "value": "calc(var(--spacing, 0.25rem) * 5)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".hue-slider"
      },
      {
        "name": "--padding-block",
        "value": "var(--padding, calc(var(--spacing, 0.25rem) * 0.5))",
        "defaultValue": "calc(var(--spacing, 0.25rem",
        "referencedVars": [
          "--padding"
        ],
        "variant": ".hue-slider"
      },
      {
        "name": "--side-padding",
        "value": "var(--inline-padding, 2px)",
        "defaultValue": "2px",
        "referencedVars": [
          "--inline-padding"
        ],
        "variant": ".hue-slider"
      },
      {
        "name": "--thumb-width",
        "value": "calc(var(--track-height) - (var(--padding-block) * 2))",
        "defaultValue": null,
        "referencedVars": [
          "--track-height",
          "--padding-block"
        ],
        "variant": ".hue-slider"
      },
      {
        "name": "--thumb-height",
        "value": "var(--thumb-width)",
        "defaultValue": null,
        "referencedVars": [
          "--thumb-width"
        ],
        "variant": ".hue-slider"
      },
      {
        "name": "--gradient-inset",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--track-background",
        "value": "linear-gradient(\n      to right,\n      hsl(0, 100%, 50%),\n      hsl(60, 100%, 50%),\n      hsl(120, 100%, 50%),\n      hsl(180, 100%, 50%),\n      hsl(240, 100%, 50%),\n      hsl(300, 100%, 50%),\n      hsl(360, 100%, 50%)\n    )",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--range-background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--hit-size",
        "value": "calc(var(--track-height) + (var(--padding-block) * 2))",
        "defaultValue": null,
        "referencedVars": [
          "--track-height",
          "--padding-block"
        ],
        "variant": ".hue-slider"
      },
      {
        "name": "--thumb-inset",
        "value": "calc(var(--side-padding) + (var(--thumb-width) / 2))",
        "defaultValue": null,
        "referencedVars": [
          "--side-padding",
          "--thumb-width"
        ],
        "variant": ".hue-slider"
      },
      {
        "name": "--thumb-background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--thumb-border",
        "value": "2px solid white",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--thumb-shadow",
        "value": "0 0 0 1px rgb(0 0 0 / 0.28)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--top",
        "value": "50%",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--transform",
        "value": "translate(-50%, -50%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider"
      },
      {
        "name": "--thumb-shadow-hover",
        "value": "0 0 0 1px rgb(0 0 0 / 0.38)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider .hue-thumb"
      },
      {
        "name": "--thumb-shadow-active",
        "value": "0 0 0 1px rgb(0 0 0 / 0.24)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".hue-slider .hue-thumb"
      },
      {
        "name": "--size",
        "value": "calc(var(--spacing, 0.25rem) * 4)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--padding-block",
        "value": "var(--padding, calc(var(--spacing, 0.25rem) * 0.5))",
        "defaultValue": "calc(var(--spacing, 0.25rem",
        "referencedVars": [
          "--padding"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--range-background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider"
      },
      {
        "name": "--thumb-width",
        "value": "calc(var(--size) - (var(--padding-block) * 2))",
        "defaultValue": null,
        "referencedVars": [
          "--size",
          "--padding-block"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--padding-inline",
        "value": "var(--inline-padding, var(--padding-block))",
        "defaultValue": "var(--padding-block",
        "referencedVars": [
          "--inline-padding"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--hit-size",
        "value": "calc(var(--size) + (var(--padding-block) * 2))",
        "defaultValue": null,
        "referencedVars": [
          "--size",
          "--padding-block"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--thumb-height",
        "value": "var(--thumb-width)",
        "defaultValue": null,
        "referencedVars": [
          "--thumb-width"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--side-padding",
        "value": "2px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider"
      },
      {
        "name": "--thumb-inset",
        "value": "calc(var(--side-padding) + (var(--thumb-width) / 2))",
        "defaultValue": null,
        "referencedVars": [
          "--side-padding",
          "--thumb-width"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--thumb-background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider"
      },
      {
        "name": "--thumb-border",
        "value": "2px solid white",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider"
      },
      {
        "name": "--thumb-shadow",
        "value": "0 0 0 1px rgb(0 0 0 / 0.28)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider"
      },
      {
        "name": "--top",
        "value": "50%",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider"
      },
      {
        "name": "--transform",
        "value": "translate(-50%, -50%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider"
      },
      {
        "name": "--checkerboard-dark",
        "value": "var(--background-800)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--checkerboard-light",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--track-background",
        "value": "linear-gradient(to right, transparent, var(--color-slider-opacity-color, rgb(0, 0, 0))),\n      repeating-linear-gradient(\n        45deg,\n        var(--checkerboard-dark),\n        var(--checkerboard-dark) 10px,\n        var(--checkerboard-light) 10px,\n        var(--checkerboard-light) 20px\n      )",
        "defaultValue": "rgb(0, 0, 0",
        "referencedVars": [
          "--color-slider-opacity-color",
          "--checkerboard-dark",
          "--checkerboard-light"
        ],
        "variant": ".opacity-slider"
      },
      {
        "name": "--thumb-shadow-hover",
        "value": "0 0 0 1px rgb(0 0 0 / 0.38)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider .opacity-thumb"
      },
      {
        "name": "--thumb-shadow-active",
        "value": "0 0 0 1px rgb(0 0 0 / 0.24)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".opacity-slider .opacity-thumb"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".hue-slider .hue-thumb[data-hovered=\"true\"]"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".opacity-slider .opacity-thumb[data-hovered=\"true\"]"
      },
      {
        "name": "--size",
        "value": "calc(var(--spacing, 0.25rem) * 4)",
        "defaultValue": "0.25rem",
        "referencedVars": [
          "--spacing"
        ],
        "variant": ".chroma-slider"
      },
      {
        "name": "--padding-block",
        "value": "var(--padding, calc(var(--spacing, 0.25rem) * 0.5))",
        "defaultValue": "calc(var(--spacing, 0.25rem",
        "referencedVars": [
          "--padding"
        ],
        "variant": ".chroma-slider"
      },
      {
        "name": "--range-background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider"
      },
      {
        "name": "--thumb-width",
        "value": "calc(var(--size) - (var(--padding-block) * 2))",
        "defaultValue": null,
        "referencedVars": [
          "--size",
          "--padding-block"
        ],
        "variant": ".chroma-slider"
      },
      {
        "name": "--padding-inline",
        "value": "var(--inline-padding, var(--padding-block))",
        "defaultValue": "var(--padding-block",
        "referencedVars": [
          "--inline-padding"
        ],
        "variant": ".chroma-slider"
      },
      {
        "name": "--hit-size",
        "value": "calc(var(--size) + (var(--padding-block) * 2))",
        "defaultValue": null,
        "referencedVars": [
          "--size",
          "--padding-block"
        ],
        "variant": ".chroma-slider"
      },
      {
        "name": "--thumb-height",
        "value": "var(--thumb-width)",
        "defaultValue": null,
        "referencedVars": [
          "--thumb-width"
        ],
        "variant": ".chroma-slider"
      },
      {
        "name": "--side-padding",
        "value": "2px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider"
      },
      {
        "name": "--thumb-inset",
        "value": "calc(var(--side-padding) + (var(--thumb-width) / 2))",
        "defaultValue": null,
        "referencedVars": [
          "--side-padding",
          "--thumb-width"
        ],
        "variant": ".chroma-slider"
      },
      {
        "name": "--thumb-background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider"
      },
      {
        "name": "--thumb-border",
        "value": "2px solid white",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider"
      },
      {
        "name": "--thumb-shadow",
        "value": "0 0 0 1px rgb(0 0 0 / 0.28)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider"
      },
      {
        "name": "--top",
        "value": "50%",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider"
      },
      {
        "name": "--transform",
        "value": "translate(-50%, -50%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider"
      },
      {
        "name": "--thumb-shadow-hover",
        "value": "0 0 0 1px rgb(0 0 0 / 0.38)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider .chroma-thumb"
      },
      {
        "name": "--thumb-shadow-active",
        "value": "0 0 0 1px rgb(0 0 0 / 0.24)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chroma-slider .chroma-thumb"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".chroma-slider .chroma-thumb[data-hovered=\"true\"]"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".recent-colors .recent-color-swatch:hover"
      },
      {
        "name": "--checkerboard-dark",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".preview-swatch"
      },
      {
        "name": "--checkerboard-light",
        "value": "var(--background-800)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".preview-swatch"
      },
      {
        "name": "--checkerboard-dark",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".preview"
      },
      {
        "name": "--checkerboard-light",
        "value": "var(--background-800)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".preview"
      }
    ]
  },
  "command": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .root {\n    min-width: 0;\n  }\n\n  .content {\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr) auto;\n    min-height: 0;\n    /* Single source of truth for the palette height: the search row and footer\n       keep their intrinsic size and the list absorbs whatever is left, so\n       raising --height grows the scroll region instead of doing nothing. */\n    --content-max-height: var(--height, min(32rem, 60dvh));\n    max-height: var(--content-max-height);\n  }\n\n  /* Overlay Container */\n  .overlay {\n    @apply fixed inset-0;\n    z-index: 999;\n    /* Apply backdrop styles directly to avoid creating a containing block that disrupts sticky elements */\n    background-color: var(--overlay);\n    backdrop-filter: var(--overlay-backdrop);\n    opacity: 0;\n    pointer-events: none;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      backdrop-filter 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] {\n    opacity: 1;\n    pointer-events: auto;\n  }\n\n  /* Content */\n  .overlay .content {\n    @apply absolute;\n    /* Anchor the palette's top center at a viewport-relative position. Keeping\n       the anchor on the top edge prevents filtering from moving the palette\n       when its animated height changes. */\n    offset-path: ray(0deg at var(--origin, 50% 20%));\n    offset-distance: 0;\n    offset-anchor: center top;\n    offset-rotate: 0deg;\n    width: min(var(--width, 28rem), calc(100% - 2rem));\n    /* Alignment positioning keeps the palette on screen at any origin, so the\n       cap only has to leave the viewport gutter. */\n    max-height: min(var(--content-max-height), calc(100% - 2rem));\n    /* Keep opening motion anchored to the same stable top edge. */\n    transform-origin: center top;\n    border-radius: var(--radius-sm);\n    background: var(--background);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    box-shadow: var(--background-shadow);\n    opacity: 0;\n    transform: scale(0.98);\n    pointer-events: none;\n    transition:\n      opacity 180ms var(--ease-snappy-pop, ease-out),\n      transform 180ms var(--ease-snappy-pop, ease-out);\n  }\n\n  .overlay[data-state=\"entered\"] .content {\n    opacity: 1;\n    transform: scale(1);\n    pointer-events: auto;\n  }\n\n  .embedded {\n    @apply relative;\n    width: min(var(--width, 100%), 100%);\n    transform-origin: top center;\n    border-radius: var(--radius-sm);\n    background: var(--background);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    box-shadow: var(--background-shadow);\n  }\n\n  .inner {\n    @apply pt-1.5;\n    display: flex;\n    flex-direction: column;\n    min-height: 0;\n    /* Frame's SVG stroke is a documented decorative API, outside the border slot contract. */\n    --stroke-color: var(--border);\n    --fill: var(--background);\n    --frame-radius: var(--radius-sm);\n  }\n\n  /* Frame wraps its children in a div; it has to shrink with the Frame so the\n     scroll region resolves its height against the palette, not its content. */\n  .inner > div {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    min-height: 0;\n    overflow: hidden;\n  }\n\n  /* Search Section */\n  .search {\n    @apply flex p-1.5;\n    --input-active-box-shadow: none;\n  }\n\n  .search :global(.input-scope) {\n    flex: 1;\n    min-width: 0;\n  }\n\n  .input {\n    background: transparent;\n    box-shadow: none;\n    font-weight: var(--font-weight-body-medium, 500);\n  }\n\n  .search :global([data-focus-indicator=\"local\"]) {\n    display: none;\n  }\n\n  .input-empty :global([data-actions-position=\"right\"]) {\n    visibility: hidden;\n  }\n\n  /* List Section */\n  .list {\n    @apply py-0.5 px-2 space-y-2;\n    border-radius: var(--frame-radius) var(--frame-radius) 0 0;\n  }\n\n  .list :global([role=\"listbox\"]) {\n    @apply flex w-full flex-col;\n  }\n\n  .item {\n    @apply flex items-center justify-between rounded-sm px-2 py-0.5 cursor-pointer;\n    border-radius: 0.375rem;\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    background-color: var(--background);\n    color: var(--foreground);\n  }\n\n  .item:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n  }\n\n  .item-content {\n    @apply flex min-w-0 flex-1 items-center gap-2.5;\n    flex: 1;\n  }\n\n  .item-icon {\n    @apply h-8 w-8 self-start rounded-sm;\n    background-color: var(--background-800);\n    color: var(--foreground-400);\n  }\n\n  .item-labels {\n    flex: 1;\n    @apply min-w-0;\n  }\n\n  .item .label {\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading, var(--leading-sm, 1.25rem));\n    color: var(--foreground);\n    @apply overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .item .description {\n    color: var(--foreground);\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-body-size, var(--text-base, 0.9375rem)));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading, var(--leading-body, 1.5));\n    @apply overflow-hidden text-ellipsis whitespace-nowrap;\n  }\n\n  .hint-wrapper {\n    @apply flex items-center;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .category-header {\n    @apply px-2 py-1.5 mt-2 first:mt-0;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground);\n  }\n\n  /* Empty State */\n  .empty {\n    padding: 1.5rem 1rem;\n    text-align: center;\n    font-family: var(--font-body, inherit);\n    font-size: var(--size, var(--text-body-size, var(--text-base, 0.9375rem)));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading, var(--leading-body, 1.5));\n    color: var(--foreground);\n  }\n\n  /* Footer */\n  .footer {\n    @apply flex w-full items-center gap-2 px-1.5 py-2;\n    background-color: var(--background);\n    border-top: slot(border, width, 1px) slot(border, style, solid)\n      slot(border, background, transparent);\n    justify-content: flex-between;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .overlay,\n    .content {\n      transition: none;\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "content"
      },
      {
        "name": "icon"
      },
      {
        "name": "hint"
      },
      {
        "name": "label"
      },
      {
        "name": "description"
      },
      {
        "name": "group"
      },
      {
        "name": "overlay"
      },
      {
        "name": "search"
      },
      {
        "name": "input"
      },
      {
        "name": "inner"
      },
      {
        "name": "list"
      },
      {
        "name": "empty"
      },
      {
        "name": "item.root"
      },
      {
        "name": "item.content"
      },
      {
        "name": "item.icon"
      },
      {
        "name": "item.hint"
      },
      {
        "name": "item.label"
      },
      {
        "name": "item.description"
      },
      {
        "name": "category"
      },
      {
        "name": "footer"
      },
      {
        "name": "groups.root"
      },
      {
        "name": "groups.group"
      }
    ],
    "styleableGroups": [
      {
        "name": "CommandItemStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles applied to the item option element.",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "Styles applied to the wrapper containing the icon and item label.",
            "type": "Style"
          },
          {
            "name": "icon",
            "description": "Styles applied to the item icon container.",
            "type": "Style"
          },
          {
            "name": "hint",
            "description": "Styles applied to the item hint badge.",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "Styles applied to Command.Label within the item.",
            "type": "Style"
          },
          {
            "name": "description",
            "description": "Styles applied to Command.Description within the item.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "CommandGroupsStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles applied to the Command.Groups container.",
            "type": "Style"
          },
          {
            "name": "group",
            "description": "Styles applied to each category group rendered by Command.Groups.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "CommandStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles applied to the command surface.",
            "type": "Style"
          },
          {
            "name": "overlay",
            "description": "Styles applied to the modal backdrop in floating mode.",
            "type": "Style"
          },
          {
            "name": "search",
            "description": "Styles applied to the search input wrapper.",
            "type": "Style"
          },
          {
            "name": "input",
            "description": "Styles applied to the search input root.",
            "type": "Style"
          },
          {
            "name": "inner",
            "description": "Styles applied to the framed list container.",
            "type": "Style"
          },
          {
            "name": "list",
            "description": "Styles applied to the scrollable command list.",
            "type": "Style"
          },
          {
            "name": "empty",
            "description": "Styles applied to the empty-state message.",
            "type": "Style"
          },
          {
            "name": "item.root",
            "description": "Styles applied to the item option element.",
            "type": "Style"
          },
          {
            "name": "item.content",
            "description": "Styles applied to the wrapper containing the icon and item label.",
            "type": "Style"
          },
          {
            "name": "item.icon",
            "description": "Styles applied to the item icon container.",
            "type": "Style"
          },
          {
            "name": "item.hint",
            "description": "Styles applied to the item hint badge.",
            "type": "Style"
          },
          {
            "name": "item.label",
            "description": "Styles applied to Command.Label within the item.",
            "type": "Style"
          },
          {
            "name": "item.description",
            "description": "Styles applied to Command.Description within the item.",
            "type": "Style"
          },
          {
            "name": "category",
            "description": "Styles applied to category headers.",
            "type": "Style"
          },
          {
            "name": "footer",
            "description": "Styles applied to the command footer.",
            "type": "Style"
          },
          {
            "name": "groups.root",
            "description": "Styles applied to the Command.Groups container.",
            "type": "Style"
          },
          {
            "name": "groups.group",
            "description": "Styles applied to each category group rendered by Command.Groups.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-900)",
        "defaultValue": null,
        "referencedVars": [
          "--background-900"
        ],
        "variant": ".command"
      },
      {
        "name": "--border",
        "value": "var(--background-700)",
        "defaultValue": null,
        "referencedVars": [
          "--background-700"
        ],
        "variant": ".command"
      },
      {
        "name": "--height",
        "value": "min(35rem, 60dvh)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".command"
      },
      {
        "name": "--width",
        "value": "30rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".command"
      },
      {
        "name": "--origin",
        "value": "50% 10%",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".command"
      },
      {
        "name": "--overlay",
        "value": "rgb(0 0 0 / 20%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".command"
      },
      {
        "name": "--overlay-backdrop",
        "value": "blur(4px)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".command"
      },
      {
        "name": "--shadow",
        "value": "0 20px 25px -5px rgb(0 0 0 / 35%)",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".command"
      },
      {
        "name": "--leading",
        "value": "var(--leading-sm)",
        "defaultValue": null,
        "referencedVars": [
          "--leading-sm"
        ],
        "variant": ".command"
      },
      {
        "name": "--content-max-height",
        "value": "var(--height, min(32rem, 60dvh))",
        "defaultValue": "min(32rem, 60dvh",
        "referencedVars": [
          "--height"
        ],
        "variant": ".content"
      },
      {
        "name": "--stroke-color",
        "value": "var(--border)",
        "defaultValue": null,
        "referencedVars": [
          "--border"
        ],
        "variant": ".inner"
      },
      {
        "name": "--fill",
        "value": "var(--background)",
        "defaultValue": null,
        "referencedVars": [
          "--background"
        ],
        "variant": ".inner"
      },
      {
        "name": "--frame-radius",
        "value": "var(--radius-sm)",
        "defaultValue": null,
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".inner"
      },
      {
        "name": "--input-active-box-shadow",
        "value": "none",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".search"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".item:hover"
      }
    ]
  },
  "code": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .code {\n    --header-bg: mix(var(--background-900) 90%, transparent);\n    --scroll-track-bg: mix(var(--background-950) 50%, transparent);\n\n    max-height: 52.5rem;\n    border-radius: var(--radius-sm);\n    border: slot(border, width, 1px) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    @apply flex w-full min-w-0 flex-col overflow-hidden;\n  }\n\n  .header {\n    flex: none;\n    background-color: var(--header-bg);\n    @apply flex items-center justify-between px-3 py-1.5;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    border-bottom: slot(border, width, 1px) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    color: var(--foreground-400);\n  }\n\n  .body {\n    @apply relative flex min-h-0 flex-1 flex-col;\n    flex: 1;\n  }\n\n  .viewport {\n    @apply overflow-hidden;\n  }\n\n  .viewport :global(pre) {\n    background: transparent;\n    @apply m-0 p-0;\n    width: fit-content;\n  }\n\n  .viewport :global(code) {\n    color: var(--foreground-300);\n    font-family: var(--font-mono, ui-monospace, monospace);\n    font-size: var(--text-code-size, var(--text-sm, 0.875rem));\n    font-weight: var(--font-weight-code, var(--font-weight-body-normal, 400));\n    letter-spacing: var(--letter-spacing-code, 0);\n    line-height: var(--leading-code, 1.5);\n    white-space: pre;\n  }\n\n  .viewport::-webkit-scrollbar {\n    width: 0.5rem;\n  }\n\n  .viewport::-webkit-scrollbar-track {\n    background: transparent;\n  }\n\n  .viewport::-webkit-scrollbar-thumb {\n    background-color: var(--background-700);\n    border-radius: 9999px;\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .viewport::-webkit-scrollbar-thumb:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background-600);\n  }\n\n  .scroll-track {\n    flex: none;\n    @apply w-full;\n    overflow-x: auto;\n    background-color: var(--scroll-track-bg);\n    backdrop-filter: blur(4px);\n  }\n\n  .expand-button {\n    @apply flex w-full items-center gap-3 px-4 py-2 cursor-pointer;\n    color: var(--foreground-300);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    border-top: slot(border, width, 1px) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    background: transparent;\n    border-left: none;\n    border-right: none;\n    border-bottom: none;\n  }\n\n  .expand-button:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background-800);\n  }\n\n  .expand-icon {\n    @apply shrink-0;\n    color: var(--foreground-400);\n  }\n\n  .copy-button {\n    @apply absolute right-2 top-2 flex items-center justify-center p-1 cursor-pointer;\n    border-radius: var(--radius-sm);\n    color: var(--foreground-400);\n    opacity: 0;\n    transition:\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    background: transparent;\n    border: none;\n    z-index: 1;\n  }\n\n  .copy-button:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background-800);\n    color: var(--foreground-300);\n  }\n\n  .copy-button:focus,\n  .body:hover .copy-button {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    opacity: 1;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "header"
      },
      {
        "name": "body"
      },
      {
        "name": "viewport"
      }
    ],
    "styleableGroups": [
      {
        "name": "CodeStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header",
            "description": "",
            "type": "Style"
          },
          {
            "name": "body",
            "description": "",
            "type": "Style"
          },
          {
            "name": "viewport",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--header-bg",
        "value": "mix(var(--background-900) 90%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-900"
        ],
        "variant": ".code"
      },
      {
        "name": "--scroll-track-bg",
        "value": "mix(var(--background-950) 50%, transparent)",
        "defaultValue": null,
        "referencedVars": [
          "--background-950"
        ],
        "variant": ".code"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".viewport::-webkit-scrollbar-thumb:hover"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".expand-button:hover"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".copy-button:hover"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".copy-button:focus,\n  .body:hover .copy-button"
      }
    ]
  },
  "checkbox": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .checkbox {\n    @apply inline-grid gap-x-3;\n    grid-template-columns: auto 1fr;\n    grid-template-rows: auto auto;\n  }\n\n  .container {\n    @apply relative inline-flex items-center justify-center;\n  }\n\n  .box {\n    @apply relative h-5 w-5 cursor-pointer appearance-none;\n\n    background-color: var(--background, transparent);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius-xs, 0.25rem);\n    outline: none;\n\n    &[data-invalid=\"true\"] {\n      border-color: slot(border, background-error, var(--danger-600));\n    }\n\n    &[data-invalid=\"true\"][data-selected=\"true\"],\n    &[data-invalid=\"true\"][data-indeterminate=\"true\"] {\n      border-color: slot(border, background, transparent);\n    }\n\n    &[data-disabled=\"true\"] {\n      cursor: not-allowed;\n      opacity: var(--disabled-opacity, 0.6);\n      pointer-events: none;\n    }\n\n  }\n\n  .checkmark,\n  .indeterminate {\n    @apply absolute;\n    inset: 50%;\n    width: 65%;\n    height: 65%;\n    transform: translate(-50%, -50%);\n    color: var(--foreground, currentColor);\n    pointer-events: none;\n  }\n\n  .label {\n    @apply cursor-pointer select-none;\n\n    &[data-disabled=\"true\"] {\n      @apply opacity-60 cursor-not-allowed;\n    }\n  }\n\n  .label-md {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .helper-text {\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    grid-column: 2;\n    color: var(--helper-foreground);\n\n    &[data-error=\"true\"] {\n      color: var(--helper-error-foreground, var(--foreground-error, var(--danger-600)));\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "control"
      },
      {
        "name": "checkbox"
      },
      {
        "name": "icon.checkmark"
      },
      {
        "name": "icon.indeterminate"
      },
      {
        "name": "label"
      },
      {
        "name": "helperText"
      }
    ],
    "styleableGroups": [
      {
        "name": "CheckboxStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles the outer checkbox row.",
            "type": "Style"
          },
          {
            "name": "control",
            "description": "Styles the control wrapper containing the input and state icon.",
            "type": "Style"
          },
          {
            "name": "checkbox",
            "description": "Styles the native checkbox input.",
            "type": "Style"
          },
          {
            "name": "icon.checkmark",
            "description": "Styles the checkmark shown when the checkbox is checked.",
            "type": "Style"
          },
          {
            "name": "icon.indeterminate",
            "description": "Styles the horizontal mark shown when the checkbox is indeterminate.",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "Styles the visible label associated with the native input.",
            "type": "Style"
          },
          {
            "name": "helperText",
            "description": "Styles the helper or validation message below the label.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--control-track)",
        "defaultValue": null,
        "referencedVars": [
          "--control-track"
        ],
        "variant": ".checkbox"
      },
      {
        "name": "--helper-error-foreground",
        "value": "var(--danger-600)",
        "defaultValue": null,
        "referencedVars": [
          "--danger-600"
        ],
        "variant": ".checkbox"
      },
      {
        "name": "--helper-foreground",
        "value": "var(--foreground-400)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-400"
        ],
        "variant": ".checkbox"
      }
    ]
  },
  "chart": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .chart {\n    /* Categorical palette, fixed order — assigned by series registration order.\n     * Dark-first like the token system; light steps override below. */\n    --color-1: #3987e5;\n    --color-2: #008300;\n    --color-3: #d55181;\n    --color-4: #c98500;\n    --color-5: #199e70;\n    --color-6: #d95926;\n    --color-7: #9085e9;\n    --color-8: #e66767;\n\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    height: 15rem;\n  }\n\n  :global([data-theme=\"light\"]) .chart {\n    --color-1: #2a78d6;\n    --color-2: #008300;\n    --color-3: #e87ba4;\n    --color-4: #eda100;\n    --color-5: #1baf7a;\n    --color-6: #eb6834;\n    --color-7: #4a3aa7;\n    --color-8: #e34948;\n  }\n\n  .plot {\n    display: block;\n    flex: 1 1 auto;\n    min-height: 0;\n    width: 100%;\n    overflow: visible;\n  }\n\n  .surface {\n    position: absolute;\n    outline: none;\n    cursor: crosshair;\n  }\n\n  .chart[data-focus-visible=\"true\"] .surface {\n    box-shadow: 0 0 0 2px var(--ring-background, var(--accent-400));\n    border-radius: var(--radius-sm, 0.375rem);\n  }\n\n  .line {\n    fill: none;\n    stroke: currentColor;\n    stroke-width: 2;\n    stroke-linejoin: round;\n    stroke-linecap: round;\n  }\n\n  .area {\n    stroke: none;\n  }\n\n  .marker,\n  .point {\n    fill: currentColor;\n    stroke: var(--background-950, oklch(18% 0 0));\n    stroke-width: 2;\n  }\n\n  .bar {\n    fill: currentColor;\n    stroke: none;\n    transition: opacity var(--chart-bar-highlight-duration, 160ms) ease-out;\n  }\n\n  .bar[data-active=\"true\"] {\n    filter: brightness(1.08);\n  }\n\n  .column-highlight {\n    fill: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    opacity: 0.08;\n    pointer-events: none;\n  }\n\n  .cursor {\n    pointer-events: none;\n  }\n\n  .cursor-line {\n    stroke: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    stroke-width: 1;\n    stroke-dasharray: 4 4;\n    opacity: 0.75;\n    vector-effect: non-scaling-stroke;\n  }\n\n  .rule {\n    /* Chart grid and axis strokes are outside the surface-border contract. */\n    stroke: var(--background-border, var(--background-700, oklch(26% 0 0)));\n    stroke-width: 1;\n  }\n\n  .grid .rule {\n    opacity: 0.5;\n  }\n\n  .axis .rule {\n    opacity: 0.8;\n  }\n\n  .reference .rule {\n    stroke: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    stroke-dasharray: 4 4;\n    opacity: 0.6;\n  }\n\n  .tick,\n  .label {\n    fill: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .tick {\n    font-variant-numeric: tabular-nums;\n  }\n\n  .label {\n    font-family: var(--font-body, inherit);\n    font-weight: var(--font-weight-body-medium, 500);\n  }\n\n  .tooltip {\n    position: absolute;\n    z-index: 10;\n    box-sizing: border-box;\n    pointer-events: none;\n    display: flex;\n    flex-direction: column;\n    gap: var(--spacing, 0.25rem);\n    min-width: 8rem;\n    padding: calc(var(--spacing, 0.25rem) * 2);\n    background-color: var(--background, var(--background-950, oklch(21% 0 0)));\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-700, oklch(26% 0 0)));\n    border-radius: var(--radius-sm, 0.375rem);\n    color: var(--foreground, var(--foreground-100, oklch(95% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition: transform var(--chart-tooltip-move-duration, 200ms)\n      var(--chart-tooltip-move-easing, var(--ease-snappy-pop, ease-out));\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .tooltip,\n    .bar {\n      transition: none;\n    }\n  }\n\n  .header {\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-weight: var(--font-weight-body-medium, 500);\n  }\n\n  .row {\n    display: flex;\n    align-items: center;\n    gap: calc(var(--spacing, 0.25rem) * 1.5);\n  }\n\n  .swatch {\n    flex-shrink: 0;\n    width: 0.5rem;\n    height: 0.5rem;\n    border-radius: 2px;\n  }\n\n  .name {\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n  }\n\n  .value {\n    margin-left: auto;\n    font-variant-numeric: tabular-nums;\n  }\n\n  .legend {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n    column-gap: calc(var(--spacing, 0.25rem) * 4);\n    row-gap: var(--spacing, 0.25rem);\n    padding-top: calc(var(--spacing, 0.25rem) * 2);\n  }\n\n  .item {\n    display: flex;\n    align-items: center;\n    gap: calc(var(--spacing, 0.25rem) * 1.5);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n  }\n\n  .live-region {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n    border: 0;\n  }\n\n  .grid-chart {\n    --grid-chart-color: var(--color-1, #3987e5);\n    --grid-chart-empty: var(--background-800, #1c2530);\n    --grid-chart-cell-color: var(--grid-chart-color);\n\n    width: 100%;\n    height: 15rem;\n    min-height: 0;\n    display: flex;\n    flex-direction: column;\n    color: var(--foreground-muted, var(--foreground-400, oklch(65% 0 0)));\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n  }\n\n  .grid-chart-viewport {\n    flex: 1 1 auto;\n    min-height: 0;\n    width: 100%;\n    overflow-x: auto;\n    overflow-y: hidden;\n  }\n\n  .grid-chart-layout {\n    display: grid;\n    grid-template-columns: max-content minmax(var(--grid-chart-min-width), 1fr);\n    grid-template-rows: minmax(0, 1fr) auto;\n    gap: calc(var(--grid-chart-gap) * 2) calc(var(--grid-chart-gap) * 3);\n    min-width: max-content;\n    height: 100%;\n    min-height: 0;\n  }\n\n  .grid-chart-y-labels {\n    display: grid;\n    grid-template-rows: repeat(var(--grid-chart-rows), minmax(0, 1fr));\n    grid-column: 1;\n    grid-row: 1;\n    gap: var(--grid-chart-gap);\n  }\n\n  .grid-chart-y-label {\n    display: flex;\n    align-items: center;\n    min-height: 0;\n    white-space: nowrap;\n  }\n\n  .grid-chart-cells {\n    display: grid;\n    grid-template-columns: repeat(var(--grid-chart-columns), minmax(0, 1fr));\n    grid-template-rows: repeat(var(--grid-chart-rows), minmax(0, 1fr));\n    grid-column: 2;\n    grid-row: 1;\n    gap: var(--grid-chart-gap);\n    min-height: 0;\n  }\n\n  .grid-chart-cell {\n    width: 100%;\n    height: 100%;\n    min-width: 0;\n    min-height: 0;\n    padding: 0;\n    appearance: none;\n    background: color-mix(\n      in srgb,\n      var(--grid-chart-cell-color, var(--grid-chart-color)) var(--grid-chart-cell-strength),\n      var(--grid-chart-empty)\n    );\n    border: 0;\n    border-radius: var(--grid-chart-radius);\n    outline: none;\n    transition: filter 120ms ease-out, box-shadow 120ms ease-out;\n  }\n\n  button.grid-chart-cell {\n    cursor: pointer;\n  }\n\n  .grid-chart-cell-empty {\n    --grid-chart-cell-strength: 0%;\n  }\n\n  .grid-chart-cell:hover,\n  .grid-chart-cell[data-active=\"true\"] {\n    filter: brightness(1.14);\n  }\n\n  .grid-chart-cell:focus-visible {\n    box-shadow: 0 0 0 2px var(--background-950, #111), 0 0 0 4px var(--ring-background, var(--accent-400));\n  }\n\n  .grid-chart-x-labels {\n    display: grid;\n    grid-template-columns: repeat(var(--grid-chart-columns), minmax(0, 1fr));\n    grid-column: 2;\n    grid-row: 2;\n    gap: var(--grid-chart-gap);\n  }\n\n  .grid-chart-x-label {\n    min-width: 0;\n    overflow: hidden;\n    text-align: center;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .grid-chart-legend {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: var(--grid-chart-legend-gap, 6px);\n    margin-top: var(--grid-chart-legend-offset, 16px);\n  }\n\n  .grid-chart-legend-swatch {\n    width: 1.25rem;\n    flex: 0 0 auto;\n    aspect-ratio: 1;\n    background: color-mix(\n      in srgb,\n      var(--grid-chart-color) var(--grid-chart-cell-strength),\n      var(--grid-chart-empty)\n    );\n    border-radius: var(--grid-chart-radius, 4px);\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "viewport"
      },
      {
        "name": "layout"
      },
      {
        "name": "yLabels"
      },
      {
        "name": "yLabel"
      },
      {
        "name": "cells"
      },
      {
        "name": "cell"
      },
      {
        "name": "xLabels"
      },
      {
        "name": "xLabel"
      },
      {
        "name": "legend"
      },
      {
        "name": "legendLabel"
      },
      {
        "name": "legendSwatch"
      },
      {
        "name": "plot"
      },
      {
        "name": "columnHighlight"
      },
      {
        "name": "mark"
      },
      {
        "name": "marker"
      },
      {
        "name": "header"
      },
      {
        "name": "row"
      },
      {
        "name": "swatch"
      },
      {
        "name": "label"
      },
      {
        "name": "value"
      },
      {
        "name": "item"
      },
      {
        "name": "line"
      },
      {
        "name": "tick"
      }
    ],
    "styleableGroups": [
      {
        "name": "GridChartStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "viewport",
            "description": "",
            "type": "Style"
          },
          {
            "name": "layout",
            "description": "",
            "type": "Style"
          },
          {
            "name": "yLabels",
            "description": "",
            "type": "Style"
          },
          {
            "name": "yLabel",
            "description": "",
            "type": "Style"
          },
          {
            "name": "cells",
            "description": "",
            "type": "Style"
          },
          {
            "name": "cell",
            "description": "",
            "type": "Style"
          },
          {
            "name": "xLabels",
            "description": "",
            "type": "Style"
          },
          {
            "name": "xLabel",
            "description": "",
            "type": "Style"
          },
          {
            "name": "legend",
            "description": "",
            "type": "Style"
          },
          {
            "name": "legendLabel",
            "description": "",
            "type": "Style"
          },
          {
            "name": "legendSwatch",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "plot",
            "description": "",
            "type": "Style"
          },
          {
            "name": "columnHighlight",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartSeriesStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "mark",
            "description": "",
            "type": "Style"
          },
          {
            "name": "marker",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartTooltipStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "header",
            "description": "",
            "type": "Style"
          },
          {
            "name": "row",
            "description": "",
            "type": "Style"
          },
          {
            "name": "swatch",
            "description": "",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "",
            "type": "Style"
          },
          {
            "name": "value",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartLegendStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "item",
            "description": "",
            "type": "Style"
          },
          {
            "name": "swatch",
            "description": "",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartReferenceStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "line",
            "description": "",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartCursorStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "line",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartAxisStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "line",
            "description": "",
            "type": "Style"
          },
          {
            "name": "tick",
            "description": "",
            "type": "Style"
          },
          {
            "name": "label",
            "description": "",
            "type": "Style"
          }
        ]
      },
      {
        "name": "ChartGridStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "line",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--color-1",
        "value": "#3987e5",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-2",
        "value": "#008300",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-3",
        "value": "#d55181",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-4",
        "value": "#c98500",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-5",
        "value": "#199e70",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-6",
        "value": "#d95926",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-7",
        "value": "#9085e9",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-8",
        "value": "#e66767",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".chart"
      },
      {
        "name": "--color-1",
        "value": "#2a78d6",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--color-2",
        "value": "#008300",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--color-3",
        "value": "#e87ba4",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--color-4",
        "value": "#eda100",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--color-5",
        "value": "#1baf7a",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--color-6",
        "value": "#eb6834",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--color-7",
        "value": "#4a3aa7",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--color-8",
        "value": "#e34948",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ":global([data-theme=\"light\"]) .chart"
      },
      {
        "name": "--grid-chart-color",
        "value": "var(--color-1, #3987e5)",
        "defaultValue": "#3987e5",
        "referencedVars": [
          "--color-1"
        ],
        "variant": ".grid-chart"
      },
      {
        "name": "--grid-chart-empty",
        "value": "var(--background-800, #1c2530)",
        "defaultValue": "#1c2530",
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".grid-chart"
      },
      {
        "name": "--grid-chart-cell-color",
        "value": "var(--grid-chart-color)",
        "defaultValue": null,
        "referencedVars": [
          "--grid-chart-color"
        ],
        "variant": ".grid-chart"
      },
      {
        "name": "--grid-chart-cell-strength",
        "value": "0%",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".grid-chart-cell-empty"
      }
    ]
  },
  "card": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .card {\n    @apply overflow-hidden;\n    background-color: var(--background, var(--background-900));\n    color: var(--foreground, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n    border-radius: var(--radius-sm, 0.375rem);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .header {\n    @apply p-4;\n    color: var(--foreground, inherit);\n    font-size: var(--header-text-lg, var(--text-lg, 1.125rem));\n    border-bottom: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n  }\n\n  .body {\n    @apply px-4 py-2;\n    color: var(--foreground, inherit);\n  }\n\n  .footer {\n    @apply px-2 py-2;\n    color: var(--foreground, inherit);\n    background-color: var(--background, var(--background-900));\n    border-top: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, transparent);\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "header"
      },
      {
        "name": "body"
      },
      {
        "name": "footer"
      }
    ],
    "styleableGroups": [
      {
        "name": "CardStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "SlotStyle"
          },
          {
            "name": "header",
            "description": "",
            "type": "SlotStyle"
          },
          {
            "name": "body",
            "description": "",
            "type": "SlotStyle"
          },
          {
            "name": "footer",
            "description": "",
            "type": "SlotStyle"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-950)",
        "defaultValue": null,
        "referencedVars": [
          "--background-950"
        ],
        "variant": ".card"
      },
      {
        "name": "--focus-visible",
        "value": "var(--accent-400)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-400"
        ],
        "variant": ".card"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-200)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-200"
        ],
        "variant": ".card"
      }
    ]
  },
  "button": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .button {\n    @apply inline-flex items-center justify-center gap-2 select-none cursor-pointer whitespace-nowrap;\n    --padding-block: 0;\n    --padding-inline: 0;\n    --padding-inline-end: var(--padding-inline);\n    position: relative;\n    min-width: 0;\n    box-sizing: border-box;\n    padding-block: var(--padding-block);\n    padding-inline: var(--padding-inline);\n    padding-inline-end: var(--padding-inline-end);\n    background-color: var(--background);\n    background-origin: border-box;\n    color: var(--foreground);\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid) slot(border, background, transparent);\n    border-radius: var(--radius-sm, 0.375rem);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-sm, 0.875rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n    transition-property: background-color, border-color, color, opacity, transform;\n    transition-duration:\n      var(--hover-duration, var(--hover-leave-duration, 150ms)),\n      var(--hover-duration, var(--hover-leave-duration, 150ms)),\n      var(--hover-duration, var(--hover-leave-duration, 150ms)),\n      var(--hover-duration, var(--hover-leave-duration, 150ms)), var(--press-duration, 120ms);\n    transition-timing-function:\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      var(--press-ease, cubic-bezier(0.34, 1.56, 0.64, 1));\n\n    &[data-hovered=\"true\"]:not([data-disabled=\"true\"]) {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      background-color: var(--background);\n      border-color: slot(border, background-hover, slot(border, background, transparent));\n      color: var(--foreground);\n    }\n\n    &[data-pressed=\"true\"]:not([data-disabled=\"true\"]) {\n      background-color: var(--background);\n      border-color: slot(border, background-pressed, slot(border, background, transparent));\n      color: var(--foreground);\n      transform: var(--press-transform, scale(0.96));\n    }\n\n    &[data-selected=\"true\"]:not([data-disabled=\"true\"]) {\n      border-color: slot(border, background-selected, slot(border, background, transparent));\n    }\n\n    & > span > svg,\n    & > svg {\n      color: slot(icon, foreground, var(--icon-foreground, currentColor));\n    }\n  }\n\n  .button:not(.icon) {\n    min-height: calc(\n      1lh + var(--padding-block) * 2 + var(--border-width-base, 1px) * 2\n    );\n  }\n\n  .button:focus-visible {\n    outline: none;\n  }\n\n  .button:disabled,\n  .button[data-disabled=\"true\"] {\n    opacity: 0.5;\n    cursor: not-allowed;\n    filter: grayscale(0.5);\n  }\n\n  .button.icon {\n    aspect-ratio: 1;\n    width: var(--size, 2.25rem);\n    height: var(--size, 2.25rem);\n    --padding-block: 0.25rem;\n    --padding-inline: 0.25rem;\n  }\n\n  .hint {\n    @apply shrink-0 gap-1;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "left"
      },
      {
        "name": "right"
      },
      {
        "name": "root"
      },
      {
        "name": "icon.left"
      },
      {
        "name": "icon.right"
      },
      {
        "name": "hint"
      }
    ],
    "styleableGroups": [
      {
        "name": "ButtonIconStyleSlots",
        "slots": [
          {
            "name": "left",
            "description": "Styles applied to the leading icon.",
            "type": "SlotStyle"
          },
          {
            "name": "right",
            "description": "Styles applied to the trailing icon.",
            "type": "SlotStyle"
          }
        ]
      },
      {
        "name": "ButtonStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "Styles applied to the root element.",
            "type": "SlotStyle"
          },
          {
            "name": "icon.left",
            "description": "Styles applied to the leading icon.",
            "type": "SlotStyle"
          },
          {
            "name": "icon.right",
            "description": "Styles applied to the trailing icon.",
            "type": "SlotStyle"
          },
          {
            "name": "hint",
            "description": "Styles applied to the hint badge.",
            "type": "SlotStyle"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-800)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".button"
      },
      {
        "name": "--focus-visible",
        "value": "var(--accent-400)",
        "defaultValue": null,
        "referencedVars": [
          "--accent-400"
        ],
        "variant": ".button"
      },
      {
        "name": "--background",
        "value": "transparent",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".button"
      },
      {
        "name": "--padding-block",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".button"
      },
      {
        "name": "--padding-inline",
        "value": "0",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".button"
      },
      {
        "name": "--padding-inline-end",
        "value": "var(--padding-inline)",
        "defaultValue": null,
        "referencedVars": [
          "--padding-inline"
        ],
        "variant": ".button"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".button[data-hovered=\"true\"]:not([data-disabled=\"true\"])"
      },
      {
        "name": "--padding-block",
        "value": "0.25rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".button.icon"
      },
      {
        "name": "--padding-inline",
        "value": "0.25rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".button.icon"
      }
    ]
  },
  "banner": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .banner {\n    @apply flex w-full items-start gap-3 px-4 py-3;\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-body-size, var(--text-base, 0.9375rem));\n    font-weight: var(--font-weight-body-normal, 400);\n    letter-spacing: normal;\n    line-height: var(--leading-body, 1.5);\n    background-color: var(--background, var(--background-900));\n    color: var(--foreground, var(--foreground-200));\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-700));\n    border-radius: var(--radius-sm, 0.375rem);\n    transition:\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      border-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n  }\n\n  .banner:hover {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background, var(--background-900));\n    border-color: slot(border, background-hover, slot(border, background, var(--background-700)));\n  }\n\n  .banner[data-pressed=\"true\"] {\n    background-color: var(--background, var(--background-900));\n    border-color: slot(border, background-pressed, slot(border, background, var(--background-700)));\n  }\n\n  .content {\n    @apply min-w-0 flex flex-col gap-1;\n  }\n\n  .iconContainer {\n    @apply flex shrink-0 items-start justify-center pt-0.5;\n  }\n\n  .icon {\n    @apply h-5 w-5;\n    color: var(--icon-color, currentColor);\n  }\n\n  .dismiss {\n    @apply flex h-8 w-8 shrink-0 items-center justify-center p-0 cursor-pointer;\n    background-color: transparent;\n    color: currentColor;\n    border: none;\n    border-radius: var(--radius-sm, 0.375rem);\n    transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n      var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n\n    &:hover {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      background-color: var(--background, transparent);\n    }\n\n    &[data-pressed=\"true\"] {\n      background-color: var(--background, transparent);\n    }\n\n    &:focus-visible {\n      outline: 2px solid currentColor;\n      outline-offset: 2px;\n    }\n  }\n\n  .title {\n    font-family: var(--font-heading, var(--font-body, inherit));\n    font-size: var(--header-text-lg, var(--text-lg, 1.125rem));\n    font-weight: var(--font-weight-header-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-heading, 1.25);\n    @apply my-0;\n  }\n\n  .body {\n    font: inherit;\n    @apply my-0;\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "iconContainer"
      },
      {
        "name": "content"
      },
      {
        "name": "dismiss"
      }
    ],
    "styleableGroups": [
      {
        "name": "BannerStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "iconContainer",
            "description": "",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "",
            "type": "Style"
          },
          {
            "name": "dismiss",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-900)",
        "defaultValue": null,
        "referencedVars": [
          "--background-900"
        ],
        "variant": ".banner"
      },
      {
        "name": "--foreground",
        "value": "var(--info-50)",
        "defaultValue": null,
        "referencedVars": [
          "--info-50"
        ],
        "variant": ".banner"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".banner:hover"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".dismiss:hover"
      }
    ]
  },
  "badge": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .badge {\n    --background-radius: var(--radius-sm, 0.375rem);\n    --background-inner-radius: calc(\n      var(--background-radius) - slot(border, width, var(--border-width-base, 1px))\n    );\n    @apply inline-flex items-stretch select-none whitespace-nowrap;\n    padding: 0;\n    height: fit-content;\n    width: max-content;\n    position: relative;\n    background-color: var(--background, var(--background-800));\n    color: var(--foreground, var(--foreground-200));\n    border: slot(border, width, var(--border-width-base, 1px)) slot(border, style, solid)\n      slot(border, background, var(--background-600));\n    border-radius: var(--background-radius);\n    font-family: var(--font-body, inherit);\n    font-size: var(--text-xs, 0.75rem);\n    font-weight: var(--font-weight-body-medium, 500);\n    letter-spacing: normal;\n    line-height: var(--leading-sm, 1.25rem);\n  }\n\n  .badge.dismissible {\n    --control-size: 0.875rem;\n  }\n\n  .badge:is([data-hovered=\"true\"], [data-selected=\"true\"]):not([data-disabled=\"true\"]) {\n    border-color: slot(border, background-hover, slot(border, background, var(--background-600)));\n  }\n\n  .badge[data-pressed=\"true\"]:not([data-disabled=\"true\"]) {\n    border-color: slot(border, background-pressed, slot(border, background, var(--background-600)));\n  }\n\n  .pill {\n    --background-radius: 9999px;\n  }\n\n  .icon {\n    @apply flex items-center shrink-0;\n  }\n\n  .content {\n    @apply flex min-w-0 items-center justify-center gap-2 overflow-hidden px-1.5;\n  }\n\n  .dismissible .content {\n    padding-inline-end: calc(var(--control-size) + var(--spacing) * 1.5);\n  }\n\n  .dismiss {\n    @apply flex items-center justify-center p-0 cursor-pointer;\n    position: absolute;\n    inset-block: 0;\n    inset-inline-end: 0;\n    width: var(--control-size);\n    height: auto;\n    aspect-ratio: 1 / 1;\n    box-sizing: border-box;\n    line-height: 1; /* icon-only hit target */\n    border-radius: var(--background-inner-radius);\n    background-color: var(--background, transparent);\n    color: var(--foreground-400);\n    border: none;\n    transition:\n      opacity var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      transform var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out)),\n      background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n    outline: none;\n  }\n\n  .dismiss svg {\n    width: 0.875rem;\n    height: 0.875rem;\n    margin: auto;\n  }\n\n  .pill .dismiss {\n    border-radius: 9999px;\n  }\n\n  .dismiss[data-hovered=\"true\"] {\n    --hover-duration: var(--hover-enter-duration, 0ms);\n    background-color: var(--background, transparent);\n  }\n\n  .dismiss[data-pressed=\"true\"] {\n    background-color: var(--background, transparent);\n    transform: scale(0.95);\n  }\n\n  .dismiss[data-focus-visible=\"true\"] {\n    box-shadow: 0 0 0 1.5px var(--focus-visible, var(--foreground));\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "icon.left"
      },
      {
        "name": "icon.right"
      },
      {
        "name": "iconLeft"
      },
      {
        "name": "iconRight"
      },
      {
        "name": "dismiss"
      }
    ],
    "styleableGroups": [
      {
        "name": "BadgeStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "",
            "type": "Style"
          },
          {
            "name": "icon.left",
            "description": "",
            "type": "Style"
          },
          {
            "name": "icon.right",
            "description": "",
            "type": "Style"
          },
          {
            "name": "iconLeft",
            "description": "",
            "type": "Style"
          },
          {
            "name": "iconRight",
            "description": "",
            "type": "Style"
          },
          {
            "name": "dismiss",
            "description": "",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--background",
        "value": "var(--background-800)",
        "defaultValue": null,
        "referencedVars": [
          "--background-800"
        ],
        "variant": ".badge"
      },
      {
        "name": "--foreground",
        "value": "var(--foreground-200)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-200"
        ],
        "variant": ".badge"
      },
      {
        "name": "--background-radius",
        "value": "var(--radius-sm, 0.375rem)",
        "defaultValue": "0.375rem",
        "referencedVars": [
          "--radius-sm"
        ],
        "variant": ".badge"
      },
      {
        "name": "--background-inner-radius",
        "value": "calc(\n      var(--background-radius) - slot(border, width, var(--border-width-base, 1px))\n    )",
        "defaultValue": "1px",
        "referencedVars": [
          "--background-radius",
          "--border-width-base"
        ],
        "variant": ".badge"
      },
      {
        "name": "--control-size",
        "value": "0.875rem",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".badge.dismissible"
      },
      {
        "name": "--background-radius",
        "value": "9999px",
        "defaultValue": null,
        "referencedVars": [],
        "variant": ".pill"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".dismiss[data-hovered=\"true\"]"
      }
    ]
  },
  "anchor": {
    "rawCss": "@reference \"tailwindcss\";\n\n@layer components.defaults {\n  .anchor {\n    @apply inline-flex items-center justify-center relative cursor-pointer select-none whitespace-nowrap;\n    color: var(--foreground, currentColor);\n    text-decoration: none;\n    border-radius: var(--radius-sm, 0.375rem);\n    font-size: inherit;\n    font-weight: inherit;\n    letter-spacing: inherit;\n    line-height: inherit;\n\n    & .underline {\n      @apply absolute inset-x-0 h-px;\n      inset-block-end: 0;\n      background-color: slot(underline, background, var(--background-600));\n      transition: background-color var(--hover-duration, var(--hover-leave-duration, 300ms))\n        var(--hover-transition-timing-function, var(--ease-snappy-pop, ease-out));\n      pointer-events: none;\n    }\n\n    &[data-hovered=\"true\"] .underline {\n      --hover-duration: var(--hover-enter-duration, 0ms);\n      background-color: slot(\n        underline,\n        background-hover,\n        slot(underline, background, var(--background-600))\n      );\n    }\n  }\n}\n",
    "styleableParts": [
      {
        "name": "root"
      },
      {
        "name": "content"
      },
      {
        "name": "underline"
      },
      {
        "name": "preview.root"
      },
      {
        "name": "preview.content"
      }
    ],
    "styleableGroups": [
      {
        "name": "AnchorPreviewStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "The portaled overlay element that positions the preview.",
            "type": "Style"
          },
          {
            "name": "content",
            "description": "The preview surface rendered inside the overlay.",
            "type": "Style"
          }
        ]
      },
      {
        "name": "AnchorStyleSlots",
        "slots": [
          {
            "name": "root",
            "description": "The rendered anchor or span root element.",
            "type": "Style"
          },
          {
            "name": "underline",
            "description": "The underline drawn beneath the label.",
            "type": "Style"
          },
          {
            "name": "preview.root",
            "description": "The portaled overlay element that positions the preview.",
            "type": "Style"
          },
          {
            "name": "preview.content",
            "description": "The preview surface rendered inside the overlay.",
            "type": "Style"
          }
        ]
      }
    ],
    "cssVariables": [
      {
        "name": "--foreground",
        "value": "var(--foreground-200)",
        "defaultValue": null,
        "referencedVars": [
          "--foreground-200"
        ],
        "variant": ".anchor"
      },
      {
        "name": "--hover-duration",
        "value": "var(--hover-enter-duration, 0ms)",
        "defaultValue": "0ms",
        "referencedVars": [
          "--hover-enter-duration"
        ],
        "variant": ".anchor[data-hovered=\"true\"] .underline"
      }
    ]
  }
};
