export function isInteractivePreview(id: string) {
  // Interactive previews follow the explicit naming convention used by
  // controls such as Button. Folder-based examples may also use index.tsx,
  // but should still render their example headers.
  return id.endsWith("-interactive");
}
