# Craft Reference

Use this reference for the small details that make an interface look intentional once the friction is gone. `slop-patterns.md` covers what to remove. This file covers how to finish what remains.

## Principle

Craft is fit: every element sits in its context as if it belonged there. Shapes nest cleanly inside their containers, content reads at a glance, and nothing carries more structure than its job needs. None of these details is noticed on its own, but together they decide whether a surface feels finished.

Infer from the principle rather than matching entries below. Each entry states a rule of fit, then shows the smallest way to apply it in UI Lab. When a new situation is not listed, ask what would make the element look like it belongs, and prefer the answer that adds the least code.

## Details

### Nested shapes follow their container

An inner shape inset inside a rounded container should have a correspondingly smaller radius, so the gap between them stays even all the way around the corner. Matching radii on both layers makes the corners pinch or bulge.

- Gap inside a bordered tile: put the fill on the element itself and draw the gap with an inset ring, `rounded-sm border border-background-700 inset-ring-2 inset-ring-background-950`. An inset shadow's inner edge curves to fit the element's own corner, so no radius math is needed.
- Inner sections of a component: derive the radius from the container with `--inset-radius` (set `--radius` on the container and `--inset-gap` on the child), as Select does.
- Avoid nesting a second element with its own padding and radius just to create a gap.

### Content reads at its size

Icons, labels, and figures should be sized to be read, not shrunk to fit decoration around them. If a glyph has to get smaller to fit its frame, remove the frame.

- `w-3.5 h-3.5` is the floor for icons that carry meaning. `w-3` reads as noise.
- Muted foreground tokens (`text-foreground-300`, `text-foreground-400`) give secondary glyphs less weight. Don't make them smaller to do it.

### Content sits on the surface that already contains it

An element inside a card, row, or panel already has a boundary. Giving it its own border and fill adds a second boundary that competes with the first. Let icons, labels, and metadata sit directly on the surface, and keep a separate tile only where it marks something outside the content, such as an avatar or a status on a timeline, or encodes selection, identity, or a hit target.

### Icons depict the subject

Choose the icon that shows what the thing is, not the stock symbol for its category. Sparkles for AI, rockets for launch, and shields for security are defaults, not decisions. A bot for an agent, a file for a file read, and a branch for a git operation tell the user something.
