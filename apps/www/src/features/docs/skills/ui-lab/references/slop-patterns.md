# Slop Pattern Reference

Canonical slop patterns for the Slop Avoidance pillar. These are AI-generated filler, decorative noise, and structural cliches that make a UI feel less intentional.

Use this reference when auditing a page or component. For each finding, name the concrete element, the canonical pattern, the severity, and the simplest fix that removes or consolidates the slop.

## How to Read This File

- The catalog below is a single table so it recites cleanly in the terminal.
- Use the exact pattern name from the `Pattern` column when reporting findings.
- Prefer removal, consolidation, or hierarchy repair over restyling.
- Do not flag intentional separators, data-driven badges, or depth cues that carry real meaning.

## Pattern Catalog

| Pattern | Severity | What it is | Typical forms | Fix |
| --- | --- | --- | --- | --- |
| Wide-tracked eyebrow | `WARNING` | A small uppercase, wide letter-spaced kicker stacked above a heading. The single most common AI slop tell. | `text-xs uppercase tracking-widest` overlines like `OUR FEATURES`, `WHY CHOOSE US`, `GET STARTED`; eyebrow / kicker / overline text above an `h2`. | Remove the eyebrow, or replace it with a real brow pattern from the UI Lab workshop that carries meaning (section index, category, or status). |
| Decorative dots / dividers | `WARNING` | Dots, dot rows, repeated bullets, or horizontal rules that do not mark a real boundary. | `•`, `·`, `···`, ornamental rules, repeated separators. | Remove the decoration or keep only the separator that reflects an actual section break. |
| Gratuitous gradients | `WARNING` | Gradient styling on surfaces that do not need depth, flow, or data emphasis. | `bg-gradient-*`, inline gradients, decorative fades on cards or panels. | Replace the gradient with a flat token surface unless the gradient carries meaning. |
| Gratuitous drop shadows | `WARNING` | Shadow styling used as decoration instead of elevation or focus. | `shadow-*` on cards, panels, or text with no layering purpose. | Remove the shadow or keep it only when it communicates hierarchy or lift. |
| Badge-led section stack | `WARNING` | A repeated scaffold where a section starts with badges, then a title, then a description, then more badges or metadata. | `title + badge + description`, `header + description + badges`, `title + content + badges`. | Keep the strongest hierarchy signal, remove redundant metadata, and move supporting detail into the body copy. |
| Badge stacking | `WARNING` | Three or more badges grouped together without a clear priority or information hierarchy. | Badge rows, label clusters, status chips stacked as decoration. | Collapse badges into one meaningful status, or replace the cluster with a single metadata line. |
| Generic icon + generic heading pairs | `SUGGESTION` | A decorative icon placed beside a heading when the icon does not add meaning. | Icon plus label that restates the same idea, iconography chosen for flavor only. | Remove the icon or replace it with one that adds semantic value, status, or direction. |
| Placeholder chrome | `CRITICAL` | Visible filler content or development leftovers shipped into a user-facing surface. | `Lorem ipsum`, `TODO`, `Coming soon`, stub badges, mock copy in production. | Replace the placeholder with real content or remove the surface until it is ready. |
| Over-labeled empty states | `WARNING` | An empty state that uses icon, heading, subtext, and CTA all at once when fewer elements would be clearer. | `icon + heading + subtext + button`, repeated explanatory copy that restates the state. | Keep only the elements that disambiguate the state and support the next action. |
| Unnecessary nesting depth | `WARNING` | Nested containers that do not add layout structure, semantic clarity, or progressive disclosure. | Card-in-card, group-in-card-in-card, wrapper layers with no distinct purpose. | Flatten the hierarchy unless each layer changes layout, semantics, or interaction. |

## Finding Format

Each Slop Avoidance finding should include:

- The concrete element or component.
- The canonical pattern name (exactly as written in the `Pattern` column).
- The severity.
- A concrete fix that removes, consolidates, or simplifies the pattern.

Example:

`- Section header: [WARNING] Wide-tracked eyebrow ("OUR FEATURES" overline above the h2) -> remove the eyebrow and let the heading carry the section`
