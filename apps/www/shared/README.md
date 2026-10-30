# shared/

This directory exists, byte for byte, in both `app/apps/www/shared` and
`private/apps/workshop/shared`. To update one, copy the other over it.

Rules that keep the copy working in either app:

- Import other `shared/` files with relative paths only. Never `@/`, `@showcase/`, or `@shared/`.
- Import packages both apps depend on: `react`, `next/*`, `ui-lab-components/*`,
  `ui-lab-registry`, `@ui-lab-core/library/*`, `lucide-react`, `react-icons/lib`.
- App-specific behavior comes in through props, or through `DocsHostProvider`
  (`host.tsx`), which each app mounts once with its theme, highlighter, and save control.

Apps import from here through the `@shared/*` path alias.
