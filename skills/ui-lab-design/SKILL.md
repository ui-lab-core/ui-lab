---
name: design
description: Build, audit, ideate, or explore UI with UI Lab's component library. Routes to design-ideate (holistic feedback), design-audit (5-pillar validation). Requires ui-lab-mcp server.
---

<objective>
Route UI Lab tasks to specialized agents. design-ideate produces design briefs. design-audit validates against 5 core pillars (Design System Adherence, Layout & Spacing, Accessibility & Usability, Cognitive Load, Visual Consistency) and produces star-rated reports.
</objective>

<quick_start>
Paste your code or describe your design. The skill routes to the right agent automatically. If you want holistic design thinking ("what should this have?"), say so — the ideate runs before anything gets audited.
</quick_start>

<routing>

| Intent | Agent | Trigger words |
|--------|-------|---------------|
| Ideate / critique | `design-ideate` → `design-refactorer` | what should this have, what am I missing, ideate, is this the right design, what would make this better, design critique |
| Audit | `design-audit` → `design-refactorer` | review, what's wrong, audit, fix, violations |

**Routing disambiguation:**
When trigger words match both `design-ideate` and `design-audit`:
- User provides existing code + asks "what's wrong / fix / review" → `design-audit`
- User asks "what should this have / what am I missing / is this right" with or without code → `design-ideate`
- User says "improve" without qualifying: ask "Do you want design system violations checked, or holistic design feedback on what should exist?"

</routing>

<agent id="design-ideate">

<trigger>User wants holistic design critique: "what should this have", "improve the overall design", "is this the right design", "what am I missing", "ideate on this", "design critique", "what would make this better".</trigger>

<spawn_prompt_file>workflows/design-ideate.md</spawn_prompt_file>

</agent>

<agent id="design-audit">

<trigger>User provides existing code and wants it reviewed, improved, or audited.</trigger>

<spawn_prompt_file>workflows/design-audit.md</spawn_prompt_file>

</agent>

<orchestration>

**Spawning:** Use the Task tool with subagent_type "general-purpose". Read the agent's `spawn_prompt_file` and pass its content as the prompt, appending the user's code, description, or file path at the end.

**MCP Usage:** Both agents leverage ui-lab-mcp tools to query the registry:
- **design-audit**: Validates components/props against registry via `search_components` → `get_component(detail="api")`. Uses `search_guides("theme")` → `get_guide` for theme/color setup validation instead of hardcoded rules.
- **design-ideate**: Discovers patterns/elements/sections/guides via search tools (`search_patterns`, `search_elements`, `search_sections`, `search_guides`) before suggesting gaps. Queries component examples via `get_component(detail="examples")` when needed.

</orchestration>

<success_criteria>

**design-audit**: An audit is complete when:
- Components validated against registry via `search_components` → `get_component(detail="api")`
- Native HTML elements checked first (`<button>`, `<a>`, `<input>`, `<select>`, `<div className="...">`, etc.) — any found are CRITICAL violations in the Adherence pillar
- Each of the 5 pillars has been independently evaluated
- Star rating assigned based on violation severity and count (5 stars = no violations, 1 star = critical failures)
- Violations listed with specific element/component reference and actionable recommendation
- Summary provided with overall assessment and priority focus areas
- Output follows star-rated format (no code generation)

**design-ideate**: A brief is complete when:
- Registry queried via appropriate search tools (`search_patterns`, `search_elements`, `search_sections`, `search_guides`)
- Domain context, user mental model, and workflow reasoning documented (2–4 sentences)
- Element inventory flat-listed with role, load-bearing status, and value rating
- Gaps classified into CRITICAL, LAYOUT COHERENCE, PROGRESSIVE DISCLOSURE categories
- Top 5 suggestions ranked by spatial coherence impact first, then functional criticality
- No code written; focus purely on "what should exist"

</success_criteria>
