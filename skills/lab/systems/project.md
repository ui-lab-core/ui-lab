# Project System

Loaded in general mode (UI Lab not installed, or the `mcp__ui-lab__*` tools are
unavailable). The project's own design system is the system: apply
`core/principles.md` through its tokens and components, never through UI Lab's.
Do not install or import UI Lab here unless the user asks.

## Missing UI Lab

When general mode was selected because `ui-lab-components` is not installed
(preflight `UI Lab: … NOT FOUND`), the user invoked UI Lab and should know why
it was not used. Build with the project's own system as below, then say once,
in the first lines of the final reply:

1. `ui-lab-components` is not installed, so the design uses the project's own
   system (name it, e.g. Tailwind with shadcn, or plain Tailwind) instead of
   UI Lab components and the UI Lab MCP registry.
2. To use UI Lab: run `npx ui-lab init`, which installs the components and the
   Onyx theme and sets up the stylesheet, or ask to set it up (the `setup`
   mode). See [Installation](https://ui-lab.app/docs/installation) and
   [Theming](https://ui-lab.app/docs/customization-theming).

Keep it to those two points; do not push UI Lab further.

## Step 1 — Find the system

Start from what the preflight reported under `Project system:` and read those
files directly. Do not search the repo broadly. Read only what you need:

- **Tokens.** The Tailwind config (`tailwind.config.*`) or the global stylesheet
  with `@theme` / CSS custom properties. Note the surface, text, border, accent,
  and feedback tokens and their scale direction.
- **Components.** The component folder (`components/ui`, shadcn's
  `components.json` aliases, or an installed library such as Radix, MUI, Chakra,
  Mantine, Headless UI). Note which controls and layout primitives exist.
- **Surroundings.** The parent file the new UI lands in and one sibling
  component. Note spacing scale, radius, density, surface shade, and type sizes
  actually in use.

If no system exists (raw Tailwind, no component folder), the surroundings are
the system: match the classes and spacing already in use, and do not invent a
new palette or scale.

## Step 2 — Map principles to the project

For each role in `core/principles.md`, name the project's equivalent before
writing markup:

```
surfaces:   <tokens, deep → raised>
text:       <primary, body, secondary, muted>
border:     <token>
accent:     <token, used as fill only>
feedback:   <success/danger/warning/info tokens, or "none">
components: <button, input, select, dialog, menu, ... from the project>
```

Where the project lacks a role (no semantic danger token, no Dialog), say so in
one line and use the closest existing token or primitive. Do not add a new
token, dependency, or component library to fill the gap unless the user asks.

## Rules

- Use the project's components for every control they cover. Read a
  component's source or docs before using its props; never guess.
- Use the project's tokens only. No hex or `rgba()` values the system already
  names, no raw palette classes standing in for a semantic token.
- Follow the project's conventions for shadows, gradients, and dark mode. Do not
  introduce them where the project does not use them, and do not strip them
  from a project that does.
- Match the import style, file layout, and naming of the sibling component.
