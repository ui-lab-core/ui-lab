# Source: /home/kyza/.hidden/studio/.documents/friction.md

## Menu — 2026-07-27
- **Hit:** Menu items with JSX children share a fallback string key, causing all matching rows to highlight together.
- **Workaround:** Set a unique `textValue` on each JSX-based menu item.
- **Suggested fix:** Require or derive stable item keys when children are non-text.

## Menu toggle controls — 2026-08-09
- **Hit:** A Switch nested in MenuItem can consume pointer activation before MenuItem's onSelect runs.
- **Workaround:** Use MenuCheckboxItem and render the nested Switch as pointer-inert display only.
- **Suggested fix:** Document the supported menu-row toggle composition pattern.

## Vitest component imports — 2026-08-10
- **Hit:** Importing UI Lab wrappers in a happy-dom interaction test failed because the package's component CSS was externalized as an unsupported Node import.
- **Workaround:** Mocked the unrelated UI wrappers while keeping the component and dnd-kit event path real.
- **Suggested fix:** Document a Vitest CSS configuration or provide a test-safe package entry point.

## ToggleGroup / segmented control — 2026-08-11
- **Hit:** No toggle-group or segmented-control primitive in `ui-lab-components` (only `Tabs`, which implies panels); needed a two-option mode switcher with radio semantics.
- **Workaround:** Used `@radix-ui/react-toggle-group` directly (already a dependency) and styled it with theme tokens.
- **Suggested fix:** Ship a `ToggleGroup`/`SegmentedControl` with single/multiple modes, or document Tabs as the sanctioned segmented control.

## Switch prop surface — 2026-08-11
- **Hit:** Two mutually incompatible prop styles for the same `Switch` — `checked` / `onCheckedChange` in `generation-panel.tsx`, `isSelected` / `onChange` / `isDisabled` in `agent-settings-panel.tsx` — with nothing indicating which is canonical.
- **Workaround:** Grepped both call sites and copied the react-aria-style form (`isSelected` / `onChange` / `isDisabled`), confirming it with `pnpm check-types`.
- **Suggested fix:** Document the canonical controlled-Switch props and deprecate the other spelling.

## Frame / drop surface — 2026-08-15
- **Hit:** The packaged UI Lab components did not expose a Frame primitive or a documented file-drop surface.
- **Workaround:** Added a local stroked Frame wrapper backed by the existing UI Lab Card, with a native explorer input and clipboard hint.
- **Suggested fix:** Provide a documented Frame/dropzone primitive with explorer and paste affordances.

## Select.Trigger sizing — 2026-08-21
- **Hit:** `Select.Trigger` accepts no `size` prop; a compact trigger for a toolbar chip was only possible after reading `dist/src/components/Select/Select.Trigger.d.ts`, which shows `variant?: "ghost"` as the sole visual knob.
- **Workaround:** `variant="ghost"` plus a `className` height/padding override.
- **Suggested fix:** Give Select.Trigger the same `size` scale as Button/Input, or document the ghost + className recipe.
## Comparison progress components — 2026-08-28
- Hit: List, Progress, Card, Flex, and Button returned no field-tested examples from the registry.
- Workaround: Used the authoritative API and usage responses with the existing zStudio composition patterns.
- Suggested fix: Add compact async-list and progressive-media examples.

## Gallery focus state — 2026-08-31
- Hit: Gallery.Item clears the native focus outline but the active theme provides no visible replacement.
- Workaround: Styled the component's documented `data-focus-visible` state with an accent outline.
- Suggested fix: Ship a tokenized focus-visible outline in the Gallery.Item default or theme styles.

## Popover / List — inline autocomplete — 2026-09-24
- Hit: No UI Lab primitive for a caret-driven completion list anchored to an input; Popover opens from a click trigger and List moves DOM focus, so focus can't stay in the input.
- Workaround: Portaled fixed-position div with List items set focusable={false}, highlight driven by the input's keydown.
- Suggested fix: An Autocomplete/Combobox (or an anchor-ref, non-trigger Popover) with virtual-focus List support.

## Grid responsive breakpoints — 2026-10-02
- Hit: Grid ResponsiveValue doesn't give the container widths for sm/md, so viewport sm:grid-cols-2 has no clear equivalent.
- Workaround: Used columns={{ sm: 1, md: 2 }}.
- Suggested fix: Document the Grid container-query breakpoint widths.

## Scroll — 2026-10-05
- Hit: inline vertical Scroll padded only the inline end; the content clips horizontally, so focus rings on children flush with the start edge lost their left side.
- Workaround: added padding-inline-start (--scroll-gutter-inline-start, default 2px) to inline vertical content in Scroll.module.css.

## Menu (CheckboxItem in pop-over) — 2026-10-05
- Hit: Docs say onCheckedChange runs "before the Menu closes", so it's unclear if CheckboxItem keeps the panel open; only selectionMode="multiple" documents staying open, and it can't be mixed with a RadioGroup section.
- Workaround: Used CheckboxItem as-is and accepted possible close-on-toggle.
- Suggested fix: Add a closeOnSelect prop to CheckboxItem/RadioItem and state the default.

## Input ref typing — 2026-10-08
- Hit: Passing a `React.Ref<HTMLInputElement>` to `Input` fails type-checking because the package resolves a different `@types/react` copy.
- Workaround: Dropped the ref and used `autoFocus`.
- Suggested fix: Declare `@types/react` as a peer type dependency.

## Select root alignment — 2026-10-09
- Hit: Select defaults to width:max-content and align-self:center, unexpectedly centering controls in stacked form fields.
- Workaround: Set className="w-full self-stretch" on Select in AccountSettingsModal.
- Suggested fix: Remove default align-self:center, add explicit full-width sizing, document stacked-field and toolbar recipes, and cover both in layout regression tests.


## Expand padding — 2026-10-10
- Hit: Existing --expand-trigger-padding-* overrides are ignored; installed CSS uses --slot-trigger-padding-* on title/icon, discovered in package source.
- Workaround: Style trigger/title/icon explicitly.
- Suggested fix: Document the trigger padding variables.

## List.Media sizing — 2026-10-10
- Hit: List.Media fixes its box at 32px; larger child previews overflow without increasing row height. This default was only apparent from source.
- Workaround: Resize and clip the media slot through List.Item styles.media.
- Suggested fix: Document the default media dimensions and show a larger-thumbnail example.

## Menu.Trigger (context-menu, as="child") — 2026-10-23
- **Hit:** The trigger forces an inline-flex display class onto the child row, and a Tailwind `flex`/`block` class can't override it, so a grip/content/actions row stacked vertically.
- **Workaround:** Set `display: "flex"` as an inline style on the child.
- **Suggested fix:** Don't apply display classes when `as="child"`, or expose a styles slot for the trigger.

## File drop zone — 2026-10-23
- Hit: UI Lab has no file drop or upload component; a search for "file upload dropzone" only returns Icon.
- Workaround: Specced a custom `json-drop-zone.tsx` around a Button.
- Suggested fix: Add a FileDrop component with a built-in keyboard button.

