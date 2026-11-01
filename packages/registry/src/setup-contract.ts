/** Shared by the CLI and setup guide; cascade order is part of the public contract. */
export function generateStylesheetImports({
  themeImport = "./theme.css",
  fontsImport,
  typography = true,
}: {
  themeImport?: string;
  fontsImport?: string;
  typography?: boolean;
} = {}): string[] {
  return [
    '@import "tailwindcss";',
    '@import "ui-lab-theme-onyx/styles.css";',
    ...(fontsImport ? [`@import "${fontsImport}";`] : []),
    `@import "${themeImport}";`,
    '@import "ui-lab-components/styles.css";',
    ...(typography ? ['@import "./typography.css";'] : []),
  ];
}
