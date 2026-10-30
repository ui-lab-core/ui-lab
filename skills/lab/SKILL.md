---
name: lab
description: >
  Manual session mode. The explicit command "$lab" activates UI Lab for the
  rest of the session; it does not require a sub-mode or target in the same
  message. After activation, infer setup, build, ideate, audit, conform, or quickfix from
  each subsequent web UI design request. Do not activate from ordinary UI,
  design, frontend, React, component, or UI Lab mentions. Never use UI Lab to
  determine whether a project is web. Do not route non-web, backend, data/model,
  API, test, documentation, or general engineering work through UI Lab.
  Requires ui-lab server for routed work.
disable-model-invocation: true
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/preflight.sh *)
---

<preflight>

!`${CLAUDE_SKILL_DIR}/scripts/preflight.sh ${CLAUDE_SKILL_DIR}`

The block above is injected by Claude Code at skill-load time, before you see
this file. It is ground truth — trust it over your own inspection, and do not
re-derive any of it by reading `package.json` or searching the repo.

Act on it as follows:

1. **Echo the first line** (`✅ lab skill loaded — ...`) as the first line of
   your reply, then continue with the routing decision. Nothing else about the
   loading process.
2. **`WEB PROJECT NOT CONFIRMED`** — stop. Say the target does not look like a
   web project, ask the user to confirm, and route nothing until they do.
3. **`ui-lab-components NOT FOUND`** — the project is not wired yet. `build` and
   `conform` must route through `setup` (install + token layer + import order)
   before any edit. `audit` and `ideate` proceed normally.
4. **`ui-lab CLI NOT FOUND`** — `setup` requires the CLI. Combined with the MCP
   tool check (below), this is the tool gate: if either the CLI is missing or you
   do not have `mcp__ui-lab__*` tools in this session, do not mutate the project.
   Stop and tell the user it is not recommended to proceed without both tools,
   name which is missing, and give the install path (see `workflows/setup.md`
   Step 0). `audit` and `ideate` are read-only and may still proceed.
5. **Modes available** — route only to a mode listed there.
6. **No mode and no routable request** — a bare `$lab` activates UI Lab mode for
   the session. Acknowledge activation with the text in `<activation_response>`
   and wait for the user's first request. Do not ask them to choose a mode or
   specify a target; infer both from that request.

If the block is absent or reads `[shell command execution disabled by policy]`,
bare `$lab` still activates UI Lab mode. Do not emit a preflight warning or ask
for a mode. Apply the prose gates in `<activation_guardrails>` when the user
makes the first routable request, and run the preflight then if execution is
available.

</preflight>

<objective>
Route manually-invoked `/lab` web front-end UI design tasks. setup installs and wires UI Lab into a new or existing project — the CLI (`ui-lab init/add/status`) does the heavy lifting while the MCP setup guides define correct import order and the token layer; it runs inline and requires both the CLI and the MCP. build loads the UI Lab harness (pillars, design system, MCP usage) into this session and governs everything you write from then on — it runs inline, not as a subagent, and routes through setup first when UI Lab is not yet installed. ideate produces design briefs. audit validates visual/interface design against 6 core pillars (Design System Adherence, Layout & Spacing, Accessibility & Usability, Cognitive Load, Visual Consistency, Slop Avoidance) and produces star-rated reports (no code changes). quickfix runs inline with no plan or confirmation step: it swaps all applicable UI to UI Lab components, removes obvious slop patterns, and rewrites colors to UI Lab tokens. conform fixes what audit finds, or — without an audit in hand — finds and fixes the same adherence violations itself, replacing markup with field-tested UI Lab examples sourced via MCP while preserving product logic (no redesign).
</objective>

<quick_start>
Manual activation is required. A current-message `$lab` command turns UI Lab mode on for the rest of the session. Activation itself does not require a target, a sub-mode, or a routable request. Once active, use this skill when a subsequent request or already-known workspace context identifies a web project and the request concerns UI design, visual/interface quality, layout, design-system adherence, or a UI Lab component migration.

Never activate this skill merely because the user mentions "UI", "UI Lab", "design", "frontend", "React", or "component". Never use this skill to inspect, classify, or confirm whether the project is web. If `$lab` has not appeared in the session, do not use this skill.
</quick_start>

<activation_guardrails>

Invoke this skill only when all gates pass:

