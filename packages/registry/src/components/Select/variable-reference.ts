import type { StyleReferenceGroup, StyleReferenceScope, StyleReferenceSection } from "../../types";

const scope = (selector: string, slot?: string, names?: string[], atRules: string[] = []): StyleReferenceScope => ({ selector, slot, names, atRules });
const group = (title: string, scopes: StyleReferenceScope[], description?: string): StyleReferenceGroup => ({ title, scopes, description });
const part = (title: string, selector: string): StyleReferenceGroup => group(title, [scope(selector), scope(selector, "trigger")]);
const border = (title: string, selector: string): StyleReferenceGroup => group(title, [scope(selector, "border")]);
const surface = ".content, .sub-content";
const items = ".item, .sub-trigger";
const hover = '.trigger:not([data-disabled]):hover .icon-section, .trigger:not([data-disabled]):hover .value-section:not(:empty)';
const hoverRules = ["@media (hover: hover)"];
const sharedSectionNames = ["--background", "--hover-duration", "--hover-leave-duration", "--hover-transition-timing-function", "--spacing", "--inset-gap", "--border-width-base", "--inset-radius"];
const overlay = '.content-root[data-position="overlay"]';

// These meanings are specific to Select, rather than universal primitive semantics.
const purposes: NonNullable<StyleReferenceGroup["purposes"]> = {
  "--size": { category: "Typography", description: "Font size for this part" },
  "--content-padding": { category: "Layout", description: "Content spacing unit used for separator insets" },
  "--content-radius": { category: "Appearance", description: "Dropdown radius shared with option rows" },
  "--select-overlay-font-family": { category: "Typography", description: "Overlay font family" },
  "--select-overlay-font-size": { category: "Typography", description: "Overlay font size" },
  "--select-overlay-font-weight": { category: "Typography", description: "Overlay font weight" },
  "--select-overlay-letter-spacing": { category: "Typography", description: "Overlay letter spacing" },
  "--select-overlay-line-height": { category: "Typography", description: "Overlay line height" },
};

export const variableReference: StyleReferenceSection[] = [
  {
    title: "Trigger",
    description: "Everything associated with the closed Select control, including its interaction states.",
    groups: [
      part("Base appearance", ".select"),
      border("Border slot", ".select"),
      group("Disabled", [scope(".select[data-disabled]")]),
      group("Pressed", [scope('.select[data-pressed="true"]:not([data-disabled])')]),
      group("Open", [scope('.select[data-open="true"]')]),
      group("Hover", [scope(hover, undefined, undefined, hoverRules), scope(hover, "trigger", undefined, hoverRules)]),
    ],
  },
  {
    title: "Trigger Sections",
    description: "The icon and selected-value regions inside the trigger.",
    groups: [
      group("Shared section appearance", [scope(".icon-section", undefined, sharedSectionNames), scope(".value-section", undefined, sharedSectionNames)], "Used by both the icon and value sections."),
      group("Value section", [scope(".value-section", undefined, ["--size", "--text-sm"]), scope(".value-section", "trigger")]),
      border("Value section border slot", ".value-section"),
      part("Value section only child", ".value-section:only-child"),
      group("Icon section", [scope(".icon-section", "trigger")]),
      border("Icon section border slot", ".icon-section"),
      part("Value icon", ".value-icon"),
    ],
  },
  {
    title: "Content",
    description: "The dropdown and submenu surfaces and their surrounding list spacing.",
    groups: [part("Surface", surface), border("Border slot", surface), part("List padding", ".list-padding"), border("List padding border slot", ".list-padding")],
  },
  {
    title: "Items",
    description: "Selectable options and nested submenu triggers.",
    groups: [
      part("Shared item styles", items),
      border("Border slot", items),
      // Matches the selector representation emitted by the CSS extractor.
      part("Disabled state", ".item, .sub-trigger[data-disabled]"),
      part("Item description", ".item-description"),
      part("Item icon", ".item-icon"),
      part("Item indicator", ".item-indicator"),
      part("Submenu chevron", ".sub-trigger-chevron"),
      part("Open submenu", '.sub-trigger[data-open="true"]:not([data-highlighted="true"])'),
    ],
  },
  {
    title: "Groups",
    description: "Option group headings and separators. Separator thickness is fixed in the stylesheet; only its inset and color consume variables.",
    groups: [part("Option group title", ".option-group-title"), part("Separator", ".separator"), border("Separator border slot", ".separator")],
  },
  {
    title: "Search",
    description: "Searchable triggers, search inputs, and mirrored-value layouts.",
    groups: [
      part("Search trigger", ".search-trigger"), border("Search trigger border slot", ".search-trigger"),
      part("Search value section", ".search-value-section"), border("Search value section border slot", ".search-value-section"),
      part("Search input", ".input"), part("Search icon section", ".search-icon-section"),
      part("Search wrapper", ".search-wrapper"), border("Search wrapper border slot", ".search-wrapper"),
      part("Button-trigger search", '.search-wrapper[data-trigger-type="button"] [data-select-content-search-input]'),
      part("Mirrored-value search", '.search-wrapper[data-mirror-value="true"]'),
      part("Top-placed search wrapper", '.content[data-placement="top"] .search-wrapper'),
      border("Top-placed wrapper border slot", '.content[data-placement="top"] .search-wrapper'),
    ],
  },
  {
    title: "Placeholder and Empty States",
    description: "Text shown when there is no selected value or no matching result.",
    groups: [part("Placeholder", ".placeholder"), part("Empty state", ".empty-state")],
  },
  {
    title: "Overlay Content",
    description: "Typography overrides for overlay-positioned content.",
    groups: [group("Overlay typography", [scope(`${overlay} .item-text`), scope(`${overlay} [data-select-content-search-input]`)], "Used by item text and the content search input.")],
  },
  {
    title: "Shared Interaction Tokens",
    description: "Timing tokens used across interactive areas. Their local declarations and consumption scopes are preserved below.",
    groups: [
      group("Hover transitions", [scope(".value-section", undefined, ["--hover-duration", "--hover-leave-duration", "--hover-transition-timing-function"]), scope(".icon-section", undefined, ["--hover-duration", "--hover-leave-duration", "--hover-transition-timing-function"]), scope(hover, undefined, ["--hover-duration", "--hover-enter-duration"], hoverRules)]),
      group("Content transitions", [scope(surface, undefined, ["--ease-snappy-pop"])]),
    ],
  },
].map((section) => ({ ...section, groups: section.groups.map((entry) => ({ ...entry, purposes: { ...purposes, ...entry.purposes } })) }));
