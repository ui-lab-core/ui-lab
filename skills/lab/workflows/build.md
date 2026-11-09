You are building new web UI — with UI Lab in ui-lab mode, with the project's own system in general mode. Unlike `audit`, `ideate`, and `conform`,
this workflow is **not** delegated to a subagent — you run it yourself, and the
rules below are standing instructions for the rest of the session, not a one-time
checklist. Every component you write from here on is governed by them.

## Step 1 — Load the harness (mandatory, once per session)

Read the preflight's `MODE:` line. In ui-lab mode, confirm you have the
`mcp__ui-lab__*` tools; if not, switch to general mode and say so in one line.

Read in full before writing any markup. Do not skim, and do not proceed on
memory of them from a previous session:

- `core/principles.md` — color roles, components, states, affordances, anti-patterns
- `core/pillars.md` — the six pillars your output is judged against
- `core/slop-patterns.md` — the canonical slop patterns to avoid emitting
- `core/craft.md` — the details of fit that finish what remains
- **ui-lab mode:** `systems/ui-lab.md` — UI Lab tokens, component substitutions,
  prop conventions, styling prohibitions
- **general mode:** `systems/project.md` — how to find and follow the project's
  own system

If you have already read them in this session, say so and skip ahead.

## Step 1b — Read the surroundings and decide

Read the parent file the new UI lands in and one sibling component. Note surface
shade, spacing, radius, and density in use. Then state the design in 3–5 lines
before searching or writing: placement, trigger (how it opens/appears and
closes), states, keyboard model, and density. Make the call yourself; ask only
if a choice is genuinely the user's (e.g. which action is primary).

**General mode:** complete `systems/project.md` Steps 1–2 (find the system, map
the principles to it), skip Steps 2–3 below, and go to Step 4.

## Step 2 — Assemble from the top of the composition ladder

The library is layered so you **assemble** existing compositions instead of
**designing** structure from atoms — atom-first is exactly where generated UI
starts inventing. Match the use case to the highest-altitude composition that
already exists and descend only to fill genuine gaps. Work this order,
cheapest/highest first — never enter at the leaf-component level:

**One-off fast path.** For a single widget or component added to an existing
screen (command palette, sidebar widget, drawer, popover), skip rung 2's
starter and section searches: enter at `{ kind: "element" }` and
`{ kind: "pattern" }`, then the leaf components.

1. **Foundation, once per session.** `search_guides { query: "foundation",
   detail: "full" }` — the tokens, theming, and structural conventions everything
   below assumes.
2. **Whole screen/app.** `search_workshop { kind: "starter", query }` →
   `{ kind: "section", query }` → `{ kind: "element", query }` (free-text `query`
   for the domain) to find the closest existing composition — starters (whole
   app skeletons), sections (landing blocks), elements (multi-component app
   blocks: sidebar, chat, file browser). Reuse it; adapt data and copy only.
3. **Sub-blocks / recurring use cases.** `search_workshop { kind: "pattern",
   query }` — patterns cover atomic use cases (empty state, delete
   confirmation, filters). Search here before hand-composing anything larger than
   a single component.
4. **Leaf primitives only.** For each component the chosen block actually uses,
   `get_component { query: "component:<id>", detail: "api" }` for the props you are
   about to write, and `detail: "usage"` when nesting, placement, or surface
   semantics matter. `get_component` with no `query` lists every component;
   `get_component { query: "<name>" }` resolves a name to its id.
5. **Field-tested source over hand-written JSX.** Prefer
   `get_component { query: "component:<id>", detail: "examples" }` or a workshop
   item's `detail: "full"` source wherever one exists — pass any ref back to fetch
   it exactly, e.g. `search_workshop { query: "section:hero", detail: "full" }`.
   Adapt it to the product's data and copy; do not re-derive its structure.

**Descend the ladder only for gaps.** If a starter/section/element already covers
the screen, do not rebuild it from components — reuse the composition and fill in
what it lacks. `get_component` is the leaf step, not the entry point. Never emit a
component whose API you did not fetch, and never infer a UI Lab component's API
from memory.

**Locked items.** Some best-matching refs are premium: `search_workshop` marks
them `install: locked` and the public server never returns their source. A locked
ref is discoverable but uncopyable. **Do not attempt to reconstruct it from its
description** — hand-inventing the locked design from memory defeats the reuse
mechanism. Descend instead of dead-ending, in this order:
1. **Nearest copyable item of the same kind.** Re-run `search_workshop { kind,
   query }`, excluding the locked ref, and take the closest `install: copy` match.
