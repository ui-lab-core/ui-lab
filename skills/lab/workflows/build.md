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

## Step 2 — Assemble from the top of the composition ladder

The library is layered so you **assemble** existing compositions instead of
**designing** structure from atoms — atom-first is exactly where generated UI
starts inventing. Match the use case to the highest-altitude composition that
already exists and descend only to fill genuine gaps. Work this order,
cheapest/highest first — never enter at the leaf-component level:

1. **Foundation, once per session.** `search_guides { query: "foundation",
   detail: "full" }` — the tokens, theming, and structural conventions everything
   below assumes.
2. **Whole screen/app.** `search_workshop { kind: "starter", query }` →
   `{ kind: "section", query }` → `{ kind: "element", query }` (free-text `query`
   for the domain) to find the closest existing composition — 10 starters (whole
   app skeletons), 17 sections (landing blocks), 32 elements (multi-component app
   blocks: sidebar, chat, file browser). Reuse it; adapt data and copy only.
3. **Sub-blocks / recurring use cases.** `search_workshop { kind: "pattern",
   query }` — 72 patterns cover atomic use cases (empty state, delete
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

If the preflight reported `ui-lab-components NOT FOUND`, run `setup` first
(`workflows/setup.md`) before the first edit — it installs and wires UI Lab via
the CLI and verifies against the MCP setup guide. Do not hand-wire the install
here. Once setup succeeds in this session, continue building. Setup's tool gate
also applies to build: if you do not have the `mcp__ui-lab__*` tools available,
stop and tell the user it is not recommended to proceed without the MCP.

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

Before presenting, scan changed JSX for native interactive elements (`<button>`,
`<a>`, `<input>`, `<select>`, `<textarea>`) and styled layout wrappers. Replace
each with its fetched UI Lab equivalent. This source audit is mandatory.

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
