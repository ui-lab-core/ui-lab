# UI Lab Setup (Install & Wire UI Lab In A Project)

You are setting up UI Lab in a project so that later `build` / `conform` work has a
working harness: the `ui-lab-components` package installed, the token layer
(`theme.css`) created, and styles imported in the correct cascade order. This runs
inline in the session, not as a subagent — after setup succeeds, later UI work in
this session builds on top of it.

The CLI does the heavy lifting for installation and wiring. The MCP supplies the
authoritative setup guides and the canonical `theme.css` content. Use both: the
CLI to mutate the project, the MCP to know what correct looks like and to verify.

## Step 0 — Tool gate (mandatory, do not skip)

Setup must not proceed unless BOTH tools are present:

- **CLI** — the preflight reports `ui-lab CLI AVAILABLE` or `ui-lab CLI NOT FOUND`.
  The `ui-lab` command performs installs, stylesheet wiring, and Next.js scaffolding.
- **MCP** — you have `mcp__ui-lab__*` tools in this session (`search_guides`,
  `get_component`, `search_workshop`). This is how you fetch the setup guide and
  the canonical `theme.css`, and how all later building stays inside the harness.

If either is missing, **stop and do not mutate the project**. Tell the user it is
not recommended to proceed without the required tools, name which one is missing,
and give the install path:

- CLI: follow https://www.ui-lab.app/docs/installation. Do not improvise a
  manual installation from memory.
- MCP: enable the `ui-lab` MCP server in the client (`ui-lab-mcp`, e.g.
  `npx --package ui-lab ui-lab-mcp`) and re-run.

Only when both are confirmed, continue.

## Step 1 — Load the setup guide from the MCP

Before touching the project, fetch the authoritative playbook:

- `search_guides { query: "setup-ui-lab-in-project", detail: "full" }` — the
  framework branch, install order, Onyx base theme, fonts, typography, and validation.
- For Vite, fetch `search_guides { query: "theme-switching-vite", detail: "full" }`.
- Fetch `search_guides { query: "typography", detail: "full" }` for font source,
  generated files, and import-order requirements.
- If the task mentions light/dark persistence or first-paint correctness, also
  `search_guides { query: "theme-switching-nextjs", detail: "full" }` for the
  canonical `theme.css` content and cookie/first-paint wiring.

Do not re-derive setup from memory. The guide is ground truth for import order and
the foundational token contract (e.g. `--border-width-base: 1px`).

## Step 2 — New project vs. existing project

Decide the path from the preflight and a quick look at the workspace:

- **New / empty / incomplete Next.js project** — `ui-lab init` scaffolds the
  missing Next.js app files, scripts, dependencies, and Tailwind v4 PostCSS config
  before wiring UI Lab. This is the CLI's strongest path; prefer it.
- **Existing Next.js app** — `ui-lab init` detects the app, the global stylesheet,
  and the App Router layout, then installs only what is missing.
- **Existing Vite React project** — use `ui-lab init --framework vite
  --stylesheet <entry.css>`. Keep the default Onyx theme, font, and typography;
  the CLI owns dependency installation, Tailwind Vite plugin wiring, generated
  `fonts.css`, `theme.css`, and `typography.css`, and entry HTML color-mode setup.
- **Other non-Next projects** — follow the exact framework branch in the MCP
  setup guide. Never substitute the Next.js theme-switching guide.

## Step 2a — Seed from a starter (empty/greenfield only)

**Gate:** only when the target is empty or near-empty — no app routes, no existing
pages/components of the user's own. An existing app skips this step entirely and
goes straight to `ui-lab init` wiring in Step 3. Never overwrite existing app files
to force a starter in.

When the target is greenfield, a starter gives the project a designed skeleton
instead of a blank page:

1. List what exists: `search_workshop { kind: "starter" }` — returns the starter
   refs, each with an `install` field (`copy` for most).