## Code — 2026-10-23
- Hit: the Code API lists no `children` or `code` prop, the component has no examples, and nothing in the repo uses it, so there's no documented way to pass it the code to show.
- Workaround: kept a tokenized `<pre>` plus a separate "Copy command" Button for the manual install command.
- Suggested fix: document the content prop and add at least one example.

## Select.Item row actions — 2026-10-24
- Hit: Select.Item renders a List.Item and forwards extra props, so List.Item's `actions` (List.Actions) works at runtime, but SelectItemProps doesn't declare `actions`; found only by reading the bundled source.
- Workaround: spread `({ actions }) as object` onto Select.Item in workflow-mode-select.tsx.
- Suggested fix: Add `actions?: ListActionDef[]` to SelectItemProps and document how row actions interact with selection and keyboard focus.
- Hit (follow-up): with `actions`, List.Item switches to a column grid with an inline gridTemplateColumns that splits Select.Item's icon/content/indicator into equal columns, and Select.Item overwrites `style`, so the text was squeezed into the middle third.
- Workaround: `grid-cols-[auto_minmax(0,1fr)_auto_auto]!` className on the Select.Item.

## Resource installation rows — 2026-10-25
- Hit: No resource/download manager composition was found in the workshop searches.
- Workaround: Composed individual resource rows with Flex, Expand, and the progress-metric pattern.
- Suggested fix: Add a resource-install pattern with source discovery, file preview, progress, cancellation, and retry states.

# Source: /home/kyza/Projects/kyza.dev/.documents/friction.md

## Frame source/version API — 2026-07-30
- **Hit:** The referenced workspace source uses CSS custom properties, while the installed package exposes `fill`, `borderColor`, and `cornerRadius` props.
- **Workaround:** Used the installed declarations for styling and the source implementation to design the extend-path geometry.
- **Suggested fix:** Keep the source examples and published package API documentation version-aligned.

## search_guides — 2026-10-25
- Hit: No "quick fix" / anti-slop checklist guide; query "quick fix" returned only the theme-switching guide.
- Workaround: Used guide:foundation validation list instead.
- Suggested fix: Add a short anti-slop quick-fix guide or alias "quick fix" to foundation.

## Carousel / Gallery — 2026-10-25
- Hit: element:extras/carousel returns a stub ("Carousel placeholder"); no carousel/lightbox with a main view and thumbnails exists. Gallery.View docs don't say how to fill it with an image (positioning context unclear).
- Workaround: Built the stage and thumbnail strip from Gallery/Gallery.Item(selected,onPress)/Gallery.View with next/image fill and `relative` on the view.
- Suggested fix: Ship a real carousel element and add a Gallery.View image-fill example.

# Source: /home/kyza/Projects/ui-lab/private/.documents/friction.md

## Anchor / Panel — 2026-08-25
- Hit: Anchor always renders a persistent underline indicator and only accepts variant solid|dashed|dotted, so it cannot be used cleanly for nav pills or a logo lockup; Panel.Sidebar collapse fully hides content (aria-hidden) rather than leaving an icon rail.
- Workaround: used plain <a> for the logo and unstyled Anchor for text links only; relied on Panel collapsedSize=0 hide-to-toggle instead of an icon rail.
- Suggested fix: add an Anchor variant with no underline (or a nav/plain mode), and a Panel.Sidebar rail mode that keeps icons visible when collapsed.

## Form / registry documentation — 2026-10-10
- Hit: Quickfix requires a Form replacement, but component:form returns unrelated matches; Select and Label example listings are empty.
- Workaround: Kept native form submission and adapted the select-row pattern plus Button pending-action example.
- Suggested fix: Document Form availability accurately and populate control example listings.

## Tabs / entry closing — 2026-10-10
- Hit: Tabs exposes icon slots but no documented accessible close action; a close control inside a trigger nests interactive elements.
- Workaround: Positioned a UI Lab Button beside each Tabs.Trigger in a Flex wrapper.
- Suggested fix: Provide a documented closable-tab composition or close-action slot.

## Select / unlabeled checkbox spacing — 2026-10-10
- Hit: Multi-select rows embed an unlabeled Checkbox, but Checkbox retains two grid columns and gap-x-3, adding empty space before the option label.
- Workaround: Identified the library source; kept sidebar sizing content-based without masking the checkbox issue locally.
- Suggested fix: Collapse Checkbox to one column with no column gap when it has neither label nor helper text.

## Chart — 2026-10-11
- Hit: MCP api/full for Chart lists no sizing info; the root's fixed `width: 100%; height: 15rem` was only discoverable from dist/chart.css.
- Workaround: Read the compiled CSS to explain why charts were squeezed by a capped preview stage.
- Suggested fix: Document Chart root sizing (fluid width, default height, how to override) in the component's API/styling notes.

## Tabs vertical layout — 2026-10-13
- Hit: Tabs.List is a CSS grid and Tabs root/list default to w-full, so `flex-col` classes in examples silently did nothing; only discoverable from Tabs.module.css.
- Workaround: Used `orientation="vertical"` and `w-fit` on the root instead of flex overrides.
- Suggested fix: Document the grid-based list, the w-full defaults, and that vertical layouts need the `orientation` prop.

## Tabs vertical indicator — 2026-10-13
- Hit: Vertical indicator spanned list width minus a 4px inset instead of the trigger rect, and vertical triggers stayed centered, so labels looked unpadded.
- Workaround: Sized the vertical indicator from the trigger like horizontal and left-aligned vertical triggers in Tabs.module.css.

## List selectable-row styling — 2026-10-13
- Hit: Interactive/selected rows get no visible border, hover, or selected styling.
- Workaround: Set border/hover/aria-selected classes on List.Item.

## Component prop defaults — 2026-10-13
- Hit: Prop defaults (Banner variant, Divider orientation, Menu offset=6, Tooltip delay) are only discoverable from source; Switch examples mix `isSelected`/`defaultSelected` and `state={{ checked }}`.
- Workaround: Grepped @ui sources and always emitted props whose default was unclear.
- Suggested fix: Document each prop's default in the component metadata/MCP output.

## Motion primitives for agent UI — 2026-10-26
- Hit: no shimmer text, blinking caret, or staggered-dot keyframes in the library; Tailwind arbitrary animations need keyframes that copyable elements cannot assume.
- Workaround: each element inlines its keyframes via React 19 `<style href="agents-*" precedence="default">`, kept byte-identical across files so dedupe is safe.
- Suggested fix: ship `animate-shimmer`/`animate-caret`/`animate-dot` theme keyframes (with reduced-motion fallbacks) in the base CSS.

## Expand / inline disclosure — 2026-10-26
- Hit: Expand's trigger is full-width with a theme background and right-aligned chevron; an inline "Thought for 24s ›" needed overrides on trigger, title, and icon slots.
- Workaround: styles={{ trigger: 'w-auto bg-transparent hover:bg-transparent', title: 'py-1 pl-0', icon: 'py-1 pl-1' }}.
- Suggested fix: an `inline` (or `variant="ghost"`) Expand layout.

## Code / diffs and Menu.Item icons — 2026-10-26
- Hit: Code has no diff mode (line numbers, +/− tones, split view); Menu.Item has no icon slot so leading icons need a wrapper span for spacing.
- Workaround: hand-built a <table> diff with sr-only "Added/Removed" text; wrapped menu icons in `flex items-center gap-2.5`.
- Suggested fix: `Code` diff support (`diff` language or `lines` prop) and an `icon` prop on Menu.Item.

