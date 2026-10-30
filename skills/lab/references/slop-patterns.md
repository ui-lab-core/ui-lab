# Slop Pattern Reference

Use this reference to identify design decisions that make an interface feel generic, noisy, over-produced, provisional, or unintentional.

Evaluate the rendered interface in context. Identify the underlying decision, explain its effect on hierarchy, comprehension, usability, or task completion, and recommend the simplest meaningful alternative.

## Principle

Slop is visual friction: anything the eye has to process that does not help the user read, decide, or act. Every border, fill, wrapper, icon, label, and effect costs attention. A treatment earns that cost only when it communicates structure, state, hierarchy, or interaction that nothing else already communicates.

Work from this principle rather than from the list below. The patterns are common forms of friction, not an exhaustive catalog. When something feels noisy or hard to read, ask what it adds, then remove, flatten, or merge it until each remaining element does one clear job. Content should be legible at a glance: elements sized to be read, not shrunk to fit decoration around them.

## Audit Rules

1. Inspect each element in context, including its content, hierarchy, repetition, purpose, and relationship to nearby elements.
2. Report a pattern only when the treatment or structure fails to communicate meaning, improve usability, or support a real interaction.
3. Do not match a pattern solely because a particular class, token, component, style, or visual property appears.
4. Map each issue to the closest canonical pattern. Do not force a match.
5. Preserve styling that communicates real structure, state, hierarchy, accessibility, or interaction.
6. Base severity on the effect in context, not on the number of styling properties involved.

## Pattern Definitions

### Decorative noise

Visual treatment added mainly to make a surface feel designed rather than to communicate structure, state, hierarchy, or interaction. Examples include ornamental separators, unmotivated effects, and repeated accents that compete with content.

Prefer removing it or consolidating it into the smallest meaningful structural cue. Retain it only when it communicates a real boundary, state, hierarchy, or affordance.

### Inflated micro-hierarchy

A short label or secondary datum receives several simultaneous emphasis signals, making it feel like a category marker, badge, or editorial device without adding information.

Evaluate the combined effect rather than any single property.

Prefer ordinary supporting text, a modest weight or contrast change, or one purposeful distinction. Remove emphasis that does not improve scanning or comprehension.

### Metadata-first scaffolding

Layers of labels, badges, tags, headings, descriptions, or status metadata appear before the user reaches the actual content or action. Categorization becomes more prominent than purpose.

Prefer leading with the primary content or action. Keep only metadata that helps users interpret or act, and consolidate redundant labels into one clear supporting signal.

### Ceremonial page header

A title, tagline, or description block sits above a tool or workspace whose purpose is already evident from its controls and content. The header restates what the product is instead of helping the user act, and it takes vertical space from the surface the user came to work in.

Prefer removing it and letting the workspace start at the top edge. Keep product identity in the document title or navigation. Keep a page header only where it orients the user, such as distinguishing one record, document, or section of a multi-page flow from another.

### Detached readouts

Stats, telemetry, or status about one object are placed somewhere else on the page, often in a page header, footer, or sidebar, so the user has to connect the numbers to their subject across the layout.

Prefer attaching the readout to the thing it describes, as a status line or supporting text on that surface. Detached readouts often arrive with a ceremonial page header, and removing the header should move them, not delete them.

### Redundant signaling

Multiple visual or textual cues communicate the same fact without improving clarity. Repetition functions as decoration or perceived polish rather than recognition, accessibility, or state communication.

Prefer the strongest single signal. Keep redundancy only when it serves a distinct audience, improves accessibility, or prevents a meaningful state from being missed.

### Generic iconography

An icon is paired with text or placed in a control without adding distinct meaning, direction, state, recognition, or interaction guidance, or it is chosen as stock shorthand for a category rather than for what the thing actually is.

Prefer removing the icon when the text is sufficient. Keep or replace it only when it contributes meaning or materially improves recognition, and choose the glyph that depicts the specific subject.

### Placeholder chrome

Development leftovers, filler copy, mock statuses, empty scaffolding, or provisional controls are presented as part of a finished user-facing surface.

Prefer replacing the placeholder with complete, meaningful content or removing the surface until it has a clear purpose.

### Hierarchy inflation

Too many elements compete for prominence, causing secondary information, decoration, and primary actions to appear equally important.

Prefer establishing one primary focus, reducing competing emphasis, and demoting or removing elements that do not support the main task.

### Structural over-composition

Containers, cards, wrappers, panels, or grouped sections are layered without each layer contributing distinct layout structure, semantics, progressive disclosure, or interaction.

Prefer flattening the composition. Keep a layer only when it changes layout, meaning, containment, interaction, or user perception in a useful way.

### Compounded spacing

Space between or around regions accumulates from several independent sources, such as page padding, layout gaps, wrapper padding, and a component's own built-in spacing like a scrollbar gutter. Each value looks reasonable alone, but together they leave wide dead margins that push content inward and separate related regions. Workspaces that should run edge to edge are hit hardest.

Prefer one owner for each gap. When a component already supplies spacing, let it serve as the separation and remove the redundant gap or padding around it. Keep outer margins on a workspace minimal. When fixing excess space, find which source is redundant rather than removing the spacing a component needs to work, such as the gutter that keeps a scrollbar off the content.

### Decorative status treatment

Status-like chips, pills, or badges are used ornamentally without representing meaningful state, priority, availability, or action.

Prefer removing the treatment or expressing the information as concise supporting text. Reserve status treatments for information users may need to scan or act on.

### Empty-state over-explanation

An empty state combines multiple explanatory layers, decorative elements, and actions when the state and next step could be understood with less.

Prefer the minimum content needed to explain the state and support the next useful action. Remove repetition and decoration that do not reduce uncertainty.

## Severity

- `CRITICAL`: Makes the surface appear unfinished, misleading, or unusable.
- `WARNING`: Materially weakens hierarchy, clarity, or intentionality.
- `SUGGESTION`: Presents a mild opportunity to simplify or improve meaning.

## Finding Format

For every finding, provide:

```text
Element: [specific element or component]
Anti-pattern: [canonical pattern name]
Severity: [CRITICAL, WARNING, or SUGGESTION]
Reasoning: [how the treatment or structure fails to earn its visual weight in context]
Recommendation: [what to remove, simplify, consolidate, or make meaningful]
