# UI Lab CLI

`@ui-lab/cli` owns all UI Lab project mutation and the `ui-lab` command.

`ui-lab init` installs the complete Onyx setup. It creates `theme.css` and `fonts.css` beside the selected global stylesheet, adds canonical imports and managed global CSS to that stylesheet, and optionally creates `typography.css`. Existing non-UI-Lab CSS is retained.

Agents and automation should run `ui-lab init --non-interactive`. The CLI detects or completes the Next.js project and defaults to the detected global stylesheet, Onyx, Work Sans, typography, system color mode, and the detected App Router layout. Explicit flags override any default. Non-TTY execution automatically enables non-interactive mode.

Use `--font work-sans|inter|manrope` to select a Fontsource variable body and heading font; Work Sans is the default. JetBrains Mono Variable is installed for monospace content. Use `--typography` or `--no-typography` and `--color-mode system|light|dark` (system is the default). System mode leaves the root theme unstamped for `prefers-color-scheme`; light and dark use the `ui-lab-theme` cookie on the server. In Next App Router projects, `app/layout.tsx` and `src/app/layout.tsx` are detected and `--next-layout <path>` selects a safe integration target. Use `--next-layout none` to skip it. `--theme-stylesheet <path>` changes the generated theme token file location.

For a fully explicit Next install: `ui-lab init --stylesheet src/app/globals.css --theme onyx --font work-sans --typography --color-mode system --next-layout src/app/layout.tsx --non-interactive`. Add `--dry-run` to print every package installation, file creation/update, and layout mutation without writing. Running init in an empty or incomplete directory creates the missing Next.js application files, scripts, dependencies, and Tailwind v4 PostCSS configuration before configuring UI Lab.

`ui-lab add <artifact-id> [--target src/components/ui-lab]` installs standard components from `ui-lab-components` or writes complete explicitly public source artifacts after integrity verification. `ui-lab status` reports installed packages and stylesheet configuration.

`ui-lab login` is reserved for a configured provider-neutral device flow. Premium delivery requires an external entitlement service that authorizes a versioned artifact and provides a short-lived signed download or authorized payload with a signed manifest/integrity hashes. Until configured, premium adds fail before writing files.

The CLI does not create or depend on project-level UI Lab metadata files. Credentials belong in an OS credential store selected by an entitlement provider, never package.json or source files.

The MCP command moved to `ui-lab-mcp`. Use `npx --package ui-lab ui-lab-mcp` for MCP clients; `ui-lab` is reserved for this CLI.