## Icon — 2026-10-29
- Hit: No discoverable list of Lumen icon ids (e.g. copy, check) via MCP; had to ls packages/library/content/icons/lumen/duo-tone and check layout.tsx default-variant
- Workaround: Read the SVG filenames directly
- Suggested fix: Expose icon ids/search in the UI Lab MCP get_component Icon response

# Source: /home/kyza/Projects/ui-lab/private/apps/workshop/.documents/friction.md

## Command documentation — 2026-10-10
- Hit: MCP API names CommandPalette while examples import Command; empty-state composition requires an undocumented useCommandContext hook.
- Workaround: Used the existing Command export and read Command.Items.tsx to render empty results correctly.
- Suggested fix: Align the API import and document the filteredItems empty-state pattern.

## Command + List integration — 2026-10-10
- Hit: Command search navigation needs action registration, but MCP does not document integrating List.Item with its action registry.
- Workaround: Registered visible actions through the existing context actionRef; List handles row focus and selection.
- Suggested fix: Provide a documented Command.Root + List composition or public action-registration adapter.

## Command showcase backdrop — 2026-10-10
- Hit: Command maps overlay styles to a literal overlay.root key, but its resolver traverses nested keys, so styles.overlay is ignored.
- Workaround: Apply scoped important utilities on the showcase container targeting its direct data-slot=overlay child.
- Suggested fix: Align Command style mapping with the resolver’s nested-key contract.

# Source: /home/kyza/Projects/ui-lab/.documents/friction.md

## library component structure — 2026-08-05
- **Hit:** The `interactive/` contract (folder with both `index.tsx` + `metadata.json` collapses into one element; `title` wins over `displayName`; `controls`/`previewLayout`/`resizable`/`previewHeight` live only there) is documented nowhere — only readable from `scripts/generate-registry.mjs`.
- **Hit:** In-source `export const metadata` in examples is silently ignored by the generator, so `premium-gate/02` shipped as `free` despite declaring `access: 'premium'`.
- **Workaround:** Read the generator directly; moved fixture access into a component-level `metadata.json`.
- **Suggested fix:** Document the interactive-folder schema in the normalization reference, and have the generator warn on an unused in-source `metadata` export.

## Frame — 2026-08-11
- **Hit:** Frame's main styling knobs — `--fill`, `--stroke-color`, `--frame-radius`, `--frame-stroke-width` — are undocumented in `FrameProps`/JSDoc; only the last two appear in `Frame.module.css` and `--fill`/`--stroke-color` are discoverable solely by reading the SVG `fill`/`stroke` fallbacks in `Frame.tsx`.
- **Workaround:** Read `Frame.tsx` + `Frame.module.css` to recover the custom-property contract before writing examples.
- **Suggested fix:** Document the four custom properties (with defaults) in the `FrameProps` JSDoc or a `@cssprop` block so consumers don't have to read source.

## Frame path geometry — 2026-08-11
- **Hit:** `path`'s authoring contract (endpoints at `0 0`/`pathWidth 0`, bulge direction, how `side`/`shapeMode` transform it) was undocumented, and the presets were each hand-fitted to one side+mode — so Tail/Tab silently rendered nothing under `indent`.
- **Hit:** The only way to drive SVG geometry from `--frame-stroke-width` is CSS geometry properties (`x`/`y`/`width`/`height` via `style`), since transform/path attributes can't take `var()`; that's load-bearing but nowhere stated.
- **Workaround:** Derived the convention from the mask/rotate math, then made the component mirror and orient one canonical path; documented both in `FrameProps` JSDoc.
- **Suggested fix:** Keep an authoring note (with a sample path) alongside the `path` prop so callers don't reverse-engineer the transform chain.

## workshop preview / @ui-lab-core/library — 2026-08-05
- **Hit:** Editing private/packages/library/src previews (e.g. card/interactive) has no effect in the workshop app; it resolves @ui-lab-core/library to built dist via the "import" export condition, so source edits are invisible until rebuilt. Cost two "paper" fixes that never ran.
- **Workaround:** Rebuild with `pnpm --filter @ui-lab-core/library build` (or build:watch) to regenerate dist.
- **Suggested fix:** Make workshop dev resolve the "development" export condition (src) so preview edits hot-reload, or document the rebuild requirement near the preview registry.

## Tailwind named max-w-* / theme spacing — 2026-08-11
- **Hit:** `max-w-md` / `max-w-sm` collapse to ~19px/~11px in previews. `app/apps/www/src/app/globals.css` redefines `--spacing-md`/`--spacing-sm` as small clamps, which Tailwind v4 resolves ahead of the `--container-*` scale, so blocks fall back to min-content (one word per line).
- **Workaround:** dropped named `max-w-*` from the Mask examples and let copy fill the preview width with `text-pretty`.
- **Suggested fix:** either don't override `--spacing-<name>` keys that collide with the container scale, or document that only numeric/arbitrary max-widths are safe. ~55 other `max-w-md`/`max-w-sm` call sites are likely affected too.

## Mask — 2026-08-11
- **Hit:** `<Mask.Fade />` (scroll-fade preset) silently no-ops unless `--mask-top-fade`/`--mask-bottom-fade` are already in the root `style` prop — setting them later via ref does nothing. Nothing in the prop docs says so.
- **Workaround:** always seed both variables in `style`, then rewrite values via ref (what `Scroll.tsx` does).
- **Suggested fix:** document the two custom properties on `Mask.Fade`, or detect the preset from the absence of `direction` alone.

## Button — 2026-08-26
- **Hit:** No documented list of valid `Button` `variant` values; the demo registry only enumerates primary/secondary/ghost/danger, and trailing icons require the non-obvious `icon={{ right }}` slot object.
- **Workaround:** grepped the registry controls and Button source to confirm the safe variant set and the icon-slot shape.
- **Suggested fix:** document the supported Button variants and the `icon` left/right slot form in the component reference.

## Page API documentation — 2026-08-28
- Hit: Page's width prop is the kebab-cased `max-width` (not `maxWidth`), and Page.Header/Page.Footer `divided` replaces a manual Divider; these layout contracts needed source inspection.
- Workaround: Read Page.tsx/page.types.ts before replacing hand-rolled page wrappers.
- Suggested fix: Document max-width, padding, gap, centered, and the divided header/footer slots in the Page reference.

## Mask.Fade intensity — 2026-08-31
- **Hit:** `intensity` has no documented unit; it resolves to `40 * intensity` px normally but `15 * intensity` %, capped at 50%, once `fixed` is set. Sizing a fade over a card row meant reading `generateFadeMask` in the source.
- **Workaround:** picked `intensity={4}`/`{5}` from the px formula after reading Mask.tsx.
- **Suggested fix:** state the px/% switch and the caps in the `intensity` and `fixed` prop docs.

## Tooltip — 2026-09-02
- Hit: No registry entry or doc example uses `Tooltip`; the trigger-as-children contract and the `content` / `hint` / `show-arrow` props are only discoverable from `Tooltip.tsx`.
- Workaround: read the component source to confirm `<Tooltip content=... hint=...>{trigger}</Tooltip>` before wrapping icon-only buttons.
- Suggested fix: add a Tooltip usage example (icon-only button with an accessible name) to the reference.

