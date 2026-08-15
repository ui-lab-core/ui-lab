---
name: ui-lab
description: >
  Manual invocation only. Use this skill only when the user's current message
  contains the explicit command "/ui". Do not invoke from ordinary UI, design,
  frontend, React, component, or UI Lab mentions. After "/ui" is present, use
  only when the request or already-known context clearly identifies a web
  project/web UI and asks for front-end UI design work: auditing visual/interface
  design, ideating screen/component layouts, or conforming an existing web UI
  to UI Lab components. Never invoke this skill to determine whether a project
  is web. Do not use for ambiguous projects, non-web projects, backend, tests,
  data/model logic, API work, bug fixes, code review, refactors, docs, or
  general frontend tasks. Requires ui-lab server.
---

<objective>
Route manually-invoked `/ui` web front-end UI design tasks to specialized agents. ideate produces design briefs. audit validates visual/interface design against 6 core pillars (Design System Adherence, Layout & Spacing, Accessibility & Usability, Cognitive Load, Visual Consistency, Slop Avoidance) and produces star-rated reports (no code changes). conform fixes what audit finds, or — without an audit in hand — finds and fixes the same adherence violations itself, replacing markup with field-tested UI Lab examples sourced via MCP while preserving product logic (no redesign).
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
   - Replacing, migrating, or conforming an existing web front-end UI to UI Lab components.

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

- `/ui audit ...` routes to `audit` when the target is an existing web UI and the user wants a visual/interface/design-system review (report only, no code changes).
- `/ui ideate ...` routes to `ideate` when the user wants holistic design direction, missing elements, or layout/component ideas.
- `/ui conform ...` routes to `conform` when the user wants violations fixed — either from an existing audit report, or as a mechanical UI Lab component migration across the project.
- `/ui ...` without an explicit mode may still be routed by the rules below.

If the user asks about the UI Lab skill, edits this skill, or discusses its activation behavior without using `/ui`, answer or edit normally without spawning UI Lab agents.

</manual_invocation_contract>

<routing>

| Intent | Agent | Trigger words |
|--------|-------|---------------|
| Ideate / critique | `ideate` | what should this have, what am I missing, ideate, is this the right design, what would make this better, design critique |
| Audit | `audit` | UI design review, visual audit, interface audit, design-system violations, layout/accessibility/usability critique |
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

</routing>

<agent id="ideate">

<trigger>User wants holistic design critique: "what should this have", "improve the overall design", "is this the right design", "what am I missing", "ideate on this", "design critique", "what would make this better".</trigger>

<spawn_prompt_file>workflows/ideate.md</spawn_prompt_file>

</agent>

<agent id="audit">

<trigger>User provides existing web UI code, browser screenshots, or a web UI description and wants the visual/interface design reviewed, improved, or audited.</trigger>

<spawn_prompt_file>workflows/audit.md</spawn_prompt_file>

</agent>

<agent id="conform">

<trigger>User wants violations fixed rather than just reported: either working from an existing `audit` report ("fix these violations", "conform to the audit", "apply the audit findings"), or asking for a broad UI Lab component migration with no audit in hand ("conform our web project UI to UI Lab components", "swap/replace web UI to UI Lab", "migrate web project UI"), preserving all existing product logic, data flow, and behavior.</trigger>

<spawn_prompt_file>workflows/conform.md</spawn_prompt_file>

</agent>

<orchestration>

**Spawning:** Use the Task tool with subagent_type "general-purpose". Read the agent's `spawn_prompt_file` and pass its content as the prompt, appending the user's code, description, audit report, or file path at the end.

**MCP Usage:** All agents leverage ui-lab tools to query the registry:
- **audit**: Validates components/props against registry via `search_components` → `get_component(detail="api")`; when a component's placement or nesting matters, also query `get_component(detail="usage")`. Uses `search_guides("theme")` → `get_guide` for theme/color setup validation instead of hardcoded rules.
- **ideate**: Discovers patterns/elements/sections/guides via search tools (`search_patterns`, `search_elements`, `search_sections`, `search_guides`) before suggesting gaps. Queries component examples via `get_component(detail="examples")` when needed and `get_component(detail="usage")` when composition semantics matter.
- **conform**: Uses `search_guides` → `get_guide("setup-ui-lab-in-project")` before any fix if UI Lab is not already wired. Uses `get_component(detail="api")` + `get_component(detail="usage")` + `get_component_source` to perform safe 1:1 replacements and keep imports correct. Prefers `get_component(detail="examples")` for field-tested replacement markup over hand-written JSX, and uses `get_pattern` / `get_element` / `get_section` for larger structural matches — only when it preserves the existing structure (no redesign).

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

**conform**: A conform pass is complete when:
- UI Lab is installed and styles/token layer are wired correctly (or it is explicitly confirmed already set up) using `search_guides` → `get_guide`
- A scoped plan + replacement report is presented and the user explicitly confirms before any conform changes are applied
- Only the view layer changes: preserve state, events, data fetching, routing, domain models, copy, and analytics hooks unless the user explicitly asks otherwise
- If working from an audit report: every violation in it is addressed or explicitly explained as unfixable
- If working without an audit report: violations are found using the same adherence checks audit uses, and all eligible UI primitives/wrappers are swapped to UI Lab equivalents (components/patterns/elements/sections) where a clear match exists in the registry
- Replacement markup is sourced from MCP field-tested examples (`get_component(detail="examples")`, `get_pattern`, `get_element`, `get_section`) rather than hand-written from scratch, wherever an example exists
- No “design improvement” changes are introduced beyond what was flagged (no new flows, no layout invention, no new features); any optional improvements are listed separately and not included in the patch
- A conform report is provided: what was fixed/swapped and its MCP source, what couldn’t be fixed/swapped (and why), and the highest-risk files/components

</success_criteria>
