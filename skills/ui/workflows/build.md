You are building new web UI with UI Lab. Unlike `audit`, `ideate`, and `conform`,
this workflow is **not** delegated to a subagent — you run it yourself, and the
rules below are standing instructions for the rest of the session, not a one-time
checklist. Every component you write from here on is governed by them.

## Step 1 — Load the harness (mandatory, once per session)

Read these three files in full before writing any markup. Do not skim them, and
do not proceed on memory of them from a previous session:

- `references/design-system.md` — tokens, component substitutions, prop
  conventions, styling prohibitions, anti-patterns
- `references/core-pillars.md` — the six pillars your output is judged against
- `references/slop-patterns.md` — the canonical slop patterns to avoid emitting
  in the first place

If you have already read all three in this session, say so and skip to Step 2.

## Step 2 — Resolve components before writing them

Never infer a UI Lab component's API from memory. For every component you intend
to use, in this order:

1. `search_components(name)` — confirm it exists and get its id
2. `get_component(id, detail="api")` — get the real prop signature
3. `get_component(id, detail="examples")` — start from field-tested markup
4. `get_component(id, detail="usage")` — when nesting, placement, or surface
   semantics matter

For anything larger than a single component, search before you compose:

- `search_patterns` — atomic use cases (empty state, delete confirmation, filters)
- `search_elements` — multi-component blocks (sidebar, chat, file browser)
- `search_sections` — landing-page blocks (hero, pricing, testimonials)
- `search_guides` — setup, theming, migration

Prefer a registry example over hand-written JSX wherever one exists. Adapt it to
the product's data and copy; do not re-derive its structure.

If the preflight reported `ui-lab-components NOT FOUND`, resolve setup via
`search_guides` → `get_guide("setup-ui-lab-in-project")` before the first edit.

If an MCP call fails, say so and stop rather than guessing an API.

## Step 3 — Build

Write the UI. While writing, hold to these — they are the failure modes that
make generated UI read as generated:

**Tokens.** No hex, no `rgba()`, no Tailwind neutrals (`bg-white`, `bg-gray-*`,
`bg-zinc-*`, …), no chromatic Tailwind standing in for a semantic token
(`bg-red-500` for danger → `bg-danger-500`). No `shadow-*`, no gradients, no
`dark:` prefixes. Surfaces are dark-first: higher shade = deeper.

**Components.** Any native element carrying styling is wrong: `<button>` →
`<Button>`, `<a>` → `<Anchor>`, `<input>` → `<Input>`/`<Checkbox>`/`<Radio>`,
`<div className="flex">` → `<Flex>`, padded `<div>` → `<Card>`. Use compound
sub-components (`<Card.Header>`, `<List.Item>`) over raw wrappers.

**Props.** React Aria conventions: `onPress` not `onClick`, `isOpen` /
`onOpenChange` not `isVisible`.

**States.** Every interactive element gets hover, active, disabled, and keyboard
focus. Every async surface gets loading, empty, and error states. A hover state
must never visually outrank a selected state.

**Restraint.** Build the smallest thing that does the job. Do not add a badge
row, a decorative icon beside a heading, a gradient, a card inside a card, or a
four-part empty state (icon + heading + subtext + CTA) because the layout looks
sparse. Sparse is fine. Reach for `accent-*` only for primary actions, focus, or
current location — it is load-bearing, not decoration.

## Step 4 — Self-check before presenting

Before you show the work, walk the six pillars against what you just wrote and
fix what you find. Report the result as one line per pillar — no star ratings,
no audit report, this is a build not an audit:

```
Adherence: <pass, or what you fixed>
Layout & Spacing: <pass, or what you fixed>
Accessibility & Usability: <pass, or what you fixed>
Cognitive Load: <pass, or what you fixed>
Visual Consistency: <pass, or what you fixed>
Slop Avoidance: <pass, or what you fixed>
```

If a pillar cannot pass without a decision that is the user's to make (a missing
error-state copy, an ambiguous primary action), say so on that line instead of
inventing an answer.

## Step 5 — Stay loaded

These rules persist for the rest of the session. On any later UI work, apply them
without being asked and without re-reading the references. If the user asks for
something that violates them, build what they asked for and note the violation in
one line — their call overrides the system, but they should know what it cost.