## Switch — 2026-09-02
- Hit: `Switch` exposes no children/label prop, so a visible label needs a sibling element plus `aria-labelledby`; the API response does not say which labeling pattern is expected.
- Workaround: rendered a `<span id>` beside it and pointed `aria-labelledby` at it.
- Suggested fix: document the canonical label pairing (or accept children) in the switch API notes.
## Select anatomy previews — 2026-09-04
- Hit: Floating content requires a positioned trigger and portals to document.body, complicating isolated part previews.
- Workaround: Keep invisible anchors and use iframe-local positioning overrides for the actual panels.
- Suggested fix: Provide a supported static presentation mode for documentation fixtures.

## Popover trigger layout — 2026-09-05
- Hit: Popover adds inline-block to its child trigger, overriding Button flex layout and dropping the trailing icon onto another line.
- Workaround: Set inline-flex explicitly through the Button root slot.
- Suggested fix: Preserve the display layout of composed trigger components.

## Gallery / registry generation — 2026-09-06
- Hit: `generate-registry-data.ts` serializes every component's enrichment into one shared generated-data.ts; regenerating for Gallery also rewrote several unrelated components (Flex, Grid, Radio, Button, Expand, Group, List, Menu, Select) whose source enrichment had drifted from the committed generated file, producing an 8500+ line diff.
- Workaround: Left generated-data.ts unregenerated and reported the exact command instead of committing the unrelated churn.
- Suggested fix: Support regenerating/diffing a single component's entry, or keep generated-data.ts continuously in sync so drift can't accumulate across components.

## Workshop element previews — 2026-09-20
- Hit: Workshop resolved previews by element id via `getElementPreview(pkg, elementId)`, but the preview registry is keyed by each variant's `demoPath`; catalog element ids (e.g. `toc`) differ from the packageRegistry group/placeholder ids the sidebar linked (`table-of-contents`), so real elements rendered "No preview configured." Only discoverable from source.
- Workaround: Made `getElementPreviews` resolve through `@ui-lab-core/library/catalog` (per-variant, via `demoPath`), and pointed the sidebar at catalog elements like www does; also stopped the low-fidelity gallery mock from overriding the real preview component.
- Suggested fix: Document that previews are keyed by variant `demoPath`, and expose one catalog-backed helper both apps share for element→previews resolution.

## UI Lab preflight / workspace CLI — 2026-09-21
- Hit: Preflight reported CLI NOT FOUND although the supplied local CLI entrypoint exists.
- Workaround: Used the session-provided CLI path to establish availability; no setup was needed.
- Suggested fix: Recognize an explicitly configured workspace CLI entrypoint.

## workshop conventions / gallery previews — 2026-10-03
- Hit: workshop.md pointed to app/apps/www/src/gallery/, but the previews had moved to private/packages/library/src/gallery/. It also made previews optional, so the new elements shipped without them.
- Workaround: Found the file through the gallery-previews export and fixed the doc.
- Suggested fix: Have a check that fails when a registry item has no preview key.

## Anchor wrapping block content — 2026-10-03
- Hit: Wrapping a Card in Anchor (a card-style link) still draws Anchor's underline, which shows as a stray line under the card.
- Workaround: none needed. Added variant="none" to Anchor, which skips the generated underline.
- Suggested fix: Document variant="none" for card-style links in Anchor's usage notes.

## Flex / Banner prop passthrough — 2026-10-03
- Hit: MCP api for Flex and Banner lists no rest-prop passthrough, so role, aria-labelledby and id could not be relied on.
- Workaround: wrapped the Flex in an unstyled div role="group"; dropped id/aria-controls on Banner.
- Suggested fix: document (and type) native attribute passthrough on layout and feedback components.

## Rating / kbd controls — 2026-10-03
- Hit: no Rating control and no Kbd component; Feedback stars were native buttons and the ⌘K hint a hand-styled kbd.
- Workaround: a single-select Group of icon-only Group.Buttons for stars; Badge for the ⌘K hint.
- Suggested fix: add a Rating (radio-group) component and a Kbd component.

## Page nesting — 2026-10-03
- Hit: Page.Body always renders <main> (found only in source; the MCP api lists no element), so a docs shell cannot nest a Page beside a sidebar without nesting <main>.
- Workaround: DocsPage template is a Flex row of the sidebar rail and a single Page with styles.root "min-w-0 flex-1".
- Suggested fix: document the rendered elements, and give Page.Body an `as` prop for nested layouts.

## Card examples / typography tokens — 2026-10-14
- Hit: Card examples inline long font-var style objects for body/meta text; no Text component or utility class.
- Workaround: Copied the style objects from 01-notification into each variant.
- Suggested fix: Ship text-body/text-meta utilities.

## Button surface — 2026-10-25
- Hit: No documented way to paint a custom fill (e.g. progress) behind Button content; the `--background-image` surface variable is only discoverable in Button.module.css.
- Workaround: set `--background-image` to a hard-stop linear-gradient via the style prop.
- Suggested fix: document `--background-image` as a public surface hook in the Button reference.

## Confirm icon-only labels — 2026-10-25
- Hit: Confirm's labels.trigger/cancel accept nodes but there's no way to pass aria-label to the inner Buttons; that a `sr-only` child names an icon-only Button is only discoverable in Button.tsx.
- Workaround: passed `<><FaTrash /><span className="sr-only">Revoke token</span></>` as the label.
- Suggested fix: document the sr-only pattern, or accept aria-labels in Confirm labels.

## List highlighted row — 2026-10-26
- Hit: List `highlighted` only scrolls into view; active-row styling needs `data-highlighted` on List.Item, found only in List.Item.tsx.
- Workaround: Passed `data-highlighted` per item and styled `data-[highlighted=true]`.
- Suggested fix: Have List mark the item matching `highlighted`.

## Icon / Input — 2026-10-26
- Hit: No MCP way to look up Lumen icon ids; the www ui-lab-icons fill set does not render here, the real set is private/packages/library/content/icons/lumen/duo-tone (short ids like plus, up, mic). Rounding the Input root with className (rounded-2xl) leaves the focus surface on the default radius, so the field looks wrapped twice.
- Workaround: Picked ids from the duo-tone folder; dropped the radius override on Input.
- Suggested fix: Expose icon search in MCP; make the Input focus indicator follow the root radius.

## Button (toggle/pressed state) — 2026-10-29
- Hit: Button API has no pressed/toggle guidance and doesn't point to Group's value/onChange toggle mode for segmented controls
- Workaround: hand-rolled aria-pressed Buttons first, then switched to Group value + Group.Button once pointed to it
- Suggested fix: cross-link Group toggle mode from Button usage docs for segmented/toggle cases

# Source: /home/kyza/Projects/ui-lab/admin/.documents/friction.md


## Banner compound sub-components in RSC — 2026-09-02
- Hit: Banner.Body is undefined when accessed through a client-reference proxy in a React Server Component.
- Workaround: Rendered Banner with plain children instead of accessing its compound body part.
- Suggested fix: Provide a server-compatible compound entry or named part exports and document the supported RSC composition.

