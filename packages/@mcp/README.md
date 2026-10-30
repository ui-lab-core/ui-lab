# UI Lab MCP

Read-only, offline retrieval of authoritative UI Lab component APIs, guides,
and public Workshop source. Registry content remains authoritative; this server
filters retrieval, not definitions. It does not install packages or inspect the
consuming workspace.

## Direct retrieval and progressive disclosure

Known ids need no discovery or summary call. For a small settings component:

1. `search_guides { query: "foundation", detail: "full" }` once per design/review task.
2. `get_component { query: "select", detail: "api", parts: ["Trigger", "Value", "Content", "Item"], props: ["selectedKey", "onSelectionChange", "disabled", "label", "children", "Trigger.children", "Value.placeholder", "Value.children", "Content.position", "Item.disabled"] }`.
3. `get_component { query: "label", detail: "api" }`.
4. `get_component { query: "button", detail: "api" }`.

All API responses retain exact subpath import statements, applicable compound
client-component constraints, and registry accessibility guidance. Root `label`
provides selected text, not the accessible name: retained Trigger accessibility
props document `aria-label` and `aria-labelledby`.

`parts` selects compound parts (short or component-qualified names); `[]` selects
root only. Root props remain complete unless `props` is provided. `props` selects
root names and qualified part props such as `Trigger.children`. Required and
accessibility props of the selected root/parts are always retained. Unknown or
excluded selectors return `not_found`, not a silently incomplete API. Selectors
apply only to `detail: "api"`. Reachable behavioural custom types are included
transitively and in full. No definition or source is silently truncated.

Omit both selectors for the complete API; use `detail: "full"` for API, styling,
usage, accessibility and a bounded example listing. Other details are `summary`
(default identity/import), `styling` (slots, state attributes and styling types),
`usage`, and `examples`. Styling type definitions remain separate from API types.
Use follow-ups only when those details are needed, not as a mandatory call chain.

Examples come only from authored public component-example entries. `exampleCount`
is always present at examples/full detail, including zero. `examplesShown` appears
when limited; pass a returned exact example ref to retrieve its source. No source
follow-up is suggested when examples are absent. `usageAvailable: none` explicitly
identifies absent usage content. The server does not fabricate examples or search
other catalogs automatically.

## Exact references and search

References are `component:<id>`, `example:<componentId>/<exampleId>`,
`pattern:<id>`, `element:<packageId>/<id>`, `section:<id>`, `starter:<id>`,
`artifact:<id>` and `guide:<id>`. Legacy bare `componentId/exampleId` also resolves
an example. Known bare ids resolve directly. Explicit-reference misses return a
concise `not_found` and never fall back to fuzzy discovery. Malformed/unknown
prefixed refs also return a miss. Supported refs sent to the wrong tool point to
the correct tool. Suggestions, if present, are separate from the requested item;
full-index enumeration is not the routine recovery path.

Free text still uses weighted token OR ranking. Non-exact queries return candidates,
not full API/source/guide content. Omit `query` only when enumeration is needed.
Search limits default to 5 and clamp to 25; listings and example lists default to
50 and clamp to 200. `search_guides` honors listing limits too.

## Compact text responses

Each tool returns exactly one text body, without `structuredContent` or an output
schema. Exact payload fields are at the root, not nested under `data`. The format
is indented `key: value` text, not YAML. Uniform object arrays use a tab-separated
header and rows terminated by a blank line. `-` means an absent cell. Empty values
and false flags are omitted; zero counts remain visible. Multiline source is
fenced verbatim. Presentation metadata is removed and source is not duplicated.

`status` selects the response shape:

- `exact`: `ref` plus payload, optional useful `nextSteps`.
- `matches`: `query`, `returned`, `matches`, optional `note`, `nextSteps`.
  `returned` counts emitted candidates, not all possible matches.
- `list`: `total`, `items`, optional `shown` and truncation `note`, `nextSteps`.
- `not_found`: `query`, `message`, distinct `suggestions`, `nextSteps`.

A miss is a normal result; protocol errors indicate actual server failures.
Replacing the old match `total` with `returned` is an envelope compatibility change.
Existing unscoped API retrieval and legacy refs remain supported. Example lists are
now bounded; full API definitions and free source remain complete.

## Workshop and source restrictions

`search_workshop` retrieves installation metadata and source, not component APIs.
`kind` filters `component`, `artifact`, `pattern`, `element`, `section`, or `starter`.
Package components return an install command, not their source. Free exact full
results include authored files/code and dependencies when available. Premium items
remain discoverable locked teasers; the public server never returns their source,
dependencies or preview imports. Example source belongs to `get_component`; guides
belong to `search_guides`. No private registry dependency or source authorization
bypass is introduced.

## Measurements and context boundaries

The budget suite measures `encode(response).length` consistently. A representative
settings flow previously needed 11 calls and 35,392 encoded characters (guide,
listing, three summaries/APIs, missing Form, two empty example lookups). Direct
focused retrieval needs four calls and 14,655 characters with the same foundation
guide. Select alone drops from 16,330 to 4,322 characters. This is a reproducible
scenario, not a reconstruction of every call in the motivating 15-call session.
Full unscoped retrieval stays available. Advertised metadata budgets include both
server instructions and tool schemas.

Host-side broad tool-discovery queries can independently load unrelated tools
(such as Sites descriptions); local lab skill reference reads also cost context.
Neither is controlled by this MCP, and neither is changed here.

## Local use

Install `ui-lab` and configure the client to run `pnpm exec ui-lab-mcp`, or
`node /absolute/path/to/node_modules/ui-lab/dist/index.js`. Bundled public registry
content serves requests without network calls. The server advertises tools and
shared instructions, not duplicate registry resources. Authentication, installation,
premium downloads and any future entitlement cache belong outside this server.
