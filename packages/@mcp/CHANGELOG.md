# ui-lab

## Unreleased

- Reduced the MCP surface from 17 category-specific tools to `get_component`, `search_guides`, and `search_workshop`.
- Added progressive disclosure for component, guide, and workshop context.
- Removed duplicated MCP resources, hardcoded semantic color recommendations, theme setup output, and injected design guidance.
- Unified every tool on one reference grammar (`component:`, `example:`, `artifact:`, `guide:`) that every response emits and every tool accepts back.
- Unified every tool on one response envelope with an explicit `status` of `exact`, `matches`, `list`, or `not_found`, plus `nextSteps` follow-up calls.
- Misses now return `not_found` with ranked suggestions instead of throwing an MCP error, so a real registry failure is no longer indistinguishable from "no match".
- Added enumeration: omitting `query` on any tool returns the full index.
- Added MCP `instructions` describing the intended call order, and `structuredContent` plus an `outputSchema` on every tool.
- Replaced `search_workshop`'s unimplemented `example`/`pattern`/`element`/`section`/`starter` kinds with the two the registry can produce, `component` and `artifact`, and removed its unimplemented `variation` parameter.
- Replaced workshop AND-substring matching with token scoring, so natural-language queries rank instead of returning nothing.
- Component summaries now disclose `experimental`, and a `detail` level that could not be applied is reported in `note` instead of being dropped silently.
- Added a `limit` parameter to `get_component`; server version is now read from `package.json`; the workshop index is built once.
- Removed the unreachable installed-artifact lockfile reader, which parsed a `ui-lab.lock` format the CLI never writes.
- Component responses now carry the real import specifier. `importPath` was surfacing the registry's `packagePath` (`dist/index.d.ts`), so agents fell back to the `ui-lab-components` barrel; every component now returns an `import` object with the subpath statement (`import { Button } from 'ui-lab-components/button';`) at every detail level, including the default summary.
- The setup and theme-switching guides now teach subpath imports instead of barrel imports.

## 0.4.3

### Patch Changes

- 7f3b6b1: Reworked Table with custom columns, header cells, and horizontal scroll; simplified Flex wrap to a boolean prop; fixed Select multiple re-render and toggle bugs; Confirm now accepts ReactNode labels and Expand.Icon supports a color prop.
- Updated dependencies [7f3b6b1]
  - ui-lab-registry@0.4.3

## 0.4.2

### Patch Changes

- a701707: Add a mobile table-of-contents drawer, package-manager-aware install command snippets, and fix Confirm-on-Modal, Command, Menu, and scroll-lock behavior.
- Updated dependencies [a701707]
  - ui-lab-registry@0.4.2

## 0.4.1

### Patch Changes

- beddb6c: Overhauled Page/Panel layout with a shared sizing system, rolled out a unified component typography contract, simplified the theme's typography scale to a single static scale, added a Chart component, and adopted Flex boolean shorthand alignment props across component examples.
- Updated dependencies [beddb6c]
  - ui-lab-registry@0.4.1

## 0.3.49

### Patch Changes

- f4e0226: Landing page redesign, sidebar layout improvements, improved scroll lock behavior in Modal and Select, typography metrics API, and font configuration overhaul.
- Updated dependencies [f4e0226]
  - ui-lab-registry@0.3.49

## 0.3.48

### Patch Changes

- a667765: Refreshed the public registry and site metadata from the latest private library examples so live elements, sections, and patterns match the current source content.
- Updated dependencies [a667765]
  - ui-lab-registry@0.3.48

## 0.3.47

### Patch Changes

- 4e98bff: Improved Group, Select, Checkbox, and Radio styling behavior, including cleaner single-child grouping, stable Select value rendering, and reduced motion in form controls.
- Updated dependencies [4e98bff]
  - ui-lab-registry@0.3.47

## 0.3.46

### Patch Changes

- 2789280: Updated site routes, live previews for patterns and sections, and Convex/Clerk authentication integration with premium entitlement support. Removed legacy dev example pages and added new theme configuration options including custom Shiki code themes.
- Updated dependencies [2789280]
  - ui-lab-registry@0.3.46

## 0.1.65

### Patch Changes

- Enhanced component styling, accessibility, and focus management. Overhauled Badge, Banner, Flex, Grid, List, Popover, Progress, Slider, and Tabs components with improved styles and introduced new useFocus hook.

## 0.1.64

### Patch Changes

- Add focus indicator infrastructure and improve accessibility across components with style refinements

## 0.1.63

### Patch Changes

- Fix package references to properly point to published npm versions instead of workspace references.

## 0.1.62

### Patch Changes

- Refreshed styles across List, Table, Divider, Frame, Popover, Tooltip, and Badge components. Added a new List.Title component.

## 0.1.611 (deprecated)

### Patch Changes

- Renamed the Tabs defaultValue prop to default. Fixed Group sizing, Menu trigger forwarding, and Select/Scroll scrollbar rendering.

## 0.1.61

### Patch Changes

- Anchor, Mask, Scroll, and Tooltip are now SSR-compatible and no longer require a client boundary. Anchor previews now use Tooltip with an arrow indicator, and a new preview prop makes it easier to add hover previews in server components.

## 0.1.6

### Patch Changes

- Updated dependencies
  - ui-lab-registry@0.3.4

## 0.1.5

### Patch Changes

- Updated dependencies
  - ui-lab-registry@0.3.3

## 0.1.4

### Patch Changes

- Updated dependencies
  - ui-lab-registry@0.3.2

## 0.1.3

### Patch Changes

- Updated dependencies
  - ui-lab-registry@0.3.1

## 0.1.2

### Patch Changes

- Updated dependencies
  - ui-lab-registry@0.3.0

## 0.1.1

### Patch Changes

- Updated dependencies [2a6aaf5]
  - ui-lab-registry@0.2.0