## Table style slots — 2026-09-02
- Hit: published `ui-lab-components@0.4.3` and the local `app/packages/@ui` (also 0.4.3) disagree on `TableStylesProp` — the published build has flat `headerCell`/`emptyRow`/`emptyState`, the local one nests them under `header`/`empty`. Same version, different API, so switching to the link broke type-check.
- Workaround: moved to the nested shape (`header: { cell: ... }`).
- Suggested fix: bump the version on API changes, so a link swap doesn't silently change the contract.

# Source: /home/kyza/Projects/ui-lab/app/.documents/friction.md

## Select MCP examples — 2026-09-05
- Hit: MCP returns no Select examples, and the lab workflow names search tools that are no longer exposed.
- Workaround: Used get_component for discovery and compound APIs; read SearchableTrigger source for input behavior.
- Suggested fix: Publish a combobox example and update the lab workflow to the current MCP tool names.

## Menu/useFloatAnimation — 2026-08-07
- **Hit:** Entrance animation silently skipped when a Menu opens inside a List.Item actions row; exit still animates. Root cause: `useFloatAnimation` enter-path sets `isAnimating(true)` in the same commit as first content paint, so no opacity-0 frame renders when a parent re-renders (List focus events) around open. Exit path already deferred via rAF.
- **Workaround:** Reworked the enter effect to a two-step rAF (`setIsAnimating(false)` then defer `true`), mirroring the exit path; drove `pointer-events` off `open` instead of `isAnimating` so the deferred frame stays clickable.
- **Suggested fix:** Make both enter and exit share one robust two-step helper.

## apps/www component reproduction — 2026-08-11
- **Hit:** The real-browser reproduction consumed `packages/@ui/dist`, so source CSS edits appeared absent until the package was rebuilt.
- **Workaround:** Rebuilt `ui-lab-components` before every conclusive browser measurement.
- **Suggested fix:** Document the rebuild requirement or alias development imports to package source.

## Command height / Scroll / Frame — 2026-08-12
- **Hit:** `--height` on the palette was dead because `Command.List` hard-coded `maxHeight="44dvh"` on Scroll, which Scroll propagates via `max-height: inherit` down Mask/content. Also, Frame's undocumented inner wrapper div breaks any flex height chain through it.
- **Workaround:** Dropped the list's default cap so it fills the surface, and added `.inner > div { flex: 1 1 auto; min-height: 0 }` to make Frame's wrapper shrink.
- **Suggested fix:** Give Frame's content wrapper a real class (or `display: contents` when unstyled), and document that Scroll's `maxHeight` overrides any ancestor-driven sizing.

## Command origin — 2026-08-12
- **Hit:** `--origin: 20% 90%` (background-position-style pair) silently killed palette positioning: the module only reads `--origin` as a lone vertical value, so the pair made `top`, `translate` and `transform-origin` invalid at computed-value time and the palette fell to the overlay corner.
- **Workaround:** Removed the `--origin` fallback and switched the mechanism/theme to per-axis `--origin-x` / `--origin-y`; a multi-value custom property cannot be split back into single-value properties in CSS.
- **Suggested fix:** Document the palette's CSS variables in the registry metadata, and register the origin vars with `@property` so a malformed value falls back instead of collapsing layout.

## Popover sizing — 2026-08-12
- **Hit:** Popover width slots only accept class values, so a client-navigation CSS race let max-content tags expand a filter panel to the viewport until refresh.
- **Workaround:** Put a deterministic inline width on the panel's inner content shell.
- **Suggested fix:** Support inline style objects in Popover slots through `createStylePropsResolver`.

## Frame corner cut-out — 2026-08-12
- **Hit:** Wanted a "Premium" notch cut into a card's top-right corner, but Frame's `path`/`shapeMode` shapes are placed centred on a single edge (SIDE_PLACEMENT x/y are hard 50%/0/100%), so corner or offset placement is impossible. Frame also clips its children to the silhouette, so cut-out content must be a sibling, not a child.
- **Workaround:** Used Frame only for the violet border overlay (fill left transparent) and layered the "Premium" ribbon + corner glow as pointer-events-none siblings.
- **Suggested fix:** Add an offset/anchor prop (e.g. shape position along the edge, or corner placement) so notches can sit off-centre.

## Gallery.Item + Frame outline — 2026-08-12
- **Hit:** Implemented the corner anchor above (`shapeAlign`), but a Frame can only own a Gallery.Item's outline by hand-neutralising the item: transparent `background`/`borderColor` plus `overflow-visible`, or the item's rectangle squares off the shape and clips the stroke. Frame's inner content wrapper is also not a flex container and has no styles slot, so card contents need an extra wrapper div.
- **Workaround:** Inline style overrides on Gallery.Item, and a `relative flex h-full flex-col` wrapper inside the Frame.
- **Suggested fix:** A `surface={false}` (or similar) on Gallery.Item that drops its own fill/border/clip, and a `content` styles slot on Frame.

## Catalog pricing — free sentinel — 2026-08-12
- **Hit:** `PricingInfo` encodes "free" as `price: null` rather than omitting the block, and there is no shared predicate — every consumer re-derives it. A grid check of `pricing != null` marked all four free starters (nextjs-basic, vite-react, tauri-desktop, astro-static) as Premium.
- **Workaround:** Matched the convention already used in the starter detail page and ContentHeader: `pricing?.price != null`.
- **Suggested fix:** Export an `isPaid(content)` helper from the registry (or drop the block entirely for free content) so the sentinel is decided in one place.

## Frame stroke vs children — 2026-08-12
- **Hit:** Frame paints its SVG at z-0 under the content wrapper, so with `strokeAlign="center"`/`"inside"` any child that reaches the edge paints over the stroke's inner half. A card read as having a 1px border beside its preview (opaque bg) and a 2px one beside its body (transparent) — same stroke, different neighbour.
- **Workaround:** `strokeAlign="outside"` plus a transparent border on the parent sized to the stroke, so the stroke has a ring to sit in and children never reach it.
- **Suggested fix:** Draw the stroke layer above the content wrapper (fill can stay below), or document that non-outside alignments are only safe when children do not paint to the edge.

## Frame outline seam — 2026-08-12
- **Hit:** Frame painted its border and its shape's outline as two separate strokes straight onto the canvas, so a translucent `--stroke-color` composited ~17% brighter at every join (measured: chroma 138 vs a 118 plateau), and a shape that swallowed a corner left a ~20%-coverage hairline of border standing above it where the region's cut landed exactly on the border's antialiased outer edge.
- **Workaround:** Collected both strokes into one mask and coloured it once so overlap is idempotent; ran the outline past its endpoints with tangent-oriented markers; moved the outline layer above the content wrapper.
- **Suggested fix:** Landed in Frame — but the private library's examples are unreachable without an entitlement, so verifying them needed a throwaway route in apps/www.

## Library example previews — 2026-08-12
- **Hit:** Arbitrary Tailwind classes in private-library examples (`bg-[linear-gradient(...)]`) never compile — the library's source is outside the site's content scan — and `--accent-700`..`--accent-1000` are unset, so a gradient naming one silently drops the whole declaration.
- **Workaround:** Moved gradients into inline `style` and kept to the 50–600 accent steps.
- **Suggested fix:** Document the usable token range, or add the library's `src` to the site's Tailwind sources.

