---
"ui-lab-components": minor
---

Frame now draws its border and its shape's outline as one continuous line.

The two used to be separate strokes painted straight onto the canvas, so a
translucent `--stroke-color` composited brighter wherever they lapped over each
other — a bright knot at every join, measurable at 17% over the surrounding
stroke. Both are now collected into a single mask and coloured once, which makes
overlap free and lets the two meet with margin instead of on an exact line. The
shape's outline is also carried past its endpoints along the path's own tangent,
so a shape that leaves the edge on a curve runs into the border rather than
stopping square across it, and the border is cut back far enough that no hairline
of it survives beside a shape that swallows a corner.

The outline is painted above the frame's children instead of beneath them. A
child that reached the frame's edge used to paint over the inner half of a
centred or inside-aligned stroke, so the same border read as 1px next to an
opaque child and 2px next to a transparent one; every `strokeAlign` now renders
the same weight whatever the children do.

`--frame-shape-stroke-width` is removed. It existed only to thicken a shape's
outline back to matching weight after children ate half of it, and a shape now
tracks `--frame-stroke-width` like the rest of the border.
