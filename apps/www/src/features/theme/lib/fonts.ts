export type ProportionalFontId = "inter" | "geist" | "work-sans" | "karla" | "dm-sans" | "manrope";
export type MonoFontId = "jetbrains-mono" | "fira-code" | "roboto-mono" | "source-code-pro";

export type FontId = ProportionalFontId | MonoFontId;

export interface FontOption {
  id: FontId;
  name: string;
  family: string;
}

const ALL_FONT_OPTIONS: FontOption[] = [
  { id: "jetbrains-mono", name: "JetBrains Mono", family: "JetBrains Mono Variable" },
  { id: "fira-code", name: "Fira Code", family: "Fira Code Variable" },
  { id: "roboto-mono", name: "Roboto Mono", family: "Roboto Mono Variable" },
  { id: "source-code-pro", name: "Source Code Pro", family: "Source Code Pro Variable" },
  { id: "inter", name: "Inter", family: "Inter Variable" },
  { id: "geist", name: "Geist", family: "Geist Variable" },
  { id: "work-sans", name: "Work Sans", family: "Work Sans Variable" },
  { id: "karla", name: "Karla", family: "Karla Variable" },
  { id: "dm-sans", name: "DM Sans", family: "DM Sans Variable" },
  { id: "manrope", name: "Manrope", family: "Manrope Variable" },
];

// Header/body pickers (and the project-init custom font step) only offer
// proportional faces; JetBrains Mono is reserved for the Mono section.
const MONO_FONT_IDS = new Set<FontId>([
  "jetbrains-mono",
  "fira-code",
  "roboto-mono",
  "source-code-pro",
]);

export const FONTS: FontOption[] = ALL_FONT_OPTIONS.filter((font) => !MONO_FONT_IDS.has(font.id));

export const MONO_FONTS: FontOption[] = ALL_FONT_OPTIONS.filter((font) => MONO_FONT_IDS.has(font.id));

export const DEFAULT_FONT_ID: FontId = "work-sans";
export const DEFAULT_MONO_FONT_ID: FontId = "jetbrains-mono";

export interface FontFamilyConfig {
  headerFontId: FontId;
  bodyFontId: FontId;
  monoFontId: FontId;
}

export const DEFAULT_FONT_FAMILY_CONFIG: FontFamilyConfig = {
  headerFontId: DEFAULT_FONT_ID,
  bodyFontId: DEFAULT_FONT_ID,
  monoFontId: DEFAULT_MONO_FONT_ID,
};

export function getFont(id: FontId): FontOption {
  return ALL_FONT_OPTIONS.find((font) => font.id === id) ?? ALL_FONT_OPTIONS[0];
}

// Loaded via a plain <link> tag rather than a bundler CSS import: webpack
// attributes CSS reachable through *any* import() back to every page's
// entry (see scripts/prepare-preview-fonts.mjs), so these faces are self-
// hosted under public/fonts/preview and fetched only once a font is
// actually selected, never entering the module graph at all.
const loadedFonts = new Set<FontId>();

export function loadPreviewFont(id: FontId): void {
  if (loadedFonts.has(id)) return;
  loadedFonts.add(id);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `/fonts/preview/${id}/wght.css`;
  link.onerror = () => loadedFonts.delete(id);
  document.head.appendChild(link);
}
