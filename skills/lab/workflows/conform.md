# UI Lab Conform (Bring UI Into Line)

You are conforming a web UI to UI Lab: fixing violations and replacing ad-hoc/native markup with field-tested UI Lab equivalents. This is not a redesign — preserve product logic and behavior.

If an audit report exists (or the user says "fix these violations" / "conform to the audit"), use its findings directly — do not re-audit. Otherwise (e.g. the user says "conform our UI", "replace our UI with UI Lab"), find the violations yourself first using the same checks `workflows/audit.md` uses for the Design System Adherence pillar (native elements, raw Tailwind/hex colors, token misuse), across whatever is in scope.

## Hard constraints (do not violate)

- Change only the view layer. Preserve state, events, props contracts, data fetching, routing, domain models, copy, and analytics hooks unless the user explicitly requests otherwise.
- Do not "improve" the design beyond what's flagged. No new flows, no UX changes, no layout invention, no feature additions.
- Prefer the narrowest safe replacement: UI Lab **components** first, then **patterns**, then **elements/sections** only if they preserve existing structure.
- Prefer field-tested markup over hand-written replacements: pull actual usage from `get_component { query: "component:<id>", detail: "examples" }` or `search_workshop { query: "pattern:<id>" | "element:<packageId>/<id>" | "section:<id>", detail: "full" }` rather than inventing new JSX from the API shape alone.
- If there is no clear UI Lab equivalent, keep the existing implementation (or wrap UI Lab around it) and record it in the report.
- Obey the same **context budget** as `build` (`workflows/build.md`, Step 3): listing and free-text search at `detail: "summary"` is free — browse widely to map violations — but `detail: "full"` / `detail: "examples"` (and workshop `detail: "full"`) are fetched **only for refs you have committed to as a replacement**, at most once each. Compare candidate replacements on summaries; never pull full/examples to compare options.

## Two-phase workflow (plan → confirm → execute)

1. Produce a scoped plan + replacement report.
2. Stop and ask the user to confirm.
   Only after explicit confirmation, proceed with code changes.

## Phase 1: Determine scope, gather findings, verify setup, propose a plan

### 1) Determine scope

- If working from an audit report, scope is exactly the files/components it covered.
- Otherwise, confirm what's included — which app(s)/package(s), which routes/screens (or "everything"), any excluded directories (docs/demo sites, storybook, tests/fixtures, build output). If the user only says "conform our project UI to UI Lab", default to the main product UI app, excluding docs/demo/tests/build output.

### 2) Gather findings

- If working from an audit report, use its violation list directly — do not re-audit.
- Otherwise, build a violation list yourself across the scope using the same severity model (CRITICAL/WARNING/SUGGESTION) as audit's Adherence pillar. Skip the other 5 pillars — this is a mechanical adherence pass, not a full design critique.

### 3) See if UI Lab is set up

- Confirm `ui-lab-components` is installed, the token layer/theme CSS is wired with correct import order, and at least one route renders a UI Lab component with tokens active.
- If not set up: run `setup` (`workflows/setup.md`) first — it installs and wires UI Lab via the CLI and verifies against `search_guides { query: "setup-ui-lab-in-project", detail: "full" }`. Present the setup step as the first block of the plan (still requires confirmation before execution). Do not hand-wire the install when the CLI is available.

### 4) Present a plan + replacement report (no code changes yet)

Build and present:

- **Execution plan** (ordered, incremental): shared primitives → shared composites → pages/routes. Include validation checkpoints (typecheck/tests/build) between milestones.
- **Replacement report** (per violation/item): where it is, current state, what it becomes (UI Lab target — component/pattern/element/section id), source of the replacement markup (which MCP example/pattern/usage doc it came from), and confidence (High/Medium/Low).

MCP guidance for mapping:

