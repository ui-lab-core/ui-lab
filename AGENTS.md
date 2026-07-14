<naming>
Names are generic, never prefixed with the component or feature they belong to. Scope comes from where a name is defined (selector, module, file), not from the name itself.
- Correct: `--background`, `--foreground`, `--radius`
- Wrong: `--component-background`, `--feature-radius`
Prefer the shortest generic name that reads clearly in context. Add a qualifier only to disambiguate two things in the same scope, never to restate the owner.
</naming>

<registry>
`packages/registry` build runs `scripts/sync-private-registry-content.ts`, which replaces `src/elements`, `src/patterns`, and `src/sections` from `../private/packages/library/content/registry` when that private tree exists. Make persistent registry content edits in the private source first, then rebuild/regenerate the public registry copy.

The public catalog snapshot is generated from `private/packages/library/dist/catalog.js`; run `npm run build` in the private library before `pnpm generate` in `packages/registry` when catalog metadata changes.
</registry>

<validation>
For focused component tests in `packages/@ui`, run the package-local Vitest binary, e.g. `./node_modules/.bin/vitest --run src/components/Grid/tests/Grid.core.test.tsx` from `packages/@ui`. For the site, `pnpm run type-check` from `apps/www` runs `tsc --noEmit`.
</validation>
