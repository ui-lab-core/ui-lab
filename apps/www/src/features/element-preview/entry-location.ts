/** Shared by gallery anchors and links back to their original entry. */
export function patternAnchor(index: number) {
  return `pattern-preview-${index + 1}`;
}

export function variantAnchor(index: number) {
  return `variant-${index}`;
}

export function patternHref(patternId: string, index: number) {
  return `/workshop/patterns/${encodeURIComponent(patternId)}#${patternAnchor(index)}`;
}

export function variantHref(kind: "element" | "section", id: string, index: number) {
  return `/workshop/${kind === "element" ? "elements" : "sections"}/${id.split("/").map(encodeURIComponent).join("/")}#${variantAnchor(index)}`;
}