- `get_component { query: "<name>" }` → `get_component { query: "component:<id>", detail: "api" }` to select the correct primitive and props.
- `get_component { query: "component:<id>", detail: "usage" }` when choosing between surface/layout components or nesting one UI Lab component inside another.
- `get_component { query: "component:<id>", detail: "examples" }` to source field-tested markup instead of writing it from scratch.
- `search_workshop { kind: "pattern" | "element" | "section", query }` to find a larger chunk of UI that maps to an existing workshop composition, then `search_workshop { query: "<ref>", detail: "full" }` for its source — only when it preserves existing structure, not a redesign.
- `search_workshop { query: "component:<id>", detail: "full" }` to confirm imports and flag likely client components.
- **Locked items.** Some best-matching refs are premium: `search_workshop` marks them `install: locked` and the public server never returns their source. A locked ref is discoverable but uncopyable. **Do not attempt to reconstruct it from its description** — hand-inventing the locked design from memory defeats the reuse mechanism. Descend instead of dead-ending, in this order: (1) nearest copyable item of the same kind — re-run `search_workshop { kind, query }` excluding the locked ref and take the closest `install: copy` match; (2) if none, compose the block from copyable `pattern`s + leaf `component`s via the normal ladder; (3) if the user specifically requested the locked item, tell them in one line that it is premium and name the closest copyable alternative you used instead. The substitute goes in the replacement report / bill of materials; the locked ref does not.

### 5) Ask for confirmation

Stop after the plan + report and ask: "Do you want me to proceed with conform exactly as planned?" If there are Low-confidence mappings, ask whether to (A) skip them, (B) keep existing UI for those parts, or (C) proceed and iterate.

## Phase 2: Execute (only after confirmation)

### 6) Apply setup (if needed), then fix bottom-up

- If UI Lab setup was required, apply it first and re-verify tokens/styles are active.
- Fix primitives first (1:1 mechanical swaps sourced from MCP examples), then composites/pages.
- Keep public contracts stable: preserve exported component names/paths where possible, preserve event/callback semantics and state transitions, preserve accessibility semantics and keyboard behavior.

### 7) Validate and produce the conform report

- Run the repo's validations (typecheck/tests/build) and fix only conform-introduced failures.
- Provide a final report:
  - Fixed items (old → UI Lab target, MCP source used) + key files touched
  - Items skipped/blocked and why
  - If working from an audit report: confirm each audited violation is resolved (or explain why not)
  - Known risks or follow-ups (client/server boundaries, portals, focus traps)

## MCP tool checklist (use these actively)

- `search_guides { query: "<topic>" }` → `search_guides { query: "guide:<id>", detail: "full" }` for setup + translation playbooks (especially `translate-existing-ui-to-ui-lab`)
- `get_component { query: "<name>" }` → `get_component { query: "component:<id>", detail: "api" }` for correct props/slots
- `get_component { query: "component:<id>", detail: "usage" }` for composition rules, anti-patterns, preferred alternatives
- `get_component { query: "component:<id>", detail: "examples" }` for field-tested replacement markup — prefer this over hand-writing JSX
- `search_workshop { kind: "pattern" | "element" | "section", query }`, then `detail: "full"` on the returned ref, for larger structural matches
- `search_workshop { query: "component:<id>", detail: "full" }` for correct imports and client/server notes
- `get_component { query: "component:<id>", detail: "styling" }` only when replacing raw colors encountered during the fix (do not "re-theme" the app); the token contract itself lives in the foundation guide

## Output format

- Keep updates operational: what you're doing, what you changed, what's next.
- Avoid design critique language; focus on equivalence, source of the replacement, and risk management.

## Done when

- UI Lab is installed and styles/token layer are wired correctly (or it is explicitly confirmed already set up) using `search_guides { query: "setup-ui-lab-in-project", detail: "full" }`
- A scoped plan + replacement report is presented and the user explicitly confirms before any conform changes are applied
- Only the view layer changes: preserve state, events, data fetching, routing, domain models, copy, and analytics hooks unless the user explicitly asks otherwise
- If working from an audit report: every violation in it is addressed or explicitly explained as unfixable
- If working without an audit report: violations are found using the same adherence checks audit uses, and all eligible UI primitives/wrappers are swapped to UI Lab equivalents (components/patterns/elements/sections) where a clear match exists in the registry
- Replacement markup is sourced from MCP field-tested examples (`get_component { detail: "examples" }`, or `search_workshop { query: "pattern:<id>" | "element:<pkg>/<id>" | "section:<id>", detail: "full" }`) rather than hand-written from scratch, wherever an example exists
- No “design improvement” changes are introduced beyond what was flagged (no new flows, no layout invention, no new features); any optional improvements are listed separately and not included in the patch
- A conform report is provided: what was fixed/swapped and its MCP source, what couldn’t be fixed/swapped (and why), and the highest-risk files/components
