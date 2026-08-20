export type FontChoice = "work-sans" | "inter" | "manrope";

const FONT_FAMILIES: Record<FontChoice, string> = {
  "work-sans": "Work Sans Variable",
  inter: "Inter Variable",
  manrope: "Manrope Variable",
};

export function fontPackages(font: FontChoice): string[] {
  return [`@fontsource-variable/${font}`, "@fontsource-variable/jetbrains-mono"];
}

export function fontStylesheet(font: FontChoice): string {
  return `@import "@fontsource-variable/${font}";
@import "@fontsource-variable/jetbrains-mono";

:root {
  --font-body: "${FONT_FAMILIES[font]}", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "${FONT_FAMILIES[font]}", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
}
`;
}