## Frame examples not in MCP — 2026-08-13
- **Hit:** Needed the `frame/corner-step` hover-morph reference, but `get_component id:"frame/corner-step"` 404s and `get_component detail:"examples"` returns an empty array despite the example existing.
- **Workaround:** Read the source directly from `private/packages/library/src/components/frame/corner-step.tsx`.
- **Suggested fix:** Surface Frame's examples (incl. the animated corner-step) through the MCP example listing.

## Preview width contracts — 2026-08-13
- **Hit:** Private patterns correctly used `max-w-md`/`max-w-lg`, but app spacing tokens with the same suffixes lived in `@theme`, making Tailwind compile those max-width utilities to 20–31px spacing values instead of container widths.
- **Workaround:** Kept semantic spacing and typography tokens in `:root`; updated config exports so only intentionally utility-generating radius and border scales remain in `@theme`.
- **Suggested fix:** Document that semantic token names placed in `@theme` participate in Tailwind utility namespaces and can replace unrelated-looking defaults.

## Focus indicator transitions — 2026-08-14
- **Hit:** A persistent shared transition also morphed the indicator from its hidden 0px radius whenever focus first landed.
- **Workaround:** Gate the themed border-radius transition to updates on the same active surface; initial focus and target changes snap to shape.
- **Suggested fix:** Document the ring motion variables alongside the existing ring color, width, shadow, and z-index tokens.

## Grid masonry — 2026-08-14
- **Hit:** Masonry configuration and its browser fallback were only discoverable from Grid source, not the public usage surface.
- **Workaround:** Used explicit `rows="masonry"` grids with responsive column definitions for each preview section.
- **Suggested fix:** Add a masonry example covering mixed 3-column and 2-column layouts.

## Grid responsive sizing — 2026-08-14
- **Hit:** Responsive props insert a container-query wrapper, so `h` sized the wrapper while the inner grid remained content-height; `rows` also could not express a fractional track.
- **Workaround:** Propagated explicit Grid height to its inner root and allowed arbitrary CSS row templates such as `minmax(0, 1fr)`.
- **Suggested fix:** Document that responsive Grid rendering uses a wrapper and include a fixed-height equal-row example.

## Label layout — 2026-08-14
- **Hit:** Label always applies `w-full`, overriding its root style slot in flex layouts and causing a fixed-width label to overflow its container.
- **Workaround:** Used a native text element for the compact inline control label.
- **Suggested fix:** Remove the unconditional width, or expose a width opt-out for inline labels.
## Panel registry documentation — 2026-08-15
- **Hit:** The registry overview references Panel.Group, Panel.Header, Panel.Content, and Panel.Footer, but the exported API only provides Panel.Sidebar, Panel.Toggle, and Panel.Resize.
- **Workaround:** Used Panel directly as the split group after confirming the implementation and types.
- **Suggested fix:** Update the overview and examples to match the exported compound API.

## Table / Tabs — 2026-08-16
- Hit: `Column.cell` render functions make `Table` unusable from a Server Component (function props cross the RSC boundary), and `Tabs orientation="vertical"` layout (row flex, fit-content list, no gap) is only discoverable from Tabs.module.css.
- Workaround: marked otherwise-static landing sections `"use client"`; added a `gap-*` className on the Tabs root.
- Suggested fix: document the client-only constraint on `Column.cell`, and ship a default gap for vertical Tabs.

## Tabs.Trigger DOM props — 2026-08-17
- Hit: Tabs.Trigger destructures a closed prop set with no `...rest`, so `onMouseEnter`/`onFocus` (used for hover-preloading tab content) are silently dropped and never reach the button. No error, no type error — only discoverable by reading the source.
- Workaround: extended TabsTriggerProps with ButtonHTMLAttributes and merged `rest` into the react-aria `mergeProps` chain.
- Suggested fix: all interactive primitives should extend their host element's HTML attributes and forward rest props.

## Table grouped/expandable rows — 2026-08-18
- Hit: `Table` ships no expandable-row or row-group API (the docs app hand-rolls its own `Table` wrapper for this), and `.table { min-width: max-content }` in Table.module.css forces a horizontal scroller unless you override it — neither is documented.
- Workaround: composed `Table.Header`/`Body`/`Row`/`Cell` by hand with `colSpan` group rows driving an `Expand`, and passed `styles={{ table: "w-full min-w-0 table-fixed" }}` to defeat the max-content min-width.
- Suggested fix: expose an `expandRender`/row-group API on `Table`, and make the max-content min-width opt-in.

## foreground-500 is not a token — 2026-08-18
- Hit: `text-foreground-500` appears throughout the docs app but the foreground ramp stops at 400 in theme.css, so the class silently resolves to nothing.
- Workaround: used `foreground-400` for muted body copy and `background-500` for metadata.
- Suggested fix: either add `foreground-500`/`600` to the ramp or lint for colour classes with no matching token.

## Region-scoped theming — 2026-08-18
- Hit: Setting `--background-*` / `--accent-*` on a wrapper does not re-theme Tailwind utilities inside it; `--color-*` aliases are declared on `:root` in theme.css, so they resolve there and children inherit the already-substituted value.
- Workaround: Emitted both `--x` and `--color-x` for every generated palette variable on the scoped wrapper.
- Suggested fix: Document a supported "scoped theme" entry point (or declare the aliases on `*` so overrides cascade).

## Scroll scrollMode="programmatic" — 2026-08-19
- Hit: "programmatic" only changes overflow; it still fires onScroll per assignment, so updateScrollbar() runs setThumbPosition/setIsScrolling every frame and rewrites --mask-*-fade on the Mask, re-rendering Scroll+Mask for a thumb that is opacity 0 in this mode. None of that is documented — only discoverable from Scroll.tsx.
- Workaround: dropped Scroll from the showcase entirely and composed Mask + a translated content div, so the mask sits on a static window and progress is a composited transform.
- Suggested fix: short-circuit handleScroll's scrollbar work when scrollMode === "programmatic" (the thumb is hardcoded to opacity 0 there anyway), and document that a fade-y Scroll puts a mask above the scroller, which disables composited scrolling.

## Select / Menu floating position tracking — 2026-08-19
- Hit: Select and Menu portal their floating panel and hide it with `display: none` instead of unmounting, so `useFloating`'s `whileElementsMounted: autoUpdate` stayed subscribed forever — 28 permanent window scroll listeners on the landing page, each running `computePosition`/`getBoundingClientRect` per scroll event. Profiling showed 1043ms of the 1707ms renderer main-thread time during a 2.3s scroll, p90 frame 20.8ms. Only discoverable from source plus a trace.
- Workaround: gated the `whileElementsMounted` subscription on `open !== false` in `useFloating`, and passed `open` from Select.Content/Select.Sub/Menu.Content/Menu.Submenu. p90 dropped to 7.0ms.
- Suggested fix: make `open` mandatory (or infer non-visibility) whenever `whileElementsMounted` is supplied, so this cannot regress silently.

