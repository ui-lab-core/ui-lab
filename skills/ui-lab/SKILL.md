---
name: ui-lab
description: >
  Manual invocation only. Use this skill only when the user's current message
  contains the explicit command "/ui". Do not invoke from ordinary UI, design,
  frontend, React, component, or UI Lab mentions. After "/ui" is present, use
  only when the request or already-known context clearly identifies a web
  project/web UI and asks for front-end UI design work: auditing visual/interface
  design, ideating screen/component layouts, or overhauling an existing web UI
  to UI Lab components. Never invoke this skill to determine whether a project
  is web. Do not use for ambiguous projects, non-web projects, backend, tests,
  data/model logic, API work, bug fixes, code review, refactors, docs, or
  general frontend tasks. Requires ui-lab-mcp server.
---

<objective>
Route manually-invoked `/ui` web front-end UI design tasks to specialized agents. ideate produces design briefs. audit validates visual/interface design against 6 core pillars (Design System Adherence, Layout & Spacing, Accessibility & Usability, Cognitive Load, Visual Consistency, Slop Avoidance) and produces star-rated reports. overhaul performs a mechanical web UI swap to UI Lab components while preserving product logic (no redesign).
</objective>

<quick_start>
Manual invocation is required. Use this skill only when the user's current message includes `/ui`, the request or already-known workspace context has established that the target is a web project, and the user is asking about UI design, visual/interface quality, layout, design-system adherence, or a UI Lab component migration.

Never invoke this skill merely because the user mentions "UI", "UI Lab", "design", "frontend", "React", "component", or the skill name. Never invoke this skill to inspect, classify, or confirm whether the project is web. If `/ui` is absent, or web-project status is unknown, do not use this skill.
</quick_start>

<activation_guardrails>

Invoke this skill only when all gates pass:

1. **Manual command gate:** The user's current message must contain the exact command `/ui`. If `/ui` is absent, do not invoke this skill, even when the user asks for UI/design/frontend work or mentions UI Lab by name. Treat `/ui` as the only activation switch.
2. **Known web project gate:** Before this skill is invoked, the request itself or already-known workspace context must clearly establish that the target is a web project or web UI. Good signals include the user explicitly saying the target is a website/web app, already-seen `package.json` web UI dependencies or scripts, already-seen Next.js/React/Vite/Astro/Svelte/Vue/Remix/Nuxt files, already-provided HTML/CSS/TSX/JSX web views, or browser screenshots. Do not invoke this skill to look for those signals. If web status is absent, ambiguous, or would require inspection after loading this skill, do not invoke this skill.
3. **UI design gate:** The user's current request must clearly concern web front-end UI design. Acceptable requests include:
   - Auditing, critiquing, or improving the visual/interface design of a web app, page, component, or screen.
   - Ideating what a web UI should contain, how a screen should be laid out, or which UI Lab components/patterns should be used.
   - Replacing, migrating, or overhauling an existing web front-end UI with UI Lab components.

Do not invoke this skill for:
- Any request that does not include `/ui`, regardless of content.
- Non-web projects, including native mobile, desktop apps, terminal UIs, CLI tools, editor plugins, backend services, APIs, databases, infrastructure, scripting, tests, build tooling, documentation, or repository maintenance.
- General code review, bug fixing, refactoring, performance work, type errors, lint errors, dependency updates, or product logic.
- Front-end tasks that are behavioral or data-flow oriented but not design oriented, such as fixing a React state bug, wiring an API call, adding validation logic, or changing routing.
- Ambiguous words like "review", "fix", "improve", "frontend", "component", or "React" unless the request explicitly mentions UI design, visual layout, styling, accessibility/usability of the interface, design-system adherence, or UI Lab.

If a `/ui` request mixes web UI design with non-design engineering work, use this skill only for the web UI design portion and handle the rest normally. If the mixed request is not in a web project, do not use this skill.

</activation_guardrails>

<manual_invocation_contract>

The `/ui` prefix is the contract between the user and the agent:

- `/ui audit ...` routes to `audit` when the target is an existing web UI and the user wants a visual/interface/design-system review.
- `/ui ideate ...` routes to `ideate` when the user wants holistic design direction, missing elements, or layout/component ideas.
- `/ui overhaul ...` routes to `overhaul` when the user wants a mechanical UI Lab component migration.
- `/ui ...` without an explicit mode may still be routed by the rules below.

If the user asks about the UI Lab skill, edits this skill, or discusses its activation behavior without using `/ui`, answer or edit normally without spawning UI Lab agents.

</manual_invocation_contract>

<routing>

| Intent | Agent | Trigger words |
|--------|-------|---------------|
| Ideate / critique | `ideate` | what should this have, what am I missing, ideate, is this the right design, what would make this better, design critique |
| Audit | `audit` | UI design review, visual audit, interface audit, design-system violations, layout/accessibility/usability critique |
| Overhaul / replace UI | `overhaul` | overhaul, replace our ui, swap ui to ui lab, migrate project ui, convert ui to ui lab, refactor UI to UI Lab |

