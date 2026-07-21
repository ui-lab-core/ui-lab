# ui-lab-registry

## 0.4.2

### Patch Changes

- a701707: Add a mobile table-of-contents drawer, package-manager-aware install command snippets, and fix Confirm-on-Modal, Command, Menu, and scroll-lock behavior.
- Updated dependencies [a701707]
  - ui-lab-components@0.4.2

## 0.4.1

### Patch Changes

- beddb6c: Overhauled Page/Panel layout with a shared sizing system, rolled out a unified component typography contract, simplified the theme's typography scale to a single static scale, added a Chart component, and adopted Flex boolean shorthand alignment props across component examples.
- Updated dependencies [beddb6c]
  - ui-lab-components@0.4.1

## 0.4.0

### Minor Changes

- Element, section, pattern, and starter content now lives in `@ui-lab-core/library`. This package exposes only a plain-data metadata snapshot (`src/generated/catalog-snapshot.ts`, regenerated via `scripts/generate-catalog-snapshot.ts` when the private library is present) with the same lookup helpers as before on the root export.
- BREAKING: removed the `./elements*`, `./sections*`, `./patterns*`, `./starters*`, and `./demo-registry` export subpaths, along with the JSX source trees they served. `elementPackages` entries no longer include `getPreview`.

## 0.3.49

### Patch Changes

- f4e0226: Landing page redesign, sidebar layout improvements, improved scroll lock behavior in Modal and Select, typography metrics API, and font configuration overhaul.
- Updated dependencies [f4e0226]
  - ui-lab-components@0.3.49

## 0.3.48

### Patch Changes

- a667765: Refreshed the public registry and site metadata from the latest private library examples so live elements, sections, and patterns match the current source content.
- Updated dependencies [a667765]
  - ui-lab-components@0.3.48

## 0.3.47

### Patch Changes

- 4e98bff: Improved Group, Select, Checkbox, and Radio styling behavior, including cleaner single-child grouping, stable Select value rendering, and reduced motion in form controls.
- Updated dependencies [4e98bff]
  - ui-lab-components@0.3.47

## 0.3.46

### Patch Changes

- 2789280: Updated site routes, live previews for patterns and sections, and Convex/Clerk authentication integration with premium entitlement support. Removed legacy dev example pages and added new theme configuration options including custom Shiki code themes.
- Updated dependencies [2789280]
  - ui-lab-components@0.3.46

## 0.3.45

### Patch Changes

- Enhanced component styling, accessibility, and focus management. Overhauled Badge, Banner, Flex, Grid, List, Popover, Progress, Slider, and Tabs components with improved styles and introduced new useFocus hook.

## 0.3.44

### Patch Changes

- Add focus indicator infrastructure and improve accessibility across components with style refinements

## 0.3.43

### Patch Changes

- Fix package references to properly point to published npm versions instead of workspace references.

## 0.3.42

### Patch Changes

- Refreshed styles across List, Table, Divider, Frame, Popover, Tooltip, and Badge components. Added a new List.Title component.

## 0.3.411 (deprecated)

### Patch Changes

- Renamed the Tabs defaultValue prop to default. Fixed Group sizing, Menu trigger forwarding, and Select/Scroll scrollbar rendering.

## 0.3.41

### Patch Changes

- Anchor, Mask, Scroll, and Tooltip are now SSR-compatible and no longer require a client boundary. Anchor previews now use Tooltip with an arrow indicator, and a new preview prop makes it easier to add hover previews in server components.

## 0.3.4

### Patch Changes

- Enhanced component examples and metadata in the registry, improved component styling system with better typography and layout support, and fixed styling issues in Divider and Checkbox components.
- Updated dependencies
  - ui-lab-components@0.3.4

## 0.3.3

### Patch Changes

- Added Onyx theme package to the release pipeline.
- Updated dependencies
  - ui-lab-components@0.3.3

## 0.3.2

### Patch Changes

- Improved visual consistency across Badge, Banner, Button, and Anchor components, including refined typography sizing and hover interaction styles.
- Updated dependencies
  - ui-lab-components@0.3.2

## 0.3.1

### Patch Changes

- Fixed floating positioning in Select, Tooltip, and Popover components. Added cookie-based server-side theme support and updated the color mode API for easier theme integration.
- Updated dependencies
  - ui-lab-components@0.3.1

## 0.3.0

### Minor Changes

- Textarea now supports a maxHeight prop for scroll-constrained inputs. Select has an improved searchable trigger with better accessibility. The theme system has been redesigned using CSS variables and semantic color tokens, with a new Onyx theme added.

### Patch Changes

- Updated dependencies
  - ui-lab-components@0.3.0

## 0.2.0

### Minor Changes

- 2a6aaf5: New features:
  - List.Controls — new subcomponent with checkbox, switch, input, and select wrappers
  - Select: valueLabel prop for SSR label persistence
  - Frame component CSS module type definitions

  Refactors / breaking changes:
  - List.Checkbox removed (consolidated into List.Controls)
  - Switch, Modal: simplified APIs with removed complexity
  - Checkbox, Switch: updated styling and component APIs
  - Tooltip, Select: improved animation handling and exports

  Other:
  - Removed Breadcrumbs and Confirmation components
  - Migrated config/scripts to TypeScript
  - Updated registry data and site content

### Patch Changes

- Updated dependencies [2a6aaf5]
  - ui-lab-components@0.2.0