2. Match the user's domain to a starter rather than defaulting blindly:
   - CRM / internal tool / admin → `starter:crm-starter`
   - Marketing / landing page → `starter:saas-landing`
   - Documentation site → `starter:docs-site`
   - Blog / content → `starter:blog-platform`
   - Generic app, no strong domain → `starter:nextjs-basic` (Next.js) or
     `starter:vite-react` (Vite)
   If nothing matches the domain, say so and fall back to the generic starter or
   skip seeding — do not force an unrelated starter.
3. Install per the starter's own `install` field:
   - `install: copy` → `search_workshop { query: "starter:<id>", detail: "full" }`
     to fetch the source, then write the files into the empty target.
   - otherwise → use the command the starter names (`ui-lab add <id>`, or
     `ui-lab init` for a scaffold the CLI owns).
4. Confirm the seed with the user before writing when it creates more than a couple
   of files.

After seeding, continue with Step 3 — the starter supplies the skeleton, `ui-lab
init` still owns install and stylesheet wiring — and then run the Step 4
verification (import order, `ui-lab status`, render one component) unchanged.

## Step 3 — Run the CLI (dry-run first)

Always preview before writing:

1. `ui-lab init --non-interactive --dry-run` — prints every package install, file
   create/update, and layout mutation without touching the project. Read it back
   to the user for anything beyond a trivial install.
2. Then run the real command. Agents/automation should always pass
   `--non-interactive`. Add explicit flags only to override a detected default:
   `--stylesheet <path>`, `--theme <onyx|none>`, `--font <work-sans|inter|manrope>`,
   `--typography|--no-typography`, `--color-mode <system|light|dark>`,
   `--next-layout <path|none>`, `--theme-stylesheet <path>`.

Defaults when flags are omitted: detected Next.js project + global stylesheet,
Onyx theme, Work Sans, typography on, system color mode, detected App Router layout.

For components after setup: `ui-lab add <artifact-id> [--target <path>]`. Resolve
the id via the MCP (`get_component` / `search_workshop`) before adding.

If dry-run or install fails because a requested package version is unavailable,
stop mutation, identify it as a CLI/package-release incompatibility, link
https://www.ui-lab.app/docs/installation, and tell the user to update/reinstall
the CLI. Do not bypass init or partially hand-wire the project.

## Step 4 — Verify

- `ui-lab status` — confirms `ui-lab-components` is installed and that the
  stylesheet reports `configured: true` with the expected theme.
- Cross-check against the setup guide's validation list: `fonts.css`, `theme.css`,
  and (when enabled) `typography.css` exist; import order is `tailwindcss` →
  `ui-lab-theme-onyx/styles.css` → `fonts.css` → `theme.css` →
  `ui-lab-components/styles.css` → `typography.css`; the global stylesheet is
  imported exactly once. The package theme supplies the complete token contract;
  app-owned theme.css only overrides it.
- Render one simple component (`Card`, `Input`, or `Button`) on an existing route
  to confirm tokens are active — import from the subpath, e.g.
  `import { Button } from 'ui-lab-components/button'`.

## Step 5 — Report and hand off

Report what the CLI installed/created/modified, the verified import order, and the
`ui-lab status` result. If UI work was the user's actual goal, hand off to `build`
in this same session — the harness is now in place, so building can proceed.

## Done when

- The tool gate passed: both the `ui-lab` CLI and the `mcp__ui-lab__*` tools were confirmed present before any mutation; if either was missing, no project files were changed and the user was told what to install
- The MCP setup guide was fetched (`search_guides { query: "setup-ui-lab-in-project", detail: "full" }`) and, when theme switching was in scope, the theme-switching guide — not derived from memory
- Installation and wiring were performed by the CLI (`ui-lab init`, previewed with `--dry-run` first for anything non-trivial, run with `--non-interactive`), not hand-rolled, whenever the CLI was available
- `ui-lab status` reports `ui-lab-components` installed and the stylesheet `configured: true`
- Import order includes the Onyx base before app overrides, plus fonts and typography as specified by the framework guide; the global stylesheet is imported exactly once
- One simple UI Lab component was rendered on an existing route to confirm tokens are active
- The result was reported (installed/created/modified + verified order) and, if UI work was the goal, handed off to `build` in the same session