## Lab CLI preflight — 2026-09-07
- Hit: Preflight reports the CLI missing when the repository's built CLI is available outside PATH.
- Workaround: Used the CLI location explicitly supplied in AGENTS.md to resolve availability.
- Suggested fix: Include the configured local CLI entrypoint in preflight detection.

## Toast callable API — 2026-09-07
- Hit: The callable toast helper's API types need dedicated MCP documentation, separate from the Toaster component API.
- Workaround: Read the toast definitions before composing previews.
- Suggested fix: Publish callable toast API types through MCP.

## Radio.Group API — 2026-09-10
- Hit: get_component radio (detail:api) returns only standalone Radio props; Radio.Group's value/state/onValueChange and its controlled-vs-uncontrolled semantics are absent.
- Workaround: Read Radio.tsx source to learn onValueChange and that true controlled usage needs state={{ value }} (a bare value prop is only the initial value).
- Suggested fix: Document Radio.Group (and other compound subcomponents) props via MCP, including controlled-state guidance.

## pattern:inline-alert-error — 2026-10-03
- Hit: pattern source is Skeleton placeholders, not real Banner.Title/Banner.Body usage; no auth/sign-in pattern or Form component in the registry.
- Workaround: composed Banner.Body + labeled-field-with-error by hand inside a native form.
- Suggested fix: ship real content in the error alert pattern and add a sign-in form pattern.

## TextArea — 2026-10-08
- Hit: No documented way to drop the field's own surface when embedded in a composer.
- Workaround: Stripped border/bg via styles.scroll and styles.field.
- Suggested fix: Add a borderless/embedded variant.

## Modal — 2026-10-27
- Hit: No documented way to make body content flush with modal edges; Modal.Body padding (px-3 py-1.5) only found in Modal.module.css.
- Workaround: Modal.Body className="p-0" and padded inner sections manually.
- Suggested fix: Document Modal.Body padding and add a flush/padding prop.

## Select split-group full-width panels — 2026-10-27
- Hit: In a Group.Button + Group.Select split button, Select.Content cannot be configured to match the full Group width; it anchors to the Select segment.
- Workaround: External width via styles.overlay was overwritten by Content's own max-content/min-width layout effect.
- Suggested fix: Provide an explicit full-group anchoring or panel-width option.

# Source: /home/kyza/Projects/ui-lab/app/packages/@mcp/.documents/friction.md

## Starter tools — 2026-08-13
- **Hit:** `get_starter` directs clients to a nonexistent `get_starters` tool; the advertised tool is `search_starters`.
- **Workaround:** Interpreted the reference as `search_starters` when reviewing the tool surface.
- **Suggested fix:** Update the `get_starter` description and `id` field description to name `search_starters`.

## MCP content ownership — 2026-08-13
- **Hit:** Foundational design and theme guidance is duplicated between MCP handlers, injected context, and registry guides, with stale cross-tool references and inferred metadata.
- **Workaround:** Traced each response field back to its source and treated registry/library content as canonical.
- **Suggested fix:** Centralize durable guidance in guides and keep the MCP as a thin retrieval layer.

## Guide schema — 2026-08-13
- **Hit:** `GuideMetadata` models all content as ordered workflow steps, even when the content is durable design principles rather than a procedure.
- **Workaround:** Organized the foundation principles into thematic steps without adding task-specific sequencing.
- **Suggested fix:** Add a section-based guide format or a guide kind that distinguishes principles from workflows.

# Source: /home/kyza/Projects/ui-lab/app/packages/@ui/.documents/friction.md

## Select split value — 2026-08-11

- **Hit:** External Select.Value was implicitly supported, but lacked a documented visual contract and silently ignored icon when children was a render function.
- **Workaround:** Made external values an explicit split-label state with consistent padding and unconditional icon rendering.
- **Suggested fix:** Add the segmented Select pattern and its required Trigger accessible label to component docs.

## Menu.Trigger composition — 2026-08-12

- **Hit:** MenuTriggerProps documented asChild, but Menu.Trigger ignored it and implicitly cloned any element child.
- **Workaround:** Replaced the implicit behavior with the explicit as="button" | "span" | "child" contract.
- **Suggested fix:** Document each rendering mode, its default by menu type, and the single-child requirement.

## Modal body composition — 2026-08-12

- **Hit:** Unslotted Modal children are silently wrapped in Scroll, which creates an unexpected nested viewport for components that own scrolling.
- **Workaround:** Made Command's internal grid provide a definite list track independent of the outer auto-height Scroll.
- **Suggested fix:** Document the implicit body Scroll or provide a non-scrolling body slot.

# Source: /home/kyza/Tools/showcase-studio/.documents/friction.md


## Component API forwarding targets (Card, Flex) — 2026-10-27
- Hit: Card and Flex still need explicit per-component native/DOM forwarding-target documentation beyond the prop listings.
- Workaround: Assumed rest-prop passthrough.
- Suggested fix: State the forwarding target in their API documentation, as the control/layout contracts now do for Scroll, TextArea, and Input.

## Linked packages + Turbopack — 2026-10-27
- Hit: with ui-lab-components installed via pnpm link: outside the project, Next 16 Turbopack dev compiled no app entries and failed with ENOENT .next/dev/server/app/page/build-manifest.json, no compile error shown.
- Workaround: next.config.mjs sets turbopack.root and outputFileTracingRoot to the common ancestor of the project and linked packages.
- Suggested fix: ui-lab init could emit this config when it detects link:/file: UI Lab deps outside the project.

# Source: /home/kyza/Tools/vector-builder/.documents/friction.md


## ui-lab init (Next.js) — 2026-10-17
- Hit: Init added no @theme inline color mapping, so bg-background-*/text-foreground-* utilities were unavailable. It also refused to touch layout.tsx because html already had a className. These parts of the report still need confirmation against the current setup.
- Workaround: Added the @theme inline mapping from theme-switching-nextjs to globals.css and applied the layout snippet manually.
- Suggested fix: Ensure the generated setup provides the color mapping and safely merges an existing html className.

## Scroll prop descriptions — 2026-10-17
- Hit: Scroll API still lacks per-prop descriptions for hide and padding-y.
- Workaround: Read Scroll source/CSS for the remaining prop semantics.
- Suggested fix: Document the remaining props alongside the now-documented layout contract.

## Expand focus ring in a rounded container — 2026-10-17
- Hit: layout="contained" sets the trigger radius to 0, and the ring overlay copies that radius (useFocus radiusSource "surface"). Inside a rounded Card with overflow hidden, the square ring is cut off at the corners.
- Workaround: gave the trigger the Card's inner radius (radius-sm minus border width), square at the bottom while expanded.
- Suggested fix: let contained inherit the container's inner radius for its outer corners, or document how to pair Expand with Card.
- Follow-up: the ring is an inset shadow on the trigger's border box, so a trigger inside the Card's 1px border puts the ring 1px inside the edge. It needed negative margins, a transparent border with a padding-box background, and overflow-visible on the Card to land on the edge.

## beforeafter element accessibility — 2026-10-18
- Hit: element:extras/beforeafter uses a hidden native range input, shadow-lg, gradients and react-icons.
- Workaround: Rebuilt the divider as a role="slider" handle.
- Suggested fix: Give beforeafter an ARIA slider handle with token-only styling.

