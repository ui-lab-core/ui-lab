# UI Lab Quickfix (Swap, De-slop, Tokenize)

You are bringing existing web UI into line with UI Lab in one pass, with no plan
or confirmation step. Like `build`, this runs inline in the session, not as a
subagent.

Assume the user wants all three of these, without asking:

1. Every native or hand-rolled control and layout wrapper swapped for its UI Lab
   equivalent wherever one exists.
2. Obvious slop patterns removed.
3. Every color, surface, border, and highlight expressed in UI Lab tokens.

Preserve product logic: state, events, data fetching, routing, domain models,
copy that carries meaning, and analytics hooks stay as they are. Quickfix is not a
redesign. Do not add flows, features, or new sections.

## Step 1 — Load the harness (once per session)

Read in full, unless already read this session:

- `core/principles.md` and `systems/ui-lab.md` — tokens, shade ranges, substitutions, prohibitions
- `core/slop-patterns.md` — the canonical slop patterns to remove
- `core/craft.md` — the details of fit to apply to what remains

Then fetch `search_guides { query: "foundation", detail: "full" }` once per session.

**General mode** (preflight `MODE: general`, or no `mcp__ui-lab__*` tools): read
`systems/project.md` instead of `systems/ui-lab.md` and skip the MCP fetches.
Swaps target the project's own components, colors normalize to the project's
own tokens, and slop removal is unchanged. Do not install UI Lab.

## Step 2 — Scope

Use what the user pointed at: a file, a component, a route, or a screenshot. If
they named nothing, use the files already in discussion. If nothing is in
discussion, ask for one path in one line and stop. Exclude tests, fixtures,
stories, docs/demo sites, and build output.

## Step 3 — Swap to UI Lab components

For each file in scope:

- Find every styled native element and generic wrapper from the substitution table
  in `systems/ui-lab.md` (`<button>`, `<a>`, `<input>`, `<select>`,
  `<textarea>`, `<label>`, `<form>`, flex/grid/card/group `<div>`s), plus any
  hand-rolled control the library already ships (tabs, menus, dialogs, tooltips,
  badges, toggles, lists).
- Resolve each target via `get_component { query: "<name>" }` →
  `get_component { query: "component:<id>", detail: "api" }`. Fetch
  `detail: "examples"` only for components you are committed to using, at most
  once each, and adapt that markup instead of writing JSX from the API shape.
- If a cluster of markup matches a known block (empty state, confirmation dialog,
  filter bar, sidebar), check `search_workshop { kind: "pattern" | "element", query }`
  at summary detail. Use its `detail: "full"` source only when it keeps the
  existing structure. Skip `install: locked` refs and do not reconstruct them.
- Copy the `import` line each component response returns (per-component subpath),
  never the `ui-lab-components` barrel.
- Use React Aria props (`onPress`, `isOpen`/`onOpenChange`) and compound
  sub-components (`Card.Header`, `Modal.Footer`, etc.) where the API offers them.
- Files rendering compound parts must be client components.
- No clear equivalent: keep the existing element, tokenize it in Step 5, and
  note it in the report.

## Step 4 — Remove obvious slop

Walk the patterns in `core/slop-patterns.md` and remove the ones that are
plainly present. "Obvious" means you can say in one clause what the element fails
to communicate. Typical removals:

- Decorative noise: ornamental separators, glows, gradients, shadows, accent
  stripes with no meaning.
- Inflated micro-hierarchy: `uppercase tracking-wide text-[11px] font-bold`
  labels reduced to plain supporting text.
- Generic iconography: icons beside headings or labels that add no meaning.
- Decorative status treatment: pills or badges that are not real state.
- Structural over-composition: nested cards or wrappers that add no layout or
  meaning, flattened.
- Empty-state over-explanation: cut down to one short sentence and one action.
- Placeholder chrome: leftover mock statuses, filler copy, dead controls.
- The anti-patterns in `systems/ui-lab.md`: arbitrary type sizes and
  tracking, `transition-all`, motion on static containers, zero-state chrome,
  duplicate affordances, redundant labels.

Keep anything that communicates real state, hierarchy, accessibility, or
interaction. If removing something would change meaning or behavior, leave it and
list it in the report instead.

## Step 5 — Tokenize

Never remap a token class to a different shade. Remapping inverts or flattens
the design. Each color class gets one of two outcomes:

- Valid UI Lab token in range: keep it exactly as written.
- Anything else, including token classes outside the ranges below (e.g.
  `bg-background-200`, `text-foreground-500`): remove it, so the element falls
  back to its inherited or component default color. Do not substitute another
  shade.

Hex, `rgba()`, arbitrary values, Tailwind neutrals, and chromatic Tailwind standing
in for state are also removed. Replace one with a token only when removing it would
lose real meaning, such as a semantic state or the accent fill on a current
navigation item.

Valid ranges and the roles that justify a replacement, per
`systems/ui-lab.md`:

- Surfaces: `bg-background-500` to `bg-background-950`, dark-first (higher shade
  is deeper). Root `950`/`900`, cards and panels `900`/`800`, toolbars `800`/`700`,
  hover one step lighter than its base.
- Text and icons: `text-foreground-50` (strongest) to `text-foreground-400`
  (muted). There is no `foreground-500` or higher.
- Borders: `border-background-*` (`700` default, `800` subtle, `600` emphasis).
- Accent highlight: `accent-50` to `accent-600` for primary emphasis only:
  the main action, focus, and current navigation item. One accent focus per
  local context. Accent is a fill, never a foreground: rewrite `text-accent-*`
  and accent-colored icons/counts to neutral foreground, and express
  active/filtered control states with neutral contrast, not accent.
- Semantic highlights: `success`, `danger`, `warning`, `info` at `50` to `600`, only
  for actual feedback states. They replace any green/red/amber/yellow/blue
  standing in for state.
- Prefer a component `variant` or default over adding token classes at all.
- Strip hex, `rgba()`, arbitrary color values, Tailwind neutrals (`gray`, `zinc`,
  `slate`, `stone`, `neutral`, `white`, `black`), `shadow-*`, `drop-shadow-*`,
  gradients, and `dark:` prefixes.

Chromatic Tailwind that is deliberate decoration (brand marks, file-type colors,
illustration) may stay.

## Step 6 — Report

Do not run validation unless the user asks for it. Report briefly:

- Swaps made (old → UI Lab component) per file
- Slop removed (pattern name → what was removed)
- Tokens replaced (count or notable mappings)
- Invalid color classes removed (list them)
- Anything left untouched and why (no equivalent, would change behavior, locked ref)

## Done when

- `systems/ui-lab.md (general mode: core/principles.md + systems/project.md)`, `core/slop-patterns.md`, and `core/craft.md` were read in full this session
- Every styled native element or hand-rolled control in scope with a UI Lab equivalent was swapped, using APIs fetched via MCP
- Obvious slop patterns were removed without changing behavior or meaning
- Colors use only `bg-background-500`–`950`, `text-foreground-50`–`400`, `border-background-*`, `accent-*` fills for primary emphasis (never `text-accent-*` or accent-colored icons), and semantic tokens for feedback states. No hex, `rgba()`, Tailwind neutrals, shadows, gradients, or `dark:`
- Product logic is unchanged and a brief report lists swaps, removals, and anything left untouched
