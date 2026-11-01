Component contract ownership

Public component types and JSDoc in packages/@ui own prop signatures. Component metadata.json files in this package own identity, usage guidance, behavioral contracts, and basic public examples. Generation reads the canonical JSON into .generated/component-metadata.ts; registry.ts consumes that portable JavaScript snapshot. There are no runtime JSON imports or separately authored metadata copies. Do not add another authored registry record or hand-edit generated API data.

Use contract version 1 to describe behavior that types cannot express: rendered element, native-prop forwarding target, ref target, state ownership, layout defaults, supported composition, and accessibility requirements. Part names are compound accessors without the root prefix, such as Trigger. Only document behavior confirmed in the component implementation. Types alone do not prove runtime forwarding or accessibility.

Select, Group, Input, TextArea, List, Expand, and Scroll require contracts. Coverage for other components is incremental. A component that declares a contract must have an extracted API, valid documented parts, and at least one public example with a stable id. Contract checks run during registry generation. Generation and enrichment failures must fail the build rather than publish incomplete authoritative answers.

Use api.ts documentation.props or documentation.parts for descriptions, categories, and defaults on real extracted props. These fields cannot replace a signature, and unknown names are errors. Legacy props/refine overrides remain for compatibility and extraction exceptions; do not use them to invent an API that the implementation does not export.

Basic metadata examples are explicitly public source. Never put premium/private source in metadata.examples. Existing Workshop refs keep their original content and entitlement policy; new public example refs are available through the same catalog, MCP lookup, and public resolver.

MCP API answers include the behavioral contract and component-package provenance. Components without contracts expose existing usage guidance. Focused queries retain the root contract and selected part contracts. A mixed valid/invalid selector request returns the valid API with warnings; an entirely invalid selection returns available names.

The generated package version comes from packages/@ui, not the registry version. Imports and named compound exports are checked against actual package subpaths and source exports. The provenance hash identifies source and extraction inputs, not a signed release or proof of runtime compatibility. Rebuild downstream packages after changing registry source; do not manually patch dist or generated output.

The setup stylesheet order is owned by src/setup-contract.ts and consumed by the CLI and installation guide. Framework scaffolds use component subpaths and named Card parts so they do not depend on compound static properties surviving a React Server Component boundary.

Large MCP API/full responses are paginated by whole entries, never cut mid-type. Follow nextSteps with the same selectors until all pages have been read. Required root/accessibility props repeat. Example listings support continuation pages too. Common inherited DOM/ARIA props are listed compactly; explicit component-owned props are retained.

Card and Skeleton subpaths have server-side compound adapters. Other compound components still require a client boundary or documented named parts. Select keeps open as legacy initial visibility; prefer defaultOpen for initial state and state.open with onOpenChange for controlled state.

The CLI typography template is generated from the same component stylesheet as the website. Linked-package advisories in status identify outside-root Next/Turbopack and React resolution requirements without rewriting consumer configuration.

Remaining work includes broader component contract coverage, application-specific icon inventory discovery, specialized missing primitives, and dedicated browser/ShadowRoot integration coverage. Preserve existing API spellings until a deliberate compatibility migration is provided.

Component distribution builds run the production-only type-check:build gate before emitting declarations or CSS. The broader type-check command still includes tests; test typing failures are not suppressed by the distribution configuration.