## Group.Button icon slot — 2026-10-18
- Hit: a non-SVG element in Group.Button's icon slot (a color swatch span) came out as a small circle, and the API doesn't document how the slot sizes or shapes its content.
- Workaround: skipped the icon slot and drew the swatch as an absolutely positioned full-height strip inside the button.
- Suggested fix: document how the icon slot styles its content, or add a leading slot for media and swatches.

# Source: /home/kyza/Archive/mock-studio.extension/firefox/.documents/friction.md

## UI Lab integration — 2026-08-15
- Hit: The documented global stylesheet setup did not work when the extension rendered inside a ShadowRoot; component CSS was emitted outside the shadow tree.
- Workaround: Explicitly inline and concatenate app CSS, the Onyx theme CSS, and the aggregate component CSS in Tailwind/app → theme → components order.
- Suggested fix: Publish/document a first-class ShadowRoot stylesheet consumption pattern.

## UI Lab portal components — 2026-08-15
- Hit: Menu, modal, and other portal content was hidden because the host-page isolation rule applied display:none to every body child except the extension host.
- Workaround: Hide only body children that existed before mounting the extension, allowing later portal nodes to remain interactive.
- Suggested fix: Support a configurable portal container or portal marker for isolated hosts.

## Menu.Trigger composition — 2026-08-15
- Hit: Menu.Trigger did not recognize Group.Button as an interactive child, causing nested Button markup, broken press events, and invalid floating-position references.
- Workaround: Use Menu.Trigger as="child" and link the consumer to the current local UI Lab package so the prop type is available.
- Suggested fix: Detect supported UI Lab trigger components generically and keep the as prop present in published declarations.

## Menu item identity — 2026-08-15
- Hit: JSX menu children fell back to identical string keys, causing multiple items to highlight together.
- Workaround: Supply unique textValue values for every JSX-based item.
- Suggested fix: Require or derive stable keys for non-text menu children.

## Menu positioning and recording action — 2026-08-15
- Hit: The recording menu renders excessively wide with items aligned at the far right, and pressing Record currently produces no visible action.
- Workaround: None yet; inspect the linked current UI Lab Menu floating layout and the Record Button press-to-screen-capture path together.
- Suggested fix: Add a compact menu width/alignment contract and a reliable press-event regression case for Group.Button and screen capture.

## Menu portal coordinate space — 2026-08-15
- Hit: UI Lab Menu portals to document.body but uses absolute floating coordinates; in the ShadowRoot-hosted extension this made the panel position depend on the page body's containing block and expand away from its trigger.
- Workaround: Keep the existing portal stylesheet injection and constrain the recording menu portal to fixed viewport positioning with intrinsic width.
- Suggested fix: Let portal consumers select the positioning strategy/container, and provide a content-sized menu width contract.

## Screen-capture error boundary — 2026-08-15
- Hit: The Record press path reached the recording hook, but MediaRecorder construction errors and browser permission failures were not consistently surfaced to the existing error UI.
- Workaround: Clear stale activation state at start and convert capture/recorder failures into recordingError messages.
- Suggested fix: Add a shared screen-capture error classification helper for consumers using getDisplayMedia.

## Linked-package React resolution — 2026-08-15
- Hit: A linked UI Lab workspace resolved its own React installation, so Vite bundled two React copies and UI Lab hooks saw a null dispatcher at runtime.
- Workaround: Dedupe React and ReactDOM and alias them to the consumer application's installations.
- Suggested fix: Document linked-workspace React deduplication for UI Lab consumers and provide a package-level integration check.

## ShadowRoot press activation — 2026-08-15
- Hit: The primary Group.Button rendered correctly but its React Aria synthesized press callback did not activate the recording action in the extension content-script ShadowRoot.
- Workaround: Use the existing Group.Button with a native pointer-up activation fallback and explicit Enter/Space handling.
- Suggested fix: Add a ShadowRoot/content-script press regression case to Group.Button and React Aria integration coverage.

## Group toggle activation — 2026-08-15
- Hit: Group.Button's controlled onChange/onPress path did not update the cursor selection in the sidebar.
- Workaround: Keep the controlled value for selection state and use each button's native onClick callback for state updates.
- Suggested fix: Add a controlled Group.Button toggle regression case covering onPress/onChange in ShadowRoot consumers.

## Group toggle pointer activation — 2026-08-15
- Hit: Group.Button's controlled Group onChange/onPress path did not update this sidebar selection.
- Workaround: Use Group.Button directly with per-button press/click handlers and active state.
- Suggested fix: Add a controlled toggle regression case for Group.Button in ShadowRoot consumers.

# Source: /home/kyza/Development/Testing/ui-lab-starter/.documents/friction.md

## UI Lab CLI initialization — 2026-08-20
- Hit: Running init in an empty project first prompted “Stylesheet to configure” with no guidance and exited when submitted blank.
- Workaround: Created app/globals.css and reran init.
- Hit: The default initialization flow displayed an indefinite spinner after the final prompt and produced no completion message within roughly 40 seconds.
- Suggested fix: Add a clear Next.js project prerequisite/error message and a timeout or progress/error output for dependency installation.

# Source: /home/kyza/Development/Hytale/Tools/hytale-prefabs/.documents/friction.md

# UI Lab Friction Log

## Flex / Grid — 2026-08-04
- **Hit:** No polymorphic `as` prop, so layout primitives always render a `div`. A semantic landmark (`<aside>`, `<nav>`, `<section>`) that also needs flex/grid cannot use `Flex`/`Grid`, which conflicts with the design-system rule that `<div className="flex">` must become `<Flex>`.
- **Workaround:** Kept a native `<aside className="flex flex-col ...">` for the sidebar root and used `Flex`/`Grid` only for non-landmark containers.
- **Suggested fix:** Add `as`/`asChild` to `Flex` and `Grid`, or document the landmark exception in the adherence rules.

## Theme tokens — 2026-08-04
- **Hit:** `text-foreground-500`/`-600` are used across this project but the generated theme only defines `foreground-50…400`, so those classes silently produce no color. The registry docs state the 50–400 range but nothing surfaces the mismatch at build time.
- **Workaround:** Clamped all foreground usage in the audited files to `text-foreground-400`.
- **Suggested fix:** Ship a lint rule or codemod that flags out-of-range token shades.

## Grid — 2026-08-05
- **Hit:** `Grid` gap semantics (`gap={3}` maps to Tailwind spacing) and `columns` numeric/template behavior are only documented in the generated `.d.ts`; no authored docs for layout composition.
- **Workaround:** Confirmed `Grid columns={2} gap={3}` against `Grid.d.ts`/`GridProps` before trusting numeric gap and columns.
- **Suggested fix:** Add a short Layout/Grid doc section describing numeric gap units and responsive column usage.

## Card — 2026-09-30
- Hit: Card api detail lists no props for Card.Header/Card.Body, and doesn't say what padding they have by default or how they lay out.
- Workaround: Kept header/body classes minimal and added p-0 on Card.Body so the scroll area stays full-bleed.
- Suggested fix: Document default padding and layout for each Card slot in the api detail.