2. **If none, compose from copyable pieces.** Build the block from copyable
   `pattern`s + leaf `component`s via the normal ladder above.
3. **If the user specifically asked for the locked item,** tell them in one line
   that it is premium and name the closest copyable alternative you used instead.
The fallback still obeys the context budget/BOM: the copyable substitute goes in
the bill of materials, the locked ref does not.

If an MCP call fails, say so and stop rather than guessing an API.

## Step 3 — Context budget and bill of materials

Before writing JSX, fetch `search_guides { query: "build-checklist", detail:
"full" }` and complete its pre-build checks. Inventory every control and layout
need first. Search form and layout patterns explicitly, resolve every required
primitive (including Label and Select), and fetch API plus usage for each
committed component. An experimental result is not an instruction to skip it:
read its note and usage, then use it unless a concrete blocker is documented.

**Context budget (hard rule).** Detail fetches are rationed; browsing is not.

- **Free — browse widely.** Any listing or free-text search at `detail:
  "summary"` (the match tables from `get_component {}`, `search_workshop`, and
  `search_guides`). Use these to survey options at every rung of the ladder.
- **Rationed — committed refs only.** `detail: "full"` and `detail: "examples"`
  on a component, and workshop `detail: "full"` source, return source and long
  prose. Fetch them **only for refs you have already committed to using.** Never
  pull full/examples to "compare options" — compare on summaries, then commit,
  then fetch.
- Never fetch full detail for more items than the screen actually renders.

**Bill of materials (BOM).** Before writing a screen, emit a short BOM listing
the exact refs you chose at each rung of the ladder, one per line:

```
starter:<id>        (or — if none)
section:<id>, ...
element:<pkg>/<id>, ...
pattern:<id>, ...
component:<id>, ...
```

Then fetch `detail: "full"` / `detail: "examples"` only for the refs in this
BOM, once each. **The BOM is the allow-list for expensive fetches** — a ref not
in it does not get a full/examples pull. If building the screen reveals a
genuine gap, add the ref to the BOM first, then fetch it.

## Step 4 — Build

Write the UI. Hold to `core/principles.md` and the active system file. The
failure modes that make generated UI read as generated:

**Tokens.** Only the active system's tokens. No hex or `rgba()` it already
names, no raw palette color standing in for a semantic token. In ui-lab mode
also: no Tailwind neutrals, no `shadow-*`, no gradients, no `dark:` prefixes;
surfaces are dark-first (higher shade = deeper). In general mode follow the
project's own conventions for those.

**Components.** Any styled native element with a system equivalent is wrong. In
ui-lab mode: `<button>` → `<Button>`, `<a>` → `<Anchor>`, `<input>` →
`<Input>`/`<Checkbox>`/`<Radio>`, `<div className="flex">` → `<Flex>`, padded
`<div>` → `<Card>`, with compound sub-components (`<Card.Header>`,
`<List.Item>`) and React Aria props (`onPress`, `isOpen`/`onOpenChange`). In
general mode: the project's components and their documented props.

Before presenting, scan changed JSX for native interactive elements (`<button>`,
`<a>`, `<input>`, `<select>`, `<textarea>`) and styled layout wrappers. Replace
each with its system equivalent. This source audit is mandatory.

**States.** Every interactive element gets hover, active, disabled, and keyboard
focus. Every async surface gets loading, empty, and error states. A hover state
must never visually outrank a selected state.

**Restraint.** Build the smallest thing that does the job. Do not add a badge
row, a decorative icon beside a heading, a gradient, a card inside a card, or a
four-part empty state (icon + heading + subtext + CTA) because the layout looks
sparse. Sparse is fine. Accent is load-bearing: primary actions, focus, or
current location only, as a fill, never a foreground. Active, selected, and
filtered states use neutral contrast, not accent.

## Step 5 — Self-check before presenting

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

## Step 6 — Stay loaded

These rules persist for the rest of the session. On any later UI work, apply them
without being asked and without re-reading the references. If the user asks for
something that violates them, build what they asked for and note the violation in
one line — their call overrides the system, but they should know what it cost.
