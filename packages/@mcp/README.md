# UI Lab MCP

A focused, read-only Model Context Protocol server that gives coding agents UI
Lab design knowledge, component APIs, and implementation examples.

## Tools

The server intentionally exposes three flexible tools.

### `get_component`

Find a component or retrieve authoritative component context.

- Natural-language queries return concise ranked matches.
- Exact component IDs support `summary`, `api`, `usage`, `examples`, and `full` detail.
- Component/example references return that exact public example source.

### `search_guides`

Search durable UI Lab guidance.

- Use `foundation` for the core design, composition, token, responsive, interaction, and accessibility rules.
- Summary detail returns ranked guide metadata.
- Full detail returns one exact or best-matching guide.

### `search_workshop`

Search public artifact metadata. Full detail returns source only for artifacts the public registry explicitly marks copyable. Package and premium items return a structured install intent.

## Responsibilities

- Search and retrieve public registry metadata, APIs, guides, and curated code
  examples with progressive disclosure.
- Validate design and implementation choices against authoritative UI Lab
  guidance.
- Tell an agent when an item requires installation, local availability, or
  premium access, using structured next-action data when that contract is
  introduced.
- Read an already installed premium artifact from the active project only after
  the CLI has obtained it. Project-root package resolution is required; a global
  MCP install must not be treated as the project's dependency graph.

## Non-responsibilities

- Installing packages, writing project files, selecting a package manager,
  authenticating users, storing tokens, or downloading premium artifacts.
- Returning premium source merely because an item is discoverable. Discovery
  metadata and source authorization are separate.

## Design

The MCP is a thin retrieval layer. Canonical public component and guide content
lives in `ui-lab-registry`; the private library is an authoring and restricted
artifact input and is not imported by this package. Premium source is never
returned; the MCP only provides concise install intents.

Responses use progressive disclosure. Search calls default to five summaries, while complete APIs, guides, and implementation source require an explicit detail request. Tool failures use MCP errors instead of success flags and instructional response messages.

The server exposes tools only. Registry resources are not separately advertised because they duplicate the same content without progressive disclosure.

## Development

Install dependencies with `pnpm install`, compile with `pnpm build`, and start the stdio server with `pnpm start`.

The package entry point is `dist/index.js` and requires Node.js 18 or newer.

## Command name

This package now owns `ui-lab-mcp`. The former `ui-lab` MCP command is replaced
by `ui-lab-mcp`; `ui-lab` belongs to `@ui-lab/cli`. Configure clients with
`npx --package ui-lab ui-lab-mcp` or an installed `ui-lab-mcp` binary.

Installed-artifact inspection is anchored to an explicit project root (or the
MCP process working directory) using project-root resolution. It reads only
CLI-recorded entries in `ui-lab.lock`, never the globally installed MCP tree.
