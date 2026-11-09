# UI Lab System

Loaded in ui-lab mode only, on top of `core/principles.md`. Maps the principles to concrete UI Lab tokens, components, and props. Each section lists rules; violations are flaggable.

## Project readiness

Read the preflight `Theme:` line before building. UI Lab component CSS only consumes tokens (`--background-*`, `--foreground-*`, `--accent-*`, `--border-width-base`, spacing and type scales); the app supplies them through a token layer (`theme.css`), normally written by `ui-lab init`.

**`SET UP`** — build normally.

**`TOKENS MISSING` or `NOT INSTALLED`** — ui-lab-components is installed, but no stylesheet defines the tokens. Importing `ui-lab-theme-onyx` alone is not enough; it supplies component recipes, and the color tokens still come from the token layer.

- Still build the design the correct way: UI Lab components, their props, and the token utilities in this file. The code should look right the moment a theme is added.
- Do not compensate. No hex/rgb/Tailwind palette colors, no inline token definitions, no `:root` overrides inside the design, no restyling of component internals to "fix" the look.
- Do not set up the theme yourself unless the user asked for setup or the change is in scope; if they ask, route to `setup`.
- Tell the user, in the first lines of your final reply, before describing the design:
  1. **What is missing:** `ui-lab-components` has no theme set up — name the preflight finding (no `ui-lab-theme-*` package, or Onyx installed without a token layer).
  2. **What they will see until it is fixed:** the layout and structure are correct, but the styling falls back to browser defaults — near-black text on a plain white page, no surface colors (cards, panels and menus are transparent), missing borders and dividers, controls that look unstyled (switch and checkbox thumbs render as small black squares, selects and buttons as plain text), no accent color on primary actions, and default system type. This is expected without a theme, not a bug in the design.
  3. **How to fix it:** run `npx ui-lab init` (non-interactive: `npx ui-lab init --non-interactive`; Vite: add `--framework vite --stylesheet src/index.css`), which installs Onyx and writes `theme.css`, fonts and the stylesheet imports. To do it by hand: install `ui-lab-theme-onyx`, add an app-owned `theme.css` token layer, and import `tailwindcss`, `ui-lab-theme-onyx/styles.css`, `./theme.css`, then `ui-lab-components/styles.css`, in that order.
  4. **Docs:** [Installation](https://ui-lab.app/docs/installation) and [Theming](https://ui-lab.app/docs/customization-theming).

## Color tokens

### Neutral palette

Tailwind neutrals are never allowed. Replace:

| Disallowed                                                                       | Replacement                |
| -------------------------------------------------------------------------------- | -------------------------- |
| `bg-white`, `bg-gray-*`, `bg-zinc-*`, `bg-slate-*`, `bg-stone-*`, `bg-neutral-*` | `bg-background-{500–950}`  |
| `bg-black`                                                                       | `bg-background-950`        |
| `text-gray-*`, `text-zinc-*`, `text-slate-*`, `text-stone-*`, `text-neutral-*`   | `text-foreground-{50–400}` |

Surface is dark-first: higher shade = deeper surface.

| Role                 | Shade                         |
| -------------------- | ----------------------------- |
| Root container       | `bg-background-950` or `-900` |
| Card / panel / modal | `bg-background-800` or `-900` |
| Toolbar / header     | `bg-background-700` to `-800` |
| Hover                | One shade lighter than base   |
| Raised / selected    | `bg-background-600` to `-500` |

Text is light-first: lower shade = stronger text.

| Role                         | Shade                  |
| ---------------------------- | ---------------------- |
| Headings, primary text       | `text-foreground-50`   |
| Body text                    | `text-foreground-100`–`200` |
| Secondary / supporting text  | `text-foreground-300`  |
| Muted, placeholder, disabled | `text-foreground-400`  |

### Accent

`accent` is the single primary-emphasis color. Use it only for the main action in a local context, the current navigation location, and focus indication. One accent focus per local context. Never use accent for decoration, headings, or icons that carry no state.

**Accent is a fill, never a foreground.** Do not apply `text-accent-*` or accent-colored icons to text, labels, counts, icons, or controls. Express active/selected/filtered state with neutral contrast instead — the component's own selected/variant state first, then a foreground or surface shift.

| Role                                   | Use                                                                 |
| -------------------------------------- | ------------------------------------------------------------------- |
| Primary action                         | Component variant first (e.g. `Button` primary), else `bg-accent-500`/`-600` |
| Current navigation location            | Component selected state first, else a small `bg-accent-*` indicator |
| Focus                                  | Component focus ring (do not restyle)                               |
| Selected / active / filtered control   | Neutral: `text-foreground-50`–`200` vs. `300`–`400` resting, or `bg-background-700`/`600` fill. Never accent. |
| Active-count readout (e.g. filters on) | Plain count in the control's own foreground. Never accent.          |
| Accent text or icons                   | Not allowed                                                         |

### Semantic tokens

Feedback states use semantic tokens, not chromatic Tailwind:

| Intent  | Use                              | Not                       |
| ------- | -------------------------------- | ------------------------- |
| Success | `text-success-*`, `bg-success-*` | `*-green-*`               |
| Danger  | `text-danger-*`, `bg-danger-*`   | `*-red-*`                 |
| Warning | `text-warning-*`, `bg-warning-*` | `*-yellow-*`, `*-amber-*` |
| Info    | `text-info-*`, `bg-info-*`       | `*-blue-*`                |

Semantic tokens mark real feedback state (validation, status, alerts, destructive actions). Do not use them as decoration or as a second accent.

Chromatic Tailwind is allowed as intentional decoration (brand, file-type indicators, illustration). Only flag when it substitutes for a semantic token.

### Shade ranges

| Token                                                   | Valid range                  |
| ------------------------------------------------------- | ---------------------------- |
| `text-foreground-*`                                     | 50–400 (500+ does not exist) |
| `bg-background-*` (surfaces)                            | 500–950                      |
| `bg-background-*` (text/icon-on-dark only)              | any                          |
| Semantic (`success`/`danger`/`warning`/`info`/`accent`) | 50–600                       |

`bg-background-{<500}` used as a surface fill is a depth inversion.

### Borders

Borders use `border-background-*`, not `border-foreground-*`. `foreground` tokens are for text and icons only.

| Role                                    | Token                   |
| --------------------------------------- | ----------------------- |
| Default divider / table row / card edge | `border-background-700` |
| Subtle separator                        | `border-background-800` |
| Emphasis / input focus ring             | `border-background-600` |

`border-foreground-*` is a [CRITICAL] violation — `foreground` tokens carry no border semantic and will render incorrectly across themes.

## Styling prohibitions

Never use:

- Hex: `#rrggbb`
- `rgba()` in className or inline style
- `shadow-*`, `drop-shadow-*`
- `from-*`, `to-*`, `via-*`, `bg-gradient-*`
- `dark:` prefixes (CSS variables handle theming)

## Components

Any native element with styling must be replaced with its UI Lab equivalent.

| Native                      | UI Lab       |
| --------------------------- | ------------ |
| `<button>`                  | `<Button>`   |
| `<a>`                       | `<Anchor>`   |
| `<input type="text">`       | `<Input>`    |
| `<input type="checkbox">`   | `<Checkbox>` |
| `<input type="radio">`      | `<Radio>`    |
| `<select>`                  | `<Select>`   |
| `<textarea>`                | `<TextArea>` |
| `<label>`                   | `<Label>`    |
| `<form>`                    | `<Form>`     |
| `<div className="flex">`    | `<Flex>`     |
| `<div className="grid">`    | `<Grid>`     |
| `<div>` (padded container)  | `<Card>`     |
| `<div>` (grouping controls) | `<Group>`    |

Imports:

```js
import { Button } from "ui-lab-components/button";
```

Import each component from its own subpath, never the `ui-lab-components` barrel. Copy the `import` line from the MCP component response.

Do not infer component APIs from memory. Fetch from MCP `get_component { query: "component:<id>", detail: "api" }`. Theme provider must come verbatim from the MCP setup guide (`search_guides { query: "setup-ui-lab-in-project", detail: "full" }`).

### Prop conventions (React Aria)

| Use                       | Not                                |
| ------------------------- | ---------------------------------- |
| `disabled`                | `disabled`                         |
| `onPress`                 | `onClick`                          |
| `isOpen` / `onOpenChange` | `isVisible` / `onVisibilityChange` |

### Compound sub-components

Prefer compound forms over raw wrappers:

- `<Card.Header>`, `<Card.Footer>` over `<div>`
- `<Modal.Footer>` over footer wrapper
- `<List.Item>` with `<List.Checkbox>` for selectable lists
- `<Group.Select>` for grouped controls

## Audit checklist

1. Colors: neutral palette, semantic tokens, shade ranges
2. Styling prohibitions (hex, rgba, shadow, gradient, `dark:`)
3. Component substitutions for styled native elements
4. Imports from per-component `ui-lab-components/<id>` subpaths; theme from the MCP setup guide
5. React Aria props; compound sub-components where available
6. Then the `core/principles.md` checklist (states, affordances, anti-patterns)
