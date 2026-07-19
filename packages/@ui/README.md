# ui-lab-components

Accessible React 19 components built with React Aria and CSS Modules. UI Lab separates component structure from visual decisions: the package ships component CSS, while your application owns the token layer and theme recipes.

## Install

```bash
pnpm add ui-lab-components
# npm install ui-lab-components
# yarn add ui-lab-components
# bun add ui-lab-components
```

### Peer dependencies

The package requires React 19 and React DOM 19. `shiki` and `@shikijs/transformers` are also peers for the `Code` component.

```bash
pnpm add react@^19 react-dom@^19 shiki @shikijs/transformers
```

## Quick start

The standard integration is one app-level stylesheet. UI Lab’s styles must follow the token layer they consume.

```css
/* app/globals.css or src/index.css */
@import "tailwindcss";
@import "./theme.css";
@import "ui-lab-components/styles.css";
```

`theme.css` is owned by your application. It defines the active color, typography, spacing, and component tokens. The setup above uses Tailwind CSS v4 and does not require a `tailwind.config.ts` content extension for UI Lab.

```tsx
import { Button, Card, Input } from "ui-lab-components";

export function SignUp() {
  return (
    <Card>
      <Card.Header>Create your account</Card.Header>
      <Card.Body>
        <Input placeholder="you@example.com" />
      </Card.Body>
      <Card.Footer>
        <Button>Continue</Button>
      </Card.Footer>
    </Card>
  );
}
```

The aggregate `ui-lab-components/styles.css` export is the recommended app-level setup. Individual component entry points include their default CSS for bundlers that preserve CSS imports from dependencies.

## Optional: Onyx theme

[`ui-lab-theme-onyx`](../themes/onyx) provides a ready-made token layer and component recipes. Use it as a starting point when you do not yet have an app-owned theme:

```bash
pnpm add ui-lab-components ui-lab-theme-onyx
```

```css
@import "tailwindcss";
@import "ui-lab-theme-onyx/styles.css";
@import "ui-lab-components/styles.css";
```

Add your own stylesheet after Onyx to override its tokens or recipes. For a custom setup and light/dark mode, see the [installation guide](../../apps/www/content/docs/(getting-started)/installation/page.mdx) and the documentation site.

## Exports

The root entry exports the component library and theme utilities. There are focused component entry points such as `ui-lab-components/button`, `ui-lab-components/card`, and `ui-lab-components/select` for selective imports.

CSS and server-safe exports:

- `ui-lab-components/styles.css` — aggregate component stylesheet
- `ui-lab-components/base.css` — shared base styles
- `ui-lab-components/typography.css` — scoped long-form typography layer
- `ui-lab-components/theme-server` — server-safe cookie parsing and root-state helpers
- `ui-lab-components/theme-script` — fallback script helpers for non-server setups
- `ui-lab-components/postcss` — PostCSS import helper

For the exact public API, use the TypeScript declarations or browse the repository's component documentation.

## Components

The package currently exports 40 component modules:

- **Actions and feedback:** Button, Command, Confirm, Progress, Skeleton, Toast
- **Data entry:** Checkbox, Color, Date, Input, Radio, Select, Slider, Switch, Textarea
- **Layout and content:** Card, Code, Divider, Expand, Flex, Frame, Gallery, Grid, Group, List, Page, Panel, Scroll, Table
- **Navigation and overlays:** Anchor, Menu, Modal, Path, Popover, Tabs, Tooltip
- **Supporting UI:** Badge, Banner, Label, Mask

Some components use compound APIs. `Card`, for example, exposes `Card.Header`, `Card.Body`, and `Card.Footer`; named exports (`CardHeader`, `CardBody`, and `CardFooter`) are also available.

## Theming

UI Lab’s CSS uses semantic custom properties such as `--background-*`, `--foreground-*`, `--accent-*`, spacing, type, and component-level tokens. The component package deliberately does not choose your application’s visual language.

Keep tokens in an app-owned stylesheet and import it before `styles.css`. The [Theming guide](../../apps/www/content/docs/(customization)/customization-theming/page.mdx) explains the token contract; the [theme-switching guide](../../apps/www/content/docs/(guides)/guides-theme-switching/page.mdx) covers server-stamped light/dark preferences in Next.js.

## Development

From `packages/@ui`:

```bash
pnpm build       # Build JS, declarations, and CSS
pnpm type-check  # Run TypeScript validation
pnpm test:run    # Run the test suite once
```

For a focused test, use the package-local Vitest binary:

```bash
./node_modules/.bin/vitest --run src/components/Grid/tests/Grid.core.test.tsx
```

## License

MIT
