const TAILWIND_IMPORT = `import tailwindcss from "@tailwindcss/vite";`;

export const manualViteConfigSnippet = `${TAILWIND_IMPORT}\n\n// then add tailwindcss() to the plugins array, e.g.\nplugins: [react(), tailwindcss()],`;

function fallback(message: string): Error {
  return new Error(`${message} Apply this manually:\n${manualViteConfigSnippet}`);
}

/**
 * Add the Tailwind v4 Vite plugin to an existing vite.config.
 *
 * create-vite does not wire up Tailwind, so — unlike Next.js, where
 * create-next-app writes postcss.config for us — the plugin has to be injected
 * into the generated config. Idempotent: a config that already references
 * `@tailwindcss/vite` is returned untouched.
 */
export function integrateViteConfig(source: string): string {
  if (source.includes("@tailwindcss/vite")) return source;

  const lines = source.split("\n");
  let lastImport = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*import\b/.test(lines[index])) lastImport = index;
  }
  if (lastImport === -1) throw fallback("Cannot find an import statement in vite.config.");
  lines.splice(lastImport + 1, 0, TAILWIND_IMPORT);
  const withImport = lines.join("\n");

  const pluginsIndex = withImport.indexOf("plugins:");
  if (pluginsIndex === -1) throw fallback("Cannot find a plugins array in vite.config.");
  const bracketIndex = withImport.indexOf("[", pluginsIndex);
  if (bracketIndex === -1) throw fallback("Cannot find a plugins array in vite.config.");
  const afterBracket = bracketIndex + 1;
  const rest = withImport.slice(afterBracket).trimStart();
  const separator = rest.startsWith("]") ? "" : ", ";
  return `${withImport.slice(0, afterBracket)}tailwindcss()${separator}${withImport.slice(afterBracket)}`;
}
