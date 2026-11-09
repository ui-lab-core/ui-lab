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
3. **`MODE:`** — selects the system layer for every mode. `ui-lab` loads
   `core/*` + `systems/ui-lab.md` and uses the MCP. `general` loads `core/*` +
   `systems/project.md` and works with the project's own tokens and components;
   it never installs UI Lab or requires the CLI. In ui-lab mode, if you do not
   have `mcp__ui-lab__*` tools, drop to general mode and say so in one line.
4. **`Project system:`** — in general mode, the files to read for the project's
   tokens and components. Read those; do not search the repo for them.
4a. **`Theme:`** — whether ui-lab-components has a token layer to consume.
   `SET UP` needs nothing. `TOKENS MISSING` or `NOT INSTALLED` means components
   will render unthemed: follow `systems/ui-lab.md` § Project readiness for what
   to build and what to tell the user. `N/A` with `MODE: general` means
   ui-lab-components is missing: follow `systems/project.md` § Missing UI Lab.
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
Route manually-invoked `$lab` web UI design tasks to a mode (setup, build, ideate, audit, quickfix, conform), and pick the system layer from the preflight `MODE:` line. Every mode shares `core/` (principles, pillars, slop patterns, craft). ui-lab mode adds `systems/ui-lab.md` and the MCP registry; general mode adds `systems/project.md` and follows the project's own design system. Each workflow file holds its own steps and `Done when` criteria.
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
- Never route to `setup` implicitly. When UI Lab is not installed, `build`, `audit`, `ideate`, and `quickfix` run in general mode. `conform` is a UI Lab migration: in general mode, say it needs UI Lab and offer `setup` in one line.
- If UI Lab is already installed (`ui-lab-components INSTALLED`) and the user asks to set it up again, confirm what they want re-run (theme, fonts, color mode) rather than re-scaffolding — `ui-lab init` is idempotent but ask before mutating a working setup.

</routing>

<agent id="setup">

<trigger>User wants UI Lab installed and wired in a project: "set up UI Lab here", "install UI Lab", "initialize UI Lab", "add UI Lab to this project", "scaffold a UI Lab app". Only on explicit request. Requires both the ui-lab CLI and the MCP.</trigger>

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

**MCP usage (ui-lab mode only):** three tools — `get_component { query, detail, limit }`, `search_workshop { query, kind, detail, limit }`, `search_guides { query, detail, limit }`. Omit `query` to list; pass free text to search; pass a ref (`component:<id>`, `pattern:<id>`, `element:<pkg>/<id>`, `section:<id>`, `starter:<id>`, `guide:<id>`) to fetch exactly. Each workflow specifies which calls it makes. In general mode, make no MCP calls.

</orchestration>

