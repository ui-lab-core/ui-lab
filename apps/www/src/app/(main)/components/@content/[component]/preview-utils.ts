export function isInteractivePreview(id: string, path?: string) {
  // Factory-backed previews are either explicitly named `interactive` or
  // generated from a folder-level `index.tsx` entry.
  return id.endsWith('-interactive') || path?.endsWith('/index.tsx') === true;
}
