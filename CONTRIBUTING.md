# Contributing to UI Lab

## Monorepo structure

```
ui-lab/
├── packages/
│   ├── @ui/          — ui-lab-components  (the component library)
│   ├── registry/     — ui-lab-registry    (metadata, examples, registry data)
│   └── @mcp/         — ui-lab-mcp         (MCP server for AI tooling)
└── apps/
    └── site/         — @ui-lab/site       (documentation site → Vercel)
```

`ui-lab-components` and `ui-lab-registry` always release together at the same version.
`ui-lab-mcp` releases independently.

## Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [pnpm](https://pnpm.io) ≥ 10 — enforced, `npm`/`yarn` will be rejected

## Setup

```sh
git clone https://github.com/ui-lab-core/ui-lab
cd ui-lab
pnpm install
```

## Development

```sh
pnpm dev:site        # start the docs site with hot reload
```

The site depends on the built packages. If you're changing `packages/@ui` or `packages/registry`, build them first:

```sh
pnpm build:packages  # build ui-lab-components + ui-lab-registry + ui-lab-mcp
pnpm dev:site
```

Or rebuild whenever you make package changes — the site picks up the new `dist/` output.

---

## Adding or modifying a component

Components live in two places that need to stay in sync:

### 1. The component — `packages/@ui/src/components/<Name>/`

```
Button/
├── Button.tsx              # component source
├── Button.module.css       # styles
├── Button.module.css.d.ts  # CSS module types
└── index.ts                # re-export
```

Export the component from `packages/@ui/src/index.ts`.

### 2. The registry entry — `packages/registry/src/components/<Name>/`

```
Button/
├── index.tsx       # registry wrapper / live preview component
├── metadata.json   # display name, description, category, tags
└── examples/       # usage examples shown in the docs
```

After editing either, run `pnpm build:packages` to regenerate registry data and rebuild the library. The registry has several code generation steps that run automatically as part of `build`.

---

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org):

```
feat(ui-components): add Tooltip component
fix(registry): correct Button metadata category
docs(site): update installation guide
chore(deps): bump tailwindcss to 4.2
refactor(registry): simplify element variation generator
```

Scope is the affected package or area: `ui-components`, `registry`, `mcp`, `site`, `deps`, `docs`.

---

## Changesets — describing your changes

We use [Changesets](https://github.com/changesets/changesets) to track what changed and compute version bumps.

**Any time you make a change to a publishable package** (`@ui`, `registry`, or `@mcp`), add a changeset:

```sh
pnpm changeset
```

This opens an interactive prompt:
1. Select which packages your change affects
2. Choose the bump type — `patch`, `minor`, or `major`
3. Write a one-line summary of the change

A markdown file is created in `.changeset/`. Commit it alongside your code change.

### Bump type guide

| Type | When |
|------|------|
| `patch` | Bug fix, style tweak, dependency update, internal refactor |
| `minor` | New component, new prop/API, new feature (backwards compatible) |
| `major` | Breaking change to a component API or exported type |

Because `ui-lab-components` and `ui-lab-registry` are fixed, bumping one bumps both.

---

## Release workflow

Releases are managed by `scripts/release.js`. Only maintainers with npm publish access run this.

### Prerequisites

- Clean working tree (everything committed)
- At least one pending changeset in `.changeset/`
- npm authentication: `npm whoami` should return your username

### Running a release

```sh
pnpm release
```

This script does the following in order:

1. **Checks** the working tree is clean
2. **Checks** there are pending changesets to process
3. `pnpm changeset version` — reads all pending changesets, bumps package versions, updates `CHANGELOG.md` in each package, removes the processed changeset files
4. `pnpm build:packages` — builds all packages with the new version numbers
5. `node scripts/toggle-versions.js to-version` — updates all consumer references (`apps/site`, etc.) from `workspace:*` to the new published version numbers
6. `pnpm changeset publish` — publishes changed packages to npm
7. `pnpm install` — regenerates the lockfile so Vercel resolves packages from npm
8. `git add -A && git commit -m "chore: release"` — commits version bumps, changelogs, updated refs, and lockfile
9. `git push --follow-tags` — pushes commits and the version tags created by `changeset publish`

### What gets published

| Package | npm |
|---------|-----|
| `ui-lab-components` | ✓ |
| `ui-lab-registry` | ✓ |
| `ui-lab-mcp` | ✓ (independently versioned) |
| `@ui-lab/site` | ✗ (private, deployed to Vercel) |

Vercel picks up the deployment automatically when the push lands on `master`.

---

## Version references — workspace vs. npm

During development, internal packages reference each other via `workspace:*` (pnpm resolves them as local symlinks). Before publishing, those references are switched to actual version numbers so that consumers can install from npm.

`scripts/toggle-versions.js` handles this switch. It's called automatically by `scripts/release.js` — you don't need to run it manually in normal development.

```sh
# Inspect current state
pnpm versions:status

# Manually switch (only needed if something went wrong)
pnpm versions:to-workspace   # workspace:* mode (for local dev)
pnpm versions:to-release     # version number mode (for publishing/Vercel)
```

---

## CI

GitHub Actions runs on every pull request:

- **Type check** — `pnpm type-check` across all packages

A release workflow (`.github/workflows/release.yml`) is available for automated publishing via the Changesets action. To activate it, add an `NPM_TOKEN` secret to the repository settings.

---

## Pull request checklist

- [ ] Change is scoped to one thing (one component, one bug, one feature)
- [ ] If touching a publishable package, a changeset is included
- [ ] `pnpm type-check` passes
- [ ] `pnpm build:packages` succeeds
- [ ] Commit messages follow conventional commits format
