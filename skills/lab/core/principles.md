# Design Principles

Library-neutral rules for any web UI. They apply in both modes. Concrete tokens
and components come from the active system file: `systems/ui-lab.md` in ui-lab
mode, the project's own system (`systems/project.md`) in general mode.

## Color roles

Use the system's tokens for every color. Never hand-pick a value the system
already names.

### Surfaces and text

- Surfaces form a depth scale. Pick one direction (e.g. deeper = darker) and
  keep it: root, then panel/card/modal, then toolbar/header, then raised/selected.
- Hover is one step from the base surface. Selected outranks hover; hover must
  never visually outrank a selected state.
- Text has a strength scale: headings/primary, body, secondary, muted
  (placeholder, disabled). Express de-emphasis with a weaker step, not a smaller
  size.
- Borders use a border or surface token, never a text color.

### Accent

Accent is the single primary-emphasis color. Use it only for the main action in
a local context, the current navigation location, and focus indication. One
accent focus per local context. Never for decoration, headings, or stateless
icons.

Accent is a fill, never a foreground: no accent-colored text, labels, counts, or
icons. Active, selected, and filtered states on controls use neutral contrast (a
stronger text step or a raised surface step), not accent.

### Feedback

Success, danger, warning, and info use the system's semantic tokens, not raw
chromatic colors (`red-*` for danger). Semantic colors mark real feedback state
(validation, status, alerts, destructive actions), never decoration or a second
accent. Chromatic color is fine as intentional decoration (brand, file-type
indicators, illustration).

## Components and markup

- Use the system's components for every control and layout primitive it
  provides. A styled native `<button>`, `<a>`, `<input>`, `<select>`, or
  `<textarea>` next to an existing component for the same job is a violation.
- Prefer compound sub-components (`Card.Header`, `List.Item`) over raw wrappers
  when the system offers them.
- Never guess a component's API. Read its source, docs, or registry entry first.

## Interactive states

Every interactive element defines hover, active/pressed, disabled (when
applicable), and keyboard focus. Every async surface defines loading, empty, and
error states. Use the system's focus ring; do not restyle it.

## Affordance rules

- **No zero-state chrome.** Hide counters/filters/results UI until count > 0
  (`"0 items selected"`, `"No filters applied"`, `"0 results"` are violations).
- **No duplicate affordances.** Same action on the same element twice (icon
  button + text link for delete): pick one or differentiate hierarchy.
- **No mode-leaking affordances.** In mutually exclusive modes (single vs. batch
  select), per-item actions hide in batch mode; batch actions hide in single mode.
- **No redundant action surfaces.** Two surfaces with the same intent under the
  same conditions: one is redundant.

## Anti-patterns

Flag these; they indicate hand-tuned utilities substituting for system tokens.

### Typography

- Arbitrary sizes: `text-[11px]`, `text-[10px]`, etc.
- Arbitrary tracking: `tracking-[0.22em]`, etc.
- `uppercase tracking-wide` and similar micro-label combos without semantic need
- `uppercase` used purely for visual flavor
- Stacked overrides like `font-bold leading-snug` on labels, chips, buttons,
  supporting text
- Manual line-height overrides without a real wrapping/density need

Prefer component defaults and the system's text styles.

### Motion

- `transition-all` (flag by default)
- `transition-colors` on static containers, layout wrappers, non-interactive
  decoration
- Decorative `delay-*` with no state-change signal

Motion must be tied to state, feedback, or focus.

### Copy

- **Redundant labels.** Tooltip or aria-label identical to visible text.
- **Parasitic instructions.** Help text that persists after the described action.
- **Heading/breadcrumb duplication.** Heading restates the last breadcrumb segment.
- **Icon+label parity.** Decorative prefix icon that restates the label with no
  hierarchy or indicator value.
- **Verbose empty states.** More than one short sentence + one CTA.

## Checklist

1. Colors: system tokens only, surface/text scales, accent as fill, semantic feedback
2. Components: system components over styled native elements; APIs read, not guessed
3. Interactive and async states present
4. Affordance rules (zero-state, duplicates, mode-leaking, redundant surfaces)
5. Anti-patterns (typography, motion, copy)