1. **Manual command gate:** The exact command `$lab` must have appeared in the current session. Its first appearance activates the skill persistently; subsequent requests do not need to repeat it. Treat `$lab` as the only activation switch.
2. **Known web project gate:** This gate applies when routing work, not when activating UI Lab mode. Before routing a request, the request itself or already-known workspace context must clearly establish that the target is a web project or web UI. Good signals include the user explicitly saying the target is a website/web app, already-seen `package.json` web UI dependencies or scripts, already-seen Next.js/React/Vite/Astro/Svelte/Vue/Remix/Nuxt files, already-provided HTML/CSS/TSX/JSX web views, or browser screenshots. Do not use this skill to look for those signals.
3. **UI design gate:** The user's current request must clearly concern web front-end UI design. Acceptable requests include:
   - Auditing, critiquing, or improving the visual/interface design of a web app, page, component, or screen.
   - Ideating what a web UI should contain, how a screen should be laid out, or which UI Lab components/patterns should be used.
   - Replacing, migrating, or conforming an existing web front-end UI to UI Lab components.

Do not invoke this skill for:

- Any request before `$lab` has activated UI Lab mode in the session.
- Non-web projects, including native mobile, desktop apps, terminal UIs, CLI tools, editor plugins, backend services, APIs, databases, infrastructure, scripting, tests, build tooling, documentation, or repository maintenance.
- General code review, bug fixing, refactoring, performance work, type errors, lint errors, dependency updates, or product logic.
- Front-end tasks that are behavioral or data-flow oriented but not design oriented, such as fixing a React state bug, wiring an API call, adding validation logic, or changing routing.
- Ambiguous words like "review", "fix", "improve", "frontend", "component", or "React" unless the request explicitly mentions UI design, visual layout, styling, accessibility/usability of the interface, design-system adherence, or UI Lab.

If a `/lab` request mixes web UI design with non-design engineering work, use this skill only for the web UI design portion and handle the rest normally. If the mixed request is not in a web project, do not use this skill.

</activation_guardrails>

<activation_response>

For a bare `$lab`, respond: `UI Lab mode activated. Tell me what you want to work on.`

</activation_response>

<auto_routing>

The `$lab` command activates this skill for the session. It is **not** a
per-request command the user has to keep typing, and the sub-modes are not
commands — they are routes you select internally.

Once this skill is loaded, route every subsequent UI design request in the
session yourself, from intent alone. The user should never have to type
`/lab audit` to get an audit. They say what they want in plain language; you pick
the mode and run it.

Worked examples — these route without any `/lab` prefix:

| The user says | Route |
| --- | --- |
| "Set up UI Lab in this project" / "Install UI Lab here" / "Scaffold a new UI Lab app" | `setup` |
| "Can you look at the Card component, see what's wrong with it" | `audit` |
| "Is our settings page following the design system?" | `audit` |
| "What should we design for the onboarding flow?" | `ideate` |
| "Come up with a design for the billing page" | `ideate` |
| "What am I missing on this screen?" | `ideate` |
| "Build me a header" / "Add a settings panel" / "Design a good header" | `build` |
| "Make this use UI Lab components" | `conform` |
| "Fix the violations from that audit" | `conform` |
| "Quickfix this page" / "Clean this up with UI Lab" / "De-slop this and use our tokens" | `quickfix` |

Announce the route in one line before running it (`Routing to **audit** — …`), so
the user can redirect if you picked wrong.

