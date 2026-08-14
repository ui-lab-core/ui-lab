# UI Lab MCP

A focused Model Context Protocol server that gives coding agents access to UI Lab’s design knowledge, component APIs, and implementation workshop.

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

Search implementation references across component examples, patterns, elements, sections, and starters.

- Summary detail returns small ranked results without source-code noise.
- Filter by `example`, `pattern`, `element`, `section`, or `starter` when useful.
- Full detail retrieves one exact item and an optional variation, including source files when available.

## Design

The MCP is a thin retrieval layer. Canonical component, catalog, and guide content lives in `ui-lab-registry` and `@ui-lab-core/library`. Internal content categories remain searchable metadata rather than separate agent tools.

Responses use progressive disclosure. Search calls default to five summaries, while complete APIs, guides, and implementation source require an explicit detail request. Tool failures use MCP errors instead of success flags and instructional response messages.

The server exposes tools only. Registry resources are not separately advertised because they duplicate the same content without progressive disclosure.

## Development

Install dependencies with `pnpm install`, compile with `pnpm build`, and start the stdio server with `pnpm start`.

The package entry point is `dist/index.js` and requires Node.js 18 or newer.