**Routing disambiguation:**
When trigger words match both `ideate` and `audit`:
- User provides existing UI code/screenshots + asks for visual/interface/design review → `audit`
- User asks "what should this have / what am I missing / is this right" with or without code → `ideate`
- User says "improve" without qualifying: ask "Do you want design system violations checked, or holistic design feedback on what should exist?"

When trigger words match `overhaul` and anything else:
- If the user wants a mechanical swap (“replace all available components with UI Lab equivalents”, “overhaul our project UI with UI Lab components”) → `overhaul`
- If the user wants a critique/audit of an existing UI (even if they also say “overhaul”) → ask whether they want (A) mechanical swap only or (B) swap + design critique; default to (A)

</routing>

<agent id="ideate">

<trigger>User wants holistic design critique: "what should this have", "improve the overall design", "is this the right design", "what am I missing", "ideate on this", "design critique", "what would make this better".</trigger>

<spawn_prompt_file>workflows/ideate.md</spawn_prompt_file>

</agent>

<agent id="audit">

<trigger>User provides existing web UI code, browser screenshots, or a web UI description and wants the visual/interface design reviewed, improved, or audited.</trigger>

<spawn_prompt_file>workflows/audit.md</spawn_prompt_file>

</agent>

<agent id="overhaul">

<trigger>User wants a project-wide web UI replacement to UI Lab components/patterns while preserving all existing product logic, data flow, and behavior (“overhaul our web project UI with UI Lab components”, “swap/replace web UI to UI Lab”, “migrate web project UI”).</trigger>

<spawn_prompt_file>workflows/overhaul.md</spawn_prompt_file>

</agent>

<orchestration>

**Spawning:** Use the Task tool with subagent_type "general-purpose". Read the agent's `spawn_prompt_file` and pass its content as the prompt, appending the user's code, description, or file path at the end.

**MCP Usage:** Both agents leverage ui-lab-mcp tools to query the registry:
- **audit**: Validates components/props against registry via `search_components` → `get_component(detail="api")`; when a component's placement or nesting matters, also query `get_component(detail="usage")`. Uses `search_guides("theme")` → `get_guide` for theme/color setup validation instead of hardcoded rules.
- **ideate**: Discovers patterns/elements/sections/guides via search tools (`search_patterns`, `search_elements`, `search_sections`, `search_guides`) before suggesting gaps. Queries component examples via `get_component(detail="examples")` when needed and `get_component(detail="usage")` when composition semantics matter.
- **overhaul**: Uses `search_guides` → `get_guide("setup-ui-lab-in-project")` before any migration if UI Lab is not already wired. Uses `get_component(detail="api")` + `get_component(detail="usage")` + `get_component_source` to perform safe 1:1 replacements of primitives and to keep imports correct. Uses `get_pattern` / `get_element` / `get_section` only when it preserves the existing structure (no redesign).

</orchestration>

<success_criteria>

**audit**: An audit is complete when:
- Components validated against registry via `search_components` → `get_component(detail="api")`
- Native HTML elements checked first (`<button>`, `<a>`, `<input>`, `<select>`, `<div className="...">`, etc.) — any found are CRITICAL violations in the Adherence pillar
- Vibe-coded anti-patterns from `references/design-system.md` explicitly checked, including arbitrary typography utilities, over-specified text rhythm, and transition noise
- Each of the 6 pillars has been independently evaluated
- Star rating assigned based on violation severity and count (5 stars = no violations, 1 star = critical failures)
- Violations listed with specific element/component reference and actionable recommendation
- Summary provided with overall assessment and priority focus areas
- Output follows star-rated format (no code generation)

**ideate**: A brief is complete when:
- Registry queried via appropriate search tools (`search_patterns`, `search_elements`, `search_sections`, `search_guides`)
- Domain context, user mental model, and workflow reasoning documented (2–4 sentences)
- Element inventory flat-listed with role, load-bearing status, and value rating
- Gaps classified into CRITICAL, LAYOUT COHERENCE, PROGRESSIVE DISCLOSURE categories
- Top 5 suggestions ranked by spatial coherence impact first, then functional criticality
- No code written; focus purely on "what should exist"

**overhaul**: An overhaul is complete when:
- UI Lab is installed and styles/token layer are wired correctly (or it is explicitly confirmed already set up) using `search_guides` → `get_guide`
- A scoped plan + replacement report is presented and the user explicitly confirms before any overhaul changes are applied
- Only the view layer changes: preserve state, events, data fetching, routing, domain models, copy, and analytics hooks unless the user explicitly asks otherwise
- All eligible UI primitives/wrappers are swapped to UI Lab equivalents (components/patterns/elements/sections) where a clear match exists in the registry
- No “design improvement” changes are introduced (no new flows, no layout invention, no new features); any optional improvements are listed separately and not included in the patch
- A migration report is provided: what was swapped, what couldn’t be swapped (and why), and the highest-risk files/components

</success_criteria>