Two things can stop a routed request: the preflight's `WEB PROJECT NOT
CONFIRMED`, and a genuinely ambiguous request, which goes to `<routing>`'s
disambiguation rules. Neither prevents bare `$lab` from activating the mode.

If the user asks about this skill, edits it, or discusses its activation behavior,
answer or edit normally — do not route or spawn anything.

</auto_routing>

<routing>

| Intent                     | Agent     | Trigger words                                                                                                                                                            |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Set up / install UI Lab    | `setup`   | set up ui lab, install ui lab, initialize/init ui lab, add ui lab to this project, scaffold a ui lab app, wire up ui lab, new project with ui lab                          |
| Build new UI               | `build`   | build, add, create, implement, design a/the &lt;thing&gt;, make a &lt;component/page/screen&gt;, new component, new page, wire up this screen                                       |
| Ideate / critique          | `ideate`  | what should this have, what am I missing, ideate, is this the right design, what would make this better, design critique                                                 |
| Audit                      | `audit`   | UI design review, visual audit, interface audit, design-system violations, layout/accessibility/usability critique                                                       |
| Quickfix                   | `quickfix` | quickfix, quick fix, clean this up, de-slop, tidy this UI, fix this up quickly, make this look like UI Lab                                                                     |
| Conform / fix / replace UI | `conform` | conform, fix the audit findings, apply the audit, replace our ui, swap ui to ui lab, migrate project ui, convert ui to ui lab, refactor UI to UI Lab, bring this in line |

**Routing disambiguation:**
When trigger words match both `ideate` and `audit`:

- User provides existing UI code/screenshots + asks for visual/interface/design review → `audit`
- User asks "what should this have / what am I missing / is this right" with or without code → `ideate`
- User says "improve" without qualifying: ask "Do you want design system violations checked, or holistic design feedback on what should exist?"

When trigger words match `conform` and anything else:

- If the user has an audit report (or says "fix"/"apply" the audit findings) → `conform`, working from that report
- If the user wants a broad mechanical swap with no audit in hand (“replace all available components with UI Lab equivalents”, “conform our project UI to UI Lab components”) → `conform`, finding and fixing violations itself
- If the user wants a critique/audit of an existing UI with no intent to fix it yet → ask whether they want (A) audit only, (B) fix/conform only, or (C) audit then conform; default to (C)

When trigger words match `quickfix` and `conform`:

- The user says quickfix/quick fix, or wants a fast one-pass cleanup of a specific file/screen → `quickfix` (no plan, no confirmation)
- The user wants a project-wide migration, a reviewed plan, or is working from an audit report → `conform`

When trigger words match `build` and anything else:

- New UI that does not exist yet → `build`
- Existing UI, rewritten to use UI Lab → `conform` (a migration, not a build)
- "What should this have" before anything is written → `ideate`, then `build` from the brief
- `build` is the default for any request that ends in code the user did not have before

When the request is about installing or wiring UI Lab itself (not building UI):

- "Set up / install / initialize UI Lab", "add UI Lab to this project", "scaffold a UI Lab app" → `setup`
- If the preflight reports `ui-lab-components NOT FOUND` and the user asks to `build` or `conform`, run `setup` first (in this session), then continue into the requested mode. Do not hand-wire the install yourself when the CLI is available.
- If UI Lab is already installed (`ui-lab-components INSTALLED`) and the user asks to set it up again, confirm what they want re-run (theme, fonts, color mode) rather than re-scaffolding — `ui-lab init` is idempotent but ask before mutating a working setup.

</routing>

<agent id="setup">

<trigger>User wants UI Lab installed and wired in a project: "set up UI Lab here", "install UI Lab", "initialize UI Lab", "add UI Lab to this project", "scaffold a UI Lab app". Also the required first step when `build` or `conform` is requested but the preflight reports `ui-lab-components NOT FOUND`. Requires both the ui-lab CLI and the MCP.</trigger>

<spawn_prompt_file>workflows/setup.md</spawn_prompt_file>

<inline>true</inline>

</agent>

<agent id="build">

<trigger>User wants new web UI written: "build a header", "add a settings panel", "create a dashboard page", "implement this screen", "design a good header". Also the correct route for any UI coding work once the skill is loaded, unless the request is a migration (`conform`), a review (`audit`), or a pre-code brief (`ideate`).</trigger>

<spawn_prompt_file>workflows/build.md</spawn_prompt_file>

<inline>true</inline>

</agent>

<agent id="ideate">

<trigger>User wants holistic design critique: "what should this have", "improve the overall design", "is this the right design", "what am I missing", "ideate on this", "design critique", "what would make this better".</trigger>

<spawn_prompt_file>workflows/ideate.md</spawn_prompt_file>

</agent>

<agent id="audit">

<trigger>User provides existing web UI code, browser screenshots, or a web UI description and wants the visual/interface design reviewed, improved, or audited.</trigger>

<spawn_prompt_file>workflows/audit.md</spawn_prompt_file>

</agent>

<agent id="quickfix">

<trigger>User says "quickfix" / "quick fix", or wants existing web UI cleaned up in one pass: swap all applicable markup to UI Lab components, remove obvious slop, and conform colors to UI Lab tokens. No plan or confirmation step.</trigger>

<spawn_prompt_file>workflows/quickfix.md</spawn_prompt_file>

<inline>true</inline>

</agent>

<agent id="conform">

<trigger>User wants violations fixed rather than just reported: either working from an existing `audit` report ("fix these violations", "conform to the audit", "apply the audit findings"), or asking for a broad UI Lab component migration with no audit in hand ("conform our web project UI to UI Lab components", "swap/replace web UI to UI Lab", "migrate web project UI"), preserving all existing product logic, data flow, and behavior.</trigger>

<spawn_prompt_file>workflows/conform.md</spawn_prompt_file>

</agent>

<orchestration>

**Spawning:** Use the Task tool with subagent_type "general-purpose". Read the agent's `spawn_prompt_file` and pass its content as the prompt, appending the user's code, description, audit report, or file path at the end.

**`setup`, `build`, and `quickfix` are the exceptions — never spawn them.** All three carry `<inline>true</inline>`: read the workflow file and follow it yourself, in this session. `setup` mutates the real project and runs the CLI, then hands off to `build` in the same session; `build` governs the UI *you* write, and a subagent's context dies with the subagent. Spawning either defeats the mode. Once `build` is loaded, its rules stand for the rest of the session, so later UI work does not re-read it.

**MCP Usage:** All agents leverage ui-lab tools to query the registry:

Only three tools exist: `get_component { query, detail, limit }`, `search_workshop { query, kind, detail, limit }`, and `search_guides { query, detail, limit }`. Omit `query` to list everything; pass free text to search; pass a ref (`component:<id>`, `pattern:<id>`, `element:<pkg>/<id>`, `section:<id>`, `starter:<id>`, `guide:<id>`) to fetch one item exactly. `detail` is `summary | api | styling | usage | examples | full` for `get_component` and `summary | full` for the other two.

- **setup**: Fetches the setup guide, matching framework theme guide, and typography guide before mutation. The CLI owns installation and wiring, including Onyx, fonts, and typography. Never use the Next.js theme guide for Vite and never bypass a failed CLI with partial manual wiring.

- **build**: Assembles top-down from the composition ladder — `search_guides { query: "foundation", detail: "full" }` once, then `search_workshop { kind: "starter" | "section" | "element", query }` for the closest whole-screen composition, then `{ kind: "pattern", query }` for recurring sub-blocks, descending to `get_component { query: "component:<id>", detail: "api" }` (plus `detail: "usage"` for nesting) only as the leaf step for the primitives a chosen block actually uses. Reuses existing compositions and descends only for gaps; prefers `detail: "examples"` / workshop `detail: "full"` source over hand-written JSX. Never emits a component whose API it did not fetch, and never infers one from memory.

- **audit**: Validates components/props against registry via `get_component { query: "<name>" }` → `get_component { query: "component:<id>", detail: "api" }`; when a component's placement or nesting matters, also query `detail: "usage"`. Uses `search_guides { query: "theme" }` → `search_guides { query: "guide:<id>", detail: "full" }` for theme/color setup validation instead of hardcoded rules.
- **ideate**: Discovers patterns/elements/sections via `search_workshop { kind, query }` and guides via `search_guides` before suggesting gaps. Queries component examples via `get_component { query: "component:<id>", detail: "examples" }` when needed and `detail: "usage"` when composition semantics matter.
- **quickfix**: Fetches the foundation guide once, resolves each swap via `get_component { query: "<name>" }` → `detail: "api"`, and pulls `detail: "examples"` only for committed components. Checks `search_workshop { kind: "pattern" | "element" }` at summary for matching blocks.
- **conform**: Uses `search_guides { query: "setup-ui-lab-in-project", detail: "full" }` before any fix if UI Lab is not already wired. Uses `get_component` at `detail: "api"` and `detail: "usage"`, plus `search_workshop { query: "component:<id>", detail: "full" }` for source, to perform safe 1:1 replacements and keep imports correct. Prefers `get_component { detail: "examples" }` for field-tested replacement markup over hand-written JSX, and uses `search_workshop { query: "pattern:<id>" | "element:<pkg>/<id>" | "section:<id>", detail: "full" }` for larger structural matches — only when it preserves the existing structure (no redesign).

</orchestration>

<success_criteria>

**setup**: A setup pass is complete when:

- The tool gate passed: both the `ui-lab` CLI and the `mcp__ui-lab__*` tools were confirmed present before any mutation; if either was missing, no project files were changed and the user was told what to install
- The MCP setup guide was fetched (`search_guides { query: "setup-ui-lab-in-project", detail: "full" }`) and, when theme switching was in scope, the theme-switching guide — not derived from memory
- Installation and wiring were performed by the CLI (`ui-lab init`, previewed with `--dry-run` first for anything non-trivial, run with `--non-interactive`), not hand-rolled, whenever the CLI was available
- `ui-lab status` reports `ui-lab-components` installed and the stylesheet `configured: true`
- Import order includes the Onyx base before app overrides, plus fonts and typography as specified by the framework guide; the global stylesheet is imported exactly once
- One simple UI Lab component was rendered on an existing route to confirm tokens are active
- The result was reported (installed/created/modified + verified order) and, if UI work was the goal, handed off to `build` in the same session

**build**: A build is complete when:

- `references/design-system.md`, `references/core-pillars.md`, `references/slop-patterns.md`, and `references/craft.md` have all been read in full this session
- Every component used was resolved via `get_component { query: "<name>" }` → `get_component { query: "component:<id>", detail: "api" }` before being written — no API inferred from memory
- Replacement markup started from `get_component { detail: "examples" }` or a `search_workshop { detail: "full" }` pattern/element/section result wherever one exists
- A bill of materials was emitted before writing each screen, and full/examples detail fetched only for refs in the bill of materials, at most once each
- The build checklist ran before JSX: form and layout patterns were searched, every needed control was resolved, and experimental notes were evaluated
- Changed JSX contains no native interactive controls or styled native layout wrappers when a UI Lab equivalent exists
- No hex, `rgba()`, Tailwind neutrals, chromatic Tailwind standing in for semantic tokens, `shadow-*`, gradients, or `dark:` prefixes
- No styled native elements; compound sub-components used where available; React Aria props (`onPress`, `isOpen`)
- Every interactive element has hover, active, disabled, and keyboard focus; every async surface has loading, empty, and error states
- The six-pillar self-check ran and is reported as one line per pillar (not a star-rated audit report)
- Nothing was added for visual bulk: no decorative badges, icons beside headings, gradients, nested cards, or four-part empty states

**audit**: An audit is complete when:

- Components validated against registry via `get_component { query: "<name>" }` → `get_component { query: "component:<id>", detail: "api" }`
- Native HTML elements checked first (`<button>`, `<a>`, `<input>`, `<select>`, `<div className="...">`, etc.) — any found are CRITICAL violations in the Adherence pillar
- Vibe-coded anti-patterns from `references/design-system.md` explicitly checked, including arbitrary typography utilities, over-specified text rhythm, and transition noise
- Each of the 6 pillars has been independently evaluated
- Star rating assigned based on violation severity and count (5 stars = no violations, 1 star = critical failures)
- Violations listed with specific element/component reference and actionable recommendation
- Summary provided with overall assessment and priority focus areas
- Output follows star-rated format (no code generation)

**ideate**: A brief is complete when:

- Registry queried via appropriate search tools (`search_workshop { kind: "pattern" | "element" | "section" }`, `search_guides`)
- Domain context, user mental model, and workflow reasoning documented (2–4 sentences)
- Element inventory flat-listed with role, load-bearing status, and value rating
- Gaps classified into CRITICAL, LAYOUT COHERENCE, PROGRESSIVE DISCLOSURE categories
- Top 5 suggestions ranked by spatial coherence impact first, then functional criticality
- No code written; focus purely on "what should exist"

**quickfix**: A quickfix pass is complete when:

- `references/design-system.md`, `references/slop-patterns.md`, and `references/craft.md` were read in full this session
- Every styled native element or hand-rolled control in scope with a UI Lab equivalent was swapped, using APIs fetched via MCP
- Obvious slop patterns were removed without changing behavior or meaning
- Colors use only `bg-background-500`–`950`, `text-foreground-50`–`400`, `border-background-*`, `accent-*` for primary emphasis, and semantic tokens for feedback states. No hex, `rgba()`, Tailwind neutrals, shadows, gradients, or `dark:`
- Product logic is unchanged and a brief report lists swaps, removals, and anything left untouched

**conform**: A conform pass is complete when:

- UI Lab is installed and styles/token layer are wired correctly (or it is explicitly confirmed already set up) using `search_guides { query: "setup-ui-lab-in-project", detail: "full" }`
- A scoped plan + replacement report is presented and the user explicitly confirms before any conform changes are applied
- Only the view layer changes: preserve state, events, data fetching, routing, domain models, copy, and analytics hooks unless the user explicitly asks otherwise
- If working from an audit report: every violation in it is addressed or explicitly explained as unfixable
- If working without an audit report: violations are found using the same adherence checks audit uses, and all eligible UI primitives/wrappers are swapped to UI Lab equivalents (components/patterns/elements/sections) where a clear match exists in the registry
- Replacement markup is sourced from MCP field-tested examples (`get_component { detail: "examples" }`, or `search_workshop { query: "pattern:<id>" | "element:<pkg>/<id>" | "section:<id>", detail: "full" }`) rather than hand-written from scratch, wherever an example exists
- No “design improvement” changes are introduced beyond what was flagged (no new flows, no layout invention, no new features); any optional improvements are listed separately and not included in the patch
- A conform report is provided: what was fixed/swapped and its MCP source, what couldn’t be fixed/swapped (and why), and the highest-risk files/components

</success_criteria>
