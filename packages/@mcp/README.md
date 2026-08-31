# UI Lab MCP

A focused, read-only Model Context Protocol server that gives coding agents UI
Lab design knowledge, component APIs, and implementation examples.

## Reference grammar

Every ID the server accepts or emits uses one grammar:

- `component:<componentId>`
- `example:<componentId>/<exampleId>`
- `pattern:<patternId>`
- `element:<packageId>/<elementId>`
- `section:<sectionId>`
- `starter:<starterId>`
- `artifact:<artifactId>`
- `guide:<guideId>`

Every response emits the `ref` of everything it returns. Passing a ref back
verbatim resolves that item exactly, so an agent never has to reconstruct an ID.

## Response envelope

All three tools return the same envelope, so a client needs one parse path.
`status` decides which keys are present:

| `status` | Meaning | Keys |
| --- | --- | --- |
| `exact` | The requested item | `ref`, `data` |
| `matches` | Ranked candidates | `query`, `total`, `matches`, optional `note` |
| `list` | The full index (returned when `query` is omitted) | `total`, `items` |
| `not_found` | No match | `query`, `message`, `suggestions` |

Every non-`exact` response carries `nextSteps`: concrete follow-up calls.

A miss is a result, not a protocol error. MCP errors are reserved for the server
actually failing, so an agent can distinguish "this does not exist" from "the
registry failed to load" instead of hand-rolling a component that already
exists.

Results are returned as both `structuredContent` and a YAML text rendering.

## Tools

### `get_component`

Component identity, props, usage rules, and example source.

- Omit `query` to list every component id.
- A `component:` ref returns that component at the requested `detail`:
  `summary`, `api`, `usage`, `examples`, or `full`.
- An `example:` ref returns that example's source.
- Free text returns ranked matches. `detail` applies only to an exact ref; when
  it is dropped, the response says so in `note`.

Every component result carries an `import` object with the exact statement to
write. Components are imported from their own subpath
(`ui-lab-components/<componentId>`), not from the package barrel, and the
statement is present at every detail level including the default `summary`.

### `search_guides`

Durable UI Lab guidance.

- Omit `query` to list every guide.
- `foundation` carries the core design, composition, token, responsive,
  interaction, and accessibility rules. Read it before designing or reviewing UI.
- `detail: "full"` applies only to an exact guide ref.

### `search_workshop`

How an item is obtained, not what its API is.

- `kind: "component"` — ships in the `ui-lab-components` package.
- `kind: "pattern" | "element" | "section" | "starter"` — authored Workshop content.
- `kind: "artifact"` — legacy source artifacts copied by the UI Lab CLI.

Free exact results at `detail: "full"` add `code`, `files`, `dependencies`, and
`installIntent` when the content model supplies them. Public premium results are
locked summaries only: they may contain `productId` or `bundleId`, but never
code, files, dependencies, or preview imports.

Component example results use `get_component` and return `{ ref, component,
kind: "component-example", id, name, description, access, locked, code }`.
Pattern, element, section, and starter results use `search_workshop` and return
the common summary `{ ref, kind, id, name, description, category, visibility,
access, locked, installIntent? }`; free full results add the source fields above.

## Local offline use

Install `ui-lab` once, then configure the MCP client to run the local binary
without `npx` network resolution. From a project with the package installed,
the command is `pnpm exec ui-lab-mcp`. A path-stable configuration can instead
run `node /absolute/path/to/node_modules/ui-lab/dist/index.js`. All public/free
catalog metadata and source payloads are bundled in the installed
`ui-lab-registry` dependency, so requests make no network calls.

## Future premium offline cache

Premium delivery belongs behind the CLI's server-authenticated
`EntitlementClient`, never an MCP argument. A future `ui-lab sync` can perform a
device login, ask the entitlement service for the caller's user/organization
grants, download only authorized versioned bundles, verify the signed manifest
and file integrity hashes, and write them to an owner-only user cache. A server
resolver can layer that cache over `createPublicWorkshopContentResolver` using
`WorkshopContentResolver.resolve(ref, context)`. Locally delivered source is
copyable source; this design does not claim DRM or continued secrecy after
delivery.

## Responsibilities

- Search and retrieve public registry metadata, APIs, guides, and curated code
  examples with progressive disclosure.
- Validate design and implementation choices against authoritative UI Lab
  guidance.
- Tell an agent when an item requires installation or premium access, using
  structured next-action data.

## Non-responsibilities

- Installing packages, writing project files, reading the consuming project,
  selecting a package manager, authenticating users, storing tokens, or
  downloading premium artifacts.
- Returning premium source merely because an item is discoverable. Discovery
  metadata and source authorization are separate.

## Design

The MCP is a thin retrieval layer. Canonical public component and guide content
lives in `ui-lab-registry`; the private library is an authoring and restricted
artifact input and is not imported by this package. Premium source is never
returned; the MCP only provides concise install intents.

Search scores tokens and ranks rather than requiring every token to match, so a
natural-language query fails gracefully instead of failing on its weakest word.

The server exposes tools only, plus MCP `instructions` describing the intended
call order. Registry resources are not separately advertised because they
duplicate the same content without progressive disclosure; enumeration is
available on each tool by omitting `query`.
