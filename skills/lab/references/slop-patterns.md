# Slop Pattern Reference

Use this reference to identify design decisions that make an interface feel generic, noisy, over-produced, provisional, or unintentional.

Evaluate the rendered interface in context. Identify the underlying decision, explain its effect on hierarchy, comprehension, usability, or task completion, and recommend the simplest meaningful alternative.

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

### Redundant signaling

Multiple visual or textual cues communicate the same fact without improving clarity. Repetition functions as decoration or perceived polish rather than recognition, accessibility, or state communication.

Prefer the strongest single signal. Keep redundancy only when it serves a distinct audience, improves accessibility, or prevents a meaningful state from being missed.

### Generic iconography

An icon is paired with text or placed in a control without adding distinct meaning, direction, state, recognition, or interaction guidance.

Prefer removing the icon when the text is sufficient. Keep or replace it only when it contributes meaning or materially improves recognition.

### Placeholder chrome

Development leftovers, filler copy, mock statuses, empty scaffolding, or provisional controls are presented as part of a finished user-facing surface.

Prefer replacing the placeholder with complete, meaningful content or removing the surface until it has a clear purpose.

### Hierarchy inflation

Too many elements compete for prominence, causing secondary information, decoration, and primary actions to appear equally important.

Prefer establishing one primary focus, reducing competing emphasis, and demoting or removing elements that do not support the main task.

### Structural over-composition

Containers, cards, wrappers, panels, or grouped sections are layered without each layer contributing distinct layout structure, semantics, progressive disclosure, or interaction.

Prefer flattening the composition. Keep a layer only when it changes layout, meaning, containment, interaction, or user perception in a useful way.

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
